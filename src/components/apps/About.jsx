import React from 'react'
import { motion } from 'framer-motion'

function useIsMobile() {
  const [mobile, setMobile] = React.useState(() => window.innerWidth <= 768)
  React.useEffect(() => {
    const h = () => setMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return mobile
}

const SKILLS_PREVIEW = [
  { label: 'React / JS', pct: 88, color: '#00d4ff' },
  { label: 'Python',     pct: 82, color: '#7b2ff7' },
  { label: 'CSS / UI',   pct: 85, color: '#f107a3' },
  { label: 'Firebase',   pct: 72, color: '#ffbd2e' },
]

const TIMELINE = [
  { year: '2022', title: 'Started Web Dev Journey', desc: 'Began learning HTML, CSS & JavaScript from scratch.', icon: '🚀' },
  { year: '2023', title: 'First Full-Stack Project', desc: 'Built Library Management System with Python & SQL.', icon: '📚' },
  { year: '2023', title: 'Web Dev Certificate', desc: 'Completed professional web development certification.', icon: '🏆' },
  { year: '2024', title: 'React & Firebase', desc: 'Mastered modern React ecosystem and real-time backends.', icon: '⚛️' },
  { year: '2024', title: 'OS-Style Portfolio', desc: 'Designed this unique OS-themed portfolio from scratch.', icon: '🖥️' },
]

export default function About() {
  const isMobile = useIsMobile()

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'var(--win-bg)', fontFamily: 'var(--font-sans)', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ padding: isMobile ? '1rem' : '2rem', maxWidth: 680, margin: '0 auto' }}>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '1rem' : '1.5rem',
            alignItems: isMobile ? 'center' : 'center',
            marginBottom: '1.5rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border)',
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          {/* Avatar */}
          <div style={{
            width: isMobile ? '80px' : '90px',
            height: isMobile ? '80px' : '90px',
            borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
            boxShadow: '0 0 0 3px var(--neon2), 0 0 20px rgba(123,47,247,0.4)',
          }}>
            <img
              src="https://raw.githubusercontent.com/CodeCr4cker/Web-Storage/main/my%20all%20website%20logo%20image/logo.png"
              alt="Divyanshu Pandey"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: isMobile ? '1.2rem' : '1.4rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.2rem' }}>
              Divyanshu Pandey
            </h1>
            <p style={{ color: 'var(--neon)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
              Web Developer & Student
            </p>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'flex-start' }}>
              {['React', 'Python', 'Firebase', 'CSS'].map(tag => (
                <span key={tag} style={{
                  padding: '2px 8px', borderRadius: '20px',
                  background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)',
                  fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--neon)',
                }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Status — inline on mobile */}
            <div style={{ marginTop: '0.6rem', display: 'flex', gap: '1rem', justifyContent: isMobile ? 'center' : 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#39ff14', boxShadow: '0 0 6px #39ff14', flexShrink: 0 }} />
                <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>Available for work</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                📍 Kanpur, India
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bio */}
        <Section title="whoami" icon="fas fa-terminal">
          <p style={{ fontSize: isMobile ? '0.82rem' : '0.85rem', lineHeight: 1.8, color: 'var(--text-dim)' }}>
            I'm a passionate web developer and Computer Science student from Kanpur, India.
            I love building futuristic, interactive web experiences and exploring the intersection
            of design and technology. When I'm not coding, I'm learning about AI/ML, contributing
            to open source, or creating educational content on YouTube.
          </p>
        </Section>

        {/* Skills Preview */}
        <Section title="skills.preview" icon="fas fa-code">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {SKILLS_PREVIEW.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--text)' }}>{s.label}</span>
                  <span style={{ color: s.color }}>{s.pct}%</span>
                </div>
                <div style={{ height: '5px', background: 'var(--surface2)', borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                    style={{ height: '100%', background: `linear-gradient(90deg, ${s.color}99, ${s.color})`, borderRadius: '3px' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Timeline */}
        <Section title="timeline" icon="fas fa-history">
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '12px', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(180deg, var(--neon), var(--neon2))', opacity: 0.3 }} />
            {TIMELINE.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', paddingLeft: '0.5rem' }}
              >
                <div style={{
                  width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                  background: 'var(--surface2)', border: '2px solid var(--neon)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', zIndex: 1,
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--neon)', border: '1px solid rgba(0,212,255,0.3)', padding: '1px 6px', borderRadius: '3px', flexShrink: 0 }}>
                      {item.year}
                    </span>
                    <span style={{ fontSize: isMobile ? '0.78rem' : '0.8rem', fontWeight: 600, color: 'var(--text)' }}>{item.title}</span>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Contact Links */}
        <Section title="contact" icon="fas fa-link">
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr', gap: isMobile ? '0.4rem' : '0.5rem' }}>
            {[
              { icon: 'fab fa-github',   label: 'GitHub',   url: 'https://github.com/CodeCr4cker',    color: '#fff'      },
              { icon: 'fab fa-youtube',  label: 'YouTube',  url: 'https://youtube.com/@CodeCr4cker',  color: '#ff0000'   },
              { icon: 'fas fa-envelope', label: 'Email',    url: 'mailto:divyanshu@example.com',       color: 'var(--neon)' },
              { icon: 'fab fa-linkedin', label: 'LinkedIn', url: 'https://linkedin.com',               color: '#0a66c2'   },
            ].map(link => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: isMobile ? '0.6rem 0.7rem' : '0.6rem 0.9rem',
                  borderRadius: '8px',
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  fontSize: isMobile ? '0.75rem' : '0.78rem',
                  color: 'var(--text)', textDecoration: 'none',
                  transition: 'all 0.2s',
                  WebkitTapHighlightColor: 'transparent',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = link.color; e.currentTarget.style.background = 'var(--surface2)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)' }}
              >
                <i className={link.icon} style={{ color: link.color, width: '16px', flexShrink: 0 }} />
                {link.label}
              </a>
            ))}
          </div>
        </Section>

      </div>
    </div>
  )
}

function Section({ title, icon, children }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        marginBottom: '0.75rem', paddingBottom: '0.4rem',
        borderBottom: '1px solid rgba(0,212,255,0.1)',
      }}>
        <i className={icon} style={{ color: 'var(--neon)', fontSize: '0.8rem' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--neon)', letterSpacing: '1px', textTransform: 'uppercase' }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}
