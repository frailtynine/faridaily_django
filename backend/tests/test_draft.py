from django.utils import timezone

import pytest
from django.test import Client

from api.schemas.drafts import DraftCreateSchema
from api.models import DraftDB
from api.tasks import publish_scheduled_posts


@pytest.mark.django_db
def test_crud_draft(client: Client, auth_headers):
    # Create
    payload = DraftCreateSchema(
        text='test text',
    )
    wrong_key_payload = {
        'content': 'text'
    }
    response = client.post(
        path='/api/drafts/create',
        data=payload.dict(exclude_unset=True),
        content_type='application/json',
        **auth_headers
    )
    object = DraftDB.objects.get(text=payload.text)
    assert object
    assert response.status_code == 200
    # Create with corrupt payload
    wrong_response = client.post(
        path='/api/drafts/create',
        data=wrong_key_payload,
        content_type='application/json',
        **auth_headers
    )
    assert wrong_response.status_code == 422
    # Update
    edit_payload = DraftCreateSchema(
        text='edit text'
    )
    edit_response = client.put(
        path=f'/api/drafts/{object.pk}',
        data=edit_payload.dict(exclude_unset=True),
        content_type='application/json',
        **auth_headers
    )
    edited_object = DraftDB.objects.get(text=edit_payload.text)
    assert edit_response.status_code == 200
    assert edited_object.edits.count() == 1
    # Get
    get_response = client.get(
        path=f'/api/drafts/{object.pk}',
        **auth_headers
    )
    assert get_response.status_code == 200
    wrong_id_respose = client.get(
        path=f'/api/drafts/{object.pk + 4}',
        **auth_headers
    )
    assert wrong_id_respose.status_code == 404
    # Delete
    delete_response = client.delete(
        path=f'/api/drafts/{object.pk}',
        **auth_headers
    )
    assert delete_response.status_code == 200
    wrong_headers = {
        'HTTP_AUTHORIZATION': 'Bearer 12312iuhahjdjasdajsd',
    }
    delete_no_auth_response = client.delete(
        path=f'/api/drafts/{object.pk}',
        **wrong_headers
    )
    assert delete_no_auth_response.status_code == 401


@pytest.mark.django_db
def test_publish_scheduled_post():

    db_object = DraftDB.objects.create(
        text='test text',
        pub_date=timezone.now()
    )
    publish_scheduled_posts(test=True)
    db_object.refresh_from_db()
    published_post = DraftDB.objects.filter(is_published=True).first()
    assert published_post == db_object
