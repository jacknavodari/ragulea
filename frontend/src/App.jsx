import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Upload, Send, Bot, User, FileText, Settings, Database, Sun, Moon, Plus, Trash2 } from 'lucide-react'
import './App.css'

const API_URL = '/api'  // Use relative URL to work with any port

const COLLECTION_TYPES = [
  { id: 'pdf', label: 'PDFs', icon: '📄' },
  { id: 'text', label: 'Text', icon: '📝' },
  { id: 'code', label: 'Code', icon: '💻' },
  { id: 'office', label: 'Office', icon: '📊' },
  { id: 'other', label: 'Other', icon: '📁' }
]

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
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })
  const [collectionFilter, setCollectionFilter] = useState([])
  const [collectionStats, setCollectionStats] = useState(null)
  const [allCollections, setAllCollections] = useState([])
  const [showCreateCollection, setShowCreateCollection] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [selectedUploadCollection, setSelectedUploadCollection] = useState('auto')

  const chatEndRef = useRef(null)

  useEffect(() => {
    fetchModels()
    fetchCollectionStats()
    fetchAllCollections()
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

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

  const fetchCollectionStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/collections/stats`)
      setCollectionStats(res.data)
    } catch (err) {
      console.error("Failed to fetch collection stats", err)
    }
  }

  const fetchAllCollections = async () => {
    try {
      const res = await axios.get(`${API_URL}/collections/list`)
      setAllCollections(res.data.collections || [])
    } catch (err) {
      console.error("Failed to fetch collections", err)
    }
  }

  const createCollection = async () => {
    if (!newCollectionName.trim()) {
      alert('Please enter a collection name')
      return
    }

    console.log('Creating collection:', newCollectionName)

    try {
      const response = await axios.post(`${API_URL}/collections/create`, { name: newCollectionName })
      console.log('Collection created:', response.data)
      setNewCollectionName('')
      setShowCreateCollection(false)
      await fetchAllCollections()
      await fetchCollectionStats()
      alert(`Collection "${newCollectionName}" created successfully!`)
    } catch (err) {
      console.error('Create collection error:', err)
      console.error('Error response:', err.response)
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to create collection'
      alert(`Error: ${errorMsg}`)
    }
  }

  const deleteCollection = async (collectionName) => {
    if (!confirm(`Delete collection "${collectionName}"? This will remove all documents in it.`)) return

    try {
      await axios.delete(`${API_URL}/collections/custom/${collectionName}`)
      await fetchAllCollections()
      await fetchCollectionStats()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete collection')
    }
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const toggleCollectionFilter = (collectionId) => {
    setCollectionFilter(prev => {
      if (prev.includes(collectionId)) {
        return prev.filter(id => id !== collectionId)
      } else {
        return [...prev, collectionId]
      }
    })
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    setUploadStatus('Uploading & Embedding...')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('embedding_model', embeddingModel)

    // Add target collection if not auto
    if (selectedUploadCollection !== 'auto') {
      formData.append('target_collection', selectedUploadCollection)
    }

    try {
      await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setUploadStatus(`Successfully processed ${file.name}`)
      setTimeout(() => setUploadStatus(''), 3000)
      fetchCollectionStats() // Refresh stats after upload
      fetchAllCollections() // Refresh collection list
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
      const requestBody = {
        query: userMsg.content,
        model: selectedModel,
        embedding_model: embeddingModel
      }

      // Only add collection_filter if filters are active
      if (collectionFilter.length > 0) {
        requestBody.collection_filter = collectionFilter
      }

      const res = await axios.post(`${API_URL}/chat`, requestBody)

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
      {/* Theme Toggle Button */}
      <div className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
        {theme === 'dark' ? <Sun size={24} color="var(--text-primary)" /> : <Moon size={24} color="var(--text-primary)" />}
      </div>

      <h1>RAGulea <span style={{ fontSize: '0.4em', verticalAlign: 'middle', opacity: 0.6 }}>by Antigravity</span></h1>

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
            <small style={{ opacity: 0.6, fontSize: '0.75em', marginTop: '-0.5rem' }}>
              Used for document processing and search
            </small>
          </div>

          <div className="section" style={{ marginTop: '2rem' }}>
            <h3><Database size={20} /> Knowledge Base</h3>

            {/* Collection Filter */}
            <label style={{ marginBottom: '0.5rem' }}>Search in Collections:</label>
            <div className="collection-filter">
              {/* Default collections */}
              {COLLECTION_TYPES.map(type => (
                <div
                  key={type.id}
                  className={`collection-badge ${collectionFilter.includes(type.id) ? 'active' : ''}`}
                  onClick={() => toggleCollectionFilter(type.id)}
                  title={`${type.label} documents`}
                >
                  {type.icon} {type.label}
                  {collectionStats && collectionStats[type.id] > 0 && (
                    <span style={{ marginLeft: '0.3rem', opacity: 0.7 }}>({collectionStats[type.id]})</span>
                  )}
                </div>
              ))}

              {/* Custom collections */}
              {allCollections.filter(c => !c.is_default).map(collection => (
                <div
                  key={collection.name}
                  className={`collection-badge ${collectionFilter.includes(collection.name) ? 'active' : ''}`}
                  onClick={() => toggleCollectionFilter(collection.name)}
                  title={`${collection.name} - custom collection`}
                >
                  📁 {collection.name}
                  <span style={{ marginLeft: '0.3rem', opacity: 0.7 }}>({collection.count})</span>
                </div>
              ))}
            </div>
            <small style={{ opacity: 0.6, fontSize: '0.7em', display: 'block', marginTop: '0.5rem' }}>
              {collectionFilter.length === 0 ? 'Searching all collections' : `Searching ${collectionFilter.length} collection(s)`}
            </small>

            {/* Collection Stats */}
            {collectionStats && (
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{collectionStats.total || 0}</div>
                  <div style={{ fontSize: '0.8em', opacity: 0.7 }}>Total Docs</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{Object.keys(collectionStats).length - 1}</div>
                  <div style={{ fontSize: '0.8em', opacity: 0.7 }}>Collections</div>
                </div>
              </div>
            )}

            {/* Custom Collections Management */}
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ margin: 0 }}>Custom Collections:</label>
                <button
                  onClick={() => setShowCreateCollection(!showCreateCollection)}
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.85em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  title="Create new collection"
                >
                  <Plus size={16} /> New
                </button>
              </div>

              {showCreateCollection && (
                <div style={{ marginBottom: '1rem', padding: '0.8rem', background: 'var(--bg-input)', borderRadius: '8px' }}>
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && createCollection()}
                    placeholder="Collection name (e.g., Research Papers)"
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={createCollection} style={{ flex: 1, fontSize: '0.85em' }}>Create</button>
                    <button onClick={() => { setShowCreateCollection(false); setNewCollectionName('') }} style={{ flex: 1, fontSize: '0.85em', background: '#6b7280' }}>Cancel</button>
                  </div>
                </div>
              )}

              <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {allCollections.filter(c => !c.is_default).map(collection => (
                  <div key={collection.name} className="collection-item" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem',
                    marginBottom: '0.3rem',
                    background: 'var(--bg-input)',
                    borderRadius: '6px',
                    fontSize: '0.85em'
                  }}>
                    <span>
                      📁 {collection.name}
                      <span style={{ marginLeft: '0.5rem', opacity: 0.6 }}>({collection.count})</span>
                    </span>
                    <button
                      onClick={() => deleteCollection(collection.name)}
                      style={{
                        padding: '0.3rem 0.5rem',
                        fontSize: '0.8em',
                        background: '#ef4444',
                        border: 'none'
                      }}
                      title="Delete collection"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {allCollections.filter(c => !c.is_default).length === 0 && (
                  <small style={{ opacity: 0.6, display: 'block', textAlign: 'center', padding: '1rem' }}>
                    No custom collections yet
                  </small>
                )}
              </div>
            </div>

            {/* Upload Target Selection */}
            <div style={{ marginTop: '1rem' }}>
              <label>Upload to Collection:</label>
              <select
                value={selectedUploadCollection}
                onChange={(e) => setSelectedUploadCollection(e.target.value)}
                style={{ fontSize: '0.9em' }}
              >
                <option value="auto">Auto-detect by file type</option>
                {allCollections.map(coll => (
                  <option key={coll.name} value={coll.name}>
                    {coll.name} ({coll.count} docs)
                  </option>
                ))}
              </select>
            </div>

            <div className="upload-area" onClick={() => document.getElementById('file-input').click()} style={{ marginTop: '1rem' }}>
              <Upload size={32} style={{ marginBottom: '1rem', opacity: 0.7 }} />
              <p>Click to upload documents</p>
              <small style={{ opacity: 0.6, fontSize: '0.8em' }}>PDF, Text, Code, Office files</small>
              <input
                id="file-input"
                type="file"
                hidden
                accept=".pdf,.txt,.md,.py,.js,.jsx,.ts,.tsx,.docx,.xlsx,.json,.xml,.html,.css"
                onChange={handleFileUpload}
              />
            </div>
            {uploading && <div style={{ marginTop: '1rem' }}><span className="loading"></span> {uploadStatus}</div>}
            {!uploading && uploadStatus && <div style={{ marginTop: '1rem', color: '#4ade80' }}>{uploadStatus}</div>}
          </div>
        </div>

        {/* Right Panel: Chat */}
        <div className="card right-panel">
          <div className="chat-messages">
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '20%' }}>
                <Bot size={48} />
                <p>Ready to chat with your documents.</p>
                <small style={{ opacity: 0.7 }}>Upload documents and ask questions!</small>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', opacity: 0.7, fontSize: '0.8em' }}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  <span>{msg.role === 'user' ? 'You' : 'RAGulea'}</span>
                </div>
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                {msg.context && (
                  <details style={{ marginTop: '0.5rem', fontSize: '0.8em', opacity: 0.8 }}>
                    <summary style={{ cursor: 'pointer' }}>View Context Sources</summary>
                    {msg.context.map((ctx, i) => (
                      <div key={i} style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
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

          <div className="input-area" style={{ display: 'flex', gap: '1rem' }}>
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
