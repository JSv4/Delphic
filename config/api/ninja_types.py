from typing import List
from ninja import Router, Schema, UploadedFile

class CollectionStatusEnum(str):
    COMPLETE = "COMPLETE"
    RUNNING = "RUNNING"
    QUEUED = "QUEUED"
    ERROR = "ERROR"

class CollectionIn(Schema):
    title: str
    description: str
    author: int
    status: CollectionStatusEnum

class CollectionModelSchema(Schema):
    id: int
    title: str
    description: str
    author: int
    status: CollectionStatusEnum
    created: str
    modified: str
