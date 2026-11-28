/* 数学III「微分法」（教科書の「微分法」と「微分法の応用」の2章）の図（FIGS.h3bibun_*） */
(function(){
const {plot,draw,n,sg,C,GOLD,DASH,mk}=FIG;
const f1=v=>v.toFixed(1);
const INK='stroke="var(--ink)" stroke-width="1.8"',AX='stroke="var(--muted)" stroke-width="1.2"';
const GD='stroke="var(--gold)" stroke-width="1.4" stroke-dasharray="5 4"';
const OKL='stroke="var(--ok)" stroke-width="2.4"',NGL='stroke="var(--ng)" stroke-width="2.4"';
const T='paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round"';
// 矢印（plot の座標）。先に三角形をつける
const arrow=(p,x0,y0,x1,y1,col)=>{const X0=p.sx(x0),Y0=p.sy(y0),X1=p.sx(x1),Y1=p.sy(y1),l=Math.hypot(X1-X0,Y1-Y0)||1,ux=(X1-X0)/l,uy=(Y1-Y0)/l,b=[X1-ux*9,Y1-uy*9];
  return `<line x1="${f1(X0)}" y1="${f1(Y0)}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke="${col}" stroke-width="2.4"/><polygon points="${f1(X1)},${f1(Y1)} ${f1(b[0]-uy*4.5)},${f1(b[1]+ux*4.5)} ${f1(b[0]+uy*4.5)},${f1(b[1]-ux*4.5)}" fill="${col}"/>`;};

/* ---- 連続だが微分可能でない点：y = |x² − 1| の x = 1 ---- */
FIGS.h3bibun_kado=host=>mk(host,{alt:'y = |x² − 1| のグラフのとがった点 A と、A と B を結ぶ直線の図',
  sliders:[{k:'h',label:'h（A から B までの横の距離）',min:-.9,max:.9,step:.01,v:.7}],play:{k:'h',from:.7,to:.01,label:'B を右から A に近づける',ms:3200},
  draw(v){const h=Math.round(v.h*100)/100,f=x=>Math.abs(x*x-1),r=[-.7,2.7,-.9,3.3],p=plot(r).grid();
    p.seg(r[0],2*(r[0]-1),r[1],2*(r[1]-1),DASH).seg(r[0],-2*(r[0]-1),r[1],-2*(r[1]-1),DASH).curve(f,C);
    let read='<i>f(x) = |x² − 1|</i>、A(1, 0)<br>';
    if(h!==0){const m=f(1+h)/h;p.seg(r[0],m*(r[0]-1),r[1],m*(r[1]-1),GOLD).dot(1+h,f(1+h),'var(--gold)').txt(1+h,f(1+h),'B',(h>0?'text-anchor="end" dx="-9" dy="-3"':'dx="9" dy="-3"')+' fill="var(--gold)" '+T);
      read+=`h = ${n(h)} のとき、AB の傾き = <b>${n(m)}</b><br>`+(h>0?'B を右から近づけると、傾きは 2 に近づく':'B を左から近づけると、傾きは −2 に近づく');}
    else read+='h = 0 では、傾きを計算できない';
    p.dot(1,0,'var(--ink)').txt(1,0,'A','text-anchor="middle" dy="17" fill="var(--ink)" '+T);
    return {svg:p.out(),read:read+'<br>右と左で近づく値がちがうので、x = 1 で微分可能でない'};}});

/* ---- なぜ：積の導関数。長方形 f × g の面積の増え方 ---- */
FIGS.h3bibun_seki=host=>mk(host,{alt:'横 f、縦 g の長方形が、横に Δf、縦に Δg だけ大きくなったときに増える面積の図',
  sliders:[{k:'h',label:'h（x の増分）',min:.02,max:1,step:.02,v:.8}],play:{k:'h',to:.02,label:'h を 0 に近づける',ms:3000},
  draw(v){const h=v.h,f=3,g=2,df=1.5*h,dg=h,u=52,ox=46,oy=222,F=f*u,G=g*u,DF=df*u,DG=dg*u,d=draw();
    const rc=(x,y,w,hh,st)=>d.poly([[x,y],[x+w,y],[x+w,y+hh],[x,y+hh]],st);
    rc(ox,oy-G,F,G,'fill="var(--c)" fill-opacity=".26" stroke="var(--c)" stroke-width="1.5"');
    rc(ox+F,oy-G,DF,G,'fill="var(--c)" fill-opacity=".6" stroke="var(--bg2)" stroke-width="1"');
    rc(ox,oy-G-DG,F,DG,'fill="var(--c)" fill-opacity=".6" stroke="var(--bg2)" stroke-width="1"');
    rc(ox+F,oy-G-DG,DF,DG,'fill="var(--gold)" stroke="var(--bg2)" stroke-width="1"');
    d.text(ox+F/2,oy-G/2+4,'f × g').text(ox+F/2,oy+16,'f','fill="var(--muted)"').text(ox-12,oy-G/2+4,'g','fill="var(--muted)"');
    if(DF>=16)d.text(ox+F+DF/2,oy+16,'Δf','fill="var(--muted)"');if(DG>=13)d.text(ox-14,oy-G-DG/2+4,'Δg','fill="var(--muted)"');
    if(DF>=50)d.text(ox+F+DF/2,oy-G/2+4,'Δf × g');if(DG>=16)d.text(ox+F/2,oy-G-DG/2+4,'f × Δg');
    return {svg:d.out(),read:`f = 3、g = 2 で、f は 1.5h、g は h だけ増える場合<br>増えた面積 = Δf·g + f·Δg + Δf·Δg<br>= ${n(df*g,3)} + ${n(f*dg,3)} + ${n(df*dg,4)}<br>h で割ると 3 + 3 + ${n(1.5*dg,3)} = <b>${n(6+1.5*dg,3)}</b><br>h → 0 で f′g + fg′ = <i>6</i>（金色の角の分は消える）`};}});

/* ---- 合成関数：変化の割合のかけ算。u = x² + 1、y = u² ---- */
FIGS.h3bibun_gosei=host=>mk(host,{alt:'x の増分が u の増分に、u の増分が y の増分に伝わる様子を、3本の数直線で表した図',h:226,
  sliders:[{k:'x',label:'x',min:.4,max:1.2,step:.1,v:1},{k:'d',label:'Δx（x の増分）',min:.01,max:.3,step:.01,v:.2}],play:{k:'d',to:.01,label:'Δx を 0 に近づける',ms:3000},
  draw(v){const x=Math.round(v.x*10)/10,dx=Math.round(v.d*100)/100,g=t=>t*t+1,f=t=>t*t,u=g(x),u2=g(x+dx),y=f(u),y2=f(u2),du=u2-u,dy=y2-y,d=draw();
    const L=[[44,1.6,[0,.5,1,1.5]],[118,3.6,[0,1,2,3]],[192,13,[0,5,10]]],X=(val,i)=>72+val/L[i][1]*256;
    d.poly([[X(x,0),44],[X(x+dx,0),44],[X(u2,1),118],[X(u,1),118]],'fill="var(--c)" fill-opacity=".22" stroke="none"');
    d.poly([[X(u,1),118],[X(u2,1),118],[X(y2,2),192],[X(y,2),192]],'fill="var(--gold)" fill-opacity=".2" stroke="none"');
    L.forEach((q,i)=>{d.line(72,q[0],332,q[0],AX);q[2].forEach(t=>{d.line(X(t,i),q[0]-3,X(t,i),q[0]+3,AX);d.text(X(t,i),q[0]+16,n(t),'fill="var(--muted)" '+T);});});
    [[x,x+dx],[u,u2],[y,y2]].forEach((q,i)=>d.line(X(q[0],i),L[i][0],X(q[1],i),L[i][0],`stroke="var(--${i===1?'c':'gold'})" stroke-width="5" stroke-linecap="round"`));
    const lab=(yy,t,c)=>d.text(4,yy,t,'text-anchor="start" fill="'+c+'"');
    lab(40,'x','var(--ink)');lab(54,'Δx='+n(dx),'var(--muted)');lab(114,'u','var(--ink)');lab(128,'Δu='+n(du,3),'var(--muted)');lab(188,'y','var(--ink)');lab(202,'Δy='+n(dy,3),'var(--muted)');
    lab(86,'×'+n(du/dx,2),'var(--c)');lab(160,'×'+n(dy/du,2),'var(--gold)');
    return {svg:d.out(),read:`u = x² + 1、y = u²。x = ${n(x)} から Δx = ${n(dx)} だけ増やす<br>Δu ÷ Δx = ${n(du/dx,3)}、Δy ÷ Δu = ${n(dy/du,3)}<br>Δy ÷ Δx = ${n(du/dx,3)} × ${n(dy/du,3)} = <b>${n(dy/dx,3)}</b><br>Δx → 0 で 2x × 2u = ${n(2*x)} × ${n(2*u)} = <i>${n(4*x*u,3)}</i>`};}});

/* ---- なぜ：e。y = a^x の (0, 1) での接線の傾き ---- */
FIGS.h3bibun_e1=host=>mk(host,{alt:'指数関数 y = a の x 乗のグラフと、点 (0, 1) における接線の図',
  sliders:[{k:'a',label:'底 a',min:1.5,max:4,step:.01,v:2}],play:{k:'a',from:2,to:3,label:'a を 2 から 3 まで動かす',ms:4600},
  draw(v){const a=Math.round(v.a*100)/100,m=Math.log(a),r=[-2.6,2.6,-.5,3.32],p=plot(r).grid();
    p.seg(r[0],1+r[0],r[1],1+r[1],DASH).curve(x=>Math.pow(a,x),C).seg(r[0],1+m*r[0],r[1],1+m*r[1],GOLD).dot(0,1,'var(--ink)');
    p.txt(2.5,.5,'点線は y = x + 1','text-anchor="end" '+T);
    return {svg:p.out(),read:`y = ${n(a)}^x の、点 (0, 1) での接線の傾き<br><b>${m.toFixed(4)}</b><br>`+(Math.abs(m-1)<.002?'ほぼ 1。接線が点線 y = x + 1 に重なる':m<1?'1 より小さい（点線 y = x + 1 よりゆるやか）':'1 より大きい（点線 y = x + 1 より急）')+'<br>a = 2 で 0.6931、a = 3 で 1.0986'};}});

/* ---- なぜ：e。(1 + 1/n)^n の値を点の列で見る ---- */
FIGS.h3bibun_e2=host=>mk(host,{alt:'(1 + 1/n) の n 乗の値を、n = 1 から 40 まで点の列として並べた図',
  sliders:[{k:'N',label:'n',min:1,max:40,step:1,v:4}],play:{k:'N',from:1,to:40,label:'n を 1 から 40 まで大きくする',ms:4600},
  draw(v){const N=v.N,a=k=>Math.pow(1+1/k,k),r=[-5.5,42.5,1.78,2.92],p=plot(r);
    p.seg(0,1.9,42.5,1.9,AX).seg(0,1.9,0,2.92,AX).seg(0,Math.E,42.5,Math.E,GD);
    [10,20,30,40].forEach(x=>p.seg(x,1.89,x,1.91,AX).txt(x,1.9,String(x),'text-anchor="middle" dy="15"'));
    [2,2.5].forEach(y=>p.seg(-.4,y,.4,y,AX).txt(0,y,String(y),'text-anchor="end" dx="-7" dy="4"'));
    p.txt(42.5,1.9,'n','text-anchor="end" dx="-4" dy="-6"').txt(42.5,Math.E,'e = 2.718…','text-anchor="end" dx="-4" dy="-6" fill="var(--gold)"');
    for(let k=1;k<=40;k++)p.dot(k,a(k),k===N?'var(--gold)':k<N?'var(--c)':'var(--line)',k===N?4.8:3);
    return {svg:p.out(),read:`n = ${N} のとき (1 + 1/n)ⁿ = <b>${a(N).toFixed(5)}</b><br>n = 1000 のとき 2.71692<br>n = 100000 のとき 2.71827<br>n を大きくすると、e = 2.71828… に近づく`};}});

/* ---- 陰関数・媒介変数：円 x² + y² = 25 の接線の傾き ---- */
FIGS.h3bibun_en=host=>mk(host,{alt:'円 x² + y² = 25 の周上の点を動かし、その点における接線を引いた図',
  sliders:[{k:'t',label:'角 t（度）',min:0,max:360,step:5,v:55}],play:{k:'t',from:0,to:360,label:'点を円周上で1周させる',ms:6400},
  draw(v){const t=v.t*Math.PI/180,x=5*Math.cos(t),y=5*Math.sin(t),p=plot([-9.52,9.52,-7,7]).grid(),s=Math.sin(t),c=Math.cos(t),flat=Math.abs(y)<1e-9;
    p.curve(q=>Math.sqrt(Math.max(0,25-q*q)),C,-5,5).curve(q=>-Math.sqrt(Math.max(0,25-q*q)),C,-5,5).seg(0,0,x,y,DASH).seg(x+13*s,y-13*c,x-13*s,y+13*c,GOLD).dot(x,y,'var(--gold)');
    return {svg:p.out(),read:`点 (x, y) = (${n(x)}, ${n(y)})<br>`+(flat?'y = 0 なので、傾きは定義されない<br>接線は y 軸に平行':`接線の傾き dy/dx = −x/y = <b>${n(-x/y,3)}</b><br>媒介変数で計算した −cos t / sin t も ${n(-c/s,3)}`)+'<br>接線は、点線の半径に垂直'};}});

/* ---- 接線と法線：y = √x ---- */
FIGS.h3bibun_hosen=host=>mk(host,{alt:'曲線 y = √x の上の点における接線と法線の図',
  sliders:[{k:'a',label:'接点の x 座標 a',min:.25,max:5,step:.05,v:1}],play:{k:'a',from:.25,to:5,label:'接点を動かす',ms:4600},
  draw(v){const a=Math.round(v.a*100)/100,b=Math.sqrt(a),m=1/(2*b),r=[-1,7.16,-2,4],p=plot(r).grid(),k=-2*b;
    p.curve(Math.sqrt,C,0,r[1]).seg(r[0],b+m*(r[0]-a),r[1],b+m*(r[1]-a),GOLD).seg(a+(r[3]-b)/k,r[3],a+(r[2]-b)/k,r[2],OKL.replace('2.4','1.8'));
    const l=Math.hypot(1,m),tx=1/l,ty=m/l,q=.26;p.seg(a+tx*q,b+ty*q,a+tx*q+ty*q,b+ty*q-tx*q,AX).seg(a+ty*q,b-tx*q,a+tx*q+ty*q,b+ty*q-tx*q,AX);
    p.dot(a,b,'var(--ink)').txt(6.6,b+m*(6.6-a),'接線','text-anchor="middle" dy="'+(b+m*(6.6-a)>3.5?16:-8)+'" fill="var(--gold)" '+T).txt(a+(b+1.5)/(2*b),-1.5,'法線','dx="9" dy="4" fill="var(--ok)" '+T);
    return {svg:p.out(),read:`接点 (${n(a)}, ${n(b,3)})<br>接線の傾き f′(a) = 1/(2√a) = <b>${n(m,3)}</b><br>法線の傾き −1/f′(a) = <i>${n(k,3)}</i><br>2つの傾きの積は −1（垂直に交わる）`};}});

/* ---- 平均値の定理：y = 2√x、A(1, 2)、B(4, 4) ---- */
FIGS.h3bibun_heikin=host=>mk(host,{alt:'曲線上の2点 A, B を結ぶ直線と、それに平行な接線をさがす図',
  sliders:[{k:'t',label:'接点の x 座標',min:1,max:4,step:.05,v:1.4}],play:{k:'t',from:1,to:4,label:'接点を A から B まで動かす',ms:5200},
  draw(v){const t=Math.round(v.t*100)/100,f=x=>2*Math.sqrt(x),m=1/Math.sqrt(t),r=[-.6,5.6,-.5,5],p=plot(r).grid(),hit=Math.abs(t-2.25)<1e-9;
    p.curve(f,C,0,r[1]).seg(1,2,4,4,INK).seg(r[0],f(t)+m*(r[0]-t),r[1],f(t)+m*(r[1]-t),hit?'stroke="var(--gold)" stroke-width="2.6"':GD);
    p.dot(1,2,'var(--ink)').dot(4,4,'var(--ink)').dot(t,f(t),'var(--gold)').txt(1,2,'A','dx="6" dy="15" fill="var(--ink)" '+T).txt(4,4,'B','dx="6" dy="15" fill="var(--ink)" '+T);
    return {svg:p.out(),read:`A(1, 2) と B(4, 4) を結ぶ直線の傾き = (4 − 2) ÷ (4 − 1) = <i>0.667</i><br>x = ${n(t)} での接線の傾き = <b>${n(m,3)}</b><br>`+(hit?'傾きが等しい。接線は AB と平行（c = 2.25）':m>2/3?'接線の方が急':'接線の方がゆるやか')};}});

/* ---- 凹凸と変曲点：y = e^(−x²/2) ---- */
FIGS.h3bibun_outotsu=host=>mk(host,{alt:'曲線の下に凸の部分と上に凸の部分を色分けし、接線を動かす図',
  sliders:[{k:'x',label:'x',min:-2.8,max:2.8,step:.05,v:-1.8}],play:{k:'x',from:-2.8,to:2.8,label:'x を左から右へ動かす',ms:5600},
  draw(v){const x=Math.round(v.x*100)/100,f=t=>Math.exp(-t*t/2),d1=t=>-t*f(t),d2=t=>(t*t-1)*f(t),r=[-3.4,3.4,-.5,1.5],p=plot(r),B=(a,b,c)=>p.poly([[a,r[2]],[b,r[2]],[b,r[3]],[a,r[3]]],`fill="var(--${c})" fill-opacity=".08" stroke="none"`);
    B(r[0],-1,'ok');B(-1,1,'ng');B(1,r[1],'ok');p.grid().curve(f,OKL,r[0],-1).curve(f,NGL,-1,1).curve(f,OKL,1,r[1]);
    const m=d1(x);p.seg(x-1.3,f(x)-1.3*m,x+1.3,f(x)+1.3*m,INK).dot(-1,f(1),'var(--gold)',4).dot(1,f(1),'var(--gold)',4).dot(x,f(x),'var(--ink)');
    p.txt(-2.2,r[2],'下に凸','text-anchor="middle" dy="-7" fill="var(--ok)"').txt(0,r[2],'上に凸','text-anchor="middle" dy="-7" fill="var(--ng)" '+T).txt(2.2,r[2],'下に凸','text-anchor="middle" dy="-7" fill="var(--ok)"');
    const s=d2(x),inf=Math.abs(Math.abs(x)-1)<1e-9;
    return {svg:p.out(),read:`x = ${n(x)}：接線の傾き f′(x) = ${n(m,3)}<br>f″(x) = <b>${n(s,3)}</b><br>`+(inf?'f″(x) = 0 で、前後で符号が変わる<br>凹凸が入れかわる点（変曲点）':s>0?'f″(x) > 0：接線の傾きは増えていく<br>下に凸（曲線は接線の上側）':'f″(x) < 0：接線の傾きは減っていく<br>上に凸（曲線は接線の下側）')};}});

/* ---- 方程式の実数解の個数：y = e^x / x と y = a ---- */
FIGS.h3bibun_exa=host=>mk(host,{alt:'曲線 y = e の x 乗 ÷ x と、横線 y = a の共有点を数える図',
  sliders:[{k:'a',label:'a',min:-3,max:7,step:.1,v:4}],play:{k:'a',from:-3,to:7,label:'a を −3 から 7 まで動かす',ms:5600},
  draw(v){const a=Math.round(v.a*10)/10,f=x=>Math.exp(x)/x,r=[-3.6,4.2,-4.4,8.4],p=plot(r).grid(),xs=[];
    p.curve(f,C,r[0],-.01).curve(f,C,.01,r[1]).seg(r[0],a,r[1],a,GOLD);
    [[r[0],-.002],[.002,r[1]]].forEach(([lo0,hi0])=>{const N=2400;for(let i=0;i<N;i++){const x0=lo0+(hi0-lo0)*i/N,x1=lo0+(hi0-lo0)*(i+1)/N;if((f(x0)-a)*(f(x1)-a)<0){let lo=x0,hi=x1;for(let j=0;j<40;j++){const md=(lo+hi)/2;(f(lo)-a)*(f(md)-a)<=0?hi=md:lo=md;}xs.push((lo+hi)/2);}}});
    xs.forEach(x=>p.dot(x,a,'var(--gold)'));p.dot(1,Math.E,'var(--ink)',3.4).txt(1,Math.E,'(1, e)','text-anchor="middle" dy="17" fill="var(--ink)" '+T);
    return {svg:p.out(),read:`曲線 y = e^x / x と直線 y = ${n(a)} の共有点 <b>${xs.length} 個</b><br>方程式 e^x = ax（a = ${n(a)}）の実数解も ${xs.length} 個<br>曲線の x > 0 の部分の最小値は e = 2.718…（x = 1 のとき）`};}});

/* ---- 等速円運動：速度と加速度 ---- */
FIGS.h3bibun_undo=host=>mk(host,{alt:'円周上を一定の速さで回る点の、速度の矢印と加速度の矢印の図',
  sliders:[{k:'t',label:'時刻 t',min:0,max:6.2,step:.05,v:.8}],play:{k:'t',from:0,to:6.2,label:'時刻を進める',ms:6200},
  draw(v){const t=Math.round(v.t*100)/100,c=Math.cos(t),s=Math.sin(t),x=2*c,y=2*s,p=plot([-4.76,4.76,-3.5,3.5]).grid();
    p.curve(q=>Math.sqrt(Math.max(0,4-q*q)),'stroke="var(--c)" stroke-width="1.6"',-2,2).curve(q=>-Math.sqrt(Math.max(0,4-q*q)),'stroke="var(--c)" stroke-width="1.6"',-2,2);
    const ex=arrow(p,x,y,x-2*s,y+2*c,'var(--gold)')+arrow(p,x,y,0,0,'var(--ok)');p.dot(x,y,'var(--ink)');
    p.txt(x-2.42*s,y+2.42*c,'速度','text-anchor="middle" dy="4" fill="var(--gold)" '+T).txt(x/2+.72*s,y/2-.72*c,'加速度','text-anchor="middle" dy="4" fill="var(--ok)" '+T);
    return {svg:p.out()+ex,read:`t = ${n(t)}：位置 (2 cos t, 2 sin t) = (${n(x)}, ${n(y)})<br>速度 (−2 sin t, 2 cos t) = (${n(-2*s)}, ${n(2*c)})、速さ <b>2</b><br>加速度 (−2 cos t, −2 sin t) = (${n(-x)}, ${n(-y)})、大きさ <b>2</b><br>速度は接線の向き、加速度は中心の向き`};}});

/* ---- 1次の近似式：接線で曲線の代わりをする ---- */
FIGS.h3bibun_kinji=host=>mk(host,{alt:'曲線と、x = 0 における接線を並べ、近似式の値と本当の値をくらべる図',
  sliders:[{k:'m',label:'関数',min:1,max:3,step:1,v:1,fmt:m=>['√(1 + x)','e^x','sin x'][m-1]},{k:'x',label:'x',min:-.9,max:2,step:.05,v:.5}],
  draw(v){const S=[[x=>Math.sqrt(1+x),x=>1+x/2,'√(1 + x)','1 + x/2',-1],[Math.exp,x=>1+x,'e^x','1 + x',-1.6],[Math.sin,x=>x,'sin x','x',-1.6]][v.m-1],x=Math.round(v.x*100)/100,r=[-1.6,2.6,-1.1,3.3],p=plot(r).grid();
    const a=S[0](x),b=S[1](x);p.seg(r[0],S[1](r[0]),r[1],S[1](r[1]),GOLD).curve(S[0],C,S[4],r[1]).seg(x,a,x,b,'stroke="var(--ink)" stroke-width="3"').dot(x,b,'var(--gold)',4).dot(x,a,'var(--c)',4);
    return {svg:p.out(),read:`x が 0 に近いとき <i>${S[2]} ≒ ${S[3]}</i><br>x = ${n(x)}：本当の値 ${n(a,4)}、近似式の値 <b>${n(b,4)}</b><br>差 ${n(Math.abs(a-b),4)}<br>金色の直線は、x = 0 における接線`};}});
})();
