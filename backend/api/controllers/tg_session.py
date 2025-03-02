import os

from ninja_extra import api_controller, route
from ninja import Schema
from ninja_extra.permissions import IsAuthenticated
from ninja_jwt.authentication import JWTAuth
from asgiref.sync import async_to_sync

from api.telegram.bot import (
    send_code,
    verify_session,
    check_verification
)


ROOT_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    )
)


class PhoneRequest(Schema):
    phone: str


class CodeRequest(Schema):
    phone: str
    code: str


class PasswordRequest(Schema):
    code: str
    password: str
    phone: str
    phone_hash: str


@api_controller('/telethon', auth=JWTAuth(), permissions=[IsAuthenticated,])
class TelethonController:
    @route.post('/send-code')
    def send_credentials(self, request, payload: PhoneRequest):
        result = async_to_sync(send_code)(payload.phone)
        return result

    @route.post('/verify')
    def verify(self, request, payload: PasswordRequest):
        result = async_to_sync(verify_session)(
            payload.code,
            payload.password,
            payload.phone,
            payload.phone_hash

        )
        return result

    @route.get('/check-verified')
    def check_verified(self, request):
        result = async_to_sync(check_verification)()
        return {'is_verified': result}
