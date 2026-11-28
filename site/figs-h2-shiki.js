/* 数学II「式と証明」「複素数と方程式」の図。名前は h2shiki_ で始める */
(function(){
const {plot,draw,n,sg,C,GOLD,DASH}=FIG;
const f=v=>v.toFixed(1);
// 文字。halo が true のときは、線に重なっても読めるよう地の色でふちどる
const T=(x,y,s,c='var(--ink)',fs=12,a='middle',halo=true)=>`<text x="${f(x)}" y="${f(y)}" font-size="${fs}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}"${halo?' paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round"':''}>${s}</text>`;
const SUP='⁰¹²³⁴⁵⁶⁷⁸⁹',SUB='₀₁₂₃₄₅₆₇₈₉';
const sup=k=>String(k).split('').map(d=>SUP[+d]).join(''),sub=k=>String(k).split('').map(d=>SUB[+d]).join('');
const pw=(s,k)=>k===0?'':k===1?s:s+sup(k);            // 文字の累乗（0乗は書かない。1乗は指数を書かない）
// 多項式の1つの項と、多項式全体（cs は次数の高い順の係数）
const term=(c,d,first)=>{const a=Math.abs(c),body=d===0?n(a,3):(a===1?'':n(a,3))+pw('x',d);return (c<0?(first?'−':'− '):(first?'':'+ '))+body;};
const polyS=cs=>{let s='';const N=cs.length-1;cs.forEach((c,i)=>{if(Math.abs(c)>1e-9)s+=(s?' ':'')+term(c,N-i,!s);});return s||'0';};
const fac=r=>Math.abs(r)<1e-9?'x':`(x ${sg(-r)})`;    // 因数 (x − r)
const simp=q=>{let a=1;for(let i=2;i*i<=q;i++)while(q%(i*i)===0){q/=i*i;a*=i;}return [a,q];};
const Cn=(m,r)=>{let c=1;for(let i=0;i<r;i++)c=c*(m-i)/(i+1);return Math.round(c);};
const pg=(pts,st)=>`<polygon points="${pts.map(p=>f(p[0])+','+f(p[1])).join(' ')}" ${st}/>`;
const ln=(x1,y1,x2,y2,st)=>`<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" ${st}/>`;
const THIN='stroke="var(--muted)" stroke-width="1.2" fill="none"',THIND=THIN+' stroke-dasharray="4 4"';

/* ---- 3次式の展開：1辺 a+b の立方体を 8 つの直方体に分ける ---- */
FIGS.h2shiki_cube=host=>FIG.mk(host,{alt:'1辺 a+b の立方体を、a³ が1個、a²b が3個、ab² が3個、b³ が1個の、8つの直方体に分ける図',
  sliders:[{k:'a',label:'a（b は 1 に固定）',min:1,max:3,step:.5,v:2},{k:'t',label:'ばらす',min:0,max:1,step:.05,v:0}],play:{k:'t',from:0,to:1,label:'8つに分ける',ms:2600},
  draw(v){const a=v.a,L=118,u=L/(a+1),G=30*v.t,ox=22,oy=224,P=(x,y,z)=>[ox+x+y*.45,oy-z-y*.3];
    const col=['c','ok','gold','ng'],name=['a³','a²b','ab²','b³'],sg2=i=>i?[a*u+G,L+G]:[0,a*u];let s='';
    for(let j=1;j>=0;j--)for(let k=0;k<2;k++)for(let i=0;i<2;i++){const [x0,x1]=sg2(i),[y0,y1]=sg2(j),[z0,z1]=sg2(k),cc=col[i+j+k];
      const face=(pts,op)=>{s+=pg(pts,'fill="var(--bg2)"')+pg(pts,`fill="var(--${cc})" fill-opacity="${op}" stroke="var(--bg2)" stroke-width="1.2" stroke-linejoin="round"`);};
      face([P(x0,y0,z1),P(x1,y0,z1),P(x1,y1,z1),P(x0,y1,z1)],.5);face([P(x1,y0,z0),P(x1,y1,z0),P(x1,y1,z1),P(x1,y0,z1)],.3);face([P(x0,y0,z0),P(x1,y0,z0),P(x1,y0,z1),P(x0,y0,z1)],.72);
      if(j===0&&v.t>=.5){const m=P((x0+x1)/2,y0,(z0+z1)/2);s+=T(m[0],m[1]+4,name[i+k],'var(--on-c)',11,'middle',false);}}
    s+=T(ox+a*u/2,oy+15,'a','var(--muted)')+T(ox+a*u+G+u/2,oy+15,'b','var(--muted)')+T(ox-10,oy-a*u/2+4,'a','var(--muted)')+T(ox-10,oy-a*u-G-u/2+4,'b','var(--muted)');
    [1,3,3,1].forEach((m,q)=>{const y=70+q*28;s+=`<rect x="252" y="${y-10}" width="12" height="12" rx="2" fill="var(--${col[q]})" fill-opacity=".72"/>`+T(270,y,name[q]+' が '+m+' 個','var(--ink)',11,'start');});
    const w=(a+1)**3;
    return {svg:s,read:`(a + b)³ = (${n(a)} + 1)³ = <b>${n(w,3)}</b><br>a³ = ${n(a**3,3)}、a²b が 3 個で ${n(3*a*a,3)}<br>ab² が 3 個で ${n(3*a,3)}、b³ = 1<br>合計 ${n(a**3,3)} + ${n(3*a*a,3)} + ${n(3*a,3)} + 1 = <b>${n(w,3)}</b>`};}});

/* ---- 二項定理：パスカルの三角形。arg.add のときは「左上と右上の和」を見せる ---- */
FIGS.h2shiki_pascal=(host,arg)=>{const add=!!(arg&&arg.add);
  FIG.mk(host,{alt:add?'パスカルの三角形で、1つの数が左上と右上の数の和になっていることを示す図':'パスカルの三角形と、(a+b) の n 乗の展開式の係数の図',
  sliders:add?[{k:'p',label:'a を選ぶ個数',min:1,max:4,step:1,v:2},{k:'r',label:'b を選ぶ個数 r',min:1,max:4,step:1,v:2}]:[{k:'n',label:'n',min:1,max:8,step:1,v:4}],
  play:add?undefined:{k:'n',from:1,to:8,label:'n を増やす',ms:4400},
  draw(v){const N=add?Math.round(v.p+v.r):Math.round(v.n),r=add?Math.round(v.r):-1,pos=(i,j)=>[170+(j-i/2)*34,24+i*26];let s='';
    if(!add){const a=pos(N,0),b=pos(N,N);s+=`<rect x="${f(a[0]-15)}" y="${a[1]-15}" width="${f(b[0]-a[0]+30)}" height="22" rx="11" fill="var(--gold)" fill-opacity=".2" stroke="var(--gold)" stroke-width="1.2"/>`;}
    else{const c=pos(N,r);[pos(N-1,r-1),pos(N-1,r)].forEach(q=>{s+=ln(q[0],q[1]+7,c[0],c[1]-15,'stroke="var(--c)" stroke-width="1.6"')+`<circle cx="${f(q[0])}" cy="${q[1]-4}" r="12" fill="var(--c)" fill-opacity=".25" stroke="var(--c)" stroke-width="1.4"/>`;});
      s+=`<circle cx="${f(c[0])}" cy="${c[1]-4}" r="12" fill="var(--gold)" fill-opacity=".3" stroke="var(--gold)" stroke-width="1.4"/>`;}
    for(let i=0;i<=8;i++)for(let j=0;j<=i;j++){const q=pos(i,j),hot=add?(i===N&&j===r):i===N,par=add&&i===N-1&&(j===r-1||j===r);
      s+=T(q[0],q[1],Cn(i,j),hot?'var(--gold)':par?'var(--ink)':add?'var(--muted)':(i<N?'var(--ink)':'var(--muted)'),12,'middle',false);}
    let read;
    if(add){const x=Cn(N-1,r-1),y=Cn(N-1,r);read=`${N} 個のかっこから、b を ${r} 個選ぶ<br>${sub(N)}C${sub(r)} = <b>${Cn(N,r)}</b> 通り<br>最後のかっこで b を選ぶ：${sub(N-1)}C${sub(r-1)} = <i>${x}</i> 通り<br>最後のかっこで a を選ぶ：${sub(N-1)}C${sub(r)} = <i>${y}</i> 通り<br>${x} + ${y} = ${x+y}`;}
    else{const ts=[];for(let j=0;j<=N;j++){const c=Cn(N,j);ts.push((c===1?'':c)+pw('a',N-j)+pw('b',j));}
      read=`(a + b)${sup(N)} の係数：<b>${ts.map((t,j)=>Cn(N,j)).join(', ')}</b><br>(a + b)${sup(N)} = `+(N>5?ts.slice(0,5).join(' + ')+'<br>　+ '+ts.slice(5).join(' + '):ts.join(' + '));}
    return {svg:s,read};}});};

/* ---- なぜ：3つのかっこから a か b を選ぶ ---- */
FIGS.h2shiki_erabu=host=>FIG.mk(host,{alt:'3つのかっこ (a+b) のそれぞれから a か b を1つずつ選んで積を作り、8通りを積ごとに分けた表の図',
  sliders:[1,2,3].map(i=>({k:'c'+i,label:i+'つ目のかっこ',min:0,max:1,step:1,v:i===2?1:0,fmt:x=>'ab'[Math.round(x)]})),
  draw(v){const ch=[v.c1,v.c2,v.c3].map(x=>Math.round(x)),nb=ch[0]+ch[1]+ch[2],name=['a³','a²b','ab²','b³'];let s='';
    ch.forEach((c,i)=>{const x=70+i*100;s+=ln(x+(c?22:-22),47,170,78,'stroke="var(--gold)" stroke-width="1.2"');
      s+=T(x-42,40,'(','var(--ink)',15)+T(x+42,40,')','var(--ink)',15)+T(x,39,'+','var(--muted)',12);
      [0,1].forEach(q=>{const xx=x+(q?22:-22),on=c===q;if(on)s+=`<circle cx="${xx}" cy="35" r="12" fill="var(--bg2)"/><circle cx="${xx}" cy="35" r="12" fill="var(--gold)" fill-opacity=".3" stroke="var(--gold)" stroke-width="1.5"/>`;
        s+=T(xx,40,'ab'[q],on?'var(--gold)':'var(--muted)',15,'middle',false);});});
    s+=T(170,96,ch.map(c=>'ab'[c]).join(' × ')+' = '+name[nb],'var(--ink)',14)+ln(14,112,326,112,'stroke="var(--line)"');
    const cols=[[],[],[],[]];for(let m=0;m<8;m++){const w=[m>>2&1,m>>1&1,m&1];cols[w[0]+w[1]+w[2]].push(w);}
    cols.forEach((cl,q)=>{const x=50+q*80;s+=T(x,134,name[q],q===nb?'var(--gold)':'var(--ink)',13);
      cl.forEach((w,k)=>{const on=w.join()===ch.join(),y=160+k*21;if(on)s+=`<rect x="${x-24}" y="${y-14}" width="48" height="20" rx="5" fill="var(--gold)" fill-opacity=".3" stroke="var(--gold)"/>`;
        s+=T(x,y,w.map(c=>'ab'[c]).join(''),on?'var(--gold)':'var(--muted)',12,'middle',false);});
      s+=T(x,236,cl.length+' 通り',q===nb?'var(--gold)':'var(--muted)',11);});
    return {svg:s,read:`選んだ文字：${ch.map(c=>'ab'[c]).join('、')} → 積は <b>${name[nb]}</b><br>${name[nb]} になる選び方は <b>${[1,3,3,1][nb]} 通り</b><br>b を選ぶかっこ ${nb} 個を、3 個の中から決める：${sub(3)}C${sub(nb)} = ${[1,3,3,1][nb]}`};}});

/* ---- 多項式の割り算の筆算。arg = {A:[割られる式の係数], B:[割る式の係数]}（次数の高い順。B の最高次の係数は 1） ---- */
FIGS.h2shiki_hissan=(host,arg)=>{const A=(arg&&arg.A)||[2,-1,-4,7],B=(arg&&arg.B)||[1,1,-2],N=A.length-1,m=A.length-B.length+1;
  const rem=A.slice(),q=[],st=[];
  for(let i=0;i<m;i++){const c=rem[i]/B[0],prod=A.map(()=>0);q.push(c);B.forEach((b,j)=>{prod[i+j]=c*b;rem[i+j]-=c*b;});st.push({prod,rem:rem.slice()});}
  const X=d=>332-d*56;
  // 係数の列 cs（A と同じ並び）の i0〜i1 番目を、次数ごとの列にそろえて書く
  const row=(cs,y,col,i0,i1)=>{let s='',first=true;for(let i=i0;i<=i1;i++){if(Math.abs(cs[i])<1e-9)continue;s+=T(X(N-i),y,term(cs[i],N-i,first),col,12,'end',false);first=false;}return s||T(X(0),y,'0',col,12,'end',false);};
  FIG.mk(host,{h:116+44*(m-1),alt:`${polyS(A)} を ${polyS(B)} で割る筆算を、手順ごとに示す図`,
  sliders:[{k:'s',label:'手順',min:1,max:2*m+1,step:1,v:1}],play:{k:'s',from:1,to:2*m+1,label:'順に見る',ms:1300*(2*m+1)},
  draw(v){const s=Math.round(v.s);let o=T(104,54,polyS(B),'var(--ink)',12,'end',false)+`<path d="M110,38 q7,11 0,22" ${THIN}/>`+ln(110,38,336,38,THIN)+row(A,54,'var(--ink)',0,N);
    for(let k=0;k<m;k++){const y=74+44*k,d=m-1-k,now=s===2*k+2;
      if(s>=2*k+2){o+=T(X(d),28,term(q[k],d,k===0),now?'var(--gold)':'var(--ink)',12,'end',false)+row(st[k].prod,y,now?'var(--gold)':'var(--muted)',k,k+B.length-1);}
      if(s>=2*k+3){o+=ln(X(N-k)-52,y+7,336,y+7,THIN)+row(st[k].rem,y+24,s===2*k+3?'var(--gold)':'var(--ink)',k+1,N);}}
    let read;
    if(s===1)read=`<b>手順 1</b>　${polyS(A)} を ${polyS(B)} で割る<br>どちらの式も、次数の高い項から順に並べる`;
    else{const k=Math.floor((s-2)/2),cur=k?st[k-1].rem:A,d=m-1-k,qt=term(q[k],d,true);
      if(s%2===0)read=`<b>手順 ${s}</b>　最高次の項どうしを割る<br>${term(cur[k],N-k,true)} ÷ ${term(B[0],B.length-1,true)} = <b>${qt}</b>（商に書く）<br>(${polyS(B)}) × ${q[k]<0?'('+qt+')':qt} = ${polyS(st[k].prod)}`;
      else read=`<b>手順 ${s}</b>　上の式から下の式を引く<br>残りは ${polyS(st[k].rem)}`+(k===m-1?`<br>割る式より次数が低くなったので終わり<br>商 <b>${polyS(q)}</b>、余り <b>${polyS(st[k].rem)}</b>`:'');}
    return {svg:o,read};}});};

/* ---- 分数式：約分する前と後で値は等しい。ただし、もとの式の分母が 0 になる x は除く ---- */
FIGS.h2shiki_bunsu=host=>FIG.mk(host,{alt:'分数式 (x²−4)/(x²−x−2) と、約分した (x+2)/(x+1) の値をくらべるグラフ',
  sliders:[{k:'x',label:'x',min:-5,max:5,step:.25,v:1}],
  draw(v){const x=v.x,g=t=>(t+2)/(t+1),p=plot([-6,6,-5,7]).grid().seg(-1,-5,-1,7,DASH).curve(g,C,-6,-1.02).curve(g,C,-.98,6);
    const def=Math.abs(x+1)>1e-9,hole=Math.abs(x-2)<1e-9;if(def&&!hole)p.dot(x,g(x),'var(--gold)');
    const s=p.out()+`<circle cx="${f(p.sx(2))}" cy="${f(p.sy(4/3))}" r="4.5" fill="var(--bg2)" stroke="var(--${hole?'gold':'c'})" stroke-width="2"/>`;
    const pr=w=>w<0?'('+n(w,4)+')':n(w,4),num=x*x-4,den=x*x-x-2;
    const read=!def?'x = −1 のとき<br>約分する前も後も、分母が 0 になる<br>どちらの式も値をもたない':
      hole?'x = 2 のとき<br>約分する前：分子も分母も 0 になり、値をもたない<br>約分した後：(x + 2)/(x + 1) = 4/3<br>約分する前の式は、x = 2 を除いて考える':
      `x = ${n(x)} のとき<br>約分する前：(x² − 4)/(x² − x − 2) = ${pr(num)}/${pr(den)} = <b>${n(num/den,3)}</b><br>約分した後：(x + 2)/(x + 1) = ${pr(x+2)}/${pr(x+1)} = <b>${n(g(x),3)}</b>`;
    return {svg:s,read};}});

/* ---- 恒等式：x² = a(x−1)² + b(x−1) + c の両辺のグラフ。係数を合わせると重なる ---- */
FIGS.h2shiki_koutou=host=>FIG.mk(host,{alt:'y = x² のグラフと、y = a(x−1)² + b(x−1) + c のグラフが、a=1、b=2、c=1 のとき完全に重なることを示す図',
  sliders:[{k:'a',label:'a',min:0,max:2,step:.5,v:1},{k:'b',label:'b',min:-2,max:4,step:1,v:0},{k:'c',label:'c',min:-2,max:3,step:1,v:0}],
  draw(v){const {a,b,c}=v,Lf=x=>x*x,Rf=x=>a*(x-1)*(x-1)+b*(x-1)+c,p=plot([-3.6,3.6,-2.5,8.5]).grid().curve(Lf,'stroke="var(--c)" stroke-width="4.5"').curve(Rf,GOLD);
    const k2=a,k1=b-2*a,k0=a-b+c,qa=1-k2,qb=-k1,qc=-k0,z=w=>Math.abs(w)<1e-9,xs=[];
    if(!z(qa)){const D=qb*qb-4*qa*qc;if(D>1e-9)xs.push((-qb-Math.sqrt(D))/(2*qa),(-qb+Math.sqrt(D))/(2*qa));else if(D>-1e-9)xs.push(-qb/(2*qa));}else if(!z(qb))xs.push(-qc/qb);
    xs.sort((s,t)=>s-t).forEach(x=>p.dot(x,Lf(x),'var(--ink)',4));const same=z(qa)&&z(qb)&&z(qc);
    return {svg:p.out(),read:`左辺（太い線）：x²<br>右辺（金色の線）を展開：${polyS([k2,k1,k0])}<br>`+(same?'係数がすべて等しい → <b>どんな x でも成り立つ（恒等式）</b><br>2つのグラフは完全に重なる':
      `両辺が等しくなる x は <b>${xs.length} 個</b>`+(xs.length?`（x = ${xs.map(x=>n(x)).join(', ')}）`:'')+'<br>係数がちがうので、恒等式ではない')};}});

/* ---- 等式の証明：(a+b)² − (a−b)² = 4ab を面積で見る ---- */
FIGS.h2shiki_sa=host=>FIG.mk(host,{alt:'1辺 a+b の正方形を、4つの長方形 ab と、中央の1辺 a−b の正方形に分ける図',
  sliders:[{k:'a',label:'a',min:2,max:5,step:.5,v:4},{k:'b',label:'b',min:.5,max:2,step:.5,v:1.5}],
  draw(v){const {a,b}=v,u=196/(a+b),ox=72,oy=222,P=(x,y)=>[ox+x*u,oy-y*u],rc=(x0,y0,x1,y1,st)=>pg([P(x0,y0),P(x1,y0),P(x1,y1),P(x0,y1)],st);
    const RC='fill="var(--c)" fill-opacity=".3" stroke="var(--c)" stroke-width="1.5" stroke-linejoin="round"',RG='fill="var(--gold)" fill-opacity=".35" stroke="var(--gold)" stroke-width="1.5" stroke-linejoin="round"';
    let s=rc(0,0,a,b,RC)+rc(a,0,a+b,a,RC)+rc(b,a,a+b,a+b,RC)+rc(0,b,b,a+b,RC);if(a>b)s+=rc(b,b,a,a,RG);
    const lab=(x,y,t,c,fs=12)=>{const q=P(x,y);s+=T(q[0],q[1]+4,t,c,fs);};
    lab(a/2,b/2,'ab');lab(a+b/2,a/2,'ab');lab(b+a/2,a+b/2,'ab');lab(b/2,b+a/2,'ab');
    if((a-b)*u>=52)lab((a+b)/2,(a+b)/2,'(a−b)²','var(--gold)',11);
    s+=T(P(a/2,0)[0],oy+15,'a','var(--muted)')+T(P(a+b/2,0)[0],oy+15,'b','var(--muted)')+T(ox-10,P(0,b/2)[1]+4,'b','var(--muted)')+T(ox-10,P(0,b+a/2)[1]+4,'a','var(--muted)');
    return {svg:s,read:`全体の正方形 (a + b)² = ${n((a+b)**2)}<br>中央の正方形 (a − b)² = ${n((a-b)**2)}<br>差 (a + b)² − (a − b)² = <b>${n(4*a*b)}</b><br>長方形 4 つ：4ab = 4 × ${n(a)} × ${n(b)} = <b>${n(4*a*b)}</b>`};}});

/* ---- 不等式の証明：a² + b² と 2ab の差は (a−b)² ---- */
FIGS.h2shiki_heiho=host=>FIG.mk(host,{alt:'大きい方の正方形の中に、長方形 ab を2枚重ねて置き、残りが1辺 a−b の正方形になることを示す図',
  sliders:[{k:'a',label:'a',min:1,max:5,step:.5,v:4},{k:'b',label:'b',min:1,max:5,step:.5,v:2}],
  draw(v){const {a,b}=v,M=Math.max(a,b),m=Math.min(a,b),big=a>=b?'a':'b',sm=a>=b?'b':'a',u=38,ox=170-M*u/2,oy=220,P=(x,y)=>[ox+x*u,oy-y*u],rc=(x0,y0,x1,y1,st)=>pg([P(x0,y0),P(x1,y0),P(x1,y1),P(x0,y1)],st);
    const RC=k=>`fill="var(--${k})" fill-opacity=".3" stroke="var(--${k})" stroke-width="1.4" stroke-linejoin="round"`;
    let s=rc(0,0,M,m,RC('c'))+rc(0,0,m,M,RC('ok'));if(M>m)s+=rc(m,m,M,M,'fill="var(--gold)" fill-opacity=".35" stroke="var(--gold)" stroke-width="1.5" stroke-linejoin="round"');
    s+=rc(0,0,M,M,'fill="none" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"');
    const lab=(x,y,t,c,fs=12)=>{const q=P(x,y);s+=T(q[0],q[1]+4,t,c,fs);};
    lab(m/2,m/2,sm+'²');if((M-m)*u>=24){lab((m+M)/2,m/2,'ab','var(--c)');lab(m/2,(m+M)/2,'ab','var(--ok)');}if((M-m)*u>=52)lab((m+M)/2,(m+M)/2,'(a−b)²','var(--gold)',11);
    s+=T(P(M/2,0)[0],oy-M*u-7,big,'var(--muted)')+T(P(m/2,0)[0],oy+15,sm,'var(--muted)')+T(ox-10,P(0,m/2)[1]+4,sm,'var(--muted)');
    return {svg:s,read:`a² + b² = ${n(a*a)} + ${n(b*b)} = ${n(a*a+b*b)}<br>2ab = 2 × ${n(a)} × ${n(b)} = ${n(2*a*b)}<br>差 = (a − b)² = <b>${n((a-b)**2)}</b><br>`+(a===b?'a = b のとき、差は 0（等号が成り立つ）':'差は正。a² + b² の方が大きい')};}});

/* ---- なぜ：半円の中の相加平均（半径）と相乗平均（垂線） ---- */
FIGS.h2shiki_hanen=host=>FIG.mk(host,{alt:'長さ a+b の線分を直径とする半円で、半径と、直径を a と b に分ける点に立てた垂線の長さをくらべる図',
  sliders:[{k:'a',label:'a',min:1,max:9,step:.5,v:2},{k:'b',label:'b',min:1,max:9,step:.5,v:8}],
  draw(v){const {a,b}=v,u=280/(a+b),Ax=30,Bx=310,y0=204,r=140,Ox=170,Hx=Ax+a*u,h=Math.sqrt(a*b)*u,left=a<b,far=Math.abs(Hx-Ox)>=14;
    let s=`<path d="M${Ax},${y0} A${r},${r} 0 0 1 ${Bx},${y0}" stroke="var(--ink)" stroke-width="1.6" fill="none"/>`+ln(Ax,y0,Bx,y0,'stroke="var(--ink)" stroke-width="1.6"');
    s+=ln(Ax,y0,Hx,y0-h,THIND)+ln(Bx,y0,Hx,y0-h,THIND)+ln(Ox,y0,Ox,y0-r,'stroke="var(--c)" stroke-width="3"')+ln(Hx,y0,Hx,y0-h,'stroke="var(--gold)" stroke-width="3"');
    s+=`<circle cx="${Ox}" cy="${y0}" r="2.5" fill="var(--ink)"/><circle cx="${f(Hx)}" cy="${f(y0-h)}" r="3.5" fill="var(--gold)"/>`;
    s+=T(Ax-9,y0+5,'A')+T(Bx+9,y0+5,'B')+T(Hx,y0-h-9,'P')+T(Hx,y0+32,far?'H':'H（O）')+(far?T(Ox,y0+32,'O'):'');
    s+=T((Ax+Hx)/2,y0+15,'a','var(--muted)')+T((Hx+Bx)/2,y0+15,'b','var(--muted)');
    s+=T(Hx+(left?-8:8),y0-h/2+4,'√ab','var(--gold)',12,left?'end':'start')+T(Ox+(left?8:-8),y0-r+34,'(a+b)/2','var(--c)',12,left?'start':'end');
    return {svg:s,read:`a = ${n(a)}、b = ${n(b)}<br>半径 ＝ 相加平均 (a + b)/2 = <i>${n((a+b)/2)}</i><br>垂線 PH ＝ 相乗平均 √(ab) = √${n(a*b)} = <b>${n(Math.sqrt(a*b),3)}</b><br>`+(a===b?'a = b のとき、垂線は半径と重なり、長さが等しい':'垂線は半径より短い')};}});

/* ---- なぜ：面積が一定の長方形の、2辺の和 ---- */
FIGS.h2shiki_chohokei=host=>FIG.mk(host,{alt:'面積が 16 で一定の長方形の形を変えて、2辺の長さの和の変化を見る図',
  sliders:[{k:'a',label:'横の長さ a',min:2,max:8,step:.25,v:8}],play:{k:'a',from:8,to:2,label:'横を縮めていく',ms:3600},
  draw(v){const a=v.a,b=16/a,u=24,ox=68,oy=222,sq=Math.abs(a-4)<1e-9;
    let s=`<rect x="${ox}" y="${oy-4*u}" width="${4*u}" height="${4*u}" ${THIND}/>`+`<rect x="${ox}" y="${f(oy-b*u)}" width="${f(a*u)}" height="${f(b*u)}" fill="var(--${sq?'gold':'c'})" fill-opacity=".3" stroke="var(--${sq?'gold':'c'})" stroke-width="1.8"/>`;
    s+=T(ox+a*u/2,oy+15,'a = '+n(a),'var(--muted)',11)+T(ox-7,oy-b*u/2+4,'b = '+n(b),'var(--muted)',11,'end')+T(ox+a*u/2,oy-b*u/2+4,'面積 16','var(--ink)',11);
    return {svg:s,read:`a = ${n(a)}、b = 16 ÷ a = ${n(b)}<br>2辺の和 a + b = <b>${n(a+b)}</b><br>2√(ab) = 2√16 = <i>8</i>（a + b はこれより小さくならない）`+(sq?'<br>a = b = 4（正方形）のとき、和は最小の 8':'<br>点線は、同じ面積の正方形')};}});

/* ---- 放物線と x 軸。arg.mode='i' は y = x² + c（虚数単位の導入）、それ以外は y = x² + bx + c（判別式） ---- */
// x² + bx + c = 0（b, c は整数）の解を文字列にする
const sol=(b,c)=>{const D=b*b-4*c;if(D===0)return n(-b/2);const [k,m]=simp(Math.abs(D)),im=D<0?'i':'';
  if(m===1&&D>0)return n((-b-k)/2)+', '+n((-b+k)/2);
  const rad=w=>(m===1?(w===1?'':String(w)):(w===1?'':w)+'√'+m+(im?' ':''))+im;
  if(b%2===0&&k%2===0)return (b?n(-b/2)+' ± ':'±')+rad(k/2);
  return '('+(b?n(-b)+' ± ':'±')+rad(k)+') / 2';};
FIGS.h2shiki_parab=(host,arg)=>{const im=!!(arg&&arg.mode==='i');
  FIG.mk(host,{alt:im?'放物線 y = x² + c を上下に動かし、x 軸と交わらなくなると実数解がなくなることを示す図':'放物線 y = x² + bx + c と x 軸の共有点の個数を、判別式の符号とくらべる図',
  sliders:im?[{k:'c',label:'c',min:-4,max:4,step:1,v:-1}]:[{k:'b',label:'b',min:-4,max:4,step:1,v:-2},{k:'c',label:'c',min:-3,max:5,step:1,v:2}],
  play:im?{k:'c',from:-4,to:4,label:'c を大きくする',ms:3800}:undefined,
  draw(v){const b=im?0:Math.round(v.b),c=Math.round(v.c),D=b*b-4*c,F=x=>x*x+b*x+c,p=plot([-5,5,-4.5,7.5]).grid().curve(F,C);
    if(D>=0){const s=Math.sqrt(D);p.dot((-b-s)/2,0,'var(--gold)');if(D>0)p.dot((-b+s)/2,0,'var(--gold)');}
    let read;
    if(im)read=`方程式 ${polyS([1,0,c])} = 0、すなわち x² = ${n(-c)}<br>`+(c<0?`解は x = <b>${sol(0,c)}</b><br>グラフは x 軸と 2 点で交わる`:c===0?'解は x = <b>0</b><br>グラフは x 軸に接する':`2乗して ${n(-c)} になる実数はない<br>グラフは x 軸と交わらない<br>i² = −1 となる数 i を使うと x = <b>${sol(0,c)}</b>`);
    else read=`${polyS([1,b,c])} = 0<br>D = b² − 4ac = ${b<0?'('+n(b)+')':n(b)}² − 4 × 1 × ${c<0?'('+n(c)+')':n(c)} = <b>${n(D)}</b><br>`+(D>0?`D > 0：異なる2つの実数解 x = ${sol(b,c)}<br>x 軸との共有点は 2 個`:D===0?`D = 0：重解 x = ${sol(b,c)}<br>グラフは x 軸に接する`:`D < 0：異なる2つの虚数解 x = ${sol(b,c)}<br>グラフは x 軸と共有点をもたない`);
    return {svg:p.out(),read};}});};

/* ---- i の累乗：4 つの値をくり返す ---- */
FIGS.h2shiki_ipow=host=>FIG.mk(host,{alt:'i の累乗が 1、i、−1、−i の4つの値を順にくり返すことを示す図',
  sliders:[{k:'n',label:'n',min:0,max:12,step:1,v:1}],play:{k:'n',from:0,to:12,label:'i を次々にかける',ms:5400},
  draw(v){const k=Math.round(v.n),r=k%4,O=[170,124],R=82,val=['1','i','−1','−i'],pt=(a,rr=R)=>[O[0]+rr*Math.cos(a*Math.PI/180),O[1]-rr*Math.sin(a*Math.PI/180)];let s='';
    for(let q=0;q<4;q++){const a0=q*90+19,a1=q*90+71,A=pt(a0),B=pt(a1),on=k>0&&(q+1)%4===r,st=on?'var(--gold)':'var(--muted)',t=[-Math.sin(a1*Math.PI/180),-Math.cos(a1*Math.PI/180)],nr=[-t[1],t[0]];
      s+=`<path d="M${f(A[0])},${f(A[1])} A${R},${R} 0 0 0 ${f(B[0])},${f(B[1])}" fill="none" stroke="${st}" stroke-width="${on?2.2:1.3}"/>`+pg([[B[0]+t[0]*7,B[1]+t[1]*7],[B[0]+nr[0]*4.5,B[1]+nr[1]*4.5],[B[0]-nr[0]*4.5,B[1]-nr[1]*4.5]],`fill="${st}"`);
      const m=pt(q*90+45,R+19);s+=T(m[0],m[1]+4,'× i',st,11);}
    for(let q=0;q<4;q++){const c=pt(q*90),on=q===r;s+=`<circle cx="${f(c[0])}" cy="${f(c[1])}" r="20" fill="var(--bg2)"/><circle cx="${f(c[0])}" cy="${f(c[1])}" r="20" fill="var(--${on?'gold':'c'})" fill-opacity="${on?.35:.12}" stroke="var(--${on?'gold':'muted'})" stroke-width="${on?2:1.2}"/>`+T(c[0],c[1]+5,val[q],on?'var(--gold)':'var(--ink)',14,'middle',false);}
    s+=T(O[0],O[1]+5,'i'+sup(k)+' = '+val[r],'var(--ink)',14);
    return {svg:s,read:`i${sup(k)} = <b>${val[r]}</b><br>${k} を 4 で割った余りは ${r}<br>i⁴ = 1 なので、指数が 4 増えるごとに同じ値にもどる`};}});

/* ---- 解と係数の関係：2つの解 α、β を動かす ---- */
FIGS.h2shiki_kaikeisu=host=>FIG.mk(host,{alt:'放物線 y = (x−α)(x−β) の2つの解 α、β を動かして、x の係数と定数項の変化を見る図',
  sliders:[{k:'p',label:'α',min:-2.5,max:2.5,step:.5,v:-1},{k:'q',label:'β',min:-2.5,max:2.5,step:.5,v:2}],
  draw(v){const al=v.p,be=v.q,S=al+be,Pd=al*be,F=x=>(x-al)*(x-be),p=plot([-4,4,-7,7]).grid().seg(S/2,-7,S/2,7,DASH).curve(F,C).dot(0,Pd,'var(--ink)',4).dot(al,0,'var(--gold)').dot(be,0,'var(--gold)');
    const G='fill="var(--gold)" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5"',I='fill="var(--ink)" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5"';
    if(al===be)p.txt(al,0,'α = β','text-anchor="middle" dy="15" '+G);
    else{p.txt(al,0,'α',(al<be?'text-anchor="end" dx="-5"':'dx="6"')+' dy="15" '+G);p.txt(be,0,'β',(be<al?'text-anchor="end" dx="-5"':'dx="6"')+' dy="15" '+G);}
    p.txt(0,Pd,'αβ','dx="9" dy="'+(Pd>5.5?15:-6)+'" '+I);
    return {svg:p.out(),read:`${fac(al)}${fac(be)} = 0 の解は α = ${n(al)}、β = ${n(be)}<br>左辺を展開：${polyS([1,-S,Pd])} = 0<br>x の係数は ${n(-S)} → 解の和 α + β = <b>${n(S)}</b><br>定数項 → 解の積 αβ = <b>${n(Pd)}</b>`};}});

/* ---- 剰余の定理：x − a で割った余りは、グラフ上の点の高さ P(a) ---- */
FIGS.h2shiki_joyo=host=>FIG.mk(host,{alt:'3次関数 y = P(x) のグラフ上の点 (a, P(a)) の高さが、P(x) を x − a で割った余りに等しいことを示す図',
  sliders:[{k:'a',label:'a',min:-1.5,max:2.5,step:.5,v:.5}],play:{k:'a',from:-1.5,to:2.5,label:'a を動かす',ms:4400},
  draw(v){const a=v.a,P=x=>((x-2)*x-1)*x+2,q1=-2+a,q0=-1+a*q1,R=2+a*q0,z=Math.abs(R)<1e-9,dv=Math.abs(a)<1e-9?'x':`x ${sg(-a)}`,p=plot([-2.6,3.6,-5.2,4.2]).grid().curve(P,C);
    p.seg(a,0,a,R,'stroke="var(--gold)" stroke-width="3"').dot(a,0,'var(--ink)',3).dot(a,R,'var(--gold)');
    p.txt(a,R,'P(a)',(a>2?'text-anchor="end" dx="-9"':'dx="9"')+' dy="'+(R<0?12:-6)+'" fill="var(--gold)" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5"');
    return {svg:p.out(),read:`P(x) = x³ − 2x² − x + 2 を ${dv} で割る<br>商 ${polyS([1,q1,q0])}、余り <b>${n(R,3)}</b><br>P(${n(a)}) = <b>${n(R,3)}</b>（点の高さ）`+(z?`<br>余りが 0 → ${dv} は P(x) の因数`:'<br>余りと P(a) は、いつも等しい')};}});

/* ---- 高次方程式：(x+1)(x²−2x+c) = 0 の実数解と、グラフと x 軸の共有点 ---- */
FIGS.h2shiki_kouji=host=>FIG.mk(host,{alt:'3次関数 y = (x+1)(x²−2x+c) のグラフと x 軸の共有点の個数が、c の値によって 3 個、2 個、1 個と変わる図',
  sliders:[{k:'c',label:'c',min:-2,max:4,step:.5,v:-1}],play:{k:'c',from:-2,to:4,label:'c を大きくする',ms:4400},
  draw(v){const c=v.c,d=1-c,F=x=>(x+1)*(x*x-2*x+c),p=plot([-3,4,-8.2,8.2]).grid().curve(F,C).dot(-1,0,'var(--gold)');let t;
    if(d>1e-9){const s=Math.sqrt(d),nice=Math.abs(s-Math.round(s))<1e-9;p.dot(1-s,0,'var(--gold)').dot(1+s,0,'var(--gold)');
      t=`x = −1 と、x = `+(nice?`${n(1-s)}, ${n(1+s)}`:`1 ± √${n(d)}（約 ${n(1-s)} と ${n(1+s)}）`)+'<br>実数解は <b>3 個</b>。x 軸との共有点も 3 個';}
    else if(d>-1e-9){p.dot(1,0,'var(--gold)');t='x = −1 と、重解 x = 1<br>実数解は <b>2 個</b>。x = 1 でグラフは x 軸に接する';}
    else t=`x = −1 と、x = 1 ± ${Math.abs(d+1)<1e-9?'':'√'+n(-d)+' '}i<br>実数解は <b>1 個</b>。x 軸との共有点も 1 個<br>虚数解 2 個は、グラフには現れない`;
    return {svg:p.out(),read:`(x + 1)(${polyS([1,-2,c])}) = 0<br>`+t};}});
})();
