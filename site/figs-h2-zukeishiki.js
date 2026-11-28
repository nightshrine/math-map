/* 数学II 第3章「図形と方程式」の図（FIGS.h2zukeishiki_*）。動かせる図と、問題に付ける図（h2zukeishiki_q）。
   座標のある図は、1 目盛りが縦と横で同じ長さになる範囲にしている（円が円に、垂直が垂直に見えるように） */
(function(){
const {plot,draw,n,sg,C,GOLD,DASH}=FIG;
const f=v=>v.toFixed(1);
const R0=[-6.8,6.8,-5,5],R1=[-1.2,7.64,-1,5.5],R2=[-1.5,9.38,-1.5,6.5],R5=[-10.2,10.2,-7.5,7.5];
const INK='stroke="var(--ink)" stroke-width="1.8" fill="none"';
const THIN='stroke="var(--muted)" stroke-width="1.2" fill="none"';
const GL='stroke="var(--gold)" stroke-width="2.2" fill="none"';
const G4='stroke="var(--gold)" stroke-width="4" stroke-linecap="round"',C4='stroke="var(--c)" stroke-width="4" stroke-linecap="round"';
const CF='fill="var(--c)" fill-opacity=".12" stroke="var(--c)" stroke-width="2.4"';
const OUT='paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round"';
// 座標のある図の文字（線に重なっても読めるよう、地の色でふちどる）。o = {a: そろえ方, dx, dy, c: 色, s: 大きさ}
const T=(p,x,y,t,o={})=>p.txt(x,y,t,`text-anchor="${o.a||'middle'}" dx="${o.dx||0}" dy="${o.dy||0}" fill="${o.c||'var(--ink)'}" ${o.s?`style="font-size:${o.s}px"`:''} ${OUT}`);
// 座標軸のない図の文字
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" ${OUT}>${t}</text>`);
// 円（中心 (cx, cy)、半径 r）を細かい多角形でかく
const circ=(p,cx,cy,r,st)=>{const q=[];for(let i=0;i<120;i++){const a=i*Math.PI/60;q.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}return p.poly(q,st);};
// 直線 ax + by + c = 0 を、範囲 R の端から端まで引く
const line=(p,a,b,c,st,R=R0)=>{if(Math.abs(b)<1e-9){const x=-c/a;return p.seg(x,R[2],x,R[3],st);}const y=x=>-(a*x+c)/b;return p.seg(R[0],y(R[0]),R[1],y(R[1]),st);};
// 直角の印：点 P から、単位ベクトル u, w の向きに s ずつ
const rt=(p,P,u,w,s=.3,st=THIN)=>{const a=[P[0]+u[0]*s,P[1]+u[1]*s],b=[P[0]+(u[0]+w[0])*s,P[1]+(u[1]+w[1])*s],c=[P[0]+w[0]*s,P[1]+w[1]*s];return p.seg(a[0],a[1],b[0],b[1],st).seg(b[0],b[1],c[0],c[1],st);};
const un=(x,y)=>{const l=Math.hypot(x,y)||1;return [x/l,y/l];};
// 式の表示：係数が 1 の文字は 1 を省き、符号を全角にする
const term=(k,v,first)=>{if(Math.abs(k)<1e-9)return '';const a=Math.abs(k),s=(Math.abs(a-1)<1e-9&&v?'':n(a,3))+v;return first?(k<0?'−':'')+s:(k<0?' − ':' + ')+s;};
const expr=ts=>{let s='';ts.forEach(q=>{s+=term(q[0],q[1],!s);});return s||'0';};
const sq=(s,k)=>Math.abs(k)<1e-9?s+'²':`(${s} ${sg(-k)})²`;
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
// 整数 p, q から分数 p/q の表示を作る
const fr=(p,q)=>{if(q<0){p=-p;q=-q;}const g=gcd(Math.abs(p),q)||1;p/=g;q/=g;return (p<0?'−':'')+Math.abs(p)+(q===1?'':'/'+q);};
const MN=[{k:'m',label:'m',min:1,max:4,step:1,v:2},{k:'n',label:'n',min:1,max:4,step:1,v:1}];

/* ---- 直線上の点：内分点（arg なし）と外分点（arg = 'gai'） ---- */
FIGS.h2zukeishiki_suchoku=(host,arg)=>{const gai=arg==='gai',a=1,b=4;
  FIG.mk(host,{h:gai?184:160,alt:gai?'数直線上で、線分 AB を m 対 n に外分する点 Q の図':'数直線上で、線分 AB を m 対 n に内分する点 P の図',sliders:MN.map(q=>({...q})),
  draw(v){const m=v.m,q=v.n,d=draw();
    if(!gai){const X=x=>15+(x+.6)*50,y=100,P=(q*a+m*b)/(m+q);
      d.line(15,y,325,y,THIN);
      for(let i=0;i<=5;i++){d.line(X(i),y-4,X(i),y+4,THIN);tx(d,X(i),y+19,String(i),'var(--muted)',10);}
      d.line(X(a),y,X(P),y,G4).line(X(P),y,X(b),y,C4);
      for(let i=1;i<m+q;i++){const x=X(a+(b-a)*i/(m+q));d.line(x,y-8,x,y+1,INK);}
      const br=(x1,x2,t,c)=>{d.path(`M${f(x1+2)},${y-30} v-6 H${f(x2-2)} v6`,`stroke="${c}" stroke-width="1.4" fill="none"`);tx(d,(x1+x2)/2,y-42,t,c);};
      br(X(a),X(P),String(m),'var(--gold)');br(X(P),X(b),String(q),'var(--c)');
      d.dot(X(a),y,'var(--ink)').dot(X(b),y,'var(--ink)').dot(X(P),y,'var(--gold)',5);
      tx(d,X(a),y-14,'A');tx(d,X(b),y-14,'B');tx(d,X(P),y-14,'P','var(--gold)');tx(d,X(P),y+38,n(P),'var(--gold)');
      return {svg:d.out(),read:`A(1)、B(4) を ${m} : ${q} に内分する点 P<br>(${q}×1 + ${m}×4) ÷ (${m} + ${q}) = <b>${n(P)}</b><br>AP = ${n(P-a)}、PB = ${n(b-P)}`+(m===q?'<br>m = n のとき、P は中点':'')};}
    const X=x=>14+(x+9.5)*13,y=66;
    d.line(8,y,332,y,THIN);
    for(let i=-9;i<=14;i++){const big=i%5===0;d.line(X(i),y-(big?5:3),X(i),y+(big?5:3),THIN);if(big)tx(d,X(i),y+19,n(i,0),'var(--muted)',10);}
    d.line(X(a),y,X(b),y,'stroke="var(--ink)" stroke-width="4"');
    if(m===q){d.dot(X(a),y,'var(--ink)').dot(X(b),y,'var(--ink)');tx(d,X(a),y-13,'A(1)');tx(d,X(b),y-13,'B(4)');tx(d,170,y+72,'m = n のとき、外分点はない','var(--muted)');
      return {svg:d.out(),read:`A(1)、B(4) を ${m} : ${q} に外分する点<br>分母 m − n が 0 になるので、求められない<br>AQ = QB となる点は、線分 AB の外にはない`};}
    const Q=a+m*(b-a)/(m-q),br=(x1,x2,yy,t,c)=>{const l=Math.min(x1,x2),r=Math.max(x1,x2);d.path(`M${f(l)},${yy-6} v6 H${f(r)} v-6`,`stroke="${c}" stroke-width="1.4" fill="none"`);tx(d,(l+r)/2,yy+14,t,c,11);};
    br(X(a),X(Q),y+56,'AQ = '+n(Math.abs(Q-a)),'var(--gold)');br(X(b),X(Q),y+88,'QB = '+n(Math.abs(Q-b)),'var(--c)');
    d.dot(X(a),y,'var(--ink)').dot(X(b),y,'var(--ink)').dot(X(Q),y,'var(--gold)',5);
    tx(d,X(a),y-13,'A(1)');tx(d,X(b),y-13,'B(4)');tx(d,X(Q),y+37,`Q(${n(Q)})`,'var(--gold)');
    return {svg:d.out(),read:`A(1)、B(4) を ${m} : ${q} に外分する点 Q<br>(−${q}×1 + ${m}×4) ÷ (${m} − ${q}) = <b>${n(Q)}</b><br>AQ : QB = ${n(Math.abs(Q-a))} : ${n(Math.abs(Q-b))} = ${m} : ${q}<br>`+(m>q?'m &gt; n なので、Q は B の側の延長上':'m &lt; n なので、Q は A の側の延長上')};}});};

/* ---- 平面上の点：内分点。x 座標と y 座標が、それぞれ m : n に分かれる ---- */
FIGS.h2zukeishiki_heimen=host=>FIG.mk(host,{alt:'座標平面上の線分 AB を m 対 n に内分する点 P と、座標軸への影の図',sliders:MN.map(q=>({...q})),
  draw(v){const m=v.m,q=v.n,A=[1,1],B=[7,4],P=[(q*A[0]+m*B[0])/(m+q),(q*A[1]+m*B[1])/(m+q)],p=plot(R1).grid();
    [A,P,B].forEach(z=>p.seg(z[0],z[1],z[0],0,DASH).seg(z[0],z[1],0,z[1],DASH));
    p.seg(A[0],0,P[0],0,G4).seg(P[0],0,B[0],0,C4).seg(0,A[1],0,P[1],G4).seg(0,P[1],0,B[1],C4).seg(A[0],A[1],P[0],P[1],G4).seg(P[0],P[1],B[0],B[1],C4);
    p.dot(A[0],A[1],'var(--ink)').dot(B[0],B[1],'var(--ink)').dot(P[0],P[1],'var(--gold)',5).dot(P[0],0,'var(--gold)',3.2).dot(0,P[1],'var(--gold)',3.2);
    T(p,A[0],A[1],'A',{a:'end',dx:-7,dy:-6});T(p,B[0],B[1],'B',{a:'start',dx:8,dy:-4});T(p,P[0],P[1],'P',{c:'var(--gold)',dx:-7,dy:-9});
    T(p,P[0],0,n(P[0]),{c:'var(--gold)',dy:15});T(p,0,P[1],n(P[1]),{c:'var(--gold)',a:'end',dx:-7,dy:4});T(p,7,0,'7',{c:'var(--muted)',dy:15});T(p,0,4,'4',{c:'var(--muted)',a:'end',dx:-7,dy:4});
    return {svg:p.out(),read:`A(1, 1)、B(7, 4) を ${m} : ${q} に内分する点 P<br>x 座標：(${q}×1 + ${m}×7) ÷ (${m} + ${q}) = <b>${n(P[0])}</b><br>y 座標：(${q}×1 + ${m}×4) ÷ (${m} + ${q}) = <b>${n(P[1])}</b><br>x 軸上の影も、y 軸上の影も、${m} : ${q} に分かれる`};}});

/* ---- 平面上の点：三角形の重心 ---- */
FIGS.h2zukeishiki_jushin=host=>FIG.mk(host,{alt:'三角形 ABC の3本の中線と重心 G の図',
  sliders:[{k:'x',label:'C の x 座標',min:4,max:7,step:1,v:6},{k:'y',label:'C の y 座標',min:0,max:4,step:1,v:3}],
  draw(v){const A=[2,5],B=[1,1],K=[v.x,v.y],mid=(P,Q)=>[(P[0]+Q[0])/2,(P[1]+Q[1])/2],M=mid(B,K),G=[(A[0]+B[0]+K[0])/3,(A[1]+B[1]+K[1])/3],p=plot(R1).grid();
    p.poly([A,B,K],'fill="var(--c)" fill-opacity=".14" stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round"');
    [[B,mid(K,A)],[K,mid(A,B)]].forEach(z=>p.seg(z[0][0],z[0][1],z[1][0],z[1][1],DASH).dot(z[1][0],z[1][1],'var(--muted)',2.6));
    p.seg(A[0],A[1],G[0],G[1],'stroke="var(--gold)" stroke-width="3"').seg(G[0],G[1],M[0],M[1],'stroke="var(--c)" stroke-width="3"');
    p.dot(M[0],M[1],'var(--ink)',3).dot(G[0],G[1],'var(--gold)',5);
    T(p,A[0],A[1],'A',{a:'end',dx:-7,dy:2});T(p,B[0],B[1],'B',{a:'end',dx:-7,dy:10});T(p,K[0],K[1],'C',{a:'start',dx:8,dy:5});T(p,M[0],M[1],'M',{dx:4,dy:15});T(p,G[0],G[1],'G',{c:'var(--gold)',a:'start',dx:9,dy:-3});
    T(p,(A[0]+G[0])/2,(A[1]+G[1])/2,'2',{c:'var(--gold)',a:'end',dx:-7,dy:4});T(p,(G[0]+M[0])/2,(G[1]+M[1])/2,'1',{c:'var(--c)',a:'end',dx:-7,dy:4});
    return {svg:p.out(),read:`A(2, 5)、B(1, 1)、C(${v.x}, ${v.y})<br>G の x 座標：(2 + 1 + ${v.x}) ÷ 3 = <b>${n(G[0])}</b><br>G の y 座標：(5 + 1 + ${v.y}) ÷ 3 = <b>${n(G[1])}</b><br>G は、中線 AM を 2 : 1 に内分する`};}});

/* ---- 直線の方程式：1点と傾き ---- */
FIGS.h2zukeishiki_katamuki=host=>FIG.mk(host,{alt:'点 A を通る直線を、傾き m を変えて回す図',
  sliders:[{k:'m',label:'傾き m',min:-3,max:3,step:.25,v:1.5}],play:{k:'m',from:-3,to:3,label:'傾きを変えていく',ms:3600},
  draw(v){const m=v.m,p=plot(R0).grid();
    p.seg(-6.8,1+m*(-8.8),6.8,1+m*4.8,C).seg(2,1,3,1,GL).seg(3,1,3,1+m,GL).dot(2,1,'var(--ink)').dot(3,1+m,'var(--gold)',3.5);
    T(p,2,1,'A(2, 1)',{a:'end',dx:-8,dy:m>0?-7:15});T(p,2.5,1,'1',{c:'var(--gold)',dy:m>=0?14:-6});
    if(Math.abs(m)>=.5)T(p,3,1+m/2,n(m),{c:'var(--gold)',a:'start',dx:7,dy:4});
    return {svg:p.out(),read:`点 A(2, 1) を通り、傾きが ${n(m)} の直線<br>y − 1 = ${n(m)}(x − 2)<br>整理すると <b>y = ${expr([[m,'x'],[1-2*m,'']])}</b><br>x が 1 増えると、y は ${m>0?n(m)+' 増える':m<0?n(-m)+' 減る':'変わらない'}`};}});

/* ---- 直線の方程式：一般形 ax + by + c = 0 ---- */
FIGS.h2zukeishiki_ippan=host=>FIG.mk(host,{alt:'方程式 ax + by + c = 0 の係数を変えて、直線を動かす図',
  sliders:[{k:'a',label:'a',min:-3,max:3,step:1,v:1},{k:'b',label:'b',min:-3,max:3,step:1,v:2},{k:'c',label:'c',min:-6,max:6,step:1,v:-4}],
  draw(v){const {a,b,c}=v,p=plot(R0).grid(),eq='<b>'+expr([[a,'x'],[b,'y'],[c,'']])+' = 0</b>';
    if(!a&&!b)return {svg:p.out(),read:`${eq}<br>a = 0 かつ b = 0 のとき、x も y も消える<br>直線を表さない`};
    line(p,a,b,c,C);
    if(a)p.dot(-c/a,0,'var(--gold)');if(b)p.dot(0,-c/b,'var(--gold)');
    const r=!b?`x = ${fr(-c,a)} と変形できる<br>x 軸に垂直な直線<br>傾きは決められない（y = mx + n の形に書けない）`:
      !a?`y = ${fr(-c,b)} と変形できる<br>x 軸に平行な直線（傾き 0）`:`y について解くと、傾き ${fr(-a,b)}、y 切片 ${fr(-c,b)}<br>x 軸との交点は (${fr(-c,a)}, 0)`;
    return {svg:p.out(),read:eq+'<br>'+r};}});

/* ---- 2直線の関係：平行と垂直（arg なし）／垂直条件の証明の図（arg = 'o'） ---- */
FIGS.h2zukeishiki_nichoku=(host,arg)=>{
  if(arg==='o')return FIG.mk(host,{alt:'原点を通る2直線と、直線 x = 1 との交点 A, B で三角形 OAB を作る図',
    sliders:[{k:'a',label:'m₁（直線 OA の傾き）',min:.25,max:3,step:.25,v:2},{k:'b',label:'m₂（直線 OB の傾き）',min:-3,max:-.25,step:.25,v:-1}],
    draw(v){const a=v.a,b=v.b,R=[-3.2,6.32,-3.5,3.5],p=plot(R).grid(),ok=Math.abs(a*b+1)<1e-9;
      p.poly([[0,0],[1,a],[1,b]],'fill="var(--ink)" fill-opacity=".1" stroke="none"');
      p.seg(R[0],a*R[0],R[1],a*R[1],C).seg(R[0],b*R[0],R[1],b*R[1],GOLD).seg(1,a,1,b,'stroke="var(--ink)" stroke-width="2.4"');
      if(ok)rt(p,[0,0],un(1,a),un(1,b),.28,INK);
      p.dot(0,0,'var(--ink)').dot(1,a,'var(--c)').dot(1,b,'var(--gold)');
      T(p,0,0,'O',{a:'end',dx:-10,dy:-5});T(p,1,a,`A(1, ${n(a)})`,{a:'start',dx:9,dy:5,c:'var(--c)'});T(p,1,b,`B(1, ${n(b)})`,{a:'start',dx:9,dy:3,c:'var(--gold)'});
      const s=2+a*a+b*b,t=(a-b)*(a-b);
      return {svg:p.out(),read:`OA² + OB² = (1 + ${n(a*a,4)}) + (1 + ${n(b*b,4)}) = <b>${n(s,4)}</b><br>AB² = (${n(a)} + ${n(-b)})² = <b>${n(t,4)}</b><br>`+(ok?'等しい → <b>∠AOB = 90°</b>（三平方の定理の逆）':'等しくない → ∠AOB は直角ではない')+`<br>傾きの積 m₁ × m₂ = ${n(a*b,4)}`};}});
  FIG.mk(host,{alt:'2直線の傾きを変えて、平行になるときと垂直になるときを確かめる図',
    sliders:[{k:'a',label:'ℓ₁ の傾き m₁',min:-3,max:3,step:.25,v:2},{k:'b',label:'ℓ₂ の傾き m₂',min:-3,max:3,step:.25,v:-1}],
    draw(v){const a=v.a,b=v.b,p=plot(R0).grid(),pr=a*b;
      p.seg(-6.8,a*-6.8+1,6.8,a*6.8+1,C).seg(-6.8,b*-6.8-2,6.8,b*6.8-2,GOLD);
      const lb=(m,k,t,c)=>{let x=Math.abs(m)<.6?5.4:(3.9-k)/m;x=Math.max(-6,Math.min(6,x));T(p,x,m*x+k,t,{c,a:'start',dx:8,dy:m>0?13:-4,s:15});};
      lb(a,1,'ℓ₁','var(--c)');lb(b,-2,'ℓ₂','var(--gold)');
      let r;
      if(a===b)r='傾きが等しい → <b>平行</b><br>共有点はない（連立方程式の解がない）';
      else{const x=-3/(a-b),y=a*x+1,perp=Math.abs(pr+1)<1e-9,ang=perp?90:Math.atan(Math.abs((a-b)/(1+pr)))*180/Math.PI;
        if(perp)rt(p,[x,y],un(1,a),un(1,b),.36,INK);
        p.dot(x,y,'var(--ink)');
        r=(perp?'積が −1 → <b>垂直</b>':`2直線のなす角は ${n(ang,1)}°`)+`<br>交点 (${n(x)}, ${n(y)})`;}
      return {svg:p.out(),read:`ℓ₁：y = ${expr([[a,'x'],[1,'']])}　ℓ₂：y = ${expr([[b,'x'],[-2,'']])}<br>傾きの積 m₁ × m₂ = <b>${n(pr,4)}</b><br>`+r};}});};

/* ---- なぜ：点と直線の距離。垂線の足を求める手順（arg なし）／平行移動（arg = 'ido'） ---- */
FIGS.h2zukeishiki_kyori=(host,arg)=>{
  if(arg==='ido')return FIG.mk(host,{alt:'点 P と直線 ℓ をまとめて平行移動し、P を原点に重ねる図',
    sliders:[{k:'t',label:'平行移動（0 から 1 へ）',min:0,max:1,step:.05,v:0}],play:{k:'t',from:0,to:1,label:'P を原点へ移す',ms:3200},
    draw(v){const t=v.t,P=[2-2*t,1-t],c=25-10*t,H=[P[0]+1.8,P[1]+2.4],p=plot(R2).grid(),y=(x,k)=>(k-3*x)/4;
      if(t>0)p.seg(R2[0],y(R2[0],25),R2[1],y(R2[1],25),DASH).seg(2,1,3.8,3.4,DASH).seg(2,1,P[0],P[1],DASH).dot(2,1,'var(--muted)',3.2);
      p.seg(R2[0],y(R2[0],c),R2[1],y(R2[1],c),C).seg(P[0],P[1],H[0],H[1],'stroke="var(--gold)" stroke-width="3.2"');
      rt(p,H,[-.6,-.8],[.8,-.6],.28,THIN);
      p.dot(P[0],P[1],'var(--ink)').dot(H[0],H[1],'var(--gold)',3.5);
      T(p,P[0],P[1],'P',{a:'end',dx:-9,dy:-5});T(p,H[0],H[1],'H',{a:'start',dx:6,dy:-8});T(p,(P[0]+H[0])/2,(P[1]+H[1])/2,'3',{c:'var(--gold)',a:'end',dx:-8,dy:0});T(p,(c-2.4)/3,.6,'ℓ',{c:'var(--c)',dx:7,dy:-7,s:15});
      return {svg:p.out(),read:`P(${n(P[0])}, ${n(P[1])})、ℓ：3x + 4y − ${n(c)} = 0<br>P と ℓ の距離 PH = <b>3</b><br>`+(t>=1?'P が原点に重なった<br>原点と 3x + 4y − 15 = 0 の距離 = 15 ÷ 5 = 3':'点と直線をいっしょに動かしても、距離は変わらない')};}});
  FIG.mk(host,{alt:'原点から直線に垂線を下ろし、交点 H までの長さを求める手順の図',
    sliders:[{k:'s',label:'手順',min:1,max:4,step:1,v:1}],play:{k:'s',from:1,to:4,label:'順に見る',ms:4400},
    draw(v){const s=v.s,p=plot(R2).grid(),y=x=>(25-3*x)/4;
      p.seg(R2[0],y(R2[0]),R2[1],y(R2[1]),C);
      if(s>=2)p.seg(R2[0],4*R2[0]/3,R2[1],4*R2[1]/3,'stroke="var(--gold)" stroke-width="1.6" stroke-dasharray="5 4"');
      if(s>=4)p.seg(0,0,3,4,'stroke="var(--gold)" stroke-width="3.4"');
      if(s>=3){rt(p,[3,4],[-.6,-.8],[.8,-.6],.28,THIN);p.dot(3,4,'var(--gold)');T(p,3,4,'H(3, 4)',{a:'start',dx:9,dy:-6,c:'var(--gold)'});}
      if(s>=4)T(p,1.5,2,'5',{c:'var(--gold)',a:'end',dx:-9,dy:0});
      p.dot(0,0,'var(--ink)');T(p,0,0,'O',{a:'end',dx:-8,dy:-7});T(p,7.6,y(7.6),'ℓ',{c:'var(--c)',dx:7,dy:-7,s:15});
      return {svg:p.out(),read:['<b>手順 1</b>　直線 ℓ：3x + 4y − 25 = 0<br>原点 O と ℓ の距離を求めたい<br>ℓ の傾きは −3/4','<b>手順 2</b>　O を通り、ℓ に垂直な直線を引く<br>傾きは 4/3（−3/4 との積が −1）<br>式は y = 4/3·x、すなわち 4x − 3y = 0',
        '<b>手順 3</b>　2直線の交点 H を求める<br>3x + 4y = 25 と 4x − 3y = 0 を連立<br>x = 3、y = 4','<b>手順 4</b>　OH = √(3² + 4²) = <b>5</b><br>これが、原点 O と直線 ℓ の距離'][s-1]};}});};

/* ---- 円の方程式：中心と半径 ---- */
FIGS.h2zukeishiki_en=host=>FIG.mk(host,{alt:'中心と半径を変えて、円とその方程式の対応を見る図',
  sliders:[{k:'a',label:'中心の x 座標 a',min:-3,max:3,step:.5,v:1},{k:'b',label:'中心の y 座標 b',min:-2,max:2,step:.5,v:1},{k:'r',label:'半径 r',min:1,max:3,step:.5,v:2}],
  draw(v){const {a,b,r}=v,t=40*Math.PI/180,P=[a+r*Math.cos(t),b+r*Math.sin(t)],p=plot(R0).grid();
    circ(p,a,b,r,CF);
    p.poly([[a,b],[P[0],b],P],'fill="var(--gold)" fill-opacity=".22" stroke="none"').seg(a,b,P[0],b,THIN).seg(P[0],b,P[0],P[1],THIN).seg(a,b,P[0],P[1],GL);
    p.dot(a,b,'var(--ink)',3.5).dot(P[0],P[1],'var(--gold)');
    T(p,a,b,'C',{a:'end',dx:-7,dy:4});T(p,P[0],P[1],'P(x, y)',{dy:-9});
    if(r>=2){T(p,(a+P[0])/2,b,'x − a',{dy:14});T(p,P[0],(b+P[1])/2,'y − b',{a:'start',dx:6,dy:4});T(p,(a+P[0])/2,(b+P[1])/2,'r',{c:'var(--gold)',dx:-7,dy:-6});}
    return {svg:p.out(),read:`中心 (${n(a)}, ${n(b)})、半径 ${n(r)}<br><b>${sq('x',a)} + ${sq('y',b)} = ${n(r*r)}</b><br>展開して整理すると<br>x² + y²${term(-2*a,'x')}${term(-2*b,'y')}${term(a*a+b*b-r*r,'')} = 0`};}});

/* ---- 円と直線：円 x² + y² = 8 と直線 y = x + k ---- */
FIGS.h2zukeishiki_enchoku=host=>FIG.mk(host,{alt:'円と直線の位置関係を、直線を平行に動かして調べる図',
  sliders:[{k:'k',label:'k',min:-6,max:6,step:.5,v:2}],play:{k:'k',from:-6,to:6,label:'直線を下から上へ動かす',ms:4400},
  draw(v){const k=v.k,r=Math.sqrt(8),d=Math.abs(k)/Math.SQRT2,D=64-4*k*k,H=[-k/2,k/2],p=plot(R0).grid();
    circ(p,0,0,r,CF);p.seg(-6.8,-6.8+k,6.8,6.8+k,GOLD);
    if(k){p.seg(0,0,H[0],H[1],'stroke="var(--ink)" stroke-width="2.8"');rt(p,H,un(-H[0],-H[1]),[Math.SQRT1_2,Math.SQRT1_2],.28,THIN);
      if(d>=.7)T(p,H[0]/2,H[1]/2,'d',{dx:-8,dy:13});}
    if(D>0){const w=Math.sqrt(16-k*k);[(-k+w)/2,(-k-w)/2].forEach(x=>p.dot(x,x+k,'var(--gold)'));}
    else if(D===0)p.dot(H[0],H[1],'var(--gold)');
    p.dot(0,0,'var(--ink)',3.2);T(p,0,0,'O',k?{a:'start',dx:7,dy:k>0?14:-6}:{a:'end',dx:-7,dy:-6});
    return {svg:p.out(),read:`円 x² + y² = 8 と直線 y = ${k?'x '+sg(k):'x'}<br>中心と直線の距離 d = ${n(d)}、半径 r = 2√2 ≈ 2.83<br>判別式 D = 64 − 4k² = ${n(D)}<br>`+(D>0?'d &lt; r、D &gt; 0 → <b>異なる2点で交わる</b>':D===0?'d = r、D = 0 → <b>接する</b>（共有点 1 個）':'d &gt; r、D &lt; 0 → <b>共有点をもたない</b>')};}});

/* ---- 円の接線：円 x² + y² = 25 の上で接点を動かす ---- */
const LP=[[5,0],[4,3],[3,4],[0,5],[-3,4],[-4,3],[-5,0],[-4,-3],[-3,-4],[0,-5],[3,-4],[4,-3]];
FIGS.h2zukeishiki_sessen=host=>FIG.mk(host,{alt:'円周上の接点を動かして、接線とその方程式を見る図',
  sliders:[{k:'i',label:'接点 P',min:0,max:11,step:1,v:1,fmt:i=>{const q=LP[Math.round(i)];return `(${n(q[0])}, ${n(q[1])})`;}}],play:{k:'i',from:0,to:11,label:'接点を1周させる',ms:5600},
  draw(v){const [x1,y1]=LP[Math.round(v.i)],p=plot(R5).grid(),eq=expr([[x1,'x'],[y1,'y']])+' = 25';
    circ(p,0,0,5,CF);line(p,x1,y1,-25,GOLD,R5);p.seg(0,0,x1,y1,INK);
    rt(p,[x1,y1],[-x1/5,-y1/5],[-y1/5,x1/5],.7,THIN);
    p.dot(0,0,'var(--ink)',3.2).dot(x1,y1,'var(--gold)');
    T(p,x1,y1,'P',{c:'var(--gold)',dx:f(x1*2.6),dy:f(-y1*2.6+4)});T(p,0,0,'O',x1<0&&y1<0?{dx:9,dy:-6}:{dx:-9,dy:15});
    return {svg:p.out(),read:`接点 P(${n(x1)}, ${n(y1)})<br>`+(!y1?`OP は x 軸上 → 接線は x 軸に垂直<br>接線：<b>${eq}</b>、すなわち x = ${n(25/x1)}`:!x1?`OP は y 軸上 → 接線は x 軸に平行<br>接線：<b>${eq}</b>、すなわち y = ${n(25/y1)}`:`OP の傾き ${fr(y1,x1)} → 接線の傾き ${fr(-x1,y1)}<br>接線：<b>${eq}</b>`)+'<br>接点の座標が、x と y の係数になる'};}});

/* ---- 2つの円：中心間の距離と位置関係 ---- */
FIGS.h2zukeishiki_nien=host=>FIG.mk(host,{alt:'2つの円の中心間の距離を変えて、位置関係を調べる図',
  sliders:[{k:'d',label:'中心間の距離 d',min:0,max:7,step:.5,v:6}],play:{k:'d',from:7,to:0,label:'円 C₂ を近づける',ms:4800},
  draw(v){const d=v.d,r1=3,r2=1.5,s=r1+r2,t=r1-r2,p=plot([-3.8,9.8,-5,5]).grid();
    circ(p,0,0,r1,CF);circ(p,d,0,r2,'fill="var(--gold)" fill-opacity=".14" stroke="var(--gold)" stroke-width="2.2"');
    if(d)p.seg(0,0,d,0,'stroke="var(--ink)" stroke-width="2.6"');
    if(d>0&&d>=t&&d<=s){const x=(d*d+r1*r1-r2*r2)/(2*d),y=Math.sqrt(Math.max(0,r1*r1-x*x));p.dot(x,y,'var(--ink)');if(y>1e-6)p.dot(x,-y,'var(--ink)');}
    p.dot(0,0,'var(--c)',3.5).dot(d,0,'var(--gold)',3.5);
    T(p,0,r1,'C₁',{c:'var(--c)',dy:-7});T(p,d,r2,'C₂',{c:'var(--gold)',dy:-7});if(d>=1)T(p,d/2,0,'d',{dy:-7});
    const w=d>s?'d &gt; r₁ + r₂ → <b>互いに外部にある</b>（共有点 0 個）':d===s?'d = r₁ + r₂ → <b>外接する</b>（共有点 1 個）':d>t?'r₁ − r₂ &lt; d &lt; r₁ + r₂ → <b>2点で交わる</b>':d===t?'d = r₁ − r₂ → <b>内接する</b>（共有点 1 個）':'d &lt; r₁ − r₂ → <b>C₂ が C₁ の内部にある</b>（共有点 0 個）';
    return {svg:p.out(),read:`半径 r₁ = 3、r₂ = 1.5、中心間の距離 d = <b>${n(d)}</b><br>r₁ + r₂ = 4.5、r₁ − r₂ = 1.5<br>`+w};}});

/* ---- 軌跡：円周上の点 Q と定点 A の中点 P の跡 ---- */
FIGS.h2zukeishiki_chuten=host=>{const seen=new Set();
  FIG.mk(host,{alt:'円周上を動く点 Q と定点 A の中点 P の跡を残す図',
  sliders:[{k:'t',label:'Q の位置（度）',min:0,max:360,step:5,v:40}],play:{k:'t',from:0,to:360,label:'Q を1周させる',ms:5600},
  draw(v){const t=v.t*Math.PI/180,Q=[4*Math.cos(t),4*Math.sin(t)],P=[(Q[0]+6)/2,Q[1]/2],p=plot([-4.8,8.8,-5,5]).grid(),w=un(-Q[1],Q[0]-6);seen.add(Math.round(v.t/5)%72);
    circ(p,0,0,4,'fill="none" stroke="var(--c)" stroke-width="2.4"');
    if(seen.size>=60)circ(p,3,0,2,'fill="none" stroke="var(--gold)" stroke-width="1.4" stroke-dasharray="5 4"');
    for(const k of seen){const u=k*5*Math.PI/180;p.dot(3+2*Math.cos(u),2*Math.sin(u),'var(--gold)',2.4);}
    p.seg(6,0,Q[0],Q[1],THIN).dot(6,0,'var(--ink)').dot(Q[0],Q[1],'var(--c)').dot(P[0],P[1],'var(--gold)',5);
    T(p,6,0,'A',{a:'start',dx:8,dy:15});T(p,Q[0],Q[1],'Q',{c:'var(--c)',dx:f(Math.cos(t)*13),dy:f(-Math.sin(t)*13+4)});T(p,P[0],P[1],'P',{c:'var(--gold)',dx:f(-w[0]*13),dy:f(w[1]*13+4)});
    return {svg:p.out(),read:`Q(${n(Q[0])}, ${n(Q[1])}) は円 x² + y² = 16 の上<br>A(6, 0) との中点 P(<b>${n(P[0])}, ${n(P[1])}</b>)<br>P の跡（金色の点） ${seen.size} 個<br>`+(seen.size>=60?'P は、中心 (3, 0)、半径 2 の円をえがく':'Q を動かして、P の跡を増やす')};}});};

/* ---- なぜ：2点 A(−1, 0), B(2, 0) からの距離の比が 2 : 1 の点を、2つの円の交点として打つ ---- */
FIGS.h2zukeishiki_apollo=host=>{const seen=new Set();
  FIG.mk(host,{alt:'2点 A, B からの距離の比が 2 対 1 の点を、2つの円の交点として次々に打つ図',
  sliders:[{k:'r',label:'BP の長さ r',min:1,max:3,step:.05,v:2}],play:{k:'r',from:1,to:3,label:'r を変えながら点を打つ',ms:5600},
  draw(v){const r=v.r,p=plot([-3.2,7.68,-4,4]).grid(),pt=q=>{const x=(q*q+1)/2;return [x,Math.sqrt(Math.max(0,4-(x-3)*(x-3)))];};seen.add(Math.round(r*20));
    circ(p,-1,0,2*r,'fill="none" stroke="var(--c)" stroke-width="1.3"');circ(p,2,0,r,'fill="none" stroke="var(--muted)" stroke-width="1.3"');
    if(seen.size>=30)circ(p,3,0,2,'fill="none" stroke="var(--gold)" stroke-width="1.4" stroke-dasharray="5 4"');
    let cnt=0;for(const k of seen){const z=pt(k/20);p.dot(z[0],z[1],'var(--gold)',2.4);cnt++;if(z[1]>1e-6){p.dot(z[0],-z[1],'var(--gold)',2.4);cnt++;}}
    const [x,y]=pt(r);
    p.seg(-1,0,x,y,'stroke="var(--c)" stroke-width="2.2"').seg(2,0,x,y,'stroke="var(--ink)" stroke-width="2.2"');
    p.dot(-1,0,'var(--ink)').dot(2,0,'var(--ink)').dot(x,y,'var(--gold)',5);if(y>1e-6)p.dot(x,-y,'var(--gold)',5);
    T(p,-1,0,'A',{dx:-4,dy:17});T(p,2,0,'B',{dx:5,dy:17});T(p,x,y,'P',{c:'var(--gold)',dy:-10});
    if(y>.6){T(p,(x-1)/2,y/2,n(2*r),{c:'var(--c)',a:'end',dx:-6,dy:-5});T(p,(x+2)/2,y/2,n(r),{a:'start',dx:7,dy:3});}
    return {svg:p.out(),read:`B から ${n(r)}、A から ${n(2*r)} の距離にある点<br>2つの円の交点 P(${n(x)}, ${y>1e-6?'±':''}${n(y)})<br>AP : BP = ${n(2*r)} : ${n(r)} = 2 : 1<br>打った点 <b>${cnt}</b> 個`+(seen.size>=30?'。点は1つの円の上に並んでいる':'')};}});};

/* ---- 不等式の表す領域：直線（arg なし）／円（arg = 'en'）。点 P を代入して確かめる ---- */
FIGS.h2zukeishiki_ryoiki=(host,arg)=>{const en=arg==='en',NM=en?['x² + y² < 9','x² + y² > 9']:['y > x − 1','y < x − 1'];
  FIG.mk(host,{alt:en?'円を境界線とする領域と、座標を代入して確かめる点 P の図':'直線を境界線とする領域と、座標を代入して確かめる点 P の図',
  sliders:[{k:'s',label:'不等式',min:0,max:1,step:1,v:0,fmt:s=>NM[Math.round(s)]},{k:'x',label:'P の x 座標',min:-6,max:6,step:.5,v:2},{k:'y',label:'P の y 座標',min:-4.5,max:4.5,step:.5,v:3}],
  draw(v){const s=Math.round(v.s),x=v.x,y=v.y,g=plot(R0).grid(),p=plot(R0),FILL='fill="var(--c)" fill-opacity=".24" stroke="none"',BD='stroke="var(--c)" stroke-width="2" stroke-dasharray="6 4" fill="none"';
    let raw='',L,Rt,sub,side;
    if(en){L=x*x+y*y;Rt=9;sub=`x² + y² = ${n(L)}`;side=s?'円の外部':'円の内部';
      if(s)raw=`<path fill-rule="evenodd" d="M0,0H340V250H0Z M${f(g.sx(3))},${f(g.sy(0))} A75,75 0 1 0 ${f(g.sx(-3))},${f(g.sy(0))} A75,75 0 1 0 ${f(g.sx(3))},${f(g.sy(0))}Z" ${FILL}/>`;else circ(p,0,0,3,FILL);
      circ(p,0,0,3,BD);}
    else{L=y;Rt=x-1;sub=`左辺 ${n(y)}、右辺 ${n(x)} − 1 = ${n(Rt)}`;side=s?'直線の下側':'直線の上側';
      p.poly([[-6.8,-7.8],[6.8,5.8],[6.8,s?-20:20],[-6.8,s?-20:20]],FILL).seg(-6.8,-7.8,6.8,5.8,BD);}
    const on=Math.abs(L-Rt)<1e-9,ok=!on&&(s?(en?L>Rt:L<Rt):(en?L<Rt:L>Rt)),op=(en?!s:s)?'&lt;':'&gt;';
    p.dot(x,y,on?'var(--gold)':ok?'var(--ok)':'var(--ng)',5);T(p,x,y,'P',{dx:9,dy:-8,a:'start'});
    return {svg:g.out()+raw+p.out(),read:`${NM[s].replace('<','&lt;').replace('>','&gt;')} の表す領域（${side}）<br>P(${n(x)}, ${n(y)}) を代入：${sub}<br>`+
      (on?`${n(L)} = ${n(Rt)} → P は境界線上<br>等号がないので、<b>境界線は領域にふくまれない</b>`:`${n(L)} ${op} ${n(Rt)} は`+(ok?'成り立つ → <b>P は領域の中</b>':'成り立たない → <b>P は領域の外</b>'))};}});};

/* ---- 領域と最大・最小：x ≥ 0、y ≥ 0、2x + y ≤ 8、x + 3y ≤ 9 の領域と、直線 ax + by = k。arg = {a, b, q: 最大値を表示しない} ---- */
FIGS.h2zukeishiki_senkei=(host,arg)=>{const a=(arg&&arg.a)||1,b=(arg&&arg.b)||1,hide=!!(arg&&arg.q),V=[[0,0],[4,0],[3,2],[0,3]],val=q=>a*q[0]+b*q[1],kmax=Math.max(...V.map(val)),st=kmax>8?.5:.25,top=Math.ceil(kmax*1.3),ob=expr([[a,'x'],[b,'y']]),best=V.find(q=>val(q)===kmax);
  FIG.mk(host,{alt:'連立不等式の表す領域と、直線を平行に動かして最大値を探す図',
  sliders:[{k:'k',label:'k',min:0,max:top,step:st,v:Math.round(kmax*.4/st)*st}],play:{k:'k',from:0,to:top,label:'k を大きくしていく',ms:4800},
  draw(v){const k=v.k,R=[-1.2,6.96,-1,5],p=plot(R).grid();
    p.seg(R[0],8-2*R[0],R[1],8-2*R[1],DASH).seg(R[0],(9-R[0])/3,R[1],(9-R[1])/3,DASH);
    p.poly(V,'fill="var(--c)" fill-opacity=".26" stroke="var(--c)" stroke-width="1.8" stroke-linejoin="round"');
    line(p,a,b,-k,'stroke="var(--gold)" stroke-width="1.6"',R);
    // 直線のうち、領域の中にある部分を太くする
    const hit=[];V.forEach((P,i)=>{const Q=V[(i+1)%4],fp=val(P)-k,fq=val(Q)-k;if(Math.abs(fp)<1e-9)hit.push(P);else if(Math.abs(fq)>1e-9&&fp*fq<0){const t=fp/(fp-fq);hit.push([P[0]+(Q[0]-P[0])*t,P[1]+(Q[1]-P[1])*t]);}});
    if(hit.length>=2){hit.sort((s,t)=>s[0]-t[0]||s[1]-t[1]);const s=hit[0],t=hit[hit.length-1];p.seg(s[0],s[1],t[0],t[1],G4);}
    else if(hit.length===1)p.dot(hit[0][0],hit[0][1],'var(--gold)',5.5);
    V.slice(1).forEach(P=>p.dot(P[0],P[1],'var(--ink)',3));
    T(p,4,0,'(4, 0)',{a:'end',dx:-3,dy:15});T(p,3,2,'(3, 2)',{a:'start',dx:8,dy:-5});T(p,0,3,'(0, 3)',{a:'end',dx:-6,dy:15});
    T(p,1.8,4.4,'2x + y = 8',{a:'start',dx:7,dy:2,c:'var(--muted)'});T(p,6.7,.77,'x + 3y = 9',{a:'end',dy:16,c:'var(--muted)'});
    const has=k<=kmax+1e-9;
    return {svg:p.out(),read:`${ob} = k とおく。k = <b>${n(k)}</b><br>`+(has?`直線は領域と共有点をもつ<br>→ ${ob} = ${n(k)} となる点が領域にある`:`直線は領域と共有点をもたない<br>→ ${ob} は ${n(k)} になれない`)+(hide?'':`<br>共有点をもつのは 0 ≦ k ≦ ${n(kmax)}。最大は点 (${best[0]}, ${best[1]}) を通るとき`)};}});};

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
const AX='stroke="var(--muted)" stroke-width="1.2"';
const Q={
 chusen:{alt:'辺 BC を x 軸上に、BC の中点 M を原点にとった三角形 ABC の図',h:196,f(){const d=draw(),O=[170,150],A=[222,36],B=[70,150],K=[270,150];
   d.line(20,150,322,150,AX).line(170,186,170,14,AX);tx(d,328,154,'x','var(--muted)',11);tx(d,170,11,'y','var(--muted)',11);
   d.poly([A,B,K],'fill="var(--c)" fill-opacity=".14" stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round"').line(A[0],A[1],O[0],O[1],'stroke="var(--gold)" stroke-width="2" stroke-dasharray="5 4"');
   d.dot(A[0],A[1]).dot(B[0],B[1]).dot(K[0],K[1]).dot(O[0],O[1],'var(--gold)');
   tx(d,A[0]+6,A[1]-9,'A(a, b)');tx(d,B[0],B[1]+18,'B(−c, 0)');tx(d,K[0],K[1]+18,'C(c, 0)');tx(d,O[0]-8,O[1]+18,'M','var(--gold)',12,'end');
   return {svg:d.out(),read:'辺 BC を x 軸上に、BC の中点 M を原点にとる'};}},
 suishin:{alt:'辺 BC を x 軸上に、頂点 A を y 軸上にとった三角形 ABC と、3本の垂線の図',h:206,f(){const d=draw(),O=[150,168],A=[150,30],B=[60,168],K=[290,168],H=[150,168-90*140/138];
   const foot=(P,S,E)=>{const u=un(E[0]-S[0],E[1]-S[1]),t=(P[0]-S[0])*u[0]+(P[1]-S[1])*u[1];return [S[0]+u[0]*t,S[1]+u[1]*t];},D=foot(B,A,K),E=foot(K,A,B);
   const mark=(P,S,E,s=7)=>{const u=un(S[0]-P[0],S[1]-P[1]),w=un(E[0]-P[0],E[1]-P[1]);d.path(`M${f(P[0]+u[0]*s)},${f(P[1]+u[1]*s)} L${f(P[0]+(u[0]+w[0])*s)},${f(P[1]+(u[1]+w[1])*s)} L${f(P[0]+w[0]*s)},${f(P[1]+w[1]*s)}`,THIN);};
   d.line(20,168,322,168,AX).line(150,198,150,12,AX);tx(d,328,172,'x','var(--muted)',11);tx(d,150,10,'y','var(--muted)',11);
   d.poly([A,B,K],'fill="var(--c)" fill-opacity=".14" stroke="var(--ink)" stroke-width="1.8" stroke-linejoin="round"');
   const GD='stroke="var(--gold)" stroke-width="1.8" stroke-dasharray="5 4"';d.line(A[0],A[1],O[0],O[1],GD).line(B[0],B[1],D[0],D[1],GD).line(K[0],K[1],E[0],E[1],GD);
   mark(D,B,A);mark(E,K,A);mark(O,A,K);
   d.dot(A[0],A[1]).dot(B[0],B[1]).dot(K[0],K[1]).dot(H[0],H[1],'var(--gold)');
   tx(d,A[0]+8,A[1]-6,'A(0, a)','var(--ink)',12,'start');tx(d,B[0],B[1]+18,'B(b, 0)');tx(d,K[0],K[1]+18,'C(c, 0)');tx(d,H[0]+10,H[1]+16,'H','var(--gold)',12,'start');tx(d,O[0]-8,O[1]+16,'O','var(--muted)',11,'end');
   return {svg:d.out(),read:'辺 BC を x 軸上に、頂点 A を y 軸上にとる'};}},
 taisho:{alt:'直線 ℓ と、ℓ に関して対称な2点 A, B の図',h:250,f(){const R=[-2.3,8.58,-3,5],p=plot(R).grid();
   line(p,1,2,-5,C,R);p.seg(4,3,2,-1,'stroke="var(--gold)" stroke-width="1.8" stroke-dasharray="5 4"');rt(p,[3,1],un(1,2),un(2,-1),.3,THIN);
   p.dot(4,3,'var(--ink)').dot(2,-1,'var(--gold)').dot(3,1,'var(--ink)',3);
   T(p,4,3,'A(4, 3)',{a:'start',dx:9,dy:4});T(p,2,-1,'B(p, q)',{a:'start',dx:9,dy:5,c:'var(--gold)'});T(p,3,1,'M',{a:'end',dx:-8,dy:13});T(p,-1.6,3.3,'ℓ',{c:'var(--c)',dy:-9,s:15});
   return {svg:p.out(),read:'ℓ：x + 2y − 5 = 0<br>AB ⊥ ℓ、線分 AB の中点 M は ℓ 上にある'};}},
 gaiten:{alt:'円の外の点 A から円に引いた2本の接線の図',h:250,f(){const p=plot(R5).grid();
   circ(p,0,0,5,CF);
   [[3,4],[4,-3]].forEach(z=>{const e=[7+(z[0]-7)*1.9,1+(z[1]-1)*1.9];p.seg(7,1,e[0],e[1],GOLD).seg(0,0,z[0],z[1],THIN);rt(p,z,[-z[0]/5,-z[1]/5],un(7-z[0],1-z[1]),.7,THIN);p.dot(z[0],z[1],'var(--gold)',3.5);});
   p.dot(0,0,'var(--ink)',3.2).dot(7,1,'var(--ink)');T(p,0,0,'O',{a:'end',dx:-7,dy:14});T(p,7,1,'A',{a:'start',dx:9,dy:-5});
   return {svg:p.out(),read:'円 x² + y² = 25 と、点 A(7, 1) から引いた2本の接線'};}},
 ryoikiq:{alt:'円と直線を境界線とする領域の図',h:250,f(){const p=plot([-4.08,4.08,-3,3]).grid(),q=[],w=Math.sqrt(7),t0=Math.atan2((1+w)/2,(-1+w)/2),t1=Math.atan2((1-w)/2,(-1-w)/2)+2*Math.PI;
   for(let i=0;i<=48;i++){const t=t0+(t1-t0)*i/48;q.push([2*Math.cos(t),2*Math.sin(t)]);}
   p.poly(q,'fill="var(--c)" fill-opacity=".34" stroke="none"');circ(p,0,0,2,'stroke="var(--c)" stroke-width="2" stroke-dasharray="6 4" fill="none"');p.seg(-4.08,-3.08,4.08,5.08,'stroke="var(--c)" stroke-width="2" stroke-dasharray="6 4"');
   p.dot(-1,0,'var(--ink)',3).dot(0,1,'var(--ink)',3).dot(2,0,'var(--ink)',3);T(p,2,0,'2',{a:'start',dx:6,dy:14});
   return {svg:p.out(),read:'色をつけた部分。境界線はふくまない<br>円の中心は原点、半径は 2。直線は 2点 (−1, 0)、(0, 1) を通る'};}}
};
FIGS.h2zukeishiki_q=(host,key)=>{const q=Q[key];FIG.mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){return q.f();}});};
})();
