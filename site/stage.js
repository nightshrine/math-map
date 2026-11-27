/* 星座（章の中の道）と、星のステージ（1画面ずつ進む） */
(function(){
const {chById,starById,tx,esc,store}=MM;
const $=s=>document.querySelector(s);
const elC=$('#constel'),elS=$('#stage');
let loc={type:'map'},cur=null;
const ret=[];                                   // 「前提の星へ」で飛ぶ前の場所
const quiz=store.get('mathmap-quiz',{});        // 練習問題の「できた」
const LV={'基本':'b','応用':'a','複合':'c','発展':'h'};
const timers=new WeakMap();
function show(el){clearTimeout(timers.get(el));el.classList.remove('out');el.hidden=false;}
function hide(el,now){if(el.hidden)return;clearTimeout(timers.get(el));
  if(now||MM.reduced()){el.hidden=true;return;}
  el.classList.add('out');timers.set(el,setTimeout(()=>{el.hidden=true;el.classList.remove('out');},190));}
const hashOf=()=>loc.type==='star'?loc.id:loc.type==='ch'?'c-'+loc.id:'';
function syncHash(){try{if(location.hash.slice(1)!==hashOf())location.hash=hashOf();}catch(e){}}
const nameOf=id=>chById[id]?chById[id].title:starById[id].name;
const chip=id=>`<button type="button" class="chip" data-go="${id}" style="--c:${MM.col(chById[starById[id].ch])}">${esc(nameOf(id))}</button>`;
const retPill=()=>ret.length?`<button type="button" class="ret" data-act="ret">↩ 〈${esc(nameOf(ret[ret.length-1].id))}〉の続きに戻る</button>`:'';
const paras=b=>(Array.isArray(b)?b:[b]).map(p=>`<p class="sx">${tx(p)}</p>`).join('');

/* ---- 星図に戻る ---- */
function toMap(){loc={type:'map'};ret.length=0;hide(elC);hide(elS);syncHash();MM.refresh();}

/* ---- 星座 ---- */
function openCh(id){
  const c=chById[id];loc={type:'ch',id};
  const OFF=[-64,-22,44,70,26,-40];let y=34,rows='',d='',sec=null,px=0,py=0;
  c.stars.forEach((s,i)=>{
    if(s.sec&&s.sec!==sec){sec=s.sec;rows+=`<p class="sec" style="top:${y}px"><span>${esc(sec)}</span></p>`;y+=60;}
    const off=OFF[i%OFF.length],dn=MM.isDone(s.id),kind=s.kind==='why'?'なぜを確かめる':s.kind==='sum'?'要点と総合問題':'本編';
    d+=i?`C${px},${(py+y)/2} ${off},${(py+y)/2} ${off},${y}`:`M${off},${y}`;px=off;py=y;
    rows+=`<button type="button" class="st${s.kind==='why'?' why':''}${off>0?' lft':''}${dn?' done':''}" data-star="${s.id}" style="top:${y}px;${off>0?`right:calc(50% - ${off+22}px)`:`left:calc(50% + ${off-22}px)`}">`+
      `<span class="orb"><span>${dn?'✓':i+1}</span></span><span class="nm">${esc(s.name)}<small>${kind}</small></span></button>`;
    y+=96;});
  const nd=c.stars.filter(s=>MM.isDone(s.id)).length;
  elC.style.setProperty('--c',MM.col(c));
  elC.innerHTML=`<div class="l-head"><button type="button" class="icon-btn" data-act="map">← 星図</button><div class="tt"><p class="crumb">${MM.region(c)}</p><h2>${esc(c.title)}</h2></div>`+
    `<span class="lit"><b>${nd}</b> / ${c.stars.length}</span></div>${retPill()}<div class="cs-body"><div class="cs-in"><p class="cs-lead">${tx(c.topic.lead)}</p>`+
    `<div class="path" style="height:${y-30}px"><svg width="1" height="${y}"><path class="path-line" d="${d}"/></svg>${rows}</div></div></div>`;
  show(elC);hide(elS);syncHash();MM.typeset(elC);
}

/* ---- ステージ ---- */
function screensOf(s){
  const t=chById[s.ch].topic;let list;
  if(s.legacy){
    list=[{t:'intro',lead:t.lead,why:t.why}];
    if(t.demo)list.push({t:'fig',fig:'legacy',arg:t.demo,title:'動かして確かめる'});
    list.push({t:'points',items:t.points,trap:t.trap},{t:'ex',q:t.ex.q,steps:t.ex.steps,a:t.ex.a});
    (PROBLEMS[t.id]||[]).forEach(q=>list.push(Object.assign({t:'quiz'},q)));
  }else list=s.screens.slice();
  list.push({t:'clear'});return list;
}
function openStar(id,at){
  const s=starById[id];if(!s)return;const c=chById[s.ch],list=screensOf(s);
  cur={s,c,list,i:Math.max(0,Math.min(at||0,list.length-1))};loc={type:'star',id};
  elS.style.setProperty('--c',s.kind==='why'?'var(--gold)':MM.col(c));
  elS.innerHTML=`<div class="l-head"><button type="button" class="icon-btn" data-act="close" aria-label="閉じる">✕</button><div class="tt"><p class="crumb">${MM.region(c)} ／ ${esc(c.title)}</p><h2>${esc(s.name)}</h2></div>`+
    `<button type="button" class="icon-btn" data-act="pre">前提</button></div><div class="dots"></div>${retPill()}<div class="sg-body"></div>`+
    `<div class="sg-foot"><button type="button" class="nav prev" data-act="prev">戻る</button><span class="count"></span><button type="button" class="nav next" data-act="next">次へ</button></div>`;
  show(elS);hide(elC,true);syncHash();draw(1);
}
function closeStar(){if(!cur)return toMap();cur.c.stars.length>1?openCh(cur.c.id):toMap();}
function go(id){ret.push({id:cur.s.id,i:cur.i});(chById[id]&&chById[id].stars.length>1)?openCh(id):openStar(id);}
const preIds=()=>cur.s.pre&&cur.s.pre.length?cur.s.pre:(cur.s.kind==='sum'?cur.c.pre:[]);

const quizNo=i=>cur.list.slice(0,i+1).filter(x=>x.t==='quiz').length;
const solve=sc=>`<div class="card"><p class="sx q">${tx(sc.q)}</p></div><div class="card solve" data-n="0"><h4>解き方</h4><ol class="steps"></ol><p class="ans" hidden>答え　${tx(sc.a)}</p>`+
  `<div class="row ctl"><button type="button" class="btn" data-act="step">最初の一手を見る</button><button type="button" class="btn ghost" data-act="all">全部見る</button></div></div>`;
const RENDER={
  intro(sc){const s=cur.s,pre=preIds();
    return `<p class="kind">${s.kind==='why'?'なぜを確かめる星':s.kind==='sum'?'章のまとめ':'本編の星'}</p><h3>${esc(s.kind==='sum'?cur.c.title+'のまとめ':s.name)}</h3><p class="lead">${tx(sc.lead)}</p>`+
      (sc.why?`<div class="card"><h4>なぜ学ぶか</h4><p>${tx(sc.why)}</p></div>`:'')+(sc.note?`<p class="note">${tx(sc.note)}</p>`:'')+
      (pre.length?`<div class="card"><h4>前提の星（分からなくなったら、ここから戻れます）</h4><div class="row">${pre.map(chip).join('')}</div></div>`:'');},
  text(sc){return `<h3>${tx(sc.title)}</h3><div class="card${cur.s.kind==='why'?' why':''}">${paras(sc.body)}`+
    (sc.table?`<div class="sx"><table class="inc"><tr>${sc.table.head.map(h=>`<th>${tx(h)}</th>`).join('')}</tr>${sc.table.rows.map(r=>`<tr>${r.map(x=>`<td>${tx(x)}</td>`).join('')}</tr>`).join('')}</table></div>`:'')+
    (sc.after?paras(sc.after):'')+'</div>';},
  fig(sc){return `<h3>${tx(sc.title)}</h3><div class="fig-host"></div>${sc.text?`<p>${tx(sc.text)}</p>`:''}`;},
  points(sc){return `<h3>要点</h3><div class="card"><dl class="pts">${sc.items.map(q=>`<div><dt>${tx(q[0])}</dt><dd>${tx(q[1])}</dd></div>`).join('')}</dl></div>`+
    (sc.trap?`<div class="card"><h4>つまずきやすい所</h4><p class="sx">${tx(sc.trap)}</p></div>`:'');},
  ex(sc){return `<p class="kind">例題</p>${solve(sc)}`;},
  quiz(sc,i){const tot=cur.list.filter(x=>x.t==='quiz').length;
    return `<p class="plabel"><span class="lv lv-${LV[sc.lv]}">${sc.lv}</span>練習問題 ${quizNo(i)} / ${tot}${sc.with?`<span>組み合わせる単元</span>${sc.with.map(chip).join('')}`:''}</p>${solve(sc)}`+
      `<div class="row check" hidden><button type="button" class="btn${quiz[cur.s.id+':'+i]?' fill':''}" data-act="ok">できた</button><span class="note"></span></div>`;},
  ask(sc){return `<p class="kind">自分で確かめる</p><h3>${tx(sc.title)}</h3>${sc.body?`<div class="card why">${paras(sc.body)}</div>`:''}${sc.fig?'<div class="fig-host"></div>':''}`+
    `<p class="sx q">${tx(sc.q)}</p><div class="choices">${sc.choices.map((c,j)=>`<button type="button" class="choice" data-j="${j}">${tx(c)}</button>`).join('')}</div><p class="fb" hidden></p>`;},
  clear(){const s=cur.s,c=cur.c,nx=c.stars[c.stars.indexOf(s)+1],qs=cur.list.map((x,i)=>x.t==='quiz'?i:-1).filter(i=>i>=0),ok=qs.filter(i=>quiz[s.id+':'+i]).length;
    return `<div class="burst"></div><p class="kind">クリア</p><h3>〈${esc(s.kind==='sum'?c.title:s.name)}〉の星が灯りました</h3>`+
      (qs.length?`<p class="note">練習問題 ${qs.length} 問のうち、「できた」は ${ok} 問</p>`:'')+
      `<div class="row" style="justify-content:center">${nx?`<button type="button" class="btn fill" data-star="${nx.id}">次の星へ：${esc(nx.name)}</button>`:''}`+
      (c.stars.length>1?'<button type="button" class="btn ghost" data-act="close">星座に戻る</button>':'')+'<button type="button" class="btn ghost" data-act="map">星図に戻る</button></div>'+
      (!nx&&c.next.length?`<div class="card" style="align-self:stretch"><h4>この先の星座</h4><div class="row" style="justify-content:center">${c.next.map(chip).join('')}</div></div>`:'');}
};
function draw(dir){
  const {list,i,s}=cur,sc=list[i],body=elS.querySelector('.sg-body'),last=i===list.length-1;
  body.innerHTML=`<div class="screen${dir<0?' back':''}${sc.t==='clear'?' clear':''}">${RENDER[sc.t](sc,i)}</div>`;body.scrollTop=0;
  elS.querySelector('.dots').innerHTML=list.map((_,j)=>`<i class="${j<=i?'on':''}"></i>`).join('');
  elS.querySelector('.count').textContent=`${i+1} / ${list.length}`;
  elS.querySelector('.prev').disabled=i===0;
  const nx=elS.querySelector('.next');nx.disabled=last;nx.textContent=i===list.length-2?'完了':'次へ';
  const sh=elS.querySelector('.sheet');if(sh)sh.remove();
  if(sc.fig){const host=body.querySelector('.fig-host');FIGS[sc.fig](host,sc.arg);}
  if(last&&!MM.isDone(s.id))MM.setDone(s.id,true);
  MM.typeset(body);
}
function nav(d){if(!cur)return;const j=cur.i+d;if(j<0||j>=cur.list.length)return;cur.i=j;draw(d);}
function reveal(card,all){
  const sc=cur.list[cur.i],ol=card.querySelector('.steps');let k=+card.dataset.n;
  do{const li=document.createElement('li');li.innerHTML=`<div class="sx">${tx(sc.steps[k])}</div>`;ol.appendChild(li);k++;}while(all&&k<sc.steps.length);
  card.dataset.n=k;
  if(k>=sc.steps.length){card.querySelector('.ans').hidden=false;card.querySelector('.ctl').hidden=true;const ck=elS.querySelector('.check');if(ck)ck.hidden=false;}
  else card.querySelector('[data-act=step]').textContent='次の一手を見る';
  MM.typeset(card);
}
function preSheet(){
  let sh=elS.querySelector('.sheet');if(sh){sh.remove();return;}
  const ids=preIds();sh=document.createElement('div');sh.className='sheet';
  sh.innerHTML=`<h4 style="margin:0;font-size:13px;color:var(--muted)">前提の星</h4>`+(ids.length?`<div class="row">${ids.map(chip).join('')}</div><p class="note">選ぶとその単元に移ります。あとで続きに戻れます。</p>`:'<p class="note">この星に前提はありません。</p>');
  elS.appendChild(sh);
}

/* ---- 操作 ---- */
function onClick(e){
  const b=e.target.closest('button');if(!b)return;const act=b.dataset.act;
  if(b.dataset.go)return go(b.dataset.go);
  if(b.dataset.star)return openStar(b.dataset.star);
  if(b.classList.contains('choice')){const sc=cur.list[cur.i],j=+b.dataset.j,fb=elS.querySelector('.fb'),ok=j===sc.correct;
    b.classList.add(ok?'ok':'ng');fb.hidden=false;fb.className='fb '+(ok?'ok':'ng');fb.innerHTML='<span class="sx" style="display:block">'+(ok?'正解。'+tx(sc.explain||''):'もう一度。'+tx(sc.hint||'式や図を見直してみましょう。'))+'</span>';
    if(ok)elS.querySelectorAll('.choice').forEach(x=>x.disabled=true);MM.typeset(fb);return;}
  if(act==='map')toMap();else if(act==='close')closeStar();else if(act==='prev')nav(-1);else if(act==='next')nav(1);
  else if(act==='pre')preSheet();else if(act==='ret'){const r=ret.pop();openStar(r.id,r.i);}
  else if(act==='step'||act==='all')reveal(b.closest('.solve'),act==='all');
  else if(act==='ok'){const k=cur.s.id+':'+cur.i;quiz[k]=quiz[k]?0:1;store.set('mathmap-quiz',quiz);b.classList.toggle('fill',!!quiz[k]);b.nextElementSibling.textContent=quiz[k]?'記録しました':'';}
}
elC.addEventListener('click',onClick);elS.addEventListener('click',onClick);
addEventListener('keydown',e=>{if(e.target.matches&&e.target.matches('input'))return;
  if(!elS.hidden){if(e.key==='ArrowRight')nav(1);else if(e.key==='ArrowLeft')nav(-1);else if(e.key==='Escape')closeStar();}
  else if(!elC.hidden&&e.key==='Escape')toMap();});
// スワイプで前後へ（横にスクロールできる数式や図の上では働かせない）
let sw=null;
elS.addEventListener('touchstart',e=>{const t=e.touches[0],el=e.target;sw=null;
  if(el.closest('.fig,input,.choices'))return;const sx=el.closest('.sx,.pts dd');if(sx&&sx.scrollWidth>sx.clientWidth+2)return;
  if(el.closest('.sg-body'))sw={x:t.clientX,y:t.clientY};},{passive:true});
elS.addEventListener('touchend',e=>{if(!sw)return;const t=e.changedTouches[0],dx=t.clientX-sw.x,dy=t.clientY-sw.y;sw=null;
  if(Math.abs(dx)>70&&Math.abs(dx)>2*Math.abs(dy))nav(dx<0?1:-1);},{passive:true});

/* ---- 入口 ---- */
function route(h){
  if(h.startsWith('c-')&&chById[h.slice(2)])openCh(h.slice(2));
  else if(starById[h])openStar(h);
  else if(loc.type!=='map')toMap();
}
addEventListener('hashchange',()=>{const h=location.hash.slice(1);if(h!==hashOf())route(h);});
MM.enter=id=>chById[id].stars.length>1?openCh(id):openStar(id);
MM.openStar=openStar;MM.openCh=openCh;MM.toMap=toMap;
if(location.hash.length>1)route(location.hash.slice(1));
})();
