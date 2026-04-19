import { lazy } from 'react'

const About        = lazy(() => import('../components/apps/About.jsx'))
const Terminal     = lazy(() => import('../components/apps/Terminal.jsx'))
const Projects     = lazy(() => import('../components/apps/Projects.jsx'))
const Skills       = lazy(() => import('../components/apps/Skills.jsx'))
const Chat         = lazy(() => import('../components/apps/Chat.jsx'))
const Docs         = lazy(() => import('../components/apps/Docs.jsx'))
const Settings     = lazy(() => import('../components/apps/Settings.jsx'))
const Gallery      = lazy(() => import('../components/apps/Gallery.jsx'))
const Videos       = lazy(() => import('../components/apps/Videos.jsx'))
const FileManager  = lazy(() => import('../components/apps/FileManager.jsx'))
const AIAssistant  = lazy(() => import('../components/apps/AIAssistant.jsx'))
const Social       = lazy(() => import('../components/apps/Social.jsx'))

export const APP_REGISTRY = {
  about:    { id:'about',    title:'About Me',      icon:'fas fa-user',         color:'#667eea', gradient:'linear-gradient(135deg,#667eea,#764ba2)', width:750, height:560, component:About,       dockVisible:true  },
  terminal: { id:'terminal', title:'Terminal',      icon:'fas fa-terminal',     color:'#39ff14', gradient:'linear-gradient(135deg,#1a1a2e,#16213e)', width:700, height:460, component:Terminal,    dockVisible:true  },
  projects: { id:'projects', title:'Projects',      icon:'fas fa-folder-open',  color:'#f093fb', gradient:'linear-gradient(135deg,#f093fb,#f5576c)', width:820, height:600, component:Projects,    dockVisible:true  },
  skills:   { id:'skills',   title:'Skills',        icon:'fas fa-code',         color:'#4facfe', gradient:'linear-gradient(135deg,#4facfe,#00f2fe)', width:720, height:540, component:Skills,      dockVisible:true  },
  chat:     { id:'chat',     title:'Chat',          icon:'fas fa-comments',     color:'#00d4ff', gradient:'linear-gradient(135deg,#00d4ff,#7b2ff7)', width:800, height:600, component:Chat,        dockVisible:true  },
  docs:     { id:'docs',     title:'Docs & Resume', icon:'fas fa-file-alt',     color:'#a8c0ff', gradient:'linear-gradient(135deg,#a8c0ff,#3f2b96)', width:760, height:580, component:Docs,        dockVisible:true  },
  settings: { id:'settings', title:'Settings',      icon:'fas fa-cog',          color:'#a8c0ff', gradient:'linear-gradient(135deg,#a8c0ff,#3f2b96)', width:680, height:540, component:Settings,    dockVisible:true  },
  gallery:  { id:'gallery',  title:'Gallery',       icon:'fas fa-images',       color:'#ffa500', gradient:'linear-gradient(135deg,#ffa500,#ffb627)', width:800, height:600, component:Gallery,     dockVisible:true  },
  videos:   { id:'videos',   title:'Videos',        icon:'fas fa-play-circle',  color:'#ff4757', gradient:'linear-gradient(135deg,#ff4757,#c0392b)', width:820, height:620, component:Videos,      dockVisible:true  },
  files:    { id:'files',    title:'File Manager',  icon:'fas fa-folder',       color:'#f59e0b', gradient:'linear-gradient(135deg,#f59e0b,#d97706)', width:800, height:580, component:FileManager, dockVisible:true  },
  ai:       { id:'ai',       title:'AI Assistant',  icon:'fas fa-robot',        color:'#7b2ff7', gradient:'linear-gradient(135deg,#7b2ff7,#00d4ff)', width:720, height:560, component:AIAssistant, dockVisible:true  },
  social:   { id:'social',   title:'Social Links',  icon:'fas fa-share-alt',    color:'#f107a3', gradient:'linear-gradient(135deg,#f107a3,#7b2ff7)', width:680, height:600, component:Social,      dockVisible:true  },
}

export const EXTERNAL_APPS = {
  github:   { id:'github',   title:'GitHub',    icon:'fab fa-github',   color:'#ffffff', gradient:'linear-gradient(135deg,#24292e,#444)', url:'https://github.com/CodeCr4cker',        dockVisible:true  },
  youtube:  { id:'youtube',  title:'YouTube',   icon:'fab fa-youtube',  color:'#ff0000', gradient:'linear-gradient(135deg,#ff0000,#cc0000)', url:'https://youtube.com/@CodeCr4cker',  dockVisible:false },
  linkedin: { id:'linkedin', title:'LinkedIn',  icon:'fab fa-linkedin', color:'#0a66c2', gradient:'linear-gradient(135deg,#0a66c2,#004182)', url:'https://linkedin.com',             dockVisible:false },
}

export const DOCK_APPS = [
  'about','terminal','projects','skills',
  'chat','docs','gallery','videos',
  'files','ai','social',
  'settings','github',
]
