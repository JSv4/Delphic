import os
import textwrap
from pathlib import Path
from typing import Union

from django.core.files.storage import default_storage
from django.conf import settings
from llama_index import GPTSimpleVectorIndex
import shutil


from chat_all_the_docs.indexes.models import Collection


def format_source(source):
    """
    Format a source object as a nicely-structured markdown text.

    Args:
        source (llama_index.schema.Source): The source object to format.

    Returns:
        str: The formatted markdown text for the given source.
    """
    formatted_source = f"- **{source.title}**\n\n{textwrap.indent(source.content, '  ')}\n\n"
    return formatted_source


async def load_collection_model(collection_id: Union[str, int]) -> GPTSimpleVectorIndex:
    """
    Load the Collection model from cache or the database, and return the index.

    Args:
        collection_id (Union[str, int]): The ID of the Collection model instance.

    Returns:
        GPTSimpleVectorIndex: The loaded index.

    This function performs the following steps:
    1. Retrieve the Collection object with the given collection_id.
    2. Check if a JSON file with the name '/cache/model_{collection_id}.json' exists.
    3. If the JSON file doesn't exist, load the JSON from the Collection.model FileField and save it to '/cache/model_{collection_id}.json'.
    4. Call GPTSimpleVectorIndex.load_from_disk with the cache_file_path.
    """
    # Retrieve the Collection object
    collection = await Collection.objects.aget(id=collection_id)

    # Make sure there's a model
    if collection.model.name:

        # Check if the JSON file exists
        cache_dir = Path(settings.BASE_DIR) / 'cache'
        cache_file_path = cache_dir / f'model_{collection_id}.json'
        if not os.path.exists(cache_file_path):
            cache_dir.mkdir(parents=True, exist_ok=True)
            # Load the JSON from the Collection.model FileField and save it to cache
            with default_storage.open(collection.model.path, 'rb') as model_file:
                with cache_file_path.open('wb') as cache_file:
                    shutil.copyfileobj(model_file, cache_file)

        # Call GPTSimpleVectorIndex.load_from_disk
        index = GPTSimpleVectorIndex.load_from_disk(cache_file_path)

    else:
        raise ValueError("No model exists for this collection!")

    return index


async def query_collection(collection_id: Union[str, int], query_str: str) -> str:
    """
    Query a collection with a given question and return the response as nicely-structured markdown text.

    Args:
        collection_id (Union[str, int]): The ID of the Collection model instance.
        query_str (str): The natural language question to query the collection.

    Returns:
        str: The response from the query as nicely-structured markdown text.

    This function performs the following steps:
    1. Load the GPTSimpleVectorIndex from the Collection with the given collection_id using load_collection_model.
    2. Call index.query with the query_str and get the llama_index.schema.Response object.
    3. Format the response and sources as markdown text and return the formatted text.
    """
    try:
        # Load the index from the collection
        index = await load_collection_model(collection_id)

        # Call index.query and return the response
        response = index.query(query_str)

        # Format the response as markdown
        markdown_response = f"## Response\n\n{response}\n\n"

        if response.source_nodes:
            markdown_sources = f"## Sources\n\n{response.get_formatted_sources()}"
        else:
            markdown_sources = ""

        formatted_response = f"{markdown_response}{markdown_sources}"

    except ValueError:
        formatted_response = "No model exists for this collection!"

    return formatted_response
