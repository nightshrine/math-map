/* 星図：データの組み立て、配置、カメラ（移動・拡大）、進み具合の保存 */
(function(){
const $=s=>document.querySelector(s);
const STRANDS=['alg','fn','geo','dat'];
// 星域 = 科目。単元 id の接頭辞で決まる
const REGIONS=[['m1-','中学1年','中学'],['m2-','中学2年','中学'],['m3-','中学3年','中学'],['h1-','数学I','高校'],['hA-','数学A','高校'],['h2-','数学II','高校'],['hB-','数学B','高校'],['h3-','数学III','高校'],['hC-','数学C','高校']];
// 星図に出す名前と題の上書き [星図の名前, 題]。数学II と数学III の微積分を見分けられるように科目を付ける
const NAME={'h2-bibun':['微分法と積分法（数II）','微分法と積分法'],'h3-bibun':['微分法（数III）'],'h3-sekibun':['積分法（数III）'],'h3-kyokugen':['極限（数III）']};
const tx=s=>String(s).replace(/<(?!br>|b>|\/b>)/g,'&lt;');   // 数式中の < をタグと誤解させない
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- 星座（章）と星（項） ---- */
const chapters=TOPICS.map(t=>({id:t.id,name:(NAME[t.id]||[])[0]||t.short,title:(NAME[t.id]||[])[1]||t.title,strand:t.strand,
  region:REGIONS.findIndex(r=>t.id.startsWith(r[0])),pre:t.pre,next:[],topic:t,stars:[]}));
const chById={};chapters.forEach(c=>chById[c.id]=c);
chapters.forEach(c=>c.pre.forEach(p=>chById[p].next.push(c.id)));
STARS.forEach(s=>chById[s.ch].stars.push(s));
// 星を持たない章は、今までの内容を1つの星にする。星を持つ章は、今までの内容を「章のまとめ」として最後に置く
chapters.forEach(c=>{const multi=c.stars.length>0;
  c.stars.push({id:c.id,ch:c.id,name:multi?'章のまとめ':c.title,kind:multi?'sum':'main',sec:multi?'まとめ':'',legacy:true,pre:multi?[]:c.pre});});
const starById={};chapters.forEach(c=>c.stars.forEach(s=>starById[s.id]=s));
const allStars=chapters.flatMap(c=>c.stars);

/* ---- 保存（このブラウザだけ） ---- */
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}};
const done=new Set(store.get('mathmap-done',[]));
const isDone=id=>done.has(id);
function setDone(id,v){v?done.add(id):done.delete(id);store.set('mathmap-done',[...done]);refresh();}
const frac=c=>c.stars.filter(s=>done.has(s.id)).length/c.stars.length;

/* ---- 配置 ---- */
const svg=$('#map'),world=$('#world');
let W=0,H=0,pos={},portrait=false,invs=[],vw=0,vh=0,kFit=1;
function jit(id,k){let h=k*7919+13;for(const ch of id)h=(h*31+ch.charCodeAt(0))%100003;return (h%2001)/1000-1;}
function build(){
  vw=svg.clientWidth;vh=svg.clientHeight;portrait=vw<vh*0.9||vw<720;pos={};
  let s='<defs>'+STRANDS.map(k=>`<radialGradient id="g-${k}"><stop offset="0" style="stop-color:var(--${k});stop-opacity:.95"/><stop offset=".3" style="stop-color:var(--${k});stop-opacity:.4"/><stop offset="1" style="stop-color:var(--${k});stop-opacity:0"/></radialGradient>`).join('')+'</defs>';
  let deco='';
  if(!portrait){
    // 横長：左から右へ学年が進む。縦は4つの系統
    const BW=300,RH=262,TOP=120,L=60,SLOT=78;
    W=L*2+REGIONS.length*BW;H=TOP+4*RH+40;
    REGIONS.forEach((r,ri)=>{
      const cx=L+ri*BW+BW/2;
      deco+=`<g transform="translate(${cx},50)"><g class="inv"><text class="rg-sub" y="-20">${r[2]}</text><text class="rg">${r[1]}</text></g></g>`;
      if(ri)deco+=`<line class="band" x1="${L+ri*BW}" y1="84" x2="${L+ri*BW}" y2="${H-10}"/>`;
      for(let st=0;st<4;st++){const list=chapters.filter(c=>c.region===ri&&c.strand===st);
        const side=jit(r[0]+st,5)>0?1:-1;
        list.forEach((c,i)=>{const n=list.length;pos[c.id]={x:cx+(n>1?(i%2?-side:side)*66:jit(c.id,0)*40),y:TOP+st*RH+RH/2+(i-(n-1)/2)*SLOT+jit(c.id,1)*8};});}
    });
  }else{
    // 縦長（スマホ）：上から下へ学年が進む。2列のジグザグ
    const CW=175,L=25,RHt=104;W=L*2+CW*2;let y=30;
    REGIONS.forEach((r,ri)=>{
      if(ri)deco+=`<line class="band" x1="14" y1="${y-34}" x2="${W-14}" y2="${y-34}"/>`;
      deco+=`<g transform="translate(${W/2},${y+8})"><g class="inv"><text class="rg-sub" y="-20">${r[2]}</text><text class="rg">${r[1]}</text></g></g>`;
      const list=chapters.filter(c=>c.region===ri).sort((a,b)=>a.strand-b.strand);
      list.forEach((c,i)=>{const row=Math.floor(i/2),col=row%2?1-i%2:i%2;
        pos[c.id]={x:L+CW/2+col*CW+jit(c.id,0)*22,y:y+70+row*RHt+jit(c.id,1)*8};});
      y+=70+Math.ceil(list.length/2)*RHt+56;
    });
    H=y-30;
  }
  // つながりの線（前提 → 発展）
  chapters.forEach(c=>c.pre.forEach(p=>{const a=pos[p],b=pos[c.id],mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y,sg=jit(p+c.id,2)>0?1:-1;
    s+=`<path class="edge" data-a="${p}" data-b="${c.id}" d="M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${(mx-dy*.12*sg).toFixed(1)},${(my+dx*.12*sg).toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}" style="stroke:var(--${STRANDS[chById[p].strand]})"/>`;}));
  s+=deco;
  chapters.forEach(c=>{const p=pos[c.id],n=c.stars.length,big=n>1,k=STRANDS[c.strand];let sats='';
    const ns=Math.min(n-1,8);for(let i=0;i<ns&&big;i++){const a=i/ns*Math.PI*2-Math.PI/2;sats+=`<circle class="sat" r="2.3" cx="${(Math.cos(a)*22).toFixed(1)}" cy="${(Math.sin(a)*22).toFixed(1)}"/>`;}
    s+=`<g class="ch" data-id="${c.id}" transform="translate(${p.x.toFixed(1)},${p.y.toFixed(1)})" style="--c:var(--${k})" tabindex="0" role="button" aria-label="${esc(c.title)}"><g class="inv">`+
      `<circle class="halo" r="${big?40:27}" fill="url(#g-${k})" style="animation-delay:${(-(jit(c.id,3)+1)*2.2).toFixed(2)}s"/>`+
      `<circle class="ring-bg" r="13"/><circle class="ring" r="13" transform="rotate(-90)"/><circle class="core" r="${big?7:5.5}"/>${sats}`+
      `<text class="lbl" y="${big?42:35}">${esc(c.name)}</text>${big?`<text class="cnt" y="56">星 ${n} つ</text>`:''}</g></g>`;});
  world.innerHTML=s;
  invs=[...world.querySelectorAll('.inv')];
  refresh();fit(false);
}
function refresh(){
  chapters.forEach(c=>{const g=world.querySelector(`.ch[data-id="${c.id}"]`);if(!g)return;const f=frac(c);
    g.classList.toggle('done',f===1);g.querySelector('.ring').setAttribute('stroke-dasharray',`${(f*81.68).toFixed(1)} 81.68`);});
  $('#litN').textContent=allStars.filter(s=>done.has(s.id)).length;$('#litAll').textContent=allStars.length;
}

/* ---- カメラ ---- */
const cam={x:0,y:0,k:1};let anim=0;
function apply(){
  cam.k=Math.max(kFit*0.75,Math.min(2.6,cam.k));cam.x=Math.max(0,Math.min(W,cam.x));cam.y=Math.max(0,Math.min(H,cam.y));
  world.setAttribute('transform',`translate(${(vw/2-cam.x*cam.k).toFixed(2)},${(vh/2-cam.y*cam.k).toFixed(2)}) scale(${cam.k.toFixed(4)})`);
  const sc=(Math.max(1,Math.min(1.7,vw/1450))*Math.pow(cam.k,-0.72)).toFixed(3);for(const g of invs)g.setAttribute('transform',`scale(${sc})`);
  const px=Math.max(-36,Math.min(36,-(cam.x-W/2)*cam.k*.03)),py=Math.max(-36,Math.min(36,-(cam.y-H/2)*cam.k*.03));
  $('#sky').style.transform=`translate(${px.toFixed(1)}px,${py.toFixed(1)}px)`;
}
function fly(x,y,k,ms,cb){
  cancelAnimationFrame(anim);
  if(reduced()||!ms){cam.x=x;cam.y=y;cam.k=k;apply();cb&&cb();return;}
  const a={...cam},t0=performance.now();
  (function step(t){const u=Math.min(1,(t-t0)/ms),e=u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;
    cam.x=a.x+(x-a.x)*e;cam.y=a.y+(y-a.y)*e;cam.k=a.k+(k-a.k)*e;apply();
    if(u<1)anim=requestAnimationFrame(step);else cb&&cb();})(t0);
}
function fit(animate){
  if(portrait){kFit=vw/W;fly(W/2,(vh/2-76)/kFit,kFit,animate?500:0);}
  else{kFit=Math.min(vw/W,(vh-150)/H);fly(W/2,H/2,kFit,animate?500:0);}
}
function focusChapter(id,cb){const p=pos[id];if(!p){cb&&cb();return;}
  world.querySelectorAll('.edge').forEach(e=>e.classList.toggle('on',e.dataset.a===id||e.dataset.b===id));
  fly(p.x,p.y,Math.max(cam.k,Math.min(1.7,kFit*3)),420,cb);}

/* ---- 操作（ドラッグ・ピンチ・ホイール・タップ） ---- */
const pts=new Map();let moved=0,pinch=0;
svg.addEventListener('pointerdown',e=>{svg.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});moved=0;cancelAnimationFrame(anim);
  if(pts.size===2){const [a,b]=[...pts.values()];pinch=Math.hypot(a.x-b.x,a.y-b.y);}});
svg.addEventListener('pointermove',e=>{const p=pts.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
  if(pts.size===1){moved+=Math.abs(dx)+Math.abs(dy);if(moved>6){svg.classList.add('drag');cam.x-=dx/cam.k;cam.y-=dy/cam.k;apply();}}
  else if(pts.size===2){const [a,b]=[...pts.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(pinch){zoomAt((a.x+b.x)/2,(a.y+b.y)/2,d/pinch);}pinch=d;moved=99;}});
function up(e){const had=pts.has(e.pointerId);pts.delete(e.pointerId);pinch=0;svg.classList.remove('drag');
  if(had&&moved<=6&&e.type==='pointerup'){const el=document.elementFromPoint(e.clientX,e.clientY),g=el&&el.closest&&el.closest('.ch');if(g)pick(g.dataset.id);}}
svg.addEventListener('pointerup',up);svg.addEventListener('pointercancel',up);
function zoomAt(sx,sy,f){const r=svg.getBoundingClientRect(),wx=cam.x+(sx-r.left-vw/2)/cam.k,wy=cam.y+(sy-r.top-vh/2)/cam.k;
  cam.k=Math.max(kFit*0.75,Math.min(2.6,cam.k*f));cam.x=wx-(sx-r.left-vw/2)/cam.k;cam.y=wy-(sy-r.top-vh/2)/cam.k;apply();}
svg.addEventListener('wheel',e=>{e.preventDefault();zoomAt(e.clientX,e.clientY,Math.exp(-e.deltaY*(e.ctrlKey?.012:.0016)));},{passive:false});
svg.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const g=e.target.closest('.ch');if(g){e.preventDefault();pick(g.dataset.id);}}});
svg.addEventListener('pointerover',e=>{const g=e.target.closest&&e.target.closest('.ch');if(g&&e.pointerType==='mouse'){const id=g.dataset.id;
  world.querySelectorAll('.edge').forEach(x=>x.classList.toggle('on',x.dataset.a===id||x.dataset.b===id));}});
function pick(id){focusChapter(id,()=>MM.enter&&MM.enter(id));}
$('#fitBtn').addEventListener('click',()=>{world.querySelectorAll('.edge.on').forEach(e=>e.classList.remove('on'));fit(true);});

/* ---- 背景の星 ---- */
function sky(){const c=$('#sky'),d=Math.min(devicePixelRatio||1,2),w=c.clientWidth,h=c.clientHeight;c.width=w*d;c.height=h*d;
  const g=c.getContext('2d');let seed=11;const rnd=()=>(seed=seed*16807%2147483647)/2147483647;
  for(let i=0,n=Math.round(w*h/4800);i<n;i++){g.beginPath();g.arc(rnd()*w*d,rnd()*h*d,(rnd()*1.1+.25)*d,0,7);g.fillStyle=`rgba(${205+rnd()*50|0},${215+rnd()*40|0},255,${(rnd()*.55+.12).toFixed(2)})`;g.fill();}}
let rz=0;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{sky();build();},180);});

window.MM={chapters,chById,starById,allStars,STRANDS,REGIONS,tx,esc,store,isDone,setDone,refresh,focusChapter,fit,reduced,
  col:c=>`var(--${STRANDS[c.strand]})`,region:c=>REGIONS[c.region][1],
  typeset:el=>window.MathJax&&MathJax.typesetPromise?MathJax.typesetPromise([el]).catch(()=>{}):Promise.resolve()};
sky();build();
})();
