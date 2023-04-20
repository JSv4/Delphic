import logging

import httpx
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model
from django.test import AsyncClient, TransactionTestCase
from rest_framework_api_key.models import APIKey

from config import asgi
from config.api.endpoints import collections_router
from delphic.indexes.models import Collection, Document

User = get_user_model()

logging.basicConfig(
    format="%(levelname)s [%(asctime)s] %(name)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    level=logging.DEBUG,
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
        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )
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
        }

        # Send the request
        headers = {
            "Authorization": f"{request_key}",
        }
        files = [
            ("files", ("document1.txt", file_content, "text/plain")),
            ("files", ("document2.txt", file_content, "text/plain")),
        ]
        # response = await self.client.post("/api/collections/create", data = json.dumps(collection_data),
        #                                   **headers)
        async with httpx.AsyncClient(
            app=asgi.application, base_url="http://localhost:8000"
        ) as client:
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
        self.assertEqual(response_data["status"], "QUEUED")

        # Check if the documents are saved correctly
        collection_instance = await Collection.objects.aget(id=response_data["id"])
        collection_doc_count = await sync_to_async(
            collection_instance.documents.count
        )()
        self.assertEqual(collection_doc_count, 2)

        async for document in collection_instance.documents.all():
            await sync_to_async(document.file.delete)()
        await sync_to_async(collection_instance.delete)()

    async def test_add_file_to_collection(self):
        key = await self.get_request_key()
        api_key = await sync_to_async(APIKey.objects.get_from_key)(key)

        # Create a collection to add the file to
        collection = await sync_to_async(Collection.objects.create)(
            api_key=api_key,
            title="Test Collection",
            description="A test collection",
            status="COMPLETE",
        )

        # Create a file to upload
        file_content = b"test content"
        file_name = "test.txt"
        file_content_type = "text/plain"
        file = (file_name, file_content, file_content_type)

        # Send the request
        headers = {
            "Authorization": f"{key}",
        }
        data = {
            "description": "A test file",
        }
        files = [
            ("file", file),
        ]
        async with httpx.AsyncClient(
            app=asgi.application, base_url="http://localhost:8000"
        ) as client:
            response = await client.post(
                f"/api/collections/{collection.id}/add_file",
                data=data,
                files=files,
                headers=headers,
            )

        # Check if the response is successful and the created document is as expected
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertEqual(
            response_data["message"],
            f"Added file {file_name} to collection {collection.id}",
        )

        # Check if the document is saved correctly
        collection_instance = await Collection.objects.aget(id=collection.id)
        collection_doc_count = await sync_to_async(
            collection_instance.documents.count
        )()
        self.assertEqual(collection_doc_count, 1)
        document = await sync_to_async(Document.objects.get)(
            collection=collection_instance
        )
        self.assertEqual(document.file.name, f"documents/{file_name}")
        self.assertEqual(document.description, data["description"])

        # Clean up the test data
        await sync_to_async(document.file.delete)()
        await sync_to_async(collection_instance.delete)()
