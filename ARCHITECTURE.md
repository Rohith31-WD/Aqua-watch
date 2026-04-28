winget install GitHub.cli# AquaWatch Architecture

## System Overview

AquaWatch is a single-page web application that allows citizens to report and track Water, Sanitation, and Hygiene (WASH) issues in Bengaluru, India. It uses a client-side only architecture with no backend server.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  React 18 App                         │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │   │
│  │  │ Header  │ │ MapView │ │ReportForm│ │Dashboard│    │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘    │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │   │
│  │  │Leaderboard│ │ChatBot │ │Profile │ │HygieneTips│   │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘    │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │              AppContext (State Management)           │   │
│  │   - reports[]                                        │   │
│  │   - currentUser                                      │   │
│  │   - CATEGORIES, STATUSES, BADGES                     │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │              LocalStorage (Persistence)             │   │
│  │   - aquawatch_reports_bengaluru                     │   │
│  │   - aquawatch_user_profile                          │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  External Services (via CDN)                                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│  │ React 18 CDN │ │ Tailwind CSS │ │ Leaflet +    │     │
│  │              │ │    CDN       │ │ OpenStreetMap│     │
│  └──────────────┘ └──────────────┘ └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Component Structure

### Main Components

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| **App** | Root component, router | Tab-based navigation |
| **Header** | Navigation bar | User info, active tab indicator |
| **MapView** | Interactive map | Leaflet.js + OpenStreetMap |
| **ReportForm** | Submit new reports | Photo upload, category selection |
| **Dashboard** | Statistics view | Personal + community stats |
| **Leaderboard** | Community rankings | Top 3 display, full list |
| **ChatBot** | AI assistant | Rule-based responses |
| **HygieneTips** | Rotating tips banner | Auto-rotate every 8s |
| **Profile** | User profile management | Edit name, bio, contact info |

### Component Hierarchy

```
App
├── AppProvider (Context)
│   ├── Header
│   │   └── (uses currentUser, BADGES from context)
│   ├── MapView
│   │   └── (uses reports, CATEGORIES, STATUSES)
│   ├── ReportForm
│   │   └── (uses addReport, CATEGORIES, currentUser)
│   ├── Dashboard
│   │   └── (uses reports, updateStatus, currentUser)
│   ├── Leaderboard
│   │   └── (uses currentUser, reports, BADGES)
│   ├── ChatBot
│   │   └── (AI_RESPONSES, HYGIENE_TIPS)
│   ├── Profile
│   │   └── (uses currentUser, updateUser, BADGES)
│   └── HygieneTips
│       └── (HYGIENE_TIPS)
└── Toast (notification)
```

## Data Models

### Report Object
```typescript
interface Report {
    id: string;              // UUID
    category: CategoryType;  // CONTAMINATED_WATER | BROKEN_FACILITY | OPEN_DRAINAGE | LACK_SOAP | OTHER
    description: string;     // User description
    latitude: number;        // GPS coordinate
    longitude: number;       // GPS coordinate
    address: string;         // Location text
    status: StatusType;      // OPEN | INVESTIGATING | RESOLVED
    riskScore: number;       // 0-100
    reporterName: string;    // From currentUser.name
    photo: string | null;    // Base64 encoded image
}
```

### User Object
```typescript
interface User {
    name: string;
    email: string;
    phone: string;
    location: string;
    points: number;
    badges: BadgeType[];
    reportsCount: number;
    joinedDate: string;
    bio: string;
    photo: string | null;
}
```

### Category Type
```typescript
type CategoryType = 'CONTAMINATED_WATER' | 'BROKEN_FACILITY' | 'OPEN_DRAINAGE' | 'LACK_SOAP' | 'OTHER';

interface Category {
    name: string;
    icon: string;     // Emoji
    color: string;    // Hex color for map markers
    riskWeight: number;
}
```

### Status Type
```typescript
type StatusType = 'OPEN' | 'INVESTIGATING' | 'RESOLVED';

interface Status {
    name: string;
    bgColor: string;      // Tailwind class
    textColor: string;   // Tailwind class
    borderColor: string; // Tailwind class
}
```

### Badge Type
```typescript
type BadgeType = 'FIRST_REPORTER' | 'WATER_GUARDIAN' | 'CLEAN_STREETS' | 'LIFESAVER';

interface Badge {
    name: string;
    icon: string;
    description: string;
}
```

## State Management

### AppContext (React Context API)

The entire application state is managed through a single React Context:

```javascript
const AppContext = createContext();

const { 
    reports,      // Array of Report objects
    addReport,   // Function to add new report
    updateStatus,// Function to update report status
    currentUser, // Current user object
    updateUser, // Function to update user profile
    CATEGORIES, // Category definitions
    STATUSES,   // Status definitions
    BADGES,     // Badge definitions
    showToast   // Function to show notifications
} = useContext(AppContext);
```

### State Persistence

Data is persisted to browser LocalStorage:

| Key | Data | Frequency |
|-----|------|-----------|
| `aquawatch_reports_bengaluru` | reports array | On every change |
| `aquawatch_user_profile` | currentUser object | On every change |

## AI/ML Features

### Rule-Based Chatbot

The chatbot uses pattern matching to provide responses:

```
User Input → Keyword Detection → Category Matching → Random Response Selection
```

**Response Categories:**
- `greeting` - Welcome messages
- `water_safety` - Water quality advice
- `contamination` - Contamination warnings
- `hygiene` - Hand washing, sanitation tips
- `sanitation` - Toilet, drainage issues
- `health` - Health symptoms from dirty water
- `emergency` - Urgent situations
- `general` - WASH information
- `water_sources` - Bengaluru water sources

### Rotating Hygiene Tips

A banner at the bottom of every page that rotates through tips every 8 seconds. Tips are stored in the `HYGIENE_TIPS` array.

## Styling Architecture

### Tailwind CSS

- Used via CDN for rapid styling
- Custom color scheme: Cyan/Blue gradient theme
- Responsive design with mobile-first approach

### Custom CSS

Located in `<style>` tag within `index.html`:

| Class | Purpose |
|-------|---------|
| `.fade-in` | Page entry animation |
| `.slide-up` | Content slide animation |
| `.scale-in` | Card scale animation |
| `.float` | Floating emoji animation |
| `.glow` | Pulsing glow effect |
| `.glass` | Glassmorphism effect |
| `.card` | Hover card effect |
| `.nav-btn` | Navigation button styling |
| `.btn-primary` | Primary button gradient |
| `.leaderboard-card` | Podium card styling |
| `.badge` | Badge hover effect |
| `.ripple` | Button ripple effect |

## Map Integration

### Leaflet.js + OpenStreetMap

- **Map Provider**: OpenStreetMap (free, no API key)
- **Library**: Leaflet.js 1.9.4
- **Default View**: Bengaluru center (12.9716°N, 77.5946°E)
- **Default Zoom**: 12

### Custom Markers

Markers are color-coded based on:
- **Category**: Uses category.color
- **Status**: Green for RESOLVED, category color otherwise
- **Animation**: Staggered appearance based on index

### Popups

Each marker shows a popup with:
- Photo (if available)
- Category icon + name
- Status badge
- Description
- Address
- Reporter name
- Risk score

## Image Handling

### Photo Compression

Images are compressed client-side before storage:

1. User selects image via file input
2. Image is loaded into canvas (max 800px dimension)
3. Compressed to JPEG at 70% quality
4. Further compressed if > 500KB
5. Stored as base64 string in LocalStorage

### Compression Function

```javascript
function compressImage(file, maxSizeKB = 500, quality = 0.7) {
    // Returns: base64 encoded string
}
```

## Security Considerations

### Current (Prototype Level)

- No authentication required
- Data stored in browser LocalStorage only
- No server-side validation

### Recommended for Production

- Add user authentication (OAuth, JWT)
- Implement input sanitization
- Add rate limiting
- Use server-side validation
- Implement HTTPS
- Add CSRF protection

## Performance Optimizations

### Current Optimizations
- Single HTML file (no build step)
- CDN resources with caching
- Lazy map loading
- Efficient React re-renders via Context

### Potential Future Optimizations
- Virtualized lists for large report counts
- Image compression before upload
- Service worker for offline support
- Code splitting if converted to SPA build

## Browser Compatibility

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Uses:
- ES6+ JavaScript features
- CSS3 Animations
- LocalStorage API
- FileReader API
- Canvas API

## Future Considerations

For production deployment, consider:

1. **Backend**: Add Node.js/Express or use Firebase/Supabase
2. **Authentication**: Implement user login/signup
3. **Maps API**: Switch to Google Maps for better India coverage
4. **Notifications**: Push notifications for status updates
5. **Email Integration**: Send alerts to BBMP
6. **Mobile App**: React Native or Flutter wrapper
7. **Analytics**: Track user engagement
8. **Multi-city**: Expand beyond Bengaluru

---

See [docs/decisions/](./docs/decisions/) for Architecture Decision Records (ADRs) documenting key technical choices.