import os
import uuid
import tempfile
from pathlib import Path
from django.core.files import File
from chat_all_the_docs.indexes.models import Collection

from llama_index import GPTSimpleVectorIndex, download_loader


def create_index(collection_id):
    """
    Celery task to create a GPTSimpleVectorIndex for a given Collection object.

    This task takes the ID of a Collection object, retrieves it from the
    database along with its related documents, and saves the document files
    to a temporary directory. Then, it creates a GPTSimpleVectorIndex using
    the provided code and saves the index to the Comparison.model FileField.

    Args:
        collection_id (int): The ID of the Collection object for which the
                             index should be created.

    Returns:
        bool: True if the index is created and saved successfully, False otherwise.
    """
    try:
        # Get the Collection object with related documents
        collection = Collection.objects.prefetch_related("documents").get(id=collection_id)

        # Create a temporary directory to store the document files
        with tempfile.TemporaryDirectory() as tempdir:
            print(f"Tempdir: {tempdir} {type(tempdir)}")
            tempdir_path = Path(tempdir)

            # Save the document files to the temporary directory
            for document in collection.documents.all():
                with document.file.open("rb") as f:
                    file_data = f.read()

                temp_file_path = tempdir_path / document.file.name
                temp_file_path.parent.mkdir(parents=True, exist_ok=True)
                with temp_file_path.open("wb") as f:
                    f.write(file_data)

            # Create the GPTSimpleVectorIndex
            SimpleDirectoryReader = download_loader("SimpleDirectoryReader")
            loader = SimpleDirectoryReader(tempdir_path, recursive=True, exclude_hidden=False)
            documents = loader.load_data()
            print(f"Documents: {documents}")
            # index = GPTSimpleVectorIndex(documents)

            # documents = SimpleDirectoryReader(str(tempdir_path)).load_data()
            index = GPTSimpleVectorIndex.from_documents(documents)
            print(f"Index: {index}")
            index_str = index.save_to_string()

            # Save the index_str to the Comparison.model FileField
            with tempfile.NamedTemporaryFile(delete=False) as f:
                f.write(index_str.encode())
                f.flush()
                f.seek(0)
                collection.model.save(f"model_{uuid.uuid4()}.json", File(f))

            # Delete the temporary index file
            os.unlink(f.name)

        return True
    except Exception as e:
        print(f"Error creating index: {e}")
        return False
