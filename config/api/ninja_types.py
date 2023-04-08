from typing import List, Optional
from ninja import Router, Schema, UploadedFile


class CollectionStatusEnum(str):
    COMPLETE = "COMPLETE"
    RUNNING = "RUNNING"
    QUEUED = "QUEUED"
    ERROR = "ERROR"


class CollectionIn(Schema):
    title: str
    description: Optional[str]
    status: CollectionStatusEnum = CollectionStatusEnum.QUEUED


class CollectionModelSchema(Schema):
    id: int
    title: str
    description: str
    status: CollectionStatusEnum
    created: str
    modified: str


class CollectionQueryInput(Schema):
    collection_id: int
    query_str: str


class CollectionQueryOutput(Schema):
    response: str
