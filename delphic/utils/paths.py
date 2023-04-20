import re


def extract_connection_id(path: str) -> str:
    print(f"Extract connection id from path: {path}")
    match = re.match(r"^/?ws/collections/(?P<connection_id>\d+)/query", path)
    if match:
        return match.group("connection_id")
    else:
        raise ValueError(f"Invalid path format: {path}")
