/* 数学III「極限」（教科書の「関数」と「極限」の2章）の図（FIGS.h3kyokugen_*） */
(function(){
const {plot,draw,n,sg,C,GOLD,DASH,mk}=FIG;
const f1=v=>v.toFixed(1);
const INK='stroke="var(--ink)" stroke-width="1.8"',AX='stroke="var(--muted)" stroke-width="1.2"';
const GD='stroke="var(--gold)" stroke-width="1.4" stroke-dasharray="5 4"';
const THIN='stroke="var(--c)" stroke-width="1" opacity=".45"';
const T='paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round"';
// 白抜きの点（その点を含まない）。plot の座標で位置を決め、SVG の文字列を返す
const ring=(p,x,y,col='var(--c)')=>`<circle cx="${f1(p.sx(x))}" cy="${f1(p.sy(y))}" r="4.2" fill="var(--bg2)" stroke="${col}" stroke-width="2"/>`;
// 方眼を使わない図の座標軸と目盛り
const axes=(p,r,xt,yt,xl)=>{const dx=(r[1]-r[0])*.008,dy=(r[3]-r[2])*.012;p.seg(r[0],0,r[1],0,AX).seg(0,r[2],0,r[3],AX);
  xt.forEach(x=>p.seg(x,-dy,x,dy,AX).txt(x,r[2],n(x),'text-anchor="middle" dy="-7"'));
  yt.forEach(y=>p.seg(-dx,y,dx,y,AX).txt(0,y,n(y),'text-anchor="end" dx="-6" dy="4"'));
  p.txt(r[1],0,xl,'text-anchor="end" dx="-4" dy="-6"');return p;};

/* ---- 分数関数 y = k/(x − p) + q ---- */
FIGS.h3kyokugen_bunsu=host=>mk(host,{alt:'分数関数 y = k/(x − p) + q のグラフと、2本の漸近線の図',
  sliders:[{k:'k',label:'k',min:-3,max:3,step:.5,v:1},{k:'p',label:'p',min:-2,max:2,step:.5,v:0},{k:'q',label:'q',min:-2,max:2,step:.5,v:0}],
  draw(v){const k=v.k,a=v.p,q=v.q,pl=plot([-5,5,-5,5]).grid(),f=x=>k/(x-a)+q;
    pl.seg(a,-5,a,5,GD).seg(-5,q,5,q,GD);
    if(k!==0)pl.curve(f,C,-5,a-.02).curve(f,C,a+.02,5);else pl.seg(-5,q,5,q,C);
    pl.txt(a,-5,'x = '+n(a),(k<0?'text-anchor="end" dx="-5"':'dx="5"')+' dy="-7" fill="var(--gold)" '+T).txt(-5,q,'y = '+n(q),'dx="5" dy="'+(k<0?15:-6)+'" fill="var(--gold)" '+T);
    const den=a===0?'x':`(x ${sg(-a)})`,eq=`y = ${n(k)}/${den}`+(q?' '+sg(q):'');
    return {svg:pl.out(),read:k===0?`k = 0 のときは y = ${n(q)}<br>定数関数で、分数関数ではない`:
      `<i>${eq}</i><br>漸近線は 直線 x = <b>${n(a)}</b> と 直線 y = <b>${n(q)}</b><br>定義域 x ≠ ${n(a)}、値域 y ≠ ${n(q)}<br>`+(k>0?'k > 0：漸近線の交点から見て右上と左下':'k < 0：漸近線の交点から見て左上と右下')};}});

/* ---- 無理関数 y = √(x + 2) と直線 y = x + k ---- */
FIGS.h3kyokugen_muri=host=>mk(host,{alt:'無理関数 y = √(x + 2) のグラフと直線 y = x + k の共有点を数える図',
  sliders:[{k:'k',label:'k',min:-2,max:2.5,step:.05,v:0}],play:{k:'k',from:-2,to:2.5,label:'直線を上へ動かす',ms:4600},
  draw(v){const k=Math.round(v.k*100)/100,p=plot([-3.5,4.5,-2.6,3.3]).grid(),f=x=>Math.sqrt(x+2);
    p.curve(x=>-f(x),DASH,-2,4.5).curve(f,C,-2,4.5).seg(-3.5,-3.5+k,4.5,4.5+k,INK);
    const D=9-4*k,pts=[];
    if(D>=0){const s=Math.sqrt(D);pts.push([((1-2*k)+s)/2,0]);if(s>1e-9)pts.push([((1-2*k)-s)/2,0]);pts.forEach(q=>q[1]=q[0]+k);}
    const ok=pts.filter(q=>q[1]>=-1e-9),ng=pts.filter(q=>q[1]<-1e-9);
    ng.forEach(q=>p.dot(q[0],q[1],'var(--muted)',3.6));ok.forEach(q=>p.dot(q[0],q[1],'var(--gold)'));
    return {svg:p.out(),read:`直線 y = x${k?' '+sg(k):''}<br>曲線 y = √(x + 2) との共有点 <b>${ok.length} 個</b>`+(ok.length?'（x = '+ok.map(q=>q[0]).sort((u,w)=>u-w).map(x=>n(x)).join('、')+'）':'')+
      (ng.length?'<br>灰色の点は、点線 y = −√(x + 2) との交点<br>2乗した方程式の解には出てくるが、もとの方程式の解ではない':'')};}});

/* ---- 逆関数：直線 y = x に関して対称 ---- */
FIGS.h3kyokugen_gyaku=host=>mk(host,{alt:'関数のグラフと逆関数のグラフが、直線 y = x に関して対称になっている図',
  sliders:[{k:'m',label:'もとの関数',min:1,max:3,step:1,v:1,fmt:m=>['y = 2x − 2','y = x²（x ≥ 0）','y = 2^x'][m-1]},{k:'t',label:'点 P の x 座標',min:0,max:2,step:.1,v:1.5}],
  draw(v){const S=[[x=>2*x-2,x=>x/2+1,'y = 2x − 2','y = x/2 + 1',-3.4,6.12,-3.4,6.12],[x=>x*x,x=>Math.sqrt(x),'y = x²（x ≥ 0）','y = √x',0,6.12,0,6.12],[x=>Math.pow(2,x),x=>Math.log2(x),'y = 2^x','y = log₂x',-3.4,6.12,.01,6.12]][v.m-1];
    const t=v.t,y=S[0](t),p=plot([-3.4,6.12,-2.5,4.5]).grid();
    p.seg(-3.4,-3.4,6.12,6.12,DASH).curve(S[0],C,S[4],S[5]).curve(S[1],GOLD,S[6],S[7]).seg(t,y,y,t,'stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="3 3"');
    p.dot(t,y,'var(--c)').dot(y,t,'var(--gold)').dot((t+y)/2,(t+y)/2,'var(--ink)',2.6);
    const up=y>=t;p.txt(t,y,'P',(up?'text-anchor="end" dx="-8" dy="-5"':'dx="9" dy="13"')+' fill="var(--c)" '+T).txt(y,t,'Q',(up?'dx="9" dy="13"':'text-anchor="end" dx="-8" dy="-5"')+' fill="var(--gold)" '+T);
    p.txt(4.3,4.3,'y = x','dx="8" dy="12" '+T);
    return {svg:p.out(),read:`もとの関数 <i>${S[2]}</i><br>逆関数 <b>${S[3]}</b><br>P(${n(t)}, ${n(y)}) と Q(${n(y)}, ${n(t)})<br>x 座標と y 座標が入れかわり、直線 y = x に関して対称`};}});

/* ---- 数列の極限：点の列で見る ---- */
FIGS.h3kyokugen_suretsu=host=>mk(host,{alt:'数列の項を点の列として並べ、n を大きくしたときの様子を見る図',
  sliders:[{k:'m',label:'数列の第 n 項',min:1,max:4,step:1,v:1,fmt:m=>['1 + 1/n','(−1)ⁿ/n','n/5','(−1)ⁿ'][m-1]},{k:'N',label:'並べる項の数',min:5,max:30,step:1,v:8}],play:{k:'N',from:5,to:30,label:'項を増やす',ms:4400},
  draw(v){const S=[[k=>1+1/k,1,'n を大きくすると 1 に近づく（収束）'],[k=>(k%2?-1:1)/k,0,'正と負を行き来しながら 0 に近づく（収束）'],[k=>k/5,null,'いくらでも大きくなる（正の無限大に発散）'],[k=>k%2?-1:1,null,'−1 と 1 を行き来する（振動。極限はない）']][v.m-1];
    const r=[-2.6,31.6,-1.7,3.3],p=plot(r);axes(p,r,[10,20,30],[-1,1,2,3],'n');
    if(S[1]!==null)p.seg(0,S[1],31.6,S[1],GD);
    for(let k=1;k<v.N;k++){const a=S[0](k),b=S[0](k+1);if(a<=3.3&&b<=3.3)p.seg(k,a,k+1,b,THIN);}
    for(let k=1;k<=v.N;k++){const y=S[0](k),last=k===v.N;if(y<=3.3)p.dot(k,y,last?'var(--gold)':'var(--c)',last?4.6:3.2);else if(last)p.txt(k,3.3,'↑','text-anchor="middle" dy="13" fill="var(--gold)"');}
    const y=S[0](v.N);
    return {svg:p.out(),read:`第 n 項：${['1 + 1/n','(−1)ⁿ/n','n/5','(−1)ⁿ'][v.m-1]}<br>n = ${v.N} のときの値 <b>${n(y,4)}</b><br>${S[2]}`+(S[1]!==null?`<br>極限値 ${S[1]} との差は ${n(Math.abs(y-S[1]),4)}`:'')};}});

/* ---- 無限等比数列 rⁿ ---- */
FIGS.h3kyokugen_touhi=host=>mk(host,{alt:'無限等比数列 r の n 乗の項を、点の列として並べた図',
  sliders:[{k:'r',label:'r',min:-1.3,max:1.3,step:.05,v:.7}],play:{k:'r',from:-1.3,to:1.3,label:'r を −1.3 から 1.3 まで動かす',ms:5600},
  draw(v){const r=Math.round(v.r*100)/100,R=[-1.8,21.6,-2.35,2.35],p=plot(R);axes(p,R,[5,10,15,20],[-2,-1,1,2],'n');
    const y=k=>Math.pow(r,k),inside=t=>Math.abs(t)<=2.35;
    for(let k=1;k<20;k++)if(inside(y(k))&&inside(y(k+1)))p.seg(k,y(k),k+1,y(k+1),THIN);
    for(let k=1;k<=20;k++)if(inside(y(k)))p.dot(k,y(k),'var(--c)',3.4);
    const kind=r>1?'いくらでも大きくなる（正の無限大に発散）':r===1?'つねに 1（1 に収束）':Math.abs(r)<1?'0 に近づく（0 に収束）':r===-1?'−1 と 1 を行き来する（振動）':'符号を変えながら絶対値が大きくなる（振動）';
    return {svg:p.out(),read:`r = ${n(r)}<br>r⁵ = ${n(y(5),4)}、r¹⁰ = ${n(y(10),4)}、r²⁰ = <b>${n(y(20),4)}</b><br>${kind}`};}});

/* ---- 無限等比級数：項をつないで部分和を作る ---- */
FIGS.h3kyokugen_kyusu=host=>mk(host,{alt:'初項 1、公比 r の等比数列の項を順につないで、部分和が和に近づく様子を見る図',h:190,
  sliders:[{k:'r',label:'公比 r',min:.1,max:.9,step:.05,v:.5},{k:'N',label:'たす項の数 n',min:1,max:12,step:1,v:3}],play:{k:'N',from:1,to:12,label:'項を1つずつたす',ms:4600},
  draw(v){const r=Math.round(v.r*100)/100,N=v.N,S=1/(1-r),W=300,x0=20,u=W/S,d=draw();let x=x0,s=0;
    d.poly([[x0,72],[x0+W,72],[x0+W,122],[x0,122]],'fill="none" stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="4 4"');
    for(let k=0;k<N;k++){const t=Math.pow(r,k),w=t*u;d.poly([[x,72],[x+w,72],[x+w,122],[x,122]],`fill="var(--${k%2?'gold':'c'})" fill-opacity="${k%2?.4:.5}" stroke="var(--bg2)" stroke-width="1"`);
      if(w>=30)d.text(x+w/2,101,k===0?'1':k===1?'r':'r'+['²','³','⁴','⁵','⁶','⁷','⁸','⁹','¹⁰','¹¹'][k-2]);x+=w;s+=t;}
    d.line(x,60,x,134,'stroke="var(--ink)" stroke-width="1.6"');
    d.text(Math.max(46,Math.min(294,x)),50,'部分和 '+n(s,3));
    d.text(x0,144,'0','fill="var(--muted)"').text(x0+W,144,n(S,3),'text-anchor="end" fill="var(--muted)"').text(x0+W,162,'点線の右端 = 1/(1 − r)','text-anchor="end" fill="var(--muted)"');
    return {svg:d.out(),read:`公比 r = ${n(r)}、初項 1 から ${N} 項までの和<br>部分和 = <b>${n(s,4)}</b><br>1/(1 − r) = <i>${n(S,4)}</i><br>残り = ${n(S-s,4)}（rⁿ/(1 − r) に等しい）`};}});

/* ---- 関数の極限（arg.m = 'hole'：穴のあいた点に近づく ／ 'kata'：右と左で近づく値がちがう） ---- */
FIGS.h3kyokugen_kansu=(host,arg)=>{const kata=!!(arg&&arg.m==='kata');
  mk(host,{alt:kata?'x = 1 の右と左で、近づく値がちがう関数のグラフ':'x = 1 で値が定義されていない関数のグラフと、x を 1 に近づけたときの値の図',
  sliders:[{k:'x',label:'x',min:-1,max:3,step:.01,v:2.4}],play:{k:'x',from:2.4,to:1.01,label:'x を右から 1 に近づける',ms:3800},
  draw(v){const x=Math.round(v.x*100)/100,f=kata?(t=>t>1?t:-t):(t=>t+1),r=kata?[-1.7,3.7,-2.2,3.3]:[-1.7,3.7,-1,4.5],p=plot(r).grid();
    if(kata)p.curve(f,C,-1.7,.9999).curve(f,C,1.0001,3.7);else p.curve(f,C);
    if(x!==1)p.seg(x,0,x,f(x),DASH).seg(0,f(x),x,f(x),DASH);
    let ex=ring(p,1,kata?1:2)+(kata?ring(p,1,-1):'');
    if(x!==1){p.dot(x,f(x),'var(--gold)');}
    const head=kata?'f(x) = (x² − x)/|x − 1|':'f(x) = (x² − 1)/(x − 1)';
    let read=`<i>${head}</i><br>`;
    if(x===1)read+='x = 1 では分母が 0 になり、値は定義されない';
    else if(kata)read+=`x = ${n(x)} のとき f(x) = <b>${n(f(x))}</b><br>`+(x>1?'いまは 1 の右側。右から近づくと 1 に近づく':'いまは 1 の左側。左から近づくと −1 に近づく');
    else read+=`x = ${n(x)} のとき f(x) = <b>${n(f(x))}</b><br>x と 1 の差 ${n(Math.abs(x-1))}、f(x) と 2 の差 ${n(Math.abs(f(x)-2))}`;
    read+=kata?'<br>右と左で近づく値がちがうので、x → 1 の極限はない':'<br>x → 1 のとき f(x) → 2（白丸の位置）';
    return {svg:p.out()+ex,read};}});};

/* ---- なぜ：おうぎ形を2つの三角形ではさむ ---- */
FIGS.h3kyokugen_ougi=host=>mk(host,{alt:'半径 1 のおうぎ形 OAB を、内側の三角形 OAB と外側の直角三角形 OAT ではさんだ図',
  sliders:[{k:'x',label:'中心角 x（ラジアン）',min:.1,max:1,step:.01,v:.8}],play:{k:'x',from:.8,to:.1,label:'x を 0 に近づける',ms:3800},
  draw(v){const x=v.x,O=[36,222],R=130,A=[O[0]+R,O[1]],B=[O[0]+R*Math.cos(x),O[1]-R*Math.sin(x)],Tp=[A[0],O[1]-R*Math.tan(x)],d=draw();
    d.path(`M${f1(A[0])},${f1(A[1])} A${R},${R} 0 0 0 ${O[0]},${O[1]-R}`,'stroke="var(--muted)" stroke-width="1" fill="none" stroke-dasharray="3 4"');
    d.poly([O,A,Tp],'fill="var(--gold)" fill-opacity=".16" stroke="var(--gold)" stroke-width="1.6" stroke-linejoin="round"');
    d.path(`M${O[0]},${O[1]} L${f1(A[0])},${f1(A[1])} A${R},${R} 0 0 0 ${f1(B[0])},${f1(B[1])} Z`,'fill="var(--c)" fill-opacity=".3" stroke="var(--c)" stroke-width="1.8" stroke-linejoin="round"');
    d.poly([O,A,B],'fill="var(--ok)" fill-opacity=".3" stroke="var(--ok)" stroke-width="1.6" stroke-linejoin="round"');
    d.angle(O[0],O[1],26,0,x*180/Math.PI,'stroke="var(--ink)" stroke-width="1.4" fill="none"');
    d.text(O[0]+38*Math.cos(x/2),O[1]-38*Math.sin(x/2)+4,'x').text(O[0]-11,O[1]+5,'O').text(A[0]+2,A[1]+16,'A').text(B[0]-10,B[1]-8,'B','fill="var(--c)" '+T).text(Tp[0]+11,Tp[1]+4,'T','fill="var(--gold)"');
    d.text((O[0]+A[0])/2,O[1]+16,'1','fill="var(--muted)"');
    if(x>=.4)d.text(A[0]+8,(A[1]+Tp[1])/2+4,'tan x','text-anchor="start" fill="var(--gold)"');
    const s=Math.sin(x),t=Math.tan(x);
    return {svg:d.out(),read:`x = ${n(x)} のとき<br>三角形 OAB = sin x ÷ 2 = ${(s/2).toFixed(4)}<br>おうぎ形 OAB = x ÷ 2 = ${(x/2).toFixed(4)}<br>三角形 OAT = tan x ÷ 2 = ${(t/2).toFixed(4)}<br>sin x ÷ x = <b>${(s/x).toFixed(4)}</b>（cos x = ${Math.cos(x).toFixed(4)} と 1 の間）`};}});

/* ---- 原点の近くでは、sin x と x はほとんど同じ ---- */
FIGS.h3kyokugen_zoom=host=>mk(host,{alt:'原点の近くを拡大すると、y = sin x のグラフと直線 y = x が重なっていく図',
  sliders:[{k:'w',label:'見る範囲の半分の幅 w',min:.1,max:3.1,step:.1,v:3.1}],play:{k:'w',from:3.1,to:.1,label:'原点の近くを拡大する',ms:4600},
  draw(v){const w=Math.round(v.w*10)/10,X=w*1.6,Y=X*250/340,r=[-X,X,-Y,Y],p=plot(r);
    p.seg(-X,0,X,0,AX).seg(0,-Y,0,Y,AX).seg(w,-Y*.025,w,Y*.025,AX).seg(-w,-Y*.025,-w,Y*.025,AX);
    p.txt(w,0,n(w),'text-anchor="middle" dy="16"').txt(-w,0,n(-w),'text-anchor="middle" dy="16"').txt(X,0,'x','text-anchor="end" dx="-5" dy="-6"').txt(0,Y,'y','dx="6" dy="12"');
    p.seg(-X,-X,X,X,INK).curve(Math.sin,C).seg(w,Math.sin(w),w,w,'stroke="var(--gold)" stroke-width="3"').dot(w,w,'var(--ink)',3.4).dot(w,Math.sin(w),'var(--gold)',3.8);
    p.txt(-w,-w,'y = x','text-anchor="end" dx="-8" dy="4" fill="var(--ink)" '+T);
    return {svg:p.out(),read:`x = ${n(w)} のところでくらべる<br>直線の高さ x = ${n(w)}、曲線の高さ sin x = ${Math.sin(w).toFixed(4)}<br>sin x ÷ x = <b>${(Math.sin(w)/w).toFixed(4)}</b><br>原点の近くを拡大するほど、曲線は直線 y = x に重なる`};}});

/* ---- 中間値の定理（arg.m = 1：連続な関数 ／ 2：途中で切れている関数） ---- */
FIGS.h3kyokugen_chukan=(host,arg)=>{const cut=!!(arg&&arg.m===2);
  mk(host,{alt:cut?'グラフが途中で切れている関数と、横線 y = k の図。共有点のない k がある':'区間の両端をつなぐ連続な関数のグラフと、横線 y = k の共有点の図',
  sliders:[{k:'k',label:'k',min:.6,max:3.2,step:.05,v:cut?2:1.2}],play:{k:'k',from:.6,to:3.2,label:'k を f(a) から f(b) まで動かす',ms:4600},
  draw(v){const k=Math.round(v.k*100)/100,a=.5,b=4.5,f=cut?(x=>x<2.5?(x-.5)/2+.5:(x-.5)/2+1.5):(x=>.5+.75*(x-.5)+.9*Math.sin(1.5*(x-.5))),p=plot([-.7,5.2,-.5,4.2]).grid();
    p.seg(a,0,a,f(a),DASH).seg(b,0,b,f(b),DASH);
    if(cut)p.curve(f,C,a,2.4999).curve(f,C,2.5,b);else p.curve(f,C,a,b);
    p.seg(-.7,k,5.2,k,GOLD).dot(a,f(a),'var(--ink)',3.6).dot(b,f(b),'var(--ink)',3.6);
    const xs=[];for(let i=0;i<800;i++){const x0=a+(b-a)*i/800,x1=a+(b-a)*(i+1)/800,u=f(x0)-k,w=f(x1)-k;if(u===0)xs.push(x0);else if(u*w<0){if(cut&&x0<2.5&&x1>=2.5)continue;let lo=x0,hi=x1;for(let j=0;j<40;j++){const m=(lo+hi)/2;(f(lo)-k)*(f(m)-k)<=0?hi=m:lo=m;}xs.push((lo+hi)/2);}}
    xs.forEach(x=>p.seg(x,0,x,k,GD).dot(x,k,'var(--gold)'));
    let ex=cut?ring(p,2.5,1.5):'';if(cut)p.dot(2.5,2.5,'var(--c)',4);
    p.txt(a,0,'a','text-anchor="middle" dy="15" fill="var(--ink)"').txt(b,0,'b','text-anchor="middle" dy="15" fill="var(--ink)"').txt(a,f(a),'f(a)','text-anchor="end" dx="-7" dy="4" fill="var(--ink)" '+T).txt(b,f(b),'f(b)','dx="8" dy="4" fill="var(--ink)" '+T).txt(5.2,k,'y = k','text-anchor="end" dx="-4" dy="-6" fill="var(--gold)" '+T);
    return {svg:p.out()+ex,read:`k = ${n(k)}（f(a) = 0.5 と f(b) = ${n(f(b))} の間）<br>グラフと直線 y = k の共有点 <b>${xs.length} 個</b><br>`+
      (cut?(xs.length?'この k では共有点がある':'グラフが x = 2.5 で切れていて<br>1.5 以上 2.5 未満の値をとらない'):'グラフがつながっているので、必ず 1 個以上ある')};}});};
})();
