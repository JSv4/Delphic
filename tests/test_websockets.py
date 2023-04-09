import shutil

from chat_all_the_docs.indexes.models import Collection
from django.test import TestCase
from pathlib import Path
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from channels.testing import WebsocketCommunicator
from config.api.websockets.queries import CollectionQueryConsumer


class TestCollectionQueryConsumer(TestCase):

    def setUp(self):

        current_dir = Path.cwd()
        index_file = current_dir / "tests" / "fixtures" / "model_58.json"
        with index_file.open('r') as model_file:
            self.collection = Collection.objects.create(title="Test Collection", description="A test collection",
                                                    model=ContentFile(model_file.read(), name="index.json"))
        # self.collection.file = file_contents
        # self.collection.save()

    async def test_collection_query_consumer(self):

        test_query = "some query"
        test_collection_id = self.collection.id

        # communicator = WebsocketCommunicator(CollectionQueryConsumer.as_asgi(), "/ws/")

        communicator = WebsocketCommunicator(
            application=CollectionQueryConsumer.as_asgi(),
            path=f"ws/collections/{test_collection_id}/query",
        )

        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        await communicator.send_json_to({"query": test_query, "collection_id": test_collection_id})

        response = await communicator.receive_json_from()
        print(f"Web socket response: {response}")
        self.assertTrue("## Response\n\n\n" in response["response"])

        # Test connection is still open and model is loaded in memory
        await communicator.send_json_to({"query": test_query, "collection_id": test_collection_id})

        response = await communicator.receive_json_from()
        print(f"Web socket response 2: {response}")
        self.assertTrue("## Response\n\n\n" in response["response"])

        await communicator.disconnect()
