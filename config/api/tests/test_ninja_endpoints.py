import base64
import json
import asyncio
import httpx
import logging
from django.test import TransactionTestCase, AsyncClient
from django.db import transaction
from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync, sync_to_async
from rest_framework_api_key.models import APIKey
from ninja.testing import TestClient
from config.api.endpoints import collections_router
from concurrent.futures import ThreadPoolExecutor
from config import asgi
from chat_all_the_docs.indexes.models import Collection, Document

User = get_user_model()

logging.basicConfig(
    format="%(levelname)s [%(asctime)s] %(name)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    level=logging.DEBUG
)

class CollectionTestCase(TransactionTestCase):

    # async def async_setup_method(self):
        # Perform your asynchronous setup tasks here

        # # Use ThreadPoolExecutor to run the synchronous function in a separate thread
        # with ThreadPoolExecutor(max_workers=1) as executor:
        #     api_key, request_key = await asyncio.get_event_loop().run_in_executor(
        #         executor, lambda: APIKey.objects.create_key(name="my-test-service")
        #     )
        #
        # self.api_key = request_key

    @sync_to_async
    def get_request_key(self):
        api_key, request_key = APIKey.objects.create_key(name="my-test-service")
        return request_key

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client = AsyncClient(collections_router)
        # async_to_sync(self.async_setup_method)()
        # api_key, request_key = APIKey.objects.create_key(name="my-test-service")
        # self.api_key = request_key

    async def test_create_collection(self):



        request_key = await self.get_request_key()

        print(f"Request key: {request_key}")

        file_content = b"test content"

        # Test data
        collection_data = {
            "title": "Test Collection",
            "description": "A test collection",
            "author": self.user.id,
            "status": "COMPLETE",
        }

        # Send the request
        headers = {
            "Authorization": f"{request_key}",
        }
        files = [
            ('files', ('document1.txt', file_content, 'text/plain')),
            ('files', ('document2.txt', file_content, 'text/plain')),
        ]
        # response = await self.client.post("/api/collections/create", data = json.dumps(collection_data),
        #                                   **headers)
        async with httpx.AsyncClient(app=asgi.application, base_url="http://localhost:8000") as client:
            response = await client.post(
                "/api/collections/create",
                data=collection_data,
                files=files,
                headers=headers,
            )
            print(response.text)


        print(f"Response: {response} / {response.content}")

        # Check if the response is successful and the created collection is as expected
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertEqual(response_data["title"], collection_data["title"])
        self.assertEqual(response_data["description"], collection_data["description"])
        self.assertEqual(response_data["author"], collection_data["author"])
        self.assertEqual(response_data["status"], collection_data["status"])

        # Check if the documents are saved correctly
        collection_instance = await Collection.objects.aget(id=response_data["id"])
        collection_doc_count = await sync_to_async(collection_instance.documents.count)()
        self.assertEqual(collection_doc_count, 2)

        async for document in collection_instance.documents.all():
            await sync_to_async(document.file.delete)()
        await sync_to_async(collection_instance.delete)()

