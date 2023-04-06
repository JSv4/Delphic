from ninja import Router, File, NinjaAPI
from django.conf import settings
from .auth.api_key import NinjaApiKeyAuth
from chat_all_the_docs.indexes.models import Collection
from .ninja_types import CollectionIn, CollectionOut

collections_router = Router()

api = NinjaAPI(
    title="GREMLIN Engine NLP Microservice",
    description="Chat-All-The-Docs is a LLM document model orchestration engine that makes it easy to vectorize a "
                "collection of documents and then build and serve discrete Llama-Index models for each collection to "
                "create bespoke, highly-targed chattable knowledge bases.",
    version="b0.9.0",
    auth=None if settings.OPEN_ACCESS_MODE else NinjaApiKeyAuth(),
)

api.add_router("/collections", collections_router)


@api.get(
    "/heartbeat",
    auth=None,
    response=bool,
    tags=["Misc"],
    summary="Return true if api is up and running.",
)
def check_heartbeat(request):
    return True

@collections_router.post("/create")
async def create_collection(request, collection: CollectionIn):
    collection_instance = Collection(
        title=collection.title,
        description=collection.description,
        author_id=collection.author,
        status=collection.status,
        model=collection.model
    )
    await collection_instance.sace()

    # Save the documents
    for document_base64 in collection_in.documents:
        doc_data = base64.b64decode(document_base64)
        doc_file = ContentFile(doc_data, "document.txt")
        document = Document(collection=collection, file=doc_file, uploaded_by=request.context.user)
        document.save()

    return CollectionOut.from_orm(collection_instance)
