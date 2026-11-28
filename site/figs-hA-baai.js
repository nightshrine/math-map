/* 数学A「場合の数と確率」の図（FIGS.habaai_*）。樹形図・表・道順・面積図など、数え方を目で追う図 */
(function(){
const {draw,n,mk}=FIG;
const f=v=>v.toFixed(1);
const INK='stroke="var(--ink)" stroke-width="1.6" fill="none" stroke-linejoin="round"';
const SUB='stroke="var(--muted)" stroke-width="1.2" fill="none"';
const DSH='stroke="var(--muted)" stroke-width="1.2" fill="none" stroke-dasharray="4 4"';
// 文字（線に重なっても読めるよう、地の色でふちどる）
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
const rect=(d,x,y,w,h,st)=>d.raw(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" ${st}/>`);
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const fr=(a,b)=>{const g=gcd(a,b)||1;a/=g;b/=g;return b===1?String(a):`${a}/${b}`;};
const fact=k=>k<2?1:k*fact(k-1);
const C=(m,r)=>{let v=1;for(let i=1;i<=r;i++)v=v*(m-r+i)/i;return Math.round(v);};
const sub=k=>String(k).split('').map(c=>'₀₁₂₃₄₅₆₇₈₉'[c]).join('');
const sup=k=>String(k).split('').map(c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('');

/* ---- 集合の要素の個数：ベン図（arg: {a, b, N}。A は a の倍数、B は b の倍数） ---- */
FIGS.habaai_venn=(host,arg)=>{const a=(arg&&arg.a)||2,b=(arg&&arg.b)||3,l=a*b/gcd(a,b);
  mk(host,{alt:`1 から N までの整数を、${a} の倍数の集合 A と ${b} の倍数の集合 B のベン図に分けた図`,
  sliders:[{k:'N',label:'N（全体集合 U は 1 から N までの整数）',min:10,max:100,step:1,v:(arg&&arg.N)||30}],
  draw(v){const N=v.N,nA=Math.floor(N/a),nB=Math.floor(N/b),nAB=Math.floor(N/l),u=nA+nB-nAB,d=draw();
    rect(d,16,14,308,212,SUB);
    d.circle(128,120,76,'fill="var(--c)" fill-opacity=".22" stroke="var(--c)" stroke-width="1.6"');
    d.circle(212,120,76,'fill="var(--gold)" fill-opacity=".2" stroke="var(--gold)" stroke-width="1.6"');
    tx(d,30,33,'U','var(--muted)');tx(d,64,52,'A','var(--c)',13);tx(d,276,52,'B','var(--gold)',13);
    tx(d,92,126,String(nA-nAB),'var(--ink)',16);tx(d,170,126,String(nAB),'var(--ink)',16);tx(d,248,126,String(nB-nAB),'var(--ink)',16);tx(d,300,214,String(N-u),'var(--muted)',13);
    return {svg:d.out(),read:`A：${a} の倍数 ${nA} 個　B：${b} の倍数 ${nB} 個<br>A ∩ B：${l} の倍数 ${nAB} 個<br>n(A ∪ B) = ${nA} + ${nB} − ${nAB} = <b>${u}</b><br>どちらの倍数でもない数：${N} − ${u} = ${N-u} 個`};}});};

/* ---- 場合の数：樹形図（積の法則） ---- */
FIGS.habaai_tree=host=>mk(host,{alt:'1つ目の選び方のそれぞれから、2つ目の選び方が枝分かれする樹形図',
  sliders:[{k:'a',label:'1つ目の選び方（通り）',min:2,max:4,step:1,v:3},{k:'b',label:'2つ目の選び方（通り）',min:1,max:4,step:1,v:2}],
  draw(v){const a=v.a,b=v.b,tot=a*b,gap=Math.min(24,200/tot),top=130-gap*(tot-1)/2,d=draw(),sm=gap<14;let k=0;
    for(let i=0;i<a;i++){const ys=[];for(let j=0;j<b;j++)ys.push(top+gap*(k++));const y1=(ys[0]+ys[b-1])/2;
      d.line(34,130,108,y1,SUB);
      ys.forEach((y,j)=>{d.line(128,y1,216,y,SUB);tx(d,228,y+4,String(j+1),'var(--gold)',sm?10:12);tx(d,292,y+4,'ABCD'[i]+(j+1),'var(--muted)',sm?9.5:11);});
      tx(d,118,y1+4.5,'ABCD'[i],'var(--c)',13);}
    d.dot(28,130,'var(--ink)',3.5);
    tx(d,118,15,'1つ目','var(--muted)',10);tx(d,228,15,'2つ目','var(--muted)',10);tx(d,292,15,'できる組','var(--muted)',10);
    return {svg:d.out(),read:`1つ目の選び方は ${a} 通り（A, B, …）<br>そのどれに対しても、2つ目の選び方は ${b} 通り<br>右端まで行く枝の数 = ${a} × ${b} = <b>${tot}</b> 通り`};}});

/* ---- 2個のさいころの表（arg.mode: 'sum' 和の法則 / 'event' 和事象の確率） ---- */
FIGS.habaai_dice=(host,arg)=>{const ev=!!(arg&&arg.mode==='event'),u=27,X0=98,Y0=46;
  const table=(d,st)=>{for(let i=1;i<=6;i++){tx(d,X0+u*(i-.5),Y0-7,String(i),'var(--muted)',11);tx(d,X0-11,Y0+u*(i-.5)+4,String(i),'var(--muted)',11);}
    tx(d,X0+u*3,16,'大きいさいころの目','var(--muted)',10);tx(d,44,Y0+u*3-3,'小さい','var(--muted)',10);tx(d,44,Y0+u*3+10,'さいころ','var(--muted)',10);
    for(let i=1;i<=6;i++)for(let j=1;j<=6;j++){const s=st(i,j);rect(d,X0+u*(i-1),Y0+u*(j-1),u,u,(s||'fill="none"')+' stroke="var(--line)" stroke-width="1"');
      d.raw(`<text x="${f(X0+u*(i-.5))}" y="${f(Y0+u*(j-.5)+4)}" font-size="11" font-family="var(--f-mono)" fill="var(--${s?'ink':'muted'})" text-anchor="middle">${i+j}</text>`);}
    rect(d,X0,Y0,u*6,u*6,SUB);};
  const cnt=g=>{let k=0;for(let i=1;i<=6;i++)for(let j=1;j<=6;j++)if(g(i,j))k++;return k;};
  if(!ev)return mk(host,{alt:'2個のさいころの目の和を並べた 6×6 の表。指定した和のますに色をつける',
    sliders:[{k:'s',label:'1つ目の和',min:2,max:12,step:1,v:5},{k:'t',label:'2つ目の和',min:2,max:12,step:1,v:10}],
    draw(v){const d=draw(),G='fill="var(--gold)" fill-opacity=".5"',Cc='fill="var(--c)" fill-opacity=".5"';
      table(d,(i,j)=>i+j===v.s?G:i+j===v.t?Cc:'');const a=cnt((i,j)=>i+j===v.s),b=cnt((i,j)=>i+j===v.t);
      return {svg:d.out(),read:v.s===v.t?`目の和が ${v.s} になるのは <b>${a}</b> 通り<br>（表のますは全部で 6 × 6 = 36 通り）`:
        `目の和が ${v.s} になるのは ${a} 通り<br>目の和が ${v.t} になるのは ${b} 通り<br>2つは同時には起こらないので、和の法則が使える<br>${a} + ${b} = <b>${a+b}</b> 通り`};}});
  mk(host,{alt:'2個のさいころの 6×6 の表で、目の和が決まった値になる事象 A と、同じ目が出る事象 B を色分けした図',
    sliders:[{k:'s',label:'事象 A：目の和が',min:2,max:12,step:1,v:8}],play:{k:'s',from:2,to:12,label:'和を 2 から 12 まで変える',ms:5200},
    draw(v){const d=draw(),A=(i,j)=>i+j===v.s,B=(i,j)=>i===j;
      table(d,(i,j)=>A(i,j)&&B(i,j)?'fill="var(--ok)" fill-opacity=".6"':A(i,j)?'fill="var(--c)" fill-opacity=".5"':B(i,j)?'fill="var(--gold)" fill-opacity=".45"':'');
      const a=cnt(A),b=cnt(B),ab=cnt((i,j)=>A(i,j)&&B(i,j));
      return {svg:d.out(),read:`A：目の和が ${v.s}（${a} 通り）　B：同じ目（${b} 通り）<br>`+(ab?`A ∩ B：${ab} 通り（両方に入るます）<br>P(A ∪ B) = ${a}/36 + ${b}/36 − ${ab}/36 = <b>${fr(a+b-ab,36)}</b>`:
        `A ∩ B は空。A と B は排反（同時に起こらない）<br>P(A ∪ B) = ${a}/36 + ${b}/36 = <b>${fr(a+b,36)}</b>`)};}});};

/* ---- 順列・重複順列：場所ごとの選び方（arg.rep が真なら重複順列） ---- */
FIGS.habaai_slots=(host,arg)=>{const rep=!!(arg&&arg.rep);
  mk(host,{alt:rep?'並べる場所ごとに、選べるものの個数が変わらないことを示す図':'並べる場所ごとに、選べるものの個数が1つずつ減ることを示す図',
  sliders:[{k:'n',label:'n（もとの個数）',min:2,max:7,step:1,v:5},{k:'r',label:'r（並べる個数）',min:1,max:rep?6:7,step:1,v:3}],
  draw(v){const N=v.n,r=rep?v.r:Math.min(v.r,N),d=draw(),W=34,G=10,x0=170-(r*W+(r-1)*G)/2,fs=[];let prod=1;
    for(let i=0;i<r;i++){const x=x0+i*(W+G),c=rep?N:N-i;prod*=c;fs.push(c);
      for(let j=0;j<N;j++)d.circle(x+W/2,152-j*17,5.5,j<c?'fill="var(--c)" fill-opacity=".8" stroke="none"':'fill="none" stroke="var(--muted)" stroke-width="1" stroke-dasharray="2 2"');
      rect(d,x,170,W,34,'fill="var(--gold)" fill-opacity=".14" stroke="var(--gold)" stroke-width="1.5" rx="4"');
      tx(d,x+W/2,193,String(c),'var(--gold)',16);tx(d,x+W/2,222,(i+1)+'番目','var(--muted)',9.5);
      if(i<r-1)tx(d,x+W+G/2,191,'×','var(--muted)',10);}
    return {svg:d.out(),read:rep?`どの場所でも、${N} 個の中から選べる（同じものをくり返し使ってよい）<br>${fs.join(' × ')} = ${N}${sup(r)} = <b>${prod}</b> 通り`:
      `丸は、その場所で選べるものの個数。1つ使うたびに1つ減る<br>${fs.join(' × ')} = <b>${prod}</b> 通り（${sub(N)}P${sub(r)}）`+(r===N?`<br>${N} 個すべてを並べるので ${N}! = ${prod}`:'')+(v.r>N?'<br>r は n 以下なので、r = n として表示':'')};}});};

/* ---- 円順列：回すと重なる並び方 ---- */
FIGS.habaai_circle=host=>mk(host,{alt:'円形に並んだ人を1席ずつ回した並び方と、それを1列に読んだ文字列の図',
  sliders:[{k:'n',label:'人数 n',min:3,max:6,step:1,v:4},{k:'k',label:'席を回す回数',min:0,max:5,step:1,v:0}],play:{k:'k',from:0,to:5,label:'1席ずつ回す',ms:3600},
  draw(v){const N=v.n,k=v.k%N,d=draw(),O=[104,126],R=62,L='ABCDEF';
    d.circle(O[0],O[1],R,SUB);
    for(let s=0;s<N;s++){const a=(90-360*s/N)*Math.PI/180,x=O[0]+R*Math.cos(a),y=O[1]-R*Math.sin(a),who=((s-k)%N+N)%N;
      d.circle(x,y,13,`fill="var(--bg2)" stroke="var(--${who?'c':'gold'})" stroke-width="1.8"`);tx(d,x,y+4.5,L[who],who?'var(--ink)':'var(--gold)',13);}
    d.path(`M${O[0]-5},${O[1]-R-25} L${O[0]+5},${O[1]-R-25} L${O[0]},${O[1]-R-17} Z`,'fill="var(--muted)" stroke="none"');
    tx(d,O[0],O[1]-3,'上の席から','var(--muted)',9.5);tx(d,O[0],O[1]+10,'時計回りに読む','var(--muted)',9.5);
    for(let j=0;j<N;j++){let s='';for(let q=0;q<N;q++)s+=L[((q-j)%N+N)%N];const y=126-(N-1)*13+j*26;
      if(j===k)rect(d,262-N*5-10,y-12,N*10+20,24,'fill="var(--gold)" fill-opacity=".12" stroke="var(--gold)" stroke-width="1.2" rx="4"');
      tx(d,262,y+5,s,j===k?'var(--gold)':'var(--muted)',14);}
    tx(d,262,22,'1列に読んだ並び','var(--muted)',10);
    return {svg:d.out(),read:`1列に並べる順列では、右の ${N} 通りは別々の並び方<br>円形では、回すと重なるので、どれも同じ並び方<br>${N}! ÷ ${N} = (${N} − 1)! = <b>${fact(N-1)}</b> 通り`};}});

/* ---- 最短の道順（arg.q があれば問題用：数は書かず、通る点 P を示す） ---- */
FIGS.habaai_grid=(host,arg)=>{const q=arg&&arg.q,HH=q?196:250;
  mk(host,{alt:q?'A から B まで、右か上にだけ進む格子状の道と、途中の点 P の図':'格子状の道の各交差点に、A からの最短の道順の数を書いた図',h:HH,
  sliders:q?[]:[{k:'a',label:'横の区画の数',min:1,max:5,step:1,v:4},{k:'b',label:'縦の区画の数',min:1,max:4,step:1,v:3}],
  draw(v){const a=q?q.a:v.a,b=q?q.b:v.b,u=Math.min(50,264/a,(HH-76)/b),x0=170-a*u/2+4,y0=HH/2+b*u/2+6,d=draw(),P=(i,j)=>[x0+i*u,y0-j*u];
    for(let i=0;i<=a;i++)d.line(P(i,0)[0],P(i,0)[1],P(i,b)[0],P(i,b)[1],SUB);
    for(let j=0;j<=b;j++)d.line(P(0,j)[0],P(0,j)[1],P(a,j)[0],P(a,j)[1],SUB);
    const A=P(0,0),B=P(a,b);
    if(q){const p=P(q.p[0],q.p[1]);d.dot(p[0],p[1],'var(--gold)',4.5);tx(d,p[0]-10,p[1]-8,'P','var(--gold)',13);
      d.dot(A[0],A[1],'var(--ink)',4).dot(B[0],B[1],'var(--ink)',4);tx(d,A[0]-12,A[1]+14,'A');tx(d,B[0]+12,B[1]-6,'B');
      return {svg:d.out(),read:'右（→）か上（↑）にだけ進む'};}
    const HC='stroke="var(--c)" stroke-width="3" fill="none" stroke-linecap="round"';
    if(a>0){const Q=P(a-1,b);d.line(Q[0],Q[1],B[0],B[1],HC);}if(b>0){const Q=P(a,b-1);d.line(Q[0],Q[1],B[0],B[1],HC);}
    for(let i=0;i<=a;i++)for(let j=0;j<=b;j++){const p=P(i,j),me=i===a&&j===b,pa=(i===a-1&&j===b)||(i===a&&j===b-1);
      d.dot(p[0],p[1],me?'var(--gold)':'var(--ink)',me?4.5:2.6);if(i||j)tx(d,p[0]-6,p[1]-6,String(C(i+j,i)),me?'var(--gold)':pa?'var(--c)':'var(--muted)',me?14:11,'end');}
    tx(d,A[0]-10,A[1]+15,'A');tx(d,B[0]+12,B[1]+5,'B');
    const l=C(a+b-1,a-1),r=C(a+b-1,a);
    return {svg:d.out(),read:`右へ ${a} 区画、上へ ${b} 区画進む最短の道順<br>→ を ${a} 個、↑ を ${b} 個、1列に並べる並べ方と同じ数<br>${sub(a+b)}C${sub(a)} = <b>${C(a+b,a)}</b> 通り<br>B の数 = 左の数 ${l} + 下の数 ${r}`};}});};

/* ---- なぜ：順列を、選んだ組ごとに1行にまとめる ---- */
FIGS.habaai_group=host=>mk(host,{alt:'n 個から r 個を選んで並べる順列を、選んだ組ごとに1行にまとめた表',
  sliders:[{k:'n',label:'n（もとの個数）',min:3,max:5,step:1,v:4},{k:'r',label:'r（選ぶ個数）',min:2,max:3,step:1,v:2}],
  draw(v){const N=v.n,r=v.r,L='ABCDE',d=draw(),combs=[],perms=s=>s.length<2?[s]:s.split('').flatMap((c,i)=>perms(s.slice(0,i)+s.slice(i+1)).map(t=>c+t));
    (function rec(st,s){if(s.length===r){combs.push(s);return;}for(let i=st;i<N;i++)rec(i+1,s+L[i]);})(0,'');
    const rf=fact(r),rows=combs.length,gh=Math.min(24,200/rows),cw=r===2?58:36,x1=122,y0=36+(200-rows*gh)/2;
    tx(d,56,20,'選んだ組','var(--gold)',10);tx(d,104,20,`その組の並べ替え（${r}! = ${rf} 通り）`,'var(--muted)',10,'start');
    combs.forEach((c,i)=>{const y=y0+i*gh+gh/2;if(i%2===0)rect(d,18,y-gh/2,304,gh,'fill="var(--ink)" fill-opacity=".06" stroke="none"');
      d.raw(`<text x="56" y="${f(y+4)}" font-size="11" font-family="var(--f-mono)" fill="var(--gold)" text-anchor="middle">{${c.split('').join(',')}}</text>`);
      perms(c).forEach((p,j)=>d.raw(`<text x="${x1+cw*j}" y="${f(y+4)}" font-size="11" font-family="var(--f-mono)" fill="var(--ink)" text-anchor="middle">${p}</text>`));});
    d.line(92,30,92,240,SUB);
    return {svg:d.out(),read:`${N} 個から ${r} 個を選んで並べる順列：${sub(N)}P${sub(r)} = ${rows*rf} 通り<br>横の1行は同じ組。1行に ${r}! = ${rf} 通りずつ入っている<br>組の数（行の数）= ${rows*rf} ÷ ${rf} = <b>${rows}</b>`};}});

/* ---- なぜ：パスカルの三角形 ---- */
FIGS.habaai_pascal=host=>mk(host,{alt:'パスカルの三角形。1つの数が、左上と右上の数の和になっていることを示す図',
  sliders:[{k:'n',label:'n（上から何段目か。いちばん上が 0）',min:1,max:7,step:1,v:5},{k:'r',label:'r（左から何番目か。左端が 0）',min:0,max:7,step:1,v:2}],
  draw(v){const N=v.n,r=Math.min(v.r,N),d=draw(),P=(i,j)=>[170+(j-i/2)*36,32+i*27],par=[];
    if(r>0)par.push([N-1,r-1]);if(r<N)par.push([N-1,r]);
    par.forEach(q=>{const A=P(q[0],q[1]),B=P(N,r);d.line(A[0],A[1],B[0],B[1],'stroke="var(--c)" stroke-width="1.8"');});
    for(let i=0;i<=7;i++)for(let j=0;j<=i;j++){const p=P(i,j),me=i===N&&j===r,pa=par.some(q=>q[0]===i&&q[1]===j);
      if(me||pa)d.circle(p[0],p[1],12.5,`fill="var(--bg2)" stroke="var(--${me?'gold':'c'})" stroke-width="1.8"`);
      d.raw(`<text x="${f(p[0])}" y="${f(p[1]+4)}" font-size="12" font-family="var(--f-mono)" fill="var(--${me?'gold':pa?'ink':'muted'})" text-anchor="middle">${C(i,j)}</text>`);}
    tx(d,P(N,0)[0]-24,P(N,0)[1]+4,'n='+N,'var(--muted)',10,'end');
    const nm=(a,b)=>`${sub(a)}C${sub(b)}`;
    return {svg:d.out(),read:(r===0?`${nm(N,0)} = <b>1</b><br>1つも選ばない選び方は 1 通り`:r===N?`${nm(N,N)} = <b>1</b><br>全部を選ぶ選び方は 1 通り`:
      `${nm(N,r)} = ${nm(N-1,r-1)} + ${nm(N-1,r)} = ${C(N-1,r-1)} + ${C(N-1,r)} = <b>${C(N,r)}</b><br>特定の1個を「選ぶ」場合と「選ばない」場合の和`)+(v.r>N?'<br>r は n 以下なので、r = n として表示':'')};}});

/* ---- 反復試行：3回の試行の樹形図 ---- */
const PS=[[1,6],[1,3],[1,2],[2,3],[5,6]];
FIGS.habaai_cointree=host=>mk(host,{alt:'3回の試行の結果を、起こる（○）と起こらない（×）で枝分かれさせた樹形図',
  sliders:[{k:'r',label:'○ の回数 r',min:0,max:3,step:1,v:1},{k:'p',label:'1回の試行で ○ になる確率',min:0,max:4,step:1,v:0,fmt:i=>PS[i].join('/')}],
  draw(v){const r=v.r,[a,b]=PS[v.p],d=draw(),X=[26,100,172,244],Y=(l,j)=>l===3?40+j*26:l===2?53+j*52:l===1?79+j*104:131,hit=i=>3-((i>>2&1)+(i>>1&1)+(i&1))===r;
    const edge=(l,j,st)=>d.line(X[l-1]+(l>1?9:5),Y(l-1,j>>1),X[l]-9,Y(l,j),st);
    for(let l=1;l<=3;l++)for(let j=0;j<(1<<l);j++)edge(l,j,SUB);
    for(let i=0;i<8;i++)if(hit(i))for(let l=1;l<=3;l++)edge(l,i>>(3-l),'stroke="var(--gold)" stroke-width="2.6" fill="none" stroke-linecap="round"');
    for(let l=1;l<=3;l++)for(let j=0;j<(1<<l);j++){let on=false;for(let i=0;i<8;i++)if(hit(i)&&(i>>(3-l))===j)on=true;tx(d,X[l],Y(l,j)+4.5,j&1?'×':'○',on?'var(--gold)':'var(--muted)',13);}
    d.dot(X[0],Y(0,0),'var(--ink)',3.5);
    for(let i=0;i<8;i++){const s=[2,1,0].map(q=>i>>q&1?'×':'○').join('');tx(d,296,Y(3,i)+4.5,s,hit(i)?'var(--gold)':'var(--muted)',12);}
    ['1回目','2回目','3回目'].forEach((t,i)=>tx(d,X[i+1],16,t,'var(--muted)',10));tx(d,296,16,'結果','var(--muted)',10);
    const c=C(3,r),num=a**r*(b-a)**(3-r),den=b**3,fa=[];if(r)fa.push(`(${a}/${b})${sup(r)}`);if(3-r)fa.push(`(${b-a}/${b})${sup(3-r)}`);
    return {svg:d.out(),read:`○ の確率 ${a}/${b}、× の確率 ${b-a}/${b}<br>○ がちょうど ${r} 回の道筋は ${sub(3)}C${sub(r)} = ${c} 本<br>道筋1本の確率：${fa.join(' × ')} = ${fr(num,den)}<br>求める確率 = ${c} × ${fr(num,den)} = <b>${fr(c*num,den)}</b>`};}});

/* ---- 反復試行：起こる回数ごとの確率 ---- */
FIGS.habaai_binom=host=>mk(host,{alt:'反復試行で、ことがらが起こる回数ごとの確率を表す棒グラフ',
  sliders:[{k:'n',label:'試行の回数 n',min:1,max:10,step:1,v:5},{k:'p',label:'1回の試行で起こる確率',min:0,max:4,step:1,v:2,fmt:i=>PS[i].join('/')},{k:'r',label:'起こる回数 r',min:0,max:10,step:1,v:3}],
  draw(v){const N=v.n,r=Math.min(v.r,N),[a,b]=PS[v.p],d=draw(),nu=k=>C(N,k)*a**k*(b-a)**(N-k),den=b**N,pr=k=>nu(k)/den;let mx=0;for(let k=0;k<=N;k++)mx=Math.max(mx,pr(k));
    const bw=Math.min(34,276/(N+1)),x0=170-bw*(N+1)/2;d.line(24,204,316,204,SUB);
    for(let k=0;k<=N;k++){const h=pr(k)/mx*146,x=x0+bw*k,me=k===r;rect(d,x+2,204-h,bw-4,h,`fill="var(--${me?'gold':'c'})" fill-opacity="${me?.9:.45}" stroke="none"`);
      tx(d,x+bw/2,220,String(k),me?'var(--gold)':'var(--muted)',11);if(me){const hm=Math.max(pr(k),k?pr(k-1):0,k<N?pr(k+1):0)/mx*146;tx(d,x+bw/2,204-hm-7,n(pr(k),3),'var(--gold)',11);}}
    tx(d,170,238,'起こる回数','var(--muted)',10);
    const fa=[];if(r)fa.push(`(${a}/${b})${sup(r)}`);if(N-r)fa.push(`(${b-a}/${b})${sup(N-r)}`);
    return {svg:d.out(),read:`${N} 回のうち、ちょうど ${r} 回起こる確率<br>${sub(N)}C${sub(r)} × ${fa.join(' × ')}<br>= ${C(N,r)} × ${fr(a**r*(b-a)**(N-r),den)} = <b>${fr(nu(r),den)}</b> ≈ ${n(pr(r),4)}`+(v.r>N?'<br>r は n 以下なので、r = n として表示':'')};}});

/* ---- 条件付き確率：面積の図（検査の陽性と病気） ---- */
FIGS.habaai_area=host=>mk(host,{alt:'全体を長方形で表し、横を病気の人と病気でない人、縦を陽性と陰性に分けた面積の図',
  sliders:[{k:'p',label:'病気の人の割合（%）',min:2,max:50,step:1,v:5},{k:'a',label:'病気の人が陽性になる割合（%）',min:50,max:100,step:5,v:90},{k:'b',label:'病気でない人が陽性になる割合（%）',min:0,max:30,step:1,v:10}],
  draw(v){const d=draw(),X=44,Y=36,W=262,H=176,w=W*v.p/100,ha=H*v.a/100,hb=H*v.b/100,pa=v.p*v.a/100,pb=(100-v.p)*v.b/100,tot=pa+pb;
    rect(d,X,Y,w,ha,'fill="var(--gold)" fill-opacity=".75" stroke="none"');rect(d,X,Y+ha,w,H-ha,'fill="var(--gold)" fill-opacity=".12" stroke="none"');
    rect(d,X+w,Y,W-w,hb,'fill="var(--c)" fill-opacity=".6" stroke="none"');rect(d,X+w,Y+hb,W-w,H-hb,'fill="var(--c)" fill-opacity=".1" stroke="none"');
    rect(d,X,Y,W,H,INK);d.line(X+w,Y,X+w,Y+H,INK);
    tx(d,X,Y-9,`病気 ${v.p}%`,'var(--gold)',10.5,'start');tx(d,X+W,Y-9,`病気でない ${100-v.p}%`,'var(--c)',10.5,'end');
    tx(d,X-6,Y+Math.max(ha/2,8)+4,'陽性','var(--gold)',10,'end');
    const pl=(x,y,t,c)=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="11" font-family="var(--f-mono)" fill="var(--${c||'ink'})" text-anchor="middle">${t}</text>`);
    if(w>=46&&ha>=18)pl(X+w/2,Y+ha/2+4,n(pa,2)+'%','bg2');
    if(hb>=17)pl(X+w+(W-w)/2,Y+hb/2+4,'陽性 '+n(pb,2)+'%');
    if(H-hb>=30)tx(d,X+w+(W-w)/2,Y+hb+(H-hb)/2+4,'陰性','var(--muted)',11);
    return {svg:d.out(),read:`陽性の人：病気 ${n(pa,2)}% ＋ 病気でない ${n(pb,2)}% = ${n(tot,2)}%<br>陽性の人のうち、病気である人の割合<br>${n(pa,2)} ÷ ${n(tot,2)} = <b>${n(pa/tot*100,1)}%</b>`};}});

/* ---- 期待値：くじの賞金 ---- */
FIGS.habaai_kuji=host=>mk(host,{alt:'10 本のくじの内訳と、賞金ごとの確率、期待値の位置を示す図',h:258,
  sliders:[{k:'a',label:'1等（1000 円）の本数',min:0,max:3,step:1,v:1},{k:'b',label:'2等（500 円）の本数',min:0,max:5,step:1,v:2}],
  draw(v){const a=v.a,b=v.b,c=10-a-b,d=draw(),E=100*a+50*b,sx=x=>60+x/1000*220;
    for(let i=0;i<10;i++){const k=i<a?0:i<a+b?1:2;rect(d,34+i*27.6,16,23.6,28,`fill="var(--${['gold','c','muted'][k]})" fill-opacity="${[.8,.55,.16][k]}" stroke="var(--${['gold','c','muted'][k]})" stroke-width="1" rx="3"`);
      d.raw(`<text x="${f(34+i*27.6+11.8)}" y="34" font-size="8.5" font-family="var(--f-mono)" fill="var(--ink)" text-anchor="middle">${['1000','500','0'][k]}</text>`);}
    d.line(34,186,306,186,SUB);
    [[0,c,'muted',.4],[500,b,'c',.6],[1000,a,'gold',.85]].forEach(q=>{const h=q[1]/10*112,x=sx(q[0]);rect(d,x-16,186-h,32,h,`fill="var(--${q[2]})" fill-opacity="${q[3]}" stroke="none"`);
      tx(d,x,186-h-6,q[1]+'/10',`var(--${q[2]==='muted'?'muted':q[2]})`,11);tx(d,x,201,q[0]+' 円','var(--muted)',10);});
    const ex=sx(E);d.path(`M${f(ex)},208 L${f(ex-7)},226 L${f(ex+7)},226 Z`,'fill="var(--ok)" stroke="none"');tx(d,ex,242,'期待値 '+E+' 円','var(--ok)',11);
    return {svg:d.out(),read:`賞金：1000 円（確率 ${a}/10）、500 円（${b}/10）、0 円（${c}/10）<br>期待値 = 1000 × ${a}/10 + 500 × ${b}/10 + 0 × ${c}/10<br>= ${100*a} + ${50*b} + 0 = <b>${E}</b> 円`};}});

/* ---- なぜ：多数回の試行の平均（種を固定した擬似乱数。arg.game: 'kuji' ならくじ） ---- */
const rng=s=>()=>{s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};
const NS=[10,20,50,100,200,500,1000,2000,5000];
FIGS.habaai_sim=(host,arg)=>{const kuji=!!(arg&&arg.game==='kuji'),E=kuji?200:3.5,lo=kuji?0:1,hi=kuji?600:6;
  mk(host,{alt:kuji?'くじをくり返し引いたときの、賞金の平均の移り変わりを表す折れ線の図':'さいころをくり返し投げたときの、出た目の平均の移り変わりを表す折れ線の図',
  sliders:[{k:'i',label:'試行の回数',min:0,max:8,step:1,v:3,fmt:i=>String(NS[i])},{k:'z',label:'実験の番号（乱数の種）',min:1,max:5,step:1,v:1}],play:{k:'i',from:0,to:8,label:'回数を増やす',ms:4800},
  draw(v){const N=NS[v.i],r=rng(v.z*7919+(kuji?17:0)),d=draw(),X=46,W=270,Y=22,H=178,sy=y=>Y+H-(Math.min(hi,y)-lo)/(hi-lo)*H,cnt={};let sum=0,pth='';const st=Math.ceil(N/270);
    (kuji?[0,200,400,600]:[1,2,3,4,5,6]).forEach(y=>{d.line(X,sy(y),X+W,sy(y),'stroke="var(--line)" stroke-width=".8"');tx(d,X-7,sy(y)+4,String(y),'var(--muted)',10,'end');});
    d.line(X,sy(E),X+W,sy(E),'stroke="var(--gold)" stroke-width="1.6" stroke-dasharray="6 4"');
    for(let k=1;k<=N;k++){const u=r(),x=kuji?(u<.1?1000:u<.3?500:0):1+Math.floor(u*6);sum+=x;cnt[x]=(cnt[x]||0)+1;if(k%st===0||k===N)pth+=(pth?'L':'M')+f(X+W*k/N)+','+f(sy(sum/k));}
    d.path(pth,'stroke="var(--c)" stroke-width="1.8" fill="none" stroke-linejoin="round"');d.dot(X+W,sy(sum/N),'var(--c)',3.5);
    d.line(X,Y,X,Y+H,SUB);d.line(X,Y+H,X+W,Y+H,SUB);
    tx(d,X,Y+H+16,'0','var(--muted)',10);tx(d,X+W,Y+H+16,N+' 回','var(--muted)',10,'end');tx(d,X+W/2,Y+H+16,'点線は期待値 '+E+(kuji?' 円':''),'var(--gold)',10.5);tx(d,X+W/2,Y+H+34,'横軸：試行の回数　縦軸：それまでの平均','var(--muted)',9.5);
    const g=k=>cnt[k]||0,av=sum/N;
    return {svg:d.out(),read:(kuji?`くじを ${N} 回引いた<br>1000 円 ${g(1000)} 回、500 円 ${g(500)} 回、0 円 ${g(0)} 回<br>賞金の平均 = ${sum} ÷ ${N} = <b>${n(av,1)}</b> 円`:
      `さいころを ${N} 回投げた<br>1 が ${g(1)} 回、2 が ${g(2)} 回、3 が ${g(3)} 回、4 が ${g(4)} 回、5 が ${g(5)} 回、6 が ${g(6)} 回<br>出た目の平均 = ${sum} ÷ ${N} = <b>${n(av,3)}</b>`)+`<br>期待値 ${E}${kuji?' 円':''} との差 ${n(Math.abs(av-E),kuji?1:3)}${kuji?' 円':''}`};}});};
})();
