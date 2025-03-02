from datetime import datetime
from typing import Literal

from ninja import Schema
from telethon.types import Message

from api.telegram.utils import get_reactions_count


class ChannelResponse(Schema):
    channel_name: str
    followers: int = 0
    growth_graph: dict
    last_refresh: datetime


class ChannelFullResponse(ChannelResponse):
    views_graph: dict


class MessageResponse(Schema):
    tg_id: int
    pub_date: datetime
    views: int
    forwards: int
    reactions: int
    replies: int
    post_author: str | None
    text: str
    last_edit: datetime

    @classmethod
    def from_telegram_message(cls, message: Message):
        return cls(
            tg_id=message.id,
            pub_date=message.date,
            views=message.views,
            forwards=message.forwards if message.forwards else 0,
            reactions=get_reactions_count(message.reactions.results)
            if message.reactions else 0,
            replies=message.replies.replies if message.replies else 0,
            post_author=message.post_author if message.post_author else None,
            text=message.text,
            last_edit=message.edit_date if message.edit_date else message.date
        )


class MessageUpdate(Schema):
    text: str


class MessageHistoryResponse(Schema):
    text: str
    edit_date: datetime
    message: MessageResponse


class TgTemplateCreate(Schema):
    title: str
    position: Literal['footer', 'header', 'middle']
    text: str


class TgTemplateRead(TgTemplateCreate):
    id: int
