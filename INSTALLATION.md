# 📦 RAGulea Installation Guide

Complete step-by-step installation guide for Windows.

## ⏱️ Total Time: ~30 minutes

- Prerequisites: 20 minutes
- RAGulea: 2 minutes
- First run: 5 minutes

## 📋 What You'll Install

1. **MongoDB** - Database for storing documents (~500MB)
2. **Ollama** - AI model runtime (~200MB)
3. **AI Models** - Language models (~6-8GB)
4. **RAGulea** - The application (~80MB)

**Total disk space needed:** ~10GB

---

## Step 1: Install MongoDB (5 minutes)

### Download
1. Go to: https://www.mongodb.com/try/download/community
2. Select: **Windows x64**
3. Click: **Download**

### Install
1. Run the downloaded `.msi` file
2. Choose: **Complete** installation
3. Check: ✅ **Install MongoDB as a Service**
4. Check: ✅ **Run service as Network Service user**
5. Click: **Next** → **Install**
6. Wait for installation to complete

### Verify
1. Open **Command Prompt** (Win + R → type `cmd` → Enter)
2. Type: `mongosh`
3. You should see: `Connected to: mongodb://localhost:27017/`
4. Type: `exit` to close

✅ **MongoDB is ready!**

---

## Step 2: Install Ollama (2 minutes)

### Download
1. Go to: https://ollama.ai/download/windows
2. Click: **Download for Windows**

### Install
1. Run the downloaded `.exe` file
2. Follow the installation wizard
3. Ollama will start automatically in the background

### Verify
1. Open **Command Prompt**
2. Type: `ollama list`
3. You should see: `NAME    ID    SIZE    MODIFIED` (empty list is OK)

✅ **Ollama is ready!**

---

## Step 3: Download AI Models (10-20 minutes)

This step downloads the AI models. Time depends on your internet speed.

### Open Command Prompt
Press **Win + R** → type `cmd` → press **Enter**

### Download Embedding Model (Required)
```bash
ollama pull mxbai-embed-large
```
Wait for: `✓ success` (~1GB, 2-5 minutes)

### Download Generation Model (Choose ONE)

**Option A: Llama 3 (Recommended)**
```bash
ollama pull llama3
```
Size: 4.7GB | Time: 5-10 minutes | Quality: Excellent

**Option B: Mistral**
```bash
ollama pull mistral
```
Size: 4.1GB | Time: 5-10 minutes | Quality: Excellent

**Option C: Phi 3 (Faster, smaller)**
```bash
ollama pull phi3
```
Size: 2.3GB | Time: 3-5 minutes | Quality: Good

### Verify Models
```bash
ollama list
```
You should see your downloaded models listed.

✅ **AI Models are ready!**

---

## Step 4: Install RAGulea (2 minutes)

### Download
1. Go to: https://github.com/jacknavodari/ragulea/releases
2. Download: **RAGulea.msi** (latest version)

### Install
1. Run the downloaded `RAGulea.msi` file
2. Click: **Next** → **Install**
3. Click: **Finish**

### Launch
1. Open **Start Menu**
2. Search for: **RAGulea**
3. Click to launch

✅ **RAGulea is installed!**

---

## 🎉 First Run

When you launch RAGulea:

1. A console window will open (don't close it!)
2. You'll see:
   ```
   🔍 Checking prerequisites...
   ✅ MongoDB: Connected
   ✅ Ollama: Connected (2 models available)
   🚀 RAGulea Server Starting...
   ```
3. Your browser will open automatically
4. You'll see the RAGulea interface

### First Steps:
1. **Select Model**: Choose your generation model (e.g., llama3)
2. **Upload Document**: Click upload area, select a PDF or text file
3. **Wait**: Document will be processed (may take 30-60 seconds)
4. **Chat**: Ask questions about your document!

---

## 🔧 Troubleshooting

### "MongoDB: NOT RUNNING"

**Solution 1: Start MongoDB Service**
```bash
net start MongoDB
```

**Solution 2: Reinstall MongoDB**
- Make sure to check "Install as Service" during installation

### "Ollama: NOT RUNNING"

**Solution 1: Start Ollama**
```bash
ollama serve
```
Keep this window open while using RAGulea.

**Solution 2: Restart Computer**
Ollama should start automatically after restart.

### "No models found"

**Solution: Download models**
```bash
ollama pull mxbai-embed-large
ollama pull llama3
```

### Port Already in Use

RAGulea will automatically try ports 8000-8100. If all are busy:
- Close other applications
- Restart RAGulea

### Browser Doesn't Open

Manually open: `http://localhost:8000`

---

## 🔄 Uninstalling

### Uninstall RAGulea
1. **Settings** → **Apps** → **RAGulea** → **Uninstall**

### Uninstall Ollama (Optional)
1. **Settings** → **Apps** → **Ollama** → **Uninstall**
2. Delete folder: `C:\Users\YourName\.ollama`

### Uninstall MongoDB (Optional)
1. **Settings** → **Apps** → **MongoDB** → **Uninstall**
2. Delete folder: `C:\Program Files\MongoDB`

---

## 📞 Need Help?

- **Documentation**: https://github.com/jacknavodari/ragulea
- **Issues**: https://github.com/jacknavodari/ragulea/issues
- **Quick Start**: See QUICKSTART.md

---

## ✅ Installation Checklist

- [ ] MongoDB installed and running
- [ ] Ollama installed and running
- [ ] Embedding model downloaded (mxbai-embed-large)
- [ ] Generation model downloaded (llama3/mistral/phi3)
- [ ] RAGulea installed
- [ ] RAGulea launches successfully
- [ ] Browser opens automatically
- [ ] Can upload and chat with documents

**All checked?** You're ready to use RAGulea! 🎉
