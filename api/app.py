import os
import re
import uuid
import base64
import secrets
import string
import logging

from flask import Flask, request, jsonify
from flask_cors import CORS
import redis
from posthog import Posthog

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

POSTHOG_API_KEY = os.environ.get("POSTHOG_API_KEY")
if POSTHOG_API_KEY:  # pragma: no cover
    posthog = Posthog(POSTHOG_API_KEY, host="https://us.i.posthog.com")
    log.info("PostHog initialized")
else:
    posthog = None
    log.info("PostHog disabled (POSTHOG_API_KEY not set)")

MAX_CIPHERTEXT_SIZE = 40 * 1024 * 1024  # 40MB (supports 25MB files after base64 expansion)
ALIAS_ALPHABET = string.ascii_letters + string.digits
ALIAS_LENGTH = 8
ALIAS_RE = re.compile(r"^[a-zA-Z0-9]{8}$")


def generate_alias():
    return "".join(secrets.choice(ALIAS_ALPHABET) for _ in range(ALIAS_LENGTH))


REDIS_URL = os.environ.get("REDIS_URL")
if REDIS_URL:  # pragma: no cover
    log.info("Connecting to Redis via REDIS_URL")
    r = redis.from_url(REDIS_URL, decode_responses=True, socket_timeout=5)
else:
    redis_host = os.environ.get("REDIS_HOST", "redis")
    redis_port = int(os.environ.get("REDIS_PORT", 6379))
    log.info("Connecting to Redis at %s:%s", redis_host, redis_port)
    r = redis.Redis(
        host=redis_host,
        port=redis_port,
        decode_responses=True,
        socket_timeout=5,
    )

try:  # pragma: no cover
    r.ping()
    log.info("Redis connection established")
except redis.ConnectionError as e:  # pragma: no cover
    log.error("Redis connection failed: %s", e)


@app.route("/api/health")
def health():
    log.info("Health check requested")
    return jsonify({"status": "ok"})


@app.route("/api/secrets", methods=["POST"])
def create_secret():
    log.info("POST /api/secrets - Creating new secret")
    data = request.get_json(silent=True)
    if not data:
        log.warning("Request body missing")
        return jsonify({"error": "Request body required"}), 400

    ciphertext = data.get("ciphertext")
    ttl_hours = data.get("ttl_hours", 24)

    if not ciphertext or not isinstance(ciphertext, str):
        log.warning("Invalid or missing ciphertext")
        return jsonify({"error": "ciphertext is required and must be a string"}), 400

    if len(ciphertext) > MAX_CIPHERTEXT_SIZE:
        log.warning("Payload too large: %d bytes", len(ciphertext))
        return jsonify({"error": "Payload too large (max 40MB)"}), 413

    try:
        base64.b64decode(ciphertext)
    except Exception:
        log.warning("Invalid base64 ciphertext")
        return jsonify({"error": "ciphertext must be valid base64"}), 400

    try:
        ttl_hours = int(ttl_hours)
    except (ValueError, TypeError):
        log.warning("Invalid ttl_hours: %s", ttl_hours)
        return jsonify({"error": "ttl_hours must be an integer"}), 400

    ttl_hours = max(1, min(72, ttl_hours))

    # Allow client to provide a pre-generated UUID (needed for HKDF key derivation).
    # If not provided, generate one server-side for backwards compatibility.
    secret_id = data.get("id")
    if secret_id:
        try:
            uuid.UUID(secret_id)
        except ValueError:
            log.warning("Invalid UUID provided: %s", secret_id)
            return jsonify({"error": "id must be a valid UUID"}), 400
        # Prevent overwriting an existing secret
        if r.exists(f"secret:{secret_id}"):
            log.warning("Duplicate secret ID: %s", secret_id)
            return jsonify({"error": "Secret ID already exists"}), 409
    else:
        secret_id = str(uuid.uuid4())
        log.info("Generated server-side UUID: %s", secret_id)

    ttl_seconds = ttl_hours * 3600
    r.setex(f"secret:{secret_id}", ttl_seconds, ciphertext)
    log.info("Secret stored: id=%s, ttl=%dh", secret_id, ttl_hours)

    # Generate short alias for cleaner URLs
    alias = None
    for attempt in range(5):
        candidate = generate_alias()
        if r.set(f"alias:{candidate}", secret_id, ex=ttl_seconds, nx=True):
            alias = candidate
            log.info("Alias created: %s -> %s", alias, secret_id)
            break
        log.warning("Alias collision on attempt %d: %s", attempt + 1, candidate)

    if alias is None:
        log.error("Failed to generate alias after 5 attempts for secret %s", secret_id)

    if posthog:
        posthog.capture("server", "secret_created", {"ttl_hours": ttl_hours, "has_alias": alias is not None})
        posthog.flush()

    return jsonify({"id": secret_id, "alias": alias}), 201


@app.route("/api/secrets/<secret_id>")
def get_secret(secret_id):
    log.info("GET /api/secrets/%s - Retrieving secret", secret_id)
    actual_id = None
    alias_used = None

    # Try UUID first (backward compat)
    try:
        uuid.UUID(secret_id)
        actual_id = secret_id
        log.info("Resolved as UUID: %s", actual_id)
    except ValueError:
        # Try alias lookup
        if not ALIAS_RE.match(secret_id):
            log.warning("Invalid secret ID format: %s", secret_id)
            return jsonify({"error": "Invalid secret ID"}), 400
        actual_id = r.get(f"alias:{secret_id}")
        if actual_id is None:
            log.warning("Alias not found: %s", secret_id)
            return jsonify({"error": "Secret not found or already viewed"}), 404
        alias_used = secret_id
        log.info("Alias %s resolved to UUID: %s", secret_id, actual_id)

    ciphertext = r.getdel(f"secret:{actual_id}")

    if ciphertext is None:
        log.warning("Secret not found or already viewed: %s", actual_id)
        return jsonify({"error": "Secret not found or already viewed"}), 404

    log.info("Secret retrieved and destroyed: %s", actual_id)

    # Clean up alias
    if alias_used:
        r.delete(f"alias:{alias_used}")
        log.info("Alias cleaned up: %s", alias_used)

    if posthog:
        posthog.capture("server", "secret_retrieved", {"via": "alias" if alias_used else "uuid"})
        posthog.flush()

    return jsonify({"ciphertext": ciphertext, "id": actual_id})


def main():
    app.run(host="0.0.0.0", port=5000)


if __name__ == "__main__":
    main()
