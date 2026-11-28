/* 中学1年「比例・反比例」の図（FIGS.m1hirei_*）。動かせる図と、問題に付ける図（m1hirei_q） */
(function(){
const {plot,draw,n,mk,C,GOLD,DASH}=FIG;
const f=v=>v.toFixed(1);
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
const TH='paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round"';
const rect=(d,x,y,w,h,st)=>d.poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],st);
const FILL=(col,o=.3)=>`fill="var(--${col})" fill-opacity="${o}" stroke="var(--${col})" stroke-width="1.4"`;
const pn=v=>v<0?`(${n(v)})`:n(v);
// 分数係数の表示：y = ax の a
const eqA=a=>a===1?'y = x':a===-1?'y = −x':`y = ${n(a)}x`;
// 表：head = 左はしの見出し、rows = [[値…]…]。hl = 強調する列の番号の配列
const table=(d,x0,y0,hw,cw,rh,heads,rows,hl=[])=>{const nc=rows[0].length;
  hl.forEach(j=>rect(d,x0+hw+j*cw,y0,cw,rh*rows.length,'fill="var(--gold)" fill-opacity=".16" stroke="none"'));
  for(let i=0;i<=rows.length;i++)d.line(x0,y0+i*rh,x0+hw+nc*cw,y0+i*rh,'stroke="var(--line)" stroke-width="1"');
  d.line(x0,y0,x0,y0+rh*rows.length,'stroke="var(--line)" stroke-width="1"');for(let j=0;j<=nc;j++)d.line(x0+hw+j*cw,y0,x0+hw+j*cw,y0+rh*rows.length,'stroke="var(--line)" stroke-width="1"');
  rows.forEach((r,i)=>{tx(d,x0+hw/2,y0+i*rh+rh/2+4,heads[i],'var(--muted)',10);r.forEach((v,j)=>tx(d,x0+hw+j*cw+cw/2,y0+i*rh+rh/2+4,v,hl.includes(j)?'var(--gold)':'var(--ink)',cw<28?9:10));});};
// 表の上（下）に、列 j1 から列 j2 への矢印と「×k」
const arc=(d,xa,xb,y,up,label,col)=>{const m=(xa+xb)/2,h=up?-14:14;d.path(`M${f(xa)},${y} Q${f(m)},${y+h*1.6} ${f(xb)},${y}`,`stroke="${col}" stroke-width="1.4" fill="none"`);tx(d,m,y+h+(up?-2:10),label,col,10);};
const NL=(d,lo,hi,y,x0=24,x1=316)=>{const X=v=>x0+(v-lo)/(hi-lo)*(x1-x0);d.line(x0-9,y,x1+9,y,'stroke="var(--muted)" stroke-width="1.4"');
  for(let i=lo;i<=hi;i++){d.line(X(i),y-(i===0?7:4),X(i),y+(i===0?7:4),'stroke="var(--muted)" stroke-width="1.2"');tx(d,X(i),y+20,n(i),i===0?'var(--ink)':'var(--muted)',10);}return X;};

/* ---- 関数：x を決めると y がただ 1 つ決まるか ---- */
const divs=x=>{const a=[];for(let k=1;k<=x;k++)if(x%k===0)a.push(k);return a;};
const KN=[['1 辺 x cm の正方形の、周の長さ y cm',x=>4*x,x=>`4 × ${x}`],['面積 20 cm² の長方形の、横 x cm と縦 y cm',x=>20/x,x=>`20 ÷ ${x}`],['自然数 x の約数 y']];
FIGS.m1hirei_kansu=host=>mk(host,{alt:'x の値を決めたときに、y の値がただ 1 つ決まるかどうかを調べる図',h:230,
  sliders:[{k:'r',label:'x と y の関係',min:1,max:3,step:1,v:1,fmt:r=>['正方形の周','長方形の縦','約数'][r-1]},{k:'x',label:'x の値',min:1,max:10,step:1,v:6}],
  draw(v){const d=draw(),r=v.r,x=v.x,K=KN[r-1],ys=r===3?divs(x):[K[1](x)],one=ys.length===1;
    tx(d,170,26,K[0],'var(--ink)',11);
    rect(d,20,52,70,34,FILL('c',.3));tx(d,55,74,'x = '+x,'var(--ink)',13);
    d.line(94,69,110,69,'stroke="var(--muted)" stroke-width="1.6"');d.poly([[116,69],[108,64],[108,74]],'fill="var(--muted)" stroke="none"');
    rect(d,120,52,56,34,'fill="var(--ink)" fill-opacity=".08" stroke="var(--muted)" stroke-width="1.2"');tx(d,148,73,'きまり','var(--muted)',10);
    d.line(180,69,196,69,'stroke="var(--muted)" stroke-width="1.6"');d.poly([[202,69],[194,64],[194,74]],'fill="var(--muted)" stroke="none"');
    rect(d,206,52,116,34,FILL(one?'gold':'ng',.3));tx(d,264,74,'y = '+ys.map(y=>n(y)).join(', '),'var(--ink)',ys.length>3?11:12);
    const xs=[1,2,3,4,5,6,7,8,9,10];
    table(d,16,122,36,28,26,['x',r===3?'個数':'y'],[xs.map(String),xs.map(k=>r===3?String(divs(k).length):n(K[1](k)))],[x-1]);
    tx(d,170,202,one&&r!==3?'どの x でも、y はただ 1 つ':'y が 2 つ以上ある x がある','var(--'+(r===3?'ng':'gold')+')',11);
    return {svg:d.out(),read:r===3?`x = ${x} のとき、約数 y は ${ys.join(', ')}<br>`+(one?'この x では 1 つだが、ほかの x では 2 つ以上ある':`${ys.length} つあり、ただ 1 つに決まらない`)+'<br><b>y は x の関数ではない</b>':`x = ${x} と決めると、y = ${K[2](x)} = <b>${n(ys[0])}</b><br>y の値がただ 1 つ決まる<br><b>y は x の関数である</b>`};}});

/* ---- 変域 ---- */
const HT=[['≦','≦','以上','以下',1,1],['&lt;','&lt;','より大きく','未満',0,0],['≦','&lt;','以上','未満',1,0],['&lt;','≦','より大きく','以下',0,1]];
FIGS.m1hirei_heniki=host=>mk(host,{alt:'変数 x のとりうる値の範囲を、数直線の上の太い線と端の丸で表す図',h:170,
  sliders:[{k:'a',label:'左はし',min:-5,max:0,step:1,v:-3},{k:'b',label:'右はし',min:1,max:6,step:1,v:4},{k:'t',label:'はしをふくむか',min:1,max:4,step:1,v:3,fmt:t=>['両方ふくむ','両方ふくまない','左だけふくむ','右だけふくむ'][t-1]}],
  draw(v){const d=draw(),T=HT[v.t-1],y=92,X=NL(d,-6,7,y);
    d.line(X(v.a),y,X(v.b),y,'stroke="var(--c)" stroke-width="5" stroke-linecap="round"');
    [[v.a,T[4]],[v.b,T[5]]].forEach(([p,inc])=>d.circle(X(p),y,6,inc?'fill="var(--c)" stroke="var(--c)" stroke-width="2"':'fill="var(--bg2)" stroke="var(--c)" stroke-width="2.4"'));
    tx(d,170,44,`${n(v.a)} ${T[0]} x ${T[1]} ${n(v.b)}`,'var(--gold)',15);
    return {svg:d.out(),read:`<b>${n(v.a)} ${T[0]} x ${T[1]} ${n(v.b)}</b><br>x は ${n(v.a)} ${T[2]}、${n(v.b)} ${T[3]}<br>● はその数をふくむ。○ はその数をふくまない`};}});

/* ---- 比例の表 ---- */
FIGS.m1hirei_hirei=host=>mk(host,{alt:'比例 y = ax の対応表で、x が何倍かになると y も同じ倍になることを示す図',h:220,
  sliders:[{k:'a',label:'比例定数 a',min:-3,max:3,step:.5,v:2},{k:'k',label:'x を何倍にするか',min:2,max:4,step:1,v:2}],
  draw(v){const d=draw(),a=v.a,k=v.k,xs=[-4,-3,-2,-1,0,1,2,3,4],x0=14,hw=36,cw=31,y0=84,rh=26,cx=j=>x0+hw+j*cw+cw/2;
    tx(d,170,28,a===0?'y = 0（a = 0 のときは比例といわない）':eqA(a),'var(--gold)',14);
    table(d,x0,y0,hw,cw,rh,['x','y'],[xs.map(x=>n(x)),xs.map(x=>n(a*x))],[5,4+k]);
    arc(d,cx(5),cx(4+k),y0-2,true,`× ${k}`,'var(--gold)');arc(d,cx(5),cx(4+k),y0+2*rh+2,false,`× ${k}`,'var(--gold)');
    tx(d,170,196,a===0?'':`x ≠ 0 のどの列でも、y ÷ x = ${n(a)}`,'var(--muted)',11);
    return {svg:d.out(),read:a===0?'a = 0 のとき、y はいつも 0<br>比例定数は 0 でない数とする':`${eqA(a)}<br>x が 1 → ${k}（${k} 倍）のとき<br>y は ${n(a)} → ${n(a*k)}（<b>${k} 倍</b>）<br>x が負の数でも、比例定数が負の数でも同じ`};}});

/* ---- 座標 ---- */
FIGS.m1hirei_zahyo=host=>mk(host,{alt:'座標平面の上で点 P を動かして、座標を読む図',
  sliders:[{k:'x',label:'x 座標',min:-5,max:5,step:1,v:3},{k:'y',label:'y 座標',min:-4,max:4,step:1,v:-2}],
  draw(v){const p=plot([-6.2,6.2,-4.56,4.56]).grid(),x=v.x,y=v.y;
    p.seg(x,0,x,y,'stroke="var(--gold)" stroke-width="1.6" stroke-dasharray="4 3"').seg(0,y,x,y,'stroke="var(--c)" stroke-width="1.6" stroke-dasharray="4 3"');
    p.dot(x,0,'var(--gold)',3.5).dot(0,y,'var(--c)',3.5).dot(x,y,'var(--ink)',5.5);
    p.txt(0,0,'O','text-anchor="end" dx="-5" dy="13" fill="var(--ink)" '+TH);
    p.txt(x,y,`P(${n(x)}, ${n(y)})`,`text-anchor="${x>2?'end':'start'}" dx="${x>2?-9:9}" dy="${y>=3?16:y<=-3?-9:y>=0?-9:16}" fill="var(--ink)" style="font-size:12px" `+TH);
    return {svg:p.out(),read:`点 P の x 座標は <b>${n(x)}</b>、y 座標は <i>${n(y)}</i><br>P(${n(x)}, ${n(y)}) と書く<br>`+(x===0&&y===0?'原点 O と同じ点':x===0?'x 座標が 0 なので、y 軸の上にある':y===0?'y 座標が 0 なので、x 軸の上にある':`原点から${x>0?'右':'左'}へ ${Math.abs(x)}、${y>0?'上':'下'}へ ${Math.abs(y)} 進んだ点`)};}});

/* ---- 比例のグラフ：点を細かくとる ---- */
const ST=[1,.5,.25,.1];
FIGS.m1hirei_graph=host=>mk(host,{alt:'比例 y = ax の x と y の値の組を点で表し、点の間隔を細かくしていく図',
  sliders:[{k:'a',label:'比例定数 a',min:-3,max:3,step:.5,v:2},{k:'i',label:'x をとる間隔',min:0,max:3,step:1,v:0,fmt:i=>String(ST[i])}],play:{k:'i',from:0,to:3,label:'点を細かくとっていく',ms:3600},
  draw(v){const p=plot([-6.2,6.2,-4.56,4.56]).grid(),a=v.a,st=ST[v.i];
    if(v.i===3)p.curve(x=>a*x,'stroke="var(--c)" stroke-width="1.4" opacity=".6"');
    for(let k=Math.round(-6/st);k<=6/st;k++){const x=k*st,y=a*x;if(Math.abs(y)<=4.6)p.dot(x,y,'var(--c)',v.i===0?4.5:v.i===1?3.4:v.i===2?2.6:1.8);}
    p.dot(0,0,'var(--gold)',4);if(Math.abs(a)<=4.5)p.dot(1,a,'var(--gold)',4).txt(1,a,`(1, ${n(a)})`,`dx="9" dy="${a>=0?12:-6}" fill="var(--gold)" `+TH);
    return {svg:p.out(),read:a===0?'a = 0 のときは、比例といわない':`${eqA(a)}<br>x を ${st} おきにとった点<br>点は、原点を通る 1 本の直線の上に並ぶ<br>a ${a>0?'&gt;':'&lt;'} 0 なので、<b>${a>0?'右上がり':'右下がり'}</b>の直線`};}});

/* ---- 比例のグラフが直線になる理由：階段 ---- */
FIGS.m1hirei_kaidan=host=>mk(host,{alt:'比例のグラフの上を、横に同じ幅ずつ進む階段でたどる図',
  sliders:[{k:'a',label:'比例定数 a',min:-2,max:2,step:.5,v:1.5},{k:'w',label:'横に進む幅',min:0,max:2,step:1,v:0,fmt:i=>String([1,.5,.25][i])}],play:{k:'w',from:0,to:2,label:'階段を細かくする',ms:3000},
  draw(v){const p=plot([-1.2,5.6,-3.5,6.5],340,250).grid(),a=v.a,w=[1,.5,.25][v.w],ST2='stroke="var(--gold)" stroke-width="1.8"';
    p.curve(x=>a*x,'stroke="var(--c)" stroke-width="1.4" opacity=".7"');
    for(let x=0;x<3-1e-9;x+=w){p.seg(x,a*x,x+w,a*x,ST2).seg(x+w,a*x,x+w,a*(x+w),ST2);p.dot(x,a*x,'var(--c)',w===1?4:3);}
    p.dot(3,3*a,'var(--c)',w===1?4:3);
    if(w===1&&a!==0){p.txt(.5,0,'1','text-anchor="middle" dy="'+(a>0?-5:13)+'" fill="var(--gold)" '+TH).txt(1,a/2,n(a),'dx="7" dy="4" fill="var(--gold)" '+TH);}
    return {svg:p.out(),read:`${a===0?'y = 0':eqA(a)}<br>横に ${w} 進むと、縦に <b>${n(a*w)}</b> 進む<br>どの段も、同じ形の階段になっている<br>だから、点は一直線の上に並ぶ`};}});

/* ---- 反比例の表 ---- */
const HA=[-24,-18,-12,-6,6,12,18,24];
FIGS.m1hirei_hanpirei=host=>mk(host,{alt:'反比例 y = a/x の対応表で、x が何倍かになると y がその逆数倍になることを示す図',h:220,
  sliders:[{k:'j',label:'比例定数 a',min:0,max:7,step:1,v:5,fmt:j=>n(HA[j])},{k:'k',label:'x を何倍にするか',min:2,max:4,step:1,v:2}],
  draw(v){const d=draw(),a=HA[v.j],k=v.k,xs=[-6,-4,-3,-2,-1,1,2,3,4,6],x0=14,hw=40,cw=27.6,y0=84,rh=26,cx=j=>x0+hw+j*cw+cw/2,j2=xs.indexOf(k);
    tx(d,170,28,`y = ${n(a)} ÷ x`,'var(--gold)',14);
    table(d,x0,y0,hw,cw,rh,['x','y'],[xs.map(x=>n(x)),xs.map(x=>n(a/x))],[5,j2]);
    arc(d,cx(5),cx(j2),y0-2,true,`× ${k}`,'var(--gold)');arc(d,cx(5),cx(j2),y0+2*rh+2,false,`× 1/${k}`,'var(--gold)');
    tx(d,170,196,`どの列でも、x × y = ${n(a)}`,'var(--muted)',11);
    return {svg:d.out(),read:`y = ${n(a)} ÷ x（x × y = ${n(a)}）<br>x が 1 → ${k}（${k} 倍）のとき<br>y は ${n(a)} → ${n(a/k)}（<b>1/${k} 倍</b>）<br>x = 0 に対応する y の値はない`};}});
FIGS.m1hirei_hanpirei.sim=(j,x)=>HA[j]/x;

/* ---- 反比例のグラフ：点を細かくとる ---- */
const GA=[-12,-8,-6,-4,4,6,8,12];
FIGS.m1hirei_hgraph=host=>mk(host,{alt:'反比例 y = a/x の x と y の値の組を点で表し、点の間隔を細かくしていく図',
  sliders:[{k:'j',label:'比例定数 a',min:0,max:7,step:1,v:5,fmt:j=>n(GA[j])},{k:'i',label:'x をとる間隔',min:0,max:3,step:1,v:0,fmt:i=>String(ST[i])}],play:{k:'i',from:0,to:3,label:'点を細かくとっていく',ms:3600},
  draw(v){const p=plot([-9,9,-6.62,6.62]).grid(),a=GA[v.j],st=ST[v.i],g=x=>a/x;
    if(v.i===3){p.curve(g,'stroke="var(--c)" stroke-width="1.4" opacity=".6"',-9,-.05).curve(g,'stroke="var(--c)" stroke-width="1.4" opacity=".6"',.05,9);}
    for(let k=Math.round(-9/st);k<=9/st;k++){if(k===0)continue;const x=k*st,y=g(x);if(Math.abs(y)<=6.7)p.dot(x,y,'var(--c)',v.i===0?4.5:v.i===1?3.4:v.i===2?2.6:1.8);}
    return {svg:p.out(),read:`y = ${n(a)} ÷ x<br>x を ${st} おきにとった点（x = 0 は除く）<br>点は、なめらかな 2 つの曲線（<b>双曲線</b>）の上に並ぶ<br>a ${a>0?'&gt;':'&lt;'} 0 なので、${a>0?'右上と左下':'左上と右下'}にある`};}});

/* ---- なぜ：面積が一定の長方形の頂点 ---- */
FIGS.m1hirei_chohokei=host=>mk(host,{alt:'面積が一定の長方形の横を変えたとき、右上の頂点が曲線をたどることを示す図',
  sliders:[{k:'a',label:'面積（cm²）',min:6,max:18,step:6,v:12},{k:'x',label:'横 x（cm）',min:1,max:9,step:.25,v:3}],play:{k:'x',from:1,to:9,label:'横をのばしていく',ms:4000},
  draw(v){const p=plot([-.9,9.6,-.75,6.97]).grid(),a=v.a,x=v.x,y=a/x;
    p.curve(t=>a/t,'stroke="var(--c)" stroke-width="1.6" opacity=".7"',.8,9.6);
    p.poly([[0,0],[x,0],[x,y],[0,y]],'fill="var(--gold)" fill-opacity=".28" stroke="var(--gold)" stroke-width="1.6"').dot(x,y,'var(--gold)',5);
    p.txt(x/2,0,'横 '+n(x),'text-anchor="middle" dy="-6" fill="var(--ink)" '+TH);
    if(y<=6.5)p.txt(0,y/2,'縦 '+n(y),'dx="6" dy="4" fill="var(--ink)" '+TH);
    return {svg:p.out(),read:`横 x = ${n(x)}、縦 y = ${a} ÷ ${n(x)} = <b>${n(y)}</b><br>面積 x × y = ${n(x)} × ${n(y)} = ${a}（一定）<br>横をのばすと、同じ面積を保つために縦がちぢむ<br>右上の頂点は、曲線 y = ${a} ÷ x の上を動く`};}});

/* ---- なぜ：減り方が一定でない ---- */
FIGS.m1hirei_heri=host=>mk(host,{alt:'反比例 y = 12/x で、x が 1 増えるごとの y の減り方を段の高さで示す図',
  sliders:[{k:'k',label:'x をどこから 1 増やすか',min:1,max:7,step:1,v:1}],play:{k:'k',from:1,to:7,label:'順に見る',ms:4200},
  draw(v){const p=plot([-.9,9.6,-1.3,13.2]).grid(),g=x=>12/x,k=v.k,ST2='stroke="var(--gold)" stroke-width="2.4"';
    p.curve(g,'stroke="var(--c)" stroke-width="1.4" opacity=".6"',.9,9.6);
    for(let x=1;x<8;x++){p.seg(x,g(x),x+1,g(x),DASH).seg(x+1,g(x),x+1,g(x+1),x===k?ST2:'stroke="var(--muted)" stroke-width="1.4"');}
    for(let x=1;x<=8;x++)p.dot(x,g(x),x===k||x===k+1?'var(--gold)':'var(--c)',4);
    p.seg(k,g(k),k+1,g(k),ST2).txt(k+1,(g(k)+g(k+1))/2,'−'+n(g(k)-g(k+1)),'dx="8" dy="4" fill="var(--gold)" style="font-size:12px" '+TH);
    return {svg:p.out(),read:`y = 12 ÷ x<br>x が ${k} → ${k+1} のとき、y は ${n(g(k))} → ${n(g(k+1))}<br>y の減り方は <b>${n(g(k)-g(k+1))}</b><br>x が 1 増えるごとの減り方が、場所によってちがう`};}});
FIGS.m1hirei_heri.sim=k=>12/k-12/(k+1);

/* ---- 利用：2 人の進むようす ---- */
FIGS.m1hirei_riyo=host=>mk(host,{alt:'同時に出発した 2 人の、時間と進んだ道のりの関係を表す 2 本のグラフの図',
  sliders:[{k:'t',label:'出発してからの時間 x（分）',min:0,max:15,step:.5,v:4}],play:{k:'t',from:0,to:15,label:'時間を進める',ms:4500},
  draw(v){const p=plot([-1.6,16.6,-1.25,10.6]).grid(),t=v.t,an=Math.min(15,t)*.6,ot=Math.min(10,t)*.9;
    p.seg(0,9,16.6,9,'stroke="var(--muted)" stroke-width="1" stroke-dasharray="5 4"').txt(16.4,9,'公園 900 m','text-anchor="end" dy="-5" fill="var(--muted)" '+TH);
    p.seg(0,0,15,9,'stroke="var(--c)" stroke-width="2.2"').seg(0,0,10,9,'stroke="var(--gold)" stroke-width="2.2"').seg(10,9,15,9,'stroke="var(--gold)" stroke-width="2.2"');
    p.seg(t,an,t,ot,'stroke="var(--ink)" stroke-width="2.4"').dot(t,an,'var(--c)',5).dot(t,ot,'var(--gold)',5);
    p.txt(13,7.8,'姉','dx="6" dy="14" fill="var(--c)" style="font-size:12px" '+TH).txt(6,5.4,'弟','text-anchor="end" dx="-6" dy="-2" fill="var(--gold)" style="font-size:12px" '+TH);
    p.txt(16.4,0,'（分）','text-anchor="end" dy="13"').txt(0,10.3,'（100 m）','dx="14" dy="6"');
    return {svg:p.out(),read:`出発してから ${n(t)} 分後<br><i>姉：60 × ${n(Math.min(15,t))} = ${n(an*100)}（m）</i><br><b>弟</b>：${t>=10?'公園に着いている。900（m）':`90 × ${n(t)} = ${n(ot*100)}（m）`}<br>2 人の間の道のり（縦の線の長さ）：<b>${n((ot-an)*100)} m</b>`};}});
FIGS.m1hirei_riyo.sim=t=>(Math.min(10,t)*90-Math.min(15,t)*60);

/* ---- 利用：てこのつり合い ---- */
FIGS.m1hirei_teko=host=>mk(host,{alt:'支点の左に 40 g のおもりをつるしたてこで、右のおもりの重さを変えたときのつり合う位置を示す図',h:210,
  sliders:[{k:'x',label:'右のおもりの重さ x（g）',min:20,max:60,step:5,v:30}],play:{k:'x',from:20,to:60,label:'おもりを重くしていく',ms:4000},
  draw(v){const d=draw(),x=v.x,y=240/x,u=11,cx=152,by=78,lx=cx-6*u,rx=cx+y*u;
    d.poly([[cx,by],[cx-14,by+62],[cx+14,by+62]],'fill="var(--muted)" fill-opacity=".35" stroke="var(--muted)" stroke-width="1.2"');
    d.line(cx-7.5*u,by,cx+13*u,by,'stroke="var(--ink)" stroke-width="3.2" stroke-linecap="round"');
    for(let k=-7;k<=13;k++)d.line(cx+k*u,by-4,cx+k*u,by+4,'stroke="var(--muted)" stroke-width="1"');
    const W=(px,g,col)=>{const s=10+g*.28;d.line(px,by,px,by+28,'stroke="var(--muted)" stroke-width="1.2"');rect(d,px-s/2,by+28,s,s,FILL(col,.5));tx(d,px,by+28+s+15,g+' g',`var(--${col})`,11);};
    W(lx,40,'c');W(rx,x,'gold');
    tx(d,(lx+cx)/2,by-10,'6 cm','var(--c)',11);tx(d,(rx+cx)/2,by-10,n(y)+' cm','var(--gold)',11);tx(d,cx,by-28,'支点','var(--muted)',10);
    return {svg:d.out(),read:`左：40 g × 6 cm = 240<br>右：${x} g × ${n(y)} cm = 240<br>つり合うとき、重さ × 支点からの距離 が等しい<br>y = 240 ÷ ${x} = <b>${n(y)}</b>（cm）。y は x に反比例する`};}});

/* ---- 問題に付ける図（動かさない） ---- */
const Q={
 ten4:{alt:'座標平面上の 4 点 A, B, C, D の図',f(){const p=plot([-6.2,6.2,-4.56,4.56]).grid();[['A',2,3],['B',-4,1],['C',-3,-2],['D',0,-4]].forEach(([nm,x,y])=>p.dot(x,y,'var(--gold)',5).txt(x,y,nm,'dx="8" dy="-6" fill="var(--ink)" style="font-size:12px" '+TH));return [p,'点 A, B, C, D'];}},
 sankaku:{alt:'3 点 A(−2, −1), B(4, −1), C(1, 3) を頂点とする三角形の図',f(){const p=plot([-6.2,6.2,-4.56,4.56]).grid();p.poly([[-2,-1],[4,-1],[1,3]],'fill="var(--c)" fill-opacity=".22" stroke="var(--c)" stroke-width="1.8"');[['A',-2,-1,'end',-7,13],['B',4,-1,'start',7,13],['C',1,3,'start',7,-5]].forEach(([nm,x,y,an,dx,dy])=>p.dot(x,y,'var(--ink)',4).txt(x,y,nm,`text-anchor="${an}" dx="${dx}" dy="${dy}" fill="var(--ink)" style="font-size:12px" `+TH));return [p,'A(−2, −1)、B(4, −1)、C(1, 3)'];}},
 graph1:{alt:'原点と点 (−4, 3) を通る直線のグラフの図',f(){const p=plot([-6.2,6.2,-4.56,4.56]).grid();p.curve(x=>-.75*x,C).dot(-4,3,'var(--gold)',5).txt(-4,3,'(−4, 3)','dx="8" dy="-6" fill="var(--gold)" '+TH);return [p,'原点と点 (−4, 3) を通る直線'];}},
 senbun:{alt:'2 点 A(2, 3), B(2, 8) を結ぶ線分と、原点を通る直線の図',f(){const p=plot([-2.2,7.4,-1.2,9.4],340,250).grid();p.curve(x=>2.5*x,'stroke="var(--c)" stroke-width="1.6" stroke-dasharray="6 4"').seg(2,3,2,8,'stroke="var(--gold)" stroke-width="3.2"').dot(2,3,'var(--gold)',4.5).dot(2,8,'var(--gold)',4.5)
   .txt(2,3,'A(2, 3)','dx="9" dy="5" fill="var(--ink)" '+TH).txt(2,8,'B(2, 8)','dx="9" dy="5" fill="var(--ink)" '+TH).txt(.8,2,'y = ax','text-anchor="end" dx="-8" dy="2" fill="var(--c)" '+TH);return [p,'線分 AB と、直線 y = ax'];}}
};
FIGS.m1hirei_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,sliders:[],draw(){const [p,r]=q.f();return {svg:p.out(),read:r};}});};
})();
