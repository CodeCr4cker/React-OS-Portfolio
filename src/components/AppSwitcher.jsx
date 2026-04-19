import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOS } from '../context/OSContext.jsx'
import { APP_REGISTRY } from '../utils/appRegistry.js'

export default function AppSwitcher({ open, onClose }) {
  const { windows, focusWindow, restoreWindow, closeWindow, activeWindow } = useOS()
  const [selected, setSelected] = useState(0)
  const openApps = Object.values(windows)

  useEffect(() => {
    if (!open) return
    const idx = openApps.findIndex(w => w.appId === activeWindow)
    setSelected(idx >= 0 ? idx : 0)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Tab') {
        e.preventDefault()
        setSelected(s => (s + 1) % openApps.length)
      }
      if (e.key === 'Enter' || e.key === ' ') {
        const win = openApps[selected]
        if (win) {
          if (win.minimized) restoreWindow(win.appId)
          else focusWindow(win.appId)
        }
        onClose()
      }
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setSelected(s => (s + 1) % openApps.length)
      if (e.key === 'ArrowLeft') setSelected(s => (s - 1 + openApps.length) % openApps.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, selected, openApps, onClose, focusWindow, restoreWindow])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 7000,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(16px)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '1.5rem',
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}
          >
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
              color: 'var(--neon)', letterSpacing: '3px', textTransform: 'uppercase',
            }}>
              Open Applications
            </div>

            {openApps.length === 0 ? (
              <div style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                No windows open
              </div>
            ) : (
              <div style={{
                display: 'flex', gap: '1rem', flexWrap: 'wrap',
                justifyContent: 'center', maxWidth: '80vw',
              }}>
                {openApps.map((win, i) => {
                  const cfg = APP_REGISTRY[win.appId]
                  const isSelected = i === selected
                  return (
                    <motion.div
                      key={win.appId}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (win.minimized) restoreWindow(win.appId)
                        else focusWindow(win.appId)
                        onClose()
                      }}
                      style={{
                        width: '120px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem',
                        padding: '1rem 0.75rem', borderRadius: '16px',
                        background: isSelected ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.06)',
                        border: `2px solid ${isSelected ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
                        cursor: 'pointer', position: 'relative',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.15s',
                        boxShadow: isSelected ? '0 0 20px rgba(0,212,255,0.2)' : 'none',
                      }}
                    >
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '14px',
                        background: cfg?.gradient || 'var(--surface2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.3rem', color: '#fff',
                        boxShadow: isSelected ? `0 4px 16px ${cfg?.color || 'var(--neon)'}66` : 'none',
                      }}>
                        <i className={cfg?.icon || 'fas fa-window-maximize'} />
                      </div>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
                        color: isSelected ? 'var(--neon)' : 'rgba(255,255,255,0.7)',
                        textAlign: 'center', lineHeight: 1.3,
                      }}>
                        {win.title}
                      </span>
                      {win.minimized && (
                        <span style={{
                          position: 'absolute', top: '6px', right: '6px',
                          fontSize: '0.5rem', color: 'var(--text-dim)',
                          background: 'rgba(0,0,0,0.4)', padding: '1px 4px', borderRadius: '3px',
                        }}>MIN</span>
                      )}
                      <button
                        onClick={e => { e.stopPropagation(); closeWindow(win.appId) }}
                        style={{
                          position: 'absolute', top: '-6px', right: '-6px',
                          width: '20px', height: '20px', borderRadius: '50%',
                          background: '#ff5f56', border: 'none', cursor: 'pointer',
                          color: '#fff', fontSize: '0.55rem', display: 'none',
                          alignItems: 'center', justifyContent: 'center',
                        }}
                        onMouseEnter={e => e.currentTarget.style.display = 'flex'}
                      />
                    </motion.div>
                  )
                })}
              </div>
            )}

            <div style={{
              display: 'flex', gap: '1.5rem',
              fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-dim)',
            }}>
              {[['Tab / →', 'Cycle'], ['Enter', 'Switch'], ['Esc', 'Close']].map(([k, l]) => (
                <span key={k}>
                  <kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px', color: 'var(--neon)' }}>{k}</kbd>
                  {' '}{l}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
