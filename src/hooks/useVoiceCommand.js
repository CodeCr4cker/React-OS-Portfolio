import { useState, useCallback, useRef } from 'react'
import { useOS } from '../context/OSContext.jsx'
import { APP_REGISTRY } from '../utils/appRegistry.js'

const COMMANDS = {
  // Open apps
  'open terminal':   () => ({ action: 'open', app: 'terminal' }),
  'open about':      () => ({ action: 'open', app: 'about'    }),
  'open projects':   () => ({ action: 'open', app: 'projects' }),
  'open skills':     () => ({ action: 'open', app: 'skills'   }),
  'open chat':       () => ({ action: 'open', app: 'chat'     }),
  'open settings':   () => ({ action: 'open', app: 'settings' }),
  'open gallery':    () => ({ action: 'open', app: 'gallery'  }),
  'open videos':     () => ({ action: 'open', app: 'videos'   }),
  'open files':      () => ({ action: 'open', app: 'files'    }),
  'open ai':         () => ({ action: 'open', app: 'ai'       }),
  // Theme
  'dark mode':       () => ({ action: 'theme', value: 'dark'      }),
  'light mode':      () => ({ action: 'theme', value: 'light'     }),
  'neon mode':       () => ({ action: 'theme', value: 'neon'      }),
  'matrix mode':     () => ({ action: 'theme', value: 'matrix'    }),
  'synthwave mode':  () => ({ action: 'theme', value: 'synthwave' }),
  // Actions
  'close window':    () => ({ action: 'close' }),
  'search':          () => ({ action: 'search' }),
  'lock screen':     () => ({ action: 'lock' }),
  'go to github':    () => ({ action: 'navigate', url: 'https://github.com/CodeCr4cker' }),
}

function matchCommand(transcript) {
  const lower = transcript.toLowerCase().trim()
  for (const [phrase, fn] of Object.entries(COMMANDS)) {
    if (lower.includes(phrase)) return fn()
  }
  return null
}

export function useVoiceCommand() {
  const { openWindow, closeWindow, activeWindow, setTheme, toggleSearch, showNotification } = useOS()
  const [listening, setListening]   = useState(false)
  const [transcript, setTranscript] = useState('')
  const [supported]                  = useState(() => 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  const recognizerRef = useRef(null)

  const start = useCallback(() => {
    if (!supported || listening) return

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const r  = new SR()
    recognizerRef.current = r

    r.lang = 'en-US'
    r.interimResults = true
    r.maxAlternatives = 1
    r.continuous = false

    r.onstart  = () => { setListening(true); setTranscript('') }
    r.onend    = () => setListening(false)
    r.onerror  = () => setListening(false)

    r.onresult = (event) => {
      const last = event.results[event.results.length - 1]
      const text = last[0].transcript
      setTranscript(text)

      if (last.isFinal) {
        const cmd = matchCommand(text)
        if (!cmd) {
          showNotification('Voice', `Unrecognized: "${text}"`, 'warning')
          return
        }

        if (cmd.action === 'open' && APP_REGISTRY[cmd.app]) {
          openWindow(cmd.app, APP_REGISTRY[cmd.app])
          showNotification('Voice', `Opening ${APP_REGISTRY[cmd.app].title}`)
        } else if (cmd.action === 'theme') {
          setTheme(cmd.value)
          showNotification('Voice', `Theme: ${cmd.value}`)
        } else if (cmd.action === 'close') {
          if (activeWindow) closeWindow(activeWindow)
        } else if (cmd.action === 'search') {
          toggleSearch()
        } else if (cmd.action === 'navigate') {
          window.open(cmd.url, '_blank')
        } else if (cmd.action === 'lock') {
          showNotification('Voice', 'Lock screen triggered')
        }
      }
    }

    r.start()
  }, [supported, listening, openWindow, closeWindow, activeWindow, setTheme, toggleSearch, showNotification])

  const stop = useCallback(() => {
    recognizerRef.current?.stop()
    setListening(false)
  }, [])

  return { listening, transcript, supported, start, stop }
}
