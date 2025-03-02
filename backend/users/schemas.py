from pydantic import Field

from django.contrib.auth import get_user_model
from ninja import ModelSchema

User = get_user_model()


class UserReadSchema(ModelSchema):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
        ]


class UserCreateSchema(ModelSchema):
    username: str = Field(..., json_schema_extra={'examples': ['username']}, min_length=8)
    password: str = Field(..., json_schema_extra={'examples': ['password']}, min_length=8)
    email: str = Field(
        ...,
        json_schema_extra={'examples': ['user@example.com']}
    )

    class Meta:
        model = User
        fields = ['username', 'password', 'email']
