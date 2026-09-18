"""House JSON log format — one JSON object per physical line, on stdout.

The body shape is byte-for-byte the one quotery emits, so a single query works
across every app. The field names and their order are pinned by ``LOGGING``
below: changing either is a cross-app breaking change, not a local edit.
"""

import contextvars
import logging
import logging.config
import time
import uuid

from pythonjsonlogger.json import JsonFormatter

# Context fields the house schema carries "when in scope". This app populates
# none of them except request_id, but the keys stay present and empty: "when in
# scope" means an empty string, not an absent key, so a query never has to
# special-case which app produced the line.
_OUT_OF_SCOPE = ("tenant_id", "tenant_name", "user_id", "user_email", "task_id")

_request_id = contextvars.ContextVar("log_request_id", default="")


class UtcJsonFormatter(JsonFormatter):
    """JsonFormatter whose asctime is UTC rather than local."""

    converter = time.gmtime


class LogContextFilter(logging.Filter):
    """Attach the context fields to every record.

    Load-bearing rather than cosmetic: python-json-logger serializes an
    attribute the record does not carry as ``null``, which would make this
    app's body shape differ from every other app's empty-string one. Never
    raises — a context failure must not break logging.
    """

    def filter(self, record):
        try:
            record.request_id = _request_id.get()
            for field in _OUT_OF_SCOPE:
                setattr(record, field, "")
        except Exception:  # noqa: BLE001 — never break logging
            pass
        return True


def set_request_id():
    """Give the current request a correlation id."""
    _request_id.set(str(uuid.uuid4()))


def clear_log_context():
    """Drop it, so lines logged outside a request carry no stale id."""
    _request_id.set("")


LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "json": {
            "()": "logging_config.UtcJsonFormatter",
            "fmt": (
                "%(levelname)s %(asctime)s %(name)s %(message)s "
                "%(tenant_id)s %(tenant_name)s %(user_id)s %(user_email)s "
                "%(request_id)s %(task_id)s"
            ),
        },
    },
    "filters": {
        "log_context": {"()": "logging_config.LogContextFilter"},
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "json",
            "filters": ["log_context"],
            "stream": "ext://sys.stdout",
        },
    },
    "root": {"handlers": ["console"], "level": "INFO"},
}


def configure_logging():
    """Send every logger through the house JSON formatter, on stdout."""
    logging.config.dictConfig(LOGGING)
