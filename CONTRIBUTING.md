# Contributing to RAGulea

Thank you for your interest in contributing to RAGulea! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ragulea.git
   cd ragulea
   ```
3. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🛠️ Development Setup

### Backend Development

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python main.py
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## 📝 Making Changes

1. **Write clear, concise commit messages**
   - Use present tense ("Add feature" not "Added feature")
   - Reference issues when applicable (#123)

2. **Follow the existing code style**
   - Python: Follow PEP 8
   - JavaScript: Follow the existing ESLint configuration

3. **Test your changes**
   - Ensure the backend starts without errors
   - Verify the frontend builds successfully
   - Test the full workflow (upload, chat, etc.)

## 🔍 Pull Request Process

1. **Update documentation** if needed
   - Update README.md for new features
   - Add comments to complex code

2. **Ensure your code builds**
   ```bash
   # Test backend
   cd backend
   python main.py
   
   # Test frontend build
   cd frontend
   npm run build
   ```

3. **Submit your PR**
   - Provide a clear description of changes
   - Reference any related issues
   - Include screenshots for UI changes

4. **Respond to feedback**
   - Address review comments promptly
   - Make requested changes in new commits

## 🐛 Reporting Bugs

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce the bug
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: OS, Python version, Node version
- **Logs**: Relevant error messages or logs

## 💡 Feature Requests

We welcome feature requests! Please:

- Check if the feature already exists or is planned
- Clearly describe the feature and its benefits
- Provide examples or mockups if applicable

## 📋 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## 🎯 Areas for Contribution

- **Features**: New functionality or improvements
- **Bug Fixes**: Fix reported issues
- **Documentation**: Improve or expand documentation
- **Testing**: Add tests or improve test coverage
- **Performance**: Optimize code performance
- **UI/UX**: Improve user interface and experience

## ❓ Questions?

If you have questions, feel free to:
- Open an issue for discussion
- Reach out to the maintainers

Thank you for contributing to RAGulea! 🎉
