/* 数学C「式と曲線」の図（FIGS.hckyokusen_*）。動かせる図と、問題に付ける図（hckyokusen_q） */
(function(){
const {plot,draw,n,sg,mk}=FIG;
const f=v=>v.toFixed(1),PI=Math.PI,cos=Math.cos,sin=Math.sin,sqrt=Math.sqrt,hyp=Math.hypot;
const OUT='paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round"';
const CV='stroke="var(--c)" stroke-width="2.4" stroke-linecap="round"';
const FAINT='stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="4 4"';
const THIN='stroke="var(--muted)" stroke-width="1.2"';
const LG='stroke="var(--gold)" stroke-width="2.6" stroke-linecap="round"';
const LN='stroke="var(--ng)" stroke-width="2.6" stroke-linecap="round"';
const LI='stroke="var(--ink)" stroke-width="2" stroke-linecap="round"';
const GL='stroke="var(--gold)" stroke-width="2"';
const gcd=(a,b)=>b?gcd(b,a%b):a;
// k/d × π を約分して書く（k, d は整数）
const fr=(k,d)=>{if(!k)return '0';const g=gcd(k,d),a=k/g,b=d/g;return (a===1?'':a)+'π'+(b===1?'':'/'+b);};
const deg=x=>x+'°';
// √q の表示
const rt=q=>{const r=sqrt(q);return `√${n(q)} ${Math.abs(r-Math.round(r))<1e-9?'=':'≈'} ${n(r)}`;};
// (x − p)² の形（p = 0 なら x²）
const sh=(s,p)=>p===0?s+'²':`(${s} ${sg(-p)})²`;
const R1=[-6.8,6.8,-5,5],R2=[-8.16,8.16,-6,6];

/* 座標のある図。plot の方眼の上に、媒介変数で表した曲線・線分・点・ふちどりした文字を重ねる。座標はすべて数学の座標 */
function G(R,h=250){const g=plot(R,340,h),sx=g.sx,sy=g.sy,[x0,x1,y0,y1]=R,mx=x1-x0,my=y1-y0;let s='';
  const o={sx,sy,
    grid(){s+=plot(R,340,h).grid().out();return o;},
    // 曲線 (fx(t), fy(t))、t は t0 から t1。図から大きく外れた点では線を切る
    par(fx,fy,t0,t1,st=CV,N=240){let d='',pen=false;
      for(let i=0;i<=N;i++){const t=t0+(t1-t0)*i/N,x=fx(t),y=fy(t);
        if(!isFinite(x)||!isFinite(y)||x<x0-mx||x>x1+mx||y<y0-my||y>y1+my){pen=false;continue;}
        d+=(pen?'L':'M')+f(sx(x))+','+f(sy(y));pen=true;}
      if(d)s+=`<path d="${d}" fill="none" stroke-linejoin="round" ${st}/>`;return o;},
    seg(xa,ya,xb,yb,st=LI){s+=`<line x1="${f(sx(xa))}" y1="${f(sy(ya))}" x2="${f(sx(xb))}" y2="${f(sy(yb))}" ${st}/>`;return o;},
    dot(x,y,fill='var(--ink)',r=4.2){s+=`<circle cx="${f(sx(x))}" cy="${f(sy(y))}" r="${r}" fill="${fill}" stroke="var(--bg2)" stroke-width="1.5"/>`;return o;},
    // 文字。(x, y) から px で (dx, dy) だけずらして置く
    txt(x,y,t,dx=0,dy=0,c='var(--ink)',a='middle',z=12){s+=`<text x="${f(sx(x)+dx)}" y="${f(sy(y)+dy)}" font-size="${z}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" ${OUT}>${t}</text>`;return o;},
    // 矢印（平行移動の向き）
    arrow(xa,ya,xb,yb,c='var(--gold)'){const X1=sx(xa),Y1=sy(ya),X2=sx(xb),Y2=sy(yb),l=hyp(X2-X1,Y2-Y1);if(l<6)return o;const ux=(X2-X1)/l,uy=(Y2-Y1)/l;
      s+=`<line x1="${f(X1)}" y1="${f(Y1)}" x2="${f(X2-ux*7)}" y2="${f(Y2-uy*7)}" stroke="${c}" stroke-width="2"/><polygon points="${f(X2)},${f(Y2)} ${f(X2-ux*10-uy*4.5)},${f(Y2-uy*10+ux*4.5)} ${f(X2-ux*10+uy*4.5)},${f(Y2-uy*10-ux*4.5)}" fill="${c}"/>`;return o;},
    // 直角の印（頂点 V、辺の向きの点 A, B）
    rt(V,A,B,k=8,st='stroke="var(--muted)" stroke-width="1.2" fill="none"'){const P=[sx(V[0]),sy(V[1])],u=un(P,[sx(A[0]),sy(A[1])]),w=un(P,[sx(B[0]),sy(B[1])]);
      s+=`<path d="M${f(P[0]+u[0]*k)},${f(P[1]+u[1]*k)} L${f(P[0]+(u[0]+w[0])*k)},${f(P[1]+(u[1]+w[1])*k)} L${f(P[0]+w[0]*k)},${f(P[1]+w[1]*k)}" ${st}/>`;return o;},
    out:()=>s};
  return o;}
const un=(P,Q)=>{const x=Q[0]-P[0],y=Q[1]-P[1],l=hyp(x,y)||1;return [x/l,y/l];};
// px で描く図（draw）に、ふちどりした文字を足す
const tx=(d,x,y,t,c='var(--ink)',z=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${z}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" ${OUT}>${t}</text>`);

/* ---- 放物線：焦点までの距離 = 準線までの距離 ---- */
FIGS.hckyokusen_hobutsusen=host=>mk(host,{alt:'放物線上の点 P から焦点 F までの距離と、準線までの距離 PH が等しいことを示す図',
  sliders:[{k:'y',label:'点 P の y 座標',min:-3.6,max:3.6,step:.1,v:2.4},{k:'p',label:'p',min:.5,max:2,step:.25,v:1}],
  play:{k:'y',from:-3.6,to:3.6,label:'P を放物線の上で動かす',ms:3600},
  draw(v){const p=v.p,y=v.y,x=y*y/(4*p),g=G([-3,7.88,-4,4]).grid(),up=y>=0,in1=up!==(Math.abs(y)>3);
    g.seg(-p,-4,-p,4,'stroke="var(--ng)" stroke-width="1.8"').par(t=>t*t/(4*p),t=>t,-4.2,4.2)
     .seg(-p,y,x,y,LN).seg(p,0,x,y,LG).dot(-p,y,'var(--ng)',3.4).dot(p,0,'var(--gold)').dot(x,y);
    g.txt(-p,up?-3.5:3.5,'準線',-6,4,'var(--ng)','end',11).txt(p,0,'F',0,up?28:-10,'var(--gold)').txt(-p,y,'H',-10,in1?-6:15).txt(x,y,'P',10,in1?-8:16);
    return {svg:g.out(),read:`y² = 4px で p = ${n(p)}：y² = ${n(4*p)}x<br>焦点 F(${n(p)}, 0)、準線 x = ${n(-p)}<br>P(${n(x)}, ${n(y)})<br>PF = <b>${n(hyp(x-p,y))}</b>、PH = <b>${n(x+p)}</b>`};}});

/* ---- 楕円：2つの焦点からの距離の和 ---- */
FIGS.hckyokusen_daen=host=>mk(host,{alt:'楕円上の点 P から2つの焦点までの距離の和が一定であることを示す図',
  sliders:[{k:'t',label:'点 P の位置',min:0,max:360,step:5,v:50,fmt:deg},{k:'a',label:'a',min:2,max:5,step:.5,v:5},{k:'b',label:'b',min:1.5,max:4,step:.5,v:3}],
  play:{k:'t',from:0,to:360,label:'P を1周させる',ms:4200},
  draw(v){const a=v.a,b=v.b,t=v.t*PI/180,x=a*cos(t),y=b*sin(t),c=sqrt(Math.abs(a*a-b*b)),hz=a>=b,F=hz?[c,0]:[0,c],F2=hz?[-c,0]:[0,-c],g=G(R1).grid();
    g.par(u=>a*cos(u),u=>b*sin(u),0,2*PI).seg(F[0],F[1],x,y,LG).seg(F2[0],F2[1],x,y,LN);
    if(a===b)g.dot(0,0,'var(--gold)').txt(0,0,'F = F′',0,y>=0?17:-9,'var(--gold)');
    else if(hz)g.dot(c,0,'var(--gold)').dot(-c,0,'var(--ng)').txt(c,0,'F',0,y>=0?17:-9,'var(--gold)').txt(-c,0,'F′',0,y>=0?17:-9,'var(--ng)');
    else g.dot(0,c,'var(--gold)').dot(0,-c,'var(--ng)').txt(0,c,'F',x>=0?-12:12,4,'var(--gold)').txt(0,-c,'F′',x>=0?-13:13,4,'var(--ng)');
    g.dot(x,y).txt(x,y,'P',14*cos(t),-14*sin(t)+4);
    const d1=hyp(x-F[0],y-F[1]),d2=hyp(x-F2[0],y-F2[1]);
    return {svg:g.out(),read:`x²/${n(a*a)} + y²/${n(b*b)} = 1<br>`+(a===b?'a = b なので円。焦点は中心に重なる':hz?`焦点 (±c, 0)、c = √(a² − b²) = ${rt(a*a-b*b)}`:`焦点 (0, ±c)、c = √(b² − a²) = ${rt(b*b-a*a)}`)+
      `<br>PF = ${n(d1)}、PF′ = ${n(d2)}<br>PF + PF′ = <b>${n(d1+d2)}</b>（${hz?'2a':'2b'}）`};}});

/* ---- なぜ：ひもで楕円をかく（焦点 (±4, 0)、和を変える） ---- */
FIGS.hckyokusen_himo=host=>mk(host,{alt:'2つの焦点に両端を固定したひもを、ぴんと張ったまま動かして楕円をかく図',
  sliders:[{k:'t',label:'点 P の位置',min:0,max:360,step:5,v:60,fmt:deg},{k:'s',label:'距離の和（ひもの長さ）',min:9,max:12,step:1,v:10}],
  play:{k:'t',from:0,to:360,label:'ひもを張ったまま1周する',ms:4200},
  draw(v){const a=v.s/2,b2=a*a-16,b=sqrt(b2),t=v.t*PI/180,x=a*cos(t),y=b*sin(t),g=G(R1).grid(),d1=hyp(x-4,y),d2=hyp(x+4,y),lo=y>=0?17:-9;
    g.par(u=>a*cos(u),u=>b*sin(u),0,2*PI,'stroke="var(--c)" stroke-width="1.8"').seg(4,0,x,y,LG).seg(-4,0,x,y,LG).dot(4,0,'var(--ink)',3.6).dot(-4,0,'var(--ink)',3.6).dot(x,y,'var(--gold)');
    g.txt(4,0,'F',0,lo).txt(-4,0,'F′',0,lo).txt(x,y,'P',14*cos(t),-14*sin(t)+4,'var(--gold)');
    return {svg:g.out(),read:`F(4, 0)、F′(−4, 0)、P(${n(x)}, ${n(y)})<br>PF = ${n(d1)}、PF′ = ${n(d2)}、和 = <b>${n(d1+d2)}</b><br>a = ${n(a)}、b² = a² − 16 = ${n(b2)}<br>x²/${n(a*a)} + y²/${n(b2)} = <b>${n(x*x/(a*a)+y*y/b2)}</b>`};}});

/* ---- 円を y 軸方向に縮めると楕円 ---- */
FIGS.hckyokusen_shukusho=host=>mk(host,{alt:'円を、x 軸をもとにして y 軸方向に縮めると楕円になることを示す図',
  sliders:[{k:'k',label:'縮める割合 b/a',min:.25,max:1,step:.05,v:.6},{k:'t',label:'点 Q の位置',min:0,max:360,step:5,v:50,fmt:deg}],
  play:{k:'k',from:1,to:.25,label:'円を縮めていく',ms:3200},
  draw(v){const a=4,k=Math.round(v.k*100)/100,b=a*k,t=v.t*PI/180,qx=a*cos(t),qy=a*sin(t),py=k*qy,g=G(R1).grid(),sd=cos(t)>=0?1:-1;
    g.par(u=>a*cos(u),u=>a*sin(u),0,2*PI,FAINT).par(u=>a*cos(u),u=>b*sin(u),0,2*PI).seg(qx,0,qx,qy,FAINT).seg(qx,0,qx,py,LG).dot(qx,qy,'var(--muted)',3.6).dot(qx,py,'var(--gold)');
    g.txt(qx,qy,'Q',14*cos(t),-14*sin(t)+4,'var(--muted)').txt(qx,py,'P',-11*sd,4,'var(--gold)');
    return {svg:g.out(),read:`円 x² + y² = 16 上の点 Q(${n(qx)}, ${n(qy)})<br>y 座標を ${n(k)} 倍した点 P(${n(qx)}, ${n(py)})<br>P は x²/16 + y²/${n(b*b)} = 1 の上にある<br>代入した値：<b>${n(qx*qx/16+py*py/(b*b))}</b>`};}});

/* ---- 双曲線：距離の差と漸近線 ---- */
FIGS.hckyokusen_sokyokusen=host=>mk(host,{alt:'双曲線上の点 P から2つの焦点までの距離の差が一定で、曲線が漸近線に近づくことを示す図',
  sliders:[{k:'t',label:'点 P の位置',min:-1,max:1,step:.02,v:.56},{k:'a',label:'a',min:1,max:3,step:.5,v:2},{k:'b',label:'b',min:1,max:3,step:.5,v:1.5}],
  play:{k:'t',from:0,to:1,label:'P を遠くへ動かす',ms:3200},
  draw(v){const a=v.a,b=v.b,c=sqrt(a*a+b*b),s1=v.t<0?-1:1,xm=Math.min(7.2,a*sqrt(1+5.5*5.5/(b*b))),x=a+(xm-a)*v.t*v.t,y=s1*b*sqrt(Math.max(0,x*x/(a*a)-1)),ya=s1*b/a*x,g=G(R2).grid(),U=Math.acosh(9.5/a);
    g.seg(-9,-9*b/a,9,9*b/a,THIN).seg(-9,9*b/a,9,-9*b/a,THIN).seg(-a,-b,a,-b,FAINT).seg(a,-b,a,b,FAINT).seg(a,b,-a,b,FAINT).seg(-a,b,-a,-b,FAINT)
     .par(u=>a*Math.cosh(u),u=>b*Math.sinh(u),-U,U).par(u=>-a*Math.cosh(u),u=>b*Math.sinh(u),-U,U)
     .seg(-c,0,x,y,LN).seg(c,0,x,y,LG).seg(x,y,x,ya,'stroke="var(--ink)" stroke-width="3.2"').dot(c,0,'var(--gold)').dot(-c,0,'var(--ng)').dot(x,y);
    g.txt(c,0,'F',2,s1>0?17:-9,'var(--gold)').txt(-c,0,'F′',0,s1>0?17:-9,'var(--ng)').txt(x,y,'P',11,s1>0?14:-6);
    const d1=hyp(x-c,y),d2=hyp(x+c,y);
    return {svg:g.out(),read:`x²/${n(a*a)} − y²/${n(b*b)} = 1　焦点 (±${n(c)}, 0)<br>P(${n(x)}, ${n(y)})<br>PF′ = ${n(d2)}、PF = ${n(d1)}<br>PF′ − PF = <b>${n(d2-d1)}</b>（2a）<br>漸近線 y = ±${n(b/a)}x との縦の差 <b>${n(Math.abs(ya-y),3)}</b>`};}});

/* ---- 2次曲線の平行移動 ---- */
FIGS.hckyokusen_heikoido=host=>mk(host,{alt:'2次曲線を平行移動すると、中心や焦点も同じだけ移動することを示す図',
  sliders:[{k:'m',label:'曲線',min:1,max:3,step:1,v:1,fmt:m=>['楕円','放物線','双曲線'][m-1]},{k:'p',label:'x 軸方向に p',min:-3,max:3,step:.5,v:2},{k:'q',label:'y 軸方向に q',min:-3,max:3,step:.5,v:1}],
  draw(v){const p=v.p,q=v.q,m=v.m,g=G(R2).grid(),r5=sqrt(5),U=Math.acosh(8);
    const cur=(dx,dy,st)=>{if(m===1)g.par(u=>3*cos(u)+dx,u=>2*sin(u)+dy,0,2*PI,st);
      else if(m===2)g.par(u=>u*u/4+dx,u=>u+dy,-9,9,st);
      else g.par(u=>2*Math.cosh(u)+dx,u=>r5*Math.sinh(u)+dy,-U,U,st).par(u=>-2*Math.cosh(u)+dx,u=>r5*Math.sinh(u)+dy,-U,U,st);};
    const fs=m===1?[[r5,0],[-r5,0]]:m===2?[[1,0]]:[[3,0],[-3,0]];
    cur(0,0,FAINT);
    if(m===2)g.seg(-1,-7,-1,7,'stroke="var(--muted)" stroke-width="1" stroke-dasharray="2 4"').seg(p-1,-7,p-1,7,'stroke="var(--ng)" stroke-width="1.6"');
    cur(p,q,CV);g.arrow(0,0,p,q);
    fs.forEach((F,i)=>g.dot(F[0],F[1],'var(--muted)',3).dot(F[0]+p,F[1]+q,'var(--gold)').txt(F[0]+p,F[1]+q,i?'F′':'F',0,-9,'var(--gold)','middle',11));
    g.dot(p,q,'var(--ink)',3.4);
    const read=m===1?`x²/9 + y²/4 = 1 を平行移動した楕円<br>${sh('x',p)}/9 + ${sh('y',q)}/4 = 1<br>中心 (${n(p)}, ${n(q)})<br>焦点 (${n(p+r5)}, ${n(q)})、(${n(p-r5)}, ${n(q)})`
      :m===2?`y² = 4x を平行移動した放物線<br>${sh('y',q)} = 4${p===0?'x':'(x '+sg(-p)+')'}<br>頂点 (${n(p)}, ${n(q)})<br>焦点 (${n(p+1)}, ${n(q)})、準線 x = ${n(p-1)}`
      :`x²/4 − y²/5 = 1 を平行移動した双曲線<br>${sh('x',p)}/4 − ${sh('y',q)}/5 = 1<br>中心 (${n(p)}, ${n(q)})<br>焦点 (${n(p+3)}, ${n(q)})、(${n(p-3)}, ${n(q)})`;
    return {svg:g.out(),read};}});

/* ---- 楕円と直線の共有点 ---- */
const lin=(m,k)=>'y = '+(m===0?n(k):(m===1?'':m===-1?'−':n(m))+'x'+(k===0?'':' '+sg(k)));
const quad=(A,B,Cc)=>`${n(A)}x²`+(Math.abs(B)<1e-9?'':` ${sg(B)}x`)+(Math.abs(Cc)<1e-9?'':` ${sg(Cc)}`)+' = 0';
FIGS.hckyokusen_chokusen=host=>mk(host,{alt:'楕円と直線の共有点の個数が、直線の位置によって変わることを示す図',
  sliders:[{k:'k',label:'k（直線の y 切片）',min:-5,max:5,step:.1,v:1},{k:'m',label:'m（直線の傾き）',min:-2,max:2,step:.5,v:.5}],
  play:{k:'k',from:-5,to:5,label:'直線を下から上へ動かす',ms:4200},
  draw(v){const m=v.m,k=Math.round(v.k*10)/10,K=9*m*m+4-k*k,A=4+9*m*m,g=G(R1).grid(),pts=[];
    g.par(u=>3*cos(u),u=>2*sin(u),0,2*PI).seg(-7,-7*m+k,7,7*m+k,GL);
    if(K>1e-9)[1,-1].forEach(s=>{const x=(-9*m*k+s*6*sqrt(K))/A;pts.push([x,m*x+k]);});
    else if(K>-1e-9){const x=-9*m*k/A;pts.push([x,m*x+k]);}
    pts.forEach(q=>g.dot(q[0],q[1],pts.length===1?'var(--gold)':'var(--ink)'));
    return {svg:g.out(),read:`楕円 x²/9 + y²/4 = 1 と直線 ${lin(m,k)}<br>y を消去：${quad(A,18*m*k,9*k*k-36)}<br>D/4 = 36(9m² + 4 − k²) = ${n(36*K)}<br><b>共有点 ${pts.length} 個</b>（${['共有点をもたない','接する','異なる2点で交わる'][pts.length]}）<br>接するのは k = ±${n(sqrt(9*m*m+4))} のとき`};}});

/* ---- 楕円上の点における接線 ---- */
FIGS.hckyokusen_sessen=host=>mk(host,{alt:'楕円上の点 P における接線の図',
  sliders:[{k:'t',label:'点 P の位置',min:0,max:360,step:5,v:45,fmt:deg}],play:{k:'t',from:0,to:360,label:'接点を1周させる',ms:4600},
  draw(v){const a=sqrt(8),b=sqrt(2),t=v.t*PI/180,x=a*cos(t),y=b*sin(t),g=G([-5.44,5.44,-4,4]).grid(),L=6,A1=x/8,B1=y/2,zx=Math.abs(A1)<1e-9,zy=Math.abs(B1)<1e-9;
    g.par(u=>a*cos(u),u=>b*sin(u),0,2*PI).seg(x+L*a*sin(t),y-L*b*cos(t),x-L*a*sin(t),y+L*b*cos(t),GL).dot(x,y).txt(x,y,'P',-13*cos(t),13*sin(t)+4);
    const eq=zx?`${n(B1,3)}y`:zy?`${n(A1,3)}x`:`${n(A1,3)}x ${sg(B1,3)}y`;
    return {svg:g.out(),read:`楕円 x²/8 + y²/2 = 1 上の点 P(${n(x)}, ${n(y)})<br>接線：(${n(x)}/8)x + (${n(y)}/2)y = 1<br>すなわち ${eq} = 1<br>`+(zx||zy?'座標軸に平行な接線':`x 軸と (${n(8/x)}, 0)、y 軸と (0, ${n(2/y)}) で交わる`)};}});

/* ---- 離心率：PF : PH = e : 1 ---- */
FIGS.hckyokusen_rishinritsu=host=>mk(host,{alt:'焦点までの距離と準線までの距離の比 e を変えると、楕円・放物線・双曲線になることを示す図',
  sliders:[{k:'e',label:'離心率 e',min:.5,max:2,step:.1,v:.6},{k:'t',label:'F から見た P の向き',min:20,max:340,step:5,v:110,fmt:deg}],
  play:{k:'e',from:.5,to:2,label:'e を大きくしていく',ms:5200},
  draw(v){const e=Math.round(v.e*10)/10,d=3,t=v.t*PI/180,R=[-6.4,12.4889,-6.9444,6.9444],g=G(R).grid(),r=u=>e*d/(1-e*cos(u)),den=1-e*cos(t);let ex;
    g.seg(-d,-8,-d,8,'stroke="var(--ng)" stroke-width="1.8"').par(u=>r(u)*cos(u),u=>r(u)*sin(u),0,2*PI,CV,480).txt(-d,6.2,'準線',-6,4,'var(--ng)','end',11);
    if(Math.abs(den)>1e-6){const rr=r(t),x=rr*cos(t),y=rr*sin(t),PF=Math.abs(rr),PH=Math.abs(x+d),vis=x>R[0]+.4&&x<R[1]-.4&&y>R[2]+.4&&y<R[3]-.4;
      g.seg(-d,y,x,y,LN).seg(0,0,x,y,LG);
      if(vis)g.dot(-d,y,'var(--ng)',3.2).dot(x,y).txt(x,y,'P',x>-d?11:-11,y>=0?-8:16).txt(-d,y,'H',x>-d?-10:10,y>=0?-6:15);
      ex=`PF = ${n(PF)}、PH = ${n(PH)}`+(vis?'':'（P は図の外）')+`<br>PF ÷ PH = <b>${n(PF/PH)}</b>`;}
    else ex='この向きは漸近線に平行で、曲線上の点がない';
    g.dot(0,0,'var(--gold)').txt(0,0,'F',-9,16,'var(--gold)');
    return {svg:g.out(),read:`PF : PH = e : 1 を満たす点 P の集まり<br>e = ${n(e)}：<b>${e<1?'楕円':e===1?'放物線':'双曲線'}</b><br>`+ex};}});

/* ---- 媒介変数表示：t ごとに x と y が別々に決まる ---- */
FIGS.hckyokusen_baikai_t=host=>mk(host,{alt:'変数 t の値によって x 座標と y 座標が別々に決まり、点 P が放物線をえがく図',
  sliders:[{k:'t',label:'t',min:0,max:4,step:.05,v:1}],play:{k:'t',from:0,to:4,label:'t を 0 から 4 まで動かす',ms:4000},
  draw(v){const t=v.t,x=2*t,y=4*t-t*t,g=G([-2.2,8.68,-2,6]).grid();
    g.par(u=>2*u,u=>4*u-u*u,0,4,FAINT);if(t>0)g.par(u=>2*u,u=>4*u-u*u,0,t,'stroke="var(--c)" stroke-width="2.8" stroke-linecap="round"');
    g.seg(x,0,x,y,FAINT).seg(0,y,x,y,FAINT).dot(x,0,'var(--gold)',3.6).dot(0,y,'var(--ng)',3.6).dot(x,y);
    g.txt(x,0,'2t',0,28,'var(--gold)').txt(0,y,'4t − t²',-18,y<.5?-7:4,'var(--ng)','end').txt(x,y,'P',x>7?-10:9,-9);
    return {svg:g.out(),read:`t = ${n(t)}<br>x = 2t = <b>${n(x)}</b><br>y = 4t − t² = <b>${n(y)}</b><br>t を消去すると y = 2x − x²/4`};}});

/* ---- 楕円の媒介変数表示：半径 a の円と半径 b の円から P を作る ---- */
FIGS.hckyokusen_baikai=host=>mk(host,{alt:'半径 a の円上の点 Q と半径 b の円上の点から、楕円上の点 P を作る図',
  sliders:[{k:'k',label:'θ',min:0,max:48,step:1,v:7,fmt:k=>fr(k,24)},{k:'b',label:'b（a は 4）',min:1,max:4,step:.5,v:2.5}],
  play:{k:'k',from:0,to:48,label:'θ を 0 から 2π まで動かす',ms:4800},
  draw(v){const a=4,b=v.b,t=v.k*PI/24,g=G(R1).grid(),qx=a*cos(t),qy=a*sin(t),rx=b*cos(t),ry=b*sin(t);
    g.par(u=>a*cos(u),u=>a*sin(u),0,2*PI,FAINT).par(u=>b*cos(u),u=>b*sin(u),0,2*PI,FAINT).par(u=>a*cos(u),u=>b*sin(u),0,2*PI)
     .seg(0,0,qx,qy,THIN).seg(qx,qy,qx,ry,'stroke="var(--gold)" stroke-width="1.6" stroke-dasharray="3 3"').seg(rx,ry,qx,ry,'stroke="var(--ng)" stroke-width="1.6" stroke-dasharray="3 3"');
    if(v.k>0)g.par(u=>.9*cos(u),u=>.9*sin(u),0,t,'stroke="var(--gold)" stroke-width="1.6"',48).txt(1.5*cos(t/2),1.5*sin(t/2),'θ',0,4,'var(--gold)','middle',11);
    g.dot(qx,qy,'var(--muted)',3.4).dot(rx,ry,'var(--muted)',3.4).dot(qx,ry).txt(qx,qy,'Q',14*cos(t),-14*sin(t)+4,'var(--muted)');
    if(b<4)g.txt(qx,ry,'P',cos(t)>=0?11:-11,sin(t)>=0?15:-7);
    return {svg:g.out(),read:`θ = ${fr(v.k,24)}<br>半径 4 の円上の点 Q(4cos θ, 4sin θ)<br>P(4cos θ, ${n(b)}sin θ) = (<b>${n(qx)}</b>, <b>${n(ry)}</b>)<br>x²/16 + y²/${n(b*b)} = <b>${n(qx*qx/16+ry*ry/(b*b))}</b>`};}});

/* ---- なぜ：サイクロイド（円を転がす） ---- */
const cyR=[-1.1,10.6,-1.05,3.2172];
FIGS.hckyokusen_cycloid=host=>mk(host,{h:124,alt:'x 軸の上を転がる円と、円周上の点 P がえがくサイクロイドの図',
  sliders:[{k:'k',label:'回転した角 θ',min:0,max:72,step:1,v:16,fmt:k=>fr(k,24)}],
  play:{k:'k',from:0,to:72,label:'円を転がす',ms:6400},
  draw(v){const th=v.k*PI/24,g=G(cyR,124),X=u=>u-sin(u),Y=u=>1-cos(u),px=X(th),py=Y(th),W='stroke="var(--ng)" stroke-width="3.4" stroke-linecap="round"';
    g.seg(-1.1,0,10.6,0,THIN);[1,2,3].forEach(i=>g.seg(i*PI,-.08,i*PI,.08,THIN).txt(i*PI,0,(i===1?'':i)+'πa',0,27,'var(--muted)','middle',10));
    g.par(X,Y,0,3*PI,FAINT,200);if(v.k>0)g.par(X,Y,0,th,LG,Math.max(8,v.k*4)).seg(0,0,th,0,W).par(u=>th-sin(u),u=>1-cos(u),0,th,W,Math.max(8,v.k*3));
    g.par(u=>th+cos(u),u=>1+sin(u),0,2*PI,'stroke="var(--ink)" stroke-width="1.4"',90).seg(th,1,th,0,FAINT).seg(th,1,px,py,'stroke="var(--ink)" stroke-width="1.4"')
     .dot(th,0,'var(--ink)',3).dot(th,1,'var(--ink)',2.6).dot(px,py,'var(--gold)');
    g.txt(0,0,'O',-12,14,'var(--muted)').txt(th,0,'T',12,14).txt(px,py,'P',-13*sin(th),13*cos(th)+4,'var(--gold)');
    return {svg:g.out(),read:`θ = ${fr(v.k,24)}${v.k?' ≈ '+n(th):''}（半径 a = 1）<br>OT = 弧 TP = aθ = <b>${n(th)}</b><br>P(θ − sin θ, 1 − cos θ) = (<b>${n(px)}</b>, <b>${n(py)}</b>)`};}});

// 数 × a の表示（0、a、−a は係数を書かない）
const ka=v=>{const t=n(v);return t==='0'?'0':t==='1'?'a':t==='−1'?'−a':t+'a';};
/* ---- なぜ：中心 C から見た P の位置 ---- */
FIGS.hckyokusen_cycloid_kaku=host=>mk(host,{alt:'転がる円の中心 C から見た点 P の位置を、直角三角形の2辺 a sin θ と a cos θ で表す図',
  sliders:[{k:'k',label:'回転した角 θ',min:1,max:23,step:1,v:4,fmt:k=>fr(k,12)}],
  play:{k:'k',from:1,to:23,label:'θ を増やす',ms:5200},
  draw(v){const th=v.k*PI/12,d=draw(),cx=196,cy=110,R=84,gy=cy+R,px=cx-R*sin(th),py=cy+R*cos(th),ox=cx-R*th,W='stroke="var(--ng)" stroke-width="3.4" fill="none" stroke-linecap="round"';
    d.line(10,gy,330,gy,'stroke="var(--muted)" stroke-width="1.4"').circle(cx,cy,R,'stroke="var(--ink)" stroke-width="1.4" fill="none"');
    let arc='';for(let i=0;i<=60;i++){const u=th*i/60;arc+=(i?'L':'M')+f(cx-R*sin(u))+','+f(cy+R*cos(u));}
    d.path(arc,W).line(Math.max(10,ox),gy,cx,gy,W);
    d.line(cx,cy,cx,gy,'stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="4 4"').line(cx,cy,cx,py,'stroke="var(--c)" stroke-width="3"').line(cx,py,px,py,'stroke="var(--gold)" stroke-width="3"').line(cx,cy,px,py,'stroke="var(--ink)" stroke-width="1.8"');
    d.angle(cx,cy,20,270-v.k*15,270);
    d.dot(cx,cy,'var(--ink)',3).dot(cx,gy,'var(--ink)',3).dot(px,py,'var(--gold)',4.5);
    const am=(270-v.k*7.5)*PI/180,sd=sin(th)>=0?1:-1;
    tx(d,cx+34*cos(am),cy-34*sin(am)+4,'θ','var(--gold)',11);
    tx(d,cx+9*sd,cy-7,'C','var(--ink)',12,sd>0?'start':'end');tx(d,cx+9,gy+15,'T');tx(d,px-15*sin(th),py+15*cos(th)+4,'P','var(--gold)');
    if(Math.abs(sin(th))>.45)tx(d,(cx+px)/2,py+(cos(th)>=0?-7:15),(sin(th)<0?'−':'')+'a sin θ','var(--gold)',11);
    if(Math.abs(cos(th))>.3)tx(d,cx+8*sd,(cy+py)/2+4,(cos(th)<0?'−':'')+'a cos θ','var(--c)',11,sd>0?'start':'end');
    if(ox>=18){d.dot(ox,gy,'var(--muted)',3);tx(d,ox,gy+15,'O','var(--muted)');}
    tx(d,(Math.max(10,ox)+cx)/2,gy+29,'aθ','var(--ng)',11);
    return {svg:d.out(),read:`θ = ${fr(v.k,12)}：sin θ = ${n(sin(th))}、cos θ = ${n(cos(th))}<br>C から見た P の位置<br>横に −a sin θ = <b>${ka(-sin(th))}</b><br>縦に −a cos θ = <b>${ka(-cos(th))}</b>`};}});

/* ---- 極座標：距離 r と角 θ ---- */
const polar=(d,O,u,k)=>{for(let i=1;i<=k;i++)d.circle(O[0],O[1],i*u,'stroke="var(--line)" stroke-width=".8" fill="none"');
  for(let i=0;i<12;i++){const a=i*PI/6;d.line(O[0],O[1],O[0]+k*u*cos(a),O[1]-k*u*sin(a),'stroke="var(--line)" stroke-width=".8"');}
  d.line(O[0],O[1],O[0]+(k+.5)*u,O[1],'stroke="var(--muted)" stroke-width="1.6"');return d;};
FIGS.hckyokusen_kyoku=host=>mk(host,{alt:'極 O からの距離 r と、始線 OX からの角 θ で点 P の位置を表す図',
  sliders:[{k:'r',label:'r',min:.5,max:5,step:.5,v:4},{k:'k',label:'θ',min:0,max:24,step:1,v:4,fmt:k=>fr(k,12)}],
  play:{k:'k',from:0,to:24,label:'θ を 0 から 2π まで動かす',ms:4400},
  draw(v){const d=draw(),O=[164,125],u=22,th=v.k*PI/12,r=v.r,P=[O[0]+r*u*cos(th),O[1]-r*u*sin(th)],GD='stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="3 3"';
    polar(d,O,u,5);tx(d,O[0]+5.5*u+10,O[1]+4,'X','var(--muted)');
    d.line(P[0],P[1],P[0],O[1],GD).line(P[0],P[1],O[0],P[1],GD).line(O[0],O[1],P[0],P[1],'stroke="var(--gold)" stroke-width="2.6" stroke-linecap="round"');
    if(v.k===24)d.circle(O[0],O[1],15,'stroke="var(--c)" stroke-width="1.8" fill="none"');else if(v.k>0)d.angle(O[0],O[1],15,0,v.k*15,'stroke="var(--c)" stroke-width="1.8" fill="none"');
    d.dot(O[0],O[1],'var(--ink)',3).dot(P[0],P[1],'var(--ink)',4.5);
    if(v.k>0)tx(d,O[0]+27*cos(th/2),O[1]-27*sin(th/2)+4,'θ','var(--c)',11);
    tx(d,O[0]-9,O[1]+15,'O');tx(d,P[0]+13*cos(th),P[1]-13*sin(th)+4,'P');
    tx(d,(O[0]+P[0])/2-10*sin(th),(O[1]+P[1])/2-10*cos(th)+4,'r','var(--gold)');
    return {svg:d.out(),read:`極座標 (r, θ) = (${n(r)}, ${fr(v.k,12)})<br>x = r cos θ = <b>${n(r*cos(th))}</b><br>y = r sin θ = <b>${n(r*sin(th))}</b>`+(v.k===24?'<br>θ = 2π は、θ = 0 と同じ点を表す':'')};}});

/* ---- 極方程式：θ を動かして曲線をえがく ---- */
const CUR=[{nm:'円',eq:'r = 4cos θ',r:t=>4*cos(t),ox:118,note:'θ が 0 から π まで動くと、円を1周する'},
  {nm:'カージオイド',eq:'r = 2(1 + cos θ)',r:t=>2*(1+cos(t)),ox:128,note:'θ = π のとき r = 0 で、極 O を通る'},
  {nm:'正葉曲線',eq:'r = 4sin 2θ',r:t=>4*sin(2*t),ox:170,note:'4枚の葉の形。θ が 2π 動くと1周する'},
  {nm:'渦巻線',eq:'r = θ/2',r:t=>t/2,ox:170,note:'θ が増えるほど、極 O から遠ざかる'}];
FIGS.hckyokusen_kyokuhoteishiki=host=>mk(host,{alt:'極方程式で表された曲線を、θ を動かしてえがく図',
  sliders:[{k:'m',label:'曲線',min:1,max:4,step:1,v:1,fmt:m=>CUR[m-1].nm},{k:'k',label:'θ',min:0,max:48,step:1,v:8,fmt:k=>fr(k,24)}],
  play:{k:'k',from:0,to:48,label:'θ を 0 から 2π まで動かす',ms:5600},
  draw(v){const d=draw(),c=CUR[v.m-1],O=[c.ox,125],u=26,th=v.k*PI/24,r=c.r(th),pt=t=>[O[0]+u*c.r(t)*cos(t),O[1]-u*c.r(t)*sin(t)],P=pt(th);
    polar(d,O,u,4);
    const path=(t1,N)=>{let s='';for(let i=0;i<=N;i++){const q=pt(t1*i/N);s+=(i?'L':'M')+f(q[0])+','+f(q[1]);}return s;};
    d.path(path(2*PI,240),'stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="4 4" fill="none"');
    if(v.k>0)d.path(path(th,Math.max(6,v.k*5)),'stroke="var(--c)" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"');
    d.line(O[0],O[1],O[0]+4.3*u*cos(th),O[1]-4.3*u*sin(th),'stroke="var(--muted)" stroke-width="1.2"');
    d.line(O[0],O[1],P[0],P[1],'stroke="var(--gold)" stroke-width="2.2"'+(r<0?' stroke-dasharray="4 3"':''));
    d.dot(O[0],O[1],'var(--ink)',3).dot(P[0],P[1],'var(--gold)',4.5);tx(d,O[0]-9,O[1]+15,'O');
    return {svg:d.out(),read:`${c.nm}　${c.eq}<br>θ = ${fr(v.k,24)} のとき r = <b>${n(r)}</b><br>`+(r<-1e-9?'r < 0 なので、θ の向きと反対側の点<br>':'')+c.note};}});

/* ---- リサージュ曲線 ---- */
FIGS.hckyokusen_lissajous=host=>mk(host,{alt:'媒介変数表示 x = sin at、y = sin bt で表されるリサージュ曲線の図',
  sliders:[{k:'a',label:'a',min:1,max:4,step:1,v:3},{k:'b',label:'b',min:1,max:4,step:1,v:2},{k:'k',label:'t',min:0,max:48,step:1,v:5,fmt:k=>fr(k,24)}],
  play:{k:'k',from:0,to:48,label:'t を 0 から 2π まで動かす',ms:5600},
  draw(v){const a=v.a,b=v.b,t=v.k*PI/24,g=G([-1.9,1.9,-1.4,1.4]).grid(),X=u=>sin(a*u),Y=u=>sin(b*u);
    g.par(X,Y,0,2*PI,FAINT,480);if(v.k>0)g.par(X,Y,0,t,CV,Math.max(8,v.k*10));g.dot(X(t),Y(t),'var(--gold)');
    return {svg:g.out(),read:`x = sin ${a===1?'':a}t、y = sin ${b===1?'':b}t（0 ≦ t ≦ 2π）<br>t = ${fr(v.k,24)} のとき P(${n(X(t))}, ${n(Y(t))})`+(a===b?'<br>a = b のときは、線分 y = x の上を往復する':'')};}});

/* ---- 軸の上をすべる線分と、その内分点 ---- */
FIGS.hckyokusen_hashigo=host=>mk(host,{alt:'両端が x 軸と y 軸の上を動く長さ 3 の線分 AB と、AB を 2 : 1 に内分する点 P の図',
  sliders:[{k:'t',label:'線分 AB の向き',min:0,max:360,step:5,v:40,fmt:deg}],play:{k:'t',from:0,to:360,label:'線分を動かす',ms:5200},
  draw(v){const t=v.t*PI/180,ax=3*cos(t),by=3*sin(t),x=cos(t),y=2*sin(t),g=G([-4.76,4.76,-3.5,3.5]).grid();
    if(v.t>0)g.par(u=>cos(u),u=>2*sin(u),0,t,'stroke="var(--gold)" stroke-width="2"',Math.max(8,v.t));
    g.seg(ax,0,0,by,LI).dot(ax,0,'var(--ink)',3.6).dot(0,by,'var(--ink)',3.6).dot(x,y,'var(--gold)');
    g.txt(ax,0,'A',0,by>=0?28:-9).txt(0,by,'B',ax>=0?-18:18,4).txt(x,y,'P',ax>=0?11:-11,by>=0?-8:16,'var(--gold)');
    return {svg:g.out(),read:`A(${n(ax)}, 0)、B(0, ${n(by)})、AB = 3<br>AP : PB = 2 : 1<br>P(<b>${n(x)}</b>, <b>${n(y)}</b>)`};}});

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
const Q={
 gen:{alt:'放物線 y² = 4x の焦点 F を通る直線が放物線と2点 A, B で交わり、A, B から準線に垂線 AH, BK を下ろした図',f(){const g=G([-2.5,9.74,-4,5]).grid(),r2=sqrt(2),A=[3+2*r2,2+2*r2],B=[3-2*r2,2-2*r2];
   g.seg(-1,-4,-1,5,'stroke="var(--ng)" stroke-width="1.8"').par(t=>t*t/4,t=>t,-4.2,5.2).seg(-1,-2,7.4,6.4,LI).seg(-1,A[1],A[0],A[1],FAINT).seg(-1,B[1],B[0],B[1],FAINT)
    .dot(-1,A[1],'var(--ng)',3.2).dot(-1,B[1],'var(--ng)',3.2).dot(1,0,'var(--gold)').dot(A[0],A[1]).dot(B[0],B[1]);
   g.txt(A[0],A[1],'A',11,10).txt(B[0],B[1],'B',10,15).txt(1,0,'F',10,15,'var(--gold)').txt(-1,A[1],'H',-10,4).txt(-1,B[1],'K',-10,4).txt(-1,3,'準線',-6,4,'var(--ng)','end',11);
   return {svg:g.out(),read:'放物線 y² = 4x、焦点 F(1, 0)、準線 x = −1<br>直線 AB は F を通り、傾きは 1'};}},
 sessuru:{alt:'直線 x = −2 に接し、中心 (3, 0)、半径 1 の円に外接する円 P の図',f(){const g=G([-5,8.6,-3.4,6.6]).grid(),P=[.75,3],r=2.75;
   g.seg(-2,-3.4,-2,6.6,LI).par(u=>3+cos(u),u=>sin(u),0,2*PI,'stroke="var(--ink)" stroke-width="2"').par(u=>P[0]+r*cos(u),u=>P[1]+r*sin(u),0,2*PI)
    .seg(P[0],P[1],-2,3,FAINT).seg(P[0],P[1],3,0,FAINT).rt([-2,3],[-2,5],[0,3]).dot(3,0,'var(--ink)',3.2).dot(-2,3,'var(--ink)',3).dot(P[0],P[1],'var(--gold)');
   g.txt(P[0],P[1],'P',2,-9,'var(--gold)').txt(-2,3,'H',-10,-5).txt(3,0,'A',0,17).txt(-2,-2.6,'x = −2',-6,4,'var(--ink)','end',11);
   return {svg:g.out(),read:'円 P は、直線 x = −2 に点 H で接し、<br>中心 A(3, 0)、半径 1 の円に外接する'};}},
 chokkaku:{alt:'楕円 x²/9 + y²/4 = 1 の上の点 P と2つの焦点 F, F′ を結び、角 FPF′ が直角になっている図',f(){const g=G([-5.44,5.44,-4,4]).grid(),c=sqrt(5),P=[3/c,4/c];
   g.par(u=>3*cos(u),u=>2*sin(u),0,2*PI).seg(c,0,P[0],P[1],LG).seg(-c,0,P[0],P[1],LN).seg(-c,0,c,0,LI).rt(P,[c,0],[-c,0],9,'stroke="var(--ink)" stroke-width="1.2" fill="none"')
    .dot(c,0,'var(--gold)').dot(-c,0,'var(--ng)').dot(P[0],P[1]);
   g.txt(P[0],P[1],'P',6,-9).txt(c,0,'F',2,17,'var(--gold)').txt(-c,0,'F′',0,17,'var(--ng)');
   return {svg:g.out(),read:'楕円 x²/9 + y²/4 = 1、焦点 F, F′<br>∠FPF′ = 90°'};}},
 gaiten:{alt:'楕円 x²/4 + y²/3 = 1 と、楕円の外の点 A(4, 0) から引いた2本の接線の図',f(){const g=G([-4.08,6.8,-4,4]).grid(),r3=sqrt(3);
   g.par(u=>2*cos(u),u=>r3*sin(u),0,2*PI).seg(4,0,-2.4,3.2,GL).seg(4,0,-2.4,-3.2,GL).dot(1,1.5).dot(1,-1.5).dot(4,0,'var(--gold)');
   g.txt(4,0,'A(4, 0)',8,-7,'var(--gold)','start').txt(1,1.5,'P',6,-9).txt(1,-1.5,'P′',7,17);
   return {svg:g.out(),read:'楕円 x²/4 + y²/3 = 1 と、点 A(4, 0) から引いた2本の接線<br>P, P′ は接点'};}}
};
FIGS.hckyokusen_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,sliders:[],draw(){return q.f();}});};
})();
