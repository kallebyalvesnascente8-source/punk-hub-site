/* =====================================================================
   10 TEMAS: esquema, valores padrão e galeria
   Um tema guarda tudo que é "aparência". O layout (widgets, barra) é separado.
   ===================================================================== */
const FF={'Space Grotesk':'"Space Grotesk",system-ui,sans-serif','JetBrains Mono':'"JetBrains Mono",ui-monospace,monospace','Inter':'Inter,system-ui,sans-serif','Sistema':'system-ui,sans-serif','Serifada':'Georgia,serif',
 'Fira Code':'"Fira Code",ui-monospace,monospace','Cascadia Code':'"Cascadia Code",ui-monospace,monospace','Hack':'Hack,ui-monospace,monospace','Ubuntu':'Ubuntu,system-ui,sans-serif','Noto Sans':'"Noto Sans",system-ui,sans-serif','Roboto Mono':'"Roboto Mono",ui-monospace,monospace'};
const FF_LOCAL=['Fira Code','Cascadia Code','Hack','Ubuntu','Noto Sans','Roboto Mono'];   /* só aparecem se instaladas no computador */
const WALLS={aurora:'Aurora',mesh:'Malha de cores',sunset:'Degradê',grid:'Grade',plain:'Cor sólida',img:'Minha imagem'};
const FXS={none:'Nenhum',stars:'Estrelas',snow:'Neve',petals:'Pétalas',rain:'Chuva digital'};
const ANS={fade:'Surgir',slide:'Deslizar',scale:'Zoom',none:'Nenhuma'};

/* Valores padrão de um tema completo */
const TD={ac:'#00ff88',ac2:'#7dffc4',bg:'#0d0f0e',tx:'#f2f5f3',ff:'Space Grotesk',fm:'JetBrains Mono',fs:15,r:14,sh:24,al:62,bl:18,bw:1,bo:14,gl:0,as:1,an:'slide',
 wall:'aurora',wimg:'',wfit:'cover',wx:50,wy:50,wz:100,wop:100,wbl:0,wdim:0,fx:'none',fxn:40,fxs:100,scan:0,vig:0,is:'glyph',ch:{img:'',side:'right',x:2,y:0,sz:82,msz:45,op:100,flip:0,gl:0}};
const cleanFont=s=>String(s||'').replace(/["';{}<>\\]/g,'').trim().slice(0,60);
function clean(o){
 if(!o||typeof o!=='object')return null;const b=TD,c=o.ch&&typeof o.ch==='object'?o.ch:{};
 return{ac:hexN(o.ac)||b.ac,ac2:hexN(o.ac2)||b.ac2,bg:hexN(o.bg)||b.bg,tx:hexN(o.tx)||b.tx,
  ff:cleanFont(o.ff)||b.ff,fm:cleanFont(o.fm)||b.fm,fs:num(o.fs,12,20,b.fs),r:num(o.r,0,28,b.r),sh:num(o.sh,0,40,b.sh),al:num(o.al,20,100,b.al),bl:num(o.bl,0,40,b.bl),
  bw:num(o.bw,0,4,b.bw),bo:num(o.bo,0,100,b.bo),gl:num(o.gl,0,40,b.gl),as:num(o.as,0,3,b.as),an:ANS[o.an]?o.an:b.an,
  wall:WALLS[o.wall]?o.wall:b.wall,wimg:typeof o.wimg==='string'?o.wimg.slice(0,40):'',wfit:['cover','contain','center','tile'].includes(o.wfit)?o.wfit:b.wfit,wx:num(o.wx,0,100,b.wx),wy:num(o.wy,0,100,b.wy),wz:num(o.wz,100,300,b.wz),wop:num(o.wop,10,100,b.wop),wbl:num(o.wbl,0,20,0),wdim:num(o.wdim,0,80,0),
  fx:FXS[o.fx]?o.fx:'none',fxn:num(o.fxn,10,100,b.fxn),fxs:num(o.fxs,25,300,b.fxs),scan:num(o.scan,0,50,0),vig:num(o.vig,0,80,0),is:o.is==='line'?'line':'glyph',
  ch:{img:typeof c.img==='string'?c.img.slice(0,40):'',side:['left','right','center'].includes(c.side)?c.side:b.ch.side,x:num(c.x,-30,50,b.ch.x),y:num(c.y,-50,50,b.ch.y),sz:num(c.sz,20,120,b.ch.sz),msz:num(c.msz,20,120,b.ch.msz),op:num(c.op,10,100,b.ch.op),flip:c.flip?1:0,gl:num(c.gl,0,40,0)}}}

/* Importação tolerante: aceita o formato do PUNK HUB e também JSON de outras fontes
   (chaves como accent/background/text, "colors": {...}, variáveis CSS "--ac"). Devolve o tema já limpo
   e um relatório do que foi aplicado ou ignorado. */
const TALIAS={ac:['ac','accent','primary','main','highlight','accentcolor','primarycolor','acento','destaque'],ac2:['ac2','accent2','secondary','secondarycolor','secondaryaccent','accentsecondary','secundaria'],
 bg:['bg','background','backgroundcolor','bgcolor','base','fundo'],tx:['tx','text','foreground','fg','textcolor','color','texto']};
const TNAMES={ac:'cor principal',ac2:'cor secundária',bg:'fundo',tx:'texto'};
function themeIn(j){
 const isO=x=>x&&typeof x==='object'&&!Array.isArray(x);if(!isO(j))return null;
 const base=isO(j.theme)?j.theme:j,srcs=[base];
 [base.colors,base.colours,base.palette,base.vars,base.variables,j.colors,j.colours,j.palette].forEach(x=>{if(isO(x)&&!srcs.includes(x))srcs.push(x);if(isO(x)&&isO(x.colors))srcs.push(x.colors)});
 const low=o=>Object.fromEntries(Object.entries(o).map(([k,v])=>[k.replace(/^-+/,'').replace(/[\s_-]/g,'').toLowerCase(),v]));
 const L=srcs.map(low),t={...base},rep={ok:[],bad:[],miss:[]};
 for(const k of Object.keys(TALIAS)){
  let raw,found=false;
  for(const o of L){const a=TALIAS[k].find(n=>o[n]!=null&&typeof o[n]==='string');if(a){raw=o[a];found=true;break}}
  const h=found?hexN(raw):'';
  if(h){t[k]=h;rep.ok.push(k)}else{delete t[k];(found?rep.bad:rep.miss).push(k)}}
 /* peças que faltaram: deriva do que veio, para não sobrar o verde padrão em cima de um fundo claro */
 if(!t.tx&&t.bg)t.tx=lum(t.bg)>.55?'#121614':'#f2f5f3';
 if(!t.ac2&&t.ac)t.ac2=mix2(t.ac,.35);
 const c=clean(t);if(!c)return null;
 return{theme:c,rep,hasColors:rep.ok.length>0,hasAny:rep.ok.length>0||!!(base.wall||base.fx||base.ch||base.ff||base.fs)}}
function mix2(h,p){const x=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));return'#'+x.map(v=>Math.round(v+(255-v)*p).toString(16).padStart(2,'0')).join('')}

/* Galeria: só as diferenças em relação ao padrão. cat = aba da galeria. */
const RAW={
 'dark':{cat:'Hub'},
 'light':{cat:'Hub',ac:'#00a35c',ac2:'#0070f3',bg:'#eef2ef',tx:'#121614',ff:'Inter',sh:16,al:70,bl:16},
 'amoled':{cat:'Hub',ac2:'#00c2ff',bg:'#000000',tx:'#ffffff',r:12,sh:0,al:55,bl:12},
 'neon':{cat:'Hub',ac:'#ff2bd6',ac2:'#00f0ff',bg:'#0a0620',tx:'#f6f0ff',ff:'JetBrains Mono',fs:14,r:10,sh:30,al:55,bl:20,gl:10,wall:'mesh'},
 'minimalista':{cat:'Hub',ac:'#9aa0a6',ac2:'#c4c7c5',bg:'#1b1c1d',tx:'#e8eaed',ff:'Inter',r:4,sh:0,al:95,bl:0,as:.5},
 'cyberpunk':{cat:'Hub',ac:'#fcee0a',ac2:'#00e5ff',bg:'#0a0e1a',tx:'#f5f5dc',ff:'JetBrains Mono',fs:14,r:2,sh:20,al:70,bl:8,bw:2,bo:40,scan:14,wall:'grid',is:'line'},
 'arch':{cat:'Linux',ac:'#1793d1',ac2:'#5ec4f5',bg:'#0b0f14',tx:'#e6edf3',ff:'JetBrains Mono',fs:14,r:6,al:72,bl:10,wall:'grid',is:'line'},
 'plasma':{cat:'Linux',ac:'#3daee9',ac2:'#1abc9c',bg:'#1b1e20',tx:'#eff0f1',ff:'Noto Sans',r:6,sh:18,al:80,bl:14,wall:'mesh',is:'line'},
 'gruvbox':{cat:'Linux',ac:'#fabd2f',ac2:'#b8bb26',bg:'#1d2021',tx:'#ebdbb2',ff:'JetBrains Mono',fs:14,r:4,sh:10,al:88,bl:0,wall:'plain',is:'line'},
 'nord':{cat:'Linux',ac:'#88c0d0',ac2:'#81a1c1',bg:'#2e3440',tx:'#eceff4',ff:'Inter',r:8,sh:12,al:82,bl:10,wall:'sunset',is:'line'},
 'catppuccin':{cat:'Linux',ac:'#cba6f7',ac2:'#89b4fa',bg:'#1e1e2e',tx:'#cdd6f4',ff:'Inter',r:14,sh:22,al:70,bl:16,wall:'mesh',is:'line'},
 'dracula':{cat:'Linux',ac:'#bd93f9',ac2:'#ff79c6',bg:'#282a36',tx:'#f8f8f2',ff:'Fira Code',fs:14,r:8,sh:18,al:78,bl:8,wall:'aurora',is:'line'},
 'tokyo night':{cat:'Linux',ac:'#7aa2f7',ac2:'#bb9af7',bg:'#1a1b26',tx:'#c0caf5',ff:'JetBrains Mono',fs:14,r:10,sh:22,al:70,bl:14,wall:'mesh',is:'line'},
 'rose pine':{cat:'Linux',ac:'#ebbcba',ac2:'#c4a7e7',bg:'#191724',tx:'#e0def4',ff:'Inter',r:12,sh:20,al:72,bl:14,wall:'aurora',is:'line'},
 'sakura night':{cat:'Anime',ac:'#ff8fb8',ac2:'#ffc2d9',bg:'#170d14',tx:'#fdeef4',ff:'Inter',r:16,sh:26,al:55,bl:20,gl:8,wall:'mesh',fx:'petals',fxn:35,is:'line',ch:{side:'right',sz:88,x:3}},
 'moonlit':{cat:'Anime',ac:'#9db4ff',ac2:'#d4c2ff',bg:'#0a0d1c',tx:'#e8ecff',ff:'Inter',r:14,sh:28,al:52,bl:22,gl:10,wall:'sunset',fx:'stars',fxn:45,vig:30,is:'line',ch:{side:'left',sz:86,x:3}},
 'neon tokyo':{cat:'Anime',ac:'#ff3d9a',ac2:'#00e5ff',bg:'#080414',tx:'#f4ecff',ff:'JetBrains Mono',fs:14,r:10,sh:30,al:50,bl:22,gl:16,bw:1,bo:35,wall:'mesh',fx:'rain',fxn:25,scan:8,vig:25,is:'line',ch:{side:'right',sz:90,x:2,gl:14}},
 'matrix':{cat:'Efeitos',ac:'#00ff41',ac2:'#00b32d',bg:'#000000',tx:'#c8ffd4',ff:'JetBrains Mono',fs:14,r:2,sh:0,al:60,bl:6,gl:6,wall:'plain',fx:'rain',fxn:55,scan:10,vig:35,is:'line'},
 'neve':{cat:'Efeitos',ac:'#a8d8ff',ac2:'#ffffff',bg:'#0b1220',tx:'#eaf4ff',ff:'Inter',r:16,sh:20,al:55,bl:18,wall:'sunset',fx:'snow',fxn:50,is:'line'}};
const TH={},THCAT={};
Object.entries(RAW).forEach(([k,v])=>{const{cat,...t}=v;THCAT[k]=cat;TH[k]=clean({...TD,...t,ch:{...TD.ch,...(t.ch||{})}})});
