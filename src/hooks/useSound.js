import { useCallback, useRef } from 'react'
import { useOS } from '../context/OSContext.jsx'

// Tiny Web Audio API tone generator — no external files needed
function playTone(ctx, { freq = 440, type = 'sine', start = 0, dur = 0.08, vol = 0.3, ramp = true } = {}) {
  const osc  = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = type
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start)
  gain.gain.setValueAtTime(0, ctx.currentTime + start)
  gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.01)
  if (ramp) gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur)
  osc.start(ctx.currentTime + start)
  osc.stop(ctx.currentTime + start + dur + 0.05)
}

const SOUNDS = {
  windowOpen: (ctx) => {
    playTone(ctx, { freq: 880,  type: 'sine',     start: 0,    dur: 0.07, vol: 0.18 })
    playTone(ctx, { freq: 1100, type: 'sine',     start: 0.06, dur: 0.07, vol: 0.22 })
    playTone(ctx, { freq: 1320, type: 'sine',     start: 0.12, dur: 0.12, vol: 0.28 })
  },
  windowClose: (ctx) => {
    playTone(ctx, { freq: 660,  type: 'sine',     start: 0,    dur: 0.06, vol: 0.18 })
    playTone(ctx, { freq: 440,  type: 'sine',     start: 0.05, dur: 0.10, vol: 0.14 })
  },
  notification: (ctx) => {
    playTone(ctx, { freq: 1047, type: 'sine',     start: 0,    dur: 0.07, vol: 0.25 })
    playTone(ctx, { freq: 1319, type: 'sine',     start: 0.08, dur: 0.10, vol: 0.30 })
  },
  click: (ctx) => {
    playTone(ctx, { freq: 800,  type: 'square',   start: 0,    dur: 0.03, vol: 0.08 })
  },
  error: (ctx) => {
    playTone(ctx, { freq: 200,  type: 'sawtooth', start: 0,    dur: 0.15, vol: 0.20 })
    playTone(ctx, { freq: 150,  type: 'sawtooth', start: 0.10, dur: 0.15, vol: 0.15 })
  },
  boot: (ctx) => {
    [523, 659, 784, 1047].forEach((f, i) =>
      playTone(ctx, { freq: f, type: 'sine', start: i * 0.12, dur: 0.15, vol: 0.22 })
    )
  },
  unlock: (ctx) => {
    [880, 1047, 1319].forEach((f, i) =>
      playTone(ctx, { freq: f, type: 'sine', start: i * 0.08, dur: 0.10, vol: 0.20 })
    )
  },
  keyPress: (ctx) => {
    playTone(ctx, { freq: 600 + Math.random() * 200, type: 'sine', start: 0, dur: 0.02, vol: 0.05 })
  },
}

export function useSound() {
  const { settings } = useOS()
  const ctxRef = useRef(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    // Resume if suspended (browser policy)
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }, [])

  const play = useCallback((name) => {
    if (!settings.sounds) return
    const fn = SOUNDS[name]
    if (!fn) return
    try { fn(getCtx()) } catch (e) { /* silent fail */ }
  }, [settings.sounds, getCtx])

  return { play }
}
