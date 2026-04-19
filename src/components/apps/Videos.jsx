import React, { useState } from 'react'
import { motion } from 'framer-motion'

const VIDEOS = [
  { id: 'ysz5S6PUM-U', title: 'Python Hand Tracking Demo', desc: 'Real-time hand detection using OpenCV + Mediapipe.', tags: ['Python', 'AI'] },
  { id: 'aircAruvnKk', title: 'Neural Networks — 3Blue1Brown', desc: 'My favourite resource for understanding deep learning.', tags: ['AI', 'Math'] },
  { id: 'HXV3zeQKqGY', title: 'SQL Full Course — freeCodeCamp', desc: 'The SQL course I used to build my Library Management System.', tags: ['SQL', 'DB'] },
  { id: 'W6NZfCO5SIk', title: 'JavaScript Full Course', desc: 'Comprehensive JS course covering ES6+ features.', tags: ['JS', 'Web'] },
  { id: 'rfscVS0vtbw', title: 'Learn Python Full Course', desc: 'Python programming for beginners — full course.', tags: ['Python'] },
  { id: 'nu_pCVPKzTk', title: 'React JS Full Course', desc: 'Learn React from scratch with hooks and context.', tags: ['React', 'Web'] },
]

export default function Videos() {
  const [playing, setPlaying] = useState(null)
  const [filter, setFilter] = useState('All')
  const tags = ['All', 'Python', 'AI', 'React', 'JS', 'SQL']

  const filtered = filter === 'All' ? VIDEOS : VIDEOS.filter(v => v.tags.includes(filter))

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--win-bg)', fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', flexShrink: 0, display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <i className="fab fa-youtube" style={{ color: '#ff0000', fontSize: '1rem' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text)', marginRight: '0.5rem' }}>Videos</span>
        {tags.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            padding: '3px 10px', borderRadius: '20px', fontSize: '0.65rem',
            background: filter === t ? '#ff4757' : 'var(--surface2)', color: filter === t ? '#fff' : 'var(--text-dim)',
            border: `1px solid ${filter === t ? '#ff4757' : 'var(--border)'}`, cursor: 'pointer', fontFamily: 'var(--font-mono)',
          }}>{t}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {filtered.map((video, i) => (
            <motion.div key={video.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px',
                overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff4757'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}
            >
              {/* Thumbnail / Player */}
              <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', background: '#000', overflow: 'hidden' }}>
                {playing === video.id ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                  />
                ) : (
                  <div onClick={() => setPlaying(video.id)} style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                      alt={video.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={e => { e.target.style.display = 'none' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.5), rgba(10,12,40,0.6))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        background: 'rgba(255,71,87,0.9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem', color: '#fff', boxShadow: '0 4px 20px rgba(255,71,87,0.5)',
                        transition: 'transform 0.2s',
                      }}>
                        <i className="fas fa-play" style={{ marginLeft: '3px' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text)', fontWeight: 600, marginBottom: '0.3rem', lineHeight: 1.4 }}>
                  {video.title}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                  {video.desc}
                </div>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {video.tags.map(t => (
                    <span key={t} style={{ padding: '1px 6px', borderRadius: '3px', fontSize: '0.58rem', background: 'var(--surface2)', color: 'var(--text-dim)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)' }}>{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
