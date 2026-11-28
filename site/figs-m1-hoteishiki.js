/* 中学1年「一次方程式」の図（FIGS.m1hoteishiki_*） */
(function(){
const {draw,n,mk}=FIG;
const f=v=>v.toFixed(1);
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
const pn=v=>v<0?`(${n(v)})`:n(v);
const rect=(d,x,y,w,h,st)=>d.poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],st);
const FILL=(col,o=.3)=>`fill="var(--${col})" fill-opacity="${o}" stroke="var(--${col})" stroke-width="1.4"`;

/* ---- x に数を代入して、左辺と右辺をくらべる ---- */
const SG=[['2x + 3 = 11',x=>2*x+3,()=>11,x=>`2 × ${pn(x)} + 3`,()=>'11',4],['4x − 5 = x + 4',x=>4*x-5,x=>x+4,x=>`4 × ${pn(x)} − 5`,x=>`${pn(x)} + 4`,3],['5 − 2x = x + 11',x=>5-2*x,x=>x+11,x=>`5 − 2 × ${pn(x)}`,x=>`${pn(x)} + 11`,-2]];
FIGS.m1hoteishiki_sagasu=host=>mk(host,{alt:'x に代入する数を変えて、方程式の左辺の値と右辺の値を 2 本の棒でくらべる図',h:220,
  sliders:[{k:'e',label:'方程式',min:1,max:3,step:1,v:1,fmt:e=>SG[e-1][0]},{k:'x',label:'x に代入する数',min:-3,max:6,step:1,v:1}],play:{k:'x',from:-3,to:6,label:'x を −3 から 6 まで動かす',ms:4500},
  draw(v){const d=draw(),E=SG[v.e-1],x=v.x,L=E[1](x),R=E[2](x),ax=170,u=7,ok=L===R;
    tx(d,170,26,E[0],'var(--ink)',14);
    d.line(ax,44,ax,196,'stroke="var(--muted)" stroke-width="1.2"');tx(d,ax,210,'0','var(--muted)',10);
    [[L,'c','左辺',78],[R,'gold','右辺',146]].forEach(([val,col,nm,y])=>{
      if(val)rect(d,Math.min(ax,ax+val*u),y,Math.abs(val)*u,18,FILL(col,.45));else d.dot(ax,y+9,`var(--${col})`,4);
      tx(d,24,y-8,`${nm} = ${n(val)}`,`var(--${col})`,12,'start');});
    if(ok){d.line(ax+L*u,56,ax+L*u,184,'stroke="var(--ok)" stroke-width="1.6" stroke-dasharray="5 4"');tx(d,ax+L*u+(L<0?-8:8),126,'等しい','var(--ok)',11,L<0?'end':'start');}
    return {svg:d.out(),read:`x = ${n(x)} を代入する<br><i>左辺：${E[3](x)} = ${n(L)}</i><br>右辺：${E[4](x)}${E[4](x)===n(R)?'':' = '+n(R)}<br>`+(ok?`<b>左辺 = 右辺</b>。x = ${n(x)} は、この方程式の解`:'左辺と右辺は等しくない。解ではない')};}});
FIGS.m1hoteishiki_sagasu.sim=e=>{const a=[];for(let x=-3;x<=6;x++)if(SG[e-1][1](x)===SG[e-1][2](x))a.push(x);return a;};

/* ---- 上皿てんびん：等式の性質（arg='both'：両辺に x がある場合） ---- */
// 状態：[左の皿 [x の箱, おもり], 右の皿, 左で取りのぞく数, 右で取りのぞく数, 式, 説明]
const TB={
 one:[[[2,3],[0,11],[0,0],[0,0],'2x + 3 = 11','x の箱 2 個とおもり 3 個が、おもり 11 個とつり合っている'],
  [[2,3],[0,11],[0,3],[0,3],'2x + 3 − 3 = 11 − 3','両方の皿から、おもりを 3 個ずつ取る<br>（両辺から 3 をひく）'],
  [[2,0],[0,8],[0,0],[0,0],'2x = 8','同じ重さを取ったので、つり合ったまま'],
  [[2,0],[0,8],[1,0],[0,4],'2x ÷ 2 = 8 ÷ 2','両方の皿を、半分ずつにする<br>（両辺を 2 でわる）'],
  [[1,0],[0,4],[0,0],[0,0],'x = 4','x の箱 1 個は、おもり 4 個とつり合う<br><b>解は x = 4</b>']],
 both:[[[3,2],[1,8],[0,0],[0,0],'3x + 2 = x + 8','両方の皿に、x の箱がある'],
  [[3,2],[1,8],[1,0],[1,0],'3x + 2 − x = x + 8 − x','両方の皿から、x の箱を 1 個ずつ取る<br>（両辺から x をひく）'],
  [[2,2],[0,8],[0,0],[0,0],'2x + 2 = 8','右の皿から x がなくなった'],
  [[2,2],[0,8],[0,2],[0,2],'2x + 2 − 2 = 8 − 2','両方の皿から、おもりを 2 個ずつ取る<br>（両辺から 2 をひく）'],
  [[2,0],[0,6],[0,0],[0,0],'2x = 6','左の皿からおもりがなくなった'],
  [[2,0],[0,6],[1,0],[0,3],'2x ÷ 2 = 6 ÷ 2','両方の皿を、半分ずつにする<br>（両辺を 2 でわる）'],
  [[1,0],[0,3],[0,0],[0,0],'x = 3','x の箱 1 個は、おもり 3 個とつり合う<br><b>解は x = 3</b>']]};
FIGS.m1hoteishiki_tenbin=(host,arg)=>{const T=TB[arg==='both'?'both':'one'],K=T.length;
  mk(host,{alt:'上皿てんびんの両方の皿から同じものを取りのぞいて、方程式を解く手順の図',h:180,
  sliders:[{k:'s',label:'手順',min:1,max:K,step:1,v:1}],play:{k:'s',from:1,to:K,label:'順に見る',ms:1300*K},
  draw(v){const d=draw(),S=T[v.s-1],OUT='fill="var(--ng)" fill-opacity=".12" stroke="var(--ng)" stroke-width="1.2" stroke-dasharray="3 3"';
    tx(d,170,30,S[4],'var(--gold)',15);d.raw('<g transform="translate(0,-52)">');
    d.poly([[170,172],[152,214],[188,214]],'fill="var(--muted)" fill-opacity=".35" stroke="var(--muted)" stroke-width="1.2"');
    d.line(60,172,280,172,'stroke="var(--ink)" stroke-width="3.2" stroke-linecap="round"');
    [[95,S[0],S[2]],[245,S[1],S[3]]].forEach(([cx,it,out])=>{
      d.line(cx,160,cx,172,'stroke="var(--ink)" stroke-width="2"');d.path(`M${cx-66},154 L${cx-62},160 L${cx+62},160 L${cx+66},154`,'stroke="var(--ink)" stroke-width="2.2" fill="none" stroke-linejoin="round"');
      let bx=cx-56;for(let i=0;i<it[0];i++){const o=i>=it[0]-out[0];rect(d,bx,134,23,23,o?OUT:FILL('c',.5));tx(d,bx+11.5,150,'x',o?'var(--ng)':'var(--ink)',11);bx+=26;}
      if(it[0])bx+=4;const per=Math.max(1,Math.floor((cx+58-bx)/13));
      for(let i=0;i<it[1];i++){const o=i>=it[1]-out[1],x=bx+6+(i%per)*13,y=151-Math.floor(i/per)*13;d.circle(x,y,5.6,o?OUT:'fill="var(--gold)" fill-opacity=".75" stroke="var(--gold)" stroke-width="1.2"');}});
    tx(d,95,196,'左辺','var(--muted)',10);tx(d,245,196,'右辺','var(--muted)',10);d.raw('</g>');
    return {svg:d.out(),read:`<b>手順 ${v.s}</b>　${S[4]}<br>${S[5]}`};}});};

/* ---- 式の変形を 1 手ずつ（arg：seishitsu / iko / kakko / shosu / bunsu） ---- */
const TK={
 seishitsu:[['5x − 4 = 2x + 8','解きたい方程式。負の項 −4 がある'],['5x − 4 + 4 = 2x + 8 + 4','両辺に 4 をたす'],['5x = 2x + 8 + 4','左辺の −4 が消えて、右辺に +4 が現れた'],['5x − 2x = 2x + 8 + 4 − 2x','両辺から 2x をひく'],['5x − 2x = 8 + 4','右辺の 2x が消えて、左辺に −2x が現れた'],['3x = 12','両辺をそれぞれ計算する'],['x = 4','両辺を 3 でわる。<b>解は x = 4</b>']],
 iko:[['5x − 4 = 2x + 8','解きたい方程式'],['5x − 2x = 8 + 4','−4 を右辺へ、2x を左辺へ、符号を変えて移項する'],['3x = 12','両辺をそれぞれ計算して、ax = b の形にする'],['x = 4','両辺を x の係数 3 でわる。<b>解は x = 4</b>']],
 kakko:[['3(x − 2) = x + 4','かっこのある方程式'],['3x − 6 = x + 4','分配法則で、かっこをはずす'],['3x − x = 4 + 6','移項する'],['2x = 10','両辺をそれぞれ計算する'],['x = 5','両辺を 2 でわる。<b>解は x = 5</b>']],
 shosu:[['0.4x − 1.5 = 0.1x + 0.3','係数に小数がある方程式'],['4x − 15 = x + 3','両辺に 10 をかけて、係数を整数にする'],['4x − x = 3 + 15','移項する'],['3x = 18','両辺をそれぞれ計算する'],['x = 6','両辺を 3 でわる。<b>解は x = 6</b>']],
 bunsu:[['x/2 − 1 = (x − 4)/3','係数に分数がある方程式'],['(x/2 − 1) × 6 = (x − 4)/3 × 6','両辺に、分母 2 と 3 の最小公倍数 6 をかける'],['3x − 6 = 2(x − 4)','分母をはらう。−1 にも 6 をかける'],['3x − 6 = 2x − 8','かっこをはずす'],['3x − 2x = −8 + 6','移項する'],['x = −2','両辺をそれぞれ計算する。<b>解は x = −2</b>']]};
FIGS.m1hoteishiki_toku=(host,arg)=>{const T=TK[arg]||TK.iko,K=T.length;
  mk(host,{alt:'方程式を 1 手ずつ変形して解く手順の図',h:Math.max(170,44+K*28),
  sliders:[{k:'s',label:'手順',min:1,max:K,step:1,v:1}],play:{k:'s',from:1,to:K,label:'順に見る',ms:1300*K},
  draw(v){const d=draw();
    for(let i=0;i<v.s;i++){const [l,r]=T[i][0].split(' = '),y=36+i*28,c=i===v.s-1?'var(--gold)':'var(--muted)';
      tx(d,152,y,l,c,13,'end');tx(d,161,y,'=',c,13);tx(d,170,y,r,c,13,'start');
      if(i===v.s-1)tx(d,22,y,'▶','var(--gold)',10);}
    return {svg:d.out(),read:`<b>手順 ${v.s}</b>　${T[v.s-1][1]}<br>${T[v.s-1][0]}`};}});};

/* ---- 比と比例式：同じ比を、大きさを変えて見る ---- */
FIGS.m1hoteishiki_hi=host=>mk(host,{alt:'2 本の帯の長さの比を保ったまま、全体を何倍かにする図',h:210,
  sliders:[{k:'a',label:'a',min:1,max:5,step:1,v:2},{k:'b',label:'b',min:1,max:5,step:1,v:3},{k:'k',label:'何倍にするか',min:1,max:4,step:.5,v:2.5}],
  draw(v){const d=draw(),{a,b,k}=v,u=12.5,x0=30,bar=(len,y,col)=>{rect(d,x0,y,len*u,15,FILL(col,.45));tx(d,x0+len*u+8,y+12,n(len),`var(--${col})`,12,'start');};
    tx(d,x0,32,`a : b = ${a} : ${b}`,'var(--ink)',12,'start');bar(a,40,'c');bar(b,60,'gold');
    tx(d,x0,116,`${n(k)} 倍すると　${n(a*k)} : ${n(b*k)}`,'var(--ink)',12,'start');bar(a*k,124,'c');bar(b*k,144,'gold');
    tx(d,x0,190,`比の値はどちらも ${a} ÷ ${b} = ${n(a/b,3)}`,'var(--muted)',11,'start');
    return {svg:d.out(),read:`${a} : ${b} = ${n(a*k)} : ${n(b*k)}<br>外側の項の積：${a} × ${n(b*k)} = <b>${n(a*b*k)}</b><br>内側の項の積：${b} × ${n(a*k)} = <b>${n(a*b*k)}</b><br>比が等しいとき、2 つの積は等しい`};}});

/* ---- 過不足：鉛筆の本数を 2 通りに表す ---- */
FIGS.m1hoteishiki_kafusoku=host=>mk(host,{alt:'子どもの人数を変えて、2 通りに表した鉛筆の本数をくらべる線分図',h:208,
  sliders:[{k:'x',label:'子どもの人数 x',min:3,max:10,step:1,v:4}],play:{k:'x',from:3,to:10,label:'人数を増やしていく',ms:4500},
  draw(v){const d=draw(),x=v.x,u=4.8,x0=26,A=4*x+9,B=6*x-5,ok=A===B,g=`stroke="var(--${ok?'ok':'muted'})" stroke-width="1.4" stroke-dasharray="4 3"`;
    tx(d,x0,26,`4 本ずつ配ると 9 本余る：鉛筆は ${A} 本`,'var(--c)',11,'start');
    rect(d,x0,34,4*x*u,18,FILL('c',.45));rect(d,x0+4*x*u,34,9*u,18,FILL('gold',.5));tx(d,x0+2*x*u,47,`4 × ${x}`,'var(--ink)',11);tx(d,x0+4*x*u+4.5*u,47,'9','var(--ink)',11);
    rect(d,x0,96,B*u,18,FILL('c',.45));rect(d,x0+B*u,96,5*u,18,'fill="var(--ng)" fill-opacity=".12" stroke="var(--ng)" stroke-width="1.2" stroke-dasharray="3 3"');tx(d,x0+B*u/2,109,`6 × ${x} − 5`,'var(--ink)',11);
    d.line(x0+A*u,32,x0+A*u,118,g);d.line(x0+B*u,60,x0+B*u,118,g);
    d.path(`M${x0},122 L${x0},128 L${x0+6*x*u},128 L${x0+6*x*u},122`,'stroke="var(--muted)" stroke-width="1.2" fill="none"');tx(d,x0+3*x*u,144,`6 × ${x} = ${6*x} 本必要`,'var(--muted)',10);
    tx(d,x0,168,`6 本ずつ配ると 5 本足りない：鉛筆は ${B} 本`,'var(--c)',11,'start');
    tx(d,x0,194,ok?'2 本の帯の右はしがそろった':'2 本の帯の右はしがずれている','var(--'+(ok?'ok':'muted')+')',11,'start');
    return {svg:d.out(),read:`子どもが ${x} 人のとき<br>4x + 9 = 4 × ${x} + 9 = ${A}<br>6x − 5 = 6 × ${x} − 5 = ${B}<br>`+(ok?'<b>2 つの本数が等しい</b>。x = 7 が 4x + 9 = 6x − 5 の解':'同じ鉛筆の本数なのに、値がちがう。この人数ではない')};}});

/* ---- 追いつく：2 人の位置 ---- */
FIGS.m1hoteishiki_oitsuku=host=>mk(host,{alt:'先に出発した弟と、あとから追いかける兄の位置を、時間を進めて示す図',h:220,
  sliders:[{k:'t',label:'兄が出発してからの時間（分）',min:0,max:6,step:.5,v:1}],play:{k:'t',from:0,to:6,label:'時間を進める',ms:4500},
  draw(v){const d=draw(),t=v.t,X=m=>30+m*.28,ot=60*(t+6),an=150*t,y=118;
    d.line(X(0),y,X(1000),y,'stroke="var(--muted)" stroke-width="1.4"');
    for(let m=0;m<=1000;m+=100){d.line(X(m),y-4,X(m),y+4,'stroke="var(--muted)" stroke-width="1.2"');if(m%200===0)tx(d,X(m),y+66,m===0?'家':m+' m','var(--muted)',10);}
    rect(d,X(0),y-30,ot*.28,12,FILL('gold',.4));d.dot(X(ot),y-24,'var(--gold)',6);tx(d,X(ot),y-40,'弟 '+n(ot)+' m','var(--gold)',11);
    if(an)rect(d,X(0),y+18,an*.28,12,FILL('c',.4));d.dot(X(an),y+24,'var(--c)',6);tx(d,Math.max(48,X(an)),y+48,'兄 '+n(an)+' m','var(--c)',11);
    tx(d,170,28,'弟：分速 60 m（6 分前に出発）　兄：分速 150 m','var(--muted)',10);
    return {svg:d.out(),read:`兄が出発してから ${n(t)} 分後<br>弟の進んだ道のり：60 × (${n(t)} + 6) = ${n(ot)}（m）<br><i>兄の進んだ道のり：150 × ${n(t)} = ${n(an)}（m）</i><br>`+(ot===an?'<b>道のりが等しい</b>。兄が弟に追いついた':ot>an?`弟が ${n(ot-an)} m 前にいる`:`兄が ${n(an-ot)} m 前に出た`)};}});

/* ---- 比例式の利用：同じ割合で量を変える ---- */
FIGS.m1hoteishiki_recipe=host=>mk(host,{alt:'小麦粉と砂糖の量を、同じ割合のまま変える帯の図',h:210,
  sliders:[{k:'f',label:'小麦粉の量（g）',min:50,max:400,step:50,v:250}],
  draw(v){const d=draw(),fl=v.f,s=.4*fl,u=.6,x0=28,bar=(g,y,col,o)=>{rect(d,x0,y,g*u,15,FILL(col,o));tx(d,x0+g*u+8,y+12,n(g)+' g',`var(--${col})`,11,'start');};
    tx(d,x0,30,'もとの分量　小麦粉 150 g、砂糖 60 g','var(--muted)',11,'start');bar(150,38,'c',.25);bar(60,58,'gold',.25);
    tx(d,x0,116,`小麦粉を ${fl} g にすると、砂糖は x g`,'var(--ink)',11,'start');bar(fl,124,'c',.5);bar(s,144,'gold',.5);
    tx(d,x0,190,'上の帯：小麦粉　下の帯：砂糖','var(--muted)',10,'start');
    return {svg:d.out(),read:`150 : 60 = ${fl} : x<br>150x = 60 × ${fl} = ${60*fl}<br>x = ${60*fl} ÷ 150 = <b>${n(s)}</b>（g）<br>小麦粉 ÷ 砂糖 は、どちらも 2.5`};}});
})();
