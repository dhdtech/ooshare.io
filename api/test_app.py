import uuid
from unittest.mock import patch, MagicMock

import pytest

from app import app, generate_alias, ALIAS_LENGTH


@pytest.fixture(autouse=True)
def mock_posthog():
    """Mock PostHog so tests don't send real events."""
    mock = MagicMock()
    with patch("app.posthog", mock):
        yield mock


@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c


@pytest.fixture(autouse=True)
def mock_redis():
    """Mock Redis so tests don't need a running instance."""
    store = {}

    def mock_setex(key, ttl, value):
        store[key] = value

    def mock_set(key, value, ex=None, nx=False):
        if nx and key in store:
            return False
        store[key] = value
        return True

    def mock_get(key):
        return store.get(key)

    def mock_getdel(key):
        return store.pop(key, None)

    def mock_exists(key):
        return key in store

    def mock_delete(key):
        store.pop(key, None)

    mock = MagicMock()
    mock.setex = MagicMock(side_effect=mock_setex)
    mock.set = MagicMock(side_effect=mock_set)
    mock.get = MagicMock(side_effect=mock_get)
    mock.getdel = MagicMock(side_effect=mock_getdel)
    mock.exists = MagicMock(side_effect=mock_exists)
    mock.delete = MagicMock(side_effect=mock_delete)

    with patch("app.r", mock):
        yield mock, store


# --------------- generate_alias ---------------


def test_generate_alias_length():
    alias = generate_alias()
    assert len(alias) == ALIAS_LENGTH


def test_generate_alias_is_alphanumeric():
    alias = generate_alias()
    assert alias.isalnum()


# --------------- GET /api/health ---------------


def test_health(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.get_json() == {"status": "ok"}


# --------------- POST /api/secrets ---------------


def test_create_secret_success(client):
    res = client.post("/api/secrets", json={
        "ciphertext": "dGVzdA==",
        "ttl_hours": 1,
    })
    assert res.status_code == 201
    data = res.get_json()
    assert "id" in data
    assert "alias" in data
    uuid.UUID(data["id"])  # valid UUID
    assert len(data["alias"]) == ALIAS_LENGTH


def test_create_secret_with_client_id(client):
    secret_id = str(uuid.uuid4())
    res = client.post("/api/secrets", json={
        "ciphertext": "dGVzdA==",
        "ttl_hours": 1,
        "id": secret_id,
    })
    assert res.status_code == 201
    assert res.get_json()["id"] == secret_id


def test_create_secret_default_ttl(client):
    res = client.post("/api/secrets", json={"ciphertext": "dGVzdA=="})
    assert res.status_code == 201


def test_create_secret_no_body(client):
    res = client.post("/api/secrets", content_type="application/json")
    assert res.status_code == 400
    assert "Request body required" in res.get_json()["error"]


def test_create_secret_missing_ciphertext(client):
    res = client.post("/api/secrets", json={"ttl_hours": 1})
    assert res.status_code == 400
    assert "ciphertext is required" in res.get_json()["error"]


def test_create_secret_non_string_ciphertext(client):
    res = client.post("/api/secrets", json={"ciphertext": 12345})
    assert res.status_code == 400
    assert "ciphertext is required" in res.get_json()["error"]


def test_create_secret_too_large(client):
    big = "A" * (40 * 1024 * 1024 + 1)
    res = client.post("/api/secrets", json={"ciphertext": big})
    assert res.status_code == 413
    assert "too large" in res.get_json()["error"].lower()


def test_accepts_large_payload(client):
    import base64
    large_data = base64.b64encode(b"x" * (1024 * 1024)).decode()
    res = client.post("/api/secrets", json={
        "ciphertext": large_data,
        "ttl_hours": 1,
        "id": str(uuid.uuid4()),
    })
    assert res.status_code == 201


def test_create_secret_invalid_base64(client):
    res = client.post("/api/secrets", json={"ciphertext": "not!valid!b64@@@"})
    assert res.status_code == 400
    assert "valid base64" in res.get_json()["error"]


def test_create_secret_invalid_ttl_type(client):
    res = client.post("/api/secrets", json={
        "ciphertext": "dGVzdA==",
        "ttl_hours": "not_a_number",
    })
    assert res.status_code == 400
    assert "ttl_hours must be an integer" in res.get_json()["error"]


def test_create_secret_ttl_clamped_min(client, mock_redis):
    mock, store = mock_redis
    res = client.post("/api/secrets", json={
        "ciphertext": "dGVzdA==",
        "ttl_hours": 0,
    })
    assert res.status_code == 201
    # TTL should be clamped to 1 hour = 3600 seconds
    mock.setex.assert_called_once()
    assert mock.setex.call_args[0][1] == 3600


def test_create_secret_ttl_clamped_max(client, mock_redis):
    mock, store = mock_redis
    res = client.post("/api/secrets", json={
        "ciphertext": "dGVzdA==",
        "ttl_hours": 999,
    })
    assert res.status_code == 201
    # TTL should be clamped to 72 hours = 259200 seconds
    mock.setex.assert_called_once()
    assert mock.setex.call_args[0][1] == 259200


def test_create_secret_invalid_client_id(client):
    res = client.post("/api/secrets", json={
        "ciphertext": "dGVzdA==",
        "id": "not-a-uuid",
    })
    assert res.status_code == 400
    assert "valid UUID" in res.get_json()["error"]


def test_create_secret_duplicate_id(client):
    secret_id = str(uuid.uuid4())
    # First create succeeds
    res1 = client.post("/api/secrets", json={
        "ciphertext": "dGVzdA==",
        "id": secret_id,
    })
    assert res1.status_code == 201
    # Second create with same ID fails
    res2 = client.post("/api/secrets", json={
        "ciphertext": "dGVzdA==",
        "id": secret_id,
    })
    assert res2.status_code == 409
    assert "already exists" in res2.get_json()["error"]


def test_create_secret_alias_collision_retry(client, mock_redis):
    mock, store = mock_redis
    # Pre-fill an alias to force one collision
    store["alias:AAAAAAAA"] = "some-uuid"

    with patch("app.generate_alias") as mock_gen:
        # First call collides, second succeeds
        mock_gen.side_effect = ["AAAAAAAA", "BBBBBBBB"]
        res = client.post("/api/secrets", json={"ciphertext": "dGVzdA=="})
        assert res.status_code == 201
        assert res.get_json()["alias"] == "BBBBBBBB"


def test_create_secret_alias_all_collisions(client, mock_redis):
    mock, store = mock_redis

    with patch("app.generate_alias", return_value="AAAAAAAA"):
        store["alias:AAAAAAAA"] = "some-uuid"
        res = client.post("/api/secrets", json={"ciphertext": "dGVzdA=="})
        assert res.status_code == 201
        # All 5 attempts collided, alias should be None
        assert res.get_json()["alias"] is None


# --------------- GET /api/secrets/:id ---------------


def test_get_secret_by_uuid(client):
    # Create a secret
    res = client.post("/api/secrets", json={"ciphertext": "dGVzdA=="})
    secret_id = res.get_json()["id"]

    # Retrieve by UUID
    res = client.get(f"/api/secrets/{secret_id}")
    assert res.status_code == 200
    data = res.get_json()
    assert data["ciphertext"] == "dGVzdA=="
    assert data["id"] == secret_id


def test_get_secret_by_alias(client):
    res = client.post("/api/secrets", json={"ciphertext": "c2VjcmV0"})
    data = res.get_json()
    alias = data["alias"]

    res = client.get(f"/api/secrets/{alias}")
    assert res.status_code == 200
    result = res.get_json()
    assert result["ciphertext"] == "c2VjcmV0"
    assert result["id"] == data["id"]


def test_get_secret_one_time_only(client):
    res = client.post("/api/secrets", json={"ciphertext": "dGVzdA=="})
    secret_id = res.get_json()["id"]

    # First retrieval succeeds
    res = client.get(f"/api/secrets/{secret_id}")
    assert res.status_code == 200

    # Second retrieval fails
    res = client.get(f"/api/secrets/{secret_id}")
    assert res.status_code == 404


def test_get_secret_alias_cleaned_up(client, mock_redis):
    mock, store = mock_redis
    res = client.post("/api/secrets", json={"ciphertext": "dGVzdA=="})
    alias = res.get_json()["alias"]

    # Retrieve via alias
    client.get(f"/api/secrets/{alias}")

    # Alias key should be deleted
    assert f"alias:{alias}" not in store


def test_get_secret_nonexistent_uuid(client):
    fake_id = str(uuid.uuid4())
    res = client.get(f"/api/secrets/{fake_id}")
    assert res.status_code == 404
    assert "not found" in res.get_json()["error"].lower()


def test_get_secret_nonexistent_alias(client):
    res = client.get("/api/secrets/xYzAbCdE")
    assert res.status_code == 404
    assert "not found" in res.get_json()["error"].lower()


def test_get_secret_invalid_format(client):
    res = client.get("/api/secrets/short")
    assert res.status_code == 400
    assert "Invalid" in res.get_json()["error"]


def test_get_secret_invalid_special_chars(client):
    res = client.get("/api/secrets/ab!@#$%^")
    assert res.status_code == 400


def test_get_secret_alias_points_to_expired_secret(client, mock_redis):
    mock, store = mock_redis
    # Simulate: alias exists but secret was already deleted (expired)
    store["alias:AbCdEfGh"] = str(uuid.uuid4())
    # Secret key is NOT in store (expired/consumed)

    res = client.get("/api/secrets/AbCdEfGh")
    assert res.status_code == 404


# --------------- PostHog events ---------------


def test_posthog_secret_created(client, mock_posthog):
    client.post("/api/secrets", json={"ciphertext": "dGVzdA==", "ttl_hours": 4})
    mock_posthog.capture.assert_called_with(
        "server", "secret_created", {"ttl_hours": 4, "has_alias": True}
    )


def test_posthog_secret_retrieved(client, mock_posthog):
    res = client.post("/api/secrets", json={"ciphertext": "dGVzdA=="})
    alias = res.get_json()["alias"]
    mock_posthog.reset_mock()

    client.get(f"/api/secrets/{alias}")
    mock_posthog.capture.assert_called_with(
        "server", "secret_retrieved", {"via": "alias"}
    )


def test_posthog_secret_retrieved_by_uuid(client, mock_posthog):
    res = client.post("/api/secrets", json={"ciphertext": "dGVzdA=="})
    secret_id = res.get_json()["id"]
    mock_posthog.reset_mock()

    client.get(f"/api/secrets/{secret_id}")
    mock_posthog.capture.assert_called_with(
        "server", "secret_retrieved", {"via": "uuid"}
    )


def test_posthog_disabled(client, mock_redis):
    """When posthog is None, no errors occur."""
    with patch("app.posthog", None):
        res = client.post("/api/secrets", json={"ciphertext": "dGVzdA=="})
        assert res.status_code == 201
        secret_id = res.get_json()["id"]
        res = client.get(f"/api/secrets/{secret_id}")
        assert res.status_code == 200


# --------------- main guard ---------------


def test_main(client):
    """Cover the main() function."""
    with patch("app.app.run") as mock_run:
        from app import main
        main()
        mock_run.assert_called_once_with(host="0.0.0.0", port=5000)
