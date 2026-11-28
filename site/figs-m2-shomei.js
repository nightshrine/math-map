/* 中学2年「合同と証明」の図・前半（4章「図形の調べ方」。FIGS.m2shomei_*）。動かせる図と、問題に付ける図（m2shomei_q）。
   証明の図では、仮定で与えられた等しい辺・角を系統の色、定理や性質から分かった辺・角を金色でかく */
(function(){
const {draw,n,mk}=FIG;
const f=v=>v.toFixed(1),RAD=Math.PI/180;
const INK='stroke="var(--ink)" stroke-width="1.6" fill="none" stroke-linejoin="round"';
const SUB='stroke="var(--muted)" stroke-width="1.2" fill="none"';
const DSH='stroke="var(--muted)" stroke-width="1.2" fill="none" stroke-dasharray="4 4"';
const HG='stroke="var(--gold)" stroke-width="3.2" fill="none" stroke-linecap="round"';
const HC='stroke="var(--c)" stroke-width="3.2" fill="none" stroke-linecap="round"';
const MG='stroke="var(--gold)" stroke-width="2" fill="none"';
const MC='stroke="var(--c)" stroke-width="2" fill="none"';
const MI='stroke="var(--ink)" stroke-width="1.6" fill="none"';
const GD='stroke="var(--gold)" stroke-width="1.8" fill="none" stroke-dasharray="5 4"';
const FC='fill="var(--c)" fill-opacity=".22" stroke="none"';
const FG='fill="var(--gold)" fill-opacity=".22" stroke="none"';
const FM='fill="var(--muted)" fill-opacity=".2" stroke="none"';
const un=(P,Q)=>{const x=Q[0]-P[0],y=Q[1]-P[1],l=Math.hypot(x,y)||1;return [x/l,y/l];};
const mid=(P,Q,t=.5)=>[P[0]+(Q[0]-P[0])*t,P[1]+(Q[1]-P[1])*t];
const cen=ps=>[ps.reduce((s,p)=>s+p[0],0)/ps.length,ps.reduce((s,p)=>s+p[1],0)/ps.length];
const dir=(P,Q)=>Math.atan2(P[1]-Q[1],Q[0]-P[0])/RAD;
// 2直線 AB, CD の交点
const cross=(A,B,C,D)=>{const a=B[0]-A[0],b=B[1]-A[1],c=D[0]-C[0],e=D[1]-C[1],t=((C[0]-A[0])*e-(C[1]-A[1])*c)/(a*e-b*c);return [A[0]+a*t,A[1]+b*t];};
// 点 O から角度 a（度。右向きが 0、反時計回りが正）の向きに R だけ離れた点
const pc=(O,R,a)=>[O[0]+R*Math.cos(a*RAD),O[1]-R*Math.sin(a*RAD)];
// 文字（線に重なっても読めるよう、地の色でふちどる）
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
const seg=(d,P,Q,st=INK)=>d.line(P[0],P[1],Q[0],Q[1],st);
const nm=(d,P,t,G,k=12,c)=>{const u=un(G,P);return tx(d,P[0]+u[0]*k,P[1]+u[1]*k+4,t,c);};
const names=(d,P,s,g)=>{s.split('').forEach((c,i)=>nm(d,P[i],c,g));return d;};
const len=(d,P,Q,t,G,k=11,c='var(--muted)',s=12)=>{const m=mid(P,Q),u=un(P,Q);let x=-u[1],y=u[0];if((m[0]-G[0])*x+(m[1]-G[1])*y<0){x=-x;y=-y;}return tx(d,m[0]+x*k,m[1]+y*k+4,t,c,s);};
const angv=(P,Q,R)=>{let t=Math.abs(dir(P,Q)-dir(P,R));return t>180?360-t:t;};
const ang=(d,P,Q,R,r=14,st=MG)=>{let a=dir(P,Q),b=dir(P,R);if(b-a>180)b-=360;if(b-a<-180)b+=360;return d.angle(P[0],P[1],r,a,b,st);};
// 角の中に書く文字（角の二等分線の上、頂点から r の位置）
const angT=(d,P,Q,R,r,t,c,s=11)=>{const u=un(P,Q),w=un(P,R);let x=u[0]+w[0],y=u[1]+w[1];const l=Math.hypot(x,y)||1;return tx(d,P[0]+x/l*r,P[1]+y/l*r+4,t,c,s);};
// 角の中に入れる印（● か ○）。等しい角を示す
const mark=(d,P,Q,R,r,open)=>{const u=un(P,Q),w=un(P,R);let x=u[0]+w[0],y=u[1]+w[1];const l=Math.hypot(x,y)||1;return d.circle(P[0]+x/l*r,P[1]+y/l*r,3,open?'fill="var(--bg2)" stroke="var(--c)" stroke-width="1.6"':'fill="var(--c)" stroke="none"');};
// 頂点 P から角度 a（度）の向きに r だけ離れた位置に文字を書く
const at=(d,P,a,r,t,c,s=11)=>{const q=pc(P,r,a);return tx(d,q[0],q[1]+4,t,c,s);};
const rt=(d,P,Q,R,s=8,st=SUB)=>{const u=un(P,Q),w=un(P,R);return d.path(`M${f(P[0]+u[0]*s)},${f(P[1]+u[1]*s)} L${f(P[0]+(u[0]+w[0])*s)},${f(P[1]+(u[1]+w[1])*s)} L${f(P[0]+w[0]*s)},${f(P[1]+w[1]*s)}`,st);};
const tick=(d,P,Q,k=1,st=INK)=>{const m=mid(P,Q),u=un(P,Q);for(let i=0;i<k;i++){const o=(i-(k-1)/2)*4,x=m[0]+u[0]*o,y=m[1]+u[1]*o;d.line(x-u[1]*5,y+u[0]*5,x+u[1]*5,y-u[0]*5,st);}return d;};
// 平行の印（P から Q の向きの矢じり）
const par=(d,P,Q,st=SUB,t=.5)=>{const m=mid(P,Q,t),u=un(P,Q);return d.path(`M${f(m[0]-u[0]*6-u[1]*4.5)},${f(m[1]-u[1]*6+u[0]*4.5)} L${f(m[0])},${f(m[1])} L${f(m[0]-u[0]*6+u[1]*4.5)},${f(m[1]-u[1]*6-u[0]*4.5)}`,st);};
// 円弧：中心 O、半径 R、角度 a0 から a1 へ反時計回り
const arc=(d,O,R,a0,a1,st)=>{const P=pc(O,R,a0),Q=pc(O,R,a1);let s=a1-a0;while(s<0)s+=360;return d.path(`M${f(P[0])},${f(P[1])} A${f(R)},${f(R)} 0 ${s>180?1:0} 0 ${f(Q[0])},${f(Q[1])}`,st);};
// おうぎ形：頂点 P、半径 r、角度 a0 から a1 へ反時計回り
const sector=(d,P,r,a0,a1,st)=>{const A=pc(P,r,a0),B=pc(P,r,a1);return d.path(`M${f(P[0])},${f(P[1])} L${f(A[0])},${f(A[1])} A${r},${r} 0 ${a1-a0>180?1:0} 0 ${f(B[0])},${f(B[1])} Z`,st);};
const STEP=(k=4)=>({sliders:[{k:'s',label:'手順',min:1,max:k,step:1,v:1}],play:{k:'s',from:1,to:k,label:'順に見る',ms:1100*k}});
const KAKU=['','','','三','四','五','六','七','八','九','十'];
// 円に内接する、少しゆがんだ n 角形の頂点の角度（度。偶数にそろえて、外角が整数になるようにする）
const polyA=nn=>{const a=[];for(let i=0;i<nn;i++)a.push(90+2*Math.round((360*i/nn+9*Math.sin(2.3*i+nn))/2));return a;};

/* ---- 対頂角 ---- */
FIGS.m2shomei_taicho=host=>mk(host,{alt:'2直線が交わってできる4つの角と、対頂角が等しいことを示す図',
  sliders:[{k:'a',label:'∠a（度）',min:20,max:160,step:5,v:50}],play:{k:'a',from:20,to:160,label:'直線 m を回す',ms:3600},
  draw(v){const a=v.a,O=[170,124],d=draw(),L=102,ra=x=>x<45?54:34;
    seg(d,[26,O[1]],[310,O[1]]);seg(d,pc(O,L,a),pc(O,L,a+180));
    d.angle(O[0],O[1],20,0,a,MG).angle(O[0],O[1],20,180,180+a,MG).angle(O[0],O[1],26,a,180,MC).angle(O[0],O[1],26,180+a,360,MC);
    at(d,O,a/2,ra(a),'a','var(--gold)',12);at(d,O,180+a/2,ra(a),'b','var(--gold)',12);at(d,O,(a+180)/2,ra(180-a)+4,'c','var(--c)',12);at(d,O,(a+180)/2+180,ra(180-a)+4,'d','var(--c)',12);
    tx(d,320,O[1]+4,'ℓ','var(--muted)');at(d,O,a,L+11,'m','var(--muted)',12);
    return {svg:d.out(),read:`∠a = ${a}°、∠c = ${180-a}°<br>∠a + ∠c = 180°（一直線）<br>∠b + ∠c = 180°（一直線）<br>だから ∠b = 180° − ${180-a}° = <b>${a}°</b>（∠a と等しい）`};}});

/* ---- 同位角・錯角と平行線 ---- */
FIGS.m2shomei_heiko=host=>mk(host,{alt:'2直線 ℓ, m に直線 n が交わってできる同位角と錯角の図',
  sliders:[{k:'t',label:'直線 m の傾き（度）',min:-15,max:15,step:5,v:-10},{k:'q',label:'直線 n の向き（度）',min:50,max:130,step:5,v:65}],play:{k:'t',from:-15,to:0,label:'m を ℓ と平行にする',ms:2600},
  draw(v){const t=v.t,q=v.q,d=draw(),ct=1/Math.tan(q*RAD),P=[170+45*ct,80],Q=[170-45*ct,170],M=[170,125],tt=Math.tan(t*RAD),m0=[24,170+(Q[0]-24)*tt],m1=[306,170-(306-Q[0])*tt];
    seg(d,[24,80],[306,80]);seg(d,m0,m1);seg(d,pc(M,100,q),pc(M,100,q+180));
    if(t===0){par(d,[24,80],[306,80],MI,.9);par(d,m0,m1,MI,.9);}
    d.angle(P[0],P[1],18,0,q,MG).angle(Q[0],Q[1],18,t,q,MG).angle(P[0],P[1],18,180,180+q,MC);
    at(d,P,q/2,32,'a','var(--gold)',12);at(d,Q,(t+q)/2,32,'b','var(--gold)',12);at(d,P,180+q/2,32,'c','var(--c)',12);
    tx(d,318,84,'ℓ','var(--muted)');tx(d,318,m1[1]+4,'m','var(--muted)');at(d,M,q,111,'n','var(--muted)',12);
    return {svg:d.out(),read:`同位角　∠a = ${q}°、∠b = <b>${q-t}°</b><br>錯角　　∠c = ${q}°、∠b = <b>${q-t}°</b><br>`+(t===0?'ℓ ∥ m のとき、同位角も錯角も等しい':'ℓ と m は平行でない<br>同位角も錯角も等しくならない')};}});

/* ---- 三角形の内角の和（平行線を引く） ---- */
FIGS.m2shomei_naikaku3=host=>mk(host,Object.assign(STEP(4),{alt:'三角形の内角の和が 180 度になることを、平行線を引いて説明する手順の図',
  draw(v){const s=v.s,d=draw(),A=[112,56],B=[48,200],C=[226,200],D=[312,200],u=un(B,A),E=[C[0]+u[0]*128,C[1]+u[1]*128];
    if(s>=2){seg(d,C,D);seg(d,C,E,GD);par(d,B,A,MI,.55);par(d,C,E,MI,.6);tx(d,D[0]+2,D[1]+16,'D');tx(d,E[0]+11,E[1]+2,'E');}
    if(s>=4)d.angle(C[0],C[1],58,0,180,GD);
    d.poly([A,B,C],INK);
    ang(d,A,B,C,20,MG);ang(d,B,A,C,22,MC);ang(d,C,A,B,22,MI);
    angT(d,A,B,C,34,'a','var(--gold)',12);angT(d,B,A,C,36,'b','var(--c)',12);angT(d,C,A,B,37,'c','var(--ink)',12);
    if(s>=3){ang(d,C,A,E,28,MG);angT(d,C,A,E,42,'a','var(--gold)',12);ang(d,C,E,D,28,MC);angT(d,C,E,D,42,'b','var(--c)',12);}
    tx(d,A[0]-5,A[1]-8,'A');tx(d,B[0]-9,B[1]+14,'B');tx(d,C[0]+2,C[1]+16,'C');
    return {svg:d.out(),read:['<b>手順 1</b>　△ABC の3つの内角を a, b, c とする','<b>手順 2</b>　辺 BC を延長して、その上に点 D をとる<br>C を通り、辺 BA に平行な直線 CE を引く','<b>手順 3</b>　BA ∥ CE なので<br>錯角は等しい：∠ACE = ∠A = a<br>同位角は等しい：∠ECD = ∠B = b',
      '<b>手順 4</b>　C に集まった3つの角は一直線に並ぶ<br>a + b + c = <b>180°</b><br>外角 ∠ACD = a + b'][s-1]};}}));

/* ---- 三角形の内角と外角（角を変える） ---- */
FIGS.m2shomei_sankaku=host=>mk(host,{alt:'三角形の内角と外角の大きさを、角を変えて確かめる図',
  sliders:[{k:'b',label:'∠B（度）',min:30,max:100,step:5,v:60},{k:'c',label:'∠C（度）',min:30,max:50,step:5,v:50}],
  draw(v){const b=v.b,c=v.c,a=180-b-c,cb=Math.cos(b*RAD)/Math.sin(b*RAD),cc=Math.cos(c*RAD)/Math.sin(c*RAD),h=1/(cb+cc),xa=h*cb,x0=Math.min(0,xa),k=Math.min(206/(1-x0),150/h),off=(340-(1-x0)*k-52)/2;
    const B=[off-x0*k,208],C=[B[0]+k,208],A=[B[0]+xa*k,208-h*k],D=[C[0]+52,208],d=draw(),rr=x=>Math.max(30,13/Math.tan(x*RAD/2)+6),mx=Math.max(a,b,c);
    d.poly([A,B,C],INK);seg(d,C,D);
    ang(d,A,B,C,15,MC);ang(d,B,A,C,15,MC);ang(d,C,A,B,15,MC);ang(d,C,A,D,21,MG);
    angT(d,A,B,C,rr(a),a+'°','var(--c)');angT(d,B,A,C,rr(b),b+'°','var(--c)');angT(d,C,A,B,rr(c),c+'°','var(--c)');angT(d,C,A,D,38,(180-c)+'°','var(--gold)');
    tx(d,A[0],A[1]-8,'A');tx(d,B[0]-8,B[1]+15,'B');tx(d,C[0],C[1]+16,'C');tx(d,D[0]+2,D[1]+16,'D');
    return {svg:d.out(),read:`∠A = ${a}°、∠B = ${b}°、∠C = ${c}°<br>内角の和　${a}° + ${b}° + ${c}° = <b>180°</b><br>外角 ∠ACD = <b>${180-c}°</b> = ∠A + ∠B（${a}° + ${b}°）<br>`+(mx>90?'鈍角三角形（1つの内角が鈍角）':mx===90?'直角三角形（1つの内角が直角）':'鋭角三角形（3つの内角がすべて鋭角）')};}});

/* ---- なぜ：n 角形を三角形に分ける ---- */
FIGS.m2shomei_bunkatsu=host=>mk(host,{alt:'n 角形を、1つの頂点から出る対角線で三角形に分ける図',
  sliders:[{k:'n',label:'頂点の数 n',min:3,max:10,step:1,v:5}],play:{k:'n',from:3,to:10,label:'頂点を増やす',ms:5600},
  draw(v){const nn=v.n,O=[170,130],P=polyA(nn).map(a=>pc(O,102,a)),d=draw();
    for(let i=1;i<nn-1;i++)d.poly([P[0],P[i],P[i+1]],i%2?FC:FG);
    for(let i=2;i<nn-1;i++)seg(d,P[0],P[i],GD);
    d.poly(P,INK);
    for(let i=1;i<nn-1;i++){const g=cen([P[0],P[i],P[i+1]]);tx(d,g[0],g[1]+4,String(i),'var(--ink)',11);}
    d.dot(P[0][0],P[0][1],'var(--gold)',4);nm(d,P[0],'A',O,13,'var(--gold)');
    return {svg:d.out(),read:`${KAKU[nn]}角形（n = ${nn}）<br>頂点 A から引ける対角線：${nn-3} 本<br>三角形：${nn-2} 個<br>内角の和 = 180° × ${nn-2} = <b>${180*(nn-2)}°</b>`};}});

/* ---- なぜ：外角を1点に集める ---- */
FIGS.m2shomei_gaikaku=host=>mk(host,{alt:'多角形を1点に縮めると、外角が集まって1回転になることを示す図',
  sliders:[{k:'n',label:'頂点の数 n',min:3,max:8,step:1,v:5},{k:'t',label:'多角形の大きさ',min:0,max:1,step:.02,v:1}],play:{k:'t',from:1,to:0,label:'多角形を1点に縮める',ms:3600},
  draw(v){const nn=v.n,t=v.t,O=[170,126],R=3+71*t,d=draw(),th=polyA(nn),tw=i=>th[((i%nn)+nn)%nn]+360*Math.floor(i/nn),P=th.map(a=>pc(O,R,a)),ex=[];
    const FS=[FC,FG,'fill="var(--ink)" fill-opacity=".2" stroke="none"'],TC=['var(--c)','var(--gold)','var(--ink)'];
    for(let i=0;i<nn;i++){const a0=(tw(i-1)+tw(i))/2+90,e=(tw(i+1)-tw(i-1))/2,k=(nn%2&&i===nn-1)?2:i%2;ex.push(e);
      sector(d,P[i],26,a0,a0+e,FS[k]);seg(d,P[i],pc(P[i],40,a0),SUB);at(d,P[i],a0+e/2,37,e+'°',TC[k],10);}
    d.poly(P,INK);
    return {svg:d.out(),read:`${KAKU[nn]}角形の外角の和<br>${ex.map(e=>e+'°').join(' + ')}<br>= <b>360°</b>`+(t<=.1?'<br>1点に集めると、ちょうど1回転になる':'')};}});

/* ---- 合同な図形：重ね合わせる ---- */
FIGS.m2shomei_kasane=host=>mk(host,{alt:'合同な2つの三角形を、移動して重ね合わせる図',
  sliders:[{k:'t',label:'移動（0 から 1 へ）',min:0,max:1,step:.02,v:0}],play:{k:'t',from:0,to:1,label:'△DEF を △ABC に重ねる',ms:3600},
  draw(v){const t=v.t,d=draw(),T=[[86,62],[48,194],[164,194]],g=cen(T),ph=(1-t)*-95*RAD,sx=(1-t)*165,sy=(1-t)*-32;
    const U=T.map(p=>{const x=p[0]-g[0],y=p[1]-g[1];return [g[0]+x*Math.cos(ph)-y*Math.sin(ph)+sx,g[1]+x*Math.sin(ph)+y*Math.cos(ph)+sy];}),gu=cen(U);
    d.poly(T,FC).poly(T,INK).poly(U,FG).poly(U,'stroke="var(--gold)" stroke-width="2" fill="none" stroke-linejoin="round"');
    if(t>.98)['A(D)','B(E)','C(F)'].forEach((s,i)=>nm(d,T[i],s,g,i?19:13));
    else{names(d,T,'ABC',g);U.forEach((p,i)=>nm(d,p,'DEF'[i],gu,12,'var(--gold)'));}
    return {svg:d.out(),read:t>.98?'ぴったり重なる：△ABC ≡ △DEF<br>AB = DE、BC = EF、CA = FD<br>∠A = ∠D、∠B = ∠E、∠C = ∠F':'△DEF を、回転させながら △ABC の方へ動かす<br>対応する頂点：A と D、B と E、C と F'};}});

/* ---- 三角形の合同条件 ---- */
FIGS.m2shomei_joken=host=>mk(host,{alt:'三角形の3つの合同条件を、等しい辺と角の印で示す図',h:226,
  sliders:[{k:'m',label:'合同条件',min:1,max:3,step:1,v:1,fmt:m=>['① 3組の辺','② 2組の辺とその間の角','③ 1組の辺とその両端の角'][m-1]}],
  draw(v){const m=v.m,d=draw();
    [[0,'ABC'],[170,'DEF']].forEach(([dx,s])=>{const A=[72+dx,40],B=[22+dx,190],C=[142+dx,190],g=cen([A,B,C]);
      d.poly([A,B,C],INK);
      if(m===1){seg(d,A,B,HC);seg(d,B,C,HC);seg(d,C,A,HC);tick(d,A,B,1);tick(d,B,C,2);tick(d,C,A,3);}
      if(m===2){seg(d,A,B,HC);seg(d,B,C,HC);tick(d,A,B,1);tick(d,B,C,2);ang(d,B,A,C,22,MC);}
      if(m===3){seg(d,B,C,HC);tick(d,B,C,1);ang(d,B,A,C,22,MC);ang(d,C,A,B,20,MC);ang(d,C,A,B,25,MC);}
      names(d,[A,B,C],s,g);});
    return {svg:d.out(),read:['<b>① 3組の辺</b>がそれぞれ等しい<br>AB = DE、BC = EF、CA = FD','<b>② 2組の辺とその間の角</b>がそれぞれ等しい<br>AB = DE、BC = EF、∠B = ∠E','<b>③ 1組の辺とその両端の角</b>がそれぞれ等しい<br>BC = EF、∠B = ∠E、∠C = ∠F'][m-1]+'<br>このとき △ABC ≡ △DEF'};}});

/* ---- 2組の辺とその間にない角 ---- */
FIGS.m2shomei_ssa=host=>mk(host,{alt:'2組の辺とその間にない角を決めても、三角形が1つに決まらないことを示す図',h:236,
  sliders:[{k:'r',label:'辺 AC の長さ',min:2.5,max:6,step:.5,v:3.5}],
  draw(v){const r=v.r,u=28,B=[34,200],A=pc(B,5*u,30),q=Math.sqrt(Math.max(0,r*r-6.25))*u,C1=[A[0]-q,200],C2=[A[0]+q,200],two=r>2.5&&r<5,d=draw();
    const ph=Math.asin(Math.min(1,(168-A[1])/(r*u)))/RAD;
    if(two)d.poly([A,B,C1],FC);d.poly([A,C1[0]>B[0]&&two?C1:B,C2],FG);
    arc(d,A,r*u,180+ph,360-ph,GD);
    seg(d,B,[324,200]);seg(d,B,A);
    if(two){seg(d,A,C1,HC);d.dot(C1[0],C1[1],'var(--c)',3.5);tx(d,C1[0],C1[1]+16,'C','var(--c)');len(d,A,C1,n(r),B,14,'var(--c)',11);}
    seg(d,A,C2,HG);d.dot(C2[0],C2[1],'var(--gold)',3.5);tx(d,C2[0],C2[1]+16,two?'C′':'C','var(--gold)');len(d,A,C2,n(r),B,15,'var(--gold)',11);
    d.angle(B[0],B[1],30,0,30,MI);at(d,B,14,48,'30°','var(--ink)');len(d,B,A,'5',[A[0],200],11,'var(--ink)',11);
    tx(d,A[0],A[1]-9,'A');tx(d,B[0]-9,B[1]+15,'B');
    return {svg:d.out(),read:`∠B = 30°、AB = 5、AC = ${n(r)}<br>`+(two?'条件に合う点 C が <b>2 つ</b>ある<br>△ABC と △ABC′ は合同でない':r===2.5?'条件に合う三角形は 1 つ（∠C = 90°）':'条件に合う三角形は 1 つ')};}});

/* ---- へこみのある四角形（arg.m = 1 辺を延長、2 頂点とへこみの点を結ぶ） ---- */
// 頂点 A の位置、∠A、辺 AB・AC の長さ、∠B、∠C から、へこみのある四角形 ABDC の頂点を求める（D がへこみの点）
const kus=(A,a,lB,lC,b,c)=>{const dB=-90-a/2,dC=-90+a/2,B=pc(A,lB,dB),C=pc(A,lC,dC),D=cross(B,pc(B,50,dB+180-b),C,pc(C,50,dC+180+c));return {A,B,C,D,dB,dC};};
FIGS.m2shomei_kusabi=(host,arg)=>{const m=(arg&&arg.m)||1;
  mk(host,Object.assign(STEP(3),{h:222,alt:m===1?'へこみのある四角形の角を、辺を延長して求める手順の図':'へこみのある四角形の角を、頂点とへこみの点を通る半直線を引いて求める手順の図',
  draw(v){const s=v.s,d=draw(),{A,B,C,D}=kus([170,26],70,196,186,25,30);let read;
    const base=()=>{d.poly([A,B,D,C],INK);ang(d,B,A,D,36,MI);angT(d,B,A,D,62,'25°','var(--ink)');ang(d,C,A,D,36,MI);angT(d,C,A,D,58,'30°','var(--ink)');
      tx(d,A[0],A[1]-8,'A');tx(d,B[0]-9,B[1]+13,'B');tx(d,C[0]+9,C[1]+13,'C');tx(d,D[0]-13,D[1]-5,'D');};
    if(m===1){const E=cross(B,D,A,C);
      if(s>=3)d.poly([D,E,C],FG);
      base();ang(d,A,B,C,20,MI);angT(d,A,B,C,36,'70°','var(--ink)');
      if(s>=2){seg(d,D,E,GD);ang(d,E,D,C,13,MG);angT(d,E,D,C,29,'95°','var(--gold)');tx(d,E[0]+12,E[1]-3,'E');}
      ang(d,D,B,C,14,MC);angT(d,D,B,C,28,s===3?'125°':'x','var(--c)',12);
      read=['<b>手順 1</b>　へこんだ部分の角 x を求める<br>∠A = 70°、∠B = 25°、∠C = 30°','<b>手順 2</b>　BD を延長し、AC との交点を E とする<br>∠BEC は △ABE の外角<br>∠BEC = 70° + 25° = 95°','<b>手順 3</b>　x は △DEC の外角<br>x = ∠DEC + ∠C = 95° + 30° = <b>125°</b>'][s-1];}
    else{const F=mid(D,pc(D,60,dir(A,D)),1);
      base();
      if(s>=2){seg(d,A,F,GD);tx(d,F[0]+11,F[1]+4,'F');ang(d,A,B,D,24,MG);ang(d,A,D,C,29,MG);angT(d,A,B,D,40,'p','var(--gold)',12);angT(d,A,D,C,45,'q','var(--gold)',12);
        ang(d,D,B,F,18,MG);ang(d,D,F,C,23,MG);angT(d,D,B,F,43,'p+25°','var(--gold)',10);angT(d,D,F,C,47,'q+30°','var(--gold)',10);}
      else{ang(d,A,B,C,20,MI);angT(d,A,B,C,36,'70°','var(--ink)');ang(d,D,B,C,14,MC);angT(d,D,B,C,28,'x','var(--c)',12);}
      read=['<b>手順 1</b>　へこんだ部分の角 x を求める<br>∠A = 70°、∠B = 25°、∠C = 30°','<b>手順 2</b>　A から D を通る半直線 AF を引く<br>∠A が p と q に分かれる（p + q = 70°）<br>△ABD の外角：∠BDF = p + 25°<br>△ACD の外角：∠CDF = q + 30°','<b>手順 3</b>　x = ∠BDF + ∠CDF<br>= (p + q) + 25° + 30°<br>= 70° + 55° = <b>125°</b>'][s-1];}
    return {svg:d.out(),read};}}));};

/* ---- 合同を利用して距離を求める ---- */
FIGS.m2shomei_kyori=host=>mk(host,Object.assign(STEP(4),{h:240,alt:'池をはさんだ2地点の距離を、合同な三角形を作って求める手順の図',
  draw(v){const s=v.s,d=draw(),A=[70,78],B=[200,48],O=[175,136],C=[280,194],D=[150,224];
    d.path('M70,78 C80,22 190,6 200,48 C190,64 100,84 70,78 Z',FM);tx(d,134,48,'池','var(--muted)',11);
    if(s>=4)d.poly([O,A,B],FC).poly([O,C,D],FC);
    seg(d,A,B,s>=4?HG:DSH);
    if(s>=2){seg(d,A,C,MC);seg(d,B,D,MC);tick(d,A,O,1);tick(d,O,C,1);tick(d,B,O,2);tick(d,O,D,2);seg(d,C,D,s>=4?HG:INK);
      d.dot(O[0],O[1],'var(--ink)',3).dot(C[0],C[1],'var(--ink)',3).dot(D[0],D[1],'var(--ink)',3);at(d,O,202,15,'O');tx(d,C[0]+11,C[1]+6,'C');tx(d,D[0]-11,D[1]+6,'D');}
    if(s>=3){ang(d,O,A,B,17,MG);ang(d,O,C,D,17,MG);}
    d.dot(A[0],A[1],'var(--ink)',3).dot(B[0],B[1],'var(--ink)',3);tx(d,A[0]-11,A[1]+3,'A');tx(d,B[0]+11,B[1]+2,'B');
    return {svg:d.out(),read:['<b>手順 1</b>　池をはさんだ2地点 A, B の距離を求めたい<br>直接は測れない','<b>手順 2</b>　<i>点のとり方</i>　A, B の両方へまっすぐ行ける点 O を決める<br>AO の延長上に OC = OA となる点 C、<br>BO の延長上に OD = OB となる点 D をとる','<b>手順 3</b>　<b>根拠</b>　対頂角は等しい<br>∠AOB = ∠COD',
      '<b>手順 4</b>　2組の辺とその間の角がそれぞれ等しい<br>△OAB ≡ △OCD<br>対応する辺は等しいから <b>AB = CD</b>（CD を測ればよい）'][s-1]};}}));

/* ---- 証明のしくみ（たこ形） ---- */
FIGS.m2shomei_shikumi=host=>mk(host,Object.assign(STEP(5),{h:246,alt:'2組のとなり合う辺が等しい四角形で、仮定から結論を導く証明のしくみを手順で示す図',
  draw(v){const s=v.s,d=draw(),A=[170,26],B=[80,94],C=[170,222],D=[260,94];
    if(s>=2)d.poly([A,B,C],s>=4?FC:FM).poly([A,D,C],s>=4?FC:FM);
    seg(d,A,B,HC);seg(d,A,D,HC);seg(d,B,C,HC);seg(d,D,C,HC);tick(d,A,B,1);tick(d,A,D,1);tick(d,B,C,2);tick(d,D,C,2);
    if(s>=2)seg(d,A,C,s>=3?HG:INK);
    ang(d,B,A,C,18,s>=5?MG:DSH);ang(d,D,A,C,18,s>=5?MG:DSH);
    if(s<5){angT(d,B,A,C,31,'?','var(--muted)');angT(d,D,A,C,31,'?','var(--muted)');}
    tx(d,A[0],A[1]-8,'A');tx(d,B[0]-11,B[1]+4,'B');tx(d,C[0],C[1]+16,'C');tx(d,D[0]+11,D[1]+4,'D');
    return {svg:d.out(),read:['<b>手順 1</b>　<i>仮定</i>　AB = AD、BC = DC<br>結論　∠ABC = ∠ADC（これを示したい）','<b>手順 2</b>　対角線 AC を引く<br>△ABC と △ADC に分かれる','<b>手順 3</b>　<b>根拠</b>　共通な辺<br>AC = AC',
      '<b>手順 4</b>　<b>根拠</b>　3組の辺がそれぞれ等しい（合同条件）<br>△ABC ≡ △ADC','<b>手順 5</b>　<b>根拠</b>　合同な図形の対応する角は等しい<br>結論　∠ABC = ∠ADC'][s-1]};}}));

/* ---- 証明の進め方（arg.c = 1 平行線と交わる2つの線分、2 角の二等分線の作図） ---- */
FIGS.m2shomei_proof=(host,arg)=>{const cs=(arg&&arg.c)||1;
  mk(host,Object.assign(STEP(5),{h:cs===1?232:226,alt:['平行な2つの線分の端を結ぶ2つの線分が交わるとき、できる2つの三角形の合同を証明する手順の図','角の二等分線の作図が正しいことを、三角形の合同で証明する手順の図'][cs-1],
  draw(v){const s=v.s,d=draw();let read;
    if(cs===1){const A=[62,40],B=[232,40],E=[171,114],D=[280,188],C=[110,188];
      if(s>=2)d.poly([A,B,E],s>=5?FC:FM).poly([D,C,E],s>=5?FC:FM);
      seg(d,A,B);seg(d,C,D);seg(d,A,D);seg(d,B,C);par(d,A,B,MC,.5);par(d,C,D,MC,.5);
      seg(d,A,E,HC);seg(d,E,D,HC);tick(d,A,E,1);tick(d,E,D,1);
      if(s>=5){seg(d,B,E,HG);seg(d,C,E,HG);}
      if(s>=3){ang(d,E,A,B,16,MG);ang(d,E,D,C,16,MG);}
      if(s>=4){ang(d,A,B,E,22,MG);ang(d,A,B,E,27,MG);ang(d,D,C,E,22,MG);ang(d,D,C,E,27,MG);}
      tx(d,A[0]-10,A[1]-2,'A');tx(d,B[0]+10,B[1]-2,'B');tx(d,C[0]-10,C[1]+10,'C');tx(d,D[0]+10,D[1]+10,'D');at(d,E,8,17,'E');
      read=['<b>手順 1</b>　<i>仮定</i>　AB ∥ CD、AE = DE …①<br>結論　BE = CE（これを示したい）','<b>手順 2</b>　BE と CE を辺にもつ2つの三角形<br>△ABE と △DCE に注目する','<b>手順 3</b>　<b>根拠</b>　対頂角は等しい<br>∠AEB = ∠DEC …②','<b>手順 4</b>　<b>根拠</b>　平行線の錯角は等しい<br>AB ∥ CD より ∠BAE = ∠CDE …③',
        '<b>手順 5</b>　①、②、③より<br><b>根拠</b>　1組の辺とその両端の角がそれぞれ等しい<br>△ABE ≡ △DCE<br>結論　対応する辺は等しいから BE = CE'][s-1];}
    else{const O=[40,196],A=pc(O,120,0),B=pc(O,120,50),P=pc(O,194.9,25);
      if(s>=2)d.poly([O,A,P],s>=4?FC:FM).poly([O,B,P],s>=4?FC:FM);
      arc(d,O,120,-7,57,DSH);arc(d,A,100,dir(A,P)-13,dir(A,P)+13,DSH);arc(d,B,100,dir(B,P)-13,dir(B,P)+13,DSH);
      seg(d,O,[316,196]);seg(d,O,pc(O,226,50));seg(d,O,pc(O,268,25),s>=3?HG:INK);
      seg(d,O,A,HC);seg(d,O,B,HC);tick(d,O,A,1);tick(d,O,B,1);seg(d,A,P,HC);seg(d,B,P,HC);tick(d,A,P,2);tick(d,B,P,2);
      if(s>=5){ang(d,O,A,P,34,MG);ang(d,O,P,B,39,MG);}
      tx(d,O[0]-10,O[1]+12,'O');tx(d,318,186,'X');at(d,O,50,237,'Y');tx(d,A[0],A[1]+16,'A');tx(d,B[0]-11,B[1]-5,'B');tx(d,P[0]+4,P[1]-10,'P');
      read=['<b>手順 1</b>　角の二等分線の作図<br><i>仮定</i>　OA = OB …①、AP = BP …②<br>結論　∠AOP = ∠BOP（これを示したい）','<b>手順 2</b>　∠AOP と ∠BOP を角にもつ2つの三角形<br>△AOP と △BOP に注目する','<b>手順 3</b>　<b>根拠</b>　共通な辺<br>OP = OP …③',
        '<b>手順 4</b>　①、②、③より<br><b>根拠</b>　3組の辺がそれぞれ等しい<br>△AOP ≡ △BOP','<b>手順 5</b>　<b>根拠</b>　合同な図形の対応する角は等しい<br>結論　∠AOP = ∠BOP'][s-1];}
    return {svg:d.out(),read};}}));};

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
const HL=(d,y,name)=>{seg(d,[26,y],[304,y]);par(d,[26,y],[304,y],MI,.92);return tx(d,316,y+4,name,'var(--muted)');};
// 底辺 BC（B が左）と両端の角から、頂点 A を求める
const apex=(B,C,b,c)=>cross(B,pc(B,10,b),C,pc(C,10,180-c));
// たこ形（k = 1 4辺に印と対角線 AC、2 AB = AD と等しい角、3 対角線2本）
const tako=(d,k)=>{const A=[170,22],B=[82,88],C=[170,206],D=[258,88];d.poly([A,B,C,D],INK);seg(d,A,C);tick(d,A,B,1);tick(d,A,D,1);
  if(k!==2){tick(d,B,C,2);tick(d,D,C,2);}
  if(k===2){ang(d,A,B,C,28,MC);ang(d,A,C,D,28,MC);mark(d,A,B,C,42);mark(d,A,C,D,42);}
  if(k===3){seg(d,B,D);tx(d,181,81,'O');}
  tx(d,A[0],A[1]-8,'A');tx(d,B[0]-11,B[1]+4,'B');tx(d,C[0],C[1]+16,'C');tx(d,D[0]+11,D[1]+4,'D');};
const kusQ=(d,a,b,c,L)=>{const K=kus([170,24],a,188,180,b,c),{A,B,C,D}=K;d.poly([A,B,D,C],INK);
  ang(d,A,B,C,20,MI);angT(d,A,B,C,37,L[0],'var(--ink)');ang(d,B,A,D,36,MI);angT(d,B,A,D,Math.max(51,10/Math.tan(b*RAD/2)+10),L[1],'var(--ink)');
  ang(d,C,A,D,36,L[2]==='x'?MC:MI);angT(d,C,A,D,Math.max(51,10/Math.tan(c*RAD/2)+10),L[2],L[2]==='x'?'var(--c)':'var(--ink)',L[2]==='x'?12:11);
  ang(d,D,B,C,14,L[3]==='x'?MC:MI);angT(d,D,B,C,29,L[3],L[3]==='x'?'var(--c)':'var(--ink)',L[3]==='x'?12:11);
  tx(d,A[0],A[1]-8,'A');tx(d,B[0]-9,B[1]+13,'B');tx(d,C[0]+9,C[1]+13,'C');tx(d,D[0],D[1]-9,'D');return K;};
const Q={
 oresen:{alt:'平行な2直線 ℓ, m の間で、折れ線が点 P で折れ曲がっている図。角は 35 度と 50 度',h:224,f(d){const A=[92,50],P=pc(A,122,-35),k=(180-P[1])/Math.sin(50*RAD),B=[P[0]-k*Math.cos(50*RAD),180];
   HL(d,50,'ℓ');HL(d,180,'m');seg(d,A,P);seg(d,P,B);
   d.angle(A[0],A[1],28,-35,0,MG);at(d,A,-17,46,'35°','var(--gold)');d.angle(B[0],B[1],22,0,50,MG);at(d,B,25,40,'50°','var(--gold)');ang(d,P,A,B,15,MC);angT(d,P,A,B,29,'x','var(--c)',12);
   tx(d,A[0]-4,A[1]-8,'A');tx(d,B[0]-4,B[1]+16,'B');tx(d,P[0]+12,P[1]+4,'P');return 'ℓ ∥ m';}},
 heiko4:{alt:'平行な2直線 ℓ, m に1つの直線が交わり、角の1つが 70 度の図',h:226,f(d){const P=[204,66],Q=[204-100/Math.tan(70*RAD),166];
   HL(d,66,'ℓ');HL(d,166,'m');seg(d,pc(P,52,70),pc(Q,50,250));
   d.angle(P[0],P[1],18,0,70,MG);at(d,P,35,34,'70°','var(--gold)');
   d.angle(Q[0],Q[1],18,0,70,MC);at(d,Q,35,32,'a','var(--c)',12);d.angle(Q[0],Q[1],18,180,250,MC);at(d,Q,215,32,'b','var(--c)',12);d.angle(Q[0],Q[1],13,70,180,MC);at(d,Q,125,27,'c','var(--c)',12);
   return 'ℓ ∥ m';}},
 sansen:{alt:'4本の直線 a, b, c, d に1つの直線が交わり、それぞれの角の大きさが書かれた図',h:240,f(d){const X=y=>216-(y-20)/Math.tan(75*RAD);
   seg(d,[X(12),12],[X(228),228]);
   [42,92,142,192].forEach((y,i)=>{const P=[X(y),y],t=i===1?-5:0,L=pc(P,150,180+t);seg(d,L,pc(P,104,t));tx(d,L[0]-10,L[1]+4,'abcd'[i],'var(--muted)');
     if(i===0){d.angle(P[0],P[1],16,0,75,MG);at(d,P,37,33,'75°','var(--gold)');}
     if(i===1){d.angle(P[0],P[1],16,-5,75,MG);at(d,P,35,33,'80°','var(--gold)');}
     if(i===2){d.angle(P[0],P[1],16,180,255,MG);at(d,P,217,33,'75°','var(--gold)');}
     if(i===3){d.angle(P[0],P[1],14,255,360,MG);at(d,P,307,31,'105°','var(--gold)');}});
   return '4本の直線 a, b, c, d と、それらに交わる直線';}},
 kakux:{alt:'平行な2直線 ℓ, m に1つの直線が交わり、錯角が文字の式で表されている図',h:226,f(d){const P=[206,66],Q=[206-100/Math.tan(70*RAD),166];
   HL(d,66,'ℓ');HL(d,166,'m');seg(d,pc(P,52,70),pc(Q,50,250));
   d.angle(P[0],P[1],18,180,250,MG);tx(d,P[0]-58,P[1]+25,'(3x+10)°','var(--gold)',11);d.angle(Q[0],Q[1],18,0,70,MG);tx(d,Q[0]+56,Q[1]-13,'(5x−30)°','var(--gold)',11);
   return 'ℓ ∥ m';}},
 zigzag:{alt:'平行な2直線 ℓ, m の間で、折れ線が点 P と点 Q の2か所で折れ曲がっている図',h:240,f(d){const A=[50,36],P=pc(A,190,-20),Qp=pc(P,100,225),k=(214-Qp[1])/.5,B=pc(Qp,k,-30);
   HL(d,36,'ℓ');HL(d,214,'m');seg(d,A,P);seg(d,P,Qp);seg(d,Qp,B);
   d.angle(A[0],A[1],44,-20,0,MG);at(d,A,-10,64,'20°','var(--gold)');ang(d,P,A,Qp,20,MG);angT(d,P,A,Qp,37,'65°','var(--gold)');
   ang(d,Qp,P,B,16,MC);angT(d,Qp,P,B,30,'x','var(--c)',12);d.angle(B[0],B[1],38,150,180,MG);at(d,B,165,58,'30°','var(--gold)');
   tx(d,A[0]-4,A[1]-8,'A');tx(d,P[0]+12,P[1]+4,'P');tx(d,Qp[0]-12,Qp[1]+5,'Q');tx(d,B[0]+4,B[1]+16,'B');return 'ℓ ∥ m';}},
 tri2:{alt:'(1) 2つの内角が 48 度と 67 度の三角形、(2) 1つの外角が 130 度で内角の1つが 55 度の三角形の図',h:200,f(d){
   const B1=[18,170],C1=[150,170],A1=apex(B1,C1,48,67),B2=[188,170],C2=[282,170],A2=apex(B2,C2,75,50),D2=[326,170];
   d.poly([A1,B1,C1],INK);ang(d,B1,A1,C1,18,MG);angT(d,B1,A1,C1,35,'48°','var(--gold)');ang(d,C1,A1,B1,16,MG);angT(d,C1,A1,B1,31,'67°','var(--gold)');ang(d,A1,B1,C1,16,MC);angT(d,A1,B1,C1,30,'x','var(--c)',12);
   d.poly([A2,B2,C2],INK);seg(d,C2,D2);ang(d,A2,B2,C2,16,MG);angT(d,A2,B2,C2,32,'55°','var(--gold)');ang(d,B2,A2,C2,16,MC);angT(d,B2,A2,C2,29,'x','var(--c)',12);ang(d,C2,A2,D2,15,MG);angT(d,C2,A2,D2,31,'130°','var(--gold)');
   tx(d,24,30,'(1)','var(--muted)');tx(d,196,30,'(2)','var(--muted)');return '(1) 内角が 48° と 67°　(2) 内角が 55°、外角が 130°';}},
 naishin:{alt:'角 B が 70 度の三角形 ABC で、角 A と角 C の二等分線が点 I で交わる図',h:232,f(d){const B=[70,204],C=[270,204],A=apex(B,C,70,50),a=200,b=Math.hypot(A[0]-C[0],A[1]-C[1]),c=Math.hypot(A[0]-B[0],A[1]-B[1]),I=[(a*A[0]+b*B[0]+c*C[0])/(a+b+c),(a*A[1]+b*B[1]+c*C[1])/(a+b+c)];
   d.poly([A,B,C],INK);seg(d,A,I);seg(d,C,I);mark(d,A,B,I,34);mark(d,A,I,C,34);mark(d,C,A,I,44,1);mark(d,C,I,B,44,1);
   ang(d,B,A,C,18,MG);angT(d,B,A,C,34,'70°','var(--gold)');ang(d,I,A,C,13,MC);angT(d,I,A,C,27,'x','var(--c)',12);
   tx(d,A[0],A[1]-8,'A');tx(d,B[0]-9,B[1]+13,'B');tx(d,C[0]+9,C[1]+13,'C');tx(d,I[0]-12,I[1]-2,'I');return '∠B = 70°。同じ印の角は等しい';}},
 naibu:{alt:'五角形の内部の点 O と、5つの頂点を結んだ図',h:236,f(d){const O=[170,122],P=polyA(5).map(a=>pc(O,98,a)),Z=[176,128];
   P.forEach(p=>seg(d,Z,p,GD));d.poly(P,INK);d.circle(Z[0],Z[1],11,MG);d.dot(Z[0],Z[1],'var(--ink)',2.5);tx(d,Z[0]+19,Z[1]+15,'O');return '点 O のまわりの角は、合わせて 360°';}},
 henjo:{alt:'五角形の1つの辺の上の点 P と、その辺の両端以外の頂点を結んだ図',h:236,f(d){const O=[170,116],P=polyA(5).map(a=>pc(O,98,a)),Z=mid(P[2],P[3],.45),a0=dir(Z,P[3]);
   [P[4],P[0],P[1]].forEach(p=>seg(d,Z,p,GD));d.poly(P,INK);d.angle(Z[0],Z[1],12,a0,a0+180,MG);d.dot(Z[0],Z[1],'var(--ink)',3);tx(d,Z[0],Z[1]+17,'P');return '点 P に集まった角は、合わせて 180°';}},
 kumi6:{alt:'辺の長さや角の大きさが書かれた6つの三角形 ア〜カ の図',h:244,f(d){const u=15,hA=5/(1/Math.tan(40*RAD)+1/Math.tan(60*RAD));
   // 三角形を cm の座標（y は上向き）で作り、回転・裏返しをして、ますの中央に置く
   const sas=[[0,0],[6,0],[4*Math.cos(50*RAD),4*Math.sin(50*RAD)]],asa=[[0,0],[5,0],[hA/Math.tan(40*RAD),hA]],sss=[[0,0],[6,0],[2.25,Math.sqrt(16-2.25*2.25)]];
   const one=(name,T,cx,cy,rot,flip,sides,angs)=>{const g0=cen(T),co=Math.cos(rot*RAD),si=Math.sin(rot*RAD),P=T.map(p=>{const x=(p[0]-g0[0])*(flip?-1:1),y=p[1]-g0[1];return [cx+(x*co-y*si)*u,cy-(x*si+y*co)*u];}),g=cen(P);
     d.poly(P,INK);sides.forEach(([i,j,t])=>len(d,P[i],P[j],t,g,10,'var(--ink)',11));
     angs.forEach(([i,t])=>{const j=(i+1)%3,k=(i+2)%3,a=angv(P[i],P[j],P[k]);ang(d,P[i],P[j],P[k],11,MC);angT(d,P[i],P[j],P[k],Math.max(23,10/Math.tan(a*RAD/2)+6),t,'var(--c)',10);});
     tx(d,cx-48,cy-40,name,'var(--muted)',12);};
   one('ア',sas,60,72,0,false,[[0,1,'6'],[0,2,'4']],[[0,'50°']]);one('イ',asa,168,72,0,false,[[0,1,'5']],[[0,'40°'],[1,'60°']]);one('ウ',sss,276,72,0,false,[[0,1,'6'],[0,2,'4'],[1,2,'5']],[]);
   one('エ',asa,60,186,180,true,[[0,1,'5']],[[0,'40°'],[1,'60°']]);one('オ',sss,168,186,165,false,[[0,1,'6'],[0,2,'4'],[1,2,'5']],[]);one('カ',sas,276,186,10,true,[[0,1,'6'],[0,2,'4']],[[0,'50°']]);
   return '長さの単位は cm';}},
 shikaku2:{alt:'合同な2つの四角形 ABCD と EFGH の図',h:216,f(d){const u=18,B=[0,0],C=[7,0],A=[5*Math.cos(70*RAD),5*Math.sin(70*RAD)],D=cross(A,[A[0]+Math.cos(15*RAD),A[1]+Math.sin(15*RAD)],C,[C[0]+Math.cos(115*RAD),C[1]+Math.sin(115*RAD)]),T=[A,B,C,D],g0=cen(T);
   const put=(cx,cy,rot)=>{const co=Math.cos(rot*RAD),si=Math.sin(rot*RAD);return T.map(p=>{const x=p[0]-g0[0],y=p[1]-g0[1];return [cx+(x*co-y*si)*u,cy-(x*si+y*co)*u];});};
   const P=put(86,108,0),R=put(256,106,-105),gp=cen(P),gr=cen(R);
   d.poly(P,INK).poly(R,INK);names(d,P,'ABCD',gp);names(d,R,'EFGH',gr);
   len(d,P[0],P[1],'5 cm',gp,19,'var(--ink)',11);len(d,P[1],P[2],'7 cm',gp,11,'var(--ink)',11);
   ang(d,P[0],P[3],P[1],13,MG);angT(d,P[0],P[3],P[1],29,'125°','var(--gold)',10);ang(d,P[1],P[0],P[2],14,MG);angT(d,P[1],P[0],P[2],30,'70°','var(--gold)',10);ang(d,R[2],R[1],R[3],14,MG);angT(d,R[2],R[1],R[3],31,'65°','var(--gold)',10);
   return '四角形 ABCD ≡ 四角形 EFGH';}},
 kosa:{alt:'線分 AB と線分 CD が点 O で交わり、AO と BO が等しい図',h:226,f(d){const A=[62,56],B=[278,176],O=[170,116],C=[94,190],D=[246,42];
   seg(d,A,B);seg(d,C,D);seg(d,A,C);seg(d,B,D);tick(d,A,O,1);tick(d,O,B,1);
   tx(d,A[0]-10,A[1]-2,'A');tx(d,B[0]+10,B[1]+6,'B');tx(d,C[0]-9,C[1]+12,'C');tx(d,D[0]+9,D[1]-5,'D');tx(d,O[0],O[1]-12,'O');return 'AO = BO';}},
 kusabi1:{alt:'へこみのある四角形 ABDC の図。角 A が 62 度、角 B が 28 度、角 C が 33 度',h:214,f(d){kusQ(d,62,28,33,['62°','28°','33°','x']);return '∠A = 62°、∠B = 28°、∠C = 33°';}},
 kusabi2:{alt:'へこみのある四角形 ABDC の図。角 A が 80 度、角 B が 20 度、へこんだ部分の角が 135 度',h:196,f(d){kusQ(d,80,20,35,['80°','20°','x','135°']);return '∠A = 80°、∠B = 20°、∠BDC = 135°';}},
 kusabi3:{alt:'へこみのある四角形 ABDC で、角 ABD と角 ACD の二等分線が点 E で交わる図',h:216,f(d){const {A,B,C,D,dB,dC}=kus([170,24],60,188,180,30,40),E=cross(B,pc(B,50,dB+165),C,pc(C,50,dC+200));
   d.poly([A,B,D,C],INK);seg(d,B,E);seg(d,C,E);mark(d,B,A,E,60);mark(d,B,E,D,60);mark(d,C,A,E,56,1);mark(d,C,E,D,56,1);
   ang(d,A,B,C,20,MG);angT(d,A,B,C,36,'60°','var(--gold)');ang(d,D,B,C,13,MG);angT(d,D,B,C,28,'130°','var(--gold)');ang(d,E,B,C,11,MC);angT(d,E,B,C,23,'x','var(--c)',12);
   tx(d,A[0],A[1]-8,'A');tx(d,B[0]-9,B[1]+13,'B');tx(d,C[0]+9,C[1]+13,'C');at(d,D,150,14,'D');tx(d,E[0],E[1]-9,'E');return '∠A = 60°、∠BDC = 130°。同じ印の角は等しい';}},
 hoshi:{alt:'5つの先端 A, B, C, D, E をもつ星形の図',h:240,f(d){const O=[170,124],V=[90,166,228,310,14].map(a=>pc(O,102,a)),[A,B,C,D,E]=V,P=cross(A,C,B,E),Z=cross(A,D,B,E);
   d.poly([A,C,E,B,D],INK);[[A,C,D],[B,D,E],[C,E,A],[D,A,B],[E,B,C]].forEach((t,i)=>{ang(d,t[0],t[1],t[2],24,MC);angT(d,t[0],t[1],t[2],40,'abcde'[i],'var(--c)',12);});
   names(d,V,'ABCDE',O);tx(d,P[0]-11,P[1]-6,'P');tx(d,Z[0]+11,Z[1]-6,'Q');return '5つの先端の角 a, b, c, d, e';}},
 kawa:{alt:'川の向こう岸の点 A と、こちら岸の点 B, O, C、岸から離れた点 D の図',h:230,f(d){const A=[92,40],B=[92,118],O=[172,118],C=[252,118],D=[252,196];
   d.poly([[20,40],[320,40],[320,118],[20,118]],FM);seg(d,[20,40],[320,40],SUB);seg(d,[20,118],[320,118],SUB);tx(d,292,84,'川','var(--muted)',11);
   seg(d,A,B,DSH);seg(d,A,D,DSH);seg(d,B,C);seg(d,C,D,HC);rt(d,B,A,O,8,MI);rt(d,C,O,D,8,MI);tick(d,B,O,1);tick(d,O,C,1);
   [A,B,O,C,D].forEach(p=>d.dot(p[0],p[1],'var(--ink)',3));tx(d,A[0],A[1]-9,'A');tx(d,B[0]-6,B[1]+16,'B');tx(d,O[0]-4,O[1]+17,'O');tx(d,C[0]+11,C[1]-7,'C');tx(d,D[0]+11,D[1]+6,'D');
   tx(d,C[0]+10,(C[1]+D[1])/2+4,'18 m','var(--c)',11,'start');return 'AB ⊥ BC、BC ⊥ CD、BO = OC。A, O, D は一直線上';}},
 kakusaku:{alt:'角 XOY と、それと等しい角 X′O′Q′ を作図した図',h:214,f(d){const O=[26,184],P=pc(O,84,0),Z=pc(O,84,40),O2=[190,184],P2=pc(O2,84,0),Z2=pc(O2,84,40),r=Math.hypot(P[0]-Z[0],P[1]-Z[1]),a2=dir(P2,Z2);
   arc(d,O,84,-9,52,DSH);arc(d,O2,84,-9,52,DSH);arc(d,P2,r,a2-16,a2+16,DSH);seg(d,P,Z,DSH);seg(d,P2,Z2,DSH);
   seg(d,O,[156,184]);seg(d,O,pc(O,146,40));seg(d,O2,[322,184]);seg(d,O2,pc(O2,146,40),MG);
   [P,Z,P2,Z2].forEach(p=>d.dot(p[0],p[1],'var(--ink)',3));
   tx(d,O[0]-4,O[1]+16,'O');tx(d,154,176,'X');at(d,O,40,156,'Y');tx(d,P[0]+2,P[1]+16,'P');tx(d,Z[0]-11,Z[1]-5,'Q');
   tx(d,O2[0]-2,O2[1]+16,'O′');tx(d,318,176,'X′');tx(d,P2[0]+2,P2[1]+16,'P′');tx(d,Z2[0]-12,Z2[1]-5,'Q′');return '左：もとの角 ∠XOY　右：作図した角 ∠X′O′Q′';}},
 tako1:{alt:'AB と AD、BC と DC がそれぞれ等しい四角形 ABCD と、対角線 AC の図',h:228,f(d){tako(d,1);return 'AB = AD、BC = DC';}},
 tako2:{alt:'AB と AD が等しく、対角線 AC が角 A を2等分している四角形 ABCD の図',h:228,f(d){tako(d,2);return 'AB = AD、∠BAC = ∠DAC';}},
 tako3:{alt:'AB と AD、BC と DC がそれぞれ等しい四角形 ABCD と、2本の対角線の交点 O の図',h:228,f(d){tako(d,3);return 'AB = AD、BC = DC。O は対角線の交点';}},
 heikoO:{alt:'平行で長さの等しい線分 AB と DC があり、線分 AD と BC が点 O で交わる図',h:220,f(d){const A=[66,36],B=[216,36],O=[168,108],D=[270,180],C=[120,180];
   seg(d,A,B);seg(d,C,D);seg(d,A,D);seg(d,B,C);par(d,A,B,MI,.3);par(d,C,D,MI,.7);tick(d,A,B,1);tick(d,C,D,1);
   tx(d,A[0]-10,A[1]-2,'A');tx(d,B[0]+10,B[1]-2,'B');tx(d,C[0]-10,C[1]+10,'C');tx(d,D[0]+10,D[1]+10,'D');at(d,O,8,17,'O');return 'AB ∥ CD、AB = DC';}},
 kasanari:{alt:'辺 BC を共有する2つの三角形 ABC と DCB が重なっている図',h:226,f(d){const B=[60,190],C=[280,190],A=[112,52],D=[228,52];
   seg(d,A,B);seg(d,B,C);seg(d,C,D);seg(d,A,C);seg(d,D,B);tick(d,A,B,1);tick(d,D,C,1);ang(d,B,A,C,26,MC);ang(d,C,D,B,26,MC);
   tx(d,A[0]-4,A[1]-8,'A');tx(d,D[0]+4,D[1]-8,'D');tx(d,B[0]-9,B[1]+13,'B');tx(d,C[0]+9,C[1]+13,'C');return 'AB = DC、∠ABC = ∠DCB';}},
 nitobun:{alt:'角 XOY の二等分線上の点 P と、辺 OX, OY 上の点 A, B の図',h:214,f(d){const O=[36,186],A=pc(O,130,0),B=pc(O,130,50),P=pc(O,205,25);
   seg(d,O,[318,186]);seg(d,O,pc(O,206,50));seg(d,O,pc(O,262,25));seg(d,A,P);seg(d,B,P);tick(d,O,A,1);tick(d,O,B,1);mark(d,O,A,P,46);mark(d,O,P,B,46);
   tx(d,O[0]-10,O[1]+12,'O');tx(d,320,176,'X');at(d,O,50,217,'Y');tx(d,A[0],A[1]+16,'A');tx(d,B[0]-11,B[1]-5,'B');tx(d,P[0]+3,P[1]-10,'P');return 'OA = OB、∠AOP = ∠BOP';}},
 kyotsukaku:{alt:'AB と AC が等しい三角形 ABC で、辺 AC 上の点 E と辺 AB 上の点 D をとり、BE と CD を引いた図',h:226,f(d){const A=[170,24],B=[74,196],C=[266,196],E=cross(B,pc(B,50,dir(B,A)-28),A,C),D=[340-E[0],E[1]];
   d.poly([A,B,C],INK);seg(d,B,E);seg(d,C,D);ang(d,B,A,E,34,MC);ang(d,C,A,D,34,MC);
   tx(d,A[0],A[1]-8,'A');tx(d,B[0]-9,B[1]+13,'B');tx(d,C[0]+9,C[1]+13,'C');tx(d,D[0]-11,D[1]-3,'D');tx(d,E[0]+11,E[1]-3,'E');return 'AB = AC、∠ABE = ∠ACD';}},
 suichoku:{alt:'線分 AB の垂直二等分線 ℓ と、その上の点 P の図',h:226,f(d){const A=[62,170],B=[278,170],M=[170,170],P=[170,62];
   seg(d,A,B);seg(d,[170,20],[170,212]);seg(d,P,A);seg(d,P,B);rt(d,M,B,P,8,MI);tick(d,A,M,1);tick(d,M,B,1);d.dot(P[0],P[1],'var(--ink)',3);
   tx(d,A[0]-10,A[1]+5,'A');tx(d,B[0]+10,B[1]+5,'B');tx(d,M[0]-11,M[1]+16,'M');tx(d,P[0]+11,P[1]-4,'P');tx(d,181,30,'ℓ','var(--muted)');return 'ℓ は線分 AB の垂直二等分線';}}
};
FIGS.m2shomei_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){const d=draw(),r=q.f(d);return {svg:d.out(),read:r};}});};
})();


/* 中学2年「合同と証明」後半（5章 図形の性質と証明）の図（FIGS.m2shomei5_*）。動かせる図と、問題に付ける図（m2shomei5_q）。
   証明の手順の図では、仮定で与えられた辺・角を系統の色、定理や性質から分かった辺・角を金色でかく */
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
const GD='stroke="var(--gold)" stroke-width="1.8" fill="none" stroke-dasharray="5 4"';
const FC='fill="var(--c)" fill-opacity=".22" stroke="none"';
const FG='fill="var(--gold)" fill-opacity=".22" stroke="none"';
const RAD=Math.PI/180;
const un=(P,Q)=>{const x=Q[0]-P[0],y=Q[1]-P[1],l=Math.hypot(x,y)||1;return [x/l,y/l];};
const mid=(P,Q,t=.5)=>[P[0]+(Q[0]-P[0])*t,P[1]+(Q[1]-P[1])*t];
const cen=ps=>[ps.reduce((s,p)=>s+p[0],0)/ps.length,ps.reduce((s,p)=>s+p[1],0)/ps.length];
const dir=(P,Q)=>Math.atan2(P[1]-Q[1],Q[0]-P[0])/RAD;
const dist=(P,Q)=>Math.hypot(P[0]-Q[0],P[1]-Q[1]);
const foot=(P,A,B)=>{const u=un(A,B),t=(P[0]-A[0])*u[0]+(P[1]-A[1])*u[1];return [A[0]+u[0]*t,A[1]+u[1]*t];};
const cross=(A,B,C,D)=>{const a=B[0]-A[0],b=B[1]-A[1],c=D[0]-C[0],e=D[1]-C[1],t=((C[0]-A[0])*e-(C[1]-A[1])*c)/(a*e-b*c);return [A[0]+a*t,A[1]+b*t];};
// 点 O から角度 a（度。右向きが 0、反時計回りが正）の向きに R だけ進んだ点
const pc=(O,R,a)=>[O[0]+R*Math.cos(a*RAD),O[1]-R*Math.sin(a*RAD)];
// 文字（線に重なっても読めるよう、地の色でふちどる）
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
const seg=(d,P,Q,st=INK)=>d.line(P[0],P[1],Q[0],Q[1],st);
const nm=(d,P,t,G,k=12,c)=>{const u=un(G,P);return tx(d,P[0]+u[0]*k,P[1]+u[1]*k+4,t,c);};
const names=(d,P,s,g)=>{s.split('').forEach((c,i)=>nm(d,P[i],c,g));return d;};
const len=(d,P,Q,t,G,k=11,c='var(--muted)')=>{const m=mid(P,Q),u=un(P,Q);let x=-u[1],y=u[0];if((m[0]-G[0])*x+(m[1]-G[1])*y<0){x=-x;y=-y;}return tx(d,m[0]+x*k,m[1]+y*k+4,t,c);};
const ang=(d,P,Q,R,r=14,st=MG)=>{let a=dir(P,Q),b=dir(P,R);if(b-a>180)b-=360;if(b-a<-180)b+=360;return d.angle(P[0],P[1],r,a,b,st);};
const ang2=(d,P,Q,R,r=14,st=MG)=>{ang(d,P,Q,R,r,st);return ang(d,P,Q,R,r+4,st);};
// 角の中に書く文字（角の二等分線の上、頂点から r の位置）
const angT=(d,P,Q,R,r,t,c,s=11)=>{const u=un(P,Q),w=un(P,R);let x=u[0]+w[0],y=u[1]+w[1];const l=Math.hypot(x,y)||1;return tx(d,P[0]+x/l*r,P[1]+y/l*r+4,t,c,s);};
const rt=(d,P,Q,R,s=8,st=SUB)=>{const u=un(P,Q),w=un(P,R);return d.path(`M${f(P[0]+u[0]*s)},${f(P[1]+u[1]*s)} L${f(P[0]+(u[0]+w[0])*s)},${f(P[1]+(u[1]+w[1])*s)} L${f(P[0]+w[0]*s)},${f(P[1]+w[1]*s)}`,st);};
const tick=(d,P,Q,k=1,st=SUB)=>{const m=mid(P,Q),u=un(P,Q);for(let i=0;i<k;i++){const o=(i-(k-1)/2)*4,x=m[0]+u[0]*o,y=m[1]+u[1]*o;d.line(x-u[1]*5,y+u[0]*5,x+u[1]*5,y-u[0]*5,st);}return d;};
// 平行の印（P から Q の向きの矢じり）
const par=(d,P,Q,k=1,st=MC)=>{const m=mid(P,Q),u=un(P,Q);for(let i=0;i<k;i++){const o=(i-(k-1)/2)*6+2,x=m[0]+u[0]*o,y=m[1]+u[1]*o;d.path(`M${f(x-u[0]*6-u[1]*4)},${f(y-u[1]*6+u[0]*4)} L${f(x)},${f(y)} L${f(x-u[0]*6+u[1]*4)},${f(y-u[1]*6-u[0]*4)}`,st);}return d;};
const STEP=(k=4)=>({sliders:[{k:'s',label:'手順',min:1,max:k,step:1,v:1}],play:{k:'s',from:1,to:k,label:'順に見る',ms:1100*k}});

/* ---- 二等辺三角形：頂角を変える ---- */
FIGS.m2shomei5_nitohen=host=>mk(host,{alt:'頂角を変えられる二等辺三角形と、頂角の二等分線の図',
  sliders:[{k:'a',label:'頂角 ∠A（度）',min:30,max:130,step:10,v:50}],play:{k:'a',from:30,to:130,label:'頂角を広げる',ms:3600},
  draw(v){const a=v.a,L=150,hw=L*Math.sin(a/2*RAD),h=L*Math.cos(a/2*RAD),A=[170,40],B=[170-hw,40+h],C=[170+hw,40+h],D=[170,40+h],b=(180-a)/2,d=draw();
    d.poly([A,B,C],INK);seg(d,A,D,GD);tick(d,A,B,1,MC);tick(d,A,C,1,MC);tick(d,B,D,2,MG);tick(d,D,C,2,MG);rt(d,D,A,C,8,MG);
    ang(d,A,B,D,26,MC);ang(d,A,D,C,31,MC);ang(d,B,D,A,18,MG);ang(d,C,D,A,18,MG);
    tx(d,A[0],A[1]-9,'A');tx(d,B[0]-10,B[1]+5,'B');tx(d,C[0]+10,C[1]+5,'C');tx(d,D[0],D[1]+17,'D');
    tx(d,B[0]+10,B[1]+17,n(b)+'°','var(--gold)',11);tx(d,C[0]-10,C[1]+17,n(b)+'°','var(--gold)',11);
    return {svg:d.out(),read:`AB = AC、頂角 ∠A = ${a}°<br>底角 ∠B = ∠C = (180° − ${a}°) ÷ 2 = <b>${n(b)}°</b><br>頂角の二等分線 AD は、底辺 BC を垂直に2等分する<br>AD ⊥ BC、BD = DC`};}});

/* ---- 二等辺三角形の証明（arg.c = 'teikaku' 底角は等しい、'gyaku' 2角が等しければ二等辺三角形） ---- */
FIGS.m2shomei5_nitoproof=(host,arg)=>{const g=!!(arg&&arg.c==='gyaku');
  mk(host,Object.assign(STEP(5),{alt:g?'2つの角が等しい三角形が二等辺三角形であることを証明する手順の図':'二等辺三角形の底角が等しいことを証明する手順の図',
  draw(v){const s=v.s,A=[170,36],B=[70,204],C=[270,204],D=[170,204],d=draw();let read;
    if(s>=(g?5:4))d.poly([A,B,D],FC).poly([A,D,C],FG);
    d.poly([A,B,C],INK);
    if(!g){
      seg(d,A,B,HC);seg(d,A,C,HC);tick(d,A,B,1,INK);tick(d,A,C,1,INK);
      if(s>=2){seg(d,A,D,s>=3?HG:GD);ang(d,A,B,D,30,MC);ang(d,A,D,C,36,MC);}
      if(s>=5){ang(d,B,D,A,24,MG);ang(d,C,D,A,24,MG);}
      read=['<b>手順 1</b>　<i>仮定</i>　AB = AC …①<br>結論　∠B = ∠C（これを示したい）',
        '<b>手順 2</b>　∠A の二等分線を引き、BC との交点を D とする<br><i>∠BAD = ∠CAD</i> …②',
        '<b>手順 3</b>　<b>根拠</b>　AD は △ABD と △ACD に共通な辺<br><b>AD = AD</b> …③',
        '<b>手順 4</b>　①、②、③より<br>2組の辺とその間の角がそれぞれ等しい<br>△ABD ≡ △ACD',
        '<b>手順 5</b>　<b>根拠</b>　合同な図形の対応する角は等しい<br>結論　<b>∠B = ∠C</b>'][s-1];
    }else{
      ang(d,B,D,A,24,MC);ang(d,C,D,A,24,MC);
      if(s>=2){seg(d,A,D,s>=4?HG:GD);ang(d,A,B,D,30,MC);ang(d,A,D,C,36,MC);}
      if(s>=3){ang(d,D,A,B,13,MG);ang(d,D,A,C,13,MG);}
      if(s>=5){seg(d,A,B,HG);seg(d,A,C,HG);tick(d,A,B,1,INK);tick(d,A,C,1,INK);}
      read=['<b>手順 1</b>　<i>仮定</i>　∠B = ∠C …①<br>結論　AB = AC（これを示したい）',
        '<b>手順 2</b>　∠A の二等分線を引き、BC との交点を D とする<br><i>∠BAD = ∠CAD</i> …②',
        '<b>手順 3</b>　<b>根拠</b>　三角形の内角の和は 180°<br>①、②より、残りの角も等しい<br><b>∠ADB = ∠ADC</b> …③',
        '<b>手順 4</b>　<b>根拠</b>　AD は共通な辺<br><b>AD = AD</b> …④',
        '<b>手順 5</b>　②、③、④より<br>1組の辺とその両端の角がそれぞれ等しい<br>△ABD ≡ △ACD　結論　<b>AB = AC</b>'][s-1];
    }
    tx(d,A[0],A[1]-9,'A');tx(d,B[0]-10,B[1]+5,'B');tx(d,C[0]+10,C[1]+5,'C');if(s>=2)tx(d,D[0],D[1]+17,'D');
    return {svg:d.out(),read};}}));};

/* ---- 直角三角形の合同条件（arg.c = 1 斜辺と1つの鋭角、2 斜辺と他の1辺） ---- */
FIGS.m2shomei5_chokkaku=(host,arg)=>{const cs=(arg&&arg.c)||1;
  mk(host,Object.assign(STEP(4),{alt:cs===1?'斜辺と1つの鋭角が等しい2つの直角三角形が合同になる理由の図':'斜辺と他の1辺が等しい2つの直角三角形が合同になる理由の図',
  draw(v){const s=v.s,d=draw();let read;
    const A=[46,60],C=[46,198],B=[150,198],D=[206,60],F=[206,198],E=[310,198];
    const two=()=>{d.poly([A,C,B],INK).poly([D,F,E],INK);rt(d,C,A,B,9,MC);rt(d,F,D,E,9,MC);seg(d,A,B,HC);seg(d,D,E,HC);
      tx(d,A[0],A[1]-9,'A');tx(d,B[0]+6,B[1]+16,'B');tx(d,C[0]-4,C[1]+16,'C');tx(d,D[0],D[1]-9,'D');tx(d,E[0]+6,E[1]+16,'E');tx(d,F[0]-4,F[1]+16,'F');};
    if(cs===1){
      if(s>=3)d.poly([A,C,B],FC).poly([D,F,E],FG);
      two();ang(d,B,C,A,26,MC);ang(d,E,F,D,26,MC);
      if(s>=2){ang(d,A,C,B,26,MG);ang(d,D,F,E,26,MG);}
      read=['<b>手順 1</b>　<i>仮定</i>　∠C = ∠F = 90°<br><i>AB = DE</i>（斜辺）…①　<i>∠B = ∠E</i> …②',
        '<b>手順 2</b>　<b>根拠</b>　三角形の内角の和は 180°<br>∠A = 90° − ∠B、∠D = 90° − ∠E<br>②より <b>∠A = ∠D</b> …③',
        '<b>手順 3</b>　①、②、③より<br>1組の辺とその両端の角がそれぞれ等しい<br>△ABC ≡ △DEF',
        '<b>手順 4</b>　直角三角形は<br><b>斜辺と1つの鋭角</b>がそれぞれ等しければ合同'][s-1];
    }else if(s===1){
      two();tick(d,A,C,1,MC);tick(d,D,F,1,MC);
      read='<b>手順 1</b>　<i>仮定</i>　∠C = ∠F = 90°<br><i>AB = DE</i>（斜辺）、<i>AC = DF</i>';
    }else{
      const P=[170,60],Q=[170,198],L=[66,198],R=[274,198];
      if(s>=4)d.poly([P,L,Q],FC).poly([P,Q,R],FG);
      d.poly([P,L,R],INK);seg(d,P,Q);rt(d,Q,P,L,9,MC);rt(d,Q,P,R,9,MC);seg(d,P,L,HC);seg(d,P,R,HC);tick(d,P,L,1,INK);tick(d,P,R,1,INK);
      if(s>=3){ang(d,L,Q,P,26,MG);ang(d,R,Q,P,26,MG);}
      tx(d,P[0],P[1]-9,'A (D)');tx(d,L[0]-6,L[1]+16,'B');tx(d,Q[0],Q[1]+16,'C (F)');tx(d,R[0]+6,R[1]+16,'E');
      read=['','<b>手順 2</b>　△DEF を裏返して、DF を AC に重ねる<br>∠ACB + ∠ACE = 90° + 90° = 180°<br>B、C、E は一直線上に並ぶ',
        '<b>手順 3</b>　AB = AE（<i>仮定</i> AB = DE）なので<br>△ABE は二等辺三角形<br><b>根拠</b>　二等辺三角形の底角は等しい　<b>∠B = ∠E</b>',
        '<b>手順 4</b>　斜辺と1つの鋭角がそれぞれ等しいので<br>△ABC ≡ △DEF<br>直角三角形は <b>斜辺と他の1辺</b> がそれぞれ等しければ合同'][s-1];
    }
    return {svg:d.out(),read};}}));};

/* ---- 平行四辺形の性質：形を変える ---- */
FIGS.m2shomei5_heiko=host=>mk(host,{alt:'形を変えられる平行四辺形と、辺・角・対角線の図',
  sliders:[{k:'t',label:'∠B（度）',min:40,max:140,step:5,v:65},{k:'w',label:'BC の長さ',min:4,max:8,step:.5,v:7}],
  draw(v){const t=v.t*RAD,u=26,w=v.w*u,sx=5*u*Math.cos(t),h=5*u*Math.sin(t),bx=170-(Math.min(0,sx)+Math.max(w,w+sx))/2,by=122+h/2;
    const B=[bx,by],C=[bx+w,by],A=[bx+sx,by-h],D=[bx+sx+w,by-h],O=mid(A,C),d=draw();
    const ac=Math.sqrt(v.w*v.w+25-10*v.w*Math.cos(t)),bd=Math.sqrt(v.w*v.w+25+10*v.w*Math.cos(t));
    seg(d,A,C,DSH);seg(d,B,D,DSH);d.poly([A,B,C,D],INK);
    tick(d,A,B,1,MG);tick(d,D,C,1,MG);tick(d,A,D,2,MG);tick(d,B,C,2,MG);
    ang(d,A,B,D,15,MG);ang(d,C,B,D,15,MG);ang(d,B,A,C,15,MC);ang(d,D,A,C,15,MC);
    d.dot(O[0],O[1],'var(--ink)',2.5);names(d,[A,B,C,D],'ABCD',O);tx(d,O[0],O[1]-9,'O');
    len(d,A,B,'5',O,12);len(d,B,C,n(v.w),O,13);
    return {svg:d.out(),read:`AB = DC = 5、AD = BC = ${n(v.w)}<br>∠A = ∠C = <b>${180-v.t}°</b>、∠B = ∠D = <i>${v.t}°</i><br>AO = CO = ${n(ac/2)}、BO = DO = ${n(bd/2)}<br>形を変えても、3つの性質は成り立つ`};}});

/* ---- 平行四辺形の証明（arg.c = 'seishitsu' 対辺は等しい、'joken' 1組の対辺が平行で等しければ平行四辺形） ---- */
FIGS.m2shomei5_heikoproof=(host,arg)=>{const j=!!(arg&&arg.c==='joken');
  mk(host,Object.assign(STEP(5),{alt:j?'1組の対辺が平行で長さが等しい四角形が平行四辺形であることを証明する手順の図':'平行四辺形の2組の対辺がそれぞれ等しいことを証明する手順の図',
  draw(v){const s=v.s,A=[100,58],D=[290,58],B=[50,198],C=[240,198],g=cen([A,B,C,D]),d=draw();let read;
    if(s>=4)d.poly([A,B,C],FC).poly([C,D,A],FG);
    d.poly([A,B,C,D],INK);
    if(!j){
      par(d,B,A,1,MC);par(d,C,D,1,MC);par(d,A,D,2,MC);par(d,B,C,2,MC);
      if(s>=2)seg(d,A,C,s>=4?HG:GD);
      if(s>=3){ang(d,A,B,C,32,MG);ang(d,C,D,A,32,MG);ang2(d,C,A,B,18,MG);ang2(d,A,C,D,18,MG);}
      if(s>=5){seg(d,A,B,HG);seg(d,C,D,HG);seg(d,B,C,HG);seg(d,D,A,HG);}
      read=['<b>手順 1</b>　<i>仮定</i>　AB ∥ DC、AD ∥ BC（平行四辺形の定義）<br>結論　AB = DC、AD = BC（これを示したい）',
        '<b>手順 2</b>　対角線 AC を引く<br>△ABC と △CDA に注目する',
        '<b>手順 3</b>　<b>根拠</b>　平行線の錯角は等しい<br>AB ∥ DC より <b>∠BAC = ∠DCA</b> …①<br>AD ∥ BC より <b>∠ACB = ∠CAD</b> …②',
        '<b>手順 4</b>　<b>根拠</b>　AC は共通な辺　<b>AC = CA</b> …③<br>①、②、③より、1組の辺とその両端の角がそれぞれ等しい<br>△ABC ≡ △CDA',
        '<b>手順 5</b>　<b>根拠</b>　合同な図形の対応する辺は等しい<br>結論　<b>AB = CD、BC = DA</b><br>対応する角も等しいので ∠B = ∠D'][s-1];
    }else{
      par(d,A,D,2,MC);par(d,B,C,2,MC);seg(d,A,D,HC);seg(d,B,C,HC);tick(d,mid(A,D,.2),mid(A,D,.5),1,INK);tick(d,mid(B,C,.2),mid(B,C,.5),1,INK);
      if(s>=2)seg(d,A,C,s>=3?HG:GD);
      if(s>=3){ang2(d,C,A,B,18,MG);ang2(d,A,C,D,18,MG);}
      if(s>=4){ang(d,A,B,C,32,MG);ang(d,C,D,A,32,MG);}
      if(s>=5){par(d,B,A,1,MG);par(d,C,D,1,MG);}
      read=['<b>手順 1</b>　<i>仮定</i>　AD ∥ BC、AD = BC …①<br>結論　四角形 ABCD は平行四辺形（これを示したい）<br>AB ∥ DC がいえればよい',
        '<b>手順 2</b>　対角線 AC を引く<br>△ABC と △CDA に注目する',
        '<b>手順 3</b>　<b>根拠</b>　平行線の錯角は等しい<br>AD ∥ BC より <b>∠ACB = ∠CAD</b> …②<br><b>根拠</b>　AC は共通な辺　<b>AC = CA</b> …③',
        '<b>手順 4</b>　①、②、③より、2組の辺とその間の角がそれぞれ等しい<br>△ABC ≡ △CDA<br>対応する角は等しいので <b>∠BAC = ∠DCA</b>',
        '<b>手順 5</b>　<b>根拠</b>　錯角が等しければ、2直線は平行<br>AB ∥ DC<br>結論　2組の対辺がそれぞれ平行なので <b>平行四辺形</b>'][s-1];
    }
    names(d,[A,B,C,D],'ABCD',g);
    return {svg:d.out(),read};}}));};

/* ---- 平行四辺形になるための条件：2本の対角線を中点で留める ---- */
FIGS.m2shomei5_joken=host=>mk(host,{alt:'2本の線分をそれぞれの中点で交わらせ、端を結んでできる四角形の図',
  sliders:[{k:'t',label:'対角線が交わる角（度）',min:30,max:150,step:5,v:65},{k:'b',label:'BD の長さ（AC = 8）',min:4,max:10,step:1,v:6}],
  draw(v){const O=[170,125],u=20,hb=v.b/2,A=[O[0]-4*u,O[1]],C=[O[0]+4*u,O[1]],B=pc(O,hb*u,180+v.t),D=pc(O,hb*u,v.t),d=draw();
    const ab=Math.hypot(4-hb*Math.cos(v.t*RAD),hb*Math.sin(v.t*RAD)),ad=Math.hypot(4+hb*Math.cos(v.t*RAD),hb*Math.sin(v.t*RAD));
    const nmq=v.t===90&&v.b===8?'正方形':v.b===8?'長方形':v.t===90?'ひし形':'平行四辺形';
    d.poly([A,B,C,D],'fill="var(--c)" fill-opacity=".14" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"');
    seg(d,A,C,HG);seg(d,B,D,HC);tick(d,A,O,1,INK);tick(d,O,C,1,INK);tick(d,B,O,2,INK);tick(d,O,D,2,INK);
    d.dot(O[0],O[1],'var(--ink)',3);names(d,[A,B,C,D],'ABCD',O);{const q=pc(O,15,v.t<90?-(180-v.t)/2:v.t/2);tx(d,q[0],q[1]+4,'O');}
    return {svg:d.out(),read:`AO = CO = 4、BO = DO = ${n(hb)}<br>AB = ${n(ab)}、DC = ${n(ab)}<br>AD = ${n(ad)}、BC = ${n(ad)}<br>2組の対辺がそれぞれ等しい → <b>${nmq}</b>`+(nmq==='平行四辺形'?'':'（平行四辺形の特別な場合）')};}});

/* ---- いろいろな四角形：角と辺を変える ---- */
FIGS.m2shomei5_shikaku=host=>mk(host,{alt:'平行四辺形の角と辺を変えて、長方形・ひし形・正方形になる場合を見る図',
  sliders:[{k:'t',label:'∠B（度）',min:50,max:130,step:5,v:65},{k:'a',label:'AB の長さ（BC = 6）',min:3,max:7,step:.5,v:4}],
  draw(v){const t=v.t*RAD,u=27,w=6*u,sx=v.a*u*Math.cos(t),h=v.a*u*Math.sin(t),bx=170-(Math.min(0,sx)+Math.max(w,w+sx))/2,by=120+h/2;
    const B=[bx,by],C=[bx+w,by],A=[bx+sx,by-h],D=[bx+sx+w,by-h],O=mid(A,C),d=draw(),rect=v.t===90,rh=v.a===6;
    const ac=Math.sqrt(36+v.a*v.a-12*v.a*Math.cos(t)),bd=Math.sqrt(36+v.a*v.a+12*v.a*Math.cos(t)),ph=Math.acos(Math.min(1,Math.abs(36-v.a*v.a)/(ac*bd)))/RAD;
    const name=rect&&rh?'正方形':rect?'長方形':rh?'ひし形':'平行四辺形';
    d.poly([A,B,C,D],(name==='平行四辺形'?'fill="none"':'fill="var(--gold)" fill-opacity=".14"')+' stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"');
    seg(d,A,C,rect?HG:MC);seg(d,B,D,rect?HG:MC);
    if(rh){[[A,B],[B,C],[C,D],[D,A]].forEach(q=>tick(d,q[0],q[1],1,INK));rt(d,O,A,B,8,MG);}
    else{tick(d,A,B,1,INK);tick(d,D,C,1,INK);tick(d,A,D,2,INK);tick(d,B,C,2,INK);}
    if(rect)[[A,B,D],[B,A,C],[C,B,D],[D,A,C]].forEach(q=>rt(d,q[0],q[1],q[2],8,SUB));else{ang(d,B,C,A,16,SUB);}
    d.dot(O[0],O[1],'var(--ink)',2.5);names(d,[A,B,C,D],'ABCD',O);
    return {svg:d.out(),read:`∠B = ${v.t}°、AB = ${n(v.a)}、BC = 6　→　<b>${name}</b><br>対角線 AC = ${n(ac)}、BD = ${n(bd)}`+(rect?'（等しい）':'')+`<br>対角線が交わる角 = ${n(ph,1)}°`+(rh?'（垂直）':'')+'<br>'+
      (name==='正方形'?'対角線は等しく、垂直に交わる':rect?'∠B = 90° にすると、対角線の長さが等しくなる':rh?'AB = BC にすると、対角線が垂直に交わる':'∠B を 90° に、AB を 6 にしてみる')};}});

/* ---- 長方形の対角線は等しい ---- */
FIGS.m2shomei5_chohokei=host=>mk(host,Object.assign(STEP(4),{alt:'長方形の対角線の長さが等しいことを証明する手順の図',
  draw(v){const s=v.s,A=[70,58],D=[270,58],B=[70,198],C=[270,198],d=draw();
    if(s>=2)d.poly([A,B,C],FC).poly([D,C,B],FG);
    d.poly([A,B,C,D],INK);
    [[A,B,D],[D,A,C]].forEach(q=>rt(d,q[0],q[1],q[2],9,s>=3?SUB:MC));rt(d,B,A,C,9,MC);rt(d,C,B,D,9,MC);
    if(s>=2){seg(d,A,C,s>=4?HG:INK);seg(d,D,B,s>=4?HG:INK);}
    if(s===3){seg(d,A,B,HG);seg(d,D,C,HG);seg(d,B,C,HG);}
    if(s>=3){tick(d,A,B,1,INK);tick(d,D,C,1,INK);}
    tx(d,A[0]-10,A[1]-4,'A');tx(d,B[0]-10,B[1]+12,'B');tx(d,C[0]+10,C[1]+12,'C');tx(d,D[0]+10,D[1]-4,'D');
    return {svg:d.out(),read:['<b>手順 1</b>　<i>仮定</i>　四角形 ABCD は長方形<br>（4つの角がすべて等しい）<br>結論　AC = DB（これを示したい）',
      '<b>手順 2</b>　対角線 AC、DB を引く<br>△ABC と △DCB に注目する',
      '<b>手順 3</b>　<b>根拠</b>　長方形は平行四辺形。対辺は等しい　<b>AB = DC</b> …①<br><i>仮定</i>　<i>∠ABC = ∠DCB</i> …②<br><b>根拠</b>　BC は共通な辺　<b>BC = CB</b> …③',
      '<b>手順 4</b>　①、②、③より<br>2組の辺とその間の角がそれぞれ等しい<br>△ABC ≡ △DCB　結論　<b>AC = DB</b>'][s-1]};}}));

/* ---- 平行線と面積：頂点を平行線の上で動かす ---- */
FIGS.m2shomei5_toseki=host=>mk(host,{alt:'底辺 AB に平行な直線の上で頂点 P を動かしても、三角形 PAB の面積が変わらないことを示す図',
  sliders:[{k:'p',label:'点 P の位置',min:-2,max:8,step:.5,v:2}],play:{k:'p',from:-2,to:8,label:'P を ℓ の上で動かす',ms:3600},
  draw(v){const u=26,A=[92,202],B=[248,202],P=[92+u*v.p,72],H=[P[0],202],d=draw();
    d.line(14,72,326,72,SUB);d.line(14,202,326,202,DSH);tx(d,318,64,'ℓ','var(--muted)');
    d.poly([P,A,B],'fill="var(--c)" fill-opacity=".24" stroke="var(--ink)" stroke-width="1.6" stroke-linejoin="round"');seg(d,A,B,HC);
    seg(d,P,H,GD);rt(d,H,P,[H[0]+(v.p<3?1:-1),H[1]],7,MG);d.dot(P[0],P[1],'var(--gold)',4);
    tx(d,P[0],P[1]-10,'P','var(--gold)');tx(d,A[0]-4,A[1]+17,'A');tx(d,B[0]+4,B[1]+17,'B');
    tx(d,170,219,'6','var(--c)');tx(d,P[0]+(v.p<3?9:-9),140,'5','var(--gold)');
    return {svg:d.out(),read:`ℓ ∥ AB。底辺 AB = 6、高さ = 5（ℓ と AB の距離）<br>△PAB の面積 = 6 × 5 ÷ 2 = <b>15</b><br>P が ℓ の上のどこにあっても、高さは変わらない<br>だから、面積も変わらない`};}});

/* ---- 四角形を、面積の等しい三角形に変える ---- */
FIGS.m2shomei5_henkei=host=>mk(host,Object.assign(STEP(4),{alt:'四角形 ABCD を、面積の等しい三角形 ABE に変える手順の図',
  draw(v){const s=v.s,A=[95,58],B=[40,202],C=[190,202],D=[200,74],E=cross(D,[D[0]+C[0]-A[0],D[1]+C[1]-A[1]],B,C),d=draw();
    if(s===2)d.poly([A,B,C],FC).poly([A,C,D],FG);
    if(s===3)d.poly([A,C,D],FG).poly([A,C,E],'fill="var(--c)" fill-opacity=".3" stroke="none"');
    if(s===4)d.poly([A,B,E],FC);
    d.poly([A,B,C,D],s===4?SUB:INK);
    if(s>=2)seg(d,A,C,s===3?HG:GD);
    if(s>=3){const p=mid(D,E,-.25),q=mid(D,E,1.12);seg(d,p,q,DSH);seg(d,C,E,INK);seg(d,A,E,s===4?INK:MC);par(d,A,C,1,MG);par(d,D,E,1,MG);d.dot(E[0],E[1],'var(--ink)',3);tx(d,E[0]+3,E[1]+17,'E');tx(d,p[0]+11,p[1]+6,'ℓ','var(--muted)');}
    if(s===4)d.poly([A,B,E],INK);
    tx(d,A[0]-8,A[1]-7,'A');tx(d,B[0]-4,B[1]+17,'B');tx(d,C[0]-2,C[1]+17,'C');tx(d,D[0]+11,D[1]-4,'D');
    return {svg:d.out(),read:['<b>手順 1</b>　四角形 ABCD と面積の等しい三角形をつくりたい',
      '<b>手順 2</b>　対角線 AC を引く<br>四角形 ABCD = △ABC + △ACD',
      '<b>手順 3</b>　D を通り AC に平行な直線 ℓ を引く<br>ℓ と直線 BC の交点を E とする<br>AC ∥ DE なので <b>△ACD = △ACE</b>（底辺 AC が共通）',
      '<b>手順 4</b>　四角形 ABCD = △ABC + △ACD<br>= △ABC + △ACE = <b>△ABE</b>'][s-1]};}}));

/* ---- 2つの正三角形：一方を回転させる ---- */
const TRI=t=>{const A=[44,206],C=[194,206],D=pc(A,150,60),B=pc(C,100,t),E=pc(C,100,60+t);return {A,B,C,D,E};};
FIGS.m2shomei5_seisankaku=host=>mk(host,{alt:'頂点 C を共有する2つの正三角形の一方を回転させて、線分 AE と DB の長さをくらべる図',
  sliders:[{k:'t',label:'正三角形 CBE を回す角（度）',min:0,max:40,step:5,v:0}],play:{k:'t',from:0,to:40,label:'C を中心に回す',ms:3200},
  draw(v){const {A,B,C,D,E}=TRI(v.t),d=draw(),l=Math.sqrt(13+12*Math.cos((60+v.t)*RAD));
    d.poly([A,C,E],FC).poly([D,C,B],FG);d.poly([A,C,D],INK).poly([C,B,E],INK);seg(d,A,E,HC);seg(d,D,B,HG);
    tx(d,A[0]-9,A[1]+13,'A');tx(d,C[0],C[1]+17,'C');tx(d,D[0]-2,D[1]-8,'D');tx(d,B[0]+10,B[1]+(v.t?4:13),'B');tx(d,E[0]+9,E[1]-7,'E');
    return {svg:d.out(),read:`AC = 3、CB = 2 の正三角形。回した角 ${v.t}°<br>∠ACE = ∠DCB = ${120-v.t}°<br>AE = <i>${n(l)}</i>、DB = <b>${n(l)}</b><br>正三角形 CBE を回しても、AE = DB`};}});
FIGS.m2shomei5_seiproof=host=>mk(host,Object.assign(STEP(5),{alt:'2つの正三角形で AE = DB であることを証明する手順の図',
  draw(v){const s=v.s,{A,B,C,D,E}=TRI(0),d=draw();
    if(s>=2)d.poly([A,C,E],FC).poly([D,C,B],FG);
    d.poly([A,C,D],INK).poly([C,B,E],INK);seg(d,A,E,s>=5?HG:SUB);seg(d,D,B,s>=5?HG:SUB);
    if(s>=3){seg(d,A,C,HC);seg(d,D,C,HC);tick(d,A,C,1,INK);tick(d,D,C,1,INK);seg(d,C,E,HC);seg(d,C,B,HC);tick(d,C,E,2,INK);tick(d,C,B,2,INK);}
    if(s>=4){ang(d,C,A,E,20,MG);ang(d,C,D,B,27,MG);}
    tx(d,A[0]-9,A[1]+13,'A');tx(d,C[0],C[1]+17,'C');tx(d,D[0]-2,D[1]-8,'D');tx(d,B[0]+10,B[1]+13,'B');tx(d,E[0]+9,E[1]-7,'E');
    return {svg:d.out(),read:['<b>手順 1</b>　<i>仮定</i>　△ACD と △CBE は正三角形<br>A、C、B は一直線上にある<br>結論　AE = DB（これを示したい）',
      '<b>手順 2</b>　AE を辺にもつ △ACE と<br>DB を辺にもつ △DCB に注目する',
      '<b>手順 3</b>　<i>仮定</i>（正三角形の辺は等しい）<br><i>AC = DC</i> …①　<i>CE = CB</i> …②',
      '<b>手順 4</b>　<b>根拠</b>　正三角形の角は 60°<br>∠ACE = 60° + ∠DCE、∠DCB = ∠DCE + 60°<br><b>∠ACE = ∠DCB</b> …③',
      '<b>手順 5</b>　①、②、③より<br>2組の辺とその間の角がそれぞれ等しい<br>△ACE ≡ △DCB　結論　<b>AE = DB</b>'][s-1]};}}));

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
// 角 XOY と、2辺に引いた垂線 PA、PB（g が真なら、仮定は PA = PB）
const NB=(d,g)=>{const O=[36,192],X=[316,192],Y=pc(O,262,40),P=pc(O,205,20),A=foot(P,O,X),B=foot(P,O,Y);
  seg(d,O,X);seg(d,O,Y);seg(d,O,mid(O,P,1.28),DSH);seg(d,P,A);seg(d,P,B);rt(d,A,O,P,8,MC);rt(d,B,O,P,8,MC);
  if(g){tick(d,P,A,1,MC);tick(d,P,B,1,MC);}else{ang(d,O,X,P,44,MC);ang(d,O,P,Y,50,MC);}
  d.dot(P[0],P[1],'var(--ink)',3);tx(d,O[0]-9,O[1]+12,'O');tx(d,X[0]+2,X[1]+16,'X');tx(d,Y[0]+9,Y[1]+2,'Y');tx(d,P[0]+13,P[1]+14,'P');tx(d,A[0],A[1]+16,'A');tx(d,B[0]-8,B[1]-8,'B');
  return g?'PA ⊥ OX、PB ⊥ OY、PA = PB':'∠XOP = ∠YOP、PA ⊥ OX、PB ⊥ OY';};
const P4=()=>({A:[100,40],D:[290,40],B:[50,190],C:[240,190]});
const Q={
 bdce:{alt:'AB = AC の二等辺三角形 ABC の辺 AB、AC 上に、BD = CE となる点 D、E をとり、BE と CD を結んだ図',h:226,f(d){const A=[170,22],B=[62,200],C=[278,200],D=mid(B,A,.38),E=mid(C,A,.38),g=cen([A,B,C]);
   d.poly([A,B,C],INK);seg(d,B,E);seg(d,C,D);tick(d,B,D,1,MC);tick(d,C,E,1,MC);names(d,[A,B,C],'ABC',g);tx(d,D[0]-11,D[1]+2,'D');tx(d,E[0]+11,E[1]+2,'E');return 'AB = AC、BD = CE';}},
 golden:{alt:'頂角 36 度の二等辺三角形 ABC の辺 AC 上に、BD = BC となる点 D をとった図',h:232,f(d){const A=[170,18],h=190,hw=h*Math.tan(18*RAD),B=[170-hw,208],C=[170+hw,208],D=mid(C,A,2*Math.sin(18*RAD)*2*hw/dist(A,C)),g=cen([A,B,C]);
   d.poly([A,B,C],INK);seg(d,B,D);tick(d,B,D,1,MC);tick(d,B,C,1,MC);ang(d,A,B,C,30,MG);tx(d,A[0],A[1]+52,'36°','var(--gold)',11);
   names(d,[A,B,C],'ABC',g);tx(d,D[0]+11,D[1]+2,'D');return 'AB = AC、BD = BC、∠A = 36°';}},
 pbc:{alt:'AB = AC の二等辺三角形 ABC の、角 B と角 C の二等分線が点 P で交わる図',h:226,f(d){const A=[170,22],B=[62,200],C=[278,200],t=Math.atan2(178,108)/2,P=[170,200-108*Math.tan(t)],g=cen([A,B,C]);
   d.poly([A,B,C],INK);seg(d,B,cross(B,P,A,C));seg(d,C,cross(C,P,A,B));ang(d,B,C,P,26,MG);ang(d,B,P,A,31,MG);ang(d,C,B,P,26,MC);ang(d,C,P,A,31,MC);
   names(d,[A,B,C],'ABC',g);tx(d,P[0],P[1]-10,'P');return 'AB = AC、BP、CP は ∠B、∠C の二等分線';}},
 gaikaku:{alt:'AB = AC の二等辺三角形 ABC で、辺 BA を延長し、頂点 A の外角の二等分線 AF を引いた図',h:226,f(d){const A=[150,92],B=[70,212],C=[230,212],E=mid(B,A,1.52),F=[292,92];
   d.poly([A,B,C],INK);seg(d,A,E,DSH);seg(d,A,F,MG);tick(d,A,B,1,MC);tick(d,A,C,1,MC);ang(d,A,F,E,22,MG);ang(d,A,C,F,27,MG);
   tx(d,A[0]-11,A[1]+2,'A');tx(d,B[0]-9,B[1]+5,'B');tx(d,C[0]+9,C[1]+5,'C');tx(d,E[0]+10,E[1]+4,'E');tx(d,F[0]+10,F[1]+4,'F');return 'AB = AC、AF は ∠CAE の二等分線';}},
 nitoubun:{alt:'角 XOY の二等分線上の点 P から、2辺 OX、OY に垂線 PA、PB を引いた図',h:214,f(d){return NB(d,false);}},
 nitoubun2:{alt:'角 XOY の内部の点 P から、2辺 OX、OY に垂線 PA、PB を引いた図。PA と PB の長さが等しい',h:214,f(d){return NB(d,true);}},
 suisen2:{alt:'AB = AC の二等辺三角形 ABC の頂点 B、C から、辺 AC、AB に垂線 BD、CE を引いた図',h:226,f(d){const A=[170,22],B=[62,200],C=[278,200],D=foot(B,A,C),E=foot(C,A,B),g=cen([A,B,C]);
   d.poly([A,B,C],INK);seg(d,B,D);seg(d,C,E);rt(d,D,A,B,8,MC);rt(d,E,A,C,8,MC);
   names(d,[A,B,C,D,E],'ABCDE',g);return 'AB = AC、BD ⊥ AC、CE ⊥ AB';}},
 sessen:{alt:'円 O の外の点 P から2本の接線を引き、接点を A、B とした図',h:226,f(d){const O=[104,113],P=[292,113],r=62,a=Math.acos(r/188)/RAD,A=pc(O,r,a),B=pc(O,r,-a);
   d.circle(O[0],O[1],r,INK);seg(d,P,mid(P,A,1.15));seg(d,P,mid(P,B,1.15));seg(d,O,A);seg(d,O,B);seg(d,O,P,DSH);rt(d,A,O,P,8,MC);rt(d,B,O,P,8,MC);d.dot(O[0],O[1],'var(--ink)',2.5);
   tx(d,O[0]-11,O[1]+4,'O');tx(d,P[0]+11,P[1]+4,'P');tx(d,A[0]+3,A[1]-11,'A');tx(d,B[0]+3,B[1]+19,'B');return 'PA、PB は円 O の接線。A、B は接点';}},
 taikaku:{alt:'平行四辺形 ABCD と2本の対角線、その交点 O の図',h:226,f(d){const {A,B,C,D}=P4(),O=mid(A,C);
   d.poly([A,B,O],FC).poly([C,D,O],FG);d.poly([A,B,C,D],INK);seg(d,A,C);seg(d,B,D);par(d,B,A,1,MC);par(d,C,D,1,MC);
   ang(d,A,B,O,24,MG);ang(d,C,D,O,24,MG);ang2(d,B,A,O,22,MG);ang2(d,D,C,O,22,MG);names(d,[A,B,C,D],'ABCD',O);tx(d,O[0],O[1]-11,'O');return 'AB ∥ DC。△ABO と △CDO に注目する';}},
 suisenbd:{alt:'平行四辺形 ABCD の頂点 A、C から対角線 BD に垂線 AE、CF を引いた図',h:226,f(d){const {A,B,C,D}=P4(),O=mid(A,C),E=foot(A,B,D),F=foot(C,B,D);
   d.poly([A,B,E],FC).poly([C,D,F],FG);d.poly([A,B,C,D],INK);seg(d,B,D);seg(d,A,E);seg(d,C,F);rt(d,E,A,B,8,MC);rt(d,F,C,D,8,MC);
   names(d,[A,B,C,D],'ABCD',O);tx(d,E[0]-3,E[1]+17,'E');tx(d,F[0]+4,F[1]-9,'F');return '平行四辺形 ABCD、AE ⊥ BD、CF ⊥ BD';}},
 opq:{alt:'平行四辺形 ABCD の対角線の交点 O を通る直線が、辺 AD、BC と点 P、Q で交わる図',h:226,f(d){const {A,B,C,D}=P4(),O=mid(A,C),P=[150,40],Q=[190,190];
   d.poly([A,O,P],FC).poly([C,O,Q],FG);d.poly([A,B,C,D],INK);seg(d,A,C);seg(d,B,D,SUB);seg(d,P,Q);d.dot(O[0],O[1],'var(--ink)',2.5);
   names(d,[A,B,C,D],'ABCD',O);tx(d,P[0],P[1]-8,'P');tx(d,Q[0],Q[1]+17,'Q');tx(d,O[0]+13,O[1]+3,'O');return '平行四辺形 ABCD、O は対角線の交点';}},
 nitoubunE:{alt:'平行四辺形 ABCD の角 A の二等分線が、辺 BC と点 E で交わる図',h:226,f(d){const u=27,B=[36,196],C=[36+8*u,196],A=pc(B,5*u,65),D=[A[0]+8*u,A[1]],E=[B[0]+5*u,196],g=cen([A,B,C,D]);
   d.poly([A,B,C,D],INK);seg(d,A,E);ang(d,A,B,E,24,MC);ang(d,A,E,D,29,MC);names(d,[A,B,C,D],'ABCD',g);tx(d,E[0],E[1]+17,'E');
   return '平行四辺形 ABCD、∠BAE = ∠DAE、AB = 5、BC = 8';}},
 ebfd:{alt:'平行四辺形 ABCD の辺 AD、BC 上に、AE = CF となる点 E、F をとった図',h:226,f(d){const {A,B,C,D}=P4(),O=mid(A,C),E=[160,40],F=[180,190];
   d.poly([E,B,F,D],FC);d.poly([A,B,C,D],INK);seg(d,E,B);seg(d,F,D);tick(d,A,E,1,MC);tick(d,C,F,1,MC);
   names(d,[A,B,C,D],'ABCD',O);tx(d,E[0],E[1]-8,'E');tx(d,F[0],F[1]+17,'F');return '平行四辺形 ABCD、AE = CF';}},
 aecf:{alt:'平行四辺形 ABCD の対角線 BD 上に、BE = DF となる点 E、F をとった図',h:226,f(d){const {A,B,C,D}=P4(),O=mid(A,C),E=mid(B,D,.24),F=mid(D,B,.24);
   d.poly([A,E,C,F],FC);d.poly([A,B,C,D],INK);seg(d,B,D);seg(d,A,C,DSH);seg(d,A,E);seg(d,E,C);seg(d,C,F);seg(d,F,A);tick(d,B,E,1,MC);tick(d,D,F,1,MC);d.dot(O[0],O[1],'var(--ink)',2.5);
   names(d,[A,B,C,D],'ABCD',O);tx(d,E[0]-2,E[1]+17,'E');tx(d,F[0]+3,F[1]-9,'F');tx(d,O[0]+3,O[1]-10,'O');return '平行四辺形 ABCD、BE = DF';}},
 afce:{alt:'平行四辺形 ABCD の角 A、角 C の二等分線が、辺 BC、AD と点 E、F で交わる図',h:226,f(d){const u=27,B=[36,196],C=[36+8*u,196],A=pc(B,5*u,65),D=[A[0]+8*u,A[1]],E=[B[0]+5*u,196],F=[D[0]-5*u,D[1]],g=cen([A,B,C,D]);
   d.poly([A,E,C,F],FC);d.poly([A,B,C,D],INK);seg(d,A,E);seg(d,C,F);ang(d,A,B,E,24,MC);ang(d,A,E,D,29,MC);ang(d,C,D,F,24,MC);ang(d,C,F,B,29,MC);
   names(d,[A,B,C,D],'ABCD',g);tx(d,E[0],E[1]+17,'E');tx(d,F[0],F[1]-8,'F');return '平行四辺形 ABCD、AE、CF は ∠A、∠C の二等分線';}},
 hishigata:{alt:'ひし形 ABCD と2本の対角線、その交点 O の図',h:226,f(d){const A=[170,20],B=[52,113],C=[170,206],D=[288,113],O=[170,113];
   d.poly([A,B,O],FC).poly([A,D,O],FG);d.poly([A,B,C,D],INK);seg(d,A,C);seg(d,B,D);[[A,B],[B,C],[C,D],[D,A]].forEach(q=>tick(d,q[0],q[1],1,MC));
   names(d,[A,B,C,D],'ABCD',O);tx(d,O[0]+11,O[1]+15,'O');return 'ひし形 ABCD、O は対角線の交点';}},
 chukaku:{alt:'角 B が直角の直角三角形 ABC と、斜辺 AC の中点 M、長方形 ABCD の図',h:226,f(d){const B=[66,196],A=[66,46],C=[290,196],D=[290,46],M=mid(A,C);
   seg(d,A,D,DSH);seg(d,D,C,DSH);seg(d,M,D,DSH);d.poly([A,B,C],INK);seg(d,B,M,MG);rt(d,B,A,C,9,MC);d.dot(M[0],M[1],'var(--ink)',3);
   tx(d,A[0]-10,A[1]-2,'A');tx(d,B[0]-10,B[1]+12,'B');tx(d,C[0]+10,C[1]+12,'C');tx(d,D[0]+10,D[1]-2,'D','var(--muted)');tx(d,M[0]+4,M[1]-10,'M');return '∠B = 90°、M は斜辺 AC の中点（点線は長方形 ABCD）';}},
 daikei:{alt:'AD と BC が平行な台形 ABCD と2本の対角線、その交点 O の図',h:226,f(d){const A=[112,44],D=[232,44],B=[40,196],C=[300,196],O=cross(A,C,B,D);
   d.poly([A,B,O],FC).poly([D,C,O],FG);d.poly([A,B,C,D],INK);seg(d,A,C);seg(d,B,D);par(d,A,D,1,MC);par(d,B,C,1,MC);
   tx(d,A[0]-9,A[1]-5,'A');tx(d,D[0]+9,D[1]-5,'D');tx(d,B[0]-8,B[1]+14,'B');tx(d,C[0]+8,C[1]+14,'C');tx(d,O[0],O[1]+19,'O');return 'AD ∥ BC の台形 ABCD、O は対角線の交点';}},
 kyokai:{alt:'長方形の土地が折れ線 PQR で2つに分かれている図と、点 Q を通り PR に平行な直線の図',h:226,f(d){const P=[150,30],Qp=[205,112],R=[138,196],S=cross(Qp,[Qp[0]+R[0]-P[0],Qp[1]+R[1]-P[1]],[30,196],[310,196]);
   d.poly([[30,30],P,Qp,R,[30,196]],FC);d.poly([[30,30],[310,30],[310,196],[30,196]],INK);seg(d,P,Qp);seg(d,Qp,R);seg(d,P,R,DSH);seg(d,mid(Qp,S,-.5),mid(Qp,S,1.12),DSH);seg(d,P,S,GD);
   par(d,P,R,1,MG);par(d,Qp,S,1,MG);d.dot(S[0],S[1],'var(--gold)',3);
   tx(d,P[0],P[1]-8,'P');tx(d,Qp[0]+11,Qp[1]+2,'Q');tx(d,R[0]-3,R[1]+17,'R');tx(d,S[0]+5,S[1]+17,'S','var(--gold)');tx(d,82,118,'ア','var(--muted)');tx(d,262,118,'イ','var(--muted)');return '境界は折れ線 PQR。QS ∥ PR';}},
 naibu:{alt:'平行四辺形 ABCD の内部の点 P と、P を通り AB に平行な直線 EF の図',h:226,f(d){const {A,B,C,D}=P4(),O=mid(A,C),P=[178,130],E=[208,40],F=[158,190];
   d.poly([P,A,B],FC).poly([P,C,D],FG);d.poly([A,B,C,D],INK);seg(d,E,F,DSH);[A,B,C,D].forEach(q=>seg(d,P,q));d.dot(P[0],P[1],'var(--ink)',3);
   names(d,[A,B,C,D],'ABCD',O);tx(d,E[0],E[1]-8,'E');tx(d,F[0],F[1]+17,'F');tx(d,P[0]+17,P[1]+4,'P');return '平行四辺形 ABCD、EF ∥ AB';}},
 seihokei:{alt:'頂点 C を共有する2つの正方形 ABCD と CEFG、線分 BG と DE の図',h:232,f(d){const C=[150,150],B=[58,150],D=[150,58],A=[58,58],E=pc(C,84,-30),G=pc(C,84,60),F=[E[0]+G[0]-C[0],E[1]+G[1]-C[1]];
   d.poly([B,C,G],FC).poly([D,C,E],FG);d.poly([A,B,C,D],INK).poly([C,E,F,G],INK);seg(d,B,G,MC);seg(d,D,E,MG);
   tx(d,A[0]-9,A[1]-4,'A');tx(d,B[0]-9,B[1]+12,'B');tx(d,C[0]-6,C[1]+16,'C');tx(d,D[0]-2,D[1]-8,'D');tx(d,E[0]+3,E[1]+17,'E');tx(d,F[0]+11,F[1]+3,'F');tx(d,G[0]+4,G[1]-8,'G');return '正方形 ABCD と正方形 CEFG';}},
 apd:{alt:'2つの正三角形 ACD、CBE と、線分 AE、DB の交点 P の図',h:232,f(d){const {A,B,C,D,E}=TRI(0),P=cross(A,E,D,B),Qq=cross(A,E,D,C);
   d.poly([A,C,D],INK).poly([C,B,E],INK);seg(d,A,E,MC);seg(d,D,B,MG);ang(d,P,A,D,16,MG);d.dot(P[0],P[1],'var(--ink)',3);d.dot(Qq[0],Qq[1],'var(--ink)',2.5);tx(d,Qq[0]-4,Qq[1]+17,'Q');
   tx(d,A[0]-9,A[1]+13,'A');tx(d,C[0],C[1]+17,'C');tx(d,D[0]-2,D[1]-8,'D');tx(d,B[0]+10,B[1]+13,'B');tx(d,E[0]+9,E[1]-7,'E');tx(d,P[0]+3,P[1]-12,'P');return '△ACD、△CBE は正三角形。P は AE と DB、Q は AE と DC の交点';}},
 chuten:{alt:'AB = AC の二等辺三角形 ABC の底辺 BC の中点 M と、頂点 A を結んだ図',h:226,f(d){const A=[170,22],B=[62,200],C=[278,200],M=[170,200];
   d.poly([A,B,C],INK);seg(d,A,M,GD);tick(d,A,B,1,MC);tick(d,A,C,1,MC);tick(d,B,M,2,MC);tick(d,M,C,2,MC);tx(d,A[0],A[1]-8,'A');tx(d,B[0]-10,B[1]+5,'B');tx(d,C[0]+10,C[1]+5,'C');tx(d,M[0],M[1]+17,'M');return 'AB = AC、BM = CM';}},
 chohoq:{alt:'対角線の長さが等しい平行四辺形 ABCD と、2本の対角線の図',h:226,f(d){const A=[70,40],D=[270,40],B=[70,190],C=[270,190];
   d.poly([A,B,C],FC).poly([D,C,B],FG);d.poly([A,B,C,D],INK);seg(d,A,C,MC);seg(d,D,B,MC);tick(d,A,mid(A,C,.5),1,INK);tick(d,D,mid(D,B,.5),1,INK);
   tx(d,A[0]-10,A[1]-2,'A');tx(d,B[0]-10,B[1]+12,'B');tx(d,C[0]+10,C[1]+12,'C');tx(d,D[0]+10,D[1]-2,'D');return '平行四辺形 ABCD、AC = DB';}},
 sei:{alt:'線分 AB 上の点 C と、同じ側に作った2つの正三角形 ACD、CBE、線分 AE と DB の図',h:232,f(d){const {A,B,C,D,E}=TRI(0);
   d.poly([A,C,E],FC).poly([D,C,B],FG);d.poly([A,C,D],INK).poly([C,B,E],INK);seg(d,A,E,MC);seg(d,D,B,MG);
   tx(d,A[0]-9,A[1]+13,'A');tx(d,C[0],C[1]+17,'C');tx(d,D[0]-2,D[1]-8,'D');tx(d,B[0]+10,B[1]+13,'B');tx(d,E[0]+9,E[1]-7,'E');return '△ACD、△CBE は正三角形。A、C、B は一直線上';}},
 zahyo:{alt:'座標平面上の3点 A(1, 1)、B(5, 2)、C(7, 5) の図',h:226,p(){const p=plot([-1,9,-1,6.2],340,226).grid(),T='paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" fill="var(--ink)"';
   p.seg(1,1,5,2,INK).seg(5,2,7,5,INK).dot(1,1,'var(--ink)').dot(5,2,'var(--ink)').dot(7,5,'var(--ink)');
   p.txt(1,1,'A','text-anchor="end" dx="-7" dy="-5" '+T).txt(5,2,'B','dx="8" dy="12" '+T).txt(7,5,'C','dx="8" dy="-4" '+T);return {svg:p.out(),read:'A(1, 1)、B(5, 2)、C(7, 5)'};}},
 zahyo2:{alt:'座標平面上の三角形 OAB と、点 A を通り直線 OB に平行な直線、y 軸との交点 P の図',h:226,p(){const p=plot([-1.5,7.5,-1,5.6],340,226).grid(),T='paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" fill="var(--ink)"';
   p.poly([[0,0],[2,4],[6,2]],FC).seg(0,0,2,4,INK).seg(2,4,6,2,INK).seg(0,0,6,2,INK).seg(-1.5,17/6,7.5,35/6,GD).seg(0,10/3,6,2,DSH);
   p.dot(2,4,'var(--ink)').dot(6,2,'var(--ink)').dot(0,10/3,'var(--gold)');
   p.txt(2,4,'A','dx="-4" dy="-9" text-anchor="end" '+T).txt(6,2,'B','dx="8" dy="12" '+T).txt(0,10/3,'P','text-anchor="end" dx="-8" dy="-4" '+T).txt(0,0,'O','text-anchor="end" dx="-6" dy="14" '+T);return {svg:p.out(),read:'A(2, 4)、B(6, 2)。点線は、A を通り直線 OB に平行な直線'};}}
};
FIGS.m2shomei5_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){if(q.p)return q.p();const d=draw(),r=q.f(d);return {svg:d.out(),read:r};}});};
})();
