mak frine # Contributing to AquaWatch

Thank you for your interest in contributing to AquaWatch! This document will help you get started.

---

## 🚨 IMPORTANT: Version Control Workflow

**After every working session, you MUST commit and push your changes:**

```bash
# 1. Navigate to project
cd aquawatch/

# 2. Check what changed
git status

# 3. Stage all changes
git add -A

# 4. Commit with descriptive message
git commit -m "feat: add new feature X

- Change 1
- Change 2
- Fixed bug Y"

# 5. Push to GitHub
git push origin master
```

### Commit Message Types
| Type | Use For |
|------|---------|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `docs:` | Documentation changes |
| `style:` | Code style changes |
| `refactor:` | Code refactoring |
| `chore:` | Maintenance tasks |

### Example Commit Messages
```bash
# Good commit messages
git commit -m "docs: update README with git workflow"
git commit -m "feat: add new report category for flooding"
git commit -m "fix: resolve photo upload issue on mobile"
git commit -m "chore: add AI response for water safety"
```

---

## 🤔 How Can I Contribute?

### Reporting Bugs
- Check if the bug already exists in issues
- Use a clear title and description
- Include steps to reproduce the bug
- Mention your browser and operating system

### Suggesting Features
- Check existing issues first
- Describe the feature in detail
- Explain why this feature would be useful
- Consider the scope (prototype vs. production)

### Pull Requests
- Keep changes focused and small
- Test your changes in the browser
- Update documentation if needed
- Follow the code style (see CLAUDE.md)

## 🏗️ Development Setup

### Option 1: Quick Start (No Setup)
```bash
# Just open the file directly
start index.html  # Windows
open index.html   # macOS
xdg-open index.html  # Linux
```

### Option 2: Local Server (Recommended for Development)
```bash
# Python 3
python -m http.server 8000
# Open http://localhost:8000

# Node.js
npx serve .
```

### Option 3: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

## 📝 Code Style

- All code in **single `index.html` file**
- Use **Tailwind CSS classes** for styling
- Use **React functional components** with hooks
- Add custom CSS in `<style>` tag
- Keep components in the order specified in CLAUDE.md

### Example: Adding a New Feature

```javascript
// 1. Define constants at the top
const NEW_FEATURE = { /* ... */ };

// 2. Create component
function NewComponent() {
    const { /* use context */ } = useContext(AppContext);
    return ( /* JSX */ );
}

// 3. Add to navigation (in Header)
// 4. Add to router (in App)
```

## 🧪 Testing

Test your changes by:
1. Opening `index.html` in multiple browsers
2. Checking browser console for errors
3. Verifying LocalStorage works correctly
4. Testing responsive design on mobile viewport
5. Testing image upload functionality

## 📋 Documentation

When adding new features:
- Update README.md with new functionality
- Add ADRs in docs/decisions/ for architectural changes
- Update CHANGELOG.md with version and date
- Update CLAUDE.md if new patterns are introduced

## ⚠️ What NOT to Change

Without proper migration planning:
- ❌ Don't split into multiple files
- ❌ Don't change LocalStorage key names
- ❌ Don't remove existing data types
- ❌ Don't add complex build tools (unless migrating whole app)

## 💬 Getting Help

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Be respectful and inclusive

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping make AquaWatch better for Bengaluru's community!** 🚀