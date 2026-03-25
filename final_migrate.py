
import os
import json
import urllib.parse
import urllib.request

# Config
API_KEY = "AIzaSyBTX7XZ3WRxvf1MnpotRvUQC8x9o6N44yc"
PROJECT_ID = "the3-fc45a"
BUCKET = "the3-fc45a.appspot.com"
BASE_PATH = r"c:\Users\Administrator\Desktop\THE3WEP-main"

def upload_to_storage(local_path, cloud_path):
    url = f"https://firebasestorage.googleapis.com/v0/b/{BUCKET}/o?uploadType=media&name={urllib.parse.quote(cloud_path, safe='')}"
    try:
        with open(local_path, "rb") as f:
            data = f.read()
            req = urllib.request.Request(url, data=data, method="POST")
            req.add_header("Content-Type", "application/octet-stream")
            with urllib.request.urlopen(req) as response:
                if response.status == 200:
                    return f"https://firebasestorage.googleapis.com/v0/b/{BUCKET}/o/{urllib.parse.quote(cloud_path, safe='')}?alt=media"
    except Exception as e:
        print(f"Error uploading {local_path}: {e}")
    return None

def update_firestore(col, doc_id, field, value):
    url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/{col}/{doc_id}?updateMask.fieldPaths={field}&key={API_KEY}"
    payload = {
        "fields": {
            field: {"stringValue": value}
        }
    }
    try:
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, method="PATCH")
        req.add_header("Content-Type", "application/json")
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                return True
    except Exception as e:
        print(f"Error updating Firestore: {e}")
    return False

def migrate():
    # Load portfolio dump
    with open(os.path.join(BASE_PATH, "portfolio_dump.json"), "r", encoding="utf-8-sig") as f:
        data = json.load(f)
        docs = data.get("documents", [])
        
    for d in docs:
        doc_path = d["name"] # projects/the3-fc45a/databases/(default)/documents/portfolio/ID
        doc_id = doc_path.split("/")[-1]
        fields = d.get("fields", {})
        
        # Check thumbnail
        thumb = fields.get("thumbnail", {}).get("stringValue")
        if thumb and thumb.startswith("uploads/"):
            local_file = os.path.join(BASE_PATH, thumb.replace("/", "\\"))
            if os.path.exists(local_file):
                print(f"Migrating {thumb}...")
                cloud_url = upload_to_storage(local_file, thumb)
                if cloud_url:
                    if update_firestore("portfolio", doc_id, "thumbnail", cloud_url):
                        print(f"Successfully migrated {doc_id}")
            else:
                print(f"File not found: {local_file}")

if __name__ == "__main__":
    migrate()
