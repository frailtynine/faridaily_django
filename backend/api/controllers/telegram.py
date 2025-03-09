from http import HTTPStatus
from datetime import datetime, timedelta
import asyncio

from ninja_extra import api_controller, route
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict
from asgiref.sync import async_to_sync
from ninja_extra.permissions import IsAuthenticated
from ninja_jwt.authentication import JWTAuth

from api.schemas.messages import APIMessageSchema
from api.schemas.telegram import (
    ChannelResponse,
    ChannelFullResponse,
    MessageResponse,
    TgTemplateCreate,
    TgTemplateRead,
    MessageUpdate,
)
from api.telegram.bot import (
    send_message,
    get_data,
    edit_message,
    delete_message
)
from api.telegram.utils import combine_graphs
from api.utils import (
    preprocess_text,
    sort_message_graph,
    MESSAGE_QUERY_LITERAL
)
from api.models import (
    ChannelDB,
    MessageDB,
    MessageHistory,
    TelegramTemplateDB
)


MESSAGES_LIMIT = 30


def fetch_telegram_data(
    channel_name: str,
    messages_limit: int = None
) -> ChannelDB:
    """
    Fetches telegram channel data and saves it to database.

    Returns ChannelDB object.
    """
    channel_response, messages = asyncio.run(
        get_data(channel_name, messages_limit)
    )
    channel_db, created = ChannelDB.objects.get_or_create(
        channel_name=settings.CHANNEL_NAME,
        defaults=channel_response.dict()
    )
    if not created:
        channel_db.growth_graph = combine_graphs(
            channel_response.growth_graph,
            channel_db.growth_graph
        )
        channel_db.followers = channel_response.followers
        channel_db.last_refresh = channel_response.last_refresh
        channel_db.save()
    for message in messages:
        if not message.text or not message.views:
            continue
        message_object = MessageResponse.from_telegram_message(message)
        message_db, created = MessageDB.objects.get_or_create(
            tg_id=message_object.tg_id,
            defaults=message_object.dict()
        )
        if not created and message_object.text != message_db.text:
            MessageHistory.objects.create(
                text=message_object.text,
                edit_date=message_object.last_edit,
                message=message_db
            )
        for attr, value in message_object.dict().items():
            if attr != 'id':
                setattr(message_db, attr, value)
        message_db.save()
    # Compares tg channel ids with database ids and marks deleted messages.
    if not messages_limit:
        all_messages = MessageDB.objects.all()
        channel_messages_ids = [message.id for message in messages]
        for message in all_messages:
            if message.tg_id not in channel_messages_ids:
                message.is_deleted = True
                message.save()
    return channel_db


@api_controller('/tg', auth=JWTAuth(), permissions=[IsAuthenticated])
class TelegramController:

    @route.post('/send', response={HTTPStatus.OK: APIMessageSchema})
    def send_message(
        self,
        request,
        payload: MessageUpdate,
        test: bool = False
    ):
        """
        Send a message via Telegram.

        Query param test used for sending to test channel.
        """
        try:
            async_to_sync(send_message)(payload.text, payload.images, test)
            return HTTPStatus.OK, APIMessageSchema(message='ok')
        except Exception as e:
            raise e

    @route.get('/refresh_data', response={HTTPStatus.OK: ChannelResponse})
    def refresh_data(self, request):
        """
        Refresh data from a Telegram channel for the last 30 messages.
        """
        channel_db = fetch_telegram_data(settings.CHANNEL_NAME, MESSAGES_LIMIT)
        return HTTPStatus.OK, channel_db

    @route.get('/get_channel_data', response=ChannelFullResponse)
    def get_channel_data(self, request, format: MESSAGE_QUERY_LITERAL = 'm'):
        """
        Get Telegram channel data from DB.

        Query args:
            format: 'm', 'y' or 'd' for month, year or day sorting.
            Currently not implemented on the front end.

        Returns both Channel data from DB and sorted views graph for messages.
        """
        channel_db = get_object_or_404(
            ChannelDB,
            channel_name=settings.CHANNEL_NAME
        )
        channel_dict = model_to_dict(channel_db)
        messages = MessageDB.objects.filter(
            pub_date__gte=datetime.now() - timedelta(days=180)
        ).filter(
            is_deleted=False
        ).order_by('pub_date')
        message_graph = sort_message_graph(messages, format)
        return ChannelFullResponse(**channel_dict, views_graph=message_graph)

    @route.post('/template/create', response=TgTemplateRead)
    def create_template(self, request, payload: TgTemplateCreate):
        """
        Create template.
        """
        template = TelegramTemplateDB.objects.create(**payload.dict())
        return template

    @route.put('/template/{id}', response=TgTemplateRead)
    def update_template(self, request, id: int, payload: TgTemplateCreate):
        """
        Update template.
        """
        template = get_object_or_404(TelegramTemplateDB, pk=id)
        for attr, value in payload.dict().items():
            setattr(template, attr, value)
        template.save()
        return template

    @route.delete('/template/{id}')
    def delete_template(self, request, id: int):
        """
        Delete template.
        """
        template = get_object_or_404(TelegramTemplateDB, pk=id)
        template.delete()
        return

    @route.get('/template', response=list[TgTemplateRead])
    def get_templates(self, request):
        """
        Get all templates.
        """
        return TelegramTemplateDB.objects.all()

    @route.get('/templates/{id}', response=TgTemplateRead)
    def get_template(self, request, id: int):
        """
        Get a template.
        """
        return get_object_or_404(TelegramTemplateDB, pk=id)

    @route.get(
        '/messages',
        response=list[MessageResponse]
    )
    def get_messages(
        self,
        request,
    ):
        """
        Get all messages from DB.
        """
        messages = MessageDB.objects.filter(
            is_deleted=False
        ).prefetch_related('edits')
        return messages

    @route.put('/messages/{tg_id}', response=MessageResponse)
    def update_message(self, request, tg_id: int, payload: MessageUpdate):
        """
        Update a message.
        """
        updated_message = async_to_sync(
            edit_message
        )(tg_id, payload)
        message_response = MessageResponse.from_telegram_message(
            updated_message
        )
        return message_response

    @route.get('/messages/{tg_id}', response=MessageResponse)
    def get_message(self, request, tg_id: int):
        """
        Get a message.

        Message text is preprocessed for the frontend editor.
        """
        message = get_object_or_404(MessageDB, tg_id=tg_id)
        message.text = preprocess_text(message.text)
        print(message.text)
        return message

    @route.delete('/messages/{tg_id}')
    def delete_message(self, request, tg_id: int):
        """
        Delete a message.

        Not used as for now. Might be used in future.
        """
        message_db = get_object_or_404(MessageDB, tg_id=tg_id)
        async_to_sync(delete_message)(tg_id, message_db.text)
