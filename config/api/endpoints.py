import base64
from typing import List
from ninja import Router, File, NinjaAPI, Form
from ninja.files import UploadedFile
from django.conf import settings
from django.db import connection
from django.core.files.base import ContentFile
from .auth.api_key import NinjaApiKeyAuth
from asgiref.sync import sync_to_async
from .ninja_types import CollectionIn, CollectionModelSchema
from chat_all_the_docs.indexes.models import Document, Collection

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
async def create_collection(request, collection_data: CollectionIn = Form(...), files: List[UploadedFile] = File(...)):

    collection_instance = Collection(
        title=collection_data.title,
        description=collection_data.description,
        author_id=collection_data.author,
        status=collection_data.status,
    )

    await sync_to_async(collection_instance.save)()


    for uploaded_file in files:
        doc_data = uploaded_file.file.read()
        doc_file = ContentFile(doc_data, uploaded_file.name)
        document = Document(collection=collection_instance, file=doc_file)
        await sync_to_async(document.save)()

    # result = await sync_to_async(CollectionModelSchema.from_orm)(collection_instance)
    return await sync_to_async(CollectionModelSchema)(
        id=collection_instance.id,
        title=collection_instance.title,
        description=collection_instance.description,
        author=collection_instance.author_id,
        status=collection_instance.status,
        created=collection_instance.created.isoformat(),
        modified=collection_instance.modified.isoformat(),
    )
