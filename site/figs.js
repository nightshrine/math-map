/* 動かせる図。FIGS.名前(host, opt) で host の中に図とスライダーを作る */
(function(){
const C='stroke="var(--c)" stroke-width="2.4"',GOLD='stroke="var(--gold)" stroke-width="1.8"',DASH='stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 4"';
const f1=v=>v.toFixed(1);
// 数値の表示：余分な 0 を落とし、マイナスは全角の −
function n(v,d=2){if(Math.abs(v)<.5*Math.pow(10,-d))return '0';let s=v.toFixed(d);if(s.includes('.'))s=s.replace(/0+$/,'').replace(/\.$/,'');return s.replace('-','−');}
const sg=(v,d=2)=>(v<0?'− ':'+ ')+n(Math.abs(v),d);

function plot(range,w=340,h=250){
  const [x0,x1,y0,y1]=range,sx=x=>(x-x0)/(x1-x0)*w,sy=y=>h-(y-y0)/(y1-y0)*h;let s='';
  const o={sx,sy,w,h,
    grid(){
      for(let x=Math.ceil(x0);x<=x1;x++)if(x)s+=`<line x1="${f1(sx(x))}" y1="0" x2="${f1(sx(x))}" y2="${h}" stroke="var(--line)" stroke-width=".6"/>`;
      for(let y=Math.ceil(y0);y<=y1;y++)if(y)s+=`<line x1="0" y1="${f1(sy(y))}" x2="${w}" y2="${f1(sy(y))}" stroke="var(--line)" stroke-width=".6"/>`;
      s+=`<line x1="0" y1="${f1(sy(0))}" x2="${w}" y2="${f1(sy(0))}" stroke="var(--muted)" stroke-width="1.2"/><line x1="${f1(sx(0))}" y1="0" x2="${f1(sx(0))}" y2="${h}" stroke="var(--muted)" stroke-width="1.2"/>`;
      o.txt(x1,0,'x','text-anchor="end" dx="-5" dy="-5"');o.txt(0,y1,'y','dx="6" dy="12"');
      if(x1>1.2)o.txt(1,0,'1','text-anchor="middle" dy="13"');if(y1>1.2)o.txt(0,1,'1','text-anchor="end" dx="-5" dy="4"');
      return o;},
    curve(f,st,a=x0,b=x1){let d='',pen=false;const span=y1-y0;
      for(let i=0;i<=300;i++){const x=a+(b-a)*i/300,y=f(x);if(!isFinite(y)||y<y0-span||y>y1+span){pen=false;continue;}d+=(pen?'L':'M')+f1(sx(x))+','+f1(sy(y));pen=true;}
      s+=`<path d="${d}" fill="none" ${st}/>`;return o;},
    seg(xa,ya,xb,yb,st){s+=`<line x1="${f1(sx(xa))}" y1="${f1(sy(ya))}" x2="${f1(sx(xb))}" y2="${f1(sy(yb))}" ${st}/>`;return o;},
    dot(x,y,fill,r=4.5){s+=`<circle cx="${f1(sx(x))}" cy="${f1(sy(y))}" r="${r}" fill="${fill}" stroke="var(--bg2)" stroke-width="1.5"/>`;return o;},
    poly(p,st){s+=`<polygon points="${p.map(q=>f1(sx(q[0]))+','+f1(sy(q[1]))).join(' ')}" ${st}/>`;return o;},
    under(f,a,b,st,g){const p=[];for(let i=0;i<=60;i++){const x=a+(b-a)*i/60;p.push([x,f(x)]);}
      if(g)for(let i=60;i>=0;i--){const x=a+(b-a)*i/60;p.push([x,g(x)]);}else{p.push([b,0]);p.push([a,0]);}return o.poly(p,st);},
    txt(x,y,t,st=''){s+=`<text x="${f1(sx(x))}" y="${f1(sy(y))}" font-size="11" font-family="var(--f-mono)" fill="var(--muted)" ${st}>${t}</text>`;return o;},
    out:()=>s};
  return o;
}

let uid=0;
/* 図の部品：スライダーと再生ボタン、読み取り欄を持つ */
function mk(host,cfg){
  const v={},id='fg'+(++uid);cfg.sliders.forEach(q=>v[q.k]=q.v);
  host.innerHTML=`<div class="fig"><svg viewBox="0 0 340 ${cfg.h||250}" role="img" aria-label="${cfg.alt||'図'}"></svg><div class="fig-ctl">`+
    cfg.sliders.map(q=>`<label for="${id}-${q.k}"><span>${q.label} = <b id="${id}-${q.k}-o"></b></span><input type="range" id="${id}-${q.k}" data-k="${q.k}" min="${q.min}" max="${q.max}" step="${q.step}" value="${q.v}"></label>`).join('')+
    (cfg.play?`<button type="button" class="btn play">▶ ${cfg.play.label}</button>`:'')+`<p class="readout"></p></div></div>`;
  const svg=host.querySelector('svg'),read=host.querySelector('.readout');
  const upd=()=>{cfg.sliders.forEach(q=>{host.querySelector(`#${id}-${q.k}-o`).textContent=(q.fmt||(x=>n(x)))(v[q.k]);});const r=cfg.draw(v);svg.innerHTML=r.svg;read.innerHTML=r.read;};
  host.querySelectorAll('input').forEach(i=>i.addEventListener('input',()=>{v[i.dataset.k]=+i.value;upd();}));
  if(cfg.play){const pl=cfg.play,q=cfg.sliders.find(x=>x.k===pl.k),inp=host.querySelector(`#${id}-${pl.k}`);let raf=0;
    host.querySelector('.play').addEventListener('click',()=>{cancelAnimationFrame(raf);const from=pl.from!==undefined?pl.from:q.v,t0=performance.now(),ms=MM.reduced()?1:pl.ms||2400;
      (function step(t){const u=Math.min(1,(t-t0)/ms),e=1-Math.pow(1-u,2.2);let x=from+(pl.to-from)*e;x=Math.round(x/q.step)*q.step;
        v[pl.k]=Math.max(q.min,Math.min(q.max,x));inp.value=v[pl.k];upd();if(u<1&&host.isConnected)raf=requestAnimationFrame(step);})(t0);});}
  upd();
}

/* 微分係数：2点を結ぶ直線が接線に近づく */
FIGS.secant=host=>mk(host,{alt:'放物線上の2点を結ぶ直線が接線に近づく図',
  sliders:[{k:'h',label:'h（A から B までの横の距離）',min:.01,max:2,step:.01,v:1.5}],play:{k:'h',to:.01,label:'B を A に近づける',ms:2800},
  draw(v){const f=x=>x*x,h=v.h,m=(f(1+h)-1)/h,p=plot([-.6,3.4,-1,9.6]).grid();
    p.seg(-.6,1+2*(-1.6),3.4,1+2*2.4,DASH).curve(f,C).seg(-.6,1+m*(-1.6),3.4,1+m*2.4,GOLD);
    p.seg(1,1,1+h,1,DASH).seg(1+h,1,1+h,f(1+h),DASH).dot(1,1,'var(--ink)').dot(1+h,f(1+h),'var(--gold)');
    p.txt(1,1,'A','text-anchor="end" dx="-8" dy="-6" fill="var(--ink)"').txt(1+h,f(1+h),'B','dx="9" dy="4" fill="var(--gold)"');
    return {svg:p.out(),read:`平均変化率 = <i>(f(1+h) − f(1)) ÷ h</i><br>= (${n(f(1+h),4)} − 1) ÷ ${n(h)} = <b>${n(m)}</b>`+(h<=.05?'<br>点線の接線とほぼ重なる。傾きは 2 に近づく':'')};}});

/* xⁿ の微分：正方形が h だけ伸びたときに増える面積 */
FIGS.square=host=>mk(host,{alt:'1辺 x の正方形が h だけ伸びたときに増える面積の図',
  sliders:[{k:'x',label:'x',min:1,max:3,step:.1,v:2},{k:'h',label:'h',min:.02,max:1.2,step:.02,v:.8}],play:{k:'h',to:.02,label:'h を 0 に近づける',ms:2600},
  draw(v){const u=50,ox=36,oy=226,X=v.x*u,Hh=v.h*u;let s='';
    s+=`<rect x="${ox}" y="${oy-X}" width="${X}" height="${X}" fill="var(--c)" fill-opacity=".28" stroke="var(--c)" stroke-width="1.5"/>`;
    s+=`<rect x="${ox+X}" y="${oy-X}" width="${Hh}" height="${X}" fill="var(--c)" fill-opacity=".62" stroke="var(--bg2)"/><rect x="${ox}" y="${oy-X-Hh}" width="${X}" height="${Hh}" fill="var(--c)" fill-opacity=".62" stroke="var(--bg2)"/>`;
    s+=`<rect x="${ox+X}" y="${oy-X-Hh}" width="${Hh}" height="${Hh}" fill="var(--gold)" stroke="var(--bg2)"/>`;
    const t=(x,y,str,c='var(--ink)')=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="12" font-family="var(--f-mono)" fill="${c}">${str}</text>`;
    s+=t(ox+X/2,oy-X/2+4,'x²')+t(ox+X/2,oy+15,'x','var(--muted)')+t(ox+X+Hh/2,oy+15,'h','var(--muted)');
    if(v.h>=.3)s+=t(ox+X+Hh/2,oy-X/2+4,'xh')+t(ox+X/2,oy-X-Hh/2+4,'xh');if(v.h>=.45)s+=t(ox+X+Hh/2,oy-X-Hh/2+4,'h²','var(--on-c)');
    const inc=2*v.x*v.h+v.h*v.h;
    return {svg:s,read:`増えた面積 = 帯2本 + 角<br>= 2·x·h + h² = ${n(2*v.x*v.h,3)} + ${n(v.h*v.h,4)} = ${n(inc,3)}<br>h で割ると 2x + h = <b>${n(2*v.x+v.h)}</b><br>h → 0 で 2x = <i>${n(2*v.x)}</i>（角の分は消える）`};}});

/* 導関数・増減：上に y=f(x)、下に y=f′(x)。x を動かすと連動する */
FIGS.linked=(host,o)=>{const seen=new Set();
  mk(host,{h:356,alt:'関数のグラフと導関数のグラフを連動させた図',
    sliders:[{k:'x',label:'x',min:o.min,max:o.max,step:.05,v:o.x0}],play:{k:'x',from:o.min,to:o.max,label:'x を端から端まで動かす',ms:4200},
    draw(v){const x=v.x,m=o.df(x),a=plot(o.r1,340,172).grid(),b=plot(o.r2,340,172).grid();seen.add(Math.round(x*20));
      let bands='';
      if(o.bands)for(let i=0;i<68;i++){const xx=o.r1[0]+(o.r1[1]-o.r1[0])*(i+.5)/68,d=o.df(xx);bands+=`<rect x="${i*5}" y="0" width="5.2" height="172" fill="var(--${d>0?'ok':'ng'})" fill-opacity=".09"/>`;}
      a.curve(o.f,C);const L=.8/Math.sqrt(1+m*m)*1.6;a.seg(x-L,o.f(x)-m*L,x+L,o.f(x)+m*L,'stroke="var(--ink)" stroke-width="2"').dot(x,o.f(x),'var(--ink)');
      if(!o.trace||seen.size>=28)b.curve(o.df,o.trace?DASH:GOLD);
      if(o.trace)for(const k of seen)b.dot(k/20,o.df(k/20),'var(--gold)',2.6);
      b.seg(x,0,x,m,DASH).dot(x,m,Math.abs(m)<.06?'var(--gold)':m>0?'var(--ok)':'var(--ng)');
      const cap=(t)=>`<text x="8" y="16" font-size="11" font-family="var(--f-mono)" fill="var(--ink)">${t}</text>`;
      const svg=`<svg x="0" y="0" width="340" height="172" viewBox="0 0 340 172">${bands}${a.out()}${cap(o.name)}</svg><svg x="0" y="184" width="340" height="172" viewBox="0 0 340 172">${b.out()}${cap(o.dname)}</svg><line x1="0" y1="178" x2="340" y2="178" stroke="var(--line)"/>`;
      let read=`x = ${n(x)} での接線の傾き<br>f′(x) = <b>${n(m)}</b>`;
      if(o.bands)read+='<br>'+(m>.06?'傾きが正 → グラフは上り（増加）':m<-.06?'傾きが負 → グラフは下り（減少）':'傾き 0 → 山の頂上か谷の底');
      if(o.trace)read+='<br>下の点は、x ごとの傾きの記録';
      return {svg,read};}});};

/* 接線の方程式 */
FIGS.tangent=host=>mk(host,{alt:'放物線と、接点を動かせる接線の図',
  sliders:[{k:'a',label:'接点の x 座標 a',min:-2,max:2.5,step:.1,v:1}],
  draw(v){const a=v.a,p=plot([-3.2,3.2,-2.5,7.5]).grid().curve(x=>x*x,C);
    p.seg(-3.2,2*a*(-3.2-a)+a*a,3.2,2*a*(3.2-a)+a*a,GOLD).dot(a,a*a,'var(--gold)');
    return {svg:p.out(),read:`接点 (a, a²) = (${n(a)}, ${n(a*a)})<br>傾き f′(a) = 2a = <b>${n(2*a)}</b><br>接線：y = ${n(2*a)}x ${sg(-a*a)}`};}});

/* 方程式の実数解の個数：y=x³−3x と y=a の共有点 */
FIGS.roots=host=>mk(host,{alt:'3次関数のグラフと横線の共有点を数える図',
  sliders:[{k:'a',label:'a',min:-3,max:3,step:.1,v:.5}],
  draw(v){const f=x=>x*x*x-3*x,a=v.a,p=plot([-3,3,-3.6,3.6]).grid().curve(f,C).seg(-3,a,3,a,GOLD),xs=[];
    for(let x=-3;x<3;x+=.01){const u=f(x)-a,w=f(x+.01)-a;if(u===0||u*w<0){let lo=x,hi=x+.01;for(let i=0;i<30;i++){const md=(lo+hi)/2;(f(lo)-a)*(f(md)-a)<=0?hi=md:lo=md;}xs.push((lo+hi)/2);}}
    [-1,1].forEach(e=>{if(Math.abs(f(e)-a)<1e-9&&!xs.some(x=>Math.abs(x-e)<.02))xs.push(e);});
    xs.forEach(x=>p.dot(x,a,'var(--gold)'));
    return {svg:p.out(),read:`曲線 y = x³ − 3x と直線 y = ${n(a)} の共有点<br><b>${xs.length} 個</b><br>方程式 x³ − 3x = ${n(a)} の実数解も ${xs.length} 個<br>極大値 2 と極小値 −2 の間で 3 個になる`};}});

/* 不定積分：y=x²+C はどれも同じ傾き */
FIGS.family=host=>mk(host,{alt:'上下にずれた放物線の群と、同じ x での平行な接線の図',
  sliders:[{k:'x',label:'x',min:-2,max:2,step:.1,v:1},{k:'C',label:'C',min:-3,max:3,step:.5,v:0}],
  draw(v){const p=plot([-3,3,-3.6,6.4]).grid(),m=2*v.x,L=.55/Math.sqrt(1+m*m)*1.5;
    for(let c=-3;c<=3;c++){p.curve(x=>x*x+c,'stroke="var(--c)" stroke-width="1.2" opacity=".45"');p.seg(v.x-L,v.x*v.x+c-m*L,v.x+L,v.x*v.x+c+m*L,'stroke="var(--ink)" stroke-width="2"');}
    p.curve(x=>x*x+v.C,GOLD);
    return {svg:p.out(),read:`どの曲線も、x = ${n(v.x)} での接線は平行<br>傾きは 2x = <b>${n(m)}</b><br>y = x² ${sg(v.C)} を微分すると 2x<br>定数 C は微分で消える`};}});

/* 区分求積：細い長方形で面積をはさむ */
FIGS.rects=host=>mk(host,{alt:'放物線の下の面積を長方形で近似する図',
  sliders:[{k:'i',label:'長方形の本数 n',min:0,max:6,step:1,v:1,fmt:i=>String(2**i)}],play:{k:'i',from:0,to:6,label:'本数を増やしていく',ms:4200},
  draw(v){const N=2**v.i,f=x=>x*x,p=plot([-.1,1.15,-.1,1.15]).grid();
    for(let k=1;k<=N;k++){const a=(k-1)/N,b=k/N;p.poly([[a,0],[a,f(b)],[b,f(b)],[b,0]],'fill="var(--gold)" fill-opacity=".22" stroke="var(--gold)" stroke-width=".8"');
      p.poly([[a,0],[a,f(a)],[b,f(a)],[b,0]],'fill="var(--c)" fill-opacity=".5" stroke="var(--bg2)" stroke-width=".5"');}
    p.curve(f,'stroke="var(--ink)" stroke-width="2"',0,1);const U=(N+1)*(2*N+1)/(6*N*N),Lo=U-1/N;
    return {svg:p.out(),read:`幅 1/${N} の長方形が ${N} 本<br>外側（右端の高さ）の合計 = <b>${U.toFixed(4)}</b><br>内側（左端の高さ）の合計 = <i>${Lo.toFixed(4)}</i><br>本当の面積はこの間。1/3 = 0.3333…`};}});

/* 基本定理：面積 S(x) の増え方 */
FIGS.areafn=host=>mk(host,{alt:'曲線の下の面積と、幅 h の細い帯の図',
  sliders:[{k:'x',label:'x',min:.5,max:3,step:.05,v:1.5},{k:'h',label:'h（帯の幅）',min:.02,max:1,step:.02,v:.6}],play:{k:'h',to:.02,label:'帯を細くする',ms:2600},
  draw(v){const f=t=>.25*t*t+.5,F=t=>t*t*t/12+.5*t,x=v.x,h=v.h,p=plot([-.3,4.3,-.3,5.2]).grid();
    p.under(f,0,x,'fill="var(--c)" fill-opacity=".3"').under(f,x,x+h,'fill="var(--gold)" fill-opacity=".6"');
    p.poly([[x,0],[x,f(x)],[x+h,f(x)],[x+h,0]],'fill="none" stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="4 3"').curve(f,C);
    p.txt(x/2,f(x/2)/2,'S(x)','text-anchor="middle" fill="var(--ink)"').txt(x+h/2,0,'h','text-anchor="middle" dy="13" fill="var(--gold)"').txt(x,f(x),'f(x)','text-anchor="end" dx="-6" dy="-4" fill="var(--ink)"');
    const dS=F(x+h)-F(x);
    return {svg:p.out(),read:`増えた面積 S(x+h) − S(x) = ${dS.toFixed(4)}<br>点線の長方形 f(x)·h = ${(f(x)*h).toFixed(4)}<br>増えた面積 ÷ h = <b>${(dS/h).toFixed(3)}</b><br>h → 0 で f(x) = <i>${f(x).toFixed(3)}</i> に近づく`};}});

/* 定積分：符号つきの面積 */
FIGS.signed=host=>mk(host,{alt:'x軸の上を正、下を負として数える面積の図',
  sliders:[{k:'a',label:'a（下端）',min:-2,max:2,step:.1,v:0},{k:'b',label:'b（上端）',min:-2,max:2.4,step:.1,v:2}],
  draw(v){const f=x=>x*x-1,F=x=>x*x*x/3-x,p=plot([-2.6,2.6,-1.6,3.6]).grid(),lo=Math.min(v.a,v.b),hi=Math.max(v.a,v.b);
    for(let i=0;i<90&&hi>lo;i++){const x=lo+(hi-lo)*i/90,w=(hi-lo)/90,y=f(x+w/2);p.poly([[x,0],[x,y],[x+w,y],[x+w,0]],`fill="var(--${y>=0?'ok':'ng'})" fill-opacity=".4"`);}
    p.curve(f,C).seg(v.a,-1.6,v.a,3.6,DASH).seg(v.b,-1.6,v.b,3.6,DASH).txt(v.a,3.6,'a','dx="4" dy="12" fill="var(--ink)"').txt(v.b,3.6,'b','dx="4" dy="12" fill="var(--ink)"');
    const val=F(v.b)-F(v.a);
    return {svg:p.out(),read:`∫ (x² − 1) dx を a = ${n(v.a)} から b = ${n(v.b)} まで<br>F(b) − F(a) = (${n(F(v.b),3)}) − (${n(F(v.a),3)}) = <b>${n(val,3)}</b><br>x 軸より下の部分は負として数える`+(v.b<v.a?'<br>a > b なので符号が逆になっている':'')};}});

/* 2曲線の間の面積：上 − 下 の長さを集める */
FIGS.between=host=>mk(host,{alt:'直線と放物線で囲まれた部分と、縦の長さを表す線分の図',
  sliders:[{k:'x',label:'x',min:-1,max:2,step:.05,v:.5}],play:{k:'x',from:-1,to:2,label:'左から右へなぞる',ms:3200},
  draw(v){const f=x=>x+2,g=x=>x*x,x=v.x,p=plot([-2.2,3.2,-.8,5.6]).grid();
    p.under(f,-1,2,'fill="var(--c)" fill-opacity=".16"',g).under(f,-1,x,'fill="var(--c)" fill-opacity=".38"',g).curve(g,C).curve(f,'stroke="var(--ink)" stroke-width="2"');
    p.seg(x,g(x),x,f(x),'stroke="var(--gold)" stroke-width="3.5"').dot(x,f(x),'var(--gold)',3.5).dot(x,g(x),'var(--gold)',3.5);
    const acc=(x*x/2+2*x-x*x*x/3)-(.5-2+1/3);
    return {svg:p.out(),read:`x = ${n(x)} での縦の長さ（上 − 下）<br>(x + 2) − x² = <b>${n(f(x)-g(x),3)}</b><br>−1 からここまでの面積 = <i>${n(acc,3)}</i><br>x = 2 まで集めると 9/2 = 4.5`};}});

/* 今までの単元のグラフ（スライダーで関数を動かす） */
FIGS.legacy=(host,d)=>mk(host,{alt:'関数のグラフ',
  sliders:d.params.map(q=>({k:q.n,label:q.n,min:q.min,max:q.max,step:q.step,v:q.v})),
  draw(v){const p=plot(d.range).grid();if(d.g)p.curve(x=>d.g(x,v),DASH);p.curve(x=>d.f(x,v),C);
    if(d.tangent){const a=v[d.tangent],e=1e-4,m=(d.f(a+e,v)-d.f(a-e,v))/(2*e),fa=d.f(a,v),x0=d.range[0],x1=d.range[1];p.seg(x0,fa+m*(x0-a),x1,fa+m*(x1-a),'stroke="var(--ink)" stroke-width="1.4"').dot(a,fa,'var(--ink)');}
    (d.pts?d.pts(v):[]).forEach(q=>p.dot(q[0],q[1],'var(--gold)'));
    return {svg:p.out(),read:MM.esc(d.cap(v))+(d.note?`<br><span class="note">${MM.esc(d.note)}</span>`:'')};}});
})();
