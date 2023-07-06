import logging

from asgiref.sync import sync_to_async
from django.http import HttpRequest
from ninja_extra.security import AsyncAPIKeyHeader
from rest_framework_api_key.models import AbstractAPIKey, APIKey

logger = logging.getLogger(__name__)


class NinjaApiKeyAuth(AsyncAPIKeyHeader):
    param_name = "Authorization"

    async def authenticate(self, request: HttpRequest, key) -> "AbstractAPIKey":
        try:
            # Use the asynchronous ORM to get the API key
            return await sync_to_async(APIKey.objects.get_from_key)(key)
        except APIKey.DoesNotExist:
            pass
        except Exception as e:
            logger.warning(f"NinjaApiKeyAuth: invalid key: {type(e)} {e}")
