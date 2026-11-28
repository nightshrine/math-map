/* 中学1年「正負の数」の図（FIGS.m1seifu_*） */
(function(){
const {draw,n,mk}=FIG;
const f=v=>v.toFixed(1);
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
const STEP=(k=4)=>({sliders:[{k:'s',label:'手順',min:1,max:k,step:1,v:1}],play:{k:'s',from:1,to:k,label:'順に見る',ms:1100*k}});
// 符号つきの表示：+3、−3、0
const sn=v=>(v>0?'+':'')+n(v);
const cl=(x,a=30,b=310)=>Math.max(a,Math.min(b,x));
// 式の中の数：負の数だけかっこを付ける
const pn=v=>v<0?`(${n(v)})`:n(v);
// 符号をつけてかっこに入れる：(+3)、(−3)、0
const ps=v=>v===0?'0':`(${sn(v)})`;
const SUP=['','','²','³','⁴','⁵','⁶','⁷'];
// 数直線：lo〜hi の整数に目盛り。返り値は、数 → px
const NL=(d,lo,hi,y,x0=24,x1=316)=>{const X=v=>x0+(v-lo)/(hi-lo)*(x1-x0),every=hi-lo>14?2:1;
  d.line(x0-9,y,x1+9,y,'stroke="var(--muted)" stroke-width="1.4"');
  for(let i=lo;i<=hi;i++){d.line(X(i),y-(i===0?7:4),X(i),y+(i===0?7:4),'stroke="var(--muted)" stroke-width="1.2"');if(i%every===0)tx(d,X(i),y+20,n(i),i===0?'var(--ink)':'var(--muted)',10);}
  return X;};
// 数直線に平行な矢印
const AR=(d,x1,x2,y,col,w=3)=>{if(Math.abs(x2-x1)<1){d.dot(x1,y,col,3);return d;}const s=x2>x1?1:-1;
  d.line(x1,y,x2-s*7,y,`stroke="${col}" stroke-width="${w}" stroke-linecap="round"`);return d.poly([[x2,y],[x2-s*10,y-5],[x2-s*10,y+5]],`fill="${col}" stroke="none"`);};

/* ---- 数直線と正の数・負の数 ---- */
FIGS.m1seifu_suchokusen=host=>mk(host,{alt:'数直線の上で点を動かし、正の数と負の数の位置を読む図',h:190,
  sliders:[{k:'a',label:'点の位置',min:-6,max:6,step:.5,v:-3}],play:{k:'a',from:6,to:-6,label:'0 をこえて左へ動かす',ms:3600},
  draw(v){const d=draw(),y=118,X=NL(d,-6,6,y),a=v.a,col=a>0?'var(--ok)':a<0?'var(--ng)':'var(--gold)';
    tx(d,X(3.2),32,'正の方向 →','var(--ok)',11);tx(d,X(-3.2),32,'← 負の方向','var(--ng)',11);tx(d,X(0),y+38,'原点','var(--muted)',10);
    AR(d,X(0),X(a),y-20,col);d.dot(X(a),y,col,5.5);tx(d,X(a),y-34,sn(a),col,14);
    return {svg:d.out(),read:a>0?`${sn(a)}：0 より ${n(a)} 大きい数<br><b>正の数</b>（+ を省いて ${n(a)} とも書く）`:a<0?`${n(a)}：0 より ${n(-a)} 小さい数<br><b>負の数</b>`:'0：正の数でも負の数でもない<br>数直線では<b>原点</b>に対応する'};}});

/* ---- 基準との差（arg='ryo'：量を表す、'heikin'：平均を求める） ---- */
const HT=[152,147,160,155,146];
FIGS.m1seifu_kijun=(host,arg)=>{const hk=arg==='heikin';
  mk(host,{alt:'5 人の身長を、基準の高さとの差で表す図',
  sliders:[{k:'b',label:'基準（cm）',min:140,max:160,step:1,v:150}],play:hk?{k:'b',from:140,to:160,label:'基準を変えていく',ms:4000}:undefined,
  draw(v){const d=draw(),b=v.b,Y=h=>214-(h-138)*7.2,df=HT.map(h=>h-b),sum=df.reduce((s,x)=>s+x,0);
    HT.forEach((h,i)=>{const x=44+i*50,c=df[i]>0?'var(--ok)':'var(--ng)';
      if(df[i])d.poly([[x-15,Y(b)],[x+15,Y(b)],[x+15,Y(h)],[x-15,Y(h)]],`fill="${c}" fill-opacity=".34" stroke="${c}" stroke-width="1.4"`);
      tx(d,x,df[i]>0?Y(h)-6:df[i]<0?Y(h)+15:Y(b)-6,sn(df[i]),df[i]?c:'var(--gold)',12);tx(d,x,238,'ABCDE'[i],'var(--muted)',11);});
    if(hk){d.line(16,Y(152),324,Y(152),'stroke="var(--gold)" stroke-width="1.4" stroke-dasharray="5 4"');tx(d,322,Y(152)+(b<152?-5:13),'平均 152','var(--gold)',10,'end');}
    d.line(16,Y(b),324,Y(b),'stroke="var(--ink)" stroke-width="1.6"');tx(d,322,Y(b)+(hk&&b<152?13:-5),'基準 '+b,'var(--ink)',10,'end');
    const list=df.map(sn).join('、');
    return {svg:d.out(),read:hk?`基準 ${b} cm との差：${list}<br>差の合計 = ${sn(sum)}<br>差の平均 = ${pn(sum)} ÷ 5 = ${sn(sum/5)}<br>平均 = ${b} ${sum<0?'−':'+'} ${n(Math.abs(sum/5))} = <b>152 cm</b>`
      :`身長：152、147、160、155、146（cm）<br>基準 ${b} cm より高いことを +、低いことを − で表す<br>A〜E の順に <b>${list}</b>`};}});};
FIGS.m1seifu_kijun.sim=b=>HT.map(h=>h-b);

/* ---- 絶対値と数の大小 ---- */
FIGS.m1seifu_zettaichi=host=>mk(host,{alt:'数直線上の 2 つの数について、原点からの距離（絶対値）と大小を示す図',h:200,
  sliders:[{k:'a',label:'a',min:-6,max:6,step:.5,v:-4},{k:'b',label:'b',min:-6,max:6,step:.5,v:2.5}],
  draw(v){const d=draw(),y=124,X=NL(d,-6,6,y),a=v.a,b=v.b,br=(val,yy,col,nm)=>{
      if(val!==0){d.line(X(0),yy,X(val),yy,`stroke="${col}" stroke-width="2.4"`);d.line(X(0),yy-5,X(0),yy+5,`stroke="${col}" stroke-width="1.6"`);d.line(X(val),yy-5,X(val),yy+5,`stroke="${col}" stroke-width="1.6"`);
        tx(d,X(val/2),yy-7,n(Math.abs(val)),col,11);}
      d.dot(X(val),y,col,5);};
    br(a,y-22,'var(--c)');br(b,y-50,'var(--gold)');
    tx(d,X(a),y+40,'a','var(--c)',13);tx(d,X(b),y+(Math.abs(a-b)<.8?58:40),'b','var(--gold)',13);
    const cmp=a<b?'a &lt; b':a>b?'a &gt; b':'a = b';
    return {svg:d.out(),read:`<i>a = ${n(a)}</i> の絶対値は ${n(Math.abs(a))}<br><b>b = ${n(b)}</b> の絶対値は ${n(Math.abs(b))}<br>数直線で右にある数の方が大きい：<b>${cmp}</b>`+
      (a<0&&b<0&&a!==b?'<br>負の数どうしでは、絶対値が大きい方が小さい':a!==b&&Math.abs(a)===Math.abs(b)?'<br>符号だけがちがう 2 数は、絶対値が等しい':'')};}});

/* ---- 加法：数直線上の移動を続ける ---- */
FIGS.m1seifu_kaho=host=>mk(host,{alt:'2 つの数の加法を、数直線上の 2 回の移動で表す図',h:210,
  sliders:[{k:'a',label:'たされる数 a',min:-6,max:6,step:1,v:-4},{k:'b',label:'たす数 b',min:-6,max:6,step:1,v:6}],
  draw(v){const d=draw(),y=138,X=NL(d,-12,12,y),a=v.a,b=v.b,s=a+b,A=Math.abs(a),B=Math.abs(b);
    AR(d,X(0),X(a),y-24,'var(--c)');tx(d,X(a/2),y-32,sn(a),'var(--c)',12);
    AR(d,X(a),X(s),y-62,'var(--gold)');tx(d,X(a+b/2),y-70,sn(b),'var(--gold)',12);
    d.line(X(a),y-62,X(a),y-24,'stroke="var(--muted)" stroke-width="1" stroke-dasharray="3 3"');
    d.dot(X(s),y,'var(--ink)',5.5);tx(d,cl(X(s)),y+42,'和 '+sn(s),'var(--ink)',12);
    let rule;
    if(a===0||b===0)rule='0 との和は、もう一方の数のまま';
    else if(a*b>0)rule=`同じ符号：絶対値の和 ${A} + ${B} = ${A+B} に、共通の符号 ${a>0?'+':'−'}`;
    else if(s===0)rule='絶対値が等しく、符号が異なる 2 数の和は 0';
    else rule=`異なる符号：絶対値の差 ${Math.max(A,B)} − ${Math.min(A,B)} = ${Math.abs(s)} に、<br>絶対値が大きい方の符号 ${s>0?'+':'−'}`;
    return {svg:d.out(),read:`${ps(a)} + ${ps(b)} = <b>${sn(s)}</b><br>正の数をたす → 右へ、負の数をたす → 左へ<br>${rule}`};}});

/* ---- 減法：□ + b = a となる □ と、a + (−b) ---- */
FIGS.m1seifu_genpo=host=>mk(host,{alt:'減法 a − b を、b をたして a になる数として数直線上で求め、a に −b をたした点と一致することを示す図',h:230,
  sliders:[{k:'a',label:'ひかれる数 a',min:-6,max:6,step:1,v:2},{k:'b',label:'ひく数 b',min:-6,max:6,step:1,v:5}],
  draw(v){const d=draw(),y=158,X=NL(d,-12,12,y),a=v.a,b=v.b,r=a-b;
    AR(d,X(r),X(a),y-78,'var(--gold)');tx(d,X(r+b/2),y-86,'+ '+ps(b),'var(--gold)',11);tx(d,X(r),y-98-(Math.abs(b)<3?12:0),'□','var(--gold)',13);
    AR(d,X(a),X(r),y-30,'var(--c)');tx(d,X(a-b/2),y-38,'+ '+ps(-b),'var(--c)',11);
    d.line(X(r),y-78,X(r),y,'stroke="var(--muted)" stroke-width="1" stroke-dasharray="3 3"');d.line(X(a),y-78,X(a),y,'stroke="var(--muted)" stroke-width="1" stroke-dasharray="3 3"');
    d.dot(X(a),y,'var(--ink)',4.5);d.dot(X(r),y,'var(--gold)',5.5);
    tx(d,X(a),y+40,'a = '+sn(a),'var(--ink)',11);tx(d,cl(X(r),38,302),y+58,'答え '+sn(r),'var(--gold)',12);
    return {svg:d.out(),read:`${ps(a)} − ${ps(b)} は、□ + ${ps(b)} = ${sn(a)} となる □<br>上の矢印（${sn(b)}）の出発点：□ = <b>${sn(r)}</b><br><i>下の矢印：${ps(a)} + ${ps(-b)} = ${sn(r)}</i><br>ひくことは、符号を変えた数をたすことと同じ`};}});

/* ---- 乗法：速さ × 時間 = 位置 ---- */
FIGS.m1seifu_joho=host=>mk(host,{alt:'東向きを正として、速さと時間の積で位置が決まることを数直線上に示す図',h:210,
  sliders:[{k:'v',label:'速さ（東向きが +。毎時 km）',min:-4,max:4,step:1,v:-3},{k:'t',label:'時間（今より後が +。時間）',min:-3,max:3,step:1,v:-2}],
  draw(q){const d=draw(),y=132,X=NL(d,-12,12,y),v=q.v,t=q.t,p=v*t;
    tx(d,30,28,'西','var(--muted)',11);tx(d,310,28,'東','var(--muted)',11);
    tx(d,170,28,v===0?'止まっている':`${v>0?'東':'西'}へ毎時 ${Math.abs(v)} km`,'var(--c)',11);
    if(v!==0){const s=v>0?1:-1;AR(d,170-s*26,170+s*26,44,'var(--c)',2.4);}
    if(p!==0){if(t>0)AR(d,X(0),X(p),y-26,'var(--gold)');else AR(d,X(p),X(0),y-26,'var(--gold)');tx(d,X(p/2),y-35,`${Math.abs(t)} 時間`,'var(--gold)',11);}
    d.poly([[X(0),y-8],[X(0)-6,y-19],[X(0)+6,y-19]],'fill="var(--ink)" stroke="none"');tx(d,X(0),y+40,'今','var(--ink)',11);
    d.dot(X(p),y,'var(--gold)',5.5);if(t!==0)tx(d,cl(X(p)),y+(p===0?58:40),`${Math.abs(t)} 時間${t>0?'後':'前'}`,'var(--gold)',11);
    const where=p===0?'今と同じ地点':`${p>0?'東':'西'}へ ${Math.abs(p)} km の地点`;
    return {svg:d.out(),read:`${ps(v)} × ${ps(t)} = <b>${sn(p)}</b><br>`+(t===0?'今の位置は 0':v===0?'動かないので、いつも 0 の地点':`${Math.abs(t)} 時間${t>0?'後':'前'}の位置は、${where}`)+
      (p>0?'<br>同じ符号の 2 数の積は、正の数':p<0?'<br>異なる符号の 2 数の積は、負の数':'<br>0 との積は 0')};}});

/* ---- なぜ：かけ算の表の規則 ---- */
FIGS.m1seifu_hyo=host=>mk(host,{alt:'かけられる数を固定し、かける数を 3 から −3 まで 1 ずつ小さくしたときの積の並びの図',
  sliders:[{k:'m',label:'かけられる数',min:-4,max:4,step:1,v:3},{k:'r',label:'かける数をここまで小さくする',min:1,max:7,step:1,v:4,fmt:r=>n(4-r)}],play:{k:'r',from:1,to:7,label:'かける数を 1 ずつ小さくする',ms:4200},
  draw(v){const d=draw(),m=v.m,ax=236,u=5.4;
    d.line(ax,16,ax,234,'stroke="var(--muted)" stroke-width="1.2"');tx(d,ax,12,'0','var(--muted)',10);
    for(let i=0;i<v.r;i++){const k=3-i,p=m*k,y=38+i*30,c=p>0?'var(--ok)':'var(--ng)',last=i===v.r-1;
      tx(d,20,y+4,`${pn(m)} × ${pn(k)} = ${n(p)}`,last?'var(--gold)':'var(--ink)',12,'start');
      if(p)d.poly([[ax,y-7],[ax+p*u,y-7],[ax+p*u,y+7],[ax,y+7]],`fill="${c}" fill-opacity="${last?.6:.32}" stroke="${c}" stroke-width="1.2"`);else d.dot(ax,y,'var(--gold)',3.5);
      if(i&&m)tx(d,150,y-11,(m>0?'−':'+')+Math.abs(m),'var(--muted)',10);}
    const k=4-v.r,p=m*k;
    return {svg:d.out(),read:`かけられる数 ${n(m)} は変えない<br>かける数を 1 小さくすると、積は<br>`+(m===0?'<b>いつも 0</b>':`<b>${Math.abs(m)} ずつ${m>0?'小さく':'大きく'}なる</b>`)+`<br>${pn(m)} × ${pn(k)} = <b>${n(p)}</b>`+(m<0&&k<0?'<br>負の数 × 負の数 = 正の数':m>0&&k<0?'<br>正の数 × 負の数 = 負の数':'')};}});
FIGS.m1seifu_hyo.sim=(m,r)=>Array.from({length:r},(_,i)=>m*(3-i));

/* ---- 累乗：指数は何にかかっているか ---- */
FIGS.m1seifu_ruijo=host=>mk(host,{alt:'同じ数をいくつかかけ合わせたときの積と符号の変わり方を示す図',h:220,
  sliders:[{k:'a',label:'かける数 a',min:-4,max:4,step:1,v:-3},{k:'e',label:'指数（かける個数）',min:1,max:5,step:1,v:2}],play:{k:'e',from:1,to:5,label:'かける個数を増やす',ms:3600},
  draw(v){const d=draw(),a=v.a,e=v.e,w=42,g=18,x0=170-(e*w+(e-1)*g)/2;let p=1;
    tx(d,170,30,`${pn(a)}${SUP[e]} は、${n(a)} を ${e} 個かけたもの`,'var(--ink)',12);
    for(let i=0;i<e;i++){const x=x0+i*(w+g);p*=a;const c=p>0?'var(--ok)':p<0?'var(--ng)':'var(--gold)';
      d.poly([[x,52],[x+w,52],[x+w,88],[x,88]],'fill="var(--c)" fill-opacity=".2" stroke="var(--c)" stroke-width="1.4"');tx(d,x+w/2,75,pn(a),'var(--ink)',13);
      if(i)tx(d,x-g/2,75,'×','var(--muted)',12);
      d.line(x+w/2,92,x+w/2,108,'stroke="var(--muted)" stroke-width="1"');tx(d,x+w/2,124,n(p),c,13);}
    tx(d,170,144,'↑ ここまでの積','var(--muted)',10);
    tx(d,170,176,`${pn(a)}${SUP[e]} = ${n(p)}`,'var(--gold)',15);
    if(a<0&&e>1)tx(d,170,202,`かっこなし：−${-a}${SUP[e]} = −(${-a}${SUP[e]}) = ${n(-Math.pow(-a,e))}`,'var(--muted)',11);
    return {svg:d.out(),read:`${pn(a)}${SUP[e]} = <b>${n(p)}</b>`+(a<0?`<br>負の数を ${e} 個（${e%2?'奇数':'偶数'}個）かけるので、符号は ${e%2?'−':'+'}`+(e>1?`<br>−${-a}${SUP[e]} は、${-a}${SUP[e]} に − をつけた数で ${n(-Math.pow(-a,e))}`:''):a===0?'<br>0 は何個かけても 0':'<br>正の数は何個かけても正')};}});

/* ---- 分配法則：長方形の面積 ---- */
FIGS.m1seifu_bunpai=host=>mk(host,{alt:'横に 2 つ並べた長方形の面積で、分配法則を示す図',h:210,
  sliders:[{k:'a',label:'a（縦）',min:1,max:5,step:1,v:3},{k:'b',label:'b（左の横）',min:1,max:6,step:1,v:4},{k:'c',label:'c（右の横）',min:1,max:6,step:1,v:2}],
  draw(v){const d=draw(),{a,b,c}=v,u=22,x0=170-(b+c)*u/2,y0=42,R=(x,w,col)=>d.poly([[x,y0],[x+w,y0],[x+w,y0+a*u],[x,y0+a*u]],`fill="var(--${col})" fill-opacity=".3" stroke="var(--${col})" stroke-width="1.5"`);
    R(x0,b*u,'c');R(x0+b*u,c*u,'gold');
    for(let i=1;i<b+c;i++)d.line(x0+i*u,y0,x0+i*u,y0+a*u,'stroke="var(--line)" stroke-width=".8"');for(let j=1;j<a;j++)d.line(x0,y0+j*u,x0+(b+c)*u,y0+j*u,'stroke="var(--line)" stroke-width=".8"');
    tx(d,x0-12,y0+a*u/2+4,String(a),'var(--ink)',12);tx(d,x0+b*u/2,y0-8,String(b),'var(--c)',12);tx(d,x0+b*u+c*u/2,y0-8,String(c),'var(--gold)',12);
    if(b>=2)tx(d,x0+b*u/2,y0+a*u/2+4,String(a*b),'var(--ink)',12);if(c>=2)tx(d,x0+b*u+c*u/2,y0+a*u/2+4,String(a*c),'var(--ink)',12);
    tx(d,170,y0+a*u+22,`全体の横は ${b} + ${c} = ${b+c}`,'var(--muted)',11);
    return {svg:d.out(),read:`全体で数える：${a} × (${b} + ${c}) = ${a} × ${b+c} = <b>${a*(b+c)}</b><br>分けて数える：${a} × ${b} + ${a} × ${c} = ${a*b} + ${a*c} = <b>${a*(b+c)}</b><br>a × (b + c) = a × b + a × c`};}});

/* ---- エラトステネスのふるい（50 まで） ---- */
const PR=[2,3,5,7],gone=k=>{if(k===1)return 1;for(let i=0;i<4;i++)if(k%PR[i]===0&&k!==PR[i])return i+2;return 0;};
FIGS.m1seifu_furui=host=>mk(host,Object.assign(STEP(5),{alt:'1 から 50 までの数から、素数の倍数を順に消していく図',
  draw(v){const d=draw(),s=v.s;let left=0;
    for(let k=1;k<=50;k++){const x=35+((k-1)%10)*30,y=42+Math.floor((k-1)/10)*42,g=gone(k),out=g&&g<=s,now=g===s,used=PR.indexOf(k)>=0&&PR.indexOf(k)+2<=s;
      if(!out)left++;
      if(used||(s===5&&!out))d.circle(x,y-4,12,'stroke="var(--gold)" stroke-width="1.6" fill="var(--gold)" fill-opacity=".14"');
      d.raw(`<text x="${x}" y="${y}" font-size="12" font-family="var(--f-mono)" text-anchor="middle" fill="${out?(now?'var(--ng)':'var(--muted)'):used||s===5?'var(--gold)':'var(--ink)'}" opacity="${out&&!now?.38:1}">${k}</text>`);
      if(out)d.line(x-9,y+3,x+9,y-11,`stroke="${now?'var(--ng)':'var(--muted)'}" stroke-width="1.2" opacity="${now?1:.45}"`);}
    return {svg:d.out(),read:['<b>手順 1</b>　1 は素数ではないので消す',...PR.map((p,i)=>`<b>手順 ${i+2}</b>　${p} を残して、${p} の倍数を消す`)][s-1]+`<br>残っている数は ${left} 個`+(s===5?'<br>7 × 7 = 49 まで調べたので、<br>残った <b>15 個</b>はすべて素数':'')};}}));
FIGS.m1seifu_furui.sim=s=>{const a=[];for(let k=1;k<=50;k++){const g=gone(k);if(!(g&&g<=s))a.push(k);}return a;};

/* ---- 素因数分解：素数で順にわっていく ---- */
const fac=N=>{const a=[];let m=N;for(let p=2;p*p<=m;p++)while(m%p===0){a.push(p);m/=p;}if(m>1)a.push(m);return a;};
const facStr=a=>{const c={};a.forEach(p=>c[p]=(c[p]||0)+1);return Object.keys(c).map(p=>p+(c[p]>1?SUP[c[p]]:'')).join(' × ');};
FIGS.m1seifu_soinsu=host=>mk(host,{alt:'自然数を小さい素数から順にわっていき、素因数分解する図',
  sliders:[{k:'N',label:'分解する数',min:2,max:120,step:1,v:60}],
  draw(v){const d=draw(),N=v.N,a=fac(N);let m=N;
    if(a.length===1){tx(d,170,118,String(N),'var(--gold)',22);tx(d,170,148,'素数','var(--gold)',12);}
    else a.forEach((p,i)=>{const y=40+i*31;
      if(i<a.length-1){tx(d,118,y+4,String(p),'var(--gold)',14,'end');d.path(`M130,${y-14} L130,${y+10} L212,${y+10}`,'stroke="var(--ink)" stroke-width="1.6" fill="none"');tx(d,170,y+4,String(m),'var(--ink)',14);m/=p;}
      else tx(d,170,y+4,String(m),'var(--gold)',14);});
    if(a.length>1)tx(d,268,40+(a.length-1)*31+4,'← 素数になったら終わり','var(--muted)',9);
    return {svg:d.out(),read:a.length===1?`${N} は<b>素数</b><br>1 と ${N} のほかに約数がない`:`${N} = ${a.join(' × ')}`+(facStr(a)!==a.join(' × ')?`<br>= <b>${facStr(a)}</b>`:'')+'<br>左に並んだ数と最後の数が、素因数'};}});
FIGS.m1seifu_soinsu.sim=N=>facStr(fac(N));
})();
