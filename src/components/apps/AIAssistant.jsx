import { ANTHROPIC_API_KEY } from '../../config.js'
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SMART_REPLIES = [
  "Tell me about Divyanshu's projects",
  "What skills does he have?",
  "How can I contact him?",
  "Show me his resume",
]

const SYSTEM_CONTEXT = `You are DivyAI, a helpful assistant on Divyanshu Pandey's OS-style portfolio. 
Divyanshu is a web developer and Computer Science student from Kanpur, India.
His skills: React, Python, JavaScript, Firebase, CSS, OpenCV, Node.js.
His projects: DivyOS Portfolio (React), Library Management System (Python+SQL), Hand Tracking Demo (OpenCV), Chat App (Firebase).
His social: GitHub: github.com/CodeCr4cker, YouTube: youtube.com/@CodeCr4cker.
Be concise, helpful, and friendly. Answer questions about Divyanshu and general programming topics.`

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '0.75rem',
      }}
    >
      {!isUser && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
          <div style={{
            width: '22px', height: '22px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--neon2), var(--neon))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem',
          }}>
            <i className="fas fa-robot" />
          </div>
          <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--neon)' }}>DivyAI</span>
        </div>
      )}
      <div style={{
        maxWidth: '80%', padding: '0.65rem 0.9rem',
        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        background: isUser
          ? 'linear-gradient(135deg, var(--neon2), rgba(0,212,255,0.8))'
          : 'var(--surface)',
        border: isUser ? 'none' : '1px solid var(--border)',
        fontSize: '0.8rem', color: isUser ? '#fff' : 'var(--text)',
        lineHeight: 1.6, wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
      }}>
        {msg.content}
      </div>
    </motion.div>
  )
}

function Spinner() {
  return (
    <div style={{ display: 'flex', gap: '5px', padding: '0.65rem 0.9rem', background: 'var(--surface)', borderRadius: '16px 16px 16px 4px', width: 'fit-content' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: '7px', height: '7px', borderRadius: '50%', background: 'var(--neon)',
          animation: 'dotBounce 1.2s ease-in-out infinite',
          animationDelay: `${i * 0.18}s`,
        }} />
      ))}
    </div>
  )
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm DivyAI 🤖 — your guide to Divyanshu's portfolio. Ask me anything about his work, skills, or how to get in touch!" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState(localStorage.getItem('divyos-ai-key') || ANTHROPIC_API_KEY || '')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const sendMessage = async (text) => {
    const txt = (text || input).trim()
    if (!txt || loading) return
    setInput('')

    const userMsg = { role: 'user', content: txt }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      if (!apiKey) {
        // Demo mode — no API key
        await new Promise(r => setTimeout(r, 800))
        const demoReplies = {
          project: "Divyanshu has built several cool projects: DivyOS Portfolio (this!), a Python Library Management System, Hand Tracking with OpenCV, and a Firebase Chat App. Type 'open projects' in the Terminal to see more!",
          skill: "Divyanshu is skilled in React, JavaScript, Python, Firebase, CSS, and OpenCV. He's currently learning TypeScript and Next.js.",
          contact: "You can reach Divyanshu at:\n• GitHub: github.com/CodeCr4cker\n• YouTube: youtube.com/@CodeCr4cker\n• Or use the Chat app to send a direct message!",
          default: "I'm running in demo mode. To enable full AI responses, click the ⚙️ icon and add your Anthropic API key. I can answer questions about Divyanshu's portfolio, projects, and skills!",
        }
        const lower = txt.toLowerCase()
        const reply = lower.includes('project') ? demoReplies.project
          : lower.includes('skill') ? demoReplies.skill
          : lower.includes('contact') ? demoReplies.contact
          : demoReplies.default
        setMessages(prev => [...prev, { role: 'assistant', content: reply }])
        return
      }

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 512,
          system: SYSTEM_CONTEXT,
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text || 'Sorry, I could not get a response.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}. Check your API key in Settings or src/config.js.` }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const saveKey = () => {
    localStorage.setItem('divyos-ai-key', apiKey)
    setShowKeyInput(false)
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--win-bg)', fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div style={{
        padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0,
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--neon2), var(--neon))',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
        }}>
          <i className="fas fa-robot" />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text)', fontWeight: 600 }}>DivyAI</div>
          <div style={{ fontSize: '0.62rem', color: apiKey ? 'var(--green)' : 'var(--text-dim)' }}>
            {apiKey ? '● Claude API Connected' : '● Demo Mode'}
          </div>
        </div>
        <button onClick={() => setShowKeyInput(s => !s)} title="API Key Settings"
          style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
          <i className="fas fa-cog" />
        </button>
      </div>

      {/* API Key Input */}
      <AnimatePresence>
        {showKeyInput && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', borderBottom: '1px solid var(--border)', flexShrink: 0 }}
          >
            <div style={{ padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--surface)' }}>
              <i className="fas fa-key" style={{ color: 'var(--neon2)', fontSize: '0.8rem' }} />
              <input
                value={apiKey} onChange={e => setApiKey(e.target.value)}
                placeholder="Anthropic API key (sk-ant-...)"
                type="password"
                style={{ flex: 1, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.4rem 0.6rem', color: 'var(--text)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', outline: 'none' }}
              />
              <button onClick={saveKey} style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', background: 'var(--neon)', color: '#000', border: 'none', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {messages.map((msg, i) => <Message key={i} msg={msg} />)}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--neon2), var(--neon))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>
                <i className="fas fa-robot" />
              </div>
              <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--neon)' }}>DivyAI is thinking…</span>
            </div>
            <Spinner />
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Smart Replies */}
      {messages.length <= 2 && (
        <div style={{ padding: '0 1rem 0.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', flexShrink: 0 }}>
          {SMART_REPLIES.map(r => (
            <button key={r} onClick={() => sendMessage(r)} style={{
              padding: '4px 10px', borderRadius: '20px', fontSize: '0.65rem',
              background: 'var(--surface)', color: 'var(--neon)', border: '1px solid rgba(0,212,255,0.3)',
              cursor: 'pointer', fontFamily: 'var(--font-mono)', transition: 'all 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
          placeholder="Ask DivyAI anything…"
          disabled={loading}
          style={{
            flex: 1, background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '8px', padding: '0.5rem 0.75rem',
            color: 'var(--text)', fontSize: '0.8rem', fontFamily: 'var(--font-sans)', outline: 'none',
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: input.trim() && !loading ? 'linear-gradient(135deg, var(--neon2), var(--neon))' : 'var(--surface2)',
            border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.85rem',
            transition: 'all 0.2s', flexShrink: 0,
          }}
        >
          <i className={loading ? 'fas fa-circle-notch fa-spin' : 'fas fa-paper-plane'} />
        </button>
      </div>
    </div>
  )
}
