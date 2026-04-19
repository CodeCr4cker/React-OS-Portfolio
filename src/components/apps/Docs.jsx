import React, { useState } from 'react'
import { motion } from 'framer-motion'

const CERTIFICATES = [
  { id: 'cert1', icon: '🌐', name: 'Web Development', year: '2023', issuer: 'Online Course',
    img: 'https://raw.githubusercontent.com/CodeCr4cker/Web-Storage/main/divyanshu/images/Divyanshu_Pandey_Certificate.png' },
  { id: 'cert2', icon: '🐍', name: 'Python Mastery', year: '2023', issuer: 'Certified Course',
    img: 'https://raw.githubusercontent.com/CodeCr4cker/Web-Storage/main/divyanshu/images/certificate.jpg' },
  { id: 'cert3', icon: '🔐', name: 'Cybersecurity Basics', year: '2024', issuer: 'Certified Course',
    img: 'https://raw.githubusercontent.com/CodeCr4cker/Web-Storage/main/divyanshu/images/Divyanshu_Pandey_Certificate.png' },
  { id: 'cert4', icon: '⚡', name: 'JavaScript Expert', year: '2024', issuer: 'Certified Course',
    img: 'https://raw.githubusercontent.com/CodeCr4cker/Web-Storage/main/divyanshu/images/Divyanshu_Pandey_Certificate.png' },
]

function CertModal({ cert, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
        zIndex: 9500, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', backdropFilter: 'blur(8px)',
      }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', maxWidth: '90vw' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', padding: '0 0.25rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--neon)' }}>
            {cert.icon} {cert.name}
          </span>
          <button onClick={onClose} style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <i className="fas fa-times" />
          </button>
        </div>
        <img
          src={cert.img}
          alt={cert.name}
          style={{ maxWidth: '88vw', maxHeight: '75vh', borderRadius: '12px', objectFit: 'contain', boxShadow: '0 8px 48px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,212,255,0.15)' }}
        />
      </motion.div>
    </motion.div>
  )
}

export default function Docs() {
  const [tab, setTab] = useState('resume')
  const [viewingCert, setViewingCert] = useState(null)

  const tabs = [
    { id: 'resume', label: 'Resume', icon: 'fas fa-file-user' },
    { id: 'certs', label: 'Certificates', icon: 'fas fa-certificate' },
    { id: 'education', label: 'Education', icon: 'fas fa-graduation-cap' },
  ]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--win-bg)', fontFamily: 'var(--font-sans)' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0, padding: '0 1rem', gap: '0.25rem' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '0.65rem 1rem', borderRadius: '0', fontSize: '0.72rem',
            background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)',
            color: tab === t.id ? 'var(--neon)' : 'var(--text-dim)',
            borderBottom: `2px solid ${tab === t.id ? 'var(--neon)' : 'transparent'}`,
            marginBottom: '-1px', transition: 'all 0.2s',
          }}>
            <i className={t.icon} style={{ marginRight: '0.4rem' }} />
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        {/* Resume Tab */}
        {tab === 'resume' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--text)' }}>
                <i className="fas fa-file-alt" style={{ color: 'var(--neon)', marginRight: '0.5rem' }} />
                Curriculum Vitae
              </h2>
              <a href="#" style={{
                padding: '0.4rem 0.9rem', borderRadius: '6px',
                background: 'linear-gradient(135deg, var(--neon2), var(--neon))',
                color: '#fff', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              }}>
                <i className="fas fa-download" /> Download PDF
              </a>
            </div>

            {/* Resume Sections */}
            {[
              {
                title: 'Experience', icon: 'fas fa-briefcase',
                items: [
                  { title: 'Freelance Web Developer', org: 'Self-employed', period: '2023 – Present', desc: 'Building custom websites and web apps for clients. Specializing in React and Firebase solutions.' },
                  { title: 'YouTube Content Creator', org: 'CodeCr4cker Channel', period: '2023 – Present', desc: 'Creating educational programming content covering Python, Web Dev, and AI projects.' },
                ],
              },
              {
                title: 'Education', icon: 'fas fa-graduation-cap',
                items: [
                  { title: 'B.Sc. Computer Science', org: 'University, Kanpur', period: '2022 – 2025', desc: 'Studying core CS fundamentals including algorithms, data structures, OS, and networking.' },
                ],
              },
            ].map(section => (
              <div key={section.title} style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem', paddingBottom: '0.4rem', borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
                  <i className={section.icon} style={{ color: 'var(--neon)', fontSize: '0.8rem' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--neon)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {section.title}
                  </span>
                </div>
                {section.items.map((item, i) => (
                  <div key={i} style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem',
                    borderLeft: '3px solid var(--neon)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>{item.title}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--neon2)' }}>{item.org}</div>
                      </div>
                      <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>{item.period}</span>
                    </div>
                    <p style={{ fontSize: '0.73rem', color: 'var(--text-dim)', lineHeight: 1.6, marginTop: '0.4rem' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        )}

        {/* Certificates Tab */}
        {tab === 'certs' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--text)', marginBottom: '1.25rem' }}>
              <i className="fas fa-certificate" style={{ color: 'var(--neon)', marginRight: '0.5rem' }} />
              Certificates
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {CERTIFICATES.map((cert, i) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => setViewingCert(cert)}
                  style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: '12px', padding: '1.25rem', cursor: 'pointer',
                    transition: 'all 0.2s', textAlign: 'center',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{cert.icon}</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.2rem' }}>{cert.name}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{cert.issuer}</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--neon)', fontFamily: 'var(--font-mono)', marginTop: '0.3rem' }}>📅 {cert.year}</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>Click to view →</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Education Tab */}
        {tab === 'education' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--text)', marginBottom: '1.25rem' }}>
              <i className="fas fa-graduation-cap" style={{ color: 'var(--neon)', marginRight: '0.5rem' }} />
              Education
            </h2>
            {[
              { degree: 'B.Sc. Computer Science', school: 'University, Kanpur', period: '2022 – 2025', gpa: '8.4 / 10', icon: '🎓' },
              { degree: 'Higher Secondary (Science)', school: 'UP Board', period: '2020 – 2022', gpa: '78%', icon: '📚' },
            ].map((edu, i) => (
              <div key={i} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '1.25rem', marginBottom: '0.75rem',
                display: 'flex', gap: '1rem', alignItems: 'flex-start',
              }}>
                <div style={{ fontSize: '2rem' }}>{edu.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>{edu.degree}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--neon2)', marginBottom: '0.4rem' }}>{edu.school}</div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                    <span>📅 {edu.period}</span>
                    <span style={{ color: 'var(--neon)' }}>⭐ GPA: {edu.gpa}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Certificate Modal */}
      {viewingCert && <CertModal cert={viewingCert} onClose={() => setViewingCert(null)} />}
    </div>
  )
}
