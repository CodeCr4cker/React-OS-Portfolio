import React, { useState } from 'react'
import { motion } from 'framer-motion'

const SOCIALS = [
  { id:'github',    name:'GitHub',    handle:'@CodeCr4cker',          url:'https://github.com/CodeCr4cker',           icon:'fab fa-github',    color:'#fff',    bg:'#24292e',   desc:'Open source projects & code'       },
  { id:'youtube',   name:'YouTube',   handle:'@CodeCr4cker',          url:'https://youtube.com/@CodeCr4cker',         icon:'fab fa-youtube',   color:'#fff',    bg:'#ff0000',   desc:'Programming tutorials & demos'      },
  { id:'linkedin',  name:'LinkedIn',  handle:'Divyanshu Pandey',      url:'https://linkedin.com',                     icon:'fab fa-linkedin',  color:'#fff',    bg:'#0a66c2',   desc:'Professional network & resume'      },
  { id:'instagram', name:'Instagram', handle:'@divyanshu.dev',        url:'https://instagram.com',                    icon:'fab fa-instagram', color:'#fff',    bg:'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', desc:'Dev life & creative posts' },
  { id:'twitter',   name:'Twitter/X', handle:'@CodeCr4cker',          url:'https://twitter.com',                      icon:'fab fa-x-twitter', color:'#fff',    bg:'#000',      desc:'Tech thoughts & updates'            },
  { id:'email',     name:'Email',     handle:'divyanshu@example.com', url:'mailto:divyanshu@example.com',             icon:'fas fa-envelope',  color:'#fff',    bg:'linear-gradient(135deg,#00d4ff,#7b2ff7)', desc:'Direct contact' },
]

const STATS = [
  { label:'GitHub Stars',  value:'120+', icon:'fas fa-star',           color:'#f59e0b' },
  { label:'YouTube Views', value:'8K+',  icon:'fab fa-youtube',        color:'#ff0000' },
  { label:'Projects',      value:'12+',  icon:'fas fa-folder',         color:'#00d4ff' },
  { label:'Commits',       value:'500+', icon:'fas fa-code-branch',    color:'#39ff14' },
]

export default function Social() {
  const [hovered, setHovered] = useState(null)

  return (
    <div style={{ height:'100%', overflowY:'auto', background:'var(--win-bg)', fontFamily:'var(--font-sans)', padding:'1.5rem' }}>

      {/* Header */}
      <div style={{ marginBottom:'1.5rem', textAlign:'center' }}>
        <div style={{ width:70, height:70, borderRadius:'50%', overflow:'hidden', margin:'0 auto 0.75rem', boxShadow:'0 0 0 3px var(--neon2), 0 0 20px rgba(123,47,247,0.4)' }}>
          <img src="https://raw.githubusercontent.com/CodeCr4cker/Web-Storage/main/my%20all%20website%20logo%20image/logo.png" alt="Divyanshu" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        </div>
        <h2 style={{ fontFamily:'var(--font-mono)', fontSize:'1.1rem', color:'var(--text)', marginBottom:'0.2rem' }}>Divyanshu Pandey</h2>
        <p style={{ fontSize:'0.75rem', color:'var(--neon)', fontFamily:'var(--font-mono)' }}>Web Developer · Open Source · Content Creator</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.5rem', marginBottom:'1.75rem' }}>
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
            style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:'0.75rem', textAlign:'center' }}>
            <i className={s.icon} style={{ fontSize:'1.1rem', color:s.color, marginBottom:'0.4rem', display:'block' }} />
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'1rem', fontWeight:700, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:'0.6rem', color:'var(--text-dim)', marginTop:'2px' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Social Links */}
      <div style={{ marginBottom:'1.5rem' }}>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', color:'var(--neon)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'0.9rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <i className="fas fa-link" /> Connect with me
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
          {SOCIALS.map((s, i) => (
            <motion.a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity:0, x:-12 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:i*0.06 }}
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display:'flex', alignItems:'center', gap:'1rem',
                padding:'0.85rem 1rem', borderRadius:12,
                background: hovered===s.id ? 'var(--surface2)' : 'var(--surface)',
                border:`1px solid ${hovered===s.id ? s.color || 'var(--neon)' : 'var(--border)'}`,
                textDecoration:'none', color:'var(--text)',
                transition:'all 0.2s',
                transform: hovered===s.id ? 'translateX(4px)' : 'none',
              }}
            >
              {/* Icon */}
              <div style={{
                width:42, height:42, borderRadius:12, flexShrink:0,
                background:s.bg,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'1.1rem', color:s.color,
                boxShadow: hovered===s.id ? `0 4px 16px rgba(0,0,0,0.3)` : 'none',
                transition:'box-shadow 0.2s',
              }}>
                <i className={s.icon} />
              </div>

              {/* Info */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'0.85rem', fontWeight:600, color:'var(--text)', marginBottom:'2px' }}>{s.name}</div>
                <div style={{ fontSize:'0.68rem', color:'var(--text-dim)', fontFamily:'var(--font-mono)' }}>{s.handle}</div>
              </div>

              {/* Description */}
              <div style={{ fontSize:'0.65rem', color:'var(--text-dim)', textAlign:'right', maxWidth:120 }}>
                {s.desc}
              </div>

              {/* Arrow */}
              <i className="fas fa-arrow-right" style={{ color: hovered===s.id ? 'var(--neon)' : 'var(--text-muted)', fontSize:'0.75rem', flexShrink:0, transition:'color 0.2s' }} />
            </motion.a>
          ))}
        </div>
      </div>

      {/* Quick message form */}
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'1.25rem' }}>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', color:'var(--neon)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'0.9rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <i className="fas fa-paper-plane" /> Quick Message
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
          <input placeholder="Your name" style={inputSty} />
          <input placeholder="Email address" type="email" style={inputSty} />
          <textarea placeholder="Your message…" rows={3} style={{ ...inputSty, resize:'vertical', lineHeight:1.6 }} />
          <button style={{
            padding:'0.6rem', borderRadius:8, background:'linear-gradient(135deg,var(--neon2),var(--neon))',
            color:'#fff', border:'none', cursor:'pointer', fontSize:'0.75rem',
            fontFamily:'var(--font-mono)', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem',
          }}
            onClick={() => alert('In production, connect this to EmailJS or a backend endpoint!')}
          >
            <i className="fas fa-paper-plane" /> Send Message
          </button>
          <p style={{ fontSize:'0.6rem', color:'var(--text-muted)', textAlign:'center', fontFamily:'var(--font-mono)' }}>
            Or use the Chat app for real-time messaging
          </p>
        </div>
      </div>

    </div>
  )
}

const inputSty = {
  width:'100%', background:'var(--surface2)', border:'1px solid var(--border)',
  borderRadius:8, padding:'0.5rem 0.75rem', color:'var(--text)', fontSize:'0.78rem',
  fontFamily:'var(--font-sans)', outline:'none',
}
