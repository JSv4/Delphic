import logging

from ninja.security import APIKeyHeader
from rest_framework_api_key.models import APIKey
from asgiref.sync import sync_to_async


logger = logging.getLogger(__name__)


class NinjaApiKeyAuth(APIKeyHeader):

    param_name = "AUTHORIZATION"

    # def authenticate(self, request, key):
    #     print(f"API KEY authenticatE: {key}")
    #     try:
    #         api_key = APIKey.objects.get_from_key(key)
    #         print("Success")
    #         return api_key
    #     except Exception as e:
    #         logger.warning(f"INVALID KEY! - Error: {e}")
    async def authenticate(self, request, key):
        print(f"API KEY authenticatE: {key}")
        try:
            # Use the asynchronous ORM to get the API key
            api_key = await sync_to_async(APIKey.objects.get_from_key)(key)
            print(f"Success - api_key: {api_key.name}")
            return api_key
        except Exception as e:
            logger.warning(f"INVALID KEY! - Error: {e}")
