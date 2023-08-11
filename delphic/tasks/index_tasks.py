import json
import logging
import os
import tempfile
import uuid
from pathlib import Path

from django.conf import settings
from django.core.files import File
from langchain import OpenAI
from llama_index import (
    GPTVectorStoreIndex,
    LLMPredictor,
    ServiceContext,
    download_loader,
)

from config import celery_app
from delphic.indexes.models import Collection, CollectionStatus

logger = logging.getLogger(__name__)


@celery_app.task
def create_index(collection_id):
    """
    Celery task to create a GPTVectorStoreIndex for a given Collection object.

    This task takes the ID of a Collection object, retrieves it from the
    database along with its related documents, and saves the document files
    to a temporary directory. Then, it creates a GPTVectorStoreIndex using
    the provided code and saves the index to the Comparison.model FileField.

    Args:
        collection_id (int): The ID of the Collection object for which the
                             index should be created.

    Returns:
        bool: True if the index is created and saved successfully, False otherwise.
    """
    try:
        # Get the Collection object with related documents
        collection = Collection.objects.prefetch_related("documents").get(
            id=collection_id
        )
        collection.status = CollectionStatus.RUNNING
        collection.save()

        try:
            # Create a temporary directory to store the document files
            with tempfile.TemporaryDirectory() as tempdir:
                tempdir_path = Path(tempdir)

                # Save the document files to the temporary directory
                for document in collection.documents.all():
                    with document.file.open("rb") as f:
                        file_data = f.read()

                    temp_file_path = tempdir_path / document.file.name
                    temp_file_path.parent.mkdir(parents=True, exist_ok=True)
                    with temp_file_path.open("wb") as f:
                        f.write(file_data)

                # Create the GPTVectorStoreIndex
                try:
                    SimpleDirectoryReader = download_loader("SimpleDirectoryReader")
                except Exception as e:
                    logger.error(f"Error downloading SimpleDirectoryReader: {e}")
                    raise

                loader = SimpleDirectoryReader(
                    tempdir_path, recursive=True, exclude_hidden=False
                )
                documents = loader.load_data()

                llm_predictor = LLMPredictor(
                    llm=OpenAI(
                        temperature=0,
                        model_name=settings.MODEL_NAME,
                        max_tokens=settings.MAX_TOKENS,
                    )
                )
                service_context = ServiceContext.from_defaults(
                    llm_predictor=llm_predictor
                )

                # build index
                index = GPTVectorStoreIndex.from_documents(
                    documents, service_context=service_context
                )

                index_str = json.dumps(index.storage_context.to_dict())

                # Save the index_str to the Comparison.model FileField
                with tempfile.NamedTemporaryFile(delete=False) as f:
                    f.write(index_str.encode())
                    f.flush()
                    f.seek(0)
                    collection.model.save(f"model_{uuid.uuid4()}.json", File(f))
                    collection.status = CollectionStatus.COMPLETE
                    collection.save()

                # Delete the temporary index file
                os.unlink(f.name)

            collection.processing = False
            collection.save()

            return True

        except Exception as e:
            logger.error(
                f"{type(e).__name__} creating index for collection {collection_id}: {e}"
            )
            collection.status = CollectionStatus.ERROR
            collection.save()

            return False

    except Exception as e:
        logger.error(f"Error loading collection: {e}")
        return False
