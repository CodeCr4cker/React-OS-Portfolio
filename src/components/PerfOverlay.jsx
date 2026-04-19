import React, { useState, useEffect, useRef } from 'react'
import { useOS } from '../context/OSContext.jsx'

export default function PerfOverlay() {
  const { settings, windows } = useOS()
  const [stats, setStats] = useState({ fps: 0, cpu: 0, ram: 0, uptime: 0, wins: 0 })
  const frameRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const startTimeRef = useRef(Date.now())
  const rafRef = useRef(null)

  useEffect(() => {
    if (!settings.performance) return

    let frameCount = 0

    const tick = (now) => {
      frameCount++
      const elapsed = now - lastTimeRef.current
      if (elapsed >= 1000) {
        const fps = Math.round(frameCount * 1000 / elapsed)
        frameCount = 0
        lastTimeRef.current = now

        // Simulated CPU (varies between 15-70%)
        const cpu = Math.round(15 + Math.abs(Math.sin(now / 3000) * 55))
        // RAM in MB (realistic range for a React app)
        const ram = Math.round(45 + Math.abs(Math.sin(now / 7000) * 30))
        const uptime = Math.round((Date.now() - startTimeRef.current) / 1000)
        const wins = Object.keys(windows).length

        setStats({ fps, cpu, ram, uptime, wins })
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [settings.performance, windows])

  if (!settings.performance) return null

  const fpsColor = stats.fps >= 55 ? '#39ff14' : stats.fps >= 30 ? '#ffbd2e' : '#ff5f56'
  const cpuColor = stats.cpu < 40 ? '#39ff14' : stats.cpu < 70 ? '#ffbd2e' : '#ff5f56'

  return (
    <div style={{
      position: 'fixed',
      top: '32px', right: '0',
      zIndex: 4000,
      background: 'rgba(0,0,0,0.88)',
      borderLeft: '2px solid var(--neon)',
      borderBottom: '2px solid var(--neon)',
      borderBottomLeftRadius: '8px',
      padding: '0.6rem 0.9rem',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.62rem',
      lineHeight: 1.9,
      minWidth: '145px',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{ color: 'var(--neon)', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '1px' }}>
        ⬡ PERF STATS
      </div>
      {[
        { label: 'FPS',    value: stats.fps,      unit: '',   color: fpsColor,      bar: stats.fps / 60 },
        { label: 'CPU',    value: stats.cpu,       unit: '%',  color: cpuColor,      bar: stats.cpu / 100 },
        { label: 'RAM',    value: stats.ram,       unit: ' MB', color: 'var(--neon2)', bar: stats.ram / 100 },
        { label: 'WINS',   value: stats.wins,      unit: '',   color: 'var(--neon)',  bar: null },
        { label: 'UP',     value: `${stats.uptime}s`, unit: '', color: 'var(--text-dim)', bar: null },
      ].map(({ label, value, unit, color, bar }) => (
        <div key={label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <span style={{ color: 'var(--text-dim)' }}>{label}</span>
            <span style={{ color }}>{value}{unit}</span>
          </div>
          {bar !== null && (
            <div style={{ height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '1px', marginBottom: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${bar * 100}%`,
                background: color, borderRadius: '1px',
                transition: 'width 0.5s ease',
              }} />
            </div>
          )}
        </div>
      ))}
      <div style={{ marginTop: '0.25rem', color: 'var(--text-muted)', fontSize: '0.55rem' }}>
        Press F2 to hide
      </div>
    </div>
  )
}
