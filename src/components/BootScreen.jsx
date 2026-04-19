import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BOOT_LINES = [
  '[ OK ] Initializing DivyOS kernel...',
  '[ OK ] Loading React 18 runtime...',
  '[ OK ] Mounting component tree...',
  '[ OK ] Establishing Firebase connection...',
  '[ OK ] Loading window manager...',
  '[ OK ] Starting dock service...',
  '[ OK ] Applying theme engine...',
  '[ OK ] DivyOS ready. Welcome.',
]

export default function BootScreen({ onComplete }) {
  const [lines, setLines] = useState([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[i]])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          setDone(true)
          setTimeout(onComplete, 600)
        }, 400)
      }
    }, 260)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#000',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '1.5rem',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              color: 'var(--neon)',
              textShadow: 'var(--glow)',
              letterSpacing: '4px',
              animation: 'neonFlicker 2s ease-in-out 2',
            }}
          >
            DIVY<span style={{ color: 'var(--neon2)' }}>OS</span>
          </motion.div>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--green)',
            maxWidth: '480px', width: '100%',
            textAlign: 'left', lineHeight: '1.9',
            minHeight: '160px',
            padding: '0 1rem',
          }}>
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {line}
              </motion.div>
            ))}
            <span style={{ color: 'var(--neon)', animation: 'pulse 1s infinite' }}>█</span>
          </div>

          <div style={{ width: '300px', height: '3px', background: '#111', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--neon), var(--neon2))',
              animation: 'boot-progress 2.5s ease-in-out forwards',
            }} />
          </div>

          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.2)', letterSpacing: '2px',
          }}>
            v2.0.0 — React Edition
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
