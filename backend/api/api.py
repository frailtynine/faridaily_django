from ninja_extra import NinjaExtraAPI
from ninja_jwt.controller import NinjaJWTDefaultController
from django.conf import settings

from api.controllers.auth import AuthController
from api.controllers.telegram import TelegramController
from api.controllers.drafts import DraftController
from api.controllers.tg_session import TelethonController

api = NinjaExtraAPI(
    docs_url=None if not settings.DEBUG else '/docs/'
)

api.register_controllers(
    NinjaJWTDefaultController,
    AuthController,
    TelegramController,
    DraftController,
    TelethonController
)
