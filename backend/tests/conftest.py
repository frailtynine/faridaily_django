import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone

from api.models import ChannelDB


@pytest.fixture
def superuser(db):
    User = get_user_model()
    return User.objects.create_superuser(
        username='admin',
        password='admin',
        email='admin@admin.com',
        is_active=True
    )


@pytest.fixture
def channel(db):
    channel_db = ChannelDB.objects.create(
        channel_name='albumsweekly',
        followers=100,
        growth_graph={
            'x_axis': [1609459200, 1609545600, 1609632000],
            'y_axis': [10, 20, 30]
        },
        last_refresh=timezone.now()
    )
    return channel_db


@pytest.fixture
def auth_headers(client, superuser):
    token_response = client.post(
        '/api/token/pair',
        data={
            'password': 'admin',
            'username': 'admin',
        },
        content_type='application/json',
        HTTP_ACCEPT='application/json'
    )
    return {
        'HTTP_AUTHORIZATION': f'Bearer {token_response.json()["access"]}',
    }
