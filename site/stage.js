/* 星座（章の中の道）と、星のステージ（縦にスクロールして読み進める） */
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
const chip=id=>starById[id]?`<button type="button" class="chip" data-go="${id}" style="--c:${MM.col(chById[starById[id].ch])}">${esc(nameOf(id))}</button>`:'';
const retPill=()=>ret.length?`<button type="button" class="ret" data-act="ret">↩ 〈${esc(nameOf(ret[ret.length-1].id))}〉の続きに戻る</button>`:'';
const paras=b=>(Array.isArray(b)?b:[b]).map(p=>`<p class="sx">${tx(p)}</p>`).join('');
const table=t=>`<div class="sx"><table class="inc"><tr>${t.head.map(h=>`<th>${tx(h)}</th>`).join('')}</tr>${t.rows.map(r=>`<tr>${r.map(x=>`<td>${tx(x)}</td>`).join('')}</tr>`).join('')}</table></div>`;

/* ---- 星図に戻る ---- */
function toMap(){loc={type:'map'};ret.length=0;hide(elC);hide(elS);syncHash();MM.refresh();}

/* ---- 星座 ---- */
function openCh(id){
  const c=chById[id];loc={type:'ch',id};
  const OFF=[-64,-22,44,70,26,-40];let y=34,rows='',d='',sec=null,px=0,py=0;
  c.stars.forEach((s,i)=>{
    if(s.sec&&s.sec!==sec){sec=s.sec;const two=sec.length>(innerWidth<520?20:36);if(two)y+=10;rows+=`<p class="sec" style="top:${y}px"><span>${esc(sec)}</span></p>`;y+=two?72:60;}
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
function blocksOf(s){
  const t=chById[s.ch].topic;let list;
  if(s.legacy){
    list=[{t:'intro',lead:t.lead,why:t.why}];
    if(t.demo)list.push({t:'fig',fig:'legacy',arg:t.demo,title:'動かして確かめる'});
    list.push({t:'points',items:t.points,trap:t.trap},{t:'ex',q:t.ex.q,steps:t.ex.steps,a:t.ex.a});
    (PROBLEMS[t.id]||[]).forEach(q=>list.push(Object.assign({t:'quiz'},q)));
  }else list=s.screens.slice();
  list.push({t:'end'});return list;
}
const preIds=()=>cur.s.pre&&cur.s.pre.length?cur.s.pre:(cur.s.kind==='sum'?cur.c.pre:[]);
function order(n,key){let h=2166136261;for(const ch of key)h=Math.imul(h^ch.charCodeAt(0),16777619)>>>0;const a=[...Array(n).keys()];
  for(let k=n-1;k>0;k--){h=Math.imul(h^(h>>>13),1274126177)>>>0;const j=h%(k+1);[a[k],a[j]]=[a[j],a[k]];}return a;}
const quizNo=i=>cur.list.slice(0,i+1).filter(x=>x.t==='quiz').length;
// 解き方を1手ずつ見せる枠（例題・練習問題・導出で共通）
const solve=(sc,head,ansLabel)=>`<div class="card solve" data-n="0"><h4>${head}</h4><ol class="steps"></ol><p class="ans" hidden>${ansLabel}　${tx(sc.a)}</p>`+
  `<div class="row ctl"><button type="button" class="btn" data-act="step">最初の一手を見る</button><button type="button" class="btn ghost" data-act="all">全部見る</button></div></div>`;
const RENDER={
  intro(sc){const s=cur.s,pre=preIds();
    return `<p class="kind">${s.kind==='why'?'なぜを確かめる星':s.kind==='sum'?'章のまとめ':'本編の星'}</p><h3 class="hero">${esc(s.kind==='sum'?cur.c.title+'のまとめ':s.name)}</h3><p class="lead">${tx(sc.lead)}</p>`+
      (sc.why?`<div class="card"><h4>なぜ学ぶか</h4><p>${tx(sc.why)}</p></div>`:'')+(sc.note?`<p class="note">${tx(sc.note)}</p>`:'')+
      (pre.length?`<div class="card"><h4>前提の星（分からなくなったら、ここから戻れます）</h4><div class="row">${pre.map(chip).join('')}</div></div>`:'');},
  text(sc){return `<p class="kind">考え方</p><h3>${tx(sc.title)}</h3><div class="card${cur.s.kind==='why'?' why':''}">${paras(sc.body)}${sc.table?table(sc.table):''}${sc.after?paras(sc.after):''}</div>`;},
  fig(sc){return `<p class="kind">図で見る</p><h3>${tx(sc.title)}</h3><div class="fig-host"></div>${sc.text?`<p>${tx(sc.text)}</p>`:''}`;},
  derive(sc){return `<p class="kind">導き方を追う</p><h3>${tx(sc.title)}</h3>${sc.body?paras(sc.body):''}${sc.fig?'<div class="fig-host"></div>':''}${solve(sc,'1行ずつ追う','結論')}`;},
  points(sc){return `<p class="kind">要点</p><h3>この星の要点</h3><div class="card"><dl class="pts">${sc.items.map(q=>`<div><dt>${tx(q[0])}</dt><dd>${tx(q[1])}</dd></div>`).join('')}</dl></div>`+
    (sc.trap?`<div class="card"><h4>つまずきやすい所</h4><p class="sx">${tx(sc.trap)}</p></div>`:'');},
  ex(sc){return `<p class="kind">例題</p><div class="card"><p class="sx q">${tx(sc.q)}</p>${sc.fig?'<div class="fig-host"></div>':''}</div>${solve(sc,'解き方','答え')}`;},
  quiz(sc,i){const tot=cur.list.filter(x=>x.t==='quiz').length;
    return `<p class="plabel"><span class="lv lv-${LV[sc.lv]}">${sc.lv}</span>練習問題 ${quizNo(i)} / ${tot}${sc.with?`<span>組み合わせる単元</span>${sc.with.map(chip).join('')}`:''}</p>`+
      `<div class="card"><p class="sx q">${tx(sc.q)}</p>${sc.fig?'<div class="fig-host"></div>':''}</div>${solve(sc,'解き方','答え')}`+
      `<div class="row check" hidden><button type="button" class="btn${quiz[cur.s.id+':'+i]?' fill':''}" data-act="ok">できた</button><span class="note"></span></div>`;},
  ask(sc,i){return `<p class="kind">自分で確かめる</p><h3>${tx(sc.title)}</h3>${sc.body?`<div class="card why">${paras(sc.body)}</div>`:''}${sc.fig?'<div class="fig-host"></div>':''}`+
    `<p class="sx q">${tx(sc.q)}</p><div class="choices">${order(sc.choices.length,cur.s.id+':'+i).map(j=>`<button type="button" class="choice" data-j="${j}">${tx(sc.choices[j])}</button>`).join('')}</div><p class="fb" hidden></p>`;},
  end(){return '<div class="end"></div>';}
};
const TOC={intro:()=>'ねらい',text:s=>s.title,fig:s=>s.title,derive:s=>s.title,ask:s=>s.title,points:()=>'要点',ex:()=>'例題',end:()=>'星を灯す'};
function drawEnd(burst){
  const s=cur.s,c=cur.c,nx=c.stars[c.stars.indexOf(s)+1],dn=MM.isDone(s.id),el=elS.querySelector('.end');
  const qs=cur.list.map((x,i)=>x.t==='quiz'?i:-1).filter(i=>i>=0),ok=qs.filter(i=>quiz[s.id+':'+i]).length,nm=esc(s.kind==='sum'?c.title:s.name);
  el.innerHTML=(dn?`<div class="burst${burst?' go':''}"></div><h3>〈${nm}〉の星が灯りました</h3>`:`<h3>ここまで読めたら、星を灯しましょう</h3>`)+
    (qs.length?`<p class="note">練習問題 ${qs.length} 問のうち、「できた」は ${ok} 問</p>`:'')+
    `<div class="row" style="justify-content:center">${dn?'':'<button type="button" class="btn fill big" data-act="light">この星を灯す</button>'}`+
    (dn&&nx?`<button type="button" class="btn fill big" data-star="${nx.id}">次の星へ：${esc(nx.name)}</button>`:'')+
    (c.stars.length>1?'<button type="button" class="btn ghost" data-act="close">星座に戻る</button>':'')+'<button type="button" class="btn ghost" data-act="map">星図に戻る</button>'+
    (dn?'<button type="button" class="btn ghost" data-act="unlight">灯りを消す</button>':'')+'</div>'+
    (dn&&!nx&&c.next.length?`<div class="card" style="align-self:stretch"><h4>この先の星座</h4><div class="row" style="justify-content:center">${c.next.map(chip).join('')}</div></div>`:'');
}
function openStar(id,top){
  const s=starById[id];if(!s)return;const c=chById[s.ch],list=blocksOf(s);
  cur={s,c,list};loc={type:'star',id};
  elS.style.setProperty('--c',MM.col(c));elS.classList.toggle('is-why',s.kind==='why');
  let toc='',seenQ=false;
  list.forEach((sc,i)=>{let lb;if(sc.t==='quiz'){if(seenQ)return;seenQ=true;lb='練習問題';}else lb=TOC[sc.t](sc);
    toc+=`<button type="button" data-jump="${i}">${tx(lb)}</button>`;});
  elS.innerHTML=`<div class="l-head"><button type="button" class="icon-btn" data-act="close" aria-label="閉じる">✕</button><div class="tt"><p class="crumb">${MM.region(c)} ／ ${esc(c.title)}</p><h2>${esc(s.name)}</h2></div>`+
    `<button type="button" class="icon-btn" data-act="pre">前提</button></div><div class="prog"><i></i></div>${retPill()}`+
    `<nav class="toc" aria-label="この星の目次">${toc}</nav><div class="sg-body"><div class="doc">`+
    list.map((sc,i)=>`<section class="blk blk-${sc.t}" data-i="${i}">${RENDER[sc.t](sc,i)}</section>`).join('')+'</div></div>';
  const body=elS.querySelector('.sg-body');
  body.querySelectorAll('.fig-host').forEach(h=>{const sc=list[+h.closest('.blk').dataset.i];
    try{FIGS[sc.fig](h,sc.arg);}catch(e){h.innerHTML='<p class="note">図を表示できませんでした。</p>';}});
  drawEnd(false);
  show(elS);hide(elC,true);syncHash();
  body.scrollTop=top||0;
  // 画面の下にある部分は、スクロールで入ってきたときにふわっと出す
  if(!MM.reduced()){const vh=body.clientHeight;body.querySelectorAll('.blk').forEach(b=>{if(b.offsetTop>body.scrollTop+vh)b.classList.add('pre');});}
  body.addEventListener('scroll',onScroll,{passive:true});onScroll();
  MM.typeset(body);
}
let tick=0;
function onScroll(){if(tick)return;tick=requestAnimationFrame(()=>{tick=0;
  const body=elS.querySelector('.sg-body');if(!body)return;const top=body.scrollTop,vh=body.clientHeight,max=body.scrollHeight-vh;
  elS.querySelector('.prog i').style.width=(max>0?Math.min(1,top/max)*100:100)+'%';
  let curI=0;body.querySelectorAll('.blk').forEach(b=>{if(b.offsetTop<top+vh-70)b.classList.remove('pre');if(b.offsetTop<=top+vh*.35)curI=+b.dataset.i;});
  let on=null;elS.querySelectorAll('.toc button').forEach(b=>{if(+b.dataset.jump<=curI)on=b;b.classList.remove('on');});if(on)on.classList.add('on');});}
function closeStar(){if(!cur)return toMap();cur.c.stars.length>1?openCh(cur.c.id):toMap();}
function go(id){if(cur&&loc.type==='star')ret.push({id:cur.s.id,top:elS.querySelector('.sg-body').scrollTop});(chById[id]&&chById[id].stars.length>1)?openCh(id):openStar(id);}
function reveal(card,all){
  const sc=cur.list[+card.closest('.blk').dataset.i],ol=card.querySelector('.steps');let k=+card.dataset.n;
  do{const li=document.createElement('li');li.innerHTML=`<div class="sx">${tx(sc.steps[k])}</div>`;ol.appendChild(li);k++;}while(all&&k<sc.steps.length);
  card.dataset.n=k;
  if(k>=sc.steps.length){card.querySelector('.ans').hidden=false;card.querySelector('.ctl').hidden=true;const ck=card.closest('.blk').querySelector('.check');if(ck)ck.hidden=false;}
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
  if(b.dataset.jump){const body=elS.querySelector('.sg-body'),t=body.querySelector(`.blk[data-i="${b.dataset.jump}"]`);body.scrollTo({top:t.offsetTop-8,behavior:MM.reduced()?'auto':'smooth'});return;}
  if(b.classList.contains('choice')){const blk=b.closest('.blk'),sc=cur.list[+blk.dataset.i],j=+b.dataset.j,fb=blk.querySelector('.fb'),ok=j===sc.correct;
    b.classList.add(ok?'ok':'ng');fb.hidden=false;fb.className='fb '+(ok?'ok':'ng');fb.innerHTML='<span class="sx" style="display:block">'+(ok?'正解。'+tx(sc.explain||''):'もう一度。'+tx(sc.hint||'式や図を見直してみましょう。'))+'</span>';
    if(ok)blk.querySelectorAll('.choice').forEach(x=>x.disabled=true);MM.typeset(fb);return;}
  if(act==='map')toMap();else if(act==='close')closeStar();
  else if(act==='pre')preSheet();else if(act==='ret'){const r=ret.pop();openStar(r.id,r.top);}
  else if(act==='step'||act==='all')reveal(b.closest('.solve'),act==='all');
  else if(act==='ok'){const k=cur.s.id+':'+b.closest('.blk').dataset.i;quiz[k]=quiz[k]?0:1;store.set('mathmap-quiz',quiz);b.classList.toggle('fill',!!quiz[k]);b.nextElementSibling.textContent=quiz[k]?'記録しました':'';drawEnd(false);}
  else if(act==='light'){MM.setDone(cur.s.id,true);drawEnd(true);}
  else if(act==='unlight'){MM.setDone(cur.s.id,false);drawEnd(false);}
}
elC.addEventListener('click',onClick);elS.addEventListener('click',onClick);
addEventListener('keydown',e=>{if(e.target.matches&&e.target.matches('input'))return;
  if(e.key!=='Escape')return;if(!elS.hidden)closeStar();else if(!elC.hidden)toMap();});

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
