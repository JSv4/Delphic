from ninja import Router, File
from .models import Collection

router = Router()


@router.post("/collections/create")
def create_collection(request, collection: CollectionIn):
    collection_instance = Collection.objects.create(
        title=collection.title,
        description=collection.description,
        author_id=collection.author,
        status=collection.status
    )

    # Save the documents
    for document in collection.documents:
        collection_instance.documents.create(file=document)

    collection_instance.save()

    return CollectionOut.from_orm(collection_instance)
