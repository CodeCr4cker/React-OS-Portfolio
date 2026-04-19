import React, { useState } from 'react'
import { motion } from 'framer-motion'

const PROJECTS = [
  {
    id: 1, title: 'DivyOS Portfolio',
    desc: 'A futuristic OS-style portfolio built with React 18, Framer Motion, and Context API. Features draggable windows, theme engine, Firebase chat, and PWA support.',
    tags: ['React', 'Framer Motion', 'Firebase', 'CSS Vars'],
    color: '#00d4ff', icon: 'fas fa-desktop',
    github: 'https://github.com/CodeCr4cker',
    live: 'https://github.com/CodeCr4cker',
    year: '2024', status: 'Live',
  },
  {
    id: 2, title: 'Library Management System',
    desc: 'A full-featured desktop application for library management built with Python (Tkinter) and MySQL. Supports book tracking, member management, and fine calculation.',
    tags: ['Python', 'Tkinter', 'MySQL', 'SQL'],
    color: '#7b2ff7', icon: 'fas fa-book',
    github: 'https://github.com/CodeCr4cker',
    live: null,
    year: '2023', status: 'Complete',
  },
  {
    id: 3, title: 'Hand Tracking Demo',
    desc: 'Real-time hand detection and gesture recognition system using OpenCV and MediaPipe. Capable of tracking 21 hand landmarks at 30+ FPS.',
    tags: ['Python', 'OpenCV', 'MediaPipe', 'AI/ML'],
    color: '#f107a3', icon: 'fas fa-hand-paper',
    github: 'https://github.com/CodeCr4cker',
    live: 'https://youtube.com/@CodeCr4cker',
    year: '2024', status: 'Demo',
  },
  {
    id: 4, title: 'Real-time Chat App',
    desc: 'Firebase-powered chat application with authentication, typing indicators, read receipts, message reactions, and admin panel.',
    tags: ['React', 'Firebase', 'Firestore', 'Auth'],
    color: '#39ff14', icon: 'fas fa-comments',
    github: 'https://github.com/CodeCr4cker',
    live: null,
    year: '2024', status: 'Live',
  },
  {
    id: 5, title: 'AI Assistant Integration',
    desc: 'In-browser AI assistant powered by Claude API. Supports multi-turn conversations, code highlighting, and markdown rendering.',
    tags: ['React', 'Claude API', 'Markdown', 'JS'],
    color: '#ffbd2e', icon: 'fas fa-robot',
    github: 'https://github.com/CodeCr4cker',
    live: null,
    year: '2024', status: 'Beta',
  },
  {
    id: 6, title: 'E-commerce UI Concept',
    desc: 'Modern e-commerce front-end with product filtering, cart management, and responsive design built with React and custom CSS.',
    tags: ['React', 'CSS', 'UI/UX', 'Responsive'],
    color: '#4facfe', icon: 'fas fa-shopping-cart',
    github: 'https://github.com/CodeCr4cker',
    live: null,
    year: '2023', status: 'Concept',
  },
]

const STATUS_COLORS = {
  'Live': '#39ff14', 'Complete': '#00d4ff', 'Demo': '#7b2ff7', 'Beta': '#ffbd2e', 'Concept': '#64748b',
}

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const [hovered, setHovered] = useState(null)
  const tags = ['All', 'React', 'Python', 'Firebase', 'AI/ML']

  const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.tags.includes(filter))

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'var(--win-bg)', padding: '1.5rem', fontFamily: 'var(--font-sans)' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>
          <i className="fas fa-folder-open" style={{ color: 'var(--neon)', marginRight: '0.5rem' }} />
          My Projects
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          {PROJECTS.length} projects · Click cards to explore
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            style={{
              padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem',
              fontFamily: 'var(--font-mono)', cursor: 'pointer',
              background: filter === tag ? 'var(--neon)' : 'var(--surface)',
              color: filter === tag ? '#000' : 'var(--text-dim)',
              border: `1px solid ${filter === tag ? 'var(--neon)' : 'var(--border)'}`,
              transition: 'all 0.2s', fontWeight: filter === tag ? 700 : 400,
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filtered.map((proj, i) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onMouseEnter={() => setHovered(proj.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: 'var(--surface)',
              border: `1px solid ${hovered === proj.id ? proj.color : 'var(--border)'}`,
              borderRadius: '12px', padding: '1.25rem',
              cursor: 'default',
              transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
              transform: hovered === proj.id ? 'translateY(-3px)' : 'none',
              boxShadow: hovered === proj.id ? `0 8px 24px ${proj.color}22` : '0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            {/* Card Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                background: `${proj.color}22`, border: `1px solid ${proj.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: proj.color, fontSize: '1rem',
              }}>
                <i className={proj.icon} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                    {proj.title}
                  </h3>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.6rem', padding: '1px 6px', borderRadius: '3px',
                    background: `${STATUS_COLORS[proj.status]}22`,
                    color: STATUS_COLORS[proj.status],
                    border: `1px solid ${STATUS_COLORS[proj.status]}44`,
                    fontFamily: 'var(--font-mono)',
                  }}>
                    {proj.status}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{proj.year}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.73rem', color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: '0.9rem' }}>
              {proj.desc}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem' }}>
              {proj.tags.map(tag => (
                <span key={tag} style={{
                  padding: '2px 7px', borderRadius: '4px', fontSize: '0.6rem',
                  background: 'var(--surface2)', color: 'var(--text-dim)',
                  border: '1px solid var(--border)', fontFamily: 'var(--font-mono)',
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a href={proj.github} target="_blank" rel="noopener noreferrer"
                style={{ ...btnStyle, background: 'var(--surface2)', color: 'var(--text)' }}>
                <i className="fab fa-github" style={{ marginRight: '0.3rem' }} /> GitHub
              </a>
              {proj.live && (
                <a href={proj.live} target="_blank" rel="noopener noreferrer"
                  style={{ ...btnStyle, background: `${proj.color}22`, color: proj.color, borderColor: `${proj.color}44` }}>
                  <i className="fas fa-external-link-alt" style={{ marginRight: '0.3rem' }} /> Live
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const btnStyle = {
  padding: '5px 12px', borderRadius: '6px', fontSize: '0.68rem',
  border: '1px solid var(--border)', cursor: 'pointer',
  fontFamily: 'var(--font-mono)', display: 'inline-flex', alignItems: 'center',
  transition: 'all 0.15s', textDecoration: 'none',
}
