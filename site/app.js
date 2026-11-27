(function(){
const STAGES=[['中学','1年'],['中学','2年'],['中学','3年'],['高校','数学I・A'],['高校','数学II・B'],['高校','数学III・C']];
const STRANDS=[['alg','数と式'],['fn','関数と解析'],['geo','図形'],['dat','データと確率']];
const T=window.TOPICS, byId={};
T.forEach(t=>{byId[t.id]=t;t.next=[];});
T.forEach(t=>t.pre.forEach(p=>byId[p].next.push(t.id)));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const col=t=>`var(--${STRANDS[t.strand][0]})`;
const stageName=t=>STAGES[t.stage].join(' ');

/* ---- 学習済み（このブラウザだけに保存） ---- */
let done=new Set();
try{done=new Set(JSON.parse(localStorage.getItem('mathmap-done')||'[]'));}catch(e){}
const saveDone=()=>{try{localStorage.setItem('mathmap-done',JSON.stringify([...done]));}catch(e){}};

/* ---- 地図のレイアウト ---- */
const LW=96,CW=176,HH=44,RH=132,NW=152,NH=34,GAP=8;
const W=LW+CW*STAGES.length, H=HH+RH*STRANDS.length;
const cells={},pos={};
T.forEach(t=>{(cells[t.stage+'-'+t.strand]??=[]).push(t);});
Object.values(cells).forEach(list=>list.forEach((t,i)=>{
  const h=list.length*NH+(list.length-1)*GAP;
  pos[t.id]={x:LW+t.stage*CW+(CW-NW)/2,y:HH+t.strand*RH+(RH-h)/2+i*(NH+GAP)};
}));
function edgePath(a,b){
  const A=pos[a],B=pos[b],y1=A.y+NH/2,y2=B.y+NH/2;
  if(byId[a].stage===byId[b].stage){const x=A.x+NW;return `M${x},${y1} C${x+20},${y1} ${x+20},${y2} ${x},${y2}`;}
  const x1=A.x+NW,x2=B.x,dx=(x2-x1)/2;
  return `M${x1},${y1} C${x1+dx},${y1} ${x2-dx},${y2} ${x2},${y2}`;
}
const map=document.getElementById('map');
map.style.width=W+'px';map.style.height=H+'px';
let html=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">`;
T.forEach(t=>t.pre.forEach(p=>{html+=`<path class="edge" data-a="${p}" data-b="${t.id}" d="${edgePath(p,t.id)}" style="stroke:${col(byId[p])}"/>`;}));
html+='</svg>';
STAGES.forEach((s,i)=>{html+=`<div class="col-h${i===3?' hs-first':''}" style="left:${LW+i*CW}px;width:${CW}px"><small>${s[0]}</small>${s[1]}</div>`;});
STRANDS.forEach((s,i)=>{html+=`<div class="row" style="top:${HH+i*RH}px;height:${RH}px;--c:var(--${s[0]})"><span>${s[1]}</span></div>`;});
T.forEach(t=>{const p=pos[t.id];html+=`<button type="button" class="node" id="n-${t.id}" data-id="${t.id}" style="left:${p.x}px;top:${p.y}px;--c:${col(t)}" title="${esc(t.title)}">${esc(t.short)}</button>`;});
map.innerHTML=html;
map.addEventListener('click',e=>{const b=e.target.closest('.node');if(b)go(b.dataset.id,false);});

/* ---- グラフ（スライダーで動かす） ---- */
function drawDemo(t,svg,p){
  const d=t.demo,[x0,x1,y0,y1]=d.range,Wd=320,Hd=240;
  const sx=x=>(x-x0)/(x1-x0)*Wd, sy=y=>Hd-(y-y0)/(y1-y0)*Hd;
  let s='';
  for(let x=Math.ceil(x0);x<=x1;x++)s+=`<line x1="${sx(x)}" y1="0" x2="${sx(x)}" y2="${Hd}" stroke="var(--line)" stroke-width="${x===0?0:.6}"/>`;
  for(let y=Math.ceil(y0);y<=y1;y++)s+=`<line x1="0" y1="${sy(y)}" x2="${Wd}" y2="${sy(y)}" stroke="var(--line)" stroke-width="${y===0?0:.6}"/>`;
  s+=`<line x1="0" y1="${sy(0)}" x2="${Wd}" y2="${sy(0)}" stroke="var(--muted)" stroke-width="1.2"/><line x1="${sx(0)}" y1="0" x2="${sx(0)}" y2="${Hd}" stroke="var(--muted)" stroke-width="1.2"/>`;
  s+=`<text x="${Wd-6}" y="${sy(0)-6}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">x</text><text x="${sx(0)+6}" y="12" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">y</text>`;
  s+=`<text x="${sx(1)}" y="${sy(0)+13}" text-anchor="middle" font-size="10" fill="var(--muted)" font-family="var(--f-mono)">1</text><text x="${sx(0)-6}" y="${sy(1)+3.5}" text-anchor="end" font-size="10" fill="var(--muted)" font-family="var(--f-mono)">1</text>`;
  const curve=(f,style)=>{
    let path='',pen=false;const span=y1-y0;
    for(let i=0;i<=320;i++){const x=x0+(x1-x0)*i/320,y=f(x,p);
      if(!isFinite(y)||y<y0-span||y>y1+span){pen=false;continue;}
      path+=(pen?'L':'M')+sx(x).toFixed(1)+','+sy(y).toFixed(1);pen=true;}
    return `<path d="${path}" fill="none" ${style}/>`;
  };
  if(d.g)s+=curve(d.g,'stroke="var(--muted)" stroke-width="1.4" stroke-dasharray="4 4"');
  s+=curve(d.f,`stroke="${col(t)}" stroke-width="2.4"`);
  if(d.tangent){const a=p[d.tangent],h=1e-4,m=(d.f(a+h,p)-d.f(a-h,p))/(2*h),fa=d.f(a,p);
    s+=`<line x1="${sx(x0)}" y1="${sy(fa+m*(x0-a))}" x2="${sx(x1)}" y2="${sy(fa+m*(x1-a))}" stroke="var(--ink)" stroke-width="1.3"/>`;
    s+=`<circle cx="${sx(a)}" cy="${sy(fa)}" r="4" fill="var(--ink)"/>`;}
  (d.pts?d.pts(p):[]).forEach(q=>{s+=`<circle cx="${sx(q[0])}" cy="${sy(q[1])}" r="4" fill="${col(t)}" stroke="var(--surface)" stroke-width="1.5"/>`;});
  svg.innerHTML=s;
}
function mountDemo(t,host){
  const d=t.demo,p={};d.params.forEach(q=>p[q.n]=q.v);
  host.innerHTML=`<div class="demo"><svg viewBox="0 0 320 240" role="img" aria-label="${esc(t.title)}のグラフ"></svg><div class="ctl">`+
    d.params.map(q=>`<label for="s-${t.id}-${q.n}"><span>${q.n} = <output id="o-${t.id}-${q.n}">${q.v}</output></span><input type="range" id="s-${t.id}-${q.n}" data-n="${q.n}" min="${q.min}" max="${q.max}" step="${q.step}" value="${q.v}"></label>`).join('')+
    `<p class="cap"></p><p class="note">${d.note||''}</p></div></div>`;
  const svg=host.querySelector('svg'),cap=host.querySelector('.cap');
  const upd=()=>{drawDemo(t,svg,p);cap.textContent=d.cap(p);};
  host.querySelectorAll('input').forEach(inp=>inp.addEventListener('input',()=>{p[inp.dataset.n]=+inp.value;host.querySelector('#o-'+t.id+'-'+inp.dataset.n).textContent=inp.value;upd();}));
  upd();
}

/* ---- 解説欄 ---- */
const detail=document.getElementById('detail');
const chip=id=>{const t=byId[id];return `<button type="button" class="chip" data-id="${id}" style="--c:${col(t)}">${esc(t.short)}<small>${STAGES[t.stage][1]}</small></button>`;};
const chips=ids=>ids.length?`<div class="chips">${ids.map(chip).join('')}</div>`:'<p class="none">なし</p>';
function ancestors(id){const seen=new Set();(function walk(x){byId[x].pre.forEach(p=>{if(!seen.has(p)){seen.add(p);walk(p);}});})(id);
  return T.filter(t=>seen.has(t.id)).sort((a,b)=>a.stage-b.stage).map(t=>t.id);}
function render(t){
  detail.style.setProperty('--c',col(t));
  const anc=ancestors(t.id).filter(x=>!t.pre.includes(x));
  const probs=(window.PROBLEMS||{})[t.id]||[];
  const LV={'基本':'b','応用':'a','複合':'c','発展':'h'};
  const probHtml=probs.map((q,i)=>`<div class="ex"><p class="plabel"><span class="lv lv-${LV[q.lv]}">${q.lv}</span><span class="pno">問${i+1}</span>${q.with?`<span class="uses">組み合わせる単元</span>${q.with.map(chip).join('')}`:''}</p><p class="q">${q.q}</p>
    <details><summary>解き方を見る</summary><ol>${q.steps.map(s=>`<li>${s}</li>`).join('')}</ol><p class="ans">答え　${q.a}</p></details></div>`).join('');
  detail.innerHTML=`
  <header class="d-head">
    <p class="crumb">${STRANDS[t.strand][1]} ／ ${stageName(t)}</p>
    <h2>${esc(t.title)}</h2>
    <p class="lead">${t.lead}</p>
    <label class="done-l" for="done-box"><input type="checkbox" id="done-box"${done.has(t.id)?' checked':''}>学習済みにする</label>
  </header>
  <div class="cols">
    <div class="main">
      <section class="sec"><h3>要点</h3><dl class="points">${t.points.map(q=>`<div><dt>${q[0]}</dt><dd>${q[1]}</dd></div>`).join('')}</dl></section>
      ${t.demo?'<section class="sec"><h3>動かして確かめる</h3><div id="demo-host"></div></section>':''}
      <section class="sec"><h3>例題</h3><div class="ex"><p class="q">${t.ex.q}</p>
        <details><summary>解き方を見る</summary><ol>${t.ex.steps.map(s=>`<li>${s}</li>`).join('')}</ol><p class="ans">答え　${t.ex.a}</p></details></div></section>
      <section class="sec"><h3>つまずきやすい所</h3><p class="trap">${t.trap}</p></section>
      ${probs.length?`<section class="sec"><h3>練習問題（${probs.length}問）</h3><p class="note">基本 → 応用 → 複合（ほかの単元と組み合わせる）→ 発展 の順に難しくなります。</p><div class="probs">${probHtml}</div></section>`:''}
    </div>
    <aside class="side">
      <section class="sec"><h3>なぜ学ぶか</h3><p>${t.why}</p></section>
      <section class="sec"><h3>前提（先に学ぶ）</h3>${chips(t.pre)}</section>
      <section class="sec"><h3>発展（この先で使う）</h3>${chips(t.next)}</section>
      ${anc.length?`<section class="sec"><h3>さらにさかのぼると</h3>${chips(anc)}</section>`:''}
      <a class="back" href="#top-map">↑ 地図に戻る</a>
    </aside>
  </div>`;
  if(t.demo)mountDemo(t,detail.querySelector('#demo-host'));
  detail.querySelector('#done-box').addEventListener('change',e=>{e.target.checked?done.add(t.id):done.delete(t.id);saveDone();paintDone();});
  if(window.MathJax&&MathJax.typesetPromise)MathJax.typesetPromise([detail]).catch(()=>{});
}
detail.addEventListener('click',e=>{const c=e.target.closest('.chip');if(c)go(c.dataset.id,true);});

function paintDone(){
  T.forEach(t=>document.getElementById('n-'+t.id).classList.toggle('done',done.has(t.id)));
  document.getElementById('doneCount').textContent=T.filter(t=>done.has(t.id)).length;
  document.getElementById('allCount').textContent=T.length;
}
let current=null;
function select(id,scroll){
  const t=byId[id];if(!t)return;current=id;
  map.classList.add('has-sel');
  map.querySelectorAll('.node').forEach(n=>{const x=n.dataset.id;
    n.classList.toggle('sel',x===id);n.classList.toggle('pre',t.pre.includes(x));n.classList.toggle('next',t.next.includes(x));
    n.setAttribute('aria-pressed',x===id);});
  map.querySelectorAll('.edge').forEach(e=>{const inn=e.dataset.b===id,out=e.dataset.a===id;
    e.classList.toggle('on',inn||out);e.classList.toggle('pre',inn);});
  render(t);
  if(scroll){const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;detail.scrollIntoView({behavior:calm?'auto':'smooth',block:'start'});}
}
function go(id,scroll){
  if(location.hash.slice(1)===id){select(id,scroll);return;}
  pendingScroll=scroll;
  try{location.hash=id;}catch(e){select(id,scroll);}
  if(current!==id)setTimeout(()=>{if(current!==id)select(id,scroll);},60);
}
let pendingScroll=false;
addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(byId[id]&&id!==current){select(id,pendingScroll);pendingScroll=false;}});
paintDone();
select(byId[location.hash.slice(1)]?location.hash.slice(1):T[0].id,false);
})();
