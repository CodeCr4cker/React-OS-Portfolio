import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOS } from '../../context/OSContext.jsx'

const DEFAULT_TREE = {
  '/': {
    type: 'folder', name: 'root', children: {
      'Projects': {
        type: 'folder', children: {
          'divyos-react': { type: 'folder', children: {
            'src': { type: 'folder', children: {} },
            'package.json': { type: 'file', ext: 'json', size: '1.2 KB' },
            'README.md': { type: 'file', ext: 'md', size: '2.8 KB' },
          }},
          'library-system': { type: 'folder', children: {
            'main.py': { type: 'file', ext: 'py', size: '8.4 KB' },
            'database.sql': { type: 'file', ext: 'sql', size: '3.1 KB' },
          }},
        },
      },
      'Documents': {
        type: 'folder', children: {
          'resume.pdf': { type: 'file', ext: 'pdf', size: '145 KB' },
          'cover-letter.docx': { type: 'file', ext: 'docx', size: '32 KB' },
        },
      },
      'Images': {
        type: 'folder', children: {
          'profile.png': { type: 'file', ext: 'png', size: '82 KB' },
          'logo.svg': { type: 'file', ext: 'svg', size: '4 KB' },
          'wallpaper.jpg': { type: 'file', ext: 'jpg', size: '1.2 MB' },
        },
      },
    },
  },
}

const EXT_ICONS = {
  py: { icon: 'fab fa-python', color: '#3572A5' },
  js: { icon: 'fab fa-js', color: '#F7DF1E' },
  jsx: { icon: 'fab fa-react', color: '#61DAFB' },
  json: { icon: 'fas fa-code', color: '#f59e0b' },
  md: { icon: 'fab fa-markdown', color: '#083fa1' },
  pdf: { icon: 'fas fa-file-pdf', color: '#ff4757' },
  docx: { icon: 'fas fa-file-word', color: '#2b579a' },
  png: { icon: 'fas fa-file-image', color: '#ff6ec7' },
  jpg: { icon: 'fas fa-file-image', color: '#ff6ec7' },
  svg: { icon: 'fas fa-vector-square', color: '#ff9500' },
  sql: { icon: 'fas fa-database', color: '#336791' },
  default: { icon: 'fas fa-file', color: 'var(--text-dim)' },
}

function getNode(tree, path) {
  if (path === '/') return tree['/']
  const parts = path.split('/').filter(Boolean)
  let node = tree['/']
  for (const p of parts) {
    node = node.children?.[p]
    if (!node) return null
  }
  return node
}

export default function FileManager() {
  const { showNotification } = useOS()
  const [tree, setTree] = useState(DEFAULT_TREE)
  const [path, setPath] = useState('/')
  const [selected, setSelected] = useState(null)
  const [view, setView] = useState('grid') // grid | list
  const [renaming, setRenaming] = useState(null)
  const [renameVal, setRenameVal] = useState('')
  const fileInputRef = useRef(null)

  const currentNode = getNode(tree, path)
  const children = currentNode?.children || {}

  const pathParts = path === '/' ? [] : path.split('/').filter(Boolean)

  const navigate = (folder) => {
    const newPath = path === '/' ? `/${folder}` : `${path}/${folder}`
    setPath(newPath)
    setSelected(null)
  }

  const goUp = () => {
    if (path === '/') return
    const parts = path.split('/').filter(Boolean)
    parts.pop()
    setPath(parts.length === 0 ? '/' : '/' + parts.join('/'))
    setSelected(null)
  }

  const deleteItem = (name) => {
    const parentNode = getNode(tree, path)
    if (!parentNode?.children) return
    const newTree = JSON.parse(JSON.stringify(tree))
    const node = getNode(newTree, path)
    delete node.children[name]
    setTree(newTree)
    setSelected(null)
    showNotification('File Manager', `Deleted "${name}"`, 'success')
  }

  const handleRename = (name) => {
    if (!renameVal.trim() || renameVal === name) { setRenaming(null); return }
    const newTree = JSON.parse(JSON.stringify(tree))
    const node = getNode(newTree, path)
    node.children[renameVal] = node.children[name]
    delete node.children[name]
    setTree(newTree)
    setRenaming(null)
    showNotification('File Manager', `Renamed to "${renameVal}"`, 'success')
  }

  const handleUpload = (e) => {
    const files = [...e.target.files]
    if (!files.length) return
    const newTree = JSON.parse(JSON.stringify(tree))
    const node = getNode(newTree, path)
    files.forEach(f => {
      const ext = f.name.split('.').pop().toLowerCase()
      node.children[f.name] = { type: 'file', ext, size: `${(f.size / 1024).toFixed(1)} KB`, uploaded: true }
    })
    setTree(newTree)
    showNotification('File Manager', `Uploaded ${files.length} file(s)`, 'success')
    e.target.value = ''
  }

  const newFolder = () => {
    const name = `New Folder ${Date.now().toString().slice(-3)}`
    const newTree = JSON.parse(JSON.stringify(tree))
    const node = getNode(newTree, path)
    node.children[name] = { type: 'folder', children: {} }
    setTree(newTree)
    showNotification('File Manager', `Created "${name}"`)
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--win-bg)', fontFamily: 'var(--font-sans)' }}>
      {/* Toolbar */}
      <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap' }}>
        <button onClick={goUp} disabled={path === '/'} style={toolBtn} title="Go Up"><i className="fas fa-arrow-up" /></button>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', flex: 1, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-dim)', minWidth: 0, overflow: 'hidden' }}>
          <span onClick={() => setPath('/')} style={{ cursor: 'pointer', color: 'var(--neon)' }}>⬡ root</span>
          {pathParts.map((p, i) => (
            <React.Fragment key={i}>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span
                onClick={() => setPath('/' + pathParts.slice(0, i + 1).join('/'))}
                style={{ cursor: 'pointer', color: i === pathParts.length - 1 ? 'var(--text)' : 'var(--neon)' }}
              >{p}</span>
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button onClick={newFolder} style={toolBtn} title="New Folder"><i className="fas fa-folder-plus" /></button>
          <button onClick={() => fileInputRef.current?.click()} style={toolBtn} title="Upload"><i className="fas fa-upload" /></button>
          <input ref={fileInputRef} type="file" multiple onChange={handleUpload} style={{ display: 'none' }} />
          {selected && <button onClick={() => deleteItem(selected)} style={{ ...toolBtn, color: '#ff5f56' }} title="Delete"><i className="fas fa-trash" /></button>}
          <button onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')} style={toolBtn} title="Toggle View">
            <i className={view === 'grid' ? 'fas fa-list' : 'fas fa-th'} />
          </button>
        </div>
      </div>

      {/* File Grid / List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {Object.keys(children).length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginTop: '3rem' }}>
            <i className="fas fa-folder-open" style={{ fontSize: '2rem', marginBottom: '0.75rem', display: 'block', color: 'var(--text-muted)' }} />
            Empty folder — drop files or click Upload
          </div>
        ) : view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.5rem' }}>
            {Object.entries(children).map(([name, node]) => (
              <FileIcon key={name} name={name} node={node} selected={selected === name}
                onSelect={() => setSelected(selected === name ? null : name)}
                onOpen={() => { if (node.type === 'folder') navigate(name) }}
                onRename={() => { setRenaming(name); setRenameVal(name) }}
                renaming={renaming === name} renameVal={renameVal}
                setRenameVal={setRenameVal}
                onRenameSubmit={() => handleRename(name)}
              />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {Object.entries(children).map(([name, node]) => (
              <FileRow key={name} name={name} node={node} selected={selected === name}
                onSelect={() => setSelected(selected === name ? null : name)}
                onOpen={() => { if (node.type === 'folder') navigate(name) }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div style={{ padding: '0.35rem 1rem', borderTop: '1px solid var(--border)', fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', display: 'flex', gap: '1rem', flexShrink: 0 }}>
        <span>{Object.keys(children).length} items</span>
        {selected && <span style={{ color: 'var(--neon)' }}>Selected: {selected}</span>}
      </div>
    </div>
  )
}

function FileIcon({ name, node, selected, onSelect, onOpen, onRename, renaming, renameVal, setRenameVal, onRenameSubmit }) {
  const ext = node.ext || ''
  const iconCfg = node.type === 'folder' ? { icon: 'fas fa-folder', color: '#f59e0b' } : (EXT_ICONS[ext] || EXT_ICONS.default)

  return (
    <div
      onClick={onSelect}
      onDoubleClick={onOpen}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem',
        padding: '0.6rem 0.3rem', borderRadius: '8px', cursor: 'pointer',
        background: selected ? 'rgba(0,212,255,0.12)' : 'transparent',
        border: `1px solid ${selected ? 'rgba(0,212,255,0.3)' : 'transparent'}`,
        transition: 'all 0.15s', userSelect: 'none',
      }}
    >
      <i className={iconCfg.icon} style={{ fontSize: '1.8rem', color: iconCfg.color }} />
      {renaming ? (
        <input autoFocus value={renameVal} onChange={e => setRenameVal(e.target.value)}
          onBlur={onRenameSubmit} onKeyDown={e => { if (e.key === 'Enter') onRenameSubmit(); if (e.key === 'Escape') onRenameSubmit() }}
          style={{ fontSize: '0.6rem', background: 'var(--surface)', border: '1px solid var(--neon)', borderRadius: '3px', color: 'var(--text)', width: '80px', textAlign: 'center', fontFamily: 'var(--font-mono)', outline: 'none' }}
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <span style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', textAlign: 'center', wordBreak: 'break-word', lineHeight: 1.3 }}>{name}</span>
      )}
    </div>
  )
}

function FileRow({ name, node, selected, onSelect, onOpen }) {
  const ext = node.ext || ''
  const iconCfg = node.type === 'folder' ? { icon: 'fas fa-folder', color: '#f59e0b' } : (EXT_ICONS[ext] || EXT_ICONS.default)
  return (
    <div
      onClick={onSelect}
      onDoubleClick={onOpen}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.45rem 0.75rem', borderRadius: '6px', cursor: 'pointer',
        background: selected ? 'rgba(0,212,255,0.1)' : 'transparent',
        border: `1px solid ${selected ? 'rgba(0,212,255,0.25)' : 'transparent'}`,
        transition: 'all 0.12s',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent' }}
    >
      <i className={iconCfg.icon} style={{ color: iconCfg.color, width: '16px', fontSize: '0.9rem' }} />
      <span style={{ flex: 1, fontSize: '0.78rem', color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{name}</span>
      <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>{node.type === 'folder' ? 'Folder' : node.size || '—'}</span>
      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', width: '40px', textAlign: 'right' }}>{node.ext?.toUpperCase() || ''}</span>
    </div>
  )
}

const toolBtn = {
  width: '30px', height: '30px', borderRadius: '6px', display: 'flex', alignItems: 'center',
  justifyContent: 'center', background: 'var(--surface)', border: '1px solid var(--border)',
  cursor: 'pointer', color: 'var(--text-dim)', fontSize: '0.8rem', transition: 'all 0.15s',
}
