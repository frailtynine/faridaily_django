import pytest


@pytest.mark.django_db
def test_verify_auth(client, auth_headers):
    url = '/api/auth/verify'
    response = client.get(url, **auth_headers)
    assert response.status_code == 200
