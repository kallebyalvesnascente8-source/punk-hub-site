/* =====================================================================
   30 MOTOR DE APARÊNCIA: variáveis CSS, papel de parede, personagem, efeitos
   apply() é barato: só reconstrói camadas pesadas quando elas mudam.
   ===================================================================== */
const fam=n=>{n=String(n||'');if(FF[n])return FF[n];const c=cleanFont(n);return`"${c}",${/mono|code|hack|courier/i.test(c)?'ui-monospace,monospace':'system-ui,sans-serif'}`};
const ANKF={fade:'kfade',slide:'kslide',scale:'kscale',none:'none'};

function applyVars(){
 const t=S.t,l=S.l,b=S.bar,r=document.documentElement.style,on=l.anim&&t.as>0&&t.an!=='none';
 Object.entries({'--ac':t.ac,'--ac2':t.ac2,'--bg':t.bg,'--tx':t.tx,'--act':lum(t.ac)>.55?'#000':'#fff','--ff':fam(t.ff),'--fm':fam(t.fm),'--fs':t.fs+'px','--r':t.r+'px','--bl':t.bl+'px','--pn':mix(t.bg,t.tx,.07,t.al/100),
  '--gap':l.gap+'px','--u':l.sc/100,'--bw':t.bw+'px','--bo':t.bo+'%','--gl':t.gl+'px','--sd':t.sh?`0 10px ${t.sh}px rgba(0,0,0,.45)`:'0 0 0 transparent','--as':t.as||1,'--ak':on?ANKF[t.an]:'none','--bm':b.float?'10px':'0px','--wo':l.wo/100,'--mz':l.mzone}).forEach(([k,v])=>r.setProperty(k,v));
 const d=document.body;d.dataset.bar=l.bar;d.dataset.anim=on?1:0;d.dataset.bf=b.float?1:0;d.dataset.ml=l.mlay;d.dataset.al=b.align;d.dataset.lb=b.labels;d.classList.toggle('lock',!!l.lock)}

function applyLayers(){
 const t=S.t,u=IMG.url(t.wimg),wp=$('#wp'),c='color-mix(in srgb,var(--tx) 6%,transparent)',bl=t.wall==='img'&&u?t.wbl:0;
 const bg={aurora:'radial-gradient(circle at 15% 20%,color-mix(in srgb,var(--ac) 30%,transparent),transparent 45%),radial-gradient(circle at 85% 80%,color-mix(in srgb,var(--ac2) 26%,transparent),transparent 50%),var(--bg)',
  grid:`linear-gradient(${c} 1px,transparent 1px) 0 0/32px 32px,linear-gradient(90deg,${c} 1px,transparent 1px) 0 0/32px 32px,radial-gradient(circle at 50% 0,color-mix(in srgb,var(--ac) 18%,transparent),transparent 60%),var(--bg)`,
  plain:'var(--bg)',
  mesh:'radial-gradient(at 20% 15%,color-mix(in srgb,var(--ac) 38%,transparent) 0,transparent 50%),radial-gradient(at 85% 25%,color-mix(in srgb,var(--ac2) 32%,transparent) 0,transparent 50%),radial-gradient(at 60% 92%,color-mix(in srgb,var(--ac) 22%,transparent) 0,transparent 55%),var(--bg)',
  sunset:'linear-gradient(180deg,var(--bg) 0%,color-mix(in srgb,var(--ac) 32%,var(--bg)) 65%,color-mix(in srgb,var(--ac2) 52%,var(--bg)) 100%)',
  img:u?({cover:`${t.wx}% ${t.wy}%/cover no-repeat url(${u})`,contain:`${t.wx}% ${t.wy}%/contain no-repeat url(${u})`,center:`${t.wx}% ${t.wy}% no-repeat url(${u})`,tile:`${t.wx}% ${t.wy}%/auto repeat url(${u})`})[t.wfit]:'var(--bg)'}[t.wall],isI=t.wall==='img'&&u;
 wp.style.cssText=`background:${bg};inset:${-bl*2}px;filter:${bl?`blur(${bl}px)`:'none'};--wd:${t.wdim/100};opacity:${isI?t.wop/100:1};transform:${isI&&t.wz>100?`scale(${t.wz/100})`:'none'};transform-origin:${t.wx}% ${t.wy}%`;
 $('#ovl').style.background=[t.vig?`radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,${t.vig/100}) 100%)`:'',t.scan?`repeating-linear-gradient(0deg,rgba(0,0,0,${t.scan/100}) 0 1px,transparent 1px 3px)`:''].filter(Boolean).join(',')||'none';
 applyChar()}
function applyChar(){
 const ch=S.t.ch,cu=IMG.url(ch.img),e=$('#chr');
 if(!cu){e.hidden=1;e.removeAttribute('src')}
 else{e.hidden=0;if(e.getAttribute('src')!==cu)e.src=cu;
  const sz=innerWidth<=700?ch.msz:ch.sz,pos=ch.side==='left'?`left:${ch.x}%;right:auto`:ch.side==='right'?`right:${ch.x}%;left:auto`:'left:50%;right:auto',
   tr=[ch.side==='center'?'translateX(-50%)':'',ch.y?`translateY(${-ch.y}%)`:'',ch.flip?'scaleX(-1)':''].filter(Boolean).join(' ');
  /* vh primeiro e dvh depois: navegadores sem dvh ignoram a segunda; no celular dvh acompanha a barra do navegador */
  e.style.cssText=`${pos};height:${sz}vh;height:${sz}dvh;opacity:${ch.op/100};transform:${tr||'none'};filter:${ch.gl?`drop-shadow(0 0 ${ch.gl}px var(--ac))`:'none'}`}}
let _rc,_rcm=innerWidth<=700;addEventListener('resize',()=>{clearTimeout(_rc);_rc=setTimeout(()=>{if(S)applyChar();const m=innerWidth<=700;if(m!==_rcm){_rcm=m;if(typeof widgets==='function')widgets()}},120)});

/* ---- Efeitos animados de fundo (canvas) ----
   - O movimento usa o tempo real entre quadros (dt) e a velocidade do tema (fxs), então não depende do fps.
   - O limitador de fps tem tolerância: o antigo "pular se < 33 ms" descartava quadros por jitter de 0,5 ms
     (a 60 Hz sobravam 53 de 120 quadros, em ritmo irregular).
   - Pausa por completo (sem agendar quadros) com a aba oculta ou, no celular, com uma janela cobrindo a tela.
   - Quantidade mudou: acrescenta/remove partículas sem reposicionar as que já existem. */
const RAINCH='ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ0123456789';
const FX={k:'',n:0,raf:0,ps:[],cols:[],last:0,w:0,h:0,low:0};
const FXMQ=matchMedia('(prefers-reduced-motion:reduce)');
const fxCount=(k,n)=>({stars:n*3,snow:n*2.5,petals:n*.8}[k]|0);
const fxNew=(w,h,top)=>{const R=Math.random;return{x:R()*w,y:top?-10-R()*40:R()*h,r:R()*2+.6,ph:R()*6.28,sp:R()*2+.5,vy:25+R()*45,vx:(R()-.5)*30,s:4+R()*5,rot:R()*6.28,vr:(R()-.5)*2}};
function fxFps(){const f=+S.l.fxfps;return FX.low||(innerWidth<=700&&!$('#win').hidden)?20:(f===60||f===20?f:30)}
function fxMotionOk(){return!FXMQ.matches||!!S.l.fxfo}
function fxCovered(){return document.hidden||(innerWidth<=700&&!$('#win').hidden&&S.t.al>=90)}
function fxSize(){const c=$('#fx'),w=innerWidth,h=innerHeight;if(c.width!==w||c.height!==h){c.width=w;c.height=h}FX.w=w;FX.h=h}
function fxAdjust(){
 const R=Math.random,n=S.t.fxn;
 if(FX.k==='rain'){const need=Math.ceil(FX.w/16);while(FX.cols.length<need)FX.cols.push({y:R()*FX.h,v:60+R()*140,on:0});FX.cols.length=need;FX.cols.forEach(o=>{o.on=R()*100<n});FX.ps=[];return}
 const cnt=fxCount(FX.k,n);while(FX.ps.length<cnt)FX.ps.push(fxNew(FX.w,FX.h));FX.ps.length=cnt;FX.cols=[]}
function fxStep(ts){
 FX.raf=0;if(!FX.k)return;
 if(fxCovered())return;                                  /* dorme; fxWake() reativa */
 FX.raf=requestAnimationFrame(fxStep);
 const iv=1000/fxFps(),dtr=FX.last?ts-FX.last:iv;
 if(FX.last&&dtr<iv-3)return;                            /* tolerância de 3 ms contra jitter */
 FX.last=ts;const dt=Math.min(.1,dtr/1000)*(S.t.fxs/100),c=$('#fx'),x=c.getContext('2d'),w=FX.w,h=FX.h,t=S.t;
 if(FX.k==='rain'){
  x.globalCompositeOperation='destination-out';x.fillStyle=`rgba(0,0,0,${Math.min(.5,.14*dtr/33)})`;x.fillRect(0,0,w,h);x.globalCompositeOperation='source-over';x.font='15px monospace';x.fillStyle=t.ac;
  FX.cols.forEach((o,i)=>{if(!o.on)return;o.y+=o.v*dt;if(o.y>h+40){o.y=-20;o.v=60+Math.random()*140}x.fillText(RAINCH[(Math.random()*RAINCH.length)|0],i*16,o.y)});return}
 x.clearRect(0,0,w,h);
 FX.ps.forEach(p=>{
  if(FX.k==='stars'){p.ph+=p.sp*dt;x.globalAlpha=.25+.75*Math.abs(Math.sin(p.ph));x.fillStyle=t.tx;x.fillRect(p.x,p.y,p.r,p.r)}
  else if(FX.k==='snow'){p.y+=p.vy*dt*1.6;p.x+=Math.sin(p.ph+=dt)*12*dt+p.vx*dt*.3;if(p.y>h+5){p.y=-5;p.x=Math.random()*w}if(p.x>w+5)p.x=-5;if(p.x<-5)p.x=w+5;x.globalAlpha=.8;x.fillStyle=t.ac2;x.beginPath();x.arc(p.x,p.y,p.r,0,6.283);x.fill()}
  else{p.y+=p.vy*dt*1.4;p.x+=p.vx*dt+Math.sin(p.ph+=dt)*14*dt;p.rot+=p.vr*dt;if(p.y>h+10){p.y=-10;p.x=Math.random()*w}if(p.x>w+10)p.x=-10;if(p.x<-10)p.x=w+10;
   x.save();x.translate(p.x,p.y);x.rotate(p.rot);x.globalAlpha=.75;x.fillStyle=t.ac;x.beginPath();x.ellipse(0,0,p.s,p.s*.55,0,0,6.283);x.fill();x.restore()}});
 x.globalAlpha=1}
function fxWake(){if(FX.k&&!FX.raf&&!fxCovered()){FX.last=0;FX.raf=requestAnimationFrame(fxStep)}}
function fxApply(){
 const c=$('#fx'),k=S.l.fxon?S.t.fx:'none';
 if(k==='none'||!fxMotionOk()){cancelAnimationFrame(FX.raf);FX.raf=0;FX.k='';c.hidden=1;return}
 c.hidden=0;const kind=FX.k!==k;FX.k=k;FX.n=S.t.fxn;fxSize();
 if(kind){FX.ps=[];FX.cols=[];c.getContext('2d').clearRect(0,0,FX.w,FX.h)}
 fxAdjust();fxWake()}
let _rz;addEventListener('resize',()=>{clearTimeout(_rz);_rz=setTimeout(()=>{if(!FX.k)return;const ow=FX.w,oh=FX.h;fxSize();
 if(ow&&oh&&(ow!==FX.w||oh!==FX.h)){const rx=FX.w/ow,ry=FX.h/oh;FX.ps.forEach(p=>{p.x*=rx;p.y*=ry});FX.cols.forEach(o=>{o.y*=ry})}   /* barra do navegador/teclado: escala, não sorteia de novo */
 fxAdjust();fxWake()},150)});
document.addEventListener('visibilitychange',fxWake);
FXMQ.addEventListener&&FXMQ.addEventListener('change',()=>{fxApply()});
try{new MutationObserver(fxWake).observe($('#win'),{attributes:true,attributeFilter:['hidden']})}catch(e){}
try{navigator.getBattery&&navigator.getBattery().then(b=>{const f=()=>{FX.low=!b.charging&&b.level<.2?1:0};f();b.addEventListener('levelchange',f);b.addEventListener('chargingchange',f)}).catch(()=>{})}catch(e){}

/* apply(): chame depois de mudar S.t, S.l ou S.bar */
let _sig='';
function apply(force){
 applyVars();const t=S.t,sig=JSON.stringify([t.wall,t.wimg,t.wfit,t.wbl,t.wdim,t.wx,t.wy,t.wz,t.wop,t.ch,t.scan,t.vig,t.fx,t.fxn,t.fxs,S.l.fxon,S.l.fxfo]);
 if(force||sig!==_sig){_sig=sig;applyLayers();fxApply()}}
