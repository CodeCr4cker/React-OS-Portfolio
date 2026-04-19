import React, { useEffect, useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useOS } from '../context/OSContext.jsx'
import { useKeyboardShortcuts } from '../hooks/useOS.js'
import { useSound } from '../hooks/useSound.js'
import { APP_REGISTRY } from '../utils/appRegistry.js'
import TopBar from './TopBar.jsx'
import Dock from './Dock.jsx'
import Window from './Window.jsx'
import Taskbar from './Taskbar.jsx'
import PerfOverlay from './PerfOverlay.jsx'
import AppSwitcher from './AppSwitcher.jsx'
import NotificationSystem from './ui/NotificationSystem.jsx'
import ContextMenu from './ui/ContextMenu.jsx'
import SearchBar from './ui/SearchBar.jsx'
import SnapIndicator from './ui/SnapIndicator.jsx'

const WALLPAPERS = {
  default:  'url(https://raw.githubusercontent.com/CodeCr4cker/Web-Storage/main/Portofolio-OS/07de4966-b419-48a2-9d13-2e5b2f4f9c42.png)',
  dark:     'linear-gradient(135deg,#000 0%,#0a0c14 100%)',
  neon:     'linear-gradient(135deg,#060810,#0d0820)',
  space:    'url(https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80)',
  mountain: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80)',
  city:     'url(https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80)',
}

function makeCtxItems(openWindow, toggleSearch, onLock) {
  return [
    { icon:'fas fa-terminal',   label:'Open Terminal',     action:()=>openWindow('terminal',APP_REGISTRY.terminal) },
    { icon:'fas fa-palette',    label:'Customize Desktop', action:()=>openWindow('settings',APP_REGISTRY.settings) },
    { type:'sep' },
    { icon:'fas fa-user',       label:'About Me',          action:()=>openWindow('about',   APP_REGISTRY.about)    },
    { icon:'fas fa-folder',     label:'Projects',          action:()=>openWindow('projects',APP_REGISTRY.projects) },
    { icon:'fas fa-code',       label:'Skills',            action:()=>openWindow('skills',  APP_REGISTRY.skills)   },
    { icon:'fas fa-comments',   label:'Chat App',          action:()=>openWindow('chat',    APP_REGISTRY.chat)     },
    { icon:'fas fa-file-alt',   label:'Docs & Resume',     action:()=>openWindow('docs',    APP_REGISTRY.docs)     },
    { icon:'fas fa-folder-open',label:'File Manager',      action:()=>openWindow('files',   APP_REGISTRY.files)    },
    { type:'sep' },
    { icon:'fab fa-github',     label:'GitHub',            action:()=>window.open('https://github.com/CodeCr4cker','_blank') },
    { icon:'fab fa-youtube',    label:'YouTube',           action:()=>window.open('https://youtube.com/@CodeCr4cker','_blank'), iconColor:'#ff0000' },
    { type:'sep' },
    { icon:'fas fa-robot',      label:'AI Assistant',      action:()=>openWindow('ai',      APP_REGISTRY.ai),       iconColor:'var(--neon2)' },
    { icon:'fas fa-search',     label:'Search Apps',       action:()=>toggleSearch() },
    { type:'sep' },
    { icon:'fas fa-lock',       label:'Lock Screen',       action:()=>onLock?.() },
    { icon:'fas fa-sync',       label:'Refresh Desktop',   action:()=>window.location.reload() },
  ]
}

export default function Desktop({ onLock }) {
  const {
    windows, wallpaper, settings,
    openWindow, showContextMenu, hideContextMenu,
    searchOpen, toggleSearch, toggleSetting, showNotification,
  } = useOS()
  const { play } = useSound()
  const [switcherOpen, setSwitcherOpen] = useState(false)

  // Keyboard shortcuts
  useKeyboardShortcuts({
    '`': () => { openWindow('terminal', APP_REGISTRY.terminal); play('windowOpen') },
    'f1': () => openWindow('settings', APP_REGISTRY.settings),
    'f2': () => toggleSetting('performance'),
    'f5': () => openWindow('videos', APP_REGISTRY.videos),
  })

  useEffect(() => {
    const h = (e) => {
      if (e.altKey && e.key === 'Tab') { e.preventDefault(); setSwitcherOpen(s => !s) }
      if (e.key === 'Escape') { setSwitcherOpen(false); hideContextMenu() }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [hideContextMenu])

  const handleContextMenu = useCallback((e) => {
    if (e.target.closest('.window') || e.target.closest('#dock') || e.target.closest('#topbar')) return
    e.preventDefault()
    showContextMenu(e.clientX, e.clientY, makeCtxItems(openWindow, toggleSearch, onLock))
  }, [showContextMenu, openWindow, toggleSearch, onLock])

  const wp = WALLPAPERS[wallpaper] || WALLPAPERS.default

  return (
    <div
      style={{ position:'fixed', inset:0, display:'flex', flexDirection:'column', overflow:'hidden' }}
      onContextMenu={handleContextMenu}
      onClick={hideContextMenu}
    >
      {/* Wallpaper */}
      <div style={{ position:'absolute', inset:0, zIndex:0, backgroundImage:wp, backgroundSize:'cover', backgroundPosition:'center', transition:'background-image 0.5s ease' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(0,0,0,0.55) 0%,rgba(0,10,30,0.45) 50%,rgba(0,0,0,0.60) 100%)' }} />
      </div>

      {/* Scanlines */}
      <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)' }} />

      {/* TopBar */}
      <div id="topbar" style={{ position:'relative', zIndex:300, flexShrink:0 }}>
        <TopBar onSwitcher={() => setSwitcherOpen(s => !s)} onLock={onLock} />
      </div>

      {/* Main */}
      <div style={{ flex:1, display:'flex', overflow:'hidden', position:'relative', zIndex:2 }}>
        <div id="dock"><Dock /></div>

        <div id="workspace" style={{ flex:1, position:'relative', overflow:'hidden' }}>
          <DesktopShortcuts />
          {Object.keys(windows).map(id => <Window key={id} appId={id} />)}
          <Taskbar />
          <SnapIndicator />
        </div>
      </div>

      {/* Overlays */}
      <PerfOverlay />
      <ContextMenu />
      <NotificationSystem />
      <AnimatePresence>{searchOpen && <SearchBar onClose={toggleSearch} />}</AnimatePresence>
      <AppSwitcher open={switcherOpen} onClose={() => setSwitcherOpen(false)} />
    </div>
  )
}

function DesktopShortcuts() {
  const { openWindow } = useOS()
  const { play } = useSound()
  const shortcuts = [
    { appId:'about',    icon:'fas fa-user',     label:'About'    },
    { appId:'projects', icon:'fas fa-folder',   label:'Projects' },
    { appId:'terminal', icon:'fas fa-terminal', label:'Terminal' },
    { appId:'docs',     icon:'fas fa-file-alt', label:'Resume'   },
  ]
  return (
    <div style={{ position:'absolute', top:'1rem', right:'1rem', display:'flex', flexDirection:'column', gap:'0.5rem', zIndex:10 }}>
      {shortcuts.map(s => (
        <div key={s.appId}
          onDoubleClick={() => { openWindow(s.appId, APP_REGISTRY[s.appId]); play('windowOpen') }}
          style={{ width:'70px', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.3rem', cursor:'pointer', padding:'0.4rem', borderRadius:'8px', transition:'background 0.2s', userSelect:'none' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <i className={s.icon} style={{ fontSize:'1.6rem', color:'var(--neon)', filter:'drop-shadow(0 0 6px rgba(0,212,255,0.5))' }} />
          <span style={{ fontSize:'0.6rem', fontFamily:'var(--font-mono)', color:'rgba(255,255,255,0.7)', textAlign:'center', textShadow:'0 1px 4px #000' }}>{s.label}</span>
        </div>
      ))}
    </div>
  )
}
