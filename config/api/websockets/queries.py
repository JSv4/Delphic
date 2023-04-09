import json
from channels.generic.websocket import AsyncWebsocketConsumer

from chat_all_the_docs.utils.collections import query_collection


class CollectionQueryConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(f"Received text_data_json: {text_data_json}")
        collection_id = text_data_json['collection_id']
        query_str = text_data_json['query']

        response = await query_collection(collection_id, query_str)

        await self.send(json.dumps({"response": response}, indent=4))
