# RAGulea Architecture

This document describes the architecture and design decisions of RAGulea.

## Overview

RAGulea is a desktop RAG (Retrieval-Augmented Generation) application that allows users to chat with their documents using local AI models. The application consists of three main components:

1. **Backend** - FastAPI server handling document processing and AI inference
2. **Frontend** - React-based user interface
3. **Installer** - WiX-based Windows installer

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│                    (React Frontend)                          │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    FastAPI Backend                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Document   │  │   Vector     │  │     Chat     │     │
│  │  Processing  │  │   Search     │  │   Handler    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────┬──────────────────┬──────────────────┬─────────────┘
         │                  │                  │
         │                  │                  │
    ┌────▼────┐      ┌─────▼─────┐     ┌─────▼─────┐
    │ MongoDB │      │  LangChain │     │  Ollama   │
    │ Storage │      │   Vector   │     │    LLM    │
    └─────────┘      └───────────┘     └───────────┘
```

## Component Details

### Backend (FastAPI)

**Location**: `backend/main.py`

**Responsibilities**:
- Document upload and processing
- Text extraction from PDFs
- Document chunking and embedding
- Vector similarity search
- LLM prompt construction and inference
- Static file serving for frontend

**Key Endpoints**:
- `GET /` - Serve frontend index.html
- `GET /api/models` - List available Ollama models
- `POST /api/upload` - Upload and process documents
- `POST /api/chat` - Chat with documents

**Dependencies**:
- FastAPI - Web framework
- LangChain - RAG orchestration
- PyMuPDF (pypdf) - PDF processing
- pymongo - MongoDB client
- uvicorn - ASGI server

### Frontend (React)

**Location**: `frontend/src/`

**Responsibilities**:
- User interface for document upload
- Model selection
- Chat interface
- Display of AI responses and context

**Key Components**:
- `App.jsx` - Main application component
- File upload with drag & drop
- Real-time chat interface
- Model selector dropdown

**Dependencies**:
- React 19 - UI framework
- Vite - Build tool and dev server
- Axios - HTTP client
- Lucide React - Icon library

### Data Flow

#### Document Upload Flow

```
1. User selects file in UI
2. Frontend sends file to /api/upload
3. Backend extracts text from file
4. Text is split into chunks (1000 chars, 200 overlap)
5. Each chunk is embedded using Ollama
6. Chunks + embeddings stored in MongoDB
7. Success response sent to frontend
```

#### Chat Flow

```
1. User types question in UI
2. Frontend sends query to /api/chat
3. Backend embeds the query
4. Vector similarity search in MongoDB
5. Top 5 relevant chunks retrieved
6. Context + query sent to Ollama LLM
7. LLM generates response
8. Response + context sent to frontend
9. UI displays response and sources
```

## Database Schema

### MongoDB Collection: `documents`

```javascript
{
  "_id": ObjectId,
  "filename": String,        // Original filename
  "content": String,         // Text chunk
  "embedding": Array[Float], // Vector embedding
  "embedding_model": String  // Model used for embedding
}
```

## Embedding Strategy

- **Model**: `mxbai-embed-large:latest` (default)
- **Chunk Size**: 1000 characters
- **Chunk Overlap**: 200 characters
- **Similarity**: Cosine similarity
- **Top-K**: 5 most relevant chunks

## Deployment

### Development Mode

Backend and frontend run separately:
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`

### Production Mode (Packaged)

Single executable with embedded frontend:
- Backend serves frontend static files
- Auto-opens browser on startup
- Runs on first available port (8000-8100)

### Packaging Process

1. **Frontend Build**
   ```bash
   cd frontend
   npm run build
   # Creates frontend/dist/
   ```

2. **PyInstaller Bundle**
   ```bash
   cd backend
   pyinstaller ragulea.spec
   # Creates backend/dist/ragulea.exe
   # Includes frontend/dist/ as embedded data
   ```

3. **WiX Installer**
   ```bash
   cd wix
   wix build product.wxs -o RAGulea.msi
   # Creates Windows installer
   ```

## Security Considerations

- **Local-First**: All data stays on user's machine
- **No Cloud**: No external API calls (except local Ollama)
- **File Storage**: Uploads stored in user's AppData folder
- **CORS**: Configured for local development

## Performance Considerations

- **Vector Search**: In-memory cosine similarity (suitable for small-medium datasets)
- **Chunking**: Balanced chunk size for context vs. precision
- **Embedding Cache**: Embeddings stored in MongoDB to avoid recomputation
- **Single Executable**: ~80MB bundle size

## Future Improvements

- [ ] Add support for more file types (DOCX, HTML, etc.)
- [ ] Implement proper vector database (Qdrant, Chroma)
- [ ] Add conversation history
- [ ] Support for multiple embedding models
- [ ] Batch document processing
- [ ] Document management UI (view, delete documents)
- [ ] Export chat history
- [ ] Dark mode theme

## Development Guidelines

### Adding New Features

1. Backend changes go in `backend/main.py`
2. Frontend changes go in `frontend/src/App.jsx`
3. Update README.md with new features
4. Test both dev and production modes
5. Rebuild installer for distribution

### Testing

- **Backend**: Run `python main.py` and test endpoints
- **Frontend**: Run `npm run dev` and test UI
- **Integration**: Build executable and test full workflow
- **Installer**: Install MSI and verify installation

### Code Style

- **Python**: Follow PEP 8
- **JavaScript**: Use ESLint configuration
- **Comments**: Document complex logic
- **Commits**: Clear, descriptive messages

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running on port 27017
   - Check MongoDB service status

2. **Ollama Not Found**
   - Verify Ollama is installed and running
   - Check `http://localhost:11434` is accessible

3. **Frontend Not Loading**
   - Verify frontend/dist exists
   - Check PyInstaller bundled files correctly
   - Look for errors in console output

4. **Port Already in Use**
   - App will try ports 8000-8100
   - Close other applications using these ports

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [LangChain Documentation](https://python.langchain.com/)
- [Ollama Documentation](https://ollama.ai/docs)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
