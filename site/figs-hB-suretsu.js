/* 数学B「数列」の図（FIGS.hbsuretsu_*）。項を点や棒で並べる図、和を段の数や面積として見る図 */
(function(){
const {plot,draw,n,sg,C,GOLD,DASH}=FIG;
const f=v=>v.toFixed(1);
// 文字（線に重なっても読めるよう、地の色でふちどる）
const tx=(d,x,y,t,c='var(--ink)',s=11,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3" stroke-linejoin="round">${t}</text>`);
const rect=(d,x,y,w,h,st)=>d.raw(`<rect x="${f(x)}" y="${f(y)}" width="${f(Math.max(0,w))}" height="${f(Math.max(0,h))}" ${st}/>`);
const AX='stroke="var(--muted)" stroke-width="1.2"';
const SUP='⁰¹²³⁴⁵⁶⁷⁸⁹',SUB='₀₁₂₃₄₅₆₇₈₉';
const sup=k=>String(k).split('').map(c=>SUP[+c]).join(''),sub=k=>String(k).split('').map(c=>SUB[+c]).join('');
const par=(x,d=3)=>x<0?`(${n(x,d)})`:n(x,d);

/* ---- 数列：項を番号順に棒で並べる ---- */
const KO=[{name:'3n − 2',f:k=>3*k-2,calc:k=>`3 × ${k} − 2`},{name:'n²',f:k=>k*k,calc:k=>`${k}²`},{name:'2ⁿ⁻¹',f:k=>2**(k-1),calc:k=>`2${sup(k-1)}`}];
FIGS.hbsuretsu_ko=host=>FIG.mk(host,{alt:'数列の項を、番号の順に棒で並べた図',
  sliders:[{k:'m',label:'一般項（第 n 項）',min:1,max:3,step:1,v:1,fmt:m=>KO[m-1].name},{k:'k',label:'番号 n',min:1,max:8,step:1,v:4}],
  draw(v){const q=KO[v.m-1],vals=[];for(let i=1;i<=8;i++)vals.push(q.f(i));const mx=vals[7],d=draw(),B=204,T=34,X=i=>36+(i-1)*38.5;
    d.line(14,B,326,B,AX);
    vals.forEach((a,i)=>{const h=a/mx*(B-T),on=i+1===v.k;rect(d,X(i+1)-11,B-h,22,h,on?'fill="var(--gold)" fill-opacity=".85"':'fill="var(--c)" fill-opacity=".45"');
      tx(d,X(i+1),B-h-6,String(a),on?'var(--gold)':'var(--ink)',10.5);tx(d,X(i+1),B+15,String(i+1),on?'var(--gold)':'var(--muted)');});
    tx(d,326,B+32,'番号 n','var(--muted)',10,'end');
    return {svg:d.out(),read:`一般項（第 n 項）= ${q.name}<br>項を順に並べると ${vals.slice(0,5).join(', ')}, …<br>第 ${v.k} 項：a${sub(v.k)} = ${q.calc(v.k)} = <b>${q.f(v.k)}</b>`};}});

/* ---- 等差数列：点は等しい段差で進み、1本の直線上に並ぶ ---- */
FIGS.hbsuretsu_tosa=host=>FIG.mk(host,{alt:'等差数列の項を点で並べた図。となりの点との段差が一定で、点は1本の直線上に並ぶ',
  sliders:[{k:'a',label:'初項 a',min:-3,max:6,step:1,v:1},{k:'d',label:'公差 d',min:-2,max:3,step:.5,v:2},{k:'k',label:'番号 n',min:1,max:8,step:1,v:5}],
  draw(v){const a=v.a,dd=v.d,K=v.k,vals=[];for(let i=1;i<=8;i++)vals.push(a+(i-1)*dd);
    let lo=Math.min(0,...vals),hi=Math.max(0,...vals);if(hi-lo<1e-9)hi=1;
    const T=38,B=198,X=i=>40+(i-1)*38.5,Y=y=>B-(y-lo)/(hi-lo)*(B-T),d=draw(),up=dd>=0;
    d.line(26,Y(0),326,Y(0),AX);tx(d,18,Y(0)+4,'0','var(--muted)',10);
    d.line(X(.7),Y(a-.3*dd),X(8.3),Y(a+7.3*dd),DASH);
    if(dd)for(let i=1;i<8;i++){d.line(X(i),Y(vals[i-1]),X(i+1),Y(vals[i-1]),'stroke="var(--muted)" stroke-width="1"');d.line(X(i+1),Y(vals[i-1]),X(i+1),Y(vals[i]),'stroke="var(--gold)" stroke-width="2.4"');}
    if(Math.abs(Y(vals[1])-Y(vals[0]))>=14)tx(d,X(2)+6,(Y(vals[0])+Y(vals[1]))/2+4,(dd>0?'+':'−')+n(Math.abs(dd)),'var(--gold)',10,'start');
    vals.forEach((y,i)=>{const on=i+1===K;d.dot(X(i+1),Y(y),on?'var(--gold)':'var(--c)',on?5.5:4);
      tx(d,X(i+1),Y(y)+(up?-9:17),n(y,1),on?'var(--gold)':'var(--ink)',10.5);tx(d,X(i+1),240,String(i+1),on?'var(--gold)':'var(--muted)');});
    return {svg:d.out(),read:`初項 a = ${n(a)}、公差 d = ${n(dd)}<br>となりの項との差は、いつも ${n(dd)}<br>第 ${K} 項：a${sub(K)} = a + (${K} − 1)d<br>= ${n(a)} + ${K-1} × ${par(dd)} = <b>${n(vals[K-1])}</b>`};}});

/* ---- なぜ：階段を2つ組み合わせて長方形にする ---- */
FIGS.hbsuretsu_kaidan=host=>FIG.mk(host,{alt:'等差数列の項を段の高さにした階段を2つ、逆向きに組み合わせて長方形にする図',
  sliders:[{k:'s',label:'手順',min:1,max:3,step:1,v:1},{k:'n',label:'項数 n',min:3,max:10,step:1,v:5},{k:'d',label:'公差 d（初項は 1）',min:1,max:3,step:1,v:1}],
  play:{k:'s',from:1,to:3,label:'順に見る',ms:3300},
  draw(v){const N=v.n,dd=v.d,s=v.s,a=k=>1+(k-1)*dd,H=a(1)+a(N),cw=28,ru=Math.min(24,180/H),x0=(340-cw*N)/2+8,y0=208,d=draw(),ts=[];
    for(let k=1;k<=N;k++){const x=x0+(k-1)*cw,h=a(k)*ru;ts.push(a(k));
      rect(d,x,y0-h,cw,h,'fill="var(--c)" fill-opacity=".5"');
      if(s>=2)rect(d,x,y0-H*ru,cw,(H-a(k))*ru,'fill="var(--gold)" fill-opacity=".5"');
      if(ru>=6)for(let j=1,top=s>=2?H:a(k);j<top;j++)d.line(x,y0-j*ru,x+cw,y0-j*ru,'stroke="var(--bg2)" stroke-width=".8"');
      d.line(x,y0,x,y0-(s>=2?H:a(k))*ru,'stroke="var(--bg2)" stroke-width="1.2"');
      tx(d,x+cw/2,y0+14,String(a(k)),'var(--ink)',10.5);
      if(s>=2)tx(d,x+cw/2,y0-H*ru-6,String(a(N+1-k)),'var(--gold)',10.5);}
    if(s>=3){d.poly([[x0,y0],[x0+N*cw,y0],[x0+N*cw,y0-H*ru],[x0,y0-H*ru]],'fill="none" stroke="var(--ink)" stroke-width="2"');
      tx(d,x0-7,y0-H*ru/2+4,'縦 '+H,'var(--ink)',11,'end');tx(d,x0+N*cw/2,y0+31,'横 '+N+'（項数）','var(--ink)',11);}
    const read=[`初項 1、公差 ${dd}、項数 ${N}<br>S = ${ts.join(' + ')}<br>段の数の合計が S`,
      `同じ階段をもう1つ、逆さにしてのせる<br>どの列も、高さは ${a(1)} + ${a(N)} = <b>${H}</b>`,
      `縦 ${H}、横 ${N} の長方形になる<br>2S = ${N} × ${H} = ${N*H}<br>S = ${N*H} ÷ 2 = <b>${N*H/2}</b>`][s-1];
    return {svg:d.out(),read};}});

/* ---- 等比数列：棒が r 倍ずつになる。和も表示 ---- */
FIGS.hbsuretsu_tohi=host=>FIG.mk(host,{alt:'等比数列の項を棒で並べた図。となりの棒との高さの比が一定',
  sliders:[{k:'a',label:'初項 a',min:1,max:4,step:1,v:1},{k:'r',label:'公比 r',min:.5,max:2,step:.25,v:2},{k:'k',label:'番号 n',min:1,max:8,step:1,v:5}],
  draw(v){const a=v.a,r=v.r,K=v.k,vals=[];for(let i=1;i<=8;i++)vals.push(a*Math.pow(r,i-1));
    const mx=Math.max(...vals),d=draw(),B=204,T=34,X=i=>36+(i-1)*38.5,fm=x=>x>=100?n(x,0):x>=10?n(x,1):n(x,2);let S=0;
    d.line(14,B,326,B,AX);
    vals.forEach((y,i)=>{const h=y/mx*(B-T),on=i<K;if(on)S+=y;rect(d,X(i+1)-12,B-h,24,h,`fill="var(--c)" fill-opacity="${on?.6:.2}"`);
      tx(d,X(i+1),B-h-6,fm(y),i+1===K?'var(--gold)':on?'var(--ink)':'var(--muted)',10);tx(d,X(i+1),B+15,String(i+1),i+1===K?'var(--gold)':'var(--muted)');});
    tx(d,326,B+32,'番号 n','var(--muted)',10,'end');
    return {svg:d.out(),read:`初項 a = ${a}、公比 r = ${n(r)}<br>第 ${K} 項：a${sub(K)} = ${a} × ${n(r)}${sup(K-1)} = <b>${n(vals[K-1],3)}</b><br>初項から第 ${K} 項までの和 S${sub(K)} = <i>${n(S,3)}</i><br>`+
      (r===1?`r = 1 なので S${sub(K)} = ${K} × ${a} = ${K*a}`:`公式：${a} × (${n(r)}${sup(K)} − 1) ÷ (${n(r)} − 1) = ${n(a*(Math.pow(r,K)-1)/(r-1),3)}`)};}});

/* ---- 等比数列の和：公比をかけて、1つずらして引く ---- */
FIGS.hbsuretsu_zurasu=host=>FIG.mk(host,{h:196,alt:'等比数列の和 S と、公比をかけた rS を1つずらして並べ、引き算で途中の項が消えることを示す図',
  sliders:[{k:'s',label:'手順',min:1,max:4,step:1,v:1},{k:'r',label:'公比 r',min:2,max:3,step:1,v:2}],play:{k:'s',from:1,to:4,label:'順に見る',ms:4400},
  draw(v){const r=v.r,s=v.s,t=[1,r,r*r,r**3,r**4,r**5],d=draw(),X=c=>58+(c-1)*45,W=38;
    const A='fill="var(--c)" fill-opacity=".3" stroke="var(--c)" stroke-width="1.2"',G='fill="var(--gold)" fill-opacity=".3" stroke="var(--gold)" stroke-width="1.2"',F='fill="none" stroke="var(--line)" stroke-width="1.2" stroke-dasharray="3 3"';
    const box=(c,y,gone,st)=>{rect(d,X(c),y,W,30,(gone?F:st)+' rx="5"');tx(d,X(c)+W/2,y+20,String(t[c-1]),gone?'var(--muted)':'var(--ink)',12);};
    if(s>=3)for(let c=2;c<=5;c++)d.line(X(c)+W/2,66,X(c)+W/2,96,DASH);
    tx(d,48,56,'S =','var(--ink)',12,'end');for(let c=1;c<=5;c++)box(c,36,s>=3&&c>=2,A);
    if(s>=2){tx(d,48,116,r+'S =','var(--ink)',12,'end');for(let c=2;c<=6;c++)box(c,96,s>=3&&c<=5,G);}
    if(s>=4){d.line(14,142,326,142,AX);tx(d,170,172,`${r}S − S = ${t[5]} − 1`,'var(--ink)',13);}
    const mid=t.slice(1,5).join(', ');
    const read=[`初項 1、公比 ${r}、項数 5 の等比数列の和<br>S = ${t.slice(0,5).join(' + ')}`,
      `両辺に公比 ${r} をかけ、1つ右にずらして書く<br>${r}S = ${t.slice(1,6).join(' + ')}`,
      `上と下に同じ数が並ぶ（${mid}）<br>下の式から上の式を引くと、これらは消える`,
      `${r}S − S = ${t[5]} − 1<br>(${r} − 1)S = ${t[5]-1}<br>S = <b>${(t[5]-1)/(r-1)}</b>`][s-1];
    return {svg:d.out(),read};}});

/* ---- 和の記号 Σ：第 k 項を幅 1 の棒にして、棒の面積の合計として和を見る ---- */
const SG=[{name:'k',f:k=>k,sum:N=>N*(N+1)/2,fo:N=>`n(n+1)/2 = ${N}·${N+1}/2`},
  {name:'k²',f:k=>k*k,sum:N=>N*(N+1)*(2*N+1)/6,fo:N=>`n(n+1)(2n+1)/6 = ${N}·${N+1}·${2*N+1}/6`},
  {name:'k³',f:k=>k**3,sum:N=>(N*(N+1)/2)**2,fo:N=>`{n(n+1)/2}² = ${N*(N+1)/2}²`}];
FIGS.hbsuretsu_sigma=host=>FIG.mk(host,{alt:'第 k 項を幅 1 の棒で表し、棒の面積の合計として和を見る図',
  sliders:[{k:'m',label:'第 k 項',min:1,max:3,step:1,v:1,fmt:m=>SG[m-1].name},{k:'n',label:'n（第何項までたすか）',min:1,max:10,step:1,v:5}],play:{k:'n',from:1,to:10,label:'n を増やす',ms:3600},
  draw(v){const q=SG[v.m-1],N=v.n,mx=q.f(N),d=draw(),B=204,T=34,cw=29,x0=25,ts=[];let S=0;
    d.line(14,B,326,B,AX);
    for(let k=1;k<=10;k++){tx(d,x0+(k-.5)*cw,B+15,String(k),k<=N?'var(--ink)':'var(--muted)');if(k>N)continue;const y=q.f(k),h=y/mx*(B-T);S+=y;ts.push(y);
      rect(d,x0+(k-1)*cw,B-h,cw,h,`fill="var(--${k===N?'gold':'c'})" fill-opacity=".5" stroke="var(--bg2)" stroke-width="1"`);tx(d,x0+(k-.5)*cw,B-h-6,String(y),k===N?'var(--gold)':'var(--ink)',10);}
    tx(d,326,B+32,'k','var(--muted)',10,'end');
    const list=ts.length<=6?ts.join(' + '):ts.slice(0,3).join(' + ')+' + … + '+ts[ts.length-1];
    return {svg:d.out(),read:`第 k 項が ${q.name} の数列を、k = 1 から ${N} までたす<br>${list} = <b>${S}</b><br>公式：${q.fo(N)} = <i>${q.sum(N)}</i>`};}});

/* ---- 差の形にして足すと、途中が消える。arg = 'cube'（(k+1)³ − k³）か 'frac'（1/k − 1/(k+1)） ---- */
FIGS.hbsuretsu_shoukyo=(host,arg)=>{const cube=arg==='cube',mxN=cube?4:8;
  FIG.mk(host,{h:160,alt:cube?'1³ から (n+1)³ までの数直線を、(k+1)³ − k³ の長さの区間に分けた図':'0 から 1 までの数直線を、1/k − 1/(k+1) の長さの区間に分けた図',
  sliders:[{k:'n',label:'n',min:1,max:mxN,step:1,v:cube?3:4}],play:{k:'n',from:1,to:mxN,label:'n を増やす',ms:3000},
  draw(v){const N=v.n,d=draw(),L=20,W=300,y=68,hh=34,col=k=>`fill="var(--${k%2?'c':'gold'})" fill-opacity=".45" stroke="var(--bg2)" stroke-width="1"`;let read;
    if(cube){const b=(N+1)**3,X=t=>L+(t-1)/(b-1)*W,ps=[];
      for(let k=1;k<=N;k++){const x1=X(k**3),x2=X((k+1)**3),len=3*k*k+3*k+1;ps.push(len);
        rect(d,x1,y,x2-x1,hh,col(k));tx(d,(x1+x2)/2,y+hh/2+4,String(len),'var(--ink)',11);
        d.line(x1,y+hh,x1,y+hh+5,AX);tx(d,x1,y+hh+18,k+'³',k===1?'var(--gold)':'var(--muted)',10.5);}
      d.line(X(b),y+hh,X(b),y+hh+5,AX);tx(d,X(b),y+hh+18,(N+1)+'³','var(--gold)',10.5);
      tx(d,170,y-28,`全体の長さ ${N+1}³ − 1³ = ${b-1}`,'var(--ink)',11);
      read=`(k+1)³ − k³ = 3k² + 3k + 1<br>k = 1 から ${N} までたすと<br>${ps.join(' + ')} = <b>${b-1}</b><br>= ${N+1}³ − 1³`+(N>1?'（途中の 2³, … は消える）':'');}
    else{const X=t=>L+t*W;
      d.line(X(0),y+hh,X(1),y+hh,AX);
      for(let k=1;k<=N;k++){const x1=X(1/(k+1)),x2=X(1/k);rect(d,x1,y,x2-x1,hh,col(k));
        if(k<=3)tx(d,(x1+x2)/2,y+hh/2+4,'1/'+k*(k+1),'var(--ink)',k===3?9.5:11);
        if(k<=4){d.line(x2,y+hh,x2,y+hh+5,AX);tx(d,x2,y+hh+18,k===1?'1':'1/'+k,'var(--muted)',10.5);}}
      d.line(X(0),y+hh,X(0),y+hh+5,AX);tx(d,X(0),y+hh+18,'0','var(--muted)',10.5);
      tx(d,X(1/(N+1)),y-7,'1/'+(N+1),'var(--gold)',10.5);
      tx(d,170,y-28,`色のついた長さ = 1 − 1/${N+1}`,'var(--ink)',11);
      read=N===1?'1/(1·2) = 1 − 1/2 = <b>1/2</b>':`1/(1·2) + 1/(2·3) + … + 1/(${N}·${N+1})<br>= (1 − 1/2) + (1/2 − 1/3) + …<br>= 1 − 1/${N+1} = <b>${N}/${N+1}</b><br>途中の 1/2, 1/3, … は消える`;}
    return {svg:d.out(),read};}});};

/* ---- 階差数列：となりの項との差を段の高さとして見る ---- */
const KA=[{a:[2,3,6,11,18,27,38],bn:'2n − 1'},{a:[3,4,6,10,18,34,66],bn:'2ⁿ⁻¹'}];
FIGS.hbsuretsu_kaisa=host=>FIG.mk(host,{alt:'数列の項を点で並べ、となりの項との差（階差）を段の高さとして示す図',
  sliders:[{k:'m',label:'数列',min:1,max:2,step:1,v:1,fmt:m=>KA[m-1].a.slice(0,4).join(', ')+', …'},{k:'k',label:'番号 n',min:2,max:7,step:1,v:4}],play:{k:'k',from:2,to:7,label:'n を増やす',ms:3200},
  draw(v){const q=KA[v.m-1],a=q.a,K=v.k,mx=a[6],d=draw(),T=40,B=192,X=i=>44+(i-1)*44,Y=y=>B-y/mx*(B-T),bs=[],all=[];
    d.line(14,B,326,B,AX);d.line(X(1),Y(a[0]),X(7)+12,Y(a[0]),DASH);
    for(let i=1;i<7;i++){const on=i<K,b=a[i]-a[i-1];all.push(b);if(on)bs.push(b);
      d.line(X(i),Y(a[i-1]),X(i+1),Y(a[i-1]),`stroke="var(--muted)" stroke-width="1" opacity="${on?1:.4}"`);
      d.line(X(i+1),Y(a[i-1]),X(i+1),Y(a[i]),`stroke="var(--gold)" stroke-width="${on?3:1.5}" opacity="${on?1:.4}"`);
      tx(d,(X(i)+X(i+1))/2,B+16,'+'+b,on?'var(--gold)':'var(--muted)',10.5);}
    a.forEach((y,i)=>{const on=i+1===K;d.dot(X(i+1),Y(y),on?'var(--gold)':i<K?'var(--c)':'var(--muted)',on?5.5:4);
      tx(d,X(i+1)-7,Y(y)-7,String(y),on?'var(--gold)':i<K?'var(--ink)':'var(--muted)',10.5,'end');tx(d,X(i+1),B+34,String(i+1),on?'var(--gold)':'var(--muted)');});
    tx(d,326,B+50,'番号 n','var(--muted)',10,'end');tx(d,16,22,'点：もとの数列　金色の段：階差','var(--muted)',10,'start');
    return {svg:d.out(),read:`階差数列：${all.slice(0,4).join(', ')}, …（第 n 項は ${q.bn}）<br>a${sub(K)} = a₁ + (b₁ から b${sub(K-1)} までの和)<br>= ${a[0]} + ${bs.length>1?'('+bs.join(' + ')+')':bs[0]} = <b>${a[K-1]}</b>`};}});

/* ---- 漸化式：前の項から次の項を順に作る ---- */
FIGS.hbsuretsu_zenka=host=>FIG.mk(host,{alt:'漸化式にしたがって、前の項から次の項を順に作っていく図',
  sliders:[{k:'p',label:'p',min:-1,max:2,step:.5,v:2},{k:'q',label:'q',min:-3,max:3,step:1,v:1},{k:'k',label:'番号 n',min:1,max:7,step:1,v:4}],play:{k:'k',from:1,to:7,label:'項を順に作る',ms:3600},
  draw(v){const p=v.p,q=v.q,K=v.k,a=[1];for(let i=1;i<7;i++)a.push(p*a[i-1]+q);
    let lo=Math.min(0,...a),hi=Math.max(0,...a);if(hi-lo<1e-9)hi=1;
    const T=40,B=198,X=i=>44+(i-1)*44,Y=y=>B-(y-lo)/(hi-lo)*(B-T),d=draw();
    d.line(26,Y(0),326,Y(0),AX);tx(d,18,Y(0)+4,'0','var(--muted)',10);
    for(let i=1;i<K;i++)d.line(X(i),Y(a[i-1]),X(i+1),Y(a[i]),'stroke="var(--muted)" stroke-width="1.2"');
    for(let i=1;i<=7;i++){tx(d,X(i),240,String(i),i===K?'var(--gold)':'var(--muted)');if(i>K)continue;const on=i===K,y=a[i-1];
      d.dot(X(i),Y(y),on?'var(--gold)':'var(--c)',on?5.5:4);tx(d,X(i),Y(y)+(i>1&&y<a[i-2]?17:-9),n(y,2),on?'var(--gold)':'var(--ink)',10.5);}
    const rec='次の項 = '+(p===1?'今の項':p===-1?'−（今の項）':n(p)+' ×（今の項）')+(q?' '+sg(q):'');
    const kind=p===1?`p = 1：公差 ${n(q)} の等差数列`:q===0?`q = 0：公比 ${n(p)} の等比数列`:p===0?`p = 0：第 2 項から先はすべて ${n(q)}`:'等差数列でも等比数列でもない';
    return {svg:d.out(),read:`a₁ = 1、${rec}<br>`+(K>1?`a${sub(K)} = ${n(p)} × ${par(a[K-2])}${q?' '+sg(q):''} = <b>${n(a[K-1],3)}</b>`:'a₁ = <b>1</b>（初項）')+`<br>${kind}`};}});

/* ---- なぜ：直線 y = px + q と y = x の間をたどる（クモの巣図）。交点の x 座標 α はいつも 2 ---- */
const KP=[-1.5,-1,-.5,.25,.5,.75,1.5,2];
const kumo=(p,a1,s)=>{const a=[a1];for(let k=0;k<s;k++)a.push(p*a[k]+2-2*p);return a;};
FIGS.hbsuretsu_kumo=host=>FIG.mk(host,{alt:'直線 y = px + q と直線 y = x の間を折れ線でたどり、数列の項が交点の x 座標 α に近づく、または離れる様子を示す図',
  sliders:[{k:'i',label:'p',min:0,max:7,step:1,v:4,fmt:i=>n(KP[i])},{k:'a',label:'初項 a₁',min:-1,max:6,step:.5,v:6},{k:'s',label:'進める回数',min:1,max:8,step:1,v:1}],play:{k:'s',from:1,to:8,label:'項を順に進める',ms:4000},
  draw(v){const p=KP[v.i],q=2-2*p,g=x=>p*x+q,a=kumo(p,v.a,v.s),P=plot([-2.6,7.6,-2.6,7.6]).grid(),T='paint-order="stroke" stroke="var(--bg2)" stroke-width="3"';
    P.curve(x=>x,'stroke="var(--muted)" stroke-width="1.4"').curve(g,C).txt(7.4,5.1,'y = x','text-anchor="end" '+T);
    P.seg(2,0,2,2,DASH).txt(2,0,'α','text-anchor="middle" dy="14" fill="var(--gold)" '+T);
    for(let k=0;k<v.s;k++)P.seg(a[k],k?a[k]:0,a[k],a[k+1],GOLD).seg(a[k],a[k+1],a[k+1],a[k+1],GOLD);
    a.forEach((x,k)=>{if(Math.abs(x)<8)P.dot(x,0,k?'var(--ink)':'var(--gold)',k?3:4.5);});
    P.dot(2,2,'var(--gold)',4);
    if(Math.abs(v.a-2)>=.5)P.txt(v.a,0,'a₁','dx="6" dy="-6" fill="var(--gold)" '+T);
    const m=Math.min(a.length,5),seq=a.slice(0,m).map(x=>n(x,3)).join(' → '),df=a.slice(0,m).map(x=>n(x-2,3)).join(' → '),far=a.some(x=>Math.abs(x)>7.6);
    const tail=v.a===2?'a₁ = α なので、ずっと α のまま':Math.abs(p)<1?'差が小さくなり、α に近づく':Math.abs(p)>1?'差が大きくなり、α から離れる'+(far?'（図の外へ出る）':''):'差の大きさは変わらない';
    return {svg:P.out(),read:`<i>太い線</i>：y = ${p===-1?'−':n(p)}x${q?' '+sg(q):''}（α = 2）<br>項：${seq}${a.length>m?' → …':''}<br>項 − α：${df}${a.length>m?' → …':''}<br>差は毎回 <b>${n(p)} 倍</b><br>${tail}`};}});
FIGS.hbsuretsu_kumo.sim=kumo;

/* ---- 数学的帰納法：ドミノ ---- */
FIGS.hbsuretsu_domino=host=>FIG.mk(host,{h:150,alt:'番号をつけたドミノの列。1 枚目を倒すことと、k 枚目が倒れると k+1 枚目も倒れることの両方がそろうと、すべて倒れる',
  sliders:[{k:'a',label:'[1] 1 枚目を',min:0,max:1,step:1,v:0,fmt:a=>a?'倒す':'倒さない'},{k:'b',label:'[2] k 枚目 → k+1 枚目',min:0,max:9,step:1,v:0,fmt:b=>b?`k = ${b} で届かない`:'どの k でも届く'}],
  draw(v){const d=draw(),N=10,base=106,w=9,h=56,xs=[];let x=20;for(let k=1;k<=N;k++){xs.push(x);x+=25+(v.b===k?54:0);}
    const fallen=v.a?(v.b||N):0;
    d.line(14,base,326,base,AX);
    for(let k=1;k<=N;k++){const fx=xs[k-1],fall=k<=fallen,ang=fall?(k===fallen?90:60):0;
      d.raw(`<rect x="${f(fx)}" y="${base-h}" width="${w}" height="${h}" rx="2" transform="rotate(${ang} ${f(fx+w)} ${base})" fill="var(--${fall?'gold':'c'})" fill-opacity="${fall?.55:.3}" stroke="var(--${fall?'gold':'ink'})" stroke-width="1.3"/>`);
      tx(d,fx+w/2,base+16,String(k),fall?'var(--gold)':'var(--muted)');}
    if(v.b)tx(d,xs[v.b-1]+w+35,base-h-8,'届かない','var(--ng)',10.5);
    const read=!v.a?'[1] が示されていない<br>1 枚目が倒れないので、<b>1 枚も倒れない</b>'+(v.b?`<br>（${v.b} 枚目と ${v.b+1} 枚目の間も空いている）`:''):
      !v.b?'[1] 1 枚目が倒れる<br>[2] どの k でも、k 枚目が倒れると k+1 枚目も倒れる<br>1 → 2 → 3 → … と続き、<b>すべて倒れる</b>':
      `1 枚目は倒れるが、${v.b} 枚目から ${v.b+1} 枚目へ続かない<br>倒れるのは <b>${v.b} 枚目まで</b><br>[2] は「すべての k」について必要`;
    return {svg:d.out(),read};}});
})();
