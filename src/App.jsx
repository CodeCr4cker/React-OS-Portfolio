import React, { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import { OSProvider } from './context/OSContext.jsx'
import BootScreen from './components/BootScreen.jsx'
import Desktop from './components/Desktop.jsx'
import MobileUI from './components/MobileUI.jsx'
import LockScreen from './components/LockScreen.jsx'
import PWABanner from './components/ui/PWABanner.jsx'
import { useSound } from './hooks/useSound.js'

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth <= 768)
  useEffect(() => {
    const h = () => setMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return mobile
}

function OSRoot() {
  // Desktop-only boot state — mobile has its own Android boot inside MobileUI
  const [desktopBooted, setDesktopBooted] = useState(false)
  const [locked,        setLocked]        = useState(false)
  const isMobile = useIsMobile()
  const { play } = useSound()

  const handleBootComplete = () => {
    setDesktopBooted(true)
    play('boot')
  }

  const handleUnlock = () => {
    setLocked(false)
    play('unlock')
  }

  // ── MOBILE: render MobileUI directly — it handles its own Android boot + lock ──
  if (isMobile) {
    return (
      <>
        <MobileUI />
        <Toaster position="bottom-center" toastOptions={toastStyle} />
      </>
    )
  }

  // ── DESKTOP: show PC boot screen first, then Desktop ──
  return (
    <>
      <AnimatePresence>
        {!desktopBooted && <BootScreen onComplete={handleBootComplete} />}
      </AnimatePresence>

      {desktopBooted && (
        <>
          <Desktop onLock={() => setLocked(true)} />

          <AnimatePresence>
            {locked && <LockScreen onUnlock={handleUnlock} />}
          </AnimatePresence>

          <PWABanner />
        </>
      )}

      <Toaster position="bottom-right" toastOptions={toastStyle} />
    </>
  )
}

const toastStyle = {
  style: {
    background:     'rgba(10,12,20,0.97)',
    color:          'var(--text)',
    border:         '1px solid rgba(0,212,255,0.2)',
    fontFamily:     'var(--font-mono)',
    fontSize:       '0.75rem',
    backdropFilter: 'blur(20px)',
    boxShadow:      '0 8px 32px rgba(0,0,0,0.5)',
  },
}

export default function App() {
  return (
    <OSProvider>
      <OSRoot />
    </OSProvider>
  )
}
