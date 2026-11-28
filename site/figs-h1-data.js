/* 数学I「データの分析」の図（FIGS.h1data_*）。乱数は種を固定した擬似乱数（mulberry32）なので、同じ操作で同じ結果になる */
(function(){
const {plot,draw,n,sg,mk,C}=FIG;
const f=v=>v.toFixed(1);
const AX='stroke="var(--muted)" stroke-width="1.2"';
const DSH='stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 4"';
const WH='stroke="var(--ink)" stroke-width="1.6"';
// 文字（線に重なっても読めるよう、地の色でふちどる）
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
const sum=a=>a.reduce((s,x)=>s+x,0),mean=a=>sum(a)/a.length;
const srt=a=>[...a].sort((x,y)=>x-y);
const med=a=>{const b=srt(a),k=b.length;return k%2?b[(k-1)/2]:(b[k/2-1]+b[k/2])/2;};
// 四分位数：中央値で前半と後半に分け（個数が奇数のときは中央の値を除く）、それぞれの中央値をとる
const quart=a=>{const b=srt(a),k=b.length,h=Math.floor(k/2);return [med(b.slice(0,h)),med(b),med(b.slice(k-h))];};
const vari=a=>{const m=mean(a);return mean(a.map(x=>(x-m)*(x-m)));};
const cov=(a,b)=>{const ma=mean(a),mb=mean(b);return mean(a.map((x,i)=>(x-ma)*(b[i]-mb)));};
// 擬似乱数（mulberry32）。種 seed が同じなら、同じ数の列を返す
function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
// 数直線：値を px にする関数 X、高さ y、目盛り from〜to（step ごと）、数字は lab ごと
const axis=(d,X,y,from,to,step,lab,dy=19)=>{d.line(X(from)-8,y,X(to)+8,y,AX);
  for(let t=from;t<=to+1e-9;t+=step){const on=Math.abs(t/lab-Math.round(t/lab))<1e-9;d.line(X(t),y,X(t),y+(on?6:3.5),AX);if(on)tx(d,X(t),y+dy,n(t),'var(--muted)',10);}return d;};
// 箱ひげ図：ひげ lo〜hi、箱 q[0]〜q[2]、中央値 q[1]。上端 y、高さ h
const box=(d,X,y,h,lo,q,hi)=>{d.line(X(lo),y+h/2,X(q[0]),y+h/2,WH).line(X(q[2]),y+h/2,X(hi),y+h/2,WH).line(X(lo),y+h*.22,X(lo),y+h*.78,WH).line(X(hi),y+h*.22,X(hi),y+h*.78,WH);
  d.raw(`<rect x="${f(X(q[0]))}" y="${f(y)}" width="${f(X(q[2])-X(q[0]))}" height="${h}" fill="var(--c)" fill-opacity=".24" stroke="var(--c)" stroke-width="1.8"/>`);
  return d.line(X(q[1]),y,X(q[1]),y+h,'stroke="var(--gold)" stroke-width="2.6"');};
// 点を数直線の上に並べる（同じ値は上に積む）。pts は [値, 色, 半径]
const dots=(d,X,y,pts)=>{const c={};pts.forEach(([t,col,r])=>{const k=c[t]=(c[t]||0)+1;d.circle(X(t),y-(k-1)*10,r,`fill="var(--${col})" stroke="var(--bg2)" stroke-width="1"`);});return d;};

/* ---- 度数分布表とヒストグラム：階級の幅を変える ---- */
// 20 人の通学時間（分）
const TSU=[4,8,12,13,16,18,21,22,23,25,26,27,28,31,33,34,37,42,46,55];
FIGS.h1data_hist=host=>mk(host,{alt:'20 人の通学時間のヒストグラム。階級の幅を変えると形が変わる',
  sliders:[{k:'i',label:'階級の幅（分）',min:0,max:2,step:1,v:1,fmt:i=>String([5,10,20][i])}],
  draw(v){const w=[5,10,20][v.i],k=60/w,fr=Array(k).fill(0);TSU.forEach(x=>fr[Math.floor(x/w)]++);
    const d=draw(),X=x=>36+x*4.6,Y=c=>208-c*15,mx=Math.max(...fr),jm=fr.indexOf(mx);
    [5,10].forEach(c=>d.line(36,Y(c),312,Y(c),'stroke="var(--line)" stroke-width=".8"'));
    fr.forEach((c,j)=>{if(!c)return;const col=j===jm?'gold':'c';
      d.raw(`<rect x="${f(X(j*w))}" y="${f(Y(c))}" width="${f(w*4.6)}" height="${f(c*15)}" fill="var(--${col})" fill-opacity=".42" stroke="var(--${col})" stroke-width="1.2"/>`);
      tx(d,X(j*w+w/2),Y(c)-5,String(c),j===jm?'var(--gold)':'var(--ink)',10);});
    d.line(36,208,318,208,AX).line(36,208,36,22,AX);
    [0,5,10].forEach(c=>tx(d,30,Y(c)+4,String(c),'var(--muted)',10,'end'));
    for(let x=0;x<=60;x+=10){d.line(X(x),208,X(x),213,AX);tx(d,X(x),226,String(x),'var(--muted)',10);}
    tx(d,318,243,'通学時間（分）','var(--muted)',10,'end');tx(d,8,15,'度数（人）','var(--muted)',10,'start');
    const tm=sum(fr.map((c,j)=>c*(j*w+w/2)))/20;
    return {svg:d.out(),read:`階級の幅 ${w} 分、階級の数 ${k}<br>度数が最も大きい階級<br>${jm*w} 分以上 ${jm*w+w} 分未満（${mx} 人）<br>最頻値（その階級値）<b>${n(jm*w+w/2)} 分</b><br>度数分布表から求めた平均値 <i>${n(tm,3)} 分</i><br>もとのデータの平均値 ${n(mean(TSU),3)} 分`};}});

/* ---- 代表値：最も大きい値を動かす ---- */
FIGS.h1data_daihyo=host=>mk(host,{alt:'7 個のデータのうち最も大きい値を動かしたときの、平均値と中央値の位置を示す図',h:210,
  sliders:[{k:'x',label:'最も大きい値（緑の点）',min:8,max:30,step:1,v:9}],play:{k:'x',from:8,to:30,label:'大きい値を遠ざける',ms:3200},
  draw(v){const a=[1,3,4,5,6,7,v.x],m=mean(a),md=med(a),d=draw(),X=t=>20+t*10,y=112;
    d.line(X(md),y-58,X(md),y,'stroke="var(--c)" stroke-width="2"');
    axis(d,X,y,0,30,1,5,34);
    a.forEach((t,i)=>d.circle(X(t),y-9,i===6?5.5:4.5,`fill="var(--${i===6?'ok':'ink'})" stroke="var(--bg2)" stroke-width="1"`));
    tx(d,X(md),y-65,'中央値 '+n(md),'var(--c)',11);
    d.poly([[X(m),y+2],[X(m)-10,y+19],[X(m)+10,y+19]],'fill="var(--gold)" stroke="var(--bg2)" stroke-width="1"');tx(d,X(m),y+54,'平均値 '+n(m),'var(--gold)',11);
    const below=a.filter(t=>t<m-1e-9).length;
    return {svg:d.out(),read:`データ：1, 3, 4, 5, 6, 7, ${v.x}<br>平均値 = ${sum(a)} ÷ 7 = <b>${n(m)}</b><br>中央値 = 4 番目の値 = <i>${n(md)}</i><br>平均値より小さい値は 7 個のうち ${below} 個`};}});

/* ---- 箱ひげ図：点を動かす ---- */
const HK=[4,6,7,9,11,12,14,15,17];
FIGS.h1data_hako=host=>mk(host,{alt:'11 個のデータの点と、その箱ひげ図。点を動かすと箱ひげ図が変わる',h:210,
  sliders:[{k:'b',label:'金色の点の値',min:0,max:17,step:1,v:10},{k:'a',label:'最も大きい点（緑）の値',min:20,max:30,step:1,v:20}],play:{k:'a',from:20,to:30,label:'最も大きい点を遠ざける',ms:3000},
  draw(v){const a=srt([...HK,v.b,v.a]),q=quart(a),lo=a[0],hi=a[10],d=draw(),X=t=>20+t*10,y=74;
    axis(d,X,y,0,30,1,5);
    dots(d,X,y-9,[...HK.map(t=>[t,'ink',4.2]),[v.b,'gold',5],[v.a,'ok',5]]);
    box(d,X,y+38,34,lo,q,hi);
    [['最小',lo],['Q1',q[0]],['Q2',q[1]],['Q3',q[2]],['最大',hi]].forEach(([s,t])=>{tx(d,X(t),y+90,s,'var(--muted)',10);tx(d,X(t),y+105,n(t),'var(--ink)',11);});
    return {svg:d.out(),read:`小さい順：${a.join(', ')}<br>範囲 = ${hi} − ${lo} = <b>${hi-lo}</b><br>Q1 = ${n(q[0])}、Q2（中央値）= ${n(q[1])}、Q3 = ${n(q[2])}<br>四分位範囲 = ${n(q[2])} − ${n(q[0])} = <b>${n(q[2]-q[0])}</b>`};}});

/* ---- 外れ値の判定 ---- */
const HZ=[12,14,15,16,17,18,19,21,22];
FIGS.h1data_hazure=host=>mk(host,{alt:'10 個のデータと外れ値の境目。外れ値を別に示した箱ひげ図',h:200,
  sliders:[{k:'x',label:'金色の点の値',min:0,max:40,step:1,v:26}],play:{k:'x',from:26,to:40,label:'点を右へ遠ざける',ms:3000},
  draw(v){const a=srt([...HZ,v.x]),q=quart(a),iq=q[2]-q[0],L=q[0]-1.5*iq,U=q[2]+1.5*iq,ins=a.filter(t=>t>L&&t<U),out=v.x<=L||v.x>=U,d=draw(),X=t=>20+t*7.5,y=88;
    d.raw(`<rect x="6" y="24" width="${f(X(L)-6)}" height="162" fill="var(--ng)" fill-opacity=".13"/><rect x="${f(X(U))}" y="24" width="${f(334-X(U))}" height="162" fill="var(--ng)" fill-opacity=".13"/>`);
    const NG='stroke="var(--ng)" stroke-width="1.4" stroke-dasharray="5 4"';d.line(X(L),24,X(L),186,NG).line(X(U),24,X(U),186,NG);
    tx(d,X(L),17,n(L),'var(--ng)',11);tx(d,X(U),17,n(U),'var(--ng)',11);
    tx(d,(6+X(L))/2,40,'外れ値','var(--ng)',10);tx(d,(X(U)+334)/2,40,'外れ値','var(--ng)',10);
    axis(d,X,y,0,40,5,10);
    dots(d,X,y-8,[...HZ.map(t=>[t,'ink',3.4]),[v.x,'gold',5]]);
    box(d,X,y+38,32,ins[0],q,ins[ins.length-1]);
    if(out)d.circle(X(v.x),y+54,4.6,'fill="none" stroke="var(--gold)" stroke-width="2"');
    return {svg:d.out(),read:`Q1 = ${n(q[0])}、Q3 = ${n(q[2])}、四分位範囲 ${n(iq)}<br>${n(q[0])} − 1.5×${n(iq)} = ${n(L)} 以下が外れ値<br>${n(q[2])} + 1.5×${n(iq)} = ${n(U)} 以上が外れ値<br>金色の点 ${v.x} は <b>${out?'外れ値':'外れ値ではない'}</b>`+(out?'<br>ひげは、外れ値を除いた端まで':'')};}});

/* ---- ヒストグラムの形と箱ひげ図 ---- */
// 階級（幅 10）ごとの度数。各階級の中に値を等間隔に置いて、24 個のデータとする
const KT=[[0,1,2,3,6,6,3,2,1,0],[2,6,6,4,2,2,1,0,1,0],[0,1,0,1,2,2,4,6,6,2]];
const ktData=m=>{const a=[];KT[m].forEach((c,k)=>{for(let j=0;j<c;j++)a.push(10*k+10*(j+.5)/c);});return a;};
FIGS.h1data_katachi=host=>mk(host,{alt:'ヒストグラムの形と箱ひげ図の対応を示す図',h:230,
  sliders:[{k:'m',label:'分布の形',min:1,max:3,step:1,v:1,fmt:m=>['左右対称','右に裾が長い','左に裾が長い'][m-1]}],
  draw(v){const fr=KT[v.m-1],a=ktData(v.m-1),q=quart(a),lo=a[0],hi=a[a.length-1],d=draw(),X=t=>30+t*2.8,Y=c=>132-c*17;
    q.forEach(t=>d.line(X(t),24,X(t),172,DSH));
    fr.forEach((c,k)=>{if(c)d.raw(`<rect x="${f(X(10*k))}" y="${f(Y(c))}" width="28" height="${f(c*17)}" fill="var(--c)" fill-opacity=".4" stroke="var(--c)" stroke-width="1.2"/>`);});
    d.line(22,132,318,132,AX);for(let t=0;t<=100;t+=20){d.line(X(t),132,X(t),137,AX);tx(d,X(t),150,String(t),'var(--muted)',10);}
    box(d,X,172,32,lo,q,hi);
    tx(d,X(q[0]),220,'Q1','var(--muted)',10);tx(d,X(q[1]),220,'Q2','var(--gold)',10);tx(d,X(q[2]),220,'Q3','var(--muted)',10);
    return {svg:d.out(),read:`24 個のデータ<br>Q1 = ${n(q[0],1)}、Q2 = ${n(q[1],1)}、Q3 = ${n(q[2],1)}<br>左のひげの長さ ${n(q[0]-lo,1)}、右のひげの長さ ${n(hi-q[2],1)}<br>箱の左側 ${n(q[1]-q[0],1)}、箱の右側 ${n(q[2]-q[1],1)}<br>`+['山が中央。箱もひげも左右がほぼ同じ長さ','山が左。右のひげと箱の右側が長い','山が右。左のひげと箱の左側が長い'][v.m-1]};}});
FIGS.h1data_katachi.data=ktData;

/* ---- 分散：偏差を1辺とする正方形 ---- */
FIGS.h1data_bunsan=host=>mk(host,{alt:'5 個のデータについて、偏差を1辺とする正方形をかいた図。正方形の面積の平均が分散',
  sliders:[{k:'a',label:'最も小さい点の値',min:0,max:3,step:1,v:1},{k:'b',label:'最も大きい点の値',min:8,max:12,step:1,v:8}],play:{k:'b',from:8,to:12,label:'大きい点を遠ざける',ms:2800},
  draw(v){const a=[v.a,4,5,7,v.b],m=mean(a),dv=a.map(t=>t-m),ss=sum(dv.map(t=>t*t)),s2=ss/5,s=Math.sqrt(s2),d=draw(),u=24,X=t=>24+t*u,y=204;
    dv.forEach((e,i)=>{const w=Math.abs(e)*u;if(w>.5)d.raw(`<rect x="${f(Math.min(X(a[i]),X(m)))}" y="${f(y-w)}" width="${f(w)}" height="${f(w)}" fill="var(--c)" fill-opacity=".15" stroke="var(--c)" stroke-width="1.2"/>`);});
    d.raw(`<rect x="${f(X(m))}" y="${f(y-s*u)}" width="${f(s*u)}" height="${f(s*u)}" fill="none" stroke="var(--gold)" stroke-width="2" stroke-dasharray="5 4"/>`);
    const top=y-Math.max(...dv.map(Math.abs))*u;d.line(X(m),top-8,X(m),y,'stroke="var(--ink)" stroke-width="1.4"');tx(d,X(m),top-13,'平均値 '+n(m),'var(--ink)',11);
    axis(d,X,y,0,12,1,2);
    a.forEach((t,i)=>d.circle(X(t),y,i===0||i===4?5:4.2,`fill="var(--${i===0||i===4?'ok':'ink'})" stroke="var(--bg2)" stroke-width="1"`));
    tx(d,X(m)+s*u/2,y-s*u-5,'分散','var(--gold)',10);
    return {svg:d.out(),read:`データ：${a.join(', ')}<br>偏差：${dv.map(t=>n(t)).join(', ')}<br>偏差の2乗の和 = ${n(ss)}<br>分散 = ${n(ss)} ÷ 5 = <b>${n(s2,3)}</b><br>標準偏差 = √${n(s2,3)} ${Number.isInteger(s)?'=':'≈'} <b>${n(s)}</b>`};}});

/* ---- 変量の変換 y = ax + b ---- */
const HX=[2,4,5,6,8];
const lin=(a,b)=>{const s=a===0?'':a===1?'x':a===-1?'−x':n(a)+'x';return s?(b?s+' '+sg(b):s):n(b);};
FIGS.h1data_henkan=host=>mk(host,{alt:'変量 x のデータと、y = ax + b で変換したデータを、上下の数直線に示す図',h:230,
  sliders:[{k:'a',label:'a（何倍するか）',min:-1,max:2,step:.5,v:2},{k:'b',label:'b（いくつたすか）',min:-3,max:3,step:1,v:1}],
  draw(v){const ys=HX.map(t=>v.a*t+v.b),d=draw(),X=t=>20+(t+12)*9.375,y1=62,y2=170,my=v.a*5+v.b,sy=Math.abs(v.a)*2;
    HX.forEach((t,i)=>d.line(X(t),y1-8,X(ys[i]),y2-8,'stroke="var(--line)" stroke-width="1.1"'));
    const bar=(m,s,y,col)=>{d.line(X(m-s),y,X(m+s),y,`stroke="var(--${col})" stroke-width="2.4"`).line(X(m-s),y-4,X(m-s),y+4,`stroke="var(--${col})" stroke-width="2"`).line(X(m+s),y-4,X(m+s),y+4,`stroke="var(--${col})" stroke-width="2"`);d.poly([[X(m),y-6],[X(m)-5,y+4],[X(m)+5,y+4]],`fill="var(--${col})"`);};
    axis(d,X,y1,-10,20,5,5);axis(d,X,y2,-10,20,5,5);
    bar(5,2,y1+34,'c');bar(my,sy,y2+34,'gold');
    dots(d,X,y1-8,HX.map(t=>[t,'c',4]));dots(d,X,y2-8,ys.map(t=>[t,'gold',4]));
    tx(d,10,y1-32,'x','var(--c)',12,'start');tx(d,10,y2-32,'y = '+lin(v.a,v.b),'var(--gold)',12,'start');
    return {svg:d.out(),read:`x：平均値 5、標準偏差 2<br>y = ${lin(v.a,v.b)}<br>y の平均値 = ${n(v.a)}×5 ${sg(v.b)} = <b>${n(my)}</b><br>y の標準偏差 = |${n(v.a)}|×2 = <b>${n(sy)}</b>`+(v.a<0?'<br>並ぶ順は逆になるが、散らばりは |a| 倍':v.a===0?'<br>すべて同じ値になり、散らばりは 0':'<br>b をたしても、散らばりは変わらない')};}});

/* ---- なぜ：基準の値 c からの差の2乗の平均 ---- */
const KJ=[2,4,5,9];
FIGS.h1data_kijun=host=>mk(host,{alt:'基準の値 c からの差の2乗の平均を、c の関数としてかいた放物線。c が平均値のとき最小になる',
  sliders:[{k:'c',label:'基準の値 c',min:0,max:9,step:.5,v:2}],play:{k:'c',from:0,to:5,label:'基準を平均値に近づける',ms:3000},
  draw(v){const g=c=>mean(KJ.map(x=>(x-c)*(x-c))),m=mean(KJ),c=v.c,p=plot([-1.5,10.5,-7,38]);
    p.seg(-1.5,0,10.5,0,AX).seg(0,-7,0,38,AX);
    for(let t=2;t<=10;t+=2)p.seg(t,0,t,-1,AX).txt(t,0,String(t),'text-anchor="middle" dy="17"');
    [10,20,30].forEach(t=>p.seg(0,t,-.14,t,AX).txt(0,t,String(t),'text-anchor="end" dx="-7" dy="4"'));
    p.txt(10.5,0,'c','text-anchor="end" dx="-4" dy="-6"').txt(3.7,38,'縦軸：差の2乗の平均','dy="13"');
    p.seg(0,g(0),m,g(0),DSH).seg(m,0,m,g(m),DSH).seg(m,g(m),m,g(0),'stroke="var(--gold)" stroke-width="2.6"').curve(g,C);
    p.seg(c,0,c,g(c),'stroke="var(--ok)" stroke-width="1.2" stroke-dasharray="3 3"');
    KJ.forEach(x=>p.dot(x,0,'var(--ink)',4));
    p.dot(0,g(0),'var(--ink)',3.5).dot(m,g(m),'var(--gold)',4).dot(c,g(c),'var(--ok)',5);
    const T='paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5"';
    p.txt(.35,g(0),'2乗の平均 '+n(g(0)),'dy="-7" fill="var(--ink)" '+T).txt(m+.3,g(m),'分散 '+n(g(m)),'dy="15" fill="var(--gold)" '+T).txt(m+.3,22.5,'(平均値)² = '+n(m*m),'fill="var(--gold)" '+T);
    return {svg:p.out(),read:`データ 2, 4, 5, 9（平均値 5）<br>基準 c = ${n(c)} からの差の2乗の平均<br>= <b>${n(g(c),3)}</b><br>c = 0 のとき ${n(g(0))}（2乗の平均）<br>c = 5（平均値）のとき最小で ${n(g(m))}（分散）`};}});

/* ---- 散布図：1点を動かすと共分散と相関係数が変わる ---- */
const SK=[[1,1.5],[2,3],[3,2],[4,4],[5,3.5],[6,5]];
FIGS.h1data_sokan=host=>mk(host,{alt:'散布図の1点を動かすと、偏差の積を表す長方形と、共分散・相関係数が変わる図',
  sliders:[{k:'x',label:'金色の点の x',min:0,max:9,step:.5,v:7},{k:'y',label:'金色の点の y',min:0,max:8,step:.5,v:6}],
  draw(v){const P=[...SK,[v.x,v.y]],xs=P.map(q=>q[0]),ys=P.map(q=>q[1]),mx=mean(xs),my=mean(ys),sxy=cov(xs,ys),sx=Math.sqrt(vari(xs)),sy=Math.sqrt(vari(ys)),r=sxy/(sx*sy),p=plot([-.7,9.7,-.9,8.7]).grid();
    P.forEach(q=>{const pr=(q[0]-mx)*(q[1]-my);if(Math.abs(pr)>1e-9){const col=pr>0?'ok':'ng';p.poly([[mx,my],[q[0],my],[q[0],q[1]],[mx,q[1]]],`fill="var(--${col})" fill-opacity=".17" stroke="var(--${col})" stroke-width=".8"`);}});
    p.seg(mx,-.9,mx,8.7,DSH).seg(-.7,my,9.7,my,DSH);
    P.forEach((q,i)=>p.dot(q[0],q[1],i===6?'var(--gold)':'var(--ink)',i===6?5.5:4));
    return {svg:p.out(),read:`平均値の点 (${n(mx)}, ${n(my)})（点線の交点）<br>共分散 <i>${n(sxy)}</i><br>x の標準偏差 ${n(sx)}、y の標準偏差 ${n(sy)}<br>相関係数 r = <b>${n(r)}</b><br>緑の長方形は偏差の積が正、赤は負`};}});

/* ---- 相関係数と散布図の形 ---- */
// 平均 0・分散 1 で、互いの共分散がちょうど 0 になる2つの数の列（散布図の材料）
function base(N,seed){const r=rng(seed),g=()=>{let s=0;for(let i=0;i<6;i++)s+=r();return s-3;};
  const std=a=>{const m=mean(a),s=Math.sqrt(vari(a));return a.map(x=>(x-m)/s);};
  const x=std(Array.from({length:N},g));let e=Array.from({length:N},g);const c=cov(e,x);e=std(e.map((t,i)=>t-c*x[i]));return [x,e];}
const BASE=base(30,7);
const mix=(B,r)=>{const k=Math.sqrt(Math.max(0,1-r*r));return B[0].map((t,i)=>[t,r*t+k*B[1][i]]);};
FIGS.h1data_rmihon=host=>mk(host,{alt:'相関係数の値を変えると散布図の形が変わる図',
  sliders:[{k:'r',label:'相関係数 r',min:-1,max:1,step:.1,v:.7}],play:{k:'r',from:-1,to:1,label:'r を −1 から 1 まで動かす',ms:4200},
  draw(v){const R=Math.round(v.r*10),r=R/10,p=plot([0,10,0,10]);
    p.seg(.5,.7,9.7,.7,AX).seg(.7,.5,.7,9.7,AX).txt(9.7,.7,'x','text-anchor="end" dy="-6"').txt(.7,9.7,'y','dx="7" dy="8"');
    mix(BASE,r).forEach(q=>p.dot(5.2+1.5*q[0],5.2+1.5*q[1],'var(--c)',3.8));
    return {svg:p.out(),read:`30 個の点の相関係数 r = <b>${n(r,1)}</b><br>`+(R===10?'すべての点が、右上がりの直線の上にある':R===-10?'すべての点が、右下がりの直線の上にある':R===0?'相関がない（増減の傾向が見られない）':R>0?'正の相関（x が大きいほど y も大きい傾向）<br>1 に近いほど、右上がりの直線の近くに集まる':'負の相関（x が大きいほど y は小さい傾向）<br>−1 に近いほど、右下がりの直線の近くに集まる')};}});

/* ---- なぜ：f(t) = (tu + v)² の平均 は負にならない ---- */
FIGS.h1data_hanbetsu=host=>mk(host,{alt:'左に偏差の散布図、右に t の二次式 f(t) のグラフ。グラフは t 軸より下に出ない',
  sliders:[{k:'r',label:'相関係数 r',min:-1,max:1,step:.1,v:.6}],play:{k:'r',from:.6,to:1,label:'r を 1 に近づける',ms:3000},
  draw(v){const R=Math.round(v.r*10),r=R/10,a=plot([-5.8,5.8,-4.2,4.2],165,226),b=plot([-2.1,2.1,-1.2,5.2],165,226),F=t=>4*t*t+4*r*t+1;
    a.seg(-5.8,0,5.8,0,AX).seg(0,-4.2,0,4.2,AX).txt(5.8,0,'u','text-anchor="end" dx="-4" dy="-6"').txt(0,4.2,'v','dx="6" dy="12"');
    mix(BASE,r).forEach(q=>a.dot(2*q[0],q[1],'var(--c)',3.2));
    b.poly([[-2.1,0],[2.1,0],[2.1,-1.2],[-2.1,-1.2]],'fill="var(--ng)" fill-opacity=".13"');
    b.seg(-2.1,0,2.1,0,AX).seg(0,-1.2,0,5.2,AX).seg(1,0,1,-.1,AX).seg(-1,0,-1,-.1,AX).seg(0,1,-.07,1,AX);
    b.txt(1,0,'1','text-anchor="middle" dy="15"').txt(-1,0,'−1','text-anchor="middle" dy="15"').txt(2.1,0,'t','text-anchor="end" dx="-4" dy="-6"').txt(0,1,'1','text-anchor="end" dx="-6" dy="-3"');
    b.curve(F,C).dot(-r/2,1-r*r,'var(--gold)',4.5);
    const cap=(x,t)=>`<text x="${x}" y="15" font-size="10.5" font-family="var(--f-mono)" fill="var(--ink)">${t}</text>`;
    const svg=cap(6,'偏差 (u, v) の散布図')+cap(181,'y = f(t) のグラフ')+`<svg x="0" y="24" width="165" height="226" viewBox="0 0 165 226">${a.out()}</svg><svg x="175" y="24" width="165" height="226" viewBox="0 0 165 226">${b.out()}</svg><line x1="170" y1="0" x2="170" y2="250" stroke="var(--line)"/>`;
    return {svg,read:`x の分散 4、y の分散 1、共分散 ${n(2*r)}<br>f(t) = 4t²${R?' '+sg(4*r)+'t':''} + 1<br>最小値（金色の点）<b>${n(1-r*r)}</b> … 0 以上<br>D/4 = ${R<0?'('+n(2*r)+')':n(2*r)}² − 4×1 = <b>${n(4*r*r-4)}</b> … 0 以下<br>相関係数 r = ${n(r,1)}`+(Math.abs(R)===10?'<br>グラフが t 軸に接する。点は一直線上':'')};}});

/* ---- 仮説検定の考え方：コイン 20 回 × 200 セット ---- */
// r 回目の実験。各セットで 20 回投げ、表を 1、裏を 0 として記録する
const memo={};
const coins=r=>memo[r]||(memo[r]=(()=>{const g=rng(3182000+r*37),out=[];for(let s=0;s<200;s++){const row=[];for(let i=0;i<20;i++)row.push(g()<.5?1:0);out.push(row);}return out;})());
const heads=r=>coins(r).map(sum);
FIGS.h1data_coinset=host=>mk(host,{alt:'コインを 20 回投げた1セット分の結果を並べた図',h:132,
  sliders:[{k:'t',label:'何セット目か',min:1,max:200,step:1,v:1}],play:{k:'t',from:1,to:20,label:'20 セット目まで順に見る',ms:6000},
  draw(v){const row=coins(1)[v.t-1],k=sum(row),d=draw();
    row.forEach((c,i)=>{const x=35+(i%10)*30,y=38+Math.floor(i/10)*48;
      d.circle(x,y,12.5,c?'fill="var(--gold)" stroke="var(--gold)" stroke-width="1.5"':'fill="none" stroke="var(--muted)" stroke-width="1.5"');
      d.raw(`<text x="${x}" y="${y+4}" font-size="11" font-family="var(--f-mono)" fill="var(--${c?'on-c':'muted'})" text-anchor="middle">${c?'表':'裏'}</text>`);});
    return {svg:d.out(),read:`${v.t} セット目：コインを 20 回投げた結果<br>表は <b>${k} 回</b>、裏は ${20-k} 回<br>これを 200 セット行い、表の回数を記録する`};}});
FIGS.h1data_coin=host=>mk(host,{alt:'コインを 20 回投げる実験を 200 セット行ったときの、表の回数の分布',
  sliders:[{k:'k',label:'境目（表がこの回数以上）',min:10,max:18,step:1,v:15},{k:'r',label:'実験のやり直し（何回目か）',min:1,max:5,step:1,v:1}],
  draw(v){const h=heads(v.r),fr=Array(21).fill(0);h.forEach(c=>fr[c]++);const cnt=h.filter(c=>c>=v.k).length,rel=cnt/200,d=draw(),X=t=>22+t*14.3,Y=c=>204-c*3.6;
    fr.forEach((c,t)=>{if(!c)return;const on=t>=v.k;d.raw(`<rect x="${f(X(t)+1)}" y="${f(Y(c))}" width="12.3" height="${f(c*3.6)}" fill="var(--${on?'gold':'c'})" fill-opacity="${on?.8:.45}"/>`);tx(d,X(t)+7.15,Y(c)-4,String(c),on?'var(--gold)':'var(--muted)',9);});
    d.line(18,204,328,204,AX);
    for(let t=0;t<=20;t++)tx(d,X(t)+7.15,218,String(t),t>=v.k?'var(--gold)':'var(--muted)',9);
    d.line(X(v.k)-.4,30,X(v.k)-.4,204,'stroke="var(--gold)" stroke-width="1.4" stroke-dasharray="5 4"');
    tx(d,332,18,`金色：表が ${v.k} 回以上`,'var(--gold)',10.5,'end');tx(d,6,18,'セット数','var(--muted)',10,'start');tx(d,332,240,'表の回数（回）','var(--muted)',10,'end');
    return {svg:d.out(),read:`コイン 20 回 × 200 セット（${v.r} 回目の実験）<br>表が ${v.k} 回以上：${cnt} セット<br>相対度数 ${cnt} ÷ 200 = <b>${n(rel,3)}</b><br>`+(rel<.05?'0.05 より小さい<br>→ 偶然ではめったに起こらない':'0.05 以上<br>→ 偶然でも起こりうる')};}});
FIGS.h1data_coin.sim=heads;

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
const Q={
 hako2:{alt:'A 組と B 組の得点の箱ひげ図',h:150,f(d){const X=t=>26+(t-20)*3.6;
   for(let t=20;t<=100;t+=10)d.line(X(t),14,X(t),112,'stroke="var(--line)" stroke-width=".8"');
   axis(d,X,112,20,100,10,10);
   box(d,X,24,28,30,[45,60,70],90);box(d,X,70,28,40,[55,60,65],80);
   tx(d,X(30)-8,43,'A','var(--ink)',12,'end');tx(d,X(40)-8,89,'B','var(--ink)',12,'end');
   return 'A 組：最小値 30、Q1 45、中央値 60、Q3 70、最大値 90<br>B 組：最小値 40、Q1 55、中央値 60、Q3 65、最大値 80<br>（目盛りは 10 点ごと。金色の線が中央値）';}},
 sanpu3:{alt:'3つの散布図 ①、②、③',h:150,f(d){
   [[.7,21],[-.9,22],[.1,23]].forEach(([r,seed],j)=>{const x0=10+j*110,B=base(20,seed);
     d.raw(`<rect x="${x0}" y="12" width="100" height="100" fill="none" stroke="var(--muted)" stroke-width="1"/>`);
     mix(B,r).forEach(q=>d.circle(x0+50+17*q[0],62-17*q[1],3,'fill="var(--c)" stroke="var(--bg2)" stroke-width=".8"'));
     tx(d,x0+50,132,'①②③'[j],'var(--ink)',13);});
   return '横軸が x、縦軸が y。右へ行くほど x が大きく、上へ行くほど y が大きい';}}
};
FIGS.h1data_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){const d=draw(),r=q.f(d);return {svg:d.out(),read:r};}});};
FIGS.h1data_q.base=base;FIGS.h1data_q.mix=mix;
})();
