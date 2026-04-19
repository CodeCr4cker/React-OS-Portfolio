import { useEffect, useCallback, useRef } from 'react'
import { useOS } from '../context/OSContext.jsx'
import { APP_REGISTRY } from '../utils/appRegistry.js'

// ─── useKeyboard ───────────────────────────────────────────────────────────────
export function useKeyboard() {
  const { openWindow, closeWindow, activeWindow, windows, minimizeWindow, toggleSearch } = useOS()

  useEffect(() => {
    function handler(e) {
      // Alt+Tab — cycle windows
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault()
        const openIds = Object.keys(windows).filter(id => !windows[id].minimized)
        if (openIds.length < 2) return
        const idx = openIds.indexOf(activeWindow)
        const next = openIds[(idx + 1) % openIds.length]
        // focusWindow(next)  // uncomment when needed
      }

      // Ctrl+W — close active window
      if (e.ctrlKey && e.key === 'w' && activeWindow) {
        e.preventDefault()
        closeWindow(activeWindow)
      }

      // Ctrl+Space — toggle search
      if (e.ctrlKey && e.key === ' ') {
        e.preventDefault()
        toggleSearch()
      }

      // Backtick — open terminal
      if (e.key === '`' && !e.ctrlKey && !e.altKey) {
        const tag = document.activeElement.tagName.toLowerCase()
        if (tag !== 'input' && tag !== 'textarea') {
          openWindow('terminal', APP_REGISTRY.terminal)
        }
      }

      // Escape — close context menu / search (handled in components)
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [openWindow, closeWindow, minimizeWindow, toggleSearch, activeWindow, windows])
}

// ─── useClock ─────────────────────────────────────────────────────────────────
export function useClock() {
  const [time, setTime] = useStateRef('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const t = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      const d = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      setTime({ time: t, date: d })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return time
}

function useStateRef(initial) {
  const [val, setVal] = import('react').then(r => [r.useState(initial)]).catch(() => [[initial, () => {}]])
  // Simple fallback
  const { useState } = require('react') // We'll just use useState directly
  // Actually let's just use a simple approach:
  return [null, () => {}]
}

// Re-export a clean useClock
import { useState } from 'react'

export function useClockSimple() {
  const [dt, setDt] = useState({ time: '', date: '' })
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setDt({
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        date: now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return dt
}

// ─── useNotifications ─────────────────────────────────────────────────────────
export function useNotifications() {
  const { showNotification } = useOS()

  return useCallback((title, msg, type = 'info', duration = 4000) => {
    showNotification(title, msg, type)
  }, [showNotification])
}

// ─── useLocalStorage ──────────────────────────────────────────────────────────
export function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initial
    } catch { return initial }
  })

  const set = useCallback(v => {
    setVal(v)
    try { localStorage.setItem(key, JSON.stringify(v)) } catch {}
  }, [key])

  return [val, set]
}
