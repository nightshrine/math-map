/* 数学B「統計的な推測」の図（FIGS.hbtokei_*）。乱数を使う図は、種を固定した擬似乱数なので、同じ操作で同じ結果になる */
(function(){
const {plot,draw,n,sg,C,GOLD,DASH}=FIG;
const f=v=>v.toFixed(1);
// 文字（線に重なっても読めるよう、地の色でふちどる）
const tx=(d,x,y,t,c='var(--ink)',s=11,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3" stroke-linejoin="round">${t}</text>`);
const rect=(d,x,y,w,h,st)=>d.raw(`<rect x="${f(x)}" y="${f(y)}" width="${f(Math.max(0,w))}" height="${f(Math.max(0,h))}" ${st}/>`);
const AX='stroke="var(--muted)" stroke-width="1.2"';
const TS='paint-order="stroke" stroke="var(--bg2)" stroke-width="3"';
const par=(x,d=3)=>x<0?`(${n(x,d)})`:n(x,d);
const gcd=(a,b)=>b?gcd(b,a%b):a;
const frac=(a,b)=>{const g=gcd(a,b);return b/g===1?String(a/g):`${a/g}/${b/g}`;};
// 標準正規分布の密度と、P(0 ≤ Z ≤ z)（シンプソンの公式で数値積分）
const phi=z=>Math.exp(-z*z/2)/Math.sqrt(2*Math.PI);
const pz=z=>{const N=400,h=z/N;let s=phi(0)+phi(z);for(let i=1;i<N;i++)s+=phi(i*h)*(i%2?4:2);return s*h/3;};
// 二項分布 B(N, p) の確率 P(X = 0), …, P(X = N)
const binom=(N,p)=>{const q=1-p,P=[Math.pow(q,N)];for(let r=0;r<N;r++)P.push(P[r]*(N-r)/(r+1)*p/q);return P;};
// 擬似乱数（mulberry32）。種 seed が同じなら、同じ数の列を返す
function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}

/* ---- 確率分布：2 個のさいころの目の和 ---- */
FIGS.hbtokei_bunpu=host=>FIG.mk(host,{alt:'2 個のさいころの目の和の確率分布を棒グラフで表し、ある範囲の確率を棒の高さの合計として示す図',
  sliders:[{k:'a',label:'a（範囲の下の端）',min:2,max:12,step:1,v:5},{k:'b',label:'b（範囲の上の端）',min:2,max:12,step:1,v:8}],
  draw(v){const d=draw(),B=200,T=44,X=k=>30+(k-2)*28,cs=[];let tot=0;
    d.line(14,B,326,B,AX);
    for(let k=2;k<=12;k++){const c=6-Math.abs(k-7),on=k>=v.a&&k<=v.b,h=c/6*(B-T);if(on){cs.push(c);tot+=c;}
      rect(d,X(k)-10,B-h,20,h,on?'fill="var(--gold)" fill-opacity=".8"':'fill="var(--c)" fill-opacity=".4"');
      tx(d,X(k),B-h-6,c+'/36',on?'var(--gold)':'var(--muted)',9.5);tx(d,X(k),B+15,String(k),on?'var(--gold)':'var(--muted)');}
    tx(d,326,B+32,'X の値','var(--muted)',10,'end');
    const red=frac(tot,36),tail=`${tot}/36`+(red!==`${tot}/36`?` = ${red}`:'');
    return {svg:d.out(),read:'X：2 個のさいころの目の和<br>棒の高さが、その値をとる確率<br>'+(v.a>v.b?'a > b なので、あてはまる値はない<br>確率は <b>0</b>':
      v.a===v.b?`P(X = ${v.a}) = <b>${tail}</b>`:`P(${v.a} ≤ X ≤ ${v.b})<br>= (${cs.join(' + ')})/36 = <b>${tail}</b><br>≈ ${n(tot/36,3)}`)};}});

/* ---- 期待値と標準偏差：分布の中心と散らばり ---- */
const KD=[{name:'山形',w:[1,4,6,4,1]},{name:'中央に集中',w:[0,4,8,4,0]},{name:'両端に分かれる',w:[8,0,0,0,8]},{name:'左に寄る',w:[8,4,2,1,1]},{name:'右に寄る',w:[1,1,2,4,8]}];
const kitai=m=>{const w=KD[m-1].w;let e=0,e2=0;w.forEach((c,i)=>{e+=(i+1)*c/16;e2+=(i+1)*(i+1)*c/16;});return {w,e,e2,V:e2-e*e,sd:Math.sqrt(e2-e*e)};};
FIGS.hbtokei_kitai=host=>FIG.mk(host,{alt:'確率分布の棒グラフに、期待値の位置と、期待値から標準偏差だけ離れた範囲を重ねた図',
  sliders:[{k:'m',label:'分布の形',min:1,max:5,step:1,v:1,fmt:m=>KD[m-1].name}],
  draw(v){const {w,e,e2,V,sd}=kitai(v.m),d=draw(),B=172,T=40,X=x=>50+(x-1)*60;
    d.line(14,B,326,B,AX);
    w.forEach((c,i)=>{const h=c/8*(B-T);rect(d,X(i+1)-17,B-h,34,h,'fill="var(--c)" fill-opacity=".5"');if(c)tx(d,X(i+1),B-h-6,c+'/16','var(--ink)',10);tx(d,X(i+1),B+15,String(i+1),'var(--muted)');});
    d.poly([[X(e),B+21],[X(e)-7,B+33],[X(e)+7,B+33]],'fill="var(--gold)"');
    d.line(X(e-sd),B+41,X(e+sd),B+41,'stroke="var(--gold)" stroke-width="3" stroke-linecap="round"');
    tx(d,170,B+60,'▲：期待値 m　線：m − σ から m + σ まで','var(--muted)',10);
    const ts=w.map((c,i)=>c?`${i+1}×${c}`:'').filter(Boolean).join(' + ');
    return {svg:d.out(),read:`E(X) = (${ts})/16<br>= <b>${n(e,4)}</b><br>E(X²) = ${n(e2,4)}<br>V(X) = E(X²) − {E(X)}² = ${n(V,4)}<br>σ(X) = √V(X) = <b>${n(sd,3)}</b>`};}});
FIGS.hbtokei_kitai.sim=kitai;

/* ---- 確率変数の変換：Y = aX + b ---- */
FIGS.hbtokei_henkan=host=>FIG.mk(host,{alt:'確率変数 X の分布と、Y = aX + b の分布を上下に並べ、期待値と標準偏差の変わり方を示す図',
  sliders:[{k:'a',label:'a',min:-1,max:2,step:.5,v:2},{k:'b',label:'b',min:-3,max:3,step:1,v:1}],
  draw(v){const a=v.a,b=v.b,w=[1,4,6,4,1],d=draw(),X=t=>20+(t+9)/23*300,B1=92,B2=206,H=56;
    const axis=B=>{d.line(14,B,326,B,AX);for(let t=-9;t<=14;t++){d.line(X(t),B,X(t),B+(t%5?3:6),AX);if(t%5===0)tx(d,X(t),B+30,n(t),'var(--muted)',10);}};
    const mark=(B,m,s,col)=>{d.poly([[X(m),B+2],[X(m)-5,B+12],[X(m)+5,B+12]],`fill="${col}"`);if(s>0)d.line(X(m-s),B+17,X(m+s),B+17,`stroke="${col}" stroke-width="3" stroke-linecap="round"`);};
    axis(B1);axis(B2);
    w.forEach((c,i)=>{const h=c/6*H;rect(d,X(i+1)-4.5,B1-h,9,h,'fill="var(--c)" fill-opacity=".75"');});
    mark(B1,3,1,'var(--c)');
    if(a===0)rect(d,X(b)-4.5,B2-H,9,H,'fill="var(--gold)" fill-opacity=".85"');
    else{const bw=Math.max(3,Math.min(9,Math.abs(a)*9));w.forEach((c,i)=>{const h=c/6*H;rect(d,X(a*(i+1)+b)-bw/2,B2-h,bw,h,'fill="var(--gold)" fill-opacity=".85"');});}
    mark(B2,3*a+b,Math.abs(a),'var(--gold)');
    const fy=(a===1?'X':a===-1?'−X':a===0?'0·X':n(a)+'X')+(b?' '+sg(b):'');
    tx(d,18,24,'X','var(--c)',12,'start');tx(d,18,138,'Y = '+fy,'var(--gold)',12,'start');
    return {svg:d.out(),read:`Y = ${fy}<br>E(Y) = ${n(a)} × 3 ${sg(b)} = <b>${n(3*a+b)}</b>（E(X) = 3）<br>σ(Y) = |${n(a)}| × 1 = <b>${n(Math.abs(a))}</b>（σ(X) = 1）<br>V(Y) = ${par(a)}² × 1 = ${n(a*a)}<br>b は分布をずらすだけで、散らばりを変えない`};}});

/* ---- 同時分布：2 個のさいころの目 X, Y と、和 X + Y ---- */
FIGS.hbtokei_wa=host=>FIG.mk(host,{alt:'2 個のさいころの目 X, Y の同時分布を 6×6 のマスで表し、和が同じになるマスに色をつけた図',
  sliders:[{k:'s',label:'X + Y の値',min:2,max:12,step:1,v:7}],play:{k:'s',from:2,to:12,label:'和を 2 から 12 まで動かす',ms:4400},
  draw(v){const d=draw(),u=30,x0=98,y0=38;let c=0;
    for(let i=1;i<=6;i++){tx(d,x0+(i-.5)*u,y0-7,String(i),'var(--muted)');tx(d,x0-11,y0+(i-.5)*u+4,String(i),'var(--muted)');
      for(let j=1;j<=6;j++){const on=i+j===v.s;if(on)c++;rect(d,x0+(i-1)*u,y0+(j-1)*u,u,u,(on?'fill="var(--gold)" fill-opacity=".7"':'fill="var(--c)" fill-opacity=".2"')+' stroke="var(--bg2)" stroke-width="1.5"');
        tx(d,x0+(i-.5)*u,y0+(j-.5)*u+4,String(i+j),on?'var(--ink)':'var(--muted)',10.5);}}
    tx(d,x0+3*u,16,'X','var(--ink)',12);tx(d,x0-30,y0+3*u+4,'Y','var(--ink)',12);
    tx(d,170,238,'横：X の値　縦：Y の値　マスの数：X + Y','var(--muted)',10);
    return {svg:d.out(),read:`マス 1 つの確率は 1/6 × 1/6 = 1/36<br>X + Y = ${v.s} となるマスは ${c} 個<br>P(X + Y = ${v.s}) = <b>${c}/36</b><br>E(X + Y) = E(X) + E(Y) = 3.5 + 3.5 = 7`};}});

/* ---- 二項分布 ---- */
FIGS.hbtokei_nikou=host=>FIG.mk(host,{alt:'二項分布 B(n, p) の棒グラフ。n と p を変えると、山の位置と広がりが変わる',
  sliders:[{k:'n',label:'n（試行の回数）',min:1,max:40,step:1,v:10},{k:'p',label:'p（1 回で起こる確率）',min:.1,max:.9,step:.1,v:.5}],
  draw(v){const N=v.n,p=v.p,P=binom(N,p),mx=Math.max(...P),d=draw(),B=184,T=40,cw=300/(N+1),X=r=>20+(r+.5)*cw,m=N*p,V=N*p*(1-p),sd=Math.sqrt(V),st=N<=12?1:N<=24?2:5,modes=[];
    d.line(14,B,326,B,AX);
    P.forEach((y,r)=>{const h=y/mx*(B-T),top=mx-y<1e-12,g=cw>8?1:.4;if(top)modes.push(r);rect(d,X(r)-cw/2+g,B-h,cw-2*g,h,`fill="var(--${top?'gold':'c'})" fill-opacity="${top?.8:.5}"`);if(r%st===0)tx(d,X(r),B+15,String(r),'var(--muted)',10);});
    tx(d,X((modes[0]+modes[modes.length-1])/2),T-6,n(mx,3),'var(--gold)',10);
    d.poly([[X(m),B+21],[X(m)-6,B+32],[X(m)+6,B+32]],'fill="var(--gold)"');
    d.line(X(Math.max(-.5,m-sd)),B+39,X(Math.min(N+.5,m+sd)),B+39,'stroke="var(--gold)" stroke-width="3" stroke-linecap="round"');
    tx(d,170,B+57,'▲：期待値 np　線：np − σ から np + σ まで','var(--muted)',10);
    return {svg:d.out(),read:`X は二項分布 B(${N}, ${n(p)}) に従う<br>E(X) = np = ${N} × ${n(p)} = <b>${n(m)}</b><br>V(X) = np(1 − p) = ${n(V,3)}<br>σ(X) = ${n(sd,3)}<br>最も起こりやすい値：X = ${modes.join(', ')}（確率 ${n(mx,3)}）`};}});

/* ---- 正規分布：分布曲線と面積 ---- */
FIGS.hbtokei_seiki=host=>FIG.mk(host,{alt:'正規分布の分布曲線と、平均から標準偏差の何倍か以内の範囲の面積を示す図',
  sliders:[{k:'m',label:'平均 m',min:40,max:60,step:5,v:50},{k:'s',label:'標準偏差 σ',min:4,max:12,step:1,v:10},{k:'k',label:'範囲 m ± kσ の k',min:1,max:3,step:1,v:1}],
  draw(v){const m=v.m,s=v.s,k=v.k,g=x=>phi((x-m)/s)/s,P=plot([-4,104,-.018,.108]);
    P.under(g,m-k*s,m+k*s,'fill="var(--gold)" fill-opacity=".45"').seg(-4,0,104,0,AX);
    for(let t=0;t<=100;t+=10)P.seg(t,0,t,-.003,AX).txt(t,0,String(t),'text-anchor="middle" dy="18"');
    P.curve(g,C).seg(m,0,m,g(m),DASH).seg(m-k*s,0,m-k*s,g(m-k*s),GOLD).seg(m+k*s,0,m+k*s,g(m+k*s),GOLD);
    P.txt(m,g(m),'m','text-anchor="middle" dy="-7" fill="var(--ink)" '+TS);
    return {svg:P.out(),read:`X は正規分布 N(${m}, ${s}²) に従う<br>${m-k*s} ≤ X ≤ ${m+k*s}（m ± ${k===1?'':k}σ の範囲）<br>色をつけた部分の面積 = 確率<br>= <b>${n(2*pz(k),4)}</b><br>m や σ を変えても、この値は変わらない`};}});

/* ---- 標準化：X の範囲を Z の範囲に写す ---- */
FIGS.hbtokei_hyoujunka=host=>FIG.mk(host,{h:330,alt:'正規分布 N(50, σ²) に従う X の範囲と、標準化した Z の範囲を上下に並べ、面積が等しいことを示す図',
  sliders:[{k:'s',label:'標準偏差 σ',min:5,max:20,step:5,v:10},{k:'x',label:'x',min:20,max:80,step:1,v:65}],
  draw(v){const s=v.s,x=v.x,z=(x-50)/s,g=t=>phi((t-50)/s)/s,A=plot([10,90,-.02,.09],340,150),Bp=plot([-4,4,-.1,.45],340,150),zc=Math.max(-4,Math.min(4,z)),SH='fill="var(--gold)" fill-opacity=".5"';
    A.under(g,Math.min(50,x),Math.max(50,x),SH).seg(10,0,90,0,AX);
    for(let t=20;t<=80;t+=10)A.seg(t,0,t,-.003,AX).txt(t,0,String(t),'text-anchor="middle" dy="17"');
    A.curve(g,C).seg(50,0,50,g(50),DASH).seg(x,0,x,g(x),GOLD);
    Bp.under(phi,Math.min(0,zc),Math.max(0,zc),SH).seg(-4,0,4,0,AX);
    for(let t=-3;t<=3;t++)Bp.seg(t,0,t,-.014,AX).txt(t,0,n(t),'text-anchor="middle" dy="17"');
    Bp.curve(phi,C).seg(0,0,0,phi(0),DASH).seg(zc,0,zc,phi(zc),GOLD);
    const cap=t=>`<text x="8" y="16" font-size="11" font-family="var(--f-mono)" fill="var(--ink)">${t}</text>`;
    const svg=`<svg x="0" y="0" width="340" height="150" viewBox="0 0 340 150">${A.out()}${cap(`X：N(50, ${s}²)`)}</svg>`+
      `<text x="170" y="169" font-size="11" font-family="var(--f-mono)" fill="var(--gold)" text-anchor="middle">↓　z = (x − 50) ÷ σ</text>`+
      `<svg x="0" y="180" width="340" height="150" viewBox="0 0 340 150">${Bp.out()}${cap('Z：N(0, 1)')}</svg>`;
    const eq=Math.abs(z*100-Math.round(z*100))<1e-9?'=':'≈',zs=n(z,2),p=n(Math.abs(pz(z)),4);
    return {svg,read:`X は N(50, ${s}²) に従う<br>z = (${x} − 50) ÷ ${s} ${eq} <b>${zs}</b><br>`+
      (x>50?`P(50 ≤ X ≤ ${x}) = P(0 ≤ Z ≤ ${zs})<br>= <b>${p}</b><br>上と下で、色をつけた部分の面積は等しい`:x<50?`P(${x} ≤ X ≤ 50) = P(${zs} ≤ Z ≤ 0)<br>= <b>${p}</b><br>上と下で、色をつけた部分の面積は等しい`:'x = 50 は平均。Z では 0 にあたる')};}});

/* ---- なぜ：二項分布の棒グラフに、平均と標準偏差が同じ正規分布の曲線を重ねる ---- */
const KN=[5,10,20,50,100,200,400];
const kinji=(N,p)=>{const P=binom(N,p),m=N*p,sd=Math.sqrt(N*p*(1-p)),g=r=>phi((r-m)/sd)/sd;let e=0;P.forEach((y,r)=>{e=Math.max(e,Math.abs(y-g(r)));});return {P,m,sd,g,err:e/g(m)*100};};
FIGS.hbtokei_kinji=host=>FIG.mk(host,{alt:'二項分布 B(n, p) の棒グラフに、平均と標準偏差が同じ正規分布の曲線を重ねた図。n を大きくすると、棒が曲線に重なっていく',
  sliders:[{k:'i',label:'n',min:0,max:6,step:1,v:1,fmt:i=>String(KN[i])},{k:'p',label:'p',min:.1,max:.5,step:.1,v:.2}],play:{k:'i',from:0,to:6,label:'n を大きくしていく',ms:5000},
  draw(v){const N=KN[v.i],p=v.p,{P,m,sd,g,err}=kinji(N,p),d=draw(),B=196,T=34,cw=150/(4*sd),X=r=>170+(r-m)*cw,top=Math.max(g(m),...P)*1.04,Y=y=>B-y/top*(B-T),gap=cw>6?1:.3;
    const st=[1,2,5,10,20,50].find(q=>q*cw>=30)||50;
    d.line(14,B,326,B,AX);
    P.forEach((y,r)=>{const x=X(r);if(x<14-cw/2||x>326+cw/2)return;rect(d,x-cw/2+gap,Y(y),cw-2*gap,B-Y(y),'fill="var(--c)" fill-opacity=".55"');if(r%st===0&&x>20&&x<320)tx(d,x,B+15,String(r),'var(--muted)',10);});
    let path='';for(let i=0;i<=160;i++){const r=m-4*sd+8*sd*i/160;path+=(i?'L':'M')+f(X(r))+','+f(Y(g(r)));}
    d.path(path,'fill="none" stroke="var(--gold)" stroke-width="2"');
    tx(d,326,B+32,'起こる回数 r','var(--muted)',10,'end');
    return {svg:d.out(),read:`棒：二項分布 B(${N}, ${n(p)})<br>期待値 np = ${n(m)}、標準偏差 σ = ${n(sd,2)}<br><b>曲線</b>：正規分布 N(${n(m)}, ${n(sd,2)}²)<br>棒と曲線の高さのずれは、最大でも<br>山の高さの <b>${n(err,1)}%</b>`};}});
FIGS.hbtokei_kinji.sim=(i,p)=>kinji(KN[i],p).err;

/* ---- 母集団と標本：札 40 枚（1 が 16 枚、2 が 12 枚、3 が 8 枚、4 が 4 枚）から復元抽出する ---- */
const chu=(N,r)=>{const g=rng(Math.imul(N,73856093)^Math.imul(r,19349663)^0x5bd1e99a),a=[];g();g();for(let i=0;i<N;i++){const t=Math.floor(g()*40);a.push(t<16?1:t<28?2:t<36?3:4);}return a;};
FIGS.hbtokei_chushutsu=host=>FIG.mk(host,{alt:'母集団分布の棒グラフと、そこから無作為に抽出した標本の相対度数の棒グラフを並べた図',
  sliders:[{k:'n',label:'標本の大きさ n',min:5,max:25,step:5,v:10},{k:'r',label:'抽出のやり直し（何回目か）',min:1,max:10,step:1,v:1}],
  draw(v){const s=chu(v.n,v.r),d=draw(),B=184,X=k=>62+(k-1)*72,cnt=[0,0,0,0],pop=[.4,.3,.2,.1],sc=150;s.forEach(x=>cnt[x-1]++);const xb=s.reduce((p,c)=>p+c,0)/v.n;
    d.line(14,B,326,B,AX);
    for(let k=1;k<=4;k++){const hp=pop[k-1]*sc,hs=cnt[k-1]/v.n*sc;
      rect(d,X(k)-26,B-hp,25,hp,'fill="var(--c)" fill-opacity=".5"');rect(d,X(k)+1,B-hs,25,hs,'fill="var(--gold)" fill-opacity=".7"');
      tx(d,X(k)-14,B-hp-6,String(pop[k-1]),'var(--c)',10);tx(d,X(k)+14,B-hs-6,cnt[k-1]+'/'+v.n,'var(--gold)',10);tx(d,X(k),B+15,String(k),'var(--muted)');}
    d.poly([[X(2),B+20],[X(2)-6,B+30],[X(2)+6,B+30]],'fill="var(--ink)"');d.poly([[X(xb),B+33],[X(xb)-6,B+43],[X(xb)+6,B+43]],'fill="var(--gold)"');
    tx(d,326,22,'左の棒：母集団分布','var(--c)',10,'end');tx(d,326,37,'右の棒：標本での割合','var(--gold)',10,'end');
    tx(d,170,B+59,'上の ▲：母平均 2　下の ▲：標本平均','var(--muted)',10);
    return {svg:d.out(),read:`母集団：札 40 枚<br>（1 が 16 枚、2 が 12 枚、3 が 8 枚、4 が 4 枚）<br>母平均 2、母標準偏差 1<br>標本（大きさ ${v.n}）：${s.join(' ')}<br>標本平均 = <b>${n(xb,2)}</b>`};}});
FIGS.hbtokei_chushutsu.sim=chu;

/* ---- なぜ：さいころを n 回投げた平均を 1000 回分集める ---- */
const DS=Math.sqrt(35/12),rc={};
const rootn=(i,r)=>{const key=i+'-'+r;if(rc[key])return rc[key];const N=2**i,g=rng(4409+i*7919+r*104729),ms=[];let sm=0,sq=0;
  for(let t=0;t<1000;t++){let s=0;for(let j=0;j<N;j++)s+=1+Math.floor(g()*6);const m=s/N;ms.push(m);sm+=m;sq+=m*m;}
  const mean=sm/1000;return rc[key]={ms,mean,sd:Math.sqrt(sq/1000-mean*mean)};};
FIGS.hbtokei_rootn=host=>FIG.mk(host,{alt:'さいころを n 回投げて出た目の平均を 1000 回分集めたヒストグラム。n を大きくすると、平均は 3.5 のまわりに集まる',
  sliders:[{k:'i',label:'標本の大きさ n',min:0,max:5,step:1,v:0,fmt:i=>String(2**i)},{k:'r',label:'実験のやり直し（何回目か）',min:1,max:5,step:1,v:1}],play:{k:'i',from:0,to:5,label:'n を大きくしていく',ms:4800},
  draw(v){const N=2**v.i,{ms,mean,sd}=rootn(v.i,v.r),th=DS/Math.sqrt(N),d=draw(),B=184,T=40,X=x=>30+(x-1)*56,bins={};let mx=0;
    ms.forEach(m=>{const b=Math.round(m*4);bins[b]=(bins[b]||0)+1;});Object.keys(bins).forEach(b=>{mx=Math.max(mx,bins[b]);});
    d.line(14,B,326,B,AX);for(let k=1;k<=6;k++){d.line(X(k),B,X(k),B+5,AX);tx(d,X(k),B+18,String(k),'var(--muted)');}
    Object.keys(bins).forEach(b=>{const h=bins[b]/mx*(B-T);rect(d,X(b/4)-6,B-h,12,h,'fill="var(--c)" fill-opacity=".6"');});
    d.line(X(3.5),T-10,X(3.5),B,DASH);tx(d,X(3.5),T-14,'母平均 3.5','var(--muted)',10);
    d.line(X(3.5-th),B+31,X(3.5+th),B+31,'stroke="var(--gold)" stroke-width="3" stroke-linecap="round"');
    tx(d,170,B+50,'線：3.5 − σ/√n から 3.5 + σ/√n まで','var(--muted)',10);tx(d,16,22,'縦：回数','var(--muted)',10,'start');
    return {svg:d.out(),read:`さいころを ${N} 回投げ、出た目の平均をとる<br>これを 1000 回くり返した<br>平均 1000 個の平均 ${n(mean,3)}<br>平均 1000 個の標準偏差 <b>${n(sd,3)}</b><br>σ/√n = 1.708 ÷ √${N} = <i>${n(th,3)}</i>`};}});
FIGS.hbtokei_rootn.sim=(i,r)=>{const q=rootn(i,r);return {mean:q.mean,sd:q.sd};};

/* ---- 標本平均の分布：標本を大きくすると、母平均のまわりに集まる ---- */
FIGS.hbtokei_heikin=host=>FIG.mk(host,{alt:'母集団の分布曲線と、標本平均の分布曲線を重ねた図。標本を大きくすると、標本平均の分布は母平均のまわりに集まる',
  sliders:[{k:'i',label:'標本の大きさ n',min:1,max:10,step:1,v:2,fmt:i=>String(i*i)},{k:'c',label:'c（50 ± c の範囲を見る）',min:1,max:5,step:1,v:2}],play:{k:'i',from:1,to:10,label:'n を大きくしていく',ms:4000},
  draw(v){const N=v.i*v.i,s=10/v.i,c=v.c,g=x=>phi((x-50)/s)/s,g0=x=>phi((x-50)/10)/10,P=plot([20,80,-.06,.43]);
    P.under(g,50-c,50+c,'fill="var(--gold)" fill-opacity=".5"').seg(20,0,80,0,AX);
    for(let t=20;t<=80;t+=10)P.seg(t,0,t,-.008,AX).txt(t,0,String(t),'text-anchor="'+(t===20?'start':t===80?'end':'middle')+'" dy="18"');
    P.curve(g0,DASH).curve(g,C).txt(21,.4,'点線：母集団の分布',TS).txt(21,.365,'実線：標本平均の分布','fill="var(--c)" '+TS);
    return {svg:P.out(),read:`母集団 N(50, 10²)、標本の大きさ ${N}<br>標本平均の標準偏差<br>= 10 ÷ √${N} = <b>${n(s,3)}</b><br>標本平均が ${50-c} 以上 ${50+c} 以下になる確率<br>= <b>${n(2*pz(c/s),4)}</b>`};}});

/* ---- 信頼区間を 100 回作る ---- */
const KS=[25,100,400],KZ=[1.96,2.58],kc={};
const kukan=(j,r)=>{const key=j+'-'+r;if(kc[key])return kc[key];const N=KS[j],g=rng(90001+j*15485863+r*32452843),ms=[];let spare=null;
  const gauss=()=>{if(spare!==null){const t=spare;spare=null;return t;}const u=Math.sqrt(-2*Math.log(1-g())),w=2*Math.PI*g();spare=u*Math.sin(w);return u*Math.cos(w);};
  for(let t=0;t<100;t++){let s=0;for(let i=0;i<N;i++)s+=gauss();ms.push(50+10*s/N);}return kc[key]=ms;};
const kcount=(j,c,r)=>{const hw=KZ[c]*10/Math.sqrt(KS[j]);return kukan(j,r).filter(m=>Math.abs(m-50)<=hw).length;};
FIGS.hbtokei_kukan=host=>FIG.mk(host,{alt:'標本をとって信頼区間を作ることを 100 回くり返し、区間を縦の線分で並べた図。母平均を含まない区間には別の色をつけている',
  sliders:[{k:'j',label:'標本の大きさ n',min:0,max:2,step:1,v:1,fmt:j=>String(KS[j])},{k:'c',label:'信頼度',min:0,max:1,step:1,v:0,fmt:c=>['95%','99%'][c]},{k:'r',label:'実験のやり直し（何回目か）',min:1,max:10,step:1,v:1}],
  draw(v){const N=KS[v.j],z=KZ[v.c],hw=z*10/Math.sqrt(N),ms=kukan(v.j,v.r),d=draw(),Y=y=>122-(y-50)*8.2,X=t=>36+t*2.9;let k=0;
    [40,45,50,55,60].forEach(y=>{d.line(32,Y(y),326,Y(y),y===50?'stroke="var(--ink)" stroke-width="1.4"':'stroke="var(--line)" stroke-width=".8"');tx(d,28,Y(y)+4,String(y),y===50?'var(--ink)':'var(--muted)',10,'end');});
    ms.forEach((m,t)=>{const ok=Math.abs(m-50)<=hw;if(ok)k++;d.line(X(t),Y(m-hw),X(t),Y(m+hw),ok?'stroke="var(--c)" stroke-width="1.5" opacity=".85"':'stroke="var(--ng)" stroke-width="2.4"');d.dot(X(t),Y(m),ok?'var(--c)':'var(--ng)',1.4);});
    tx(d,326,243,'線分 1 本が、1 回の標本調査で作った信頼区間','var(--muted)',10,'end');
    return {svg:d.out(),read:`母集団 N(50, 10²)、標本の大きさ ${N}<br>信頼度 ${['95','99'][v.c]}% の信頼区間を 100 回作った<br>区間の幅 = 2 × ${z} × 10 ÷ √${N} = ${n(2*hw,2)}<br>母平均 50 を含む区間 <b>${k} 本</b><br>含まない区間（赤）${100-k} 本`};}});
FIGS.hbtokei_kukan.sim=kcount;

/* ---- 仮説検定：棄却域 ---- */
const KC=[[1.96,2.58],[1.64,2.33]];   // [両側, 片側] × [5%, 1%]
FIGS.hbtokei_kikyaku=host=>FIG.mk(host,{alt:'標準正規分布の分布曲線と、有意水準に応じた棄却域を示す図',
  sliders:[{k:'t',label:'検定の種類',min:1,max:2,step:1,v:1,fmt:t=>['両側検定','片側検定（右側）'][t-1]},{k:'a',label:'有意水準',min:0,max:1,step:1,v:0,fmt:a=>['5%','1%'][a]},{k:'z',label:'z（標本から求めた値）',min:-3.5,max:3.5,step:.05,v:2.2}],
  draw(v){const cv=KC[v.t-1][v.a],z=v.z,P=plot([-4,4,-.09,.45]),NG='fill="var(--ng)" fill-opacity=".55"',NL='stroke="var(--ng)" stroke-width="1.5"',two=v.t===1;
    P.under(phi,cv,4,NG);if(two)P.under(phi,-4,-cv,NG);
    P.seg(-4,0,4,0,AX);for(let t=-3;t<=3;t++)P.seg(t,0,t,-.012,AX).txt(t,0,n(t),'text-anchor="middle" dy="18"');
    P.curve(phi,C).seg(cv,0,cv,phi(cv),NL).txt(cv,0,n(cv),'text-anchor="middle" dy="33" fill="var(--ng)" '+TS).txt(3.9,.19,'棄却域','text-anchor="end" fill="var(--ng)" '+TS);
    if(two)P.seg(-cv,0,-cv,phi(cv),NL).txt(-cv,0,n(-cv),'text-anchor="middle" dy="33" fill="var(--ng)" '+TS).txt(-3.9,.19,'棄却域','fill="var(--ng)" '+TS);
    P.seg(z,0,z,.32,GOLD).dot(z,0,'var(--gold)').txt(z,.32,'z = '+n(z),'text-anchor="'+(z>2.7?'end':z<-2.7?'start':'middle')+'" dy="-6" fill="var(--gold)" '+TS);
    const rej=two?Math.abs(z)>=cv:z>=cv;
    return {svg:P.out(),read:`帰無仮説が正しいとき、Z は N(0, 1) に従う<br>有意水準 ${['5','1'][v.a]}%、${two?'両側検定':'片側検定'}<br>棄却域：${two?`Z ≤ ${n(-cv)}、${cv} ≤ Z`:`${cv} ≤ Z`}<br>z = ${n(z)} は棄却域に`+(rej?'<b>入る</b><br>帰無仮説を棄却する':'<b>入らない</b><br>帰無仮説を棄却できない')};}});

/* ---- 問題に付ける図（動かさない）：標準正規分布で、a から b までの面積に色をつける。端がないときは null ---- */
FIGS.hbtokei_men=(host,o)=>FIG.mk(host,{h:170,alt:o.alt||'標準正規分布の分布曲線で、求める確率にあたる部分に色をつけた図',sliders:[],
  draw(){const P=plot([-4,4,-.1,.45],340,170),a=o.a===null?-4:o.a,b=o.b===null?4:o.b;
    P.under(phi,a,b,'fill="var(--gold)" fill-opacity=".5"').seg(-4,0,4,0,AX).curve(phi,C).seg(0,0,0,phi(0),DASH).txt(0,0,'0','text-anchor="middle" dy="17"');
    [[o.a,o.la],[o.b,o.lb]].forEach(q=>{if(q[0]===null)return;P.seg(q[0],0,q[0],phi(q[0]),GOLD);if(q[0]!==0)P.txt(q[0],0,q[1]||n(q[0]),'text-anchor="middle" dy="17" fill="var(--gold)" '+TS);});
    P.txt(3.9,.4,o.axis||'Z','text-anchor="end" fill="var(--ink)"');
    return {svg:P.out(),read:o.cap};}});
})();
