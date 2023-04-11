"""
ASGI config for Chat All The Docs project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/dev/howto/deployment/asgi/

"""
import os
import django

from config.api.websockets.middleware import TokenAuthMiddleware

django.setup()

import sys
from pathlib import Path
from django.urls import re_path
from django.core.asgi import get_asgi_application
from config.api.websockets.queries import CollectionQueryConsumer
from channels.routing import ProtocolTypeRouter, URLRouter

# This allows easy placement of apps within the interior
# chat_all_the_docs directory.
BASE_DIR = Path(__file__).resolve(strict=True).parent.parent
sys.path.append(str(BASE_DIR / "chat_all_the_docs"))

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
                    re_path(r'ws/collections/(?P<collection_id>\w+)/query/$', CollectionQueryConsumer.as_asgi()),
                ]
            )
        ),
    }
)
