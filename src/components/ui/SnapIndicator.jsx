import React, { useState, useEffect } from 'react'

export default function SnapIndicator() {
  const [zone, setZone] = useState(null)
  const SNAP_THRESHOLD = 40

  useEffect(() => {
    let dragging = false

    const onMouseMove = (e) => {
      if (!e.buttons) return
      const handle = document.querySelector('.win-drag-handle:active') || document.elementFromPoint(e.clientX, e.clientY)?.closest?.('.win-drag-handle')
      if (!handle) { setZone(null); return }
      dragging = true

      const ws = document.getElementById('workspace')
      if (!ws) return
      const r = ws.getBoundingClientRect()
      const relX = e.clientX - r.left
      const relY = e.clientY - r.top

      if (relX < SNAP_THRESHOLD) setZone('left')
      else if (relX > r.width - SNAP_THRESHOLD) setZone('right')
      else if (relY < SNAP_THRESHOLD) setZone('top')
      else setZone(null)
    }

    const onMouseUp = () => { setZone(null); dragging = false }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  if (!zone) return null

  const ws = document.getElementById('workspace')
  if (!ws) return null
  const r = ws.getBoundingClientRect()
  const W = r.width, H = r.height, L = r.left, T = r.top

  const pos = {
    left:  { left: L,         top: T, width: W/2, height: H },
    right: { left: L + W/2,   top: T, width: W/2, height: H },
    top:   { left: L,         top: T, width: W,   height: H },
  }[zone]

  return (
    <div style={{
      position: 'fixed',
      ...pos,
      zIndex: 3000,
      background: 'rgba(0,212,255,0.12)',
      border: '2px dashed rgba(0,212,255,0.4)',
      borderRadius: '8px',
      pointerEvents: 'none',
      transition: 'all 0.12s ease',
    }} />
  )
}
