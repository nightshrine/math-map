/* 数学I「図形と計量（三角比）」の図（FIGS.h1sankakuhi_*）。動かせる図、証明の手順の図、問題に付ける図（h1sankakuhi_q） */
(function(){
const {draw,n,mk,plot,C:CST}=FIG;
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
const FC='fill="var(--c)" fill-opacity=".24" stroke="none"';
const FG='fill="var(--gold)" fill-opacity=".24" stroke="none"';
const FK='fill="var(--ok)" fill-opacity=".22" stroke="none"';
const RAD=Math.PI/180,sin=a=>Math.sin(a*RAD),cos=a=>Math.cos(a*RAD),tan=a=>Math.tan(a*RAD);
const dist=(P,Q)=>Math.hypot(P[0]-Q[0],P[1]-Q[1]);
const un=(P,Q)=>{const x=Q[0]-P[0],y=Q[1]-P[1],l=Math.hypot(x,y)||1;return [x/l,y/l];};
const mid=(P,Q,t=.5)=>[P[0]+(Q[0]-P[0])*t,P[1]+(Q[1]-P[1])*t];
const cen=ps=>[ps.reduce((s,p)=>s+p[0],0)/ps.length,ps.reduce((s,p)=>s+p[1],0)/ps.length];
const dir=(P,Q)=>Math.atan2(P[1]-Q[1],Q[0]-P[0])/RAD;
const foot=(P,A,B)=>{const u=un(A,B),t=(P[0]-A[0])*u[0]+(P[1]-A[1])*u[1];return [A[0]+u[0]*t,A[1]+u[1]*t];};
// 円周上の点（角度は度。右向きが 0、反時計回りが正）
const pc=(O,R,a)=>[O[0]+R*cos(a),O[1]-R*sin(a)];
// 文字（線に重なっても読めるよう、地の色でふちどる）
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
const seg=(d,P,Q,st=INK)=>d.line(P[0],P[1],Q[0],Q[1],st);
const nm=(d,P,t,G,k=12,c)=>{const u=un(G,P);return tx(d,P[0]+u[0]*k,P[1]+u[1]*k+4,t,c);};
const names=(d,P,s,g)=>{s.split('').forEach((c,i)=>nm(d,P[i],c,g));return d;};
// 辺 PQ の中点から、点 G と反対の側へ k だけ離して文字を書く
const len=(d,P,Q,t,G,k=11,c='var(--muted)',s=12)=>{const m=mid(P,Q),u=un(P,Q);let x=-u[1],y=u[0];if((m[0]-G[0])*x+(m[1]-G[1])*y<0){x=-x;y=-y;}return tx(d,m[0]+x*k,m[1]+y*k+4,t,c,s);};
const ang=(d,P,Q,R,r=14,st=MG)=>{let a=dir(P,Q),b=dir(P,R);if(b-a>180)b-=360;if(b-a<-180)b+=360;return d.angle(P[0],P[1],r,a,b,st);};
// 角の中に書く文字（角の二等分線の上、頂点から r の位置）
const angT=(d,P,Q,R,r,t,c,s=11)=>{const u=un(P,Q),w=un(P,R);let x=u[0]+w[0],y=u[1]+w[1];const l=Math.hypot(x,y)||1;return tx(d,P[0]+x/l*r,P[1]+y/l*r+4,t,c,s);};
// 頂点 P から角度 a（度）の向きに r だけ離れた位置に文字を書く
const at=(d,P,a,r,t,c,s=11)=>{const q=pc(P,r,a);return tx(d,q[0],q[1]+4,t,c,s);};
const rt=(d,P,Q,R,s=8,st=SUB)=>{const u=un(P,Q),w=un(P,R);return d.path(`M${f(P[0]+u[0]*s)},${f(P[1]+u[1]*s)} L${f(P[0]+(u[0]+w[0])*s)},${f(P[1]+(u[1]+w[1])*s)} L${f(P[0]+w[0]*s)},${f(P[1]+w[1]*s)}`,st);};
const tick=(d,P,Q,k=1,st=SUB)=>{const m=mid(P,Q),u=un(P,Q);for(let i=0;i<k;i++){const o=(i-(k-1)/2)*4,x=m[0]+u[0]*o,y=m[1]+u[1]*o;d.line(x-u[1]*5,y+u[0]*5,x+u[1]*5,y-u[0]*5,st);}return d;};
// 円弧：中心 O、半径 R、角度 a0 から a1 へ反時計回り
const arc=(d,O,R,a0,a1,st)=>{const P=pc(O,R,a0),Q=pc(O,R,a1);let s=a1-a0;while(s<0)s+=360;return d.path(`M${f(P[0])},${f(P[1])} A${R},${R} 0 ${s>180?1:0} 0 ${f(Q[0])},${f(Q[1])}`,st);};
// 寸法線（両端に短い縦線）と文字
const dim=(d,x1,x2,y,t,c='var(--muted)')=>{d.line(x1,y,x2,y,SUB).line(x1,y-4,x1,y+4,SUB).line(x2,y-4,x2,y+4,SUB);return tx(d,(x1+x2)/2,y+15,t,c);};
// 底辺の左端 V にある角 t（度）の値を書く。せまい角・広い角は、辺と重ならないよう頂点の下に出す
const angV=(d,V,t,c='var(--c)',low=false)=>t<35||low?tx(d,V[0]+26,V[1]+16,t+'°',c,11):t>130?tx(d,V[0]-22,V[1]+16,t+'°',c,11):at(d,V,t/2,36,t+'°',c);
const STEP=(k=4)=>({sliders:[{k:'s',label:'手順',min:1,max:k,step:1,v:1}],play:{k:'s',from:1,to:k,label:'順に見る',ms:1100*k}});

/* ---- 三角比：角と大きさを変える ---- */
FIGS.h1sankakuhi_hi=host=>mk(host,{alt:'直角三角形の角 θ と斜辺の長さを変えて、辺の比を調べる図',
  sliders:[{k:'t',label:'θ（度）',min:15,max:75,step:5,v:35},{k:'c',label:'斜辺の長さ',min:2,max:5,step:.5,v:4}],play:{k:'c',from:2,to:5,label:'三角形を大きくする',ms:2800},
  draw(v){const t=v.t,c=v.c,u=38,a=c*sin(t),b=c*cos(t),A=[52,212],C=[A[0]+b*u,212],B=[C[0],212-a*u],d=draw(),m=mid(A,B);
    d.poly([A,C,B],FC).poly([A,C,B],INK);rt(d,C,A,B,7);d.angle(A[0],A[1],24,0,t,MG);
    if(t<22||b*u<45)tx(d,A[0]-9,A[1]-8,'θ','var(--gold)',12,'end');else at(d,A,t/2,38,'θ','var(--gold)',12);
    tx(d,A[0]-10,A[1]+5,'A');tx(d,B[0]+3,B[1]-8,'B');tx(d,C[0]+10,C[1]+5,'C');
    tx(d,m[0]-8,m[1]-6,'斜辺 '+n(c),'var(--ink)',12,'end');tx(d,C[0]+9,(B[1]+C[1])/2+4,'対辺 '+n(a,3),'var(--c)',12,'start');tx(d,(A[0]+C[0])/2,C[1]+21,'隣辺 '+n(b,3),'var(--muted)');
    return {svg:d.out(),read:`θ = ${t}°、斜辺 = ${n(c)}<br>sin θ = 対辺 ÷ 斜辺 = ${n(a,3)} ÷ ${n(c)} = <b>${n(sin(t),3)}</b><br>cos θ = 隣辺 ÷ 斜辺 = ${n(b,3)} ÷ ${n(c)} = <b>${n(cos(t),3)}</b><br>tan θ = 対辺 ÷ 隣辺 = ${n(a,3)} ÷ ${n(b,3)} = <b>${n(tan(t),3)}</b><br>斜辺の長さを変えても、3つの値は変わらない`};}});

/* ---- 三角比：測量（木の高さ） ---- */
FIGS.h1sankakuhi_sokuryo=host=>mk(host,{alt:'木から離れた地点で仰角を測り、木の高さを求める図',
  sliders:[{k:'d',label:'木までの距離（m）',min:5,max:30,step:1,v:15},{k:'t',label:'仰角 θ（度）',min:10,max:60,step:5,v:40}],
  draw(v){const dd=v.d,t=v.t,up=dd*tan(t),H=up+1.5,u=Math.min(226/dd,186/H),gy=224,E=[36,gy-1.5*u],X=36+dd*u,T=[X,gy-H*u],K=[X,E[1]],d=draw();
    d.line(10,gy,330,gy,SUB).poly([E,K,T],FC);
    seg(d,[36,gy],E,INK);d.dot(E[0],E[1],'var(--ink)',3.5);
    seg(d,[X,gy],T,'stroke="var(--ok)" stroke-width="4" stroke-linecap="round"');seg(d,E,K,DSH);seg(d,E,T,MG);rt(d,K,E,T,6);
    d.angle(E[0],E[1],26,0,t,MG);
    if(t<22)tx(d,E[0]-8,E[1]-7,'θ','var(--gold)',12,'end');else at(d,E,t/2,40,'θ','var(--gold)',12);
    tx(d,(E[0]+X)/2,gy+16,n(dd)+' m','var(--muted)');
    tx(d,X+9,(T[1]+K[1])/2+4,n(up,2)+' m','var(--c)',12,'start');if(gy-K[1]>=16)tx(d,X+9,(K[1]+gy)/2+4,'1.5 m','var(--muted)',11,'start');
    return {svg:d.out(),read:`距離 ${n(dd)} m、仰角 θ = ${t}°、目の高さ 1.5 m<br>目の高さより上の部分<br>= ${n(dd)} × tan ${t}° = ${n(dd)} × ${n(tan(t),4)} = <b>${n(up,2)}</b> m<br>木の高さ = ${n(up,2)} + 1.5 = <b>${n(up+1.5,2)}</b> m`};}});

/* ---- 相互関係：斜辺が 1 の直角三角形 ---- */
FIGS.h1sankakuhi_sogo=host=>mk(host,{alt:'斜辺の長さが 1 の直角三角形で、三角比の相互関係を確かめる図',
  sliders:[{k:'t',label:'θ（度）',min:10,max:80,step:5,v:35}],play:{k:'t',from:10,to:80,label:'θ を大きくする',ms:3200},
  draw(v){const t=v.t,O=[66,212],R=170,P=pc(O,R,t),H=[P[0],O[1]],d=draw(),s=sin(t),c=cos(t),s2=Math.round(s*s*1000)/1000,inside=t>=25&&t<50,m=mid(O,P);
    arc(d,O,R,0,90,DSH);d.poly([O,H,P],FC).poly([O,H,P],INK);rt(d,H,O,P,7);seg(d,O,P,HG);
    d.angle(O[0],O[1],26,0,t,MG);ang(d,P,H,O,20,MC);
    if(t<22||t>62)tx(d,O[0]-8,O[1]-7,'θ','var(--gold)',12,'end');else at(d,O,t/2,40,'θ','var(--gold)',12);tx(d,P[0]+8,P[1]-7,'90°−θ','var(--c)',11,'start');
    tx(d,m[0]-7,m[1]-7,'1','var(--gold)',12,'end');tx(d,(O[0]+H[0])/2,O[1]+17,'cos θ','var(--muted)');
    tx(d,P[0]+(inside?-8:8),(P[1]+H[1])/2+4,'sin θ','var(--muted)',12,inside?'end':'start');
    return {svg:d.out(),read:`θ = ${t}°（斜辺 = 1）<br>対辺 sin θ = <b>${n(s,3)}</b>、隣辺 cos θ = <b>${n(c,3)}</b><br>sin²θ + cos²θ = ${n(s2,3)} + ${n(1-s2,3)} = <b>1</b><br>tan θ = sin θ ÷ cos θ = <b>${n(s/c,3)}</b><br>もう1つの鋭角は 90° − θ = ${90-t}°`};}});

/* ---- 三角比の拡張：半円上の点の座標（arg.sym で 180°−θ の図） ---- */
FIGS.h1sankakuhi_hanen=(host,arg)=>{const sym=!!(arg&&arg.sym);
  mk(host,{alt:sym?'半円上で、角 θ の点と角 180°−θ の点が y 軸について対称になることを示す図':'半径 r の半円上の点 P の座標で三角比を決める図',
  sliders:sym?[{k:'t',label:'θ（度）',min:0,max:180,step:5,v:40}]:[{k:'t',label:'θ（度）',min:0,max:180,step:5,v:50},{k:'r',label:'半径 r',min:2,max:3,step:.5,v:2}],
  play:{k:'t',from:0,to:180,label:'θ を 0° から 180° まで動かす',ms:4200},
  draw(v){const t=v.t,r=sym?1:v.r,u=sym?128:44,O=[170,204],R=r*u,P=pc(O,R,t),H=[P[0],O[1]],d=draw(),x=r*cos(t),y=r*sin(t),s=sin(t),c=cos(t);
    d.line(12,O[1],328,O[1],SUB).line(O[0],226,O[0],38,SUB);tx(d,323,O[1]-6,'x','var(--muted)',11);tx(d,O[0]+9,46,'y','var(--muted)',11);
    arc(d,O,R,0,180,INK);tx(d,O[0]+R,O[1]+15,n(r),'var(--muted)',11);tx(d,O[0]-R,O[1]+15,'−'+n(r),'var(--muted)',11);tx(d,O[0]+(t>90?9:-9),O[1]+15,'O','var(--muted)',11);
    let read;
    if(sym){const Q=pc(O,R,180-t),K=[Q[0],O[1]];
      if(t!==90)seg(d,P,Q,DSH);if(s>.05){seg(d,P,H,DSH);seg(d,Q,K,DSH);}
      d.angle(O[0],O[1],34,0,180-t,MC);d.angle(O[0],O[1],20,0,t,MG);seg(d,O,Q,MC);seg(d,O,P,MG);
      d.dot(Q[0],Q[1],'var(--c)',4).dot(P[0],P[1],'var(--gold)',4);
      if(t===90)nm(d,P,'P = Q',O,13);else{nm(d,P,'P',O,13,'var(--gold)');nm(d,Q,'Q',O,13,'var(--c)');}
      read=`θ = ${t}° のとき、180° − θ = ${180-t}°<br>P（角 ${t}°）の座標 (${n(c,3)}, ${n(s,3)})<br>Q（角 ${180-t}°）の座標 (${n(-c,3)}, ${n(s,3)})<br>sin ${180-t}° = sin ${t}° = <b>${n(s,3)}</b><br>cos ${180-t}° = −cos ${t}° = <b>${n(-c,3)}</b>`;}
    else{
      if(s>.12&&Math.abs(c)>.12){d.poly([O,H,P],FC);rt(d,H,O,P,7);}
      seg(d,O,H,HC);seg(d,H,P,HK);seg(d,O,P,MG);
      if(t>0)d.angle(O[0],O[1],20,0,t,MG);if(t>=20)at(d,O,t>=150?62:t/2,36,'θ','var(--gold)',12);
      if(Math.abs(c)>.2)tx(d,(O[0]+H[0])/2,O[1]+15,'x','var(--c)');
      if(s>.2){const io=(Math.abs(c)>.5?-1:1)*(t<=90?1:-1);tx(d,P[0]+io*10,(P[1]+O[1])/2+4,'y','var(--ok)');}
      d.dot(P[0],P[1],'var(--gold)',4);nm(d,P,'P',O,13);
      read=`θ = ${t}°、r = ${n(r)}<br>P の座標 (x, y) = (${n(x,3)}, ${n(y,3)})<br>sin θ = y ÷ r = <b>${n(s,3)}</b><br>cos θ = x ÷ r = <b>${n(c,3)}</b><br>`+(t===90?'x = 0 なので、tan 90° は定義しない':`tan θ = y ÷ x = <b>${n(s/c,3)}</b>`)+(t>90&&t<180?'<br>θ が鈍角のとき x は負。cos θ と tan θ は負':'');}
    return {svg:d.out(),read};}});};

/* ---- 直線の傾きと正接 ---- */
FIGS.h1sankakuhi_katamuki=host=>mk(host,{alt:'原点を通る直線が x 軸の正の向きとなす角 θ と、直線の傾きの関係を示す図',
  sliders:[{k:'t',label:'θ（度）',min:0,max:175,step:5,v:60}],play:{k:'t',from:0,to:175,label:'直線を回す',ms:4000},
  draw(v){const t=v.t,p=plot([-3.4,3.4,-2.5,2.5]).grid(),L=6,m=tan(t),ox=p.sx(0),oy=p.sy(0);
    p.seg(-L*cos(t),-L*sin(t),L*cos(t),L*sin(t),CST);
    if(t!==90&&Math.abs(m)<=2.3){p.seg(1,0,1,m,'stroke="var(--gold)" stroke-width="2.6"').dot(1,m,'var(--gold)');p.txt(1,m,'m',`dx="9" dy="${Math.abs(m)>=.4?4:m>=0?-8:15}" fill="var(--gold)"`);}
    let svg=p.out();
    if(t>0){const q=pc([ox,oy],24,t),la=pc([ox,oy],38,t>150?60:t/2);svg+=`<path d="M${f(ox+24)},${f(oy)} A24,24 0 0 0 ${f(q[0])},${f(q[1])}" stroke="var(--gold)" stroke-width="2" fill="none"/>`;
      if(t>=25)svg+=`<text x="${f(la[0])}" y="${f(la[1]+4)}" font-size="12" font-family="var(--f-mono)" fill="var(--gold)" text-anchor="middle" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5">θ</text>`;}
    const read=t===90?'θ = 90°<br>x 軸に垂直な直線<br>tan 90° は定義しないので、傾きも定義しない':t===0?'θ = 0°<br>傾き m = tan 0° = <b>0</b><br>直線の式：y = 0（x 軸と重なる）':
      `θ = ${t}°<br>傾き m = tan ${t}° = <b>${n(m,3)}</b><br>直線の式：y = ${n(m,3)}x`+(Math.abs(m)<=2.3?'<br>金色の線分は、x = 1 のときの y の値':'')+(t>90?'<br>θ が鈍角のとき、傾きは負':'');
    return {svg,read};}});

/* ---- 正弦定理：円に内接する三角形を動かす ---- */
FIGS.h1sankakuhi_seigen=host=>mk(host,{alt:'半径 5 の円に内接する三角形を動かして、辺と向かいの角の sin の比を調べる図',
  sliders:[{k:'A',label:'角 A（度）',min:30,max:130,step:5,v:60},{k:'p',label:'点 A の位置',min:0,max:100,step:1,v:40}],play:{k:'p',from:0,to:100,label:'A を円周上で動かす',ms:3600},
  draw(v){const O=[170,127],R=100,A0=v.A,aC=-90+A0,span=360-2*A0,m=Math.min(20,span*.2),aA=aC+m+(span-2*m)*v.p/100,B=pc(O,R,-90-A0),C=pc(O,R,aC),A=pc(O,R,aA),d=draw(),u=20;
    const a=dist(B,C)/u,b=dist(C,A)/u,c=dist(A,B)/u,Bd=(aA-aC)/2,Cd=180-A0-Bd;   // 角 B は弧 CA に対する円周角
    d.circle(O[0],O[1],R,SUB).poly([A,B,C],FC).poly([A,B,C],INK);seg(d,B,C,HC);ang(d,A,B,C,Math.min(20,dist(A,foot(A,B,C))*.45),MG);
    d.dot(O[0],O[1],'var(--muted)',2.5);
    nm(d,A,'A',O,13);nm(d,B,'B',O,13);nm(d,C,'C',O,13);
    len(d,B,C,'a',A,11,'var(--c)');len(d,C,A,'b',B,10);len(d,A,B,'c',C,10);
    return {svg:d.out(),read:`A = ${A0}°、B = ${n(Bd,1)}°、C = ${n(Cd,1)}°<br>a ÷ sin A = ${n(a,2)} ÷ ${n(sin(A0),3)} = <b>${n(a/sin(A0),2)}</b><br>b ÷ sin B = ${n(b,2)} ÷ ${n(sin(Bd),3)} = <b>${n(b/sin(Bd),2)}</b><br>c ÷ sin C = ${n(c,2)} ÷ ${n(sin(Cd),3)} = <b>${n(c/sin(Cd),2)}</b><br>外接円の直径 2R = 10`};}});

/* ---- なぜ：正弦定理の証明（arg.c = 1 鋭角、2 直角、3 鈍角） ---- */
FIGS.h1sankakuhi_seigen_proof=(host,arg)=>{const cs=(arg&&arg.c)||1;
  mk(host,Object.assign(STEP(cs===2?3:4),{alt:['角 A が鋭角の場合の、正弦定理の証明の図','角 A が直角の場合の、正弦定理の証明の図','角 A が鈍角の場合の、正弦定理の証明の図'][cs-1],
  draw(v){const s=v.s,O=[170,126],R=100,d=draw(),pt=a=>pc(O,R,a);let read,A,B,C,D;
    d.circle(O[0],O[1],R,SUB);
    if(cs===1){B=pt(215);C=pt(325);A=pt(100);D=pt(35);
      if(s>=4)d.poly([B,C,D],FG);
      if(s>=3)arc(d,O,R,215,325,HC);
      d.poly([A,B,C],INK);ang(d,A,B,C,22,MG);len(d,B,C,'a',A,12,'var(--c)');
      if(s>=2){seg(d,B,D,GD);nm(d,D,'D',O);len(d,B,O,'2R',C,11,'var(--gold)');}
      if(s>=3){seg(d,C,D);ang(d,D,B,C,24,MG);angT(d,D,B,C,38,'A','var(--gold)',12);rt(d,C,B,D,9,MG);}
      read=['<b>手順 1</b>　△ABC と外接円（半径 R）<br>A が鋭角の場合<br>辺 a と角 A の関係を調べる','<b>手順 2</b>　B を通る直径 BD を引く<br>BD = 2R','<b>手順 3</b>　弧 BC に対する円周角は等しい<br>∠BDC = ∠BAC = A<br>BD は直径なので ∠BCD = 90°','<b>手順 4</b>　直角三角形 BCD で<br>sin A = BC ÷ BD = a ÷ 2R<br><b>a ÷ sin A = 2R</b>'][s-1];}
    else if(cs===2){B=pt(180);C=pt(0);A=pt(118);
      d.poly([A,B,C],INK);rt(d,A,B,C,9,MG);
      if(s>=2){seg(d,B,C,HG);tx(d,O[0]+40,O[1]+17,'a = 2R','var(--gold)');}else len(d,B,C,'a',A,12,'var(--c)');
      read=['<b>手順 1</b>　A = 90° の場合','<b>手順 2</b>　円周角が 90° なので<br>辺 BC は外接円の直径<br>a = 2R','<b>手順 3</b>　sin 90° = 1 なので<br>a ÷ sin A = 2R ÷ 1<br><b>a ÷ sin A = 2R</b>'][s-1];}
    else{B=pt(165);C=pt(15);A=pt(100);D=pt(345);
      if(s>=4)d.poly([B,C,D],FG);
      d.poly([A,B,C],INK);ang(d,A,B,C,22,MG);len(d,B,C,'a',D,11,'var(--c)');
      if(s>=2){seg(d,B,D,GD);nm(d,D,'D',O);len(d,O,D,'2R',C,12,'var(--gold)');}
      if(s>=3){seg(d,C,D);ang(d,D,B,C,26,MC);tx(d,D[0]-12,D[1]-30,'180°−A','var(--c)',11,'end');rt(d,C,B,D,9,MG);}
      read=['<b>手順 1</b>　A が鈍角の場合','<b>手順 2</b>　B を通る直径 BD を引く<br>BD = 2R','<b>手順 3</b>　BD は直径なので ∠BCD = 90°<br>四角形 ABDC は円に内接するので<br>∠BDC = 180° − A','<b>手順 4</b>　直角三角形 BCD で<br>a = 2R sin(180° − A) = 2R sin A<br><b>a ÷ sin A = 2R</b>'][s-1];}
    d.dot(O[0],O[1],'var(--ink)',2.5);tx(d,O[0]+(cs===1?-11:cs===2?0:4),O[1]+(cs===1?-6:-9),'O');nm(d,A,'A',O);nm(d,B,'B',O);nm(d,C,'C',O);
    return {svg:d.out(),read};}}));};

/* ---- 余弦定理：間の角を動かす ---- */
FIGS.h1sankakuhi_yogen=host=>mk(host,{alt:'2辺 b, c を固定して間の角 A を動かし、残りの辺 a の変化を調べる図',
  sliders:[{k:'A',label:'角 A（度）',min:20,max:160,step:5,v:60},{k:'b',label:'辺 b（c は 4 に固定）',min:2,max:4,step:.5,v:3}],play:{k:'A',from:20,to:160,label:'角 A を広げる',ms:3600},
  draw(v){const t=v.A,b=v.b,c=4,u=34,A=[172,206],B=[A[0]+c*u,206],C=[A[0]+b*u*cos(t),206-b*u*sin(t)],d=draw(),cA=Math.abs(cos(t))<1e-12?0:cos(t),a2=b*b+c*c-2*b*c*cA,a=Math.sqrt(a2);
    d.poly([A,B,C],FC).poly([A,B,C],INK);seg(d,B,C,HG);d.angle(A[0],A[1],20,0,t,MC);angV(d,A,t);
    if(t===90)rt(d,A,B,C,8);
    tx(d,A[0]+(t>130?4:-8),A[1]+16,'A');tx(d,B[0]+10,B[1]+5,'B');nm(d,C,'C',cen([A,B,C]),13);
    len(d,A,C,'b',B,11);tx(d,(A[0]+B[0])/2+24,A[1]+16,'c','var(--muted)');len(d,B,C,'a',A,12,'var(--gold)');
    return {svg:d.out(),read:`b = ${n(b)}、c = 4、A = ${t}°<br>a² = b² + c² − 2bc cos A<br>= ${n(b*b)} + 16 − ${n(2*b*c)} × ${cA<0?'('+n(cA,3)+')':n(cA,3)} = <b>${n(a2,2)}</b><br>a = <b>${n(a,3)}</b><br>`+
      (t===90?'A = 90° のとき cos A = 0。三平方の定理 a² = b² + c² になる':t<90?`A が鋭角のとき、a² は b² + c² = ${n(b*b+16)} より小さい`:`A が鈍角のとき、a² は b² + c² = ${n(b*b+16)} より大きい`)};}});

/* ---- なぜ：余弦定理の証明（arg.c = 1 垂線の足が辺の上、2 A が鈍角） ---- */
FIGS.h1sankakuhi_yogen_proof=(host,arg)=>{const cs=(arg&&arg.c)||1;
  mk(host,Object.assign(STEP(4),{alt:['垂線の足が辺 AB 上にある場合の、余弦定理の証明の図','角 A が鈍角の場合の、余弦定理の証明の図'][cs-1],
  draw(v){const s=v.s,d=draw(),y0=192;let A,B,C,H,read;
    if(cs===1){A=[55,y0];B=[295,y0];C=[135,58];H=[135,y0];
      if(s===2||s===3)d.poly([A,H,C],FC);if(s>=4)d.poly([B,C,H],FG);
      d.poly([A,B,C],INK);ang(d,A,B,C,22,MG);
      if(s>=2){seg(d,C,H,GD);rt(d,H,C,B,8);tx(d,H[0]+8,(C[1]+H[1])/2+12,'b sin A','var(--gold)',12,'start');tx(d,(A[0]+H[0])/2-4,y0+17,'b cos A','var(--c)');tx(d,H[0],y0+17,'H');d.dot(H[0],H[1],'var(--ink)',2.5);}
      if(s>=3)tx(d,(H[0]+B[0])/2,y0+17,'c − b cos A','var(--ok)');
      dim(d,A[0],B[0],y0+28,'c');
      read=['<b>手順 1</b>　△ABC で b, c, A が分かっている<br>a を b, c, A で表したい','<b>手順 2</b>　C から辺 AB に垂線 CH を引く<br>直角三角形 ACH で<br>CH = b sin A、AH = b cos A','<b>手順 3</b>　BH = AB − AH<br>= c − b cos A','<b>手順 4</b>　直角三角形 BCH で三平方の定理<br>a² = (b sin A)² + (c − b cos A)²<br>= <b>b² + c² − 2bc cos A</b>'][s-1];
      tx(d,A[0]-10,A[1]+5,'A');tx(d,B[0]+10,B[1]+5,'B');tx(d,C[0],C[1]-9,'C');len(d,A,C,'b',B,11,'var(--ink)');len(d,B,C,'a',A,11,'var(--ink)');}
    else{const y1=176;A=[152,y1];B=[300,y1];C=[78,56];H=[78,y1];
      if(s===2||s===3)d.poly([A,H,C],FC);if(s>=4)d.poly([B,C,H],FG);
      d.poly([A,B,C],INK);ang(d,A,B,C,13,MG);
      if(s>=2){seg(d,C,H,GD);seg(d,H,A,DSH);rt(d,H,C,A,8);ang(d,A,C,H,20,MC);tx(d,A[0]-25,A[1]-7,'180°−A','var(--c)',10,'end');
        tx(d,H[0]-8,(C[1]+H[1])/2+4,'b sin A','var(--gold)',12,'end');dim(d,H[0],A[0],y1+24,'−b cos A','var(--c)');tx(d,H[0]-10,y1+5,'H');d.dot(H[0],H[1],'var(--ink)',2.5);}
      tx(d,(A[0]+B[0])/2,y1+17,'c','var(--muted)');
      if(s>=3)dim(d,H[0],B[0],y1+48,'c − b cos A','var(--ok)');
      read=['<b>手順 1</b>　A が鈍角の場合','<b>手順 2</b>　垂線の足 H は、辺 BA の延長上<br>∠CAH = 180° − A<br>CH = b sin(180° − A) = b sin A<br>AH = b cos(180° − A) = −b cos A','<b>手順 3</b>　BH = AB + AH<br>= c + (−b cos A) = c − b cos A','<b>手順 4</b>　直角三角形 BCH で三平方の定理<br>a² = (b sin A)² + (c − b cos A)²<br>= <b>b² + c² − 2bc cos A</b>'][s-1];
      tx(d,A[0]+4,A[1]+17,'A');tx(d,B[0]+10,B[1]+5,'B');tx(d,C[0],C[1]-9,'C');len(d,A,C,'b',B,11,'var(--ink)');len(d,B,C,'a',A,11,'var(--ink)');}
    return {svg:d.out(),read};}}));};

/* ---- 応用：測量（対岸の地点までの距離） ---- */
FIGS.h1sankakuhi_kawa=host=>mk(host,{alt:'川のこちら側の2地点から対岸の地点を見た角を測り、距離を求める図',
  sliders:[{k:'A',label:'∠A（度）',min:30,max:80,step:5,v:60},{k:'B',label:'∠B（度）',min:30,max:70,step:5,v:50}],
  draw(v){const a0=v.A,b0=v.B,c0=180-a0-b0,AC=100*sin(b0)/sin(c0),BC=100*sin(a0)/sin(c0),h=AC*sin(a0),u=Math.min(2.3,150/h),gy=212,A=[170-50*u,gy],B=[170+50*u,gy],C=[A[0]+AC*cos(a0)*u,gy-h*u],d=draw();
    d.poly([[0,C[1]+14],[340,C[1]+14],[340,gy-16],[0,gy-16]],'fill="var(--c)" fill-opacity=".16" stroke="none"');tx(d,22,(C[1]+14+gy-16)/2+4,'川','var(--c)',12);
    d.poly([A,B,C],INK);seg(d,A,C,HG);d.angle(A[0],A[1],18,0,a0,MG);d.angle(B[0],B[1],18,180-b0,180,MC);
    at(d,A,a0/2,32,a0+'°','var(--gold)');at(d,B,180-b0/2,32,b0+'°','var(--c)');
    tx(d,A[0]-10,gy+5,'A');tx(d,B[0]+10,gy+5,'B');tx(d,C[0],C[1]-9,'C');tx(d,170,gy+18,'100 m','var(--muted)');
    return {svg:d.out(),read:`AB = 100 m、∠A = ${a0}°、∠B = ${b0}°<br>∠C = 180° − ${a0}° − ${b0}° = ${c0}°<br>AC = 100 × sin ${b0}° ÷ sin ${c0}° = <b>${n(AC,1)}</b> m<br>BC = 100 × sin ${a0}° ÷ sin ${c0}° = <b>${n(BC,1)}</b> m`};}});

/* ---- 三角形の面積：高さは b sin A ---- */
FIGS.h1sankakuhi_menseki=host=>mk(host,{alt:'2辺 b, c を固定して間の角 A を動かし、高さと面積の変化を調べる図',
  sliders:[{k:'A',label:'角 A（度）',min:20,max:160,step:5,v:50},{k:'b',label:'辺 b（c は 5 に固定）',min:2,max:5,step:.5,v:4}],play:{k:'A',from:20,to:160,label:'角 A を広げる',ms:3600},
  draw(v){const t=v.A,b=v.b,c=5,u=29,A=[168,204],B=[A[0]+c*u,204],C=[A[0]+b*u*cos(t),204-b*u*sin(t)],H=[C[0],204],d=draw(),h=b*sin(t),S=.5*c*h;
    d.poly([A,B,C],FC).poly([A,B,C],INK);if(t>90)seg(d,H,A,DSH);
    if(t!==90){seg(d,C,H,GD);rt(d,H,C,t>90?A:B,7);}else seg(d,C,H,MG);
    d.angle(A[0],A[1],20,0,t,MC);angV(d,A,t,'var(--c)',t<90&&H[0]-A[0]<62);
    tx(d,A[0]+(t>130?4:-8),A[1]+16,'A');tx(d,B[0]+10,B[1]+5,'B');nm(d,C,'C',cen([A,B,C]),13);if(t>90||(t<90&&H[0]-A[0]>50&&B[0]-H[0]>16))tx(d,H[0],H[1]+16,'H','var(--muted)');
    len(d,A,C,'b',B,11);dim(d,A[0],B[0],A[1]+24,'c = 5');
    {const rgt=t<=90&&B[0]-H[0]>=H[0]-A[0];tx(d,H[0]+(rgt?8:-8),H[1]-(H[1]-C[1])*(t>90?.5:.34)+4,n(h,2),'var(--gold)',12,rgt?'start':'end');}
    return {svg:d.out(),read:`b = ${n(b)}、c = 5、A = ${t}°<br>高さ CH = b sin A = ${n(b)} × ${n(sin(t),3)} = <b>${n(h,3)}</b><br>S = 1/2 × c × CH = 1/2 × 5 × ${n(h,3)} = <b>${n(S,2)}</b><br>`+(t===90?'A = 90° のとき、高さは b で、面積は最大':`A = ${180-t}° でも sin A は同じ値。面積も同じ`)};}});

/* ---- 内接円の半径と面積 ---- */
FIGS.h1sankakuhi_naisetsu=host=>mk(host,Object.assign(STEP(3),{alt:'三角形を内接円の中心と3頂点を結ぶ線で3つに分け、面積と内接円の半径の関係を示す図',
  draw(v){const s=v.s,d=draw(),A=[128,34],B=[38,210],C=[304,210],a=dist(B,C),b=dist(C,A),c=dist(A,B),p=a+b+c,I=[(a*A[0]+b*B[0]+c*C[0])/p,(a*A[1]+b*B[1]+c*C[1])/p],r=I[1]-210<0?210-I[1]:0,Fa=foot(I,B,C),Fb=foot(I,C,A),Fc=foot(I,A,B);
    if(s>=2){d.poly([I,B,C],FC).poly([I,C,A],FG).poly([I,A,B],FK);}
    d.poly([A,B,C],INK).circle(I[0],I[1],r,SUB);
    if(s>=2){seg(d,I,A,DSH);seg(d,I,B,DSH);seg(d,I,C,DSH);}
    seg(d,I,Fa,MG);rt(d,Fa,I,C,7);tx(d,I[0]+9,(I[1]+Fa[1])/2+6,'r','var(--gold)');
    if(s>=3){seg(d,I,Fb,MG);rt(d,Fb,I,A,7);seg(d,I,Fc,MG);rt(d,Fc,I,B,7);const mb=mid(I,Fb),mc=mid(I,Fc);tx(d,mb[0]-3,mb[1]-6,'r','var(--gold)');tx(d,mc[0]+4,mc[1]-6,'r','var(--gold)');}
    d.dot(I[0],I[1],'var(--ink)',2.5);tx(d,I[0]-9,I[1]-6,'I');
    tx(d,A[0],A[1]-9,'A');tx(d,B[0]-10,B[1]+5,'B');tx(d,C[0]+10,C[1]+5,'C');
    tx(d,(B[0]+C[0])/2+40,B[1]+17,'a','var(--muted)');len(d,C,A,'b',B,11);len(d,A,B,'c',C,11);
    return {svg:d.out(),read:['<b>手順 1</b>　△ABC の内接円<br>中心 I、半径 r<br>内接円は、3つの辺に接する','<b>手順 2</b>　I と3つの頂点を結ぶ<br>△ABC が、△IBC、△ICA、△IAB に分かれる','<b>手順 3</b>　3つの三角形の高さは、どれも r<br>S = 1/2·ar + 1/2·br + 1/2·cr<br><b>S = 1/2·r(a + b + c)</b>'][s-1]};}}));

/* ---- 空間図形：測量（塔の高さ） ---- */
FIGS.h1sankakuhi_tou=host=>mk(host,{alt:'水平面上の2地点から塔の真下の点を見た角と、塔の先端の仰角から、塔の高さを求める手順の図',
  sliders:[{k:'s',label:'手順',min:1,max:3,step:1,v:1},{k:'t',label:'仰角 θ（度）',min:30,max:60,step:15,v:60}],play:{k:'s',from:1,to:3,label:'順に見る',ms:3300},
  draw(v){const s=v.s,t=v.t,d=draw(),A=[42,198],B=[292,224],H=[218,152],k={30:64,45:94,60:124}[t],P=[218,152-k],AH=100*sin(45)/sin(60),PH=AH*tan(t);
    if(s===2)d.poly([A,B,H],FC);if(s===3)d.poly([A,H,P],FG);
    d.poly([A,B,H],INK);seg(d,H,P,'stroke="var(--ok)" stroke-width="4" stroke-linecap="round"');seg(d,A,P,GD);rt(d,H,A,P,7,s===3?MG:SUB);
    ang(d,A,B,H,44,MC);ang(d,B,A,H,26,MC);ang(d,A,H,P,48,MG);
    at(d,A,5,62,'75°','var(--c)');at(d,B,150,40,'45°','var(--c)');at(d,A,dir(A,H)+(dir(A,P)-dir(A,H))/2,62,'θ','var(--gold)',12);
    if(s>=2){ang(d,H,A,B,16,MK);at(d,H,254,29,'60°','var(--ok)');}
    tx(d,A[0]-10,A[1]+5,'A');tx(d,B[0]+10,B[1]+5,'B');tx(d,H[0]+11,H[1]+6,'H');tx(d,P[0],P[1]-9,'P');
    tx(d,(A[0]+B[0])/2,(A[1]+B[1])/2+17,'100 m','var(--muted)');
    if(s===3)tx(d,P[0]+9,(P[1]+H[1])/2+4,n(PH,1)+' m','var(--gold)',12,'start');
    return {svg:d.out(),read:[`<b>手順 1</b>　水平な地面に A, B, H がある<br>AB = 100 m、∠HAB = 75°、∠HBA = 45°<br>A から塔の先端 P を見上げた角 θ = ${t}°`,
      '<b>手順 2</b>　地面の △ABH を取り出す<br>∠AHB = 180° − 75° − 45° = 60°<br>正弦定理：AH ÷ sin 45° = 100 ÷ sin 60°<br>AH = 100√6/3 ≈ 81.65 m',
      `<b>手順 3</b>　PH は地面に垂直。直角三角形 PAH で<br>PH = AH × tan ${t}° = 81.65 × ${n(tan(t),4)}<br>≈ <b>${n(PH,1)}</b> m`][s-1]};}});

/* ---- 空間図形：正四面体の高さと体積 ---- */
FIGS.h1sankakuhi_shimentai=host=>mk(host,Object.assign(STEP(4),{alt:'1辺 6 の正四面体の高さと体積を求める手順の図',
  draw(v){const s=v.s,d=draw(),B=[48,196],C=[232,230],D=[302,152],H=cen([B,C,D]),A=[H[0],34];
    if(s===4)d.poly([B,C,D],FC);if(s===3)d.poly([A,B,H],FG);
    seg(d,B,D,DSH);seg(d,A,B);seg(d,A,C);seg(d,A,D);seg(d,B,C);seg(d,C,D);
    seg(d,A,H,s===3?MG:DSH);rt(d,H,A,B,7,s===3?MG:SUB);
    if(s>=2){seg(d,B,H,HC);seg(d,C,H,DSH);seg(d,D,H,DSH);}
    d.dot(H[0],H[1],'var(--ink)',2.5);
    tx(d,A[0],A[1]-9,'A');tx(d,B[0]-10,B[1]+5,'B');tx(d,C[0]+4,C[1]+15,'C');tx(d,D[0]+10,D[1]+4,'D');tx(d,H[0]+11,H[1]+13,'H');
    len(d,A,B,'6',D,11);len(d,B,C,'6',A,11);
    if(s>=2)tx(d,mid(B,H,.8)[0],mid(B,H,.8)[1]+15,'2√3','var(--c)',11);
    if(s>=3)tx(d,A[0]+8,(A[1]+H[1])/2,'2√6','var(--gold)',11,'start');
    return {svg:d.out(),read:['<b>手順 1</b>　1辺 6 の正四面体 ABCD<br>頂点 A から底面 BCD に垂線 AH を引く<br>AH が高さ','<b>手順 2</b>　AB = AC = AD なので BH = CH = DH<br>H は正三角形 BCD の外接円の中心<br>正弦定理：6 ÷ sin 60° = 2 × BH<br>BH = 2√3','<b>手順 3</b>　直角三角形 ABH で<br>AH² = 6² − (2√3)² = 36 − 12 = 24<br>AH = 2√6 ≈ <b>4.90</b>','<b>手順 4</b>　底面積 = 1/2 × 6 × 6 × sin 60° = 9√3<br>体積 = 1/3 × 9√3 × 2√6<br>= <b>18√2</b> ≈ 25.46'][s-1]};}}));

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
const Q={
 tri23:{alt:'角 C が直角で、BC が 2、AC が 3 の直角三角形 ABC の図',h:196,f(d){const A=[70,160],C=[250,160],B=[250,40];
   d.poly([A,C,B],INK);rt(d,C,A,B,8);ang(d,A,C,B,26,MG);at(d,A,17,42,'θ','var(--gold)',12);
   tx(d,A[0]-10,A[1]+5,'A');tx(d,B[0]+4,B[1]-8,'B');tx(d,C[0]+10,C[1]+5,'C');tx(d,160,177,'3','var(--muted)');tx(d,261,104,'2','var(--muted)');return '∠C = 90°、BC = 2、AC = 3';}},
 saka:{alt:'水平面に対して 10 度かたむいた、長さ 200 m の坂道の図',h:150,f(d){const A=[36,116],C=[300,116],B=[300,116-264*tan(10)];
   d.poly([A,C,B],FC).poly([A,C,B],INK);seg(d,A,B,HG);rt(d,C,A,B,7);d.angle(A[0],A[1],46,0,10,MG);tx(d,A[0]-5,A[1]+4,'10°','var(--gold)',11,'end');
   len(d,A,B,'200 m',C,12,'var(--gold)');tx(d,C[0]+8,(B[1]+C[1])/2+4,'高さ','var(--c)',11,'start');tx(d,168,133,'水平方向の距離','var(--muted)',11);return '坂道の長さ 200 m、傾き 10°';}},
 tatemono:{alt:'建物から離れた2地点 A, B で、建物の上端 P の仰角を測る図',h:214,f(d){const u=3.4,H=[282,182],B=[H[0]-20*u,182],A=[B[0]-40*u,182],P=[H[0],182-20*Math.sqrt(3)*u];
   d.line(10,182,330,182,SUB).poly([P,[P[0]+24,P[1]],[H[0]+24,182],H],'fill="var(--c)" fill-opacity=".24" stroke="var(--c)" stroke-width="1.2"');
   seg(d,A,P);seg(d,B,P);seg(d,P,H,INK);rt(d,H,B,P,7);d.angle(A[0],A[1],30,0,30,MG);d.angle(B[0],B[1],18,0,60,MC);
   tx(d,A[0]+46,A[1]-7,'30°','var(--gold)',11);tx(d,B[0]+30,B[1]-9,'60°','var(--c)',11);
   tx(d,A[0],A[1]+16,'A');tx(d,B[0],B[1]+16,'B');tx(d,H[0],H[1]+16,'H');tx(d,P[0],P[1]-8,'P');tx(d,(A[0]+B[0])/2,198,'40 m','var(--muted)');tx(d,P[0]+34,125,'h','var(--muted)');return '∠PAH = 30°、∠PBH = 60°、AB = 40 m';}},
 gen120:{alt:'半径 6 の円 O で、中心角 120 度に対する弦 AB と、円周上の点 P の図',h:226,f(d){const O=[170,112],R=92,A=pc(O,R,210),B=pc(O,R,330),P=pc(O,R,78),H=foot(O,A,B);
   d.circle(O[0],O[1],R,INK);seg(d,P,A,SUB);seg(d,P,B,SUB);seg(d,O,A);seg(d,O,B);seg(d,A,B,HC);seg(d,O,H,DSH);rt(d,H,O,B,7);
   ang(d,O,A,B,16,MG);tx(d,O[0]+26,O[1]+24,'120°','var(--gold)',11);ang(d,P,A,B,24,MC);
   d.dot(O[0],O[1],'var(--ink)',2.5);tx(d,O[0],O[1]-9,'O');names(d,[A,B,P],'ABP',O);tx(d,H[0],H[1]+15,'H');len(d,O,A,'6',B,10);return '半径 6、∠AOB = 120°、OH ⊥ AB';}},
 ssa:{alt:'a が ルート2、b が 2、角 A が 30 度である三角形が2つできることを示す図',h:196,f(d){const k=80,y=150,A=[30,y],C=[30+2*k*cos(30),y-2*k*sin(30)],r=Math.SQRT2*k,w=Math.sqrt(r*r-k*k),H=[C[0],y],B1=[H[0]+w,y],B2=[H[0]-w,y];
   d.line(A[0],y,322,y,SUB);arc(d,C,r,208,332,DSH);seg(d,A,C);seg(d,C,B1);seg(d,C,B2,MC);seg(d,A,B1);
   d.angle(A[0],A[1],30,0,30,MG);tx(d,A[0]+44,A[1]-7,'30°','var(--gold)',11);
   tx(d,A[0]-10,A[1]+5,'A');tx(d,C[0],C[1]-9,'C');tx(d,B1[0]+12,B1[1]+15,'B');tx(d,B2[0]-12,B2[1]+15,'B′','var(--c)');
   len(d,A,C,'2',B1,11);len(d,C,B1,'√2',A,13);tx(d,mid(C,B2)[0]+18,mid(C,B2)[1]+10,'√2','var(--c)');return 'a = √2、b = 2、A = 30° を満たす三角形は △ABC と △AB′C の2つ';}},
 chokkei:{alt:'円に内接する三角形 ABC と、B を通る直径 BD の図。角 BAC が 50 度',h:226,f(d){const O=[170,112],R=92,B=pc(O,R,220),C=pc(O,R,320),A=pc(O,R,100),D=pc(O,R,40);
   d.circle(O[0],O[1],R,SUB);d.poly([A,B,C],INK);seg(d,B,D,GD);seg(d,C,D);ang(d,A,B,C,24,MG);angT(d,A,B,C,38,'50°','var(--gold)');
   d.dot(O[0],O[1],'var(--ink)',2.5);tx(d,O[0]-10,O[1]-6,'O');names(d,[A,B,C,D],'ABCD',O);return 'BD は直径、∠BAC = 50°、BD = 10';}},
 suisenCH:{alt:'鋭角三角形 ABC の頂点 C から辺 AB に垂線 CH を引いた図',h:204,f(d){const A=[50,168],B=[292,168],C=[132,36],H=[132,168];
   d.poly([A,B,C],INK);seg(d,C,H,GD);rt(d,H,C,B,8);ang(d,A,B,C,24,MG);ang(d,B,A,C,26,MC);
   tx(d,A[0]-10,A[1]+5,'A');tx(d,B[0]+10,B[1]+5,'B');tx(d,C[0],C[1]-9,'C');tx(d,H[0],H[1]+16,'H');len(d,A,C,'b',B,11);len(d,B,C,'a',A,11);return 'CH ⊥ AB';}},
 heiko:{alt:'AB が 3、AD が 5、角 A が 60 度の平行四辺形 ABCD と2本の対角線の図',h:206,f(d){const k=40,A=[40,170],D=[40+5*k,170],B=[40+3*k*cos(60),170-3*k*sin(60)],C=[B[0]+5*k,B[1]];
   d.poly([A,B,C,D],INK);seg(d,B,D,MC);seg(d,A,C,MG);d.angle(A[0],A[1],22,0,60,SUB);at(d,A,41,38,'60°','var(--muted)');
   tx(d,A[0]-10,A[1]+5,'A');tx(d,B[0]-9,B[1]-5,'B');tx(d,C[0]+10,C[1]-3,'C');tx(d,D[0]+10,D[1]+5,'D');len(d,A,B,'3',D,11);tx(d,(A[0]+D[0])/2,187,'5','var(--muted)');return 'AB = 3、AD = 5、∠A = 60°';}},
 suisen60:{alt:'AC が 6、AB が 10、角 A が 60 度の三角形 ABC と、C から AB に引いた垂線 CH の図',h:214,f(d){const k=25,A=[46,166],B=[46+10*k,166],C=[46+6*k*cos(60),166-6*k*sin(60)],H=[C[0],166];
   d.poly([A,B,C],INK);seg(d,C,H,GD);rt(d,H,C,B,8);d.angle(A[0],A[1],22,0,60,MG);tx(d,A[0]+36,A[1]-10,'60°','var(--gold)',11);
   tx(d,A[0]-10,A[1]+5,'A');tx(d,B[0]+10,B[1]+5,'B');tx(d,C[0],C[1]-9,'C');tx(d,H[0],H[1]+16,'H');len(d,A,C,'6',B,11);dim(d,A[0],B[0],190,'10');return 'AC = 6、AB = 10、A = 60°、CH ⊥ AB';}},
 chusen:{alt:'三角形 ABC と、辺 BC の中点 M に引いた中線 AM の図',h:210,f(d){const B=[40,172],C=[300,172],A=[118,34],M=[170,172];
   d.poly([A,B,C],INK);seg(d,A,M,MG);tick(d,B,M,2);tick(d,M,C,2);ang(d,M,A,B,18,MG);ang(d,M,C,A,28,MC);
   tx(d,M[0]-28,M[1]-12,'θ','var(--gold)',12);tx(d,M[0]+52,M[1]-14,'180°−θ','var(--c)',11);
   tx(d,A[0],A[1]-9,'A');tx(d,B[0]-10,B[1]+5,'B');tx(d,C[0]+10,C[1]+5,'C');tx(d,M[0],M[1]+17,'M');return 'M は辺 BC の中点、∠AMB = θ';}},
 ike:{alt:'池をはさんだ2地点 A, B と、両方が見える地点 C の図',h:216,f(d){const C=[170,194],A=[C[0]+100*cos(120),C[1]-100*sin(120)],B=[C[0]+160*cos(60),C[1]-160*sin(60)],m=mid(A,B),a=-dir(A,B);
   d.raw(`<ellipse cx="${f(m[0])}" cy="${f(m[1])}" rx="46" ry="19" transform="rotate(${f(a)} ${f(m[0])} ${f(m[1])})" fill="var(--c)" fill-opacity=".24" stroke="var(--c)" stroke-width="1.2"/>`);
   seg(d,A,B,GD);seg(d,C,A);seg(d,C,B);d.angle(C[0],C[1],22,60,120,MG);tx(d,C[0],C[1]-30,'60°','var(--gold)',11);tx(d,m[0],m[1]+4,'池','var(--c)',11);
   d.dot(A[0],A[1],'var(--ink)',3).dot(B[0],B[1],'var(--ink)',3).dot(C[0],C[1],'var(--ink)',3);
   tx(d,A[0]-11,A[1]+2,'A');tx(d,B[0]+11,B[1]+2,'B');tx(d,C[0],C[1]+17,'C');len(d,C,A,'50 m',B,22);len(d,C,B,'80 m',A,22);return 'CA = 50 m、CB = 80 m、∠ACB = 60°';}},
 nitoubun:{alt:'AB が 4、BC が 5、CA が 6 の三角形 ABC と、角 A の二等分線 AD の図',h:228,f(d){const k=40,B=[68,180],C=[68+5*k,180],A=[68+4*k/8,180-4*k*Math.sqrt(63)/8],D=[68+2*k,180];
   d.poly([A,B,C],INK);seg(d,A,D,MG);ang(d,A,B,D,26,MC);ang(d,A,D,C,32,MC);
   tx(d,A[0],A[1]-9,'A');tx(d,B[0]-10,B[1]+5,'B');tx(d,C[0]+10,C[1]+5,'C');tx(d,D[0],D[1]+17,'D');len(d,A,B,'4',C,11);len(d,A,C,'6',B,11);dim(d,B[0],C[0],202,'5');return 'AB = 4、BC = 5、CA = 6、AD は ∠A の二等分線';}},
 naisetsu4:{alt:'円に内接する四角形 ABCD と対角線 AC の図',h:226,f(d){const O=[170,112],R=92,r=7/Math.sqrt(3),ca=L=>2*Math.asin(L/(2*r))/RAD,aA=130,aB=aA+ca(5),aC=aB+ca(8),aD=aC+ca(3),A=pc(O,R,aA),B=pc(O,R,aB),C=pc(O,R,aC),D=pc(O,R,aD),g=cen([A,B,C,D]);
   d.circle(O[0],O[1],R,SUB);d.poly([A,B,C,D],INK);seg(d,A,C,GD);names(d,[A,B,C,D],'ABCD',O);
   len(d,A,B,'5',g,10);len(d,B,C,'8',A,11);len(d,C,D,'3',g,10);len(d,D,A,'5',g,10);return 'AB = 5、BC = 8、CD = 3、DA = 5';}},
 yama:{alt:'水平面上の2地点 A, B と、山頂 P、その真下の点 H の図',h:250,f(d){const A=[30,188],B=[212,224],H=[290,148],P=[290,38];
   d.poly([A,B,H],INK);seg(d,H,P,'stroke="var(--ok)" stroke-width="3.2" stroke-linecap="round"');seg(d,B,P,GD);rt(d,H,B,P,7);
   ang(d,A,B,H,52,MC);ang(d,B,H,A,16,MC);ang(d,B,H,P,46,MG);
   at(d,A,-1,72,'45°','var(--c)');at(d,B,112,31,'105°','var(--c)');at(d,B,dir(B,H)+(dir(B,P)-dir(B,H))/2,62,'30°','var(--gold)');
   tx(d,A[0]-10,A[1]+5,'A');tx(d,B[0]+2,B[1]+16,'B');tx(d,H[0]+12,H[1]+6,'H');tx(d,P[0],P[1]-9,'P');tx(d,(A[0]+B[0])/2,(A[1]+B[1])/2+17,'200 m','var(--muted)');return 'AB = 200 m、∠HAB = 45°、∠HBA = 105°、∠PBH = 30°';}},
 chohotai:{alt:'直方体 ABCD-EFGH と、その中の三角形 AFC の図',h:226,f(d){const u=92,p=(x,y,z)=>[38+x*u+y*58,206-z*u-y*34],r3=Math.sqrt(3),E=p(0,0,0),F=p(r3,0,0),G=p(r3,r3,0),H=p(0,r3,0),A=p(0,0,1),B=p(r3,0,1),C=p(r3,r3,1),D=p(0,r3,1);
   d.poly([A,F,C],FG);seg(d,E,H,DSH);seg(d,H,G,DSH);seg(d,H,D,DSH);d.poly([A,B,F,E],INK).poly([A,B,C,D],INK).poly([B,C,G,F],INK);seg(d,A,F,MG);seg(d,F,C,MG);seg(d,A,C,MG);
   tx(d,A[0]-10,A[1]+2,'A');tx(d,B[0]+2,B[1]-7,'B');tx(d,C[0]+10,C[1]+1,'C');tx(d,D[0]-2,D[1]-7,'D');tx(d,E[0]-10,E[1]+8,'E');tx(d,F[0]+2,F[1]+16,'F');tx(d,G[0]+11,G[1]+6,'G');tx(d,H[0]-9,H[1]-3,'H','var(--muted)');
   tx(d,(E[0]+F[0])/2,E[1]+16,'√3','var(--muted)');tx(d,(F[0]+G[0])/2+14,(F[1]+G[1])/2+10,'√3','var(--muted)');tx(d,E[0]-10,(A[1]+E[1])/2+4,'1','var(--muted)');return 'AB = AD = √3、AE = 1 の直方体';}},
 shimentaiM:{alt:'1辺 2 の正四面体 ABCD と、辺 CD の中点 M、三角形 ABM の図',h:240,f(d){const B=[48,190],C=[232,224],D=[302,146],H=cen([B,C,D]),A=[H[0],28],M=mid(C,D);
   d.poly([A,B,M],FG);seg(d,B,D,DSH);seg(d,B,M,GD);seg(d,A,B);seg(d,A,C);seg(d,A,D);seg(d,B,C);seg(d,C,D);seg(d,A,M,MG);ang(d,M,A,B,20,MC);
   d.dot(M[0],M[1],'var(--ink)',2.5);tx(d,A[0],A[1]-9,'A');tx(d,B[0]-10,B[1]+5,'B');tx(d,C[0]+4,C[1]+15,'C');tx(d,D[0]+10,D[1]+4,'D');tx(d,M[0]+12,M[1]+9,'M');tx(d,M[0]-32,M[1]-14,'θ','var(--c)',12);len(d,A,B,'2',D,11);return '1辺 2 の正四面体、M は辺 CD の中点、∠AMB = θ';}}
};
FIGS.h1sankakuhi_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){const d=draw(),r=q.f(d);return {svg:d.out(),read:r};}});};
})();
