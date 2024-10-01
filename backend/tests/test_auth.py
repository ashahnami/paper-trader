import pytest
from flask import session
from flask_login import current_user

from app.models.user import User


def test_register(client, app):
    response = client.post('/auth/register', json={'username': 'test', 'email': 'test@gmail.com', 'password': 'test'})

    with app.app_context():
        assert User.query.filter_by(username='test').count() == 1


@pytest.mark.parametrize(('username', 'email', 'password', 'message'), (
        ('', 'a', 'a', b'Username is required.'),
        ('a', '', 'a', b'Email is required'),
        ('a', 'a', '', b'Password is required.'),
        ('test', 'test@gmail.com', 'test', b'User already exists'),
))
def test_register_validate_input(client, username, email, password, message):
    response = client.post(
        '/auth/register',
        json={'username': username, 'email': email, 'password': password}
    )
    assert message in response.data


def test_login(client, app):
    response = client.post('/auth/login', json={'username': 'test', 'password': 'test'})

    with client:
        client.get('/')
        assert current_user.username == 'test'


def test_logout(client, app):
    client.post('/auth/login', json={'username': 'test', 'password': 'test'})

    with client:
        client.post('/auth/logout')
        assert current_user.is_authenticated is False
