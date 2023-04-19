import json
from channels.generic.websocket import AsyncWebsocketConsumer

from chat_all_the_docs.utils.collections import load_collection_model
from chat_all_the_docs.utils.paths import extract_connection_id


class CollectionQueryConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("Connecting...")  # Debugging print statement
        try:
            self.collection_id = extract_connection_id(self.scope['path'])
            print(f"Connect to collection model: {self.collection_id}")
            # define LLM

            self.index = await load_collection_model(self.collection_id)
            print(f"Index loaded: {self.index}")
            await self.accept()
            print("Connected.")  # Debugging print statement
        except ValueError as e:
            print(f"Value error prevented model loading: {e}")
            await self.accept()
            await self.close(code=4000)
        except Exception as e:
            print(f"Error during connection: {e}")  # Debugging print statement


    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(f"Received text_data_json: {text_data_json}")

        if self.index is not None:
            query_str = text_data_json["query"]
            modified_query_str = f"""
            Please return a nicely formatted markdown string to this request:

            {query_str}
            """
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
