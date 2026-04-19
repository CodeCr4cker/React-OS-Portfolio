import React, { Suspense, useState } from 'react'
import { Rnd } from 'react-rnd'
import { motion } from 'framer-motion'
import { useOS } from '../context/OSContext.jsx'
import { useSound } from '../hooks/useSound.js'
import { APP_REGISTRY } from '../utils/appRegistry.js'

function Spinner() {
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'var(--neon)',fontFamily:'var(--font-mono)',fontSize:'0.8rem',gap:'0.75rem'}}>
      <i className="fas fa-circle-notch" style={{animation:'spin 1s linear infinite'}}/>Loading…
    </div>
  )
}

export default function Window({ appId }) {
  const {windows,activeWindow,closeWindow,minimizeWindow,maximizeWindow,focusWindow,updateWindow,getWindowZIndex}=useOS()
  const {play}=useSound()
  const win=windows[appId]
  if(!win||win.minimized) return null
  const cfg=APP_REGISTRY[appId]
  if(!cfg) return null
  const AppComponent=cfg.component
  const zIndex=getWindowZIndex(appId)
  const isFocused=activeWindow===appId
  const onFocus=()=>{if(!isFocused)focusWindow(appId)}

  if(win.maximized) {
    return (
      <div onMouseDown={onFocus} style={{position:'absolute',inset:0,zIndex:zIndex+10,display:'flex',flexDirection:'column',background:'var(--win-bg)',backdropFilter:'blur(24px)'}}>
        <TitleBar appId={appId} win={win} cfg={cfg} isFocused={true}/>
        <div style={{flex:1,overflow:'auto'}}><Suspense fallback={<Spinner/>}><AppComponent/></Suspense></div>
      </div>
    )
  }

  return (
    <Rnd position={{x:win.x,y:win.y}} size={{width:win.width,height:win.height}}
      minWidth={320} minHeight={200} bounds="parent"
      dragHandleClassName="win-drag-handle"
      onDragStop={(_,d)=>updateWindow(appId,{x:d.x,y:d.y})}
      onResizeStop={(_,__,ref,___,pos)=>updateWindow(appId,{width:parseInt(ref.style.width),height:parseInt(ref.style.height),x:pos.x,y:pos.y})}
      onMouseDown={onFocus}
      style={{zIndex,position:'absolute'}}
      enableResizing={{bottom:true,bottomRight:true,right:true,top:false,left:false,topLeft:false,topRight:false,bottomLeft:false}}>
      <motion.div key={appId}
        initial={{opacity:0,scale:0.92,y:10}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.88}}
        transition={{type:'spring',damping:22,stiffness:320}}
        style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',
          background:'var(--win-bg)',backdropFilter:'blur(24px)',overflow:'hidden',
          border:`1px solid ${isFocused?'rgba(0,212,255,0.3)':'rgba(0,212,255,0.1)'}`,
          borderRadius:'var(--radius)',
          boxShadow:isFocused?'0 20px 60px rgba(0,0,0,0.9),0 0 20px rgba(0,212,255,0.1)':'0 16px 48px rgba(0,0,0,0.7)',
          transition:'border-color 0.2s,box-shadow 0.2s'}}>
        <TitleBar appId={appId} win={win} cfg={cfg} isFocused={isFocused}/>
        <div style={{flex:1,overflow:'auto',position:'relative'}}>
          <Suspense fallback={<Spinner/>}><AppComponent/></Suspense>
        </div>
        <div style={{position:'absolute',bottom:0,right:0,width:16,height:16,zIndex:10}}>
          <div style={{position:'absolute',bottom:3,right:3,width:8,height:8,borderBottom:'2px solid var(--neon2)',borderRight:'2px solid var(--neon2)',opacity:0.5}}/>
        </div>
      </motion.div>
    </Rnd>
  )
}

function WinBtn({color,icon,onClick,title}) {
  const [h,setH]=useState(false)
  return (
    <button title={title} onClick={e=>{e.stopPropagation();onClick()}}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{width:13,height:13,borderRadius:'50%',background:color,border:'none',cursor:'pointer',
        position:'relative',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
        transform:h?'scale(1.15)':'scale(1)',filter:h?'brightness(1.25)':'none',transition:'transform 0.12s,filter 0.12s'}}>
      {h&&<i className={`fas ${icon}`} style={{fontSize:'0.38rem',color:'rgba(0,0,0,0.65)'}}/>}
    </button>
  )
}

function TitleBar({appId,win,cfg,isFocused}) {
  const {closeWindow,minimizeWindow,maximizeWindow}=useOS()
  const {play}=useSound()
  return (
    <div className="win-drag-handle" style={{
      height:36,minHeight:36,background:'rgba(5,8,16,0.95)',
      borderBottom:'1px solid rgba(0,212,255,0.1)',
      display:'flex',alignItems:'center',padding:'0 0.75rem',gap:'0.5rem',
      cursor:'grab',flexShrink:0,userSelect:'none'}}>
      <div style={{display:'flex',gap:6,marginRight:'0.5rem'}}>
        <WinBtn color="#ff5f56" icon="fa-times"  title="Close"    onClick={()=>{play('windowClose');closeWindow(appId)}}/>
        <WinBtn color="#ffbd2e" icon="fa-minus"  title="Minimize" onClick={()=>{play('click');minimizeWindow(appId)}}/>
        <WinBtn color="#27c93f" icon="fa-expand" title="Maximize" onClick={()=>{play('click');maximizeWindow(appId)}}/>
      </div>
      <div style={{fontFamily:'var(--font-mono)',fontSize:'0.72rem',color:isFocused?'var(--text)':'var(--text-dim)',
        flex:1,textAlign:'center',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
        <i className={cfg?.icon} style={{marginRight:'0.4rem',color:'var(--neon)'}}/>{win.title}
      </div>
    </div>
  )
}
