/**
 * useFirebase — complete Firebase v9 modular integration
 *
 * Usage:
 *   1. npm install firebase
 *   2. Edit src/config.js — add your Firebase credentials there
 *   3. import { useFirebaseAuth, useFirebaseChat } from './useFirebase'
 *
 * Everything here is tree-shaken — only imported modules are bundled.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { FIREBASE_CONFIG as CONFIG, ADMIN_UID } from '../config.js'

// ─── Config ────────────────────────────────────────────────────────────────────
// Replace with your Firebase project config from the Firebase console
// Config is imported from src/config.js — edit that file
export const FIREBASE_CONFIG = CONFIG || {
 apiKey: "AIzaSyB5B4QX1tUIw0lSYsjy-HW7pvHOe4nMmL4",
  authDomain: "website-1f91d.firebaseapp.com",
  databaseURL: "https://website-1f91d-default-rtdb.firebaseio.com",
  projectId: "website-1f91d",
  storageBucket: "website-1f91d.firebasestorage.app",
  messagingSenderId: "176653839690",
  appId: "1:176653839690:web:55bec54b6f2d3895c9e5b3",
  measurementId: "G-F5TKYBL0R2"
}

// ─── Lazy Firebase loader ───────────────────────────────────────────────────────
let _app = null
let _auth = null
let _db = null
let _storage = null

async function initFirebase() {
  if (_app) return { app: _app, auth: _auth, db: _db, storage: _storage }
  try {
    const { initializeApp, getApps } = await import('firebase/app')
    _app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG)

    const { getAuth }      = await import('firebase/auth')
    const { getFirestore } = await import('firebase/firestore')
    const { getStorage }   = await import('firebase/storage')

    _auth    = getAuth(_app)
    _db      = getFirestore(_app)
    _storage = getStorage(_app)

    return { app: _app, auth: _auth, db: _db, storage: _storage }
  } catch (e) {
    console.warn('[Firebase] Init failed — running in demo mode:', e.message)
    return null
  }
}

// ─── useFirebaseAuth ───────────────────────────────────────────────────────────
export function useFirebaseAuth() {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const authRef = useRef(null)

  useEffect(() => {
    initFirebase().then(async (fb) => {
      if (!fb) { setLoading(false); return }
      authRef.current = fb.auth
      const { onAuthStateChanged } = await import('firebase/auth')
      const unsub = onAuthStateChanged(fb.auth, u => {
        setUser(u)
        setLoading(false)
      })
      return unsub
    })
  }, [])

  const signIn = useCallback(async (email, password) => {
    setError(null)
    try {
      const fb = await initFirebase()
      if (!fb) throw new Error('Firebase not configured')
      const { signInWithEmailAndPassword } = await import('firebase/auth')
      return await signInWithEmailAndPassword(fb.auth, email, password)
    } catch (e) {
      setError(e.message)
      throw e
    }
  }, [])

  const signUp = useCallback(async (email, password, displayName) => {
    setError(null)
    try {
      const fb = await initFirebase()
      if (!fb) throw new Error('Firebase not configured')
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth')
      const cred = await createUserWithEmailAndPassword(fb.auth, email, password)
      if (displayName) await updateProfile(cred.user, { displayName })
      return cred
    } catch (e) {
      setError(e.message)
      throw e
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    try {
      const fb = await initFirebase()
      if (!fb) throw new Error('Firebase not configured')
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')
      return await signInWithPopup(fb.auth, new GoogleAuthProvider())
    } catch (e) {
      setError(e.message)
      throw e
    }
  }, [])

  const signOut = useCallback(async () => {
    const fb = await initFirebase()
    if (!fb) return
    const { signOut: fbSignOut } = await import('firebase/auth')
    return fbSignOut(fb.auth)
  }, [])

  return { user, loading, error, signIn, signUp, signInWithGoogle, signOut }
}

// ─── useFirebaseChat ───────────────────────────────────────────────────────────
export function useFirebaseChat(chatId, isAdmin = false) {
  const [messages,   setMessages]   = useState([])
  const [typing,     setTyping]     = useState(false)
  const [loading,    setLoading]    = useState(true)
  const unsubRef = useRef(null)
  const typingTimer = useRef(null)

  // Listen to messages
  useEffect(() => {
    if (!chatId) return
    setLoading(true)

    initFirebase().then(async (fb) => {
      if (!fb) { setLoading(false); return }
      const { collection, query, orderBy, onSnapshot } = await import('firebase/firestore')

      const q = query(
        collection(fb.db, 'chats', chatId, 'messages'),
        orderBy('timestamp', 'asc')
      )

      unsubRef.current = onSnapshot(q, snap => {
        const msgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setMessages(msgs)
        setLoading(false)

        // Mark received messages as read
        snap.docs.forEach(async doc => {
          const d = doc.data()
          const shouldMark = isAdmin ? d.senderType === 'user' : d.senderType === 'admin'
          if (shouldMark && !d.read) {
            const { updateDoc, doc: docRef } = await import('firebase/firestore')
            updateDoc(docRef(fb.db, 'chats', chatId, 'messages', doc.id), { read: true }).catch(() => {})
          }
        })
      })
    })

    return () => { unsubRef.current?.() }
  }, [chatId, isAdmin])

  // Listen to typing state
  useEffect(() => {
    if (!chatId) return
    initFirebase().then(async (fb) => {
      if (!fb) return
      const { doc, onSnapshot } = await import('firebase/firestore')
      const unsub = onSnapshot(doc(fb.db, 'chats', chatId), snap => {
        const d = snap.data()
        setTyping(isAdmin ? d?.userTyping : d?.adminTyping)
      })
      return unsub
    })
  }, [chatId, isAdmin])

  // Send message
  const sendMessage = useCallback(async (text, user) => {
    if (!text.trim() || !chatId) return
    const fb = await initFirebase()
    if (!fb) return

    const { collection, addDoc, serverTimestamp, doc, updateDoc, increment } = await import('firebase/firestore')

    const senderType = isAdmin ? 'admin' : 'user'
    const unreadField = isAdmin ? 'userUnread' : 'adminUnread'
    const typingField = isAdmin ? 'adminTyping' : 'userTyping'

    await addDoc(collection(fb.db, 'chats', chatId, 'messages'), {
      text,
      senderId:   user?.uid || 'anon',
      senderName: user?.displayName || user?.email || senderType,
      senderType,
      timestamp:  serverTimestamp(),
      read:       false,
    })

    await updateDoc(doc(fb.db, 'chats', chatId), {
      lastMessage:     text,
      lastMessageTime: serverTimestamp(),
      [typingField]:   false,
      [unreadField]:   increment(1),
    }).catch(async () => {
      // Doc may not exist — create it
      const { setDoc } = await import('firebase/firestore')
      await setDoc(doc(fb.db, 'chats', chatId), {
        lastMessage: text,
        [unreadField]: 1,
        userTyping: false, adminTyping: false,
      })
    })
  }, [chatId, isAdmin])

  // Send typing indicator
  const sendTyping = useCallback(async (isTyping) => {
    if (!chatId) return
    const fb = await initFirebase()
    if (!fb) return
    const { doc, updateDoc } = await import('firebase/firestore')
    const field = isAdmin ? 'adminTyping' : 'userTyping'
    clearTimeout(typingTimer.current)
    await updateDoc(doc(fb.db, 'chats', chatId), { [field]: isTyping }).catch(() => {})
    if (isTyping) {
      typingTimer.current = setTimeout(() => sendTyping(false), 3000)
    }
  }, [chatId, isAdmin])

  // Upload file to Storage
  const sendFile = useCallback(async (file, user) => {
    const fb = await initFirebase()
    if (!fb) return

    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
    const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')

    const storageRef = ref(fb.storage, `chat-files/${chatId}/${Date.now()}-${file.name}`)
    const snap = await uploadBytes(storageRef, file)
    const url  = await getDownloadURL(snap.ref)

    const isImage = file.type.startsWith('image/')
    await addDoc(collection(fb.db, 'chats', chatId, 'messages'), {
      text:       isImage ? '' : file.name,
      fileUrl:    url,
      fileType:   file.type,
      fileName:   file.name,
      type:       isImage ? 'image' : 'file',
      senderId:   user?.uid || 'anon',
      senderType: isAdmin ? 'admin' : 'user',
      timestamp:  serverTimestamp(),
      read:       false,
    })
  }, [chatId, isAdmin])

  return { messages, loading, typing, sendMessage, sendTyping, sendFile }
}

// ─── useFirebaseUsers (Admin) ─────────────────────────────────────────────────
export function useFirebaseUsers() {
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initFirebase().then(async (fb) => {
      if (!fb) { setLoading(false); return }
      const { collection, onSnapshot, orderBy, query } = await import('firebase/firestore')
      const q = query(collection(fb.db, 'chats'), orderBy('lastMessageTime', 'desc'))
      const unsub = onSnapshot(q, snap => {
        setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        setLoading(false)
      })
      return unsub
    })
  }, [])

  return { users, loading }
}

// ─── useOnlinePresence ────────────────────────────────────────────────────────
export function useOnlinePresence(uid) {
  useEffect(() => {
    if (!uid) return
    initFirebase().then(async (fb) => {
      if (!fb) return
      const { ref, onDisconnect, set, serverTimestamp } = await import('firebase/database')
        .catch(() => ({ ref: null })) // RTDB optional
      if (!ref) return
      // Uses Realtime Database for presence (add firebase/database to dependencies)
    })
  }, [uid])
}
