import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVoiceCommand } from '../../hooks/useVoiceCommand.js'

export default function VoiceButton({ style = {} }) {
  const { listening, transcript, supported, start, stop } = useVoiceCommand()

  if (!supported) return null

  return (
    <div style={{ position: 'relative', ...style }}>
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={listening ? stop : start}
        title={listening ? 'Stop listening' : 'Voice command (say "open terminal", "dark mode"…)'}
        style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: listening
            ? 'linear-gradient(135deg, #ff4757, #ff6b81)'
            : 'rgba(255,255,255,0.08)',
          border: `1px solid ${listening ? '#ff4757' : 'rgba(255,255,255,0.15)'}`,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: listening ? '#fff' : 'var(--text-dim)',
          fontSize: '0.7rem',
          boxShadow: listening ? '0 0 12px rgba(255,71,87,0.5)' : 'none',
          transition: 'all 0.2s',
          position: 'relative',
        }}
      >
        <i className={listening ? 'fas fa-stop' : 'fas fa-microphone'} />
        {listening && (
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{
              position: 'absolute', inset: -4, borderRadius: '50%',
              border: '2px solid #ff4757', pointerEvents: 'none',
            }}
          />
        )}
      </motion.button>

      {/* Transcript bubble */}
      <AnimatePresence>
        {listening && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            style={{
              position: 'absolute',
              top: '110%', right: 0,
              background: 'rgba(8,12,20,0.97)',
              border: '1px solid rgba(255,71,87,0.4)',
              borderRadius: '8px',
              padding: '0.5rem 0.75rem',
              minWidth: '180px', maxWidth: '280px',
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              color: 'var(--text)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              zIndex: 9999,
              backdropFilter: 'blur(16px)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ color: '#ff4757', marginBottom: '2px', fontSize: '0.58rem', letterSpacing: '1px' }}>
              ● LISTENING
            </div>
            <div style={{ color: 'var(--text-dim)' }}>
              {transcript || 'Say a command…'}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.55rem', marginTop: '4px' }}>
              "open terminal" · "dark mode" · "search"
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
