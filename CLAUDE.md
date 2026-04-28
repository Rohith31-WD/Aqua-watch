
# AquaWatch - AI Agent Conventions
y reading 
This file provides rules and conventions for any AI agent (like Claude, GPT, or future LLMs) working on the AquaWatch project.

## Project Overview

AquaWatch is a single-file React application for reporting Water, Sanitation, and Hygiene (WASH) issues in Bengaluru, India. All code is in `index.html`.

## 🚨 MANDATORY: Version Control Workflow

**After every working session, the AI agent MUST commit and push changes:**

```bash
# 1. Check status
git status

# 2. Stage all changes
git add -A

# 3. Commit with descriptive message
git commit -m "feat: description of changes

- Change 1
- Change 2"

# 4. Push to GitHub
git push origin master
```

### Quick One-liner
```bash
git add -A && git commit -m "feat: describe changes" && git push origin master
```

### When to Commit
- ✅ After completing any feature
- ✅ After fixing any bug
- ✅ After updating documentation
- ✅ After every working session ends

### Commit Types
| Type | Use For |
|------|---------|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `docs:` | Documentation |
| `style:` | Code style |
| `refactor:` | Refactoring |
| `chore:` | Maintenance |

---

## Critical Rules

### 1. Single File Architecture
- **All code lives in `index.html`**
- Do NOT split into multiple files unless migrating to a proper build system
- CSS goes in `<style>` tag
- JavaScript goes in `<script type="text/babel">` tag
- No external CSS/JS files needed

### 2. Component Location
All React components are defined in this order within the file:
1. Constants (CATEGORIES, STATUSES, BADGES, AI_RESPONSES, HYGIENE_TIPS)
2. Helper functions (compressImage)
3. Context (AppContext, AppProvider)
4. Components (Header, MapView, ReportForm, Dashboard, Leaderboard, ChatBot, HygieneTips, Profile)
5. Main App component

### 3. When Editing Code

#### Adding a New Report Category
```javascript
// Find CATEGORIES object (around line 89)
// Add:
NEW_CATEGORY: { name: 'New Category', icon: '🎯', color: '#hexcode', riskWeight: 5 }
```

#### Adding a New Badge
```javascript
// Find BADGES object (around line 104)
// Add:
NEW_BADGE: { name: 'Badge Name', icon: '🏅', description: 'Earned for...' }
```

#### Adding New AI Response
```javascript
// Find AI_RESPONSES object
// Add new category:
new_category: [
    "Response 1",
    "Response 2"
]
// Then add pattern in getAIResponse() function
```

#### Adding New Hygiene Tip
```javascript
// Find HYGIENE_TIPS array
// Add: { icon: '🎯', tip: 'Your tip here' }
```

### 4. Context API Pattern

Always use the existing context structure:
```javascript
const { 
    reports,      // Array of Report objects
    addReport,   // (reportData) => void
    updateStatus,// (id, status) => void
    currentUser, // User object
    updateUser,  // (updates) => void
    CATEGORIES,  // Category definitions
    STATUSES,    // Status definitions
    BADGES,      // Badge definitions
    showToast    // (message, type) => void
} = useContext(AppContext);
```

### 5. Data Models

Always use these exact types:

```typescript
type CategoryType = 'CONTAMINATED_WATER' | 'BROKEN_FACILITY' | 'OPEN_DRAINAGE' | 'LACK_SOAP' | 'OTHER';
type StatusType = 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
type BadgeType = 'FIRST_REPORTER' | 'WATER_GUARDIAN' | 'CLEAN_STREETS' | 'LIFESAVER';
```

### 6. LocalStorage Keys

DO NOT change these keys - they are used by the app:
- `aquawatch_reports_bengaluru` - Reports array
- `aquawatch_user_profile` - User object

### 7. Bengaluru Coordinates

The app is hardcoded for Bengaluru:
- Center: `12.9716, 77.5946`
- Default zoom: 12
- If adding new sample data, use coordinates near Bengaluru

## Common Patterns

### Adding a New Tab
1. Add to `tabs` array in Header component
2. Add conditional render in App component: `{activeTab === 'tabname' && <NewComponent />}`

### Toast Notifications
```javascript
showToast('Your message here', 'success');  // or 'info'
```

### Adding New Stats to Dashboard
```javascript
// In Dashboard component:
const stats = {
    total: reports.length,
    // Add new stat here
    newStat: reports.filter(r => /* condition */).length
};
```

## Testing Changes

After any code change:
1. Open `index.html` in browser
2. Test the feature you changed
3. Check browser console for errors
4. Verify LocalStorage is working

## Performance Tips

- Avoid unnecessary re-renders
- Use React.memo for expensive components
- Compress images before storing in LocalStorage
- Keep the HTML file under 5000 lines for maintainability

## What NOT to Do

❌ DO NOT create multiple HTML files  
❌ DO NOT add external JavaScript files  
❌ DO NOT change LocalStorage key names  
❌ DO NOT remove existing category/status/badge types (breaks data)  
❌ DO NOT add complex build steps (webpack, vite configs) unless migrating the whole app  
❌ DO NOT use absolute positioning that breaks mobile responsiveness  
❌ DO NOT hardcode coordinates outside Bengaluru  

## Future Migration Path

If the project needs to grow beyond single-file:
1. Set up Vite + React project
2. Move components to `src/components/`
3. Move constants to `src/constants/`
4. Add proper state management (Redux/Zustand)
5. Add backend API
6. This file will be replaced by proper ES modules

## Getting Help

- See [README.md](./README.md) for feature overview
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- See [docs/decisions/](./docs/decisions/) for why technical decisions were made

---

*This file ensures any AI agent can understand and modify AquaWatch correctly. Always read this file first before making changes.*