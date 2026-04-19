import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CERTIFICATES = [
  { id: 'cert1', title: 'Web Development', img: 'https://raw.githubusercontent.com/CodeCr4cker/Web-Storage/main/divyanshu/images/Divyanshu_Pandey_Certificate.png' },
  { id: 'cert2', title: 'Python Mastery', img: 'https://raw.githubusercontent.com/CodeCr4cker/Web-Storage/main/divyanshu/images/certificate.jpg' },
  { id: 'cert3', title: 'Cybersecurity', img: 'https://raw.githubusercontent.com/CodeCr4cker/Web-Storage/main/divyanshu/images/Divyanshu_Pandey_Certificate.png' },
  { id: 'cert4', title: 'JavaScript Expert', img: 'https://raw.githubusercontent.com/CodeCr4cker/Web-Storage/main/divyanshu/images/Divyanshu_Pandey_Certificate.png' },
]

const GALLERY_PHOTOS = [
  { id: 1, title: 'Portfolio v1', img: 'https://raw.githubusercontent.com/CodeCr4cker/Web-Storage/main/Portofolio-OS/07de4966-b419-48a2-9d13-2e5b2f4f9c42.png', category: 'Projects' },
  { id: 2, title: 'Logo Design', img: 'https://raw.githubusercontent.com/CodeCr4cker/Web-Storage/main/my%20all%20website%20logo%20image/logo.png', category: 'Design' },
]

function LightboxModal({ item, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 9500, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}
    >
      <motion.div initial={{ scale: 0.88 }} animate={{ scale: 1 }} exit={{ scale: 0.88 }}
        onClick={e => e.stopPropagation()}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--neon)', fontSize: '0.8rem' }}>{item.title}</span>
          <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer' }}>✕</button>
        </div>
        <img src={item.img} alt={item.title} style={{ maxWidth: '85vw', maxHeight: '75vh', borderRadius: '12px', objectFit: 'contain' }} />
      </motion.div>
    </motion.div>
  )
}

export default function Gallery() {
  const [tab, setTab] = useState('certs')
  const [lightbox, setLightbox] = useState(null)

  const items = tab === 'certs' ? CERTIFICATES : GALLERY_PHOTOS

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--win-bg)', fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        {[['certs', 'Certificates', 'fas fa-certificate'], ['photos', 'Photos', 'fas fa-images']].map(([id, label, icon]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.72rem',
            background: tab === id ? 'var(--neon)' : 'var(--surface)', color: tab === id ? '#000' : 'var(--text-dim)',
            border: `1px solid ${tab === id ? 'var(--neon)' : 'var(--border)'}`,
            cursor: 'pointer', fontFamily: 'var(--font-mono)',
          }}>
            <i className={icon} style={{ marginRight: '0.4rem' }} />{label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.9rem' }}>
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setLightbox(item)}
              style={{ cursor: 'pointer', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon)'; e.currentTarget.style.transform = 'scale(1.02)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'scale(1)' }}
            >
              <img src={item.img} alt={item.title} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '0.5rem 0.6rem', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>{item.title}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>{lightbox && <LightboxModal item={lightbox} onClose={() => setLightbox(null)} />}</AnimatePresence>
    </div>
  )
}
