import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOS } from '../../context/OSContext.jsx'
import { FIREBASE_CONFIG, ADMIN_UID } from '../../config.js'

/* ─── helpers ──────────────────────────────────────────────── */
function fmt(ts, mode = 'time') {
  if (!ts) return ''
  const d = ts?.toDate ? ts.toDate() : ts instanceof Date ? ts : new Date(ts)
  if (mode === 'time') return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  if (mode === 'date') return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return ''
}

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth <= 768)
  useEffect(() => {
    const h = () => setMobile(window.innerWidth <= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return mobile
}

const FB_CONFIGURED = FIREBASE_CONFIG?.apiKey && FIREBASE_CONFIG.apiKey !== 'YOUR_API_KEY'

/* ─── Firebase singleton ───────────────────────────────────── */
let _fb = null
async function getFirebase() {
  if (_fb) return _fb
  const { initializeApp, getApps, getApp } = await import('firebase/app')
  const app = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG)
  const { getAuth }      = await import('firebase/auth')
  const { getFirestore } = await import('firebase/firestore')
  const { getStorage }   = await import('firebase/storage')
  _fb = { auth: getAuth(app), db: getFirestore(app), storage: getStorage(app) }
  return _fb
}

const DEMO_MSGS = [
  { id:1, text:'Hey! Welcome to DivyOS Chat 👋',        senderType:'admin', timestamp:new Date(Date.now()-3600000), read:true },
  { id:2, text:'This is a real-time Firebase chat.',     senderType:'admin', timestamp:new Date(Date.now()-1800000), read:true },
  { id:3, text:'Type a message below to try the demo!', senderType:'admin', timestamp:new Date(Date.now()-60000),   read:true },
]
const SMART = ['Hi Divyanshu!','Tell me about your work','I have a project idea','Can we collaborate?']

/* ══════════════════════════════════════════════════════════════
   AUTH SCREEN
══════════════════════════════════════════════════════════════ */
function AuthScreen({ onSignedIn, onDemo }) {
  const [mode,    setMode]    = useState('login')
  const [email,   setEmail]   = useState('')
  const [pass,    setPass]    = useState('')
  const [name,    setName]    = useState('')
  const [loading, setLoading] = useState(false)
  const [err,     setErr]     = useState('')
  const isMobile = useIsMobile()

  const handle = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true)
    if (!FB_CONFIGURED) {
      setErr('Firebase not configured. Open src/config.js and fill in FIREBASE_CONFIG.')
      setLoading(false); return
    }
    try {
      const { auth } = await getFirebase()
      if (mode === 'login') {
        const { signInWithEmailAndPassword } = await import('firebase/auth')
        const cred = await signInWithEmailAndPassword(auth, email, pass)
        onSignedIn(cred.user)
      } else {
        const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth')
        const cred = await createUserWithEmailAndPassword(auth, email, pass)
        if (name) await updateProfile(cred.user, { displayName: name })
        onSignedIn(cred.user)
      }
    } catch (ex) {
      const m = ex.message || ''
      if (m.includes('invalid-credential') || m.includes('wrong-password') || m.includes('user-not-found'))
        setErr('Wrong email or password.')
      else if (m.includes('email-already-in-use')) setErr('Email already registered.')
      else if (m.includes('weak-password'))        setErr('Password must be 6+ characters.')
      else if (m.includes('invalid-email'))        setErr('Invalid email address.')
      else setErr(ex.message)
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    setErr(''); setLoading(true)
    if (!FB_CONFIGURED) { setErr('Firebase not configured. Edit src/config.js first.'); setLoading(false); return }
    try {
      const { auth } = await getFirebase()
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
      const cred = await signInWithPopup(auth, new GoogleAuthProvider())
      onSignedIn(cred.user)
    } catch (ex) {
      setErr(ex.code === 'auth/popup-closed-by-user' ? 'Popup closed.' : ex.message)
    }
    setLoading(false)
  }

  return (
    <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--win-bg)', fontFamily:'var(--font-mono)', padding: isMobile ? '1rem' : '0', overflowY:'auto' }}>
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
        style={{ width: isMobile ? '100%' : 340, maxWidth: 400, padding: isMobile ? '1.5rem 1.25rem' : '2rem', background:'var(--surface)', borderRadius:16, border:'1px solid rgba(0,212,255,0.2)', boxShadow:'0 16px 48px rgba(0,0,0,0.5)' }}>

        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <i className="fas fa-comments" style={{ fontSize:'2rem', color:'var(--neon)', marginBottom:'0.5rem', display:'block' }}/>
          <div style={{ fontWeight:700, color:'var(--text)', fontSize:'1rem' }}>DivyOS Chat</div>
          <div style={{ fontSize:'0.65rem', color:'var(--text-dim)', marginTop:2 }}>Real-time Firebase messaging</div>
        </div>

        <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.25rem' }}>
          {['login','register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setErr('') }}
              style={{ flex:1, padding: isMobile ? '0.6rem' : '0.4rem', borderRadius:6, fontSize: isMobile ? '0.85rem' : '0.7rem', background:mode===m?'var(--neon)':'var(--surface2)', color:mode===m?'#000':'var(--text-dim)', border:'1px solid var(--border)', cursor:'pointer', fontFamily:'var(--font-mono)', fontWeight:mode===m?700:400 }}>
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handle} style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
          {mode === 'register' && <FInput placeholder="Display name (optional)" value={name} onChange={e => setName(e.target.value)} isMobile={isMobile}/>}
          <FInput type="email"    placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required isMobile={isMobile}/>
          <FInput type="password" placeholder="Password"      value={pass}  onChange={e => setPass(e.target.value)}  required isMobile={isMobile}/>
          {err && <ErrBox>{err}</ErrBox>}
          <FBtn type="submit" disabled={loading} isMobile={isMobile}>
            {loading ? <><i className="fas fa-circle-notch fa-spin" style={{ marginRight:'0.4rem' }}/> Loading…</> : mode === 'login' ? 'Sign In' : 'Create Account'}
          </FBtn>
        </form>

        {FB_CONFIGURED && (
          <>
            <Divider/>
            <FBtn outline onClick={handleGoogle} disabled={loading} isMobile={isMobile}>
              <i className="fab fa-google" style={{ marginRight:'0.4rem', color:'#4285f4' }}/> Continue with Google
            </FBtn>
          </>
        )}

        <Divider/>
        <FBtn ghost onClick={onDemo} isMobile={isMobile}>
          <i className="fas fa-eye" style={{ marginRight:'0.4rem', color:'var(--neon2)' }}/> Preview Demo Mode
        </FBtn>

        {!FB_CONFIGURED && (
          <div style={{ marginTop:'1rem', padding:'0.75rem', borderRadius:8, background:'rgba(0,212,255,0.04)', border:'1px solid rgba(0,212,255,0.15)', fontSize:'0.6rem', color:'var(--text-dim)', lineHeight:1.9 }}>
            <div style={{ color:'var(--neon)', fontWeight:700, marginBottom:'0.4rem' }}><i className="fas fa-wrench" style={{ marginRight:'0.3rem' }}/>Setup required</div>
            <div>1. <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" style={{ color:'var(--neon)' }}>Firebase Console</a> → create project</div>
            <div>2. Enable <b>Authentication</b> (Email + Google) + <b>Firestore</b></div>
            <div>3. Copy config → <code style={{ color:'var(--neon)' }}>src/config.js</code></div>
            <div>4. Sign in once → copy your UID → set <code style={{ color:'var(--neon)' }}>ADMIN_UID</code></div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   ADMIN PANEL — left sidebar showing all user conversations
══════════════════════════════════════════════════════════════ */
function AdminUserList({ selectedUid, onSelect, isMobile, onBack }) {
  const [users, setUsers] = useState([])

  useEffect(() => {
    let active = true
    getFirebase().then(async ({ db }) => {
      const { collection, onSnapshot, query, orderBy } = await import('firebase/firestore')
      const q = query(collection(db, 'chats'), orderBy('lastMessageTime', 'desc'))
      onSnapshot(q, snap => {
        if (!active) return
        setUsers(snap.docs
          .filter(d => d.id !== 'admin-inbox')
          .map(d => ({ uid: d.id, ...d.data() }))
        )
      })
    }).catch(() => {})
    return () => { active = false }
  }, [])

  return (
    <div style={{
      width: isMobile ? '100%' : 220,
      borderRight: isMobile ? 'none' : '1px solid var(--border)',
      display:'flex', flexDirection:'column', flexShrink:0,
      background:'rgba(5,8,16,0.4)',
      height: '100%',
    }}>
      {/* Panel header */}
      <div style={{ padding:'0.75rem 1rem', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'0.5rem', flexShrink:0 }}>
        <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#ff5f56,#ffbd2e)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', flexShrink:0 }}>
          <i className="fas fa-shield-alt" style={{ color:'#fff' }}/>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.72rem', fontWeight:700, color:'var(--neon)' }}>Admin Panel</div>
          <div style={{ fontSize:'0.58rem', color:'var(--text-dim)' }}>{users.length} conversation{users.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {/* User list */}
      <div style={{ flex:1, overflowY:'auto' }}>
        {users.length === 0 && (
          <div style={{ padding:'1.5rem 1rem', textAlign:'center', color:'var(--text-muted)', fontFamily:'var(--font-mono)', fontSize:'0.7rem' }}>
            <i className="fas fa-inbox" style={{ fontSize:'1.5rem', display:'block', marginBottom:'0.5rem', color:'var(--text-muted)' }}/>
            No users yet
          </div>
        )}
        {users.map(u => {
          const isSelected = u.uid === selectedUid
          const unread = u.adminUnread || 0
          return (
            <div key={u.uid} onClick={() => onSelect(u.uid)}
              style={{ padding: isMobile ? '0.9rem 1rem' : '0.75rem 1rem', cursor:'pointer', borderBottom:'1px solid rgba(255,255,255,0.04)', background:isSelected?'rgba(0,212,255,0.1)':'transparent', display:'flex', alignItems:'center', gap:'0.6rem', transition:'background 0.15s' }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background='rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background='transparent' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,var(--neon2),var(--neon))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem', flexShrink:0, color:'#fff', fontWeight:700 }}>
                {(u.userEmail || u.uid)[0].toUpperCase()}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize: isMobile ? '0.82rem' : '0.72rem', fontFamily:'var(--font-mono)', color:'var(--text)', fontWeight:isSelected?700:400, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {u.userEmail || u.userName || u.uid.slice(0,12)+'…'}
                </div>
                <div style={{ fontSize: isMobile ? '0.7rem' : '0.6rem', color:'var(--text-dim)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:2 }}>
                  {u.lastMessage || 'No messages'}
                </div>
              </div>
              {unread > 0 && (
                <div style={{ width:20, height:20, borderRadius:'50%', background:'var(--neon)', color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.58rem', fontWeight:700, flexShrink:0 }}>
                  {unread > 9 ? '9+' : unread}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   MESSAGE AREA
══════════════════════════════════════════════════════════════ */
function MessageArea({ chatId, currentUser, isAdmin, isDemo, onSignOut, chatPartnerLabel, isMobile, onBack }) {
  const [msgs,    setMsgs]    = useState(isDemo ? DEMO_MSGS : [])
  const [input,   setInput]   = useState('')
  const [typing,  setTyping]  = useState(false)
  const [sending, setSending] = useState(false)
  const [myTyping,setMyTyping]= useState(false)
  const endRef    = useRef(null)
  const fileRef   = useRef(null)
  const inputRef  = useRef(null)
  const unsubMsg  = useRef(null)
  const unsubMeta = useRef(null)
  const typingTimer = useRef(null)

  /* ── Subscribe to messages ── */
  useEffect(() => {
    if (isDemo || !chatId) return
    let active = true
    unsubMsg.current?.()

    getFirebase().then(async ({ db }) => {
      const { collection, query, orderBy, onSnapshot, updateDoc, doc: docRef } = await import('firebase/firestore')
      const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('timestamp', 'asc'))
      unsubMsg.current = onSnapshot(q, snap => {
        if (!active) return
        setMsgs(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        snap.docs.forEach(async docSnap => {
          const d = docSnap.data()
          const fromOther = isAdmin ? d.senderType === 'user' : d.senderType === 'admin'
          if (fromOther && !d.read) {
            updateDoc(docRef(db, 'chats', chatId, 'messages', docSnap.id), { read: true }).catch(() => {})
          }
        })
        const myUnread = isAdmin ? 'adminUnread' : 'userUnread'
        updateDoc(docRef(db, 'chats', chatId), { [myUnread]: 0 }).catch(() => {})
      })
    }).catch(() => {})

    return () => { active = false; unsubMsg.current?.() }
  }, [chatId, isDemo, isAdmin])

  /* ── Subscribe to typing indicator ── */
  useEffect(() => {
    if (isDemo || !chatId) return
    let active = true
    unsubMeta.current?.()

    getFirebase().then(async ({ db }) => {
      const { doc, onSnapshot } = await import('firebase/firestore')
      unsubMeta.current = onSnapshot(doc(db, 'chats', chatId), snap => {
        if (!active) return
        const d = snap.data()
        if (!d) return
        setTyping(isAdmin ? !!d.userTyping : !!d.adminTyping)
      })
    }).catch(() => {})

    return () => { active = false; unsubMeta.current?.() }
  }, [chatId, isDemo, isAdmin])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs, typing])

  /* ── Send typing indicator ── */
  const sendTyping = useCallback(async (val) => {
    if (isDemo || !chatId) return
    try {
      const { db } = await getFirebase()
      const { doc, updateDoc } = await import('firebase/firestore')
      const field = isAdmin ? 'adminTyping' : 'userTyping'
      await updateDoc(doc(db, 'chats', chatId), { [field]: val }).catch(() => {})
    } catch {}
  }, [chatId, isDemo, isAdmin])

  const handleInputChange = (e) => {
    setInput(e.target.value)
    if (!myTyping) { setMyTyping(true); sendTyping(true) }
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => { setMyTyping(false); sendTyping(false) }, 2000)
  }

  /* ── Send message ── */
  const send = useCallback(async () => {
    const txt = input.trim(); if (!txt || sending) return
    setInput(''); setSending(true)
    sendTyping(false); setMyTyping(false)

    if (isDemo) {
      setMsgs(m => [...m, { id:Date.now(), text:txt, senderType:'user', timestamp:new Date(), read:false }])
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        setMsgs(m => [...m, { id:Date.now()+1, text:`Thanks! 👋 Demo mode — set up Firebase in src/config.js for live chat.`, senderType:'admin', timestamp:new Date(), read:true }])
      }, 1200)
      setSending(false); return
    }

    try {
      const { db } = await getFirebase()
      const { collection, addDoc, serverTimestamp, doc, setDoc, increment } = await import('firebase/firestore')
      const senderType  = isAdmin ? 'admin' : 'user'
      const otherUnread = isAdmin ? 'userUnread' : 'adminUnread'

      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text:       txt,
        senderId:   currentUser.uid,
        senderName: currentUser.displayName || currentUser.email || senderType,
        senderType,
        timestamp:  serverTimestamp(),
        read:       false,
      })

      await setDoc(doc(db, 'chats', chatId), {
        lastMessage:     txt,
        lastMessageTime: serverTimestamp(),
        [otherUnread]:   increment(1),
        userEmail:  isAdmin ? undefined : currentUser.email,
        userName:   isAdmin ? undefined : (currentUser.displayName || currentUser.email),
        userTyping: false,
        adminTyping:false,
      }, { merge: true })
    } catch (ex) { console.error('Send failed:', ex) }
    setSending(false)
  }, [input, sending, isDemo, isAdmin, chatId, currentUser, sendTyping])

  const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  /* ── File upload ── */
  const handleFile = async (e) => {
    const file = e.target.files?.[0]; if (!file || isDemo) return
    try {
      const { storage, db } = await getFirebase()
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
      const storageRef = ref(storage, `chat/${chatId}/${Date.now()}_${file.name}`)
      const snap = await uploadBytes(storageRef, file)
      const url  = await getDownloadURL(snap.ref)
      const isImg = file.type.startsWith('image/')
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: isImg ? '' : file.name, fileUrl: url, fileType: file.type, fileName: file.name,
        type: isImg ? 'image' : 'file', senderId: currentUser.uid,
        senderType: isAdmin ? 'admin' : 'user', timestamp: serverTimestamp(), read: false,
      })
    } catch (ex) { console.error('Upload failed:', ex) }
    e.target.value = ''
  }

  let lastDate = ''

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, height:'100%', overflow:'hidden' }}>
      {/* Header */}
      <div style={{ padding: isMobile ? '0.6rem 0.75rem' : '0.65rem 1rem', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'0.6rem', background:'rgba(5,8,16,0.5)', flexShrink:0 }}>
        {/* Back button on mobile for admin */}
        {isMobile && onBack && (
          <button onClick={onBack}
            style={{ background:'none', border:'none', cursor:'pointer', color:'var(--neon)', fontSize:'1.1rem', padding:'4px 8px 4px 0', flexShrink:0, display:'flex', alignItems:'center' }}>
            <i className="fas fa-arrow-left"/>
          </button>
        )}
        <div style={{ width:34, height:34, borderRadius:'50%', background: isAdmin ? 'linear-gradient(135deg,#ff5f56,#ffbd2e)' : 'linear-gradient(135deg,var(--neon2),var(--neon))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem', flexShrink:0 }}>
          <i className={isAdmin ? 'fas fa-user' : 'fas fa-headset'}/>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:'var(--font-mono)', fontSize: isMobile ? '0.85rem' : '0.8rem', fontWeight:600, color:'var(--text)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {chatPartnerLabel}
          </div>
          <div style={{ fontSize:'0.6rem', display:'flex', alignItems:'center', gap:'0.3rem', color: typing ? 'var(--neon)' : 'var(--green)' }}>
            <i className="fas fa-circle" style={{ fontSize:'0.4rem' }}/>
            {typing ? 'typing…' : 'Online'}
          </div>
        </div>
        <div style={{ display:'flex', gap:'0.4rem', alignItems:'center', flexShrink:0 }}>
          {isDemo && <span style={{ fontSize:'0.55rem', color:'var(--neon2)', border:'1px solid rgba(123,47,247,0.3)', padding:'2px 6px', borderRadius:4, fontFamily:'var(--font-mono)' }}>DEMO</span>}
          {isAdmin && <span style={{ fontSize:'0.55rem', color:'#ffbd2e', border:'1px solid rgba(255,189,46,0.3)', padding:'2px 6px', borderRadius:4, fontFamily:'var(--font-mono)' }}>
            <i className="fas fa-shield-alt" style={{ marginRight:'0.3rem' }}/>ADMIN
          </span>}
          {!isDemo && !isMobile && currentUser && <span style={{ fontSize:'0.58rem', color:'var(--text-dim)', fontFamily:'var(--font-mono)', maxWidth:110, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{currentUser.email}</span>}
          {onSignOut && (
            <button onClick={onSignOut} title="Sign out"
              style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-dim)', fontSize: isMobile ? '1rem' : '0.8rem', padding:'4px' }}>
              <i className="fas fa-sign-out-alt"/>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding: isMobile ? '0.75rem' : '1rem', display:'flex', flexDirection:'column', gap:'0.15rem',
        /* Fix for mobile keyboard pushing content */
        WebkitOverflowScrolling: 'touch',
      }}>
        {msgs.length === 0 && !isDemo && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.5rem', color:'var(--text-dim)', fontFamily:'var(--font-mono)', fontSize:'0.75rem', marginTop:'3rem' }}>
            <i className="fas fa-comment-dots" style={{ fontSize:'2.5rem', color:'var(--text-muted)' }}/>
            <span>No messages yet — say hello!</span>
          </div>
        )}

        {msgs.map(msg => {
          const isSent = isAdmin ? msg.senderType === 'admin' : msg.senderType === 'user'
          const d = fmt(msg.timestamp, 'date')
          const showDate = d !== lastDate; lastDate = d
          return (
            <React.Fragment key={msg.id}>
              {showDate && <div style={{ textAlign:'center', fontSize:'0.6rem', color:'var(--text-dim)', fontFamily:'var(--font-mono)', margin:'0.5rem 0' }}>{d}</div>}
              <motion.div initial={{ opacity:0, y:6, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }}
                style={{ display:'flex', flexDirection:'column', alignItems:isSent?'flex-end':'flex-start', marginBottom:'0.2rem' }}>
                {msg.fileUrl && msg.type==='image' && (
                  <img src={msg.fileUrl} alt="img" style={{ maxWidth: isMobile ? '80vw' : 220, borderRadius:12, marginBottom:4, border:'1px solid var(--border)', cursor:'pointer' }} onClick={() => window.open(msg.fileUrl,'_blank')}/>
                )}
                {msg.fileUrl && msg.type==='file' && (
                  <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display:'flex', alignItems:'center', gap:'0.4rem', padding:'0.5rem 0.8rem', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, fontSize:'0.72rem', color:'var(--neon)', fontFamily:'var(--font-mono)', marginBottom:4 }}>
                    <i className="fas fa-paperclip"/>{msg.fileName}
                  </a>
                )}
                {(msg.text || !msg.fileUrl) && (
                  <div style={{ maxWidth: isMobile ? '82%' : '76%', padding:'0.55rem 0.85rem', borderRadius:isSent?'16px 16px 4px 16px':'16px 16px 16px 4px', background:isSent?'linear-gradient(135deg,var(--neon2),rgba(0,212,255,0.85))':'var(--surface)', border:isSent?'none':'1px solid var(--border)', fontSize: isMobile ? '0.9rem' : '0.79rem', color:isSent?'#fff':'var(--text)', lineHeight:1.55, wordBreak:'break-word' }}>
                    {msg.text}
                  </div>
                )}
                <div style={{ fontSize:'0.57rem', color:'var(--text-dim)', marginTop:2, fontFamily:'var(--font-mono)', display:'flex', gap:'0.3rem', alignItems:'center' }}>
                  {fmt(msg.timestamp,'time')}
                  {isSent && <i className={msg.read?'fas fa-check-double':'fas fa-check'} style={{ color:msg.read?'var(--neon)':'var(--text-dim)' }}/>}
                </div>
              </motion.div>
            </React.Fragment>
          )
        })}

        <AnimatePresence>
          {typing && (
            <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              style={{ display:'flex', gap:5, padding:'0.5rem 0.75rem', background:'var(--surface)', borderRadius:'12px 12px 12px 4px', width:'fit-content', border:'1px solid var(--border)' }}>
              {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'var(--neon)', animation:'dotBounce 1.2s ease-in-out infinite', animationDelay:`${i*0.18}s` }}/>)}
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef}/>
      </div>

      {/* Smart replies */}
      {msgs.length <= 4 && (
        <div style={{ padding: isMobile ? '0 0.75rem 0.5rem' : '0 1rem 0.5rem', display:'flex', gap:'0.4rem', flexWrap:'wrap', flexShrink:0, overflowX: isMobile ? 'auto' : 'visible' }}>
          {SMART.map(r => (
            <button key={r} onClick={() => { setInput(r); inputRef.current?.focus() }}
              style={{ padding: isMobile ? '5px 12px' : '3px 10px', borderRadius:20, fontSize: isMobile ? '0.72rem' : '0.62rem', background:'var(--surface)', color:'var(--neon)', border:'1px solid rgba(0,212,255,0.25)', cursor:'pointer', fontFamily:'var(--font-mono)', transition:'background 0.15s', whiteSpace:'nowrap' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(0,212,255,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background='var(--surface)'}>
              {r}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{
        paddingTop: isMobile ? '0.5rem' : '0.65rem',
        paddingBottom: isMobile ? 'calc(0.5rem + env(safe-area-inset-bottom))' : '0.65rem',
        paddingLeft: isMobile ? '0.75rem' : '1rem',
        paddingRight: isMobile ? '0.75rem' : '1rem',
        borderTop:'1px solid var(--border)',
        background:'rgba(5,8,16,0.5)',
        flexShrink:0,
        display:'flex',
        gap:'0.5rem',
        alignItems:'center',
        position: 'sticky',
        bottom: 0,
        boxSizing: 'border-box',
        width: '100%',
      }}>
        <button onClick={() => fileRef.current?.click()} title="Attach file"
          style={{ width: isMobile ? 40 : 34, height: isMobile ? 40 : 40, borderRadius:8, background:'var(--surface)', border:'1px solid var(--border)', cursor:'pointer', color:'var(--text-dim)', fontSize: isMobile ? '1rem' : '0.8rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color='var(--neon)'}
          onMouseLeave={e => e.currentTarget.style.color='var(--text-dim)'}>
          <i className="fas fa-paperclip"/>
        </button>
        <input ref={fileRef} type="file" style={{ display:'none' }} onChange={handleFile}/>
        <input ref={inputRef} value={input} onChange={handleInputChange} onKeyDown={handleKey}
          placeholder={isDemo ? 'Type a message (demo)…' : 'Message…'}
          style={{ flex:1, minWidth:0, background:'var(--surface)', border:'1px solid var(--border)', borderRadius: isMobile ? 20 : 8, padding: isMobile ? '0.6rem 1rem' : '0.48rem 0.75rem', color:'var(--text)', fontSize: isMobile ? '16px' : '0.79rem', fontFamily:'var(--font-sans)', outline:'none', boxSizing:'border-box' }}
          onFocus={e => e.target.style.borderColor='rgba(0,212,255,0.4)'}
          onBlur={e => e.target.style.borderColor='var(--border)'}/>
        <button onClick={send} disabled={!input.trim() || sending}
          style={{ width: isMobile ? 42 : 36, height: isMobile ? 42 : 36, borderRadius:'50%', background:input.trim()&&!sending?'linear-gradient(135deg,var(--neon2),var(--neon))':'var(--surface2)', border:'none', cursor:input.trim()&&!sending?'pointer':'default', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize: isMobile ? '1rem' : '0.85rem', transition:'all 0.2s', flexShrink:0 }}>
          <i className={sending?'fas fa-circle-notch fa-spin':'fas fa-paper-plane'}/>
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════ */
export default function Chat() {
  const { showNotification } = useOS()
  const [user,            setUser]          = useState(null)
  const [isDemo,          setIsDemo]        = useState(false)
  const [selectedUserUid, setSelectedUid]   = useState(null)
  const [mobileView,      setMobileView]    = useState('list') // 'list' | 'chat'
  const isMobile = useIsMobile()

  const isAdmin = !isDemo && !!user && user.uid === ADMIN_UID

  // Restore Firebase session
  useEffect(() => {
    if (!FB_CONFIGURED) return
    getFirebase().then(async ({ auth }) => {
      const { onAuthStateChanged } = await import('firebase/auth')
      return onAuthStateChanged(auth, u => setUser(u || null))
    }).catch(() => {})
  }, [])

  const handleSignOut = async () => {
    try { const { auth } = await getFirebase(); const { signOut } = await import('firebase/auth'); await signOut(auth) } catch {}
    setUser(null); setIsDemo(false); setSelectedUid(null); setMobileView('list')
  }

  const handleSelectUser = (uid) => {
    setSelectedUid(uid)
    if (isMobile) setMobileView('chat')
  }

  // Not signed in
  if (!user && !isDemo) {
    return (
      <AuthScreen
        onSignedIn={u => {
          setUser(u)
          showNotification('Chat', `Signed in as ${u.email}`, 'success')
          if (u.uid === ADMIN_UID) showNotification('Chat', 'Admin access granted 🛡️', 'success')
        }}
        onDemo={() => { setIsDemo(true); showNotification('Chat', 'Running in demo mode', 'warning') }}
      />
    )
  }

  // ── ADMIN VIEW ──────────────────────────────────────────────
  if (isAdmin) {
    // Mobile admin: show list OR chat, not both
    if (isMobile) {
      return (
        <div style={{ height:'100%', display:'flex', background:'var(--win-bg)', overflow:'hidden' }}>
          {mobileView === 'list' ? (
            <AdminUserList
              selectedUid={selectedUserUid}
              onSelect={handleSelectUser}
              isMobile={true}
            />
          ) : (
            <MessageArea
              chatId={selectedUserUid}
              currentUser={user}
              isAdmin={true}
              isDemo={false}
              onSignOut={handleSignOut}
              chatPartnerLabel={selectedUserUid ? selectedUserUid.slice(0,16)+'…' : ''}
              isMobile={true}
              onBack={() => setMobileView('list')}
            />
          )}
        </div>
      )
    }

    // Desktop admin: two-panel
    return (
      <div style={{ height:'100%', display:'flex', background:'var(--win-bg)', overflow:'hidden' }}>
        <AdminUserList selectedUid={selectedUserUid} onSelect={handleSelectUser} isMobile={false}/>
        {selectedUserUid ? (
          <MessageArea
            chatId={selectedUserUid}
            currentUser={user}
            isAdmin={true}
            isDemo={false}
            onSignOut={handleSignOut}
            chatPartnerLabel={selectedUserUid.slice(0,16)+'…'}
            isMobile={false}
          />
        ) : (
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.75rem', color:'var(--text-dim)', fontFamily:'var(--font-mono)', fontSize:'0.8rem' }}>
            <i className="fas fa-comments" style={{ fontSize:'3rem', color:'var(--text-muted)' }}/>
            <span>Select a conversation</span>
            <span style={{ fontSize:'0.65rem', color:'var(--text-muted)' }}>from the panel on the left</span>
          </div>
        )}
      </div>
    )
  }

  // ── NORMAL USER VIEW ────────────────────────────────────────
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <MessageArea
        chatId={isDemo ? null : user.uid}
        currentUser={user}
        isAdmin={false}
        isDemo={isDemo}
        onSignOut={user ? handleSignOut : () => setIsDemo(false)}
        chatPartnerLabel="Admin — Divyanshu"
        isMobile={isMobile}
      />
    </div>
  )
}

/* ─── Micro components ────────────────────────────────────── */
const FInput = ({ type='text', placeholder, value, onChange, required, isMobile }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
    style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:8, padding: isMobile ? '0.65rem 0.85rem' : '0.5rem 0.75rem', color:'var(--text)', fontSize: isMobile ? '16px' : '0.78rem', fontFamily:'var(--font-mono)', outline:'none', width:'100%', boxSizing:'border-box' }}
    onFocus={e => e.target.style.borderColor='rgba(0,212,255,0.35)'}
    onBlur={e => e.target.style.borderColor='var(--border)'}/>
)
const FBtn = ({ children, type='button', onClick, disabled, ghost, outline, isMobile }) => (
  <button type={type} onClick={onClick} disabled={disabled}
    style={{ width:'100%', padding: isMobile ? '0.75rem' : '0.6rem', borderRadius:8, fontSize: isMobile ? '0.9rem' : '0.75rem', fontWeight:700, cursor:disabled?'default':'pointer', opacity:disabled?0.6:1, marginBottom:'0.25rem',
      background: ghost?'var(--surface2)':outline?'transparent':'linear-gradient(135deg,var(--neon2),var(--neon))',
      color: ghost?'var(--text-dim)':outline?'var(--text)':'#fff',
      border: ghost||outline?'1px solid var(--border)':'none',
      fontFamily:'var(--font-mono)', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.3rem', transition:'opacity 0.2s' }}>
    {children}
  </button>
)
const ErrBox = ({ children }) => (
  <div style={{ fontSize:'0.62rem', color:'#ff5f56', padding:'0.6rem 0.75rem', background:'rgba(255,95,86,0.08)', borderRadius:8, border:'1px solid rgba(255,95,86,0.25)', lineHeight:1.6 }}>
    <i className="fas fa-exclamation-circle" style={{ marginRight:'0.4rem' }}/>{children}
  </div>
)
const Divider = () => <div style={{ textAlign:'center', margin:'0.75rem 0', fontSize:'0.62rem', color:'var(--text-dim)' }}>— or —</div>