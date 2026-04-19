import React, { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOS } from '../../context/OSContext.jsx'
import { useOutsideClick } from '../../hooks/useOS.js'

export default function ContextMenu() {
  const { contextMenu, hideContextMenu } = useOS()
  const ref = useRef(null)
  useOutsideClick(ref, hideContextMenu)

  return (
    <AnimatePresence>
      {contextMenu && (
        <motion.div
          ref={ref}
          key="ctx"
          initial={{ opacity: 0, scale: 0.92, y: -8 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={{    opacity: 0, scale: 0.92, y: -8 }}
          transition={{ duration: 0.12 }}
          style={{
            position: 'fixed',
            left: contextMenu.x, top: contextMenu.y,
            zIndex: 'var(--z-context)',
            background: 'rgba(8,12,20,0.97)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: '10px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 0 20px rgba(0,212,255,0.1)',
            minWidth: '190px',
            padding: '0.4rem 0',
            fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
          }}
        >
          {contextMenu.items.map((item, i) => {
            if (item.type === 'sep') {
              return <div key={i} style={{ height: '1px', background: 'rgba(0,212,255,0.1)', margin: '0.3rem 0' }} />
            }
            return (
              <button
                key={i}
                onClick={() => { item.action(); hideContextMenu() }}
                style={{
                  width: '100%', padding: '0.5rem 1rem',
                  color: 'var(--text-dim)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  background: 'none', border: 'none', textAlign: 'left',
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.1)'; e.currentTarget.style.color = 'var(--neon)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-dim)' }}
              >
                <i className={item.icon} style={{ width: '14px', color: item.iconColor || 'var(--neon2)', fontSize: '0.8rem' }} />
                {item.label}
              </button>
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
