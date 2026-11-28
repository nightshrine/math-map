/* 数学III「積分法」（教科書の「積分法」と「積分法の応用」の2章）の図（FIGS.h3sekibun_*） */
(function(){
const {plot,draw,n,sg,C,GOLD,DASH,mk}=FIG;
const f1=v=>v.toFixed(1);
const INK='stroke="var(--ink)" stroke-width="1.8"',AX='stroke="var(--muted)" stroke-width="1.2"';
const GD='stroke="var(--gold)" stroke-width="1.4" stroke-dasharray="5 4"';
const T='paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round"';
const cap=t=>`<text x="8" y="15" font-size="11" font-family="var(--f-mono)" fill="var(--ink)" ${T}>${t}</text>`;
// 2つの座標平面を上下に並べる
const stack=(a,b,ca,cb,h)=>`<svg x="0" y="0" width="340" height="${h}" viewBox="0 0 340 ${h}">${a}${cap(ca)}</svg><svg x="0" y="${h+10}" width="340" height="${h}" viewBox="0 0 340 ${h}">${b}${cap(cb)}</svg><line x1="0" y1="${h+5}" x2="340" y2="${h+5}" stroke="var(--line)"/>`;
// 曲線 (x, f(x)) の点の列
const pts=(f,a,b,k=40)=>{const r=[];for(let i=0;i<=k;i++){const x=a+(b-a)*i/k;r.push([x,f(x)]);}return r;};

/* ---- 1/x の不定積分は log|x|：上に y = log|x|、下に y = 1/x ---- */
FIGS.h3sekibun_logabs=host=>mk(host,{h:354,alt:'y = log|x| のグラフと、その接線の傾きを表す y = 1/x のグラフを上下に並べた図',
  sliders:[{k:'x',label:'x',min:-4,max:4,step:.1,v:-2}],play:{k:'x',from:-4,to:4,label:'x を左から右へ動かす',ms:5600},
  draw(v){const x=Math.round(v.x*10)/10,F=t=>Math.log(Math.abs(t)),f=t=>1/t,a=plot([-4.6,4.6,-2.7,2.3],340,172).grid(),b=plot([-4.6,4.6,-3.4,3.4],340,172).grid();
    a.curve(F,C,-4.6,-.07).curve(F,C,.07,4.6);b.curve(f,GOLD,-4.6,-.25).curve(f,GOLD,.25,4.6);
    let read;
    if(x!==0){const m=f(x),L=1.2/Math.sqrt(1+m*m);a.seg(x-L,F(x)-m*L,x+L,F(x)+m*L,INK).dot(x,F(x),'var(--ink)');
      if(Math.abs(m)<=3.4)b.seg(x,0,x,m,DASH).dot(x,m,m>0?'var(--ok)':'var(--ng)');
      read=`x = ${n(x)} での、y = log|x| の接線の傾き<br><b>${n(m,3)}</b><br>1/x の値も ${n(m,3)}<br>`+(x<0?'x が負のときも、log|x| を微分すると 1/x':'x が正のときは log|x| = log x');}
    else read='x = 0 では、log|x| も 1/x も定義されない';
    return {svg:stack(a.out(),b.out(),'y = log|x|','y = 1/x',172),read};}});

/* ---- なぜ：置換積分。変数を変えても、帯の面積は変わらない（u = x²） ---- */
FIGS.h3sekibun_chikan=host=>mk(host,{h:290,alt:'x を横軸にした帯と、u = x² を横軸にした帯を上下に並べ、対応する帯の面積が等しいことを示す図',
  sliders:[{k:'i',label:'帯の本数 n',min:1,max:5,step:1,v:2,fmt:i=>String(2**i)},{k:'p',label:'注目する帯の位置',min:0,max:1,step:.05,v:.6,fmt:p=>Math.round(p*100)+'%'}],play:{k:'i',from:1,to:5,label:'帯を細かくする',ms:4200},
  draw(v){const N=2**v.i,k=Math.min(N,Math.floor(v.p*N+1e-9)+1),dx=2/N,a=plot([-.25,2.3,-.22,1.35],340,140).grid(),b=plot([-.5,4.6,-.22,1.35],340,140).grid();let sum=0,hi;
    for(let j=1;j<=N;j++){const x0=(j-1)*dx,x1=j*dx,m=(x0+x1)/2,fu=1/(1+m*m),h1=fu*2*m,on=j===k,st=`fill="var(--${on?'gold':'c'})" fill-opacity="${on?.7:j%2?.42:.26}" stroke="var(--bg2)" stroke-width=".6"`;
      a.poly([[x0,0],[x0,h1],[x1,h1],[x1,0]],st);b.poly([[x0*x0,0],[x0*x0,fu],[x1*x1,fu],[x1*x1,0]],st);sum+=h1*dx;if(on)hi=[dx,h1,x1*x1-x0*x0,fu];}
    a.curve(x=>2*x/(1+x*x),INK,0,2);b.curve(u=>1/(1+u),INK,0,4);
    return {svg:stack(a.out(),b.out(),'y = 2x/(1 + x²)　横軸は x','y = 1/(1 + u)　横軸は u = x²',140),
      read:`${N} 本のうち、左から ${k} 本目の帯（金色）<br>上：幅 ${n(hi[0],4)} × 高さ ${n(hi[1],4)} = <b>${n(hi[0]*hi[1],4)}</b><br>下：幅 ${n(hi[2],4)} × 高さ ${n(hi[3],4)} = <b>${n(hi[2]*hi[3],4)}</b><br>帯の合計は、上も下も ${n(sum,4)}（log 5 = 1.6094 に近づく）`};}});

/* ---- なぜ：部分積分。長方形から、曲線の下の面積を引く（y = sin x） ---- */
FIGS.h3sekibun_bubun=host=>mk(host,{alt:'横 b、縦 sin b の長方形を、y = sin x のグラフで上下2つに分けた図',
  sliders:[{k:'b',label:'b',min:.3,max:1.57,step:.01,v:1.57}],play:{k:'b',from:.3,to:1.57,label:'b を π/2 まで大きくする',ms:3800},
  draw(v){const b=v.b,sb=Math.sin(b),p=plot([-.32,2.08,-.25,1.515]).grid();
    p.poly([[0,0],...pts(Math.sin,0,b),[b,0]],'fill="var(--c)" fill-opacity=".36" stroke="none"').poly([...pts(Math.sin,0,b),[0,sb]],'fill="var(--gold)" fill-opacity=".3" stroke="none"');
    for(let j=1;j<8;j++){const y=sb*j/8;p.seg(0,y,Math.asin(y),y,'stroke="var(--gold)" stroke-width="1"');}
    p.poly([[0,0],[b,0],[b,sb],[0,sb]],'fill="none" stroke="var(--ink)" stroke-width="1.4" stroke-dasharray="4 3"').curve(Math.sin,C,0,2.08);
    p.txt(b,0,'b','text-anchor="middle" dy="15" fill="var(--ink)" '+T).txt(0,sb,'sin b','text-anchor="end" dx="-6" dy="-5" fill="var(--ink)" '+T);
    const lo=1-Math.cos(b),up=b*sb-lo;
    return {svg:p.out(),read:`b = ${n(b)} のとき<br>長方形 b × sin b = ${n(b*sb,4)}<br>曲線の下（色）∫ sin x dx = ${n(lo,4)}<br>残り（金色）∫ x cos x dx = <b>${n(up,4)}</b><br>金色の帯は、長さ x、厚さが sin x の増分`};}});

/* ---- 定積分の部分積分：y = x e^(−x) の下の面積 ---- */
FIGS.h3sekibun_xex=host=>mk(host,{alt:'曲線 y = x e の −x 乗の下の、0 から b までの面積の図',
  sliders:[{k:'b',label:'b',min:.5,max:8,step:.1,v:2}],play:{k:'b',from:.5,to:8,label:'b を大きくする',ms:4600},
  draw(v){const b=Math.round(v.b*10)/10,f=x=>x*Math.exp(-x),r=[-.6,8.6,-.1,.52],p=plot(r).grid();
    p.seg(r[0],1/Math.E,r[1],1/Math.E,DASH).txt(r[1],1/Math.E,'1/e','text-anchor="end" dx="-5" dy="-5"').under(f,0,b,'fill="var(--c)" fill-opacity=".4" stroke="none"').curve(f,C,0,r[1]).seg(b,0,b,f(b),INK).txt(b,0,'b','text-anchor="middle" dy="15" fill="var(--ink)" '+T);
    const A=-b*Math.exp(-b),B=1-Math.exp(-b);
    return {svg:p.out(),read:`∫ x e^(−x) dx（0 から b = ${n(b)} まで）<br>[−x e^(−x)] の部分 = ${n(A,4)}<br>∫ e^(−x) dx の部分 = ${n(B,4)}<br>合計 = <b>${n(A+B,4)}</b>（b を大きくすると 1 に近づく）`};}});

/* ---- 定積分：y = 1/x の下の面積は log b ---- */
FIGS.h3sekibun_logarea=host=>mk(host,{alt:'曲線 y = 1/x の下の、1 から b までの面積の図',
  sliders:[{k:'b',label:'b',min:.2,max:6,step:.02,v:2.72}],play:{k:'b',from:1,to:6,label:'b を 1 から大きくする',ms:4600},
  draw(v){const b=Math.round(v.b*100)/100,f=x=>1/x,r=[-.5,6.5,-.45,3.4],p=plot(r).grid(),val=Math.log(b);
    if(b!==1)p.under(f,Math.min(1,b),Math.max(1,b),`fill="var(--${b>1?'ok':'ng'})" fill-opacity=".4" stroke="none"`);
    p.curve(f,C,.2,r[1]).seg(1,0,1,1,INK).seg(b,0,b,f(b),INK).txt(b,0,'b','text-anchor="middle" dy="28" fill="var(--ink)" '+T);
    return {svg:p.out(),read:`∫ (1/x) dx（1 から b = ${n(b)} まで）<br>= log b − log 1 = <b>${n(val,4)}</b><br>`+(b<1?'b < 1 のときは、右から左へ積分するので負になる':Math.abs(val-1)<.002?'ほぼ 1。b = e = 2.718… のとき、面積がちょうど 1 になる':val<1?'面積は 1 より小さい':'面積は 1 より大きい')};}});

/* ---- x = sin θ：√(1 − x²) の定積分は、おうぎ形と三角形 ---- */
FIGS.h3sekibun_tri=host=>mk(host,{alt:'半径 1 の円の一部の面積を、おうぎ形と直角三角形に分けた図',
  sliders:[{k:'b',label:'b（積分の上端）',min:.05,max:1,step:.05,v:.5}],play:{k:'b',from:.05,to:1,label:'b を 1 まで大きくする',ms:4200},
  draw(v){const b=Math.round(v.b*100)/100,f=x=>Math.sqrt(Math.max(0,1-x*x)),th=Math.asin(b),P=[b,f(b)],p=plot([-.42,1.48,-.2,1.197]).grid();
    p.poly([[0,0],...pts(f,0,b)],'fill="var(--c)" fill-opacity=".38" stroke="none"').poly([[0,0],[b,0],P],'fill="var(--gold)" fill-opacity=".38" stroke="none"');
    p.curve(f,C,0,1).seg(0,0,P[0],P[1],INK).seg(b,0,P[0],P[1],INK).dot(P[0],P[1],'var(--ink)',3.6);
    const arc=[];for(let i=0;i<=16;i++){const a=Math.PI/2-th*i/16;arc.push([.2*Math.cos(a),.2*Math.sin(a)]);}
    for(let i=0;i<16;i++)p.seg(arc[i][0],arc[i][1],arc[i+1][0],arc[i+1][1],'stroke="var(--ink)" stroke-width="1.3"');
    p.txt(.29*Math.sin(th/2),.29*Math.cos(th/2),'θ','text-anchor="middle" dy="4" fill="var(--ink)" '+T).txt(b,0,'b','text-anchor="middle" dy="15" fill="var(--ink)" '+T).txt(P[0],P[1],'P','dx="8" dy="-4" fill="var(--ink)" '+T);
    const s=th/2,t=b*f(b)/2;
    return {svg:p.out(),read:`b = sin θ = ${n(b)}、θ = ${n(th,4)}（ラジアン）<br>おうぎ形（色）θ ÷ 2 = ${n(s,4)}<br>三角形（金色）sin θ cos θ ÷ 2 = ${n(t,4)}<br>合計 = ∫ √(1 − x²) dx（0 から b まで）= <b>${n(s+t,4)}</b>`};}});

/* ---- 区分求積法：関数を変えても、長方形の和は定積分に近づく ---- */
FIGS.h3sekibun_kubun=host=>mk(host,{alt:'0 から 1 までの区間を n 等分し、右端の高さの長方形を並べた図',
  sliders:[{k:'m',label:'関数 f(x)',min:1,max:3,step:1,v:1,fmt:m=>['1/(1 + x)','√x','sin πx'][m-1]},{k:'i',label:'長方形の本数 n',min:0,max:6,step:1,v:2,fmt:i=>String(2**i)}],play:{k:'i',from:0,to:6,label:'本数を増やしていく',ms:4600},
  draw(v){const S=[[x=>1/(1+x),Math.log(2),'1/(1 + x)','log 2'],[Math.sqrt,2/3,'√x','2/3'],[x=>Math.sin(Math.PI*x),2/Math.PI,'sin πx','2/π']][v.m-1],N=2**v.i,p=plot([-.12,1.18,-.14,1.22]).grid();let sum=0;
    for(let k=1;k<=N;k++){const a=(k-1)/N,b=k/N,h=S[0](b);sum+=h/N;p.poly([[a,0],[a,h],[b,h],[b,0]],'fill="var(--c)" fill-opacity=".45" stroke="var(--bg2)" stroke-width=".6"');}
    p.curve(S[0],INK,0,1);
    return {svg:p.out(),read:`f(x) = ${S[2]}。幅 1/${N} の長方形が ${N} 本（高さは右端の値）<br>長方形の面積の和 = <b>${sum.toFixed(4)}</b><br>定積分 ∫ f(x) dx（0 から 1 まで）= ${S[3]} = <i>${S[1].toFixed(4)}</i>`};}});

/* ---- 面積：y = sin x と y = cos x の間 ---- */
FIGS.h3sekibun_aida=host=>mk(host,{alt:'y = sin x と y = cos x のグラフで囲まれた部分と、縦の長さを表す線分の図',
  sliders:[{k:'x',label:'x',min:.79,max:3.92,step:.01,v:2}],play:{k:'x',from:.79,to:3.92,label:'左から右へなぞる',ms:4200},
  draw(v){const x=v.x,a=Math.PI/4,b=5*Math.PI/4,s=Math.sin,c=Math.cos,p=plot([-.5,5.4,-1.5,1.5]).grid();
    p.under(s,a,b,'fill="var(--c)" fill-opacity=".16" stroke="none"',c).under(s,a,x,'fill="var(--c)" fill-opacity=".38" stroke="none"',c).curve(c,INK).curve(s,C);
    p.seg(x,c(x),x,s(x),'stroke="var(--gold)" stroke-width="3.5"').dot(x,s(x),'var(--gold)',3.5).dot(x,c(x),'var(--gold)',3.5);
    p.txt(1.9,s(1.9),'y = sin x','text-anchor="middle" dy="-9" fill="var(--c)" '+T).txt(4.45,c(4.45),'y = cos x','text-anchor="end" dx="-8" dy="-4" fill="var(--ink)" '+T);
    return {svg:p.out(),read:`x = ${n(x)} での縦の長さ（上 − 下）<br>sin x − cos x = <b>${n(s(x)-c(x),3)}</b><br>交点 x = π/4 からここまでの面積 = <i>${n(-c(x)-s(x)+Math.SQRT2,3)}</i><br>次の交点 x = 5π/4 まで集めると 2√2 = 2.828`};}});

/* ---- 面積：y 軸の方向に切って集める（y = log x） ---- */
FIGS.h3sekibun_yoko=host=>mk(host,{alt:'曲線 y = log x と y 軸の間の部分を、横向きの線分で切って集める図',
  sliders:[{k:'y',label:'y',min:0,max:1,step:.02,v:.5}],play:{k:'y',from:0,to:1,label:'下から上へなぞる',ms:3600},
  draw(v){const y=v.y,p=plot([-.6,3.6,-.6,1.6]).grid(),g=t=>[Math.exp(t),t],cv=(b)=>{const r=[];for(let i=0;i<=30;i++)r.push(g(b*i/30));return r;};
    p.poly([[0,0],...cv(1),[0,1]],'fill="var(--c)" fill-opacity=".16" stroke="none"');if(y>0)p.poly([[0,0],...cv(y),[0,y]],'fill="var(--c)" fill-opacity=".38" stroke="none"');
    p.curve(Math.log,C,.3,3.6).seg(0,1,Math.E,1,DASH).seg(0,y,Math.exp(y),y,'stroke="var(--gold)" stroke-width="3.5"').dot(Math.exp(y),y,'var(--gold)',3.5);
    p.txt(3.3,Math.log(3.3),'y = log x','text-anchor="end" dy="16" fill="var(--c)" '+T);
    return {svg:p.out(),read:`高さ y = ${n(y)} での横の長さ<br>x = e^y = <b>${n(Math.exp(y),3)}</b><br>y = 0 からここまでの面積 = <i>${n(Math.exp(y)-1,3)}</i><br>y = 1 まで集めると e − 1 = 1.718`};}});

/* ---- なぜ：体積。薄い円板を積んで円錐に近づける ---- */
FIGS.h3sekibun_enban=host=>mk(host,{alt:'円錐を、軸に垂直な平面で等分し、それぞれを薄い円板でおきかえた図',
  sliders:[{k:'i',label:'円板の枚数 n',min:0,max:5,step:1,v:2,fmt:i=>String(2**i)}],play:{k:'i',from:0,to:5,label:'円板を薄くしていく',ms:4600},
  draw(v){const N=2**v.i,u=52,ox=44,oy=125,d=draw(),X=x=>ox+x*u;
    d.line(20,oy,300,oy,AX);
    for(let k=1;k<=N;k++){const x0=(k-1)*4/N,x1=k*4/N,r=x1/2*u;d.poly([[X(x0),oy-r],[X(x1),oy-r],[X(x1),oy+r],[X(x0),oy+r]],'fill="var(--c)" fill-opacity=".3" stroke="var(--c)" stroke-width="1"');
      if(N<=8)d.raw(`<ellipse cx="${f1(X(x1))}" cy="${oy}" rx="${f1(Math.max(2,r*.09))}" ry="${f1(r)}" fill="var(--c)" fill-opacity=".18" stroke="var(--c)" stroke-width="1"/>`);}
    d.line(X(0),oy,X(4),oy-2*u,'stroke="var(--ink)" stroke-width="1.6" stroke-dasharray="5 3"').line(X(0),oy,X(4),oy+2*u,'stroke="var(--ink)" stroke-width="1.6" stroke-dasharray="5 3"');
    d.text(X(0)-10,oy+15,'0','fill="var(--muted)"').text(X(4)+4,oy+15,'4','text-anchor="start" fill="var(--muted)" '+T).text(304,oy+4,'x','text-anchor="start" fill="var(--muted)"').text(X(4)+22,oy-52,'半径 2','text-anchor="start" fill="var(--muted)"');
    const co=8/3*(N+1)*(2*N+1)/(N*N);
    return {svg:d.out(),read:`円板 ${N} 枚（厚さ ${n(4/N,3)}。半径は右端での値）<br>体積の合計 = ${n(co,4)}π = <b>${n(co*Math.PI,3)}</b><br>円錐の体積 = 16π/3 = <i>16.755</i><br>円錐をちょうど囲む円柱 16π = 50.265 の 1/3`};}});

/* ---- 回転体：切り口は円（y = sin x を x 軸のまわりに回転） ---- */
FIGS.h3sekibun_kaiten=host=>mk(host,{alt:'y = sin x を x 軸のまわりに回転させた立体を横から見た図と、位置 x での円形の切り口',
  sliders:[{k:'x',label:'x',min:0,max:3.14,step:.02,v:1.2}],play:{k:'x',from:0,to:3.14,label:'切り口を左から右へ動かす',ms:4600},
  draw(v){const x=v.x,s=Math.sin,p=plot([-.6,3.8,-1.617,1.617]).grid(),r=s(x);
    if(x>0)p.under(s,0,x,'fill="var(--c)" fill-opacity=".32" stroke="none"',t=>-s(t));
    p.curve(s,C,0,Math.PI).curve(t=>-s(t),C,0,Math.PI);
    const ry=r*(p.sy(0)-p.sy(1)),ex=`<ellipse cx="${f1(p.sx(x))}" cy="${f1(p.sy(0))}" rx="${f1(Math.max(1.5,ry*.16))}" ry="${f1(Math.max(.5,ry))}" fill="var(--gold)" fill-opacity=".3" stroke="var(--gold)" stroke-width="2"/>`;
    return {svg:p.out()+ex,read:`x = ${n(x)}：切り口は、半径 sin x = ${n(r,3)} の円<br>切り口の面積 π sin² x = ${n(Math.PI*r*r,3)}<br>0 から x までの体積 = <b>${n(Math.PI*(x/2-Math.sin(2*x)/4),3)}</b><br>x = π まで集めると π²/2 = 4.935`};}});

/* ---- 曲線の長さ：折れ線で近づける（y = (e^x + e^(−x))/2） ---- */
FIGS.h3sekibun_oresen=host=>mk(host,{alt:'曲線を、n 本の線分をつないだ折れ線で近づける図',
  sliders:[{k:'i',label:'線分の本数 n',min:0,max:5,step:1,v:1,fmt:i=>String(2**i)}],play:{k:'i',from:0,to:5,label:'線分を増やしていく',ms:4600},
  draw(v){const N=2**v.i,f=Math.cosh,p=plot([-1.9,1.9,-.45,2.344]).grid();let L=0;p.curve(f,C,-1,1);
    for(let k=0;k<N;k++){const a=-1+2*k/N,b=-1+2*(k+1)/N;L+=Math.hypot(b-a,f(b)-f(a));p.seg(a,f(a),b,f(b),'stroke="var(--gold)" stroke-width="2.2"');}
    for(let k=0;k<=N;k++){const a=-1+2*k/N;p.dot(a,f(a),'var(--gold)',N>8?2.4:3.4);}
    if(N>=2&&N<=4){const a=1-2/N;p.seg(a,f(a),1,f(a),DASH).seg(1,f(a),1,f(1),DASH).txt((a+1)/2,f(a),'Δx','text-anchor="middle" dy="14" '+T).txt(1,(f(a)+f(1))/2,'Δy','dx="7" dy="4" '+T);}
    return {svg:p.out(),read:`線分 ${N} 本の折れ線の長さ = <b>${L.toFixed(4)}</b><br>曲線の長さ e − 1/e = <i>2.3504</i><br>線分1本の長さは √(Δx² + Δy²)`};}});

/* ---- 速度と道のり：v = cos t ---- */
FIGS.h3sekibun_michi=host=>mk(host,{alt:'速度 v = cos t のグラフと、数直線上を動く点の位置の図',
  sliders:[{k:'t',label:'時刻 t',min:0,max:6.28,step:.02,v:2.4}],play:{k:'t',from:0,to:6.28,label:'時刻を進める',ms:5600},
  draw(v){const t=v.t,c=Math.cos,r=[-.6,6.9,-1.5,2.35],p=plot(r),P=Math.PI;
    for(let i=0;i<120&&t>0;i++){const a=t*i/120,w=t/120,y=c(a+w/2);p.poly([[a,0],[a,y],[a+w,y],[a+w,0]],`fill="var(--${y>=0?'ok':'ng'})" fill-opacity=".4" stroke="none"`);}
    p.seg(r[0],0,r[1],0,AX).seg(0,-1.4,0,1.4,AX).curve(c,C,0,2*P).seg(t,0,t,c(t),INK);
    [[P/2,'π/2'],[P,'π'],[3*P/2,'3π/2'],[2*P,'2π']].forEach(q=>p.seg(q[0],-.04,q[0],.04,AX).txt(q[0],-1.5,q[1],'text-anchor="middle" dy="-6"'));
    p.txt(0,1,'1','text-anchor="end" dx="-6" dy="4"').txt(0,-1,'−1','text-anchor="end" dx="-6" dy="4"').txt(r[1],0,'t','text-anchor="end" dx="-5" dy="-6"').txt(0,1.4,'v','dx="6" dy="4"');
    const X=x=>170+x*100,pos=Math.sin(t),dist=t<=P/2?Math.sin(t):t<=3*P/2?2-Math.sin(t):4+Math.sin(t);
    let ex=`<line x1="50" y1="24" x2="290" y2="24" stroke="var(--muted)" stroke-width="1.2"/>`;
    [-1,0,1].forEach(q=>{ex+=`<line x1="${X(q)}" y1="20" x2="${X(q)}" y2="28" stroke="var(--muted)" stroke-width="1.2"/><text x="${X(q)}" y="42" font-size="11" font-family="var(--f-mono)" fill="var(--muted)" text-anchor="middle">${n(q)}</text>`;});
    ex+=`<circle cx="${f1(X(pos))}" cy="24" r="5.5" fill="var(--gold)" stroke="var(--bg2)" stroke-width="1.5"/><text x="300" y="28" font-size="11" font-family="var(--f-mono)" fill="var(--muted)">位置</text>`;
    return {svg:p.out()+ex,read:`t = ${n(t)}：点の位置は ${n(pos,3)}<br>位置の変化 ∫ v dt = <b>${n(pos,3)}</b><br>道のり ∫ |v| dt = <b>${n(dist,3)}</b><br>t 軸より下の面積を、位置の変化では引き、道のりではたす`};}});

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
const Q={
 kusabi:{alt:'円柱の底面の半円と、直径に垂直な平面で切った切り口の直角二等辺三角形の図',h:200,f(d){const O=[100,150],R=78,x=30,hh=Math.sqrt(R*R-x*x);
   d.path(`M${O[0]-R},${O[1]} A${R},${R} 0 0 1 ${O[0]+R},${O[1]} Z`,'fill="var(--c)" fill-opacity=".2" stroke="var(--c)" stroke-width="1.6"');
   d.line(O[0]+x,O[1],O[0]+x,O[1]-hh,'stroke="var(--gold)" stroke-width="3"').dot(O[0],O[1],'var(--ink)',2.5);
   d.text(O[0],O[1]+16,'O').text(O[0]+x,O[1]+16,'x').text(O[0]-R,O[1]+16,'−r','fill="var(--muted)"').text(O[0]+R,O[1]+16,'r','fill="var(--muted)"').text(O[0],34,'底面（上から見た図）','fill="var(--muted)"');
   const A=[226,150],B=[226+hh,150],Cc=[226+hh,150-hh];d.poly([A,B,Cc],'fill="var(--gold)" fill-opacity=".3" stroke="var(--gold)" stroke-width="1.8" stroke-linejoin="round"');
   d.path(`M${B[0]-9},${B[1]} L${B[0]-9},${B[1]-9} L${B[0]},${B[1]-9}`,'stroke="var(--muted)" stroke-width="1.2" fill="none"').angle(A[0],A[1],20,0,45,'stroke="var(--ink)" stroke-width="1.3" fill="none"');
   d.text(A[0]+32,A[1]-7,'45°').text((A[0]+B[0])/2,A[1]+16,'√(r² − x²)','fill="var(--muted)"').text(264,34,'位置 x での切り口','fill="var(--muted)"');
   return '底面の金色の線分が、切り口の三角形の底辺。高さも同じ長さ';}}
};
FIGS.h3sekibun_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){const d=draw(),r=q.f(d);return {svg:d.out(),read:r};}});};
})();
