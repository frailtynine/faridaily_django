from ninja_jwt.authentication import JWTAuth
from ninja_extra import api_controller, route
from ninja_extra.permissions import IsAuthenticated
from django.contrib.auth import get_user_model

from users.schemas import UserReadSchema, UserCreateSchema
from api.schemas.messages import APIMessageSchema


User = get_user_model()


@api_controller('/auth', auth=JWTAuth())
class AuthController:

    @route.get('verify', response={200: str}, permissions=[IsAuthenticated])
    def verify(self, request):
        """Simple endpoint to prove authentification."""
        return 200, 'Validation successfull'

    @route.post(
        'create_user',
        response={400: APIMessageSchema, 201: UserReadSchema},
        auth=None
    )
    def create_user(self, request, payload: UserCreateSchema):
        payload_dict = payload.dict()
        password = payload_dict.pop('password')
        user, created = User.objects.get_or_create(**payload_dict)
        if created:
            user.set_password(password)
            user.save()
            return 201, user
        return 400, APIMessageSchema(message='User already exists')
