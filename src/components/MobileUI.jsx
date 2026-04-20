import React, { useState, useEffect, useRef, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOS } from '../context/OSContext.jsx'
import { APP_REGISTRY } from '../utils/appRegistry.js'
import { useClock } from '../hooks/useOS.js'
import { LOCK_PIN, BOOT_DURATION } from '../config.js'

/* ═══════════════════════════════════════════════════════════════
   ANDROID BOOT LOADER — shown only once on first load (mobile)
═══════════════════════════════════════════════════════════════ */
function AndroidBoot({ onDone }) {
  const [bar, setBar] = useState(0)

  useEffect(() => {
    // Progress bar — steps spread evenly across BOOT_DURATION
    const D = BOOT_DURATION
    const steps = [
      { pct: 20,  delay: D * 0.12 },
      { pct: 45,  delay: D * 0.28 },
      { pct: 70,  delay: D * 0.46 },
      { pct: 90,  delay: D * 0.63 },
      { pct: 100, delay: D * 0.79 },
    ]
    const timers = steps.map(s => setTimeout(() => setBar(s.pct), s.delay))
    const done   = setTimeout(onDone, D)
    return () => { timers.forEach(clearTimeout); clearTimeout(done) }
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#000',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '2rem',
      }}
    >
      {/* Android Robot SVG */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', damping: 16 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}
      >
        <svg viewBox="0 0 72 72" width="76" height="76" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Antennas */}
          <line x1="22" y1="18" x2="14" y2="8" stroke="#3ddc84" strokeWidth="3" strokeLinecap="round"/>
          <line x1="50" y1="18" x2="58" y2="8" stroke="#3ddc84" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="13" cy="7" r="2.5" fill="#3ddc84"/>
          <circle cx="59" cy="7" r="2.5" fill="#3ddc84"/>
          {/* Head */}
          <path d="M16 28 Q16 18 36 18 Q56 18 56 28 L56 32 Q56 38 36 38 Q16 38 16 32 Z" fill="#3ddc84"/>
          {/* Eyes */}
          <circle cx="27" cy="27" r="3" fill="#fff"/>
          <circle cx="45" cy="27" r="3" fill="#fff"/>
          <circle cx="28.2" cy="27.2" r="1.4" fill="#000"/>
          <circle cx="46.2" cy="27.2" r="1.4" fill="#000"/>
          {/* Body */}
          <rect x="14" y="40" width="44" height="22" rx="5" fill="#3ddc84"/>
          {/* Arms */}
          <rect x="4"  y="40" width="8"  height="18" rx="4" fill="#3ddc84"/>
          <rect x="60" y="40" width="8"  height="18" rx="4" fill="#3ddc84"/>
          {/* Legs */}
          <rect x="20" y="62" width="10" height="8" rx="4" fill="#3ddc84"/>
          <rect x="42" y="62" width="10" height="8" rx="4" fill="#3ddc84"/>
          {/* Chest button */}
          <circle cx="28" cy="50" r="2.5" fill="rgba(255,255,255,0.3)"/>
          <circle cx="44" cy="50" r="2.5" fill="rgba(255,255,255,0.3)"/>
        </svg>

        <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '4px', textTransform: 'uppercase' }}>
          DivyOS Mobile
        </div>
      </motion.div>

      {/* Bouncing dots */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {[
          { color: '#4caf50', delay: '0s'    },
          { color: '#2196f3', delay: '0.18s' },
          { color: '#f44336', delay: '0.36s' },
          { color: '#ffeb3b', delay: '0.54s' },
        ].map((d, i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: '50%',
            background: d.color,
            animation: 'dotBounce 1.2s ease-in-out infinite',
            animationDelay: d.delay,
          }} />
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ width: 200, height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: '#3ddc84', borderRadius: 2, width: `${bar}%`, transition: 'width 0.35s ease' }} />
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '1px' }}>
        Android 14 · DivyOS v2.0
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE LOCK SCREEN — swipe up or tap to unlock
═══════════════════════════════════════════════════════════════ */
function MobileLockScreen({ onUnlock }) {
  const { time, date } = useClock()
  const [unlocking, setUnlocking] = useState(false)
  const [pin,       setPin]       = useState('')
  const [shake,     setShake]     = useState(false)
  const PIN = LOCK_PIN

  const triggerUnlock = () => {
    setUnlocking(true)
    setTimeout(onUnlock, 350)
  }

  const handlePinKey = (k) => {
    if (pin.length >= 4) return
    const next = pin + k
    setPin(next)
    if (next.length === 4) {
      setTimeout(() => {
        if (next === PIN) triggerUnlock()
        else { setShake(true); setTimeout(() => { setShake(false); setPin('') }, 600) }
      }, 180)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: unlocking ? 0 : 1, y: unlocking ? -40 : 0 }}
      transition={{ duration: 0.35 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 6000,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 'calc(3rem + env(safe-area-inset-top))',
        paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom))',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Blurred wallpaper background */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: -1,
        backgroundImage: 'var(--wallpaper)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'blur(18px) brightness(0.55)',
        transform: 'scale(1.08)',
      }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'rgba(0,0,0,0.35)' }} />

      {/* Top: time + date */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: 'clamp(4rem, 18vw, 5.5rem)',
          fontWeight: 100, fontFamily: 'var(--font-mono)',
          color: '#fff', letterSpacing: '-2px', lineHeight: 1,
          textShadow: '0 2px 20px rgba(0,0,0,0.5)',
        }}>
          {time}
        </div>
        <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.65)', marginTop: '0.4rem', letterSpacing: '0.5px' }}>
          {date}
        </div>

        {/* Notification bubbles */}
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 2rem' }}>
          {[
            { icon: 'fas fa-comments', app: 'Chat', msg: 'Welcome to DivyOS! 👋', time: 'now' },
            { icon: 'fas fa-robot',    app: 'AI',   msg: 'Ask me anything…',      time: '2m'  },
          ].map((n, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
              style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', borderRadius: 14, padding: '0.65rem 0.9rem', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left' }}>
              <i className={n.icon} style={{ color: 'var(--neon)', fontSize: '1rem', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#fff' }}>{n.app}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>{n.msg}</div>
              </div>
              <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>{n.time}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* PIN pad — always shown, no swipe */}
      <motion.div
        animate={shake ? { x: [0,-12,12,-8,8,-4,4,0] } : {}}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', width: '100%' }}
      >
        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '2px', fontFamily: 'var(--font-mono)' }}>
          ENTER PIN TO UNLOCK
        </div>
        {/* PIN dots */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)', background: i < pin.length ? '#fff' : 'transparent', transition: 'background 0.15s' }} />
          ))}
        </div>
        {/* Numpad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.65rem', padding: '0 2rem', width: '100%', maxWidth: 280 }}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <NumBtn key={n} label={String(n)} onClick={() => handlePinKey(String(n))} />
          ))}
          <div />
          <NumBtn label="0" onClick={() => handlePinKey('0')} />
          <button onClick={() => setPin(p => p.slice(0,-1))}
            style={{ height: 58, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '1rem', cursor: 'pointer' }}>
            ⌫
          </button>
        </div>
        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>Set your PIN in src/config.js</div>
      </motion.div>
    </motion.div>
  )
}

function NumBtn({ label, onClick }) {
  const [p, setP] = useState(false)
  return (
    <button onClick={onClick}
      onTouchStart={() => setP(true)} onTouchEnd={() => setP(false)}
      onMouseDown={() => setP(true)}  onMouseUp={() => setP(false)}
      style={{ height: 58, borderRadius: '50%', background: p ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '1.4rem', fontWeight: 300, cursor: 'pointer', fontFamily: 'var(--font-mono)', transition: 'background 0.1s', transform: p ? 'scale(0.92)' : 'scale(1)' }}>
      {label}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════
   APP ICON
═══════════════════════════════════════════════════════════════ */
const MOBILE_APPS = [
  { appId: 'about',    label: 'About',    bg: 'linear-gradient(135deg,#667eea,#764ba2)' },
  { appId: 'projects', label: 'Projects', bg: 'linear-gradient(135deg,#f093fb,#f5576c)' },
  { appId: 'skills',   label: 'Skills',   bg: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
  { appId: 'terminal', label: 'Terminal', bg: 'linear-gradient(135deg,#1a1a2e,#16213e)', border: '1px solid #00d4ff44' },
  { appId: 'chat',     label: 'Chat',     bg: 'linear-gradient(135deg,#00d4ff,#7b2ff7)' },
  { appId: 'docs',     label: 'Docs',     bg: 'linear-gradient(135deg,#a8c0ff,#3f2b96)' },
  { appId: 'gallery',  label: 'Gallery',  bg: 'linear-gradient(135deg,#ffa500,#ffb627)' },
  { appId: 'videos',   label: 'Videos',   bg: 'linear-gradient(135deg,#ff4757,#c0392b)' },
  { appId: 'files',    label: 'Files',    bg: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  { appId: 'ai',       label: 'AI',       bg: 'linear-gradient(135deg,#7b2ff7,#00d4ff)' },
  { appId: 'social',   label: 'Social',   bg: 'linear-gradient(135deg,#f107a3,#7b2ff7)' },
  { url: 'https://github.com/CodeCr4cker', label: 'GitHub', icon: 'fab fa-github', bg: '#24292e', border: '1px solid #555' },
]

function AppIcon({ app, onOpen }) {
  const cfg = APP_REGISTRY[app.appId]
  return (
    <motion.div whileTap={{ scale: 0.85 }} onClick={onOpen}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
      <div style={{ width: 60, height: 60, borderRadius: '18px', background: app.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.45rem', color: '#fff', border: app.border || '1.5px solid rgba(255,255,255,0.15)', boxShadow: '0 4px 16px rgba(0,0,0,0.35)' }}>
        <i className={app.icon || cfg?.icon || 'fas fa-circle'} />
      </div>
      <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500, textAlign: 'center', textShadow: '0 1px 4px rgba(0,0,0,0.9)', lineHeight: 1.2 }}>{app.label}</span>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   APP FULL-SCREEN VIEW
═══════════════════════════════════════════════════════════════ */
function AppView({ appId, onClose }) {
  const cfg = APP_REGISTRY[appId]
  if (!cfg) return null
  const Comp = cfg.component
  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 26, stiffness: 300 }}
      style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', flexDirection: 'column', background: 'rgba(10,12,20,0.98)' }}
    >
      {/* Header bar */}
      <div style={{
        flexShrink: 0, height: 52,
        paddingTop: 'env(safe-area-inset-top)',
        background: 'rgba(5,8,16,0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center',
        padding: '0 1rem', gap: '0.75rem',
      }}>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--neon)', fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', WebkitTapHighlightColor: 'transparent' }}>
          <i className="fas fa-chevron-left" />
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-sans)' }}>Home</span>
        </motion.button>
        <div style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>
          <i className={cfg.icon} style={{ marginRight: '0.35rem', color: 'var(--neon)', fontSize: '0.85rem' }} />
          {cfg.title}
        </div>
        <div style={{ width: 56 }} />
      </div>

      {/* App content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Suspense fallback={
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.75rem', color: 'var(--neon)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            <i className="fas fa-circle-notch" style={{ fontSize: '1.5rem', animation: 'spin 1s linear infinite' }} />
            Loading {cfg.title}…
          </div>
        }>
          <Comp />
        </Suspense>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN MOBILE UI
═══════════════════════════════════════════════════════════════ */
export default function MobileUI() {
  const [booted,  setBooted]  = useState(false)
  const [locked,  setLocked]  = useState(true)   // starts locked after boot
  const [openApp, setOpenApp] = useState(null)
  const { time, date } = useClock()

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', fontFamily: 'var(--font-sans)', overflow: 'hidden' }}>

      {/* Wallpaper layer */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'var(--wallpaper)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(165deg,rgba(0,0,0,0.55),rgba(0,10,30,0.5),rgba(0,0,0,0.6))' }} />
      </div>

      {/* ① Android boot loader */}
      <AnimatePresence>
        {!booted && <AndroidBoot onDone={() => setBooted(true)} />}
      </AnimatePresence>

      {/* ② Home screen (only after booted) */}
      {booted && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>

          {/* Status bar */}
          <div style={{
            flexShrink: 0,
            paddingTop: 'env(safe-area-inset-top)',
            padding: '0.4rem 1.25rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            position: 'relative', zIndex: 10,
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{time}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px' }}>DIVYOS MOBILE</span>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <i className="fas fa-signal"   style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)' }} />
              <i className="fas fa-wifi"     style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)' }} />
              <i className="fas fa-battery-three-quarters" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)' }} />
            </div>
          </div>

          {/* Home content */}
          <div style={{ flex: 1, position: 'relative', zIndex: 5, padding: '0.75rem 0.75rem 0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Greeting */}
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                Hello, I'm <span style={{ color: 'var(--neon)' }}>Divyanshu</span> 👋
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>{date}</div>
            </div>

            {/* App grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.5rem 0.25rem', flex: 1, overflowY: 'auto', paddingBottom: '0.5rem', WebkitOverflowScrolling: 'touch' }}>
              {MOBILE_APPS.map(app => (
                <AppIcon key={app.appId || app.url} app={app}
                  onOpen={() => {
                    if (app.url) { window.open(app.url,'_blank'); return }
                    setOpenApp(app.appId)
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── BOTTOM DOCK + LOCK BUTTON ── */}
          <div style={{
            flexShrink: 0,
            paddingTop: '0.6rem',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            paddingBottom: 'calc(0.6rem + env(safe-area-inset-bottom))',
            position: 'relative', zIndex: 10,
            display: 'flex', flexDirection: 'column', gap: '0.5rem',
          }}>
            {/* Dock row */}
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(24px)',
              borderRadius: 22,
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '0.5rem 0.65rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '0.4rem',
            }}>
              {/* 4 pinned apps */}
              {['about','terminal','chat','settings'].map(id => {
                const cfg = APP_REGISTRY[id]
                return (
                  <motion.div key={id} whileTap={{ scale: 0.85 }} onClick={() => setOpenApp(id)}
                    style={{ flex: 1, height: 46, borderRadius: 13, background: cfg.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: '#fff', cursor: 'pointer', WebkitTapHighlightColor: 'transparent', boxShadow: '0 3px 12px rgba(0,0,0,0.35)' }}>
                    <i className={cfg.icon} />
                  </motion.div>
                )
              })}

              {/* Lock button */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setLocked(true)}
                title="Lock Screen"
                style={{
                  flex: 1, height: 46, borderRadius: 13,
                  background: 'rgba(255,255,255,0.12)',
                  border: '1.5px solid rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '2px',
                  cursor: 'pointer', color: 'rgba(255,255,255,0.85)',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <i className="fas fa-lock" style={{ fontSize: '0.95rem' }} />
                <span style={{ fontSize: '0.42rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.5)' }}>LOCK</span>
              </motion.button>
            </div>
          </div>

          {/* App view overlay */}
          <AnimatePresence>
            {openApp && <AppView key={openApp} appId={openApp} onClose={() => setOpenApp(null)} />}
          </AnimatePresence>
        </div>
      )}

      {/* ③ Lock screen (after boot, toggled by lock button) */}
      <AnimatePresence>
        {booted && locked && <MobileLockScreen onUnlock={() => setLocked(false)} />}
      </AnimatePresence>
    </div>
  )
}
