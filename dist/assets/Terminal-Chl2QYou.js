import{r as i,j as m}from"./framer-D7XEHKlI.js";import{u as L,A as d}from"./index-CRrE8wF0.js";import"./rnd-DgJ8GjGx.js";const C="divyanshu@divyos:~$",y={help:()=>`
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
`.trim(),about:()=>`
Divyanshu Pandey
━━━━━━━━━━━━━━━━━━━━━━━━
Role    : Web Developer & Student
Location: Kanpur, Uttar Pradesh, India
Status  : Available for work 🟢
GitHub  : github.com/CodeCr4cker
YouTube : youtube.com/@CodeCr4cker
`.trim(),whoami:()=>"divyanshu — passionate developer, open source enthusiast, lifelong learner.",skills:()=>`
Technical Skills:
  Frontend  : React, HTML5, CSS3, JavaScript (ES2024)
  Backend   : Python, Node.js, Firebase
  Database  : Firestore, SQL (MySQL)
  Tools     : Git, Vite, VS Code, Linux
  Learning  : AI/ML, TypeScript, Next.js
`.trim(),projects:()=>`
Projects:
  1. DivyOS Portfolio     — OS-style React portfolio (this!)
  2. Library Management   — Python + SQL desktop app
  3. Hand Tracking Demo   — OpenCV + MediaPipe
  4. Chat Application     — Firebase real-time messaging
  5. E-commerce UI        — React + Tailwind storefront

Type 'open projects' to see full details.
`.trim(),contact:()=>`
Contact Info:
  📧 Email    : divyanshu@example.com
  🐙 GitHub   : github.com/CodeCr4cker
  📺 YouTube  : youtube.com/@CodeCr4cker
  💼 LinkedIn : linkedin.com/in/divyanshu-pandey
`.trim(),date:()=>new Date().toString(),pwd:()=>"/home/divyanshu/portfolio",ls:()=>`
total 11
drwxr-xr-x  about/
drwxr-xr-x  projects/
drwxr-xr-x  skills/
drwxr-xr-x  docs/
drwxr-xr-x  gallery/
-rw-r--r--  README.md
-rw-r--r--  resume.pdf
`.trim(),neofetch:()=>{var s;return`
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
Memory   : ${Math.round(((s=performance==null?void 0:performance.memory)==null?void 0:s.usedJSHeapSize)/1048576)||"~48"} MB
Theme    : neon-dark
`.trim()}};function E(){const{openWindow:s,closeWindow:x,setTheme:S,showNotification:v}=L(),[w,b]=i.useState([{type:"info",text:'DivyOS Terminal v2.0.0 — Type "help" for available commands.'},{type:"info",text:"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"}]),[u,c]=i.useState(""),[l,T]=i.useState([]),[k,h]=i.useState(-1),p=i.useRef(null),g=i.useRef(null);i.useEffect(()=>{p.current&&(p.current.scrollTop=p.current.scrollHeight)},[w]);const n=i.useCallback((e,t="output")=>{b(o=>[...o,{type:t,text:e}])},[]),j=i.useCallback(e=>{e==null||e.preventDefault();const t=u.trim();if(!t)return;n(`${C} ${t}`,"cmd"),T(r=>[t,...r]),h(-1),c("");const[o,...f]=t.split(" "),a=f.join(" ");if(o==="clear"){b([]);return}if(o==="exit"){x("terminal");return}if(o==="history"){n(l.map((r,R)=>`  ${R+1}  ${r}`).join(`
`)||"  (empty)","output");return}if(o==="echo"){n(a||"","output");return}if(o==="open"){const r=a.toLowerCase();d[r]?(s(r,d[r]),n(`Opening ${d[r].title}…`,"info")):n(`open: no app named '${r}'. Try: ${Object.keys(d).join(", ")}`,"error");return}if(o==="theme"){const r=["dark","light","neon","synthwave","matrix"];r.includes(a)?(S(a),n(`Theme set to '${a}'`,"info"),v("Theme",`Switched to ${a} theme`)):n(`theme: unknown '${a}'. Options: ${r.join(", ")}`,"error");return}if(y[o]){n(y[o](),"output");return}n(`divysh: command not found: ${o}. Type 'help' for available commands.`,"error")},[u,l,n,s,x,S,v]),D=e=>{if(e.key==="Enter"){j();return}if(e.key==="ArrowUp"){e.preventDefault();const t=Math.min(k+1,l.length-1);h(t),c(l[t]||"")}if(e.key==="ArrowDown"){e.preventDefault();const t=Math.max(k-1,-1);h(t),c(t===-1?"":l[t])}if(e.key==="Tab"){e.preventDefault();const o=[...Object.keys(y),"clear","exit","echo","history","open","theme"].find(f=>f.startsWith(u));o&&c(o)}},O={cmd:"#e2e8f0",output:"#8bc34a",error:"#ff5555",info:"#00d4ff"};return m.jsxs("div",{ref:p,onClick:()=>{var e;return(e=g.current)==null?void 0:e.focus()},style:{background:"#0a0a0a",padding:"1rem",height:"100%",fontFamily:"var(--font-mono)",fontSize:"0.78rem",lineHeight:1.7,color:"#b0c0b0",overflowY:"auto",cursor:"text"},children:[w.map((e,t)=>m.jsx("pre",{style:{color:O[e.type]||"#b0c0b0",whiteSpace:"pre-wrap",wordBreak:"break-word",margin:0,fontFamily:"inherit",fontSize:"inherit"},children:e.text},t)),m.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"0.3rem",marginTop:"0.25rem",flexWrap:"wrap"},children:[m.jsx("span",{style:{color:"var(--neon)",whiteSpace:"nowrap",flexShrink:0},children:C}),m.jsx("input",{ref:g,value:u,onChange:e=>c(e.target.value),onKeyDown:D,autoFocus:!0,style:{background:"transparent",border:"none",outline:"none",color:"#fff",fontFamily:"var(--font-mono)",fontSize:"0.78rem",flex:1,minWidth:"80px",caretColor:"var(--neon)"}})]})]})}export{E as default};
