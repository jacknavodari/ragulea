# 📦 GitHub Repository Setup Guide

This guide will help you push RAGulea to GitHub.

## Files Ready for GitHub

Your repository is now organized and ready to push. Here's what's included:

### ✅ Source Code
- `backend/` - Python FastAPI backend
  - `main.py` - Main application
  - `requirements.txt` - Python dependencies
  - `ragulea.spec` - PyInstaller configuration
  - `uploads/` - Upload directory (with .gitkeep)
- `frontend/` - React frontend
  - `src/` - Source code
  - `package.json` - Node dependencies
  - `vite.config.js` - Build configuration
- `wix/` - Windows installer configuration
  - `product.wxs` - WiX installer definition

### ✅ Documentation
- `README.md` - Main project documentation
- `QUICKSTART.md` - Quick start guide for users
- `ARCHITECTURE.md` - Technical architecture details
- `CONTRIBUTING.md` - Contribution guidelines
- `LICENSE` - MIT License

### ✅ Configuration Files
- `.gitignore` - Git ignore rules
- `.github/workflows/build.yml` - CI/CD workflow

### ❌ Excluded (via .gitignore)
- `node_modules/` - Node dependencies
- `venv/` - Python virtual environment
- `build/` and `dist/` - Build artifacts
- `*.msi` - Installer files
- `*.log` - Log files
- `__pycache__/` - Python cache
- User uploads and temporary files

## Step-by-Step: Push to GitHub

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it: `ragulea` (or your preferred name)
4. Description: "A desktop RAG application for chatting with documents using local AI"
5. Choose: **Public** or **Private**
6. **DO NOT** initialize with README (we already have one)
7. Click "Create repository"

### 2. Initialize Git (if not already done)

```bash
cd C:\Users\jack\Desktop\ragulea

# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: RAGulea desktop RAG application"
```

### 3. Connect to GitHub

Replace `YOUR_USERNAME` with your GitHub username:

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/ragulea.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 4. Verify Upload

1. Go to your GitHub repository
2. You should see all files and folders
3. README.md will be displayed on the main page

## Creating a Release

To distribute the installer via GitHub Releases:

### 1. Build the Installer

```bash
# Build frontend
cd frontend
npm run build

# Build executable
cd ../backend
venv\Scripts\activate
pyinstaller ragulea.spec --clean

# Build installer
cd ../wix
wix build product.wxs -o RAGulea.msi
```

### 2. Create GitHub Release

1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: `RAGulea v1.0.0 - Initial Release`
5. Description:
   ```markdown
   ## 🎉 First Release of RAGulea
   
   A desktop RAG application for chatting with your documents using local AI.
   
   ### Features
   - 📄 Upload PDF and text files
   - 🤖 Chat with documents using Ollama
   - 💾 Local MongoDB storage
   - 🔒 Complete privacy - everything runs locally
   
   ### Installation
   1. Download `RAGulea.msi` below
   2. Install MongoDB and Ollama (see README)
   3. Run the installer
   4. Launch RAGulea from Start Menu
   
   ### Requirements
   - Windows 10/11
   - MongoDB (local)
   - Ollama with models
   
   See [Quick Start Guide](QUICKSTART.md) for detailed instructions.
   ```
6. Upload `wix/RAGulea.msi` as a release asset
7. Click "Publish release"

## Repository Settings (Optional)

### Add Topics

Go to repository → About → Settings (gear icon) → Add topics:
- `rag`
- `ollama`
- `mongodb`
- `fastapi`
- `react`
- `desktop-app`
- `ai`
- `llm`
- `python`
- `javascript`

### Enable GitHub Pages (Optional)

If you want to host documentation:
1. Settings → Pages
2. Source: Deploy from branch
3. Branch: `main` → `/docs`
4. Save

### Add Repository Description

In "About" section:
- Description: "Desktop RAG application for chatting with documents using local AI (Ollama + MongoDB)"
- Website: (your website if any)
- Topics: (as listed above)

## Maintaining the Repository

### For New Features

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature: description"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request on GitHub
```

### For Bug Fixes

```bash
# Create fix branch
git checkout -b fix/bug-description

# Make changes and commit
git add .
git commit -m "Fix: bug description"

# Push and create PR
git push origin fix/bug-description
```

### Updating Version

When releasing new versions:

1. Update version in `wix/product.wxs`:
   ```xml
   <Package Name="RAGulea" Version="1.1.0" ...>
   ```

2. Commit and tag:
   ```bash
   git add .
   git commit -m "Bump version to 1.1.0"
   git tag v1.1.0
   git push origin main --tags
   ```

3. Create new GitHub Release with the tag

## Useful Git Commands

```bash
# Check status
git status

# View changes
git diff

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Update from remote
git pull origin main

# View remotes
git remote -v
```

## Next Steps

After pushing to GitHub:

1. ✅ Add a nice banner image to README (optional)
2. ✅ Set up GitHub Actions for automated builds
3. ✅ Add issue templates
4. ✅ Create a project board for tracking features
5. ✅ Add screenshots to README
6. ✅ Share your project!

## Support

If you encounter issues:
- Check `.gitignore` is working: `git status` should not show build artifacts
- Verify remote: `git remote -v`
- Check branch: `git branch`

---

Your repository is ready! 🚀 Happy coding!
