/* 中学2年「一次関数」の図（FIGS.m2ichiji_*）。動かせる図と、問題に付ける図（m2ichiji_q） */
(function(){
const {plot,draw,n,sg,mk,C}=FIG;
const f=v=>v.toFixed(1);
// 文字は、線に重なっても読めるように地の色でふちどる
const HALO='paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round"';
const TI='fill="var(--ink)" '+HALO,TG='fill="var(--gold)" '+HALO,TC='fill="var(--c)" '+HALO;
const INK='stroke="var(--ink)" stroke-width="1.6" fill="none" stroke-linejoin="round"';
const L2='stroke="var(--ink)" stroke-width="2"';
const GL='stroke="var(--gold)" stroke-width="2.4" stroke-linecap="round"';
const CL='stroke="var(--c)" stroke-width="1.6"';
const CD='stroke="var(--c)" stroke-width="1.3" stroke-dasharray="5 4"';
const MD='stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="4 4"';
const GD='stroke="var(--gold)" stroke-width="1.8" stroke-dasharray="5 4"';
const FG='fill="var(--gold)" fill-opacity=".22" stroke="none"',FC='fill="var(--c)" fill-opacity=".26" stroke="none"';
const GRID='stroke="var(--line)" stroke-width=".6"',AX='stroke="var(--muted)" stroke-width="1.2"';
const RG=[-8,8,-6,6];
const STEP=k=>({sliders:[{k:'s',label:'手順',min:1,max:k,step:1,v:1}],play:{k:'s',from:1,to:k,label:'順に見る',ms:1100*k}});
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
// 分数 p/q（p, q は整数）を約分して文字にする。整数になるときは整数で書く
const fr=(p,q)=>{if(q<0){p=-p;q=-q;}const g=gcd(p,q)||1;p/=g;q/=g;return q===1?n(p):(p<0?'−':'')+Math.abs(p)+'/'+q;};
// 直線の式（係数が小数）：y = ax + b
const eq=(a,b)=>'y = '+(a===0?n(b):(a===1?'x':a===-1?'−x':n(a)+'x')+(b===0?'':' '+sg(b)));
// 直線の式（係数が分数）：傾き ap/aq、切片 bp/bq
const eqF=(ap,aq,bp,bq)=>{const A=fr(ap,aq),neg=bp*bq<0,B=fr(Math.abs(bp),Math.abs(bq));
  if(ap===0)return 'y = '+(neg?'−':'')+B;
  const xs=A==='1'?'x':A==='−1'?'−x':A.includes('/')?(A[0]==='−'?'−('+A.slice(1)+')x':'('+A+')x'):A+'x';
  return 'y = '+xs+(bp===0?'':(neg?' − ':' + ')+B);};
// ax + by の形（a, b は整数）
const lhs=(a,b)=>{const t=[];if(a)t.push((a===1?'':a===-1?'−':n(a))+'x');
  if(b){const s=(Math.abs(b)===1?'':String(Math.abs(b)))+'y';t.push(t.length?(b<0?'− ':'+ ')+s:(b<0?'−':'')+s);}return t.join(' ')||'0';};
const exact=(v,d=1)=>Math.abs(v*10**d-Math.round(v*10**d))<1e-9;
// 目盛りを自分で決める座標軸。xs, ys は方眼を引く値、xt, yt は数字を書く値（省略時は xs, ys）
function axes(p,o){
  o.xs.forEach(x=>p.seg(x,0,x,o.y1,GRID));o.ys.forEach(y=>p.seg(0,y,o.x1,y,GRID));
  p.seg(0,0,o.x1,0,AX).seg(0,0,0,o.y1,AX);
  (o.xt||o.xs).forEach(x=>p.txt(x,0,String(x),'text-anchor="middle" dy="13"'));
  (o.yt||o.ys).forEach(y=>p.txt(0,y,String(y),'text-anchor="end" dx="-5" dy="4"'));
  p.txt(o.x1,0,o.xl,'text-anchor="end" dy="26"').txt(0,o.y1,o.yl,'dx="6" dy="7"');
  return p;}
// draw() 用の文字
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" ${HALO}>${t}</text>`);

/* ---- 一次関数：水そうの水面の高さ ---- */
FIGS.m2ichiji_suiso=host=>mk(host,{alt:'水そうの水面の高さと、時間と高さの関係を表すグラフを並べた図',
  sliders:[{k:'x',label:'時間 x（分）',min:0,max:6,step:.5,v:2},{k:'a',label:'1分間に上がる高さ（cm）',min:1,max:3,step:.5,v:2},{k:'b',label:'はじめの高さ（cm）',min:0,max:6,step:1,v:4}],
  play:{k:'x',from:0,to:6,label:'水を入れる',ms:3200},
  draw(v){const a=v.a,b=v.b,x=v.x,y=a*x+b,u=8,by=222,d=draw(),Y=h=>by-h*u,gx=t=>192+t*22;
    if(b>0)d.poly([[30,by],[120,by],[120,Y(b)],[30,Y(b)]],FG);
    if(x>0)d.poly([[30,Y(b)],[120,Y(b)],[120,Y(y)],[30,Y(y)]],FC);
    d.path(`M30,22 L30,${by} L120,${by} L120,22`,'stroke="var(--ink)" stroke-width="2" fill="none" stroke-linejoin="round"');
    d.line(30,Y(y),120,Y(y),'stroke="var(--c)" stroke-width="2"');
    d.line(120,Y(y),gx(0)-22,Y(y),MD);if(x>0)d.line(gx(0),Y(y),gx(x),Y(y),MD);
    if(b>=2)tx(d,75,Y(b/2)+4,n(b),'var(--gold)',11);
    if(a*x>=2)tx(d,75,Y(b+a*x/2)+4,n(a)+' × '+n(x),'var(--c)',11);
    tx(d,75,240,'水そう','var(--muted)',10);
    for(let t=1;t<=6;t++)d.line(gx(t),by,gx(t),Y(24),GRID);
    for(let h=4;h<=24;h+=4)d.line(gx(0),Y(h),gx(6),Y(h),GRID);
    d.line(gx(0),by,gx(6)+10,by,AX).line(gx(0),by,gx(0),Y(24)-10,AX);
    [0,2,4,6].forEach(t=>tx(d,gx(t),by+13,String(t),'var(--muted)',10));
    [8,16,24].forEach(h=>tx(d,gx(0)-5,Y(h)+4,String(h),'var(--muted)',10,'end'));
    tx(d,gx(6)+12,by+13,'x','var(--muted)',10);tx(d,gx(0)+7,Y(24)-4,'y','var(--muted)',10,'start');
    d.line(gx(0),Y(b),gx(6),Y(a*6+b),'stroke="var(--c)" stroke-width="1.4" opacity=".4"');
    d.line(gx(0),Y(b),gx(x),Y(y),C);
    d.dot(gx(0),Y(b),'var(--gold)',3.5).dot(gx(x),Y(y),'var(--ink)',4);
    return {svg:d.out(),read:`y =（はじめの高さ）+（増えた高さ）<br>= ${n(b)} + ${n(a)} × ${n(x)} = <b>${n(y)}</b>（cm）<br>式：<i>${eq(a,b)}</i>`+(b===0?'（比例）':'')};}});

/* ---- 変化の割合：2点の間の増加量 ---- */
FIGS.m2ichiji_henka=host=>mk(host,{alt:'グラフ上の2点 A, B の間の、x の増加量と y の増加量を示す図',h:300,
  sliders:[{k:'m',label:'y',min:1,max:3,step:1,v:1,fmt:m=>['2x + 1','−x + 7','12/x'][m-1]},{k:'x',label:'A の x 座標',min:1,max:3,step:1,v:1},{k:'h',label:'x の増加量',min:1,max:2,step:1,v:2}],
  draw(v){const F=[x=>2*x+1,x=>-x+7,x=>12/x][v.m-1],x1=v.x,x2=v.x+v.h,y1=F(x1),y2=F(x2),dy=y2-y1,up=dy>0,col=up?'ok':'ng',p=plot([-3,13,-1.2,12.92],340,300).grid();
    p.poly([[x1,y1],[x2,y1],[x2,y2]],FG);
    if(v.m===3)p.curve(F,C,.9,13);else p.curve(F,C);
    p.seg(x1,y1,x2,y1,GL).seg(x2,y1,x2,y2,`stroke="var(--${col})" stroke-width="2.4" stroke-linecap="round"`).dot(x1,y1,'var(--ink)').dot(x2,y2,'var(--ink)');
    p.txt(x1,y1,'A',`text-anchor="end" dx="-7" dy="${up?-6:15}" ${TI}`).txt(x2,y2,'B',up?`text-anchor="end" dx="-6" dy="-7" ${TI}`:`text-anchor="end" dx="-7" dy="15" ${TI}`);
    p.txt((x1+x2)/2,y1,n(v.h),`text-anchor="middle" dy="${up?14:-6}" ${TG}`).txt(x2,(y1+y2)/2,n(dy),`dx="8" dy="4" fill="var(--${col})" ${HALO}`);
    return {svg:p.out(),read:`A(${x1}, ${n(y1)})、B(${x2}, ${n(y2)})<br>x の増加量 = ${x2} − ${x1} = ${v.h}<br>y の増加量 = ${n(y2)} − ${n(y1)} = ${n(dy)}<br>変化の割合 = ${up?n(dy):'('+n(dy)+')'} ÷ ${v.h} = <b>${n(dy/v.h)}</b><br>`+(v.m<3?'どこで測っても同じ値':'場所や幅によって値が変わる')};}});

/* ---- なぜ：場所と幅を変えても、縦 ÷ 横 は変わらない ---- */
FIGS.m2ichiji_naze=host=>mk(host,{alt:'直線上の2点の位置と幅を変えても、y の増加量と x の増加量の比が変わらないことを示す図',
  sliders:[{k:'p',label:'A の x 座標 p',min:-2,max:1,step:.5,v:-1},{k:'h',label:'x の増加量 h',min:.5,max:2,step:.5,v:2},{k:'a',label:'a',min:-1.5,max:1.5,step:.5,v:1.5}],
  play:{k:'p',from:-2,to:1,label:'A を動かす',ms:2800},
  draw(v){const a=v.a,F=x=>a*x+1,x1=v.p,x2=v.p+v.h,y1=F(x1),y2=F(x2),up=a>=0,p=plot([-6,7.6,-4.2,5.8]).grid();
    p.poly([[x1,y1],[x2,y1],[x2,y2]],FG).curve(F,C).seg(0,1,1,1,MD).seg(1,1,1,1+a,MD);
    p.seg(x1,y1,x2,y1,GL).seg(x2,y1,x2,y2,GL).dot(x1,y1,'var(--ink)').dot(x2,y2,'var(--ink)');
    p.txt(x1,y1,'A',`text-anchor="end" dx="-7" dy="${up?-6:15}" ${TI}`).txt(x2,y2,'B',`text-anchor="end" dx="${up?-6:-7}" dy="${up?-7:15}" ${TI}`);
    p.txt(x1,y1,'h='+n(v.h),`dx="5" dy="${up?14:-6}" ${TG}`);
    if(a)p.txt(x2,(y1+y2)/2,'ah='+n(a*v.h),`dx="8" dy="4" ${TG}`);
    return {svg:p.out(),read:`${eq(a,1)} で、x が ${n(x1)} から ${n(x2)} まで増える<br>x の増加量 h = ${n(v.h)}<br>y の増加量 = a × h = ${a<0?'('+n(a)+')':n(a)} × ${n(v.h)} = ${n(a*v.h)}<br>変化の割合 = ${a<0?'('+n(a*v.h)+')':n(a*v.h)} ÷ ${n(v.h)} = <b>${n(a)}</b>`+(a===0?'<br>a = 0 のときは y が一定で、一次関数ではない':'')};}});

/* ---- 一次関数のグラフ：傾き a と切片 b ---- */
FIGS.m2ichiji_slope=host=>mk(host,{alt:'一次関数 y = ax + b のグラフで、傾き a と切片 b を動かす図',
  sliders:[{k:'a',label:'傾き a',min:-3,max:3,step:.5,v:2},{k:'b',label:'切片 b',min:-3,max:3,step:1,v:2}],
  draw(v){const a=v.a,b=v.b,p=plot(RG).grid();
    p.curve(x=>a*x,MD);
    if(b)p.seg(0,0,0,b,`stroke="var(--${b>0?'ok':'ng'})" stroke-width="3.4"`);
    p.poly([[0,b],[1,b],[1,b+a]],FG).curve(x=>a*x+b,C).seg(0,b,1,b,GL).seg(1,b,1,b+a,GL).dot(0,b,'var(--gold)');
    if(a){if(!(b===0&&a>0))p.txt(.5,b,'1',`text-anchor="middle" dy="${a>0?13:-5}" ${TG}`);p.txt(1,b+a/2,n(a),`dx="7" dy="4" ${TG}`);}
    if(b)p.txt(0,b,'切片 '+n(b),`text-anchor="end" dx="-8" dy="${a<0?15:-9}" ${TI}`);
    return {svg:p.out(),read:`<i>${eq(a,b)}</i><br>切片 ${n(b)}：y 軸と点 (0, ${n(b)}) で交わる<br>`+
      (a?`傾き ${n(a)}：右へ 1 進むと、${a>0?'上':'下'}へ ${n(Math.abs(a))} 進む（${a>0?'右上がり':'右下がり'}）`:'傾き 0：x 軸に平行（a = 0 は一次関数ではない）')+'<br>'+
      (b?`点線 ${eq(a,0)} を、${b>0?'上':'下'}へ ${n(Math.abs(b))} 平行移動した直線`:'b = 0：比例のグラフ（点線）と重なる')};}});

/* ---- 切片と傾きからグラフをかく手順 ---- */
FIGS.m2ichiji_kaku=host=>mk(host,Object.assign(STEP(3),{alt:'切片と傾きから、一次関数 y = 2/3 x − 1 のグラフをかく手順の図',
  draw(v){const s=v.s,p=plot(RG).grid();
    if(s>=3)p.curve(x=>2/3*x-1,C);
    if(s>=2)p.seg(0,-1,3,-1,GL).seg(3,-1,3,1,GL).txt(1.5,-1,'3',`text-anchor="middle" dy="14" ${TG}`).txt(3,-.45,'2',`dx="8" dy="4" ${TG}`).dot(3,1,'var(--gold)');
    p.dot(0,-1,'var(--gold)');
    if(s>=3)p.dot(-3,-3,'var(--ink)',3.6);
    p.txt(0,-1,'(0, −1)',`text-anchor="end" dx="-8" dy="-5" ${TI}`);
    if(s>=2)p.txt(3,1,'(3, 1)',`text-anchor="end" dx="-7" dy="-7" ${TI}`);
    return {svg:p.out(),read:['<b>手順 1</b>　y = 2/3 x − 1 の切片は −1<br>y 軸上の点 (0, −1) をとる','<b>手順 2</b>　傾きは 2/3<br>右へ 3 進むと、上へ 2 進む<br>点 (3, 1) をとる',
      '<b>手順 3</b>　2点 (0, −1)、(3, 1) を通る直線を引く<br>確かめ：x = −3 のとき y = −3<br>点 (−3, −3) も直線上にある'][s-1]};}}));

/* ---- x の変域と y の変域 ---- */
FIGS.m2ichiji_heniki=host=>mk(host,{alt:'x の変域を決めたときの、グラフの線分と y の変域を示す図',
  sliders:[{k:'m',label:'y',min:1,max:2,step:1,v:1,fmt:m=>['0.5x + 1','−x + 1'][m-1]},{k:'p',label:'x の変域の左端',min:-4,max:0,step:1,v:-2},{k:'q',label:'x の変域の右端',min:1,max:5,step:1,v:4}],
  draw(v){const F=v.m===1?x=>.5*x+1:x=>-x+1,yp=F(v.p),yq=F(v.q),lo=Math.min(yp,yq),hi=Math.max(yp,yq),p=plot(RG).grid(),BAR='stroke="var(--gold)" stroke-width="4.5" stroke-linecap="round"';
    p.curve(F,CD).seg(v.p,yp,v.p,0,MD).seg(v.q,yq,v.q,0,MD).seg(v.p,yp,0,yp,MD).seg(v.q,yq,0,yq,MD);
    p.seg(v.p,0,v.q,0,BAR).seg(0,lo,0,hi,BAR);
    p.seg(v.p,yp,v.q,yq,'stroke="var(--c)" stroke-width="3.2" stroke-linecap="round"').dot(v.p,yp,'var(--c)').dot(v.q,yq,'var(--c)');
    return {svg:p.out(),read:`x の変域　${n(v.p)} ≤ x ≤ ${n(v.q)}<br>x = ${n(v.p)} のとき y = ${n(yp)}、x = ${n(v.q)} のとき y = ${n(yq)}<br>y の変域　<b>${n(lo)} ≤ y ≤ ${n(hi)}</b>`+(v.m===2?'<br>右下がりなので、x が最小のとき y が最大':'')};}});

/* ---- 2点を通る直線の式 ---- */
FIGS.m2ichiji_2ten=host=>mk(host,{alt:'2点 A, B を通る直線と、傾きを求めるための直角三角形の図',
  sliders:[{k:'bx',label:'B の x 座標',min:1,max:5,step:1,v:1},{k:'by',label:'B の y 座標',min:-5,max:5,step:1,v:4}],
  draw(v){const X=v.bx,Y=v.by,dx=X+2,dy=Y+2,a=dy/dx,b=Y-a*X,up=dy>0,p=plot(RG).grid(),A=fr(dy,dx),B=fr(2*Y-2*X,dx);
    if(dy)p.poly([[-2,-2],[X,-2],[X,Y]],FG);
    p.curve(x=>a*x+b,C).seg(-2,-2,X,-2,GL);
    if(dy)p.seg(X,-2,X,Y,GL).txt(X,(Y-2)/2,n(dy),`dx="8" dy="4" ${TG}`);
    p.txt((X-2)/2,-2,n(dx),`text-anchor="middle" dy="${up?14:-6}" ${TG}`).dot(-2,-2,'var(--ink)').dot(X,Y,'var(--ink)');
    p.txt(-2,-2,'A',`text-anchor="end" dx="-7" dy="${dy<0?15:-6}" ${TI}`).txt(X,Y,'B',`text-anchor="end" dx="-6" dy="${dy<0?15:-7}" ${TI}`);
    const head=`A(−2, −2)、B(${X}, ${n(Y)})<br>`;
    if(!dy)return {svg:p.out(),read:head+`傾き = 0 ÷ ${dx} = 0<br>x 軸に平行な直線 <b>y = −2</b><br>（傾きが 0 なので、一次関数ではない）`};
    return {svg:p.out(),read:head+`傾き =（y の増加量）÷（x の増加量）= ${dy<0?'('+n(dy)+')':n(dy)} ÷ ${dx} = ${A}<br>B を代入：${n(Y)} = ${/[−\/]/.test(A)?'('+A+')':A} × ${X} + b より b = ${B}<br>式：<b>${eqF(dy,dx,2*Y-2*X,dx)}</b>`};}});

/* ---- 二元一次方程式 ax + by = c のグラフ ---- */
FIGS.m2ichiji_axbyc=host=>mk(host,{alt:'二元一次方程式 ax + by = c のグラフで、a, b, c を動かす図',
  sliders:[{k:'a',label:'a',min:-3,max:3,step:1,v:2},{k:'b',label:'b',min:-3,max:3,step:1,v:1},{k:'c',label:'c',min:-6,max:6,step:1,v:4}],
  draw(v){const a=v.a,b=v.b,c=v.c,p=plot(RG).grid(),E=lhs(a,b)+' = '+n(c);let read;
    if(!a&&!b)read=`a = 0、b = 0 のとき、式は 0 = ${n(c)}<br>`+(c?'成り立つ x, y の組はない<br>グラフはない':'x, y がどんな値でも成り立つ<br>直線にはならない');
    else{
      if(b)p.curve(x=>(c-a*x)/b,C);else p.seg(c/a,-6,c/a,6,C);
      for(let x=-8;x<=8;x++)for(let y=-6;y<=6;y++)if(a*x+b*y===c)p.dot(x,y,'var(--gold)',3.2);
      if(!b)read=(a===1?E:E+'、つまり x = '+fr(c,a))+`<br>y がどんな値でも成り立つ<br>点 (${fr(c,a)}, 0) を通り、<b>y 軸に平行</b>な直線`;
      else if(!a)read=(b===1?E:E+'、つまり y = '+fr(c,b))+`<br>x がどんな値でも成り立つ<br>点 (0, ${fr(c,b)}) を通り、<b>x 軸に平行</b>な直線`;
      else read=`${E}<br>y について解くと <b>${eqF(-a,b,c,b)}</b><br>`+(c?`x 軸との交点 (${fr(c,a)}, 0)、y 軸との交点 (0, ${fr(c,b)})`:'原点 (0, 0) を通る')+'<br>金色の点：x, y がどちらも整数の解';}
    return {svg:p.out(),read};}});

/* ---- 連立方程式とグラフ：2直線の交点 ---- */
FIGS.m2ichiji_koten=host=>mk(host,{alt:'2つの直線の交点と、連立方程式の解の関係を示す図',
  sliders:[{k:'a',label:'直線 ② の傾き',min:-1,max:3,step:.5,v:1},{k:'b',label:'直線 ② の切片',min:-4,max:4,step:1,v:-2}],
  draw(v){const a=v.a,b=v.b,p=plot(RG).grid(),A2=Math.round(2*a);let read=`① x + y = 4　② ${eq(a,b)}<br>`;
    p.curve(x=>4-x,L2).curve(x=>a*x+b,C).txt(7,-3,'①',`dx="5" dy="-7" ${TI}`);
    let lx=-7,ly=a*lx+b;if(Math.abs(ly)>5){ly=ly>0?5:-5;lx=(ly-b)/a;}
    p.txt(lx,ly,'②',`dx="9" dy="${a>0?13:-6}" ${TC}`);
    if(A2===-2)read+=b===4?'①、② は同じ直線<br>直線上のすべての点が、連立方程式の解':'①、② はどちらも傾き −1 で、平行<br>交点がない。連立方程式の解はない';
    else{const X=2*(4-b)/(2+A2),Y=4-X,xs=fr(2*(4-b),2+A2),ys=fr(4*(2+A2)-2*(4-b),2+A2),out=Math.abs(X)>8||Math.abs(Y)>6;
      if(!out)p.seg(X,Y,X,0,MD).seg(X,Y,0,Y,MD).dot(X,Y,'var(--gold)');
      read+=`交点 <b>(${xs}, ${ys})</b><br>`+(out?'交点は図の外にある。計算で求める':Number.isInteger(X)?`x = ${xs}、y = ${ys} は ①、② の両方を成り立たせる`:'目盛りからは正確に読めない<br>連立方程式を解いて求める');}
    return {svg:p.out(),read};}});

/* ---- 一次関数の利用：進むようす（時間と道のり） ---- */
FIGS.m2ichiji_shinko=host=>mk(host,{alt:'弟と兄の進むようすを、時間と道のりのグラフで表した図',
  sliders:[{k:'t',label:'兄が出発する時刻（分後）',min:4,max:16,step:2,v:10},{k:'s',label:'兄の速さ（分速 m）',min:120,max:300,step:30,v:180}],
  draw(v){const t0=v.t,s=v.s,p=plot([-4.8,33.4,-330,2080]),te=t0+1800/s,X=s*t0/(s-60),Y=60*X,ok=Y<=1800+1e-9;
    axes(p,{x1:32,y1:1960,xs:[5,10,15,20,25,30],ys:[300,600,900,1200,1500,1800],xt:[0,10,20,30],yt:[600,1200,1800],xl:'x（分）',yl:'y（m）'});
    p.seg(0,1800,32,1800,MD).txt(7,1800,'駅','dy="-5" '+TI);
    if(ok)p.seg(X,Y,X,0,MD).seg(X,Y,0,Y,MD);
    p.seg(0,0,30,1800,L2).seg(t0,0,te,1800,C);
    p.txt(30,1800,'弟',`dx="5" dy="14" ${TI}`).txt(t0+250/s,250,'兄',`dx="8" dy="5" ${TC}`);
    if(ok)p.dot(X,Y,'var(--gold)');
    const ex=exact(X),ey=exact(Y,0);
    return {svg:p.out(),read:`弟：y = 60x<br>兄：y = ${s}(x − ${t0})（x ≥ ${t0}）<br>60x = ${s}(x − ${t0}) を解くと x ${ex?'=':'≈'} ${n(X,1)}<br>`+
      (ok?`<b>${ex?'':'約 '}${n(X,1)} 分後、家から ${ey?'':'約 '}${n(Y,0)} m の地点</b>で追いつく`:`そのとき y ${ey?'=':'≈'} ${n(Y,0)}。駅（1800 m）より先なので、<b>追いつけない</b>`)};}});

/* ---- 一次関数の利用：測定値を一次関数とみなす ---- */
FIGS.m2ichiji_minasu=host=>mk(host,{alt:'水を熱した時間と水温の測定値の点に、直線をあてはめる図',
  sliders:[{k:'a',label:'直線の傾き a',min:6,max:10,step:.5,v:6.5},{k:'b',label:'直線の切片 b',min:16,max:24,step:1,v:23}],
  draw(v){const D=[20,28.1,35.8,44.2,51.9,60.3],a=v.a,b=v.b,p=plot([-1.8,13.2,-17,119]),x100=(100-b)/a,xe=Math.min(12.6,(112-b)/a);
    axes(p,{x1:12.6,y1:112,xs:[2,4,6,8,10,12],ys:[20,40,60,80,100],xt:[0,2,4,6,8,10,12],xl:'x（分）',yl:'y（℃）'});
    p.seg(0,100,12.6,100,'stroke="var(--ng)" stroke-width="1.2" stroke-dasharray="5 4"');
    if(x100<=12.6)p.seg(x100,100,x100,0,MD);
    p.seg(0,b,xe,a*xe+b,C);
    D.forEach((y,i)=>p.dot(i,y,'var(--gold)',4));
    if(x100<=12.6)p.dot(x100,100,'var(--ink)',4);
    const err=D.reduce((t,y,i)=>t+Math.abs(y-(a*i+b)),0)/D.length;
    return {svg:p.out(),read:`直線 <i>${eq(a,b)}</i><br>測定値とのずれ（縦の差）の平均 ${n(err,1)} ℃`+(err<.5?'　よく合っている':'')+`<br>y = 100 となるのは x = (100 − ${b}) ÷ ${n(a)}<br>${exact(x100)?'=':'≈'} <b>${n(x100,1)}</b>（分）`};}});

/* ---- 一次関数の利用：動点と三角形の面積 ---- */
FIGS.m2ichiji_doten=host=>mk(host,{alt:'長方形の辺上を動く点 P と三角形 APD、その面積のグラフを並べた図',
  sliders:[{k:'x',label:'x（秒）',min:0,max:14,step:.5,v:2}],play:{k:'x',from:0,to:14,label:'P を A から D まで動かす',ms:5200},
  draw(v){const x=v.x,u=20,A=[28,70],B=[28,150],Cc=[148,150],D=[148,70],d=draw(),side=x<=4?0:x<=10?1:2;
    const P=side===0?[28,70+u*x]:side===1?[28+u*(x-4),150]:[148,150-u*(x-10)],y=side===0?3*x:side===1?12:42-3*x,tri=x>0&&x<14;
    const gx=t=>202+8.6*t,gy=s=>196-11.5*s,L=(a,b,st)=>d.line(a[0],a[1],b[0],b[1],st);
    if(tri)d.poly([A,P,D],FC);
    d.poly([A,B,Cc,D],INK);L(A,D,'stroke="var(--ink)" stroke-width="3"');
    if(tri){L(A,P,side===0?GL:CL);L(D,P,side===2?GL:CL);}
    if(side===1){L(P,[P[0],70],GD);tx(d,P[0]+9,114,'4','var(--gold)',11);}
    if(side===0&&x>=1)tx(d,39,(70+P[1])/2+4,n(x),'var(--gold)',11);
    if(side===2&&x<=13)tx(d,137,(70+P[1])/2+4,n(14-x),'var(--gold)',11);
    d.dot(P[0],P[1],'var(--gold)',4.5);
    tx(d,20,62,'A');tx(d,20,166,'B');tx(d,160,166,'C');tx(d,156,62,'D');tx(d,88,62,'6','var(--muted)',11);
    if(side===0)tx(d,12,P[1]+4,'P','var(--gold)');else if(side===1)tx(d,P[0],167,'P','var(--gold)');else tx(d,162,P[1]+4,'P','var(--gold)');
    tx(d,88,192,'AB = 4 cm、BC = 6 cm','var(--muted)',10);tx(d,88,207,'P は毎秒 1 cm で動く','var(--muted)',10);
    [4,10,14].forEach(t=>{d.line(gx(t),gy(0),gx(t),gy(12),GRID);tx(d,gx(t),gy(0)+13,String(t),'var(--muted)',10);});
    [6,12].forEach(s=>{d.line(gx(0),gy(s),gx(14),gy(s),GRID);tx(d,gx(0)-5,gy(s)+4,String(s),'var(--muted)',10,'end');});
    d.line(gx(0),gy(0),gx(14)+10,gy(0),AX).line(gx(0),gy(0),gx(0),gy(12)-14,AX);
    tx(d,gx(14)+12,gy(0)+26,'x（秒）','var(--muted)',10,'end');tx(d,gx(0)+6,gy(12)-12,'y（cm²）','var(--muted)',10,'start');
    const pts=[[0,0],[4,12],[10,12],[14,0]],pl=q=>q.map((w,i)=>(i?'L':'M')+f(gx(w[0]))+','+f(gy(w[1]))).join(' ');
    d.path(pl(pts),'stroke="var(--c)" stroke-width="1.6" fill="none" opacity=".4"');
    d.path(pl(pts.filter(w=>w[0]<x).concat([[x,y]])),'stroke="var(--c)" stroke-width="2.6" fill="none" stroke-linejoin="round"');
    d.line(gx(x),gy(y),gx(x),gy(0),MD).dot(gx(x),gy(y),'var(--gold)',4.5);
    const read=side===0?`P は辺 AB 上（0 ≤ x ≤ 4）<br>底辺 AD = 6、高さ AP = x = ${n(x)}<br>y = 1/2 × 6 × x = 3x = <b>${n(y)}</b>`:
      side===1?'P は辺 BC 上（4 ≤ x ≤ 10）<br>底辺 AD = 6、高さは AB と同じ 4（一定）<br>y = 1/2 × 6 × 4 = <b>12</b>':
      `P は辺 CD 上（10 ≤ x ≤ 14）<br>底辺 AD = 6、高さ DP = 14 − x = ${n(14-x)}<br>y = 1/2 × 6 × (14 − x) = 42 − 3x = <b>${n(y)}</b>`;
    return {svg:d.out(),read:read+(x===0?'<br>P が A にあり、三角形はできない':x===14?'<br>P が D にあり、三角形はできない':'')};}});

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
const rect=(d,A,B,Cc,D)=>{d.poly([A,B,Cc,D],INK);tx(d,A[0]-10,A[1]-4,'A');tx(d,B[0]-10,B[1]+12,'B');tx(d,Cc[0]+10,Cc[1]+12,'C');tx(d,D[0]+10,D[1]-4,'D');};
// 進む向きを表す矢印（(x, y) を先端として、角度 a 度の向き。右向きが 0、反時計回りが正）
const arw=(d,x,y,a)=>{const t=a*Math.PI/180,c=Math.cos(t),s=-Math.sin(t),q=(k,w)=>f(x-c*k+s*w)+','+f(y-s*k-c*w);return d.path(`M${q(22,0)} L${f(x)},${f(y)} M${q(7,4.5)} L${f(x)},${f(y)} L${q(7,-4.5)}`,'stroke="var(--gold)" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"');};
const Q={
 yomu:{alt:'2つの直線 ①、② のグラフ。どちらも、印をつけた点を通る',f(){const p=plot(RG).grid().curve(x=>2*x-1,C).curve(x=>-2/3*x+2,L2);
   [[0,-1],[1,1],[2,3]].forEach(q=>p.dot(q[0],q[1],'var(--c)',3.8));[[-3,4],[0,2],[3,0]].forEach(q=>p.dot(q[0],q[1],'var(--ink)',3.8));
   p.txt(3,5,'①',`dx="9" dy="10" ${TC}`).txt(6,-2,'②',`dx="4" dy="-8" ${TI}`);
   return {svg:p.out(),read:'直線 ①、② は、印をつけた点を通る'};}},
 renritsu:{alt:'方程式 x − y = 1 のグラフ ① と、方程式 x + 2y = 7 のグラフ ② が、点 (3, 2) で交わっている図',f(){const p=plot(RG).grid();
   p.seg(3,2,3,0,MD).seg(3,2,0,2,MD).curve(x=>x-1,C).curve(x=>-x/2+3.5,L2);
   [[0,-1],[1,0]].forEach(q=>p.dot(q[0],q[1],'var(--c)',3.6));[[1,3],[7,0]].forEach(q=>p.dot(q[0],q[1],'var(--ink)',3.6));
   p.dot(3,2,'var(--gold)').txt(6,5,'①',`dx="9" dy="10" ${TC}`).txt(-3,5,'②',`text-anchor="end" dx="-6" dy="14" ${TI}`);
   return {svg:p.out(),read:'① x − y = 1　② x + 2y = 7'};}},
 yomitoru:{alt:'2つの直線 ①、② のグラフ。どちらも、印をつけた点を通る',f(){const p=plot(RG).grid().curve(x=>x/2+1,C).curve(x=>-2*x+4,L2);
   [[-2,0],[0,1],[2,2],[4,3]].forEach(q=>p.dot(q[0],q[1],'var(--c)',3.8));[[0,4],[1,2],[2,0],[3,-2]].forEach(q=>p.dot(q[0],q[1],'var(--ink)',3.8));
   p.txt(6.5,4.25,'①',`dx="5" dy="15" ${TC}`).txt(-.75,5.5,'②',`text-anchor="end" dx="-7" dy="4" ${TI}`);
   return {svg:p.out(),read:'直線 ①、② は、印をつけた点を通る'};}},
 ryokin:{alt:'A コースと B コースの、印刷する枚数と料金の関係を表すグラフ',f(){const p=plot([-7,47.5,-330,2330]);
   axes(p,{x1:44,y1:2190,xs:[10,20,30,40],ys:[500,1000,1500,2000],xt:[0,10,20,30,40],xl:'x（枚）',yl:'y（円）'});
   p.seg(0,600,40,1400,C).seg(0,0,40,2000,L2).dot(0,600,'var(--c)',3.6).txt(40,1400,'A',`dx="7" dy="4" ${TC}`).txt(40,2000,'B',`dx="7" dy="4" ${TI}`);
   return {svg:p.out(),read:'A コース：基本料金 600 円と、1 枚 20 円<br>B コース：1 枚 50 円'};}},
 ofuku:{alt:'家と図書館を往復したときの、時間と家からの道のりの関係を表すグラフ',f(){const p=plot([-7.5,55.5,-190,1420]);
   axes(p,{x1:52,y1:1330,xs:[5,10,15,20,25,30,35,40,45,50],ys:[200,400,600,800,1000,1200],xt:[0,15,25,45],yt:[400,800,1200],xl:'x（分）',yl:'y（m）'});
   p.seg(15,1200,15,0,MD).seg(25,1200,25,0,MD).seg(0,0,15,1200,C).seg(15,1200,25,1200,C).seg(25,1200,45,0,C);
   [[0,0],[15,1200],[25,1200],[45,0]].forEach(q=>p.dot(q[0],q[1],'var(--c)',3.6));
   return {svg:p.out(),read:'家から図書館までの道のりは 1200 m<br>x は家を出てからの時間、y は家からの道のり'};}},
 oikake:{alt:'兄と弟の進むようすを表すグラフ。弟は公園で引き返している',f(){const p=plot([-5.2,35,-390,2830]);
   axes(p,{x1:33,y1:2660,xs:[5,10,15,20,25,30],ys:[400,800,1200,1600,2000,2400],xt:[0,6,16,26],yt:[800,1600,2400],xl:'x（分）',yl:'y（m）'});
   p.seg(0,2400,33,2400,MD).txt(22,2400,'公園','dy="-5" '+TI);
   p.seg(0,0,30,2400,L2).seg(6,0,16,2400,C).seg(16,2400,26,0,C);
   p.txt(30,2400,'兄',`dx="4" dy="15" ${TI}`).txt(7,240,'弟',`dx="8" dy="5" ${TC}`);
   return {svg:p.out(),read:'兄：分速 80 m で歩く<br>弟：6 分後に出発し、分速 240 m。公園ですぐ引き返す'};}},
 exdoten:{alt:'長方形 ABCD の辺 BC 上に点 P があり、三角形 ABP に色をつけた図',h:214,f(){const d=draw(),A=[70,36],B=[70,156],Cc=[250,156],D=[250,36],P=[178,156];
   d.poly([A,B,P],FC);rect(d,A,B,Cc,D);d.line(A[0],A[1],P[0],P[1],CL);d.dot(P[0],P[1],'var(--gold)',4.5);tx(d,P[0],P[1]+17,'P','var(--gold)');
   arw(d,226,144,0);arw(d,262,72,90);arw(d,134,24,180);
   tx(d,50,100,'4 cm','var(--muted)',11);tx(d,206,28,'6 cm','var(--muted)',11);
   return {svg:d.out(),read:'P は B を出発し、毎秒 2 cm で、C、D を通って A まで動く'};}},
 daikei:{alt:'長方形 ABCD の辺 AD 上に点 P があり、四角形 ABCP に色をつけた図',h:214,f(){const d=draw(),A=[70,40],B=[70,160],Cc=[250,160],D=[250,40],P=[142,40];
   d.poly([A,B,Cc,P],FC);rect(d,A,B,Cc,D);d.line(P[0],P[1],Cc[0],Cc[1],CL);d.dot(P[0],P[1],'var(--gold)',4.5);tx(d,P[0],P[1]-9,'P','var(--gold)');
   arw(d,214,28,0);tx(d,50,104,'4 cm','var(--muted)',11);tx(d,160,178,'6 cm','var(--muted)',11);
   return {svg:d.out(),read:'P は A を出発し、毎秒 1 cm で D まで動く<br>色をつけた部分が、四角形 ABCP'};}},
 chokkaku:{alt:'角 B が直角の直角三角形 ABC の辺 AB 上に点 P があり、三角形 APC に色をつけた図',h:222,f(){const d=draw(),A=[80,28],B=[80,178],Cc=[280,178],P=[80,96];
   d.poly([A,P,Cc],FC).poly([A,B,Cc],INK);d.path('M80,168 L90,168 L90,178','stroke="var(--muted)" stroke-width="1.2" fill="none"');
   d.line(P[0],P[1],Cc[0],Cc[1],CL);d.dot(P[0],P[1],'var(--gold)',4.5);
   tx(d,A[0],A[1]-8,'A');tx(d,B[0]-10,B[1]+12,'B');tx(d,Cc[0]+10,Cc[1]+12,'C');tx(d,P[0]+12,P[1]-2,'P','var(--gold)');
   arw(d,66,84,270);tx(d,44,140,'6 cm','var(--muted)',11);tx(d,180,196,'8 cm','var(--muted)',11);
   return {svg:d.out(),read:'∠B = 90°。P は A を出発し、毎秒 2 cm で、B を通って C まで動く'};}}
};
FIGS.m2ichiji_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){return q.f();}});};
})();
