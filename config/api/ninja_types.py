from ninja import Schema


class CollectionStatusEnum(str):
    COMPLETE = "COMPLETE"
    RUNNING = "RUNNING"
    QUEUED = "QUEUED"
    ERROR = "ERROR"


class CollectionIn(Schema):
    title: str
    description: str | None


class CollectionModelSchema(Schema):
    id: int
    title: str
    description: str
    status: CollectionStatusEnum
    created: str
    modified: str
    processing: bool
    has_model: bool
    document_names: list[str]


class CollectionQueryInput(Schema):
    collection_id: int
    query_str: str


class CollectionQueryOutput(Schema):
    response: str
