import {useEffect,useRef,useState} from 'react';
import {io} from 'socket.io-client';
const API=import.meta.env.VITE_API??(import.meta.env.PROD?'':`${location.protocol}//${location.hostname}:3000`);
const api=async(u,b)=>{const c=new AbortController(),t=setTimeout(()=>c.abort(),8000);
  try{return await (await fetch(API+u,{signal:c.signal,...(b?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}:{})})).json()}finally{clearTimeout(t)}};
const EM=['🦁','🦊','🐼','🐯','🦄','🐲','🚀','👾','🤖','🧠','🎓','⚡'];
const preset=(e,i)=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="hsl(${i*30},70%,40%)"/><circle cx="50" cy="50" r="46" fill="hsl(${i*30+50},75%,55%)"/><text x="50" y="68" font-size="52" text-anchor="middle">${e}</text></svg>`);
const rank=l=>l<5?'Yangi':l<10?'Bilimdon':l<20?'Mohir':l<35?'Ustoz':'Grandmaster';
const grad=c=>`linear-gradient(135deg,${c[0]},${c[1]})`;
const Avatar=({u,s=46})=>u.pic?<img className="av" style={{width:s,height:s}} src={u.pic} referrerPolicy="no-referrer"/>
  :<div className="av" style={{width:s,height:s,fontSize:s/2.3}}>{(u.name||'?')[0]}</div>;

const Bg=()=>(<svg className="bg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"><defs>
  <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1b1040"/><stop offset="1" stopColor="#06121f"/></linearGradient>
  <filter id="bl"><feGaussianBlur stdDeviation="60"/></filter>
  <pattern id="gr" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#fff" strokeOpacity=".05"/></pattern></defs>
  <rect width="1200" height="800" fill="url(#g1)"/><rect width="1200" height="800" fill="url(#gr)"/>
  <g filter="url(#bl)"><circle className="f1" cx="180" cy="140" r="190" fill="#7c3aed" opacity=".55"/><circle className="f2" cx="1040" cy="170" r="210" fill="#06b6d4" opacity=".4"/><circle className="f3" cx="760" cy="720" r="240" fill="#ec4899" opacity=".3"/></g>
  {Array.from({length:45},(_,i)=><circle key={i} className="st" style={{animationDelay:(i%7)*.5+'s'}} cx={(i*173)%1200} cy={(i*97)%800} r={1+(i%3)*.6} fill="#fff" opacity=".6"/>)}
  <g stroke="#fff" fill="none" opacity=".14" strokeWidth="2"><polygon className="rt" points="100,600 130,585 160,600 160,630 130,645 100,630"/><polygon className="rt" points="1010,330 1050,310 1090,330 1090,370 1050,390 1010,370"/>
  <circle className="rt" cx="980" cy="600" r="70" strokeDasharray="8 10" stroke="#06b6d4"/><circle className="rt" cx="260" cy="400" r="46" strokeDasharray="4 8" stroke="#ec4899"/></g>
  <path d="M0 690 C200 630 380 750 600 690 S1000 630 1200 700 V800H0Z" fill="#fff" opacity=".04"/><path d="M0 740 C250 690 450 790 700 740 S1050 700 1200 750 V800H0Z" fill="#7c3aed" opacity=".12"/></svg>);

const Hero=()=>(<svg className="hero" viewBox="0 0 360 200" width="340" style={{maxWidth:'100%'}}><defs>
  <linearGradient id="hg" x1="0" x2="1"><stop offset="0" stopColor="#7c3aed"/><stop offset="1" stopColor="#06b6d4"/></linearGradient></defs>
  <circle cx="80" cy="100" r="56" fill="url(#hg)"/><circle cx="280" cy="100" r="56" fill="url(#hg)" opacity=".85"/>
  <circle className="rt" cx="80" cy="100" r="70" fill="none" stroke="#7c3aed" strokeOpacity=".6" strokeDasharray="6 8"/><circle className="rt" cx="280" cy="100" r="70" fill="none" stroke="#06b6d4" strokeOpacity=".6" strokeDasharray="6 8"/>
  <text x="80" y="118" fontSize="54" textAnchor="middle">🧠</text><text x="280" y="118" fontSize="54" textAnchor="middle">🎓</text>
  <polygon points="190,28 164,108 188,108 176,174 216,86 192,86" fill="#fbbf24"/></svg>);

function Login({D,onTok}){
  const [n,setN]=useState(''),ref=useRef();
  useEffect(()=>{
    if(!D.clientId)return;
    const t=setInterval(()=>{if(window.google){clearInterval(t);
      window.google.accounts.id.initialize({client_id:D.clientId,callback:async r=>{const x=await api('/api/login',{credential:r.credential});x.token&&onTok(x.token)}});
      window.google.accounts.id.renderButton(ref.current,{theme:'filled_blue',size:'large',shape:'pill',text:'continue_with'})}},200);
    return()=>clearInterval(t);
  },[D]);
  const demo=async()=>{const x=await api('/api/login',{demo:n.trim()||'Mehmon'});x.token&&onTok(x.token)};
  const tot=D.fields.reduce((a,f)=>a+f[3].length,0);
  return(<div className="c" style={{marginTop:'6vh'}}><Hero/>
    <h1 style={{fontSize:56}}>Bellashuv</h1>
    <p style={{color:'var(--mu)',margin:'10px 0 14px'}}>Bilimlar jangi: haqiqiy odamlar bilan bellash, koin yig', daraja ko'tar!</p>
    <div><span className="tag">🎯 {tot} ta fan</span><span className="tag">🗂️ {D.fields.length} ta soha</span><span className="tag">🎁 virtual sovg'alar</span><span className="tag">🏆 reyting</span></div><br/>
    <div ref={ref} style={{display:'inline-block'}}/>
    {!D.clientId&&<div className="card" style={{maxWidth:340,margin:'20px auto'}}>
      <p style={{marginBottom:8}}>Test uchun kirish</p>
      <input value={n} onChange={e=>setN(e.target.value)} placeholder="Ismingiz" style={{width:'100%',padding:10,borderRadius:10,marginBottom:8}}/>
      <button className="btn" onClick={demo}>Mehmon sifatida kirish</button>
      <p style={{color:'var(--mu)',fontSize:12,marginTop:10}}>Google orqali kirish uchun backend/.env fayliga GOOGLE_CLIENT_ID yozing (README'ga qarang).</p></div>}
  </div>);
}

function Profile({me,onClose,send}){
  const [name,setName]=useState(me.name),[pic,setPic]=useState(me.pic||'');
  const file=e=>{const f=e.target.files[0];if(!f)return;const img=new Image(),r=new FileReader();
    r.onload=()=>{img.onload=()=>{const c=document.createElement('canvas'),S=160,m=Math.min(img.width,img.height);c.width=c.height=S;
      c.getContext('2d').drawImage(img,(img.width-m)/2,(img.height-m)/2,m,m,0,0,S,S);setPic(c.toDataURL('image/jpeg',.82))};img.src=r.result};r.readAsDataURL(f)};
  return(<div className="modal" onClick={onClose}><div className="card c" onClick={e=>e.stopPropagation()}>
    <h2>Profil</h2><br/><Avatar u={{name,pic}} s={96}/><br/><br/>
    <label className="btn" style={{display:'inline-block'}}>📷 Rasm yuklash<input type="file" accept="image/*" onChange={file} hidden/></label>
    <p style={{color:'var(--mu)',margin:'14px 0 0'}}>yoki tayyor rasmni tanlang</p>
    <div className="pg">{EM.map((e,i)=>{const p=preset(e,i);return <img key={i} src={p} className={pic===p?'on':''} onClick={()=>setPic(p)}/>})}</div>
    <input value={name} maxLength={20} onChange={e=>setName(e.target.value)} placeholder="Ism" style={{width:'100%',padding:10,borderRadius:10,marginBottom:12}}/>
    <div style={{display:'flex',gap:8,justifyContent:'center'}}><button className="btn" onClick={()=>{send('prof',{name,pic});onClose()}}>Saqlash</button><button className="btn s" onClick={onClose}>Bekor qilish</button></div>
  </div></div>);
}

export default function App(){
  const [D,setD]=useState(null),[err,setErr]=useState(false),[tok,setTok]=useState(localStorage.t||''),[me,setMe]=useState(null);
  const [view,setView]=useState('home'),[B,setB]=useState(null),[end,setEnd]=useState(null),[top,setTop]=useState([]),[tm,setTm]=useState(0),[prof,setProf]=useState(false);
  const sock=useRef(null);
  useEffect(()=>{api('/api/data').then(setD).catch(()=>setErr(true))},[]);
  useEffect(()=>{
    if(!tok)return;
    const s=io(API||undefined,{auth:{token:tok}});sock.current=s;
    s.on('connect_error',()=>{localStorage.removeItem('t');setTok('');setMe(null)});
    s.on('me',setMe);
    s.on('wait',()=>setView('wait'));
    s.on('start',d=>{setB({opp:d.opp,q:null,score:0,os:0,oi:0,sel:null,right:null,last:false});setTm(d.limit);setView('battle')});
    s.on('q',q=>setB(b=>b&&{...b,q,sel:null,right:null,last:false}));
    s.on('res',r=>setB(b=>b&&{...b,score:r.score,right:r.right,last:r.last}));
    s.on('opp',o=>setB(b=>b&&{...b,os:o.score,oi:o.i}));
    s.on('end',e=>{setEnd(e);setMe(e.me);setView('end')});
    return()=>s.close();
  },[tok]);
  useEffect(()=>{
    if(view!=='battle')return;
    const t=setInterval(()=>setTm(x=>Math.max(x-1,0)),1000);
    return()=>clearInterval(t);
  },[view]);

  const login=t=>{localStorage.t=t;setTok(t)};
  const goTop=async()=>{setTop(await api('/api/top'));setView('top')};
  const send=(e,d)=>sock.current.emit(e,d);
  const pick=a=>{if(!B||!B.q||B.sel!==null)return;setB({...B,sel:a});send('ans',{i:B.q.i,a})};

  if(err)return <><Bg/><div className="w c card" style={{marginTop:'15vh'}}><h2>Serverga ulanib bo'lmadi</h2><p style={{color:'var(--mu)',margin:'8px 0 14px'}}>Backend ishlayotganini tekshiring: {API||location.origin}/api/data</p><button className="btn" onClick={()=>location.reload()}>Qayta urinish</button></div></>;
  if(!D)return <><Bg/><div className="w c" style={{marginTop:'20vh'}}>Yuklanmoqda...</div></>;
  if(!tok||!me)return <><Bg/><div className="w"><Login D={D} onTok={login}/></div></>;

  const Head=()=>(<div className="top card"><div onClick={()=>setProf(true)} style={{cursor:'pointer'}} title="Profilni tahrirlash"><Avatar u={me}/></div>
    <div className="grow"><b>{me.name}</b> · Lv {me.level}<span className="rank">{rank(me.level)}</span>
      <div className="bar"><i style={{width:(me.xp%50)*2+'%'}}/></div><small style={{color:'var(--mu)'}}>{me.xp%50}/50 XP</small></div>
    <div>🪙 <b>{me.coins}</b></div><div>🏅 {me.wins}G / {me.losses}M</div></div>);
  const Nav=()=>(<div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
    <button className="btn s" onClick={()=>setView('home')}>🎮 O'yin</button>
    <button className="btn s" onClick={()=>setView('shop')}>🎁 Do'kon</button>
    <button className="btn s" onClick={goTop}>🏆 Reyting</button>
    <button className="btn s" onClick={()=>setProf(true)}>✏️ Profil</button>
    <button className="btn s" onClick={()=>{localStorage.removeItem('t');setTok('');setMe(null)}}>Chiqish</button></div>);

  let body;
  if(view==='wait')body=(<div className="c card" style={{marginTop:'15vh'}}><div style={{fontSize:50}}>🔍</div><h2>Raqib qidirilmoqda...</h2>
    <p style={{color:'var(--mu)',margin:'8px 0 16px'}}>Topilmasa, robot bilan o'ynaysiz</p>
    <button className="btn s" onClick={()=>{send('cancel');setView('home')}}>Bekor qilish</button></div>);
  else if(view==='battle'&&B)body=(<>
    <div className="vs card">
      <div><Avatar u={me} s={40}/><br/><b>{me.name}</b><div className="big">{B.score}</div></div>
      <div className="c" style={{flex:'none'}}><div className="big">{tm}</div><small>soniya</small></div>
      <div style={{textAlign:'right'}}><Avatar u={B.opp} s={40}/><br/><b>{B.opp.name}</b> (Lv {B.opp.level})<div className="big">{B.os}</div><small>{B.oi}/5</small></div>
    </div>
    <div className="card">{B.q&&<>
      <div className="dots">{[0,1,2,3,4].map(i=><i key={i} className={i<=B.q.i?'on':''}/>)}</div>
      <small style={{color:'var(--mu)'}}>Savol {B.q.i+1}/{B.q.n}</small>
      <h2 style={{margin:'8px 0'}}>{B.q.t}</h2>
      {B.q.o.map((o,k)=><button key={k} disabled={B.sel!==null}
        className={'opt'+(B.right===k?' ok':B.right!==null&&B.sel===k?' bad':'')} onClick={()=>pick(k)}>{o}</button>)}
      {B.last&&B.right!==null&&<p className="c" style={{color:'var(--mu)',marginTop:12}}>Raqib tugatishini kutyapmiz...</p>}
    </>}</div></>);
  else if(view==='end'&&end){const m={win:['🏆',"G'alaba!"],lose:['😔',"Mag'lubiyat"],draw:['🤝','Durang']}[end.r];
    body=(<div className="c card" style={{marginTop:'10vh'}}><div style={{fontSize:70}}>{m[0]}</div><h1>{m[1]}</h1>
      <p style={{margin:12}}>{end.you} : {end.opp}</p><p>🪙 +{end.c} koin · ⭐ +{end.x} XP</p><br/>
      <button className="btn" onClick={()=>setView('home')}>Davom etish</button></div>);}
  else if(view==='shop')body=(<><Head/><Nav/><h2>Virtual sovg'alar</h2><div className="grid">
    {D.gifts.map((g,k)=><div className="card c" key={k}><div className="gift">{g[0]}</div><p>{g[1]}</p>
      {me.gifts.includes(g[0])?<p style={{color:'var(--ok)'}}>✔ Sizda bor</p>
        :<button className="btn" disabled={me.coins<g[2]} style={me.coins<g[2]?{opacity:.4}:{}} onClick={()=>send('buy',k)}>🪙 {g[2]}</button>}</div>)}</div></>);
  else if(view==='top')body=(<><Head/><Nav/><div className="card"><h2>Top 10</h2>
    {top.map((u,i)=><div className="row" key={u.id}><span style={{display:'flex',alignItems:'center',gap:8}}>{i+1}. <Avatar u={u} s={30}/>{u.name} {u.gifts.join('')}</span><span>Lv {u.level} · {u.xp} XP</span></div>)}</div></>);
  else body=(<><Head/><Nav/>{D.fields.map(f=><div key={f[0]}><h3 className="fh"><span className="fi" style={{background:grad(f[2])}}>{f[1]}</span>{f[0]}</h3><div className="grid">
    {f[3].map(s=><div className="card sub" key={s[0]} onClick={()=>send('find',s[0])}><div className="ic" style={{background:grad(f[2])}}>{s[2]}</div><span>{s[1]}</span><small>{s[3]==='∞'?'Cheksiz savol':s[3]+' ta savol'}</small></div>)}</div></div>)}</>);
  return <><Bg/><div className="w">{body}</div>{prof&&<Profile me={me} onClose={()=>setProf(false)} send={send}/>}</>;
}
