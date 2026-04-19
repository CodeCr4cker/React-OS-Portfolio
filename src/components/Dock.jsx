import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useOS } from '../context/OSContext.jsx'
import { APP_REGISTRY, EXTERNAL_APPS, DOCK_APPS } from '../utils/appRegistry.js'

export default function Dock() {
  const { windows, openWindow, restoreWindow, minimizeWindow } = useOS()
  const [hovered, setHovered] = useState(null)

  const handleClick = (appId) => {
    if (EXTERNAL_APPS[appId]) {
      window.open(EXTERNAL_APPS[appId].url, '_blank')
      return
    }
    const cfg = APP_REGISTRY[appId]
    if (!cfg) return
    const win = windows[appId]
    if (win) {
      if (win.minimized) restoreWindow(appId)
      else minimizeWindow(appId)
    } else {
      openWindow(appId, cfg)
    }
  }

  return (
    <div style={{
      width: '68px',
      background: 'rgba(5,8,16,0.75)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(0,212,255,0.1)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      padding: '0.75rem 0',
      gap: '0.4rem',
      flexShrink: 0,
      position: 'relative',
      zIndex: 'var(--z-dock)',
      overflowY: 'auto', overflowX: 'visible',
    }}>
      {DOCK_APPS.map((appId, i) => {
        const cfg = APP_REGISTRY[appId] || EXTERNAL_APPS[appId]
        if (!cfg) return null
        const win = windows[appId]
        const isActive = win && !win.minimized
        const isMin    = win && win.minimized
        const isHovered = hovered === appId

        // Separator before settings and github
        const showSep = appId === 'settings' || appId === 'github'

        return (
          <React.Fragment key={appId}>
            {showSep && (
              <div style={{ width: '30px', height: '1px', background: 'rgba(0,212,255,0.15)', margin: '0.2rem 0', flexShrink: 0 }} />
            )}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              {/* Tooltip */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    position: 'absolute', left: '54px',
                    background: 'rgba(5,8,16,0.97)', color: 'var(--neon)',
                    fontSize: '0.65rem', fontFamily: 'var(--font-mono)',
                    padding: '3px 8px', borderRadius: '4px',
                    border: '1px solid var(--border)',
                    whiteSpace: 'nowrap', zIndex: 200,
                    pointerEvents: 'none',
                  }}
                >
                  {cfg.title}
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.15, x: 4 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleClick(appId)}
                onMouseEnter={() => setHovered(appId)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  width: '44px', height: '44px',
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  fontSize: '1.1rem',
                  color: isActive ? 'var(--neon)' : 'var(--text-dim)',
                  background: isActive
                    ? 'rgba(123,47,247,0.15)'
                    : isHovered
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isActive ? 'var(--neon2)' : isHovered ? 'var(--neon)' : 'transparent'}`,
                  boxShadow: isActive ? 'var(--glow)' : 'none',
                  flexShrink: 0,
                  transition: 'color 0.2s, background 0.2s, border 0.2s, box-shadow 0.2s',
                }}
              >
                <i className={cfg.icon} />
                {/* Active dot */}
                {isActive && (
                  <div style={{
                    width: '4px', height: '4px', borderRadius: '50%',
                    background: 'var(--neon)',
                    position: 'absolute', bottom: '3px',
                  }} />
                )}
                {/* Minimized dot (dimmer) */}
                {isMin && (
                  <div style={{
                    width: '4px', height: '4px', borderRadius: '50%',
                    background: 'var(--text-dim)',
                    position: 'absolute', bottom: '3px',
                  }} />
                )}
              </motion.button>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}
