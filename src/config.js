/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║          DivyOS — User Configuration File               ║
 * ║   Edit this file to configure your portfolio settings   ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * HOW TO FIND YOUR ADMIN UID:
 * ─────────────────────────────────────────────────────────────
 * 1. Go to https://console.firebase.google.com
 * 2. Open your project
 * 3. Click "Authentication" in the left sidebar
 * 4. Click the "Users" tab
 * 5. Sign in to your app once (creates your account)
 * 6. Your UID appears in the "User UID" column — copy it
 * 7. Paste it below as ADMIN_UID
 *
 * Example UID format: "abc123XYZdef456GHI789jkl"
 */

// ─── 🔑 ADMIN UID ─────────────────────────────────────────────────────────────
// This is YOUR Firebase user UID. Users with this UID get the admin panel
// in Chat (can see all conversations and reply to any user).
export const ADMIN_UID = 'bz0sraSEDbdeYYL0f6ygcnAiv0G2'

// ─── 🔥 FIREBASE CONFIG ───────────────────────────────────────────────────────
// Copy this from Firebase Console → Project Settings → Your Apps → SDK setup
export const FIREBASE_CONFIG = {
 apiKey: "AIzaSyB5B4QX1tUIw0lSYsjy-HW7pvHOe4nMmL4",
  authDomain: "website-1f91d.firebaseapp.com",
  databaseURL: "https://website-1f91d-default-rtdb.firebaseio.com",
  projectId: "website-1f91d",
  storageBucket: "website-1f91d.firebasestorage.app",
  messagingSenderId: "176653839690",
  appId: "1:176653839690:web:55bec54b6f2d3895c9e5b3",
  measurementId: "G-F5TKYBL0R2"
}

// ─── 👤 PORTFOLIO OWNER INFO ──────────────────────────────────────────────────
export const OWNER = {
  name:       'Divyanshu Pandey',
  tagline:    'Web Developer & Student',
  location:   'Kanpur, India',
  email:      'divyanshu@example.com',
  github:     'https://github.com/CodeCr4cker',
  youtube:    'https://youtube.com/@CodeCr4cker',
  linkedin:   'https://linkedin.com/in/divyanshu-pandey',
  instagram:  'https://instagram.com/divyanshu.dev',
}

// ─── 🔒 LOCK SCREEN PIN ───────────────────────────────────────────────────────
// Change this to your preferred 4-digit PIN
export const LOCK_PIN = '1234'

// ─── ⏱️ MOBILE BOOT LOADER DURATION ──────────────────────────────────────────
// Controls how long the Android boot animation plays before showing home screen
// Total time  = BOOT_DURATION ms  (progress bar fills across this window)
// Fade-out    = 500 ms extra      (always fixed)
//
// Presets:
//   500   → very fast  (barely visible)
//   1200  → fast       (current default)
//   2000  → normal
//   3000  → slow       (original first version)
export const BOOT_DURATION = 500   // ← change this number (milliseconds)

// ─── 🤖 AI ASSISTANT ─────────────────────────────────────────────────────────
// Anthropic API key for the AI Assistant app (optional — demo mode works without it)
// Get one at: https://console.anthropic.com
export const ANTHROPIC_API_KEY = ''   // leave empty to use demo mode
