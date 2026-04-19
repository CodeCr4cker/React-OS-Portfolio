# ⬡ DivyOS — React Edition

A futuristic **OS-style portfolio** built with React 18, Framer Motion, and Context API.  
Transformed from a monolithic 4,300-line HTML file into a modular, scalable production-ready React application.

---

## 🚀 Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # Production build
npm run preview    # Preview production build
```

---

## 🏗️ Architecture

```
src/
├── App.jsx                        # Root — boot, mobile detect, lock screen
├── main.jsx                       # Vite entry point
│
├── context/
│   └── OSContext.jsx              # Global state (Context API + useReducer)
│
├── hooks/
│   └── useOS.js                   # useClock, useLocalStorage, useKeyboardShortcuts
│
├── utils/
│   └── appRegistry.js             # All apps registered with lazy imports
│
├── styles/
│   ├── global.css                 # CSS variables, reset, scrollbars
│   ├── themes.css                 # dark / light / neon / synthwave / matrix
│   └── animations.css             # All @keyframes
│
└── components/
    ├── BootScreen.jsx             # Animated terminal-style boot
    ├── Desktop.jsx                # Main desktop (wallpaper, workspace, shortcuts)
    ├── TopBar.jsx                 # Menu bar (clock, CPU, search, switcher)
    ├── Dock.jsx                   # Side icon dock with tooltips
    ├── Window.jsx                 # Draggable + resizable windows (react-rnd)
    ├── Taskbar.jsx                # Bottom open-windows strip
    ├── LockScreen.jsx             # PIN lock screen with numpad
    ├── PerfOverlay.jsx            # Live FPS/CPU/RAM stats (F2)
    ├── AppSwitcher.jsx            # Alt+Tab window switcher overlay
    ├── MobileUI.jsx               # Full iOS-style mobile layout
    │
    ├── ui/
    │   ├── NotificationSystem.jsx # Animated toast notifications
    │   ├── ContextMenu.jsx        # Right-click context menu
    │   ├── SearchBar.jsx          # Spotlight-style app search
    │   └── SnapIndicator.jsx      # Window snap zone highlight
    │
    └── apps/
        ├── About.jsx              # Profile, timeline, skills preview, contact
        ├── Terminal.jsx           # Full command system (help, open, theme, neofetch…)
        ├── Projects.jsx           # Filterable project cards
        ├── Skills.jsx             # Tabbed skill bars + stats panel
        ├── Chat.jsx               # Firebase real-time chat (demo mode fallback)
        ├── Docs.jsx               # Resume, certificates, education
        ├── Settings.jsx           # Theme, wallpaper, toggles, shortcuts
        ├── Gallery.jsx            # Certificate + photo lightbox
        ├── Videos.jsx             # YouTube embed grid
        ├── FileManager.jsx        # Full file browser (grid/list, rename, delete, upload)
        └── AIAssistant.jsx        # Claude API chat (demo mode without key)
```

---

## ⚙️ Global State (OSContext)

All OS state lives in a single Context + useReducer:

| State slice | Description |
|---|---|
| `windows` | Map of `appId → WindowState` (position, size, minimized, maximized) |
| `windowOrder` | Z-index stack array |
| `activeWindow` | Currently focused app ID |
| `theme` | `dark` \| `light` \| `neon` \| `synthwave` \| `matrix` |
| `wallpaper` | `default` \| `dark` \| `neon` \| `space` \| `mountain` \| `city` |
| `settings` | `{ animations, sounds, transparency, performance }` |
| `notifications` | Active toast array |
| `searchOpen` | Spotlight search state |
| `contextMenu` | `{ x, y, items }` for right-click menu |
| `user` | Firebase auth user object |

---

## 🪟 Window System

- **Drag** — via `react-rnd` `dragHandleClassName`
- **Resize** — SE corner handle, min 320×200
- **Minimize** — removed from z-stack, shown in Taskbar
- **Maximize** — fills workspace (absolute 0,0,100%,100%)
- **Focus** — click any window to bring to front (z-index stacking)
- **Snap zones** — drag to left/right/top edge to snap (visual indicator)
- **Spring animations** — Framer Motion on open/close

---

## 💬 Firebase Chat Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** (Email/Password + Google)
3. Enable **Firestore** database
4. Replace the config in `src/components/apps/Chat.jsx`:

```js
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  // ...
}
```

5. Install Firebase: `npm install firebase`
6. Uncomment the Firebase initialization and chat logic in `Chat.jsx`

---

## 🤖 AI Assistant Setup

The AI Assistant runs in **demo mode** without an API key (simulated responses).

To enable full Claude AI:
1. Get an API key from [console.anthropic.com](https://console.anthropic.com)
2. Open the AI app → click ⚙️ → paste your `sk-ant-...` key
3. Key is saved to localStorage — persists across sessions

---

## 🎨 Themes

Change via Settings app or Terminal command `theme <name>`:

| Theme | Accent | Background |
|---|---|---|
| `dark` | `#00d4ff` cyan | `#0a0c14` |
| `light` | `#0369a1` blue | `#f0f4f8` |
| `neon` | `#ff00ff` magenta | `#060810` |
| `synthwave` | `#ff6ec7` pink | `#0f0826` |
| `matrix` | `#00ff41` green | `#000a00` |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `` ` `` (backtick) | Open Terminal |
| `Ctrl+Space` | Search apps |
| `Ctrl+W` | Close active window |
| `Alt+Tab` | App Switcher overlay |
| `F1` | Open Settings |
| `F2` | Toggle Performance overlay |
| `F5` | Open Videos |
| `Esc` | Close menus / search |

---

## 📱 Mobile

On screens ≤768px, the app automatically switches to a full **iOS-style mobile UI**:
- App grid (4 columns) with app icon cards
- Bottom dock (4 pinned apps)
- Full-screen app views with back button
- Touch-optimized (tap, swipe, no hover)

---

## 🔒 Lock Screen

- PIN: `1234` (change in `LockScreen.jsx`)
- Click anywhere or enter PIN to unlock
- Press `?` for PIN hint
- Idle auto-lock (configurable, disabled by default)

---

## 📦 PWA

The app is PWA-ready via `vite-plugin-pwa`:
- Offline support (Workbox caching)
- Installable ("Add to Home Screen")
- Custom manifest + icons
- Service worker auto-registration

---

## 🔧 Adding a New App

1. Create `src/components/apps/MyApp.jsx`
2. Add to `src/utils/appRegistry.js`:
```js
myapp: {
  id: 'myapp',
  title: 'My App',
  icon: 'fas fa-star',
  color: '#ff6ec7',
  gradient: 'linear-gradient(135deg, #ff6ec7, #7b2ff7)',
  width: 700, height: 500,
  component: lazy(() => import('../components/apps/MyApp.jsx')),
  dockVisible: true,
},
```
3. Add `'myapp'` to `DOCK_APPS` array
4. Done! App appears in dock, search, context menu, and terminal `open` command.

---

## 📄 License

MIT — Divyanshu Pandey © 2024
