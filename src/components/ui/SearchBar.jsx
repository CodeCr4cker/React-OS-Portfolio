import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useOS } from '../../context/OSContext.jsx'
import { APP_REGISTRY, EXTERNAL_APPS } from '../../utils/appRegistry.js'

const ALL_APPS = { ...APP_REGISTRY, ...EXTERNAL_APPS }

export default function SearchBar({ onClose }) {
  const { openWindow } = useOS()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const results = query.trim()
    ? Object.values(ALL_APPS).filter(app =>
        app.title.toLowerCase().includes(query.toLowerCase()) ||
        app.id.toLowerCase().includes(query.toLowerCase())
      )
    : Object.values(APP_REGISTRY).slice(0, 8)

  const handleSelect = (app) => {
    if (EXTERNAL_APPS[app.id]) {
      window.open(EXTERNAL_APPS[app.id].url, '_blank')
    } else {
      openWindow(app.id, app)
    }
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 700 }}
      />
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0,   scale: 1    }}
        exit={{    opacity: 0, y: -20, scale: 0.96 }}
        transition={{ type: 'spring', damping: 24, stiffness: 350 }}
        style={{
          position: 'fixed',
          top: '15%', left: '50%', transform: 'translateX(-50%)',
          width: '520px', maxWidth: '90vw',
          zIndex: 701,
          background: 'rgba(8,12,20,0.97)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(0,212,255,0.25)',
          borderRadius: '16px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 40px rgba(0,212,255,0.1)',
          overflow: 'hidden',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
          <i className="fas fa-search" style={{ color: 'var(--neon)', fontSize: '1rem' }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search apps, commands…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'var(--text)', fontSize: '1rem',
              fontFamily: 'var(--font-mono)',
              caretColor: 'var(--neon)',
            }}
          />
          <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: '4px' }}>ESC</span>
        </div>

        {/* Results */}
        <div style={{ padding: '0.5rem', maxHeight: '380px', overflowY: 'auto' }}>
          {!query && (
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', padding: '0.25rem 0.75rem 0.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              All Apps
            </div>
          )}
          {results.map(app => (
            <button
              key={app.id}
              onClick={() => handleSelect(app)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 0.75rem', borderRadius: '8px',
                background: 'none', border: 'none', cursor: 'pointer',
                textAlign: 'left', color: 'var(--text)',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                background: app.gradient || 'var(--surface2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', color: '#fff',
              }}>
                <i className={app.icon} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text)' }}>{app.title}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                  {EXTERNAL_APPS[app.id] ? 'External Link' : 'Application'}
                </div>
              </div>
              <i className="fas fa-arrow-right" style={{ marginLeft: 'auto', color: 'var(--text-dim)', fontSize: '0.7rem' }} />
            </button>
          ))}
          {results.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
              No apps found for "{query}"
            </div>
          )}
        </div>

        {/* Footer hints */}
        <div style={{
          padding: '0.6rem 1.25rem',
          borderTop: '1px solid rgba(0,212,255,0.08)',
          display: 'flex', gap: '1.5rem',
          fontSize: '0.62rem', color: 'var(--text-dim)',
        }}>
          {[['↵', 'Open'], ['Esc', 'Close'], ['↑↓', 'Navigate']].map(([key, label]) => (
            <span key={key}>
              <span style={{ color: 'var(--neon)', marginRight: '0.3rem' }}>{key}</span>{label}
            </span>
          ))}
        </div>
      </motion.div>
    </>
  )
}
