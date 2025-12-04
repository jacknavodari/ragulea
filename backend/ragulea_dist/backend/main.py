import sys
import os
import traceback
from fastapi.responses import FileResponse

# Setup logging to file immediately to catch import errors
log_file = os.path.join(os.path.dirname(os.path.abspath(sys.argv[0])), "ragulea_debug.log")

def log_error(msg):
    try:
        with open(log_file, "a") as f:
            f.write(msg + "\n")
    except:
        pass

try:
    from fastapi import FastAPI, UploadFile, File, HTTPException, Body
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.staticfiles import StaticFiles
    from pydantic import BaseModel
    from typing import List, Optional
    import shutil
    import uvicorn
    from pymongo import MongoClient
    from langchain_community.document_loaders import PyPDFLoader, TextLoader
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from langchain_ollama import OllamaEmbeddings
    from langchain_community.llms import Ollama
    import numpy as np
    from bson.objectid import ObjectId
except Exception:
    log_error("IMPORT ERROR:")
    log_error(traceback.format_exc())
    sys.exit(1)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGO_URI = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URI)
db = client["rag_app_db"]
collection = db["documents"]

# Ollama Setup
OLLAMA_BASE_URL = "http://localhost:11434"

# Ensure upload directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)



class QueryRequest(BaseModel):
    query: str
    model: str
    embedding_model: Optional[str] = "mxbai-embed-large:latest"

class ModelListResponse(BaseModel):
    models: List[str]

def get_embeddings(text: str, model: str):
    embeddings = OllamaEmbeddings(model=model, base_url=OLLAMA_BASE_URL)
    return embeddings.embed_query(text)

@app.get("/api/models")
def get_models():
    # Fetch models from Ollama
    import requests
    try:
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags")
        if response.status_code == 200:
            models = [m["name"] for m in response.json()["models"]]
            return {"models": models}
    except Exception as e:
        return {"models": [], "error": str(e)}
    return {"models": []}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...), embedding_model: str = "mxbai-embed-large:latest"):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Process file
    text = ""
    if file.filename.endswith(".pdf"):
        loader = PyPDFLoader(file_path)
        pages = loader.load()
        text = "".join([p.page_content for p in pages])
    else:
        # Assume text
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
            
    # Split text
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(text)
    
    # Embed and store
    embeddings_model = OllamaEmbeddings(model=embedding_model, base_url=OLLAMA_BASE_URL)
    
    for chunk in chunks:
        vector = embeddings_model.embed_query(chunk)
        doc = {
            "filename": file.filename,
            "content": chunk,
            "embedding": vector,
            "embedding_model": embedding_model
        }
        collection.insert_one(doc)
        
    return {"status": "success", "chunks_processed": len(chunks)}

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

@app.post("/api/chat")
def chat(request: QueryRequest):
    # Embed query
    embeddings_model = OllamaEmbeddings(model=request.embedding_model, base_url=OLLAMA_BASE_URL)
    query_vector = embeddings_model.embed_query(request.query)
    
    # Retrieve documents (Simple vector search in memory for now as Mongo Community doesn't do it natively easily without Atlas Search or plugins)
    # For a local app with reasonable data, we can fetch relevant docs or use a proper vector store. 
    # Since user insisted on "this data base" (MongoDB), we will fetch all docs with matching embedding_model and compute similarity.
    # Note: This is not scalable for huge datasets but fine for a personal RAG app.
    
    cursor = collection.find({"embedding_model": request.embedding_model})
    results = []
    for doc in cursor:
        if "embedding" in doc:
            score = cosine_similarity(query_vector, doc["embedding"])
            results.append((score, doc["content"]))
            
    results.sort(key=lambda x: x[0], reverse=True)
    top_k = results[:5]
    context = "\n\n".join([r[1] for r in top_k])
    
    # Generate response
    llm = Ollama(model=request.model, base_url=OLLAMA_BASE_URL)
    prompt = f"Context:\n{context}\n\nQuestion: {request.query}\n\nAnswer:"
    response = llm.invoke(prompt)
    
    return {"response": response, "context": [r[1] for r in top_k]}

# Serve Frontend
# In development, we might run separately, but for the final app, we serve static files.
# We check if the dist folder exists relative to this file or the executable.
def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)

frontend_base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
print(f"Frontend base path: {frontend_base_path}")
print(f"Base path exists: {os.path.exists(frontend_base_path)}")

# When packaged with PyInstaller, the frontend files are in a `frontend` directory
# at the root of the temporary directory.
if getattr(sys, 'frozen', False):
    frontend_base_path = os.path.join(sys._MEIPASS, 'frontend')
    print(f"Packaged frontend base path: {frontend_base_path}")
    print(f"Packaged base path exists: {os.path.exists(frontend_base_path)}")

if os.path.exists(frontend_base_path):
    # Mount / to serve index.html
    @app.get("/")
    async def serve_index():
        return FileResponse(os.path.join(frontend_base_path, "index.html"))

    # Mount /vite.svg directly
    @app.get("/vite.svg")
    async def serve_vite_svg():
        return FileResponse(os.path.join(frontend_base_path, "vite.svg"))

    # Mount /assets for other static files
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_base_path, "assets")), name="static_assets")

if __name__ == "__main__":
    try:
        uvicorn.run(app, host="0.0.0.0", port=8000)
    except Exception:
        log_error("RUNTIME ERROR:")
        log_error(traceback.format_exc())
        print("An error occurred. Check ragulea_debug.log for details.")
        input("Press Enter to exit...")


