import uuid
from pathlib import Path
from unittest import mock

from channels.testing import WebsocketCommunicator
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.test import TransactionTestCase
from ninja_jwt.tokens import AccessToken

from config.api.websockets.queries import CollectionQueryConsumer
from config.asgi import application
from delphic.indexes.models import Collection, CollectionStatus

User = get_user_model()


async def mocked_receive(self, *args, **kwargs):
    await self.send(text_data='{"response": "Hello, I am a test"}')


async def mocked_accept(self, *args, **kwargs):
    await self.accept()


class TokenAuthMiddlewareTestCase(TransactionTestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username=uuid.uuid4().__str__(), password="testpassword"
        )

        current_dir = Path.cwd()
        index_file = current_dir / "tests" / "fixtures" / "model_58.json"
        with index_file.open("r") as model_file:
            self.collection = Collection.objects.create(
                title="Test Collection",
                description="A test collection",
                model=ContentFile(model_file.read(), name="index.json"),
                status=CollectionStatus.COMPLETE,
            )

    async def test_middleware_with_valid_token(self):
        # Generate an access token for the user
        token = AccessToken.for_user(self.user)
        print(f"Token: {token}")

        # Create the WebSocket connection with the token in the query string
        communicator = WebsocketCommunicator(
            CollectionQueryConsumer.as_asgi(),
            f"/ws/collections/{self.collection.id}/query/?token={str(token)}",
        )

        # We don't actually want to load the model and connect to LLM API in a
        # test, so mock that part
        mock_index = mock.MagicMock()
        with mock.patch(
            "config.api.websockets.queries.load_collection_model",
            return_value=mock_index,
        ):
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

    async def test_middleware_without_token(self):
        # Create the WebSocket connection without a token
        communicator = WebsocketCommunicator(
            application,
            f"/ws/collections/{self.collection.id}/query/",
        )

        # Test WebSocket connection
        connected, _ = await communicator.connect()
        self.assertFalse(connected)
        self.assertEqual(communicator.scope["error_msg"], "Token not provided.")

        # Test WebSocket disconnection
        await communicator.disconnect()
