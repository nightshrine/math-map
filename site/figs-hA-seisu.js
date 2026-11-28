/* 数学A「整数の性質」の図（FIGS.haseisu_*） */
(function(){
const {draw,n,mk,plot,C}=FIG;
const f=v=>v.toFixed(1);
const INK='stroke="var(--ink)" stroke-width="1.6" fill="none" stroke-linejoin="round"';
const SUB='stroke="var(--muted)" stroke-width="1.2" fill="none"';
const GS='stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="4 3"';
const T='paint-order="stroke" stroke="var(--bg2)" stroke-width="3" stroke-linejoin="round"';
// 文字（線に重なっても読めるよう、地の色でふちどる）
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" ${T}>${t}</text>`);
// 文字（ふちどりなし。色を塗った枠の中に書く）
const tt=(d,x,y,t,c='var(--ink)',s=12,ex='')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="middle" ${ex}>${t}</text>`);
const rect=(d,x,y,w,h,st)=>d.raw(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" ${st}/>`);
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a;};
const fac=m=>{const r=[];for(let p=2;p*p<=m;p++)while(m%p===0){r.push(p);m/=p;}if(m>1)r.push(m);return r;};
const divs=m=>{const r=[];for(let i=1;i<=m;i++)if(m%i===0)r.push(i);return r;};
const SUP=['⁰','¹','²','³','⁴','⁵','⁶'];
const neg=v=>v<0?`(${n(v)})`:String(v);
// 格子点を見る図のための方眼（座標軸と ±5 の目盛りだけ文字を出す）
const lat=(r,xt=[-5,5])=>{const p=plot(r),[x0,x1,y0,y1]=r;
  for(let x=Math.ceil(x0);x<=x1;x++)if(x)p.seg(x,y0,x,y1,'stroke="var(--line)" stroke-width=".6"');
  for(let y=Math.ceil(y0);y<=y1;y++)if(y)p.seg(x0,y,x1,y,'stroke="var(--line)" stroke-width=".6"');
  p.seg(x0,0,x1,0,'stroke="var(--muted)" stroke-width="1.2"').seg(0,y0,0,y1,'stroke="var(--muted)" stroke-width="1.2"');
  p.txt(x1,0,'x','text-anchor="end" dx="-5" dy="-5"').txt(0,y1,'y','dx="6" dy="12"');
  xt.forEach(t=>p.txt(t,0,n(t),`text-anchor="middle" dy="13" ${T}`));[-5,5].forEach(t=>p.txt(0,t,n(t),`text-anchor="end" dx="-5" dy="4" ${T}`));
  return p;};
const STEP=k=>({sliders:[{k:'s',label:'手順',min:1,max:k,step:1,v:1}],play:{k:'s',from:1,to:k,label:'順に見る',ms:1100*k}});

/* ---- 約数と倍数：n 個の点を 1 行に d 個ずつ並べる ---- */
FIGS.haseisu_narabe=host=>mk(host,{alt:'n 個の点を1行に d 個ずつ並べて、d が n の約数かどうかを調べる図',
  sliders:[{k:'n',label:'点の個数 n',min:6,max:36,step:1,v:24},{k:'d',label:'1行に並べる個数 d',min:2,max:12,step:1,v:5}],play:{k:'d',from:2,to:12,label:'d を 2 から 12 まで変える',ms:5500},
  draw(v){const N=v.n,D=v.d,q=Math.floor(N/D),r=N-D*q,rows=Math.ceil(N/D),px=21,py=Math.min(20,196/rows),rad=Math.min(6,py*.36),x0=170-(D-1)*px/2,y0=136-(rows-1)*py/2,d=draw();
    for(let i=0;i<rows*D;i++){const x=x0+(i%D)*px,y=y0+Math.floor(i/D)*py;
      if(i<N)d.dot(x,y,r===0?'var(--gold)':i<q*D?'var(--c)':'var(--ng)',rad);else d.circle(x,y,rad,'stroke="var(--muted)" stroke-width="1" fill="none" stroke-dasharray="2 2"');}
    tx(d,170,y0-rad-8,`${D} 個`,'var(--muted)',11);
    if(q>0)tx(d,x0-rad-8,y0+(q-1)*py/2+4,`${q} 行`,'var(--muted)',11,'end');
    const ds=divs(N).join(', ');
    return {svg:d.out(),read:r===0?`${N} = ${D} × ${q}<br>最後の行までそろう：<b>${D} は ${N} の約数</b><br>（${N} は ${D} の倍数）<br>${N} の正の約数：${ds}`:`${N} = ${D} × ${q} + ${r}<br>最後の行が ${r} 個で、そろわない<br>${D} は ${N} の約数ではない<br>${N} の正の約数：${ds}`};}});

/* ---- 3 と 9 の倍数の判定：100 = 99 + 1、10 = 9 + 1 に分ける ---- */
FIGS.haseisu_keta=host=>mk(host,{alt:'3桁の数を、9 の倍数の部分と各位の数の和に分ける図',
  sliders:[{k:'a',label:'百の位',min:1,max:9,step:1,v:4},{k:'b',label:'十の位',min:0,max:9,step:1,v:7},{k:'c',label:'一の位',min:0,max:9,step:1,v:1}],
  draw(v){const {a,b,c}=v,N=100*a+10*b+c,s=a+b+c,d=draw();
    const row=(y,k,big,cap)=>{tx(d,22,y-7,cap,'var(--muted)',10.5,'start');
      for(let i=0;i<k;i++){const x=22+i*(big?33:15);
        if(big){rect(d,x,y,19,26,'fill="var(--c)" fill-opacity=".28" stroke="var(--c)" stroke-width="1"');tt(d,x+9.5,y+17,big,'var(--ink)',9.5);}
        rect(d,x+(big?19:0),y,11,26,'fill="var(--gold)" fill-opacity=".6" stroke="var(--gold)" stroke-width="1"');tt(d,x+(big?24.5:5.5),y+17,'1','var(--on-c)',9.5);}};
    row(34,a,'99',`100 = 99 + 1 が ${a} 個`);row(100,b,'9',`10 = 9 + 1 が ${b} 個`);row(166,c,'',`1 が ${c} 個`);
    tx(d,22,226,`金色の 1 の合計：${a} + ${b} + ${c} = ${s}`,'var(--gold)',11.5,'start');
    const m3=s%3===0,m9=s%9===0;
    return {svg:d.out(),read:`${N} = (99 × ${a} + 9 × ${b}) + (${a} + ${b} + ${c})<br>99 × ${a} + 9 × ${b} は 9 の倍数<br>各位の数の和 = <b>${s}</b>（3 で割った余り ${s%3}、9 で割った余り ${s%9}）<br>${N} は `+(m9?'<b>3 の倍数でも 9 の倍数でもある</b>':m3?'<b>3 の倍数</b>だが、9 の倍数ではない':'3 の倍数でも 9 の倍数でもない')};}});

/* ---- エラトステネスのふるい ---- */
FIGS.haseisu_furui=host=>mk(host,Object.assign(STEP(6),{alt:'1 から 100 までの数から、2, 3, 5, 7 の倍数を順に消して素数を残す図',
  draw(v){const s=v.s,P=[2,3,5,7],d=draw(),st=[];   // st[i]：0 は最後まで残る数、k は手順 k で消える数
    for(let i=1;i<=100;i++){let t=0;if(i===1)t=1;else for(let j=0;j<4;j++)if(i%P[j]===0&&i!==P[j]){t=j+2;break;}st[i]=t;}
    let now=0,left=0;
    for(let i=1;i<=100;i++){const x=15+((i-1)%10)*31,y=14+Math.floor((i-1)/10)*22,t=st[i],gone=t>0&&t<=s,isNew=t===s,kept=!gone&&(s===6||P.slice(0,s-1).includes(i));
      if(isNew)now++;if(!gone)left++;
      if(isNew)rect(d,x+2,y+2,27,18,'fill="var(--ng)" fill-opacity=".2" stroke="none" rx="3"');
      if(kept)rect(d,x+2,y+2,27,18,'fill="var(--gold)" fill-opacity=".2" stroke="var(--gold)" stroke-width="1" rx="3"');
      tt(d,x+15.5,y+15,String(i),isNew?'var(--ng)':gone?'var(--muted)':kept?'var(--gold)':'var(--ink)',10.5,gone&&!isNew?'opacity=".38"':'');
      if(isNew)d.line(x+6,y+16,x+25,y+6,'stroke="var(--ng)" stroke-width="1"');}
    const p=P[s-2];
    return {svg:d.out(),read:s===1?`<b>手順 1</b>　1 は素数ではないので消す<br>残りは 2 から 100 までの ${left} 個`:s<=5?`<b>手順 ${s}</b>　${p} を残し、${p} の倍数を消す<br>新しく消えた数は ${now} 個、残りは ${left} 個`:
      `<b>手順 6</b>　残った <b>${left} 個</b>は、すべて素数<br>次の素数 11 は 11² = 121 > 100<br>100 以下の合成数は 2, 3, 5, 7 のどれかで割り切れる`};}}));

/* ---- 正の約数の個数：2 の指数と 3 の指数の表 ---- */
FIGS.haseisu_yakusuhyo=host=>mk(host,{alt:'2 の a 乗 × 3 の b 乗 の正の約数を、指数の組の表に並べた図',
  sliders:[{k:'a',label:'2 の指数 a',min:0,max:4,step:1,v:3},{k:'b',label:'3 の指数 b',min:0,max:3,step:1,v:2}],
  draw(v){const a=v.a,b=v.b,N=2**a*3**b,cw=48,ch=36,x0=170-((a+1)*cw+44)/2+44,y0=125-((b+1)*ch+43)/2+19,d=draw();
    for(let i=0;i<=a;i++)tx(d,x0+(i+.5)*cw,y0-9,'2'+SUP[i],'var(--c)',12);
    for(let j=0;j<=b;j++)tx(d,x0-10,y0+(j+.5)*ch+4,'3'+SUP[j],'var(--ok)',12,'end');
    for(let j=0;j<=b;j++)for(let i=0;i<=a;i++){const top=i===a&&j===b;
      rect(d,x0+i*cw+2,y0+j*ch+2,cw-4,ch-4,top?'fill="var(--gold)" fill-opacity=".3" stroke="var(--gold)" stroke-width="1.2" rx="3"':'fill="var(--c)" fill-opacity=".16" stroke="var(--line)" stroke-width="1" rx="3"');
      tt(d,x0+(i+.5)*cw,y0+(j+.5)*ch+4.5,String(2**i*3**j),top?'var(--gold)':'var(--ink)',12.5);}
    tx(d,170,y0+(b+1)*ch+20,`横 ${a+1} 通り × 縦 ${b+1} 通り = ${(a+1)*(b+1)} 個`,'var(--muted)',11);
    const e2=Array.from({length:a+1},(_,i)=>2**i),e3=Array.from({length:b+1},(_,i)=>3**i),s2=e2.reduce((x,y)=>x+y),s3=e3.reduce((x,y)=>x+y);
    return {svg:d.out(),read:`n = 2${SUP[a]} × 3${SUP[b]} = <b>${N}</b><br>正の約数の個数：(${a} + 1)(${b} + 1) = <b>${(a+1)*(b+1)} 個</b><br>約数の和：(${e2.join(' + ')})(${e3.join(' + ')}) = ${s2} × ${s3} = ${s2*s3}`};}});

/* ---- 最大公約数・最小公倍数：素因数を2つの輪に分ける ---- */
const VL=[4,6,8,9,10,12,14,15,16,18,20,21,24,25,27,28,30,32,35,36,40,42,45,48,50,54,56,60,63,64,70,72,75,80,81,84,90,96,100];
FIGS.haseisu_venn=host=>mk(host,{alt:'2つの数の素因数を、重なりのある2つの輪に分けて入れた図',
  sliders:[{k:'i',label:'a',min:0,max:VL.length-1,step:1,v:5,fmt:i=>String(VL[i])},{k:'j',label:'b',min:0,max:VL.length-1,step:1,v:9,fmt:i=>String(VL[i])}],
  draw(v){const a=VL[v.i],b=VL[v.j],fa=fac(a),fb=fac(b),rest=fb.slice(),com=[],oa=[];
    fa.forEach(p=>{const k=rest.indexOf(p);if(k>=0){com.push(p);rest.splice(k,1);}else oa.push(p);});
    const g=com.reduce((x,y)=>x*y,1),l=a*b/g,d=draw(),R=92,cy=118;
    d.circle(124,cy,R,'stroke="var(--c)" stroke-width="1.8" fill="var(--c)" fill-opacity=".08"').circle(216,cy,R,'stroke="var(--gold)" stroke-width="1.8" fill="var(--gold)" fill-opacity=".08"');
    const put=(list,cx,col)=>{const k=list.length,cols=k>3?2:1,rows=Math.ceil(k/cols);
      list.forEach((p,i)=>{const x=cx+(cols===2?(i%2?13:-13):0),y=cy+(Math.floor(i/cols)-(rows-1)/2)*27;
        d.circle(x,y,11,`stroke="${col}" stroke-width="1.6" fill="var(--bg2)"`);tt(d,x,y+4,String(p),col,11.5);});};
    put(oa,76,'var(--c)');put(com,170,'var(--ok)');put(rest,264,'var(--gold)');
    tx(d,62,20,`a = ${a}`,'var(--c)',12);tx(d,278,20,`b = ${b}`,'var(--gold)',12);tx(d,170,231,`g = ${g}`,'var(--ok)',12);
    return {svg:d.out(),read:`a = ${a} = ${fa.join(' × ')}<br>b = ${b} = ${fb.join(' × ')}<br>重なりの積 g = <b>${g}</b>、全体の積 l = <b>${l}</b><br>a × b = ${a*b}、g × l = ${g*l}`+(g===1?'<br>共通の素因数がない。a と b は互いに素':'')};}});

/* ---- 整数の割り算：数直線の上の商と余り ---- */
FIGS.haseisu_amari=host=>mk(host,{alt:'数直線の上で、整数 a を b で割ったときの商と余りを表す図',h:190,
  sliders:[{k:'a',label:'a（割られる数）',min:-8,max:12,step:1,v:11},{k:'b',label:'b（割る数）',min:2,max:6,step:1,v:4}],play:{k:'a',from:-8,to:12,label:'a を −8 から 12 まで動かす',ms:7000},
  draw(v){const a=v.a,b=v.b,q=Math.floor(a/b),r=a-b*q,X=i=>14+(i+13)*12,Y=100,d=draw(),xa=X(a),xq=X(b*q);
    d.line(8,Y,332,Y,SUB);
    for(let i=-13;i<=13;i++){const m=((i%b)+b)%b,x=X(i);d.line(x,Y-(m?3:7),x,Y+(m?3:7),m?SUB:INK);
      tt(d,x,Y+19,String(m),i===a?'var(--gold)':'var(--muted)',8.5);if(!m)tt(d,x,Y+35,n(i),i===b*q?'var(--c)':'var(--ink)',10);}
    const sgn=q<0?-1:1;
    for(let k=0;k<Math.abs(q);k++){const x1=X(k*b*sgn),x2=X((k+1)*b*sgn);d.path(`M${f(x1)},${Y-8} Q${f((x1+x2)/2)},${Y-34} ${f(x2)},${Y-8}`,'stroke="var(--c)" stroke-width="1.8" fill="none"');}
    d.line(xa,Y-8,xa,Y-30,'stroke="var(--gold)" stroke-width="1" stroke-dasharray="3 3"');
    if(r){d.line(xq,Y,xa,Y,'stroke="var(--gold)" stroke-width="4" stroke-linecap="round"');d.path(`M${f(xq)},${Y+44} v6 H${f(xa)} v-6`,'stroke="var(--gold)" stroke-width="1.4" fill="none"');}
    d.dot(xa,Y,'var(--gold)',4.5);
    if(q!==0)tx(d,(X(0)+xq)/2,Y-58,`${b} × ${neg(q)}`,'var(--c)',11);
    tx(d,Math.max(36,Math.min(304,xa)),Y-36,`a = ${n(a)}`,'var(--gold)',11.5);
    tx(d,Math.max(36,Math.min(304,(xq+xa)/2)),Y+66,`余り ${r}`,'var(--gold)',11);
    return {svg:d.out(),read:`a = ${n(a)}、b = ${b}<br>${n(a)} = ${b} × ${neg(q)} + ${r}<br>商 <b>${n(q)}</b>、余り <b>${r}</b>`+(r===0?`<br>${n(a)} は ${b} で割り切れる（${b} の倍数）`:a<0?`<br>a が負でも、余りは 0 以上 ${b} 未満にとる`:'')};}});

/* ---- 互除法：割る数を余りで割ることをくり返す（棒の図） ---- */
const PAIRS=[[78,30],[323,119],[64,27]];
const chain=(a,b)=>{const r=[];while(b){r.push([a,b,Math.floor(a/b),a%b]);[a,b]=[b,a%b];}return r;};
FIGS.haseisu_bou=host=>mk(host,{alt:'割る数を余りで割ることをくり返す互除法の手順を、棒の長さで表した図',
  sliders:[{k:'p',label:'2つの数',min:1,max:3,step:1,v:1,fmt:p=>PAIRS[p-1].join(' と ')},{k:'s',label:'手順',min:1,max:5,step:1,v:1}],play:{k:'s',from:1,to:5,label:'順に見る',ms:5500},
  draw(v){const [A,B]=PAIRS[v.p-1],rows=chain(A,B),K=rows.length,s=Math.min(v.s,K),u=296/A,d=draw();
    rows.slice(0,s).forEach(([a,b,q,r],i)=>{const y=16+i*45,last=r===0;
      for(let k=0;k<q;k++){rect(d,22+k*b*u,y,b*u,14,last?'fill="var(--ok)" fill-opacity=".4" stroke="var(--ok)" stroke-width="1"':'fill="var(--c)" fill-opacity=".26" stroke="var(--c)" stroke-width="1"');if(b*u>=20)tt(d,22+(k+.5)*b*u,y+10.5,String(b),'var(--ink)',9.5);}
      if(r){rect(d,22+q*b*u,y,r*u,14,'fill="var(--gold)" fill-opacity=".55" stroke="var(--gold)" stroke-width="1"');if(r*u>=20)tt(d,22+(q*b+r/2)*u,y+10.5,String(r),'var(--ink)',9.5);}
      tx(d,22,y+29,`${a} = ${b} × ${q} + ${r}`,i===s-1?'var(--ink)':'var(--muted)',11,'start');});
    const [a,b,q,r]=rows[s-1];
    return {svg:d.out(),read:`<b>手順 ${s}</b>　${a} ÷ ${b} = ${q} 余り ${r}<br>`+(r?`余り ${r}（金色）は 0 でない<br>次は、割る数 ${b} を余り ${r} で割る`:`余りが 0 になった<br>最後の割る数 <b>${b}</b> が、${A} と ${B} の最大公約数`+(b===1?'<br>最大公約数が 1 なので、互いに素':''))};}});

/* ---- なぜ：長方形から正方形を切り取っていく ---- */
FIGS.haseisu_seihokei=(host,arg)=>{const o=arg||{};mk(host,{alt:'長方形から、短い辺を1辺とする正方形をくり返し切り取る図',
  sliders:[{k:'a',label:'横',min:12,max:60,step:1,v:o.a||30},{k:'b',label:'縦',min:6,max:40,step:1,v:o.b||18},{k:'s',label:'手順',min:0,max:8,step:1,v:0}],play:{k:'s',from:0,to:8,label:'順に切り取る',ms:6400},
  draw(v){const A=v.a,B=v.b,u=Math.min(292/A,206/B),x0=180-A*u/2,y0=132-B*u/2,d=draw(),st=[];
    // 手順ごとに、長い辺 L、短い辺 S、切り取る個数 q、残り r、正方形の左上の位置を記録する
    let x=0,y=0,w=A,h=B;
    while(w>0&&h>0){const sq=[];
      if(w>=h){const q=Math.floor(w/h);for(let k=0;k<q;k++)sq.push([x+k*h,y]);st.push({L:w,S:h,q,r:w-q*h,sq});x+=q*h;w-=q*h;}
      else{const q=Math.floor(h/w);for(let k=0;k<q;k++)sq.push([x,y+k*w]);st.push({L:h,S:w,q,r:h-q*w,sq});y+=q*w;h-=q*w;}}
    const K=st.length,s=Math.min(v.s,K);
    rect(d,x0,y0,A*u,B*u,'stroke="var(--muted)" stroke-width="1.2" fill="none" stroke-dasharray="4 3"');
    st.slice(0,s).forEach((t,i)=>{const fin=t.r===0,cur=i===s-1;t.sq.forEach(p=>{const X=x0+p[0]*u,Y=y0+p[1]*u,S=t.S*u;
      rect(d,X,Y,S,S,fin?'fill="var(--gold)" fill-opacity=".5" stroke="var(--ink)" stroke-width="1"':`fill="var(--c)" fill-opacity="${cur?.42:.2}" stroke="var(--ink)" stroke-width="1"`);
      if(S>=15)tt(d,X+S/2,Y+S/2+Math.min(12,S/2)*.36,String(t.S),'var(--ink)',Math.min(12,S/2));});});
    tx(d,x0+A*u/2,y0-6,String(A),'var(--muted)',11.5);tx(d,x0-7,y0+B*u/2+4,String(B),'var(--muted)',11.5,'end');
    let read;
    if(s===0)read=`横 ${A}、縦 ${B} の長方形<br>短い辺 ${Math.min(A,B)} を1辺とする正方形を<br>切り取れるだけ切り取っていく`;
    else{const t=st[s-1];read=`<b>手順 ${s}</b>　${t.L} = ${t.S} × ${t.q} + ${t.r}<br>1辺 ${t.S} の正方形を ${t.q} 個切り取る<br>`+(t.r?`残りは ${t.S} × ${t.r} の長方形`:`ちょうど切り取れて、何も残らない<br><b>${A} と ${B} の最大公約数は ${t.S}</b>`);}
    return {svg:d.out(),read};}});};

/* ---- 1次不定方程式：1組の解 (2, 1) から、すべての解へ ---- */
FIGS.haseisu_kai=host=>mk(host,{alt:'直線 2x + 3y = 7 の上に並ぶ整数解と、1組の解からの進み方を表す図',
  sliders:[{k:'k',label:'k',min:-2,max:2,step:1,v:0}],play:{k:'k',from:-2,to:2,label:'k を −2 から 2 まで動かす',ms:4500},
  draw(v){const k=v.k,p=lat([-6,11,-6.25,6.25],[-5,10]),x=2+3*k,y=1-2*k;
    p.curve(t=>-2*t/3,'stroke="var(--muted)" stroke-width="1.4" stroke-dasharray="5 4"').curve(t=>(7-2*t)/3,C);
    for(let j=-1;j<=2;j++)p.dot(3*j,-2*j,'var(--muted)',3);
    // (2, 1) から選んだ解まで、直線の左下側を階段状に進む
    for(let j=0;j<Math.abs(k);j++){if(k>0){const xa=2+3*j,ya=1-2*j;p.seg(xa,ya,xa,ya-2,GS).seg(xa,ya-2,xa+3,ya-2,GS);}
      else{const xa=2-3*j,ya=1+2*j;p.seg(xa,ya,xa-3,ya,GS).seg(xa-3,ya,xa-3,ya+2,GS);}}
    if(k>0)p.txt(2,0.5,'−2',`text-anchor="end" dx="-6" dy="4" fill="var(--gold)" ${T}`).txt(3.5,-1,'+3',`text-anchor="middle" dy="14" fill="var(--gold)" ${T}`);
    if(k<0)p.txt(1.2,1,'−3',`text-anchor="middle" dy="14" fill="var(--gold)" ${T}`).txt(-1,2,'+2',`text-anchor="end" dx="-6" dy="4" fill="var(--gold)" ${T}`);
    for(let j=-2;j<=2;j++)p.dot(2+3*j,1-2*j,j===k?'var(--gold)':'var(--ink)',j===k?5.5:4);
    p.txt(2,1,'(2, 1)',`dx="8" dy="-7" fill="${k===0?'var(--gold)':'var(--ink)'}" ${T}`);
    if(k!==0)p.txt(x,y,`(${n(x)}, ${n(y)})`,`dx="8" dy="-7" fill="var(--gold)" ${T}`);
    p.seg(5.6,5.55,6.8,5.55,C).txt(7.1,5.55,'2x + 3y = 7',`dy="4" fill="var(--c)" ${T}`).seg(5.6,4.65,6.8,4.65,'stroke="var(--muted)" stroke-width="1.4" stroke-dasharray="5 4"').txt(7.1,4.65,'2x + 3y = 0',`dy="4" ${T}`);
    return {svg:p.out(),read:`1組の解 (2, 1) から、k = ${n(k)} だけ進む<br>x = 2 + 3 × ${neg(k)} = <b>${n(x)}</b>、y = 1 − 2 × ${neg(k)} = <b>${n(y)}</b><br>確かめ：2 × ${neg(x)} + 3 × ${neg(y)} = ${2*x+3*y}<br>点線 2x + 3y = 0 の整数解 (3k, −2k) の分だけずれる`};}});

/* ---- なぜ：直線 ax + by = c が通る格子点 ---- */
FIGS.haseisu_koshi=(host,arg)=>{const o=arg||{};mk(host,{alt:'直線 ax + by = c と、その上にある格子点を表す図',
  sliders:[{k:'a',label:'a',min:1,max:6,step:1,v:o.a||2},{k:'b',label:'b',min:1,max:6,step:1,v:o.b||3},{k:'c',label:'c',min:-12,max:12,step:1,v:o.c===undefined?6:o.c}],play:{k:'c',from:-12,to:12,label:'c を −12 から 12 まで動かす',ms:8000},
  draw(v){const {a,b,c}=v,g=gcd(a,b),p=lat([-9,9,-6.62,6.62]),pts=[];
    p.curve(t=>(c-a*t)/b,C);
    for(let x=-8;x<=8;x++){const y=(c-a*x)/b;if(Number.isInteger(y)&&Math.abs(y)<=6)pts.push([x,y]);}
    for(let i=0;i+1<pts.length;i++){const [x,y]=pts[i],[x2,y2]=pts[i+1];p.seg(x,y,x,y2,GS).seg(x,y2,x2,y2,GS);}
    pts.forEach(q=>p.dot(q[0],q[1],'var(--gold)',4.5));
    if(pts.length>1){   // 進み方の文字は、左端と下端で切れない位置の階段に付ける
      let i=pts.findIndex(q=>q[0]>=-6);if(i<0||i>pts.length-2)i=pts.length-2;const [x,y]=pts[i];
      p.txt(x,y-a/g/2,`−${a/g}`,`text-anchor="end" dx="-5" dy="4" fill="var(--gold)" ${T}`).txt(x+b/g/2,y-a/g,`+${b/g}`,`text-anchor="middle" dy="${y-a/g<-5.5?-5:14}" fill="var(--gold)" ${T}`);}
    const eq=`${a===1?'':a}x + ${b===1?'':b}y = ${n(c)}`;
    return {svg:p.out(),read:`${eq}<br>a と b の最大公約数 g = ${g}<br>`+(c%g?`左辺はいつも ${g} の倍数。${n(c)} は ${g} の倍数ではない<br><b>整数解はない</b>（直線は格子点を通らない）`:
      `${g>1?`${n(c)} は ${g} の倍数。`:''}整数解がある（図の範囲に ${pts.length} 個）<br>となりの解へ：x は <b>+${b/g}</b>、y は <b>−${a/g}</b>`)};}});};

/* ---- 記数法：位の重みに分ける ---- */
FIGS.haseisu_kurai=host=>mk(host,{alt:'10 進法の数 N を、n の累乗の重みをもつ位に分けて n 進法で表す図',h:230,
  sliders:[{k:'N',label:'10 進法の数 N',min:1,max:100,step:1,v:45},{k:'n',label:'n（何進法か）',min:2,max:8,step:1,v:2}],
  draw(v){const N=v.N,b=v.n,dg=[];let t=N;while(t>0){dg.unshift(t%b);t=Math.floor(t/b);}
    const m=dg.length,cw=Math.min(46,304/m),x0=170-m*cw/2,d=draw(),top=(230-(82+(b-1)*18))/2,base=top+44+(b-1)*18;
    d.line(x0-4,base,x0+m*cw+4,base,SUB);
    dg.forEach((q,i)=>{const e=m-1-i,w=b**e,cx=x0+(i+.5)*cw;
      tx(d,cx,top+12,`${b}${SUP[e]}`,'var(--c)',12);tx(d,cx,top+28,String(w),'var(--muted)',10.5);
      for(let k=0;k<q;k++){const y=base-4-(k+1)*18;rect(d,cx-cw/2+4,y+3,cw-8,15,'fill="var(--c)" fill-opacity=".3" stroke="var(--c)" stroke-width="1" rx="2"');tt(d,cx,y+14.5,String(w),'var(--ink)',9.5);}
      tx(d,cx,base+25,String(q),'var(--gold)',17);});
    return {svg:d.out(),read:`${N} = ${dg.map((q,i)=>`${q}×${b**(m-1-i)}`).join(' + ')}<br>${b} 進法で表すと <b>${dg.join('')}</b><br>使う数字は 0 から ${b-1} まで。${b} 個集まると、1つ上の位に上がる`};}});

/* ---- 記数法：n で割ることをくり返し、余りを下から読む ---- */
FIGS.haseisu_hashigo=host=>mk(host,{alt:'N を n で割ることをくり返し、余りを下から読んで n 進法に直す図',
  sliders:[{k:'N',label:'10 進法の数 N',min:2,max:100,step:1,v:45},{k:'n',label:'n（何進法か）',min:2,max:8,step:1,v:2},{k:'s',label:'手順',min:1,max:7,step:1,v:1}],play:{k:'s',from:1,to:7,label:'順に割っていく',ms:6300},
  draw(v){const N=v.N,b=v.n,rows=[];let t=N;while(t>0){rows.push([t,Math.floor(t/b),t%b]);t=Math.floor(t/b);}
    const K=rows.length,s=Math.min(v.s,K),d=draw(),Y=i=>30+i*28,done=s===K;
    for(let i=0;i<s;i++){const [x,q,r]=rows[i],y=Y(i);
      tx(d,96,y,String(b),'var(--muted)',13,'end');d.path(`M104,${y-14} Q110,${y-4} 104,${y+7} L172,${y+7}`,SUB);
      tx(d,162,y,String(x),'var(--ink)',13,'end');tx(d,196,y,'…','var(--muted)',12);tx(d,222,y,String(r),'var(--gold)',14);}
    tx(d,162,Y(s),String(rows[s-1][1]),done?'var(--muted)':'var(--ink)',13,'end');
    if(done){const y1=Y(K-1)+2,y0=Y(0)-12;d.line(252,y1,252,y0,'stroke="var(--gold)" stroke-width="1.8"').path(`M247,${y0+7} L252,${y0} L257,${y0+7}`,'stroke="var(--gold)" stroke-width="1.8" fill="none"');
      tx(d,262,(y0+y1)/2+4,'下から読む','var(--gold)',11,'start');}
    const [x,q,r]=rows[s-1],digits=rows.map(z=>z[2]).reverse().join('');
    return {svg:d.out(),read:`<b>手順 ${s}</b>　${x} ÷ ${b} = ${q} 余り ${r}<br>`+(done?`商が 0 になったので終わり<br>余りを下から読む：<b>${digits}</b><br>${N} を ${b} 進法で表すと ${digits}`:`次は、商 ${q} を ${b} で割る`)};}});
})();
