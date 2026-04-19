import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PWAInstallBanner() {
  const [prompt, setPrompt] = useState(null)
  const [visible, setVisible] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    const handler = (e) => {
      e.preventDefault()
      setPrompt(e)
      // Show banner after 3 seconds
      setTimeout(() => setVisible(true), 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setVisible(false)
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') {
      setVisible(false)
      setPrompt(null)
    }
  }

  if (installed) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          style={{
            position: 'fixed',
            bottom: '4rem', left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 7500,
            background: 'rgba(8,12,20,0.97)',
            border: '1px solid var(--neon)',
            borderRadius: '12px',
            padding: '0.85rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '1rem',
            fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
            color: 'var(--text)',
            backdropFilter: 'blur(20px)',
            boxShadow: 'var(--glow)',
            minWidth: '280px', maxWidth: '380px',
          }}
        >
          <i className="fas fa-download" style={{ fontSize: '1.3rem', color: 'var(--neon)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ color: 'var(--neon)', fontWeight: 600, marginBottom: '2px' }}>Install DivyOS</div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.65rem' }}>
              Add to your home screen for the full app experience
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            <button
              onClick={handleInstall}
              style={{
                padding: '0.35rem 0.85rem', borderRadius: '6px', fontSize: '0.68rem',
                background: 'linear-gradient(135deg, var(--neon2), var(--neon))',
                color: '#fff', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontWeight: 700,
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              Install
            </button>
            <button
              onClick={() => setVisible(false)}
              style={{
                padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.68rem',
                background: 'transparent', color: 'var(--text-dim)',
                border: '1px solid var(--border)', cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
              }}
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
