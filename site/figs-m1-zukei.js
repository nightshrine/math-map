/* 中学1年「平面図形・空間図形」の図。前半：平面図形（FIGS.m1zukei_h_*）、後半：空間図形（FIGS.m1zukei_k_*）
   系統の色 var(--c) は var(--ok) と同じ緑なので、塗り分けは var(--c) と var(--gold) で行う */
(function(){
const {draw,n,mk}=FIG;
const f=v=>v.toFixed(1);
const INK='stroke="var(--ink)" stroke-width="1.6" fill="none" stroke-linejoin="round"';
const SUB='stroke="var(--muted)" stroke-width="1.2" fill="none"';
const DSH='stroke="var(--muted)" stroke-width="1.2" fill="none" stroke-dasharray="4 4"';
const HG='stroke="var(--gold)" stroke-width="2.8" fill="none" stroke-linecap="round"';
const HC='stroke="var(--c)" stroke-width="2.8" fill="none" stroke-linecap="round"';
const MG='stroke="var(--gold)" stroke-width="1.8" fill="none"';
const MC='stroke="var(--c)" stroke-width="1.8" fill="none"';
const FC='fill="var(--c)" fill-opacity=".24" stroke="var(--c)" stroke-width="1.4" stroke-linejoin="round"';
const FG='fill="var(--gold)" fill-opacity=".24" stroke="var(--gold)" stroke-width="1.4" stroke-linejoin="round"';
const un=(P,Q)=>{const x=Q[0]-P[0],y=Q[1]-P[1],l=Math.hypot(x,y)||1;return [x/l,y/l];};
const mid=(P,Q,t=.5)=>[P[0]+(Q[0]-P[0])*t,P[1]+(Q[1]-P[1])*t];
const dist=(P,Q)=>Math.hypot(P[0]-Q[0],P[1]-Q[1]);
// 円周上の点（角度は度。右向きが 0、反時計回りが正）
const pc=(O,R,a)=>[O[0]+R*Math.cos(a*Math.PI/180),O[1]-R*Math.sin(a*Math.PI/180)];
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
const seg=(d,P,Q,st=INK)=>d.line(P[0],P[1],Q[0],Q[1],st);
// 直線 PQ を両側に k だけのばして描く
const ext=(d,P,Q,k,st=INK)=>{const u=un(P,Q);return d.line(P[0]-u[0]*k,P[1]-u[1]*k,Q[0]+u[0]*k,Q[1]+u[1]*k,st);};
const rt=(d,P,Q,R,s=8,st=SUB)=>{const u=un(P,Q),w=un(P,R);return d.path(`M${f(P[0]+u[0]*s)},${f(P[1]+u[1]*s)} L${f(P[0]+(u[0]+w[0])*s)},${f(P[1]+(u[1]+w[1])*s)} L${f(P[0]+w[0]*s)},${f(P[1]+w[1]*s)}`,st);};
const tick=(d,P,Q,k=1,st=SUB)=>{const m=mid(P,Q),u=un(P,Q);for(let i=0;i<k;i++){const o=(i-(k-1)/2)*4,x=m[0]+u[0]*o,y=m[1]+u[1]*o;d.line(x-u[1]*5,y+u[0]*5,x+u[1]*5,y-u[0]*5,st);}return d;};
// 円弧：中心 O、半径 R、角度 a0 から a1 へ反時計回り
const arc=(d,O,R,a0,a1,st)=>{const P=pc(O,R,a0),Q=pc(O,R,a1);let s=a1-a0;while(s<0)s+=360;return d.path(`M${f(P[0])},${f(P[1])} A${R},${R} 0 ${s>180?1:0} 0 ${f(Q[0])},${f(Q[1])}`,st);};
// おうぎ形の path（中心 O、半径 R、a0 から a1 へ反時計回り）
const fan=(O,R,a0,a1)=>{const P=pc(O,R,a0),Q=pc(O,R,a1);return `M${f(O[0])},${f(O[1])} L${f(P[0])},${f(P[1])} A${f(R)},${f(R)} 0 ${a1-a0>180?1:0} 0 ${f(Q[0])},${f(Q[1])} Z`;};
const STEP=(k=4)=>({sliders:[{k:'s',label:'手順',min:1,max:k,step:1,v:1}],play:{k:'s',from:1,to:k,label:'順に見る',ms:1200*k}});
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
// 分数 p/q を約分して表示
const fr=(p,q)=>{const g=gcd(p,q)||1;p/=g;q/=g;return q===1?String(p):`${p}/${q}`;};
// 分数 × π の表示：2π、15/2 π
const pi=(p,q=1)=>{const s=fr(p,q);return s==='1'?'π':s.includes('/')?s+' π':s+'π';};

/* ---- 点と直線との距離 ---- */
FIGS.m1zukei_h_kyori=host=>mk(host,{alt:'直線上の点 Q を動かして、点 P からの距離がいちばん短くなる位置をさがす図',h:230,
  sliders:[{k:'t',label:'点 Q の位置（H から右が +）',min:-130,max:130,step:5,v:90,fmt:t=>n(t/20)}],play:{k:'t',from:130,to:0,label:'Q を H に近づける',ms:3200},
  draw(v){const d=draw(),P=[170,46],H=[170,186],Q=[170+v.t,186],len=dist(P,Q)/20;
    d.line(20,186,320,186,INK);tx(d,318,204,'ℓ','var(--muted)',12);
    seg(d,P,H,DSH);rt(d,H,P,[300,186],8);seg(d,P,Q,HG);
    d.dot(P[0],P[1],'var(--ink)',4);d.dot(H[0],H[1],'var(--ink)',3);d.dot(Q[0],Q[1],'var(--gold)',4.5);
    tx(d,P[0],P[1]-10,'P');tx(d,H[0]-(Math.abs(v.t)<26?0:0),H[1]+18,'H');if(Math.abs(v.t)>=20)tx(d,Q[0],Q[1]+18,'Q','var(--gold)');
    const m=mid(P,Q);tx(d,m[0]+(v.t>=0?16:-16),m[1]-4,n(len,2),'var(--gold)',12);if(v.t!==0)tx(d,160,120,'7','var(--muted)',11,'end');
    return {svg:d.out(),read:`PQ = <b>${n(len,2)} cm</b>`+(v.t===0?'<br>PQ ⊥ ℓ のとき、いちばん短い<br>この長さ 7 cm が、<b>点 P と直線 ℓ との距離</b>':'<br>PH = 7 cm（PH ⊥ ℓ）<br>Q を H に近づけるほど、PQ は短くなる')};}});

/* ---- 図形の移動 ---- */
const T0=[[60,170],[120,170],[60,100]];
const IDO=[t=>T0.map(p=>[p[0]+1.5*t,p[1]-.5*t]),
  t=>{const a=1.8*t*Math.PI/180,O=[170,140];return T0.map(p=>{const x=p[0]-O[0],y=p[1]-O[1];return [O[0]+x*Math.cos(a)-y*Math.sin(a),O[1]+x*Math.sin(a)+y*Math.cos(a)];});},
  t=>{const L=130+.6*t;return T0.map(p=>[2*L-p[0],p[1]]);}];
FIGS.m1zukei_h_ido=host=>mk(host,{alt:'三角形 ABC を平行移動、回転移動、対称移動した図',
  sliders:[{k:'m',label:'移動の種類',min:1,max:3,step:1,v:1,fmt:m=>['平行移動','回転移動','対称移動'][m-1]},{k:'t',label:'動かす量',min:0,max:100,step:5,v:60,fmt:t=>t+' %'}],play:{k:'t',from:0,to:100,label:'動かす',ms:3200},
  draw(v){const d=draw(),m=v.m,t=v.t,T=IDO[m-1](t),O=[170,140];let read;
    if(m===3){const L=130+.6*t;d.line(L,16,L,236,'stroke="var(--ink)" stroke-width="1.4" stroke-dasharray="8 3 2 3"');tx(d,L+9,28,'ℓ','var(--muted)',12);}
    if(m===2){d.dot(O[0],O[1],'var(--ink)',3.5);tx(d,O[0]+2,O[1]+17,'O');seg(d,O,T0[0],SUB);seg(d,O,T[0],SUB);
      if(t>0){const a0=Math.atan2(O[1]-T0[0][1],T0[0][0]-O[0])*180/Math.PI;arc(d,O,22,a0-1.8*t,a0,MG);}}
    d.poly(T0,FC);d.poly(T,FG);
    if(m!==2||t===0)T0.forEach((p,i)=>seg(d,p,T[i],DSH));
    if(m===3)T0.forEach((p,i)=>{const q=mid(p,T[i]);if(i!==0)d.dot(q[0],q[1],'var(--muted)',2);});
    ['A','B','C'].forEach((s,i)=>{const g=[(T0[0][0]+T0[1][0]+T0[2][0])/3,(T0[0][1]+T0[1][1]+T0[2][1])/3],u=un(g,T0[i]);tx(d,T0[i][0]+u[0]*12,T0[i][1]+u[1]*12+4,s,'var(--c)');
      const g2=[(T[0][0]+T[1][0]+T[2][0])/3,(T[0][1]+T[1][1]+T[2][1])/3],w=un(g2,T[i]);if(t>0)tx(d,T[i][0]+w[0]*13,T[i][1]+w[1]*13+4,s+'′','var(--gold)');});
    if(m===1)read=`<b>平行移動</b>：一定の方向に、一定の距離だけ動かす<br>AA′ = BB′ = CC′ = ${n(dist(T0[0],T[0])/10,1)}（目もり 1 = 10）<br>AA′ ∥ BB′ ∥ CC′`;
    else if(m===2)read=`<b>回転移動</b>：点 O を中心に ${n(1.8*t)}° 回す<br>∠AOA′ = ∠BOB′ = ∠COC′ = ${n(1.8*t)}°<br>OA = OA′、OB = OB′、OC = OC′`+(t===100?'<br>180° の回転移動を、<b>点対称移動</b>という':'');
    else read=`<b>対称移動</b>：直線 ℓ を折り目として折り返す<br>ℓ は、線分 AA′, BB′, CC′ に垂直<br>A から ℓ まで ${n((130+.6*t-60)/10,1)}、ℓ から A′ まで ${n((130+.6*t-60)/10,1)}`;
    return {svg:d.out(),read};}});

/* ---- 基本の作図（arg：nitobun / kaku / suisen1 / suisen2） ---- */
const SK={
 nitobun:{alt:'線分 AB の垂直二等分線を作図する手順の図',f(d,s){const A=[90,130],B=[250,130],P=[170,54.5],Q=[170,205.5],M=[170,130];
   if(s>=5)d.poly([A,P,B,Q],FC);seg(d,A,B);
   if(s>=2){arc(d,A,110,28,58,s===2?MG:SUB);arc(d,A,110,-58,-28,s===2?MG:SUB);}
   if(s>=3){arc(d,B,110,122,152,s===3?MG:SUB);arc(d,B,110,208,238,s===3?MG:SUB);d.dot(P[0],P[1],'var(--ink)',3).dot(Q[0],Q[1],'var(--ink)',3);tx(d,P[0]+12,P[1]-4,'P');tx(d,Q[0]+12,Q[1]+12,'Q');}
   if(s>=4){ext(d,P,Q,24,HG);rt(d,M,B,P,8);tick(d,A,M,2);tick(d,M,B,2);tx(d,M[0]+11,M[1]+16,'M');}
   if(s>=5)[[A,P],[P,B],[B,Q],[Q,A]].forEach(e=>tick(d,e[0],e[1],1,MC));
   d.dot(A[0],A[1],'var(--ink)',3).dot(B[0],B[1],'var(--ink)',3);tx(d,A[0]-11,A[1]+5,'A');tx(d,B[0]+11,B[1]+5,'B');
   return ['線分 AB の垂直二等分線を作図する','点 A を中心として、AB の半分より大きい半径の円をかく','点 B を中心として、同じ半径の円をかく<br>2 つの円の交点を P, Q とする','直線 PQ をひく<br><b>直線 PQ が、線分 AB の垂直二等分線</b>。AM = BM','理由：AP = BP = AQ = BQ なので、四角形 APBQ はひし形<br>直線 PQ はその対称の軸。折ると A と B が重なる'][s-1];}},
 kaku:{alt:'角 XOY の二等分線を作図する手順の図',f(d,s){const O=[60,190],X=[310,190],Y=pc(O,220,50),A=[160,190],B=pc(O,100,50),P=pc(O,170.1,25);
   if(s>=5)d.poly([O,A,P,B],FC);seg(d,O,X);seg(d,O,Y);
   if(s>=2){arc(d,O,100,-8,58,s===2?MG:SUB);d.dot(A[0],A[1],'var(--ink)',3).dot(B[0],B[1],'var(--ink)',3);tx(d,A[0]+4,A[1]+17,'A');tx(d,B[0]-12,B[1]-3,'B');}
   if(s>=3){arc(d,A,90,38,68,s===3?MG:SUB);arc(d,B,90,-18,12,s===3?MG:SUB);d.dot(P[0],P[1],'var(--ink)',3);tx(d,P[0]+12,P[1]-5,'P');}
   if(s>=4){seg(d,O,pc(O,262,25),HG);d.angle(O[0],O[1],34,0,25,MG);d.angle(O[0],O[1],40,25,50,MG);}
   if(s>=5){tick(d,O,A,1,MC);tick(d,O,B,1,MC);tick(d,A,P,2,MC);tick(d,B,P,2,MC);}
   tx(d,O[0]-11,O[1]+6,'O');tx(d,X[0]+8,X[1]+5,'X');tx(d,Y[0]+10,Y[1]+2,'Y');
   return ['∠XOY の二等分線を作図する','点 O を中心とする円をかき、辺 OX, OY との交点を A, B とする','2 点 A, B を中心として、等しい半径の円をかく<br>その交点を P とする','半直線 OP をひく<br><b>半直線 OP が、∠XOY の二等分線</b>。∠XOP = ∠YOP','理由：OA = OB、AP = BP なので、四角形 OAPB は直線 OP を<br>対称の軸とする線対称な図形。折ると OA と OB が重なる'][s-1];}},
 suisen1:{alt:'直線 ℓ 上の点 P を通る垂線を作図する手順の図',f(d,s){const P=[170,150],A=[100,150],B=[240,150],Q=[170,65.1];
   if(s>=5)d.poly([Q,A,B],FC);d.line(26,150,314,150,INK);tx(d,316,168,'ℓ','var(--muted)');
   if(s>=2){arc(d,P,70,165,195,s===2?MG:SUB);arc(d,P,70,-15,15,s===2?MG:SUB);d.dot(A[0],A[1],'var(--ink)',3).dot(B[0],B[1],'var(--ink)',3);tx(d,A[0]-2,A[1]+18,'A');tx(d,B[0]+2,B[1]+18,'B');}
   if(s>=3){arc(d,A,110,36,65,s===3?MG:SUB);arc(d,B,110,115,144,s===3?MG:SUB);d.dot(Q[0],Q[1],'var(--ink)',3);tx(d,Q[0]+12,Q[1]-3,'Q');}
   if(s>=4){d.line(170,30,170,226,HG);rt(d,P,B,Q,8);}
   if(s>=5){tick(d,A,P,2,MC);tick(d,P,B,2,MC);tick(d,A,Q,1,MC);tick(d,B,Q,1,MC);}
   d.dot(P[0],P[1],'var(--ink)',3.5);tx(d,P[0]+11,P[1]+17,'P');
   return ['直線 ℓ 上の点 P を通る、ℓ の垂線を作図する','点 P を中心とする円をかき、ℓ との交点を A, B とする','2 点 A, B を中心として、等しい半径の円をかく<br>その交点を Q とする','直線 PQ をひく<br><b>直線 PQ が、P を通る ℓ の垂線</b>','理由：AP = BP、AQ = BQ なので、直線 PQ は<br>線分 AB の垂直二等分線。180° の角 APB の二等分線でもある'][s-1];}},
 suisen2:{alt:'直線 ℓ 上にない点 P を通る垂線を作図する手順の図',f(d,s){const P=[170,56],A=[86.9,156],B=[253.1,156],Q=[170,211.6],H=[170,156];
   if(s>=5)d.poly([P,A,Q,B],FC);d.line(26,156,314,156,INK);tx(d,316,174,'ℓ','var(--muted)');
   if(s>=2){arc(d,P,130,216,244,s===2?MG:SUB);arc(d,P,130,296,324,s===2?MG:SUB);d.dot(A[0],A[1],'var(--ink)',3).dot(B[0],B[1],'var(--ink)',3);tx(d,A[0]-12,A[1]-7,'A');tx(d,B[0]+12,B[1]-7,'B');}
   if(s>=3){arc(d,A,100,-48,-19,s===3?MG:SUB);arc(d,B,100,199,228,s===3?MG:SUB);d.dot(Q[0],Q[1],'var(--ink)',3);tx(d,Q[0]+12,Q[1]+11,'Q');}
   if(s>=4){d.line(170,30,170,238,HG);rt(d,H,B,P,8);tx(d,H[0]+11,H[1]+16,'H');}
   if(s>=5){tick(d,P,A,1,MC);tick(d,P,B,1,MC);tick(d,A,Q,2,MC);tick(d,B,Q,2,MC);}
   d.dot(P[0],P[1],'var(--ink)',3.5);tx(d,P[0]+12,P[1]-4,'P');
   return ['直線 ℓ 上にない点 P を通る、ℓ の垂線を作図する','点 P を中心として、ℓ と 2 点で交わる円をかく<br>交点を A, B とする','2 点 A, B を中心として、等しい半径の円をかく<br>その交点の 1 つを Q とする','直線 PQ をひく<br><b>直線 PQ が、P を通る ℓ の垂線</b>。交点が H','理由：PA = PB、QA = QB なので、四角形 PAQB は直線 PQ を<br>対称の軸とする線対称な図形。だから PQ ⊥ AB'][s-1];}}};
FIGS.m1zukei_h_sakuzu=(host,arg)=>{const S=SK[arg]||SK.nitobun;mk(host,Object.assign(STEP(5),{alt:S.alt,draw(v){const d=draw(),r=S.f(d,v.s);return {svg:d.out(),read:`<b>手順 ${v.s}</b>　${r}`};}}));};

/* ---- 最短の道：対称移動を使う ---- */
FIGS.m1zukei_h_saitan=host=>mk(host,{alt:'点 A から直線 ℓ 上の点 P に寄って点 B へ行く道のりを、P を動かして調べる図',
  sliders:[{k:'p',label:'点 P の位置',min:40,max:300,step:2.5,v:100,fmt:p=>n(p-40)}],play:{k:'p',from:40,to:182.5,label:'P を右へ動かす',ms:3600},
  draw(v){const d=draw(),A=[70,62],B=[250,102],B2=[250,222],P=[v.p,162],ap=dist(A,P),pb=dist(P,B),best=Math.abs(v.p-182.5)<.01;
    d.poly([[14,162],[326,162],[326,176],[14,176]],'fill="var(--c)" fill-opacity=".16" stroke="none"');d.line(14,162,326,162,INK);tx(d,318,155,'ℓ','var(--muted)');
    seg(d,B,B2,DSH);rt(d,[250,162],B,[300,162],7);seg(d,P,B2,DSH);
    if(best)seg(d,A,B2,'stroke="var(--c)" stroke-width="1.4" fill="none" stroke-dasharray="2 4"');
    seg(d,A,P,HG);seg(d,P,B,HG);
    d.dot(A[0],A[1],'var(--ink)',4).dot(B[0],B[1],'var(--ink)',4).dot(B2[0],B2[1],'var(--muted)',3.5).dot(P[0],P[1],'var(--gold)',4.5);
    tx(d,A[0]-12,A[1]-4,'A');tx(d,B[0]+12,B[1]-4,'B');tx(d,B2[0]+14,B2[1]+5,'B′','var(--muted)');tx(d,P[0],P[1]+31,'P','var(--gold)');
    return {svg:d.out(),read:`AP + PB = ${n(ap,1)} + ${n(pb,1)} = <b>${n(ap+pb,1)}</b><br>B′ は、ℓ について B と対称な点。PB = PB′<br>`+(best?'A, P, B′ が一直線に並んだ。<b>このとき最短</b>（240.8）':'A, P, B′ が一直線に並ぶとき、いちばん短い（240.8）')};}});
FIGS.m1zukei_h_saitan.sim=p=>dist([70,62],[p,162])+dist([p,162],[250,102]);

/* ---- 60° と 30° の角の作図 ---- */
FIGS.m1zukei_h_kakusaku=host=>mk(host,Object.assign(STEP(5),{alt:'正三角形を使って 60 度の角を作図し、それを二等分して 30 度の角を作る手順の図',h:230,
  draw(v){const s=v.s,d=draw(),O=[80,190],A=[240,190],B=[160,51.4],P=pc(O,179.7,30);
    if(s>=3&&s<5)d.poly([O,A,B],FC);d.line(O[0],O[1],300,190,INK);
    if(s>=2){arc(d,O,160,46,74,s===2?MG:SUB);arc(d,A,160,106,134,s===2?MG:SUB);d.dot(B[0],B[1],'var(--ink)',3);tx(d,B[0]-2,B[1]-10,'B');}
    if(s>=3){seg(d,O,B);if(s===3)seg(d,A,B,SUB);d.angle(O[0],O[1],26,0,60,MC);if(s<5)tx(d,O[0]+40,O[1]-16,'60°','var(--c)',11);}
    if(s>=4){arc(d,A,90,78,108,s===4?MG:SUB);arc(d,B,90,-48,-18,s===4?MG:SUB);d.dot(P[0],P[1],'var(--ink)',3);tx(d,P[0]+8,P[1]+19,'P');}
    if(s>=5){seg(d,O,pc(O,236,30),HG);d.angle(O[0],O[1],46,0,30,MG);tx(d,O[0]+66,O[1]-10,'30°','var(--gold)',11);tx(d,O[0]+48,O[1]-44,'30°','var(--gold)',11);}
    d.dot(O[0],O[1],'var(--ink)',3).dot(A[0],A[1],'var(--ink)',3);tx(d,O[0]-11,O[1]+6,'O');tx(d,A[0]+2,A[1]+18,'A');
    return {svg:d.out(),read:['<b>手順 1</b>　半直線 OA をひく','<b>手順 2</b>　2 点 O, A を中心として、半径 OA の円をかく<br>その交点を B とする','<b>手順 3</b>　OA = OB = AB なので、△OAB は正三角形<br><b>∠AOB = 60°</b>','<b>手順 4</b>　∠AOB の二等分線を作図する<br>A, B を中心に等しい半径の円をかき、交点を P とする','<b>手順 5</b>　半直線 OP をひく<br><b>∠AOP = 30°</b>（60° の半分）'][s-1]};}}));

/* ---- 3 点から等しい距離にある点 ---- */
FIGS.m1zukei_h_gaishin=host=>mk(host,Object.assign(STEP(4),{alt:'三角形 ABC の 2 辺の垂直二等分線の交点が、3 つの頂点から等しい距離にあることを示す図',
  draw(v){const s=v.s,d=draw(),A=[110,50],B=[70,170],C=[260,170],O=[165,135],M=mid(A,B),N=mid(B,C);
    if(s>=4)d.circle(O[0],O[1],dist(O,B),MC);
    d.poly([A,B,C],INK);
    if(s>=2){ext(d,M,O,58,MG);rt(d,M,A,O,7);tick(d,A,M,1);tick(d,M,B,1);}
    if(s>=3){d.line(165,22,165,226,MG);rt(d,N,C,O,7);tick(d,B,N,2);tick(d,N,C,2);d.dot(O[0],O[1],'var(--gold)',4);tx(d,O[0]+12,O[1]-6,'O','var(--gold)');}
    if(s>=4)[A,B,C].forEach(p=>seg(d,O,p,'stroke="var(--c)" stroke-width="1.4" fill="none" stroke-dasharray="3 3"'));
    tx(d,A[0]-8,A[1]-8,'A');tx(d,B[0]-11,B[1]+12,'B');tx(d,C[0]+11,C[1]+12,'C');
    return {svg:d.out(),read:['<b>手順 1</b>　3 点 A, B, C から等しい距離にある点をさがす','<b>手順 2</b>　線分 AB の垂直二等分線をひく<br>この直線上の点は、A と B から等しい距離にある','<b>手順 3</b>　線分 BC の垂直二等分線をひく<br>2 本の交点を O とする。OA = OB、OB = OC','<b>手順 4</b>　OA = OB = OC<br>O を中心に半径 OA の円をかくと、<b>3 点 A, B, C を通る</b>'][s-1]};}}));

/* ---- 弧・弦・中心角 ---- */
FIGS.m1zukei_h_en=host=>mk(host,{alt:'円の弧 AB、弦 AB と、弧 AB に対する中心角の図',
  sliders:[{k:'a',label:'中心角 ∠AOB（度）',min:20,max:340,step:10,v:100}],play:{k:'a',from:20,to:340,label:'中心角を大きくする',ms:3600},
  draw(v){const d=draw(),a=v.a,O=[170,122],R=96,A=pc(O,R,-90-a/2),B=pc(O,R,-90+a/2);
    d.path(fan(O,R,-90-a/2,-90+a/2),'fill="var(--c)" fill-opacity=".14" stroke="none"');d.circle(O[0],O[1],R,SUB);arc(d,O,R,-90-a/2,-90+a/2,HC);
    seg(d,O,A);seg(d,O,B);seg(d,A,B,HG);d.angle(O[0],O[1],18,-90-a/2,-90+a/2,MC);d.dot(O[0],O[1],'var(--ink)',3);
    tx(d,O[0],O[1]-10,'O');const ua=un(O,A),ub=un(O,B);tx(d,A[0]+ua[0]*13,A[1]+ua[1]*13+4,'A');tx(d,B[0]+ub[0]*13,B[1]+ub[1]*13+4,'B');
    tx(d,O[0],O[1]+(a>=180?-28:42),a+'°','var(--c)',11);
    return {svg:d.out(),read:`弧 AB（緑の太い線）に対する中心角 ∠AOB = <b>${a}°</b><br>弧 AB の長さは、円周の ${fr(a,360)}<br><b>弦 AB</b>（金色）の長さは、半径の ${n(2*Math.sin(a*Math.PI/360),2)} 倍`+(a===180?'<br>中心を通る弦は直径。いちばん長い弦':'')};}});

/* ---- 円と直線：接する ---- */
FIGS.m1zukei_h_sessen=host=>mk(host,{alt:'円の中心から直線までの距離を変えて、円と直線が交わる、接する、離れるようすを示す図',h:230,
  sliders:[{k:'k',label:'中心 O と直線 ℓ との距離',min:0,max:11,step:.5,v:4}],play:{k:'k',from:0,to:11,label:'直線を遠ざける',ms:3600},
  draw(v){const d=draw(),k=v.k,O=[140,115],R=70,x=O[0]+k*10,H=[x,115];
    d.circle(O[0],O[1],R,INK);d.line(x,16,x,214,k===7?HG:HC);tx(d,x+9,28,'ℓ','var(--muted)');
    if(k>0){seg(d,O,H,MG);if(k>=1.5)rt(d,H,O,[x,60],7);}
    if(k<7){const y=Math.sqrt(R*R-k*k*100);d.dot(x,O[1]-y,'var(--gold)',4).dot(x,O[1]+y,'var(--gold)',4);}
    d.dot(O[0],O[1],'var(--ink)',3);tx(d,O[0]-10,O[1]+5,'O');if(k>0){d.dot(H[0],H[1],k===7?'var(--gold)':'var(--ink)',k===7?4.5:3);tx(d,H[0]+11,H[1]+16,'H');}
    return {svg:d.out(),read:`中心 O と直線 ℓ との距離 OH = ${n(k)}、半径 = 7<br>`+(k<7?'距離が半径より小さい：ℓ は円と 2 点で交わる':k===7?'距離が半径に等しい：ℓ は円と 1 点だけを共有する<br><b>ℓ は円 O に接する</b>。ℓ が接線、H が接点<br>接線は、接点を通る半径に垂直（OH ⊥ ℓ）':'距離が半径より大きい：ℓ は円と交わらない')};}});

/* ---- おうぎ形の弧の長さと面積 ---- */
FIGS.m1zukei_h_ogi=host=>mk(host,{alt:'おうぎ形の中心角と半径を変えて、弧の長さと面積を求める図',
  sliders:[{k:'a',label:'中心角（度）',min:15,max:360,step:15,v:60},{k:'r',label:'半径（cm）',min:2,max:6,step:1,v:6}],play:{k:'a',from:15,to:360,label:'中心角を大きくする',ms:4000},
  draw(v){const d=draw(),a=v.a,r=v.r,O=[170,130],R=r*18;
    d.circle(O[0],O[1],R,DSH);
    if(a===360)d.circle(O[0],O[1],R,'fill="var(--c)" fill-opacity=".26" stroke="var(--gold)" stroke-width="2.8"');
    else{d.path(fan(O,R,90-a/2,90+a/2),'fill="var(--c)" fill-opacity=".26" stroke="var(--ink)" stroke-width="1.4" stroke-linejoin="round"');arc(d,O,R,90-a/2,90+a/2,HG);d.angle(O[0],O[1],14,90-a/2,90+a/2,MC);}
    d.dot(O[0],O[1],'var(--ink)',2.5);tx(d,O[0],O[1]+(a>180?-10:20),a+'°','var(--c)',11);
    return {svg:d.out(),read:`半径 ${r} cm、中心角 ${a}°（円全体の ${fr(a,360)}）<br>弧の長さ = 2π × ${r} × ${fr(a,360)} = <b>${pi(2*r*a,360)}</b>（cm）<br>面積 = π × ${r}² × ${fr(a,360)} = <b>${pi(r*r*a,360)}</b>（cm²）<br>弧の長さも面積も、中心角に比例する`};}});
FIGS.m1zukei_h_ogi.sim=(a,r)=>[pi(2*r*a,360),pi(r*r*a,360)];

/* ---- なぜ：円（おうぎ形）を等分して並べ替える（arg：はじめの中心角） ---- */
FIGS.m1zukei_h_narabe=(host,arg)=>mk(host,{alt:'円やおうぎ形を等分して、たがいちがいに並べ替えると長方形に近づくことを示す図',h:230,
  sliders:[{k:'i',label:'等分する数',min:0,max:4,step:1,v:1,fmt:i=>String(4*Math.pow(2,i))},{k:'a',label:'中心角（度）',min:90,max:360,step:30,v:arg||360}],play:{k:'i',from:0,to:4,label:'細かく分けていく',ms:4200},
  draw(v){const d=draw(),N=4*Math.pow(2,v.i),a=v.a,r=46,dl=a/N,O=[62,a>180?112:136],x0=132,yb=140,w=2*r*Math.sin(dl*Math.PI/360),hh=r*Math.cos(dl*Math.PI/360),W=N/2*w;
    const st=k=>`fill="var(--${k%2?'gold':'c'})" fill-opacity=".34" stroke="var(--${k%2?'gold':'c'})" stroke-width="${N>16?.5:1}" stroke-linejoin="round"`;
    for(let k=0;k<N;k++){const a1=90+a/2-k*dl;d.path(fan(O,r,a1-dl,a1),st(k));
      if(k%2===0)d.path(fan([x0+w/2+(k/2)*w,yb],r,90-dl/2,90+dl/2),st(k));else d.path(fan([x0+w+((k-1)/2)*w,yb-hh],r,270-dl/2,270+dl/2),st(k));}
    tx(d,O[0],206,a===360?'半径 r の円':`中心角 ${a}°`,'var(--muted)',10);
    d.path(`M${f(x0+w/4)},${yb+12} L${f(x0+w/4)},${yb+17} L${f(x0+w/4+W)},${yb+17} L${f(x0+w/4+W)},${yb+12}`,SUB);tx(d,x0+w/4+W/2,yb+33,a===360?'横：円周の半分 πr に近づく':'横：弧の長さの半分 ℓ/2 に近づく','var(--ink)',10);
    tx(d,x0+w/4+W/2,yb-hh-18,'縦：半径 r に近づく','var(--ink)',10);
    return {svg:d.out(),read:(a===360?`円を ${N} 等分して、たがいちがいに並べた`:`中心角 ${a}° のおうぎ形を ${N} 等分して並べた`)+`<br>縦 ÷ 半径 = ${n(hh/r,3)}（1 に近づく）<br>`+(a===360?'横は弧 '+N/2+' 個分で、円周の半分 πr<br>面積 = πr × r = <b>πr²</b>':'横は弧 '+N/2+' 個分で、弧の長さ ℓ の半分<br>面積 S = ℓ/2 × r = <b>(1/2)ℓr</b>')};}});

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
const Q={
 sen3:{alt:'直線 AB、線分 AB、半直線 AB のちがいを示す図',h:150,f(d){[['直線 AB',36,16,324],['線分 AB',76,120,240],['半直線 AB',116,120,324]].forEach(([t,y,x1,x2])=>{d.line(x1,y,x2,y,INK);d.dot(120,y,'var(--gold)',3.5).dot(240,y,'var(--gold)',3.5);tx(d,120,y+18,'A','var(--ink)',11);tx(d,240,y+18,'B','var(--ink)',11);tx(d,22,y-10,t,'var(--muted)',10,'start');});return '直線は両方向に、半直線は一方向に、限りなくのびている';}},
 ido8:{alt:'長方形を 8 つの合同な直角三角形ア〜クに分けた図',h:200,f(d){const p=(x,y)=>[50+x*60,160-y*60],T={ア:[[0,1],[0,2],[2,2]],イ:[[0,1],[2,1],[2,2]],ウ:[[2,1],[2,2],[4,1]],エ:[[2,2],[4,2],[4,1]],オ:[[0,0],[0,1],[2,0]],カ:[[0,1],[2,1],[2,0]],キ:[[2,0],[2,1],[4,1]],ク:[[2,0],[4,0],[4,1]]};
   Object.keys(T).forEach((k,i)=>{const z=T[k].map(q=>p(q[0],q[1]));d.poly(z,k==='ア'?FC:INK);tx(d,(z[0][0]+z[1][0]+z[2][0])/3,(z[0][1]+z[1][1]+z[2][1])/3+4,k,k==='ア'?'var(--c)':'var(--ink)',12);});
   d.line(170,22,170,178,'stroke="var(--gold)" stroke-width="1.4" stroke-dasharray="8 3 2 3"');d.line(30,100,310,100,'stroke="var(--gold)" stroke-width="1.4" stroke-dasharray="8 3 2 3"');
   d.dot(170,100,'var(--gold)',4);tx(d,181,94,'O','var(--gold)',11);tx(d,178,20,'ℓ','var(--gold)',11);tx(d,318,96,'m','var(--gold)',11);return '8 つの三角形は、すべて合同な直角三角形';}},
 daikei:{alt:'AD と BC が平行で、AB が BC に垂直な台形 ABCD の図',h:200,f(d){const A=[90,44],D=[198,44],B=[90,152],C=[252,152];d.poly([A,B,C,D],INK);rt(d,B,A,C,8);rt(d,A,D,B,8);
   tx(d,A[0]-10,A[1]-4,'A');tx(d,B[0]-10,B[1]+12,'B');tx(d,C[0]+10,C[1]+12,'C');tx(d,D[0]+10,D[1]-4,'D');tx(d,76,102,'6 cm','var(--muted)',11,'end');tx(d,144,36,'6 cm','var(--muted)',11);tx(d,171,170,'9 cm','var(--muted)',11);return 'AD ∥ BC、AB ⊥ BC';}},
 takasa:{alt:'三角形 ABC と、頂点 A から辺 BC にひいた垂線 AH の図',h:200,f(d){const A=[130,30],B=[50,170],C=[290,170],H=[130,170];d.poly([A,B,C],INK);seg(d,A,H,'stroke="var(--gold)" stroke-width="1.8" stroke-dasharray="5 4"');rt(d,H,A,C,8);
   tx(d,A[0],A[1]-9,'A');tx(d,B[0]-9,B[1]+13,'B');tx(d,C[0]+9,C[1]+13,'C');tx(d,H[0],H[1]+17,'H','var(--gold)');return '頂点 A から辺 BC にひいた垂線 AH';}},
 sessen:{alt:'円 O に点 P で接する直線 ℓ と、ℓ 上の点 A を結んだ図',h:200,f(d){const O=[120,90],P=[120,160],A=[220,160];d.circle(O[0],O[1],70,INK);d.line(20,160,320,160,INK);seg(d,O,P);seg(d,O,A);rt(d,P,O,A,8,MG);
   d.angle(A[0],A[1],26,145,180,MC);tx(d,A[0]-44,A[1]-8,'35°','var(--c)',11);d.dot(O[0],O[1],'var(--ink)',3);tx(d,O[0]-10,O[1]-6,'O');tx(d,P[0],P[1]+17,'P');tx(d,A[0]+4,A[1]+17,'A');tx(d,314,152,'ℓ','var(--muted)');return 'ℓ は点 P で円 O に接する。∠OAP = 35°';}},
 ogiwa:{alt:'中心と中心角が同じで、半径が 9 cm と 6 cm の 2 つのおうぎ形にはさまれた図形の図',h:200,f(d){const O=[170,186],a0=60,a1=120,P1=pc(O,162,a0),P2=pc(O,162,a1),Q1=pc(O,108,a0),Q2=pc(O,108,a1);
   d.path(`M${f(Q1[0])},${f(Q1[1])} L${f(P1[0])},${f(P1[1])} A162,162 0 0 0 ${f(P2[0])},${f(P2[1])} L${f(Q2[0])},${f(Q2[1])} A108,108 0 0 1 ${f(Q1[0])},${f(Q1[1])} Z`,FC);
   seg(d,O,Q1,DSH);seg(d,O,Q2,DSH);d.angle(O[0],O[1],22,60,120,MG);tx(d,O[0],O[1]-30,'60°','var(--gold)',11);tx(d,O[0]+44,O[1]-46,'6 cm','var(--muted)',10,'start');tx(d,P1[0]+10,(P1[1]+Q1[1])/2,'3 cm','var(--muted)',10,'start');d.dot(O[0],O[1],'var(--ink)',2.5);return '外側の半径 9 cm、内側の半径 6 cm、中心角 60°';}},
 leaf:{alt:'1 辺 8 cm の正方形の中に、向かい合う 2 つの頂点を中心とする半径 8 cm のおうぎ形を 2 つかいた図',h:210,f(d){const a=[95,30],b=[245,30],c=[245,180],e=[95,180];
   d.path(`M${a[0]},${a[1]} A150,150 0 0 1 ${c[0]},${c[1]} A150,150 0 0 1 ${a[0]},${a[1]} Z`,FG);d.poly([a,b,c,e],INK);d.path(`M${a[0]},${a[1]} A150,150 0 0 1 ${c[0]},${c[1]}`,MC);d.path(`M${c[0]},${c[1]} A150,150 0 0 1 ${a[0]},${a[1]}`,MC);
   tx(d,170,198,'8 cm','var(--muted)',11);tx(d,84,108,'8 cm','var(--muted)',11,'end');return '色をつけた部分は、2 つのおうぎ形が重なった部分';}}
};
FIGS.m1zukei_h_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){const d=draw(),r=q.f(d);return {svg:d.out(),read:r};}});};
})();

/* ---- 後半：空間図形（FIGS.m1zukei_k_*） ---- */
(function(){
const {draw,n,mk}=FIG;
const f=v=>v.toFixed(1);
const INK='stroke="var(--ink)" stroke-width="1.6" fill="none" stroke-linejoin="round"';
const SUB='stroke="var(--muted)" stroke-width="1.2" fill="none"';
const DSH='stroke="var(--muted)" stroke-width="1.2" fill="none" stroke-dasharray="4 4"';
const IDS='stroke="var(--ink)" stroke-width="1.2" fill="none" stroke-dasharray="4 3"';
const HG='stroke="var(--gold)" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"';
const MG='stroke="var(--gold)" stroke-width="1.8" fill="none" stroke-linejoin="round"';
const MC='stroke="var(--c)" stroke-width="1.8" fill="none" stroke-linejoin="round"';
const FC='fill="var(--c)" fill-opacity=".24" stroke="var(--c)" stroke-width="1.4" stroke-linejoin="round"';
const FG='fill="var(--gold)" fill-opacity=".28" stroke="var(--gold)" stroke-width="1.6" stroke-linejoin="round"';
const FI='fill="var(--ink)" fill-opacity=".06" stroke="var(--ink)" stroke-width="1.4" stroke-linejoin="round"';
const AXIS='stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="8 3 2 3" fill="none"';
const WAT='fill="var(--c)" fill-opacity=".45" stroke="none"';
// 色 c の塗り（不透明度 o）と同じ色のふち
const fl=(c,o,w=1.4)=>`fill="var(--${c})" fill-opacity="${o}" stroke="var(--${c})" stroke-width="${w}" stroke-linejoin="round"`;
const pc=(O,R,a)=>[O[0]+R*Math.cos(a*Math.PI/180),O[1]-R*Math.sin(a*Math.PI/180)];
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
const seg=(d,P,Q,st=INK)=>d.line(P[0],P[1],Q[0],Q[1],st);
const rect=(d,x,y,w,h,st)=>d.poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],st);
const fan=(O,R,a0,a1)=>{const P=pc(O,R,a0),Q=pc(O,R,a1);return `M${f(O[0])},${f(O[1])} L${f(P[0])},${f(P[1])} A${f(R)},${f(R)} 0 ${a1-a0>180?1:0} 0 ${f(Q[0])},${f(Q[1])} Z`;};
const arcP=(O,R,a0,a1)=>{const P=pc(O,R,a0),Q=pc(O,R,a1);return `M${f(P[0])},${f(P[1])} A${f(R)},${f(R)} 0 ${a1-a0>180?1:0} 0 ${f(Q[0])},${f(Q[1])}`;};
// だ円（底面の円）：前半分は st、後ろ半分は st2
const ell=(d,cx,cy,rx,ry,st,st2)=>{d.path(`M${f(cx-rx)},${f(cy)} A${f(rx)},${f(ry)} 0 0 0 ${f(cx+rx)},${f(cy)}`,st);return d.path(`M${f(cx-rx)},${f(cy)} A${f(rx)},${f(ry)} 0 0 1 ${f(cx+rx)},${f(cy)}`,st2||st);};
const oval=(d,cx,cy,rx,ry,st)=>d.raw(`<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" ${st}/>`);
// 円柱の側面（中心 cx、下の底面の中心の高さ yb、上 yt、半径 rx、だ円のたて ry）
const tube=(cx,yb,yt,rx,ry)=>`M${f(cx-rx)},${f(yb)} A${f(rx)},${f(ry)} 0 0 0 ${f(cx+rx)},${f(yb)} L${f(cx+rx)},${f(yt)} A${f(rx)},${f(ry)} 0 0 1 ${f(cx-rx)},${f(yt)} Z`;
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const fr=(p,q)=>{const g=gcd(p,q)||1;p/=g;q/=g;return q===1?String(p):`${p}/${q}`;};
const pi=(p,q=1)=>{const s=fr(p,q);return s==='1'?'π':s.includes('/')?s+' π':s+'π';};
const KAKU={3:'三',4:'四',5:'五',6:'六',7:'七',8:'八'};
const STEP=k=>({sliders:[{k:'s',label:'手順',min:1,max:k,step:1,v:1}],play:{k:'s',from:1,to:k,label:'順に見る',ms:1400*k}});
const RAD=Math.PI/180;
const sub3=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],dot3=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],crs=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],nrm=a=>{const l=Math.hypot(...a)||1;return a.map(x=>x/l);};
// 点 P を、点 A を通り単位ベクトル u の向きの直線のまわりに、角 t（ラジアン）回す
const rot3=(P,A,u,t)=>{const v=sub3(P,A),c=Math.cos(t),s=Math.sin(t),w=crs(u,v),k=dot3(u,v)*(1-c);return [0,1,2].map(i=>A[i]+v[i]*c+w[i]*s+u[i]*k);};
// 立体の点を画面に写す（z が上。az：鉛直な軸のまわりに回す角、el：見下ろす角。返す 3 番目の値は奥行き＝大きいほど遠い）
const cam=(az,el,s,cx,cy)=>{const a=az*RAD,e=el*RAD,ca=Math.cos(a),sa=Math.sin(a),ce=Math.cos(e),se=Math.sin(e);
  return p=>{const x=p[0]*ca-p[1]*sa,y=p[0]*sa+p[1]*ca;return [cx+s*x,cy-s*(p[2]*ce+y*se),y*ce-p[2]*se];};};
const avg=ps=>[ps.reduce((s,q)=>s+q[0],0)/ps.length,ps.reduce((s,q)=>s+q[1],0)/ps.length];

/* ---- 角柱・角錐・円柱・円錐 ---- */
FIGS.m1zukei_k_rittai=host=>mk(host,{alt:'角柱、角錐、円柱、円錐の見取図',
  sliders:[{k:'t',label:'立体',min:1,max:4,step:1,v:1,fmt:t=>['角柱','角錐','円柱','円錐'][t-1]},{k:'m',label:'底面の辺の数（角柱・角錐）',min:3,max:8,step:1,v:3}],
  draw(v){const d=draw(),t=v.t,m=v.m,cx=170,cy=196,R=78,H=132,k=.32,top=[cx,cy-H];let read;
    if(t>=3){ell(d,cx,cy,R,R*k,INK,DSH);
      if(t===3){oval(d,cx,cy-H,R,R*k,FC);d.line(cx-R,cy,cx-R,cy-H,INK);d.line(cx+R,cy,cx+R,cy-H,INK);
        read='<b>円柱</b><br>底面：合同な円が 2 つ（平行）<br>側面：曲面。展開すると長方形';}
      else{seg(d,top,[cx-R,cy]);seg(d,top,[cx+R,cy]);d.dot(top[0],top[1],'var(--gold)',3.5);tx(d,top[0]+14,top[1]+2,'頂点','var(--gold)',10,'start');
        read='<b>円錐</b><br>底面：円が 1 つ<br>側面：曲面。展開するとおうぎ形<br>頂点が 1 つ';}
      tx(d,cx,cy+4,'底面','var(--muted)',10);}
    else{const th=i=>(-90+180/m+i*360/m)*Math.PI/180,B=[],fr0=[],rin=R*Math.cos(Math.PI/m);
      for(let i=0;i<m;i++){B.push([cx+R*Math.cos(th(i)),cy-k*R*Math.sin(th(i))]);const tm=(th(i)+th(i+1))/2;fr0.push(t===1?-Math.sin(tm)>1e-6:-H*Math.sin(tm)*Math.cos(Math.asin(k))+rin*k>1e-6);}
      const T=B.map(p=>[p[0],p[1]-H]);
      for(let i=0;i<m;i++){const j=(i+1)%m,pv=(i+m-1)%m,vis=fr0[i]||fr0[pv];seg(d,B[i],B[j],fr0[i]?INK:DSH);
        if(t===1)seg(d,B[i],T[i],vis?INK:DSH);else seg(d,B[i],top,vis?INK:DSH);}
      if(t===1){d.poly(T,FC);read=`<b>${KAKU[m]}角柱</b><br>底面：${KAKU[m]}角形が 2 つ（合同で平行）<br>側面：長方形が ${m} つ<br>面 ${m+2}、辺 ${3*m}、頂点 ${2*m}`;}
      else{d.dot(top[0],top[1],'var(--gold)',3.5);tx(d,top[0]+14,top[1]+2,'頂点','var(--gold)',10,'start');read=`<b>${KAKU[m]}角錐</b><br>底面：${KAKU[m]}角形が 1 つ<br>側面：三角形が ${m} つ<br>面 ${m+1}、辺 ${2*m}、頂点 ${m+1}`;}}
    return {svg:d.out(),read};}});

/* ---- 正多面体：頂点の座標から面と辺を求めて描く ---- */
const PH=(1+Math.sqrt(5))/2,cyc=(a,b,c)=>[[a,b,c],[c,a,b],[b,c,a]];
const sgn=L=>{const o=[];L.forEach(p=>{[1,-1].forEach(s1=>[1,-1].forEach(s2=>[1,-1].forEach(s3=>{const q=[p[0]*s1,p[1]*s2,p[2]*s3];if(!o.some(z=>Math.hypot(z[0]-q[0],z[1]-q[1],z[2]-q[2])<1e-9))o.push(q);})));});return o;};
// へこみのない多面体の面：となり合う 3 頂点を通る平面のうち、すべての頂点がその片側にあるもの
const hull=V=>{let L=1e9;V.forEach((p,i)=>V.forEach((q,j)=>{if(i<j)L=Math.min(L,Math.hypot(...sub3(p,q)));}));const adj=(i,j)=>Math.abs(Math.hypot(...sub3(V[i],V[j]))-L)<1e-6,F=[];
  V.forEach((_,j)=>V.forEach((_,i)=>V.forEach((_,k)=>{if(i===k||!adj(i,j)||!adj(j,k))return;let nm=nrm(crs(sub3(V[j],V[i]),sub3(V[k],V[j])));if(dot3(nm,V[j])<0)nm=nm.map(x=>-x);
    const mx=Math.max(...V.map(p=>dot3(p,nm)));if(dot3(V[j],nm)<mx-1e-6||F.some(fc=>dot3(fc.nm,nm)>1-1e-6))return;
    const ix=V.map((p,q)=>q).filter(q=>dot3(V[q],nm)>mx-1e-6),c=[0,1,2].map(q=>ix.reduce((s,t)=>s+V[t][q],0)/ix.length),u=nrm(sub3(V[ix[0]],c)),w=crs(nm,u);
    ix.sort((a,b)=>{const A=sub3(V[a],c),B=sub3(V[b],c);return Math.atan2(dot3(A,w),dot3(A,u))-Math.atan2(dot3(B,w),dot3(B,u));});F.push({ix,nm});})));
  const E=new Map();F.forEach((fc,fi)=>fc.ix.forEach((a,i)=>{const b=fc.ix[(i+1)%fc.ix.length],key=Math.min(a,b)+'-'+Math.max(a,b);if(!E.has(key))E.set(key,{a,b,fs:[]});E.get(key).fs.push(fi);}));
  return {F,E:[...E.values()]};};
const POLY=[['正四面体','正三角形',[[1,1,1],[1,-1,-1],[-1,1,-1],[-1,-1,1]],3],['正六面体（立方体）','正方形',sgn([[1,1,1]]),3],['正八面体','正三角形',sgn(cyc(1,0,0)),4],
  ['正十二面体','正五角形',sgn([[1,1,1]].concat(cyc(0,1/PH,PH))),3],['正二十面体','正三角形',sgn(cyc(0,1,PH)),5]].map(P=>Object.assign({name:P[0],face:P[1],V:P[2],per:P[3],rad:Math.hypot(...P[2][0])},hull(P[2])));
FIGS.m1zukei_k_seitamen=host=>mk(host,{alt:'5 種類の正多面体の見取図',
  sliders:[{k:'j',label:'正多面体',min:1,max:5,step:1,v:1,fmt:j=>POLY[j-1].name},{k:'a',label:'回す角度（度）',min:0,max:360,step:10,v:20}],play:{k:'a',from:0,to:360,label:'1 回転させる',ms:5000},
  draw(v){const d=draw(),P=POLY[v.j-1],pr=cam(v.a+17,24,86/P.rad,170,122);
    const S=P.V.map(pr),front=P.F.map(fc=>{const q=pr(fc.nm),o=pr([0,0,0]);return q[2]-o[2]<-1e-9;});
    P.F.forEach((fc,i)=>{if(front[i])d.poly(fc.ix.map(k=>S[k]),'fill="var(--c)" fill-opacity=".16" stroke="none"');});
    P.E.forEach(e=>{if(!e.fs.some(i=>front[i]))seg(d,S[e.a],S[e.b],DSH);});P.E.forEach(e=>{if(e.fs.some(i=>front[i]))seg(d,S[e.a],S[e.b],INK);});
    const Fn=P.F.length,Vn=P.V.length,En=P.E.length;
    return {svg:d.out(),read:`<b>${P.name}</b><br>面：${P.face}が ${Fn} つ<br>頂点 ${Vn}、辺 ${En}<br>1 つの頂点に集まる面は ${P.per} つ`};}});
FIGS.m1zukei_k_seitamen.sim=()=>POLY.map(P=>[P.name,P.F.length,P.V.length,P.E.length,P.F[0].ix.length]);

/* ---- 展開図を折りたたんで立体を作る ---- */
const SQ=(x,y)=>[[x,y],[x+1,y],[x+1,y+1],[x,y+1]],R3=Math.sqrt(3)/2;
// 面：[頂点（展開図の座標）, 親の面, 親とつながる辺, 折る角度]
const NETS=[
 {name:'立方体',faces:[[SQ(1,1),-1],[SQ(1,0),0,[[1,1],[2,1]],90],[SQ(0,1),0,[[1,1],[1,2]],90],[SQ(2,1),0,[[2,1],[2,2]],90],[SQ(3,1),3,[[3,1],[3,2]],90],[SQ(1,2),0,[[1,2],[2,2]],90]],
  fn:['ウ','ア','イ','エ','オ','カ'],mark:[[1,0,1,'A'],[0,1,2,'C'],[4,1,4,'G']],az:-30,el:50,
  mid:'金色の点 A, C, G は、組み立てると重なる',end:'点 A, C, G が集まって、1 つの頂点になる<br>面ウと面オ、面アと面カ、面イと面エが平行'},
 {name:'三角柱',faces:[[[[1,0],[2,0],[2,1.8],[1,1.8]],-1],[[[0,0],[1,0],[1,1.8],[0,1.8]],0,[[1,0],[1,1.8]],120],[[[2,0],[3,0],[3,1.8],[2,1.8]],0,[[2,0],[2,1.8]],120],[[[1,0],[1.5,-R3],[2,0]],0,[[1,0],[2,0]],90],[[[1,1.8],[2,1.8],[1.5,1.8+R3]],0,[[1,1.8],[2,1.8]],90]],
  mark:[[0,0,1],[3,0,2],[1.5,-R3,3]],az:-34,el:46,
  mid:'金色の 3 つの点は、組み立てると重なる',end:'金色の 3 つの点が集まって、1 つの頂点になる<br>側面の 3 つの長方形の横の長さの和 = 底面の周の長さ'},
 {name:'正四角錐',faces:[[SQ(0,0),-1],[[[0,0],[1,0],[.5,-1]],0,[[0,0],[1,0]],120],[[[1,0],[1,1],[2,.5]],0,[[1,0],[1,1]],120],[[[1,1],[0,1],[.5,2]],0,[[1,1],[0,1]],120],[[[0,1],[0,0],[-1,.5]],0,[[0,1],[0,0]],120]],
  mark:[[.5,-1,1],[2,.5,2],[.5,2,3],[-1,.5,4]],az:-24,el:46,
  mid:'4 つの三角形の金色の頂点は、組み立てると重なる',end:'4 つの金色の点が集まって、角錐の頂点になる<br>側面は、合同な二等辺三角形が 4 つ'}];
NETS.forEach(N=>{N.F=N.faces.map(([p0,par,h0,ang])=>{const p=p0.map(q=>[q[0],-q[1]]),h=h0&&h0.map(q=>[q[0],-q[1]]),o={p,par,ang:ang||0};if(par>=0){const A=[h[0][0],h[0][1],0];let u=nrm([h[1][0]-h[0][0],h[1][1]-h[0][1],0]);const c=avg(p);if(u[0]*(c[1]-A[1])-u[1]*(c[0]-A[0])<0)u=u.map(x=>-x);o.A=A;o.u=u;}return o;});
  // 平らな展開図が枠に収まるように、大きさと位置を決める
  const p0=cam(N.az,N.el,1,0,0),Q=[];N.F.forEach(g=>g.p.forEach(q=>Q.push(p0([q[0],q[1],0]))));
  const x0=Math.min(...Q.map(q=>q[0])),x1=Math.max(...Q.map(q=>q[0])),y0=Math.min(...Q.map(q=>q[1])),y1=Math.max(...Q.map(q=>q[1])),s=Math.min(290/(x1-x0),176/(y1-y0)),c0=avg(N.F[0].p),r0=p0([c0[0],c0[1],0]);
  // 折る量 t のときの写し方：平らなときは展開図全体を中央に、組み立てると底の面を中央に置き、1.5 倍に大きくする
  N.pr=t=>{const k=s*(1+.5*t),X=(1-t)*(170-s*(x0+x1)/2)+t*(170-k*r0[0]),Y=(1-t)*(132-s*(y0+y1)/2)+t*(158-k*r0[1]);return cam(N.az,N.el,k,X,Y);};});
// 面 fi の点 q を、折る量 t（0〜1）で折ったときの位置。自分の辺から順に、親の辺のまわりに回していく
const fold=(N,fi,q,t)=>{let P=[q[0],-q[1],0],g=N.F[fi];while(g.par>=0){P=rot3(P,g.A,g.u,g.ang*t*RAD);g=N.F[g.par];}return P;};
FIGS.m1zukei_k_oritatami=host=>mk(host,{alt:'展開図を折りたたんで、立方体、三角柱、正四角錐を組み立てる途中のようすを示す図',
  sliders:[{k:'k',label:'展開図',min:1,max:3,step:1,v:1,fmt:k=>NETS[k-1].name},{k:'t',label:'折る量',min:0,max:100,step:5,v:0,fmt:t=>t+' %'}],play:{k:'t',from:0,to:100,label:'組み立てる',ms:4200},
  draw(v){const d=draw(),N=NETS[v.k-1],t=v.t/100,pr=N.pr(t);
    const S=N.F.map((g,i)=>g.p.map(q=>pr(fold(N,i,[q[0],-q[1]],t)))),ar=ps=>{let a=0;ps.forEach((q,i)=>{const r=ps[(i+1)%ps.length];a+=q[0]*r[1]-r[0]*q[1];});return a/2;};
    S.map((ps,i)=>[i,ps.reduce((s,q)=>s+q[2],0)/ps.length]).sort((a,b)=>b[1]-a[1]).forEach(([i])=>{d.poly(S[i],i===0?fl('gold',.3):fl('c',.22));
      // 面の名前：組み立てる途中は横から見て細すぎない面、組み立てたあとは外から見える面だけ
      const A=ar(S[i]),A0=ar(S[0]);if(N.fn&&(t<1?Math.abs(A)>120:A*A0<0)){const c=avg(S[i]);tx(d,c[0],c[1]+4,N.fn[i],i===0?'var(--gold)':'var(--muted)',11);}});
    const M=N.mark.map(m=>pr(fold(N,m[2],[m[0],m[1]],t)));let far=0;M.forEach(P=>M.forEach(Q=>{far=Math.max(far,Math.hypot(P[0]-Q[0],P[1]-Q[1]));}));
    M.forEach(P=>d.dot(P[0],P[1],'var(--gold)',4));
    if(N.mark[0][3]){if(far<26)tx(d,M[0][0]-10,M[0][1]-8,N.mark.map(m=>m[3]).join(', '),'var(--gold)',11,'end');
      else{const c0=avg(N.F[0].p),c=pr([c0[0],c0[1],0]);M.forEach((P,j)=>{const x=P[0]-c[0],y=P[1]-c[1],l=Math.hypot(x,y)||1;tx(d,P[0]+x/l*13,P[1]+y/l*13+4,N.mark[j][3],'var(--gold)',11);});}}
    return {svg:d.out(),read:`<b>${N.name}</b>の展開図を ${v.t} % 折った<br>`+(v.t===100?N.end:N.mid)+(v.k===1?'<br>金色の面ウを底にして組み立てる':'<br>金色の面を底にして組み立てる')};}});
FIGS.m1zukei_k_oritatami.sim=(k,i,q)=>fold(NETS[k-1],i,q,1).map(x=>Math.round(x*1e6)/1e6);

/* ---- 見取図と展開図を対応させる ---- */
const TEN=[
 ['三角柱',['底面の三角形は、展開図でも合同な三角形が 2 つ','側面の長方形 3 つは、展開図では横につながって 1 つの長方形になる','横の長さは、底面の周の長さに等しい。縦は角柱の高さ'],['底面','側面','側面の横と、底面の周']],
 ['正四角錐',['底面は正方形が 1 つ','側面は、合同な二等辺三角形が 4 つ','側面の三角形の等しい辺は、見取図では頂点と底面の頂点を結ぶ辺'],['底面','側面','頂点から出る辺']],
 ['円柱',['底面の円は、展開図でも合同な円が 2 つ','側面の曲面は、展開図では 1 つの長方形になる','長方形の横の長さは、底面の円周の長さに等しい'],['底面','側面','側面の横と、底面の円周']],
 ['円錐',['底面は円が 1 つ','側面の曲面は、展開図ではおうぎ形になる。半径は母線の長さ','おうぎ形の弧の長さは、底面の円周の長さに等しい'],['底面','側面','側面の弧と、底面の円周']]];
FIGS.m1zukei_k_tenkai=host=>mk(host,{alt:'立体の見取図と展開図を並べて、対応する面や辺を同じ色で示す図',h:240,
  sliders:[{k:'t',label:'立体',min:1,max:4,step:1,v:3,fmt:t=>TEN[t-1][0]},{k:'p',label:'注目する部分',min:1,max:3,step:1,v:3,fmt:p=>'①②③'[p-1]}],
  draw(v){const d=draw(),t=v.t,p=v.p,S=q=>p===q?FG:FI,L=q=>p===q?HG:INK;
    tx(d,80,18,'見取図','var(--muted)',10);tx(d,250,18,'展開図','var(--muted)',10);d.line(160,10,160,230,'stroke="var(--line)" stroke-width="1"');
    if(t===1){const A=[40,200],B=[120,200],C=[80,178],h=110,up=q=>[q[0],q[1]-h],e=40,x=190,y=86;
      d.poly([A,B,C],S(1));d.poly([A,B,up(B),up(A)],S(2));seg(d,A,C,DSH);seg(d,B,C,DSH);seg(d,C,up(C),DSH);d.poly([up(A),up(B),up(C)],S(1));
      if(p===3){d.poly([A,B,C],HG);}
      for(let i=0;i<3;i++)rect(d,x+i*e,y,e,80,S(2));d.poly([[x+e,y],[x+2*e,y],[x+1.5*e,y-34.6]],S(1));d.poly([[x+e,y+80],[x+2*e,y+80],[x+1.5*e,y+114.6]],S(1));
      if(p===3){d.line(x,y+80,x+3*e,y+80,HG);tx(d,x+1.5*e,y+72,'底面の周の長さ','var(--gold)',9);}}
    else if(t===2){const A=[28,196],B=[108,196],C=[138,170],D=[58,170],O=[83,62],c=[250,128],hs=25,ht=46;
      d.poly([A,B,C,D],S(1));seg(d,A,D,DSH);seg(d,D,C,DSH);seg(d,O,D,DSH);d.poly([O,A,B],S(2));d.poly([O,B,C],S(2));
      if(p===3)[A,B,C].forEach(q=>seg(d,O,q,HG));
      rect(d,c[0]-hs,c[1]-hs,2*hs,2*hs,S(1));const T=[[[c[0]-hs,c[1]-hs],[c[0]+hs,c[1]-hs],[c[0],c[1]-hs-ht]],[[c[0]+hs,c[1]-hs],[c[0]+hs,c[1]+hs],[c[0]+hs+ht,c[1]]],[[c[0]+hs,c[1]+hs],[c[0]-hs,c[1]+hs],[c[0],c[1]+hs+ht]],[[c[0]-hs,c[1]+hs],[c[0]-hs,c[1]-hs],[c[0]-hs-ht,c[1]]]];
      T.forEach(q=>{d.poly(q,S(2));if(p===3){seg(d,q[0],q[2],HG);seg(d,q[1],q[2],HG);}});}
    else if(t===3){const cx=80,yt=82,yb=172,rx=22,ry=7,x=187,w=138.2,y=84,r=22;
      oval(d,cx,yb,rx,ry,S(1));rect(d,cx-rx,yt,2*rx,yb-yt,p===2?'fill="var(--gold)" fill-opacity=".28" stroke="none"':'fill="none" stroke="none"');
      d.line(cx-rx,yt,cx-rx,yb,L(2));d.line(cx+rx,yt,cx+rx,yb,L(2));oval(d,cx,yt,rx,ry,S(1));
      if(p===3)oval(d,cx,yb,rx,ry,HG);
      rect(d,x,y,w,90,S(2));d.circle(x+w/2,y-r,r,S(1));d.circle(x+w/2,y+90+r,r,S(1));
      if(p===3){d.line(x,y+90,x+w,y+90,HG);d.circle(x+w/2,y+90+r,r,HG);tx(d,x+w/2,y+82,'底面の円周の長さ','var(--gold)',9);}}
    else{const cx=80,yb=190,rx=30,ry=9,O=[80,105],F=[240,46],R=90;
      oval(d,cx,yb,rx,ry,S(1));d.poly([O,[cx-rx,yb],[cx+rx,yb]],p===2?'fill="var(--gold)" fill-opacity=".28" stroke="none"':'fill="none" stroke="none"');
      seg(d,O,[cx-rx,yb],L(2));seg(d,O,[cx+rx,yb],L(2));if(p===3)oval(d,cx,yb,rx,ry,HG);
      tx(d,cx+rx+4,150,'母線','var(--muted)',9,'start');
      d.path(fan(F,R,210,330),S(2));d.circle(F[0],F[1]+R+30,30,S(1));
      if(p===3){d.path(arcP(F,R,210,330),HG);d.circle(F[0],F[1]+R+30,30,HG);}
      tx(d,F[0]-50,F[1]+44,'母線','var(--muted)',9);}
    return {svg:d.out(),read:`<b>${TEN[t-1][0]}</b>　注目する部分${'①②③'[p-1]}：${TEN[t-1][2][p-1]}<br>${TEN[t-1][1][p-1]}<br>金色の部分どうしが対応している`};}});

/* ---- 投影図 ---- */
const TOEI=['円柱','円錐','三角柱','正四角錐','球'];
FIGS.m1zukei_k_toei=host=>mk(host,{alt:'立体の見取図と、立面図・平面図を並べた図',h:240,
  sliders:[{k:'t',label:'立体',min:1,max:5,step:1,v:2,fmt:t=>TOEI[t-1]}],
  draw(v){const d=draw(),t=v.t,cx=74,X=246,g=y=>d.line(170,y,326,y,'stroke="var(--muted)" stroke-width="1"'),gd=x=>d.line(x,36,x,222,'stroke="var(--line)" stroke-width="1" stroke-dasharray="2 4"');
    tx(d,cx,18,'見取図','var(--muted)',10);tx(d,186,30,'立面図','var(--muted)',10,'start');tx(d,186,148,'平面図','var(--muted)',10,'start');g(128);
    const ef=[['長方形','円'],['二等辺三角形','円'],['長方形','三角形'],['二等辺三角形','正方形'],['円','円']][t-1];
    if(t===1){ell(d,cx,180,36,11,INK,DSH);oval(d,cx,80,36,11,INK);d.line(cx-36,80,cx-36,180,INK);d.line(cx+36,80,cx+36,180,INK);gd(X-34);gd(X+34);rect(d,X-34,44,68,76,MG);d.circle(X,180,34,MC);}
    if(t===2){ell(d,cx,184,36,11,INK,DSH);seg(d,[cx,70],[cx-36,184]);seg(d,[cx,70],[cx+36,184]);gd(X-34);gd(X+34);gd(X);d.poly([[X,44],[X-34,120],[X+34,120]],MG);d.circle(X,180,34,MC);d.dot(X,180,'var(--c)',2.5);}
    if(t===3){const A=[38,190],B=[110,190],C=[74,166],u=q=>[q[0],q[1]-104];d.poly([A,B,u(B),u(A)],INK);seg(d,A,C,DSH);seg(d,B,C,DSH);seg(d,C,u(C),DSH);d.poly([u(A),u(B),u(C)],INK);
      gd(X-34);gd(X+34);gd(X);rect(d,X-34,44,68,76,MG);d.line(X,44,X,120,'stroke="var(--gold)" stroke-width="1.6" stroke-dasharray="4 3"');d.poly([[X-34,206],[X+34,206],[X,147.1]],MC);}
    if(t===4){const A=[30,190],B=[104,190],C=[130,168],D=[56,168],O=[80,70];d.poly([A,B,C],INK);seg(d,A,D,DSH);seg(d,D,C,DSH);seg(d,O,D,DSH);seg(d,O,A);seg(d,O,B);seg(d,O,C);
      gd(X-34);gd(X+34);gd(X);d.poly([[X,44],[X-34,120],[X+34,120]],MG);rect(d,X-34,146,68,68,MC);d.line(X-34,146,X+34,214,MC);d.line(X+34,146,X-34,214,MC);}
    if(t===5){d.circle(cx,128,44,INK);ell(d,cx,128,44,13,INK,DSH);gd(X-34);gd(X+34);d.circle(X,82,34,MG);d.circle(X,180,34,MC);}
    return {svg:d.out(),read:`立面図（正面から見た図）：<b>${ef[0]}</b><br>平面図（真上から見た図）：<i>${ef[1]}</i><br>この 2 つで表される立体は、${TOEI[t-1]}`+(t===3?'<br>立面図の点線は、正面からは見えない辺':'')};}});

/* ---- 平面が 1 つに決まる ---- */
FIGS.m1zukei_k_hirate=host=>mk(host,{alt:'直線 ℓ をふくむ平面を ℓ のまわりに回して、ℓ 上にない点 C を通る位置をさがす図',h:230,
  sliders:[{k:'p',label:'平面を回す角度（度）',min:0,max:180,step:10,v:20}],play:{k:'p',from:0,to:180,label:'平面を回す',ms:4500},
  draw(v){const d=draw(),az=-24,el=16,pr=cam(az,el,60,150,160),ph=v.p*RAD,w=1.5,on=v.p===60,Cw=[.25,Math.cos(60*RAD),Math.sin(60*RAD)],Kw=[.25,0,0];
    const pl=[[-1.6,0,0],[1.6,0,0],[1.6,w*Math.cos(ph),w*Math.sin(ph)],[-1.6,w*Math.cos(ph),w*Math.sin(ph)]].map(pr),C=pr(Cw),K=pr(Kw),A=pr([-1,0,0]),B=pr([.9,0,0]);
    // 点 C が、見る人から見て平面の手前にあるか
    const nv=[0,-Math.sin(ph),Math.cos(ph)],vw=[-Math.sin(az*RAD)*Math.cos(el*RAD),-Math.cos(az*RAD)*Math.cos(el*RAD),Math.sin(el*RAD)],front=dot3(nv,sub3(Cw,Kw))*dot3(nv,vw)>=0;
    const pC=()=>{seg(d,C,K,DSH);d.dot(C[0],C[1],on?'var(--gold)':'var(--ink)',4.5);tx(d,C[0]+12,C[1]-4,'C',on?'var(--gold)':'var(--ink)');};
    if(!front&&!on)pC();
    d.poly(pl,on?fl('gold',.3):fl('c',.18));
    const L0=pr([-2.2,0,0]),L1=pr([2.2,0,0]);seg(d,L0,L1,INK);tx(d,L1[0]+8,L1[1]+4,'ℓ','var(--muted)',12,'start');
    d.dot(A[0],A[1],'var(--ink)',3.5).dot(B[0],B[1],'var(--ink)',3.5);tx(d,A[0],A[1]+18,'A');tx(d,B[0],B[1]+18,'B');
    if(front||on)pC();
    const I=[294,50],ir=30;d.circle(I[0],I[1],ir+8,'fill="var(--bg2)" stroke="var(--line)" stroke-width="1"');tx(d,I[0]-ir-14,I[1]-20,'ℓ の方向から見る','var(--muted)',9,'end');
    const e=pc(I,ir,v.p),cc=pc(I,ir*.72,60);seg(d,I,e,on?HG:MC);d.dot(I[0],I[1],'var(--ink)',3.5);d.dot(cc[0],cc[1],on?'var(--gold)':'var(--ink)',3.5);tx(d,cc[0]+8,cc[1]-4,'C',on?'var(--gold)':'var(--ink)',10,'start');tx(d,I[0]-8,I[1]+14,'ℓ','var(--muted)',10,'end');
    return {svg:d.out(),read:`直線 ℓ のまわりに平面を ${v.p}° 回した<br>`+(on?'<b>平面が点 C を通った</b><br>直線 ℓ と点 C をふくむ平面は、これ 1 つだけ<br>3 点 A, B, C をふくむ平面も、これ 1 つだけ':'直線 ℓ をふくむ平面は、回すといくらでもある<br>点 C は、この平面上にない')};}});

/* ---- 直方体の辺や面の位置関係 ---- */
const BX={A:[0,0,1],B:[1,0,1],C:[1,1,1],D:[0,1,1],E:[0,0,0],F:[1,0,0],G:[1,1,0],H:[0,1,0]};
const BE=['AB','DC','EF','HG','AD','BC','EH','FG','AE','BF','CG','DH'],BF=['ABCD','EFGH','ABFE','DCGH','ADHE','BCGF'];
const share=(a,b)=>a.split('').filter(c=>b.includes(c)).length;
const dirE=e=>[0,1,2].map(i=>BX[e[1]][i]-BX[e[0]][i]).join();
// 辺と辺：0 同じ、1 平行、2 交わる、3 ねじれの位置
const relEE=(e,r)=>e===r?0:dirE(e)===dirE(r)?1:share(e,r)?2:3;
// 辺と面、面と面：共有する頂点の数で決まる
const relEF=(e,fc)=>[1,2,0][share(e,fc)];  // 0 面上、1 平行、2 垂直に交わる
const relFF=(g,fc)=>g===fc?0:share(g,fc)?2:1;  // 1 平行、2 垂直
const IBASE=['辺 AB','辺 AD','辺 AE','面 ABCD','面 ABFE'];
FIGS.m1zukei_k_ichi=(host,arg)=>mk(host,{alt:'直方体の辺や面を基準にして、ほかの辺や面との位置関係を色分けした図',
  sliders:[{k:'b',label:'基準',min:1,max:5,step:1,v:(arg&&arg.b)||1,fmt:b=>IBASE[b-1]},{k:'m',label:'くらべる相手',min:1,max:2,step:1,v:(arg&&arg.m)||1,fmt:m=>['辺','面'][m-1]}],
  draw(v){const d=draw(),isE=v.b<=3,r=IBASE[v.b-1].slice(2),p=q=>[62+BX[q][0]*160+BX[q][1]*72,204-BX[q][2]*110-BX[q][1]*44],hid=e=>e.includes('H');let read;
    const col=k=>['ink','gold','c','ng'][k],fillF=(fc,c,o)=>d.poly(fc.split('').map(p),`fill="var(--${c})" fill-opacity="${o}" stroke="none"`);
    const edge=(e,c,w)=>seg(d,p(e[0]),p(e[1]),`stroke="var(--${c})" stroke-width="${w}" fill="none" stroke-linecap="round"`+(hid(e)?' stroke-dasharray="5 4"':''));
    const L=(arr,k,fn)=>arr.filter(x=>fn(x)===k).map(x=>(arr===BF?'面 ':'')+x).join(', ');
    if(isE&&v.m===1){BE.forEach(e=>{const k=relEE(e,r);edge(e,col(k),k===0?3.6:2.2);});
      read=`基準：辺 ${r}（太い線）<br><b>平行</b>（金色）：${L(BE,1,e=>relEE(e,r))}<br><i>交わる</i>（緑）：${L(BE,2,e=>relEE(e,r))}<br>ねじれの位置（赤）：${L(BE,3,e=>relEE(e,r))}`;}
    else if(isE){BF.forEach(fc=>{const k=relEF(r,fc);if(k)fillF(fc,k===1?'gold':'c',.22);});BE.forEach(e=>edge(e,e===r?'ink':'muted',e===r?3.6:1.4));
      read=`基準：辺 ${r}（太い線）<br><b>平行な面</b>（金色）：${L(BF,1,fc=>relEF(r,fc))}<br><i>垂直に交わる面</i>（緑）：${L(BF,2,fc=>relEF(r,fc))}<br>辺 ${r} をふくむ面：${L(BF,0,fc=>relEF(r,fc))}`;}
    else if(v.m===1){fillF(r,'ink',.12);BE.forEach(e=>{const k=relEF(e,r);edge(e,k===0?'ink':col(k),k===0?3.2:2.2);});
      read=`基準：面 ${r}（うすい灰色）<br><b>平行な辺</b>（金色）：${L(BE,1,e=>relEF(e,r))}<br><i>垂直に交わる辺</i>（緑）：${L(BE,2,e=>relEF(e,r))}<br>面 ${r} 上にある辺：${L(BE,0,e=>relEF(e,r))}`;}
    else{BF.forEach(fc=>{const k=relFF(fc,r);fillF(fc,k===0?'ink':k===1?'gold':'c',k===0?.14:.22);});BE.forEach(e=>edge(e,share(e,r)===2?'ink':'muted',share(e,r)===2?3.2:1.4));
      read=`基準：面 ${r}（うすい灰色）<br><b>平行な面</b>（金色）：${L(BF,1,fc=>relFF(fc,r))}<br><i>垂直な面</i>（緑）：${L(BF,2,fc=>relFF(fc,r))}`;}
    Object.keys(BX).forEach(q=>{const z=p(q),o={A:[-10,0],B:[10,2],C:[11,-2],D:[-9,-5],E:[-10,10],F:[6,15],G:[12,8],H:[-10,-3]}[q];tx(d,z[0]+o[0],z[1]+o[1]+3,q,q==='H'?'var(--muted)':'var(--ink)',12);});
    return {svg:d.out(),read};}});
FIGS.m1zukei_k_ichi.sim={relEE,relEF,relFF,BE,BF};

/* ---- 点と平面との距離 ---- */
FIGS.m1zukei_k_kyori=host=>mk(host,{alt:'平面上の点 Q を動かして、平面外の点 A からの距離がいちばん短くなる位置をさがす図',h:240,
  sliders:[{k:'t',label:'点 Q の位置（H から右が +）',min:-3.5,max:3.5,step:.25,v:2.5}],play:{k:'t',from:3.5,to:0,label:'Q を H に近づける',ms:3200},
  draw(v){const d=draw(),t=v.t,p=q=>[170+30*q[0]+17*q[1],200-30*q[2]-10*q[1]],A=p([0,0,4]),H=p([0,0,0]),Q=p([t,0,0]),len=Math.sqrt(16+t*t);
    d.poly([[-3.6,-2.4,0],[3.6,-2.4,0],[3.6,2.4,0],[-3.6,2.4,0]].map(p),fl('c',.14,1.2));tx(d,p([-3.3,2.1,0])[0]+4,p([-3.3,2.1,0])[1]+12,'P','var(--c)',12,'start');
    seg(d,p([-3.4,0,0]),p([3.4,0,0]),SUB);seg(d,p([0,-2.2,0]),p([0,2.2,0]),SUB);
    seg(d,A,H,IDS);const rtm=(u)=>{const a=p([u[0]*.35,u[1]*.35,0]),b=p([u[0]*.35,u[1]*.35,.35]),c=p([0,0,.35]);d.path(`M${f(a[0])},${f(a[1])} L${f(b[0])},${f(b[1])} L${f(c[0])},${f(c[1])}`,SUB);};rtm([1,0]);rtm([0,-1]);
    seg(d,A,Q,HG);d.dot(A[0],A[1],'var(--ink)',4);d.dot(H[0],H[1],'var(--ink)',3);d.dot(Q[0],Q[1],'var(--gold)',4.5);
    tx(d,A[0],A[1]-10,'A');tx(d,H[0]-12,H[1]+15,'H');if(Math.abs(t)>=.75)tx(d,Q[0]+(t>0?6:-6),Q[1]+17,'Q','var(--gold)');
    tx(d,(A[0]+Q[0])/2+(t>=0?14:-14),(A[1]+Q[1])/2,n(len,2),'var(--gold)',12);if(t!==0)tx(d,A[0]-8,(A[1]+H[1])/2+4,'4','var(--muted)',11,'end');
    return {svg:d.out(),read:`AQ = <b>${n(len,2)} cm</b>`+(t===0?'<br>Q が H に重なった。AH ⊥ 平面 P のとき、いちばん短い<br>この長さ 4 cm が、<b>点 A と平面 P との距離</b>':'<br>AH = 4 cm（AH は、H を通る平面 P 上の 2 直線に垂直）<br>Q を H に近づけるほど、AQ は短くなる')};}});

/* ---- 面や線分を動かして立体を作る ---- */
const UG=[['三角形','三角形を、その面に垂直な方向に動かす','三角柱'],['円','円を、その面に垂直な方向に動かす','円柱'],['線分','線分を、円の周にそって動かす','円柱の側面'],
  ['長方形','長方形を、直線 ℓ を軸として回転させる','円柱'],['直角三角形','直角三角形を、直線 ℓ を軸として回転させる','円錐'],['半円','半円を、直径をふくむ直線 ℓ を軸として回転させる','球']];
FIGS.m1zukei_k_ugoki=(host,arg)=>mk(host,{alt:'平面図形や線分を動かしたり、直線を軸として回転させたりして、立体ができるようすを示す図',h:240,
  sliders:[{k:'t',label:'動かすもの',min:1,max:6,step:1,v:arg||1,fmt:t=>UG[t-1][0]},{k:'a',label:'動かす量',min:0,max:100,step:5,v:45,fmt:a=>a+' %'}],play:{k:'a',from:0,to:100,label:'動かす',ms:3600},
  draw(v){const d=draw(),t=v.t,a=v.a,cx=170,yb=206,k=.3,SW='fill="var(--c)" fill-opacity=".14" stroke="none"',g=UG[t-1];
    const E=(ro,z,q)=>[cx+ro*Math.cos(q),yb-z+k*ro*Math.sin(q)];
    const arcs=(ro,z,q0,q1)=>{const o=[],m=Math.max(2,Math.ceil(Math.abs(q1-q0)/.08));for(let i=0;i<=m;i++)o.push(E(ro,z,q0+(q1-q0)*i/m));return o;};
    const pth=ps=>ps.map((q,i)=>(i?'L':'M')+f(q[0])+','+f(q[1])).join('');
    if(t<=2){const h=130*a/100;
      if(t===1){const B=[[110,yb],[226,yb],[186,yb-30]],T=B.map(q=>[q[0],q[1]-h]);d.poly(B,FC);if(a>0){B.forEach((q,i)=>seg(d,q,T[i],i===2?DSH:INK));d.poly(T,FG);}}
      else{oval(d,cx,yb,64,64*k,FC);if(a>0){d.line(cx-64,yb,cx-64,yb-h,INK);d.line(cx+64,yb,cx+64,yb-h,INK);oval(d,cx,yb-h,64,64*k,FG);}}
      if(a>0){d.line(284,yb,284,yb-h,MG);tx(d,292,yb-h/2+4,'高さ','var(--gold)',10,'start');}}
    else if(t===3){const R=64,H=130,q=2*Math.PI*a/100;
      ell(d,cx,yb,R,R*k,DSH);ell(d,cx,yb-H,R,R*k,DSH);
      if(a===100)d.path(tube(cx,yb,yb-H,R,R*k),SW);else if(a>0)d.path(pth(arcs(R,0,0,q).concat(arcs(R,H,q,0)))+'Z',SW);
      if(a===100){ell(d,cx,yb,R,R*k,INK,IDS);oval(d,cx,yb-H,R,R*k,INK);d.line(cx-R,yb,cx-R,yb-H,INK);d.line(cx+R,yb,cx+R,yb-H,INK);}
      else{seg(d,E(R,0,0),E(R,H,0),SUB);const P=E(R,0,q),Q=E(R,H,q);seg(d,P,Q,HG);tx(d,Q[0]+(Math.cos(q)>=0?10:-10),(P[1]+Q[1])/2,'母線','var(--gold)',10,Math.cos(q)>=0?'start':'end');}}
    else{const th=2*Math.PI*a/100,R=62,H=t===6?2*R:120;
      d.line(cx,yb+18,cx,yb-H-22,AXIS);tx(d,cx+9,yb-H-14,'ℓ','var(--muted)',11,'start');
      let shape=t===4?[[0,0],[R,0],[R,H],[0,H]]:t===5?[[0,0],[R,0],[0,H]]:[];
      if(t===6)for(let i=0;i<=24;i++){const q=(-90+i*7.5)*RAD;shape.push([R*Math.cos(q),R+R*Math.sin(q)]);}
      if(a>0){if(t===4){d.path(pth(arcs(R,0,0,th).concat(arcs(R,H,th,0)))+'Z',SW);d.path(pth([E(0,H,0)].concat(arcs(R,H,0,th)))+'Z',SW);d.path(pth(arcs(R,0,0,th)),MG);d.path(pth(arcs(R,H,0,th)),MG);}
        if(t===5){d.path(pth([E(0,H,0)].concat(arcs(R,0,0,th)))+'Z',SW);d.path(pth(arcs(R,0,0,th)),MG);}
        if(t===6){const st=Math.PI/12;for(let q=0;q<th-1e-9;q+=st){const q2=Math.min(th,q+st);d.path(pth(shape.map(s=>E(s[0],s[1],q)).concat(shape.map(s=>E(s[0],s[1],q2)).reverse()))+'Z',SW);}
          for(let q=Math.PI/6;q<th-1e-9;q+=Math.PI/6)d.path(pth(shape.map(s=>E(s[0],s[1],q))),SUB);d.path(pth(arcs(R,R,0,th)),MG);}}
      if(a===100){if(t===4){ell(d,cx,yb,R,R*k,INK,IDS);oval(d,cx,yb-H,R,R*k,INK);d.line(cx-R,yb,cx-R,yb-H,INK);d.line(cx+R,yb,cx+R,yb-H,INK);}
        if(t===5){ell(d,cx,yb,R,R*k,INK,IDS);seg(d,[cx,yb-H],[cx-R,yb]);seg(d,[cx,yb-H],[cx+R,yb]);}
        if(t===6){oval(d,cx,yb-R,R,R*Math.sqrt(1+k*k),INK);ell(d,cx,yb-R,R,R*k,INK,IDS);}}
      d.poly(shape.map(q=>E(q[0],q[1],0)),FC);if(a>0&&a<100)d.poly(shape.map(q=>E(q[0],q[1],th)),FG);}
    const done=a===100;
    return {svg:d.out(),read:g[1]+(t<=2?'<br>動かした距離が、柱の高さになる':t===3?'<br>動く線分が、側面をえがく。この線分を母線という':`<br>回した角度：${n(3.6*a)}°`)+'<br>'+(done?(t===3?'できたのは <b>円柱の側面</b>':`できた立体は <b>${g[2]}</b>`):`最後まで動かすと、${g[2]}になる`)+(t===4||t===5?'<br>側面をえがく辺を、母線という':'')};}});

/* ---- 柱の体積：底面と同じ形の板を積み重ねる ---- */
FIGS.m1zukei_k_tsumi=host=>mk(host,{alt:'底面と合同な厚さ 1 cm の板を積み重ねて柱を作り、体積を数える図',
  sliders:[{k:'b',label:'底面',min:1,max:2,step:1,v:1,fmt:b=>['直角三角形','円'][b-1]},{k:'h',label:'重ねた枚数（高さ cm）',min:1,max:6,step:1,v:3}],play:{k:'h',from:1,to:6,label:'積み重ねる',ms:3000},
  draw(v){const d=draw(),u=21,h=v.h,O=[96,214],P=(x,y,z)=>[O[0]+x*u+y*u*.55,O[1]-z*u-y*u*.36];
    for(let z=0;z<h;z++){const top=z===h-1;
      if(v.b===1){const B=[[0,0],[4,0],[4,3]],lo=B.map(q=>P(q[0],q[1],z)),hi=B.map(q=>P(q[0],q[1],z+1));
        d.poly([lo[1],lo[2],hi[2],hi[1]],fl('c',.12,1.1));d.poly([lo[0],lo[1],hi[1],hi[0]],fl('c',.22,1.1));if(top)d.poly(hi,fl('gold',.32));}
      else{const c=P(2.1,1.6,0),rx=2*u,ry=2*u*.36,ylo=c[1]-z*u,yhi=ylo-u;d.path(tube(c[0],ylo,yhi,rx,ry),fl('c',.2,1.1));if(top)oval(d,c[0],yhi,rx,ry,fl('gold',.32));}}
    const x=O[0]+4*u+3*u*.55+18;d.line(x,O[1],x,O[1]-h*u,MG);d.line(x-4,O[1],x+4,O[1],MG);d.line(x-4,O[1]-h*u,x+4,O[1]-h*u,MG);tx(d,x+8,O[1]-h*u/2+4,h+' cm','var(--gold)',11,'start');
    const S=v.b===1?'6':'4π',V=v.b===1?String(6*h):pi(4*h);
    return {svg:d.out(),read:(v.b===1?'底面積 S = (1/2) × 4 × 3 = 6（cm²）':'底面積 S = π × 2² = 4π（cm²）')+`<br>厚さ 1 cm の板 1 枚の体積 = ${S} × 1 = ${S}（cm³）<br>${h} 枚重ねると ${S} × ${h} = <b>${V}</b>（cm³）<br>柱の体積 = 底面積 × 高さ`};}});

/* ---- 円柱と円錐の体積 ---- */
FIGS.m1zukei_k_taiseki=host=>mk(host,{alt:'底面の半径と高さが等しい円柱と円錐を並べて、体積をくらべる図',
  sliders:[{k:'r',label:'底面の半径 r（cm）',min:1,max:5,step:1,v:2},{k:'h',label:'高さ h（cm）',min:2,max:9,step:1,v:6}],
  draw(v){const d=draw(),r=v.r,h=v.h,u=14,R=r*u,H=h*u,yb=200,x1=92,x2=248;
    ell(d,x1,yb,R,R*.3,INK,DSH);d.line(x1-R,yb,x1-R,yb-H,INK);d.line(x1+R,yb,x1+R,yb-H,INK);oval(d,x1,yb-H,R,R*.3,FC);
    ell(d,x2,yb,R,R*.3,INK,DSH);seg(d,[x2,yb-H],[x2-R,yb]);seg(d,[x2,yb-H],[x2+R,yb]);d.line(x2,yb,x2,yb-H,DSH);d.line(x2,yb,x2+R,yb,MG);
    tx(d,x2+R+6,yb+4,'r','var(--gold)',11,'start');tx(d,x2-6,yb-H/2,'h','var(--muted)',11,'end');tx(d,x1,yb+R*.3+18,'円柱','var(--ink)',11);tx(d,x2,yb+R*.3+18,'円錐','var(--ink)',11);
    return {svg:d.out(),read:`底面積 S = π × ${r}² = ${pi(r*r)}（cm²）、高さ h = ${h} cm<br>円柱：V = Sh = ${pi(r*r)} × ${h} = <b>${pi(r*r*h)}</b>（cm³）<br>円錐：V = (1/3)Sh = <b>${pi(r*r*h,3)}</b>（cm³）<br>円錐の体積は、円柱の体積の 1/3`};}});

/* ---- なぜ：立方体を 3 つの合同な四角錐に分ける（arg 'nobi'：縦にのばす） ---- */
const PYB=[[[0,0,0],[1,0,0],[1,1,0],[0,1,0]],[[1,0,0],[1,1,0],[1,1,1],[1,0,1]],[[0,1,0],[1,1,0],[1,1,1],[0,1,1]]],PYC=['c','gold','ng'],PYN=['下の面','右の面','奥の面'];
FIGS.m1zukei_k_rippo3=(host,arg)=>{const nobi=arg==='nobi';mk(host,Object.assign(nobi?{sliders:[{k:'h',label:'高さ（1 辺 a の何倍か）',min:1,max:2.5,step:.5,v:1}],play:{k:'h',from:1,to:2.5,label:'縦にのばす',ms:3000}}:STEP(5),{alt:nobi?'立方体を縦にのばした直方体を、3 つの四角錐に分ける図':'立方体を、1 つの頂点 P を共通の頂点とする 3 つの合同な四角錐に分ける図',
  draw(v){const d=draw(),s=nobi?5:v.s,Hh=nobi?v.h:1,U=nobi?60:100,O=nobi?[110,226]:[86,200],OFF=[[-22,32],[56,12],[-24,-48]];
    const p=(q,o=[0,0])=>[O[0]+q[0]*U+q[1]*U*.48+o[0],O[1]-q[2]*U*Hh-q[1]*U*.32+o[1]],P=[0,0,1];
    const pyr=(i,o)=>{const c=PYC[i],b=PYB[i].map(q=>p(q,o)),pp=p(P,o);d.poly(b,fl(c,.3,1.6));b.forEach(q=>seg(d,pp,q,`stroke="var(--${c})" stroke-width="1.8" fill="none"`));for(let j=0;j<4;j++)d.poly([pp,b[j],b[(j+1)%4]],`fill="var(--${c})" fill-opacity=".1" stroke="none"`);return pp;};
    if(s<5||nobi){[[[0,1,0],[0,0,0]],[[0,1,0],[1,1,0]],[[0,1,0],[0,1,1]]].forEach(e=>seg(d,p(e[0]),p(e[1]),DSH));
      [[[0,0,0],[1,0,0]],[[1,0,0],[1,1,0]],[[0,0,0],[0,0,1]],[[1,0,0],[1,0,1]],[[1,1,0],[1,1,1]],[[0,0,1],[1,0,1]],[[1,0,1],[1,1,1]],[[1,1,1],[0,1,1]],[[0,1,1],[0,0,1]]].forEach(e=>seg(d,p(e[0]),p(e[1]),INK));
      if(nobi){[1,2].forEach(i=>PYB[i].forEach(q=>seg(d,p(P),p(q),`stroke="var(--${PYC[i]})" stroke-width="1" stroke-opacity=".7" fill="none" stroke-dasharray="3 3"`)));pyr(0,[0,0]);}
      else if(s>=2)pyr(s-2,[0,0]);const pp=p(P);d.dot(pp[0],pp[1],'var(--ink)',4);tx(d,pp[0]-11,pp[1]-2,'P');
      if(s===1||nobi){tx(d,(p([0,0,0])[0]+p([1,0,0])[0])/2,p([0,0,0])[1]+17,'a','var(--muted)',11);tx(d,p([0,0,.5])[0]-9,p([0,0,.5])[1]+4,nobi&&Hh>1?n(Hh)+'a':'a','var(--muted)',11,'end');}}
    else{[0,1,2].forEach(i=>{const c=PYC[i],u=64,x0=18+i*104,y0=200,q=w=>[x0+w[0]*u+w[1]*u*.48,y0-w[2]*u-w[1]*u*.32],b=[[0,0,0],[1,0,0],[1,1,0],[0,1,0]].map(q),pp=q([0,0,1]);
      seg(d,b[3],b[0],`stroke="var(--${c})" stroke-width="1.2" fill="none" stroke-dasharray="4 3"`);seg(d,b[2],b[3],`stroke="var(--${c})" stroke-width="1.2" fill="none" stroke-dasharray="4 3"`);seg(d,pp,b[3],`stroke="var(--${c})" stroke-width="1.2" fill="none" stroke-dasharray="4 3"`);
      d.poly([pp,b[0],b[1]],fl(c,.28,1.6));d.poly([pp,b[1],b[2]],fl(c,.16,1.6));d.dot(pp[0],pp[1],'var(--ink)',3.5);tx(d,pp[0]-9,pp[1]-4,'P','var(--ink)',11);tx(d,x0+u*.74,y0+20,PYN[i]+'が底面','var(--muted)',9);});}
    const read=nobi&&Hh===1?'のばす前の立方体（1 辺 a）を、3 つの四角錐に分けた<br>点線は、ほかの 2 つの四角錐の辺<br>緑の四角錐 = 立方体の <b>1/3</b>':nobi?`立方体を縦に ${n(Hh)} 倍にのばした直方体<br>点線は、ほかの 2 つの四角錐の辺<br>どの部分も縦に ${n(Hh)} 倍になる。3 つの体積は等しいまま<br>緑の四角錐 = 直方体の <b>1/3</b> = (1/3) × 底面積 × 高さ`
      :s===1?'<b>手順 1</b>　1 辺 a の立方体と、その頂点 P<br>P をふくまない面は、下・右・奥の 3 つ'
      :s===5?'<b>手順 5</b>　3 つを同じ向きに置くと、どれも同じ形（合同）<br>合わせると立方体なので、1 つの体積は立方体の <b>1/3</b><br>(1/3) × a² × a = (1/3) × 底面積 × 高さ'
      :`<b>手順 ${s}</b>　P と${PYN[s-2]}でできる四角錐<br>底面は 1 辺 a の正方形、高さは a<br>（P と${PYN[s-2]}との距離が a）`;
    return {svg:d.out(),read};}}));};

/* ---- 水を移しかえる実験（arg 'sui'：円錐 → 円柱、'kyu'：球と円錐 → 円柱） ---- */
FIGS.m1zukei_k_mizu=(host,arg)=>{const kyu=arg==='kyu';mk(host,Object.assign(kyu?STEP(3):{sliders:[{k:'s',label:'円錐の容器で注いだ回数',min:0,max:3,step:1,v:0}],play:{k:'s',from:0,to:3,label:'水を注ぐ',ms:3600}},{alt:kyu?'球の容器と円錐の容器の水を、球がぴったり入る円柱の容器に移す実験の図':'円錐の容器の水を、底面と高さが等しい円柱の容器に移す実験の図',
  draw(v){const d=draw(),k=.3,yb=200,R=kyu?46:44,H=kyu?2*R:112,xR=kyu?262:236,lev=kyu?[0,2/3,1][v.s-1]:v.s/3,ry=R*k;
    // 右：円柱の容器と水
    if(lev>0){d.path(tube(xR,yb,yb-lev*H,R,ry),WAT);oval(d,xR,yb-lev*H,R,ry,'fill="var(--c)" fill-opacity=".3" stroke="var(--c)" stroke-width="1.2"');}
    ell(d,xR,yb,R,ry,INK,DSH);oval(d,xR,yb-H,R,ry,INK);d.line(xR-R,yb,xR-R,yb-H,INK);d.line(xR+R,yb,xR+R,yb-H,INK);
    [1,2].forEach(j=>{const y=yb-H*j/3;d.line(xR+R,y,xR+R+8,y,SUB);tx(d,xR+R+11,y+4,j+'/3','var(--muted)',10,'start');});
    tx(d,xR,yb+ry+18,'円柱','var(--ink)',11);
    // 左：円錐（頂点が下）と球
    const cone=(x,full)=>{const pts=[[x-R,yb-H],[x,yb],[x+R,yb-H]];if(full){d.poly(pts,WAT);oval(d,x,yb-H,R,ry,'fill="var(--c)" fill-opacity=".3" stroke="none"');}seg(d,pts[0],pts[1]);seg(d,pts[1],pts[2]);oval(d,x,yb-H,R,ry,INK);tx(d,x,yb+18,'円錐','var(--ink)',11);};
    const arrow=(x0,x1,y)=>{d.path(`M${f(x0)},${f(y)} Q${f((x0+x1)/2)},${f(y-34)} ${f(x1)},${f(y)}`,MG);d.path(`M${f(x1-9)},${f(y-6)} L${f(x1)},${f(y)} L${f(x1-2)},${f(y-10)}`,MG);};
    let read;
    if(!kyu){const xL=96;cone(xL,v.s<3);if(v.s<3)arrow(xL+8,xR-8,yb-H-ry-6);
      read=v.s===0?'底面の半径と高さが等しい、円錐の容器と円柱の容器<br>円錐の容器に水を満たして、円柱の容器に移す':v.s<3?`${v.s} 杯：円柱の高さの <b>${v.s}/3</b> まで入った`:'3 杯で、ちょうどいっぱいになった<br>円錐の体積 = 円柱の体積 × <b>1/3</b>';}
    else{const xs=68,xc=158;
      if(v.s===1)d.circle(xs,yb-R,R,WAT);d.circle(xs,yb-R,R,INK);ell(d,xs,yb-R,R,ry,SUB,DSH);tx(d,xs,yb+18,'球','var(--ink)',11);
      if(v.s===1)arrow(xs+8,xR-8,yb-H-ry-6);
      if(v.s>=2){cone(xc,v.s===2);if(v.s===2)arrow(xc+8,xR-8,yb-H-ry-6);}
      read=['半径 r の球の容器と、球がぴったり入る円柱の容器<br>円柱は、底面の半径 r、高さ 2r','球いっぱいの水を移すと、円柱の高さの <b>2/3</b> まで入った<br>球の体積 = 円柱の体積 × 2/3<br>次に、底面の半径 r、高さ 2r の円錐に水を満たす','円錐の水を加えると、ちょうどいっぱいになった<br>（円錐は円柱の 1/3）<br>円錐 : 球 : 円柱 = <b>1 : 2 : 3</b>'][v.s-1];}
    return {svg:d.out(),read};}}));};

/* ---- 円柱の展開図と表面積 ---- */
FIGS.m1zukei_k_enchu=host=>mk(host,{alt:'円柱の展開図で、側面の長方形と 2 つの底面の円を示す図',
  sliders:[{k:'r',label:'底面の半径（cm）',min:1,max:4,step:1,v:2},{k:'h',label:'高さ（cm）',min:2,max:8,step:1,v:5}],
  draw(v){const d=draw(),r=v.r,h=v.h,u=7.6,w=2*Math.PI*r*u,x=170-w/2,y=125-h*u/2;
    rect(d,x,y,w,h*u,FC);d.circle(170,y-r*u,r*u,FG);d.circle(170,y+h*u+r*u,r*u,FG);d.line(x,y+h*u,x+w,y+h*u,HG);
    tx(d,x-6,y+h*u/2+4,h+' cm','var(--muted)',10,'end');tx(d,x+w+6,y+h*u-4,(2*r)+'π cm','var(--gold)',10,'start');tx(d,170,y+h*u/2+4,'側面','var(--ink)',10);tx(d,170+r*u+6,y-r*u+4,'底面','var(--gold)',10,'start');
    return {svg:d.out(),read:`側面：縦 ${h} cm、横 2π × ${r} = ${2*r}π cm の長方形<br>側面積 = ${h} × ${2*r}π = ${2*r*h}π（cm²）<br>底面積 = π × ${r}² = ${pi(r*r)}（cm²）。底面は 2 つ<br>表面積 = ${2*r*h}π + ${pi(r*r)} × 2 = <b>${2*r*h+2*r*r}π</b>（cm²）`};}});

/* ---- 円錐の展開図：おうぎ形の中心角と側面積 ---- */
FIGS.m1zukei_k_ensui=host=>mk(host,{alt:'円錐の母線の長さと底面の半径を変えて、側面の展開図のおうぎ形の中心角と側面積を求める図',
  sliders:[{k:'l',label:'母線の長さ（cm）',min:4,max:9,step:1,v:8},{k:'r',label:'底面の半径（cm）',min:1,max:3,step:1,v:3}],
  draw(v){const d=draw(),l=v.l,r=v.r,u=11,a=360*r/l,O=[218,124],cx=58,yb=196,hh=Math.sqrt(l*l-r*r)*u;
    oval(d,cx,yb,r*u,r*u*.3,MG);seg(d,[cx,yb-hh],[cx-r*u,yb]);seg(d,[cx,yb-hh],[cx+r*u,yb]);
    tx(d,cx+r*u/2+12,yb-hh/2,String(l),'var(--c)',11);tx(d,cx,yb+22,'半径 '+r,'var(--gold)',10);
    d.path(fan(O,l*u,270-a/2,270+a/2),FC);d.path(arcP(O,l*u,270-a/2,270+a/2),HG);d.angle(O[0],O[1],14,270-a/2,270+a/2,MC);
    tx(d,O[0],O[1]-(a>180?-26:10),n(a,1)+'°','var(--c)',11);const m=pc(O,l*u/2,270-a/2);tx(d,m[0]-9,m[1]-2,String(l),'var(--c)',11);
    return {svg:d.out(),read:`母線 ${l} cm、底面の半径 ${r} cm<br>おうぎ形の弧の長さ = 底面の円周 = ${2*r}π cm<br>中心角 = 360° × ${r}/${l} = <b>${n(a,1)}°</b><br>側面積 = π × ${l}² × ${fr(r,l)} = <b>${l*r}π</b>（cm²）`};}});
FIGS.m1zukei_k_ensui.sim=(l,r)=>[360*r/l,l*r];

/* ---- なぜ：球を、中心を頂点とする小さな錐に分ける ---- */
const KN=[3,4,6,9,12];
FIGS.m1zukei_k_kyumen=host=>mk(host,{alt:'球の表面を小さな面に分け、その 1 つを底面とし球の中心を頂点とする錐を示す図',
  sliders:[{k:'i',label:'分け方の細かさ',min:0,max:4,step:1,v:1,fmt:i=>KN[i]*KN[i]*2+' 個'}],play:{k:'i',from:0,to:4,label:'細かく分ける',ms:4000},
  draw(v){const d=draw(),N=KN[v.i],R=96,pr=cam(-18,18,R,170,126),S=(lo,la)=>pr([Math.cos(la)*Math.cos(lo),Math.cos(la)*Math.sin(lo),Math.sin(la)]);
    d.circle(170,126,R,fl('c',.1,1.6));
    const line=ps=>{for(let i=1;i<ps.length;i++)if(ps[i][2]<0&&ps[i-1][2]<0)seg(d,ps[i-1],ps[i],'stroke="var(--muted)" stroke-width=".9" fill="none"');};
    for(let j=1;j<N;j++){const la=-Math.PI/2+j*Math.PI/N,ps=[];for(let i=0;i<=96;i++)ps.push(S(i*Math.PI/48,la));line(ps);}
    for(let j=0;j<2*N;j++){const lo=j*Math.PI/N,ps=[];for(let i=0;i<=48;i++)ps.push(S(lo,-Math.PI/2+i*Math.PI/48));line(ps);}
    // 正面に近い 1 つの面と、中心 O を結ぶ錐
    const j0=Math.floor(N/2),la0=-Math.PI/2+j0*Math.PI/N,la1=la0+Math.PI/N,lo0=Math.round(-40*RAD/(Math.PI/N))*(Math.PI/N),lo1=lo0+Math.PI/N;
    const pat=[];for(let i=0;i<=8;i++)pat.push(S(lo0+(lo1-lo0)*i/8,la0));for(let i=0;i<=8;i++)pat.push(S(lo1,la0+(la1-la0)*i/8));for(let i=8;i>=0;i--)pat.push(S(lo0+(lo1-lo0)*i/8,la1));for(let i=8;i>=0;i--)pat.push(S(lo0,la0+(la1-la0)*i/8));
    const O=[170,126],cs=[S(lo0,la0),S(lo1,la0),S(lo1,la1),S(lo0,la1)];
    cs.forEach(c=>d.poly([O,c,cs[(cs.indexOf(c)+1)%4]],'fill="var(--gold)" fill-opacity=".12" stroke="none"'));
    d.poly(pat,fl('gold',.4,1.2));cs.forEach(c=>seg(d,O,c,MG));
    d.dot(O[0],O[1],'var(--ink)',3.5);tx(d,O[0]-10,O[1]+16,'O');
    return {svg:d.out(),read:`球の表面を <b>${2*N*N} 個</b>の小さな面に分けた<br>どの面も、中心 O と結ぶと錐になる（高さはほぼ半径 r）<br>錐の体積の合計 = (1/3) × (底面積の合計) × r<br>細かく分けるほど、<b>球の体積 = (1/3) × 表面積 × r</b> に近づく`};}});

/* ---- 球と、球がちょうど入る円柱 ---- */
FIGS.m1zukei_k_kyu=host=>mk(host,{alt:'球と、その球がちょうど入る円柱の図',
  sliders:[{k:'r',label:'球の半径 r（cm）',min:1,max:6,step:1,v:2}],
  draw(v){const d=draw(),r=v.r,R=56+r*4,c=[170,124],ry=R*.26;
    d.path(tube(c[0],c[1]+R,c[1]-R,R,ry),'fill="var(--gold)" fill-opacity=".08" stroke="none"');ell(d,c[0],c[1]+R,R,ry,MG,'stroke="var(--gold)" stroke-width="1.2" fill="none" stroke-dasharray="4 4"');oval(d,c[0],c[1]-R,R,ry,MG);d.line(c[0]-R,c[1]-R,c[0]-R,c[1]+R,MG);d.line(c[0]+R,c[1]-R,c[0]+R,c[1]+R,MG);
    d.circle(c[0],c[1],R,FC);ell(d,c[0],c[1],R,ry,MC,'stroke="var(--c)" stroke-width="1.2" fill="none" stroke-dasharray="4 4"');
    d.line(c[0],c[1],c[0]+R,c[1],INK);d.dot(c[0],c[1],'var(--ink)',2.5);tx(d,c[0]+R/2,c[1]-7,'r','var(--ink)',11);tx(d,c[0]+R+8,c[1]-R/2,'2r','var(--gold)',11,'start');
    return {svg:d.out(),read:`半径 ${r} cm の球（緑）と、ぴったり入る円柱（金色）<br>体積：球 ${pi(4*r*r*r,3)}、円柱 ${pi(2*r*r*r)}（球は円柱の 2/3）<br>球の表面積 = 4π × ${r}² = <b>${pi(4*r*r)}</b>（cm²）<br>円柱の側面積 = 2π × ${r} × ${2*r} = <b>${pi(4*r*r)}</b>（cm²）`};}});

/* ---- 円錐の側面にかけるひも ---- */
FIGS.m1zukei_k_himo=host=>mk(host,{alt:'母線の長さが 12 cm の円錐の側面の展開図と、底面の円周上の点から側面を 1 周するひもの図',h:230,
  sliders:[{k:'r',label:'底面の半径（cm）',min:1,max:6,step:1,v:2}],play:{k:'r',from:1,to:6,label:'底面の半径を大きくする',ms:4000},
  draw(v){const d=draw(),r=v.r,a=30*r,O=[170,34],R=140,A=pc(O,R,270-a/2),A2=pc(O,R,270+a/2),len=24*Math.sin(a*Math.PI/360);
    d.path(fan(O,R,270-a/2,270+a/2),FC);seg(d,A,A2,HG);d.angle(O[0],O[1],18,270-a/2,270+a/2,MC);
    d.dot(A[0],A[1],'var(--gold)',4).dot(A2[0],A2[1],'var(--gold)',4);tx(d,O[0],O[1]-10,'O');tx(d,A[0]-10,A[1]+14,'A');tx(d,A2[0]+11,A2[1]+14,'A′');
    tx(d,O[0],O[1]+(a<60?62:42),a+'°','var(--c)',11);const m=pc(pc(O,R/2,270-a/2),12,180-a/2);tx(d,m[0],m[1]+4,'12','var(--muted)',11);
    return {svg:d.out(),read:`底面の半径 ${r} cm、母線 12 cm<br>おうぎ形の中心角 = 360° × ${r}/12 = <b>${a}°</b><br>いちばん短いひもは、展開図では線分 AA′<br>`+(a===60?'△OAA′ は正三角形。AA′ = <b>12 cm</b>':a===180?'AA′ はおうぎ形の直径。AA′ = <b>24 cm</b>':`AA′ はおよそ ${n(len,1)} cm（計算で求めるには、中学3年の内容を使う）`)};}});

/* ---- 直方体の表面にかけるひも ---- */
FIGS.m1zukei_k_hakomichi=host=>mk(host,{alt:'直方体の頂点 A から辺 BF 上の点 P を通って頂点 G まで、表面にそってかけたひもを、見取図と展開図で示す図',
  sliders:[{k:'p',label:'BP の長さ（cm）',min:0,max:3,step:.25,v:.75}],play:{k:'p',from:0,to:2,label:'P を下へ動かす',ms:3200},
  draw(v){const d=draw(),p=v.p,best=p===2,ap=Math.hypot(4,p),pg=Math.hypot(2,3-p);
    // 左：見取図（AB = 4、BC = 2、AE = 3）
    const u=24,q=w=>[22+w[0]*u+w[1]*u*.55,190-w[2]*u-w[1]*u*.4],V={A:[0,0,3],B:[4,0,3],C:[4,2,3],D:[0,2,3],E:[0,0,0],F:[4,0,0],G:[4,2,0],H:[0,2,0]};
    tx(d,84,22,'見取図','var(--muted)',10);
    ['AB','BC','CD','DA','EF','FG','AE','BF','CG'].forEach(e=>seg(d,q(V[e[0]]),q(V[e[1]])));['EH','HG','DH'].forEach(e=>seg(d,q(V[e[0]]),q(V[e[1]]),DSH));
    d.poly(['A','B','F','E'].map(k=>q(V[k])),'fill="var(--c)" fill-opacity=".14" stroke="none"');d.poly(['B','C','G','F'].map(k=>q(V[k])),'fill="var(--c)" fill-opacity=".08" stroke="none"');
    const P3=q([4,0,3-p]);seg(d,q(V.A),P3,HG);seg(d,P3,q(V.G),HG);d.dot(P3[0],P3[1],'var(--gold)',4);
    Object.keys(V).forEach(k=>{const z=q(V[k]),o={A:[-9,-4],B:[0,-8],C:[8,-4],D:[-6,-7],E:[-9,10],F:[-2,15],G:[9,10],H:[-9,-4]}[k];tx(d,z[0]+o[0],z[1]+o[1]+3,k,k==='H'?'var(--muted)':'var(--ink)',11);});tx(d,P3[0]+7,P3[1]-6,'P','var(--gold)',11,'start');
    tx(d,(q(V.E)[0]+q(V.F)[0])/2,q(V.E)[1]+17,'4','var(--muted)',10);tx(d,q(V.E)[0]-7,(q(V.A)[1]+q(V.E)[1])/2+4,'3','var(--muted)',10,'end');tx(d,(q(V.F)[0]+q(V.G)[0])/2+7,(q(V.F)[1]+q(V.G)[1])/2+10,'2','var(--muted)',10,'start');
    // 右：展開図（面 ABFE と面 BCGF）
    const w=24,X=178,Y=86,r=(x,y)=>[X+x*w,Y+y*w];tx(d,X+72,22,'展開図','var(--muted)',10);
    d.poly([r(0,0),r(4,0),r(4,3),r(0,3)],'fill="var(--c)" fill-opacity=".14" stroke="var(--ink)" stroke-width="1.4"');d.poly([r(4,0),r(6,0),r(6,3),r(4,3)],'fill="var(--c)" fill-opacity=".08" stroke="var(--ink)" stroke-width="1.4"');
    if(!best)seg(d,r(0,0),r(6,3),'stroke="var(--c)" stroke-width="1.4" fill="none" stroke-dasharray="2 4"');
    const P2=r(4,p);seg(d,r(0,0),P2,HG);seg(d,P2,r(6,3),HG);d.dot(P2[0],P2[1],'var(--gold)',4);
    [['A',0,0,-8,-6],['B',4,0,0,-8],['C',6,0,8,-6],['E',0,3,-8,14],['F',4,3,0,15],['G',6,3,8,14]].forEach(([k,x,y,dx,dy])=>tx(d,r(x,y)[0]+dx,r(x,y)[1]+dy,k,'var(--ink)',11));tx(d,P2[0]+9,P2[1]+4,'P','var(--gold)',11,'start');
    return {svg:d.out(),read:`BP = ${n(p)} cm<br>AP + PG = ${n(ap,2)} + ${n(pg,2)} = <b>${n(ap+pg,2)}</b>（cm）<br>`+(best?'展開図で A, P, G が一直線に並んだ。<b>このとき最短</b>':'展開図で A, P, G が一直線に並ぶとき、いちばん短い')};}});
FIGS.m1zukei_k_hakomichi.sim=p=>Math.hypot(4,p)+Math.hypot(2,3-p);

/* ---- 問題に付ける図（動かさない） ---- */
// 直方体（斜めから見た図）の頂点の位置
const cub=(x0,y0,a,b,c,s=1)=>{const V={A:[0,0,1],B:[1,0,1],C:[1,1,1],D:[0,1,1],E:[0,0,0],F:[1,0,0],G:[1,1,0],H:[0,1,0]},o={};Object.keys(V).forEach(k=>{const q=V[k];o[k]=[x0+q[0]*a+q[1]*b*.6*s,y0-q[2]*c-q[1]*b*.4*s];});return o;};
const cubEdges=(d,P,st=INK)=>{['AB','BC','CD','DA','EF','FG','AE','BF','CG'].forEach(e=>seg(d,P[e[0]],P[e[1]],st));['EH','HG','DH'].forEach(e=>seg(d,P[e[0]],P[e[1]],DSH));};
const cubNames=(d,P,ov={})=>{const o=Object.assign({A:[-10,-2],B:[6,-8],C:[10,-2],D:[-6,-8],E:[-10,12],F:[0,16],G:[11,10],H:[-10,-4]},ov);Object.keys(P).forEach(k=>tx(d,P[k][0]+o[k][0],P[k][1]+o[k][1]+3,k,k==='H'?'var(--muted)':'var(--ink)'));};
const Q={
 sankakuchu:{alt:'三角柱 ABC-DEF の見取図',h:220,f(d){const D=[70,186],E=[230,186],F=[168,150],u=q=>[q[0],q[1]-116],A=u(D),B=u(E),C=u(F);d.poly([D,E,B,A],INK);seg(d,D,F,DSH);seg(d,E,F,DSH);seg(d,F,C,DSH);d.poly([A,B,C],INK);
   tx(d,A[0]-11,A[1]+2,'A');tx(d,B[0]+11,B[1]+2,'B');tx(d,C[0],C[1]-8,'C');tx(d,D[0]-11,D[1]+8,'D');tx(d,E[0]+11,E[1]+8,'E');tx(d,F[0]+12,F[1]-4,'F','var(--muted)');return '三角柱 ABC-DEF。側面はすべて長方形';}},
 chokuhotai:{alt:'直方体 ABCD-EFGH の見取図',h:220,f(d){const P=cub(70,190,150,120,110);cubEdges(d,P);cubNames(d,P);return '直方体 ABCD-EFGH';}},
 cubenet:{alt:'立方体の展開図。面にア〜カ、頂点に A〜N の記号をつけた図',h:200,f(d){const u=46,x0=78,y0=28,r=(x,y)=>[x0+x*u,y0+y*u];
   [[1,0,'ア'],[0,1,'イ'],[1,1,'ウ'],[2,1,'エ'],[3,1,'オ'],[1,2,'カ']].forEach(([x,y,t])=>{d.poly([r(x,y),r(x+1,y),r(x+1,y+1),r(x,y+1)],t==='ウ'?fl('gold',.2):FI);tx(d,r(x+.5,y+.5)[0],r(x+.5,y+.5)[1]+5,t,'var(--muted)',13);});
   [['A',1,0,-8,-4],['B',2,0,8,-4],['C',0,1,-8,-4],['D',1,1,-8,-5],['E',2,1,8,-5],['F',3,1,0,-7],['G',4,1,8,-4],['H',0,2,-8,13],['I',1,2,-8,14],['J',2,2,8,14],['K',3,2,0,15],['L',4,2,8,13],['M',1,3,-8,13],['N',2,3,8,13]].forEach(([t,x,y,dx,dy])=>tx(d,r(x,y)[0]+dx,r(x,y)[1]+dy,t,'var(--ink)',11));
   return '面ウを底にして組み立てる';}},
 nets4:{alt:'ア〜エの 4 つの図。正方形を 6 つつなげた形',h:220,f(d){const u=17,N=[['ア',[[1,0],[0,1],[1,1],[2,1],[3,1],[2,2]]],['イ',[[1,0],[2,0],[0,1],[1,1],[2,1],[3,1]]],['ウ',[[0,0],[1,0],[2,0],[2,1],[3,1],[4,1]]],['エ',[[1,0],[0,1],[1,1],[2,1],[0,2],[2,2]]]];
   N.forEach(([t,cs],i)=>{const ox=24+(i%2)*162,oy=24+Math.floor(i/2)*100;tx(d,ox,oy+10,t,'var(--ink)',13,'start');cs.forEach(([x,y])=>rect(d,ox+22+x*u,oy+6+y*u,u,u,FI));});return '正方形を 6 つつなげた図';}},
 toei2:{alt:'2 つの立体ア、イの投影図',h:220,f(d){[[90,'ア'],[250,'イ']].forEach(([X,nm],i)=>{d.line(X-66,112,X+66,112,'stroke="var(--muted)" stroke-width="1"');tx(d,X-60,26,nm,'var(--ink)',12);
     if(i===0){rect(d,X-32,34,64,70,MG);d.line(X,34,X,104,'stroke="var(--gold)" stroke-width="1.6" stroke-dasharray="4 3"');d.poly([[X-32,196],[X+32,196],[X,140.6]],MC);}
     else{d.poly([[X,34],[X-32,104],[X+32,104]],MG);rect(d,X-32,128,64,64,MC);d.line(X-32,128,X+32,192,MC);d.line(X+32,128,X-32,192,MC);}});return '上が立面図、下が平面図';}},
 kaiten:{alt:'直角をはさむ 2 辺が 3 cm と 4 cm の直角三角形と、4 cm の辺に重なる回転の軸の図',h:210,f(d){const P=[150,170],Q2=[222,170],T=[150,74];d.line(150,22,150,196,AXIS);d.poly([P,Q2,T],FC);
   d.path(`M${P[0]+9},${P[1]} L${P[0]+9},${P[1]-9} L${P[0]},${P[1]-9}`,SUB);tx(d,186,188,'3 cm','var(--muted)',10);tx(d,142,126,'4 cm','var(--muted)',10,'end');tx(d,196,116,'5 cm','var(--muted)',10,'start');tx(d,160,30,'ℓ','var(--muted)',11);return '直線 ℓ を軸として、1 回転させる';}},
 hanare:{alt:'回転の軸 ℓ から 1 cm はなれたところにある、横 2 cm、縦 4 cm の長方形の図',h:210,f(d){const u=30,X=120,y0=46;d.line(X,24,X,190,AXIS);tx(d,X+8,30,'ℓ','var(--muted)',11,'start');rect(d,X+u,y0,2*u,4*u,FC);
   d.line(X,y0+4*u+14,X+u,y0+4*u+14,SUB);tx(d,X+u/2,y0+4*u+28,'1 cm','var(--muted)',10);tx(d,X+2*u,y0+4*u+18,'2 cm','var(--muted)',10);tx(d,X+3*u+8,y0+2*u+4,'4 cm','var(--muted)',10,'start');return '長方形を、直線 ℓ を軸として 1 回転させる';}},
 sankakuchu2:{alt:'底面が 3 辺 3 cm, 4 cm, 5 cm の直角三角形で、高さが 6 cm の三角柱の見取図',h:220,f(d){const D=[70,190],E=[198,190],F=[104,160],u=q=>[q[0],q[1]-110],A=u(D),B=u(E),C=u(F);d.poly([D,E,B,A],INK);seg(d,D,F,DSH);seg(d,E,F,DSH);seg(d,F,C,DSH);d.poly([A,B,C],FC);
   tx(d,(A[0]+C[0])/2-12,(A[1]+C[1])/2-2,'3 cm','var(--muted)',10,'end');tx(d,(B[0]+C[0])/2+6,(B[1]+C[1])/2-8,'4 cm','var(--muted)',10);tx(d,(A[0]+B[0])/2,A[1]+15,'5 cm','var(--muted)',10);tx(d,E[0]+8,(E[1]+B[1])/2,'6 cm','var(--muted)',10,'start');
   d.path(`M${C[0]-7},${C[1]+6} L${C[0]+1},${C[1]+11} L${C[0]+9},${C[1]+4}`,SUB);return '底面は、直角をはさむ 2 辺が 3 cm と 4 cm の直角三角形';}},
 shikakusui:{alt:'底面が 1 辺 6 cm の正方形で、側面の二等辺三角形の高さが 8 cm の正四角錐の見取図',h:220,f(d){const A=[86,190],B=[206,190],C=[256,154],D=[136,154],O=[171,36],M=[146,190];
   seg(d,A,B);seg(d,B,C);seg(d,A,D,DSH);seg(d,D,C,DSH);seg(d,O,D,DSH);[A,B,C].forEach(P=>seg(d,O,P));seg(d,O,M,'stroke="var(--gold)" stroke-width="1.6" stroke-dasharray="5 3" fill="none"');
   d.path(`M${M[0]-8},${M[1]} L${M[0]-8},${M[1]-8} L${M[0]},${M[1]-8}`,SUB);tx(d,M[0],M[1]+16,'6 cm','var(--muted)',10);tx(d,154,176,'8 cm','var(--gold)',10,'start');return '正四角錐。側面は合同な二等辺三角形 4 つ';}},
 ensui10:{alt:'母線の長さが 10 cm、底面の半径が 4 cm の円錐の見取図',h:220,f(d){const cx=170,yb=180,R=64,T=[170,26];ell(d,cx,yb,R,R*.3,INK,DSH);seg(d,T,[cx-R,yb]);seg(d,T,[cx+R,yb]);d.line(cx,yb,cx+R,yb,MG);d.dot(cx,yb,'var(--ink)',2.5);
   tx(d,cx+R/2,yb-6,'4 cm','var(--gold)',10);tx(d,(T[0]+cx+R)/2+10,(T[1]+yb)/2,'10 cm','var(--muted)',10,'start');return '母線 10 cm、底面の半径 4 cm';}},
 hankyu:{alt:'半径 5 cm の半球の見取図',h:180,f(d){const c=[170,130],R=90;d.path(`M${c[0]-R},${c[1]} A${R},${R} 0 0 1 ${c[0]+R},${c[1]}`,INK);oval(d,c[0],c[1],R,R*.28,FC);d.line(c[0],c[1],c[0]+R,c[1],MG);d.dot(c[0],c[1],'var(--ink)',2.5);
   tx(d,c[0]+R/2,c[1]-6,'5 cm','var(--gold)',10);return '半径 5 cm の半球（球を中心を通る平面で半分に切った立体）';}},
 sankakusui:{alt:'直方体 ABCD-EFGH から切り取る三角錐 ABDE の見取図',h:220,f(d){const P=cub(70,190,150,100,125);cubEdges(d,P,'stroke="var(--muted)" stroke-width="1.2" fill="none"');
   d.poly([P.A,P.B,P.D],FG);d.poly([P.A,P.B,P.E],FG);seg(d,P.B,P.E,HG);seg(d,P.D,P.E,HG);seg(d,P.B,P.D,HG);cubNames(d,P,{H:[12,-4]});
   tx(d,(P.E[0]+P.F[0])/2,P.E[1]+17,'6 cm','var(--muted)',10);tx(d,(P.F[0]+P.G[0])/2+10,(P.F[1]+P.G[1])/2+8,'4 cm','var(--muted)',10,'start');tx(d,P.E[0]-10,(P.A[1]+P.E[1])/2+4,'5 cm','var(--muted)',10,'end');return '金色の線で切り取った三角錐 ABDE';}},
 kurinuki:{alt:'円柱から、底面と高さが等しい円錐をくりぬいた立体の見取図',h:220,f(d){const cx=170,yb=190,yt=50,R=66,ry=R*.3;d.path(tube(cx,yb,yt,R,ry),'fill="var(--c)" fill-opacity=".18" stroke="none"');ell(d,cx,yb,R,ry,INK,DSH);d.line(cx-R,yb,cx-R,yt,INK);d.line(cx+R,yb,cx+R,yt,INK);
   oval(d,cx,yt,R,ry,'fill="var(--bg2)" stroke="var(--ink)" stroke-width="1.6"');d.path(`M${cx-R},${yt} L${cx},${yb} L${cx+R},${yt}`,IDS);d.dot(cx,yb,'var(--ink)',2.5);
   d.line(cx,yt,cx+R,yt,MG);tx(d,cx+R/2,yt-6,'6 cm','var(--gold)',10);tx(d,cx+R+8,(yb+yt)/2,'10 cm','var(--muted)',10,'start');return '円錐の底面は円柱の上の底面、頂点は下の底面の中心';}},
 toei3:{alt:'立面図が長方形の上に二等辺三角形をのせた形、平面図が円の投影図',h:230,f(d){const X=170,u=14;d.line(70,128,270,128,'stroke="var(--muted)" stroke-width="1"');
   const yb=118;d.poly([[X-2*u,yb],[X+2*u,yb],[X+2*u,yb-5*u],[X,yb-8*u],[X-2*u,yb-5*u]],MG);d.line(X-2*u,yb-5*u,X+2*u,yb-5*u,MG);
   tx(d,X,yb-8,'4 cm','var(--muted)',10);tx(d,X+2*u+6,yb-2.5*u+4,'5 cm','var(--muted)',10,'start');tx(d,X+u+12,yb-6.5*u,'3 cm','var(--muted)',10,'start');
   d.circle(X,180,2*u,MC);d.dot(X,180,'var(--c)',2.5);tx(d,X-2*u-30,yb-4*u,'立面図','var(--muted)',10,'end');tx(d,X-2*u-30,184,'平面図','var(--muted)',10,'end');return '立面図の三角形の高さは 3 cm';}},
 suiso:{alt:'底面の半径が 10 cm の円柱の形をした水そうに、水が入っている図',h:200,f(d){const cx=170,yb=168,yt=40,R=80,ry=R*.26,yw=124;d.path(tube(cx,yb,yw,R,ry),WAT);oval(d,cx,yw,R,ry,'fill="var(--c)" fill-opacity=".3" stroke="var(--c)" stroke-width="1.2"');
   ell(d,cx,yb,R,ry,INK,DSH);oval(d,cx,yt,R,ry,INK);d.line(cx-R,yb,cx-R,yt,INK);d.line(cx+R,yb,cx+R,yt,INK);d.line(cx,yt,cx+R,yt,MG);tx(d,cx+R/2,yt-6,'10 cm','var(--gold)',10);
   d.line(cx+R+10,yb,cx+R+10,yw,MG);tx(d,cx+R+16,(yb+yw)/2+4,'y cm','var(--gold)',10,'start');return '底面の半径 10 cm の円柱の水そう';}}
};
FIGS.m1zukei_k_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){const d=draw(),r=q.f(d);return {svg:d.out(),read:r};}});};
})();
