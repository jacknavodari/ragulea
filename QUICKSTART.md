# 🚀 Quick Start Guide

Get RAGulea up and running in 5 minutes!

## Step 1: Install Prerequisites (5 minutes)

### Install MongoDB

1. Download [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Run the installer with default settings
3. MongoDB will start automatically as a service

**Verify Installation:**
```bash
# Open Command Prompt and run:
mongosh
# You should see MongoDB shell connect successfully
```

### Install Ollama

1. Download [Ollama](https://ollama.ai/)
2. Run the installer
3. Open Command Prompt and pull required models:

```bash
# Required embedding model
ollama pull mxbai-embed-large

# Choose at least one generation model:
ollama pull llama3        # Recommended - 4.7GB
ollama pull mistral       # Alternative - 4.1GB
ollama pull phi3          # Smaller option - 2.3GB
```

**Verify Installation:**
```bash
ollama list
# You should see your downloaded models
```

## Step 2: Install RAGulea (1 minute)

### Option A: Use the Installer (Easiest)

1. Download `RAGulea.msi` from [Releases](../../releases)
2. Double-click to install
3. Click "RAGulea" in Start Menu
4. Browser opens automatically - you're ready! 🎉

### Option B: Run from Source

```bash
# Clone the repository
git clone https://github.com/yourusername/ragulea.git
cd ragulea

# Start backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py

# In a new terminal, start frontend
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Step 3: Use RAGulea (2 minutes)

### Upload Your First Document

1. Click the upload area or drag & drop a PDF/text file
2. Wait for "Upload successful!" message
3. Your document is now embedded and searchable

### Chat with Your Document

1. Select a model from the dropdown (e.g., "llama3")
2. Type a question about your document
3. Press Enter or click Send
4. View the AI's response with source context

### Example Questions

If you uploaded a technical document:
- "What are the main topics covered?"
- "Summarize the key points"
- "Explain [specific concept] from the document"

## Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
net start MongoDB
```

### "Cannot connect to Ollama"
```bash
# Start Ollama service
ollama serve
```

### "No models available"
```bash
# Pull a model
ollama pull llama3
```

### Port 8000 already in use
- RAGulea will automatically try ports 8000-8100
- Or close the application using port 8000

## Next Steps

- 📖 Read the full [README](README.md) for detailed information
- 🏗️ Check [ARCHITECTURE](ARCHITECTURE.md) to understand how it works
- 🤝 See [CONTRIBUTING](CONTRIBUTING.md) to contribute
- 💡 [Open an issue](../../issues) for questions or suggestions

## Tips & Tricks

- **Multiple Documents**: Upload multiple files to build a knowledge base
- **Model Selection**: Larger models (llama3) give better answers but are slower
- **Context Window**: The app shows which document chunks were used for each answer
- **Privacy**: Everything runs locally - no data leaves your machine

---

Enjoy using RAGulea! 🎉
