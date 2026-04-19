import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOS } from '../context/OSContext.jsx'
import { APP_REGISTRY } from '../utils/appRegistry.js'

export default function Taskbar() {
  const { windows, activeWindow, focusWindow, restoreWindow, minimizeWindow } = useOS()

  const openApps = Object.values(windows)

  if (openApps.length === 0) return null

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        position: 'absolute',
        bottom: '0.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 150,
        display: 'flex',
        gap: '0.4rem',
        alignItems: 'center',
        background: 'rgba(5,8,16,0.88)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,212,255,0.15)',
        borderRadius: '12px',
        padding: '0.4rem 0.75rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        maxWidth: '80vw',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
        color: 'var(--text-muted)', marginRight: '0.25rem',
        whiteSpace: 'nowrap',
      }}>Open:</span>

      <AnimatePresence>
        {openApps.map(win => {
          const cfg = APP_REGISTRY[win.appId]
          const isActive = activeWindow === win.appId
          const isMin = win.minimized

          return (
            <motion.button
              key={win.appId}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 350 }}
              onClick={() => {
                if (isMin) restoreWindow(win.appId)
                else if (isActive) minimizeWindow(win.appId)
                else focusWindow(win.appId)
              }}
              title={win.title}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.3rem 0.65rem', borderRadius: '7px',
                background: isActive
                  ? 'rgba(0,212,255,0.15)'
                  : isMin
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(255,255,255,0.07)',
                border: `1px solid ${isActive ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                color: isActive ? 'var(--neon)' : isMin ? 'var(--text-muted)' : 'var(--text-dim)',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <i className={cfg?.icon || 'fas fa-window-maximize'} style={{ fontSize: '0.65rem', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{win.title}</span>
              {isMin && (
                <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)', flexShrink: 0 }}>—</span>
              )}
            </motion.button>
          )
        })}
      </AnimatePresence>

      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
        color: 'var(--text-muted)', marginLeft: '0.5rem',
        borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '0.5rem',
        whiteSpace: 'nowrap',
      }}>
        Press <kbd style={{ background: 'rgba(255,255,255,0.08)', padding: '0 3px', borderRadius: '3px', fontSize: '0.55rem' }}>~</kbd> terminal
      </span>
    </motion.div>
  )
}
