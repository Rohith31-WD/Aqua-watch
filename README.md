# AquaWatch - Water & Sanitation Monitoring System

A web-based platform for citizens to report and track Water, Sanitation, and Hygiene (WASH) issues in Bengaluru, India.

## 🌊 Overview

AquaWatch enables citizens to:
- **Report WASH issues** with photos, descriptions, and locations
- **Track reports** on an interactive map
- **View community statistics** and leaderboard
- **Get AI assistance** for water safety and hygiene questions

## 🚀 Quick Start

### Option 1: Direct Browser Open
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### Option 2: Using a Local Server
```bash
# Python 3
python -m http.server 8000
# Then open http://localhost:8000

# Node.js
npx serve .
```

## 📱 Features

| Feature | Description |
|---------|-------------|
| **🗺️ Interactive Map** | View all reported issues on OpenStreetMap with color-coded markers |
| **📝 Report Issues** | Submit new WASH issues with category, photo, and location |
| **📊 Dashboard** | View personal and community statistics |
| **🏆 Leaderboard** | See top contributors in the community |
| **💬 AI Chatbot** | Get instant answers about water safety and hygiene |
| **👤 Profile** | Track points, badges, and manage your profile |

## 💡 How to Use

### Submit a Report
1. Click the **📝 Report** tab
2. Select issue category (Contaminated Water, Open Drainage, etc.)
3. Add description and location
4. Optionally attach a photo
5. Click Submit → Earn 10 points!

### Track Reports
- View on the **🗺️ Map** - click markers for details
- Check **📊 Dashboard** for status updates
- Filter by status (Open, Investigating, Resolved)

### Earn Badges
- 🌊 **First Reporter**: Submit your first report
- 🛡️ **Water Guardian**: Submit 5 reports
- 🏆 **Clean Streets**: Submit 10 reports
- 💉 **Lifesaver**: Submit 20 reports

## 🏗️ Project Structure

```
aquawatch/
├── index.html              # Main application (single-file React app)
├── package.json            # NPM configuration
├── vite.config.js         # Vite dev server config
├── tailwind.config.js     # Tailwind CSS config
├── postcss.config.js      # PostCSS config
├── .gitignore             # Git ignore rules
├── .env.example           # Environment variables template
├── README.md              # This file
├── ARCHITECTURE.md        # System design documentation
├── CHANGELOG.md           # Version history
├── CONTRIBUTING.md        # Contribution guidelines
├── CLAUDE.md              # AI agent conventions
├── task_plan.md           # Development task tracking
└── docs/
    └── decisions/         # Architecture Decision Records
        ├── ADR-001.md     # Single HTML file implementation
        ├── ADR-002.md    # LocalStorage for persistence
        ├── ADR-003.md    # OpenStreetMap for mapping
        └── ADR-004.md    # Rule-based AI chatbot
```

## 🔧 Development

### Git Workflow (IMPORTANT)

**After every working session, follow these steps:**

```bash
# 1. Check status
git status

# 2. Stage all changes
git add -A

# 3. Commit with descriptive message
git commit -m "Description of changes made"

# 4. Push to GitHub
git push origin master
```

**Commit Message Format:**
```
<type>: <short description>

- Change 1
- Change 2
- Change 3

Types: feat, fix, docs, style, refactor, chore
```

### Adding New Features

1. **New Report Category**: Add to `CATEGORIES` object (around line 89)
2. **New Badge**: Add to `BADGES` object (around line 104)
3. **New AI Response**: Add to `AI_RESPONSES` object
4. **New Hygiene Tip**: Add to `HYGIENE_TIPS` array

### Code Style
- Uses embedded React components in single HTML file
- Tailwind CSS classes for styling
- Custom CSS animations in `<style>` tag
- All JavaScript in `<script type="text/babel">` block

### Key Constants

```javascript
// Report Categories
CATEGORIES = {
    CONTAMINATED_WATER: { name, icon, color, riskWeight },
    BROKEN_FACILITY: { ... },
    OPEN_DRAINAGE: { ... },
    LACK_SOAP: { ... },
    OTHER: { ... }
}

// Report Statuses
STATUSES = {
    OPEN: { name, bgColor, textColor, borderColor },
    INVESTIGATING: { ... },
    RESOLVED: { ... }
}

// Achievement Badges
BADGES = {
    FIRST_REPORTER: { name, icon, description },
    WATER_GUARDIAN: { ... },
    CLEAN_STREETS: { ... },
    LIFESAVER: { ... }
}
```

## 🧪 Testing

After any code change:
1. Open `index.html` in browser
2. Test the feature
3. Check browser console for errors
4. Verify LocalStorage works
5. **Commit & Push**

## ⚠️ Limitations

- **Data stored locally**: Reports only exist in browser localStorage
- **Single user**: No authentication system
- **Bengaluru only**: Hardcoded coordinates and BBMP references
- **Fake GPS**: New reports use random coordinates near Bengaluru center

See [docs/LIMITATIONS.md](./docs/LIMITATIONS.md) for detailed limitations.

## 📄 Documentation

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design and component structure |
| [docs/decisions/](./docs/decisions/) | Architecture Decision Records (ADRs) |
| [CLAUDE.md](./CLAUDE.md) | AI agent conventions and rules |
| [CHANGELOG.md](./CHANGELOG.md) | Version history and changes |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute |

## 🔗 GitHub Repository

- **URL**: https://github.com/shabeerpasha-cyber/aquawatch
- **Branch**: master
- **Remote**: origin

### Push After Every Session
```bash
git add -A && git commit -m "Session update: <changes>" && git push origin master
```

## 📄 License

MIT License - Created for Bengaluru Water & Sanitation Monitoring.

## 👥 Author

Built with 💙 for Bengaluru's community water safety.

---

**Remember:** Commit and push your changes after every working session!