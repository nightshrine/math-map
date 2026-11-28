/* 数学C「ベクトル」の図（FIGS.hcvector_*）。動かせる図と、問題に付ける図（hcvector_q） */
(function(){
const {plot,n,sg,mk}=FIG;
const f=v=>v.toFixed(1),rad=d=>d*Math.PI/180;
const CC='var(--c)',GG='var(--gold)',IK='var(--ink)',MU='var(--muted)',NG='var(--ng)';
const INK='stroke="var(--ink)" stroke-width="1.6" fill="none" stroke-linejoin="round"';
const SUB='stroke="var(--muted)" stroke-width="1.2" fill="none"';
const DSH='stroke="var(--muted)" stroke-width="1.2" fill="none" stroke-dasharray="4 4"';
const GD='stroke="var(--gold)" stroke-width="1.6" fill="none" stroke-dasharray="5 4"';
const LAT='stroke="var(--line)" stroke-width="1" fill="none"';
const FC='fill="var(--c)" fill-opacity=".18" stroke="none"',FG='fill="var(--gold)" fill-opacity=".2" stroke="none"';
const HV=c=>`stroke="${c}" stroke-width="2.6" fill="none" stroke-linecap="round"`;
const add=(P,Q)=>[P[0]+Q[0],P[1]+Q[1]],sub=(P,Q)=>[P[0]-Q[0],P[1]-Q[1]];
const mid=(P,Q,t=.5)=>[P[0]+(Q[0]-P[0])*t,P[1]+(Q[1]-P[1])*t];
const un=(P,Q)=>{const x=Q[0]-P[0],y=Q[1]-P[1],l=Math.hypot(x,y);return l<1e-9?[0,0]:[x/l,y/l];};
const cen=ps=>[ps.reduce((s,p)=>s+p[0],0)/ps.length,ps.reduce((s,p)=>s+p[1],0)/ps.length];
const cross=(A,B,C,D)=>{const a=B[0]-A[0],b=B[1]-A[1],c=D[0]-C[0],e=D[1]-C[1],t=((C[0]-A[0])*e-(C[1]-A[1])*c)/(a*e-b*c);return [A[0]+a*t,A[1]+b*t];};
// 文字（線に重なっても読めるよう、地の色でふちどる）
const tx=(P,t,c=IK,s=12,a='middle')=>`<text x="${f(P[0])}" y="${f(P[1])}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`;
// ベクトルの名前。~a は a の上に矢印、~{AB} は AB の上に矢印を付ける（英数字と記号だけ。等幅として位置を決める）
const vt=(P,str,c=IK,s=12,a='middle')=>{const ch=[],ov=[];
  for(let i=0;i<str.length;i++){if(str[i]==='~'){if(str[i+1]==='{'){const j=str.indexOf('}',i);ov.push([ch.length,ch.length+j-i-2]);ch.push(...str.slice(i+2,j));i=j;}else{ov.push([ch.length,ch.length+1]);ch.push(str[i+1]);i++;}}else ch.push(str[i]);}
  const cw=s*.6,w=ch.length*cw,x0=a==='middle'?P[0]-w/2:a==='end'?P[0]-w:P[0];
  let o=`<text x="${f(x0)}" y="${f(P[1])}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" textLength="${f(w)}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${ch.join('')}</text>`;
  ov.forEach(([i,j])=>{const xa=x0+i*cw+.8,xb=x0+j*cw-.2,y=P[1]-s*.9;o+=`<path d="M${f(xa)},${f(y)} H${f(xb)} M${f(xb-2.6)},${f(y-2.1)} L${f(xb)},${f(y)} L${f(xb-2.6)},${f(y+2.1)}" fill="none" stroke="${c}" stroke-width="1"/>`;});
  return o;};
const ln=(P,Q,st=INK)=>`<line x1="${f(P[0])}" y1="${f(P[1])}" x2="${f(Q[0])}" y2="${f(Q[1])}" ${st}/>`;
const dot=(P,c=IK,r=3.5)=>`<circle cx="${f(P[0])}" cy="${f(P[1])}" r="${r}" fill="${c}" stroke="var(--bg2)" stroke-width="1.2"/>`;
const pg=(ps,st=INK)=>`<polygon points="${ps.map(q=>f(q[0])+','+f(q[1])).join(' ')}" ${st}/>`;
// 矢印（ベクトル）。P から Q へ。dash は点線の刻み
const arw=(P,Q,c=CC,w=2.4,dash='')=>{const l=Math.hypot(Q[0]-P[0],Q[1]-P[1]);if(l<1)return dot(P,c,3);
  const u=un(P,Q),h=Math.min(10,l*.5),k=h*.42,B=[Q[0]-u[0]*h,Q[1]-u[1]*h];
  return `<line x1="${f(P[0])}" y1="${f(P[1])}" x2="${f(B[0]+u[0])}" y2="${f(B[1]+u[1])}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''}/>`+
    `<polygon points="${f(Q[0])},${f(Q[1])} ${f(B[0]-u[1]*k)},${f(B[1]+u[0]*k)} ${f(B[0]+u[1]*k)},${f(B[1]-u[0]*k)}" fill="${c}"/>`;};
// 線分 PQ の途中（t）から、点 G と反対の側へ k だけ離れた位置（文字を置く場所）
const off=(P,Q,G,k=12,t=.5)=>{const m=mid(P,Q,t),u=un(P,Q);let x=-u[1],y=u[0];if((m[0]-G[0])*x+(m[1]-G[1])*y<0){x=-x;y=-y;}return [m[0]+x*k,m[1]+y*k+4];};
// 角の印：中心 O、半径 r、角度 a0 から a1（度。右向きが 0、反時計回りが正）
const arc=(O,r,a0,a1,st='stroke="var(--gold)" stroke-width="1.6" fill="none"')=>{const p=a=>[O[0]+r*Math.cos(rad(a)),O[1]-r*Math.sin(rad(a))],A=p(a0),B=p(a1);
  return `<path d="M${f(A[0])},${f(A[1])} A${r},${r} 0 ${Math.abs(a1-a0)>180?1:0} ${a1>a0?0:1} ${f(B[0])},${f(B[1])}" ${st}/>`;};
// 直角の印：頂点 P、2辺の向きが Q, R
const rt=(P,Q,R,s=8,st=SUB)=>{const u=un(P,Q),w=un(P,R);return `<path d="M${f(P[0]+u[0]*s)},${f(P[1]+u[1]*s)} L${f(P[0]+(u[0]+w[0])*s)},${f(P[1]+(u[1]+w[1])*s)} L${f(P[0]+w[0]*s)},${f(P[1]+w[1]*s)}" ${st}/>`;};
const tick=(P,Q,k=1,st=SUB)=>{const m=mid(P,Q),u=un(P,Q);let o='';for(let i=0;i<k;i++){const d=(i-(k-1)/2)*4,x=m[0]+u[0]*d,y=m[1]+u[1]*d;o+=ln([x-u[1]*5,y+u[0]*5],[x+u[1]*5,y-u[0]*5],st);}return o;};
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
// 分数 p/q を約分して文字にする
const fr=(p,q)=>{if(q<0){p=-p;q=-q;}const g=gcd(Math.abs(p),q)||1;p/=g;q/=g;return (p<0?'−':'')+(q===1?Math.abs(p):Math.abs(p)+'/'+q);};
const par=v=>v<0?`(${n(v)})`:n(v);
// √q を a√b の形にする
const simp=q=>{let a=1;for(let i=2;i*i<=q;i++)while(q%(i*i)===0){q/=i*i;a*=i;}return [a,q];};
const root=q=>{if(Math.abs(q)<1e-9)return '0';if(!Number.isInteger(q)){const r=Math.sqrt(q);return `√${n(q,4)} ${Math.abs(r*100-Math.round(r*100))<1e-9?'=':'≈'} ${n(r)}`;}const [a,b]=simp(q);return b===1?`√${q} = ${a}`:(a===1?`√${q}`:`√${q} = ${a}√${b}`)+` ≈ ${n(Math.sqrt(q))}`;};
// ax + by + c = 0 の形に書く（norm のときは、係数を最大公約数で割り、最初の係数を正にする）
const lin=(a,b,c,norm)=>{if(norm){const g=gcd(gcd(Math.abs(a),Math.abs(b)),Math.abs(c))||1,sgn=(a||b)<0?-1:1;a=a/g*sgn;b=b/g*sgn;c=c/g*sgn;}
  let o='';const term=(k,x)=>{if(!k)return;const m=Math.abs(k)===1&&x?'':n(Math.abs(k));o+=(o?(k<0?' − ':' + '):(k<0?'−':''))+m+x;};term(a,'x');term(b,'y');term(c,'');return o+' = 0';};
const STEP=(k=4)=>({sliders:[{k:'s',label:'手順',min:1,max:k,step:1,v:1}],play:{k:'s',from:1,to:k,label:'順に見る',ms:1100*k}});
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));

/* ---- 和と差 ---- */
FIGS.hcvector_wa=host=>mk(host,{alt:'2つのベクトルの和と差を、矢印をつないで作る図',
  sliders:[{k:'m',label:'表示',min:1,max:2,step:1,v:1,fmt:m=>['和','差'][m-1]},{k:'t',label:'b の向き（度）',min:20,max:160,step:5,v:65},{k:'r',label:'b の大きさ',min:1,max:3,step:.5,v:2}],
  draw(v){const u=36,sum=v.m===1,O=sum?[116,176]:[116,128],co=Math.cos(rad(v.t)),si=Math.sin(rad(v.t)),b=[v.r*u*co,-v.r*u*si],A=[O[0]+3*u,O[1]],B=add(O,b);let s='',read;
    if(sum){const K=add(A,b);
      s+=ln(B,K,DSH)+arw(A,K,CC,1.6,'5 4')+arw(O,A,CC)+arw(O,B,CC)+arw(O,K,GG,2.8);
      s+=vt([O[0]+54,O[1]+17],'~a',CC)+vt(off(O,B,A,13),'~b',CC)+vt(off(A,K,O,13),'~b',CC)+vt(off(O,K,A,13,.6),'~a+~b',GG);
      read=`|a| = 3、|b| = ${n(v.r)}<br>|a + b| = <b>${n(Math.hypot(3+v.r*co,v.r*si))}</b><br>a の終点に b をつぎ足すと<br>始点から終点までが a + b（金色）<br>|a| + |b| = ${n(3+v.r)} より長くはならない`;}
    else{const D=sub(A,b);
      s+=arw(A,D,CC,1.6,'5 4')+arw(O,D,GG,1.6,'5 4')+arw(O,A,CC)+arw(O,B,CC)+arw(B,A,GG,2.8);
      s+=vt([A[0]+11,A[1]+4],'~a',CC)+vt(off(O,B,A,13),'~b',CC)+vt(off(A,D,O,16),'−~b',CC)+vt(off(B,A,O,13),'~a−~b',GG);
      read=`|a| = 3、|b| = ${n(v.r)}<br>|a − b| = <b>${n(Math.hypot(3-v.r*co,v.r*si))}</b><br>金色は、b の終点から a の終点へ向かう<br>b + (a − b) = a になっている<br>点線の金色は a + (−b)。同じベクトル`;}
    s+=tx([O[0]-9,O[1]+14],'O',MU,11);
    return {svg:s,read};}});

/* ---- 実数倍と分解：p = s a + t b。arg.range のときは、s + t と点 P の存在範囲を見る ---- */
FIGS.hcvector_bunkai=(host,arg)=>{const rg=!!(arg&&arg.range),lo=rg?-.5:-1,hi=rg?1.5:2;
  mk(host,{alt:rg?'s と t を動かして、点 P が直線 AB や三角形 OAB のどこにあるかを見る図':'平行でない2つのベクトルの実数倍の和で、平面上の点を表す図',
  sliders:[{k:'s',label:'s',min:lo,max:hi,step:.25,v:rg?.5:1.5},{k:'t',label:'t',min:lo,max:hi,step:.25,v:rg?.5:1}],
  draw(v){const O=rg?[95,188]:[110,168],a=rg?[110,-18]:[72,-12],b=rg?[40,-96]:[24,-60],pt=(s,t)=>[O[0]+a[0]*s+b[0]*t,O[1]+a[1]*s+b[1]*t];let s='';
    for(let k=lo;k<=hi+1e-9;k+=rg?.5:1)s+=ln(pt(lo,k),pt(hi,k),LAT)+ln(pt(k,lo),pt(k,hi),LAT);
    const A=pt(1,0),B=pt(0,1),P=pt(v.s,v.t),Sa=pt(v.s,0),Tb=pt(0,v.t);
    if(rg)s+=pg([O,A,B],FC)+ln(pt(1.5,-.5),pt(-.5,1.5),GD);
    s+=ln(pt(lo,0),pt(hi,0),SUB)+ln(pt(0,lo),pt(0,hi),SUB)+ln(Sa,P,DSH)+ln(Tb,P,DSH)+arw(O,A,CC)+arw(O,B,CC)+arw(O,P,IK,2)+dot(Sa,GG,3.5)+dot(Tb,GG,3.5)+dot(P,GG,4.5);
    s+=rg?tx([A[0]+3,A[1]-9],'A')+tx([B[0]+10,B[1]+2],'B'):vt([A[0]+3,A[1]-9],'~a',CC)+vt([B[0]+11,B[1]+2],'~b',CC);
    const near=(U,W)=>Math.hypot(U[0]-W[0],U[1]-W[1])<27;
    if(v.s&&(v.s!==1||rg))s+=vt([Sa[0]+4,Sa[1]+17],n(v.s)+(rg?' ~{OA}':'~a'),GG,11);
    if(v.t&&(v.t!==1||rg))s+=vt([Tb[0]-8,Tb[1]+4],n(v.t)+(rg?' ~{OB}':'~b'),GG,11,'end');
    s+=tx(near(P,B)?[P[0]+25,P[1]+4]:near(P,A)?[P[0]+14,P[1]+5]:[P[0]+10,P[1]-8],'P')+tx([O[0]-10,O[1]+14],'O',MU,11);
    let read;const sm=v.s+v.t;
    if(!rg)read=`p = <b>${n(v.s)}</b> a + <b>${n(v.t)}</b> b<br>s, t を決めると、点 P が1つ決まる<br>点 P を決めると、s, t の組も1つに決まる`;
    else read=`OP = ${n(v.s)} OA + ${n(v.t)} OB<br>s + t = <b>${n(sm)}</b><br>`+(Math.abs(sm-1)<1e-9?(v.s>=0&&v.t>=0?'s + t = 1、s ≧ 0、t ≧ 0<br>→ P は線分 AB 上':'s + t = 1 → P は直線 AB 上<br>（線分 AB の外）'):(v.s>=0&&v.t>=0&&sm<1?'s ≧ 0、t ≧ 0、s + t ≦ 1<br>→ P は △OAB の周か内部':'P は △OAB の外部<br>（直線 AB 上でもない）'));
    return {svg:s,read};}});};

/* ---- 成分と大きさ ---- */
FIGS.hcvector_seibun=host=>mk(host,{alt:'原点を始点とするベクトルと、その x 成分・y 成分の図',
  sliders:[{k:'a',label:'x 成分 a₁',min:-4,max:5,step:.5,v:4},{k:'b',label:'y 成分 a₂',min:-3,max:3,step:.5,v:3}],
  draw(v){const p=plot([-4.6,5.4,-3.675,3.675]).grid(),O=[p.sx(0),p.sy(0)],A=[p.sx(v.a),p.sy(v.b)],H=[A[0],O[1]],q=v.a*v.a+v.b*v.b,u=un(O,A);let s=p.out();
    s+=ln(O,H,HV(CC))+ln(H,A,HV(CC))+arw(O,A,GG,2.8);
    if(v.a)s+=tx([(O[0]+H[0])/2,O[1]+(v.b>=0?27:-8)],n(v.a),CC);
    if(v.b){const rs=v.a>=0?v.a<4.5:v.a<=-3.5;s+=tx([A[0]+(rs?9:-9),(O[1]+A[1])/2+4],n(v.b),CC,12,rs?'start':'end');}
    if(q)s+=vt(off(O,A,H,13),'~a',GG);
    s+=tx([clamp(A[0]+u[0]*18,46,294),clamp(A[1]+u[1]*16+4,14,244)],`(${n(v.a)}, ${n(v.b)})`,IK,11);
    return {svg:s,read:`a = (${n(v.a)}, ${n(v.b)})<br>|a|² = ${par(v.a)}² + ${par(v.b)}² = ${n(q,4)}<br>|a| = <b>${root(q)}</b><br>横に ${n(v.a)}、縦に ${n(v.b)} 進む矢印`};}});

/* ---- 2点を結ぶベクトルの成分 ---- */
FIGS.hcvector_ab=host=>mk(host,{alt:'2点 A, B を結ぶベクトルと、始点を原点に移した同じベクトルの図',
  sliders:[{k:'p',label:'A の x 座標',min:-1,max:2,step:1,v:1},{k:'x',label:'B の x 座標',min:-2,max:4,step:1,v:4},{k:'y',label:'B の y 座標',min:-2,max:3,step:1,v:3}],
  draw(v){const p=plot([-4.6,5.4,-3.675,3.675]).grid(),X=p.sx,Y=p.sy,O=[X(0),Y(0)],A=[X(v.p),Y(1)],B=[X(v.x),Y(v.y)],dx=v.x-v.p,dy=v.y-1,D=[X(dx),Y(dy)],K=[B[0],A[1]],q=dx*dx+dy*dy;let s=p.out();
    s+=arw(O,D,GG,1.6,'5 4')+ln(A,K,DSH)+ln(K,B,DSH)+arw(A,B,GG,2.8)+dot(A)+dot(B);
    if(dx)s+=tx([(A[0]+B[0])/2,A[1]+(dy>=0?15:-8)],n(dx),CC);
    if(dy)s+=tx([B[0]+(dx>=0?8:-8),(A[1]+B[1])/2+4],n(dy),CC,12,dx>=0?'start':'end');
    s+=tx([A[0]+(dx>=0?-10:10),A[1]+(dy>=0?15:-8)],'A')+tx([B[0]+(dx>=0?10:-10),B[1]+(dy>=0?-7:15)],'B');
    return {svg:s,read:`A(${n(v.p)}, 1)、B(${n(v.x)}, ${n(v.y)})<br>AB = (${n(v.x)} − ${par(v.p)}, ${n(v.y)} − 1)<br>= <b>(${n(dx)}, ${n(dy)})</b><br>|AB| = ${root(q)}<br>点線は、始点を O に移した同じベクトル`};}});

/* ---- 内積と正射影 ---- */
FIGS.hcvector_naiseki=host=>mk(host,{alt:'ベクトル b の先から a をふくむ直線に垂線を下ろし、影の長さと内積を表す図',
  sliders:[{k:'t',label:'なす角 θ（度）',min:0,max:180,step:5,v:60},{k:'b',label:'|b|',min:1,max:4,step:.5,v:3},{k:'a',label:'|a|',min:2,max:5,step:1,v:4}],play:{k:'t',from:0,to:180,label:'θ を 0° から 180° まで動かす',ms:4200},
  draw(v){const u=32,O=[146,178],A=[O[0]+v.a*u,O[1]],co=Math.cos(rad(v.t)),si=Math.sin(rad(v.t)),B=[O[0]+v.b*u*co,O[1]-v.b*u*si],H=[B[0],O[1]],pr=v.b*co,ip=v.a*pr,far=Math.abs(H[0]-O[0])>13;let s='';
    s+=ln([10,O[1]],[330,O[1]],DSH)+ln(B,H,DSH);
    if(Math.abs(pr)>1e-9)s+=ln(O,H,`stroke="var(--${pr>0?'gold':'ng'})" stroke-width="7" stroke-linecap="round" opacity=".6"`);
    if(far&&si>.2)s+=rt(H,O,B,7);
    s+=arw(O,A,CC)+arw(O,B,IK,2.2);
    if(v.t>0)s+=arc(O,18,0,v.t);
    if(v.t>=30)s+=tx([O[0]+34*Math.cos(rad(v.t/2)),O[1]-34*Math.sin(rad(v.t/2))+4],v.t+'°',GG,11);
    s+=vt([A[0]-12,A[1]-9],'~a',CC)+(si>.05?vt(off(O,B,[B[0],O[1]+90],13),'~b'):vt([B[0],B[1]-22],'~b'));
    s+=tx([O[0]+(far||pr>=0?0:8),O[1]+16],far?'O':'O, H',MU,11)+(far?tx([H[0],O[1]+16],'H',MU,11):'')+tx([A[0]+10,A[1]+4],'A',MU,11)+tx([B[0]+(co>=0?9:-9),B[1]-6],'B',MU,11);
    return {svg:s,read:`|a| = ${n(v.a)}、|b| = ${n(v.b)}、θ = ${v.t}°<br>影の長さ（符号つき）<br>OH = |b|cosθ = <b>${n(pr)}</b><br>a·b = |a| × |b|cosθ = ${n(v.a)} × ${par(pr)} = <b>${n(ip)}</b><br>`+(v.t===0?'同じ向き → 内積は |a||b|':v.t<90?'θ が鋭角 → 内積は正':v.t===90?'θ = 90° → 内積は 0':v.t<180?'θ が鈍角 → 内積は負':'逆向き → 内積は −|a||b|')};}});

/* ---- なぜ：三角形 OAB の3辺から内積を求める（余弦定理） ---- */
FIGS.hcvector_yogen=host=>mk(host,{alt:'三角形 OAB の3辺の長さの2乗と、成分の積の和をくらべる図',
  sliders:[{k:'x',label:'b の x 成分 b₁',min:-2,max:3,step:1,v:1},{k:'y',label:'b の y 成分 b₂',min:1,max:4,step:1,v:3}],
  draw(v){const p=plot([-2.6,5.9,-1.25,5]).grid(),X=p.sx,Y=p.sy,O=[X(0),Y(0)],A=[X(4),Y(1)],B=[X(v.x),Y(v.y)],b2=v.x*v.x+v.y*v.y,c2=(v.x-4)**2+(v.y-1)**2,ip=4*v.x+v.y;let s=p.out();
    s+=pg([O,A,B],FC)+ln(A,B,HV(GG))+arw(O,A,CC)+arw(O,B,CC)+dot(A)+dot(B);
    s+=vt(off(O,A,B,13),'~a',CC)+vt(off(O,B,A,13),'~b',CC)+tx(off(A,B,O,24),'AB² = '+c2,GG,11)+tx([A[0]+8,A[1]+15],'A(4, 1)',IK,11,'start')+tx([Math.max(B[0],36),B[1]-9],`B(${n(v.x)}, ${n(v.y)})`,IK,11);
    return {svg:s,read:`|a|² = 17、|b|² = ${b2}、AB² = ${c2}<br>余弦定理から<br>a·b = (17 + ${b2} − ${c2}) ÷ 2 = <b>${n((17+b2-c2)/2)}</b><br>成分で計算すると<br>4×${par(v.x)} + 1×${v.y} = <b>${n(ip)}</b>`};}});

/* ---- 内分点（arg.gai のときは外分点） ---- */
const NB={O:[48,222],A:[110,50],B:[306,166]};
const naibun=(m,k,full)=>{const {O,A,B}=NB,t=m/(m+k),P=mid(A,B,t),Ap=mid(O,A,1-t),Bp=mid(O,B,t);let s='';
  for(let i=1;i<m+k;i++){const q=mid(A,B,i/(m+k)),u=un(A,B);s+=ln([q[0]-u[1]*4,q[1]+u[0]*4],[q[0]+u[1]*4,q[1]-u[0]*4],SUB);}
  if(full)s+=ln(Ap,P,DSH)+ln(Bp,P,DSH);
  s+=ln(A,B)+arw(O,A,CC)+arw(O,B,CC);
  return {O,A,B,P,Ap,Bp,t,s,lab:()=>tx([O[0]-10,O[1]+12],'O',MU,11)+vt([A[0]-4,A[1]-9],'A(~a)')+vt([B[0]-6,B[1]+20],'B(~b)')+tx(off(A,P,O,13),String(m),MU)+tx(off(P,B,O,13),String(k),MU)};};
FIGS.hcvector_naibun=(host,arg)=>{const gai=!!(arg&&arg.gai);
  mk(host,{alt:gai?'線分 AB を m 対 n に外分する点 Q の位置ベクトルの図':'線分 AB を m 対 n に内分する点 P の位置ベクトルを、a と b の実数倍の和で表す図',
  sliders:[{k:'m',label:'m',min:1,max:gai?4:5,step:1,v:gai?3:2},{k:'n',label:'n',min:1,max:gai?4:5,step:1,v:1}],
  draw(v){const m=v.m,k=v.n;
    if(!gai){const g=naibun(m,k,true);let s=g.s;
      s+=dot(g.Ap,GG,3.5)+dot(g.Bp,GG,3.5)+arw(g.O,g.P,GG,2.8)+dot(g.P,GG,4.5)+g.lab()+vt(off(g.A,g.B,g.O,15,g.t),'P(~p)',GG);
      s+=vt([g.Ap[0]-8,g.Ap[1]+4],fr(k,m+k)+'~a',GG,11,'end')+vt([g.Bp[0]+4,g.Bp[1]+17],fr(m,m+k)+'~b',GG,11);
      return {svg:s,read:`AP : PB = ${m} : ${k}<br>p = (${k}a + ${m}b) ÷ (${m} + ${k})<br>= <b>${fr(k,m+k)}</b> a + <b>${fr(m,m+k)}</b> b<br>`+(m>k?'P は B に近い → b の係数が大きい':m<k?'P は A に近い → a の係数が大きい':'P は中点 → 係数は等しい')};}
    const O=[120,226],A=[142,104],B=[180,96],L=[mid(A,B,-3.3),mid(A,B,4.3)];let s=ln(L[0],L[1],DSH)+ln(A,B,HV(IK))+arw(O,A,CC)+arw(O,B,CC);
    s+=tx([O[0]-10,O[1]+12],'O',MU,11)+tx([A[0]-2,A[1]-10],'A')+tx([B[0]+2,B[1]-10],'B');
    if(m===k)return {svg:s+dot(A)+dot(B),read:`AQ : QB = ${m} : ${k}<br>m = n のとき、外分点はない<br>（線分 AB の外に、AQ = QB となる点はない）`};
    const t=m/(m-k),Q=mid(A,B,t);s+=arw(O,Q,GG,2.8)+dot(A)+dot(B)+dot(Q,GG,4.5)+tx([Q[0],Q[1]-11],'Q',GG);
    return {svg:s,read:`AQ : QB = ${m} : ${k}<br>AQ = ${fr(m,Math.abs(m-k))} AB、QB = ${fr(k,Math.abs(m-k))} AB<br>q = (−${k}a + ${m}b) ÷ (${m} − ${k})<br>= <b>${fr(-k,m-k)}</b> a ${m>k?'+':'−'} <b>${fr(m,Math.abs(m-k))}</b> b<br>`+(m>k?'m ＞ n → Q は B の先':'m ＜ n → Q は A の手前')};}});};

/* ---- なぜ：内分点の位置ベクトルを、A から B へ進む割合で導く ---- */
FIGS.hcvector_naibun_step=host=>mk(host,{alt:'点 O から A へ進み、続けて A から B へ向かって途中まで進むことで、内分点の位置ベクトルを導く手順の図',
  sliders:[{k:'s',label:'手順',min:1,max:4,step:1,v:1},{k:'m',label:'m',min:1,max:4,step:1,v:2},{k:'n',label:'n',min:1,max:4,step:1,v:1}],play:{k:'s',from:1,to:4,label:'順に見る',ms:4400},
  draw(v){const m=v.m,k=v.n,st=v.s,g=naibun(m,k,st===4),r=fr(m,m+k);let s=g.s;
    if(st===2||st===3)s+=arw(g.A,g.P,GG,3.2);
    if(st>=3)s+=arw(g.O,g.P,st===3?NG:GG,2.6);
    if(st===4)s+=dot(g.Ap,GG,3.5)+dot(g.Bp,GG,3.5)+vt([g.Ap[0]-8,g.Ap[1]+4],fr(k,m+k)+'~a',GG,11,'end')+vt([g.Bp[0]+4,g.Bp[1]+17],r+'~b',GG,11);
    s+=dot(g.P,GG,4.5)+g.lab()+tx(off(g.A,g.B,g.O,15,g.t),'P',GG);
    return {svg:s,read:[`<b>手順 1</b>　線分 AB を ${m} : ${k} に内分する点 P<br>OP を a と b で表したい`,
      `<b>手順 2</b>　AP は、AB の ${r} 倍<br>AB = b − a なので<br>AP = ${r} (b − a)`,
      `<b>手順 3</b>　O から A へ進み、続けて P へ進む<br>OP = OA + AP<br>= a + ${r} (b − a)`,
      `<b>手順 4</b>　a と b でまとめる<br>OP = (1 − ${r}) a + ${r} b<br>= <b>${fr(k,m+k)}</b> a + <b>${r}</b> b`][st-1]};}});

/* ---- 三角形の重心 ---- */
FIGS.hcvector_jushin=host=>mk(host,{alt:'三角形 ABC の3本の中線と重心 G の図',
  sliders:[{k:'x',label:'C の x 座標',min:-3,max:4,step:1,v:1},{k:'y',label:'C の y 座標',min:2,max:4,step:1,v:4}],
  draw(v){const p=plot([-4.6,5.4,-2.35,5]).grid(),pt=(x,y)=>[p.sx(x),p.sy(y)],A=pt(-2,-1),B=pt(4,-1),C=pt(v.x,v.y),G=pt((2+v.x)/3,(v.y-2)/3),M=mid(B,C),g=cen([A,B,C]);let s=p.out();
    s+=pg([A,B,C],FC)+ln(B,mid(C,A),DSH)+ln(C,mid(A,B),DSH)+ln(A,G,HV(GG))+ln(G,M,HV(CC))+pg([A,B,C])+dot(A)+dot(B)+dot(C)+dot(M,CC,3.5)+dot(G,GG,4.5);
    s+=tx([A[0]-11,A[1]+5],'A')+tx([B[0]+11,B[1]+5],'B')+tx([C[0],C[1]-9],'C')+tx(off(B,C,g,12),'M',CC)+tx([G[0]+2,G[1]+17],'G',GG);
    const ag=Math.hypot((2+v.x)/3+2,(v.y-2)/3+1),gm=ag/2;
    return {svg:s,read:`A(−2, −1)、B(4, −1)、C(${n(v.x)}, ${n(v.y)})<br>g = (a + b + c) ÷ 3<br>= <b>(${fr(2+v.x,3)}, ${fr(v.y-2,3)})</b><br>AG = ${n(ag)}、GM = ${n(gm)}<br>AG : GM = 2 : 1（M は BC の中点）`};}});

/* ---- 交点の位置ベクトル ---- */
const FRS=[[1,4],[1,3],[1,2],[2,3],[3,4]];
FIGS.hcvector_koten=host=>mk(host,{alt:'三角形 OAB で、辺 OA 上の点 C と辺 OB 上の点 D をとり、線分 AD と BC の交点 P の位置ベクトルを求める図',
  sliders:[{k:'i',label:'OC ÷ OA',min:1,max:5,step:1,v:5,fmt:i=>FRS[i-1].join('/')},{k:'j',label:'OD ÷ OB',min:1,max:5,step:1,v:4,fmt:i=>FRS[i-1].join('/')}],
  draw(v){const [p1,q1]=FRS[v.i-1],[p2,q2]=FRS[v.j-1],O=[42,222],A=[308,206],B=[124,34],C=mid(O,A,p1/q1),D=mid(O,B,p2/q2),P=cross(A,D,B,C),den=q1*q2-p1*p2;let s='';
    s+=pg([O,A,B],FC)+ln(A,B)+ln(A,D,SUB)+ln(B,C,SUB)+arw(O,A,CC)+arw(O,B,CC)+arw(O,P,GG,2.8)+dot(C)+dot(D)+dot(P,GG,4.5);
    s+=tx([O[0]-11,O[1]+10],'O')+vt([A[0]+4,A[1]+17],'A(~a)')+vt([B[0]-6,B[1]-10],'B(~b)')+tx([C[0],C[1]+17],'C')+tx([D[0]-11,D[1]+1],'D')+tx([P[0]+6,P[1]-11],'P',GG);
    const fc=fr(p1,q1),fd=fr(p2,q2);
    return {svg:s,read:`OC = ${fc} OA、OD = ${fd} OB<br>AD 上：OP = (1 − s) a + s × ${fd} b<br>BC 上：OP = t × ${fc} a + (1 − t) b<br>係数をくらべて s = ${fr((q1-p1)*q2,den)}、t = ${fr((q2-p2)*q1,den)}<br>OP = <b>${fr(p1*(q2-p2),den)}</b> a + <b>${fr(p2*(q1-p1),den)}</b> b`};}});

/* ---- 垂直と内積：平行四辺形の対角線 ---- */
FIGS.hcvector_hishigata=host=>mk(host,{alt:'平行四辺形の2本の対角線を a + b と b − a で表し、内積で垂直かどうかを調べる図',
  sliders:[{k:'b',label:'|b|（|a| は 3）',min:2,max:4,step:.5,v:3},{k:'t',label:'a と b のなす角（度）',min:40,max:140,step:5,v:60}],
  draw(v){const u=34,O=[118,202],A=[O[0]+3*u,O[1]],bb=[v.b*u*Math.cos(rad(v.t)),-v.b*u*Math.sin(rad(v.t))],B=add(O,bb),K=add(A,bb),M=mid(O,K),eq=v.b===3;let s='';
    s+=pg([O,A,K,B],FC)+ln(A,K,SUB)+ln(B,K,SUB)+arw(O,A,CC)+arw(O,B,CC)+arw(O,K,GG,2.6)+arw(A,B,NG,2.6);
    if(eq)s+=rt(M,K,B,7,'stroke="var(--ink)" stroke-width="1.4" fill="none"');
    s+=vt([O[0]+51,O[1]+17],'~a',CC)+vt(off(O,B,A,13),'~b',CC)+vt(off(O,K,A,13,.8),'~a+~b',GG,11)+vt(off(A,B,K,14,.3),'~b−~a',NG,11);
    return {svg:s,read:`|a| = 3、|b| = ${n(v.b)}<br>(a + b)·(b − a) = |b|² − |a|²<br>= ${n(v.b*v.b)} − 9 = <b>${n(v.b*v.b-9)}</b><br>`+(eq?'内積が 0 → 対角線は垂直（ひし形）':'内積が 0 でない → 対角線は垂直でない')+'<br>なす角を変えても、この値は変わらない'};}});

/* ---- 直線のベクトル方程式 p = a + t d ---- */
const RL=[-3.6,6.4,-2.3,5.05];
FIGS.hcvector_chokusen=host=>mk(host,{alt:'点 A を通り、方向ベクトル d に平行な直線の上を、媒介変数 t に応じて点 P が動く図',
  sliders:[{k:'t',label:'t',min:-1.5,max:1.5,step:.25,v:.5},{k:'m',label:'d の y 成分（d = (2, m)）',min:-2,max:2,step:1,v:1}],play:{k:'t',from:-1.5,to:1.5,label:'t を動かす',ms:3600},
  draw(v){const p=plot(RL).grid(),pt=(x,y)=>[p.sx(x),p.sy(y)],m=v.m,t=v.t,O=pt(0,0),A=pt(1,2),E=pt(3,2+m),P=pt(1+2*t,2+m*t),u=un(A,E),nx=[-u[1],u[0]],up=nx[1]<0?1:-1;let s=p.out();
    s+=ln(pt(-3.6,2+m*(-4.6)/2),pt(6.4,2+m*5.4/2),'stroke="var(--c)" stroke-width="1.6"')+arw(O,A,MU,1.6)+arw(O,P,IK,2)+arw(A,E,GG,2.8)+dot(A)+dot(P,CC,4.5);
    s+=vt([E[0]+nx[0]*14*up,E[1]+nx[1]*14*up+4],'~d',GG)+tx([P[0]-nx[0]*15*up,P[1]-nx[1]*15*up+4],'P',CC)+tx([A[0]+nx[0]*14*up-u[0]*10,A[1]+nx[1]*14*up-u[1]*10+4],'A');
    return {svg:s,read:`p = a + t d<br>(x, y) = (1, 2) + ${par(t)}(2, ${n(m)})<br>= <b>(${n(1+2*t)}, ${n(2+m*t)})</b><br>x = 1 + 2t、y = ${m===0?'2':m===1?'2 + t':m===-1?'2 − t':'2 '+sg(m)+'t'}<br>t を消去すると ${lin(m,-2,4-m,true)}`};}});

/* ---- 法線ベクトル n·(p − a) = 0 ---- */
FIGS.hcvector_hosen=host=>mk(host,{alt:'点 A を通り、法線ベクトル n に垂直な直線の図',
  sliders:[{k:'a',label:'n の x 成分',min:1,max:3,step:1,v:2},{k:'b',label:'n の y 成分',min:-2,max:2,step:1,v:1},{k:'s',label:'P の位置',min:-2.5,max:2.5,step:.5,v:2}],
  draw(v){const p=plot(RL).grid(),pt=(x,y)=>[p.sx(x),p.sy(y)],l=Math.hypot(v.a,v.b),d=[-v.b/l,v.a/l],A=pt(1,2),N=pt(1+v.a,2+v.b),px=1+d[0]*v.s,py=2+d[1]*v.s,P=pt(px,py),u=un(A,N);let s=p.out();
    s+=ln(pt(1-d[0]*9,2-d[1]*9),pt(1+d[0]*9,2+d[1]*9),'stroke="var(--c)" stroke-width="1.6"');
    if(v.s)s+=rt(A,N,P,8,'stroke="var(--ink)" stroke-width="1.4" fill="none"');
    s+=arw(A,P,CC,2.8)+arw(A,N,GG,2.8)+dot(A)+dot(P,CC,4.5);
    s+=vt([N[0]+u[0]*13,N[1]+u[1]*13+4],'~n',GG)+tx([A[0]-u[0]*14,A[1]-u[1]*14+4],'A')+tx([P[0]-u[0]*14,P[1]-u[1]*14+4],'P',CC);
    return {svg:s,read:`n = (${v.a}, ${n(v.b)})、A(1, 2)、P(${n(px)}, ${n(py)})<br>n·AP = ${v.a===1?'':v.a}(x − 1)${v.b?(v.b<0?' − ':' + ')+(Math.abs(v.b)===1?'':Math.abs(v.b))+'(y − 2)':''} = <b>0</b><br>整理すると ${lin(v.a,v.b,-v.a-2*v.b)}<br>x, y の係数 (${v.a}, ${n(v.b)}) が法線ベクトル`};}});

/* ---- 円のベクトル方程式 ---- */
FIGS.hcvector_en=host=>mk(host,{alt:'中心 C、半径 2 の円周上の点 P と、直径の両端 A, B を結ぶ図',
  sliders:[{k:'t',label:'P の位置（度）',min:0,max:360,step:5,v:60}],play:{k:'t',from:0,to:360,label:'P を1周させる',ms:4600},
  draw(v){const p=plot([-3.2,5.3,-2.1,4.15]).grid(),pt=(x,y)=>[p.sx(x),p.sy(y)],px=1+2*Math.cos(rad(v.t)),py=1+2*Math.sin(rad(v.t)),A=pt(-1,1),B=pt(3,1),K=pt(1,1),P=pt(px,py),ok=v.t%180!==0;let s=p.out();
    s+=`<circle cx="${f(K[0])}" cy="${f(K[1])}" r="80" fill="none" stroke="var(--c)" stroke-width="2"/>`+ln(A,B,SUB)+ln(K,P,DSH);
    if(ok)s+=rt(P,A,B,8,'stroke="var(--ink)" stroke-width="1.4" fill="none"');
    s+=arw(A,P,GG,2.4)+arw(B,P,GG,2.4)+dot(A)+dot(B)+dot(K,MU,3)+dot(P,GG,4.5);
    const u=un(K,P);
    s+=tx([A[0]-11,A[1]+5],'A')+tx([B[0]+11,B[1]+5],'B')+tx([K[0],K[1]+16],'C',MU)+tx(ok&&Math.abs(P[1]-K[1])>14?[P[0]+u[0]*14,P[1]+u[1]*14+4]:[P[0],P[1]-12],'P',GG);
    return {svg:s,read:`P(${n(px)}, ${n(py)})<br>|p − c| = CP = <b>2</b>（一定）<br>AP·BP = (${n(px+1)})(${n(px-3)}) + (${n(py-1)})²<br>= <b>${n((px+1)*(px-3)+(py-1)**2)}</b><br>`+(ok?'AP ⊥ BP（直径に対する円周角は 90°）':'P が A か B に重なるとき、一方は零ベクトル')};}});

/* ======== 空間 ======== */
// 見取図：x 軸は手前（左下）、y 軸は右、z 軸は上
const P3=(ox,oy,u)=>(x,y,z)=>[ox+u*(y-.5*x),oy-u*(z-.36*x)];
const axes3=(pr,L)=>{const O=pr(0,0,0),X=pr(L,0,0),Y=pr(0,L,0),Z=pr(0,0,L);
  return arw(O,X,MU,1.2)+arw(O,Y,MU,1.2)+arw(O,Z,MU,1.2)+tx([X[0]-9,X[1]+9],'x',MU,11)+tx([Y[0]+9,Y[1]+4],'y',MU,11)+tx([Z[0]+10,Z[1]+6],'z',MU,11)+tx([O[0]-10,O[1]-4],'O',MU,11);};

/* ---- 空間の座標（arg.vec のときは、ベクトルの成分として見る） ---- */
FIGS.hcvector_zahyo3=(host,arg)=>{const vec=!!(arg&&arg.vec);
  mk(host,{alt:vec?'空間のベクトルを、x・y・z の3方向に分けて表す見取図':'座標空間の点 P と、座標軸に沿ってかいた直方体の見取図',
  sliders:[{k:'a',label:vec?'x 成分 a₁':'x 座標',min:1,max:4,step:.5,v:2},{k:'b',label:vec?'y 成分 a₂':'y 座標',min:1,max:4,step:.5,v:3},{k:'c',label:vec?'z 成分 a₃':'z 座標',min:1,max:4,step:.5,v:4}],
  draw(v){const pr=P3(146,174,30),{a,b,c}=v,O=pr(0,0,0),P=pr(a,b,c),Q=pr(a,b,0),X=pr(a,0,0),Y=pr(0,b,0),Z=pr(0,0,c),q=a*a+b*b+c*c;let s=pg([O,X,Q,Y],FC)+axes3(pr,5);
    s+=[[Y,Q],[Z,pr(a,0,c)],[Z,pr(0,b,c)],[pr(a,0,c),P],[pr(0,b,c),P],[X,pr(a,0,c)],[Y,pr(0,b,c)]].map(e=>ln(e[0],e[1],DSH)).join('');
    if(vec)s+=ln(O,X,HV(CC))+ln(X,Q,HV(CC))+ln(Q,P,HV(CC))+arw(O,P,GG,2.8)+vt(off(O,P,Q,13,.55),'~a',GG);
    else s+=ln(X,Q,DSH)+ln(O,Q,GD)+ln(Q,P,HV(CC))+ln(O,P,HV(GG))+dot(Q,MU,3)+dot(P,GG,4.5)+tx([P[0]+10,P[1]-6],'P',GG)+tx([Q[0]+6,Q[1]+15],'Q',MU,11);
    s+=tx([X[0]-8,X[1]+1],n(a),CC,11,'end')+tx([Y[0]+5,Y[1]-6],n(b),CC,11,'start')+tx([Z[0]-7,Z[1]+4],n(c),CC,11,'end');
    return {svg:s,read:vec?`a = (${n(a)}, ${n(b)}, ${n(c)})<br>= ${n(a)} e₁ + ${n(b)} e₂ + ${n(c)} e₃<br>|a|² = ${n(a)}² + ${n(b)}² + ${n(c)}² = ${n(q,4)}<br>|a| = <b>${root(q)}</b>`
      :`P(${n(a)}, ${n(b)}, ${n(c)})<br>OQ² = ${n(a)}² + ${n(b)}² = ${n(a*a+b*b,4)}<br>（Q は P の真下、xy 平面上の点）<br>OP² = OQ² + ${n(c)}² = ${n(q,4)}<br>OP = <b>${root(q)}</b>`};}});};

/* ---- 平行六面体：a, b, c を順につぎ足す ---- */
const HK=(()=>{const O=[66,204],a=[150,12],b=[62,-52],c=[-12,-108],A=add(O,a),B=add(O,b),C=add(O,c),D=add(A,b),E=add(A,c),F=add(B,c),G=add(D,c);return {O,A,B,C,D,E,F,G};})();
const hako=(names)=>{const {O,A,B,C,D,E,F,G}=HK;let s=ln(O,B,DSH)+ln(B,D,DSH)+ln(B,F,DSH)+pg([O,A,E,C])+pg([A,D,G,E])+pg([C,E,G,F]);
  if(names){const t=names.split('');s+=tx([O[0]-10,O[1]+8],t[0])+tx([A[0]+4,A[1]+16],t[1])+tx([D[0]+11,D[1]+6],t[2])+tx([B[0]-4,B[1]-7],t[3],MU)+tx([C[0]-11,C[1]+2],t[4])+tx([E[0]-2,E[1]-8],t[5])+tx([G[0]+10,G[1]-2],t[6])+tx([F[0]-2,F[1]-8],t[7]);}
  return s;};
FIGS.hcvector_hako=host=>mk(host,Object.assign(STEP(3),{alt:'平行六面体の頂点 O から、3つのベクトル a, b, c を順につぎ足して対角線の先に着く図',
  draw(v){const {O,A,B,C,D,G}=HK,st=v.s;let s=hako('OADBCEGF');
    s+=arw(O,B,CC,1.8,'5 4')+arw(O,C,CC)+arw(O,A,st>=1?GG:CC,2.8);
    if(st>=2)s+=arw(A,D,GG,2.8)+arw(O,D,NG,st===2?2.4:1.4,st===2?'':'5 4');
    if(st>=3)s+=arw(D,G,GG,2.8)+arw(O,G,NG,2.6);
    s+=vt(off(O,A,B,13),'~a',st>=1?GG:CC)+vt(off(O,B,A,11,.55),'~b',CC)+vt(off(O,C,A,13),'~c',CC);
    if(st>=2)s+=vt(off(A,D,O,12),'~b',GG);if(st>=3)s+=vt(off(D,G,O,12),'~c',GG);
    return {svg:s,read:['<b>手順 1</b>　O から a だけ進む<br>OA = a','<b>手順 2</b>　続けて b だけ進む<br>OD = a + b（底面の対角線）','<b>手順 3</b>　さらに c だけ進む<br>OG = <b>a + b + c</b><br>平行六面体の対角線になる<br>進む順番を変えても、着く点は G'][st-1]};}}));

/* ---- 空間の内積：直方体の2つの面の対角線のなす角 ---- */
FIGS.hcvector_naiseki3=host=>mk(host,{alt:'直方体の頂点 O から引いた2本の面の対角線 OP, OQ と、そのなす角の見取図',
  sliders:[{k:'l',label:'x 方向の辺',min:1,max:4,step:1,v:2},{k:'m',label:'y 方向の辺',min:1,max:4,step:1,v:2},{k:'h',label:'z 方向の辺',min:1,max:4,step:1,v:2}],
  draw(v){const pr=P3(138,178,36),{l,m,h}=v,O=pr(0,0,0),P=pr(l,m,0),Q=pr(0,m,h),V=(x,y,z)=>pr(x*l,y*m,z*h);let s=axes3(pr,4.6);
    s+=pg([O,P,Q],FG)+[[V(1,0,0),V(1,1,0)],[V(0,1,0),V(1,1,0)],[V(1,0,0),V(1,0,1)],[V(0,1,0),V(0,1,1)],[V(0,0,1),V(1,0,1)],[V(0,0,1),V(0,1,1)],[V(1,0,1),V(1,1,1)],[V(0,1,1),V(1,1,1)],[V(1,1,0),V(1,1,1)]].map(e=>ln(e[0],e[1],SUB)).join('');
    s+=ln(P,Q,GD)+arw(O,P,GG,2.8)+arw(O,Q,CC,2.8);
    const ip=m*m,p2=l*l+m*m,q2=m*m+h*h,co=ip/Math.sqrt(p2*q2),dg=Math.acos(co)*180/Math.PI,T=[O[0]+(P[0]+Q[0]-2*O[0])*.2,O[1]+(P[1]+Q[1]-2*O[1])*.2+4];
    s+=tx(T,'θ',IK,11)+tx([P[0]+4,P[1]+16],'P',GG)+tx([Q[0]+10,Q[1]-5],'Q',CC);
    return {svg:s,read:`OP = (${l}, ${m}, 0)、OQ = (0, ${m}, ${h})<br>OP·OQ = ${l}×0 + ${m}×${m} + 0×${h} = <b>${ip}</b><br>|OP| = √${p2}、|OQ| = √${q2}<br>cosθ = ${ip} ÷ (√${p2} × √${q2}) = ${n(co,3)}<br>θ ${Math.abs(dg-Math.round(dg))<1e-6?'=':'≈'} <b>${n(dg,1)}°</b>`};}});

/* ---- 同じ平面上にある条件：OP = s a + t b + u c ---- */
const TE={O:[52,206],A:[212,232],B:[312,146],C:[140,34]};
FIGS.hcvector_shimentai=host=>mk(host,{alt:'四面体 OABC で、OP = s a + t b + u c の係数の和と、点 P が平面 ABC 上にあるかどうかの関係を見る図',
  sliders:[{k:'s',label:'s（a の係数）',min:0,max:.5,step:.1,v:.3},{k:'t',label:'t（b の係数）',min:0,max:.5,step:.1,v:.3},{k:'u',label:'u（c の係数）',min:0,max:.6,step:.1,v:.4}],
  draw(v){const {O,A,B,C}=TE,sm=v.s+v.t+v.u,on=Math.abs(sm-1)<1e-9,pt=(x,y,z)=>[O[0]+(A[0]-O[0])*x+(B[0]-O[0])*y+(C[0]-O[0])*z,O[1]+(A[1]-O[1])*x+(B[1]-O[1])*y+(C[1]-O[1])*z],P=pt(v.s,v.t,v.u);let s='';
    s+=pg([A,B,C],on?FG:FC)+arw(O,B,CC,1.8,'5 4');
    if(!on&&sm>0)s+=pg([pt(sm,0,0),pt(0,sm,0),pt(0,0,sm)],'fill="var(--gold)" fill-opacity=".12" stroke="var(--gold)" stroke-width="1.2" stroke-dasharray="5 4"');
    s+=pg([A,B,C])+arw(O,A,CC)+arw(O,C,CC)+arw(O,P,GG,2.6)+dot(P,GG,4.5);
    s+=tx([O[0]-11,O[1]+6],'O')+vt([A[0]+2,A[1]+15],'A(~a)')+vt([B[0]-2,B[1]-11],'B(~b)')+vt([C[0]-4,C[1]-9],'C(~c)')+tx([P[0]+(P[0]>312?-10:10),P[1]-7],'P',GG);
    return {svg:s,read:`OP = ${n(v.s)} a + ${n(v.t)} b + ${n(v.u)} c<br>s + t + u = <b>${n(sm)}</b><br>`+(on?'和が 1 → P は平面 ABC 上にある<br>'+(Math.min(v.s,v.t,v.u)>1e-9?'（3つとも正なので △ABC の内部）':'（0 の係数があるので △ABC の辺の上）'):'和が 1 でない → P は平面 ABC 上にない'+(sm>0?'<br>点線は、P を通り平面 ABC に平行な平面':''))};}});

/* ---- 球面を平面 z = k で切る ---- */
FIGS.hcvector_kyumen=host=>mk(host,{alt:'原点を中心とする半径 3 の球面を、平面 z = k で切った切り口の円の図',
  sliders:[{k:'k',label:'k（平面 z = k）',min:-3,max:3,step:.25,v:1.5}],play:{k:'k',from:-3,to:3,label:'平面を下から上へ動かす',ms:4200},
  draw(v){const O=[170,128],u=34,sa=.3,ca=Math.sqrt(1-sa*sa),k=v.k,q=9-k*k,ro=Math.sqrt(Math.max(0,q)),K=[O[0],O[1]-k*u*ca],E=[K[0]+ro*u,K[1]];let s='';
    const el=(c,rx,st,half)=>`<path d="M${f(c[0]-rx)},${f(c[1])} A${f(rx)},${f(rx*sa)} 0 0 ${half} ${f(c[0]+rx)},${f(c[1])}" ${st}/>`;
    s+=ln(O,[O[0],8],SUB)+ln(O,[O[0]+4.4*u*.866,O[1]+4.4*u*.5*sa],SUB)+ln(O,[O[0]-5.9*u*.5,O[1]+5.9*u*.866*sa],SUB);
    s+=tx([O[0]+11,15],'z',MU,11)+tx([O[0]+4.4*u*.866+9,O[1]+4.4*u*.5*sa+5],'y',MU,11)+tx([O[0]-5.9*u*.5-8,O[1]+5.9*u*.866*sa+7],'x',MU,11);
    s+=`<circle cx="${O[0]}" cy="${O[1]}" r="${3*u}" fill="var(--c)" fill-opacity=".08" stroke="var(--c)" stroke-width="2"/>`+el(O,3*u,'stroke="var(--c)" stroke-width="1" fill="none" stroke-dasharray="4 4"',1)+el(O,3*u,'stroke="var(--c)" stroke-width="1" fill="none"',0);
    if(ro>1e-6){s+=`<ellipse cx="${f(K[0])}" cy="${f(K[1])}" rx="${f(ro*u)}" ry="${f(ro*u*sa)}" fill="var(--gold)" fill-opacity=".22" stroke="none"/>`+el(K,ro*u,'stroke="var(--gold)" stroke-width="1.6" fill="none" stroke-dasharray="4 4"',1)+el(K,ro*u,'stroke="var(--gold)" stroke-width="2.2" fill="none"',0);
      s+=ln(O,E,HV(CC))+ln(K,E,HV(GG))+tx([(K[0]+E[0])/2,K[1]+(k>=0?-6:15)],n(ro),GG,11)+tx(off(O,E,K,12,.6),'3',CC,11);
      if(Math.abs(k)>.3)s+=ln(O,K,HV(IK))+tx([O[0]-7,(O[1]+K[1])/2+4],n(Math.abs(k)),IK,11,'end');}
    s+=dot(O,MU,3)+dot(K,GG,3.5)+tx([O[0]-9,O[1]+(k<0?-6:14)],'O',MU,11);
    return {svg:s,read:`球面 x² + y² + z² = 9（中心 O、半径 3）<br>平面 z = ${n(k)} で切ると<br>x² + y² = 9 − ${par(k)}² = ${n(q,4)}<br>`+(ro>1e-6?`切り口は、中心 (0, 0, ${n(k)})、<br>半径 <b>${root(q)}</b> の円`:'半径が 0 → 平面は球面に接する<br>（共有点は1点だけ）')};}});

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
const pc=(O,R,a)=>[O[0]+R*Math.cos(rad(a)),O[1]-R*Math.sin(rad(a))];
const foot=(P,A,B)=>{const u=un(A,B),t=(P[0]-A[0])*u[0]+(P[1]-A[1])*u[1];return [A[0]+u[0]*t,A[1]+u[1]*t];};
const nm=(P,t,G,k=12,c=IK)=>{const u=un(G,P);return tx([P[0]+u[0]*k,P[1]+u[1]*k+4],t,c);};
const tetra=()=>{const {O,A,B,C}=TE;return ln(O,B,DSH)+pg([O,A,C])+pg([A,B,C])+tx([O[0]-11,O[1]+6],'O')+tx([A[0]+2,A[1]+15],'A')+tx([B[0]+11,B[1]+3],'B')+tx([C[0]-2,C[1]-8],'C');};
const Q={
 hex:{alt:'正六角形 ABCDEF と中心 O。辺 AB と辺 AF に矢印がある図',h:236,f(){const O=[170,118],V=[240,300,0,60,120,180].map(a=>pc(O,92,a)),[A,B,C,D,E,F]=V;
   let s=ln(A,D,DSH)+ln(B,E,DSH)+ln(C,F,DSH)+pg(V)+arw(A,B,CC,2.8)+arw(A,F,CC,2.8)+dot(O,MU,3);
   'ABCDEF'.split('').forEach((c,i)=>s+=nm(V[i],c,O));s+=tx([O[0]+10,O[1]-7],'O',MU)+vt([170,A[1]+18],'~a',CC)+vt(off(A,F,O,13),'~b',CC);
   return [s,'正六角形 ABCDEF、O は中心<br>AB = a、AF = b'];}},
 heiko:{alt:'平行四辺形 ABCD と、辺 BC の中点 M、辺 CD を 2 対 1 に内分する点 N の図',h:232,f(){const A=[52,198],B=[232,198],D=[110,56],C=[290,56],M=mid(B,C),N=mid(C,D,2/3),g=cen([A,B,C,D]);
   let s=pg([A,B,C,D])+ln(A,M,SUB)+ln(A,N,SUB)+ln(M,N,HV(GG))+arw(A,B,CC,2.8)+arw(A,D,CC,2.8)+dot(M)+dot(N);
   s+=nm(A,'A',g)+nm(B,'B',g)+nm(C,'C',g)+nm(D,'D',g)+tx([M[0]+12,M[1]+4],'M')+tx([N[0],N[1]-9],'N')+vt([142,A[1]+18],'~a',CC)+vt(off(A,D,g,13),'~b',CC);
   return [s,'M は BC の中点、CN : ND = 2 : 1'];}},
 chuten:{alt:'三角形 ABC と、辺 AB, AC の中点 M, N を結ぶ線分の図',h:232,f(){const A=[150,34],B=[48,206],C=[300,206],M=mid(A,B),N=mid(A,C),g=cen([A,B,C]);
   let s=pg([A,B,C])+ln(M,N,HV(GG))+arw(A,B,CC,2.6)+arw(A,C,CC,2.6)+tick(A,M,1)+tick(M,B,1)+tick(A,N,2)+tick(N,C,2)+dot(M)+dot(N);
   s+=nm(A,'A',g)+nm(B,'B',g)+nm(C,'C',g)+tx([M[0]-12,M[1]+2],'M')+tx([N[0]+12,N[1]+2],'N')+vt(off(A,B,g,13,.75),'~b',CC)+vt(off(A,C,g,13,.75),'~c',CC);
   return [s,'M は AB の中点、N は AC の中点'];}},
 def:{alt:'三角形 ABC の各辺を 2 対 1 に内分する点 D, E, F を結んだ三角形の図',h:236,f(){const A=[140,30],B=[40,208],C=[300,208],D=mid(B,C,2/3),E=mid(C,A,2/3),F=mid(A,B,2/3),g=cen([A,B,C]);
   let s=pg([D,E,F],FG)+pg([A,B,C])+pg([D,E,F],'stroke="var(--gold)" stroke-width="1.8" fill="none"')+dot(D)+dot(E)+dot(F)+dot(g,GG,4);
   s+=nm(A,'A',g)+nm(B,'B',g)+nm(C,'C',g)+nm(D,'D',g)+nm(E,'E',g)+nm(F,'F',g);
   return [s,'BD : DC = CE : EA = AF : FB = 2 : 1'];}},
 heiko2:{alt:'平行四辺形 ABCD と、辺 BC 上の点 E、対角線 BD 上の点 F、線分 AE の図',h:236,f(){const A=[46,204],B=[236,204],D=[104,52],C=[294,52],E=mid(B,C,1/3),F=mid(B,D,1/4),g=cen([A,B,C,D]);
   let s=pg([A,B,C,D])+ln(B,D,SUB)+ln(A,E,HV(GG))+arw(A,B,CC,2.6)+arw(A,D,CC,2.6)+dot(E)+dot(F,GG,4);
   s+=nm(A,'A',g)+nm(B,'B',g)+nm(C,'C',g)+nm(D,'D',g)+tx([E[0]+12,E[1]+5],'E')+tx([F[0]-2,F[1]-10],'F',GG)+vt([140,A[1]+18],'~b',CC)+vt(off(A,D,g,13),'~d',CC);
   return [s,'BE : EC = 1 : 2、BF : FD = 1 : 3'];}},
 koten2:{alt:'三角形 OAB で、線分 AD と BC の交点 P と、直線 OP が辺 AB と交わる点 Q の図',h:250,f(){const O=[42,222],A=[308,206],B=[124,34],C=mid(O,A,1/3),D=mid(O,B,.5),P=cross(A,D,B,C),K=cross(O,P,A,B);
   let s=pg([O,A,B])+ln(A,D,SUB)+ln(B,C,SUB)+ln(O,K,GD)+arw(O,A,CC,2.6)+arw(O,B,CC,2.6)+dot(C)+dot(D)+dot(P,GG,4.5)+dot(K);
   s+=tx([O[0]-11,O[1]+10],'O')+vt([A[0]+4,A[1]+17],'A(~a)')+vt([B[0]-6,B[1]-10],'B(~b)')+tx([C[0],C[1]+17],'C')+tx([D[0]-11,D[1]+1],'D')+tx([P[0]+3,P[1]-11],'P',GG)+tx([K[0]+11,K[1]-3],'Q');
   return [s,'OC : CA = 1 : 2、D は OB の中点'];}},
 nitohen:{alt:'AB と AC が等しい二等辺三角形 ABC と、辺 BC の中点 M を結ぶ線分 AM の図',h:236,f(){const A=[170,32],B=[72,210],C=[268,210],M=mid(B,C),g=cen([A,B,C]);
   let s=pg([A,B,C])+ln(A,M,HV(GG))+tick(A,B,1)+tick(A,C,1)+tick(B,M,2)+tick(M,C,2)+dot(M);
   s+=nm(A,'A',g)+nm(B,'B',g)+nm(C,'C',g)+tx([M[0],M[1]+17],'M');
   return [s,'AB = AC、M は BC の中点'];}},
 suishin:{alt:'鋭角三角形 OAB で、A から OB に引いた垂線と B から OA に引いた垂線の交点 H の図',h:240,f(){const O=[46,212],A=[300,212],B=[196,34],Fa=foot(A,O,B),Fb=foot(B,O,A),H=cross(A,Fa,B,Fb),K=cross(O,H,A,B),g=cen([O,A,B]);
   let s=pg([O,A,B])+ln(A,Fa,SUB)+ln(B,Fb,SUB)+rt(Fa,A,O,7)+rt(Fb,B,O,7)+ln(O,K,GD)+dot(H,GG,4.5);
   s+=nm(O,'O',g)+nm(A,'A',g)+nm(B,'B',g)+tx([H[0]+12,H[1]-5],'H',GG);
   return [s,'AH ⊥ OB、BH ⊥ OA'];}},
 rokumentai:{alt:'平行六面体 ABCD-EFGH と、対角線 AG, BH の図',h:250,f(){const {O,A,B,C,G,F}=HK;
   let s=hako('ABCDEFGH')+ln(O,G,HV(GG))+ln(A,F,HV(NG))+arw(O,B,CC,1.8,'5 4')+arw(O,C,CC,2.6)+arw(O,A,CC,2.6);
   s+=vt(off(O,A,B,13),'~a',CC)+vt(off(O,B,A,11,.55),'~b',CC)+vt(off(O,C,A,13),'~c',CC);
   return [s,'AB = a、AD = b、AE = c<br>金色は対角線 AG、もう1本は対角線 BH'];}},
 cube:{alt:'立方体 ABCD-EFGH と、2本の対角線 AG, BH の図',h:240,f(){const A=[82,206],a=[128,0],b=[58,-44],c=[0,-128],B=add(A,a),D=add(A,b),C=add(B,b),E=add(A,c),F=add(B,c),G=add(C,c),H=add(D,c);
   let s=ln(A,D,DSH)+ln(D,C,DSH)+ln(D,H,DSH)+pg([A,B,F,E])+pg([B,C,G,F])+pg([E,F,G,H])+ln(A,G,HV(GG))+ln(B,H,HV(NG))+arw(A,B,CC,2.6)+arw(A,D,CC,1.8,'5 4')+arw(A,E,CC,2.6);
   s+=tx([A[0]-10,A[1]+8],'A')+tx([B[0]+8,B[1]+14],'B')+tx([C[0]+11,C[1]+5],'C')+tx([D[0]+9,D[1]-5],'D',MU)+tx([E[0]-10,E[1]+2],'E')+tx([F[0]+3,F[1]-7],'F')+tx([G[0]+10,G[1]-2],'G')+tx([H[0]-2,H[1]-8],'H');
   s+=vt([A[0]+52,A[1]+17],'~a',CC)+vt([A[0]+38,A[1]-14],'~b',CC)+vt([A[0]-12,A[1]-60],'~c',CC);
   return [s,'1辺の長さ 1 の立方体<br>金色は対角線 AG、もう1本は対角線 BH'];}},
 shimentai1:{alt:'四面体 OABC と、辺 OA の中点 M、辺 BC の中点 N、線分 MN の中点 P、三角形 ABC の重心 G の図',h:250,f(){const {O,A,B,C}=TE,M=mid(O,A),N=mid(B,C),P=mid(M,N),G=cen([A,B,C]);
   let s=tetra()+ln(M,N,SUB)+ln(O,G,GD)+dot(M)+dot(N)+dot(G)+dot(P,GG,4.5);
   s+=tx([M[0],M[1]+17],'M')+tx([N[0]+11,N[1]-5],'N')+tx([G[0]+11,G[1]+12],'G')+tx([P[0]-2,P[1]-11],'P',GG);
   return [s,'M は OA の中点、N は BC の中点<br>P は MN の中点、G は △ABC の重心'];}},
 seishimentai:{alt:'正四面体 OABC。辺 OA と辺 BC を強調した図',h:250,f(){const O=[166,28],A=[62,196],B=[204,228],C=[292,160];
   let s=ln(A,C,DSH)+pg([O,A,B])+pg([O,B,C])+ln(O,A,HV(GG))+ln(B,C,HV(GG));
   s+=tx([O[0],O[1]-8],'O')+tx([A[0]-11,A[1]+6],'A')+tx([B[0]+2,B[1]+16],'B')+tx([C[0]+11,C[1]+4],'C');
   return [s,'6本の辺の長さはすべて等しい'];}},
 lmn:{alt:'四面体 OABC の辺 OA, OB, OC 上の点 L, M, N で決まる平面と、直線 OG の交点 P の図',h:250,f(){const {O,A,B,C}=TE,L=mid(O,A,1/3),M=mid(O,B),N=mid(O,C),G=cen([A,B,C]),P=mid(O,G,3/7);
   let s=tetra()+pg([L,M,N],FG)+pg([L,M,N],'stroke="var(--gold)" stroke-width="1.6" fill="none"')+ln(O,G,GD)+dot(L)+dot(M)+dot(N)+dot(G)+dot(P,GG,4.5);
   s+=tx([L[0]+2,L[1]+17],'L')+tx([M[0]+4,M[1]+16],'M')+tx([N[0]-11,N[1]+1],'N')+tx([G[0]+11,G[1]+12],'G')+tx([P[0]+3,P[1]-11],'P',GG);
   return [s,'OL : LA = 1 : 2、M, N は OB, OC の中点<br>G は △ABC の重心'];}}
};
FIGS.hcvector_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){const r=q.f();return {svg:r[0],read:r[1]};}});};
})();
