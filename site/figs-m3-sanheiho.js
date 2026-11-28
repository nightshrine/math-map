/* 中学3年「三平方の定理と円」の図（FIGS.m3sanheiho_*）。動かせる図と、問題に付ける図（m3sanheiho_q） */
(function(){
const {draw,n,mk,plot}=FIG;
const f=v=>v.toFixed(1);
const INK='stroke="var(--ink)" stroke-width="1.6" fill="none" stroke-linejoin="round"';
const SUB='stroke="var(--muted)" stroke-width="1.2" fill="none"';
const DSH='stroke="var(--muted)" stroke-width="1.2" fill="none" stroke-dasharray="4 4"';
const HG='stroke="var(--gold)" stroke-width="3.2" fill="none" stroke-linecap="round"';
const HC='stroke="var(--c)" stroke-width="3.2" fill="none" stroke-linecap="round"';
const MG='stroke="var(--gold)" stroke-width="2" fill="none"';
const MC='stroke="var(--c)" stroke-width="2" fill="none"';
const MK='stroke="var(--ok)" stroke-width="2" fill="none"';
const GD='stroke="var(--gold)" stroke-width="1.8" fill="none" stroke-dasharray="5 4"';
const FC='fill="var(--c)" fill-opacity=".24" stroke="none"';
const FG='fill="var(--gold)" fill-opacity=".24" stroke="none"';
const un=(P,Q)=>{const x=Q[0]-P[0],y=Q[1]-P[1],l=Math.hypot(x,y)||1;return [x/l,y/l];};
const mid=(P,Q,t=.5)=>[P[0]+(Q[0]-P[0])*t,P[1]+(Q[1]-P[1])*t];
const cen=ps=>[ps.reduce((s,p)=>s+p[0],0)/ps.length,ps.reduce((s,p)=>s+p[1],0)/ps.length];
const dir=(P,Q)=>Math.atan2(P[1]-Q[1],Q[0]-P[0])*180/Math.PI;
const foot=(P,A,B)=>{const u=un(A,B),t=(P[0]-A[0])*u[0]+(P[1]-A[1])*u[1];return [A[0]+u[0]*t,A[1]+u[1]*t];};
// 2直線 AB, CD の交点
const cross=(A,B,C,D)=>{const a=B[0]-A[0],b=B[1]-A[1],c=D[0]-C[0],e=D[1]-C[1],t=((C[0]-A[0])*e-(C[1]-A[1])*c)/(a*e-b*c);return [A[0]+a*t,A[1]+b*t];};
// 円周上の点（角度は度。右向きが 0、反時計回りが正）
const pc=(O,R,a)=>[O[0]+R*Math.cos(a*Math.PI/180),O[1]-R*Math.sin(a*Math.PI/180)];
// 文字（線に重なっても読めるよう、地の色でふちどる）
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
const seg=(d,P,Q,st=INK)=>d.line(P[0],P[1],Q[0],Q[1],st);
const nm=(d,P,t,G,k=12,c)=>{const u=un(G,P);return tx(d,P[0]+u[0]*k,P[1]+u[1]*k+4,t,c);};
const names=(d,P,s,g)=>{s.split('').forEach((c,i)=>nm(d,P[i],c,g));return d;};
const len=(d,P,Q,t,G,k=11,c='var(--muted)')=>{const m=mid(P,Q),u=un(P,Q);let x=-u[1],y=u[0];if((m[0]-G[0])*x+(m[1]-G[1])*y<0){x=-x;y=-y;}return tx(d,m[0]+x*k,m[1]+y*k+4,t,c);};
const ang=(d,P,Q,R,r=14,st=MG)=>{let a=dir(P,Q),b=dir(P,R);if(b-a>180)b-=360;if(b-a<-180)b+=360;return d.angle(P[0],P[1],r,a,b,st);};
// 角の中に書く文字（角の二等分線の上、頂点から r の位置）
const angT=(d,P,Q,R,r,t,c,s=11)=>{const u=un(P,Q),w=un(P,R);let x=u[0]+w[0],y=u[1]+w[1];const l=Math.hypot(x,y)||1;return tx(d,P[0]+x/l*r,P[1]+y/l*r+4,t,c,s);};
// 頂点 P から角度 a（度）の向きに r だけ離れた位置に文字を書く
const at=(d,P,a,r,t,c,s=11)=>{const q=pc(P,r,a);return tx(d,q[0],q[1]+4,t,c,s);};
const rt=(d,P,Q,R,s=8,st=SUB)=>{const u=un(P,Q),w=un(P,R);return d.path(`M${f(P[0]+u[0]*s)},${f(P[1]+u[1]*s)} L${f(P[0]+(u[0]+w[0])*s)},${f(P[1]+(u[1]+w[1])*s)} L${f(P[0]+w[0]*s)},${f(P[1]+w[1]*s)}`,st);};
const tick=(d,P,Q,k=1,st=SUB)=>{const m=mid(P,Q),u=un(P,Q);for(let i=0;i<k;i++){const o=(i-(k-1)/2)*4,x=m[0]+u[0]*o,y=m[1]+u[1]*o;d.line(x-u[1]*5,y+u[0]*5,x+u[1]*5,y-u[0]*5,st);}return d;};
// 円弧：中心 O、半径 R、角度 a0 から a1 へ反時計回り
const arc=(d,O,R,a0,a1,st)=>{const P=pc(O,R,a0),Q=pc(O,R,a1);let s=a1-a0;while(s<0)s+=360;return d.path(`M${f(P[0])},${f(P[1])} A${R},${R} 0 ${s>180?1:0} 0 ${f(Q[0])},${f(Q[1])}`,st);};
const STEP=(k=4)=>({sliders:[{k:'s',label:'手順',min:1,max:k,step:1,v:1}],play:{k:'s',from:1,to:k,label:'順に見る',ms:1100*k}});
// √q を a√b の形にする（q は自然数）
const simp=q=>{let a=1;for(let i=2;i*i<=q;i++)while(q%(i*i)===0){q/=i*i;a*=i;}return [a,q];};
const root=q=>{if(!Number.isInteger(q)){const r=Math.sqrt(q);return `√${n(q)} ${Math.abs(r*100-Math.round(r*100))<1e-9?'=':'≈'} ${n(r)}`;}const [a,b]=simp(q);return b===1?`√${q} = ${a}`:(a===1?`√${q}`:`√${q} = ${a}√${b}`)+` ≈ ${n(Math.sqrt(q))}`;};

/* ---- 円周角と中心角 ---- */
FIGS.m3sanheiho_enshukaku=host=>mk(host,{alt:'円周上の点 P を動かしても、弧 AB に対する円周角が変わらないことを示す図',
  sliders:[{k:'p',label:'点 P の位置',min:0,max:100,step:1,v:55},{k:'c',label:'中心角 ∠AOB（度）',min:40,max:180,step:10,v:100}],play:{k:'p',from:0,to:100,label:'P を円周上で動かす',ms:3600},
  draw(v){const O=[170,122],R=100,c=v.c,a0=-90-c/2,a1=-90+c/2,A=pc(O,R,a0),B=pc(O,R,a1),P=pc(O,R,a1+14+(360-c-28)*v.p/100),d=draw();
    d.circle(O[0],O[1],R,SUB);arc(d,O,R,a0,a1,HC);
    seg(d,O,A,MG);seg(d,O,B,MG);d.angle(O[0],O[1],16,a0,a1,MG);
    seg(d,P,A);seg(d,P,B);ang(d,P,A,B,24,MC);d.dot(O[0],O[1],'var(--ink)',2.5);
    tx(d,O[0],O[1]+36,c+'°','var(--gold)',11);angT(d,P,A,B,c<90?56:40,n(c/2)+'°','var(--c)');
    nm(d,A,'A',O);nm(d,B,'B',O);nm(d,P,'P',O);tx(d,O[0]-10,O[1]-7,'O');
    return {svg:d.out(),read:`弧 AB に対する中心角<br>∠AOB = ${c}°<br>円周角 ∠APB = <b>${n(c/2)}°</b><br>P を動かしても、円周角は変わらない`+(c===180?'<br>AB は直径。円周角は 90°':'')};}});

/* ---- なぜ：円周角の定理の証明（arg.c = 1 辺上、2 内部、3 外部） ---- */
FIGS.m3sanheiho_proof=(host,arg)=>{const cs=(arg&&arg.c)||1;
  mk(host,Object.assign(STEP(4),{alt:['中心 O が角 APB の辺上にある場合の証明の図','中心 O が角 APB の内部にある場合の証明の図','中心 O が角 APB の外部にある場合の証明の図'][cs-1],
  draw(v){const s=v.s,O=[170,124],R=100,d=draw(),pt=a=>pc(O,R,a),GA='var(--gold)',GB='var(--ok)';let read,A,B,P;
    d.circle(O[0],O[1],R,SUB);
    if(cs===1){P=pt(118);B=pt(298);A=pt(200);
      arc(d,O,R,200,298,'stroke="var(--ink)" stroke-width="3" fill="none"');seg(d,P,A);seg(d,P,B);seg(d,O,A);
      if(s>=2){seg(d,O,P,HG);seg(d,O,A,HG);tick(d,O,P,1,INK);tick(d,O,A,1,INK);ang(d,P,O,A,26,MK);ang(d,A,O,P,26,MK);angT(d,P,O,A,38,'a',GB);angT(d,A,O,P,38,'a',GB);}
      if(s>=3){ang(d,O,A,B,18,MG);angT(d,O,A,B,32,'2a',GA);}
      read=['<b>手順 1</b>　PB が直径の場合<br>∠APB と ∠AOB の関係を調べる','<b>手順 2</b>　OP = OA（半径）なので<br>△OPA は二等辺三角形<br>∠OPA = ∠OAP = a','<b>手順 3</b>　∠AOB は △OPA の外角<br>∠AOB = ∠OPA + ∠OAP = 2a','<b>手順 4</b>　∠APB = a、∠AOB = 2a<br><b>∠APB = ∠AOB ÷ 2</b>'][s-1];}
    else if(cs===2){P=pt(90);A=pt(212);B=pt(318);const K=pt(270);
      arc(d,O,R,212,318,'stroke="var(--ink)" stroke-width="3" fill="none"');seg(d,P,A);seg(d,P,B);seg(d,O,A);seg(d,O,B);
      if(s>=2){seg(d,P,K,GD);tx(d,K[0],K[1]+16,'K');}
      if(s>=3){ang(d,P,A,K,40,MG);angT(d,P,A,K,52,'a',GA);ang(d,O,A,K,22,MG);angT(d,O,A,K,36,'2a',GA);
        ang(d,P,K,B,48,MK);angT(d,P,K,B,60,'b',GB);ang(d,O,K,B,28,MK);angT(d,O,K,B,42,'2b',GB);}
      read=['<b>手順 1</b>　中心 O が ∠APB の内部にある場合','<b>手順 2</b>　直径 PK を引く<br>∠APB が ∠APK と ∠KPB に分かれる','<b>手順 3</b>　左右それぞれが「場合1」の形<br>∠APK = a、∠AOK = 2a<br>∠KPB = b、∠KOB = 2b','<b>手順 4</b>　∠APB = a + b<br>∠AOB = 2a + 2b = 2(a + b)<br><b>∠APB = ∠AOB ÷ 2</b>'][s-1];}
    else{P=pt(150);A=pt(232);B=pt(285);const K=pt(330);
      arc(d,O,R,232,285,'stroke="var(--ink)" stroke-width="3" fill="none"');seg(d,P,A);seg(d,P,B);seg(d,O,A);seg(d,O,B);
      if(s>=2){seg(d,P,K,GD);tx(d,K[0]+11,K[1]+8,'K');}
      if(s>=3){ang(d,P,A,K,62,MG);at(d,P,-68,74,'a',GA);ang(d,O,A,K,46,MG);at(d,O,256,58,'2a',GA);
        ang(d,P,B,K,36,MK);at(d,P,-41,48,'b',GB);ang(d,O,B,K,22,MK);at(d,O,307,36,'2b',GB);}
      read=['<b>手順 1</b>　中心 O が ∠APB の外部にある場合','<b>手順 2</b>　直径 PK を引く<br>A も B も、PK の同じ側にある','<b>手順 3</b>　「場合1」の形が2つ重なっている<br>∠APK = a、∠AOK = 2a<br>∠BPK = b、∠BOK = 2b','<b>手順 4</b>　∠APB = a − b<br>∠AOB = 2a − 2b = 2(a − b)<br><b>∠APB = ∠AOB ÷ 2</b>'][s-1];}
    d.dot(O[0],O[1],'var(--ink)',2.5);nm(d,A,'A',O);nm(d,B,'B',O);nm(d,P,'P',O);tx(d,O[0]+(cs===1?12:11),O[1]+(cs===1?-4:-7),'O');
    return {svg:d.out(),read};}}));};

/* ---- 円周角の定理の逆：P を円の内側から外側へ ---- */
FIGS.m3sanheiho_gyaku=host=>mk(host,{alt:'点 P を円の内側から外側へ動かして、角 APB と円周角 ACB をくらべる図',
  sliders:[{k:'q',label:'点 P の位置（0 が円周上）',min:-90,max:35,step:5,v:-50}],play:{k:'q',from:-90,to:35,label:'P を内側から外側へ動かす',ms:3600},
  draw(v){const O=[170,142],R=92,A=pc(O,R,215),B=pc(O,R,325),C=pc(O,R,62),x=132,P=[x,O[1]-Math.sqrt(R*R-(x-O[0])*(x-O[0]))-v.q],d=draw();
    let t=Math.abs(dir(P,A)-dir(P,B));if(t>180)t=360-t;
    d.circle(O[0],O[1],R,INK);seg(d,A,B);seg(d,C,A,SUB);seg(d,C,B,SUB);ang(d,C,A,B,22,SUB);angT(d,C,A,B,36,'55°','var(--muted)');
    seg(d,P,A,MG);seg(d,P,B,MG);ang(d,P,A,B,16,MG);angT(d,P,A,B,32,n(t,1)+'°','var(--gold)');d.dot(P[0],P[1],'var(--gold)',4);
    nm(d,A,'A',O);nm(d,B,'B',O);nm(d,C,'C',O);tx(d,P[0]-11,P[1]-6,'P','var(--gold)');
    return {svg:d.out(),read:`円周角 ∠ACB = 55°<br>∠APB = <b>${n(t,1)}°</b><br>`+(v.q<0?'P は円の内側<br>∠APB は ∠ACB より大きい':v.q>0?'P は円の外側<br>∠APB は ∠ACB より小さい':'P は円周上<br>∠APB = ∠ACB')};}});

/* ---- 円外の点から接線を作図する ---- */
FIGS.m3sanheiho_sessen=host=>mk(host,Object.assign(STEP(4),{alt:'円の外の点 A から接線を作図する手順の図',
  draw(v){const s=v.s,O=[112,128],A=[292,128],M=[202,128],P=[132,71.4],Q=[132,184.6],d=draw();
    if(s>=3)d.circle(M[0],M[1],90,GD);
    d.circle(O[0],O[1],60,INK);seg(d,A,O,SUB);
    if(s>=4){[P,Q].forEach(p=>{const e=mid(A,p,1.22);seg(d,A,e,HC);seg(d,O,p);rt(d,p,A,O,9,MG);});}
    if(s>=2){tick(d,A,M,1);tick(d,M,O,1);d.dot(M[0],M[1],'var(--gold)',3.5);tx(d,M[0],M[1]+17,'M','var(--gold)');}
    if(s>=3){d.dot(P[0],P[1],'var(--ink)',3.5).dot(Q[0],Q[1],'var(--ink)',3.5);tx(d,P[0]+3,P[1]-10,'P');tx(d,Q[0]+4,Q[1]+19,'P′');}
    d.dot(O[0],O[1],'var(--ink)',2.5).dot(A[0],A[1],'var(--ink)',3.5);tx(d,O[0]-11,O[1]+5,'O');tx(d,A[0]+11,A[1]+5,'A');
    return {svg:d.out(),read:['<b>手順 1</b>　円 O と、その外の点 A<br>A を通る接線を引きたい','<b>手順 2</b>　線分 AO の中点 M を作図する<br>（AO の垂直二等分線を引く）','<b>手順 3</b>　M を中心に、半径 MO の円をかく<br>円 O との交点を P, P′ とする',
      '<b>手順 4</b>　AO は点線の円の直径なので<br>∠APO = ∠AP′O = 90°<br>半径に垂直だから <b>AP, AP′ は接線</b>'][s-1]};}}));

/* ---- 2つの弦が交わるときにできる相似な三角形 ---- */
FIGS.m3sanheiho_koten=host=>mk(host,Object.assign(STEP(4),{alt:'円の2つの弦が交わってできる2つの三角形が相似であることを手順で示す図',
  draw(v){const s=v.s,O=[170,124],R=100,A=pc(O,R,150),B=pc(O,R,318),C=pc(O,R,222),D=pc(O,R,48),P=cross(A,B,C,D),d=draw();
    d.poly([P,A,C],FC).poly([P,D,B],FG);d.circle(O[0],O[1],R,SUB);
    if(s>=3)arc(d,O,R,222,318,HC);
    seg(d,A,B);seg(d,C,D);seg(d,A,C);seg(d,D,B);
    if(s===2||s===4){ang(d,P,A,C,16,MG);ang(d,P,D,B,16,MG);}
    if(s>=3){ang(d,A,P,C,22,MC);ang(d,D,P,B,22,MC);}
    names(d,[A,B,C,D],'ABCD',O);tx(d,P[0]+2,P[1]-12,'P');
    return {svg:d.out(),read:['<b>手順 1</b>　弦 AB と弦 CD の交点が P<br>色をつけた △PAC と △PDB に注目する','<b>手順 2</b>　対頂角は等しい<br>∠APC = ∠DPB …①','<b>手順 3</b>　弧 BC に対する円周角は等しい<br>∠PAC = ∠PDB …②',
      '<b>手順 4</b>　①、②より<br>2組の角がそれぞれ等しい<br><b>△PAC ∽ △PDB</b>'][s-1]};}}));

/* ---- 三平方の定理：3つの正方形 ---- */
FIGS.m3sanheiho_sq3=host=>mk(host,{alt:'直角三角形の3辺の上にかいた3つの正方形の図',
  sliders:[{k:'a',label:'a',min:1,max:4,step:.5,v:3},{k:'b',label:'b',min:1,max:4,step:.5,v:4}],
  draw(v){const a=v.a,b=v.b,u=18,q=a*a+b*b,d=draw(),p=(x,y)=>[170+(x-a/2)*u,125-(y-b/2)*u];
    const SQ=(pts,col,t)=>{const z=pts.map(w=>p(w[0],w[1])),g=cen(z);d.poly(z,`fill="var(--${col})" fill-opacity=".3" stroke="var(--${col})" stroke-width="1.2"`);tx(d,g[0],g[1]+4,t);};
    SQ([[0,0],[a,0],[a,-a],[0,-a]],'ok',n(a*a));SQ([[0,0],[0,b],[-b,b],[-b,0]],'ok',n(b*b));SQ([[0,b],[a,0],[a+b,a],[b,a+b]],'gold',n(q));
    d.poly([p(0,0),p(a,0),p(0,b)],'stroke="var(--ink)" stroke-width="2.2" fill="var(--bg2)" stroke-linejoin="round"');rt(d,p(0,0),p(a,0),p(0,b),5);
    return {svg:d.out(),read:`a = ${n(a)}、b = ${n(b)}<br>a² + b² = ${n(a*a)} + ${n(b*b)} = <b>${n(q)}</b><br>斜辺の上の正方形 c² = <b>${n(q)}</b><br>c = ${root(q)}`};}});

/* ---- なぜ：正方形の中で4つの直角三角形を並べ替える ---- */
FIGS.m3sanheiho_narabe=host=>mk(host,{alt:'1辺 a+b の正方形の中で、4つの合同な直角三角形を並べ替える図',
  sliders:[{k:'t',label:'並べ替え（0 から 1 へ）',min:0,max:1,step:.02,v:0},{k:'a',label:'a（b は 4 に固定）',min:1,max:3,step:.5,v:3}],play:{k:'t',from:0,to:1,label:'三角形を動かす',ms:3600},
  draw(v){const a=v.a,b=4,t=v.t,S=a+b,u=196/S,d=draw(),p=(x,y)=>[76+x*u,222-y*u],G='fill="var(--gold)" fill-opacity=".3" stroke="none"';
    const T=[[[0,0],[a,0],[0,b]],[[a,0],[S,0],[S,a]],[[S,a],[S,S],[b,S]],[[b,S],[0,S],[0,b]]],mv=[[0,0],[0,b],[-b,-a],[a,0]],rc=(x0,y0,x1,y1)=>[p(x0,y0),p(x1,y0),p(x1,y1),p(x0,y1)];
    if(t<.01)d.poly([p(a,0),p(S,a),p(b,S),p(0,b)],G);
    if(t>.99)d.poly(rc(a,0,S,b),G).poly(rc(0,b,a,S),G);
    d.poly(rc(0,0,S,S),INK);
    T.forEach((q,i)=>d.poly(q.map(z=>p(z[0]+mv[i][0]*t,z[1]+mv[i][1]*t)),'fill="var(--ok)" fill-opacity=".42" stroke="var(--ink)" stroke-width="1.4" stroke-linejoin="round"'));
    const e=(x,y,s,c)=>{const z=p(x,y);tx(d,z[0],z[1]+4,s,c);};
    if(t<.01){e(S/2,S/2,'c²','var(--gold)');const m=mid(p(a,0),p(0,b));tx(d,m[0]+9,m[1]-3,'c','var(--ink)',11);}
    if(t>.99){e(a/2,b+a/2,'a²','var(--gold)');e(a+b/2,b/2,'b²','var(--gold)');}
    tx(d,p(a/2,0)[0],236,'a','var(--muted)');tx(d,p(a+b/2,0)[0],236,'b','var(--muted)');tx(d,64,p(0,b/2)[1]+4,'b','var(--muted)');tx(d,64,p(0,b+a/2)[1]+4,'a','var(--muted)');
    return {svg:d.out(),read:`a = ${n(a)}、b = 4<br>`+(t<.01?`残り（金色）は、1辺 c の正方形<br>面積 c² = <b>${n(a*a+16)}</b>`:t>.99?`残り（金色）は、1辺 a と1辺 b の正方形<br>面積 a² + b² = ${n(a*a)} + 16 = <b>${n(a*a+16)}</b>`:'三角形を平行に動かしている途中<br>4つの三角形の面積の合計は変わらない')};}});

/* ---- 特別な直角三角形 ---- */
FIGS.m3sanheiho_tokubetsu=host=>mk(host,{alt:'正方形を対角線で、正三角形を高さで切ってできる直角三角形の図',
  sliders:[{k:'m',label:'図形',min:1,max:2,step:1,v:1,fmt:m=>['正方形','正三角形'][m-1]},{k:'a',label:'1辺の長さ',min:2,max:10,step:1,v:6}],
  draw(v){const a=v.a,d=draw(),hf=a/2===1?'':n(a/2);let read;
    if(v.m===1){const A=[95,206],B=[245,206],C=[245,56],D=[95,56];
      d.poly([A,B,C],FG).poly([A,B,C,D],INK);seg(d,A,C,HG);rt(d,B,A,C);ang(d,A,B,C,24,MC);ang(d,C,A,B,24,MC);
      tx(d,170,222,String(a),'var(--muted)');tx(d,253,135,String(a),'var(--muted)',12,'start');tx(d,158,124,a+'√2','var(--gold)');
      tx(d,A[0]+40,A[1]-9,'45°','var(--c)',11);tx(d,C[0]-11,C[1]+44,'45°','var(--c)',11);
      read=`1辺 ${a} の正方形<br>対角線² = ${a}² + ${a}² = ${2*a*a}<br>対角線 = ${a}√2 ≈ <b>${n(a*Math.SQRT2)}</b><br>3辺の比 1 : 1 : √2`;}
    else{const B=[80,214],C=[260,214],A=[170,58.1],H=[170,214];
      d.poly([A,B,H],FG).poly([A,B,C],INK);seg(d,A,H,HG);rt(d,H,B,A);ang(d,B,H,A,24,MC);ang(d,A,B,H,30,MC);
      tx(d,112,132,String(a),'var(--muted)');tx(d,125,230,n(a/2),'var(--muted)');tx(d,178,150,hf+'√3','var(--gold)',12,'start');
      tx(d,B[0]+36,B[1]-8,'60°','var(--c)',11);tx(d,A[0]-10,A[1]+48,'30°','var(--c)',11);
      read=`1辺 ${a} の正三角形<br>高さ² = ${a}² − ${n(a/2)}² = ${n(.75*a*a)}<br>高さ = ${hf}√3 ≈ <b>${n(a*Math.sqrt(3)/2)}</b><br>短い辺 : 高さ : 斜辺 = 1 : √3 : 2`;}
    return {svg:d.out(),read};}});

/* ---- 座標平面上の2点間の距離 ---- */
FIGS.m3sanheiho_kyori=host=>mk(host,{alt:'座標平面上の2点を結ぶ線分を斜辺とする直角三角形の図',
  sliders:[{k:'x',label:'B の x 座標',min:2,max:6,step:1,v:5},{k:'y',label:'B の y 座標',min:2,max:5,step:1,v:4}],
  draw(v){const p=plot([-1.2,7.3,-1,5.25]).grid(),dx=v.x-1,dy=v.y-1,q=dx*dx+dy*dy;
    p.poly([[1,1],[v.x,1],[v.x,v.y]],FG).seg(1,1,v.x,1,HC).seg(v.x,1,v.x,v.y,HC).seg(1,1,v.x,v.y,HG).dot(1,1,'var(--ink)').dot(v.x,v.y,'var(--ink)');
    const T='paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5"';
    p.txt(1,1,'A','text-anchor="end" dx="-7" dy="-6" style="fill:var(--ink)" '+T).txt(v.x,v.y,'B','dx="9" dy="4" style="fill:var(--ink)" '+T);
    p.txt((1+v.x)/2,1,String(dx),'text-anchor="middle" dy="-7" style="fill:var(--c)" '+T).txt(v.x,(1+v.y)/2,String(dy),'dx="8" dy="4" style="fill:var(--c)" '+T);
    return {svg:p.out(),read:`A(1, 1)、B(${v.x}, ${v.y})<br>横の差 ${dx}、縦の差 ${dy}<br>AB² = ${dx}² + ${dy}² = ${q}<br>AB = <b>${root(q)}</b>`};}});

/* ---- 弦の長さ ---- */
FIGS.m3sanheiho_gen=host=>mk(host,{alt:'円の中心から弦に垂線を引いてできる直角三角形の図',
  sliders:[{k:'d',label:'中心から弦までの距離',min:1,max:4,step:.5,v:3}],play:{k:'d',from:1,to:4,label:'弦を中心から遠ざける',ms:3200},
  draw(v){const O=[170,112],u=20,q=25-v.d*v.d,h=Math.sqrt(q),y=O[1]+v.d*u,A=[O[0]-h*u,y],B=[O[0]+h*u,y],H=[O[0],y],d=draw();
    d.circle(O[0],O[1],100,INK).poly([O,A,H],FG);seg(d,A,B,HC);seg(d,O,H);seg(d,O,A,HG);rt(d,H,O,A,Math.min(8,v.d*8));
    d.dot(O[0],O[1],'var(--ink)',2.5);tx(d,O[0],O[1]-9,'O');nm(d,A,'A',O);nm(d,B,'B',O);tx(d,H[0]+10,H[1]+16,'H');
    len(d,O,A,'5',H,10,'var(--gold)');tx(d,O[0]+8,(O[1]+y)/2+4,n(v.d),'var(--muted)',12,'start');tx(d,(A[0]+H[0])/2,y+16,n(h),'var(--c)');
    return {svg:d.out(),read:`半径 OA = 5、OH = ${n(v.d)}<br>AH² = 5² − ${n(v.d)}² = ${n(q)}<br>AH = ${root(q)}<br>AB = 2 × AH ${Number.isInteger(h)?'=':'≈'} <b>${n(2*h)}</b>`};}});

/* ---- 直方体の対角線 ---- */
FIGS.m3sanheiho_chohotai=host=>mk(host,{alt:'直方体の対角線を、2つの直角三角形で求める手順の図',
  sliders:[{k:'s',label:'手順',min:1,max:3,step:1,v:1},{k:'c',label:'高さ AE',min:1,max:5,step:1,v:3}],play:{k:'s',from:1,to:3,label:'順に見る',ms:3300},
  draw(v){const s=v.s,c=v.c,u=30,d=draw(),p=(x,y,z)=>[82+x*u+y*15,208-z*u-y*10.5];
    const E=p(0,0,0),F=p(4,0,0),G=p(4,3,0),H=p(0,3,0),A=p(0,0,c),B=p(4,0,c),C=p(4,3,c),D=p(0,3,c),q=c*c+25;
    if(s===1)d.poly([E,F,G],FC);if(s>=2)d.poly([A,E,G],FG);
    seg(d,E,H,DSH);seg(d,H,G,DSH);seg(d,H,D,DSH);d.poly([A,B,F,E],INK).poly([A,B,C,D],INK).poly([B,C,G,F],INK);
    seg(d,E,G,s===1?HC:MC);if(s===1)rt(d,F,E,G,6,MC);
    if(s>=2){seg(d,A,G,HG);seg(d,A,E,HG);rt(d,E,A,G,7,MG);}
    tx(d,A[0]-10,A[1]+2,'A');tx(d,B[0]+3,B[1]-7,'B');tx(d,C[0]+10,C[1]+1,'C');tx(d,D[0]-2,D[1]-7,'D');tx(d,E[0]-10,E[1]+8,'E');tx(d,F[0]+2,F[1]+16,'F');tx(d,G[0]+11,G[1]+6,'G');tx(d,H[0]-9,H[1]-3,'H','var(--muted)');
    tx(d,(E[0]+F[0])/2,E[1]+16,'4','var(--muted)');tx(d,(F[0]+G[0])/2+10,(F[1]+G[1])/2+10,'3','var(--muted)');tx(d,E[0]-10,(A[1]+E[1])/2+4,String(c),'var(--muted)');
    return {svg:d.out(),read:[`<b>手順 1</b>　底面の直角三角形 EFG<br>EG² = 4² + 3² = 25<br>EG = 5`,`<b>手順 2</b>　直角三角形 AEG（∠AEG = 90°）<br>AG² = AE² + EG²<br>= ${c}² + 5²`,
      `<b>手順 3</b>　AG² = ${c*c} + 25 = ${q}<br>AG = <b>${root(q)}</b><br>まとめると AG = √(4² + 3² + ${c}²)`][s-1]};}});

/* ---- 正四角錐の高さ ---- */
FIGS.m3sanheiho_sui=host=>mk(host,Object.assign(STEP(3),{alt:'正四角錐の高さを、底面の対角線の半分を使って求める手順の図',
  draw(v){const s=v.s,d=draw(),A=[80,212],B=[200,212],C=[254,176],D=[134,176],H=[167,194],O=[167,35.3];
    if(s===1)d.poly([A,B,C,D],FC);if(s>=2)d.poly([O,A,H],FG);
    seg(d,A,D,DSH);seg(d,D,C,DSH);seg(d,O,D,DSH);seg(d,A,C,DSH);seg(d,O,H,s>=2?MG:DSH);
    seg(d,A,B);seg(d,B,C);seg(d,O,A,s>=2?HG:INK);seg(d,O,B);seg(d,O,C);seg(d,A,H,HC);
    rt(d,H,A,O,7,s>=2?MG:SUB);d.dot(H[0],H[1],'var(--ink)',2.5);
    tx(d,O[0],O[1]-8,'O');tx(d,A[0]-10,A[1]+6,'A');tx(d,B[0]+6,B[1]+15,'B');tx(d,C[0]+10,C[1]+3,'C');tx(d,D[0]-9,D[1]-3,'D','var(--muted)');tx(d,H[0]+11,H[1]+5,'H');
    tx(d,140,227,'4','var(--muted)');tx(d,112,116,'6','var(--muted)');tx(d,120,196,'2√2','var(--c)',11);
    return {svg:d.out(),read:['<b>手順 1</b>　底面は1辺 4 の正方形<br>対角線 AC = 4√2<br>AH = AC ÷ 2 = 2√2','<b>手順 2</b>　直角三角形 OAH（∠OHA = 90°）<br>OH² = OA² − AH²<br>= 6² − (2√2)²','<b>手順 3</b>　OH² = 36 − 8 = 28<br>OH = √28 = 2√7 ≈ <b>5.29</b><br>体積 = 1/3 × 4² × 2√7 = 32√7/3'][s-1]};}}));

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
const Q={
 obc:{alt:'円 O の周上に3点 A, B, C があり、角 OBC が 25 度の図',h:226,f(d){const O=[170,112],R=92,B=pc(O,R,205),C=pc(O,R,335),A=pc(O,R,100);
   d.circle(O[0],O[1],R,INK);seg(d,O,B);seg(d,O,C);seg(d,B,C);seg(d,A,B);seg(d,A,C);ang(d,B,O,C,26,MG);ang(d,A,B,C,22,MC);
   at(d,B,12,46,'25°','var(--gold)');angT(d,A,B,C,36,'x','var(--c)',12);d.dot(O[0],O[1],'var(--ink)',2.5);names(d,[A,B,C],'ABC',O);tx(d,O[0],O[1]-9,'O');return '∠OBC = 25°';}},
 abcd:{alt:'円周上に4点 A, B, C, D があり、弦 AC と BD が点 E で交わる図',h:226,f(d){const O=[170,112],R=92,A=pc(O,R,135),B=pc(O,R,225),C=pc(O,R,295),D=pc(O,R,5),E=cross(A,C,B,D);
   d.circle(O[0],O[1],R,INK);seg(d,A,C);seg(d,B,D);seg(d,A,B);seg(d,C,D);ang(d,A,B,C,26,MG);ang(d,E,A,B,14,MG);ang(d,C,A,D,22,MC);
   angT(d,A,B,C,40,'35°','var(--gold)');angT(d,E,A,B,28,'80°','var(--gold)');angT(d,C,A,D,35,'x','var(--c)',12);names(d,[A,B,C,D],'ABCD',O);tx(d,E[0]+13,E[1]-5,'E');return '∠BAC = 35°、∠AEB = 80°';}},
 abc30:{alt:'線分 AB を直径とする円 O の周上に点 C があり、角 ABC が 30 度の図',h:232,f(d){const O=[170,116],R=96,A=pc(O,R,180),B=pc(O,R,0),C=pc(O,R,120);
   d.circle(O[0],O[1],R,INK);seg(d,A,B);seg(d,A,C);seg(d,B,C);seg(d,O,C,SUB);ang(d,B,A,C,30,MG);at(d,B,166,48,'30°','var(--gold)');
   d.dot(O[0],O[1],'var(--ink)',2.5);names(d,[A,B,C],'ABC',O);tx(d,O[0],O[1]+16,'O');return 'AB は直径、∠ABC = 30°';}},
 thales:{alt:'線分 AB を直径とする円 O の周上の点 P と、半径 OP の図',h:232,f(d){const O=[170,116],R=96,A=pc(O,R,180),B=pc(O,R,0),P=pc(O,R,62);
   d.circle(O[0],O[1],R,INK);seg(d,A,B);seg(d,A,P);seg(d,B,P);seg(d,O,P);tick(d,O,A,1);tick(d,O,B,1);tick(d,O,P,1);
   ang(d,A,O,P,26,MG);ang(d,P,A,O,26,MG);ang(d,B,O,P,20,MC);ang(d,P,O,B,20,MC);
   angT(d,A,O,P,38,'a','var(--gold)');angT(d,P,A,O,38,'a','var(--gold)');angT(d,B,O,P,32,'b','var(--c)');angT(d,P,O,B,32,'b','var(--c)');
   d.dot(O[0],O[1],'var(--ink)',2.5);names(d,[A,B,P],'ABP',O);tx(d,O[0],O[1]+16,'O');return 'OA = OP = OB（半径）';}},
 gyaku4:{alt:'四角形 ABCD と2本の対角線の図。角 BAC と角 BDC がどちらも 50 度',h:226,f(d){const O=[170,112],R=92,B=pc(O,R,200),C=pc(O,R,300),D=pc(O,R,30),A=pc(O,R,90);
   d.poly([A,B,C,D],INK);seg(d,A,C);seg(d,B,D);ang(d,A,B,C,24,MG);ang(d,D,B,C,24,MG);ang(d,B,A,D,28,MC);ang(d,C,A,D,24,MC);
   angT(d,A,B,C,38,'50°','var(--gold)');angT(d,D,B,C,38,'50°','var(--gold)');angT(d,B,A,D,44,'30°','var(--c)');angT(d,C,A,D,37,'x','var(--c)',12);names(d,[A,B,C,D],'ABCD',O);
   return '∠BAC = ∠BDC = 50°、∠ABD = 30°';}},
 suisen:{alt:'三角形 ABC の頂点 B, C から向かいの辺に垂線 BD, CE を引き、BC の中点 M をとった図',h:232,f(d){const A=[140,22],B=[34,204],C=[306,204],D=foot(B,A,C),E=foot(C,A,B),M=mid(B,C),g=cen([A,B,C]);
   d.poly([A,B,C],INK);seg(d,B,D);seg(d,C,E);rt(d,D,A,B,9,MG);rt(d,E,A,C,9,MG);seg(d,M,D,DSH);seg(d,M,E,DSH);d.dot(M[0],M[1],'var(--ink)',3);
   names(d,[A,B,C,D,E],'ABCDE',g);tx(d,M[0],M[1]+17,'M');return 'BD ⊥ AC、CE ⊥ AB、M は BC の中点';}},
 sessen2:{alt:'円 O の外の点 A から2本の接線を引いた図',h:224,f(d){const O=[108,112],A=[254.7,112],P=[134.2,55.8],Q=[134.2,168.2];
   d.circle(O[0],O[1],62,INK);[P,Q].forEach(p=>{seg(d,A,mid(A,p,1.2));seg(d,O,p);rt(d,p,A,O,8);});ang(d,A,P,Q,30,MG);tx(d,A[0]-46,A[1]+4,'50°','var(--gold)',11);ang(d,O,P,Q,16,MC);tx(d,O[0]+26,O[1]+4,'x','var(--c)');
   d.dot(O[0],O[1],'var(--ink)',2.5);tx(d,O[0]-11,O[1]+5,'O');tx(d,A[0]+11,A[1]+5,'A');tx(d,P[0]+2,P[1]-10,'P');tx(d,Q[0]+3,Q[1]+19,'P′');return 'AP, AP′ は接線、∠PAP′ = 50°';}},
 hobeki:{alt:'円の外の点 P から引いた2本の直線が、円とそれぞれ2点で交わる図',h:232,f(d){// 円の半径 95、1 を 18px として、PA·PB = PC·PD = 36 となるように P と2直線の向きを決める
   const O=[215,118],R=95,u=18,OP=Math.sqrt(36*u*u+R*R),P=[O[0]-OP,O[1]],c1=13*u/(2*OP),c2=15*u/(2*OP),d1=[c1,-Math.sqrt(1-c1*c1)],d2=[c2,Math.sqrt(1-c2*c2)];
   const q=(w,k)=>[P[0]+w[0]*k*u,P[1]+w[1]*k*u],A=q(d1,4),B=q(d1,9),C=q(d2,3),D=q(d2,12);
   d.poly([P,A,D],FC).poly([P,C,B],FG);d.circle(O[0],O[1],R,INK);seg(d,P,B);seg(d,P,D);seg(d,A,D);seg(d,B,C);
   tx(d,P[0]-10,P[1]+4,'P');tx(d,A[0]-9,A[1]-6,'A');tx(d,B[0]+3,B[1]-8,'B');tx(d,C[0]-6,C[1]+16,'C');tx(d,D[0]+10,D[1]+9,'D');
   len(d,P,A,'4',C,10);len(d,A,B,'5',C,10);len(d,P,C,'3',A,11);return 'PA = 4、AB = 5、PC = 3';}},
 nitoubunE:{alt:'円に内接する三角形 ABC と、角 A の二等分線が辺 BC と交わる点 D、円と交わる点 E の図',h:232,f(d){const O=[170,112],R=94,A=pc(O,R,112),B=pc(O,R,206),C=pc(O,R,334),E=pc(O,R,270),D=cross(A,E,B,C);
   d.poly([A,B,E],FC).poly([A,D,C],FG);d.circle(O[0],O[1],R,SUB);d.poly([A,B,C],INK);seg(d,A,E);seg(d,B,E);
   ang(d,A,B,E,30,MG);ang(d,A,E,C,36,MG);ang(d,E,A,B,22,MC);ang(d,C,A,B,22,MC);
   names(d,[A,B,C,E],'ABCE',O);tx(d,D[0]+12,D[1]-7,'D');return '∠BAE = ∠CAE（AE は ∠A の二等分線）';}},
 naka:{alt:'斜辺 c を1辺とする正方形の中に、合同な直角三角形を4つ内側へ向けて並べた図',h:232,f(d){const p=(x,y)=>[85+x*34,204-y*34],T=[[[0,0],[5,0],[3.2,2.4]],[[5,0],[5,5],[2.6,3.2]],[[5,5],[0,5],[1.8,2.6]],[[0,5],[0,0],[2.4,1.8]]];
   T.forEach(t=>d.poly(t.map(z=>p(z[0],z[1])),'fill="var(--ok)" fill-opacity=".36" stroke="var(--ink)" stroke-width="1.4" stroke-linejoin="round"'));
   d.poly([p(3.2,2.4),p(2.6,3.2),p(1.8,2.6),p(2.4,1.8)],'fill="var(--gold)" fill-opacity=".4" stroke="none"');
   tx(d,170,220,'c','var(--muted)');tx(d,p(1.5,1.45)[0],p(1.5,1.45)[1],'a','var(--ink)');tx(d,p(4.25,1.5)[0],p(4.25,1.5)[1],'b','var(--ink)');
   return '1辺 c の正方形 ＝ 直角三角形 4つ ＋ 中央の正方形（1辺 a − b）';}},
 garfield:{alt:'合同な直角三角形2つと直角二等辺三角形1つでできた台形の図',h:186,f(d){const p=(x,y)=>[65+x*30,156-y*30],st='stroke="var(--ink)" stroke-width="1.4" stroke-linejoin="round"';
   d.poly([p(0,0),p(4,0),p(0,3)],'fill="var(--ok)" fill-opacity=".36" '+st).poly([p(4,0),p(7,0),p(7,4)],'fill="var(--ok)" fill-opacity=".36" '+st).poly([p(0,3),p(4,0),p(7,4)],'fill="var(--gold)" fill-opacity=".3" '+st);
   rt(d,p(0,0),p(4,0),p(0,3),6);rt(d,p(7,0),p(4,0),p(7,4),6);rt(d,p(4,0),p(0,3),p(7,4),7,MG);
   tx(d,p(2,0)[0],172,'b','var(--muted)');tx(d,p(5.5,0)[0],172,'a','var(--muted)');tx(d,53,p(0,1.5)[1]+4,'a','var(--muted)');tx(d,287,p(7,2)[1]+4,'b','var(--muted)');
   tx(d,p(2,1.5)[0]+9,p(2,1.5)[1]-5,'c');tx(d,p(5.5,2)[0]-10,p(5.5,2)[1]-4,'c');return '台形 ＝ 直角三角形 2つ ＋ 直角二等辺三角形（等しい辺が c）';}},
 sessenL:{alt:'円 O と、円の外の点 A から引いた接線 AP の図',h:210,f(d){const O=[84,108],A=[240,108],P=[107.1,52.6];
   d.circle(O[0],O[1],60,INK).poly([O,P,A],FG);seg(d,O,A);seg(d,O,P);seg(d,A,P,HC);rt(d,P,O,A,8,MG);d.dot(O[0],O[1],'var(--ink)',2.5);
   tx(d,O[0]-11,O[1]+5,'O');tx(d,A[0]+11,A[1]+5,'A');tx(d,P[0],P[1]-9,'P');tx(d,88,76,'5','var(--muted)');tx(d,162,124,'13','var(--muted)');tx(d,180,72,'x','var(--c)');return '半径 5、OA = 13、AP は接線';}},
 tri4530:{alt:'角 B が 45 度、角 C が 30 度の三角形 ABC と、A から BC に引いた垂線 AH の図',h:206,f(d){const B=[30,170],H=[132,170],A=[132,68],C=[308.7,170];
   d.poly([A,B,C],INK);seg(d,A,H,DSH);rt(d,H,A,C);ang(d,B,H,A,24,MG);ang(d,C,H,A,34,MC);tx(d,B[0]+38,B[1]-7,'45°','var(--gold)',11);tx(d,C[0]-52,C[1]-6,'30°','var(--c)',11);
   tx(d,A[0],A[1]-9,'A');tx(d,B[0]-8,B[1]+15,'B');tx(d,C[0]+4,C[1]+15,'C');tx(d,H[0],H[1]+16,'H');tx(d,66,112,'6√2','var(--muted)');return '∠B = 45°、∠C = 30°、AB = 6√2';}},
 tenkai:{alt:'直方体の2つの側面をつなげた展開図と、点 A から点 G までの最短の線の図',h:214,f(d){const p=(x,y)=>[58+x*32,26+y*32],A=p(0,0),B=p(4,0),C=p(7,0),E=p(0,5),F=p(4,5),G=p(7,5),P=p(4,20/7);
   d.poly([A,B,F,E],FC).poly([B,C,G,F],FG).poly([A,C,G,E],INK);seg(d,B,F);seg(d,A,G,HG);d.dot(P[0],P[1],'var(--ink)',3);
   tx(d,A[0]-10,A[1]+4,'A');tx(d,B[0],B[1]-7,'B');tx(d,C[0]+10,C[1]+4,'C');tx(d,E[0]-10,E[1]+6,'E');tx(d,F[0],F[1]+16,'F');tx(d,G[0]+10,G[1]+6,'G');tx(d,P[0]+10,P[1]-6,'P');
   tx(d,p(2,5)[0],202,'4','var(--muted)');tx(d,p(5.5,5)[0],202,'3','var(--muted)');tx(d,44,p(0,2.5)[1]+4,'5','var(--muted)');return '側面 ABFE と側面 BCGF を、辺 BF でつなげた展開図';}}
};
FIGS.m3sanheiho_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){const d=draw(),r=q.f(d);return {svg:d.out(),read:r};}});};
})();
