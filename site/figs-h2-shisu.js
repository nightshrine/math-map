/* 数学II「指数関数と対数関数」の図。名前は h2shisu_ で始める */
(function(){
const {plot,draw,n,sg,C,GOLD,DASH}=FIG;
const f1=v=>v.toFixed(1);
const THIN='stroke="var(--muted)" stroke-width="1" fill="none"';
// 文字。a は text-anchor、c は色（属性を重ねないように、ここで1回だけ書く）
const T=(x,y,s,o={})=>`<text x="${f1(x)}" y="${f1(y)}" font-size="${o.fs||11}" font-family="var(--f-mono)" fill="${o.c||'var(--ink)'}" text-anchor="${o.a||'middle'}">${s}</text>`;
const L=(x1,y1,x2,y2,st)=>`<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" ${st}/>`;
const dot=(x,y,c,r=4.5)=>`<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${c}" stroke="var(--bg2)" stroke-width="1.5"/>`;
const SUP='⁰¹²³⁴⁵⁶⁷⁸⁹',SUB='₀₁₂₃₄₅₆₇₈₉';
const sup=k=>(k<0?'⁻':'')+String(Math.abs(k)).split('').map(d=>SUP[+d]).join(''),sub=k=>String(k).split('').map(d=>SUB[+d]).join('');
const root=(k,a)=>(k===2?'':sup(k))+'√'+a;

/* 指数の拡張：指数の刻みを細かくしても、隣どうしの比は一定 */
const STEP=['1','1/2','1/4','1/8'];
FIGS.h2shisu_kizami=host=>FIG.mk(host,{alt:'2 の累乗の点を、指数の刻みを細かくしながら並べる図',
  sliders:[{k:'i',label:'指数の刻み',min:0,max:3,step:1,v:0,fmt:i=>STEP[Math.round(i)]}],play:{k:'i',from:0,to:3,label:'刻みを細かくする',ms:3600},
  draw(v){const i=Math.round(v.i),m=2**i,p=plot([-3.4,3.4,-.7,8.7]).grid();
    if(i)p.curve(x=>2**x,DASH,-3.4,3.2);
    for(let k=-3*m;k<=3*m;k++){const x=k/m,old=k%m===0;p.dot(x,2**x,old?'var(--ink)':'var(--gold)',old?4.2:i===3?2.6:3.4);}
    let s=p.out();
    [[-1,'1/2'],[1,'2'],[2,'4'],[3,'8']].forEach(q=>s+=q[0]<0?T(p.sx(q[0])-7,p.sy(2**q[0])-7,q[1],{a:'end',fs:10}):T(p.sx(q[0])+9,p.sy(2**q[0])+11,q[1],{a:'start',fs:10}));
    const ratio=2**(1/m);
    const more=i===0?'1 つ左へ行くと 1/2 倍：2⁰ = 1、2⁻¹ = 1/2':i===1?'2 回かけると 2 倍になる数 → √2<br>2 の 1/2 乗 = √2':`${m} 回かけると 2 倍になる数 → ${root(m,2)}<br>2 の 1/${m} 乗 = ${root(m,2)}`;
    return {svg:s,read:`指数を ${STEP[i]} ずつ増やした点（${6*m+1} 個）<br>右隣の点は、いつも <b>${n(ratio,4)} 倍</b><br>${more}`};}});

/* 累乗根：y = xⁿ と y = a の共有点 */
FIGS.h2shisu_ruijokon=host=>FIG.mk(host,{alt:'y = x の n 乗のグラフと横線 y = a の共有点から、a の n 乗根を読み取る図',
  sliders:[{k:'n',label:'n',min:2,max:5,step:1,v:3},{k:'a',label:'a',min:-8,max:8,step:.5,v:8}],
  draw(v){const k=Math.round(v.n),a=v.a,p=plot([-3.2,3.2,-9.4,9.4]).grid().curve(x=>x**k,C).seg(-3.2,a,3.2,a,GOLD),odd=k%2===1;
    const xs=odd?[Math.sign(a)*Math.abs(a)**(1/k)]:a>0?[-(a**(1/k)),a**(1/k)]:a===0?[0]:[];
    xs.forEach(x=>p.seg(x,0,x,a,DASH).dot(x,a,'var(--gold)').dot(x,0,'var(--ink)',3.4));
    let s=p.out()+T(332,243,'y = x'+sup(k),{a:'end',c:'var(--c)'});
    const eqn=`x${sup(k)} = ${n(a)}`,r=xs.length?n(Math.abs(xs[xs.length-1]),4):'';let read;
    if(odd)read=`${eqn} となる実数 x は <b>1 個</b><br>x = <b>${n(xs[0],4)}</b><br>`+(a>0?`これを ${root(k,n(a))} と書く`:a<0?`n が奇数なら、負の数にも n 乗根がある<br>${root(k,n(a))} = −${root(k,n(-a))}`:'');
    else if(a>0)read=`${eqn} となる実数 x は <b>2 個</b><br>x = ±${r}<br>正の方 ${r} を ${root(k,n(a))} と書く`;
    else if(a===0)read=`${eqn} となる実数 x は 0 だけ`;
    else read=`${eqn} となる実数 x は<b>ない</b><br>n が偶数のとき、x${sup(k)} は負にならない`;
    return {svg:s,read};}});

/* 指数関数のグラフ */
FIGS.h2shisu_graph=host=>FIG.mk(host,{alt:'指数関数のグラフ。x が 1 増えるごとに y が a 倍になる',
  sliders:[{k:'a',label:'底 a',min:.25,max:4,step:.25,v:2},{k:'x',label:'x',min:-3,max:3,step:.5,v:1}],
  draw(v){const a=v.a,x=v.x,f=t=>a**t,p=plot([-4.2,4.2,-.8,5.4]).grid();
    if(a!==1)p.curve(t=>a**-t,DASH);
    p.curve(f,C);const y0=f(x),y1=f(x+1),vis=y=>y<=5.6;
    if(a!==1&&vis(y0)&&vis(y1))p.seg(x,y0,x+1,y0,GOLD).seg(x+1,y0,x+1,y1,GOLD).dot(x+1,y1,'var(--gold)',3.6);
    if(vis(y0))p.dot(x,y0,'var(--gold)');p.dot(0,1,'var(--ink)',3.6);
    let s=p.out();if(a!==1&&vis(y0)&&vis(y1))s+=T(p.sx(x+1)+6,p.sy((y0+y1)/2)+4,'× '+n(a),{a:'start',c:'var(--gold)',fs:10});
    if(a===1)return {svg:s,read:`a = 1 のとき y = 1（定数）<br>増えも減りもしないので、<br>指数関数の底からは 1 を除く`};
    return {svg:s,read:`y = ${n(a)}^x（底 a ${a>1?'> 1：右上がり':'が 0 と 1 の間：右下がり'}）<br>x = ${n(x)} のとき y = ${n(y0,3)}<br>x が 1 増えると、y はいつも <b>${n(a)} 倍</b><br>点線は y = (1/a)^x。y 軸について対称`};}});

/* 対数の定義：a を何乗すると M になるか */
FIGS.h2shisu_taisu=host=>FIG.mk(host,{alt:'指数関数のグラフで、y の値が M になる x を読み取る図',
  sliders:[{k:'a',label:'底 a',min:2,max:5,step:1,v:2},{k:'M',label:'M',min:.25,max:9,step:.25,v:5}],
  draw(v){const a=Math.round(v.a),M=v.M,x=Math.log(M)/Math.log(a),p=plot([-3.4,4.4,-1.6,9.6]).grid().curve(t=>a**t,C);
    p.seg(0,M,x,M,GOLD).seg(x,M,x,0,'stroke="var(--gold)" stroke-width="1.8" stroke-dasharray="4 3"').dot(x,M,'var(--gold)').dot(x,0,'var(--ink)',4);
    let s=p.out()+T(p.sx(0)+(x>=0?-6:6),p.sy(M)+4,'M',{a:x>=0?'end':'start',c:'var(--gold)'})+T(p.sx(x),p.sy(0)+27,'log'+sub(a)+' M',{fs:10});
    const k=Math.round(x),exact=Math.abs(x-k)<1e-9,lo=Math.floor(x+1e-9);
    return {svg:s,read:`${a}^x = ${n(M)} となる x を探す<br>x = log${sub(a)} ${n(M)} = <b>${n(x,4)}</b><br>`+(exact?`ちょうど ${a}${sup(k)} = ${n(M,4)}`:`${a}${sup(lo)} = ${n(a**lo,4)} と ${a}${sup(lo+1)} = ${n(a**(lo+1),4)} の間にあるので、<br>x は ${n(lo)} と ${n(lo+1)} の間`)};}});

/* 対数の性質：対数の目盛りでは、長さのたし算がかけ算になる */
FIGS.h2shisu_shaku=host=>FIG.mk(host,{alt:'対数の目盛りを2本ずらして重ね、長さのたし算でかけ算をする図',
  sliders:[{k:'M',label:'M',min:1,max:8,step:1,v:3},{k:'N',label:'N',min:1,max:8,step:1,v:5}],
  draw(v){const M=Math.round(v.M),N=Math.round(v.N),u=48.5,X=t=>24+Math.log2(t)*u,xm=X(M),xp=X(M*N);let s='';
    // 上の目盛り（1〜64）
    s+=L(24,84,X(64),84,'stroke="var(--ink)" stroke-width="1.4"')+T(24,46,'上の目盛り（1 〜 64）',{a:'start',c:'var(--muted)',fs:10});
    [1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64].forEach(t=>{const big=[1,2,4,8,16,32,64].includes(t);s+=L(X(t),84,X(t),big?72:77,'stroke="var(--ink)" stroke-width="1.2"');if(big||[3,5,6].includes(t))s+=T(X(t),66,t,{fs:big?10:9,c:big?'var(--ink)':'var(--muted)'});});
    // 下の目盛り（1〜8）。1 を上の M に合わせてある
    s+=L(xm,96,xm+3*u,96,'stroke="var(--c)" stroke-width="1.4"')+T(Math.min(xm,130),134,'下の目盛り（1 を上の M に合わせた）',{a:'start',c:'var(--muted)',fs:10});
    for(let t=1;t<=8;t++){const x=xm+Math.log2(t)*u;s+=L(x,96,x,[1,2,4,8].includes(t)?108:103,'stroke="var(--c)" stroke-width="1.2"')+(t===7?'':T(x,119,t,{fs:t===5||t===6||t===3?9:10,c:'var(--c)'}));}
    s+=L(xm,71,xm,112,'stroke="var(--ok)" stroke-width="1.6"')+L(xp,71,xp,112,'stroke="var(--ng)" stroke-width="1.6"');
    // 長さの帯
    const bar=(x1,x2,y,c,t)=>x2-x1<1?'':`<rect x="${f1(x1)}" y="${y}" width="${f1(x2-x1)}" height="12" rx="2" fill="var(--${c})" fill-opacity=".75"/>`+T(Math.max((x1+x2)/2,x1+30),y+26,t,{c:`var(--${c})`,fs:10});
    s+=bar(24,xm,156,'ok','log₂ M')+bar(xm,xp,156,'ng','log₂ N')+bar(24,xp,198,'gold','log₂ MN');
    const lm=Math.log2(M),ln=Math.log2(N);
    return {svg:s,read:`上の M = ${M} に、下の 1 を合わせた<br>下の N = ${N} の真上は <b>${M*N}</b>（= ${M} × ${N}）<br>長さ：log₂ ${M} + log₂ ${N} = ${n(lm,3)} + ${n(ln,3)} = <b>${n(lm+ln,3)}</b><br>log₂ ${M*N} = ${n(Math.log2(M*N),3)}`};}});

/* 指数関数と対数関数：直線 y = x について対称 */
FIGS.h2shisu_taisho=host=>FIG.mk(host,{alt:'指数関数と対数関数のグラフが直線 y = x について対称であることを示す図',
  sliders:[{k:'a',label:'底 a',min:.25,max:4,step:.25,v:2},{k:'t',label:'P の x 座標',min:-3,max:2.5,step:.25,v:1}],
  draw(v){const a=v.a,t=v.t,p=plot([-3.4,6.8,-3,4.5]).grid().seg(-3,-3,4.5,4.5,DASH);
    if(a===1){p.seg(-3.4,1,6.8,1,C).seg(1,-3,1,4.5,GOLD);return {svg:p.out(),read:`a = 1 のとき、y = 1^x は定数 1<br>「1 を何乗すると x になるか」は決まらないので、<br>対数の底からも 1 を除く`};}
    const la=Math.log(a),y=a**t;p.curve(x=>a**x,C).curve(x=>x>0?Math.log(x)/la:NaN,GOLD,.004,6.8);
    const inP=y<=4.5,inQ=y<=6.8;
    if(inP&&inQ)p.seg(t,y,y,t,'stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="3 3"').dot((t+y)/2,(t+y)/2,'var(--muted)',3);
    if(inP)p.dot(t,y,'var(--ink)');if(inQ)p.dot(y,t,'var(--gold)');
    let s=p.out()+T(p.sx(4.2)+7,p.sy(4.2)+13,'y = x',{a:'start',c:'var(--muted)',fs:10});
    if(inP)s+=T(p.sx(t)-8,p.sy(y)-5,'P',{a:'end'});if(inQ)s+=T(p.sx(y)+8,p.sy(t)+12,'Q',{a:'start',c:'var(--gold)'});
    return {svg:s,read:`底 a = ${n(a)}（${a>1?'どちらも右上がり':'どちらも右下がり'}）<br>P(${n(t)}, ${n(y,3)}) は y = a^x の上<br>Q(${n(y,3)}, ${n(t)}) は y = log_a x の上<br>P の x と y を入れかえた点が Q。<br>PQ の中点 (${n((t+y)/2,3)}, ${n((t+y)/2,3)}) は y = x の上`};}});

/* 常用対数：桁数を読む */
FIGS.h2shisu_keta=host=>FIG.mk(host,{alt:'a の n 乗の常用対数を数直線に置き、桁数を読み取る図',
  sliders:[{k:'a',label:'a',min:2,max:9,step:1,v:3},{k:'n',label:'n',min:1,max:60,step:1,v:20}],play:{k:'n',from:1,to:60,label:'n を大きくする',ms:6000},
  draw(v){const a=Math.round(v.a),m=Math.round(v.n),str=(BigInt(a)**BigInt(m)).toString(),dg=str.length,k=dg-1,la=Math.log10(a),Lg=m*la,X=t=>30+(t-(k-1))*93.3;let s='';
    // 数そのもの
    const w=str.length*5.42;s+=T(170,40,str,{fs:9})+L(170-w/2,48,170+w/2,48,THIN)+L(170-w/2,44,170-w/2,52,THIN)+L(170+w/2,44,170+w/2,52,THIN)+T(170,64,dg+' 桁',{c:'var(--gold)'})+T(170,22,a+' の '+m+' 乗',{c:'var(--muted)',fs:10});
    // 常用対数の数直線
    const y=150;s+=L(14,y,326,y,THIN)+L(X(k),y,X(k+1),y,'stroke="var(--c)" stroke-width="5" stroke-linecap="round"');
    for(let j=k-1;j<=k+2;j++)s+=L(X(j),y-7,X(j),y+7,'stroke="var(--ink)" stroke-width="1.3"')+T(X(j),y+22,j,{fs:10})+`<text x="${f1(X(j))}" y="${y+42}" font-size="11" font-family="var(--f-mono)" fill="var(--muted)" text-anchor="middle">10<tspan dy="-5" font-size="8">${String(j).replace('-','−')}</tspan></text>`;
    s+=T(X(k+.5),y-36,dg+' 桁の数はここ',{c:'var(--c)',fs:10})+L(X(k),y-30,X(k+1),y-30,'stroke="var(--c)" stroke-width="1"');
    s+=L(X(Lg),y-22,X(Lg),y+7,'stroke="var(--gold)" stroke-width="1.8"')+dot(X(Lg),y,'var(--gold)')+T(14,y+62,'上の段：常用対数の値　下の段：もとの数',{a:'start',c:'var(--muted)',fs:10});
    return {svg:s,read:`log₁₀ ${a}${sup(m)} = ${m} × log₁₀ ${a}<br>= ${m} × ${n(la,4)} ≈ <b>${n(Lg,3)}</b><br>${k} ≤ ${n(Lg,3)} < ${k+1} なので<br>10${sup(k)} ≤ ${a}${sup(m)} < 10${sup(k+1)} → <b>${dg} 桁</b>`};}});

})();
