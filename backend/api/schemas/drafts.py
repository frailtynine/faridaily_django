from typing import Optional
from datetime import datetime

from ninja import Schema

from users.schemas import UserReadSchema


class DraftCreateSchema(Schema):
    pub_date: Optional[datetime] = None
    text: str
    media_url: list[str]


class DraftUpdateSchema(DraftCreateSchema):
    is_published: Optional[bool] = False


class DraftDBSchema(Schema):
    id: int
    pub_date: datetime | None = None
    text: str
    is_published: bool
    user: UserReadSchema | None = None
    edits: list['DraftHistorySchema']
    media_url: list[str] | None = None

    class Config:
        orm_mode = True


class DraftHistorySchema(Schema):
    id: int
    draft_id: int
    text: str
    edit_date: datetime
    user: UserReadSchema | None = None

    class Config:
        orm_mode = True
