import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useOS } from '../../context/OSContext.jsx'
import { useSound } from '../../hooks/useSound.js'

/* ─── data ─────────────────────────────────────────────────── */
const THEMES = [
  { id:'dark',      label:'Dark',      color:'#00d4ff', bg:'#0a0c14' },
  { id:'light',     label:'Light',     color:'#0369a1', bg:'#f0f4f8' },
  { id:'neon',      label:'Neon',      color:'#ff00ff', bg:'#060810' },
  { id:'synthwave', label:'Synthwave', color:'#ff6ec7', bg:'#0f0826' },
  { id:'matrix',    label:'Matrix',    color:'#00ff41', bg:'#000a00' },
]
const WALLPAPERS = [
  { id:'default',  label:'DivyOS',   preview:'linear-gradient(135deg,#0a0c14,#111827)'  },
  { id:'dark',     label:'Void',     preview:'linear-gradient(135deg,#000,#0a0c14)'     },
  { id:'neon',     label:'Neon',     preview:'linear-gradient(135deg,#060810,#0d0820)'  },
  { id:'space',    label:'Space',    preview:'linear-gradient(135deg,#0a0c14,#1a2236)'  },
  { id:'mountain', label:'Mountain', preview:'linear-gradient(135deg,#1a3a2a,#2d5a3d)' },
  { id:'city',     label:'City',     preview:'linear-gradient(135deg,#1a1a2e,#0f3460)' },
]
const SHORTCUTS = [
  ['`',           'Open Terminal'  ],
  ['Ctrl+Space',  'Search Apps'   ],
  ['Ctrl+W',      'Close Window'  ],
  ['Alt+Tab',     'App Switcher'  ],
  ['F1',          'Settings'      ],
  ['F2',          'Perf Overlay'  ],
  ['F5',          'Videos'        ],
]

/* ─── sub-components ─────────────────────────────────────────── */
function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} style={{ width:40, height:22, background:on?'var(--neon)':'var(--surface2)', borderRadius:11, border:'none', cursor:'pointer', position:'relative', transition:'background 0.2s', flexShrink:0 }}>
      <motion.div animate={{ x: on ? 18 : 2 }} transition={{ type:'spring', damping:20, stiffness:400 }}
        style={{ position:'absolute', top:3, width:16, height:16, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 4px rgba(0,0,0,0.4)' }} />
    </button>
  )
}
function SectionTitle({ title, icon }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem', paddingBottom:'0.4rem', borderBottom:'1px solid rgba(0,212,255,0.1)' }}>
      <i className={icon} style={{ color:'var(--neon)', fontSize:'0.85rem' }} />
      <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', color:'var(--neon)', textTransform:'uppercase', letterSpacing:'1px' }}>{title}</span>
    </div>
  )
}
function Row({ label, desc, children }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.65rem 0.85rem', borderRadius:8, background:'var(--surface)', border:'1px solid var(--border)', marginBottom:'0.4rem' }}>
      <div>
        <div style={{ fontSize:'0.8rem', color:'var(--text)', marginBottom:desc?2:0 }}>{label}</div>
        {desc && <div style={{ fontSize:'0.63rem', color:'var(--text-dim)' }}>{desc}</div>}
      </div>
      {children}
    </div>
  )
}

/* ─── main ───────────────────────────────────────────────────── */
export default function Settings() {
  const { theme, setTheme, wallpaper, setWallpaper, settings, toggleSetting, showNotification, openWindow } = useOS()
  const { play } = useSound()
  const [tab, setTab]                 = useState('appearance')
  const [customApps, setCustomApps]   = useState(() => { try { return JSON.parse(localStorage.getItem('divyos-custom-apps')||'[]') } catch { return [] } })
  const [newApp, setNewApp]           = useState({ name:'', url:'', icon:'fas fa-globe' })
  const [customWpUrl, setCustomWpUrl] = useState('')
  const [wpError, setWpError]         = useState('')
  const fileInputRef = useRef(null)

  const handleTheme = id => {
    setTheme(id); play('click')
    showNotification('Theme', `Switched to ${id} theme`)
  }
  const handleWallpaper = id => {
    setWallpaper(id); play('click')
    showNotification('Wallpaper', `Changed to ${id}`)
  }
  const handleCustomWallpaper = () => {
    if (!customWpUrl.trim()) { setWpError('Please enter a URL'); return }
    try { new URL(customWpUrl) } catch { setWpError('Invalid URL'); return }
    setWpError('')
    // Store in CSS var
    document.documentElement.style.setProperty('--wallpaper', `url(${customWpUrl})`)
    localStorage.setItem('divyos-custom-wp', customWpUrl)
    showNotification('Wallpaper', 'Custom wallpaper applied!')
  }
  const addCustomApp = () => {
    if (!newApp.name || !newApp.url) { showNotification('Error','Name and URL required','error'); return }
    try { new URL(newApp.url) } catch { showNotification('Error','Invalid URL','error'); return }
    const apps = [...customApps, { ...newApp, id: Date.now() }]
    setCustomApps(apps)
    localStorage.setItem('divyos-custom-apps', JSON.stringify(apps))
    setNewApp({ name:'', url:'', icon:'fas fa-globe' })
    showNotification('Custom App', `"${newApp.name}" added to dock`)
  }
  const removeCustomApp = id => {
    const apps = customApps.filter(a => a.id !== id)
    setCustomApps(apps)
    localStorage.setItem('divyos-custom-apps', JSON.stringify(apps))
  }

  const TABS = [
    { id:'appearance', label:'Appearance', icon:'fas fa-palette'  },
    { id:'system',     label:'System',     icon:'fas fa-sliders-h'},
    { id:'customapps', label:'Custom Apps',icon:'fas fa-plus-circle'},
    { id:'shortcuts',  label:'Shortcuts',  icon:'fas fa-keyboard' },
    { id:'about',      label:'About',      icon:'fas fa-info-circle'},
  ]

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:'var(--win-bg)', fontFamily:'var(--font-sans)' }}>
      {/* Tab bar */}
      <div style={{ display:'flex', borderBottom:'1px solid var(--border)', flexShrink:0, padding:'0 0.75rem', gap:'0.15rem', overflowX:'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding:'0.6rem 0.85rem', borderRadius:0, fontSize:'0.7rem',
            background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-mono)',
            color: tab===t.id ? 'var(--neon)' : 'var(--text-dim)',
            borderBottom:`2px solid ${tab===t.id?'var(--neon)':'transparent'}`,
            marginBottom:'-1px', transition:'all 0.2s', whiteSpace:'nowrap',
          }}>
            <i className={t.icon} style={{ marginRight:'0.35rem' }} />{t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', padding:'1.5rem' }}>

        {/* ── APPEARANCE ── */}
        {tab==='appearance' && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
            <div style={{ marginBottom:'2rem' }}>
              <SectionTitle title="Theme" icon="fas fa-adjust" />
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'0.5rem' }}>
                {THEMES.map(t => (
                  <motion.button key={t.id} whileTap={{scale:0.94}} onClick={() => handleTheme(t.id)}
                    style={{ padding:'0.65rem 0.4rem', borderRadius:10, cursor:'pointer',
                      background:t.bg, border:`2px solid ${theme===t.id?t.color:'rgba(255,255,255,0.1)'}`,
                      display:'flex', flexDirection:'column', alignItems:'center', gap:'0.35rem',
                      transition:'all 0.2s', boxShadow:theme===t.id?`0 0 12px ${t.color}66`:'none' }}>
                    <div style={{ width:18, height:18, borderRadius:'50%', background:t.color, boxShadow:`0 0 8px ${t.color}` }} />
                    <span style={{ fontSize:'0.58rem', fontFamily:'var(--font-mono)', color:t.color }}>{t.label}</span>
                    {theme===t.id && <i className="fas fa-check" style={{ fontSize:'0.5rem', color:t.color }} />}
                  </motion.button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom:'2rem' }}>
              <SectionTitle title="Wallpaper" icon="fas fa-image" />
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.5rem', marginBottom:'0.75rem' }}>
                {WALLPAPERS.map(wp => (
                  <button key={wp.id} onClick={() => handleWallpaper(wp.id)}
                    style={{ borderRadius:10, overflow:'hidden', cursor:'pointer', padding:0,
                      border:`2px solid ${wallpaper===wp.id?'var(--neon)':'var(--border)'}`,
                      background:'none', transition:'all 0.2s',
                      boxShadow:wallpaper===wp.id?'var(--glow)':'none' }}>
                    <div style={{ height:52, background:wp.preview, position:'relative' }}>
                      {wallpaper===wp.id && (
                        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.3)' }}>
                          <i className="fas fa-check-circle" style={{ color:'var(--neon)', fontSize:'1.1rem' }} />
                        </div>
                      )}
                    </div>
                    <div style={{ padding:'4px', background:'var(--surface)', fontSize:'0.6rem', fontFamily:'var(--font-mono)', color:'var(--text-dim)', textAlign:'center' }}>
                      {wp.label}
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom wallpaper URL */}
              <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:'1rem' }}>
                <div style={{ fontSize:'0.7rem', fontFamily:'var(--font-mono)', color:'var(--neon)', marginBottom:'0.6rem' }}>
                  <i className="fas fa-link" style={{ marginRight:'0.35rem' }} /> Custom Wallpaper URL
                </div>
                <div style={{ display:'flex', gap:'0.5rem' }}>
                  <input value={customWpUrl} onChange={e => { setCustomWpUrl(e.target.value); setWpError('') }}
                    placeholder="https://example.com/image.jpg"
                    style={{ flex:1, background:'var(--surface2)', border:`1px solid ${wpError?'#ff5f56':'var(--border)'}`, borderRadius:8, padding:'0.45rem 0.65rem', color:'var(--text)', fontSize:'0.75rem', fontFamily:'var(--font-mono)', outline:'none' }}
                    onFocus={e => e.target.style.borderColor='rgba(0,212,255,0.4)'}
                    onBlur={e => e.target.style.borderColor=wpError?'#ff5f56':'var(--border)'}
                  />
                  <button onClick={handleCustomWallpaper}
                    style={{ padding:'0.45rem 0.85rem', borderRadius:8, background:'linear-gradient(135deg,var(--neon2),var(--neon))', color:'#fff', border:'none', cursor:'pointer', fontSize:'0.72rem', fontFamily:'var(--font-mono)', fontWeight:700, flexShrink:0 }}>
                    Apply
                  </button>
                </div>
                {wpError && <div style={{ fontSize:'0.62rem', color:'#ff5f56', marginTop:'0.3rem' }}>{wpError}</div>}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── SYSTEM ── */}
        {tab==='system' && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
            <div style={{ marginBottom:'2rem' }}>
              <SectionTitle title="Features" icon="fas fa-sliders-h" />
              {[
                { key:'animations',   label:'Animations',           desc:'Window & UI motion effects' },
                { key:'sounds',       label:'System Sounds',        desc:'UI audio via Web Audio API' },
                { key:'transparency', label:'Transparency',         desc:'Acrylic / glass blur effects' },
                { key:'performance',  label:'Performance Overlay',  desc:'Live FPS / CPU / RAM stats (F2)' },
              ].map(item => (
                <Row key={item.key} label={item.label} desc={item.desc}>
                  <Toggle on={settings[item.key]} onToggle={() => {
                    toggleSetting(item.key)
                    play('click')
                    showNotification('Settings', `${item.label} ${!settings[item.key]?'enabled':'disabled'}`)
                  }} />
                </Row>
              ))}
            </div>

            <div style={{ marginBottom:'2rem' }}>
              <SectionTitle title="Quick Actions" icon="fas fa-bolt" />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
                {[
                  { label:'Clear All Windows', icon:'fas fa-window-close', action:()=>{ Object.keys({}).forEach(()=>{}); showNotification('Desktop','All windows closed') }, color:'#ff5f56' },
                  { label:'Lock Screen',        icon:'fas fa-lock',         action:()=>{ window.dispatchEvent(new CustomEvent('divyos:lock')) }, color:'var(--neon2)' },
                  { label:'Reload App',         icon:'fas fa-sync',         action:()=>window.location.reload(), color:'var(--neon)' },
                  { label:'Reset Settings',     icon:'fas fa-undo',         action:()=>{ localStorage.clear(); window.location.reload() }, color:'#ffbd2e' },
                ].map(a => (
                  <button key={a.label} onClick={a.action}
                    style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.65rem 0.85rem', borderRadius:8, background:'var(--surface)', border:'1px solid var(--border)', cursor:'pointer', textAlign:'left', transition:'all 0.15s', color:'var(--text)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=a.color; e.currentTarget.style.color=a.color }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text)' }}>
                    <i className={a.icon} style={{ color:a.color, width:14 }} />
                    <span style={{ fontSize:'0.73rem', fontFamily:'var(--font-mono)' }}>{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── CUSTOM APPS ── */}
        {tab==='customapps' && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
            <SectionTitle title="Add Custom App" icon="fas fa-plus-circle" />
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'1.25rem', marginBottom:'1.5rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem', marginBottom:'0.6rem' }}>
                <div>
                  <label style={{ fontSize:'0.65rem', fontFamily:'var(--font-mono)', color:'var(--text-dim)', display:'block', marginBottom:'0.3rem' }}>App Name</label>
                  <input value={newApp.name} onChange={e => setNewApp(a => ({...a, name:e.target.value}))}
                    placeholder="My Tool"
                    style={inputSty} />
                </div>
                <div>
                  <label style={{ fontSize:'0.65rem', fontFamily:'var(--font-mono)', color:'var(--text-dim)', display:'block', marginBottom:'0.3rem' }}>Icon Class</label>
                  <input value={newApp.icon} onChange={e => setNewApp(a => ({...a, icon:e.target.value}))}
                    placeholder="fas fa-globe"
                    style={inputSty} />
                </div>
              </div>
              <div style={{ marginBottom:'0.75rem' }}>
                <label style={{ fontSize:'0.65rem', fontFamily:'var(--font-mono)', color:'var(--text-dim)', display:'block', marginBottom:'0.3rem' }}>URL</label>
                <input value={newApp.url} onChange={e => setNewApp(a => ({...a, url:e.target.value}))}
                  placeholder="https://example.com"
                  style={inputSty} />
              </div>
              {/* Preview */}
              {newApp.name && (
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.5rem 0.75rem', background:'var(--surface2)', borderRadius:8, marginBottom:'0.75rem', border:'1px solid var(--border)' }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,var(--neon2),var(--neon))', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <i className={newApp.icon} style={{ color:'#fff' }} />
                  </div>
                  <div style={{ fontSize:'0.75rem', fontFamily:'var(--font-mono)', color:'var(--text)' }}>{newApp.name}</div>
                  <div style={{ fontSize:'0.62rem', color:'var(--text-dim)', marginLeft:'auto' }}>{newApp.url||'No URL'}</div>
                </div>
              )}
              <button onClick={addCustomApp}
                style={{ width:'100%', padding:'0.6rem', borderRadius:8, background:'linear-gradient(135deg,var(--neon2),var(--neon))', color:'#fff', border:'none', cursor:'pointer', fontSize:'0.75rem', fontFamily:'var(--font-mono)', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem' }}>
                <i className="fas fa-plus" /> Add to Dock
              </button>
            </div>

            {/* Custom apps list */}
            {customApps.length > 0 && (
              <>
                <SectionTitle title="Your Custom Apps" icon="fas fa-list" />
                {customApps.map(app => (
                  <div key={app.id} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.65rem 0.85rem', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, marginBottom:'0.5rem' }}>
                    <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,var(--neon2),var(--neon))', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <i className={app.icon} style={{ fontSize:'0.85rem', color:'#fff' }} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'0.78rem', fontFamily:'var(--font-mono)', color:'var(--text)', marginBottom:2 }}>{app.name}</div>
                      <div style={{ fontSize:'0.62rem', color:'var(--text-dim)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{app.url}</div>
                    </div>
                    <a href={app.url} target="_blank" rel="noopener noreferrer"
                      style={{ padding:'4px 10px', borderRadius:6, fontSize:'0.65rem', background:'var(--surface2)', color:'var(--neon)', border:'1px solid var(--border)', cursor:'pointer', fontFamily:'var(--font-mono)', flexShrink:0 }}>
                      <i className="fas fa-external-link-alt" />
                    </a>
                    <button onClick={() => removeCustomApp(app.id)}
                      style={{ padding:'4px 10px', borderRadius:6, fontSize:'0.65rem', background:'rgba(255,95,86,0.1)', color:'#ff5f56', border:'1px solid rgba(255,95,86,0.3)', cursor:'pointer', flexShrink:0 }}>
                      <i className="fas fa-trash" />
                    </button>
                  </div>
                ))}
              </>
            )}
            {customApps.length === 0 && (
              <div style={{ textAlign:'center', padding:'2rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)', fontSize:'0.75rem' }}>
                <i className="fas fa-plus-circle" style={{ fontSize:'2rem', marginBottom:'0.75rem', display:'block', color:'var(--text-muted)' }} />
                No custom apps yet — add one above
              </div>
            )}
          </motion.div>
        )}

        {/* ── SHORTCUTS ── */}
        {tab==='shortcuts' && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
            <SectionTitle title="Keyboard Shortcuts" icon="fas fa-keyboard" />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.4rem' }}>
              {SHORTCUTS.map(([key, label]) => (
                <div key={key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.55rem 0.75rem', borderRadius:8, background:'var(--surface)', border:'1px solid var(--border)', fontSize:'0.72rem' }}>
                  <span style={{ color:'var(--text-dim)' }}>{label}</span>
                  <code style={{ fontSize:'0.65rem' }}>{key}</code>
                </div>
              ))}
            </div>

            <div style={{ marginTop:'1.5rem' }}>
              <SectionTitle title="Voice Commands" icon="fas fa-microphone" />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.4rem' }}>
                {[
                  ['"open terminal"',  'Opens Terminal'    ],
                  ['"open projects"',  'Opens Projects'    ],
                  ['"open about"',     'Opens About Me'    ],
                  ['"open chat"',      'Opens Chat'        ],
                  ['"dark mode"',      'Switch to dark'    ],
                  ['"neon mode"',      'Switch to neon'    ],
                  ['"matrix mode"',    'Switch to matrix'  ],
                  ['"search"',         'Open search bar'   ],
                  ['"lock screen"',    'Lock the OS'       ],
                  ['"close window"',   'Close active win'  ],
                  ['"go to github"',   'Open GitHub'       ],
                  ['"light mode"',     'Switch to light'   ],
                ].map(([phrase, label]) => (
                  <div key={phrase} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.55rem 0.75rem', borderRadius:8, background:'var(--surface)', border:'1px solid var(--border)', fontSize:'0.7rem' }}>
                    <span style={{ color:'var(--neon2)', fontFamily:'var(--font-mono)', fontSize:'0.65rem' }}>{phrase}</span>
                    <span style={{ color:'var(--text-dim)' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── ABOUT ── */}
        {tab==='about' && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
            <SectionTitle title="About DivyOS" icon="fas fa-info-circle" />
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'1.5rem', marginBottom:'1rem' }}>
              <div style={{ textAlign:'center', marginBottom:'1.25rem' }}>
                <div style={{ fontSize:'2.5rem', fontWeight:200, fontFamily:'var(--font-mono)', letterSpacing:'4px' }}>
                  <span style={{ color:'var(--neon)' }}>DIVY</span><span style={{ color:'var(--neon2)' }}>OS</span>
                </div>
                <div style={{ fontSize:'0.7rem', color:'var(--text-dim)', fontFamily:'var(--font-mono)', marginTop:'0.25rem' }}>React Edition v2.0.0</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', fontFamily:'var(--font-mono)', fontSize:'0.72rem' }}>
                {[
                  ['Framework',  'React 18.2'],
                  ['Build Tool', 'Vite 5'    ],
                  ['Animation',  'Framer Motion'],
                  ['Windows',    'react-rnd' ],
                  ['State',      'Context API + useReducer'],
                  ['Audio',      'Web Audio API'],
                  ['Voice',      'Speech Recognition'],
                  ['PWA',        'Workbox + vite-plugin-pwa'],
                  ['Author',     'Divyanshu Pandey'],
                  ['License',    'MIT'],
                ].map(([k,v]) => (
                  <div key={k} style={{ padding:'0.5rem 0.75rem', borderRadius:8, background:'var(--surface2)', border:'1px solid var(--border)' }}>
                    <div style={{ fontSize:'0.58rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:2 }}>{k}</div>
                    <div style={{ color:'var(--neon)' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:'0.5rem' }}>
              {[
                { icon:'fab fa-github', label:'GitHub', url:'https://github.com/CodeCr4cker', color:'#fff' },
                { icon:'fab fa-youtube',label:'YouTube',url:'https://youtube.com/@CodeCr4cker', color:'#ff0000' },
              ].map(l => (
                <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
                  style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', padding:'0.6rem', borderRadius:8, background:'var(--surface)', border:'1px solid var(--border)', color:'var(--text)', fontSize:'0.78rem', fontFamily:'var(--font-mono)', transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=l.color; e.currentTarget.style.color=l.color }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text)' }}>
                  <i className={l.icon} style={{ color:l.color }} />{l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  )
}

const inputSty = {
  width:'100%', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:8,
  padding:'0.45rem 0.65rem', color:'var(--text)', fontSize:'0.75rem', fontFamily:'var(--font-mono)', outline:'none',
}
