import pytest
from django.test import Client

from api.schemas.telegram import TgTemplateCreate


@pytest.mark.django_db
def test_crud_telegram(client: Client, auth_headers, channel):
    # Channel Response
    channel_response = client.get(
        path='/api/tg/get_channel_data',
        **auth_headers
    )
    assert channel_response.status_code == 200
    template_payload = TgTemplateCreate(
        title='title',
        position='footer',
        text='text'
    )
    template_response = client.post(
        path='/api/tg/template/create',
        data=template_payload.dict(),
        content_type='application/json',
        **auth_headers
    )
    assert template_response.status_code == 200
    # messages_response = client.get(
    #     path='/api/tg/messages',
    #     **auth_headers
    # )
    # messages_db = MessageDB.objects.all()
    # assert messages_response.status_code == 200
    # assert len(json.loads(messages_response.content)) == messages_db.count()
