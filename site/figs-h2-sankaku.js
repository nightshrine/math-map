/* 数学II「三角関数」の図。名前は h2sankaku_ で始める */
(function(){
const {plot,draw,n,sg,C,GOLD,DASH}=FIG;
const PI=Math.PI,f1=v=>v.toFixed(1),rad=d=>d*PI/180;
const INK='stroke="var(--ink)" stroke-width="1.6" fill="none"',THIN='stroke="var(--muted)" stroke-width="1" fill="none"';
// 文字。a は text-anchor、c は色（属性を重ねないように、ここで1回だけ書く）
const T=(x,y,s,o={})=>`<text x="${f1(x)}" y="${f1(y)}" font-size="${o.fs||11}" font-family="var(--f-mono)" fill="${o.c||'var(--ink)'}" text-anchor="${o.a||'middle'}">${s}</text>`;
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
// k/den × π を「5π/6」「−π/4」「2π」「0」の形にする
function pf(k,den){k=Math.round(k);if(!k)return '0';const g=gcd(k,den),p=Math.abs(k)/g,q=den/g;return (k<0?'−':'')+(p===1?'':p)+'π'+(q===1?'':'/'+q);}
// 三角関数の値を、分かる範囲で正確な形にする
const S2=Math.SQRT2,S3=Math.sqrt(3),S6=Math.sqrt(6);
const EX=[[0,'0'],[.5,'1/2'],[S2/2,'√2/2'],[S3/2,'√3/2'],[1,'1'],[(S6-S2)/4,'(√6−√2)/4'],[(S6+S2)/4,'(√6+√2)/4'],[1/S3,'1/√3'],[S3,'√3'],[2-S3,'2−√3'],[2+S3,'2+√3']];
function ex(x){const a=Math.abs(x);for(const [val,s] of EX)if(Math.abs(a-val)<1e-9)return (x<-1e-9?'−':'')+s;return n(x,3);}
// 中心 (cx,cy)、半径 r の円弧を、角 a0 から a1（ラジアン、反時計回りが正）まで折れ線で描く
function arc(cx,cy,r,a0,a1,st){const m=Math.max(2,Math.ceil(Math.abs(a1-a0)/.06));let d='';for(let i=0;i<=m;i++){const a=a0+(a1-a0)*i/m;d+=(i?'L':'M')+f1(cx+r*Math.cos(a))+','+f1(cy-r*Math.sin(a));}return `<path d="${d}" fill="none" ${st}/>`;}
const quad=deg=>{const b=((deg%360)+360)%360;return b%90===0?'軸の上（どの象限でもない）':'第'+(Math.floor(b/90)+1)+'象限';};

/* 一般角：動径が何周でも回る */
FIGS.h2sankaku_doukei=host=>FIG.mk(host,{alt:'始線から動径が回転し、1周をこえても回り続ける図',
  sliders:[{k:'a',label:'θ',min:-360,max:720,step:15,v:60,fmt:x=>n(x)+'°'}],play:{k:'a',from:0,to:720,label:'0° から 720° まで回す',ms:5200},
  draw(v){const a=Math.round(v.a),cx=170,cy=128,R=86,t=rad(a),px=cx+R*Math.cos(t),py=cy-R*Math.sin(t),d=draw();
    d.circle(cx,cy,R,THIN).line(cx-R-22,cy,cx+R+26,cy,THIN).line(cx,cy-R-16,cx,cy+R+16,THIN);
    // 回転の量を表す渦巻き
    let sp='';const m=Math.max(1,Math.ceil(Math.abs(a)/5));for(let i=0;i<=m;i++){const u=a*i/m,r=20+Math.abs(u)/360*11;sp+=(i?'L':'M')+f1(cx+r*Math.cos(rad(u)))+','+f1(cy-r*Math.sin(rad(u)));}
    if(a)d.path(sp,`stroke="var(--${a>0?'ok':'ng'})" stroke-width="2" fill="none"`);
    d.line(cx,cy,cx+R,cy,INK).line(cx,cy,px,py,'stroke="var(--gold)" stroke-width="2.6"').dot(px,py,'var(--gold)',4.5);
    let s=d.out()+T(cx+R+18,cy+14,'X')+T(cx-9,cy+14,'O')+T(cx+(R+13)*Math.cos(t),cy-(R+13)*Math.sin(t)+4,'P',{c:'var(--gold)'});
    const b=((a%360)+360)%360,k=(a-b)/360;
    return {svg:s,read:`θ = <b>${n(a)}°</b>（${a>0?'正の向き＝反時計回り':a<0?'負の向き＝時計回り':'回転なし'}）<br>${n(a)}° = ${b}° + 360° × ${k<0?'(−'+(-k)+')':k}<br>動径 OP は、<i>${b}°</i> のときと同じ位置<br>${quad(a)}`};}});

/* 弧度法：弧の長さ ÷ 半径 で角を測る。arg.r があれば半径も動かせる */
FIGS.h2sankaku_ko=(host,arg)=>{const withR=!!(arg&&arg.r);
  FIG.mk(host,{alt:'円の弧の長さを、半径の何本分かで測る図',
  sliders:(withR?[{k:'r',label:'半径 r',min:1,max:3,step:.5,v:2}]:[]).concat([{k:'t',label:'θ（ラジアン）',min:.1,max:6.2,step:.1,v:1}]),
  play:{k:'t',from:.1,to:6.2,label:'θ を大きくする',ms:4200},
  draw(v){const r=withR?v.r:2.4,t=v.t,cx=170,cy=128,R=r*34;let s='';
    s+=`<circle cx="${cx}" cy="${cy}" r="${f1(R)}" ${THIN}/>`;
    // 扇形の塗り
    let d=`M${cx},${cy}`;const m=Math.max(2,Math.ceil(t/.06));for(let i=0;i<=m;i++){const a=t*i/m;d+='L'+f1(cx+R*Math.cos(a))+','+f1(cy-R*Math.sin(a));}
    s+=`<path d="${d}Z" fill="var(--c)" fill-opacity=".16"/>`+arc(cx,cy,R,0,t,'stroke="var(--c)" stroke-width="3.6"');
    s+=`<line x1="${cx}" y1="${cy}" x2="${f1(cx+R)}" y2="${cy}" ${INK}/><line x1="${cx}" y1="${cy}" x2="${f1(cx+R*Math.cos(t))}" y2="${f1(cy-R*Math.sin(t))}" ${INK}/>`;
    // 半径1本分ごとの目盛り
    for(let k=1;k<=6;k++){const on=k<=t+1e-9,c=Math.cos(k),sn=Math.sin(k);
      s+=`<line x1="${f1(cx+(R-5)*c)}" y1="${f1(cy-(R-5)*sn)}" x2="${f1(cx+(R+5)*c)}" y2="${f1(cy-(R+5)*sn)}" stroke="var(--${on?'ink':'muted'})" stroke-width="${on?1.8:1}"/>`+T(cx+(R+14)*c,cy-(R+14)*sn+4,k,{c:on?'var(--ink)':'var(--muted)',fs:10});}
    s+=arc(cx,cy,15,0,t,'stroke="var(--gold)" stroke-width="1.6"')+T(cx+R/2,cy+14,'r',{c:'var(--muted)'})+T(cx-10,cy+14,'O',{c:'var(--muted)'});
    const deg=t*180/PI;
    const read=withR?`半径 r = ${n(r)}、θ = ${n(t)} ラジアン（約 ${n(deg,1)}°）<br>弧の長さ l = r × θ = <b>${n(r*t)}</b><br>l ÷ r = <i>${n(t)}</i>（半径を変えても同じ）<br>度数法：2π × ${n(r)} × ${n(deg,1)}/360 = ${n(r*t)}`
      :`弧の長さ ÷ 半径 = <b>${n(t)}</b><br>θ = ${n(t)} ラジアン = 約 ${n(deg,1)}°<br>弧の上の数字は、半径の何本分か<br>半周は π ≈ 3.14、1周は 2π ≈ 6.28 ラジアン`;
    return {svg:s,read};}});};

/* 扇形の面積：細く切って互い違いに並べる */
FIGS.h2sankaku_ougi=host=>FIG.mk(host,{alt:'扇形を細く切って互い違いに並べ、平行四辺形に近づける図',
  sliders:[{k:'i',label:'切る個数',min:1,max:6,step:1,v:2,fmt:i=>String(2**Math.round(i))}],play:{k:'i',from:1,to:6,label:'細かく切っていく',ms:4200},
  draw(v){const N=2**Math.round(v.i),th=2.4,R=80,ax=92,ay=206,a0=PI/2-th/2,da=th/N,w=2*R*Math.sin(da/2),h=R*Math.cos(da/2),x0=186;let s='';
    const fill=j=>j%2?'fill="var(--ink)" fill-opacity=".3"':'fill="var(--c)" fill-opacity=".6"',edge=N<=16?' stroke="var(--bg2)" stroke-width=".8"':'';
    for(let j=0;j<N;j++){const b0=a0+j*da,b1=b0+da;
      // もとの扇形（右から j 番目の切れ）
      s+=`<path d="M${ax},${ay}L${f1(ax+R*Math.cos(b0))},${f1(ay-R*Math.sin(b0))}A${R},${R} 0 0 0 ${f1(ax+R*Math.cos(b1))},${f1(ay-R*Math.sin(b1))}Z" ${fill(j)}${edge}/>`;
      // 並べ替えたもの：偶数番目は頂点が下、奇数番目は頂点が上
      const xl=x0+j*w/2,xm=xl+w/2,xr=xl+w;
      s+=j%2?`<path d="M${f1(xm)},${f1(ay-h)}L${f1(xl)},${ay}A${R},${R} 0 0 0 ${f1(xr)},${ay}Z" ${fill(j)}${edge}/>`
            :`<path d="M${f1(xm)},${ay}L${f1(xl)},${f1(ay-h)}A${R},${R} 0 0 1 ${f1(xr)},${f1(ay-h)}Z" ${fill(j)}${edge}/>`;}
    const W=(N+1)*w/2;
    s+=T(ax,ay-R-9,'l')+T(ax+R*Math.cos(a0)/2+9,ay-R*Math.sin(a0)/2+9,'r')+T(ax,ay+16,'扇形（中心角 θ）',{c:'var(--muted)'});
    s+=T(x0+W/2,ay+16,'およそ l ÷ 2',{c:'var(--muted)'})+`<line x1="${f1(x0+W+7)}" y1="${f1(ay-h)}" x2="${f1(x0+W+7)}" y2="${ay}" stroke="var(--muted)" stroke-width="1"/>`+T(Math.min(x0+W+14,333),ay-h/2+4,'r',{c:'var(--muted)'});
    return {svg:s,read:`扇形（半径 r、弧の長さ l = 2.4r）を<br>${N} 個に切って、互い違いに並べた<br>底辺 = <b>${n(N*Math.sin(da/2),3)}r</b>（l ÷ 2 = 1.2r に近づく）<br>高さは r に近づく → 面積 = (l ÷ 2) × r`};}});

// 単位円の土台：座標軸と円。中心 (cx,cy)、1 の長さ U px
const base=(cx,cy,U,ext=20)=>`<line x1="${cx-U-ext}" y1="${cy}" x2="${cx+U+ext}" y2="${cy}" ${THIN}/><line x1="${cx}" y1="${cy-U-ext}" x2="${cx}" y2="${cy+U+ext}" ${THIN}/><circle cx="${cx}" cy="${cy}" r="${U}" stroke="var(--ink)" stroke-width="1.3" fill="none"/>`;
const L=(x1,y1,x2,y2,st)=>`<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" ${st}/>`;
const dot=(x,y,c,r=4.5)=>`<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${c}" stroke="var(--bg2)" stroke-width="1.5"/>`;
const W=(c,w=3.4)=>`stroke="var(--${c})" stroke-width="${w}" stroke-linecap="round"`;

/* 三角関数の定義：単位円の上の点 P の座標 */
FIGS.h2sankaku_en=host=>FIG.mk(host,{alt:'単位円の上の点 P の x 座標が cos、y 座標が sin、直線 x=1 との交点の高さが tan であることを示す図',
  sliders:[{k:'k',label:'θ',min:-12,max:24,step:1,v:2,fmt:k=>pf(k,12)}],play:{k:'k',from:0,to:24,label:'θ を 1 周させる',ms:5200},
  draw(v){const k=Math.round(v.k),t=k*PI/12,cx=140,cy=128,U=88,c=Math.cos(t),sn=Math.sin(t),px=cx+U*c,py=cy-U*sn,zero=Math.abs(c)<1e-9,tn=zero?0:sn/c;
    let s=base(cx,cy,U)+L(cx+U,cy-U-22,cx+U,cy+U+22,DASH);
    const b=((k%24)+24)%24;if(b)s+=arc(cx,cy,15,0,b*PI/12,'stroke="var(--gold)" stroke-width="1.5"');
    if(!zero&&Math.abs(tn)<=1.3){s+=L(cx,cy,cx+U,cy-U*tn,'stroke="var(--gold)" stroke-width="1.2" stroke-dasharray="3 3"')+L(cx+U,cy,cx+U,cy-U*tn,W('gold',3))+dot(cx+U,cy-U*tn,'var(--gold)',3.6)+T(cx+U+8,cy-U*tn+4,'T(1, tan θ)',{a:'start',c:'var(--gold)',fs:10});}
    s+=L(cx,cy,px,py,INK)+L(cx,cy,px,cy,W('ok'))+L(px,cy,px,py,W('c'))+dot(px,py,'var(--ink)');
    const off=sn>=0?.2:-.2;s+=T(cx+(U+13)*Math.cos(t+off),cy-(U+13)*Math.sin(t+off)+4,'P')+T(cx-8,cy+13,'O',{c:'var(--muted)',fs:10})+T(cx+U+6,cy+13,'1',{c:'var(--muted)',fs:10,a:'start'});
    s+=L(8,13,22,13,W('ok'))+T(27,17,'cos θ',{a:'start',c:'var(--ok)',fs:10})+L(8,28,22,28,W('c'))+T(27,32,'sin θ',{a:'start',c:'var(--c)',fs:10});
    return {svg:s,read:`θ = <b>${pf(k,12)}</b>（${n(k*15)}°）　${quad(k*15)}<br>cos θ = ${ex(c)}（P の x 座標）<br>sin θ = <i>${ex(sn)}</i>（P の y 座標）<br>tan θ = ${zero?'定義されない（OP が y 軸に重なる）':'<b>'+ex(tn)+'</b>（直線 OP の傾き）'}`};}});

/* 三角関数の性質：点 P を対称に移す・回す */
const KIND=['−θ','θ + π','π − θ','θ + π/2','π/2 − θ'];
FIGS.h2sankaku_taisho=host=>FIG.mk(host,{alt:'単位円の上の点 P を、折り返したり回したりした点 Q と比べる図',
  sliders:[{k:'m',label:'Q の角',min:1,max:5,step:1,v:1,fmt:m=>KIND[Math.round(m)-1]},{k:'k',label:'θ',min:1,max:5,step:1,v:2,fmt:k=>pf(k,12)}],
  draw(v){const m=Math.round(v.m),t=Math.round(v.k)*PI/12,cx=170,cy=128,U=92,c=Math.cos(t),sn=Math.sin(t);
    const q=[[c,-sn],[-c,-sn],[-c,sn],[-sn,c],[sn,c]][m-1],swap=m>=4,px=cx+U*c,py=cy-U*sn,qx=cx+U*q[0],qy=cy-U*q[1];
    let s=base(cx,cy,U,16);
    if(m===5)s+=L(cx-U*.95,cy+U*.95,cx+U*.95,cy-U*.95,DASH)+T(cx+U*.95-4,cy-U*.95-3,'y = x',{c:'var(--muted)',fs:10,a:'end'});
    if(m===4)s+=arc(cx,cy,U*.45,t,t+PI/2,'stroke="var(--gold)" stroke-width="1.4" stroke-dasharray="3 3"');
    if(m===2)s+=L(px,py,qx,qy,DASH);
    // P の横（cos θ）と縦（sin θ）
    s+=L(cx,cy,px,cy,W('ok'))+L(px,cy,px,py,W('c'))+L(cx,cy,px,py,INK);
    // Q の横と縦。P のどちらの長さと同じかで色を決める
    s+=L(cx,cy,qx,cy,W(swap?'c':'ok'))+L(qx,cy,qx,qy,W(swap?'ok':'c'))+L(cx,cy,qx,qy,'stroke="var(--gold)" stroke-width="1.6"');
    s+=dot(px,py,'var(--ink)')+dot(qx,qy,'var(--gold)')+T(cx+(U+12)*c,cy-(U+12)*sn+4,'P')+T(cx+(U+12)*q[0],cy-(U+12)*q[1]+4,'Q',{c:'var(--gold)'});
    const how=['P を x 軸について折り返した点','P を原点について対称に移した点（半回転）','P を y 軸について折り返した点','P を 90° 回した点。横と縦が入れかわる','P を直線 y = x について折り返した点。横と縦が入れかわる'][m-1];
    const cs=['cos θ','−cos θ','−cos θ','−sin θ','sin θ'][m-1],ss=['−sin θ','−sin θ','sin θ','cos θ','cos θ'][m-1],nm=KIND[m-1].replace(/ /g,'');
    return {svg:s,read:`Q は角 ${KIND[m-1]} の点<br>${how}<br>cos(${nm}) = <b>${cs}</b> = ${ex(q[0])}<br>sin(${nm}) = <b>${ss}</b> = ${ex(q[1])}`};}});

/* 単位円とグラフの連動：点の高さを記録すると正弦曲線になる */
FIGS.h2sankaku_nami=host=>FIG.mk(host,{alt:'単位円の上を回る点の座標を、角を横軸にとって記録するとサインカーブになる図',
  sliders:[{k:'k',label:'θ',min:0,max:48,step:1,v:4,fmt:k=>pf(k,12)},{k:'m',label:'記録する値',min:1,max:2,step:1,v:1,fmt:m=>Math.round(m)===1?'sin θ（y 座標）':'cos θ（x 座標）'}],
  play:{k:'k',from:0,to:48,label:'θ を 0 から 4π まで回す',ms:7000},
  draw(v){const k=Math.round(v.k),m=Math.round(v.m),t=k*PI/12,cx=58,cy=125,R=44,x0=118,sc=208/(4*PI),f=m===1?Math.sin:Math.cos,val=f(t);
    // m = 2 のときは円を 90° 回して、x 軸を上向きにする。こうすると x 座標が「高さ」になる
    const P=a=>m===1?[cx+R*Math.cos(a),cy-R*Math.sin(a)]:[cx-R*Math.sin(a),cy-R*Math.cos(a)],[px,py]=P(t),gx=x0+t*sc,gy=cy-R*val;
    let s=`<line x1="${cx-R-10}" y1="${cy}" x2="${cx+R+10}" y2="${cy}" ${THIN}/><line x1="${cx}" y1="${cy-R-10}" x2="${cx}" y2="${cy+R+10}" ${THIN}/><circle cx="${cx}" cy="${cy}" r="${R}" stroke="var(--ink)" stroke-width="1.3" fill="none"/>`;
    s+=m===1?T(cx+R+6,cy-5,'x',{c:'var(--muted)',fs:10})+T(cx+7,cy-R-4,'y',{c:'var(--muted)',fs:10}):T(cx+7,cy-R-4,'x',{c:'var(--muted)',fs:10})+T(cx-R-6,cy-5,'y',{c:'var(--muted)',fs:10});
    for(let j=1;j<=4;j++)s+=L(x0+j*PI*sc,cy-R-8,x0+j*PI*sc,cy+R+8,'stroke="var(--line)" stroke-width="1"')+T(x0+j*PI*sc,cy+R+22,pf(j,1),{c:'var(--muted)',fs:10});
    s+=L(x0,cy-R,x0+4*PI*sc,cy-R,'stroke="var(--line)" stroke-width="1"')+L(x0,cy+R,x0+4*PI*sc,cy+R,'stroke="var(--line)" stroke-width="1"');
    s+=L(x0-5,cy,334,cy,THIN)+L(x0,cy-R-14,x0,cy+R+14,THIN)+T(x0-4,cy-R+4,'1',{c:'var(--muted)',fs:10,a:'end'})+T(x0-4,cy+R+4,'−1',{c:'var(--muted)',fs:10,a:'end'})+T(334,cy-5,'θ',{c:'var(--muted)',fs:10,a:'end'});
    const path=(a,b)=>{let d='';const M=Math.max(1,Math.ceil((b-a)/.05));for(let i=0;i<=M;i++){const u=a+(b-a)*i/M;d+=(i?'L':'M')+f1(x0+u*sc)+','+f1(cy-R*f(u));}return d;};
    s+=`<path d="${path(0,4*PI)}" fill="none" ${DASH}/>`;if(k)s+=`<path d="${path(0,t)}" fill="none" ${C}/>`;
    s+=L(px,py,gx,gy,'stroke="var(--gold)" stroke-width="1" stroke-dasharray="3 3"')+L(cx,cy,px,py,INK);
    s+=m===1?L(px,cy,px,py,W('c')):L(cx,py,px,py,THIN)+L(cx,cy,cx,py,W('c'));
    s+=L(gx,cy,gx,gy,W('c',2.6))+dot(px,py,'var(--gold)')+dot(gx,gy,'var(--gold)');
    const nm=m===1?'sin':'cos';
    return {svg:s,read:`θ = <b>${pf(k,12)}</b>（${k*15}°）<br>${nm} θ = <b>${ex(val)}</b>${Math.abs(val-Math.round(val*2)/2)>1e-9?' ≈ '+n(val,3):''}<br>円の上の点の${m===1?'高さ（y 座標）':' x 座標（x 軸を上向きにしてある）'}を、<br>右のグラフに記録している。2π ごとに同じ形`};}});

// θ を横軸にとるグラフの土台。横は −2π〜2π、π ごとに目盛り。ym は縦の表示範囲
function axes(ym,top){const p=plot([-6.75,6.75,-ym,ym]);let s='';
  for(let j=-2;j<=2;j++)if(j)s+=L(p.sx(j*PI),0,p.sx(j*PI),250,'stroke="var(--line)" stroke-width="1"')+T(p.sx(j*PI)+(top?4:0),top?11:244,pf(j,1),{c:'var(--muted)',fs:10,a:top?'start':'middle'});
  for(const y of [-1,1])s+=L(0,p.sy(y),340,p.sy(y),'stroke="var(--line)" stroke-width="1"')+T(p.sx(0)-5,p.sy(y)+(y>0?-3:11),y>0?'1':'−1',{c:'var(--muted)',fs:10,a:'end'});
  s+=L(0,p.sy(0),340,p.sy(0),THIN)+L(p.sx(0),0,p.sx(0),250,THIN)+T(334,p.sy(0)-5,'θ',{c:'var(--muted)',fs:10,a:'end'})+T(p.sx(0)+6,11,'y',{c:'var(--muted)',fs:10,a:'start'});
  return {p,s};}

/* sin・cos・tan のグラフを見比べる */
const FN=['y = sin θ','y = cos θ','y = tan θ'];
FIGS.h2sankaku_graph3=host=>FIG.mk(host,{alt:'サイン、コサイン、タンジェントのグラフと、その周期を示す図',
  sliders:[{k:'m',label:'関数',min:1,max:3,step:1,v:1,fmt:m=>FN[Math.round(m)-1]},{k:'k',label:'θ',min:-24,max:24,step:1,v:2,fmt:k=>pf(k,12)}],
  draw(v){const m=Math.round(v.m),k=Math.round(v.k),t=k*PI/12,{p,s:bg}=axes(2.6),f=[Math.sin,Math.cos,Math.tan][m-1],und=m===3&&Math.abs(Math.cos(t))<1e-9,val=und?0:f(t);let s=bg;
    if(m===3){for(let j=-3;j<=2;j++){const a=j*PI+PI/2;s+=L(p.sx(a),0,p.sx(a),250,DASH);p.curve(Math.tan,C,a+.02,a+PI-.02);}}
    else{if(m===2)p.curve(Math.sin,DASH);p.curve(f,C);}
    s+=p.out();
    // 1周期分の幅
    const a0=m===3?-PI/2:0,a1=m===3?PI/2:2*PI,yb=p.sy(m===3?-2.25:1.6);
    s+=L(p.sx(a0),yb,p.sx(a1),yb,'stroke="var(--gold)" stroke-width="1.6"')+L(p.sx(a0),yb-4,p.sx(a0),yb+4,'stroke="var(--gold)" stroke-width="1.6"')+L(p.sx(a1),yb-4,p.sx(a1),yb+4,'stroke="var(--gold)" stroke-width="1.6"')+T(p.sx((a0+a1)/2),yb-5,'周期 '+(m===3?'π':'2π'),{c:'var(--gold)',fs:10});
    if(!und&&Math.abs(val)<=2.6)s+=L(p.sx(t),p.sy(0),p.sx(t),p.sy(val),'stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="3 3"')+dot(p.sx(t),p.sy(val),'var(--ink)');
    const more=['値域は −1 ≤ y ≤ 1<br>原点について対称：sin(−θ) = −sin θ','値域は −1 ≤ y ≤ 1。y 軸について対称：cos(−θ) = cos θ<br>点線の y = sin θ を θ 軸方向に −π/2 だけ平行移動した形','値域は実数全体。原点について対称<br>点線は漸近線 θ = π/2 + nπ（n は整数）'][m-1];
    return {svg:s,read:`${FN[m-1]}　周期 <b>${m===3?'π':'2π'}</b><br>θ = ${pf(k,12)} のとき y = ${und?'（定義されない）':'<b>'+ex(val)+'</b>'}<br>${more}`};}});

/* y = a sin k(θ − p)：振幅・周期・平行移動 */
FIGS.h2sankaku_henkei=host=>FIG.mk(host,{alt:'サインカーブの振幅、周期、平行移動を変える図',
  sliders:[{k:'a',label:'a（振幅）',min:.5,max:2.5,step:.5,v:2},{k:'k',label:'k',min:.5,max:3,step:.5,v:2},{k:'p',label:'p（平行移動）',min:-6,max:6,step:1,v:0,fmt:p=>pf(p,12)}],
  draw(v){const a=v.a,k=v.k,pk=Math.round(v.p),ph=pk*PI/12,{p,s:bg}=axes(3.4,true),per=2*PI/k,f=x=>a*Math.sin(k*(x-ph));
    p.curve(Math.sin,DASH).curve(f,C);let s=bg+p.out();
    const e=Math.min(ph+per,6.75),yb=p.sy(-a)+12;
    s+=L(p.sx(ph),yb,p.sx(e),yb,'stroke="var(--gold)" stroke-width="1.6"')+L(p.sx(ph),yb-4,p.sx(ph),yb+4,'stroke="var(--gold)" stroke-width="1.6"')+(ph+per<=6.75?L(p.sx(e),yb-4,p.sx(e),yb+4,'stroke="var(--gold)" stroke-width="1.6"'):'')+T(p.sx((ph+e)/2),yb+12,'1周期',{c:'var(--gold)',fs:10});
    s+=dot(p.sx(ph),p.sy(0),'var(--gold)',4);
    const as=a===1?'':n(a)+' ',ks=k===1?'':n(k),ag=pk?`(θ ${pk>0?'−':'+'} ${pf(Math.abs(pk),12)})`:'θ';
    const lhs='y = '+as+'sin'+(pk&&k===1?'':' ')+ks+ag,base0='y = '+as+'sin '+ks+'θ';
    return {svg:s,read:`<b>${lhs}</b><br>値域 −${n(a)} ≤ y ≤ ${n(a)}<br>周期 2π ÷ ${n(k)} = <b>${pf(4,Math.round(k*2))}</b><br>`+(pk?`${base0} を θ 軸方向に <i>${pf(pk,12)}</i> だけ平行移動`:'点線は y = sin θ')};}});

/* 方程式・不等式：単位円と直線の交点、条件を満たす弧 */
const KV=[[-1,'−1'],[-S3/2,'−√3/2'],[-S2/2,'−√2/2'],[-.5,'−1/2'],[0,'0'],[.5,'1/2'],[S2/2,'√2/2'],[S3/2,'√3/2'],[1,'1']];
FIGS.h2sankaku_hoteishiki=host=>FIG.mk(host,{alt:'単位円と直線の交点から、三角関数を含む方程式と不等式の解を読み取る図',
  sliders:[{k:'m',label:'式',min:1,max:2,step:1,v:1,fmt:m=>Math.round(m)===1?'sin θ と k':'cos θ と k'},{k:'j',label:'k',min:0,max:8,step:1,v:5,fmt:j=>KV[Math.round(j)][1]}],
  draw(v){const m=Math.round(v.m),j=Math.round(v.j),kv=KV[j][0],ks=KV[j][1],cx=170,cy=128,U=92,nm=m===1?'sin':'cos';
    // 解（π/12 を単位とする整数）。t1 ≤ t2
    let t1,t2;if(m===1){const a=Math.round(Math.asin(kv)/(PI/12));t1=a>=0?a:12-a;t2=a>=0?12-a:24+a;}else{t1=Math.round(Math.acos(kv)/(PI/12));t2=24-t1;}
    const A=x=>x*PI/12,one=t1===t2||(m===2&&t1===0);
    let s=base(cx,cy,U,16);
    // 大きい側（緑）と小さい側（赤）の弧。sin は上が大きい側、cos は右が大きい側
    const big=m===1?(kv>=0?[[t1,t2]]:[[t2-24,t1]]):[[-t1,t1]],small=m===1?(kv>=0?[[t2-24,t1]]:[[t1,t2]]):[[t1,t2]];
    if(Math.abs(kv)<1){big.forEach(q=>s+=arc(cx,cy,U,A(q[0]),A(q[1]),W('ok',4.2)));small.forEach(q=>s+=arc(cx,cy,U,A(q[0]),A(q[1]),W('ng',4.2)));}
    else s+=arc(cx,cy,U,0,2*PI,W(kv>0?'ng':'ok',4.2));
    s+=m===1?L(14,cy-U*kv,326,cy-U*kv,GOLD)+T(326,cy-U*kv+(kv>.85?12:-5),'y = '+ks,{c:'var(--gold)',fs:10,a:'end'})
            :L(cx+U*kv,cy-U-16,cx+U*kv,cy+U+16,GOLD)+T(cx+U*kv+(kv>.6?-4:4),cy-U-8,'x = '+ks,{c:'var(--gold)',fs:10,a:kv>.6?'end':'start'});
    const pts=one?[m===2&&t1===0?0:t1]:[t1,t2];
    pts.forEach(q=>{const c=Math.cos(A(q)),sn=Math.sin(A(q));s+=L(cx,cy,cx+U*c,cy-U*sn,INK)+dot(cx+U*c,cy-U*sn,'var(--gold)')+T(cx+(U+17)*c,cy-(U+17)*sn+4+(Math.abs(sn)<.3?(m===1&&kv>=0?12:-10):0),pf(q,12),{fs:10});});
    const P=x=>pf(x,12),eq=pts.map(P).join(', ');let gt,lt;
    if(m===1){if(kv===1){gt='なし';lt='0 ≤ θ < π/2, π/2 < θ < 2π';}else if(kv===-1){gt='0 ≤ θ < 3π/2, 3π/2 < θ < 2π';lt='なし';}
      else if(kv===0){gt='0 < θ < π';lt='π < θ < 2π';}
      else if(kv>0){gt=`${P(t1)} < θ < ${P(t2)}`;lt=`0 ≤ θ < ${P(t1)}, ${P(t2)} < θ < 2π`;}
      else{gt=`0 ≤ θ < ${P(t1)}, ${P(t2)} < θ < 2π`;lt=`${P(t1)} < θ < ${P(t2)}`;}}
    else{if(kv===1){gt='なし';lt='0 < θ < 2π';}else if(kv===-1){gt='0 ≤ θ < π, π < θ < 2π';lt='なし';}
      else{gt=`0 ≤ θ < ${P(t1)}, ${P(t2)} < θ < 2π`;lt=`${P(t1)} < θ < ${P(t2)}`;}}
    return {svg:s,read:`0 ≤ θ < 2π で考える<br>${nm} θ = ${ks} の解：θ = <b>${eq}</b><br>${nm} θ > ${ks}：${gt}（緑の弧）<br>${nm} θ < ${ks}：${lt}（赤の弧）`};}});

/* 加法定理：単位円の上の2点を同じ角だけ回しても、2点の距離は変わらない */
FIGS.h2sankaku_kaho=host=>FIG.mk(host,{alt:'単位円の上の2点 P、Q をまとめて回し、線分 PQ の横の差と縦の差を比べる図',
  sliders:[{k:'a',label:'α',min:60,max:170,step:5,v:130,fmt:x=>n(x)+'°'},{k:'b',label:'β',min:10,max:80,step:5,v:40,fmt:x=>n(x)+'°'},{k:'u',label:'回す量',min:0,max:1,step:.05,v:0,fmt:u=>Math.round(u*100)+'%'}],
  play:{k:'u',from:0,to:1,label:'2点を −β だけ回す',ms:3600},
  draw(v){const al=v.a,be=v.b,u=Math.round(v.u*20)/20,cx=150,cy=132,U=96,pa=rad(al-u*be),qa=rad(be-u*be);
    const X=t=>cx+U*Math.cos(t),Y=t=>cy-U*Math.sin(t),px=X(pa),py=Y(pa),qx=X(qa),qy=Y(qa);
    let s=base(cx,cy,U,18);
    if(u>0)s+=L(X(rad(al)),Y(rad(al)),X(rad(be)),Y(rad(be)),DASH)+dot(X(rad(al)),Y(rad(al)),'var(--muted)',3)+dot(X(rad(be)),Y(rad(be)),'var(--muted)',3);
    s+=L(cx,cy,px,py,INK)+L(cx,cy,qx,qy,INK)+arc(cx,cy,20,qa,pa,'stroke="var(--ink)" stroke-width="1.3"')+T(cx+36*Math.cos((pa+qa)/2),cy-36*Math.sin((pa+qa)/2)+4,'α−β',{fs:10});
    // 横の差（緑）と縦の差（赤）、線分 PQ（金）
    s+=L(qx,qy,px,qy,W('ok'))+L(px,qy,px,py,W('ng'))+L(px,py,qx,qy,W('gold',3))+dot(px,py,'var(--ink)')+dot(qx,qy,'var(--ink)');
    const end=u===1,pn=u>0?'P′':'P',qn=end?'Q′ = A(1, 0)':u>0?'Q′':'Q';
    s+=T(cx+(U+13)*Math.cos(pa),cy-(U+13)*Math.sin(pa)+4,pn)+T(cx+(U+9)*Math.cos(qa)+4,cy-(U+9)*Math.sin(qa)+(end?15:4),qn,{a:'start'});
    s+=L(8,13,22,13,W('ok'))+T(27,17,'横の差',{a:'start',c:'var(--ok)',fs:10})+L(8,28,22,28,W('ng'))+T(27,32,'縦の差',{a:'start',c:'var(--ng)',fs:10})+L(8,43,22,43,W('gold',3))+T(27,47,'PQ',{a:'start',c:'var(--gold)',fs:10});
    const dx=Math.cos(pa)-Math.cos(qa),dy=Math.sin(pa)-Math.sin(qa),d2=dx*dx+dy*dy;
    const last=u===0?'横の差 = cos α − cos β<br>縦の差 = sin α − sin β':end?'Q は A(1, 0) に、P は角 α − β の点に来た<br>横の差 = cos(α−β) − 1、縦の差 = sin(α−β)':`${n(u*be,1)}° 回した。差は変わるが、PQ² は変わらない`;
    return {svg:s,read:`α = ${n(al)}°、β = ${n(be)}°（α − β = ${n(al-be)}°）<br>横の差 = ${n(dx,3)}、縦の差 = ${n(dy,3)}<br>PQ² = 横² + 縦² = ${n(dx*dx,3)} + ${n(dy*dy,3)} = <b>${n(d2,3)}</b><br>${last}`};}});

/* 加法定理：鋭角のとき、4つの積が線分の長さとして現れる */
FIGS.h2sankaku_kaho2=host=>FIG.mk(host,{alt:'角 β の上に角 α を重ねた図。P の高さが sin(α+β)、横の位置が cos(α+β) になる',
  sliders:[{k:'a',label:'α',min:15,max:50,step:5,v:35,fmt:x=>n(x)+'°'},{k:'b',label:'β',min:15,max:40,step:5,v:25,fmt:x=>n(x)+'°'}],
  draw(v){const al=rad(v.a),be=rad(v.b),ox=40,oy=222,U=186,ca=Math.cos(al),sa=Math.sin(al),cb=Math.cos(be),sb=Math.sin(be);
    const X=x=>ox+U*x,Y=y=>oy-U*y,ax=ca*cb,ay=ca*sb,px=ax-sa*sb,py=ay+sa*cb;
    let s=L(ox-14,oy,ox+U+16,oy,THIN)+arc(ox,oy,U,0,rad(100),DASH);
    s+=L(X(px),Y(ay),X(px),oy,DASH)+L(ox,oy,X(ax),Y(ay),INK)+L(X(ax),Y(ay),X(px),Y(py),INK)+L(ox,oy,X(px),Y(py),'stroke="var(--gold)" stroke-width="2.2"');
    s+=L(ox,oy,X(ax),oy,W('ok'))+L(X(ax),oy,X(ax),Y(ay),W('ok'))+L(X(ax),Y(ay),X(px),Y(ay),W('ng'))+L(X(px),Y(ay),X(px),Y(py),W('ng'));
    s+=arc(ox,oy,30,0,be,'stroke="var(--ink)" stroke-width="1.3"')+arc(ox,oy,40,be,be+al,'stroke="var(--gold)" stroke-width="1.5"')+arc(X(ax),Y(ay),20,PI/2,PI/2+be,'stroke="var(--ink)" stroke-width="1.3"');
    s+=T(ox+44*Math.cos(be/2),oy-44*Math.sin(be/2)+4,'β',{fs:10})+T(ox+54*Math.cos(be+al/2),oy-54*Math.sin(be+al/2)+4,'α',{fs:10,c:'var(--gold)'})+T(X(ax)+31*Math.cos(PI/2+be/2),Y(ay)-31*Math.sin(PI/2+be/2)+4,'β',{fs:10});
    s+=dot(X(px),Y(py),'var(--gold)')+dot(X(ax),Y(ay),'var(--ink)',3.5)+T(ox-9,oy+13,'O',{c:'var(--muted)',fs:10})+T(X(px)-9,Y(py)-7,'P',{c:'var(--gold)'})+T(X(ax)+11,Y(ay)-5,'A');
    s+=T((ox+X(ax))/2,oy+14,'①',{c:'var(--ok)'})+T(X(ax)+11,(oy+Y(ay))/2+8,'②',{c:'var(--ok)'})+T((X(ax)+X(px))/2,Y(ay)-6,'③',{c:'var(--ng)'})+T(X(px)-10,(Y(ay)+Y(py))/2+4,'④',{c:'var(--ng)'});
    [['① cos α cos β','ok'],['② cos α sin β','ok'],['③ sin α sin β','ng'],['④ sin α cos β','ng']].forEach((q,i)=>s+=T(248,22+15*i,q[0],{a:'start',c:`var(--${q[1]})`,fs:10}));
    s+=T(248,90,'OP = 1',{a:'start',c:'var(--gold)',fs:10})+T(248,105,'OA = cos α',{a:'start',fs:10})+T(248,120,'AP = sin α',{a:'start',fs:10});
    const sum=v.a+v.b;
    return {svg:s,read:`α = ${n(v.a)}°、β = ${n(v.b)}°<br>P の高さ：② + ④ = ${n(ay,3)} + ${n(sa*cb,3)} = <b>${n(py,3)}</b><br>sin ${sum}° = ${n(Math.sin(rad(sum)),3)}<br>P の横の位置：① − ③ = ${n(ax,3)} − ${n(sa*sb,3)} = <b>${n(px,3)}</b><br>cos ${sum}° = ${n(Math.cos(rad(sum)),3)}`};}});

/* 正接の加法定理：2直線のなす角 */
FIGS.h2sankaku_nasukaku=host=>FIG.mk(host,{alt:'原点を通る2本の直線と、そのなす角の図',
  sliders:[{k:'m1',label:'m₁（色の線の傾き）',min:-3,max:3,step:.25,v:2},{k:'m2',label:'m₂（白い線の傾き）',min:-3,max:3,step:.25,v:.5}],
  draw(v){const m1=v.m1,m2=v.m2,p=plot([-4.2,4.2,-3.1,3.1]).grid(),a1=Math.atan(m1),a2=Math.atan(m2),den=1+m1*m2;
    p.seg(-4.2,-4.2*m2,4.2,4.2*m2,'stroke="var(--ink)" stroke-width="2"').seg(-4.2,-4.2*m1,4.2,4.2*m1,C);
    let s=p.out();const lo=Math.min(a1,a2),hi=Math.max(a1,a2),acute=hi-lo<=PI/2+1e-9;
    // なす角（90° 以下の方）に印を付ける
    if(m1!==m2)s+=acute?arc(p.sx(0),p.sy(0),42,lo,hi,'stroke="var(--gold)" stroke-width="2.4"'):arc(p.sx(0),p.sy(0),42,hi,lo+PI,'stroke="var(--gold)" stroke-width="2.4"');
    const perp=Math.abs(den)<1e-9,tn=perp?0:Math.abs((m1-m2)/den),deg=perp?90:Math.atan(tn)*180/PI;
    return {svg:s,read:`tan α = m₁ = ${n(m1)}、tan β = m₂ = ${n(m2)}<br>`+(perp?`1 + m₁m₂ = 0 なので tan は定義されない<br>2直線は<b>垂直</b>（なす角 90°）`:`(m₁ − m₂) ÷ (1 + m₁m₂) = ${n(m1-m2)} ÷ ${n(den,4)} = ${n((m1-m2)/den,3)}<br>なす角 θ：tan θ = <b>${n(tn,3)}</b><br>θ ≈ <b>${n(deg,1)}°</b>`+(m1===m2?'（同じ直線）':''))};}});

/* 2倍角：円周角 θ と中心角 2θ */
FIGS.h2sankaku_baikaku=host=>FIG.mk(host,{alt:'直径 AB の半円の上の点 P。角 PAB が θ のとき、角 POB は 2θ になる図',
  sliders:[{k:'t',label:'θ',min:10,max:80,step:5,v:30,fmt:x=>n(x)+'°'}],play:{k:'t',from:10,to:80,label:'θ を大きくする',ms:3600},
  draw(v){const th=rad(v.t),ox=175,oy=196,U=118,px=ox+U*Math.cos(2*th),py=oy-U*Math.sin(2*th),ax=ox-U,bx=ox+U;
    let s=arc(ox,oy,U,0,PI,'stroke="var(--ink)" stroke-width="1.3"')+L(ax,oy,bx,oy,INK)+L(px,py,bx,oy,DASH)+L(ox,oy,px,py,INK);
    s+=L(ax,oy,px,oy,W('ok'))+L(ax,oy,px,py,W('c'))+L(px,oy,px,py,W('gold',3));
    s+=arc(ax,oy,30,0,th,'stroke="var(--ink)" stroke-width="1.3"')+T(ax+44*Math.cos(th/2),oy-44*Math.sin(th/2)+4,'θ',{fs:10})+arc(ox,oy,15,0,2*th,'stroke="var(--gold)" stroke-width="1.5"')+T(ox+27*Math.cos(th),oy-27*Math.sin(th)+4,'2θ',{fs:10,c:'var(--gold)'});
    s+=dot(px,py,'var(--ink)')+T(ax-7,oy+14,'A',{fs:10})+T(bx+7,oy+14,'B',{fs:10})+T(ox,oy+14,'O',{fs:10})+(Math.abs(px-ox)>12?T(px,oy+14,'H',{fs:10}):'')+T(px+(px>=ox?9:-9),py-7,'P');
    s+=L(8,13,22,13,W('c'))+T(27,17,'AP = 2cos θ',{a:'start',c:'var(--c)',fs:10})+L(8,28,22,28,W('gold',3))+T(27,32,'PH = sin 2θ',{a:'start',c:'var(--gold)',fs:10})+L(8,43,22,43,W('ok'))+T(27,47,'AH = 1 + cos 2θ',{a:'start',c:'var(--ok)',fs:10});
    const c=Math.cos(th),sn=Math.sin(th);
    return {svg:s,read:`θ = ${n(v.t)}°　AP = 2cos θ = ${n(2*c,3)}<br>PH = AP × sin θ = 2 sin θ cos θ = <b>${n(2*sn*c,3)}</b><br>sin 2θ = sin ${n(2*v.t)}° = ${n(Math.sin(2*th),3)}<br>AH = AP × cos θ = 2cos²θ = <b>${n(2*c*c,3)}</b><br>1 + cos 2θ = ${n(1+Math.cos(2*th),3)}`};}});

/* 合成：点 P(a, b) を θ だけ回した点の高さが a sin θ + b cos θ */
FIGS.h2sankaku_gosei=host=>FIG.mk(host,{alt:'点 P(a, b) を回した点の高さと、2つの波の和のグラフを連動させた図',
  sliders:[{k:'a',label:'a',min:-2,max:2,step:.5,v:1.5},{k:'b',label:'b',min:-2,max:2,step:.5,v:2},{k:'k',label:'θ',min:0,max:24,step:1,v:2,fmt:k=>pf(k,12)}],
  play:{k:'k',from:0,to:24,label:'θ を 1 周させる',ms:5200},
  draw(v){const a=v.a,b=v.b,k=Math.round(v.k),t=k*PI/12,cx=76,cy=120,u=25,x0=160,r=Math.hypot(a,b),al=Math.atan2(b,a),f=x=>a*Math.sin(x)+b*Math.cos(x),val=f(t);
    const ex_=cx+u*r*Math.cos(al+t),ey=cy-u*r*Math.sin(al+t),gx=x0+u*t,gy=cy-u*val;
    let s=L(cx-72,cy,cx+72,cy,THIN)+L(cx,cy-76,cx,cy+76,THIN);
    if(r>0)s+=`<circle cx="${cx}" cy="${cy}" r="${f1(u*r)}" ${THIN}/>`+L(cx,cy,cx+u*a,cy-u*b,DASH)+arc(cx,cy,11,0,al,'stroke="var(--ink)" stroke-width="1.2"');
    for(const j of [1,2])s+=L(x0+j*PI*u,cy-76,x0+j*PI*u,cy+76,'stroke="var(--line)" stroke-width="1"')+T(x0+j*PI*u,cy+92,pf(j,1),{c:'var(--muted)',fs:10});
    s+=L(x0-4,cy,336,cy,THIN)+L(x0,cy-76,x0,cy+76,THIN)+T(336,cy-5,'θ',{c:'var(--muted)',fs:10,a:'end'});
    if(r>0)s+=L(x0,cy-u*r,x0+2*PI*u,cy-u*r,'stroke="var(--gold)" stroke-width="1" stroke-dasharray="2 4"')+L(x0,cy+u*r,x0+2*PI*u,cy+u*r,'stroke="var(--gold)" stroke-width="1" stroke-dasharray="2 4"');
    const path=g=>{let d='';for(let i=0;i<=120;i++){const x=2*PI*i/120;d+=(i?'L':'M')+f1(x0+u*x)+','+f1(cy-u*g(x));}return d;};
    s+=`<path d="${path(x=>a*Math.sin(x))}" fill="none" stroke="var(--ok)" stroke-width="1.4"/><path d="${path(x=>b*Math.cos(x))}" fill="none" stroke="var(--ng)" stroke-width="1.4"/><path d="${path(f)}" fill="none" ${C}/>`;
    s+=L(ex_,ey,gx,gy,'stroke="var(--gold)" stroke-width="1" stroke-dasharray="3 3"')+L(cx,cy,ex_,ey,'stroke="var(--gold)" stroke-width="2.4"');
    s+=dot(gx,cy-u*a*Math.sin(t),'var(--ok)',3)+dot(gx,cy-u*b*Math.cos(t),'var(--ng)',3)+dot(cx+u*a,cy-u*b,'var(--ink)',3.5)+dot(ex_,ey,'var(--gold)')+dot(gx,gy,'var(--gold)');
    s+=T(cx+u*a+(a>=0?7:-7),cy-u*b+(b>=0?-6:13),'P',{fs:10,a:a>=0?'start':'end'});
    s+=L(8,226,22,226,W('ok',2))+T(26,230,'a sin θ',{a:'start',c:'var(--ok)',fs:10})+L(88,226,102,226,W('ng',2))+T(106,230,'b cos θ',{a:'start',c:'var(--ng)',fs:10})+L(168,226,182,226,W('c',3))+T(186,230,'a sin θ + b cos θ',{a:'start',c:'var(--c)',fs:10});
    const ad=al*180/PI;
    return {svg:s,read:`P(${n(a)}, ${n(b)})：r = OP = ${n(r,3)}、α = ${n(ad,1)}°<br>a sin θ + b cos θ = ${n(a*Math.sin(t),3)} ${sg(b*Math.cos(t),3)} = <b>${n(val,3)}</b><br>r sin(θ + α) = ${n(r,3)} × sin ${n(k*15+ad,1)}° = <b>${n(r*Math.sin(t+al),3)}</b><br>P を θ = ${pf(k,12)} だけ回した点の高さが、和になる`};}});

})();
