from chat_all_the_docs.indexes.models import Collection
from django.test import TestCase
from channels.testing import WebsocketCommunicator
from config.api.websockets.queries import CollectionQueryConsumer


class TestCollectionQueryConsumer(TestCase):

    def setUp(self):
        self.collection = Collection.objects.create(title="Test Collection", description="A test collection")

    async def test_collection_query_consumer(self):
        communicator = WebsocketCommunicator(CollectionQueryConsumer.as_asgi(), "/ws/")
        test_query = "some query"
        test_collection_id = self.collection.id

        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        await communicator.send_json_to({"query": test_query, "collection_id": test_collection_id})

        response = await communicator.receive_json_from()
        print(f"Web socket response: {response}")
        self.assertEqual(response["response"], "No model exists for this collection!")

        await communicator.disconnect()


# class TestCollectionQueryConsumer(ChannelsLiveServerTestCase):
#
#     def setUp(self):
#         self.communicator = WebsocketCommunicator(application, "/ws/collections/query/")
#         self.loop = asyncio.get_event_loop()
#         connected, _ = self.loop.run_until_complete(self.communicator.connect())
#         self.assertTrue(connected)
#
#     def tearDown(self):
#         self.loop.run_until_complete(self.communicator.disconnect())
#
#     async def test_collection_query_consumer(self):
#         # Define a test query and collection_id
#         test_query = "What are the parties involved?"
#         test_collection_id = 1
#
#         # Send the query
#         await self.communicator.send_json_to({"query": test_query, "collection_id": test_collection_id})
#
#         # Receive the response
#         response = await self.communicator.receive_json_from()
#
#         # Perform assertions based on your expected response
#         self.assertIn("response", response)
#         self.assertIn("sources", response)

########################################################################################################################

# import json
# import pytest
# from channels.testing import WebsocketCommunicator
# from config.asgi import application
#
#
# # @pytest.mark.asyncio
# async def test_collection_query_consumer():
#     # Set up WebSocket communicator
#     communicator = WebsocketCommunicator(application, "/ws/collections/query/")
#     connected, _ = await communicator.connect()
#     assert connected
#
#     # Define a test query and collection_id
#     test_query = "What are the parties involved?"
#     test_collection_id = 1
#
#     # Send the query
#     await communicator.send_json_to({"query": test_query, "collection_id": test_collection_id})
#
#     # Receive the response
#     response = await communicator.receive_json_from()
#
#     # Perform assertions based on your expected response
#     assert "response" in response
#     assert "sources" in response
#
#     # Close the WebSocket connection
#     await communicator.disconnect()
