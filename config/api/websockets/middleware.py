import logging
from urllib.parse import parse_qsl

import jwt
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.conf import settings
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)


@database_sync_to_async
def get_user_from_token(token):
    from ninja_jwt.tokens import UntypedToken

    User = get_user_model()

    print(f"Analyze token: {token}")
    try:
        UntypedToken(token)  # Validate the token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        user = User.objects.get(id=user_id)
        return user
    except Exception as e:
        logger.error(f"Invalid token: {e}")
        raise ValueError("Invalid token.") from e


class TokenAuthMiddleware(BaseMiddleware):
    def __init__(self, app):
        # Store the ASGI application we were passed
        self.app = app

    async def __call__(self, scope, receive, send):
        try:
            query_string = dict(parse_qsl(scope["query_string"].decode("utf-8")))
            token = query_string["token"]

            scope["user"] = await get_user_from_token(token)
            return await self.app(scope, receive, send)
        except (KeyError, ValueError) as e:
            if isinstance(e, KeyError):
                error_msg = "Token not provided."
            else:
                error_msg = "Invalid token."

            # Add this line to set an error message in the scope
            scope["error_msg"] = error_msg
            await send(
                {"type": "websocket.close", "code": 1000, "reason": "Invalid token."}
            )

            return await self.app(scope, receive, send)

    # async def __call__(self, scope, receive, send):
    #     print("TokenAuthMiddleware called")
    #     try:
    #         query_string = parse_qs(scope["query_string"].decode("utf-8"))
    #         print(f"query_string: {query_string}")
    #         token = query_string["token"][0]
    #         print(f"Token: {token}")
    #         scope["user"] = await get_user_from_token(token)
    #         print(f"Scope user: {scope['user']}")
    #     except Exception as e:
    #         print(f"Error in middleware: {e}")
    #         await send({"type": "websocket.close", "code": 1000, "reason": "Invalid token."})
    #         raise DenyConnection("Invalid token.")
    #         # scope['user'] = None
    #
    #     return await self.app(scope, receive, send)
