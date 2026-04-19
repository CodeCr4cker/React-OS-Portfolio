import { useState, useEffect, useCallback, useRef } from 'react'

export function useClock() {
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

export function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initial
    } catch { return initial }
  })
  const set = useCallback(v => {
    setVal(v)
    try { localStorage.setItem(key, JSON.stringify(v)) } catch {}
  }, [key])
  return [val, set]
}

export function useKeyboardShortcuts(handlers) {
  const handlersRef = useRef(handlers)
  useEffect(() => { handlersRef.current = handlers })
  useEffect(() => {
    function onKeyDown(e) {
      const tag = document.activeElement?.tagName?.toLowerCase()
      if (tag === 'input' || tag === 'textarea') return
      for (const [combo, fn] of Object.entries(handlersRef.current)) {
        const parts = combo.toLowerCase().split('+')
        const key = parts[parts.length - 1].trim()
        const ctrl  = parts.includes('ctrl')
        const alt   = parts.includes('alt')
        const shift = parts.includes('shift')
        const pressed = e.key === ' ' ? ' ' : e.key.toLowerCase()
        if (pressed === key && e.ctrlKey === ctrl && e.altKey === alt && e.shiftKey === shift) {
          e.preventDefault()
          fn(e)
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}

export function useOutsideClick(ref, handler) {
  useEffect(() => {
    function listener(e) {
      if (!ref.current || ref.current.contains(e.target)) return
      handler(e)
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}
