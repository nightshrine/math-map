/* 中学3年「相似な図形」の図（FIGS.m3soji_*）。動かせる図と、問題に付ける図（m3soji_q） */
(function(){
const {draw,n,mk}=FIG;
const f=v=>v.toFixed(1);
const INK='stroke="var(--ink)" stroke-width="1.6" fill="none" stroke-linejoin="round"';
const SUB='stroke="var(--muted)" stroke-width="1.2" fill="none"';
const DSH='stroke="var(--muted)" stroke-width="1.2" fill="none" stroke-dasharray="4 4"';
const HG='stroke="var(--gold)" stroke-width="3.2" fill="none" stroke-linecap="round"';
const HC='stroke="var(--c)" stroke-width="3.2" fill="none" stroke-linecap="round"';
const MG='stroke="var(--gold)" stroke-width="2" fill="none"';
const MC='stroke="var(--c)" stroke-width="2" fill="none"';
const FC='fill="var(--c)" fill-opacity=".24" stroke="none"';
const FG='fill="var(--gold)" fill-opacity=".24" stroke="none"';
const un=(P,Q)=>{const x=Q[0]-P[0],y=Q[1]-P[1],l=Math.hypot(x,y)||1;return [x/l,y/l];};
const mid=(P,Q,t=.5)=>[P[0]+(Q[0]-P[0])*t,P[1]+(Q[1]-P[1])*t];
const cen=ps=>[ps.reduce((s,p)=>s+p[0],0)/ps.length,ps.reduce((s,p)=>s+p[1],0)/ps.length];
const dir=(P,Q)=>Math.atan2(P[1]-Q[1],Q[0]-P[0])*180/Math.PI;
const foot=(P,A,B)=>{const u=un(A,B),t=(P[0]-A[0])*u[0]+(P[1]-A[1])*u[1];return [A[0]+u[0]*t,A[1]+u[1]*t];};
// 文字（線に重なっても読めるよう、地の色でふちどる）
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
const seg=(d,P,Q,st=INK)=>d.line(P[0],P[1],Q[0],Q[1],st);
// 点の名前：点 G（図形の中心など）から見て外側に置く
const nm=(d,P,t,G,k=12,c)=>{const u=un(G,P);return tx(d,P[0]+u[0]*k,P[1]+u[1]*k+4,t,c);};
// 辺の長さ：辺 PQ の中点から、G と反対側へ k だけ離して置く
const len=(d,P,Q,t,G,k=11,c='var(--muted)')=>{const m=mid(P,Q),u=un(P,Q);let x=-u[1],y=u[0];if((m[0]-G[0])*x+(m[1]-G[1])*y<0){x=-x;y=-y;}return tx(d,m[0]+x*k,m[1]+y*k+4,t,c);};
// 角の印：頂点 P、PQ から PR へ（小さい方の角）
const ang=(d,P,Q,R,r=14,st=MG)=>{let a=dir(P,Q),b=dir(P,R);if(b-a>180)b-=360;if(b-a<-180)b+=360;return d.angle(P[0],P[1],r,a,b,st);};
// 直角の印
const rt=(d,P,Q,R,s=8,st=SUB)=>{const u=un(P,Q),w=un(P,R);return d.path(`M${f(P[0]+u[0]*s)},${f(P[1]+u[1]*s)} L${f(P[0]+(u[0]+w[0])*s)},${f(P[1]+(u[1]+w[1])*s)} L${f(P[0]+w[0]*s)},${f(P[1]+w[1]*s)}`,st);};
// 等しい長さの印（辺 PQ の中点に k 本）
const tick=(d,P,Q,k=1,st=SUB)=>{const m=mid(P,Q),u=un(P,Q);for(let i=0;i<k;i++){const o=(i-(k-1)/2)*4,x=m[0]+u[0]*o,y=m[1]+u[1]*o;d.line(x-u[1]*5,y+u[0]*5,x+u[1]*5,y-u[0]*5,st);}return d;};
// 平行の印（辺 PQ の中点に矢じり）
const par=(d,P,Q,st=SUB)=>{const m=mid(P,Q),u=un(P,Q);return d.path(`M${f(m[0]-u[0]*5-u[1]*4)},${f(m[1]-u[1]*5+u[0]*4)} L${f(m[0]+u[0]*3)},${f(m[1]+u[1]*3)} L${f(m[0]-u[0]*5+u[1]*4)},${f(m[1]-u[1]*5-u[0]*4)}`,st);};
const names=(d,P,s,g)=>{s.split('').forEach((c,i)=>nm(d,P[i],c,g));return d;};
const STEP=(k=4)=>({sliders:[{k:'s',label:'手順',min:1,max:k,step:1,v:1}],play:{k:'s',from:1,to:k,label:'順に見る',ms:1100*k}});

/* ---- 相似な図形：3辺が 4, 6, 5 の △ABC と、その k 倍の △DEF ---- */
const tri=(ox,oy,u)=>[[ox+2.25*u,oy-3.307*u],[ox,oy],[ox+6*u,oy]];
function two(k){const P=tri(16,168,15.5),Q=tri(140,168,15.5*k),d=draw().poly(P,INK).poly(Q,INK);
  tx(d,62,214,'△ABC','var(--muted)');tx(d,140+46.5*k,214,'△DEF（k 倍）','var(--muted)');return {d,P,Q,g:cen(P),h:cen(Q)};}
// 頂点の名前：上の頂点は上に、底辺の両端は下に置く
const nm3=(d,P,s)=>{tx(d,P[0][0],P[0][1]-8,s[0]);tx(d,P[1][0]-2,P[1][1]+15,s[1]);tx(d,P[2][0]+2,P[2][1]+15,s[2]);return d;};
const INK2='stroke="var(--ink)" stroke-width="2" fill="none"';
FIGS.m3soji_scale=host=>mk(host,{alt:'三角形 ABC と、それを k 倍にした三角形 DEF の図',
  sliders:[{k:'k',label:'k（何倍にするか）',min:.5,max:2,step:.1,v:1.5}],play:{k:'k',from:.5,to:2,label:'k を 0.5 から 2 まで動かす',ms:3200},
  draw(v){const k=v.k,{d,P,Q,g,h}=two(k),r=7+3*k;
    [[0,1,2,MG],[1,2,0,MC],[2,0,1,INK2]].forEach(([i,j,l,st])=>{ang(d,P[i],P[j],P[l],11,st);ang(d,Q[i],Q[j],Q[l],r,st);});
    [[0,1,4],[1,2,6],[2,0,5]].forEach(([i,j,L])=>{len(d,P[i],P[j],String(L),g);len(d,Q[i],Q[j],n(L*k),h);});
    nm3(d,P,'ABC');nm3(d,Q,'DEF');
    return {svg:d.out(),read:`AB : DE = 4 : ${n(4*k)}<br>BC : EF = 6 : ${n(6*k)}<br>CA : FD = 5 : ${n(5*k)}<br>どの比も <b>1 : ${n(k)}</b>（相似比）<br>3つの角の大きさは変わらない`+(Math.abs(k-1)<1e-6?'<br>k = 1 のときは合同':'')};}});

/* ---- 三角形の相似条件 ---- */
FIGS.m3soji_joken=host=>mk(host,{alt:'三角形の3つの相似条件を、2つの三角形の辺と角で示す図',
  sliders:[{k:'s',label:'相似条件',min:1,max:3,step:1,v:1,fmt:s=>'①②③'[s-1]},{k:'k',label:'k（何倍か）',min:.6,max:2,step:.1,v:1.5}],
  draw(v){const k=v.k,s=v.s,{d,P,Q,g,h}=two(k),r=7+3*k;let read;
    const side=(i,j,L)=>{seg(d,P[i],P[j],HG);seg(d,Q[i],Q[j],HG);len(d,P[i],P[j],String(L),g);len(d,Q[i],Q[j],n(L*k),h);};
    const an=(i,j,l,st)=>{ang(d,P[i],P[j],P[l],11,st);ang(d,Q[i],Q[j],Q[l],r,st);};
    if(s===1){side(0,1,4);side(1,2,6);side(2,0,5);read=`<b>① 3組の辺の比がすべて等しい</b><br>4 : ${n(4*k)} = 6 : ${n(6*k)} = 5 : ${n(5*k)}<br>（どれも 1 : ${n(k)}）`;}
    else if(s===2){side(0,1,4);side(1,2,6);an(1,2,0,MC);read=`<b>② 2組の辺の比とその間の角がそれぞれ等しい</b><br>AB : DE = BC : EF = 1 : ${n(k)}<br>∠B = ∠E`;}
    else{an(1,2,0,MC);an(2,0,1,MG);read=`<b>③ 2組の角がそれぞれ等しい</b><br>∠B = ∠E、∠C = ∠F<br>辺の長さは調べなくてよい`;}
    nm3(d,P,'ABC');nm3(d,Q,'DEF');
    return {svg:d.out(),read};}});

/* ---- 相似の証明：BD ⊥ AC、CE ⊥ AB のとき △ABD ∽ △ACE ---- */
FIGS.m3soji_proof=host=>mk(host,Object.assign(STEP(4),{alt:'三角形 ABC の頂点 B, C から向かいの辺に垂線を引き、相似な三角形を手順で示す図',
  draw(v){const s=v.s,A=[140,26],B=[34,218],C=[306,218],D=foot(B,A,C),E=foot(C,A,B),g=cen([A,B,C]),d=draw(),on=s===2||s===4;
    d.poly([A,B,D],FC).poly([A,C,E],FG).poly([A,B,C],INK);seg(d,B,D);seg(d,C,E);
    rt(d,D,A,B,10,on?HG:SUB);rt(d,E,A,C,10,on?HG:SUB);if(s>=3)ang(d,A,B,C,22,HC);
    names(d,[A,B,C,D,E],'ABCDE',g);
    return {svg:d.out(),read:[`<b>手順 1</b>　色をつけた △ABD と △ACE に注目する`,
      `<b>手順 2</b>　BD ⊥ AC、CE ⊥ AB なので<br>∠ADB = ∠AEC = 90° …①`,
      `<b>手順 3</b>　∠A は2つの三角形に共通<br>∠BAD = ∠CAE …②`,
      `<b>手順 4</b>　①、②より<br>2組の角がそれぞれ等しい<br><b>△ABD ∽ △ACE</b>`][s-1]};}}));

/* ---- 平行線と線分の比：DE ∥ BC ---- */
FIGS.m3soji_heikosen=host=>mk(host,{alt:'三角形 ABC の辺 BC に平行な線分 DE を動かす図',
  sliders:[{k:'x',label:'AD の長さ',min:2,max:7,step:.5,v:4}],play:{k:'x',from:2,to:7,label:'D を A から B の方へ動かす',ms:3200},
  draw(v){const A=[203,60],B=[38,205.5],C=[302,205.5],t=v.x/10,D=mid(A,B,t),E=mid(A,C,t),g=cen([A,B,C]),d=draw();
    d.poly([A,D,E],FG).poly([A,B,C],INK);seg(d,A,D,HG);seg(d,A,E,HG);seg(d,D,E,HC);
    len(d,A,D,n(v.x),g,13,'var(--gold)');len(d,D,B,n(10-v.x),g,13);len(d,A,E,n(8*t),g,13,'var(--gold)');len(d,E,C,n(8-8*t),g,13);
    tx(d,(D[0]+E[0])/2,D[1]-7,n(12*t),'var(--c)');len(d,B,C,'12',g,13);
    names(d,[A,B,C],'ABC',g);tx(d,D[0]-12,D[1]+2,'D');tx(d,E[0]+12,E[1]+2,'E');
    return {svg:d.out(),read:`AD : AB = ${n(v.x)} : 10<br>AE : AC = ${n(8*t)} : 8<br>DE : BC = ${n(12*t)} : 12<br>比の値はどれも <b>${n(t)}</b><br>AD : DB = ${n(v.x)} : ${n(10-v.x)}<br>AE : EC = ${n(8*t)} : ${n(8-8*t)}（上と等しい）`};}});

/* ---- 平行線にはさまれた線分の比 ---- */
function sandan(d,a){const yl=46,yn=190,ym=yl+144*a/10,px=y=>78+(y-yl)*42/144,qx=y=>262-(y-yl)*108/144;
  [[yl,'ℓ'],[ym,'m'],[yn,'n']].forEach(q=>{d.line(26,q[0],322,q[0],INK);tx(d,15,q[0]+4,q[1],'var(--muted)');});
  d.line(px(28),28,px(210),210,INK).line(qx(28),28,qx(210),210,INK);
  return {A:[px(yl),yl],B:[px(ym),ym],C:[px(yn),yn],D:[qx(yl),yl],E:[qx(ym),ym],F:[qx(yn),yn]};}
FIGS.m3soji_sandan=host=>mk(host,{alt:'平行な3直線に2直線が交わる図。真ん中の直線を動かせる',
  sliders:[{k:'a',label:'a の長さ',min:2,max:8,step:.5,v:4}],play:{k:'a',from:2,to:8,label:'直線 m を下げる',ms:3200},
  draw(v){const d=draw(),a=v.a,{A,B,C,D,E,F}=sandan(d,a),G=[F[0]-42,A[1]];
    seg(d,F,G,DSH);seg(d,A,B,HG);seg(d,B,C,HC);seg(d,D,E,HG);seg(d,E,F,HC);
    const L=(P,Q,t,c,sd)=>{const m=mid(P,Q);tx(d,m[0]+sd*9,m[1]+4,t,c,12,sd<0?'end':'start');};
    L(A,B,'a = '+n(a),'var(--gold)',-1);L(B,C,'b = '+n(10-a),'var(--c)',-1);L(D,E,'a′ = '+n(1.2*a),'var(--gold)',1);L(E,F,'b′ = '+n(12-1.2*a),'var(--c)',1);
    return {svg:d.out(),read:`a : b = ${n(a)} : ${n(10-a)}<br>a′ : b′ = ${n(1.2*a)} : ${n(12-1.2*a)}<br>比の値はどちらも <b>${n(a/(10-a),3)}</b><br>点線は、左の直線を平行に移したもの。右側に三角形ができる`};}});

/* ---- 中点連結定理 ---- */
FIGS.m3soji_chuten=host=>mk(host,{alt:'三角形の2辺の中点を結ぶ線分と、残りの辺の関係を手順で示す図',
  sliders:[{k:'s',label:'手順',min:1,max:4,step:1,v:1},{k:'x',label:'頂点 A の位置',min:1,max:11,step:.5,v:4}],play:{k:'s',from:1,to:4,label:'順に見る',ms:4400},
  draw(v){const u=260/12,s=v.s,B=[40,208],C=[300,208],A=[40+v.x*u,44],M=mid(A,B),N=mid(A,C),g=cen([A,B,C]),d=draw();
    if(s>=2)d.poly([A,M,N],FG);
    d.poly([A,B,C],INK);seg(d,M,N,HC);
    if(s===2){seg(d,A,M,HG);seg(d,A,N,HG);}
    if(s===4)seg(d,B,C,HC);
    tick(d,A,M,1);tick(d,M,B,1);tick(d,A,N,2);tick(d,N,C,2);
    if(s>=3)ang(d,A,B,C,20,MG);
    if(s===4){ang(d,M,A,N,15,MC);ang(d,B,A,C,15,MC);}
    tx(d,(M[0]+N[0])/2,M[1]+16,'6','var(--c)');tx(d,170,224,'12','var(--muted)');
    names(d,[A,B,C],'ABC',g);tx(d,M[0]-12,M[1]+2,'M');tx(d,N[0]+12,N[1]+2,'N');
    return {svg:d.out(),read:[`<b>手順 1</b>　M, N は辺 AB, AC の中点<br>BC = 12 のとき MN = <b>6</b><br>A を動かしても変わらない`,
      `<b>手順 2</b>　△AMN と △ABC で<br>AM : AB = AN : AC = 1 : 2 …①`,
      `<b>手順 3</b>　∠A は共通 …②<br>①、②より △AMN ∽ △ABC<br>相似比は 1 : 2`,
      `<b>手順 4</b>　MN : BC = 1 : 2 なので MN = BC ÷ 2<br>∠AMN = ∠ABC（同位角が等しい）なので <b>MN ∥ BC</b>`][s-1]};}});

/* ---- 四角形の各辺の中点を結ぶ ---- */
FIGS.m3soji_varignon=host=>mk(host,{alt:'四角形の各辺の中点を結ぶと平行四辺形になることを手順で示す図',
  sliders:[{k:'s',label:'手順',min:1,max:4,step:1,v:1},{k:'t',label:'頂点 D を動かす',min:0,max:10,step:1,v:6}],play:{k:'s',from:1,to:4,label:'順に見る',ms:4400},
  draw(v){const s=v.s,A=[96,34],B=[36,186],C=[250,220],D=[224+8*v.t,34+10*v.t],P=mid(A,B),Q=mid(B,C),R=mid(C,D),S=mid(D,A),g=cen([A,B,C,D]),d=draw();
    if(s===2)d.poly([A,B,C],FG);if(s===3)d.poly([A,C,D],FG);if(s===4)d.poly([P,Q,R,S],FC);
    d.poly([A,B,C,D],INK);if(s>=2)seg(d,A,C,'stroke="var(--gold)" stroke-width="1.8" fill="none" stroke-dasharray="5 4"');
    d.poly([P,Q,R,S],'stroke="var(--c)" stroke-width="2.2" fill="none" stroke-linejoin="round"');
    if(s===2||s===4)seg(d,P,Q,HG);if(s===3||s===4)seg(d,S,R,HG);
    [P,Q,R,S].forEach(p=>d.dot(p[0],p[1],'var(--c)',3.2));
    names(d,[A,B,C,D,P,Q,R,S],'ABCDPQRS',g);
    return {svg:d.out(),read:[`<b>手順 1</b>　P, Q, R, S は各辺の中点<br>四角形 PQRS の形を調べる`,
      `<b>手順 2</b>　対角線 AC を引く<br>△ABC で中点連結定理<br>PQ ∥ AC、PQ = AC ÷ 2 …①`,
      `<b>手順 3</b>　△ACD で中点連結定理<br>SR ∥ AC、SR = AC ÷ 2 …②`,
      `<b>手順 4</b>　①、②より PQ ∥ SR、PQ = SR<br>1組の対辺が平行で長さが等しい<br><b>四角形 PQRS は平行四辺形</b>`][s-1]};}});

/* ---- 相似な図形の面積：底辺も高さも k 倍 ---- */
FIGS.m3soji_menseki=host=>mk(host,{alt:'底辺 4、高さ 3 の三角形と、それを k 倍にした三角形の面積をくらべる図',
  sliders:[{k:'k',label:'k（何倍にするか）',min:.5,max:2.5,step:.25,v:2}],play:{k:'k',from:.5,to:2.5,label:'k を大きくする',ms:3200},
  draw(v){const k=v.k,d=draw();
    const T=(ox,s,fill,b,h)=>{const oy=206,P=[[ox,oy],[ox+4*s,oy],[ox+s,oy-3*s]],H=[ox+s,oy];
      d.poly(P,fill).poly(P,INK);seg(d,P[2],H,DSH);rt(d,H,P[1],P[2],Math.min(7,s*.35));tx(d,ox+2*s,oy+16,b,'var(--muted)');tx(d,H[0]+4,oy-.8*s+4,h,'var(--muted)',12,'start');};
    T(18,20,FC,'4','3');T(122,20*k,FG,n(4*k),n(3*k));
    return {svg:d.out(),read:`もとの面積 = 1/2 × 4 × 3 = 6<br>k 倍の面積 = 1/2 × ${n(4*k)} × ${n(3*k)} = <b>${n(6*k*k,3)}</b><br>面積は k² = <b>${n(k*k,4)}</b> 倍<br>周の長さは k = ${n(k)} 倍`};}});

/* ---- なぜ：k 倍の三角形を、もとの三角形で敷きつめる ---- */
FIGS.m3soji_tile=host=>mk(host,{alt:'k 倍に拡大した三角形を、もとの三角形で敷きつめた図',
  sliders:[{k:'k',label:'k（何倍にするか）',min:1,max:5,step:1,v:2}],play:{k:'k',from:1,to:5,label:'1 倍から 5 倍まで',ms:4000},
  draw(v){const k=v.k,d=draw(),pt=(i,j)=>[162-26*k+i*52+j*20,125+19*k-j*38],rows=[];
    for(let j=0;j<k;j++){const r=k-j,col=r%2?'gold':'ok',st=`fill="var(--${col})" fill-opacity=".3" stroke="var(--bg2)" stroke-width="1.5"`;
      for(let i=0;i<k-j;i++){d.poly([pt(i,j),pt(i+1,j),pt(i,j+1)],st);if(i<k-j-1)d.poly([pt(i+1,j),pt(i+1,j+1),pt(i,j+1)],st);}
      const e=mid(pt(k-j,j),pt(k-j-1,j+1));tx(d,e[0]+18,e[1]+4,String(2*r-1),`var(--${col})`);rows.unshift(2*r-1);}
    d.poly([pt(0,0),pt(k,0),pt(0,k)],INK).poly([pt(0,k-1),pt(1,k-1),pt(0,k)],'stroke="var(--ink)" stroke-width="2.6" fill="none" stroke-linejoin="round"');
    return {svg:d.out(),read:`相似比 1 : ${k}<br>段ごとの枚数（上から）<br>${rows.join(' + ')}<br>合わせて <b>${k*k}</b> 枚<br>面積の比 1 : ${k*k}`};}});

/* ---- なぜ：k 倍の立方体を、もとの立方体に分ける ---- */
FIGS.m3soji_cube=host=>mk(host,{alt:'1辺を k 倍にした立方体を、小さい立方体に分けた図',
  sliders:[{k:'k',label:'k（1辺を何倍にするか）',min:1,max:4,step:1,v:2}],play:{k:'k',from:1,to:4,label:'1 倍から 4 倍まで',ms:3600},
  draw(v){const k=v.k,s=34,d=draw(),p=(x,y,z)=>[170-25.5*k+x*s+z*17,125+22.5*k-y*s-z*11],G='stroke="var(--bg2)" stroke-width="1.4"';
    for(let i=0;i<k;i++)for(let j=0;j<k;j++){
      d.poly([p(i,j,0),p(i+1,j,0),p(i+1,j+1,0),p(i,j+1,0)],`fill="var(--ok)" fill-opacity=".34" ${G}`);
      d.poly([p(i,k,j),p(i+1,k,j),p(i+1,k,j+1),p(i,k,j+1)],`fill="var(--ok)" fill-opacity=".2" ${G}`);
      d.poly([p(k,i,j),p(k,i+1,j),p(k,i+1,j+1),p(k,i,j+1)],`fill="var(--ok)" fill-opacity=".5" ${G}`);}
    d.poly([p(0,0,0),p(1,0,0),p(1,1,0),p(0,1,0)],'stroke="var(--gold)" stroke-width="2.4" fill="var(--gold)" fill-opacity=".4"');
    return {svg:d.out(),read:`1辺が ${k} 倍<br>1つの面に、小さい正方形が<br>${k} × ${k} = ${k*k} 個<br>全体に、小さい立方体が<br>${k} × ${k} × ${k} = <b>${k*k*k}</b> 個<br>表面積は ${k*k} 倍、体積は ${k*k*k} 倍`};}});

/* ---- 相似な立体：円錐を底面に平行な平面で切る ---- */
FIGS.m3soji_ensui=host=>mk(host,{alt:'円錐を底面に平行な平面で切り、上の小さい円錐ともとの円錐をくらべる図',
  sliders:[{k:'x',label:'小さい円錐の高さ',min:2,max:11,step:.5,v:6}],play:{k:'x',from:2,to:11,label:'切る位置を下げる',ms:3200},
  draw(v){const t=v.x/12,cx=140,ty=24,by=212,R=96,d=draw(),y=ty+(by-ty)*t,r=R*t;
    d.poly([[cx,ty],[cx-R,by],[cx+R,by]],FC);
    d.raw(`<ellipse cx="${cx}" cy="${by}" rx="${R}" ry="15" fill="var(--c)" fill-opacity=".24" stroke="var(--ink)" stroke-width="1.6"/>`);
    d.poly([[cx,ty],[cx-r,y],[cx+r,y]],FG);
    d.raw(`<ellipse cx="${cx}" cy="${f(y)}" rx="${f(r)}" ry="${f(15*t)}" fill="var(--gold)" fill-opacity=".3" stroke="var(--gold)" stroke-width="2"/>`);
    d.line(cx,ty,cx-R,by,INK).line(cx,ty,cx+R,by,INK);
    const dim=(x,y0,y1,t,st,c)=>{d.line(x,y0,x,y1,st).line(x-5,y0,x+5,y0,st).line(x-5,y1,x+5,y1,st);tx(d,x+8,(y0+y1)/2+4,t,c,12,'start');};
    dim(262,ty,y,n(v.x),MG,'var(--gold)');dim(298,ty,by,'12',SUB,'var(--muted)');
    return {svg:d.out(),read:`小さい円錐の高さ ${n(v.x)}<br>もとの円錐の高さ 12<br>相似比 ${n(v.x)} : 12<br>体積の比 ${n(v.x)}³ : 12³<br>小さい円錐の体積は、もとの <b>${n(t*t*t*100,1)}%</b><br>下の立体は ${n(100-t*t*t*100,1)}%`};}});

/* ---- 相似の利用：影の長さ ---- */
FIGS.m3soji_kage=host=>mk(host,{alt:'棒と木、それぞれの影が作る相似な直角三角形の図',
  sliders:[{k:'p',label:'棒の影の長さ（m）',min:.6,max:1.8,step:.1,v:1.2}],play:{k:'p',from:.6,to:1.8,label:'太陽を低くする',ms:3200},
  draw(v){const u=26,gy=206,p=v.p,d=draw(),a=[44,gy],T=[44,gy-6*u],as=[44+4*p*u,gy],b=[262,gy],P=[262,gy-1.5*u],bs=[262+p*u,gy];
    const RAY='stroke="var(--gold)" stroke-width="1.4" fill="none" stroke-dasharray="5 4"',BAR='stroke="var(--ink)" stroke-width="3.4" fill="none" stroke-linecap="round"';
    d.line(14,gy,326,gy,SUB).poly([a,T,as],FC).poly([b,P,bs],FG);
    seg(d,T,as,RAY);seg(d,P,bs,RAY);
    seg(d,a,T,BAR);seg(d,b,P,BAR);seg(d,a,as,HC);seg(d,b,bs,HC);
    rt(d,a,T,as);rt(d,b,P,bs,6);ang(d,as,a,T,18,MG);ang(d,bs,b,P,12,MG);
    tx(d,34,gy-6*u-10,'木 x m','var(--ink)',12,'start');tx(d,262,gy-1.5*u-10,'棒 1.5 m');
    tx(d,44+2*p*u,gy+17,n(4*p)+' m','var(--c)');tx(d,262+p*u/2,gy+17,n(p)+' m','var(--c)');
    return {svg:d.out(),read:`棒の高さ 1.5 m、棒の影 ${n(p)} m<br>木の影 ${n(4*p)} m<br>1.5 : ${n(p)} = x : ${n(4*p)}<br>x = 1.5 × ${n(4*p)} ÷ ${n(p)} = <b>6</b> m<br>影の長さが変わっても、求まる高さは同じ`};}});

/* ---- 問題に付ける図（動かさない）。arg は [図の名前, 図に書く文字の配列, 読み取り欄の文] ---- */
const Q={
 dba:{alt:'三角形 ABC の辺 BC 上に点 D がある図',h:226,f(d){const B=[40,176],C=[310,176],A=[141.2,27.2],D=[160,176],g=cen([A,B,C]);
   d.poly([A,B,C],INK);seg(d,A,D);len(d,A,B,'6',g);len(d,A,C,'7.5',g);tx(d,100,170,'4','var(--muted)');
   d.line(40,200,310,200,SUB).line(40,195,40,205,SUB).line(310,195,310,205,SUB);tx(d,175,217,'9','var(--muted)');
   names(d,[A,B,C],'ABC',g);tx(d,D[0]+4,D[1]+16,'D');return 'AB = 6、BD = 4、BC = 9、AC = 7.5';}},
 cho:{alt:'線分 AB と CD が点 O で交わり、AC と DB が平行な図',h:200,f(d){const A=[50,30],C=[190,30],O=[148,84.2],B=[295,165.5],D=[85,165.5];
   d.poly([O,A,C],FC).poly([O,B,D],FG);seg(d,A,B);seg(d,C,D);seg(d,A,C);seg(d,D,B);par(d,A,C);par(d,D,B);
   len(d,A,C,'5',O);len(d,D,B,'x',O);len(d,A,O,'4',C,11);len(d,O,B,'6',D,11);
   tx(d,A[0]-10,A[1]+2,'A');tx(d,C[0]+10,C[1]+2,'C');tx(d,D[0]-10,D[1]+6,'D');tx(d,B[0]+10,B[1]+6,'B');tx(d,O[0]+15,O[1]+5,'O');return 'AC ∥ DB、OA = 4、OB = 6、AC = 5';}},
 aed:{alt:'三角形 ABC の辺 AB 上に点 D、辺 AC 上に点 E があり、角 AED と角 ABC が等しい図',h:214,f(d){const A=[124,22],B=[40,190],C=[309.7,190],D=mid(A,B,4/9),E=mid(A,C,.25),g=cen([A,B,C]);
   d.poly([A,B,C],INK);seg(d,D,E);ang(d,E,A,D,14,MG);ang(d,B,A,C,18,MG);
   len(d,A,D,'4',g);len(d,D,B,'5',g);len(d,A,E,'3',g);names(d,[A,B,C],'ABC',g);tx(d,D[0]-12,D[1]+5,'D');tx(d,E[0]+11,E[1]-3,'E');return '∠AED = ∠ABC、AD = 4、DB = 5、AE = 3';}},
 gold36:{alt:'頂角 36 度の二等辺三角形 ABC と、角 B の二等分線 BD の図',h:232,f(d){const A=[170,18],B=[108.3,208],C=[231.7,208],D=[208.1,135.4],g=cen([A,B,C]);
   d.poly([A,B,C],INK);seg(d,B,D);ang(d,A,B,C,26,MG);ang(d,B,A,D,24,MC);ang(d,B,D,C,30,MC);tick(d,A,B,1);tick(d,A,C,1);
   tx(d,170,62,'36°','var(--gold)',11);names(d,[A,B,C],'ABC',g);tx(d,D[0]+12,D[1]+2,'D');return 'AB = AC、∠A = 36°、BD は ∠B の二等分線';}},
 sandan:{alt:'平行な3直線に2直線が交わる図',h:226,f(d,p){const {A,B,C,D,E,F}=sandan(d,4);
   [[A,'A',-1,-1],[B,'B',-1,-1],[C,'C',-1,-1],[D,'D',-1,-1],[E,'E',-1,-1],[F,'F',-1,-1]].forEach(q=>tx(d,q[0][0]+q[2]*11,q[0][1]+q[3]*7,q[1]));
   const L=(P,Q,t,sd)=>{const m=mid(P,Q);tx(d,m[0]+sd*10,m[1]+8,t,'var(--muted)',12,sd<0?'end':'start');};
   L(A,B,p[0]||'',-1);L(B,C,p[1]||'',-1);L(D,E,p[2]||'',1);L(E,F,p[3]||'',1);return 'ℓ ∥ m ∥ n';}},
 de:{alt:'三角形 ABC の辺 AB, AC 上に点 D, E があり、DE と BC が平行な図',h:216,f(d,p){const A=[203,28],B=[38,188],C=[302,188],t=p[6]||2/3,D=mid(A,B,t),E=mid(A,C,t),g=cen([A,B,C]);
   d.poly([A,B,C],INK);seg(d,D,E);par(d,D,E);par(d,B,C);
   [[A,D],[D,B],[A,E],[E,C]].forEach((q,i)=>{if(p[i])len(d,q[0],q[1],p[i],g,12);});
   if(p[4])tx(d,(D[0]+E[0])/2+16,D[1]-7,p[4],'var(--muted)');if(p[5])tx(d,186,B[1]+17,p[5],'var(--muted)');
   names(d,[A,B,C],'ABC',g);tx(d,D[0]-12,D[1]+11,'D');tx(d,E[0]+11,E[1]+12,'E');return 'DE ∥ BC';}},
 daikei:{alt:'AD と BC が平行な台形 ABCD と、BC に平行な線分 EF、対角線 AC の図',h:222,f(d){const A=[90,34],D=[222,34],B=[50,194],C=[270,194],E=mid(A,B,.25),F=mid(D,C,.25),G=mid(A,C,.25),g=cen([A,B,C,D]);
   d.poly([A,B,C,D],INK);seg(d,E,F,HC);seg(d,A,C,DSH);par(d,A,D);par(d,B,C);
   len(d,A,D,'6',g);len(d,B,C,'10',g,13);names(d,[A,B,C,D],'ABCD',g);tx(d,E[0]-11,E[1]+4,'E');tx(d,F[0]+11,F[1]+4,'F');tx(d,G[0]+4,G[1]-8,'G');
   return 'AD ∥ BC ∥ EF、AE : EB = 1 : 3<br>点線は対角線 AC。EF との交点が G';}},
 nitobun:{alt:'三角形 ABC の角 A の二等分線 AD と、C を通り AD に平行な直線が BA の延長と交わる点 E の図',h:244,f(d){const B=[30,222],C=[180,222],A=[165,102.9],D=[120,222],E=[255,23.5],g=cen([A,B,C]);
   d.poly([A,B,C],INK);seg(d,A,D,HC);seg(d,A,E,DSH);seg(d,C,E,DSH);
   ang(d,A,B,D,30,MG);ang(d,A,D,C,36,MG);ang(d,E,A,C,24,MC);ang(d,C,A,E,26,MC);
   tx(d,A[0]-12,A[1]-4,'A');tx(d,B[0]-10,B[1]+4,'B');tx(d,C[0]+11,C[1]+4,'C');tx(d,D[0],D[1]+16,'D');tx(d,E[0]+10,E[1]-2,'E');
   return 'AD は ∠A の二等分線<br>点線：C を通り AD に平行な直線と、BA の延長との交点が E';}},
 daikei2:{alt:'AD と BC が平行な台形 ABCD と、辺 AB, DC の中点 M, N、対角線 AC の図',h:218,f(d){const A=[100,34],D=[196,34],B=[40,190],C=[280,190],M=mid(A,B),N=mid(D,C),P=mid(A,C),g=cen([A,B,C,D]);
   d.poly([A,B,C,D],INK);seg(d,M,N,HC);seg(d,A,C,DSH);tick(d,A,M,1);tick(d,M,B,1);tick(d,D,N,2);tick(d,N,C,2);
   len(d,A,D,'4',g);len(d,B,C,'10',g,13);names(d,[A,B,C,D],'ABCD',g);tx(d,M[0]-12,M[1]+4,'M');tx(d,N[0]+12,N[1]+4,'N');tx(d,P[0]+3,P[1]-8,'P');
   return 'AD ∥ BC、M, N は AB, DC の中点<br>点線は対角線 AC。その中点が P';}},
 af12:{alt:'三角形 ABC で、BC の中点 D、AD の中点 E、直線 BE と AC の交点 F の図',h:226,f(d){const A=[130,24],B=[36,198],C=[300,198],D=mid(B,C),E=mid(A,D),F=mid(A,C,1/3),G=mid(A,C,2/3),g=cen([A,B,C]);
   d.poly([A,B,C],INK);seg(d,A,D);seg(d,B,F);seg(d,D,G,DSH);tick(d,B,D,1);tick(d,D,C,1);tick(d,A,E,2);tick(d,E,D,2);
   names(d,[A,B,C],'ABC',g);tx(d,D[0],D[1]+16,'D');tx(d,E[0]-11,E[1]-4,'E');tx(d,F[0]+11,F[1]-2,'F');tx(d,G[0]+11,G[1]-2,'G');
   return 'D は BC の中点、E は AD の中点<br>点線：D を通り BF に平行な直線と、AC との交点が G';}},
 daikeiO:{alt:'AD と BC が平行な台形 ABCD の対角線が点 O で交わる図',h:224,f(d){const A=[110,36],D=[254,36],B=[60,192],C=[276,192],O=mid(A,C,.4),g=cen([A,B,C,D]);
   d.poly([O,A,D],FG).poly([O,B,C],FC).poly([A,B,C,D],INK);seg(d,A,C);seg(d,B,D);par(d,A,D);par(d,B,C);
   len(d,A,D,'4',g);len(d,B,C,'6',g,13);names(d,[A,B,C,D],'ABCD',g);tx(d,O[0],O[1]+19,'O');return 'AD ∥ BC、AD = 4、BC = 6';}},
 kawa:{alt:'川の両岸の地点 A, B と、岸に沿った地点 C が作る直角三角形の図',h:204,f(d){const A=[96,34],B=[96,160],C=[202,160];
   d.raw(`<rect x="14" y="56" width="312" height="82" fill="var(--c)" fill-opacity=".16"/>`);d.line(14,56,326,56,SUB).line(14,138,326,138,SUB);
   d.poly([A,B,C],INK);rt(d,B,A,C);ang(d,C,B,A,22,MG);tx(d,163,153,'50°','var(--gold)',11);tx(d,149,177,'30 m','var(--muted)');tx(d,270,102,'川','var(--muted)');
   tx(d,A[0]-11,A[1]+2,'A');tx(d,B[0]-11,B[1]+8,'B');tx(d,C[0]+11,C[1]+8,'C');return '∠ABC = 90°、∠ACB = 50°、BC = 30 m';}},
 kagami:{alt:'地面に置いた鏡に、木の先端が映って見える図',h:210,f(d){const gy=186,M=[94,gy],e=[62,gy-24],h=[62,gy],t=[286,gy],T=[286,gy-144];
   d.line(14,gy,326,gy,SUB).poly([M,h,e],FG).poly([M,t,T],FC);
   seg(d,e,M,'stroke="var(--gold)" stroke-width="1.6" fill="none"');seg(d,M,T,'stroke="var(--gold)" stroke-width="1.6" fill="none"');
   seg(d,h,e,'stroke="var(--ink)" stroke-width="3" fill="none"');seg(d,t,T,'stroke="var(--ink)" stroke-width="3" fill="none"');
   ang(d,M,h,e,15,MC);ang(d,M,t,T,18,MC);d.line(84,gy,104,gy,'stroke="var(--ink)" stroke-width="4" fill="none"');
   tx(d,54,gy-8,'1.5 m','var(--ink)',11,'end');tx(d,78,gy+16,'2 m','var(--muted)',11);tx(d,190,gy+16,'12 m','var(--muted)',11);tx(d,296,gy-68,'x m','var(--ink)',12,'start');tx(d,96,gy-22,'鏡','var(--muted)',11);tx(d,62,gy-32,'目','var(--muted)',11);
   return '光は、鏡に入る角と出る角が等しくなるように反射する';}},
 kabe:{alt:'木の影が地面から壁にかかっている図',h:214,f(d){const gy=190,a=[60,gy],T=[60,gy-156],w=[216,gy],W=[216,gy-52],X=[294,gy];
   d.line(14,gy,326,gy,SUB);d.line(216,gy,216,gy-150,'stroke="var(--muted)" stroke-width="4" fill="none"');
   seg(d,T,W,'stroke="var(--gold)" stroke-width="1.6" fill="none"');seg(d,W,X,'stroke="var(--gold)" stroke-width="1.4" fill="none" stroke-dasharray="5 4"');
   seg(d,a,T,'stroke="var(--ink)" stroke-width="3" fill="none"');seg(d,a,w,HC);seg(d,w,W,HC);
   tx(d,138,gy+17,'6 m','var(--c)');tx(d,226,gy-22,'2 m','var(--c)',12,'start');tx(d,50,gy-74,'x m','var(--ink)',12,'end');tx(d,60,gy-164,'木');tx(d,216,gy-158,'壁','var(--muted)');
   return '高さ 1 m の棒の影は 1.5 m<br>点線は、壁がないときの光の進み方';}}
};
FIGS.m3soji_q=(host,arg)=>{const a=Array.isArray(arg)?arg:[arg],q=Q[a[0]];
  mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){const d=draw(),r=q.f(d,a[1]||[]);return {svg:d.out(),read:a[2]||r};}});};
})();
