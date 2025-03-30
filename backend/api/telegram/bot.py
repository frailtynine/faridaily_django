from typing import Tuple
from http import HTTPStatus
import logging
import json
import os

import environ
from telethon import TelegramClient
from telethon.tl.types.stats import BroadcastStats
from telethon.tl.types import (
    DataJSON,
    Message,
)
from telethon.tl.types.auth import SentCode
from telethon.errors import SessionPasswordNeededError
from telethon.helpers import TotalList
from django.conf import settings
from ninja.errors import HttpError


from api.schemas.telegram import ChannelResponse, MessageUpdate
from api.telegram.html_parser import CustomHtmlParser
from api.telegram.utils import prepare_html_for_tg
from api.utils import get_local_image_paths


logger = logging.getLogger(__name__)


env = environ.Env()

SESSION_DIR = os.path.join(settings.BASE_DIR, 'session')
os.makedirs(SESSION_DIR, exist_ok=True)

TG_CHANNEL_TOKEN = env.int('TG_CHANNEL_TOKEN')
TG_TEST_CHANNEL_TOKEN = env.int('TG_TEST_CHANNEL_TOKEN')
TG_API_ID = env.int('TG_API_ID')
TG_API_HASH = env.str('TG_API_HASH')
CHANNEL_NAME = env.str('CHANNEL_NAME')


def create_client() -> TelegramClient:
    session_file = os.path.join(
        SESSION_DIR,
        f'{CHANNEL_NAME}.session'
    )
    client = TelegramClient(
            session_file,
            TG_API_ID,
            TG_API_HASH
        )
    return client


async def get_data(
    channel_name: str,
    messages_limit: int | None = None
) -> Tuple[ChannelResponse, TotalList]:
    """
    Fetches and returns growth statistics data from a Telegram channel.

    Args: channel name to retrieve channel and add name to DB.

    Returns:
        A tuple containing a ChannelResponse object,
        and TotalList object with messages data.
    """
    client = create_client()
    try:
        await client.connect()
        # Check authorization
        if not await client.is_user_authorized():
            logger.error("Client not authorized")
            raise HttpError(
                status_code=HTTPStatus.UNAUTHORIZED,
                message="Telegram client not authorized"
            )
        # Get channel
        try:
            channel = await client.get_entity(channel_name)
        except Exception as e:
            logger.error(f"Failed to get channel: {e}")
            raise HttpError(
                status_code=HTTPStatus.NOT_FOUND,
                message=f"Channel not found: {str(e)}"
            )

        try:
            data: BroadcastStats = await client.get_stats(channel)
            growth_stats: DataJSON = data.growth_graph.json
            json_dict = json.loads(growth_stats.data)
        except Exception as e:
            logger.error(f"Failed to get channel stats: {e}")
            raise HttpError(
                status_code=HTTPStatus.BAD_REQUEST,
                message=f"Failed to get channel stats: {str(e)}"
            )

        growth_graph = {
            "x_axis": json_dict["columns"][0][1:],
            "y_axis": json_dict["columns"][1][1:]
        }

        client.parse_mode = CustomHtmlParser()
        messages_data: TotalList = await client.get_messages(
            channel,
            limit=messages_limit,
        )

        return ChannelResponse(
            channel_name=channel_name,
            followers=int(data.followers.current),
            growth_graph=growth_graph,
            last_refresh=data.period.max_date
        ), messages_data

    except HttpError:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        raise HttpError(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            message=f"Failed to fetch channel data: {str(e)}"
        )
    finally:
        if client and client.is_connected():
            await client.disconnect()


async def send_message(
    message: str,
    media: list[str] = None,
    test: bool = False
) -> Message:
    """
    Sends a message to a Telegram channel with optional media files.

    Args:
        message (str): The message text to send.
        images (list[str], optional): A list of image file paths 
        to attach to the message. Defaults to None.
        test (bool, optional): If True, sends the message 
        to the test channel. Defaults to False.

    Returns:
        Message: The sent message object.
    """
    # TODO: Add upload mechanics for larger files.

    entity = int(
        TG_TEST_CHANNEL_TOKEN
        if test
        else settings.TG_CHANNEL_TOKEN
    )
    client = create_client()
    await client.start()
    local_image_paths = get_local_image_paths(media)
    if local_image_paths:
        sent_message = await client.send_file(
            entity=entity,
            caption=prepare_html_for_tg(message),
            parse_mode=CustomHtmlParser(),
            file=local_image_paths,
        )
    else:
        sent_message = await client.send_message(
            entity=entity,
            message=prepare_html_for_tg(message),
            parse_mode=CustomHtmlParser(),
        )
    return sent_message


async def edit_message(message_id: int, payload: MessageUpdate) -> Message:
    client = create_client()
    await client.start()
    updated_message = await client.edit_message(
        entity=int(settings.TG_CHANNEL_TOKEN),
        message=message_id,
        text=prepare_html_for_tg(payload.text),
        parse_mode=CustomHtmlParser(),
        # file=payload.images
    )
    client.disconnect()
    return updated_message


async def delete_message(message_id: int, message_text):
    client = create_client()
    await client.start()
    message_tg: Message = await client.get_messages(
        entity=int(settings.TG_CHANNEL_TOKEN),
        ids=message_id
    )
    if message_tg and message_tg.text and message_tg.text == message_text:
        await client.delete_messages(
            entity=int(settings.TG_TEST_CHANNEL_TOKEN),
            message_ids=message_id
        )
    else:
        raise HttpError(
            status_code=HTTPStatus.BAD_REQUEST,
            message='No message found.'
        )


async def send_code(phone: str) -> dict:
    try:
        client = create_client()
        await client.connect()
        is_authorized = await client.is_user_authorized()
        if is_authorized:
            await client.disconnect()
            return {'message': 'user is authorized'}
        code_request: SentCode = await client.send_code_request(phone)
        await client.disconnect()
        return {
            'message': 'code sent',
            'phone_hash': code_request.phone_code_hash
        }
    except Exception as e:
        if client and client.is_connected():
            await client.disconnect()
        return {'error': str(e)}


async def verify_session(
    code: str,
    password: str,
    phone: str,
    phone_hash: str
) -> dict:
    client = create_client()
    await client.connect()
    try:
        await client.sign_in(
            code=code,
            phone=phone,
            phone_code_hash=phone_hash
        )
    except SessionPasswordNeededError:
        await client.sign_in(password=password)
    await client.disconnect()
    return {'message': 'verified'}


async def check_verification() -> bool:
    client = create_client()
    await client.connect()
    is_authorized = await client.is_user_authorized()
    await client.disconnect()
    return is_authorized
