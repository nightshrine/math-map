/* 中学1年「文字と式」の図（FIGS.m1moji_*）。動かせる図と、問題に付ける図（m1moji_q） */
(function(){
const {draw,n,mk}=FIG;
const f=v=>v.toFixed(1);
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
const pn=v=>v<0?`(${n(v)})`:n(v);
const rect=(d,x,y,w,h,st)=>d.poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],st);
const FILL=(col,o=.3)=>`fill="var(--${col})" fill-opacity="${o}" stroke="var(--${col})" stroke-width="1.4"`;
// 一次式 cx + d の表示
const lin=(c,d)=>{if(c===0)return n(d);const a=c===1?'x':c===-1?'−x':n(c)+'x';return a+(d>0?' + '+n(d):d<0?' − '+n(-d):'');};
// 式の途中に続ける項：「 + 2x」「 − 5」
const term=(c,isX)=>c===0?'':(c>0?' + ':' − ')+(isX?(Math.abs(c)===1?'':n(Math.abs(c)))+'x':n(Math.abs(c)));
// 数直線
const NL=(d,lo,hi,y,tick=1,lab=1,x0=24,x1=316)=>{const X=v=>x0+(v-lo)/(hi-lo)*(x1-x0);
  d.line(x0-9,y,x1+9,y,'stroke="var(--muted)" stroke-width="1.4"');
  for(let i=lo;i<=hi;i+=tick){d.line(X(i),y-(i===0?7:4),X(i),y+(i===0?7:4),'stroke="var(--muted)" stroke-width="1.2"');if(i%lab===0)tx(d,X(i),y+20,n(i),i===0?'var(--ink)':'var(--muted)',10);}
  return X;};

/* ---- 画用紙をとめるマグネット（arg='one'：数え方を 1 つに固定） ---- */
const MG=[['はじめの 1 枚に 4 個、あと 1 枚ごとに 2 個',x=>`4 + 2 × (${x} − 1)`,'4 + 2(x − 1)'],['左はしに 2 個、画用紙 1 枚ごとに 2 個',x=>`2 + 2 × ${x}`,'2 + 2x'],['上の列と下の列に (x + 1) 個ずつ',x=>`2 × (${x} + 1)`,'2(x + 1)']];
FIGS.m1moji_magnet=(host,arg)=>{const one=arg==='one';
  mk(host,{alt:'横 1 列に並べた画用紙と、それをとめるマグネットの図',h:210,
  sliders:[{k:'x',label:'画用紙の枚数 x',min:1,max:6,step:1,v:3}].concat(one?[]:[{k:'m',label:'数え方',min:1,max:3,step:1,v:1,fmt:m=>'①②③'[m-1]}]),
  play:{k:'x',from:1,to:6,label:'1 枚ずつ増やす',ms:3600},
  draw(v){const d=draw(),x=v.x,m=one?2:v.m,sw=Math.min(72,282/x),x0=170-(x*sw+6)/2,y0=52,H=96;
    for(let i=0;i<x;i++)rect(d,x0+i*sw,y0+(i%2?3:0),sw+6,H,'fill="var(--ink)" fill-opacity=".08" stroke="var(--muted)" stroke-width="1.2"');
    for(let i=0;i<=x;i++)[0,1].forEach(r=>{const g=m===1?i<=1:m===2?i===0:r===0;
      d.circle(x0+i*sw+3,r?y0+H-8:y0+9,6.5,`fill="var(--${g?'gold':'c'})" stroke="var(--bg2)" stroke-width="1.5"`);});
    tx(d,170,34,`画用紙 ${x} 枚`,'var(--muted)',11);tx(d,170,y0+H+32,`マグネット ${2*x+2} 個`,'var(--ink)',13);
    return {svg:d.out(),read:`数え方${'①②③'[m-1]}：${MG[m-1][0]}<br>${MG[m-1][1](x)} = <b>${2*x+2}</b>（個）<br>画用紙が x 枚のとき：<b>${MG[m-1][2]}</b>（個）`};}});};

/* ---- 長方形：式が表す数量 ---- */
FIGS.m1moji_chohokei=host=>mk(host,{alt:'縦 a、横 b の長方形で、面積と周の長さを式で表す図',h:220,
  sliders:[{k:'a',label:'縦 a（cm）',min:1,max:5,step:1,v:3},{k:'b',label:'横 b（cm）',min:1,max:8,step:1,v:5}],
  draw(v){const d=draw(),{a,b}=v,u=30,x0=170-b*u/2,y0=112-a*u/2;
    rect(d,x0,y0,b*u,a*u,FILL('c',.22));
    for(let i=1;i<b;i++)d.line(x0+i*u,y0,x0+i*u,y0+a*u,'stroke="var(--line)" stroke-width=".8"');for(let j=1;j<a;j++)d.line(x0,y0+j*u,x0+b*u,y0+j*u,'stroke="var(--line)" stroke-width=".8"');
    d.line(x0,y0,x0,y0+a*u,'stroke="var(--gold)" stroke-width="3"');d.line(x0+b*u,y0,x0+b*u,y0+a*u,'stroke="var(--gold)" stroke-width="3"');
    tx(d,x0-14,y0+a*u/2+4,'a','var(--gold)',13);tx(d,x0+b*u/2,y0-9,'b','var(--c)',13);
    return {svg:d.out(),read:`a = ${a}、b = ${b} のとき<br>ab = ${a} × ${b} = <b>${a*b}</b>（面積 cm²）<br>2(a + b) = 2 × (${a} + ${b}) = <b>${2*(a+b)}</b>（周の長さ cm）<br>2a = ${2*a} は、金色の縦の辺 2 本分の長さ`};}});

/* ---- 式の値 ---- */
const EX=[['2x + 5',x=>2*x+5,x=>`2 × ${pn(x)} + 5`],['−x + 4',x=>-x+4,x=>`−${pn(x)} + 4`],['x²',x=>x*x,x=>`${pn(x)}²`],['−x²',x=>-x*x,x=>`−${pn(x)}²`]];
FIGS.m1moji_atai=host=>mk(host,{alt:'文字 x に入れる数を変えると、式の値が変わることを 2 本の数直線で示す図',h:230,
  sliders:[{k:'e',label:'式',min:1,max:4,step:1,v:1,fmt:e=>EX[e-1][0]},{k:'x',label:'x に代入する数',min:-5,max:5,step:.5,v:-3}],play:{k:'x',from:-5,to:5,label:'x を −5 から 5 まで動かす',ms:4000},
  draw(v){const d=draw(),E=EX[v.e-1],x=v.x,val=E[1](x),X1=NL(d,-5,5,82),X2=NL(d,-30,30,176,5,10);
    tx(d,16,46,'x','var(--c)',12,'start');tx(d,16,138,'式の値','var(--gold)',11,'start');
    d.line(X1(x),82,X2(val),176,'stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="4 4"');
    d.dot(X1(x),82,'var(--c)',5.5);tx(d,X1(x),66,n(x),'var(--c)',13);d.dot(X2(val),176,'var(--gold)',5.5);tx(d,X2(val),160,n(val),'var(--gold)',13);
    tx(d,170,28,`${E[0]} に x = ${n(x)} を代入する`,'var(--ink)',12);
    return {svg:d.out(),read:`${E[0]} = ${E[2](x)}<br>= <b>${n(val)}</b>`+(x<0?'<br>負の数は、かっこをつけて代入する':'')+(v.e>=3&&x<0?`<br>${pn(x)}² = ${pn(x)} × ${pn(x)} = ${n(x*x)}`:'')};}});
FIGS.m1moji_atai.sim=(e,x)=>EX[e-1][1](x);

/* ---- 一次式の加法・減法をタイルで表す ---- */
FIGS.m1moji_tile=host=>mk(host,{alt:'一次式 3x − 2 に別の一次式をたす・ひく計算を、x のタイルと 1 のタイルで表す図',
  sliders:[{k:'o',label:'計算',min:1,max:2,step:1,v:1,fmt:o=>['たす','ひく'][o-1]},{k:'c',label:'かっこの中の x の係数',min:-3,max:3,step:1,v:2},{k:'d',label:'かっこの中の数の項',min:-4,max:4,step:1,v:-4}],
  draw(v){const d=draw(),sg=v.o===1?1:-1,c=v.c,dd=v.d,c2=sg*c,d2=sg*dd,rc=3+c2,rd=-2+d2;
    const row=(y,cx,cd)=>{let x=24;for(let i=0;i<Math.abs(cx);i++){rect(d,x,y,28,15,FILL(cx>0?'c':'ng',.5));tx(d,x+14,y+11,'x','var(--ink)',9);x+=31;}
      x+=cx?6:0;for(let i=0;i<Math.abs(cd);i++){rect(d,x,y,15,15,FILL(cd>0?'c':'ng',.5));tx(d,x+7.5,y+11,'1','var(--ink)',9);x+=18;}
      if(!cx&&!cd)tx(d,30,y+12,'0','var(--muted)',12);};
    tx(d,24,30,'3x − 2','var(--ink)',12,'start');row(38,3,-2);
    tx(d,24,90,`${sg>0?'+':'−'} (${lin(c,dd)})`+(sg<0?'　→　各項の符号を変えてたす':''),'var(--ink)',12,'start');row(98,c2,d2);
    d.line(20,134,320,134,'stroke="var(--line)" stroke-width="1.2"');
    tx(d,24,160,'まとめると　'+lin(rc,rd),'var(--gold)',12,'start');row(168,rc,rd);
    tx(d,316,224,'青：正の項　赤：負の項','var(--muted)',9,'end');
    return {svg:d.out(),read:`(3x − 2) ${sg>0?'+':'−'} (${lin(c,dd)})<br>= 3x − 2${term(c2,1)}${term(d2,0)}<br>= <b>${lin(rc,rd)}</b>`+(sg<0?'<br>ひくときは、かっこの中の各項の符号を変える':'<br>たすときは、そのままかっこをはずす')};}});
FIGS.m1moji_tile.sim=(o,c,d)=>{const s=o===1?1:-1;return lin(3+s*c,-2+s*d);};

/* ---- なぜ：同じ文字の項をまとめる（長方形の面積） ---- */
FIGS.m1moji_dorui=host=>mk(host,{alt:'横が x で縦が係数の長方形を 2 つ積み重ねて、1 つの長方形にする図',
  sliders:[{k:'a',label:'1 つ目の係数',min:1,max:5,step:1,v:3},{k:'b',label:'2 つ目の係数',min:1,max:5,step:1,v:2},{k:'x',label:'x（横の長さ）',min:1,max:4,step:.5,v:2.5}],
  draw(v){const d=draw(),{a,b,x}=v,u=28,h=16,w=x*u,y0=44,cx=k=>k===1?'x':k+'x';
    rect(d,34,y0,w,a*h,FILL('c'));rect(d,34,y0+a*h+16,w,b*h,FILL('gold'));
    tx(d,22,y0+a*h/2+4,String(a),'var(--c)',12);tx(d,22,y0+a*h+16+b*h/2+4,String(b),'var(--gold)',12);tx(d,34+w/2,y0-8,'x','var(--ink)',12);
    tx(d,34+w/2,y0+a*h/2+4,cx(a),'var(--ink)',11);tx(d,34+w/2,y0+a*h+16+b*h/2+4,cx(b),'var(--ink)',11);
    tx(d,170,y0+(a+b)*h/2+4,'→','var(--muted)',16);
    const X=200;rect(d,X,y0,w,a*h,FILL('c'));rect(d,X,y0+a*h,w,b*h,FILL('gold'));tx(d,X+w/2,y0-8,'x','var(--ink)',12);
    d.path(`M${X+w+6},${y0} L${X+w+11},${y0} L${X+w+11},${y0+(a+b)*h} L${X+w+6},${y0+(a+b)*h}`,'stroke="var(--ink)" stroke-width="1.2" fill="none"');tx(d,X+w+15,y0+(a+b)*h/2+4,`${a} + ${b}`,'var(--ink)',11,'start');
    return {svg:d.out(),read:`${cx(a)} + ${cx(b)} = (${a} + ${b})x = <b>${a+b}x</b><br>x = ${n(x)} のとき：${n(a*x)} + ${n(b*x)} = ${n((a+b)*x)}、${a+b} × ${n(x)} = ${n((a+b)*x)}<br>横が同じ x なので、縦をたして 1 つの長方形にできる`};}});

/* ---- なぜ：a − (b − c) = a − b + c（ひもを切り取る） ---- */
FIGS.m1moji_himo=host=>mk(host,{alt:'長さ a のひもから b − c を切り取ることと、b を切り取って c をもどすことが同じであることを示す図',h:230,
  sliders:[{k:'a',label:'a（ひもの長さ）',min:8,max:12,step:1,v:10},{k:'b',label:'b',min:4,max:7,step:1,v:4},{k:'c',label:'c',min:1,max:3,step:1,v:1}],
  draw(v){const d=draw(),{a,b,c}=v,u=24,x0=26,r=a-b+c,X=k=>x0+k*u;
    tx(d,x0,30,`${a} − (${b} − ${c})：まとめて ${b-c} を切り取る`,'var(--ink)',11,'start');
    rect(d,X(0),40,r*u,20,FILL('c',.35));rect(d,X(r),40,(b-c)*u,20,FILL('gold',.45));tx(d,X(r/2),55,'残り '+r,'var(--ink)',11);tx(d,X(r+(b-c)/2),78,`${b} − ${c}`,'var(--gold)',11);
    tx(d,x0,120,`${a} − ${b} + ${c}：${b} を切り取って、${c} をもどす`,'var(--ink)',11,'start');
    rect(d,X(0),130,(a-b)*u,20,FILL('c',.35));rect(d,X(a-b),130,c*u,20,FILL('ok',.45));rect(d,X(r),130,(b-c)*u,20,FILL('ng',.3));
    d.path(`M${X(a-b)},${158} L${X(a-b)},${164} L${X(a)},${164} L${X(a)},${158}`,'stroke="var(--ng)" stroke-width="1.4" fill="none"');tx(d,X(a-b/2),180,`${b} をひく`,'var(--ng)',11);
    tx(d,X(a-b+c/2),145,'+'+c,'var(--ink)',11);
    d.line(X(r),34,X(r),154,'stroke="var(--muted)" stroke-width="1" stroke-dasharray="3 3"');tx(d,x0,210,`点線より左が残り。どちらも ${r}`,'var(--muted)',10,'start');
    return {svg:d.out(),read:`${a} − (${b} − ${c}) = ${a} − ${b-c} = <b>${r}</b><br>${a} − ${b} + ${c} = <b>${r}</b><br>${b} をひくと ${c} だけひきすぎるので、${c} をたしてもどす<br>a − (b − c) = a − b + c`};}});

/* ---- 数 × 一次式（長方形の面積） ---- */
FIGS.m1moji_bunpai=host=>mk(host,{alt:'縦が数、横が一次式の長方形で、分配法則を示す図',h:210,
  sliders:[{k:'k',label:'かける数',min:1,max:4,step:1,v:2},{k:'a',label:'x の係数',min:1,max:3,step:1,v:3},{k:'b',label:'数の項',min:1,max:4,step:1,v:1}],
  draw(v){const d=draw(),{k,a,b}=v,xw=44,uw=18,rh=24,W=a*xw+b*uw,x0=170-W/2,y0=58,xm=x0+a*xw;
    rect(d,x0,y0,a*xw,k*rh,FILL('c'));rect(d,xm,y0,b*uw,k*rh,FILL('gold'));
    for(let i=1;i<a;i++)d.line(x0+i*xw,y0,x0+i*xw,y0+k*rh,'stroke="var(--c)" stroke-width=".8" opacity=".6"');for(let i=1;i<b;i++)d.line(xm+i*uw,y0,xm+i*uw,y0+k*rh,'stroke="var(--gold)" stroke-width=".8" opacity=".6"');
    for(let j=1;j<k;j++)d.line(x0,y0+j*rh,x0+W,y0+j*rh,'stroke="var(--bg2)" stroke-width="1.6"');
    for(let i=0;i<a;i++)tx(d,x0+i*xw+xw/2,y0-8,'x','var(--c)',11);tx(d,xm+b*uw/2,y0-8,String(b),'var(--gold)',11);tx(d,x0-13,y0+k*rh/2+4,String(k),'var(--ink)',13);
    tx(d,x0+a*xw/2,y0+k*rh+18,lin(k*a,0),'var(--c)',12);tx(d,xm+b*uw/2,y0+k*rh+18,String(k*b),'var(--gold)',12);
    tx(d,170,30,`縦 ${k}、横 ${lin(a,b)} の長方形`,'var(--muted)',11);
    return {svg:d.out(),read:`${k}(${lin(a,b)}) = ${k} × ${a===1?'':a}x + ${k} × ${b}<br>= <b>${lin(k*a,k*b)}</b><br>逆に見ると (${lin(k*a,k*b)}) ÷ ${k} = ${lin(a,b)}`};}});

/* ---- てんびん：等式と不等式 ---- */
FIGS.m1moji_tenbin=host=>mk(host,{alt:'左の皿に 3x + 2、右の皿に決まった重さをのせたてんびんの図',h:230,
  sliders:[{k:'x',label:'おもり 1 個の重さ x（g）',min:1,max:10,step:1,v:4},{k:'b',label:'右の皿の重さ（g）',min:10,max:30,step:2,v:20}],play:{k:'x',from:1,to:10,label:'x を大きくしていく',ms:4000},
  draw(v){const d=draw(),x=v.x,b=v.b,L=3*x+2,df=L-b,t=Math.max(-13,Math.min(13,df*1.3))*Math.PI/180,cx=170,cy=74,B=112;
    const P=[cx-B*Math.cos(t),cy+B*Math.sin(t)],Q=[cx+B*Math.cos(t),cy-B*Math.sin(t)];
    d.poly([[cx,cy],[cx-16,206],[cx+16,206]],'fill="var(--muted)" fill-opacity=".35" stroke="var(--muted)" stroke-width="1.2"');
    d.line(P[0],P[1],Q[0],Q[1],'stroke="var(--ink)" stroke-width="3" stroke-linecap="round"');d.dot(cx,cy,'var(--ink)',4);
    [[P,'c'],[Q,'gold']].forEach(([p,col],i)=>{const py=p[1]+62;d.line(p[0],p[1],p[0]-30,py,'stroke="var(--muted)" stroke-width="1"');d.line(p[0],p[1],p[0]+30,py,'stroke="var(--muted)" stroke-width="1"');
      d.line(p[0]-36,py,p[0]+36,py,`stroke="var(--${col})" stroke-width="3" stroke-linecap="round"`);
      if(i===0){for(let k=0;k<3;k++){rect(d,p[0]-31+k*17,py-19,15,17,FILL('c',.5));tx(d,p[0]-23.5+k*17,py-6,'x','var(--ink)',9);}rect(d,p[0]+21,py-11,9,9,FILL('c',.5));
        tx(d,p[0],py+18,`3x + 2 = ${L}`,'var(--c)',12);}
      else{rect(d,p[0]-14,py-21,28,19,FILL('gold',.5));tx(d,p[0],py+18,String(b),'var(--gold)',12);}});
    const s=df<0?'&lt;':df>0?'&gt;':'=';
    return {svg:d.out(),read:`左の皿：3x + 2 = 3 × ${x} + 2 = ${L}（g）<br>右の皿：${b}（g）<br><b>3x + 2 ${s} ${b}</b>　${df===0?'つり合う（等式）':df<0?'左が軽い（不等式）':'左が重い（不等式）'}<br>「3x + 2 ≧ ${b}」は${L>=b?'成り立つ':'成り立たない'}`};}});

/* ---- 数あての手品を文字で追う ---- */
const MJ=[['好きな数を思いうかべる',x=>x,'x'],['3 をたす',x=>x+3,'x + 3'],['2 倍する',x=>2*x+6,'2(x + 3) = 2x + 6'],['4 をひく',x=>2*x+2,'2x + 2'],['2 でわる',x=>x+1,'x + 1'],['はじめの数をひく',()=>1,'1']];
FIGS.m1moji_magic=host=>mk(host,{alt:'数あての手品の手順を、具体的な数と文字式の両方で追う図',
  sliders:[{k:'s',label:'手順',min:1,max:6,step:1,v:1},{k:'x',label:'はじめの数',min:-5,max:9,step:1,v:4}],play:{k:'s',from:1,to:6,label:'順に見る',ms:6000},
  draw(v){const d=draw(),s=v.s,x=v.x;
    tx(d,20,22,'操作','var(--muted)',10,'start');tx(d,172,22,'数','var(--muted)',10);tx(d,318,22,'文字式','var(--muted)',10,'end');d.line(16,30,324,30,'stroke="var(--line)" stroke-width="1"');
    for(let i=0;i<s;i++){const y=54+i*34,last=i===s-1;
      tx(d,20,y,`${i+1}. ${MJ[i][0]}`,last?'var(--ink)':'var(--muted)',11,'start');tx(d,172,y,n(MJ[i][1](x)),last?'var(--gold)':'var(--muted)',13);tx(d,318,y,MJ[i][2],last?'var(--c)':'var(--muted)',12,'end');}
    return {svg:d.out(),read:`<b>手順 ${s}</b>　${MJ[s-1][0]}<br>はじめの数が ${n(x)} のとき、今の数は <b>${n(MJ[s-1][1](x))}</b><br>はじめの数を x とすると、今の数は <i>${MJ[s-1][2]}</i>`+(s===6?'<br>x が消えたので、はじめの数が何であっても 1':'')};}});
FIGS.m1moji_magic.sim=(s,x)=>MJ[s-1][1](x);

/* ---- 正方形の形に並べた碁石 ---- */
const GO=[['(n − 1) 個のまとまりが 4 つ',k=>`4 × (${k} − 1)`,'4(n − 1)'],['1 辺 n 個が 4 つ。角の 4 個を 2 回数えたのでひく',k=>`4 × ${k} − 4`,'4n − 4'],['上下に n 個ずつ、左右に (n − 2) 個ずつ',k=>`2 × ${k} + 2 × (${k} − 2)`,'2n + 2(n − 2)']];
FIGS.m1moji_goishi=host=>mk(host,{alt:'1 辺に n 個ずつ、正方形の形に並べた碁石の図',h:240,
  sliders:[{k:'n',label:'1 辺の個数 n',min:2,max:8,step:1,v:5},{k:'m',label:'数え方',min:1,max:3,step:1,v:1,fmt:m=>'①②③'[m-1]}],
  draw(v){const d=draw(),k=v.n,m=v.m,sp=Math.min(30,182/(k-1)),x0=170-sp*(k-1)/2,y0=118-sp*(k-1)/2,r=Math.min(8,sp*.36);
    for(let i=0;i<k;i++)for(let j=0;j<k;j++){if(i>0&&i<k-1&&j>0&&j<k-1)continue;const cor=(i===0||i===k-1)&&(j===0||j===k-1);let g;
      if(m===1){const side=j===0&&i<k-1?0:i===k-1&&j<k-1?1:j===k-1&&i>0?2:3;g=side%2===0;}else if(m===2)g=false;else g=!(j===0||j===k-1);
      d.circle(x0+i*sp,y0+j*sp,r,`fill="var(--${g?'gold':'c'})" stroke="var(--bg2)" stroke-width="1.2"`);
      if(m===2&&cor)d.circle(x0+i*sp,y0+j*sp,r+3.5,'fill="none" stroke="var(--ng)" stroke-width="1.6"');}
    return {svg:d.out(),read:`数え方${'①②③'[m-1]}：${GO[m-1][0]}<br>${GO[m-1][1](k)} = <b>${4*k-4}</b>（個）<br>1 辺が n 個のとき：<b>${GO[m-1][2]}</b>（個）`};}});

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
const stick=(d,x1,y1,x2,y2)=>{const l=Math.hypot(x2-x1,y2-y1),ux=(x2-x1)/l,uy=(y2-y1)/l;d.line(x1+ux*5,y1+uy*5,x2-ux*5,y2-uy*5,'stroke="var(--gold)" stroke-width="3" stroke-linecap="round"');d.dot(x2-ux*5,y2-uy*5,'var(--ng)',2.6);};
const Q={
 match:{alt:'マッチ棒で、正方形を横に 4 個つなげた図',h:110,f(d){const u=52,x0=66,y0=28;for(let i=0;i<=4;i++)stick(d,x0+i*u,y0+u,x0+i*u,y0);for(let i=0;i<4;i++){stick(d,x0+i*u,y0,x0+(i+1)*u,y0);stick(d,x0+i*u,y0+u,x0+(i+1)*u,y0+u);}return '正方形が 4 個のとき';}},
 sankaku:{alt:'マッチ棒で、正三角形を横に 5 個つなげた図',h:110,f(d){const u=56,hh=u*Math.sqrt(3)/2,x0=58,y0=80,P=i=>[x0+i*u/2,i%2?y0-hh:y0];for(let i=0;i<6;i++)stick(d,P(i)[0],P(i)[1],P(i+1)[0],P(i+1)[1]);for(let i=0;i<5;i++)stick(d,P(i)[0],P(i)[1],P(i+2)[0],P(i+2)[1]);return '正三角形が 5 個のとき';}},
 nidan:{alt:'マッチ棒で、正方形を縦に 2 段、横に 3 列つなげた図',h:150,f(d){const u=50,x0=95,y0=20;for(let j=0;j<=2;j++)for(let i=0;i<3;i++)stick(d,x0+i*u,y0+j*u,x0+(i+1)*u,y0+j*u);for(let j=0;j<2;j++)for(let i=0;i<=3;i++)stick(d,x0+i*u,y0+(j+1)*u,x0+i*u,y0+j*u);return '縦 2 段、横 3 列のとき';}}
};
FIGS.m1moji_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){const d=draw(),r=q.f(d);return {svg:d.out(),read:r};}});};
})();
