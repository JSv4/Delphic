import logging

from asgiref.sync import sync_to_async
from django.conf import settings
from django.core.files.base import ContentFile
from django.db.models import Q
from django.http import HttpRequest
from ninja import File, Form, Router
from ninja.files import UploadedFile
from ninja_extra import NinjaExtraAPI
from ninja_jwt.authentication import AsyncJWTAuth
from ninja_jwt.controller import NinjaJWTDefaultController
from rest_framework_api_key.models import APIKey

from delphic.indexes.models import Collection, Document
from delphic.tasks import create_index
from delphic.utils.collections import query_collection

from .auth.api_key import NinjaApiKeyAuth
from .ninja_types import (
    CollectionModelSchema,
    CollectionQueryInput,
    CollectionQueryOutput,
    CollectionStatusEnum,
)

logger = logging.getLogger(__name__)

collections_router = Router()

api = NinjaExtraAPI(
    title="Delphic LLM Microservice",
    description="""Delphic is a LLM document model orchestration engine that makes it
    easy to vectorize a collection of documents and then build and serve discrete
    Llama-Index models for each collection to create bespoke, highly-targed chattable
    knowledge bases.""",
    version="b0.9.0",
)

auth = None if settings.OPEN_ACCESS_MODE else [NinjaApiKeyAuth(), AsyncJWTAuth()]
api.add_router("/collections", collections_router, auth=auth)
api.register_controllers(NinjaJWTDefaultController)


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
async def create_collection(
    request,
    title: str = Form(...),
    description: str = Form(...),
    files: list[UploadedFile] = File(...),
):
    key = None

    if api_key := getattr(request, "auth", None):
        if isinstance(key, APIKey):
            key = api_key

    collection_instance = Collection(
        api_key=key,
        title=title,
        description=description,
        status=CollectionStatusEnum.QUEUED,
    )

    await sync_to_async(collection_instance.save)()

    for uploaded_file in files:
        doc_data = uploaded_file.file.read()
        doc_file = ContentFile(doc_data, uploaded_file.name)
        document = Document(collection=collection_instance, file=doc_file)
        await sync_to_async(document.save)()

    create_index.si(collection_instance.id).apply_async()

    # result = await sync_to_async(CollectionModelSchema.from_orm)(collection_instance)
    return await sync_to_async(CollectionModelSchema)(
        id=collection_instance.id,
        title=collection_instance.title,
        description=collection_instance.description,
        status=collection_instance.status,
        created=collection_instance.created.isoformat(),
        modified=collection_instance.modified.isoformat(),
        processing=collection_instance.processing,
        has_model=bool(collection_instance.model.name),
        document_names=await sync_to_async(list)(
            await sync_to_async(collection_instance.documents.values_list)(
                "file", flat=True
            )
        )
        # Fetch document names directly
    )


@collections_router.post(
    "/query",
    response=CollectionQueryOutput,
    summary="Ask a question of a document collection",
)
def query_collection_view(request: HttpRequest, query_input: CollectionQueryInput):
    collection_id = query_input.collection_id
    query_str = query_input.query_str
    response = query_collection(collection_id, query_str)
    return {"response": response}


@collections_router.get(
    "/available",
    response=list[CollectionModelSchema],
    summary="Get a list of all of the collections created with my api_key",
)
async def get_my_collections_view(request: HttpRequest):
    collections_filt = Q(api_key=None)

    if key := getattr(request, "auth", None):
        if isinstance(key, APIKey):
            logger.debug(f"API key: {key.prefix}")
            collections_filt |= Q(api_key=key)

    collections = Collection.objects.filter(collections_filt)

    return [
        {
            "id": collection.id,
            "title": collection.title,
            "description": collection.description,
            "status": collection.status,
            "created": collection.created.isoformat(),
            "modified": collection.modified.isoformat(),
            "processing": collection.processing,
            "has_model": bool(collection.model.name),
            "document_names": await sync_to_async(list)(
                await sync_to_async(collection.documents.values_list)("file", flat=True)
            ),
        }
        async for collection in collections
    ]


@collections_router.post(
    "/{collection_id}/add_file", summary="Add a file to a collection"
)
async def add_file_to_collection(
    request,
    collection_id: int,
    file: UploadedFile = File(...),
    description: str = Form(...),
):
    collection = await sync_to_async(Collection.objects.get)(id=collection_id)

    doc_data = file.read()
    doc_file = ContentFile(doc_data, file.name)

    document = Document(collection=collection, file=doc_file, description=description)
    await sync_to_async(document.save)()

    return {"message": f"Added file {file.name} to collection {collection_id}"}
