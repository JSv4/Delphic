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
        collection_id = text_data_json['collection_id']
        query_str = text_data_json['query_str']

        response = query_collection(collection_id, query_str)

        await self.send(text_data=response)
