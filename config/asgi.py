"""
ASGI config for Chat All The Docs project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/dev/howto/deployment/asgi/

"""
import os

import django

from config.api.websockets.middleware import TokenAuthMiddleware

# This is intentional to avoid Django breaking on startup
django.setup()  # noqa: E402

import sys  # noqa: E402
from pathlib import Path  # noqa: E402

from channels.routing import ProtocolTypeRouter, URLRouter  # noqa: E402
from django.core.asgi import get_asgi_application  # noqa: E402
from django.urls import re_path  # noqa: E402

from config.api.websockets.queries import CollectionQueryConsumer  # noqa: E402

# This allows easy placement of apps within the interior
# delphic directory.
BASE_DIR = Path(__file__).resolve(strict=True).parent.parent
sys.path.append(str(BASE_DIR / "delphic"))

# If DJANGO_SETTINGS_MODULE is unset, default to the local settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.local")

# This application object is used by any ASGI server configured to use this file.
django_application = get_asgi_application()

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": TokenAuthMiddleware(
            URLRouter(
                [
                    re_path(
                        r"ws/collections/(?P<collection_id>\w+)/query/$",
                        CollectionQueryConsumer.as_asgi(),
                    ),
                ]
            )
        ),
    }
)
