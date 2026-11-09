require('dotenv').config();
const express=require('express'),http=require('http'),{Server}=require('socket.io'),crypto=require('crypto'),fs=require('fs'),path=require('path');
const {OAuth2Client}=require('google-auth-library');
const {FIELDS,make,count}=require('./questions');
const CID=process.env.GOOGLE_CLIENT_ID||'',SECRET=process.env.SECRET||'dev-secret',gclient=new OAuth2Client(CID);
const app=express(),srv=http.createServer(app),io=new Server(srv,{cors:{origin:'*'}});
app.use((q,r,n)=>{r.header('Access-Control-Allow-Origin','*');r.header('Access-Control-Allow-Headers','Content-Type');if(q.method==='OPTIONS')return r.sendStatus(204);n()});
app.use(express.json());
const DB=path.join(__dirname,'data.json');let users={};try{users=JSON.parse(fs.readFileSync(DB))}catch{}
const save=()=>fs.writeFile(DB,JSON.stringify(users),()=>{});
const sign=id=>id+'.'+crypto.createHmac('sha256',SECRET).update(id).digest('hex');
const verify=t=>{const [id,s]=String(t||'').split('.');return s&&sign(id)===t?id:null};
const pub=u=>({id:u.id,name:u.name,pic:u.pic,coins:u.coins,xp:u.xp,wins:u.wins,losses:u.losses,gifts:u.gifts,level:Math.floor(u.xp/50)+1});
const GIFTS=[["🎩","Sehrgar shlyapasi",50],["👑","Tojsimon toj",200],["🚀","Raketa",500],["🏆","Chempion kubogi",1000],["💎","Olmos",2000]];
const SUBJ={};FIELDS.forEach((f,i)=>f[3].forEach((s,j)=>SUBJ[i+'-'+j]=s));
const mk=(id,name,pic)=>users[id]||(users[id]={id,name,pic,coins:50,xp:0,wins:0,losses:0,gifts:[]});

app.get('/api/data',(q,r)=>r.json({clientId:CID,gifts:GIFTS,fields:FIELDS.map((f,i)=>[f[0],f[1],f[2],f[3].map((s,j)=>[i+'-'+j,s[0],s[1],count(s[2])])])}));
app.get('/api/top',(q,r)=>r.json(Object.values(users).sort((a,b)=>b.xp-a.xp).slice(0,10).map(pub)));
app.post('/api/login',async(q,r)=>{
  try{
    let u;
    if(q.body.credential&&CID){
      const t=(await gclient.verifyIdToken({idToken:q.body.credential,audience:CID})).getPayload();
      u=mk('g'+t.sub,t.name,t.picture);
    }else if(!CID&&q.body.demo){
      const id='d'+crypto.randomBytes(6).toString('hex');
      u=mk(id,String(q.body.demo).slice(0,20),'');
    }else return r.status(400).json({});
    save();
    r.json({token:sign(u.id)});
  }catch(e){r.status(401).json({})}
});

const queue={},shuffle=a=>a.map(x=>[Math.random(),x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);

function start(sub,socks){
  const qs=make(SUBJ[sub][2]),m={qs,t0:Date.now(),over:false,p:[]};
  socks.forEach(s=>{
    const u=s?users[s.uid]:null;
    m.p.push({s,uid:s?s.uid:'bot',name:u?u.name:'Robot '+(100+Math.floor(Math.random()*900)),pic:u?u.pic:'',level:u?pub(u).level:1+Math.floor(Math.random()*5),score:0,i:0,done:false});
  });
  m.p.forEach(p=>{if(p.s)p.s.match=m;});
  m.p.forEach((p,k)=>{
    if(!p.s)return;
    const o=m.p[1-k];
    p.s.emit('start',{opp:{name:o.name,pic:o.pic,level:o.level},limit:120});
    sendQ(m,p);
  });
  m.p.forEach(p=>{if(!p.s)botNext(m,p)});
  m.timer=setTimeout(()=>finish(m),121000);
}

function sendQ(m,p){const q=m.qs[p.i];p.s.emit('q',{i:p.i,t:q[0],o:q[1],n:m.qs.length});}

function answer(m,p,a){
  const q=m.qs[p.i],ok=a===q[2];
  if(ok)p.score+=100+Math.floor(Math.max(0,120-(Date.now()-m.t0)/1000)/120*50);
  const o=m.p.find(x=>x!==p);
  if(p.s)p.s.emit('res',{ok,right:q[2],score:p.score,last:p.i>=m.qs.length-1});
  if(o.s)o.s.emit('opp',{score:p.score,i:p.i+1});
  p.i++;
  if(p.i>=m.qs.length)p.done=true;
  if(m.p.every(x=>x.done))return setTimeout(()=>finish(m),900);
  if(p.s&&!p.done)setTimeout(()=>{if(!m.over)sendQ(m,p)},900);
  if(!p.s&&!p.done)botNext(m,p);
}

function botNext(m,p){
  setTimeout(()=>{
    if(m.over||p.done)return;
    const q=m.qs[p.i];
    answer(m,p,Math.random()<.65?q[2]:(q[2]+1)%4);
  },4000+Math.random()*7000);
}

function finish(m,leaver){
  if(m.over)return;
  m.over=true;clearTimeout(m.timer);
  m.p.forEach((p,k)=>{
    if(!p.s)return;
    const o=m.p[1-k];
    let r=p.score>o.score?'win':p.score<o.score?'lose':'draw';
    if(leaver){r=p.uid===leaver?'lose':'win'}
    const u=users[p.uid],c={win:12,lose:1,draw:4}[r],x={win:30,lose:12,draw:20}[r]+Math.floor(p.score/40);
    u.coins+=c;u.xp+=x;
    if(r=='win')u.wins++;
    if(r=='lose')u.losses++;
    p.s.match=null;
    p.s.emit('end',{r,you:p.score,opp:o.score,c,x,me:pub(u)});
  });
  save();
}

const cancel=s=>{for(const k in queue)if(queue[k]===s)queue[k]=null;clearTimeout(s.bt)};

io.use((s,n)=>{
  const id=verify(s.handshake.auth.token);
  if(!id||!users[id])return n(new Error('auth'));
  s.uid=id;n();
});

io.on('connection',s=>{
  s.emit('me',pub(users[s.uid]));
  s.on('find',sub=>{
    if(!SUBJ[sub]||s.match)return;
    cancel(s);
    const w=queue[sub];
    if(w&&w.uid!==s.uid&&w.connected){
      queue[sub]=null;clearTimeout(w.bt);
      start(sub,[w,s]);
    }else{
      queue[sub]=s;
      s.bt=setTimeout(()=>{if(queue[sub]===s){queue[sub]=null;start(sub,[s,null])}},8000);
      s.emit('wait');
    }
  });
  s.on('cancel',()=>cancel(s));
  s.on('prof',d=>{
    const u=users[s.uid];if(!d)return;
    if(typeof d.name==='string'&&d.name.trim())u.name=d.name.trim().slice(0,20);
    if(typeof d.pic==='string'&&(d.pic===''||(d.pic.length<150000&&/^data:image\/(png|jpeg|webp|svg\+xml)[;,]/.test(d.pic))))u.pic=d.pic;
    save();s.emit('me',pub(u));
  });
  s.on('ans',a=>{
    const m=s.match;
    if(!m||m.over)return;
    const p=m.p.find(x=>x.s===s);
    if(p&&!p.done&&a&&a.i===p.i)answer(m,p,a.a);
  });
  s.on('buy',k=>{
    const g=GIFTS[k],u=users[s.uid];
    if(g&&u.coins>=g[2]&&!u.gifts.includes(g[0])){u.coins-=g[2];u.gifts.push(g[0]);save();s.emit('me',pub(u))}
  });
  s.on('disconnect',()=>{cancel(s);if(s.match)finish(s.match,s.uid)});
});

const dist=path.join(__dirname,'..','frontend','dist');
if(fs.existsSync(dist)){app.use(express.static(dist));app.get('*',(q,r)=>r.sendFile(path.join(dist,'index.html')));}
srv.listen(process.env.PORT||3000,()=>console.log('SkillDuel API: http://localhost:'+(process.env.PORT||3000)));
