from typing import List
from ninja import Router, Schema
from django.core.files import File

class CollectionStatusEnum(str):
    COMPLETE = "COMPLETE"
    RUNNING = "RUNNING"
    QUEUED = "QUEUED"
    ERROR = "ERROR"

class CollectionIn(Schema):
    title: str
    description: str
    documents: List[File]
    author: int
    status: CollectionStatusEnum

class CollectionOut(Schema):
    id: int
    title: str
    description: str
    author: int
    status: CollectionStatusEnum
    created: str
    modified: str
