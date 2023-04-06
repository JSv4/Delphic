import os
import tempfile
from pathlib import Path
from django.core.files import File
from celery import shared_task
from chat_all_the_docs.indexes.models import Collection

from llama_index import GPTSimpleVectorIndex, SimpleDirectoryReader

# TODO - make sure this is properly configured to be discovered by celery
@shared_task
def create_index(collection_id):
    try:
        # Get the Collection object with related documents
        collection = Collection.objects.select_related("documents").get(id=collection_id)

        # Create a temporary directory to store the document files
        with tempfile.TemporaryDirectory() as tempdir:
            tempdir_path = Path(tempdir)

            # Save the document files to the temporary directory
            for document in collection.documents.all():
                with document.file.open("rb") as f:
                    file_data = f.read()

                temp_file_path = tempdir_path / document.file.name
                with temp_file_path.open("wb") as f:
                    f.write(file_data)

            # Create the GPTSimpleVectorIndex
            documents = SimpleDirectoryReader(str(tempdir_path)).load_data()
            index = GPTSimpleVectorIndex.from_documents(documents)
            index_str = index.save_to_string()

            # Save the index_str to the Comparison.model FileField
            with tempfile.NamedTemporaryFile(delete=False) as f:
                f.write(index_str.encode())
                f.flush()
                f.seek(0)
                collection.model.save("index.bin", File(f))

            # Delete the temporary index file
            os.unlink(f.name)

        return True
    except Exception as e:
        print(f"Error creating index: {e}")
        return False
