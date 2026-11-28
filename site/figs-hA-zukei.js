/* 数学A「図形の性質」の図（FIGS.hazukei_*）。動かせる図・手順の図と、問題に付ける図（hazukei_q） */
(function(){
const {draw,n,mk}=FIG;
const f=v=>v.toFixed(1);
const INK='stroke="var(--ink)" stroke-width="1.6" fill="none" stroke-linejoin="round"';
const SUB='stroke="var(--muted)" stroke-width="1.2" fill="none"';
const DSH='stroke="var(--muted)" stroke-width="1.2" fill="none" stroke-dasharray="4 4"';
const HG='stroke="var(--gold)" stroke-width="3.2" fill="none" stroke-linecap="round"';
const HC='stroke="var(--c)" stroke-width="3.2" fill="none" stroke-linecap="round"';
const HK='stroke="var(--ok)" stroke-width="3.2" fill="none" stroke-linecap="round"';
const MG='stroke="var(--gold)" stroke-width="2" fill="none"';
const MC='stroke="var(--c)" stroke-width="2" fill="none"';
const MK='stroke="var(--ok)" stroke-width="2" fill="none"';
const GD='stroke="var(--gold)" stroke-width="1.8" fill="none" stroke-dasharray="5 4"';
const CD='stroke="var(--c)" stroke-width="1.8" fill="none" stroke-dasharray="5 4"';
const FC='fill="var(--c)" fill-opacity=".26" stroke="none"';
const FG='fill="var(--gold)" fill-opacity=".26" stroke="none"';
const FK='fill="var(--ok)" fill-opacity=".26" stroke="none"';
const GO='var(--gold)',CC='var(--c)',OK='var(--ok)',MU='var(--muted)',IK='var(--ink)';
const un=(P,Q)=>{const x=Q[0]-P[0],y=Q[1]-P[1],l=Math.hypot(x,y)||1;return [x/l,y/l];};
const dist=(P,Q)=>Math.hypot(P[0]-Q[0],P[1]-Q[1]);
const mid=(P,Q,t=.5)=>[P[0]+(Q[0]-P[0])*t,P[1]+(Q[1]-P[1])*t];
const cen=ps=>[ps.reduce((s,p)=>s+p[0],0)/ps.length,ps.reduce((s,p)=>s+p[1],0)/ps.length];
const dir=(P,Q)=>Math.atan2(P[1]-Q[1],Q[0]-P[0])*180/Math.PI;
const deg=(P,Q,R)=>{const a=un(P,Q),b=un(P,R);return Math.acos(Math.max(-1,Math.min(1,a[0]*b[0]+a[1]*b[1])))*180/Math.PI;};
const foot=(P,A,B)=>{const u=un(A,B),t=(P[0]-A[0])*u[0]+(P[1]-A[1])*u[1];return [A[0]+u[0]*t,A[1]+u[1]*t];};
// 2直線 AB, CD の交点
const cross=(A,B,C,D)=>{const a=B[0]-A[0],b=B[1]-A[1],c=D[0]-C[0],e=D[1]-C[1],t=((C[0]-A[0])*e-(C[1]-A[1])*c)/(a*e-b*c);return [A[0]+a*t,A[1]+b*t];};
// 点 P を通り向き w（単位ベクトル）の直線と、中心 O・半径 R の円の交点までの距離（P から w の向きに測る）
const lc=(P,w,O,R)=>{const x=P[0]-O[0],y=P[1]-O[1],b=x*w[0]+y*w[1],D=b*b-(x*x+y*y-R*R);if(D<0)return null;const s=Math.sqrt(D);return [-b-s,-b+s];};
const go=(P,w,t)=>[P[0]+w[0]*t,P[1]+w[1]*t];
// 外心と内心
const circum=(A,B,C)=>{const e=2*(A[0]*(B[1]-C[1])+B[0]*(C[1]-A[1])+C[0]*(A[1]-B[1])),a=A[0]*A[0]+A[1]*A[1],b=B[0]*B[0]+B[1]*B[1],c=C[0]*C[0]+C[1]*C[1];
  return [(a*(B[1]-C[1])+b*(C[1]-A[1])+c*(A[1]-B[1]))/e,(a*(C[0]-B[0])+b*(A[0]-C[0])+c*(B[0]-A[0]))/e];};
const incen=(A,B,C)=>{const a=dist(B,C),b=dist(C,A),c=dist(A,B),s=a+b+c;return [(a*A[0]+b*B[0]+c*C[0])/s,(a*A[1]+b*B[1]+c*C[1])/s];};
// 円周上の点（角度は度。右向きが 0、反時計回りが正）
const pc=(O,R,a)=>[O[0]+R*Math.cos(a*Math.PI/180),O[1]-R*Math.sin(a*Math.PI/180)];
// 文字（線に重なっても読めるよう、地の色でふちどる）
const tx=(d,x,y,t,c=IK,s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
const seg=(d,P,Q,st=INK)=>d.line(P[0],P[1],Q[0],Q[1],st);
const nm=(d,P,t,G,k=12,c)=>{const u=un(G,P);return tx(d,P[0]+u[0]*k,P[1]+u[1]*k+4,t,c);};
const names=(d,P,s,g)=>{s.split('').forEach((c,i)=>nm(d,P[i],c,g));return d;};
const len=(d,P,Q,t,G,k=11,c=MU)=>{const m=mid(P,Q),u=un(P,Q);let x=-u[1],y=u[0];if((m[0]-G[0])*x+(m[1]-G[1])*y<0){x=-x;y=-y;}return tx(d,m[0]+x*k,m[1]+y*k+4,t,c);};
const ang=(d,P,Q,R,r=14,st=MG)=>{let a=dir(P,Q),b=dir(P,R);if(b-a>180)b-=360;if(b-a<-180)b+=360;return d.angle(P[0],P[1],r,a,b,st);};
// 角の中に書く文字（角の二等分線の上、頂点から r の位置）
const angT=(d,P,Q,R,r,t,c,s=11)=>{const u=un(P,Q),w=un(P,R);let x=u[0]+w[0],y=u[1]+w[1];const l=Math.hypot(x,y)||1;return tx(d,P[0]+x/l*r,P[1]+y/l*r+4,t,c,s);};
// 頂点 P から角度 a（度）の向きに r だけ離れた位置に文字を書く
const at=(d,P,a,r,t,c,s=11)=>{const q=pc(P,r,a);return tx(d,q[0],q[1]+4,t,c,s);};
const rt=(d,P,Q,R,s=8,st=SUB)=>{const u=un(P,Q),w=un(P,R);return d.path(`M${f(P[0]+u[0]*s)},${f(P[1]+u[1]*s)} L${f(P[0]+(u[0]+w[0])*s)},${f(P[1]+(u[1]+w[1])*s)} L${f(P[0]+w[0]*s)},${f(P[1]+w[1]*s)}`,st);};
const tick=(d,P,Q,k=1,st=SUB)=>{const m=mid(P,Q),u=un(P,Q);for(let i=0;i<k;i++){const o=(i-(k-1)/2)*4,x=m[0]+u[0]*o,y=m[1]+u[1]*o;d.line(x-u[1]*5,y+u[0]*5,x+u[1]*5,y-u[0]*5,st);}return d;};
// 円弧：中心 O、半径 R、角度 a0 から a1 へ反時計回り
const arc=(d,O,R,a0,a1,st)=>{const P=pc(O,R,a0),Q=pc(O,R,a1);let s=a1-a0;while(s<0)s+=360;return d.path(`M${f(P[0])},${f(P[1])} A${R},${R} 0 ${s>180?1:0} 0 ${f(Q[0])},${f(Q[1])}`,st);};
const pt=(d,P,c=IK,r=3.2)=>d.dot(P[0],P[1],c,r);
const STEP=(k=4)=>({sliders:[{k:'s',label:'手順',min:1,max:k,step:1,v:1}],play:{k:'s',from:1,to:k,label:'順に見る',ms:1100*k}});

/* ---- 内分と外分 ---- */
FIGS.hazukei_naibun=host=>mk(host,{alt:'線分 AB を m 対 n に内分する点 P と、外分する点 Q の図',h:150,
  sliders:[{k:'k',label:'分け方',min:1,max:2,step:1,v:1,fmt:k=>['内分','外分'][k-1]},{k:'m',label:'m',min:1,max:3,step:1,v:2},{k:'n',label:'n',min:1,max:3,step:1,v:1}],
  draw(v){const m=v.m,k=v.n,d=draw(),y=80;let read;
    const dim=(x1,x2,yy,t,c,up)=>{const st=`stroke="${c}" stroke-width="1.6"`;d.line(x1,yy,x2,yy,st).line(x1,yy-4,x1,yy+4,st).line(x2,yy-4,x2,yy+4,st);tx(d,(x1+x2)/2,yy+(up?-7:16),String(t),c,13);};
    if(v.k===1){const a=50,b=290,p=a+240*m/(m+k);
      d.line(a,y,b,y,INK);for(let i=1;i<m+k;i++)d.line(a+240*i/(m+k),y-4,a+240*i/(m+k),y+4,SUB);
      dim(a,p,y-26,m,GO,true);dim(p,b,y-26,k,CC,true);
      d.dot(a,y,IK,3.5).dot(b,y,IK,3.5).dot(p,y,GO,4.5);tx(d,a,y+20,'A');tx(d,b,y+20,'B');tx(d,p,y+20,'P',GO);
      read=`線分 AB を ${m} : ${k} に内分する点 P<br>AP : PB = <b>${m} : ${k}</b><br>AB = 12 とすると AP = ${n(12*m/(m+k))}、PB = ${n(12*k/(m+k))}`;}
    else{const a=140,b=196;d.line(14,y,326,y,DSH).line(a,y,b,y,'stroke="var(--ink)" stroke-width="2.4"');
      if(m!==k){const q=a+56*m/(m-k);dim(a,q,y-30,m,GO,true);dim(q,b,y+24,k,CC,false);d.dot(q,y,GO,4.5);tx(d,q,y-9,'Q',GO);
        read=`線分 AB を ${m} : ${k} に外分する点 Q<br>AQ : QB = <b>${m} : ${k}</b><br>AB = 12 とすると AQ = ${n(12*m/Math.abs(m-k))}、QB = ${n(12*k/Math.abs(m-k))}<br>`+(m>k?'m > n なので、Q は B の先にある':'m < n なので、Q は A の手前にある');}
      else read='m = n のとき、外分する点はない<br>（直線 AB 上で、A, B からの距離が等しい点は<br>線分 AB の中点だけで、これは内分点）';
      d.dot(a,y,IK,3.5).dot(b,y,IK,3.5);tx(d,a,y-9,'A');tx(d,b,y-9,'B');}
    return {svg:d.out(),read};}});

/* ---- 角の二等分線と比：頂点を動かして確かめる ---- */
FIGS.hazukei_bisect=host=>mk(host,{alt:'三角形 ABC の角 A の二等分線が辺 BC を分ける比と、AB 対 AC をくらべる図',
  sliders:[{k:'x',label:'頂点 A の位置',min:90,max:250,step:10,v:130}],play:{k:'x',from:90,to:250,label:'A を左右に動かす',ms:3600},
  draw(v){const A=[v.x,56],B=[50,204],C=[290,204],c=dist(A,B),b=dist(A,C),D=[50+240*c/(b+c),204],d=draw(),g=cen([A,B,C]),u=20;
    d.poly([A,B,C],INK);seg(d,A,B,MG);seg(d,A,C,MC);seg(d,B,D,HG);seg(d,D,C,HC);seg(d,A,D);ang(d,A,B,D,24,MK);ang(d,A,D,C,29,MK);
    nm(d,A,'A',g);nm(d,B,'B',g);nm(d,C,'C',g);tx(d,D[0],D[1]+17,'D');
    len(d,A,B,n(c/u,1),g,17,GO);len(d,A,C,n(b/u,1),g,17,CC);tx(d,(B[0]+D[0])/2,222,n(dist(B,D)/u,1),GO);tx(d,(D[0]+C[0])/2,222,n(dist(D,C)/u,1),CC);
    return {svg:d.out(),read:`AB = ${n(c/u,1)}、AC = ${n(b/u,1)}　AB ÷ AC = <b>${n(c/b)}</b><br>BD = ${n(dist(B,D)/u,1)}、DC = ${n(dist(D,C)/u,1)}　BD ÷ DC = <b>${n(c/b)}</b><br>AD が ∠A を2等分するとき、2つの比は等しい`};}});

/* ---- 角の二等分線と比の証明（平行線を引く） ---- */
FIGS.hazukei_nitobun=host=>mk(host,Object.assign(STEP(4),{alt:'角の二等分線と比の定理を、平行線を引いて証明する手順の図',
  draw(v){const s=v.s,B=[40,222],A=[120,132],C=[230,222],c=dist(A,B),b=dist(A,C),u=un(B,A),E=go(A,u,b),D=[40+190*c/(b+c),222],d=draw();
    if(s>=4){seg(d,B,D,HC);seg(d,D,C,HG);seg(d,B,A,HC);seg(d,A,E,HG);}
    d.poly([A,B,C],INK);seg(d,A,D);ang(d,A,B,D,20,MK);ang(d,A,D,C,25,MK);
    if(s>=2){if(s<4)seg(d,A,E);seg(d,C,E,GD);}
    if(s>=3){ang(d,E,A,C,22,MK);ang(d,C,A,E,22,MK);tick(d,A,E,2,INK);tick(d,A,C,2,INK);}
    tx(d,A[0]-13,A[1]+2,'A');tx(d,B[0]-9,B[1]+13,'B');tx(d,C[0]+9,C[1]+13,'C');tx(d,D[0],D[1]+17,'D');if(s>=2)tx(d,E[0]+11,E[1]+2,'E');
    return {svg:d.out(),read:['<b>手順 1</b>　AD は ∠A の二等分線<br>BD : DC = AB : AC を示したい','<b>手順 2</b>　C を通り AD に平行な直線を引く<br>BA の延長との交点を E とする',
      '<b>手順 3</b>　AD ∥ EC なので<br>∠BAD = ∠AEC（同位角）、∠DAC = ∠ACE（錯角）<br>∠AEC = ∠ACE だから AE = AC','<b>手順 4</b>　△BCE で AD ∥ EC なので<br>BD : DC = BA : AE<br>AE = AC だから <b>BD : DC = AB : AC</b>'][s-1]};}}));

/* ---- 外心・内心・重心：頂点 A を動かす ---- */
FIGS.hazukei_goshin=host=>mk(host,{alt:'三角形の頂点 A を動かすと、外心・内心・重心が動く図',h:280,
  sliders:[{k:'m',label:'見る点',min:1,max:4,step:1,v:1,fmt:m=>['外心','内心','重心','3つを比べる'][m-1]},{k:'x',label:'頂点 A の左右',min:110,max:230,step:5,v:135},{k:'y',label:'頂点 A の高さ',min:60,max:130,step:10,v:110}],
  play:{k:'x',from:110,to:230,label:'A を左右に動かす',ms:4000},
  draw(v){const B=[95,180],C=[245,180],A=[v.x,180-v.y],O=circum(A,B,C),I=incen(A,B,C),G=cen([A,B,C]),R=dist(O,A),b=dist(C,A),c=dist(A,B),r=150*v.y/(150+b+c),u=25,d=draw();
    const D=mid(B,C),E=mid(C,A),F=mid(A,B),q=[22500,b*b,c*c].sort((x,y)=>x-y),t=q[2]-q[1]-q[0],kind=Math.abs(t)<1?'直角':t>0?'鈍角':'鋭角';let read;
    if(v.m===1){d.circle(O[0],O[1],R,MC);
      [[D,B,C],[E,C,A],[F,A,B]].forEach(([M,P,Q])=>{const e=un(P,Q),w=dist(M,O)<2?[-e[1],e[0]]:un(M,O);seg(d,go(M,w,-15),go(O,w,15),GD);rt(d,M,Q,go(M,w,1),6);});
      [A,B,C].forEach(P=>seg(d,O,P,SUB));d.poly([A,B,C],INK);pt(d,O,GO,4);{const w=un(O,C),l=Math.hypot(w[0],w[1]+1)||1;tx(d,O[0]+w[0]/l*16,O[1]+(w[1]+1)/l*16+4,'O',GO);}
      read=`外心 O：3辺の垂直二等分線の交点<br>OA = OB = OC = <b>${n(R/u)}</b>（外接円の半径）<br>${kind}三角形。外心は`+(kind==='鋭角'?'三角形の内部にある':kind==='鈍角'?'三角形の外部にある':'斜辺の中点にある');}
    else if(v.m===2){d.circle(I[0],I[1],r,MC);
      [[A,B,C],[B,C,A],[C,A,B]].forEach(([P,Q,S])=>{seg(d,P,cross(P,I,Q,S),GD);const H=foot(I,Q,S);seg(d,I,H,SUB);rt(d,H,I,Q,5);});
      d.poly([A,B,C],INK);pt(d,I,GO,4);tx(d,I[0]+11,I[1]-9,'I',GO);
      read=`内心 I：3つの内角の二等分線の交点<br>I から3辺までの距離は、どれも <b>${n(r/u)}</b>（内接円の半径）<br>内心は、いつも三角形の内部にある`;}
    else if(v.m===3){[[A,D],[B,E],[C,F]].forEach(([P,M])=>seg(d,P,M,MG));d.poly([A,B,C],INK);[D,E,F].forEach(M=>pt(d,M,IK,3));
      tick(d,B,D,1);tick(d,D,C,1);tick(d,C,E,2);tick(d,E,A,2);tick(d,A,F,3);tick(d,F,B,3);
      pt(d,G,GO,4);angT(d,G,D,C,17,'G',GO,12);tx(d,D[0],D[1]+16,'D');nm(d,E,'E',G);nm(d,F,'F',G);
      read=`重心 G：3本の中線の交点<br>AG = ${n(dist(A,G)/u)}、GD = ${n(dist(G,D)/u)}<br>AG : GD = <b>2 : 1</b>（BG : GE、CG : GF も同じ）`;}
    else{d.poly([A,B,C],INK);const L=[[O,'O',GO],[I,'I',CC],[G,'G',OK]],vt=Math.abs(v.x-170)<1;L.sort((p,q)=>vt?p[0][1]-q[0][1]:p[0][0]-q[0][0]);
      L.forEach((e,i)=>{pt(d,e[0],e[2],4);const o=vt?[[0,-9],[13,4],[-13,4]][i]:[[-12,4],[0,-9],[12,4]][i];tx(d,e[0][0]+o[0],e[0][1]+o[1],e[1],e[2]);});
      read='外心 O、内心 I、重心 G<br>'+(Math.abs(v.x-170)<1?(v.y===130?'ほぼ正三角形。3点はほぼ重なる':'AB = AC の二等辺三角形<br>3点は、対称の軸の上に並ぶ'):'3点は別々の位置にある<br>A を中央（170）に動かすと、縦に並ぶ');}
    nm(d,A,'A',G);nm(d,B,'B',[G[0],158]);nm(d,C,'C',[G[0],158]);
    return {svg:d.out(),read};}});

/* ---- なぜ：外心・内心・重心で3本の線が1点で交わる（arg.c = 1 外心、2 内心、3 重心） ---- */
FIGS.hazukei_proof=(host,arg)=>{const cs=(arg&&arg.c)||1;
  mk(host,Object.assign(STEP(4),{alt:['3辺の垂直二等分線が1点で交わることを示す手順の図','3つの内角の二等分線が1点で交わることを示す手順の図','3本の中線が1点で交わることを示す手順の図'][cs-1],
  draw(v){const s=v.s,A=[140,36],B=[60,206],C=[280,206],d=draw(),g=cen([A,B,C]),D=mid(B,C),E=mid(C,A),F=mid(A,B);let read;
    if(cs===1){const O=circum(A,B,C),pl=(M,st,k=24)=>{const w=un(M,O);seg(d,go(M,w,-k),go(O,w,24),st);};
      d.poly([A,B,C],INK);pl(F,GD);pl(E,GD);rt(d,F,A,O,7);rt(d,E,A,O,7);tick(d,A,F,1);tick(d,F,B,1);tick(d,A,E,2);tick(d,E,C,2);
      if(s===2){seg(d,O,A,HG);seg(d,O,B,HG);}
      if(s===3){seg(d,O,B,SUB);seg(d,O,A,HG);seg(d,O,C,HG);}
      if(s===4){seg(d,O,A,SUB);pl(D,CD,16);rt(d,D,C,O,7,MC);seg(d,O,B,HG);seg(d,O,C,HG);tick(d,B,D,3);tick(d,D,C,3);}
      pt(d,O,IK,3.5);tx(d,O[0]+15,O[1]+1,'O');
      read=['<b>手順 1</b>　辺 AB の垂直二等分線と<br>辺 AC の垂直二等分線の交点を O とする','<b>手順 2</b>　O は AB の垂直二等分線上にある<br>だから OA = OB','<b>手順 3</b>　O は AC の垂直二等分線上にある<br>だから OA = OC',
        '<b>手順 4</b>　OB = OC となるので<br>O は辺 BC の垂直二等分線上にもある<br><b>3本の垂直二等分線は1点 O で交わる</b>'][s-1];}
    else if(cs===2){const A=[120,54],B=[40,204],C=[300,204],g=cen([A,B,C]),I=incen(A,B,C),H=foot(I,B,C),J=foot(I,C,A),K=foot(I,A,B);
      d.poly([A,B,C],INK);seg(d,B,cross(B,I,A,C),GD);seg(d,C,cross(C,I,A,B),GD);ang(d,B,C,I,26,MK);ang(d,B,I,A,31,MK);ang(d,C,B,I,26,MC);ang(d,C,I,A,31,MC);
      [[H,B],[J,C],[K,A]].forEach(([P,Q])=>{seg(d,I,P,SUB);rt(d,P,I,Q,6);});
      if(s===2){seg(d,I,K,HG);seg(d,I,H,HG);}
      if(s===3){seg(d,I,H,HG);seg(d,I,J,HG);}
      if(s===4){seg(d,A,cross(A,I,B,C),CD);seg(d,I,J,HG);seg(d,I,K,HG);ang(d,A,B,I,24,MG);ang(d,A,I,C,29,MG);}
      pt(d,I,IK,3.5);tx(d,I[0]+11,I[1]+17,'I');tx(d,H[0]-2,H[1]+16,'D');nm(d,J,'E',g);nm(d,K,'F',g);nm(d,A,'A',g);nm(d,B,'B',[g[0],180]);nm(d,C,'C',[g[0],180]);
      read=['<b>手順 1</b>　∠B の二等分線と ∠C の二等分線の交点を I とする<br>I から3辺に垂線 ID, IE, IF を引く','<b>手順 2</b>　I は ∠B の二等分線上にある<br>だから、辺 AB, BC までの距離は等しい<br>IF = ID','<b>手順 3</b>　I は ∠C の二等分線上にある<br>だから ID = IE',
        '<b>手順 4</b>　IE = IF となるので<br>I は ∠A の二等分線上にもある<br><b>3本の角の二等分線は1点 I で交わる</b>'][s-1];}
    else{const G=g;
      if(s===3){d.poly([G,E,F],FG).poly([G,B,C],FC);}
      d.poly([A,B,C],INK);seg(d,B,E);seg(d,C,F);tick(d,A,F,1);tick(d,F,B,1);tick(d,A,E,2);tick(d,E,C,2);
      if(s>=2)seg(d,F,E,s===2?HG:MG);if(s===2)seg(d,B,C,HG);
      if(s===4){seg(d,A,D,MC);pt(d,D,IK,3);tx(d,D[0],D[1]+16,'D');}
      pt(d,E,IK,3);pt(d,F,IK,3);pt(d,G,IK,3.5);tx(d,G[0]+(s===4?13:1),G[1]-(s===4?9:11),'G');nm(d,E,'E',g);nm(d,F,'F',g);
      read=['<b>手順 1</b>　辺 CA, AB の中点を E, F とする<br>中線 BE と CF の交点を G とする','<b>手順 2</b>　中点連結定理より<br>FE ∥ BC、FE = BC ÷ 2','<b>手順 3</b>　FE ∥ BC なので △GEF ∽ △GBC<br>相似比は FE : BC = 1 : 2<br>だから BG : GE = CG : GF = 2 : 1',
        '<b>手順 4</b>　中線 AD と BE の交点も、同じ理由で<br>BE を 2 : 1 に分ける。それは G と同じ点<br><b>3本の中線は1点 G で交わる</b>'][s-1];}
    if(cs!==2){nm(d,A,'A',g);nm(d,B,'B',[g[0],180]);nm(d,C,'C',[g[0],180]);}
    return {svg:d.out(),read};}}));};

/* ---- チェバの定理：P, Q を動かす ---- */
FIGS.hazukei_ceva=host=>mk(host,{alt:'三角形の3頂点から引いた3直線が1点で交わるとき、3つの比の積が 1 になることを確かめる図',
  sliders:[{k:'p',label:'P の位置（BP ÷ BC）',min:.2,max:.8,step:.05,v:.4},{k:'q',label:'Q の位置（CQ ÷ CA）',min:.2,max:.8,step:.05,v:.5}],
  draw(v){const A=[150,30],B=[40,208],C=[300,208],P=mid(B,C,v.p),Q=mid(C,A,v.q),O=cross(A,P,B,Q),R=cross(C,O,A,B),d=draw(),g=cen([A,B,C]);
    const r1=v.p/(1-v.p),r2=v.q/(1-v.q),r3=dist(A,R)/dist(R,B);
    seg(d,A,P,SUB);seg(d,B,Q,SUB);seg(d,C,R,SUB);seg(d,B,C,MC);seg(d,C,A,MG);seg(d,A,B,MK);
    pt(d,P,CC,4);pt(d,Q,GO,4);pt(d,R,OK,4);pt(d,O,IK,3);angT(d,O,A,Q,15,'O');
    nm(d,A,'A',g);nm(d,B,'B',g);nm(d,C,'C',g);tx(d,P[0],P[1]+17,'P',CC);nm(d,Q,'Q',g,13,GO);nm(d,R,'R',g,13,OK);
    return {svg:d.out(),read:`BP/PC = ${n(r1)}　CQ/QA = ${n(r2)}　AR/RB = ${n(r3)}<br>3つをかけると <b>${n(r1*r2*r3)}</b><br>P, Q をどこに動かしても、積は 1`};}});

/* ---- メネラウスの定理：直線を動かす ---- */
FIGS.hazukei_menelaus=host=>mk(host,{alt:'三角形の2辺と、残りの辺の延長に交わる直線について、3つの比の積が 1 になることを確かめる図',
  sliders:[{k:'r',label:'R の位置（AR ÷ AB）',min:.3,max:.6,step:.05,v:.4},{k:'p',label:'P の位置（CP ÷ BC）',min:.3,max:.7,step:.05,v:.5}],
  draw(v){const A=[130,34],B=[40,208],C=[200,208],R=mid(A,B,v.r),P=[200+160*v.p,208],Q=cross(R,P,C,A),u=un(R,P),d=draw(),g=cen([A,B,C]);
    const r1=(1+v.p)/v.p,r2=dist(C,Q)/dist(Q,A),r3=v.r/(1-v.r);
    seg(d,C,P,DSH);d.poly([A,B,C],INK);seg(d,go(R,u,-24),go(P,u,12),MG);pt(d,P,GO,4);pt(d,Q,GO,4);pt(d,R,GO,4);
    nm(d,A,'A',g);nm(d,B,'B',g);tx(d,C[0]-2,C[1]+17,'C');tx(d,P[0],P[1]+17,'P',GO);nm(d,Q,'Q',g,14,GO);nm(d,R,'R',g,14,GO);
    return {svg:d.out(),read:`BP/PC = ${n(r1)}　CQ/QA = ${n(r2)}　AR/RB = ${n(r3)}<br>3つをかけると <b>${n(r1*r2*r3)}</b><br>直線をどう動かしても、積は 1`};}});

/* ---- なぜ：チェバの定理（arg.c = 1）とメネラウスの定理（arg.c = 2）の証明 ---- */
FIGS.hazukei_cevaproof=(host,arg)=>{const cs=(arg&&arg.c)||1;
  mk(host,Object.assign(STEP(5),{alt:['チェバの定理を、三角形の面積の比で証明する手順の図','メネラウスの定理を、頂点から直線に引いた垂線で証明する手順の図'][cs-1],
  draw(v){const s=v.s,d=draw();let read;
    if(cs===1){const A=[150,24],B=[40,208],C=[300,208],P=mid(B,C,.55),Q=mid(C,A,.45),O=cross(A,P,B,Q),R=cross(C,O,A,B),g=cen([A,B,C]);
      if(s===2)d.poly([A,B,P],FG).poly([A,P,C],FC);
      if(s===3)d.poly([O,B,P],FG).poly([O,P,C],FC);
      if(s===4)d.poly([O,A,B],FG).poly([O,C,A],FC);
      if(s===5)d.poly([O,B,C],FK).poly([O,C,A],FC).poly([O,A,B],FG);
      d.poly([A,B,C],INK);seg(d,A,P);seg(d,B,Q,s>=2&&s<=4?SUB:INK);seg(d,C,R,s>=2&&s<=4?SUB:INK);
      if(s>=2&&s<=4){seg(d,B,P,HG);seg(d,P,C,HC);}
      if(s===5){const c1=cen([O,B,P]),c2=cen([O,A,Q]),c3=cen([O,A,R]);tx(d,c1[0],c1[1]+6,'S₁',OK,13);tx(d,c2[0],c2[1]+4,'S₂',CC,13);tx(d,c3[0],c3[1]+4,'S₃',GO,13);}
      pt(d,O,IK,3);if(s!==5)angT(d,O,A,Q,15,'O');nm(d,A,'A',g);nm(d,B,'B',g);nm(d,C,'C',g);tx(d,P[0],P[1]+17,'P');nm(d,Q,'Q',g,13);nm(d,R,'R',g,13);
      read=['<b>手順 1</b>　3直線 AP, BQ, CR が1点 O で交わる<br>BP : PC を、三角形の面積の比で表したい','<b>手順 2</b>　△ABP と △ACP は、高さが共通<br>面積の比は、底辺の比に等しい<br>△ABP : △ACP = BP : PC','<b>手順 3</b>　△OBP と △OCP も、高さが共通<br>△OBP : △OCP = BP : PC',
        '<b>手順 4</b>　手順 2 の三角形から手順 3 の三角形を除く<br>△OAB : △OCA = <b>BP : PC</b>','<b>手順 5</b>　△OBC = S₁、△OCA = S₂、△OAB = S₃ とする<br>BP/PC = S₃/S₂、CQ/QA = S₁/S₃、AR/RB = S₂/S₁<br><b>3つをかけると 1</b>'][s-1];}
    else{const A=[190,34],B=[40,204],C=[210,204],R=mid(A,B,.45),P=[310,204],Q=cross(R,P,C,A),D=foot(A,R,P),E=foot(B,R,P),F=foot(C,R,P),u=un(R,P),g=cen([A,B,C]);
      if(s===3)d.poly([B,E,P],FG).poly([C,F,P],FC);
      if(s===4)d.poly([C,F,Q],FG).poly([A,D,Q],FG).poly([A,D,R],FK).poly([B,E,R],FK);
      seg(d,C,P,DSH);d.poly([A,B,C],INK);seg(d,go(E,u,-16),go(P,u,12),MG);
      if(s>=2){[[A,D],[B,E],[C,F]].forEach(([X,Y])=>{seg(d,X,Y,CD);rt(d,Y,X,P,6);});
        const l=(X,Y,t,dx,dy)=>{const m=mid(X,Y);tx(d,m[0]+dx,m[1]+dy,t,CC,12);};l(A,D,'h₁',13,0);l(B,E,'h₂',-13,2);l(C,F,'h₃',-12,8);}
      pt(d,P,GO,3.5);pt(d,Q,GO,3.5);pt(d,R,GO,3.5);
      nm(d,A,'A',g);tx(d,B[0]-9,B[1]+12,'B');tx(d,C[0]-2,C[1]+17,'C');tx(d,P[0]+2,P[1]+17,'P',GO);tx(d,Q[0]+11,Q[1]-7,'Q',GO);tx(d,R[0]+4,R[1]+18,'R',GO);tx(d,go(E,u,-16)[0]-2,go(E,u,-16)[1]-7,'ℓ',GO);
      read=['<b>手順 1</b>　直線 ℓ が、辺 AB と R、辺 AC と Q、<br>辺 BC の延長と P で交わる','<b>手順 2</b>　A, B, C から ℓ に垂線を引く<br>その長さを h₁, h₂, h₃ とする','<b>手順 3</b>　P のところの2つの直角三角形は相似<br>BP : PC = <b>h₂ : h₃</b>',
        '<b>手順 4</b>　Q, R のところでも同じ<br>CQ : QA = <b>h₃ : h₁</b>、AR : RB = <b>h₁ : h₂</b>','<b>手順 5</b>　BP/PC × CQ/QA × AR/RB<br>= h₂/h₃ × h₃/h₁ × h₁/h₂ = <b>1</b>'][s-1];}
    return {svg:d.out(),read};}}));};

/* ---- 円に内接する四角形：対角の和 ---- */
FIGS.hazukei_naisetsu=host=>mk(host,{alt:'円に内接する四角形の頂点を動かして、対角の和が 180 度になることを確かめる図',
  sliders:[{k:'a',label:'A の位置',min:70,max:160,step:5,v:110},{k:'e',label:'D の位置',min:10,max:80,step:5,v:40}],play:{k:'e',from:10,to:80,label:'D を円周上で動かす',ms:3600},
  draw(v){const O=[170,112],R=92,A=pc(O,R,v.a),B=pc(O,R,205),C=pc(O,R,265),D=pc(O,R,295+v.e),E=go(C,un(B,C),46),d=draw(),a=deg(A,B,D),b=deg(B,A,C);
    d.circle(O[0],O[1],R,SUB);seg(d,C,E,DSH);d.poly([A,B,C,D],INK);
    ang(d,A,B,D,20,MG);ang(d,C,B,D,16,MC);ang(d,C,D,E,22,MG);
    angT(d,A,B,D,34,n(a,1)+'°',GO);angT(d,C,B,D,30,n(180-a,1)+'°',CC);angT(d,C,D,E,37,n(a,1)+'°',GO);
    nm(d,A,'A',O);nm(d,B,'B',O);tx(d,C[0]-9,C[1]+15,'C');nm(d,D,'D',O);tx(d,E[0]+9,E[1]+6,'E');
    return {svg:d.out(),read:`∠A + ∠C = ${n(a,1)}° + ${n(180-a,1)}° = <b>180°</b><br>∠B + ∠D = ${n(b,1)}° + ${n(180-b,1)}° = <b>180°</b><br>頂点 C の外角 ∠DCE = ${n(a,1)}° = ∠A`};}});

FIGS.hazukei_naisetsuP=host=>mk(host,Object.assign(STEP(4),{alt:'円に内接する四角形の対角の和が 180 度であることを、中心角を使って証明する手順の図',
  draw(v){const s=v.s,O=[170,125],R=100,A=pc(O,R,110),B=pc(O,R,200),C=pc(O,R,280),D=pc(O,R,345),d=draw();
    d.circle(O[0],O[1],R,SUB);
    if(s>=2)arc(d,O,R,200,345,HG);if(s>=3)arc(d,O,R,345,200,HK);
    d.poly([A,B,C,D],INK);
    if(s>=2){seg(d,O,B,SUB);seg(d,O,D,SUB);ang(d,A,B,D,22,MG);angT(d,A,B,D,35,'α',GO,13);d.angle(O[0],O[1],20,200,345,MG);at(d,O,272,33,'2α',GO,12);}
    if(s>=3){ang(d,C,B,D,20,MK);angT(d,C,B,D,34,'β',OK,13);d.angle(O[0],O[1],13,345,560,MK);at(d,O,92,26,'2β',OK,12);}
    pt(d,O,IK,2.5);names(d,[A,B,C,D],'ABCD',O);tx(d,O[0]+24,O[1]+5,'O');
    return {svg:d.out(),read:['<b>手順 1</b>　四角形 ABCD が円 O に内接している<br>∠A + ∠C = 180° を示したい','<b>手順 2</b>　∠A = α は、弧 BCD に対する円周角<br>その弧に対する中心角は 2α','<b>手順 3</b>　∠C = β は、弧 BAD に対する円周角<br>その弧に対する中心角は 2β',
      '<b>手順 4</b>　2つの中心角を合わせると1周<br>2α + 2β = 360°<br><b>α + β = 180°</b>'][s-1]};}}));

/* ---- 接線と弦のつくる角 ---- */
FIGS.hazukei_setsugen=host=>mk(host,{alt:'円の接線と弦のつくる角が、その角の内部にある弧に対する円周角に等しいことを確かめる図',
  sliders:[{k:'b',label:'B の位置',min:60,max:220,step:10,v:100},{k:'t',label:'C の位置',min:.3,max:.7,step:.05,v:.5}],play:{k:'b',from:60,to:220,label:'B を円周上で動かす',ms:3600},
  draw(v){const O=[170,110],R=88,A=[170,198],B=pc(O,R,270+v.b),C=pc(O,R,270+v.b+(360-v.b)*v.t),T=[318,198],S=[22,198],d=draw(),h=v.b/2;
    d.circle(O[0],O[1],R,SUB);seg(d,S,T);arc(d,O,R,270,270+v.b,HC);d.poly([A,B,C],INK);
    ang(d,A,T,B,24,MG);ang(d,C,A,B,24,MG);angT(d,A,T,B,h<35?62:42,n(h)+'°',GO);angT(d,C,A,B,h<35?58:42,n(h)+'°',GO);
    tx(d,A[0],A[1]+17,'A');nm(d,B,'B',O);nm(d,C,'C',O);tx(d,312,190,'T');tx(d,28,190,'S');
    return {svg:d.out(),read:`∠BAT = <b>${n(h)}°</b>（接線 AT と弦 AB のつくる角）<br>∠ACB = <b>${n(h)}°</b>（太い弧 AB に対する円周角）<br>B や C を動かしても、2つの角は等しい`};}});

FIGS.hazukei_setsugenP=host=>mk(host,Object.assign(STEP(4),{alt:'接線と弦のつくる角の定理を、直径を引いて証明する手順の図',
  draw(v){const s=v.s,O=[170,112],R=88,A=[170,200],B=pc(O,R,10),C=pc(O,R,150),D=[170,24],T=[318,200],S=[22,200],d=draw();
    d.circle(O[0],O[1],R,SUB);seg(d,S,T);d.poly([A,B,C],INK);ang(d,A,T,B,26,MG);
    if(s>=2){seg(d,A,D,GD);rt(d,A,T,D,8);}
    if(s>=3){seg(d,B,D,MC);rt(d,B,A,D,8);ang(d,D,A,B,28,MG);}
    if(s!==3)ang(d,C,A,B,26,s===4?MG:SUB);
    pt(d,O,IK,2.5);tx(d,O[0]-10,O[1]+4,'O');tx(d,A[0],A[1]+17,'A');nm(d,B,'B',O);nm(d,C,'C',O);if(s>=2)tx(d,D[0],D[1]-8,'D');tx(d,312,192,'T');
    return {svg:d.out(),read:['<b>手順 1</b>　直線 AT は、点 A で円に接している<br>∠BAT = ∠ACB を示したい（∠BAT が鋭角の場合）','<b>手順 2</b>　直径 AD を引く<br>接線は半径に垂直なので ∠DAT = 90°<br>∠BAT = 90° − ∠BAD','<b>手順 3</b>　AD は直径なので ∠ABD = 90°<br>△ABD で ∠ADB = 90° − ∠BAD<br>だから ∠BAT = ∠ADB',
      '<b>手順 4</b>　∠ADB と ∠ACB は、弧 AB に対する円周角<br>∠ADB = ∠ACB<br><b>∠BAT = ∠ACB</b>'][s-1]};}}));

/* ---- 方べきの定理：P と直線の向きを動かす ---- */
FIGS.hazukei_hobeki=host=>mk(host,{alt:'点 P を通る直線が円と交わる2点 A, B について、PA かける PB が一定になることを確かめる図',
  sliders:[{k:'p',label:'OP の長さ（円の半径は 5）',min:1,max:8,step:.5,v:3},{k:'a',label:'直線の向き（度）',min:0,max:80,step:5,v:40}],play:{k:'a',from:0,to:80,label:'直線を回す',ms:3600},
  draw(v){const O=[150,125],u=18,P=[150+u*v.p,125],t=v.a*Math.PI/180,w=[-Math.cos(t),-Math.sin(t)],q=lc(P,w,O,90),d=draw(),k=Math.abs(v.p*v.p-25);let read;
    d.circle(O[0],O[1],90,INK);seg(d,O,P,DSH);
    if(v.p>5){const c=5/v.p,T=[O[0]+90*c,O[1]+90*Math.sqrt(1-c*c)];seg(d,P,T,GD);pt(d,T,GO,3);tx(d,T[0]+3,T[1]+16,'T',GO);}
    if(q){const A=go(P,w,q[0]),B=go(P,w,q[1]);seg(d,go(P,w,Math.min(q[0],0)-14),go(P,w,q[1]+14),SUB);seg(d,P,B,HC);seg(d,P,A,HG);pt(d,A,GO,3.5);pt(d,B,CC,3.5);
      if(v.p!==5)nm(d,A,'A',v.p<5?O:[O[0],O[1]+60],12,GO);nm(d,B,'B',O,12,CC);
      read=`PA = ${n(Math.abs(q[0])/u)}、PB = ${n(q[1]/u)}<br>PA × PB = <b>${n(k)}</b><br>`+(v.p<5?`P は円の内部。向きを変えても積は ${n(k)}（= 5² − OP²）`:v.p>5?`P は円の外部。向きを変えても積は ${n(k)}（= OP² − 5²）<br>接線の長さ PT は √${n(k)}。PT² も ${n(k)}`:'P は円周上。PA = 0 なので積は 0');}
    else{seg(d,go(P,w,-14),go(P,w,150),SUB);read=`この向きの直線は、円と交わらない<br>向きを小さくすると、2点で交わる<br>接線の長さ PT は √${n(k)}`;}
    pt(d,O,IK,2.5);tx(d,O[0]-4,O[1]+16,'O');pt(d,P,IK,3.5);tx(d,P[0]+4,P[1]+17,'P');
    return {svg:d.out(),read};}});

/* ---- 方べきの定理の証明（arg.c = 1 内部、2 外部、3 接線） ---- */
FIGS.hazukei_hobekiP=(host,arg)=>{const cs=(arg&&arg.c)||1;
  mk(host,Object.assign(STEP(4),{alt:['円の内部で交わる2つの弦について、方べきの定理を相似で証明する手順の図','円の外部の点を通る2直線について、方べきの定理を相似で証明する手順の図','接線と、円に交わる直線について、方べきの定理を相似で証明する手順の図'][cs-1],
  draw(v){const s=v.s,d=draw();let read;const last='PA : PD = PC : PB<br><b>PA × PB = PC × PD</b>';
    if(cs===1){const O=[170,125],R=100,A=pc(O,R,160),B=pc(O,R,330),C=pc(O,R,240),D=pc(O,R,60),P=cross(A,B,C,D);
      d.poly([P,A,C],FC).poly([P,D,B],FG);d.circle(O[0],O[1],R,SUB);if(s>=3)arc(d,O,R,240,330,HK);
      seg(d,A,B);seg(d,C,D);seg(d,A,C);seg(d,D,B);
      if(s===2||s===4){ang(d,P,A,C,16,MG);ang(d,P,D,B,16,MG);}
      if(s>=3){ang(d,A,P,C,22,MK);ang(d,D,P,B,22,MK);}
      names(d,[A,B,C,D],'ABCD',O);tx(d,P[0]+3,P[1]-13,'P');
      read=['<b>手順 1</b>　弦 AB と弦 CD が、円の内部の点 P で交わる<br>△PAC と △PDB に注目する','<b>手順 2</b>　対頂角は等しい<br>∠APC = ∠DPB …①','<b>手順 3</b>　弧 BC に対する円周角は等しい<br>∠PAC = ∠PDB …②','<b>手順 4</b>　①、②より △PAC ∽ △PDB<br>'+last][s-1];}
    else{const O=[222,125],R=86,P=[26,125],w1=[Math.cos(.23),-Math.sin(.23)],w2=[Math.cos(.2),Math.sin(.2)];
      if(cs===2){const a=lc(P,w1,O,R),c=lc(P,w2,O,R),A=go(P,w1,a[0]),B=go(P,w1,a[1]),C=go(P,w2,c[0]),D=go(P,w2,c[1]);
        d.poly([P,A,C],FC).poly([P,D,B],FG);d.circle(O[0],O[1],R,SUB);seg(d,P,go(B,w1,12));seg(d,P,go(D,w2,12));seg(d,A,C);seg(d,D,B);
        if(s===2||s===4)ang(d,P,A,C,30,MG);
        if(s>=3){ang(d,A,P,C,14,MK);ang(d,D,P,B,22,MK);}
        tx(d,P[0]-9,P[1]+4,'P');tx(d,A[0]-4,A[1]-9,'A');tx(d,B[0]+6,B[1]-9,'B');tx(d,C[0]-4,C[1]+17,'C');tx(d,D[0]+7,D[1]+16,'D');
        read=['<b>手順 1</b>　円の外部の点 P を通る2直線が<br>円と A, B および C, D で交わる<br>△PAC と △PDB に注目する','<b>手順 2</b>　∠P は共通 …①','<b>手順 3</b>　四角形 ACDB は円に内接する<br>頂点 A の外角は、向かいの内角に等しい<br>∠PAC = ∠PDB …②','<b>手順 4</b>　①、②より △PAC ∽ △PDB<br>'+last][s-1];}
      else{const c0=R/dist(O,P),T=[O[0]-R*c0,O[1]-R*Math.sqrt(1-c0*c0)],w3=[Math.cos(.08),Math.sin(.08)],a=lc(P,w3,O,R),A=go(P,w3,a[0]),B=go(P,w3,a[1]);
        d.poly([P,T,A],FC).poly([P,B,T],FG);d.circle(O[0],O[1],R,SUB);seg(d,P,go(T,un(P,T),40));seg(d,P,go(B,w3,12));seg(d,T,A);seg(d,T,B);
        if(s===2||s===4)ang(d,P,T,A,34,MG);
        if(s>=3){ang(d,T,P,A,20,MK);ang(d,B,P,T,26,MK);}
        tx(d,P[0]-9,P[1]+4,'P');tx(d,T[0]-5,T[1]-9,'T');tx(d,A[0]-7,A[1]+17,'A');tx(d,B[0]+10,B[1]+10,'B');
        read=['<b>手順 1</b>　円の外部の点 P から、接線 PT と<br>円と A, B で交わる直線を引く<br>△PTA と △PBT に注目する','<b>手順 2</b>　∠P は共通 …①','<b>手順 3</b>　接線と弦のつくる角の定理より<br>∠PTA = ∠PBT …②','<b>手順 4</b>　①、②より △PTA ∽ △PBT<br>PT : PB = PA : PT<br><b>PA × PB = PT²</b>'][s-1];}}
    return {svg:d.out(),read};}}));};

/* ---- 2つの円の位置関係と共通接線 ---- */
FIGS.hazukei_futatsuen=host=>mk(host,{alt:'2つの円の中心間の距離を変えて、位置関係と共通接線の本数を調べる図',
  sliders:[{k:'d',label:'中心間の距離 d（r = 3、r′ = 1.5）',min:0,max:7,step:.5,v:6}],play:{k:'d',from:7,to:0,label:'小さい円を近づける',ms:4500},
  draw(v){const u=22,O=[94,125],Q=[94+u*v.d,125],r=66,s=33,dd=v.d*u,d=draw();
    const tan=(c,k)=>{if(dd<=0||Math.abs(c)>1)return;const si=Math.sqrt(1-c*c);(si<1e-6?[0]:[1,-1]).forEach(z=>{const nv=[c,z*si],e=[-nv[1],nv[0]],T1=go(O,nv,r),T2=go(Q,nv,k*s),s2=(T2[0]-T1[0])*e[0]+(T2[1]-T1[1])*e[1];
      seg(d,go(T1,e,Math.min(0,s2)-26),go(T1,e,Math.max(0,s2)+26),MG);pt(d,T1,GO,2.5);pt(d,T2,GO,2.5);});};
    if(dd>0){tan((r-s)/dd,1);tan((r+s)/dd,-1);}
    d.circle(O[0],O[1],r,INK).circle(Q[0],Q[1],s,MC);seg(d,O,Q,DSH);pt(d,O,IK,2.5);pt(d,Q,CC,2.5);tx(d,O[0]-8,O[1]+15,'O');tx(d,Q[0]+9,Q[1]+15,'O′',CC);
    const i=v.d>4.5?0:v.d===4.5?1:v.d>1.5?2:v.d===1.5?3:4;
    return {svg:d.out(),read:`d = ${n(v.d)}（r + r′ = 4.5、r − r′ = 1.5）<br><b>${['互いに外部にある','外接する','2点で交わる','内接する','一方が他方の内部にある'][i]}</b>　${['d > r + r′','d = r + r′','r − r′ < d < r + r′','d = r − r′','d < r − r′'][i]}<br>共通接線は ${4-i} 本`};}});

/* ---- 作図（arg.c = 1 内分点、2 積 ab、3 √a） ---- */
FIGS.hazukei_sakuzu=(host,arg)=>{const cs=(arg&&arg.c)||1,st=STEP(4);if(cs===3)st.sliders.push({k:'a',label:'a',min:1,max:4,step:.5,v:3});
  mk(host,Object.assign(st,{alt:['線分 AB を 3 対 2 に内分する点を作図する手順の図','長さ 1, a, b の線分から、長さ ab の線分を作図する手順の図','長さ 1 と a の線分から、長さ ルート a の線分を作図する手順の図'][cs-1],
  draw(v){const s=v.s,d=draw();let read;
    if(cs===1){const A=[40,206],B=[290,206],w=[Math.cos(.61),-Math.sin(.61)],K=[1,2,3,4,5].map(i=>go(A,w,44*i)),P=[190,206],X=go(A,w,252);
      seg(d,A,X,SUB);seg(d,A,B);tx(d,X[0]+9,X[1]-2,'X',MU);
      if(s>=2)K.forEach((c,i)=>{d.line(c[0]+w[1]*5,c[1]-w[0]*5,c[0]-w[1]*5,c[1]+w[0]*5,INK);tx(d,c[0]-9,c[1]-8,'C'+'₁₂₃₄₅'[i],i===2||i===4?IK:MU,11);});
      if(s>=3)seg(d,K[4],B,MC);
      if(s>=4){seg(d,K[2],P,MG);pt(d,P,GO,4);tx(d,P[0],P[1]+17,'P',GO);seg(d,A,P,HG);seg(d,P,B,HC);tx(d,115,224,'3',GO);tx(d,240,224,'2',CC);}
      pt(d,A);pt(d,B);tx(d,A[0]-8,A[1]+16,'A');tx(d,B[0]+8,B[1]+16,'B');
      read=['<b>手順 1</b>　線分 AB を 3 : 2 に内分する点を作図する<br>A から、AB と重ならない半直線 AX を引く','<b>手順 2</b>　コンパスで、AX 上に等しい間隔で<br>5つの点 C₁, C₂, …, C₅ をとる（3 + 2 = 5）','<b>手順 3</b>　C₅ と B を結ぶ','<b>手順 4</b>　C₃ を通り C₅B に平行な直線を引く<br>AB との交点が P<br>AP : PB = AC₃ : C₃C₅ = <b>3 : 2</b>'][s-1];}
    else if(cs===2){const O=[40,190],w=[Math.cos(.7),-Math.sin(.7)],E=[90,190],B=[165,190],A=go(O,w,80),C=go(O,w,200);
      seg(d,O,[318,190],SUB);seg(d,O,go(O,w,236),SUB);
      const dim=(x2,yy,t)=>{d.line(O[0],yy,x2,yy,SUB).line(O[0],yy-3,O[0],yy+3,SUB).line(x2,yy-3,x2,yy+3,SUB);tx(d,(O[0]+x2)/2,yy+14,t,MU);};dim(E[0],202,'1');dim(B[0],220,'b');
      if(s>=4)seg(d,O,C,HG);
      if(s>=2)seg(d,E,A,MC);if(s>=3){seg(d,B,C,MG);pt(d,C,GO,3.5);tx(d,C[0]-10,C[1]-6,'C',GO);}
      const m=mid(O,A);tx(d,m[0]-10,m[1]-5,'a',MU);if(s>=4)tx(d,mid(A,C)[0]-12,mid(A,C)[1]-8,'OC = ab',GO,12,'end');
      pt(d,O);pt(d,E);pt(d,B);pt(d,A);tx(d,O[0]-10,O[1]+4,'O');tx(d,E[0]-8,E[1]-8,'E');tx(d,B[0]-8,B[1]-8,'B');tx(d,A[0]-10,A[1]-5,'A');
      read=['<b>手順 1</b>　O から2本の半直線を引く<br>一方に OE = 1、OB = b、もう一方に OA = a をとる','<b>手順 2</b>　E と A を結ぶ','<b>手順 3</b>　B を通り EA に平行な直線を引く<br>半直線 OA との交点を C とする','<b>手順 4</b>　EA ∥ BC なので OE : OB = OA : OC<br>1 : b = a : OC<br><b>OC = ab</b>'][s-1];}
    else{const a=v.a,y=138,A=[40,y],B=[76,y],C=[76+36*a,y],r=18*(1+a),O=[40+r,y],h=36*Math.sqrt(a),D=[76,y-h],E=[76,y+h],q=Math.sqrt(a);
      d.line(20,y,320,y,SUB);seg(d,A,C);
      if(s>=2){d.path(`M${A[0]},${y} A${f(r)},${f(r)} 0 0 1 ${f(C[0])},${y}`,INK);pt(d,O,IK,2.5);tx(d,O[0]+(a<1.6?12:0),O[1]+16,'O');}
      if(s>=4){d.path(`M${A[0]},${y} A${f(r)},${f(r)} 0 0 0 ${f(C[0])},${y}`,DSH);seg(d,B,E,DSH);pt(d,E,MU,3);tx(d,E[0]-12,E[1]+5,'D′',MU);}
      if(s>=3){seg(d,B,D,s>=4?HG:MG);rt(d,B,C,D,7);pt(d,D,GO,3.5);tx(d,D[0]-10,D[1]-4,'D',GO);}
      if(s>=4)tx(d,B[0]+8,y-h/2+4,'√a',GO,12,'start');
      pt(d,A);pt(d,B);pt(d,C);tx(d,A[0]-9,y-7,'A');tx(d,B[0]-9,y+16,'B');tx(d,C[0]+9,y-7,'C');tx(d,58,y-7,'1',MU);if(s<3)tx(d,(B[0]+C[0])/2,y-7,'a',MU);
      read=[`<b>手順 1</b>　直線上に AB = 1、BC = a となる点をとる<br>（いまは a = ${n(a)}）`,'<b>手順 2</b>　線分 AC の中点 O を作図し<br>AC を直径とする円をかく','<b>手順 3</b>　B を通り AC に垂直な直線を引く<br>円との交点の1つを D とする',
        `<b>手順 4</b>　方べきの定理より BA × BC = BD × BD′<br>BD = BD′ なので BD² = 1 × a<br><b>BD = √a</b>（a = ${n(a)} のとき ${Number.isInteger(q)?'':'約 '}${n(q)}）`][s-1];}
    return {svg:d.out(),read};}}));};

/* ---- 立方体の中の2直線 ---- */
const cube=()=>{const u=118,p=(x,y,z)=>[84+x*u+y*52,214-z*u-y*36];return {E:p(0,0,0),F:p(1,0,0),G:p(1,1,0),H:p(0,1,0),A:p(0,0,1),B:p(1,0,1),C:p(1,1,1),D:p(0,1,1)};};
const cubeDraw=(d,k)=>{seg(d,k.E,k.H,DSH);seg(d,k.H,k.G,DSH);seg(d,k.H,k.D,DSH);d.poly([k.A,k.B,k.F,k.E],INK).poly([k.A,k.B,k.C,k.D],INK).poly([k.B,k.C,k.G,k.F],INK);};
const cubeNames=(d,k)=>{tx(d,k.A[0]-10,k.A[1]+3,'A');tx(d,k.B[0]+11,k.B[1]+6,'B');tx(d,k.C[0]+10,k.C[1]+2,'C');tx(d,k.D[0]-3,k.D[1]-7,'D');tx(d,k.E[0]-10,k.E[1]+8,'E');tx(d,k.F[0]+2,k.F[1]+16,'F');tx(d,k.G[0]+11,k.G[1]+6,'G');tx(d,k.H[0]-10,k.H[1]-2,'H',MU);};
FIGS.hazukei_cube=host=>mk(host,{alt:'立方体の辺や対角線から2直線を選び、位置関係となす角を示す図',
  sliders:[{k:'k',label:'2直線',min:1,max:5,step:1,v:1,fmt:k=>['AB と HG','AB と BF','AB と EG','AF と BG','AC と BF'][k-1]}],
  draw(v){const k=cube(),{A,B,C,D,E,F,G,H}=k,d=draw();let read;
    if(v.k===4)d.poly([A,F,H],FG);
    cubeDraw(d,k);
    if(v.k===1){seg(d,A,B,HG);seg(d,H,G,HC);read='AB と HG：同じ平面上にあって、交わらない<br><b>平行</b>';}
    if(v.k===2){seg(d,A,B,HG);seg(d,B,F,HC);rt(d,B,A,F,9,MG);read='AB と BF：点 B で交わる<br>なす角は <b>90°</b>（垂直）';}
    if(v.k===3){seg(d,A,B,HG);seg(d,E,G,HC);seg(d,A,C,CD);ang(d,A,B,C,74,MG);tx(d,A[0]+100,A[1]-10,'45°',GO,11);read='AB と EG：交わらず、平行でもない → <b>ねじれの位置</b><br>EG を平行に移すと AC に重なる<br>なす角は ∠BAC = <b>45°</b>';}
    if(v.k===4){seg(d,A,F,HG);seg(d,B,G,HC);seg(d,A,H,CD);seg(d,F,H,DSH);ang(d,A,F,H,34,MG);tx(d,A[0]+15,A[1]+60,'60°',GO,10);read='AF と BG：ねじれの位置<br>BG を平行に移すと AH に重なる<br>△AFH は正三角形なので、なす角は <b>60°</b>';}
    if(v.k===5){seg(d,A,C,HG);seg(d,B,F,HC);seg(d,C,G,CD);rt(d,C,A,G,9,MG);read='AC と BF：ねじれの位置<br>BF を平行に移すと CG に重なる<br>CG は面 ABCD に垂直なので、なす角は <b>90°</b>';}
    cubeNames(d,k);return {svg:d.out(),read};}});

/* ---- 三垂線の定理 ---- */
FIGS.hazukei_sansuisen=host=>mk(host,Object.assign(STEP(4),{alt:'三垂線の定理を手順で示す図',
  draw(v){const s=v.s,q=(x,y)=>[40+x+.45*y,218-.5*y],O=q(90,70),P=[O[0],46],H=q(150,70),L1=q(150,6),L2=q(150,126),d=draw();
    d.poly([q(0,0),q(200,0),q(200,130),q(0,130)],'fill="var(--c)" fill-opacity=".1" stroke="var(--muted)" stroke-width="1.2"');
    if(s>=3)d.poly([P,O,H],FG);
    seg(d,L1,L2,s>=2?HC:INK);seg(d,P,O,s===2||s===3?HG:INK);seg(d,O,H,s===3?HG:INK);seg(d,P,H,s===4?HG:SUB);
    rt(d,O,P,H,7);rt(d,H,O,L2,7);if(s===4)rt(d,H,P,L1,8,MG);
    pt(d,P);pt(d,O);pt(d,H);tx(d,P[0]-10,P[1]+2,'P');tx(d,O[0]-10,O[1]+10,'O');tx(d,H[0]+12,H[1]+12,'H');tx(d,L2[0]+9,L2[1]-2,'ℓ',CC);tx(d,60,212,'α',MU);
    return {svg:d.out(),read:['<b>手順 1</b>　PO ⊥ 平面 α、OH ⊥ ℓ（ℓ は α 上の直線）<br>このとき PH ⊥ ℓ を示したい','<b>手順 2</b>　PO は α に垂直なので<br>α 上のすべての直線に垂直。PO ⊥ ℓ','<b>手順 3</b>　ℓ は、交わる2直線 PO, OH に垂直<br>だから ℓ ⊥ 平面 POH','<b>手順 4</b>　PH は平面 POH 上の直線<br>だから <b>PH ⊥ ℓ</b>'][s-1]};}}));

/* ---- 多面体：頂点・辺・面を数える ---- */
const PNAME=['正四面体','正六面体（立方体）','正八面体','正十二面体','正二十面体','四角錐','三角柱'],PINFO=['正三角形。1つの頂点に 3 面','正方形。1つの頂点に 3 面','正三角形。1つの頂点に 4 面','正五角形。1つの頂点に 3 面','正三角形。1つの頂点に 5 面'];
const pcache={};
const polyh=k=>{if(pcache[k])return pcache[k];const g=(1+Math.sqrt(5))/2,sg=[1,-1];let vs=[];
  const cyc=(a,b)=>[0,1,2].forEach(i=>sg.forEach(x=>sg.forEach(y=>{const p=[0,0,0];p[(i+1)%3]=x*a;p[(i+2)%3]=y*b;vs.push(p);})));
  if(k===1)vs=[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]];
  if(k===2||k===4)sg.forEach(a=>sg.forEach(b=>sg.forEach(c=>vs.push([a,b,c]))));
  if(k===3)[0,1,2].forEach(i=>sg.forEach(a=>{const p=[0,0,0];p[i]=a;vs.push(p);}));
  if(k===4)cyc(1/g,g);if(k===5)cyc(1,g);
  if(k===6)vs=[[1,1,-.8],[1,-1,-.8],[-1,-1,-.8],[-1,1,-.8],[0,0,1.3]];
  if(k===7)[0,1,2].forEach(i=>sg.forEach(z=>vs.push([Math.cos(i*2*Math.PI/3),Math.sin(i*2*Math.PI/3),z*.95])));
  const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],crs=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],N=vs.length,fs=[],es=[];
  for(let i=0;i<N;i++)for(let j=i+1;j<N;j++)for(let m=j+1;m<N;m++){let nv=crs(sub(vs[j],vs[i]),sub(vs[m],vs[i]));const l=Math.hypot(nv[0],nv[1],nv[2]);if(l<1e-9)continue;nv=nv.map(x=>x/l);const h=dot(nv,vs[i]);
    let pos=0,neg=0;const on=[];vs.forEach((p,z)=>{const t=dot(nv,p)-h;if(t>1e-7)pos++;else if(t<-1e-7)neg++;else on.push(z);});
    if(pos&&neg)continue;if(pos)nv=nv.map(x=>-x);if(!fs.some(F=>dot(F.n,nv)>1-1e-6))fs.push({n:nv,on});}
  for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){const fl=fs.filter(F=>F.on.includes(i)&&F.on.includes(j));if(fl.length===2)es.push([i,j,fl]);}
  return pcache[k]={vs,fs,es,sc:Math.max(...vs.map(p=>Math.hypot(p[0],p[1],p[2])))};};
FIGS.hazukei_tamentai=(host,arg)=>mk(host,{alt:'多面体を回しながら、頂点・辺・面の数を数える図',
  sliders:[{k:'k',label:'多面体',min:1,max:7,step:1,v:(arg&&arg.k)||2,fmt:k=>PNAME[k-1]},{k:'t',label:'回す角度（度）',min:0,max:360,step:5,v:25}],play:{k:'t',from:0,to:360,label:'1回転させる',ms:6000},
  draw(v){const M=polyh(v.k),a=v.t*Math.PI/180,ca=Math.cos(a),sa=Math.sin(a),ct=Math.cos(.36),st=Math.sin(.36),S=92/M.sc,d=draw();
    const rot=p=>{const x=p[0]*ca-p[1]*sa,y=p[0]*sa+p[1]*ca;return [x,p[2]*ct+y*st,-y*ct+p[2]*st];},sc=p=>{const q=rot(p);return [170+q[0]*S,122-q[1]*S];},front=F=>rot(F.n)[2]>1e-9;
    const P=M.vs.map(sc),vis=M.es.map(e=>e[2].some(front));
    M.es.forEach((e,i)=>{if(!vis[i])seg(d,P[e[0]],P[e[1]],DSH);});
    M.fs.forEach(F=>{if(front(F)){const c=cen(F.on.map(i=>P[i])),o=F.on.map(i=>P[i]).sort((p,q)=>Math.atan2(p[1]-c[1],p[0]-c[0])-Math.atan2(q[1]-c[1],q[0]-c[0]));d.poly(o,'fill="var(--c)" fill-opacity=".12" stroke="none"');}});
    M.es.forEach((e,i)=>{if(vis[i])seg(d,P[e[0]],P[e[1]],INK);});
    M.vs.forEach((p,i)=>{const fr=M.fs.some(F=>F.on.includes(i)&&front(F));pt(d,P[i],fr?GO:MU,fr?2.8:2);});
    const V=M.vs.length,E=M.es.length,F=M.fs.length;
    return {svg:d.out(),read:`${PNAME[v.k-1]}`+(v.k<=5?`（面は${PINFO[v.k-1]}）`:'')+`<br>頂点 v = ${V}、辺 e = ${E}、面 f = ${F}<br>v − e + f = ${V} − ${E} + ${F} = <b>${V-E+F}</b>`};}});

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
// 3辺の長さ a = BC, b = CA, c = AB から三角形 [A, B, C] を作る（B が (x0, y0)、1 を u px とする）
const tri=(a,b,c,x0,y0,u)=>{const x=(a*a+c*c-b*b)/(2*a),y=Math.sqrt(c*c-x*x);return [[x0+x*u,y0-y*u],[x0,y0],[x0+a*u,y0]];};
const T0=[[150,28],[40,196],[300,196]];
const eq2=(d,P,Q1,Q2,Q3,r=20,st=MK)=>{ang(d,P,Q1,Q2,r,st);ang(d,P,Q2,Q3,r+5,st);};
// 2つの円の交点（上、下の順）と、点 P から円に引いた接線の接点
const cc=(O1,r1,O2,r2)=>{const dd=dist(O1,O2),a=(r1*r1-r2*r2+dd*dd)/(2*dd),h=Math.sqrt(r1*r1-a*a),u=un(O1,O2),M=go(O1,u,a);return [[M[0]+u[1]*h,M[1]-u[0]*h],[M[0]-u[1]*h,M[1]+u[0]*h]];};
const tang=(P,O,R,sg)=>{const th=Math.atan2(P[1]-O[1],P[0]-O[0]),al=Math.acos(R/dist(O,P))*sg;return [O[0]+R*Math.cos(th+al),O[1]+R*Math.sin(th+al)];};
const rad=a=>a*Math.PI/180;
const Q={
 gaikaku:{alt:'三角形 ABC の頂点 A における外角の二等分線が、辺 BC の延長と点 E で交わる図',h:200,f(d){const [A,B,C]=tri(4.5,3.5,6,24,172,26),E=[C[0]+6.3*26,172],F=go(A,un(B,A),46);
   seg(d,C,E,DSH);seg(d,A,F,DSH);d.poly([A,B,C],INK);seg(d,A,go(A,un(A,E),dist(A,E)+12),MG);ang(d,A,C,E,28,MK);ang(d,A,E,F,33,MK);pt(d,E,GO,3.5);
   tx(d,A[0]-12,A[1]-2,'A');tx(d,B[0]-2,B[1]+16,'B');tx(d,C[0],C[1]+16,'C');tx(d,E[0],E[1]+16,'E',GO);tx(d,F[0]+10,F[1]+2,'F',MU);return 'AE は ∠A の外角 ∠CAF の二等分線　BE : EC = AB : AC';}},
 henhiEx:{alt:'AB が 4、AC が 6、BC が 5 の三角形 ABC と、角 A の二等分線 AD、外角の二等分線 AE の図',h:206,f(d){const [A,B,C]=tri(5,6,4,218,178,19),D=[256,178],E=[28,178],F=go(A,un(C,A),34),g=cen([A,B,C]);
   seg(d,E,B,DSH);seg(d,A,F,DSH);d.poly([A,B,C],INK);seg(d,A,D,MG);seg(d,A,E,MC);eq2(d,A,B,D,C,20,MG);ang(d,A,B,E,30,MC);ang(d,A,E,F,35,MC);pt(d,D,GO,3);pt(d,E,CC,3);
   tx(d,A[0]+11,A[1]-6,'A');tx(d,B[0]-3,B[1]+16,'B');tx(d,C[0]+2,C[1]+16,'C');tx(d,D[0],D[1]+16,'D',GO);tx(d,E[0],E[1]+16,'E',CC);tx(d,F[0]-9,F[1]-2,'F',MU);len(d,A,C,'6',g,13);tx(d,214,146,'4',MU);return 'AB = 4、AC = 6、BC = 5';}},
 naigai:{alt:'直線 AB 上に、内分する点 P と、外分する点 Q, R をとった図',h:90,f(d){const y=46,X=t=>98+12*t;d.line(14,y,326,y,DSH).line(X(0),y,X(12),y,'stroke="var(--ink)" stroke-width="2.4"');
   [[0,'A',IK],[12,'B',IK],[8,'P',GO],[18,'Q',GO],[-6,'R',GO]].forEach(([t,s,c])=>{d.dot(X(t),y,c,3.5);tx(d,X(t),y-10,s,c);});tx(d,X(4),y+18,'AB = 12',MU);return 'P は線分 AB 上、Q と R は線分 AB の延長上にある';}},
 bd:{alt:'AB が 9、BC が 10、CA が 6 の三角形 ABC と、角 A の二等分線 AD の図',h:208,f(d){const [A,B,C]=tri(10,6,9,50,180,24),D=[194,180],g=cen([A,B,C]);d.poly([A,B,C],INK);seg(d,A,D,MG);eq2(d,A,B,D,C,22);
   names(d,[A,B,C],'ABC',g);tx(d,D[0],D[1]+16,'D');len(d,A,B,'9',g,13);len(d,A,C,'6',g,13);tx(d,110,196,'10',MU);return 'AB = 9、BC = 10、CA = 6';}},
 gaikaku2:{alt:'AB が 6、AC が 3、BC が 5 の三角形 ABC と、角 A の二等分線 AD、外角の二等分線 AE の図',h:200,f(d){const [A,B,C]=tri(5,3,6,30,172,27),D=[120,172],E=[300,172],F=go(A,un(B,A),40),g=cen([A,B,C]);
   seg(d,C,E,DSH);seg(d,A,F,DSH);d.poly([A,B,C],INK);seg(d,A,D,MG);seg(d,A,E,MC);eq2(d,A,B,D,C,26,MG);ang(d,A,C,E,16,MC);ang(d,A,E,F,21,MC);pt(d,D,GO,3);pt(d,E,CC,3);
   tx(d,A[0]-10,A[1]-7,'A');tx(d,B[0]-3,B[1]+16,'B');tx(d,C[0]+3,C[1]+16,'C');tx(d,D[0],D[1]+16,'D',GO);tx(d,E[0],E[1]+16,'E',CC);len(d,A,B,'6',[100,200],13);tx(d,C[0]+13,C[1]-34,'3',MU);tx(d,75,188,'5',MU);return 'AB = 6、AC = 3、BC = 5';}},
 gaishin:{alt:'三角形 ABC とその外心 O を結んだ図。角 OAB が 25 度、角 OBC が 35 度',h:226,f(d){const O=[170,112],R=92,A=pc(O,R,100),B=pc(O,R,230),C=pc(O,R,340);d.circle(O[0],O[1],R,SUB);d.poly([A,B,C],INK);[A,B,C].forEach(P=>seg(d,O,P,MG));
   ang(d,A,O,B,26,MC);angT(d,A,O,B,41,'25°',CC);ang(d,B,O,C,28,MC);angT(d,B,O,C,45,'35°',CC);ang(d,C,O,A,26,MG);angT(d,C,O,A,40,'x',GO,12);
   pt(d,O,IK,2.5);names(d,[A,B,C],'ABC',O);at(d,O,285,14,'O',IK,12);return 'O は △ABC の外心　∠OAB = 25°、∠OBC = 35°';}},
 naishin:{alt:'角 A が 50 度の三角形 ABC とその内心 I の図',h:226,f(d){const B=[95,200],C=[245,200],A=cross(B,[B[0]+Math.cos(rad(70)),B[1]-Math.sin(rad(70))],C,[C[0]-Math.cos(rad(60)),C[1]-Math.sin(rad(60))]),I=incen(A,B,C),g=cen([A,B,C]);
   d.poly([A,B,C],INK);seg(d,B,I,MG);seg(d,C,I,MG);eq2(d,B,C,I,A,26,MK);eq2(d,C,B,I,A,26,MC);ang(d,A,B,C,22,SUB);angT(d,A,B,C,38,'50°',MU);ang(d,I,B,C,14,MG);angT(d,I,B,C,27,'x',GO,12);
   pt(d,I,IK,3);names(d,[A,B,C],'ABC',g);tx(d,I[0],I[1]-9,'I');return 'I は △ABC の内心　∠BAC = 50°';}},
 jushin:{alt:'三角形 ABC の中線 AD と重心 G の図',h:214,f(d){const A=[150,28],B=[50,190],C=[290,190],D=mid(B,C),G=cen([A,B,C]);d.poly([A,B,C],INK);seg(d,A,D,MG);tick(d,B,D,1);tick(d,D,C,1);pt(d,D,IK,3);pt(d,G,GO,3.5);
   names(d,[A,B,C],'ABC',G);tx(d,D[0],D[1]+16,'D');tx(d,G[0]+12,G[1]+3,'G',GO);return 'D は辺 BC の中点、G は △ABC の重心';}},
 naishinhi:{alt:'AB が 8、BC が 7、CA が 6 の三角形 ABC と内心 I、直線 AI と辺 BC の交点 D の図',h:222,f(d){const [A,B,C]=tri(7,6,8,60,196,28),D=[172,196],I=incen(A,B,C),g=cen([A,B,C]);d.poly([A,B,C],INK);seg(d,A,D,MG);seg(d,B,cross(B,I,A,C),MC);eq2(d,A,B,D,C,24,MG);eq2(d,B,C,I,A,28,MC);
   pt(d,I,IK,3.5);names(d,[A,B,C],'ABC',g);tx(d,D[0],D[1]+16,'D');tx(d,I[0]+12,I[1]-6,'I');len(d,A,B,'8',g,13);len(d,A,C,'6',g,13);tx(d,110,212,'7',MU);return 'AB = 8、BC = 7、CA = 6　I は内心';}},
 chokkaku:{alt:'角 C が直角の三角形 ABC と、外接円、内接円、外心 O、内心 I の図',h:230,f(d){const C=[110,196],B=[230,196],A=[110,36],O=[170,116],I=[150,156];d.circle(O[0],O[1],100,SUB).circle(I[0],I[1],40,MC);d.poly([A,B,C],INK);rt(d,C,A,B,8);
   pt(d,O,GO,3.5);pt(d,I,CC,3.5);tx(d,O[0]+11,O[1]-5,'O',GO);tx(d,I[0]-10,I[1]-6,'I',CC);tx(d,A[0]-11,A[1]+4,'A');tx(d,B[0]+11,B[1]+6,'B');tx(d,C[0]-11,C[1]+8,'C');tx(d,170,212,'6',MU);tx(d,98,120,'8',MU);return '∠C = 90°、BC = 6、CA = 8';}},
 chuten:{alt:'三角形 ABC の2本の中線 BE, CF とその交点 G、中点を結ぶ線分 FE の図',h:214,f(d){const A=[140,28],B=[50,190],C=[290,190],E=mid(C,A),F=mid(A,B),G=cen([A,B,C]);d.poly([A,B,C],INK);seg(d,C,F);seg(d,B,E,MG);seg(d,F,E,MC);
   tick(d,A,F,1);tick(d,F,B,1);tick(d,A,E,2);tick(d,E,C,2);pt(d,E,IK,3);pt(d,F,IK,3);pt(d,G,GO,3.5);names(d,[A,B,C],'ABC',G);nm(d,E,'E',G);nm(d,F,'F',G);tx(d,G[0]+2,G[1]-10,'G',GO);tx(d,170,206,'10',MU);return 'E, F は辺 CA, AB の中点　BC = 10、BE = 12';}},
 suishin:{alt:'三角形 ABC の各頂点を通り向かいの辺に平行な直線で作った三角形 PQR と、A から BC に引いた垂線の図',h:246,f(d){const A=[160,62],B=[110,142],C=[230,142],P=[180,222],Qp=[280,62],Rp=[40,62],H=[160,142];
   d.poly([P,Qp,Rp],SUB);d.poly([A,B,C],INK);seg(d,A,H,MG);rt(d,H,A,C,7);rt(d,A,H,Qp,7);
   tx(d,A[0],A[1]-9,'A');tx(d,B[0]-11,B[1]+5,'B');tx(d,C[0]+11,C[1]+5,'C');tx(d,P[0]+12,P[1]+8,'P',MU);tx(d,Qp[0]+10,Qp[1]-4,'Q',MU);tx(d,Rp[0]-10,Rp[1]-4,'R',MU);return 'QR ∥ BC、RP ∥ CA、PQ ∥ AB';}},
 cevaEx:{alt:'三角形 ABC の辺 AB 上の点 R、辺 AC 上の点 Q と、BQ, CR の交点 O、直線 AO と BC の交点 P の図',h:222,f(d){const [A,B,C]=T0,R=mid(A,B,.4),Qp=mid(A,C,1/3),O=cross(B,Qp,C,R),P=cross(A,O,B,C),g=cen(T0);d.poly(T0,INK);seg(d,B,Qp);seg(d,C,R);seg(d,A,P,MG);
   [R,Qp,P].forEach(X=>pt(d,X,IK,3));pt(d,O,GO,3.5);names(d,T0,'ABC',g);nm(d,R,'R',g,13);nm(d,Qp,'Q',g,13);tx(d,P[0],P[1]+16,'P');angT(d,O,A,Qp,16,'O',GO,12);
   len(d,A,R,'2',g,12,CC);len(d,R,B,'3',g,12,CC);len(d,A,Qp,'1',g,12,CC);len(d,Qp,C,'2',g,12,CC);return 'AR : RB = 2 : 3、AQ : QC = 1 : 2';}},
 ceva1:{alt:'三角形 ABC の3辺上の点 P, Q, R と、1点で交わる3直線 AP, BQ, CR の図',h:222,f(d){const [A,B,C]=T0,R=mid(A,B,.6),P=mid(B,C,1/3),O=cross(A,P,C,R),Qp=cross(B,O,C,A),g=cen(T0);d.poly(T0,INK);seg(d,A,P);seg(d,C,R);seg(d,B,Qp,MG);
   [R,Qp,P].forEach(X=>pt(d,X,IK,3));names(d,T0,'ABC',g);nm(d,R,'R',g,13);nm(d,Qp,'Q',g,13);tx(d,P[0],P[1]+16,'P');
   len(d,A,R,'3',g,12,CC);len(d,R,B,'2',g,12,CC);tx(d,mid(B,P)[0],212,'1',CC);tx(d,mid(P,C)[0],212,'2',CC);return 'AR : RB = 3 : 2、BP : PC = 1 : 2';}},
 mene1:{alt:'三角形 ABC の辺 AB 上の点 R と、辺 BC の延長上の点 P を通る直線が、辺 CA と点 Q で交わる図',h:222,f(d){const A=[120,30],B=[40,196],C=[200,196],R=mid(A,B,1/3),P=[280,196],Qp=cross(R,P,C,A),u=un(R,P),g=cen([A,B,C]);
   seg(d,C,P,DSH);d.poly([A,B,C],INK);seg(d,go(R,u,-22),go(P,u,12),MG);[R,Qp,P].forEach(X=>pt(d,X,GO,3.5));nm(d,A,'A',g);nm(d,B,'B',g);tx(d,C[0]-2,C[1]+16,'C');tx(d,P[0],P[1]+16,'P',GO);nm(d,Qp,'Q',g,14,GO);tx(d,R[0]-4,R[1]-11,'R',GO);
   len(d,A,R,'1',[0,0],11,CC);len(d,R,B,'2',g,12,CC);return 'AR : RB = 1 : 2、BP : PC = 3 : 1';}},
 mene2:{alt:'三角形 ABC の辺 AB の中点 R、辺 BC を 2 対 1 に内分する点 P と、AP, CR の交点 O の図',h:222,f(d){const [A,B,C]=T0,R=mid(A,B),P=mid(B,C,2/3),O=cross(A,P,C,R),g=cen(T0);d.poly([O,B,C],FC);d.poly(T0,INK);seg(d,A,P,MG);seg(d,C,R);tick(d,A,R,1);tick(d,R,B,1);
   pt(d,R,IK,3);pt(d,P,IK,3);pt(d,O,GO,3.5);names(d,T0,'ABC',g);nm(d,R,'R',g,13);tx(d,P[0],P[1]+16,'P');tx(d,O[0]+13,O[1]-4,'O',GO);tx(d,mid(B,P)[0],212,'2',CC);tx(d,mid(P,C)[0],212,'1',CC);return 'AR = RB、BP : PC = 2 : 1';}},
 nitobun3:{alt:'三角形 ABC の3つの角の二等分線 AP, BQ, CR の図',h:222,f(d){const A=[120,34],B=[40,196],C=[300,196],a=260,b=dist(C,A),c=dist(A,B),P=mid(B,C,c/(b+c)),Qp=mid(C,A,a/(a+c)),R=mid(A,B,b/(a+b)),g=cen([A,B,C]);
   d.poly([A,B,C],INK);seg(d,A,P,MG);seg(d,B,Qp,MG);seg(d,C,R,MG);eq2(d,A,B,P,C,22,MK);eq2(d,B,C,Qp,A,26,MC);eq2(d,C,B,R,A,30,SUB);
   names(d,[A,B,C],'ABC',g);tx(d,P[0],P[1]+16,'P');nm(d,Qp,'Q',g,13);nm(d,R,'R',g,13);tx(d,230,212,'a',MU);len(d,mid(A,C),C,'b',g,13);len(d,mid(A,B),B,'c',g,13);return 'BC = a、CA = b、AB = c　AP, BQ, CR は角の二等分線';}},
 menseki:{alt:'三角形 ABC の内部の点 O と3頂点を結んで、3つの三角形に分けた図',h:222,f(d){const [A,B,C]=T0,O=[(4*A[0]+3*B[0]+6*C[0])/13,(4*A[1]+3*B[1]+6*C[1])/13],g=cen(T0),P=cross(A,O,B,C),Qp=cross(B,O,C,A),R=cross(C,O,A,B);
   d.poly([O,B,C],FK).poly([O,C,A],FC).poly([O,A,B],FG);d.poly(T0,INK);seg(d,A,P);seg(d,B,Qp);seg(d,C,R);pt(d,O,IK,3);names(d,T0,'ABC',g);tx(d,P[0],P[1]+16,'P');nm(d,Qp,'Q',g,13);nm(d,R,'R',g,13);
   const l=(X,Y,t)=>{const m=cen([O,X,Y]);tx(d,m[0],m[1]+5,t,IK,13);};l(B,P,'4');l(C,Qp,'3');l(A,R,'6');return '△OBC = 4、△OCA = 3、△OAB = 6';}},
 heiko:{alt:'三角形 ABC と直線 ℓ、頂点 C を通り ℓ に平行な直線 CD の図',h:226,f(d){const A=[190,34],B=[40,204],C=[210,204],R=mid(A,B,.45),P=[310,204],Qp=cross(R,P,C,A),u=un(R,P),D=cross(C,go(C,u,1),A,B),g=cen([A,B,C]);
   seg(d,C,P,DSH);d.poly([A,B,C],INK);seg(d,go(R,u,-26),go(P,u,12),MG);seg(d,C,D,CD);[R,Qp,P].forEach(X=>pt(d,X,GO,3.5));pt(d,D,CC,3.5);
   nm(d,A,'A',g);tx(d,B[0]-9,B[1]+12,'B');tx(d,C[0]-2,C[1]+17,'C');tx(d,P[0]+2,P[1]+17,'P',GO);tx(d,Qp[0]+11,Qp[1]-7,'Q',GO);tx(d,R[0]-9,R[1]-9,'R',GO);tx(d,D[0]-11,D[1]-4,'D',CC);tx(d,go(R,u,-26)[0]-3,go(R,u,-26)[1]-7,'ℓ',GO);return 'CD ∥ ℓ（D は辺 AB 上の点）';}},
 naiEx:{alt:'円に内接する四角形 ABCD と、辺 BC の延長上の点 E の図',h:222,f(d){const O=[170,104],R=86,A=pc(O,R,120),B=pc(O,R,210),C=pc(O,R,280),D=pc(O,R,0),E=go(C,un(B,C),44);d.circle(O[0],O[1],R,SUB);seg(d,C,E,DSH);d.poly([A,B,C,D],INK);
   ang(d,A,B,D,20,MG);angT(d,A,B,D,35,'75°',GO);ang(d,B,A,C,20,MC);angT(d,B,A,C,38,'100°',CC);ang(d,C,D,E,18,MK);names(d,[A,B,D],'ABD',O);tx(d,C[0]-8,C[1]+16,'C');tx(d,E[0]+9,E[1]+6,'E');return '∠BAD = 75°、∠ABC = 100°';}},
 naiEF:{alt:'円に内接する四角形 ABCD の向かい合う辺を延長して、交点 E, F を作った図',h:216,f(d){const O=[200,134],R=64,A=pc(O,R,200),B=pc(O,R,320),C=pc(O,R,90),D=pc(O,R,130),E=cross(A,B,C,D),F=cross(A,D,B,C);
   d.circle(O[0],O[1],R,SUB);seg(d,A,E);seg(d,D,E);seg(d,D,F);seg(d,C,F);d.poly([A,B,C,D],INK);ang(d,E,A,D,34,MG);angT(d,E,A,D,52,'30°',GO);ang(d,F,D,C,30,MG);angT(d,F,D,C,46,'40°',GO);ang(d,B,A,C,16,MC);angT(d,B,A,C,29,'x',CC,12);
   tx(d,A[0]-4,A[1]+16,'A');tx(d,B[0]+10,B[1]+10,'B');tx(d,C[0]+11,C[1]-2,'C');tx(d,D[0]-11,D[1]-5,'D');tx(d,E[0]-2,E[1]+16,'E');tx(d,F[0]+11,F[1]+4,'F');return '∠AED = 30°、∠DFC = 40°';}},
 suisen2:{alt:'三角形 ABC の頂点 B, C から向かいの辺に引いた垂線 BD, CE と、その交点 H の図',h:226,f(d){const A=[150,22],B=[70,204],C=[270,204],D=foot(B,C,A),E=foot(C,A,B),H=cross(B,D,C,E),g=cen([A,B,C]);
   d.poly([A,E,H,D],FG);d.poly([A,B,C],INK);seg(d,B,D);seg(d,C,E);seg(d,A,H,GD);seg(d,E,D,CD);rt(d,D,A,B,8);rt(d,E,A,C,8);pt(d,H,IK,3);names(d,[A,B,C],'ABC',g);nm(d,D,'D',g);nm(d,E,'E',g);tx(d,H[0]+2,H[1]+17,'H');return 'BD ⊥ CA、CE ⊥ AB、H は BD と CE の交点';}},
 nien:{alt:'2点 P, Q で交わる2つの円と、P を通る直線 AB、Q を通る直線 CD の図',h:240,f(d){const O1=[118,118],O2=[212,126],[P,Qp]=cc(O1,68,O2,74),w1=[Math.cos(.12),-Math.sin(.12)],w2=[Math.cos(.1),Math.sin(.1)];
   const oth=(X,w,O,R)=>{const t=lc(X,w,O,R);return go(X,w,Math.abs(t[0])>Math.abs(t[1])?t[0]:t[1]);},A=oth(P,w1,O1,68),B=oth(P,w1,O2,74),C=oth(Qp,w2,O1,68),D=oth(Qp,w2,O2,74);
   d.circle(O1[0],O1[1],68,SUB).circle(O2[0],O2[1],74,SUB);seg(d,A,B);seg(d,C,D);seg(d,P,Qp,DSH);seg(d,A,C,MG);seg(d,B,D,MG);[P,Qp].forEach(X=>pt(d,X,IK,3));
   tx(d,A[0]-10,A[1]-2,'A');tx(d,B[0]+10,B[1]-2,'B');tx(d,C[0]-10,C[1]+8,'C');tx(d,D[0]+10,D[1]+8,'D');tx(d,P[0]+3,P[1]-9,'P');tx(d,Qp[0]+3,Qp[1]+17,'Q');return 'A, C は左の円、B, D は右の円の上にある';}},
 naisetsuen:{alt:'三角形 ABC と内接円、3つの接点 D, E, F の図。頂点ごとに等しい接線の長さに同じ印がある',h:214,f(d){const [A,B,C]=tri(8,5,7,58,190,28),I=incen(A,B,C),D=foot(I,B,C),E=foot(I,C,A),F=foot(I,A,B),g=cen([A,B,C]);d.circle(I[0],I[1],dist(I,D),MC);d.poly([A,B,C],INK);
   tick(d,A,F,1,MG);tick(d,A,E,1,MG);tick(d,B,D,2,MG);tick(d,B,F,2,MG);tick(d,C,D,3,MG);tick(d,C,E,3,MG);[D,E,F].forEach(P=>pt(d,P,IK,3));names(d,[A,B,C],'ABC',g);tx(d,D[0],D[1]+16,'D');nm(d,E,'E',g,12);nm(d,F,'F',g,12);
   const l=(P,X,t)=>{const m=mid(P,X),w=un(g,m);tx(d,m[0]+w[0]*13,m[1]+w[1]*13+4,t,GO);};l(A,F,'x');l(A,E,'x');l(B,F,'y');tx(d,mid(B,D)[0],206,'y',GO);tx(d,mid(C,D)[0],206,'z',GO);l(C,E,'z');return 'AE = AF = x、BD = BF = y、CD = CE = z';}},
 setsu1:{alt:'点 A で円に接する直線 ST と、円に内接する三角形 ABC の図',h:214,f(d){const O=[170,104],R=82,A=[170,186],B=pc(O,R,40),C=pc(O,R,190);d.circle(O[0],O[1],R,SUB);d.line(26,186,314,186,INK);d.poly([A,B,C],INK);
   ang(d,A,[314,186],B,24,MG);angT(d,A,[314,186],B,41,'65°',GO);ang(d,A,[26,186],C,28,MC);angT(d,A,[26,186],C,50,'40°',CC);tx(d,A[0],A[1]+17,'A');nm(d,B,'B',O);nm(d,C,'C',O);tx(d,308,178,'T');tx(d,32,178,'S');return '∠BAT = 65°、∠CAS = 40°';}},
 setsu2:{alt:'円の外の点 P から引いた2本の接線 PA, PB と、円周上の点 C の図',h:224,f(d){const O=[100,112],R=62,P=[100+62/Math.sin(rad(20)),112],A=pc(O,R,70),B=pc(O,R,-70),C=pc(O,R,170);d.circle(O[0],O[1],R,SUB);seg(d,P,go(A,un(P,A),16));seg(d,P,go(B,un(P,B),16));d.poly([A,B,C],INK);
   ang(d,P,A,B,34,MG);tx(d,P[0]-50,P[1]+4,'40°',GO,11);ang(d,C,A,B,22,MC);angT(d,C,A,B,35,'x',CC,12);tx(d,P[0]+10,P[1]+4,'P');tx(d,A[0]+4,A[1]-10,'A');tx(d,B[0]+4,B[1]+18,'B');nm(d,C,'C',O);return 'PA, PB は接線　∠APB = 40°';}},
 chokkakuNai:{alt:'角 C が直角の三角形 ABC と、その内接円の図',h:222,f(d){const C=[120,198],B=[208,198],A=[120,33],I=[153,165],D=[153,198],E=[120,165],F=foot(I,A,B);d.poly([I,D,C,E],FG);d.circle(I[0],I[1],33,MC);d.poly([A,B,C],INK);seg(d,I,D,MG);seg(d,I,E,MG);seg(d,I,F,SUB);rt(d,D,I,B,6);rt(d,E,I,A,6);rt(d,F,I,A,6);
   pt(d,I,IK,3);tx(d,A[0]-11,A[1]+4,'A');tx(d,B[0]+11,B[1]+6,'B');tx(d,C[0]-11,C[1]+8,'C');tx(d,D[0],D[1]+16,'D');tx(d,E[0]-11,E[1]+4,'E');nm(d,F,'F',I,11);tx(d,I[0]+10,I[1]-6,'I');tx(d,186,214,'8',MU);tx(d,106,100,'15',MU);tx(d,I[0]+9,I[1]+20,'r',GO);tx(d,I[0]-16,I[1]-5,'r',GO);return '∠C = 90°、BC = 8、CA = 15';}},
 donkaku:{alt:'接線 ST と弦 AB のつくる角 BAT が鈍角である図。弧の上に点 C と C′ がある',h:216,f(d){const O=[170,104],R=82,A=[170,186],B=pc(O,R,140),C=pc(O,R,210),K=pc(O,R,30);d.circle(O[0],O[1],R,SUB);d.line(26,186,314,186,INK);seg(d,A,K,CD);seg(d,B,K,CD);d.poly([A,B,C],INK);
   ang(d,A,[314,186],B,20,MG);ang(d,C,A,B,18,MG);ang(d,A,[26,186],B,34,MC);ang(d,K,A,B,22,MC);tx(d,A[0],A[1]+17,'A');nm(d,B,'B',O);nm(d,C,'C',O);nm(d,K,'C′',O,14);tx(d,308,178,'T');tx(d,32,178,'S');return '∠BAT は鈍角。C′ は ∠BAT の内部にある弧の上、C は残りの弧の上';}},
 hobekiEx:{alt:'円の外部の点 P から引いた接線 PT と、円と交わる2本の直線 PAB, PCD の図',h:226,f(d){const u=15,R=80,P=[92,118],O=[92+Math.sqrt(36*u*u+R*R),118],a1=Math.acos(7.5*u/dist(O,P)),a2=Math.acos(6.5*u/dist(O,P)),w1=[Math.cos(a1),-Math.sin(a1)],w2=[Math.cos(a2),Math.sin(a2)];
   const A=go(P,w1,3*u),B=go(P,w1,12*u),C=go(P,w2,4*u),D=go(P,w2,9*u),T=tang(P,O,R,1);d.circle(O[0],O[1],R,SUB);seg(d,P,go(B,w1,12));seg(d,P,go(D,w2,12));seg(d,P,go(T,un(P,T),30),MG);[A,B,C,D].forEach(X=>pt(d,X,IK,3));pt(d,T,GO,3.5);
   tx(d,P[0]-10,P[1]+4,'P');tx(d,A[0]+2,A[1]+16,'A');tx(d,B[0]+11,B[1]+3,'B');tx(d,C[0]-9,C[1]+12,'C');tx(d,D[0]+9,D[1]+12,'D');tx(d,T[0]-6,T[1]-9,'T',GO);
   tx(d,mid(P,A)[0]+7,mid(P,A)[1]+13,'3',CC);tx(d,mid(A,B)[0]+5,mid(A,B)[1]+15,'9',CC);tx(d,mid(P,C)[0]-9,mid(P,C)[1]+12,'4',CC);return 'PA = 3、AB = 9、PC = 4　PT は接線';}},
 hobeki1:{alt:'左は円の内部で交わる2つの弦、右は円の外部の点から引いた接線と、円と交わる直線の図',h:200,f(d){const u=14,O1=[88,108],P1=[88-Math.sqrt(1492),108],w1=[Math.cos(rad(43.53)),-Math.sin(rad(43.53))],w2=[Math.cos(rad(79.56)),Math.sin(rad(79.56))];
   const A=go(P1,w1,-2*u),B=go(P1,w1,6*u),C=go(P1,w2,-3*u),D=go(P1,w2,4*u);d.circle(O1[0],O1[1],62,SUB);seg(d,A,B);seg(d,C,D);pt(d,P1,GO,3);
   tx(d,A[0]-8,A[1]+12,'A');tx(d,B[0]+8,B[1]-5,'B');tx(d,C[0]-3,C[1]-8,'C');tx(d,D[0]+4,D[1]+16,'D');tx(d,P1[0]-12,P1[1]+2,'P',GO);tx(d,mid(P1,A)[0]+10,mid(P1,A)[1]+5,'2',CC,11);tx(d,mid(P1,B)[0]-3,mid(P1,B)[1]-8,'6',CC,11);tx(d,mid(P1,C)[0]-8,mid(P1,C)[1]+2,'3',CC,11);
   const O2=[262,108],P2=[262-Math.sqrt(16*u*u+2500),108],w3=[Math.cos(rad(21.19)),Math.sin(rad(21.19))],E=go(P2,w3,2*u),F=go(P2,w3,8*u),T=tang(P2,O2,50,1);d.circle(O2[0],O2[1],50,SUB);seg(d,P2,go(F,w3,10));seg(d,P2,go(T,un(P2,T),24),MG);pt(d,E,IK,3);pt(d,F,IK,3);pt(d,T,GO,3);
   tx(d,P2[0]-2,P2[1]-9,'P');tx(d,E[0]-2,E[1]+16,'A');tx(d,F[0]+10,F[1]+9,'B');tx(d,T[0]-5,T[1]-9,'T',GO);tx(d,mid(P2,E)[0]-3,mid(P2,E)[1]+16,'2',CC,11);tx(d,mid(E,F)[0],mid(E,F)[1]+16,'6',CC,11);tx(d,30,24,'(1)',MU);tx(d,186,24,'(2)',MU);
   return '(1) PA = 2、PB = 6、PC = 3　(2) PA = 2、AB = 6、PT は接線';}},
 hobeki2:{alt:'半径 7 の円 O の内部の点 P を通る弦 AB と、P を通る直径 CD の図',h:224,f(d){const O=[170,112],P=[230,112],C=[254,112],D=[86,112],w=[-.5,-Math.sqrt(3)/2],B=go(P,w,96),A=go(P,w,-36);d.circle(O[0],O[1],84,SUB);seg(d,D,C,DSH);seg(d,A,B);pt(d,O,IK,2.5);pt(d,P,GO,3.5);
   tx(d,O[0],O[1]+16,'O');tx(d,P[0]-4,P[1]+17,'P',GO);nm(d,A,'A',O);nm(d,B,'B',O);tx(d,C[0]+10,C[1]+4,'C');tx(d,D[0]-10,D[1]+4,'D');tx(d,200,105,'5',CC,11);tx(d,128,105,'7',MU,11);return '半径 7、OP = 5　CD は P を通る直径';}},
 hobeki3:{alt:'円の外部の点 P から引いた接線 PT と、円と A, B で交わる直線の図',h:226,f(d){const u=15,R=80,P=[92,112],O=[92+Math.sqrt(36*u*u+R*R),112],a2=Math.acos(6.5*u/dist(O,P)),w2=[Math.cos(a2),Math.sin(a2)],A=go(P,w2,4*u),B=go(P,w2,9*u),T=tang(P,O,R,1);
   d.circle(O[0],O[1],R,SUB);seg(d,P,go(B,w2,12));seg(d,P,go(T,un(P,T),30),MG);pt(d,A,IK,3);pt(d,B,IK,3);pt(d,T,GO,3.5);tx(d,P[0]-10,P[1]+4,'P');tx(d,A[0]-9,A[1]+13,'A');tx(d,B[0]+9,B[1]+12,'B');tx(d,T[0]-6,T[1]-9,'T',GO);
   tx(d,mid(P,A)[0]-9,mid(P,A)[1]+12,'x',CC);tx(d,mid(A,B)[0]-9,mid(A,B)[1]+13,'5',CC);tx(d,mid(P,T)[0]-9,mid(P,T)[1]-7,'6',GO);return 'PA = x、AB = 5、接線の長さ PT = 6';}},
 hobeki4:{alt:'2点 A, B で交わる2つの円と、直線 AB 上の点 P から2つの円に引いた接線 PS, PT の図',h:214,f(d){const O1=[125,128],O2=[210,128],[A,B]=cc(O1,62,O2,62),P=[167.5,22],S=tang(P,O1,62,-1),T=tang(P,O2,62,1);
   d.circle(O1[0],O1[1],62,SUB).circle(O2[0],O2[1],62,SUB);seg(d,P,[167.5,B[1]+14]);seg(d,P,go(S,un(P,S),22),MG);seg(d,P,go(T,un(P,T),22),MG);[A,B].forEach(X=>pt(d,X,IK,3));pt(d,S,GO,3.5);pt(d,T,GO,3.5);
   tx(d,P[0]+10,P[1]+2,'P');tx(d,A[0]+11,A[1]+3,'A');tx(d,B[0]+11,B[1]+5,'B');tx(d,S[0]-11,S[1]-3,'S',GO);tx(d,T[0]+11,T[1]-3,'T',GO);return 'PS, PT は接線（S, T は接点）';}},
 kyotsuL:{alt:'2つの円の共通接線 AB と、中心 O′ から半径 OA に引いた垂線 O′H の図',h:226,f(d){const O=[100,140],Qc=[245,140],r=66,s=33,c=(r-s)/145,nv=[c,-Math.sqrt(1-c*c)],A=go(O,nv,r),B=go(Qc,nv,s),H=go(O,nv,r-s),e=un(A,B);
   d.poly([O,H,Qc],FG);d.circle(O[0],O[1],r,SUB).circle(Qc[0],Qc[1],s,SUB);seg(d,go(A,e,-24),go(B,e,24),MG);seg(d,O,A);seg(d,Qc,B);seg(d,O,Qc);seg(d,Qc,H,CD);rt(d,A,O,B,7);rt(d,B,Qc,A,7);rt(d,H,O,Qc,7);
   pt(d,O,IK,2.5);pt(d,Qc,IK,2.5);tx(d,O[0]-10,O[1]+8,'O');tx(d,Qc[0]+12,Qc[1]+8,'O′');tx(d,A[0]-3,A[1]-9,'A');tx(d,B[0]+4,B[1]-9,'B');tx(d,H[0]-11,H[1]+2,'H');tx(d,172,156,'d',MU);tx(d,O[0]-22,O[1]-14,'r − r′',CC,11);tx(d,Qc[0]+16,Qc[1]-14,'r′',MU,11);return '四角形 AHO′B は長方形　OH = r − r′';}},
 gaisetsu:{alt:'外接する半径 4 と半径 1 の円と、共通接線 AB の図',h:234,f(d){const u=22,O=[112,128],Qc=[222,128],nv=[.6,-.8],A=go(O,nv,88),B=go(Qc,nv,22),H=go(O,nv,66),e=un(A,B);
   d.poly([O,H,Qc],FG);d.circle(O[0],O[1],88,SUB).circle(Qc[0],Qc[1],22,SUB);seg(d,go(A,e,-24),go(B,e,30),MG);seg(d,O,A);seg(d,Qc,B);seg(d,O,Qc);seg(d,Qc,H,CD);rt(d,A,O,B,7);rt(d,B,Qc,A,6);rt(d,H,O,Qc,7);
   pt(d,O,IK,2.5);pt(d,Qc,IK,2.5);tx(d,O[0]-10,O[1]+8,'O');tx(d,Qc[0]+4,Qc[1]+16,'O′');tx(d,A[0]-3,A[1]-9,'A');tx(d,B[0]+5,B[1]-8,'B');tx(d,H[0]-11,H[1]+1,'H');tx(d,128,96,'4',MU,11);tx(d,Qc[0]+14,Qc[1]-5,'1',MU,11);return '半径 4 と 1 の円が外接している　AB は共通接線';}},
 kyotsu:{alt:'半径 7 と半径 2 の円と、2種類の共通接線の図',h:226,f(d){const O=[105,118],Qc=[274,118],n1=[5/13,-12/13],n2=[9/13,Math.sqrt(88)/13],A=go(O,n1,91),B=go(Qc,n1,26),C=go(O,n2,91),D=go(Qc,n2,-26),e1=un(A,B),e2=un(C,D);
   d.circle(O[0],O[1],91,SUB).circle(Qc[0],Qc[1],26,SUB);seg(d,go(A,e1,-20),go(B,e1,20),MG);seg(d,go(C,e2,-20),go(D,e2,20),MC);seg(d,O,Qc,DSH);[A,B].forEach(X=>pt(d,X,GO,3));[C,D].forEach(X=>pt(d,X,CC,3));pt(d,O,IK,2.5);pt(d,Qc,IK,2.5);
   tx(d,O[0]-10,O[1]+5,'O');tx(d,Qc[0]+4,Qc[1]+17,'O′');tx(d,A[0]-4,A[1]-9,'A',GO);tx(d,B[0]+6,B[1]-8,'B',GO);tx(d,C[0]-5,C[1]+17,'C',CC);tx(d,D[0]-10,D[1]-6,'D',CC);tx(d,190,132,'13',MU,11);return '半径 7 と 2、中心間の距離 13　AB, CD は共通接線';}},
 kyotsugen:{alt:'2点 A, B で交わる半径 13 と半径 15 の円と、共通弦 AB の図',h:234,f(d){const O=[96,118],Qc=[187,118],[A,B]=cc(O,84.5,Qc,97.5),M=mid(A,B);d.circle(O[0],O[1],84.5,SUB).circle(Qc[0],Qc[1],97.5,SUB);seg(d,O,Qc);seg(d,A,B,MG);seg(d,O,A);seg(d,Qc,A);rt(d,M,A,Qc,7);
   pt(d,O,IK,2.5);pt(d,Qc,IK,2.5);pt(d,A,GO,3);pt(d,B,GO,3);tx(d,O[0]-10,O[1]+5,'O');tx(d,Qc[0]+12,Qc[1]+5,'O′');tx(d,A[0]+2,A[1]-9,'A',GO);tx(d,B[0]+2,B[1]+17,'B',GO);tx(d,M[0]-10,M[1]+15,'M');tx(d,102,74,'13',MU,11);tx(d,166,72,'15',MU,11);tx(d,160,132,'14',MU,11);return '半径 13 と 15、中心間の距離 14';}},
 gaisetsu90:{alt:'点 P で外接する2つの円と、共通接線 AB、P における共通接線の図',h:226,f(d){const O=[105,140],Qc=[204,140],P=[171,140],nv=[1/3,-Math.sqrt(8)/3],A=go(O,nv,66),B=go(Qc,nv,33),M=mid(A,B),e=un(A,B);
   d.poly([A,P,B],FG);d.circle(O[0],O[1],66,SUB).circle(Qc[0],Qc[1],33,SUB);seg(d,go(A,e,-24),go(B,e,24));seg(d,[171,M[1]-16],[171,190],CD);seg(d,P,A,MG);seg(d,P,B,MG);pt(d,P,IK,3);pt(d,M,CC,3);pt(d,O,IK,2.5);pt(d,Qc,IK,2.5);
   tx(d,O[0]-10,O[1]+5,'O');tx(d,Qc[0]+12,Qc[1]+5,'O′');tx(d,A[0]-4,A[1]-9,'A');tx(d,B[0]+6,B[1]-8,'B');tx(d,P[0]+10,P[1]+15,'P');tx(d,M[0]+9,M[1]-9,'M',CC);return 'M は、P における共通接線と AB の交点';}},
 shou:{alt:'長さ 1, a, b の線分から、長さ b 分の a の線分を作図する図',h:226,f(d){const O=[40,176],w=[Math.cos(.7),-Math.sin(.7)],E=[90,176],B=[165,176],A=go(O,w,150),D=go(O,w,60);seg(d,O,[318,176],SUB);seg(d,O,go(O,w,190),SUB);
   const dim=(x2,yy,t)=>{d.line(O[0],yy,x2,yy,SUB).line(O[0],yy-3,O[0],yy+3,SUB).line(x2,yy-3,x2,yy+3,SUB);tx(d,(O[0]+x2)/2,yy+14,t,MU);};dim(E[0],188,'1');dim(B[0],206,'b');
   seg(d,B,A,MC);seg(d,E,D,MG);seg(d,O,D,HG);[O,E,B,A].forEach(X=>pt(d,X));pt(d,D,GO,3.5);tx(d,O[0]-10,O[1]+4,'O');tx(d,E[0]+8,E[1]-7,'E');tx(d,B[0]+8,B[1]-7,'B');tx(d,A[0]-10,A[1]-6,'A');tx(d,D[0]-10,D[1]-6,'D',GO);tx(d,A[0]+34,A[1]+2,'OA = a',MU,11);return 'OE = 1、OB = b、OA = a　ED ∥ BA';}},
 gaibun:{alt:'線分 AB を 3 対 1 に外分する点 Q を作図する図',h:214,f(d){const A=[40,188],B=[200,188],Qp=[280,188],w=[Math.cos(.75),-Math.sin(.75)],K=[1,2,3].map(i=>go(A,w,50*i));d.line(A[0],188,318,188,SUB);seg(d,A,B);seg(d,A,go(A,w,190),SUB);
   K.forEach((c,i)=>{d.line(c[0]+w[1]*5,c[1]-w[0]*5,c[0]-w[1]*5,c[1]+w[0]*5,INK);tx(d,c[0]-10,c[1]-8,'C'+'₁₂₃'[i],IK,11);});seg(d,K[1],B,MC);seg(d,K[2],Qp,MG);pt(d,A);pt(d,B);pt(d,Qp,GO,3.5);
   tx(d,A[0]-8,A[1]+16,'A');tx(d,B[0],B[1]+16,'B');tx(d,Qp[0],Qp[1]+16,'Q',GO);tx(d,go(A,w,190)[0]+9,go(A,w,190)[1],'X',MU);return 'AC₁ = C₁C₂ = C₂C₃、C₃Q ∥ C₂B';}},
 rootP:{alt:'線分 AC を直径とする半円と、AC 上の点 B を通る垂線が半円と交わる点 D の図',h:204,f(d){const A=[50,178],B=[100,178],C=[250,178],O=[150,178],D=[100,178-Math.sqrt(7500)];d.poly([A,B,D],FG).poly([D,B,C],FC);
   d.path(`M${A[0]},${A[1]} A100,100 0 0 1 ${C[0]},${C[1]}`,INK);seg(d,A,C);seg(d,B,D,MG);seg(d,A,D);seg(d,D,C);rt(d,B,C,D,7);rt(d,D,A,C,7);[A,B,C,O].forEach(X=>pt(d,X,IK,2.8));pt(d,D,GO,3.5);
   tx(d,A[0]-9,A[1]+15,'A');tx(d,B[0],B[1]+16,'B');tx(d,C[0]+9,C[1]+15,'C');tx(d,O[0],O[1]+16,'O',MU);tx(d,D[0]-4,D[1]-9,'D',GO);return 'AC は直径、DB ⊥ AC';}},
 gokaku:{alt:'1辺の長さが 1 の正五角形 ABCDE と、対角線 AC, BE、その交点 F の図',h:226,f(d){const O=[170,120],R=92,V=[90,162,234,306,18].map(a=>pc(O,R,a)),[A,B,C,D,E]=V,F=cross(A,C,B,E);d.poly([A,B,E],FG);d.poly(V,INK);seg(d,A,C,MC);seg(d,B,E,MG);pt(d,F,IK,3);
   names(d,V,'ABCDE',O);tx(d,F[0]-4,F[1]+17,'F');len(d,A,B,'1',O,12);len(d,A,E,'1',O,12);tx(d,mid(F,E)[0]+8,mid(F,E)[1]-7,'x',GO,13);return '1辺の長さ 1 の正五角形　対角線の長さ BE = x';}},
 cubeQ:{alt:'立方体 ABCD-EFGH の見取図',h:250,f(d){const k=cube();cubeDraw(d,k);cubeNames(d,k);return '立方体 ABCD-EFGH';}},
 sansui:{alt:'平面 α の外の点 P から α に引いた垂線 PO、O から α 上の直線 ℓ に引いた垂線 OH、ℓ 上の点 A の図',h:240,f(d){const q=(x,y)=>[40+x+.45*y,214-.5*y],O=q(80,50),P=[O[0],40],H=q(150,50),A=q(150,122),L1=q(150,4),L2=q(150,128);
   d.poly([q(0,0),q(200,0),q(200,130),q(0,130)],'fill="var(--c)" fill-opacity=".1" stroke="var(--muted)" stroke-width="1.2"');seg(d,L1,L2);seg(d,P,O);seg(d,O,H);seg(d,P,H,MG);seg(d,P,A,MC);rt(d,O,P,H,7);rt(d,H,O,A,7);[P,O,H,A].forEach(X=>pt(d,X));
   tx(d,P[0]-10,P[1]+2,'P');tx(d,O[0]-10,O[1]+10,'O');tx(d,H[0]+10,H[1]+13,'H');tx(d,A[0]+11,A[1]+4,'A');tx(d,L2[0]+8,L2[1]-6,'ℓ',MU);tx(d,58,208,'α',MU);tx(d,O[0]-9,mid(P,O)[1],'4',CC,11);tx(d,mid(O,H)[0],O[1]+15,'3',CC,11);tx(d,mid(H,A)[0]+12,mid(H,A)[1]+8,'12',CC,11);return 'PO ⊥ α、OH ⊥ ℓ　PO = 4、OH = 3、HA = 12';}},
 shimentai:{alt:'正四面体 ABCD と、辺 CD の中点 M の図',h:240,f(d){const A=[165,26],B=[60,176],C=[160,218],D=[280,166],M=mid(C,D);d.poly([A,B,M],FG);seg(d,B,D,DSH);seg(d,B,M,GD);seg(d,A,M,MG);d.poly([A,B,C],INK);seg(d,A,D);seg(d,C,D);tick(d,C,M,1);tick(d,M,D,1);pt(d,M,GO,3.5);
   tx(d,A[0],A[1]-8,'A');tx(d,B[0]-10,B[1]+5,'B');tx(d,C[0]-4,C[1]+16,'C');tx(d,D[0]+10,D[1]+5,'D');tx(d,M[0]+6,M[1]+16,'M',GO);return '正四面体 ABCD　M は辺 CD の中点';}}
};
FIGS.hazukei_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){const d=draw(),r=q.f(d);return {svg:d.out(),read:r};}});};
})();
