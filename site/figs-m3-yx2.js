/* 中学3年「関数 y=ax²」の図（FIGS.m3yx2_*）。グラフと a の値、変域、変化の割合、放物線と直線、利用の図 */
(function(){
const {plot,draw,n,sg,mk,C,GOLD,DASH}=FIG;
const f=v=>v.toFixed(1);
const fill=(col,op,sw=1.2)=>`fill="var(--${col})" fill-opacity="${op}" stroke="var(--ink)" stroke-width="${sw}" stroke-linejoin="round"`;
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
const rect=(d,x,y,w,h,st)=>d.poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],st);
const M='var(--muted)',G='var(--gold)',CC='var(--c)';
const HALO='paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round"';
const par=x=>x<0?`(${n(x)})`:n(x);
const AX='stroke="var(--muted)" stroke-width="1.2"';
const THIN='stroke="var(--c)" stroke-width="1.6" opacity=".4"';
const GT='stroke="var(--gold)" stroke-width="4" stroke-linecap="round"';
// y = mx + k の式
const ln=(m,k)=>'y = '+(m===0?n(k):(m===1?'':m===-1?'−':n(m))+'x'+(k?' '+sg(k):''));
// ax² の式（a = 1, −1 のときは係数を書かない）
const ax2=a=>(a===1?'':a===-1?'−':n(a))+'x²';

/* ---- 斜面をころがるボール：y = 2x² ---- */
FIGS.m3yx2_shamen=host=>mk(host,{alt:'斜面をころがるボールの、1秒ごとの位置を示した図。進む距離は時間の2乗に比例する',h:230,
  sliders:[{k:'x',label:'時間 x（秒）',min:0,max:4,step:.5,v:1}],play:{k:'x',from:0,to:4,label:'ボールをころがす',ms:3600},
  draw(v){const x=v.x,d=draw(),S=[22,64],ux=.9096,uy=.4157,P=s=>[S[0]+ux*10*s,S[1]+uy*10*s],E=P(32.4),y=2*x*x;
    d.poly([S,E,[S[0],E[1]]],'fill="var(--line)" fill-opacity=".45" stroke="none"');d.line(S[0],S[1],E[0],E[1],'stroke="var(--ink)" stroke-width="1.8"');
    [0,1,2,3,4].forEach(t=>{const q=P(2*t*t);d.line(q[0],q[1],q[0]+uy*7,q[1]-ux*7,AX);tx(d,q[0]+uy*30,q[1]-ux*30+4,String(t),t<=x?G:M,11);tx(d,q[0]-uy*14,q[1]+ux*14+4,String(2*t*t),M,11);});
    const b=P(y);d.circle(b[0]+uy*8,b[1]-ux*8,7,'fill="var(--c)" stroke="var(--ink)" stroke-width="1.4"');
    tx(d,332,26,'斜面の上の数：時間（秒）',M,11,'end');tx(d,332,43,'斜面の下の数：距離（m）',M,11,'end');
    return {svg:d.out(),read:`x = ${n(x)} 秒後、y = 2 × ${n(x)}² = <b>${n(y)}</b> m`+(x===0?'<br>ころがり始める':x===1?'<br>1 秒後までに 2 m 進む':`<br>時間は 1 秒のときの ${n(x)} 倍<br>距離は 2 m の ${n(x)}² = <b>${n(x*x)}</b> 倍`)};}});

/* ---- 点を細かくとっていくと、なめらかな曲線になる ---- */
FIGS.m3yx2_ten=host=>{const ST=[1,.5,.25,.1];
  mk(host,{alt:'y = x² の表の点を、きざみを細かくしながら座標平面に打っていく図',
  sliders:[{k:'k',label:'x のきざみ',min:0,max:4,step:1,v:0,fmt:k=>k<4?String(ST[k]):'すべての x'}],play:{k:'k',from:0,to:4,label:'きざみを細かくしていく',ms:5000},
  draw(v){const p=plot([-3.6,3.6,-1.2,9.8]).grid();let cnt=0;
    if(v.k===4)p.curve(x=>x*x,C,-3.13,3.13);
    else{const st=ST[v.k],N=Math.round(3/st);for(let i=-N;i<=N;i++){const x=i*st;p.dot(x,x*x,v.k<2?'var(--gold)':'var(--c)',v.k===3?2.2:v.k===2?3:4.2);cnt++;}}
    return {svg:p.out(),read:v.k===4?'すべての x について点をとると、なめらかな曲線になる<br>この曲線を <b>放物線</b> という':`x を ${ST[v.k]} きざみにとって、点 (x, x²) を打つ<br>−3 から 3 までで、点は <b>${cnt}</b> 個`+(v.k>=2?'<br>点が並んで、なめらかな曲線が見えてくる':'<br>点と点の間は、まだ分からない')};}});};

/* ---- a の値とグラフ ---- */
FIGS.m3yx2_a=host=>mk(host,{alt:'y = ax² のグラフ。a の値を変えると、開く向きと開き方が変わる',
  sliders:[{k:'a',label:'a',min:-3,max:3,step:.25,v:2}],play:{k:'a',from:3,to:-3,label:'a を 3 から −3 まで動かす',ms:5200},
  draw(v){const a=v.a,p=plot([-6,6,-4.4,4.4]).grid().curve(x=>x*x,DASH);let r;
    if(a!==0){p.curve(x=>a*x*x,C).seg(1,0,1,a,'stroke="var(--gold)" stroke-width="2.4"').dot(1,1,'var(--muted)',3).dot(1,a,'var(--gold)');
      p.txt(1,a,`(1, ${n(a)})`,`dx="9" dy="${a>0?-4:12}" fill="var(--gold)" ${HALO}`);}
    if(a===0)r='a = 0 のときは y = 0 で、グラフは x 軸に重なる<br>関数 y = ax² では、a は 0 でない数';
    else r=`y = ${ax2(a)}（点線は y = x²）<br>y = x² のグラフ上の各点の y 座標を ${n(a)} 倍した点の集まり<br>${a>0?'a > 0：<b>上に開く</b>':'a < 0：<b>下に開く</b>'}<br>`+(Math.abs(a)>1?'a の絶対値が 1 より大きい：y = x² より開き方が小さい':Math.abs(a)<1?'a の絶対値が 1 より小さい：y = x² より開き方が大きい':a===1?'y = x² と同じグラフ':'y = x² のグラフと、x 軸について対称');
    return {svg:p.out(),read:r.replace(/ < /g,' ＜ ').replace(/ > /g,' ＞ ')};}});

/* ---- 値の増減 ---- */
FIGS.m3yx2_zogen=host=>mk(host,{alt:'y = ax² のグラフ上を点が動く図。x が増加するとき、y が増加する部分と減少する部分を色分けしている',
  sliders:[{k:'x',label:'x',min:-4,max:4,step:.25,v:-3},{k:'s',label:'a の値',min:1,max:2,step:1,v:1,fmt:s=>s===1?'0.5（正の数）':'−0.5（負の数）'}],play:{k:'x',from:-4,to:4,label:'x を増加させる',ms:4200},
  draw(v){const a=v.s===1?.5:-.5,x=v.x,g=t=>a*t*t,up=a>0,p=plot(up?[-5,5,-1.2,8.8]:[-5,5,-8.8,1.2]).grid();
    const DN='stroke="var(--ng)" stroke-width="2.6"',UP='stroke="var(--ok)" stroke-width="2.6"';
    p.curve(g,up?DN:UP,-4.2,0).curve(g,up?UP:DN,0,4.2).seg(x,0,x,g(x),DASH).dot(x,g(x),'var(--ink)',5);
    p.txt(-4.4,up?5:-5,up?'減少':'増加',`text-anchor="middle" fill="var(--${up?'ng':'ok'})" ${HALO}`).txt(4.4,up?5:-5,up?'増加':'減少',`text-anchor="middle" fill="var(--${up?'ok':'ng'})" ${HALO}`);
    return {svg:p.out(),read:`y = ${ax2(a)} で、x = ${n(x)} のとき y = <b>${n(g(x))}</b><br>`+(x===0?`x = 0 のとき、y は${up?'最小値':'最大値'} 0 をとる`:x<0?`x ＜ 0 の範囲：x が増加すると、y は<b>${up?'減少':'増加'}</b>する`:`x ＞ 0 の範囲：x が増加すると、y は<b>${up?'増加':'減少'}</b>する`)};}});

/* ---- x の変域と y の変域 ---- */
FIGS.m3yx2_heniki=host=>mk(host,{alt:'y = ax² のグラフで、x の変域に対応する部分と、y の変域を太線で示した図',
  sliders:[{k:'p',label:'x の変域の左端',min:-4,max:3,step:.5,v:-1},{k:'q',label:'x の変域の右端',min:-3,max:4,step:.5,v:3},{k:'s',label:'a の値',min:1,max:2,step:1,v:1,fmt:s=>s===1?'0.5':'−0.5'}],
  draw(v){const a=v.s===1?.5:-.5,up=a>0,g=t=>a*t*t,lo=v.p,hi=v.q,p=plot(up?[-5,5,-1.2,8.8]:[-5,5,-8.8,1.2]).grid().curve(g,THIN);
    if(lo>=hi)return {svg:p.out(),read:'右端を、左端より大きい値にしてください'};
    const has0=lo<=0&&hi>=0,ys=[g(lo),g(hi)].concat(has0?[0]:[]),y0=Math.min(...ys),y1=Math.max(...ys);
    p.seg(lo,g(lo),lo,0,DASH).seg(hi,g(hi),hi,0,DASH).seg(lo,g(lo),0,g(lo),DASH).seg(hi,g(hi),0,g(hi),DASH);
    p.curve(g,'stroke="var(--c)" stroke-width="3.2"',lo,hi).seg(lo,0,hi,0,GT).seg(0,y0,0,y1,GT).dot(lo,g(lo),'var(--c)').dot(hi,g(hi),'var(--c)');
    const yl=`${n(y0)} ≦ y ≦ ${n(y1)}`;
    return {svg:p.out(),read:`y = ${ax2(a)}、x の変域 ${n(lo)} ≦ x ≦ ${n(hi)}<br>x = ${n(lo)} のとき y = ${n(g(lo))}、x = ${n(hi)} のとき y = ${n(g(hi))}<br>`+(has0?`変域に x = 0 をふくむので、${up?'最小値':'最大値'}は 0`:'変域に x = 0 をふくまないので、両端の値が最小と最大')+`<br>y の変域 <b>${yl}</b>`};}});

/* ---- 変化の割合：2点を結ぶ直線の傾き。arg.sum があれば a を選べて、a(p+q) とくらべる ---- */
FIGS.m3yx2_wariai=(host,arg)=>{const sum=!!(arg&&arg.sum),AS=[1,2,.5,-1];
  mk(host,{alt:'放物線上の2点 A, B を結ぶ直線と、x の増加量、y の増加量を示した図',
  sliders:(sum?[{k:'p',label:'p',min:-3,max:2,step:.5,v:1},{k:'q',label:'q',min:-2,max:3,step:.5,v:3},{k:'i',label:'a',min:0,max:3,step:1,v:0,fmt:i=>n(AS[i])}]
    :[{k:'p',label:'A の x 座標',min:-4,max:3,step:.5,v:1},{k:'q',label:'B の x 座標',min:-3,max:4,step:.5,v:3}]),
  draw(v){const a=sum?AS[v.i]:.5,g=t=>a*t*t,W=sum?3.6:4.6,H=Math.abs(a)*(sum?9.9:17.6),R=a>0?[-W,W,-H*.12,H]:[-W,W,-H,H*.12],p=plot(R).grid().curve(g,C),lo=Math.min(v.p,v.q),hi=Math.max(v.p,v.q);
    if(lo===hi){p.dot(lo,g(lo),'var(--ink)');return {svg:p.out(),read:'2点が重なっている<br>x の増加量が 0 なので、変化の割合は求められない'};}
    const dy=g(hi)-g(lo),dx=hi-lo,m=dy/dx;
    p.seg(-W,g(lo)+m*(-W-lo),W,g(lo)+m*(W-lo),GOLD).seg(lo,g(lo),hi,g(lo),DASH).seg(hi,g(lo),hi,g(hi),DASH).dot(lo,g(lo),'var(--ink)').dot(hi,g(hi),'var(--ink)');
    p.txt((lo+hi)/2,g(lo),n(dx),`text-anchor="middle" dy="${dy>=0?14:-7}" fill="var(--c)" ${HALO}`).txt(hi,(g(lo)+g(hi))/2,n(dy),`${hi>W-.9?'text-anchor="end" dx="-7"':'dx="7"'} dy="4" fill="var(--c)" ${HALO}`);
    p.txt(lo,g(lo),'A',`text-anchor="end" dx="-8" dy="${dy>=0?4:-6}" fill="var(--ink)" ${HALO}`).txt(hi,g(hi),'B',`text-anchor="end" dx="-8" dy="${dy>=0?-5:14}" fill="var(--ink)" ${HALO}`);
    return {svg:p.out(),read:sum?`y = ${ax2(a)} で、x が p = ${n(lo)} から q = ${n(hi)} まで増加<br>変化の割合 = (${n(g(hi))} − ${par(g(lo))}) ÷ (${n(hi)} − ${par(lo)}) = <b>${n(m)}</b><br>a(p + q) = ${n(a)} × (${n(lo)} + ${par(hi)}) = <b>${n(a*(lo+hi))}</b>`
      :`y = 0.5x² で、x が ${n(lo)} から ${n(hi)} まで増加<br>x の増加量 = ${n(hi)} − ${par(lo)} = ${n(dx)}<br>y の増加量 = ${n(g(hi))} − ${par(g(lo))} = ${n(dy)}<br>変化の割合 = ${par(dy)} ÷ ${n(dx)} = <b>${n(m)}</b>（直線 AB の傾き）`};}});};

/* ---- なぜ：q² − p² を長方形に並べかえる ---- */
FIGS.m3yx2_lji=host=>mk(host,{alt:'1辺 q の正方形から1辺 p の正方形を切り取った形を、縦 q−p、横 q+p の長方形に並べかえる図',
  sliders:[{k:'t',label:'並べかえ（0 から 1 へ）',min:0,max:1,step:.02,v:0},{k:'p',label:'p（q は 4 に固定）',min:1,max:3,step:1,v:2}],play:{k:'t',from:0,to:1,label:'長方形に並べかえる',ms:3400},
  draw(v){const q=4,b=v.p,t=v.t,u=27,L=q*u,m=(q-b)*u,B=b*u,x0=74,yb=190,d=draw();
    rect(d,x0+m,yb-L,B,B,'stroke="var(--muted)" stroke-width="1.2" fill="none" stroke-dasharray="4 4"');tx(d,x0+m+B/2,yb-L+B/2+4,'p²',M);
    rect(d,x0,yb-m,L,m,fill('c',.32));
    const c0=[x0+m/2,yb-m-B/2],c1=[x0+L+B/2,yb-m/2],cx=c0[0]+(c1[0]-c0[0])*t,cy=c0[1]+(c1[1]-c0[1])*t,th=Math.PI/2*t,co=Math.cos(th),si=Math.sin(th);
    d.poly([[-m/2,-B/2],[m/2,-B/2],[m/2,B/2],[-m/2,B/2]].map(z=>[cx+z[0]*co-z[1]*si,cy+z[0]*si+z[1]*co]),fill('gold',.4));
    if(t<.01){tx(d,x0+L/2,yb+16,'q',M);tx(d,x0-9,yb-L/2+4,'q',M,12,'end');tx(d,x0+m+B/2,yb-L-8,'p',M);}
    if(t>.99){tx(d,x0+(L+B)/2,yb+16,'q + p',M);tx(d,x0-9,yb-m/2+4,'q − p',M,12,'end');}
    const S=q*q-b*b;
    return {svg:d.out(),read:`p = ${b}、q = 4<br>`+(t<.01?`y の増加量 q² − p² = 16 − ${b*b} = <b>${S}</b>`:t>.99?`縦 q − p = ${q-b}（x の増加量）、横 q + p = ${q+b}<br>変化の割合 = ${S} ÷ ${q-b} = <b>${q+b}</b>（横の長さ q + p）`:'面積を変えずに、長方形に並べかえている途中')};}});

/* ---- 利用：速さと制動距離 ---- */
FIGS.m3yx2_seido=host=>mk(host,{alt:'自動車がブレーキをかけてから止まるまでに進む距離を、速さごとに示した図',h:212,
  sliders:[{k:'v',label:'速さ x（時速 km）',min:20,max:100,step:10,v:60}],play:{k:'v',from:20,to:100,label:'速さを上げていく',ms:4400},
  draw(v){const x=v.v,y=.005*x*x,d=draw(),x0=46,u=5.4,yr=118,X=s=>x0+s*u;
    const car=(xf,st)=>{d.path(`M${f(xf-34)},${yr-5} l0,-9 l8,0 l5,-8 l12,0 l5,8 l4,0 l0,9 Z`,st);d.circle(xf-26,yr-5,4,st).circle(xf-8,yr-5,4,st);};
    d.line(8,yr,334,yr,'stroke="var(--ink)" stroke-width="1.6"');
    for(let s=0;s<=50;s+=10){d.line(X(s),yr,X(s),yr+6,AX);tx(d,X(s),yr+21,String(s),M,10);}tx(d,X(50)+20,yr+21,'m',M,10);
    car(X(0),'fill="none" stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="3 3"');car(X(y),'fill="var(--c)" fill-opacity=".8" stroke="var(--ink)" stroke-width="1.2"');
    d.line(X(0),yr-40,X(y),yr-40,'stroke="var(--gold)" stroke-width="3"').line(X(0),yr-46,X(0),yr-34,'stroke="var(--gold)" stroke-width="2"').line(X(y),yr-46,X(y),yr-34,'stroke="var(--gold)" stroke-width="2"');
    tx(d,(X(0)+X(y))/2,yr-48,`${n(y)} m`,G);tx(d,X(0),yr-62,'ブレーキ',M,10);
    d.line(X(0),yr+44,X(y/4),yr+44,'stroke="var(--muted)" stroke-width="3"');tx(d,X(y/4)+8,yr+48,`時速 ${x/2} km のとき ${n(y/4)} m`,M,11,'start');
    return {svg:d.out(),read:`時速 ${x} km のとき、制動距離は 0.005 × ${x}² = <b>${n(y)}</b> m<br>半分の速さ（時速 ${x/2} km）のときは ${n(y/4)} m<br>速さが 2 倍になると、制動距離は 4 倍になる`};}});

/* ---- 利用：動く三角形と長方形の重なり ---- */
const kasanari=(d,x,yb)=>{const u=12,X0=176,P=(a,b)=>[X0+a*u,yb-b*u];
  d.line(60,yb,330,yb,'stroke="var(--muted)" stroke-width="1.2"');tx(d,326,yb+14,'ℓ',M,11);
  d.poly([P(0,0),P(9,0),P(9,6),P(0,6)],fill('c',.16,1.4));d.poly([P(x,0),P(x-6,0),P(x-6,6)],fill('ok',.2,1.4));
  if(x>0){d.poly(x<=6?[P(0,0),P(x,0),P(0,x)]:[P(x,0),P(x-6,0),P(x-6,6)],'fill="var(--gold)" fill-opacity=".55" stroke="none"');}
  tx(d,P(x,0)[0]+3,yb+15,'A');tx(d,P(x-6,0)[0]-3,yb+15,'C');tx(d,P(x-6,6)[0],P(x-6,6)[1]-7,'B');};
FIGS.m3yx2_kasanari=host=>mk(host,{alt:'直角二等辺三角形が直線にそって動き、長方形と重なる部分の面積が変わる図。下に、時間と面積のグラフ',h:306,
  sliders:[{k:'x',label:'時間 x（秒）',min:0,max:6,step:.5,v:2}],play:{k:'x',from:0,to:6,label:'三角形を動かす',ms:4200},
  draw(v){const x=v.x,y=.5*x*x,d=draw(),p=plot([-1.3,7.3,-3.4,21.4],340,170).grid();
    kasanari(d,x,104);
    p.curve(t=>.5*t*t,C,0,6).seg(x,0,x,y,DASH).seg(0,y,x,y,DASH).dot(x,y,'var(--gold)').dot(6,18,'var(--c)',3);
    p.txt(6,18,'(6, 18)',`text-anchor="end" dx="-9" dy="-1" fill="var(--muted)" ${HALO}`).txt(7.3,0,'（秒）','text-anchor="end" dx="-16" dy="13"').txt(0,21.4,'（cm²）','dx="16" dy="12"');
    const svg=`${d.out()}<line x1="0" y1="128" x2="340" y2="128" stroke="var(--line)"/><svg x="0" y="134" width="340" height="170" viewBox="0 0 340 170">${p.out()}</svg>`;
    return {svg,read:`x = ${n(x)} 秒後。重なった部分は、直角をはさむ2辺が ${n(x)} cm の直角二等辺三角形<br>面積 y = 1/2 × ${n(x)} × ${n(x)} = <b>${n(y)}</b> cm²<br>式は y = 0.5x²（0 ≦ x ≦ 6）`};}});

/* ---- 放物線と直線の交点 ---- */
FIGS.m3yx2_koten=host=>mk(host,{alt:'放物線 y = 0.5x² と直線の交点を示した図。直線の傾きと切片を変えられる',
  sliders:[{k:'m',label:'直線の傾き',min:-1.5,max:1.5,step:.5,v:.5},{k:'k',label:'直線の切片',min:-2,max:6,step:.5,v:3}],
  draw(v){const m=v.m,k=v.k,D=m*m+2*k,p=plot([-5.2,5.2,-2.6,9.4]).grid().curve(x=>.5*x*x,C).seg(-5.2,-5.2*m+k,5.2,5.2*m+k,GOLD);
    let r=`放物線 y = 0.5x² と、直線 ${ln(m,k)}<br>0.5x² = ${ln(m,k).slice(4)} を整理すると x² ${sg(-2*m)}x ${sg(-2*k)} = 0<br>`.replace('x² + 0x','x²').replace('x² − 0x','x²').replace(' + 0 = 0',' = 0').replace(' − 0 = 0',' = 0').replace(' 1x',' x');
    if(D<0)r+='この方程式には解がない。<b>交点はない</b>';
    else if(D===0){p.dot(m,.5*m*m,'var(--gold)');r+=`解は x = ${n(m)} の1つだけ<br>直線は、点 (${n(m)}, ${n(.5*m*m)}) で放物線に<b>接している</b>`;}
    else{const s=Math.sqrt(D),x1=m-s,x2=m+s,ex=Number.isInteger(Math.round(s*1e6)/1e6*2),y1=.5*x1*x1,y2=.5*x2*x2;
      p.dot(x1,y1,'var(--gold)').dot(x2,y2,'var(--gold)');
      p.txt(x1,y1,`(${n(x1)}, ${n(y1)})`,`${x1<-2.6?'text-anchor="start" dx="10" dy="-7"':'text-anchor="end" dx="-8" dy="-6"'} fill="var(--gold)" ${HALO}`).txt(x2,y2,`(${n(x2)}, ${n(y2)})`,`text-anchor="${x2>2.6?'end':'start'}" dx="${x2>2.6?-9:9}" dy="${x2>2.6?-8:12}" fill="var(--gold)" ${HALO}`);
      r+=`解は x = ${n(x1)}、${n(x2)}${ex?'':'（およその値）'}<br>交点は <b>(${n(x1)}, ${n(y1)})</b> と <b>(${n(x2)}, ${n(y2)})</b>`;}
    return {svg:p.out(),read:r};}});

/* ---- 放物線上の2点と原点が作る三角形 ---- */
FIGS.m3yx2_sankaku=host=>mk(host,{alt:'放物線 y = 0.5x² 上の2点 A, B と原点 O が作る三角形を、y 軸で2つに分けて面積を求める図',
  sliders:[{k:'p',label:'A の x 座標',min:-4,max:-1,step:1,v:-2},{k:'q',label:'B の x 座標',min:1,max:4,step:1,v:4}],
  draw(v){const a=v.p,b=v.q,g=x=>.5*x*x,m=.5*(a+b),c=-.5*a*b,p=plot([-5.2,5.2,-1.6,10.4]).grid();
    p.poly([[0,0],[a,g(a)],[0,c]],'fill="var(--c)" fill-opacity=".34" stroke="none"').poly([[0,0],[b,g(b)],[0,c]],'fill="var(--gold)" fill-opacity=".34" stroke="none"');
    p.curve(g,C).seg(-5.2,-5.2*m+c,5.2,5.2*m+c,'stroke="var(--muted)" stroke-width="1.2"').poly([[0,0],[a,g(a)],[b,g(b)]],'fill="none" stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round"');
    p.seg(0,0,0,c,'stroke="var(--ink)" stroke-width="3"').dot(a,g(a),'var(--ink)').dot(b,g(b),'var(--ink)').dot(0,c,'var(--ink)',4);
    p.txt(a,g(a),'A',`text-anchor="end" dx="-8" dy="-4" fill="var(--ink)" ${HALO}`).txt(b,g(b),'B',`dx="9" dy="4" fill="var(--ink)" ${HALO}`).txt(0,c,'C',`dx="8" dy="-7" fill="var(--ink)" ${HALO}`).txt(0,0,'O',`text-anchor="end" dx="-6" dy="14" fill="var(--ink)" ${HALO}`);
    const s1=.5*c*(-a),s2=.5*c*b;
    return {svg:p.out(),read:`A(${n(a)}, ${n(g(a))})、B(${n(b)}, ${n(g(b))})。直線 AB：${ln(m,c)}<br>y 軸との交点 C(0, ${n(c)})。OC = ${n(c)} を共通の底辺とみる<br>△OAC = 1/2 × ${n(c)} × ${n(-a)} = ${n(s1)}、△OBC = 1/2 × ${n(c)} × ${n(b)} = ${n(s2)}<br>△OAB = ${n(s1)} + ${n(s2)} = <b>${n(s1+s2)}</b>`};}});

/* ---- いろいろな関数：重さと料金（階段状のグラフ） ---- */
const FEE=[[0,2,800],[2,5,1000],[5,10,1300],[10,15,1600],[15,20,1900]];
FIGS.m3yx2_kaidan=host=>mk(host,{alt:'荷物の重さと料金の関係を表す、階段状のグラフ',
  sliders:[{k:'x',label:'重さ x（kg）',min:.5,max:20,step:.5,v:4}],play:{k:'x',from:.5,to:20,label:'重さを増やしていく',ms:5200},
  draw(v){const x=v.x,p=plot([-3,21.8,-3.4,22.6]),F=FEE.find(q=>x>q[0]&&x<=q[1]),y=F[2]/100;let ex='';
    [5,10,15,20].forEach(t=>{p.seg(t,0,t,22,'stroke="var(--line)" stroke-width=".8"').seg(0,t,21.4,t,'stroke="var(--line)" stroke-width=".8"').txt(t,0,String(t),'text-anchor="middle" dy="14"').txt(0,t,String(t*100),'text-anchor="end" dx="-6" dy="4"');});
    p.seg(0,0,21.6,0,AX).seg(0,0,0,22.4,AX).txt(21.8,0,'kg','text-anchor="end" dy="-6"').txt(0,22.6,'円','dx="6" dy="11"').txt(0,0,'0','text-anchor="end" dx="-6" dy="14"');
    FEE.forEach(q=>{p.seg(q[0],q[2]/100,q[1],q[2]/100,'stroke="var(--c)" stroke-width="2.8"');
      ex+=`<circle cx="${f(p.sx(q[0]))}" cy="${f(p.sy(q[2]/100))}" r="4" fill="var(--bg2)" stroke="var(--c)" stroke-width="1.8"/><circle cx="${f(p.sx(q[1]))}" cy="${f(p.sy(q[2]/100))}" r="4.4" fill="var(--c)"/>`;});
    p.seg(x,0,x,y,DASH).seg(0,y,x,y,DASH);ex+=`<circle cx="${f(p.sx(x))}" cy="${f(p.sy(y))}" r="5" fill="var(--gold)" stroke="var(--bg2)" stroke-width="1.5"/>`;
    return {svg:p.out()+ex,read:`重さ ${n(x)} kg のとき、料金は <b>${F[2]}</b> 円<br>${F[0]} ＜ x ≦ ${F[1]} の範囲は、どの重さでも ${F[2]} 円<br>● はその点をふくみ、○ はふくまない`};}});

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
const Q={
 yottsu:{alt:'目もりのない座標平面に、4つの放物線 ①〜④ をかいた図。① と ② は上に開き、③ と ④ は下に開く',h:250,f(){const p=plot([-6,6,-4.4,4.4]),T=`fill="var(--ink)" ${HALO}`;
   p.seg(-6,0,6,0,AX).seg(0,-4.4,0,4.4,AX).txt(6,0,'x','text-anchor="end" dx="-5" dy="-5"').txt(0,4.4,'y','dx="6" dy="12"').txt(0,0,'O','text-anchor="end" dx="-5" dy="13"');
   p.curve(x=>2*x*x,C).curve(x=>.5*x*x,C).curve(x=>-.25*x*x,GOLD).curve(x=>-x*x,GOLD);
   const L='text-anchor="middle" dy="4" '+T;p.txt(1.38,3.8,'①',L).txt(2.76,3.8,'②',L).txt(3.9,-3.8,'③',L).txt(1.95,-3.8,'④',L);return {svg:p.out(),read:'①〜④ は、どれも原点を頂点とする放物線'};}},
 kasanari:{alt:'直線 ℓ 上に、直角二等辺三角形 ABC と長方形が並んでいる図。三角形が右へ動いて、長方形と重なる',h:150,f(){const d=draw();kasanari(d,4,112);
   tx(d,176+54,112-80,'長方形',M,11);tx(d,176+22,112+15,'x cm',G,11);tx(d,176-32,112-36,'6 cm',M,11,'end');return {svg:d.out(),read:'AC = BC = 6 cm、∠C = 90°。金色の部分が重なり'};}}
};
FIGS.m3yx2_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){return q.f();}});};
})();
