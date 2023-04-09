import json
from channels.generic.websocket import AsyncWebsocketConsumer
from urllib.parse import parse_qs

from chat_all_the_docs.utils.collections import load_collection_model
from chat_all_the_docs.utils.paths import extract_connection_id


class CollectionQueryConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print(f"Connecting scope... {self.scope}")
        # self.index = None
        #
        # params = parse_qs(self.scope["query_string"].decode("utf-8"))
        # if "collection_id" in params:
        #     collection_id = params["collection_id"][0]
        #     try:
        #         self.index = await load_collection_model(collection_id)
        #         await self.accept()
        #     except ValueError:
        #         await self.close(code=4001)  # Close connection with a custom error code
        # else:
        #     await self.close(code=4000)  # Close connection with a custom error code
        print("Connecting...")  # Debugging print statement
        try:
            self.collection_id = extract_connection_id(self.scope['path'])
            self.index = await load_collection_model(self.collection_id)
            print(f"Index loaded: {self.index}")
            await self.accept()
            print("Connected.")  # Debugging print statement
        except Exception as e:
            print(f"Error during connection: {e}")  # Debugging print statement
            raise e


    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(f"Received text_data_json: {text_data_json}")

        if self.index is not None:
            query_str = text_data_json["query"]
            response = self.index.query(query_str)

            # Format the response as markdown
            markdown_response = f"## Response\n\n{response}\n\n"
            if response.source_nodes:
                markdown_sources = f"## Sources\n\n{response.get_formatted_sources()}"
            else:
                markdown_sources = ""

            formatted_response = f"{markdown_response}{markdown_sources}"

            await self.send(json.dumps({"response": formatted_response}, indent=4))
        else:
            await self.send(json.dumps({"error": "No index loaded for this connection."}, indent=4))

# class CollectionQueryConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         await self.accept()
#
#     async def disconnect(self, close_code):
#         pass
#
#     async def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         print(f"Received text_data_json: {text_data_json}")
#         collection_id = text_data_json['collection_id']
#         query_str = text_data_json['query']
#
#         response = await query_collection(collection_id, query_str)
#
#         await self.send(json.dumps({"response": response}, indent=4))
