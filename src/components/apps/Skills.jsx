import React, { useState } from 'react'
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

const SKILL_CATEGORIES = [
  {
    id: 'frontend', label: 'Frontend', icon: 'fas fa-paint-brush', color: '#00d4ff',
    skills: [
      { name: 'React',         level: 88, icon: 'fab fa-react'    },
      { name: 'JavaScript',    level: 85, icon: 'fab fa-js'       },
      { name: 'HTML5',         level: 95, icon: 'fab fa-html5'    },
      { name: 'CSS3',          level: 90, icon: 'fab fa-css3-alt' },
      { name: 'Framer Motion', level: 75, icon: 'fas fa-film'     },
    ],
  },
  {
    id: 'backend', label: 'Backend', icon: 'fas fa-server', color: '#7b2ff7',
    skills: [
      { name: 'Python',    level: 82, icon: 'fab fa-python'  },
      { name: 'Node.js',   level: 68, icon: 'fab fa-node-js' },
      { name: 'Firebase',  level: 78, icon: 'fas fa-fire'    },
      { name: 'SQL',       level: 74, icon: 'fas fa-database'},
      { name: 'REST APIs', level: 80, icon: 'fas fa-plug'    },
    ],
  },
  {
    id: 'tools', label: 'Tools', icon: 'fas fa-tools', color: '#39ff14',
    skills: [
      { name: 'Git & GitHub', level: 85, icon: 'fab fa-git-alt' },
      { name: 'VS Code',      level: 92, icon: 'fas fa-code'    },
      { name: 'Linux',        level: 70, icon: 'fab fa-linux'   },
      { name: 'Vite',         level: 78, icon: 'fas fa-bolt'    },
      { name: 'npm/yarn',     level: 82, icon: 'fab fa-npm'     },
    ],
  },
  {
    id: 'ai', label: 'AI/ML', icon: 'fas fa-robot', color: '#f107a3',
    skills: [
      { name: 'OpenCV',      level: 72, icon: 'fas fa-eye'           },
      { name: 'MediaPipe',   level: 65, icon: 'fas fa-hand-sparkles' },
      { name: 'Python ML',   level: 60, icon: 'fab fa-python'        },
      { name: 'Prompt Eng.', level: 80, icon: 'fas fa-brain'         },
    ],
  },
]

function getLevelLabel(pct) {
  if (pct >= 90) return 'Expert'
  if (pct >= 75) return 'Advanced'
  if (pct >= 60) return 'Intermediate'
  return 'Learning'
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState('frontend')
  const isMobile = useIsMobile()

  const category = SKILL_CATEGORIES.find(c => c.id === activeTab) || SKILL_CATEGORIES[0]
  const avg = Math.round(category.skills.reduce((a, s) => a + s.level, 0) / category.skills.length)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--win-bg)', fontFamily: 'var(--font-sans)', overflow: 'hidden' }}>

      {/* ── Tab Bar ── */}
      <div style={{
        display: 'flex',
        gap: '0.2rem',
        padding: isMobile ? '0.5rem 0.5rem 0' : '0.75rem 1.5rem 0',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}>
        {SKILL_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            style={{
              padding: isMobile ? '0.45rem 0.7rem' : '0.5rem 1rem',
              borderRadius: '8px 8px 0 0',
              fontFamily: 'var(--font-mono)',
              fontSize: isMobile ? '0.65rem' : '0.72rem',
              cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              background: activeTab === cat.id ? 'var(--surface)' : 'transparent',
              color: activeTab === cat.id ? cat.color : 'var(--text-dim)',
              border: `1px solid ${activeTab === cat.id ? 'var(--border)' : 'transparent'}`,
              borderBottom: activeTab === cat.id ? '1px solid var(--win-bg)' : '1px solid transparent',
              marginBottom: '-1px',
              transition: 'all 0.2s',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <i className={cat.icon} style={{ marginRight: isMobile ? '0.3rem' : '0.4rem' }} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '0.9rem' : '1.5rem', WebkitOverflowScrolling: 'touch' }}>

        {/* Mobile: stacked layout | Desktop: 2-col grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '1.25rem' : '1.5rem',
        }}>

          {/* ── Skill Bars ── */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: category.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
              <i className={category.icon} style={{ marginRight: '0.5rem' }} />
              {category.label} Skills
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '0.85rem' : '1rem' }}>
              {category.skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <i className={skill.icon} style={{ color: category.color, width: '16px', fontSize: '0.85rem' }} />
                      <span style={{ fontSize: isMobile ? '0.82rem' : '0.8rem', fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                        {skill.name}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.58rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        {getLevelLabel(skill.level)}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: category.color, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                        {skill.level}%
                      </span>
                    </div>
                  </div>
                  <div style={{ height: '6px', background: 'var(--surface2)', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 0.7, delay: 0.2 + i * 0.07, ease: 'easeOut' }}
                      style={{
                        height: '100%', borderRadius: '3px',
                        background: `linear-gradient(90deg, ${category.color}88, ${category.color})`,
                        boxShadow: `0 0 8px ${category.color}66`,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Stats Panel ── */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--neon2)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
              <i className="fas fa-chart-bar" style={{ marginRight: '0.5rem' }} />
              Stats
            </h3>

            {/* Average score — horizontal on mobile */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: isMobile ? '0.9rem 1rem' : '1.25rem',
              marginBottom: '0.75rem',
              display: 'flex', alignItems: 'center',
              justifyContent: isMobile ? 'space-between' : 'center',
              flexDirection: isMobile ? 'row' : 'column',
              gap: isMobile ? '0' : '0.3rem',
              textAlign: isMobile ? 'left' : 'center',
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                Average Proficiency
              </div>
              <div style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 700, color: category.color, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                {avg}%
              </div>
            </div>

            {/* Mini level table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {category.skills.map(skill => (
                <div key={skill.name} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: isMobile ? '0.45rem 0.65rem' : '0.5rem 0.75rem',
                  borderRadius: '8px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  fontSize: isMobile ? '0.7rem' : '0.72rem',
                }}>
                  <span style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{skill.name}</span>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[...Array(5)].map((_, j) => (
                      <div key={j} style={{
                        width: isMobile ? '9px' : '10px',
                        height: isMobile ? '9px' : '10px',
                        borderRadius: '2px',
                        background: j < Math.round(skill.level / 20) ? category.color : 'var(--surface2)',
                        transition: 'background 0.2s',
                      }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
