/* 数学C「複素数平面」の図（FIGS.hcfukuso_*）。動かせる図と、問題に付ける図（hcfukuso_q） */
(function(){
const {n,sg,mk}=FIG;
const f=v=>v.toFixed(1),W=340,PI=Math.PI;
const INK='stroke="var(--ink)" stroke-width="1.8" fill="none"';
const DSH='stroke="var(--muted)" stroke-width="1.1" fill="none" stroke-dasharray="4 4"';
const TC='stroke="var(--c)" stroke-width="2.4" fill="none"';
const TG='stroke="var(--gold)" stroke-width="2.4" fill="none"';
const NC='stroke="var(--c)" stroke-width="1.4" fill="none"';
const NG='stroke="var(--gold)" stroke-width="1.4" fill="none"';
const FC='fill="var(--c)" fill-opacity=".16" stroke="var(--c)" stroke-width="1.2" stroke-linejoin="round"';
const FG='fill="var(--gold)" fill-opacity=".16" stroke="var(--gold)" stroke-width="1.2" stroke-linejoin="round"';
// 文字（線に重なっても読めるよう、地の色でふちどる）
const T=(x,y,t,c='var(--ink)',a='middle',s=12)=>`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`;
// 共役な複素数の記号（z の上に線を引く）。(x, y) は文字の左下
const ZBAR=(x,y,c)=>T(x,y,'z',c,'start')+`<line x1="${f(x+.3)}" y1="${f(y-9.3)}" x2="${f(x+7.2)}" y2="${f(y-9.3)}" stroke="${c}" stroke-width="1.2"/>`;
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
// 角 pπ/q を文字にする（約分する）
const pif=(p,q)=>{if(!p)return '0';const g=gcd(p,q);p/=g;q/=g;const a=Math.abs(p);return (p<0?'−':'')+(a===1?'':a)+'π'+(q===1?'':'/'+q);};
// 15° きざみの角（k × π/12）の表示
const dg=k=>String(15*k).replace('-','−')+'°';
const AF=k=>pif(k,12)+'（'+dg(k)+'）';
// cos, sin の中に書く角（負のときはかっこを付ける）
const an=k=>k<0?'('+pif(k,12)+')':pif(k,12);
// 複素数 a + bi の表示
const cf=(a,b,d=2)=>{const A=n(a,d),B=n(Math.abs(b),d);if(B==='0')return A;const im=(B==='1'?'':B)+'i';if(A==='0')return (b<0?'−':'')+im;return `${A} ${b<0?'−':'+'} ${im}`;};
const ex2=x=>Math.abs(x*100-Math.round(x*100))<1e-7;
const eq=(...xs)=>xs.every(ex2)?'=':'≈';
// √q の表示（q が平方数なら整数に直す）
const rt=q=>{const r=Math.sqrt(q);return Number.isInteger(q)&&Number.isInteger(r)?`√${q} = ${r}`:`√${n(q)} ${ex2(r)?'=':'≈'} ${n(r)}`;};
const sq=x=>x<0?`(${n(x)})²`:`${n(x)}²`;
const sup=k=>String(k).split('').map(c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('');
const sub=k=>String(k).split('').map(c=>'₀₁₂₃₄₅₆₇₈₉'[+c]).join('');
const mul=(z,w)=>[z[0]*w[0]-z[1]*w[1],z[0]*w[1]+z[1]*w[0]];
const pol=(r,t)=>[r*Math.cos(t),r*Math.sin(t)];

// 複素数平面。画面の中心を (cx, cy)（数学の座標）、1 あたり u px とする。縦横の縮尺は同じ
function cp(cx,cy,u,h=250){const sx=x=>W/2+(x-cx)*u,sy=y=>h/2-(y-cy)*u;let s='';
  const o={sx,sy,u,
    // mode：0 = 軸だけ、1 = O も書く、2 = O と 1, i も書く。names = false で「実軸」「虚軸」の文字を省く（点が画面の端まで動く図）
    grid(mode=1,names=true){const x0=cx-W/2/u,x1=cx+W/2/u,y0=cy-h/2/u,y1=cy+h/2/u;
      for(let x=Math.ceil(x0);x<=x1;x++)if(x)s+=`<line x1="${f(sx(x))}" y1="0" x2="${f(sx(x))}" y2="${h}" stroke="var(--line)" stroke-width=".6"/>`;
      for(let y=Math.ceil(y0);y<=y1;y++)if(y)s+=`<line x1="0" y1="${f(sy(y))}" x2="${W}" y2="${f(sy(y))}" stroke="var(--line)" stroke-width=".6"/>`;
      s+=`<line x1="0" y1="${f(sy(0))}" x2="${W}" y2="${f(sy(0))}" stroke="var(--muted)" stroke-width="1.2"/><line x1="${f(sx(0))}" y1="0" x2="${f(sx(0))}" y2="${h}" stroke="var(--muted)" stroke-width="1.2"/>`;
      if(names)s+=T(W-5,sy(0)+13,'実軸','var(--muted)','end',10)+T(sx(0)+6,12,'虚軸','var(--muted)','start',10);
      if(mode>=1)s+=T(sx(0)-5,sy(0)+13,'O','var(--muted)','end',11);
      if(mode>=2)s+=T(sx(1),sy(0)+13,'1','var(--muted)','middle',11)+T(sx(0)-5,sy(1)+4,'i','var(--muted)','end',11);
      return o;},
    seg(xa,ya,xb,yb,st=INK){s+=`<line x1="${f(sx(xa))}" y1="${f(sy(ya))}" x2="${f(sx(xb))}" y2="${f(sy(yb))}" ${st}/>`;return o;},
    dot(x,y,fill='var(--ink)',r=4.5){s+=`<circle cx="${f(sx(x))}" cy="${f(sy(y))}" r="${r}" fill="${fill}" stroke="var(--bg2)" stroke-width="1.5"/>`;return o;},
    // 円（半径 r は数学の長さ）
    circ(x,y,r,st=INK){s+=`<circle cx="${f(sx(x))}" cy="${f(sy(y))}" r="${f(r*u)}" ${st}/>`;return o;},
    poly(p,st=INK){s+=`<polygon points="${p.map(q=>f(sx(q[0]))+','+f(sy(q[1]))).join(' ')}" ${st}/>`;return o;},
    // 矢印
    arr(xa,ya,xb,yb,col='var(--ink)',w=2,dash=''){const X1=sx(xa),Y1=sy(ya),X2=sx(xb),Y2=sy(yb),L=Math.hypot(X2-X1,Y2-Y1);if(L<3)return o;
      const ux=(X2-X1)/L,uy=(Y2-Y1)/L,hl=Math.min(9,L*.6),bx=X2-ux*hl,by=Y2-uy*hl;
      s+=`<line x1="${f(X1)}" y1="${f(Y1)}" x2="${f(bx)}" y2="${f(by)}" stroke="${col}" stroke-width="${w}" ${dash?`stroke-dasharray="${dash}"`:''}/><polygon points="${f(X2)},${f(Y2)} ${f(bx-uy*4)},${f(by+ux*4)} ${f(bx+uy*4)},${f(by-ux*4)}" fill="${col}"/>`;return o;},
    // 角の印：点 (x, y) を中心に、角 a0 から a1（ラジアン、反時計回りが正）。r は px。g を与えると 1 ラジアンごとに g px ずつ半径が増える（うず巻き）
    arc(x,y,r,a0,a1,st=NG,g=0){const N=Math.max(8,Math.ceil(Math.abs(a1-a0)/.08));let d='';
      for(let i=0;i<=N;i++){const a=a0+(a1-a0)*i/N,rr=r+g*Math.abs(a-a0);d+=(i?'L':'M')+f(sx(x)+rr*Math.cos(a))+','+f(sy(y)-rr*Math.sin(a));}
      s+=`<path d="${d}" ${st}/>`;return o;},
    // 文字。数学の座標 (x, y) から px で (dx, dy) ずらす
    txt(x,y,t,c='var(--ink)',dx=0,dy=0,a='middle',sz=12){s+=T(sx(x)+dx,sy(y)+dy,t,c,a,sz);return o;},
    // 点の名前。基準の点 (ox, oy) から遠ざかる向きに k px 離して書く
    lab(x,y,t,c='var(--ink)',ox=0,oy=0,k=13,sz=12){let X=sx(x)-sx(ox),Y=sy(y)-sy(oy);const L=Math.hypot(X,Y);if(L<1e-6){X=0;Y=-1;}else{X/=L;Y/=L;}
      s+=T(sx(x)+X*k,sy(y)+Y*k+4,t,c,'middle',sz);return o;},
    raw(x){s+=x;return o;},out:()=>s};
  return o;}

/* ---- 点 z、共役な複素数、−z ---- */
FIGS.hcfukuso_ten=host=>mk(host,{alt:'複素数平面上の点 z と、共役な複素数、−z の位置を示す図',
  sliders:[{k:'a',label:'実部 a',min:-4,max:4,step:1,v:3},{k:'b',label:'虚部 b',min:-3,max:3,step:1,v:2}],
  draw(v){const a=v.a,b=v.b,p=cp(0,0,34).grid(1),q=a*a+b*b;
    if(q>0){p.seg(a,b,-a,-b,DSH);
      if(b)p.seg(a,b,a,-b,'stroke="var(--c)" stroke-width="1.2" stroke-dasharray="4 4"');
      if(a&&b)p.seg(a,b,0,b,DSH);
      p.seg(0,0,a,b,TG);
      const L=Math.sqrt(q);p.txt(a/2,b/2,'|z|','var(--gold)',-b/L*13,-a/L*13+4);}
    if(a)p.txt(a,0,n(a),'var(--muted)',-5,b>0?14:-7,'end',11);
    if(a&&b)p.txt(0,b,cf(0,b),'var(--muted)',a>0?-6:6,4,a>0?'end':'start',11);
    p.dot(-a,-b,'var(--muted)',4).dot(a,-b,'var(--c)').dot(a,b,'var(--gold)',5);
    if(q)p.txt(-a,-b,'−z','var(--muted)',-9,b>0?12:-6,'end');
    if(b)p.raw(ZBAR(p.sx(a)+9,p.sy(-b)+(b>0?12:-6),'var(--c)'));
    p.txt(a,b,'z','var(--gold)',9,b<0?12:-6,'start');
    return {svg:p.out(),read:`z = <b>${cf(a,b)}</b><br>|z| = √(${sq(a)} + ${sq(b)}) = ${rt(q)}<br>共役な複素数：<i>${cf(a,-b)}</i>（実軸について対称）<br>−z = ${cf(-a,-b)}（原点について対称）`};}});

/* ---- 和と差：平行四辺形 ---- */
FIGS.hcfukuso_wa=host=>mk(host,{alt:'2つの複素数の和と差を、平行四辺形で表す図',
  sliders:[{k:'m',label:'表示',min:1,max:2,step:1,v:1,fmt:m=>['和 α + β','差 β − α'][m-1]},{k:'c',label:'β の実部',min:-2,max:2,step:.5,v:-1},{k:'d',label:'β の虚部',min:-1,max:3,step:.5,v:2}],
  draw(v){const A=[2,1],B=[v.c,v.d],p=cp(0,1,32).grid(1);let read;
    if(v.m===1){const S=[A[0]+B[0],A[1]+B[1]],g=[S[0]/2,S[1]/2];
      p.poly([[0,0],A,S,B],'fill="var(--c)" fill-opacity=".1" stroke="none"').seg(A[0],A[1],S[0],S[1],DSH).seg(B[0],B[1],S[0],S[1],DSH);
      p.arr(0,0,A[0],A[1],'var(--c)').arr(0,0,B[0],B[1],'var(--ink)').arr(0,0,S[0],S[1],'var(--gold)',2.4);
      p.dot(A[0],A[1],'var(--c)',3.5).dot(B[0],B[1],'var(--ink)',3.5).dot(S[0],S[1],'var(--gold)');
      p.lab(A[0],A[1],'α','var(--c)',g[0],g[1]).lab(B[0],B[1],'β','var(--ink)',g[0],g[1]).lab(S[0],S[1],'α+β','var(--gold)',0,0,15);
      read=`α = 2 + i、β = ${cf(B[0],B[1])}<br>α + β = (2 ${sg(B[0])}) + (1 ${sg(B[1])})i<br>= <b>${cf(S[0],S[1])}</b><br>0, α, α + β, β は平行四辺形の頂点`;}
    else{const D=[B[0]-A[0],B[1]-A[1]],q=D[0]*D[0]+D[1]*D[1],L=Math.sqrt(q)||1;
      p.seg(D[0],D[1],B[0],B[1],DSH);
      p.arr(0,0,A[0],A[1],'var(--c)').arr(0,0,B[0],B[1],'var(--ink)').arr(A[0],A[1],B[0],B[1],'var(--gold)',2.4).arr(0,0,D[0],D[1],'var(--gold)',1.6,'5 3');
      p.dot(A[0],A[1],'var(--c)',3.5).dot(B[0],B[1],'var(--ink)',3.5).dot(D[0],D[1],'var(--gold)');
      p.lab(A[0],A[1],'α','var(--c)',B[0],B[1]).lab(B[0],B[1],'β','var(--ink)',A[0],A[1]).lab(D[0],D[1],'β−α','var(--gold)',0,0,15);
      // 距離の文字は、線分 αβ の、平行四辺形と反対の側に置く
      const sgn=2*D[1]-D[0]>=0?1:-1;p.txt((A[0]+B[0])/2,(A[1]+B[1])/2,'|β−α|','var(--gold)',sgn*D[1]/L*15,sgn*D[0]/L*15+4,'middle',11);
      read=`α = 2 + i、β = ${cf(B[0],B[1])}<br>β − α = (${n(B[0])} − 2) + (${n(B[1])} − 1)i = <b>${cf(D[0],D[1])}</b><br>|β − α| = √(${sq(D[0])} + ${sq(D[1])}) = ${rt(q)}<br>これが 2点 α, β の間の距離`;}
    return {svg:p.out(),read};}});

/* ---- 極形式：r と θ ---- */
FIGS.hcfukuso_kyoku=host=>mk(host,{alt:'複素数を絶対値 r と偏角 θ で表す極形式の図',
  sliders:[{k:'r',label:'絶対値 r',min:1.5,max:2.5,step:.5,v:2},{k:'k',label:'偏角 θ',min:0,max:23,step:1,v:4,fmt:AF}],play:{k:'k',from:0,to:23,label:'θ を 1 周させる',ms:4600},
  draw(v){const r=v.r,t=v.k*PI/12,[a,b]=pol(r,t),p=cp(0,0,40).grid(0),u=40;
    p.circ(0,0,r,DSH);
    if(Math.abs(b)>1e-9)p.seg(a,0,a,b,'stroke="var(--ink)" stroke-width="2.4"');
    if(Math.abs(a)>1e-9)p.seg(0,0,a,0,TC);
    p.seg(0,0,a,b,TG);
    // θ の文字は角の二等分線の上に置く。θ が π より大きいときは、r cos θ の文字と重ならないよう 60° の向きに置く
    if(v.k){p.arc(0,0,17,0,t,NG);const m=pol(1,v.k>12?PI/3:t/2),k2=v.k<3?46:v.k<6?Math.max(25,Math.min(29,a*u/Math.cos(t/2)-9)):29;p.raw(T(p.sx(0)+m[0]*k2,p.sy(0)-m[1]*k2+4,'θ','var(--gold)'));}
    // r の文字は、線分 Oz の 6 割の位置で、実軸から遠い側に置く
    const sd=(Math.cos(t)>=0)===(b>=-1e-9)?1:-1;
    p.txt(a*.6,b*.6,'r','var(--gold)',-sd*Math.sin(t)*12,-sd*Math.cos(t)*12+4);
    if(Math.abs(a)>.45)p.txt(a/2,0,'r cos θ','var(--c)',0,b>=-1e-9?14:-7,'middle',11);
    if(Math.abs(b)>.45){const inner=Math.abs(a)*u>92,right=(a>=0)!==inner;p.txt(a,b/2,'r sin θ','var(--ink)',right?6:-6,4,right?'start':'end',11);}
    p.dot(a,b,'var(--gold)',5).lab(a,b,'z','var(--gold)',0,0,14);
    const d=15*v.k;
    return {svg:p.out(),read:`r = ${n(r)}、θ = ${pif(v.k,12)}（${d}°）<br>z = ${n(r)}(cos ${pif(v.k,12)} + i sin ${pif(v.k,12)})<br>実部 ${n(r)} cos ${d}° ${eq(a)} ${n(a)}、虚部 ${n(r)} sin ${d}° ${eq(b)} ${n(b)}<br>z ${eq(a,b)} <b>${cf(a,b)}</b>`};}});

/* ---- 積：かけると回転して伸び縮みする（arg.ab があれば、w を実部・虚部で動かす） ---- */
FIGS.hcfukuso_seki=(host,arg)=>{const ab=!!(arg&&arg.ab);
  mk(host,{alt:'複素数 z に w をかけた点 zw と、相似な2つの三角形の図',
  sliders:ab?[{k:'c',label:'w の実部',min:-1,max:1,step:.5,v:1},{k:'d',label:'w の虚部',min:-1,max:1,step:.5,v:1}]
    :[{k:'r',label:'w の絶対値 r',min:.5,max:1.5,step:.1,v:1.2},{k:'k',label:'w の偏角 θ',min:-12,max:12,step:1,v:3,fmt:AF}],
  play:ab?undefined:{k:'k',from:-12,to:12,label:'θ を −π から π まで動かす',ms:4600},
  draw(v){const U=32,z=ab?[2,1]:pol(2,PI/6),w=ab?[v.c,v.d]:pol(v.r,v.k*PI/12),zw=mul(z,w),p=cp(0,0,U).grid(1,false);
    const rw=Math.hypot(w[0],w[1]),rz=Math.hypot(z[0],z[1]),tz=Math.atan2(z[1],z[0]),tw=ab?Math.atan2(w[1],w[0]):v.k*PI/12;
    p.poly([[0,0],[1,0],w],FC).poly([[0,0],z,zw],FG);
    if(rw>1e-9&&Math.abs(tw)>1e-9){p.arc(0,0,14,0,tw,NC).arc(0,0,25,tz,tz+tw,NG);}
    p.seg(0,0,z[0],z[1],'stroke="var(--ink)" stroke-width="2"').seg(0,0,zw[0],zw[1],TG);
    p.dot(1,0,'var(--muted)',3.5).dot(w[0],w[1],'var(--c)').dot(z[0],z[1],'var(--ink)').dot(zw[0],zw[1],'var(--gold)',5);
    p.txt(1,0,'1','var(--muted)',0,w[1]<-1e-9?-8:15,'middle',11);
    const near=Math.hypot(zw[0]-z[0],zw[1]-z[1])*U<24;
    if(rw>1e-9)p.lab(w[0],w[1],'w','var(--c)',Math.abs(w[0]-1)<.3&&Math.abs(w[1])<.3?1:0,0,13);
    // z と zw が近いときは、z の名前を線分 Oz の横（時計回りの側）にずらす
    if(near)p.lab(z[0],z[1],'z','var(--ink)',z[0]-z[1],z[1]+z[0],13);else p.lab(z[0],z[1],'z','var(--ink)',0,0,13);
    if(rw>1e-9)p.lab(zw[0],zw[1],'zw','var(--gold)',0,0,14);
    let read;
    if(ab){const dz=tz*180/PI,dw=tw*180/PI;
      read=rw<1e-9?`z = 2 + i、w = 0<br>zw = <b>0</b><br>0 をかけると、原点に移る`
        :`z = 2 + i、w = ${cf(w[0],w[1])}<br>zw = (2 + i)(${cf(w[0],w[1])}) = <b>${cf(zw[0],zw[1])}</b><br>|z|×|w| ≈ ${n(rz)} × ${n(rw)} ≈ ${n(rz*rw)}、|zw| ≈ <b>${n(Math.hypot(zw[0],zw[1]))}</b><br>arg z + arg w ≈ ${n(dz,1)}° ${sg(dw,1)}° = <b>${n(dz+dw,1)}°</b><br>zw の偏角も ${n(dz+dw,1)}°`;}
    else read=`w = ${n(v.r)}(cos ${an(v.k)} + i sin ${an(v.k)}) をかける<br>|zw| = |z|×|w| = 2 × ${n(v.r)} = <b>${n(2*v.r)}</b><br>arg zw = π/6 ${v.k<0?'− '+pif(-v.k,12):'+ '+pif(v.k,12)} = <b>${pif(2+v.k,12)}</b>（${dg(2+v.k)}）<br>`+(v.k%12?'△O1w と △Ozw は相似（相似比 1 : 2）':'w は実数。O, z, zw は一直線上に並ぶ');
    return {svg:p.out(),read};}});};

/* ---- なぜ：i をかけると 90° 回る ---- */
FIGS.hcfukuso_ikakeru=host=>mk(host,{alt:'複素数 z に i をくり返しかけると、原点のまわりに 90 度ずつ回ることを示す図',
  sliders:[{k:'m',label:'i をかけた回数',min:1,max:4,step:1,v:1},{k:'a',label:'z の実部 a',min:1,max:2.5,step:.5,v:2},{k:'b',label:'z の虚部 b',min:-1.5,max:1.5,step:.5,v:1}],play:{k:'m',from:1,to:4,label:'i を 4 回かける',ms:4000},
  draw(v){const a=v.a,b=v.b,m=v.m,p=cp(0,0,38).grid(1,false),R=Math.hypot(a,b),P=[[a,b],[-b,a],[-a,-b],[b,-a]],nm=['z','iz','i²z','i³z'];
    p.circ(0,0,R,DSH);
    p.poly([[0,0],[a,0],[a,b]],FG).poly([[0,0],[0,a],[-b,a]],FC);
    if(m>=2)p.poly([[0,0],[-a,0],[-a,-b]],'fill="var(--c)" fill-opacity=".08" stroke="var(--c)" stroke-width=".8"');
    if(m>=3)p.poly([[0,0],[0,-a],[b,-a]],'fill="var(--c)" fill-opacity=".08" stroke="var(--c)" stroke-width=".8"');
    // 直角の印（z と iz の間）
    const ux=a/R,uy=b/R,s=9,X=p.sx(0),Y=p.sy(0);
    p.raw(`<path d="M${f(X+ux*s)},${f(Y-uy*s)} L${f(X+(ux-uy)*s)},${f(Y-(uy+ux)*s)} L${f(X-uy*s)},${f(Y-ux*s)}" stroke="var(--muted)" stroke-width="1.2" fill="none"/>`);
    for(let k=Math.min(m,3);k>=1;k--)p.seg(0,0,P[k][0],P[k][1],TC);
    p.seg(0,0,a,b,TG);
    p.txt(a/2,0,'a','var(--gold)',0,b>=0?14:-6,'middle',11).txt(0,a/2,'a','var(--c)',b>=0?7:-7,4,b>=0?'start':'end',11);
    if(b){p.txt(a,b/2,'b','var(--gold)',7,4,'start',11).txt(-b/2,a,'b','var(--c)',0,-6,'middle',11);}
    for(let k=1;k<=Math.min(m,3);k++)p.dot(P[k][0],P[k][1],'var(--c)').lab(P[k][0],P[k][1],nm[k],'var(--c)',0,0,15);
    p.dot(a,b,'var(--gold)',5).lab(a,b,m===4?'i⁴z = z':'z','var(--gold)',0,0,m===4?26:14);
    const L=[`z = ${cf(a,b)}`,`iz = i(${cf(a,b)}) = <b>${cf(-b,a)}</b>`,`i²z = −z = <b>${cf(-a,-b)}</b>（180° 回る）`,`i³z = −iz = <b>${cf(b,-a)}</b>（270° 回る）`,`i⁴z = z（360° 回って、元に戻る）`];
    const read=m===1?`${L[0]}<br>${L[1]}<br>点 (${n(a)}, ${n(b)}) が点 (${n(-b)}, ${n(a)}) に移る<br>2つの直角三角形は合同。90° の回転<br>|iz| = |z| = ${rt(a*a+b*b)}`:L.slice(0,m+1).join('<br>').replace('</b>',`</b>（90° 回る）`);
    return {svg:p.out(),read};}});

/* ---- ド・モアブルの定理：z, z², z³, … ---- */
FIGS.hcfukuso_ruijo=host=>mk(host,{alt:'複素数 z の累乗を表す点が、偏角を等しく増やしながら並ぶ図',
  sliders:[{k:'n',label:'n（何乗まで）',min:1,max:8,step:1,v:5},{k:'k',label:'z の偏角 θ',min:1,max:6,step:1,v:2,fmt:AF},{k:'r',label:'z の絶対値 r',min:.9,max:1.1,step:.05,v:1.1}],play:{k:'n',from:1,to:8,label:'z を 8 乗までかけていく',ms:4800},
  draw(v){const r=v.r,t=v.k*PI/12,N=v.n,p=cp(0,0,46).grid(1,false),P=[[1,0]];
    for(let j=1;j<=N;j++)P.push(pol(Math.pow(r,j),j*t));
    p.circ(0,0,1,'stroke="var(--muted)" stroke-width="1" fill="none"');
    for(let j=1;j<=N;j++)p.seg(0,0,P[j][0],P[j][1],'stroke="var(--muted)" stroke-width=".9" opacity=".7"');
    for(let j=1;j<=N;j++)p.seg(P[j-1][0],P[j-1][1],P[j][0],P[j][1],NC);
    p.seg(0,0,P[N][0],P[N][1],TG).arc(0,0,11,0,N*t,NG,1.6);
    p.dot(1,0,'var(--muted)',3.5).txt(1,0,'1','var(--muted)',7,14,'middle',11);
    const done=[];
    for(let j=1;j<=N;j++){const X=p.sx(P[j][0]),Y=p.sy(P[j][1]),hit=done.some(q=>Math.hypot(q[0]-X,q[1]-Y)<19);
      p.dot(P[j][0],P[j][1],j===N?'var(--gold)':'var(--c)',j===N?5:3.8);
      if(j===N)p.lab(P[j][0],P[j][1],'z'+(j>1?sup(j):''),'var(--gold)',0,0,hit?27:14);
      else if(!hit){p.lab(P[j][0],P[j][1],'z'+(j>1?sup(j):''),'var(--c)',0,0,13,11);done.push([X,Y]);}}
    const [x,y]=P[N],e=N>1?sup(N):'',ab=Math.pow(r,N);
    return {svg:p.out(),read:`z = ${r===1?'':n(r)+'('}cos ${pif(v.k,12)} + i sin ${pif(v.k,12)}${r===1?'':')'}<br>z${e} の絶対値：${r===1?'1':N===1?n(r):n(r)+e+' '+eq(ab)+' '+n(ab)}<br>z${e} の偏角：${N>1?N+' × '+pif(v.k,12)+' = ':''}<b>${pif(N*v.k,12)}</b>（${15*N*v.k}°）<br>z${e} ${eq(x,y)} <b>${cf(x,y)}</b>`};}});

/* ---- n 乗根：zⁿ = α（|α| = 1）の解 ---- */
FIGS.hcfukuso_kon=host=>mk(host,{alt:'絶対値 1 の複素数 α の n 乗根が、単位円を n 等分する点に並ぶ図',
  sliders:[{k:'n',label:'n',min:2,max:6,step:1,v:3},{k:'k',label:'α の偏角',min:0,max:23,step:1,v:6,fmt:AF}],play:{k:'k',from:0,to:23,label:'α を 1 周させる',ms:5200},
  draw(v){const N=v.n,ph=v.k*PI/12,p=cp(0,0,80).grid(1),al=pol(1,ph),Z=[];
    for(let j=0;j<N;j++)Z.push(pol(1,(ph+2*PI*j)/N));
    p.circ(0,0,1,'stroke="var(--muted)" stroke-width="1.2" fill="none"').poly(Z,FC);
    p.seg(0,0,al[0],al[1],NG).seg(0,0,Z[0][0],Z[0][1],NC);
    if(v.k){p.arc(0,0,34,0,ph,NG).arc(0,0,20,0,ph/N,NC);}
    Z.forEach((q,j)=>p.dot(q[0],q[1],'var(--c)').lab(q[0],q[1],'z'+sub(j),'var(--c)',0,0,15));
    // α の名前は、解の名前と重なるときは、その外側に書く
    const hit=Z.some(q=>Math.hypot(q[0]-al[0],q[1]-al[1])*80<30);
    p.dot(al[0],al[1],'var(--gold)',5).lab(al[0],al[1],'α','var(--gold)',0,0,hit?32:15);
    const list=Z.map((q,j)=>pif(v.k+24*j,12*N));
    return {svg:p.out(),read:`zⁿ = α（|α| = 1、arg α = ${pif(v.k,12)}）、n = ${N}<br>解の偏角：<b>${list.slice(0,3).join('、')}</b>${N>3?'、<br><b>'+list.slice(3).join('、')+'</b>':''}<br>1つ目は ${pif(v.k,12)} ÷ ${N} = ${pif(v.k,12*N)}<br>そこから ${pif(2,N)} ずつ進む`};}});

/* ---- なぜ：1 の n 乗根と正 n 角形 ---- */
FIGS.hcfukuso_ichi=host=>mk(host,{alt:'1 の n 乗根が、単位円に内接する正 n 角形の頂点に並ぶ図',
  sliders:[{k:'n',label:'n',min:2,max:12,step:1,v:5},{k:'k',label:'k（何番目の解か）',min:0,max:12,step:1,v:1}],play:{k:'k',from:0,to:12,label:'k を 0 から増やす',ms:5200},
  draw(v){const N=v.n,k=v.k,j0=k%N,p=cp(0,0,84).grid(1),Z=[];
    for(let j=0;j<N;j++)Z.push(pol(1,2*PI*j/N));
    p.circ(0,0,1,'stroke="var(--muted)" stroke-width="1.2" fill="none"').poly(Z,FC);
    Z.forEach(q=>p.seg(0,0,q[0],q[1],'stroke="var(--muted)" stroke-width=".8" opacity=".7"'));
    p.seg(0,0,Z[j0][0],Z[j0][1],TG);
    if(k)p.arc(0,0,14,0,2*PI*k/N,NG,1.05);
    Z.forEach((q,j)=>{p.dot(q[0],q[1],j===j0?'var(--gold)':'var(--c)',j===j0?5.5:4).lab(q[0],q[1],'z'+sub(j),j===j0?'var(--gold)':'var(--c)',0,0,15,N>8?11:12);});
    const [x,y]=Z[j0],d=360*k/N;
    return {svg:p.out(),read:`zⁿ = 1（n = ${N}）の解は ${N} 個<br>k = ${k}：偏角 ${k} × ${pif(2,N)} = <b>${pif(2*k,N)}</b>（${n(d,1)}°）<br>`+(k>=N?`1周して、k = ${j0} と同じ点 z${sub(j0)} ${eq(x,y)} ${cf(x,y)}`:`z${sub(j0)} ${eq(x,y)} <b>${cf(x,y)}</b>`)+`<br>となり合う解の偏角の差は ${pif(2,N)}（${n(360/N,1)}°）`};}});

/* ---- 距離の比が一定の点：|z + 2| = k|z − 1| ---- */
FIGS.hcfukuso_kiseki=host=>mk(host,{alt:'2点 A, B からの距離の比が一定である点 z の集まりが、円または垂直二等分線になる図',
  sliders:[{k:'k',label:'k（距離の比）',min:.4,max:3,step:.1,v:2},{k:'t',label:'点 z の位置',min:-1,max:1,step:.05,v:.55}],play:{k:'t',from:-1,to:1,label:'z を図形の上で動かす',ms:3600},
  draw(v){const k=v.k,t=v.t,p=cp(.5,0,34).grid(1),line=Math.abs(k-1)<1e-9;let z,c0=0,R=0,pi=-.5,pe=null;
    if(line){z=[-.5,3*t];p.seg(-.5,-4,-.5,4,TC);}
    else{c0=(k*k+2)/(k*k-1);R=3*k/Math.abs(k*k-1);pi=(k-2)/(k+1);pe=(k+2)/(k-1);const ph=t*Math.min(PI,3/R);
      z=k>1?[c0-R*Math.cos(ph),R*Math.sin(ph)]:[c0+R*Math.cos(ph),R*Math.sin(ph)];p.circ(c0,0,R,TC);}
    const d1=Math.hypot(z[0]+2,z[1]),d2=Math.hypot(z[0]-1,z[1]);
    p.seg(-2,0,z[0],z[1],TG).seg(1,0,z[0],z[1],'stroke="var(--ink)" stroke-width="2"');
    p.dot(pi,0,'var(--c)',3.2);if(pe!==null&&Math.abs(pe-.5)<5.2)p.dot(pe,0,'var(--c)',3.2);
    p.dot(-2,0,'var(--gold)',4).dot(1,0,'var(--ink)',4).dot(z[0],z[1],'var(--gold)',5);
    p.txt(-2,0,'A(−2)','var(--gold)',0,z[1]<0?-9:17).txt(1,0,'B(1)','var(--ink)',0,z[1]<0?-9:17);
    p.txt(z[0],z[1],'z','var(--gold)',0,z[1]<0?17:-9);
    return {svg:p.out(),read:`|z + 2| = k|z − 1|、k = ${n(k)}<br>|z + 2| ${eq(d1)} <b>${n(d1)}</b>、|z − 1| ${eq(d2)} ${n(d2)}<br>比 |z + 2| ÷ |z − 1| = <b>${n(d1/d2)}</b><br>`+(line?'図形：線分 AB の垂直二等分線':`図形：点 ${n(c0)} を中心とする半径 ${n(R)} の円`)};}});

/* ---- w = (1 + i)z + 2：円が円に移る ---- */
FIGS.hcfukuso_utsusu=host=>mk(host,{alt:'単位円上の点 z に対して、w = (1 + i)z + 2 が別の円の上を動く図',
  sliders:[{k:'k',label:'z の偏角 θ',min:0,max:24,step:1,v:2,fmt:AF}],play:{k:'k',from:0,to:24,label:'z を 1 周させる',ms:4800},
  draw(v){const t=v.k*PI/12,z=pol(1,t),m=mul([1,1],z),w=[m[0]+2,m[1]],p=cp(1,0,56).grid(1);
    p.circ(0,0,1,'stroke="var(--ink)" stroke-width="1.6" fill="none"').circ(0,0,Math.SQRT2,DSH).circ(2,0,Math.SQRT2,TC);
    p.seg(0,0,z[0],z[1],'stroke="var(--ink)" stroke-width="1.4"').seg(0,0,m[0],m[1],DSH).arr(m[0],m[1],w[0],w[1],'var(--muted)',1.4).seg(2,0,w[0],w[1],NG);
    p.dot(2,0,'var(--c)',3.5).dot(m[0],m[1],'var(--muted)',3.5).dot(z[0],z[1],'var(--ink)').dot(w[0],w[1],'var(--gold)',5);
    p.txt(1,0,'1','var(--muted)',-8,14,'middle',11).txt(2,0,'2','var(--c)',0,w[1]<0?-8:15,'middle',11);
    p.lab(z[0],z[1],'z','var(--ink)',0,0,12).lab(w[0],w[1],'w','var(--gold)',2,0,14);
    return {svg:p.out(),read:`z = cos θ + i sin θ（θ = ${pif(v.k,12)}）<br>(1 + i)z：π/4 回転して √2 倍（点線の円の上）<br>+ 2：実軸の方向に 2 だけ平行移動<br>w ${eq(w[0],w[1])} <b>${cf(w[0],w[1])}</b>、|w − 2| = √2 ≈ 1.41`};}});

/* ---- 点 A のまわりの回転と、半直線のなす角 ---- */
FIGS.hcfukuso_mawari=host=>mk(host,{alt:'点 B を点 A のまわりに回転し、A からの距離を r 倍した点 C の図',
  sliders:[{k:'k',label:'回転の角 θ',min:-12,max:12,step:1,v:4,fmt:AF},{k:'r',label:'r（AC ÷ AB）',min:.5,max:1.4,step:.1,v:1}],play:{k:'k',from:-12,to:12,label:'θ を −π から π まで動かす',ms:4800},
  draw(v){const U=30,A=[1,1],B=[3,2],t=v.k*PI/12,w=pol(v.r,t),d=mul([2,1],w),C=[A[0]+d[0],A[1]+d[1]],p=cp(1,1,U).grid(1,false),t0=Math.atan2(1,2);
    p.circ(A[0],A[1],Math.sqrt(5),DSH).poly([A,B,C],'fill="var(--c)" fill-opacity=".12" stroke="none"');
    p.seg(B[0],B[1],C[0],C[1],DSH).seg(A[0],A[1],B[0],B[1],'stroke="var(--ink)" stroke-width="2.2"').seg(A[0],A[1],C[0],C[1],TG);
    if(v.k)p.arc(A[0],A[1],20,t0,t0+t,NG);
    p.dot(A[0],A[1],'var(--c)').dot(B[0],B[1],'var(--ink)').dot(C[0],C[1],'var(--gold)',5);
    const g=[(A[0]+B[0]+C[0])/3,(A[1]+B[1]+C[1])/3],near=Math.hypot(C[0]-B[0],C[1]-B[1])*U<30,flat=Math.abs(Math.sin(t))<1e-9;
    p.lab(A[0],A[1],'A(α)','var(--c)',flat?A[0]:g[0],flat?A[1]+(v.k<0?-1:1):g[1],flat?17:19);
    // B と C が近いときは、名前を線分 AB の両側に分けて書く
    if(near){const sc=v.k>=0?1:-1,nx=-sc/Math.sqrt(5),ny=2*sc/Math.sqrt(5);p.lab(B[0],B[1],'B(β)','var(--ink)',B[0]+nx,B[1]+ny,17).lab(C[0],C[1],'C(γ)','var(--gold)',C[0]-nx,C[1]-ny,17);}
    else p.lab(B[0],B[1],'B(β)','var(--ink)',A[0],A[1],19).lab(C[0],C[1],'C(γ)','var(--gold)',A[0],A[1],19);
    const q=v.r===1?'':n(v.r),note=flat?'<br>実数なので、A, B, C は一直線上':Math.abs(Math.cos(t))<1e-9?'<br>純虚数なので、AB ⊥ AC':'';
    return {svg:p.out(),read:`(γ − α)/(β − α) = ${q}${q?'(':''}cos ${an(v.k)} + i sin ${an(v.k)}${q?')':''}<br>${eq(w[0],w[1])} <b>${cf(w[0],w[1])}</b><br>AC ÷ AB = ${n(v.r)}、回転の角 ${pif(v.k,12)}（${dg(v.k)}）<br>γ ${eq(C[0],C[1])} ${cf(C[0],C[1])}`+note};}});

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
const Q={
 kaku:{alt:'複素数平面上の3点 A(1+i), B(3+2i), C(2+4i) を頂点とする三角形の図',h:220,f(){const p=cp(2,2.1,42,220).grid(2),A=[1,1],B=[3,2],C=[2,4],t0=Math.atan2(1,2),t1=Math.atan2(3,1);
   p.poly([A,B,C],'fill="var(--c)" fill-opacity=".12" stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round"').arc(1,1,22,t0,t1,NG);
   const m=pol(1,(t0+t1)/2);p.raw(T(p.sx(1)+m[0]*34,p.sy(1)-m[1]*34+4,'θ','var(--gold)'));
   p.dot(1,1).dot(3,2).dot(2,4);p.txt(1,1,'A(1 + i)','var(--ink)',-8,14,'middle').txt(3,2,'B(3 + 2i)','var(--ink)',10,4,'start').txt(2,4,'C(2 + 4i)','var(--ink)',10,2,'start');
   return {svg:p.out(),read:'∠BAC = θ を、(γ − α)/(β − α) の偏角として求める'};}},
 saidai:{alt:'点 3 を中心とする半径 1 の円と、点 4i、および円の中心と点 4i を通る直線の図',h:230,f(){const p=cp(1.9,1.55,36,230).grid(2),N=[2.4,.8],F=[3.6,-.8];
   p.seg(0,4,3.9,-1.2,DSH).circ(3,0,1,TC).seg(0,4,N[0],N[1],NG);
   p.dot(3,0,'var(--c)',3.5).dot(0,4,'var(--ink)').dot(N[0],N[1],'var(--gold)').dot(F[0],F[1],'var(--gold)');
   p.txt(0,4,'P(4i)','var(--ink)',10,4,'start').txt(3,0,'C(3)','var(--c)',8,-8,'start',11).txt(N[0],N[1],'近い点','var(--gold)',-8,12,'end',11).txt(F[0],F[1],'遠い点','var(--gold)',10,6,'start',11);
   return {svg:p.out(),read:'|z − 3| = 1 は、点 C(3) を中心とする半径 1 の円<br>|z − 4i| は、点 P(4i) から点 z までの距離'};}},
 seisankaku:{alt:'2点 A(2), B(4+2i) を2つの頂点とする、2つの正三角形の図',h:226,f(){const p=cp(3,1,40,226).grid(2),A=[2,0],B=[4,2],r3=Math.sqrt(3),C1=[3-r3,1+r3],C2=[3+r3,1-r3];
   p.poly([A,B,C1],FG).poly([A,B,C2],FC).seg(A[0],A[1],B[0],B[1],'stroke="var(--ink)" stroke-width="2.2"');
   p.dot(A[0],A[1]).dot(B[0],B[1]).dot(C1[0],C1[1],'var(--gold)').dot(C2[0],C2[1],'var(--c)');
   p.txt(A[0],A[1],'A(2)','var(--ink)',-8,-8,'end').txt(B[0],B[1],'B(4 + 2i)','var(--ink)',9,-6,'start').txt(C1[0],C1[1],'C','var(--gold)',-10,2,'end').txt(C2[0],C2[1],'C′','var(--c)',10,6,'start');
   return {svg:p.out(),read:'B を A のまわりに π/3 回した点 C と、−π/3 回した点 C′'};}},
 heiko:{alt:'原点 O と3点 A(−1+2i), B(2−i), C を頂点とする平行四辺形の図',h:214,f(){const p=cp(.6,.6,46,214).grid(2),A=[-1,2],B=[2,-1],C=[1,1];
   p.poly([[0,0],A,C,B],'fill="var(--c)" fill-opacity=".12" stroke="none"').seg(A[0],A[1],C[0],C[1],DSH).seg(B[0],B[1],C[0],C[1],DSH).seg(A[0],A[1],B[0],B[1],NG);
   p.arr(0,0,A[0],A[1],'var(--ink)').arr(0,0,B[0],B[1],'var(--ink)');
   p.dot(A[0],A[1]).dot(B[0],B[1]).dot(C[0],C[1],'var(--gold)');
   p.txt(A[0],A[1],'A(−1 + 2i)','var(--ink)',-4,-9,'middle').txt(B[0],B[1],'B(2 − i)','var(--ink)',9,4,'start').txt(C[0],C[1],'C','var(--gold)',10,-6,'start');
   return {svg:p.out(),read:'金色の線分が AB。点線は、平行四辺形 OACB の残りの2辺'};}}
};
FIGS.hcfukuso_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){return q.f();}});};
})();
