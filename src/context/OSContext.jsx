import React, { createContext, useContext, useReducer, useCallback } from 'react'

// ─── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  windows: {},          // { [appId]: WindowState }
  windowOrder: [],      // z-index stack (appIds)
  activeWindow: null,   // currently focused appId
  theme: 'dark',        // dark | light | neon | synthwave | matrix
  wallpaper: 'default',
  notifications: [],
  searchOpen: false,
  contextMenu: null,    // { x, y, items }
  settings: {
    animations: true,
    sounds: true,
    performance: false,
    transparency: true,
  },
  user: null,           // Firebase user object
}

// ─── Action Types ─────────────────────────────────────────────────────────────
export const ACTIONS = {
  // Windows
  OPEN_WINDOW:       'OPEN_WINDOW',
  CLOSE_WINDOW:      'CLOSE_WINDOW',
  MINIMIZE_WINDOW:   'MINIMIZE_WINDOW',
  MAXIMIZE_WINDOW:   'MAXIMIZE_WINDOW',
  RESTORE_WINDOW:    'RESTORE_WINDOW',
  FOCUS_WINDOW:      'FOCUS_WINDOW',
  UPDATE_WINDOW:     'UPDATE_WINDOW',
  // Theme / Appearance
  SET_THEME:         'SET_THEME',
  SET_WALLPAPER:     'SET_WALLPAPER',
  TOGGLE_SETTING:    'TOGGLE_SETTING',
  // UI
  SHOW_NOTIFICATION: 'SHOW_NOTIFICATION',
  HIDE_NOTIFICATION: 'HIDE_NOTIFICATION',
  TOGGLE_SEARCH:     'TOGGLE_SEARCH',
  SHOW_CONTEXT_MENU: 'SHOW_CONTEXT_MENU',
  HIDE_CONTEXT_MENU: 'HIDE_CONTEXT_MENU',
  // Auth
  SET_USER:          'SET_USER',
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function osReducer(state, action) {
  switch (action.type) {

    case ACTIONS.OPEN_WINDOW: {
      const { appId, config } = action.payload
      // If already open, just focus it
      if (state.windows[appId] && !state.windows[appId].minimized) {
        const newOrder = state.windowOrder.filter(id => id !== appId).concat(appId)
        return { ...state, windows: { ...state.windows, [appId]: { ...state.windows[appId], minimized: false } }, windowOrder: newOrder, activeWindow: appId }
      }
      const newWindow = {
        appId,
        title: config.title,
        icon: config.icon,
        width: config.width || 800,
        height: config.height || 560,
        x: config.x ?? (120 + Object.keys(state.windows).length * 24),
        y: config.y ?? (60  + Object.keys(state.windows).length * 24),
        minimized: false,
        maximized: false,
        ...config,
      }
      const newOrder = state.windowOrder.filter(id => id !== appId).concat(appId)
      return {
        ...state,
        windows: { ...state.windows, [appId]: newWindow },
        windowOrder: newOrder,
        activeWindow: appId,
      }
    }

    case ACTIONS.CLOSE_WINDOW: {
      const { [action.payload]: _, ...rest } = state.windows
      const newOrder = state.windowOrder.filter(id => id !== action.payload)
      const active = newOrder.length ? newOrder[newOrder.length - 1] : null
      return { ...state, windows: rest, windowOrder: newOrder, activeWindow: active }
    }

    case ACTIONS.MINIMIZE_WINDOW: {
      const win = state.windows[action.payload]
      if (!win) return state
      const newOrder = state.windowOrder.filter(id => id !== action.payload)
      const active = newOrder.length ? newOrder[newOrder.length - 1] : null
      return {
        ...state,
        windows: { ...state.windows, [action.payload]: { ...win, minimized: true } },
        windowOrder: newOrder,
        activeWindow: active,
      }
    }

    case ACTIONS.MAXIMIZE_WINDOW: {
      const win = state.windows[action.payload]
      if (!win) return state
      return {
        ...state,
        windows: { ...state.windows, [action.payload]: { ...win, maximized: !win.maximized } },
      }
    }

    case ACTIONS.RESTORE_WINDOW: {
      const win = state.windows[action.payload]
      if (!win) return state
      const newOrder = state.windowOrder.filter(id => id !== action.payload).concat(action.payload)
      return {
        ...state,
        windows: { ...state.windows, [action.payload]: { ...win, minimized: false, maximized: false } },
        windowOrder: newOrder,
        activeWindow: action.payload,
      }
    }

    case ACTIONS.FOCUS_WINDOW: {
      const newOrder = state.windowOrder.filter(id => id !== action.payload).concat(action.payload)
      return { ...state, windowOrder: newOrder, activeWindow: action.payload }
    }

    case ACTIONS.UPDATE_WINDOW: {
      const { appId, updates } = action.payload
      if (!state.windows[appId]) return state
      return { ...state, windows: { ...state.windows, [appId]: { ...state.windows[appId], ...updates } } }
    }

    case ACTIONS.SET_THEME:
      document.documentElement.setAttribute('data-theme', action.payload)
      localStorage.setItem('divyos-theme', action.payload)
      return { ...state, theme: action.payload }

    case ACTIONS.SET_WALLPAPER:
      localStorage.setItem('divyos-wallpaper', action.payload)
      return { ...state, wallpaper: action.payload }

    case ACTIONS.TOGGLE_SETTING:
      return { ...state, settings: { ...state.settings, [action.payload]: !state.settings[action.payload] } }

    case ACTIONS.SHOW_NOTIFICATION: {
      const notif = { id: Date.now(), ...action.payload }
      return { ...state, notifications: [...state.notifications, notif] }
    }

    case ACTIONS.HIDE_NOTIFICATION:
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) }

    case ACTIONS.TOGGLE_SEARCH:
      return { ...state, searchOpen: !state.searchOpen }

    case ACTIONS.SHOW_CONTEXT_MENU:
      return { ...state, contextMenu: action.payload }

    case ACTIONS.HIDE_CONTEXT_MENU:
      return { ...state, contextMenu: null }

    case ACTIONS.SET_USER:
      return { ...state, user: action.payload }

    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const OSContext = createContext(null)

export function OSProvider({ children }) {
  const saved = localStorage.getItem('divyos-theme') || 'dark'
  const [state, dispatch] = useReducer(osReducer, { ...initialState, theme: saved })

  // Restore theme on mount
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  // Stable action creators
  const openWindow  = useCallback((appId, config) => dispatch({ type: ACTIONS.OPEN_WINDOW,       payload: { appId, config } }), [])
  const closeWindow = useCallback(appId =>            dispatch({ type: ACTIONS.CLOSE_WINDOW,      payload: appId }), [])
  const minimizeWindow = useCallback(appId =>         dispatch({ type: ACTIONS.MINIMIZE_WINDOW,   payload: appId }), [])
  const maximizeWindow = useCallback(appId =>         dispatch({ type: ACTIONS.MAXIMIZE_WINDOW,   payload: appId }), [])
  const restoreWindow  = useCallback(appId =>         dispatch({ type: ACTIONS.RESTORE_WINDOW,    payload: appId }), [])
  const focusWindow    = useCallback(appId =>         dispatch({ type: ACTIONS.FOCUS_WINDOW,      payload: appId }), [])
  const updateWindow   = useCallback((appId, updates)=> dispatch({ type: ACTIONS.UPDATE_WINDOW,  payload: { appId, updates } }), [])
  const setTheme       = useCallback(theme =>         dispatch({ type: ACTIONS.SET_THEME,         payload: theme }), [])
  const setWallpaper   = useCallback(wp =>            dispatch({ type: ACTIONS.SET_WALLPAPER,     payload: wp }), [])
  const toggleSetting  = useCallback(key =>           dispatch({ type: ACTIONS.TOGGLE_SETTING,   payload: key }), [])
  const showNotification = useCallback((title, msg, type='info') =>
    dispatch({ type: ACTIONS.SHOW_NOTIFICATION, payload: { title, msg, type } }), [])
  const hideNotification = useCallback(id =>          dispatch({ type: ACTIONS.HIDE_NOTIFICATION, payload: id }), [])
  const toggleSearch   = useCallback(() =>            dispatch({ type: ACTIONS.TOGGLE_SEARCH }), [])
  const showContextMenu= useCallback((x, y, items) => dispatch({ type: ACTIONS.SHOW_CONTEXT_MENU, payload: { x, y, items } }), [])
  const hideContextMenu= useCallback(() =>            dispatch({ type: ACTIONS.HIDE_CONTEXT_MENU }), [])
  const setUser        = useCallback(user =>          dispatch({ type: ACTIONS.SET_USER,          payload: user }), [])

  const getWindowZIndex = useCallback((appId) => {
    const idx = state.windowOrder.indexOf(appId)
    return 100 + idx * 2
  }, [state.windowOrder])

  const value = {
    ...state,
    openWindow, closeWindow, minimizeWindow, maximizeWindow,
    restoreWindow, focusWindow, updateWindow,
    setTheme, setWallpaper, toggleSetting,
    showNotification, hideNotification,
    toggleSearch, showContextMenu, hideContextMenu,
    setUser, getWindowZIndex,
  }

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>
}

export function useOS() {
  const ctx = useContext(OSContext)
  if (!ctx) throw new Error('useOS must be used inside OSProvider')
  return ctx
}
