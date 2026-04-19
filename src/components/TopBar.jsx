import React, { useState } from 'react'
import { useOS } from '../context/OSContext.jsx'
import { useClock } from '../hooks/useOS.js'
import { APP_REGISTRY } from '../utils/appRegistry.js'
import VoiceButton from './ui/VoiceButton.jsx'

const TOP_APPS = ['about', 'projects', 'skills', 'terminal']

export default function TopBar({ onSwitcher }) {
  const { openWindow, toggleSearch, windows, toggleSetting, settings } = useOS()
  const { time, date } = useClock()
  const [hov, setHov] = useState(null)

  return (
    <div style={{
      position: 'relative', zIndex: 300,
      height: '32px',
      background: 'rgba(5,8,16,0.88)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(0,212,255,0.12)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 0.75rem',
      fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
      color: 'var(--text-dim)', flexShrink: 0,
      userSelect: 'none',
    }}>
      {/* Left: brand + app menus */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ color: 'var(--neon)', fontWeight: 700, letterSpacing: '1px', fontSize: '0.75rem' }}>⬡ DivyOS</span>
        <div style={{ display: 'flex', gap: '0.15rem' }}>
          {TOP_APPS.map(appId => {
            const cfg = APP_REGISTRY[appId]
            const isOpen = !!windows[appId]
            const isHov  = hov === appId
            return (
              <button key={appId}
                style={{ cursor: 'pointer', padding: '2px 8px', borderRadius: '4px', transition: 'all 0.15s',
                  color: isHov ? 'var(--neon)' : isOpen ? 'var(--text)' : 'var(--text-dim)',
                  background: isHov ? 'rgba(0,212,255,0.08)' : 'transparent',
                  border: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: isOpen ? 600 : 400 }}
                onMouseEnter={() => setHov(appId)}
                onMouseLeave={() => setHov(null)}
                onClick={() => openWindow(appId, cfg)}>
                {cfg?.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* Right: widgets */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {/* Voice */}
        <VoiceButton />

        {/* Search */}
        <TopBtn icon="fas fa-search" title="Search (Ctrl+Space)" onClick={toggleSearch} />

        {/* App Switcher */}
        {onSwitcher && <TopBtn icon="fas fa-th-large" title="App Switcher (Alt+Tab)" onClick={onSwitcher} />}

        {/* Perf overlay */}
        <TopBtn icon="fas fa-tachometer-alt" title="Perf Overlay (F2)" onClick={() => toggleSetting('performance')}
          active={settings.performance} />

        {/* CPU bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <i className="fas fa-microchip" style={{ fontSize: '0.62rem', color: 'var(--neon)' }} />
          <div style={{ width: '32px', height: '3px', background: 'var(--surface2)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg,var(--neon),var(--neon2))', width: '35%', animation: 'cpu-anim 4s ease-in-out infinite alternate' }} />
          </div>
        </div>

        <i className="fas fa-wifi" style={{ fontSize: '0.65rem', color: '#39ff14' }} />
        <span style={{ color: 'var(--text-dim)', fontSize: '0.66rem' }}>{date}</span>
        <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.3px' }}>{time}</span>
      </div>
    </div>
  )
}

function TopBtn({ icon, title, onClick, active }) {
  const [h, setH] = useState(false)
  return (
    <button onClick={onClick} title={title}
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 5px', borderRadius: '4px', transition: 'color 0.15s',
        color: active ? 'var(--neon)' : h ? 'var(--neon)' : 'var(--text-dim)', fontSize: '0.68rem' }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      <i className={icon} />
    </button>
  )
}
