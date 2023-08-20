import json
import logging
import textwrap
from pathlib import Path

from django.conf import settings
from llama_index import StorageContext, load_index_from_storage
from llama_index.indices.base import BaseIndex

from delphic.indexes.models import Collection

logger = logging.getLogger(__name__)


def format_source(source):
    """
    Format a source object as a nicely-structured markdown text.

    Args:
        source (llama_index.schema.Source): The source object to format.

    Returns:
        str: The formatted markdown text for the given source.
    """
    formatted_source = (
        f"- **{source.title}**\n\n{textwrap.indent(source.content, '  ')}\n\n"
    )
    return formatted_source


async def load_collection_model(collection_id: str | int) -> "BaseIndex":
    """
    Load the Collection model from cache or the database, and return the index.

    Args:
        collection_id (Union[str, int]): The ID of the Collection model instance.

    Returns:
        VectorStoreIndex: The loaded index.

    This function performs the following steps:
    1. Retrieve the Collection object with the given collection_id.
    2. Check if a JSON file with the name '/cache/model_{collection_id}.json' exists.
    3. If the JSON file doesn't exist, load the JSON from the `Collection.model` FileField and save it to
       '/cache/model_{collection_id}.json'.
    4. Call VectorStoreIndex.load_from_disk with the cache_file_path.
    """
    # Retrieve the Collection object
    collection = await Collection.objects.aget(id=collection_id)
    logger.info(f"load_collection_model() - loaded collection {collection_id}")

    # Make sure there's a model
    if collection.model.name:
        logger.info("load_collection_model() - Setup local json index file")

        # Check if the JSON file exists
        cache_dir = Path(settings.BASE_DIR) / "cache"
        cache_file_path = cache_dir / f"model_{collection_id}.json"
        if not cache_file_path.exists():
            cache_dir.mkdir(parents=True, exist_ok=True)
            with collection.model.open("rb") as model_file:
                with cache_file_path.open("w+", encoding="utf-8") as cache_file:
                    cache_file.write(model_file.read().decode("utf-8"))

        # Call VectorStoreIndex.load_from_disk
        logger.info("load_collection_model() - Load llama index")
        with cache_file_path.open("r") as cache_file:
            storage_context = StorageContext.from_dict(json.load(cache_file))
        index = load_index_from_storage(storage_context)

        logger.info(
            "load_collection_model() - Llamaindex loaded and ready for query..."
        )

    else:
        logger.error(
            f"load_collection_model() - collection {collection_id} has no model!"
        )
        raise ValueError("No model exists for this collection!")

    return index


async def query_collection(collection_id: str | int, query_str: str) -> str:
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
