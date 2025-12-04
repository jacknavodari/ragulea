import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Upload, Send, Bot, User, FileText, Settings, Database } from 'lucide-react'
import './App.css'

const API_URL = 'http://localhost:8000/api'

function App() {
  const [models, setModels] = useState([])
  const [embeddingModels, setEmbeddingModels] = useState([])
  const [selectedModel, setSelectedModel] = useState('')
  const [embeddingModel, setEmbeddingModel] = useState('mxbai-embed-large:latest')
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  
  const chatEndRef = useRef(null)

  useEffect(() => {
    fetchModels()
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchModels = async () => {
    try {
      const res = await axios.get(`${API_URL}/models`)
      const allModels = res.data.models || []
      
      // Separate embedding models from generation models
      const embeddingModelsList = allModels.filter(m => 
        m.includes('embed') || m.includes('nomic')
      )
      const generationModelsList = allModels.filter(m => 
        !m.includes('embed') && !m.includes('nomic')
      )
      
      setModels(generationModelsList)
      setEmbeddingModels(embeddingModelsList)
      
      // Set default generation model
      if (generationModelsList.length > 0) {
        const defaultModel = generationModelsList.find(m => 
          m.includes('llama3') || m.includes('mistral')
        ) || generationModelsList[0]
        setSelectedModel(defaultModel)
      }
      
      // Set default embedding model
      if (embeddingModelsList.length > 0) {
        const defaultEmbed = embeddingModelsList.find(m => 
          m.includes('mxbai-embed-large')
        ) || embeddingModelsList[0]
        setEmbeddingModel(defaultEmbed)
      }
    } catch (err) {
      console.error("Failed to fetch models", err)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setUploadStatus('Uploading & Embedding...')
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('embedding_model', embeddingModel)

    try {
      await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setUploadStatus(`Successfully processed ${file.name}`)
      setTimeout(() => setUploadStatus(''), 3000)
    } catch (err) {
      setUploadStatus('Upload failed')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleSend = async () => {
    if (!query.trim() || !selectedModel) return

    const userMsg = { role: 'user', content: query }
    setMessages(prev => [...prev, userMsg])
    setQuery('')
    setLoading(true)

    try {
      const res = await axios.post(`${API_URL}/chat`, {
        query: userMsg.content,
        model: selectedModel,
        embedding_model: embeddingModel
      })
      
      const botMsg = { role: 'bot', content: res.data.response, context: res.data.context }
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Error: Could not get response.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-wrapper">
      <h1>RAGulea <span style={{fontSize: '0.4em', verticalAlign: 'middle', opacity: 0.6}}>by Antigravity</span></h1>
      
      <div className="container">
        {/* Left Panel: Settings & Upload */}
        <div className="card left-panel">
          <div className="section">
            <h3><Settings size={20} /> Configuration</h3>
            
            <label>Generation Model</label>
            <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
              {models.length === 0 && <option>No models found</option>}
              {models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>

            <label>Embedding Model</label>
            <select value={embeddingModel} onChange={(e) => setEmbeddingModel(e.target.value)}>
              {embeddingModels.length === 0 && <option>No embedding models found</option>}
              {embeddingModels.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <small style={{opacity: 0.6, fontSize: '0.75em', marginTop: '-0.5rem'}}>
              Used for document processing and search
            </small>
          </div>

          <div className="section" style={{marginTop: '2rem'}}>
            <h3><Database size={20} /> Knowledge Base</h3>
            <div className="upload-area" onClick={() => document.getElementById('file-input').click()}>
              <Upload size={32} style={{marginBottom: '1rem', opacity: 0.7}} />
              <p>Click to upload PDF or Text</p>
              <input 
                id="file-input" 
                type="file" 
                hidden 
                accept=".pdf,.txt,.md" 
                onChange={handleFileUpload} 
              />
            </div>
            {uploading && <div style={{marginTop: '1rem'}}><span className="loading"></span> {uploadStatus}</div>}
            {!uploading && uploadStatus && <div style={{marginTop: '1rem', color: '#4ade80'}}>{uploadStatus}</div>}
          </div>
        </div>

        {/* Right Panel: Chat */}
        <div className="card right-panel">
          <div className="chat-messages">
            {messages.length === 0 && (
              <div style={{textAlign: 'center', opacity: 0.5, marginTop: '20%'}}>
                <Bot size={48} />
                <p>Ready to chat with your documents.</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', opacity: 0.7, fontSize: '0.8em'}}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  <span>{msg.role === 'user' ? 'You' : 'RAGulea'}</span>
                </div>
                <div style={{whiteSpace: 'pre-wrap'}}>{msg.content}</div>
                {msg.context && (
                  <details style={{marginTop: '0.5rem', fontSize: '0.8em', opacity: 0.8}}>
                    <summary style={{cursor: 'pointer'}}>View Context Sources</summary>
                    {msg.context.map((ctx, i) => (
                      <div key={i} style={{marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px'}}>
                        {ctx.substring(0, 150)}...
                      </div>
                    ))}
                  </details>
                )}
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <span className="loading"></span> Thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="input-area" style={{display: 'flex', gap: '1rem'}}>
            <input 
              type="text" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask something about your documents..."
            />
            <button onClick={handleSend} disabled={loading || !query.trim()}>
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
