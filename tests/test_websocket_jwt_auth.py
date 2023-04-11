import json
import uuid
from pathlib import Path

from channels.exceptions import DenyConnection

from channels.testing import WebsocketCommunicator
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from ninja_jwt.tokens import AccessToken

from chat_all_the_docs.indexes.models import Collection
from config.asgi import application
from django.test import TransactionTestCase

User = get_user_model()


class TokenAuthMiddlewareTestCase(TransactionTestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username=uuid.uuid4().__str__(), password="testpassword"
        )

        current_dir = Path.cwd()
        index_file = current_dir / "tests" / "fixtures" / "model_58.json"
        with index_file.open('r') as model_file:
            self.collection = Collection.objects.create(title="Test Collection", description="A test collection",
                                                        model=ContentFile(model_file.read(), name="index.json"))
            # self.collection.file = file_contents
            # self.collection.save()

    async def test_middleware_with_valid_token(self):
        # Generate an access token for the user
        token = AccessToken.for_user(self.user)
        print(f"Token: {token}")

        # Create the WebSocket connection with the token in the query string
        communicator = WebsocketCommunicator(
            application,
            f"/ws/collections/{self.collection.id}/query/?token={str(token)}",
        )

        # Test WebSocket connection
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        # Test WebSocket disconnection
        await communicator.disconnect()

    async def test_middleware_with_invalid_token(self):
        # Create the WebSocket connection with an invalid token
        communicator = WebsocketCommunicator(
            application,
            f"/ws/collections/{self.collection.id}/query/?token=invalid_token",
        )

        connected, _ = await communicator.connect()
        self.assertFalse(connected)
        self.assertEqual(communicator.scope["error_msg"], "Invalid token.")

        # Test WebSocket disconnection
        await communicator.disconnect()

        # # Test WebSocket connection
        # connected, _ = await communicator.connect()
        # self.assertFalse(connected)
        #
        # # Test WebSocket disconnection
        # await communicator.disconnect()
        # # Test WebSocket connection
        # with self.assertRaises(DenyConnection):
        #     await communicator.connect()
        #
        # # Test WebSocket disconnection
        # await communicator.disconnect()

    async def test_middleware_without_token(self):
        # Create the WebSocket connection without a token
        communicator = WebsocketCommunicator(
            application,
            f"/ws/collections/{self.collection.id}/query/",
        )

        # # Test WebSocket connection
        # with self.assertRaises(DenyConnection):
        #     await communicator.connect()
        #
        # # Test WebSocket disconnection
        # await communicator.disconnect()

        # # Test WebSocket connection
        # connected, _ = await communicator.connect()
        # self.assertFalse(connected)
        #
        # # Test WebSocket disconnection
        # await communicator.disconnect()

        # Test WebSocket connection
        connected, _ = await communicator.connect()
        self.assertFalse(connected)
        self.assertEqual(communicator.scope["error_msg"], "Token not provided.")

        # Test WebSocket disconnection
        await communicator.disconnect()
