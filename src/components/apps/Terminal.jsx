import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useOS } from '../../context/OSContext.jsx'
import { APP_REGISTRY } from '../../utils/appRegistry.js'

const PROMPT = 'divyanshu@divyos:~$'

const COMMANDS = {
  help: () => `
Available commands:
  about       — Show info about Divyanshu
  skills      — List technical skills
  projects    — List projects
  contact     — Show contact info
  open <app>  — Open an app (about|terminal|projects|skills|chat|docs|gallery|videos|ai|settings)
  theme <name>— Change theme (dark|light|neon|synthwave|matrix)
  clear       — Clear terminal
  date        — Show current date/time
  whoami      — Who am I?
  ls          — List directory
  pwd         — Print working directory
  neofetch    — System info
  echo <text> — Print text
  history     — Command history
  exit        — Close terminal
`.trim(),

  about: () => `
Divyanshu Pandey
━━━━━━━━━━━━━━━━━━━━━━━━
Role    : Web Developer & Student
Location: Kanpur, Uttar Pradesh, India
Status  : Available for work 🟢
GitHub  : github.com/CodeCr4cker
YouTube : youtube.com/@CodeCr4cker
`.trim(),

  whoami: () => 'divyanshu — passionate developer, open source enthusiast, lifelong learner.',

  skills: () => `
Technical Skills:
  Frontend  : React, HTML5, CSS3, JavaScript (ES2024)
  Backend   : Python, Node.js, Firebase
  Database  : Firestore, SQL (MySQL)
  Tools     : Git, Vite, VS Code, Linux
  Learning  : AI/ML, TypeScript, Next.js
`.trim(),

  projects: () => `
Projects:
  1. DivyOS Portfolio     — OS-style React portfolio (this!)
  2. Library Management   — Python + SQL desktop app
  3. Hand Tracking Demo   — OpenCV + MediaPipe
  4. Chat Application     — Firebase real-time messaging
  5. E-commerce UI        — React + Tailwind storefront

Type 'open projects' to see full details.
`.trim(),

  contact: () => `
Contact Info:
  📧 Email    : divyanshu@example.com
  🐙 GitHub   : github.com/CodeCr4cker
  📺 YouTube  : youtube.com/@CodeCr4cker
  💼 LinkedIn : linkedin.com/in/divyanshu-pandey
`.trim(),

  date: () => new Date().toString(),

  pwd: () => '/home/divyanshu/portfolio',

  ls: () => `
total 11
drwxr-xr-x  about/
drwxr-xr-x  projects/
drwxr-xr-x  skills/
drwxr-xr-x  docs/
drwxr-xr-x  gallery/
-rw-r--r--  README.md
-rw-r--r--  resume.pdf
`.trim(),

  neofetch: () => `
     ██████╗ ██╗██╗   ██╗██╗   ██╗ ██████╗ ███████╗
     ██╔══██╗██║██║   ██║╚██╗ ██╔╝██╔═══██╗██╔════╝
     ██║  ██║██║██║   ██║ ╚████╔╝ ██║   ██║███████╗
     ██║  ██║██║╚██╗ ██╔╝  ╚██╔╝  ██║   ██║╚════██║
     ██████╔╝██║ ╚████╔╝    ██║   ╚██████╔╝███████║
     ╚═════╝ ╚═╝  ╚═══╝     ╚═╝    ╚═════╝ ╚══════╝

OS       : DivyOS 2.0 (React Edition)
Host     : github.com/CodeCr4cker
Kernel   : React 18.2.0
Shell    : DivyShell 1.0
Terminal : DivyTerm
CPU      : JavaScript V8 Engine
Memory   : ${Math.round(performance?.memory?.usedJSHeapSize / 1048576) || '~48'} MB
Theme    : neon-dark
`.trim(),
}

export default function Terminal() {
  const { openWindow, closeWindow, setTheme, showNotification } = useOS()
  const [history, setHistory] = useState([
    { type: 'info', text: 'DivyOS Terminal v2.0.0 — Type "help" for available commands.' },
    { type: 'info', text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' },
  ])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [history])

  const appendOutput = useCallback((text, type = 'output') => {
    setHistory(h => [...h, { type, text }])
  }, [])

  const handleSubmit = useCallback((e) => {
    e?.preventDefault()
    const raw = input.trim()
    if (!raw) return

    // Echo the command
    appendOutput(`${PROMPT} ${raw}`, 'cmd')
    setCmdHistory(h => [raw, ...h])
    setHistoryIdx(-1)
    setInput('')

    const [cmd, ...args] = raw.split(' ')
    const arg = args.join(' ')

    // Built-in handlers
    if (cmd === 'clear') { setHistory([]); return }
    if (cmd === 'exit')  { closeWindow('terminal'); return }
    if (cmd === 'history') {
      appendOutput(cmdHistory.map((c, i) => `  ${i + 1}  ${c}`).join('\n') || '  (empty)', 'output')
      return
    }
    if (cmd === 'echo') { appendOutput(arg || '', 'output'); return }

    if (cmd === 'open') {
      const appId = arg.toLowerCase()
      if (APP_REGISTRY[appId]) {
        openWindow(appId, APP_REGISTRY[appId])
        appendOutput(`Opening ${APP_REGISTRY[appId].title}…`, 'info')
      } else {
        appendOutput(`open: no app named '${appId}'. Try: ${Object.keys(APP_REGISTRY).join(', ')}`, 'error')
      }
      return
    }

    if (cmd === 'theme') {
      const valid = ['dark', 'light', 'neon', 'synthwave', 'matrix']
      if (valid.includes(arg)) {
        setTheme(arg)
        appendOutput(`Theme set to '${arg}'`, 'info')
        showNotification('Theme', `Switched to ${arg} theme`)
      } else {
        appendOutput(`theme: unknown '${arg}'. Options: ${valid.join(', ')}`, 'error')
      }
      return
    }

    if (COMMANDS[cmd]) {
      appendOutput(COMMANDS[cmd](), 'output')
      return
    }

    appendOutput(`divysh: command not found: ${cmd}. Type 'help' for available commands.`, 'error')
  }, [input, cmdHistory, appendOutput, openWindow, closeWindow, setTheme, showNotification])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { handleSubmit(); return }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1)
      setHistoryIdx(next)
      setInput(cmdHistory[next] || '')
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(historyIdx - 1, -1)
      setHistoryIdx(next)
      setInput(next === -1 ? '' : cmdHistory[next])
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const cmds = [...Object.keys(COMMANDS), 'clear', 'exit', 'echo', 'history', 'open', 'theme']
      const match = cmds.find(c => c.startsWith(input))
      if (match) setInput(match)
    }
  }

  const COLOR = { cmd: '#e2e8f0', output: '#8bc34a', error: '#ff5555', info: '#00d4ff' }

  return (
    <div
      ref={bodyRef}
      onClick={() => inputRef.current?.focus()}
      style={{
        background: '#0a0a0a', padding: '1rem', height: '100%',
        fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
        lineHeight: 1.7, color: '#b0c0b0', overflowY: 'auto',
        cursor: 'text',
      }}
    >
      {history.map((line, i) => (
        <pre key={i} style={{
          color: COLOR[line.type] || '#b0c0b0',
          whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0,
          fontFamily: 'inherit', fontSize: 'inherit',
        }}>
          {line.text}
        </pre>
      ))}

      {/* Input Line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--neon)', whiteSpace: 'nowrap', flexShrink: 0 }}>{PROMPT}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            background: 'transparent', border: 'none', outline: 'none',
            color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.78rem',
            flex: 1, minWidth: '80px', caretColor: 'var(--neon)',
          }}
        />
      </div>
    </div>
  )
}
