import { LOCK_PIN } from '../config.js'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function useLockClock() {
  const [dt, setDt] = useState({ time: '', date: '' })
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setDt({
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        date: now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return dt
}

export default function LockScreen({ onUnlock }) {
  const { time, date } = useLockClock()
  const [pin, setPin] = useState('')
  const [shake, setShake] = useState(false)
  const [hint, setHint] = useState(false)
  const PASSWORD = LOCK_PIN

  const handleKey = (k) => {
    if (pin.length >= 4) return
    const next = pin + k
    setPin(next)
    if (next.length === 4) {
      setTimeout(() => {
        if (next === PASSWORD) {
          onUnlock()
        } else {
          setShake(true)
          setTimeout(() => { setShake(false); setPin('') }, 600)
        }
      }, 200)
    }
  }

  const handleBackspace = () => setPin(p => p.slice(0, -1))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 8000,
        background: `linear-gradient(135deg, #0a0c14 0%, #0d1117 40%, #111827 100%)`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '2.5rem',
        backdropFilter: 'blur(20px)',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Animated background particles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${20 + Math.random() * 60}px`,
            height: `${20 + Math.random() * 60}px`,
            borderRadius: '50%',
            background: i % 2 === 0
              ? 'rgba(0,212,255,0.04)'
              : 'rgba(123,47,247,0.04)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `pulse ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`,
          }} />
        ))}
      </div>

      {/* Clock */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: 'clamp(3.5rem, 10vw, 6rem)',
          fontWeight: 200, fontFamily: 'var(--font-mono)',
          color: '#fff', letterSpacing: '-2px',
          textShadow: '0 0 40px rgba(0,212,255,0.3)',
          lineHeight: 1,
        }}>
          {time}
        </div>
        <div style={{
          fontSize: '1rem', color: 'rgba(255,255,255,0.5)',
          marginTop: '0.5rem', letterSpacing: '1px',
        }}>
          {date}
        </div>
      </div>

      {/* Profile + PIN */}
      <motion.div
        animate={shake ? { x: [0, -12, 12, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 1 }}
      >
        {/* Avatar */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden',
          boxShadow: '0 0 0 3px rgba(0,212,255,0.4), 0 0 24px rgba(0,212,255,0.2)',
        }}>
          <img
            src="https://raw.githubusercontent.com/CodeCr4cker/Web-Storage/main/my%20all%20website%20logo%20image/logo.png"
            alt="Divyanshu"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>Divyanshu Pandey</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '2px' }}>
            {hint ? 'Hint: 1234' : 'Enter PIN to unlock'}
          </div>
        </div>

        {/* PIN dots */}
        <div style={{ display: 'flex', gap: '0.9rem' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: '14px', height: '14px', borderRadius: '50%',
              border: '2px solid rgba(0,212,255,0.5)',
              background: i < pin.length ? 'var(--neon)' : 'transparent',
              boxShadow: i < pin.length ? '0 0 8px var(--neon)' : 'none',
              transition: 'all 0.2s',
            }} />
          ))}
        </div>

        {/* Numpad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <PinBtn key={n} label={String(n)} onClick={() => handleKey(String(n))} />
          ))}
          <PinBtn label="?" onClick={() => setHint(h => !h)} dim />
          <PinBtn label="0" onClick={() => handleKey('0')} />
          <PinBtn label="⌫" onClick={handleBackspace} dim />
        </div>
      </motion.div>
    </motion.div>
  )
}

function PinBtn({ label, onClick, dim }) {
  const [pressed, setPressed] = useState(false)
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick() }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        width: '58px', height: '58px', borderRadius: '50%',
        background: pressed
          ? 'rgba(0,212,255,0.3)'
          : 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: dim ? 'rgba(255,255,255,0.4)' : '#fff',
        fontSize: label === '⌫' ? '1.1rem' : '1.3rem',
        fontFamily: 'var(--font-mono)', fontWeight: 300,
        cursor: 'pointer',
        transition: 'background 0.1s, transform 0.1s',
        transform: pressed ? 'scale(0.92)' : 'scale(1)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {label}
    </button>
  )
}