import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOS } from '../../context/OSContext.jsx'

const TYPE_COLORS = {
  info:    { border: 'rgba(0,212,255,0.4)',   icon: 'fas fa-info-circle',     color: 'var(--neon)' },
  success: { border: 'rgba(57,255,20,0.4)',   icon: 'fas fa-check-circle',    color: '#39ff14' },
  warning: { border: 'rgba(255,189,46,0.4)',  icon: 'fas fa-exclamation-triangle', color: '#ffbd2e' },
  error:   { border: 'rgba(255,95,86,0.4)',   icon: 'fas fa-times-circle',    color: '#ff5f56' },
}

function Notification({ notif }) {
  const { hideNotification } = useOS()
  const style = TYPE_COLORS[notif.type] || TYPE_COLORS.info

  useEffect(() => {
    const timer = setTimeout(() => hideNotification(notif.id), 4000)
    return () => clearTimeout(timer)
  }, [notif.id, hideNotification])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0,   scale: 1   }}
      exit={{    opacity: 0, x: 100, scale: 0.9  }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      onClick={() => hideNotification(notif.id)}
      style={{
        background: 'rgba(8,12,20,0.97)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${style.border}`,
        borderLeft: `3px solid ${style.color}`,
        borderRadius: '10px',
        padding: '0.75rem 1rem',
        display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
        cursor: 'pointer',
        minWidth: '260px', maxWidth: '320px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <i className={style.icon} style={{ color: style.color, fontSize: '1rem', marginTop: '1px', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>
          {notif.title}
        </div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
          {notif.msg}
        </div>
      </div>
      <button
        onClick={e => { e.stopPropagation(); hideNotification(notif.id) }}
        style={{ color: 'var(--text-dim)', fontSize: '0.7rem', flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <i className="fas fa-times" />
      </button>
    </motion.div>
  )
}

export default function NotificationSystem() {
  const { notifications } = useOS()

  return (
    <div style={{
      position: 'fixed', bottom: '1rem', right: '1rem',
      zIndex: 'var(--z-notif)',
      display: 'flex', flexDirection: 'column', gap: '0.5rem',
      alignItems: 'flex-end',
    }}>
      <AnimatePresence mode="popLayout">
        {notifications.map(n => (
          <Notification key={n.id} notif={n} />
        ))}
      </AnimatePresence>
    </div>
  )
}
