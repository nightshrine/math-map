/* 数学I「数と式・集合と論理」の図（FIGS.h1shiki_*） */
(function(){
const {plot,draw,n,sg,mk,C,DASH}=FIG;
const f=v=>v.toFixed(1);
const SUB='stroke="var(--muted)" stroke-width="1.2" fill="none"';
const CC='var(--c)',GD='var(--gold)',INK='var(--ink)',MU='var(--muted)';
// 文字（線に重なっても読めるよう、地の色でふちどる）
const tx=(d,x,y,t,c=INK,s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
// 数直線：x0〜x1 を左右に余白を取って置き、数学の座標 → px の関数を返す。every は目盛りの数字の間隔
const numline=(d,x0,x1,y,every=1)=>{const L=22,R=318,sx=x=>L+(x-x0)/(x1-x0)*(R-L);
  d.line(L-10,y,R+10,y,'stroke="var(--muted)" stroke-width="1.4"');d.path(`M${R+4},${y-4} L${R+10},${y} L${R+4},${y+4}`,SUB);
  for(let k=Math.ceil(x0);k<=x1;k++){d.line(sx(k),y-4,sx(k),y+4,'stroke="var(--muted)" stroke-width="1"');if(k%every===0)tx(d,sx(k),y+18,n(k),MU,10);}
  return sx;};
// 端の印：白丸（その数をふくまない）
const open=(d,x,y,col)=>d.circle(x,y,4.5,`fill="var(--bg2)" stroke="${col}" stroke-width="2"`);
const par=v=>v<0?`(${n(v)})`:n(v);            // 負の数にかっこを付ける
const cf=k=>k===1?'':n(k);                    // 係数 1 は書かない

/* ---- 展開を面積で見る：(ax+b)(2x+d) ---- */
FIGS.h1shiki_tenkai=host=>mk(host,{alt:'横 ax+b、縦 2x+d の長方形を、x²・x・1 の部分に分けた図',
  sliders:[{k:'a',label:'a',min:1,max:3,step:1,v:2},{k:'b',label:'b',min:1,max:4,step:1,v:3},{k:'d',label:'d',min:1,max:4,step:1,v:1}],
  draw(v){const a=v.a,b=v.b,e=v.d,X=50,U=15,W=a*X+b*U,H=2*X+e*U,ox=(340-W)/2+10,oy=(250-H)/2+8,d=draw();
    const rc=(x,y,w,h,st)=>d.raw(`<rect x="${f(x)}" y="${f(y)}" width="${w}" height="${h}" ${st}/>`);
    const S1='fill="var(--c)" fill-opacity=".24" stroke="var(--c)" stroke-width="1"',S2='fill="var(--c)" fill-opacity=".56" stroke="var(--bg2)" stroke-width="1"',S3='fill="var(--gold)" fill-opacity=".8" stroke="var(--bg2)" stroke-width="1"';
    for(let i=0;i<a;i++)for(let j=0;j<2;j++)rc(ox+i*X,oy+j*X,X,X,S1);
    for(let i=0;i<b;i++)for(let j=0;j<2;j++)rc(ox+a*X+i*U,oy+j*X,U,X,S2);
    for(let i=0;i<a;i++)for(let j=0;j<e;j++)rc(ox+i*X,oy+2*X+j*U,X,U,S2);
    for(let i=0;i<b;i++)for(let j=0;j<e;j++)rc(ox+a*X+i*U,oy+2*X+j*U,U,U,S3);
    const xm=ox+a*X/2,xr=ox+a*X+b*U/2,ym=oy+X+4,yb=oy+2*X+e*U/2+4;
    tx(d,xm,ym,cf(2*a)+'x²');tx(d,xr,ym,cf(2*b)+'x');tx(d,xm,yb,cf(a*e)+'x');tx(d,xr,yb,String(b*e));
    tx(d,xm,oy-8,cf(a)+'x',MU);tx(d,xr,oy-8,String(b),MU);tx(d,ox-8,ym,'2x',MU,12,'end');tx(d,ox-8,yb,String(e),MU,12,'end');
    return {svg:d.out(),read:`(${cf(a)}x + ${b})(2x + ${e}) の面積<br>= ${2*a}x² + (${a}·${e} + ${b}·2)x + ${b}·${e}<br>= <b>${2*a}x² + ${a*e+2*b}x + ${b*e}</b><br>x の係数は、斜めの積の和 ad + bc`};}});

/* ---- たすきがけ：6x² + x − 12 の組み合わせを試す ---- */
FIGS.h1shiki_tasuki=host=>{const AC=[[1,6],[2,3]],BD=[];
  [1,2,3,4,6,12].forEach(k=>{BD.push([k,-12/k]);BD.push([-k,12/k]);});
  mk(host,{alt:'6x² + x − 12 をたすきがけで因数分解するために、係数の組み合わせを試す図',
  sliders:[{k:'i',label:'x² の係数 6 の分け方（a × c）',min:1,max:2,step:1,v:1,fmt:i=>AC[i-1].join(' × ')},{k:'j',label:'定数項 −12 の分け方（b × d）',min:1,max:12,step:1,v:1,fmt:j=>BD[j-1].map(par).join(' × ')}],
  draw(v){const [a,c]=AC[v.i-1],[b,e]=BD[v.j-1],s=a*e+b*c,hit=s===1,d=draw(),OK='var(--ok)',col=hit?GD:'var(--ng)';
    const fac=`(${cf(a)}x ${sg(b)})(${cf(c)}x ${sg(e)})`;
    tx(d,170,34,fac,INK,14);
    d.line(90,90,134,144,`stroke="${CC}" stroke-width="1.8"`).line(90,144,134,90,`stroke="${OK}" stroke-width="1.8"`);
    tx(d,74,89,n(a),INK,15);tx(d,150,89,n(b),INK,15);tx(d,74,155,n(c),INK,15);tx(d,150,155,n(e),INK,15);
    tx(d,188,88,'→',MU);tx(d,188,154,'→',MU);
    tx(d,256,88,`${par(b)} × ${c} = ${n(b*c)}`,OK);tx(d,256,154,`${a} × ${par(e)} = ${n(a*e)}`,CC);
    d.line(46,174,322,174,'stroke="var(--muted)" stroke-width="1.2"');
    tx(d,74,200,n(a*c),INK,15);tx(d,150,200,n(b*e),INK,15);tx(d,256,200,n(s),col,15);
    tx(d,74,222,'ac',MU,10);tx(d,150,222,'bd',MU,10);tx(d,256,222,'ad + bc',MU,10);
    return {svg:d.out(),read:`${fac} を展開したときの x の係数<br>ad + bc = ${a}·${par(e)} + ${par(b)}·${c} = <b>${n(s)}</b><br>`+(hit?`目標の 1 と一致した<br>6x² + x − 12 = <b>${fac}</b>`:'目標は 1。一致しない')};}});};

/* ---- 分数を小数に直すと、余りがくり返す ---- */
FIGS.h1shiki_junkan=host=>mk(host,{alt:'1 を q で割る筆算で、余りがくり返す様子を表す図',
  sliders:[{k:'q',label:'分母 q',min:2,max:13,step:1,v:7}],
  draw(v){const q=v.q,rems=[],digs=[],d=draw();let r=1,loop=-1;
    for(;;){rems.push(r);digs.push(Math.floor(r*10/q));r=r*10%q;if(r===0)break;const i=rems.indexOf(r);if(i>=0){loop=i;break;}}
    const L=rems.length,xk=k=>58+k*46,y1=108,y2=170,AR='stroke="var(--muted)" stroke-width="1.3" fill="none"';
    tx(d,10,y1+4,'余り',MU,11,'start');tx(d,10,y2+4,'商',MU,11,'start');
    for(let k=0;k<L;k++){const rep=loop>=0&&k>=loop,x=xk(k);
      d.path(`M${x},${y1+17} V${y2-16} m-3.5,-5 l3.5,5 l3.5,-5`,AR);
      if(k<L-1||loop<0)d.path(`M${x+17},${y1} H${x+29} m-5,-3.5 l5,3.5 l-5,3.5`,AR);
      d.circle(x,y1,15,`fill="var(--bg2)" stroke="${rep?GD:CC}" stroke-width="2"`);tx(d,x,y1+4,String(rems[k]));
      d.raw(`<rect x="${x-11}" y="${y2-13}" width="22" height="24" rx="4" fill="var(--c)" fill-opacity="${rep?.5:.2}"/>`);tx(d,x,y2+4,String(digs[k]),rep?GD:INK);}
    const pre=digs.slice(0,Math.max(loop,0)).join(''),rep=loop<0?'':digs.slice(loop).join('');
    if(loop<0){d.circle(xk(L),y1,15,'fill="var(--bg2)" stroke="var(--ok)" stroke-width="2"');tx(d,xk(L),y1+4,'0','var(--ok)');
      tx(d,170,224,`1 ÷ ${q} = 0.${digs.join('')}`,INK,13);}
    else{const xa=xk(L-1),xb=xk(loop),st=`stroke="${GD}" stroke-width="1.8" fill="none"`;
      if(L-1===loop)d.path(`M${xa+7},${y1-15} C${xa+26},${y1-54} ${xa-26},${y1-54} ${xa-7},${y1-15} m0,-6.5 l0,6.5 l-5.4,-3.7`,st);
      else d.path(`M${xa},${y1-17} C${xa},${y1-64} ${xb},${y1-64} ${xb},${y1-17} m-3.5,-5.5 l3.5,5.5 l3.5,-5.5`,st);
      tx(d,Math.max(60,(xa+xb)/2),y1-62,'同じ余りに戻る',GD,11);
      tx(d,170,224,`1 ÷ ${q} = 0.${pre}<tspan fill="var(--gold)">${rep}</tspan>${rep}…`,INK,13);}
    return {svg:d.out(),read:loop<0?`1 ÷ ${q} = <b>0.${digs.join('')}</b><br>余りが 0 になり、割り切れる<br>有限小数（分母の素因数が 2 か 5 だけ）`:
      `1 ÷ ${q} = <b>0.${pre}${rep}${rep}…</b><br>余り：${rems.join(' → ')} → ${rems[loop]}<br>余りは 1 から ${q-1} までの ${q-1} 通りだけ<br>${rep.length} 個の数字「${rep}」をくり返す`};}});

/* ---- 絶対値：原点からの距離、2点の間の距離 ---- */
FIGS.h1shiki_abs=host=>mk(host,{alt:'数直線上の2点 A, B と、原点からの距離、2点の間の距離を表す図',
  sliders:[{k:'a',label:'a（点 A）',min:-6,max:6,step:.5,v:-4},{k:'b',label:'b（点 B）',min:-6,max:6,step:.5,v:2}],
  draw(v){const a=v.a,b=v.b,d=draw(),y=146,sx=numline(d,-7,7,y);
    const bar=(x1,x2,yy,col,t)=>{d.line(sx(x1),yy,sx(x2),yy,`stroke="${col}" stroke-width="4" stroke-linecap="round"`);x1===x2&&x1===0?tx(d,sx(0)+8,yy+4,t,col,11,'start'):tx(d,(sx(x1)+sx(x2))/2,yy-8,t,col,11);};
    d.line(sx(0),y-72,sx(0),y,'stroke="var(--muted)" stroke-width="1" stroke-dasharray="3 3"');
    bar(0,a,y-30,CC,`|a| = ${n(Math.abs(a))}`);bar(0,b,y-60,GD,`|b| = ${n(Math.abs(b))}`);bar(a,b,y+56,INK,`|a − b| = ${n(Math.abs(a-b))}`);
    const near=Math.abs(sx(a)-sx(b))<16,sh=near?(a<=b?-8:8):0;
    d.dot(sx(a),y,CC,4.5).dot(sx(b),y,GD,4.5);tx(d,sx(a)+sh,y-9,'A',CC);tx(d,sx(b)-sh,y-9,'B',GD);
    return {svg:d.out(),read:`a = ${n(a)}、b = ${n(b)}<br>|a| = <i>${n(Math.abs(a))}</i>、|b| = <b>${n(Math.abs(b))}</b>（原点からの距離）<br>|a − b| = |${n(a-b)}| = <b>${n(Math.abs(a-b))}</b>（A と B の距離）`};}});

/* ---- √(a²) = |a| ---- */
FIGS.h1shiki_rootsq=host=>mk(host,{alt:'y = √(x²) のグラフと y = x のグラフをくらべる図',
  sliders:[{k:'a',label:'a',min:-4,max:4,step:.5,v:-3}],play:{k:'a',from:4,to:-4,label:'a を正から負へ動かす',ms:3400},
  draw(v){const a=v.a,p=plot([-5,5,-5,5]).grid();
    p.seg(-5,-5,5,5,DASH).curve(x=>Math.abs(x),C);
    if(a<0)p.seg(a,a,a,-a,'stroke="var(--gold)" stroke-width="1.2" stroke-dasharray="3 3"');
    p.dot(a,a,MU,3.5).dot(a,Math.abs(a),GD);
    p.txt(.5,4.1,'y = √(x²)','fill="var(--c)"').txt(-2.8,-4.5,'y = x');
    return {svg:p.out(),read:`a = ${n(a)} のとき a² = ${n(a*a)}<br>√(a²) = √${n(a*a)} = <b>${n(Math.abs(a))}</b><br>`+(a<0?`a 自身（${n(a)}）ではなく、−a = ${n(-a)}`:a>0?'a と同じ値':'0 のときは 0')+'<br>まとめると √(a²) = |a|'};}});

/* ---- √n の整数部分と小数部分 ---- */
FIGS.h1shiki_seisu=host=>mk(host,{alt:'√n の数直線上の位置と、整数部分・小数部分を表す図',
  sliders:[{k:'n',label:'n',min:2,max:30,step:1,v:7}],
  draw(v){const N=v.n,r=Math.sqrt(N),a=Math.floor(r+1e-9),sq=a*a===N,d=draw(),y=150,sx=numline(d,0,6,y);
    d.line(sx(r),y-32,sx(r),y,'stroke="var(--muted)" stroke-width="1" stroke-dasharray="3 3"');
    d.line(sx(0),y-32,sx(a),y-32,`stroke="${CC}" stroke-width="5"`);tx(d,(sx(0)+sx(a))/2,y-42,'a = '+a,CC);
    if(!sq){const m=(sx(a)+sx(r))/2;d.line(sx(a),y-32,sx(r),y-32,`stroke="${GD}" stroke-width="5"`);d.line(m,y-58,m,y-37,`stroke="${GD}" stroke-width="1"`);tx(d,m,y-63,'b',GD);}
    d.dot(sx(r),y,GD,4.5);tx(d,sx(r),y+38,'√'+N,GD);
    return {svg:d.out(),read:sq?`√${N} = ${a}（整数）<br>整数部分 a = <b>${a}</b><br>小数部分 b = 0`:
      `${a}² = ${a*a} &lt; ${N} &lt; ${(a+1)*(a+1)} = ${a+1}² なので ${a} &lt; √${N} &lt; ${a+1}<br>整数部分 a = <b>${a}</b><br>小数部分 b = √${N} − ${a} ≈ ${n(r-a,4)}<br>（√${N} ≈ ${n(r,4)}）`};}});

/* ---- 不等式の性質：両辺に c をたす・かける ---- */
FIGS.h1shiki_fugo=host=>mk(host,{alt:'数直線上の2点 a, b に、同じ数 c をたす・かけるときの位置の変化を表す図',
  sliders:[{k:'m',label:'操作',min:1,max:2,step:1,v:2,fmt:m=>['c をたす','c をかける'][m-1]},{k:'c',label:'c',min:-3,max:3,step:.5,v:2}],
  play:{k:'c',from:3,to:-3,label:'c を 3 から −3 へ動かす',ms:3800},
  draw(v){const a=1,b=2,c=v.c,mul=v.m===2,A=mul?a*c:a+c,B=mul?b*c:b+c,d=draw(),y1=58,y2=176;
    const sx=x=>22+(x+7)/14*296;
    d.line(sx(a),y1,sx(A),y2,`stroke="${CC}" stroke-width="1.6"`).line(sx(b),y1,sx(B),y2,`stroke="${GD}" stroke-width="1.6"`);
    numline(d,-7,7,y1);numline(d,-7,7,y2);
    d.dot(sx(a),y1,CC,4.5).dot(sx(b),y1,GD,4.5).dot(sx(A),y2,CC,4.5).dot(sx(B),y2,GD,4.5);
    tx(d,sx(a),y1-10,'a',CC);tx(d,sx(b),y1-10,'b',GD);tx(d,12,24,'もとの数',MU,10,'start');tx(d,12,y2+62,mul?'c をかけたあと':'c をたしたあと',MU,10,'start');
    const la=mul?'ac':'a+c',lb=mul?'bc':'b+c',xa=sx(A),xb=sx(B),mid=(xa+xb)/2;
    if(Math.abs(xa-xb)<34){const aL=xa<=xb;tx(d,mid-4,y2+38,aL?la:lb,aL?CC:GD,12,'end');tx(d,mid+4,y2+38,aL?lb:la,aL?GD:CC,12,'start');}
    else{tx(d,xa,y2+38,la,CC);tx(d,xb,y2+38,lb,GD);}
    const head=`a = 1、b = 2（a &lt; b）の両辺に c = ${n(c)} を`;
    return {svg:d.out(),read:mul?head+`かける<br>ac = ${n(A)}、bc = ${n(B)}<br>`+(c>0?'<b>ac &lt; bc</b>（不等号の向きはそのまま）<br>原点からの距離が c 倍になるだけ':c<0?'<b>ac &gt; bc</b>（不等号の向きが逆になる）<br>原点の反対側に移り、左右が入れかわる':'<b>ac = bc</b>（どちらも 0 になる）'):
      head+`たす<br>a + c = ${n(A)}、b + c = ${n(B)}<br><b>a + c &lt; b + c</b>（不等号の向きはそのまま）<br>2点は同じ向きに同じだけ動く`};}});

/* ---- 連立不等式：共通範囲 ---- */
FIGS.h1shiki_renritsu=host=>mk(host,{alt:'2つの不等式の解を数直線の上に重ねて、共通範囲を示す図',
  sliders:[{k:'p',label:'p（1つ目の不等式 x &lt; p）',min:-3,max:6,step:.5,v:4},{k:'q',label:'q（2つ目の不等式 x ≥ q）',min:-4,max:5,step:.5,v:-1}],
  draw(v){const p=v.p,q=v.q,d=draw(),y=176,sx=numline(d,-6,8,y),OK='var(--ok)',ok=q<p;
    d.line(sx(p),y-64,sx(p),y,`stroke="${CC}" stroke-width="1.2" stroke-dasharray="3 3"`).line(sx(q),y-34,sx(q),y,`stroke="${GD}" stroke-width="1.2" stroke-dasharray="3 3"`);
    if(ok)d.line(sx(q),y,sx(p),y,`stroke="${OK}" stroke-width="6" stroke-opacity=".8"`);
    d.line(12,y-64,sx(p),y-64,`stroke="${CC}" stroke-width="3"`);open(d,sx(p),y-64,CC);tx(d,14,y-74,'x &lt; '+n(p),CC,12,'start');
    d.line(sx(q),y-34,328,y-34,`stroke="${GD}" stroke-width="3"`);d.dot(sx(q),y-34,GD,4.5);tx(d,326,y-44,'x ≥ '+n(q),GD,12,'end');
    if(ok){d.dot(sx(q),y,OK,4.5);open(d,sx(p),y,OK);}
    return {svg:d.out(),read:`x &lt; ${n(p)} と x ≥ ${n(q)} を同時に満たす x<br>`+(ok?`共通範囲は <b>${n(q)} ≤ x &lt; ${n(p)}</b>`:'重なる部分がない。<b>解なし</b>')+'<br>白丸はその数をふくまない、黒丸はふくむ'};}});

/* ---- |x − c| と r：数直線上の距離 ---- */
FIGS.h1shiki_kyori=host=>mk(host,{alt:'数直線上で、点 c からの距離が r に等しい点、r より小さい範囲、r より大きい範囲を示す図',
  sliders:[{k:'t',label:'式',min:1,max:3,step:1,v:2,fmt:t=>['|x − c| = r','|x − c| < r','|x − c| > r'][t-1]},{k:'c',label:'c',min:-3,max:3,step:.5,v:1},{k:'r',label:'r',min:.5,max:4,step:.5,v:2}],
  draw(v){const c=v.c,r=v.r,t=v.t,lo=c-r,hi=c+r,d=draw(),y=150,sx=numline(d,-8,8,y),TH=`stroke="${GD}" stroke-width="5" stroke-opacity=".85"`;
    if(t===2)d.line(sx(lo),y,sx(hi),y,TH);
    if(t===3){d.line(12,y,sx(lo),y,TH);d.line(sx(hi),y,328,y,TH);}
    d.line(sx(c),y-42,sx(c),y,`stroke="${CC}" stroke-width="1" stroke-dasharray="3 3"`);
    [lo,hi].forEach(e=>{d.line(sx(c),y-34,sx(e),y-34,`stroke="${CC}" stroke-width="1.6"`).line(sx(e),y-40,sx(e),y-28,`stroke="${CC}" stroke-width="1.6"`);if(r>=1||e===hi)tx(d,(sx(c)+sx(e))/2+(r<1?5:0),y-41,'r',CC,11);});
    d.dot(sx(c),y,INK,4);tx(d,sx(c),y-60,'c');
    [lo,hi].forEach(e=>t===1?d.dot(sx(e),y,GD,5):open(d,sx(e),y,GD));
    tx(d,sx(lo)+3,y+40,n(lo),GD,12,'end');tx(d,sx(hi)-3,y+40,n(hi),GD,12,'start');
    const ex=c===0?'|x|':`|x ${sg(-c)}|`;
    return {svg:d.out(),read:`${ex} ${['=','&lt;','&gt;'][t-1]} ${n(r)}<br>x と ${n(c)} の距離が ${n(r)} ${['に等しい','より小さい','より大きい'][t-1]}<br><b>${[`x = ${n(lo)}, ${n(hi)}`,`${n(lo)} &lt; x &lt; ${n(hi)}`,`x &lt; ${n(lo)}, ${n(hi)} &lt; x`][t-1]}</b>`};}});

/* ---- ベン図：共通部分・和集合・補集合・ド・モルガンの法則 ---- */
FIGS.h1shiki_venn=host=>{const NAME=['A ∩ B','A ∪ B','A の補集合','A の補集合 ∩ B の補集合','A の補集合 ∪ B の補集合'];
  const T='170,70.1',B='170,189.9';
  const PATH={ao:`M${T} A72,72 0 1,0 ${B} A72,72 0 0,1 ${T} Z`,ab:`M${T} A72,72 0 0,1 ${B} A72,72 0 0,1 ${T} Z`,bo:`M${T} A72,72 0 1,1 ${B} A72,72 0 0,0 ${T} Z`,out:`M14,14 H326 V236 H14 Z M${T} A72,72 0 1,0 ${B} A72,72 0 1,0 ${T} Z`};
  const POS={2:[92,110],4:[86,152],8:[112,178],10:[116,94],6:[170,118],12:[170,158],3:[240,114],9:[246,158],1:[34,44],5:[306,44],7:[34,224],11:[306,224]};
  const SEL=[['ab'],['ao','ab','bo'],['bo','out'],['out'],['ao','bo','out']];
  const WHY=['A にも B にも属する要素','A, B の少なくとも一方に属する要素','U の要素のうち、A に属さないもの','A ∪ B の補集合と同じ（ド・モルガンの法則）','A ∩ B の補集合と同じ（ド・モルガンの法則）'];
  const reg=k=>k%2===0?(k%3===0?'ab':'ao'):(k%3===0?'bo':'out');
  mk(host,{alt:'全体集合 U の中の2つの集合 A, B のベン図。選んだ集合に色がつく',
   sliders:[{k:'m',label:'色をつける集合',min:1,max:5,step:1,v:1,fmt:m=>NAME[m-1]}],
   draw(v){const sel=SEL[v.m-1],d=draw(),els=[];
    sel.forEach(k=>d.path(PATH[k],'fill="var(--c)" fill-opacity=".42" fill-rule="evenodd" stroke="none"'));
    d.raw('<rect x="14" y="14" width="312" height="222" fill="none" stroke="var(--muted)" stroke-width="1.4"/>');
    d.circle(130,130,72).circle(210,130,72);
    for(let k=1;k<=12;k++){const on=sel.includes(reg(k));if(on)els.push(k);tx(d,POS[k][0],POS[k][1],String(k),on?GD:MU,on?13:12);}
    tx(d,68,66,'A');tx(d,272,66,'B');tx(d,170,38,'U',MU);
    return {svg:d.out(),read:`${NAME[v.m-1]}<br>= <b>{${els.join(', ')}}</b><br>${WHY[v.m-1]}<br>U：1〜12 の自然数、A：2 の倍数、B：3 の倍数`};}});};

/* ---- 命題と条件：条件を満たす範囲の包含関係 ---- */
FIGS.h1shiki_joken=host=>mk(host,{alt:'条件 p, q を満たす x の範囲 P, Q を数直線の上に重ねて、包含関係を見る図',
  sliders:[{k:'c',label:'P の中心',min:-3,max:7,step:.5,v:2},{k:'w',label:'P の幅の半分',min:.5,max:4,step:.5,v:1.5}],
  draw(v){const lo=v.c-v.w,hi=v.c+v.w,d=draw(),y=178,sx=numline(d,-8,12,y,2);
    const band=(a,b,yy,col,nm)=>{[a,b].forEach(e=>d.line(sx(e),yy,sx(e),y,`stroke="${col}" stroke-width="1" stroke-dasharray="3 3"`));
      d.raw(`<rect x="${f(sx(a))}" y="${yy-9}" width="${f(sx(b)-sx(a))}" height="18" fill="${col}" fill-opacity=".28"/>`);d.line(sx(a),yy,sx(b),yy,`stroke="${col}" stroke-width="3"`);open(d,sx(a),yy,col);open(d,sx(b),yy,col);tx(d,10,yy+5,nm,col,13,'start');};
    band(-1,5,y-38,GD,'Q');band(lo,hi,y-92,CC,'P');
    const pq=lo>=-1&&hi<=5,qp=lo<=-1&&hi>=5,x0=hi>5?(Math.max(5,lo)+hi)/2:(lo+Math.min(-1,hi))/2;
    if(!pq){d.dot(sx(x0),y-92,'var(--ng)',4.5);tx(d,sx(x0),y-107,'反例','var(--ng)',10);}
    const head=`p：${n(lo)} &lt; x &lt; ${n(hi)}（範囲 P）<br>q：−1 &lt; x &lt; 5（範囲 Q）<br>`,ng=`「p ⇒ q」は偽（反例 x = ${n(x0)}）`;
    return {svg:d.out(),read:head+(pq&&qp?'P = Q。「p ⇒ q」も「q ⇒ p」も真<br><b>p は q の必要十分条件</b>':pq?'P ⊂ Q なので「p ⇒ q」は真<br><b>p は q の十分条件</b>':qp?`Q ⊂ P なので「q ⇒ p」は真<br>${ng}<br><b>p は q の必要条件</b>`:`${ng}<br>「q ⇒ p」も偽<br>必要条件でも十分条件でもない`)};}});

/* ---- 対偶：P ⊂ Q ならば、Q の外側は P の外側にふくまれる ---- */
FIGS.h1shiki_taigu=host=>mk(host,{alt:'集合 P が集合 Q にふくまれるとき、Q の補集合が P の補集合にふくまれることを手順で示すベン図',
  sliders:[{k:'s',label:'手順',min:1,max:4,step:1,v:1}],play:{k:'s',from:1,to:4,label:'順に見る',ms:4400},
  draw(v){const s=v.s,d=draw(),U='M14,14 H326 V236 H14 Z',cq='M82,128 a88,88 0 1,0 176,0 a88,88 0 1,0 -176,0 Z',cp='M108,136 a42,42 0 1,0 84,0 a42,42 0 1,0 -84,0 Z';
    if(s>=3)d.path(U+' '+cp,'fill="var(--ok)" fill-opacity=".16" fill-rule="evenodd" stroke="none"');
    if(s>=2)d.path(U+' '+cq,'fill="var(--gold)" fill-opacity=".32" fill-rule="evenodd" stroke="none"');
    d.raw('<rect x="14" y="14" width="312" height="222" fill="none" stroke="var(--muted)" stroke-width="1.4"/>');
    d.circle(170,128,88).circle(150,136,42,`fill="var(--c)" fill-opacity="${s===1?.42:.24}" stroke="var(--c)" stroke-width="1.8"`);
    tx(d,150,141,'P',CC,14);tx(d,226,94,'Q',INK,14);tx(d,30,36,'U',MU);
    if(s>=2)tx(d,62,226,'q でない',GD,11);
    if(s>=3)tx(d,220,170,'p でない','var(--ok)',11);
    if(s>=4){d.dot(128,76,'var(--ng)',5);tx(d,128,64,'反例','var(--ng)',11);}
    return {svg:d.out(),read:['<b>手順 1</b>　命題「p ⇒ q」が真<br>p を満たすものは、すべて q を満たす<br>集合では P ⊂ Q','<b>手順 2</b>　Q の外側に色をつける<br>ここにあるのは、q を満たさないもの<br>（Q の補集合）',
      '<b>手順 3</b>　P の外側にも色をつける<br>Q の外側は、すべて P の外側にふくまれる<br><b>対偶「q でない ⇒ p でない」も真</b>','<b>手順 4</b>　逆「q ⇒ p」が真になるのは Q ⊂ P のとき<br>Q の中で P の外にあるもの（印の点）が反例<br><b>逆は、真とは限らない</b>'][s-1]};}});

/* ---- なぜ：分母 q ごとに、√2 にいちばん近い分数 ---- */
FIGS.h1shiki_root2a=host=>mk(host,{alt:'分母 q ごとに、√2 にいちばん近い分数 p/q の値を点で表した図',
  sliders:[{k:'q',label:'分母 q',min:1,max:30,step:1,v:5}],play:{k:'q',from:1,to:30,label:'分母を大きくしていく',ms:5200},
  draw(v){const q=v.q,R2=Math.SQRT2,p=plot([-3,31.5,.86,1.66]),near=k=>Math.round(k*R2),P=near(q),val=P/q;
    [1,1.2,1.4,1.6].forEach(y=>{p.seg(0,y,31,y,'stroke="var(--line)" stroke-width=".6"');p.txt(0,y,n(y),'text-anchor="end" dx="-5" dy="4"');});
    p.seg(0,.94,31,.94,'stroke="var(--muted)" stroke-width="1.2"');
    [5,10,15,20,25,30].forEach(x=>{p.seg(x,.94,x,.953,'stroke="var(--muted)" stroke-width="1"');p.txt(x,.94,String(x),'text-anchor="middle" dy="14"');});
    p.seg(0,R2,31,R2,'stroke="var(--gold)" stroke-width="1.4" stroke-dasharray="5 4"').txt(.4,R2,'√2','dy="-6" fill="var(--gold)"');
    for(let k=1;k<q;k++)p.dot(k,near(k)/k,CC,2.6);
    p.dot(q,val,GD,4.5).txt(q,val,`${P}/${q}`,`text-anchor="${q>22?'end':'start'}" dx="${q>22?-8:8}" dy="${val<R2&&val>1.1?16:-9}" fill="var(--ink)"`);
    const exact=Math.abs(val*1e5-Math.round(val*1e5))<1e-6;
    return {svg:p.out(),read:`分母 q = ${q} で、√2 にいちばん近い分数は ${P}/${q}<br>${P}/${q} ${exact?'=':'≈'} ${n(val,5)}（√2 ≈ 1.41421）<br>p² = ${P*P}、2q² = ${2*q*q}<br>p² − 2q² = <b>${n(P*P-2*q*q)}</b>（0 にならない）`};}});

/* ---- なぜ：√2 が無理数であることの証明（背理法）の流れ ---- */
FIGS.h1shiki_root2b=host=>mk(host,{alt:'√2 が無理数であることを背理法で証明する手順の図',
  sliders:[{k:'s',label:'手順',min:1,max:4,step:1,v:1}],play:{k:'s',from:1,to:4,label:'順に見る',ms:4800},
  draw(v){const s=v.s,d=draw(),NG='var(--ng)';
    const BOX=[['√2 = p/q と表せると仮定する','p, q は自然数で、これ以上約分できない'],['両辺を2乗して分母を払う：p² = 2q²','p² が偶数なので、p は偶数'],['p = 2k とおくと 4k² = 2q²、q² = 2k²','q² が偶数なので、q も偶数'],['p も q も 2 で割り切れる','「これ以上約分できない」に矛盾']];
    for(let k=0;k<s;k++){const y=12+k*58,cur=k===s-1,col=k===3?NG:cur?GD:'var(--line)';
      d.raw(`<rect x="14" y="${y}" width="312" height="46" rx="8" fill="var(--c)" fill-opacity=".08" stroke="${col}" stroke-width="${cur?2:1.2}"/>`);
      tx(d,26,y+19,BOX[k][0],INK,12,'start');tx(d,26,y+37,BOX[k][1],k===3?NG:CC,12,'start');
      if(k<s-1)d.path(`M170,${y+47} V${y+57} m-4,-5 l4,5 l4,-5`,'stroke="var(--muted)" stroke-width="1.4" fill="none"');}
    return {svg:d.out(),read:['<b>手順 1</b>　√2 が有理数だと仮定する<br>有理数は、約分しきった分数 p/q で表せる','<b>手順 2</b>　√2 = p/q の両辺を2乗すると 2 = p²/q²<br>p² = 2q² は偶数<br>奇数の2乗は奇数なので、p は偶数',
      '<b>手順 3</b>　p = 2k（k は自然数）を代入する<br>4k² = 2q² より q² = 2k²<br>q² が偶数なので、q も偶数','<b>手順 4</b>　p と q はどちらも 2 の倍数<br>p/q は 2 で約分できてしまう<br><b>仮定と矛盾。√2 は有理数ではない</b>'][s-1]};}});
})();
