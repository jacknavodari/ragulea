# 🚀 RAGulea

A modern **Retrieval-Augmented Generation (RAG)** desktop application that lets you chat with your documents using local AI models. Built with FastAPI, React, MongoDB, and Ollama.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.14-blue.svg)
![React](https://img.shields.io/badge/react-19.2-blue.svg)

## ✨ Features

- 📄 **Document Upload**: Support for PDF and text files
- 🤖 **Local AI**: Powered by Ollama - no cloud, complete privacy
- 💾 **Vector Storage**: MongoDB for document embeddings
- 🎨 **Modern UI**: Clean React interface with real-time chat
- 🖥️ **Desktop App**: Windows installer for easy deployment
- 🔒 **Privacy First**: All processing happens locally on your machine

## 📋 Prerequisites

Before installing RAGulea, ensure you have the following installed:

### 1. MongoDB
Download and install MongoDB Community Server:
- **Download**: [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- **Default Connection**: `mongodb://localhost:27017/`
- Ensure MongoDB service is running

### 2. Ollama
Install Ollama for local AI model inference:
- **Download**: [Ollama](https://ollama.ai/)
- **Start Ollama**: Run `ollama serve` in terminal
- **Pull Required Models**:
  ```bash
  # Embedding model (required)
  ollama pull mxbai-embed-large
  
  # Generation models (choose one or more)
  ollama pull llama3
  ollama pull mistral
  ollama pull phi3
  ```

## 🚀 Installation

### Option 1: Windows Installer (Recommended)

1. Download `RAGulea.msi` from the [Releases](../../releases) page
2. Run the installer
3. Launch RAGulea from the Start Menu
4. The application will automatically open in your browser

### Option 2: Run from Source

#### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On Linux/Mac
pip install -r requirements.txt
python main.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The backend will be available at `http://localhost:8000` and frontend at `http://localhost:5173`.

## 📖 Usage

1. **Launch the Application**
   - Double-click the RAGulea shortcut or run the executable
   - The app will automatically open in your default browser

2. **Upload Documents**
   - Click the upload area or drag & drop PDF/text files
   - Files are automatically processed and embedded
   - Progress is shown during upload

3. **Select AI Model**
   - Choose your preferred generation model from the dropdown
   - Models must be pre-downloaded via Ollama

4. **Chat with Your Documents**
   - Type your question in the chat input
   - The AI will search your documents and provide contextual answers
   - View the source context used for each response

## 🛠️ Building from Source

### Build the Executable

```bash
cd backend
venv\Scripts\activate
pip install pyinstaller
pyinstaller ragulea.spec --clean
```

The executable will be in `backend/dist/ragulea.exe`.

### Build the Installer

Requires [WiX Toolset](https://wixtoolset.org/):

```bash
# Install WiX
dotnet tool install --global wix

# Build frontend
cd frontend
npm run build

# Build installer
cd ../wix
wix build product.wxs -o RAGulea.msi
```

The installer will be created at `wix/RAGulea.msi`.

## 🏗️ Architecture

```
RAGulea/
├── backend/              # FastAPI backend
│   ├── main.py          # Main application entry
│   ├── requirements.txt # Python dependencies
│   └── ragulea.spec     # PyInstaller configuration
├── frontend/            # React frontend
│   ├── src/
│   │   ├── App.jsx     # Main React component
│   │   └── main.jsx    # Entry point
│   └── package.json    # Node dependencies
└── wix/                # Windows installer
    └── product.wxs     # WiX configuration
```

### Tech Stack

**Backend:**
- FastAPI - Modern Python web framework
- LangChain - RAG orchestration
- Ollama - Local LLM inference
- MongoDB - Document and vector storage
- PyMuPDF - PDF processing

**Frontend:**
- React 19 - UI framework
- Vite - Build tool
- Axios - HTTP client
- Lucide React - Icons

## 🔧 Configuration

### MongoDB Connection
Default: `mongodb://localhost:27017/`

To change, edit `backend/main.py`:
```python
MONGO_URI = "mongodb://your-connection-string"
```

### Ollama URL
Default: `http://localhost:11434`

To change, edit `backend/main.py`:
```python
OLLAMA_BASE_URL = "http://your-ollama-url"
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai/) - Local LLM inference
- [LangChain](https://langchain.com/) - RAG framework
- [MongoDB](https://www.mongodb.com/) - Database
- [FastAPI](https://fastapi.tiangolo.com/) - Backend framework
- [React](https://react.dev/) - Frontend framework

## 📧 Support

If you encounter any issues or have questions, please [open an issue](../../issues).

---

Made with ❤️ by Antigravity
