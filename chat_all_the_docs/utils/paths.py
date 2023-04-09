import re

def extract_connection_id(path: str) -> str:
    match = re.match(r"^ws/collections/(?P<connection_id>\d+)/query$", path)
    if match:
        return match.group("connection_id")
    else:
        raise ValueError("Invalid path format")
