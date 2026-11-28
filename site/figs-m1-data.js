/* 中学1年「データの分布」の図（FIGS.m1data_*）。データはすべて架空。乱数は種を固定した擬似乱数（mulberry32）なので、同じ操作で同じ結果になる */
(function(){
const {draw,n,mk}=FIG;
const f=v=>v.toFixed(1);
// 文字（線に重なっても読めるよう、地の色でふちどる）
const tx=(d,x,y,t,c='var(--ink)',s=11,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
const rect=(d,x,y,w,h,st)=>d.raw(`<rect x="${f(x)}" y="${f(y)}" width="${f(Math.max(0,w))}" height="${f(Math.max(0,h))}" ${st}/>`);
const FILL=(col,o=.35)=>`fill="var(--${col})" fill-opacity="${o}" stroke="var(--${col})" stroke-width="1.3"`;
const AX='stroke="var(--muted)" stroke-width="1.2"';
const GR='stroke="var(--line)" stroke-width=".8"';
const BD='stroke="var(--muted)" stroke-width="1" stroke-dasharray="3 3"';
const tri=(d,x,y,col)=>d.poly([[x,y],[x-6,y+10],[x+6,y+10]],`fill="${col}" stroke="none"`);
// 擬似乱数（mulberry32）。種 seed が同じなら、同じ数の列を返す
function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
const sum=a=>a.reduce((s,x)=>s+x,0);
// 度数：start から幅 w の階級を k 個とって数える
const cnt=(a,start,w,k)=>{const fr=Array(k).fill(0);a.forEach(x=>fr[Math.floor((x-start)/w)]++);return fr;};
const cums=fr=>{let s=0;return fr.map(c=>s+=c);};

/* ---- 30 人のハンドボール投げの記録（m）。架空のデータ ---- */
const HB=[11,13,15,16,17,17,18,19,19,20,22,23,24,25,26,26,27,28,28,29,29,30,31,31,32,33,34,36,38,39];
const WS=[2,5,10];
// 同じ値の点を上に積むための段の番号
const lev0=HB.map((x,i)=>HB.slice(0,i).filter(y=>y===x).length);

/* ---- データの点から、度数分布表を作る（階級の幅 5 m） ---- */
FIGS.m1data_dosu=host=>mk(host,{alt:'30 人の記録を数直線上の点で表し、階級ごとに点を数えて度数分布表にまとめる図',h:204,
  sliders:[{k:'j',label:'注目する階級',min:1,max:6,step:1,v:2,fmt:j=>`${5+5*j} m 以上 ${10+5*j} m 未満`}],play:{k:'j',from:1,to:6,label:'順に数える',ms:4200},
  draw(v){const d=draw(),j=v.j-1,X=x=>54+(x-10)*9,fr=cnt(HB,10,5,6),cu=cums(fr),y0=118,rh=24;
    rect(d,X(10+5*j),30,45,y0+3*rh-30,'fill="var(--gold)" fill-opacity=".1" stroke="none"');
    for(let b=10;b<=40;b+=5)d.line(X(b),30,X(b),y0+3*rh,'stroke="var(--line)" stroke-width="1"');
    tx(d,14,22,'30 人の記録（m）','var(--muted)',10,'start');
    d.line(X(10)-4,92,X(40)+4,92,AX);
    HB.forEach((x,i)=>{const on=Math.floor((x-10)/5)===j;d.circle(X(x),86-lev0[i]*8,3.6,on?'fill="var(--gold)" stroke="var(--bg2)" stroke-width="1"':'fill="var(--c)" fill-opacity=".85" stroke="var(--bg2)" stroke-width="1"');});
    for(let b=10;b<=40;b+=10)tx(d,X(b),106,String(b),'var(--muted)',10);
    // 表：階級・度数・累積度数
    for(let r=0;r<=3;r++)d.line(14,y0+r*rh,X(40),y0+r*rh,'stroke="var(--line)" stroke-width="1"');
    d.line(14,y0,14,y0+3*rh,'stroke="var(--line)" stroke-width="1"');
    for(let c=0;c<=j;c++)rect(d,X(10+5*c),y0+rh,45,rh,`fill="var(--c)" fill-opacity="${c===j?.32:.14}" stroke="none"`);
    rect(d,X(10+5*j),y0+2*rh,45,rh,'fill="var(--gold)" fill-opacity=".3" stroke="none"');
    ['階級','度数','累積度数'].forEach((h,r)=>tx(d,34,y0+r*rh+16,h,'var(--muted)',r===2?9:10));
    for(let c=0;c<6;c++){const xm=X(12.5+5*c),on=c===j;
      tx(d,xm,y0+16,`${10+5*c}〜${15+5*c}`,on?'var(--gold)':'var(--ink)',10);
      tx(d,xm,y0+rh+16,String(fr[c]),on?'var(--gold)':'var(--ink)',11);
      tx(d,xm,y0+2*rh+16,String(cu[c]),on?'var(--gold)':'var(--muted)',11);}
    return {svg:d.out(),read:`${10+5*j} m 以上 ${15+5*j} m 未満の階級<br>度数：この階級に入る点を数えて <b>${fr[j]} 人</b><br>累積度数：${fr.slice(0,j+1).join(' + ')} = <b>${cu[j]} 人</b><br>（${15+5*j} m 未満の人数）`};}});
FIGS.m1data_dosu.sim=()=>{const fr=cnt(HB,10,5,6);return {fr,cu:cums(fr)};};

/* ---- ヒストグラムと度数分布多角形：階級の幅を変える。arg='saihin' なら最頻値を示す ---- */
const KATACHI=['でこぼこが多く、全体の形がつかみにくい','15〜20 m と 25〜30 m の 2 か所に山がある','20〜30 m を頂上とする 1 つの山に見える'];
const histFr=i=>{const w=WS[i];return cnt(HB,10,w,30/w);};
FIGS.m1data_hist=(host,arg)=>{const sai=arg==='saihin';mk(host,{alt:sai?'30 人の記録のヒストグラムで、度数が最も多い階級と最頻値を示す図。階級の幅を変えられる':'30 人の記録を、データの点・ヒストグラム・度数分布多角形で表す図。階級の幅を変えると形が変わる',h:276,
  sliders:[{k:'i',label:'階級の幅',min:0,max:2,step:1,v:1,fmt:i=>WS[i]+' m'}].concat(sai?[]:[{k:'p',label:'度数分布多角形',min:0,max:1,step:1,v:0,fmt:p=>['かかない','かく'][p]}]),
  draw(v){const d=draw(),w=WS[v.i],k=30/w,fr=histFr(v.i),X=x=>48+(x-4)*276/42,Y=c=>228-c*10,mx=Math.max(...fr),jm=fr.indexOf(mx),poly=!sai&&v.p===1;
    [5,10].forEach(c=>d.line(48,Y(c),324,Y(c),GR));
    for(let j=0;j<=k;j++)d.line(X(10+j*w),28,X(10+j*w),228,BD);
    // データの点
    tx(d,14,48,'データ','var(--muted)',9,'start');
    d.line(X(9),54,X(41),54,'stroke="var(--line)" stroke-width="1"');
    HB.forEach((x,i)=>d.circle(X(x),49-lev0[i]*7,3,'fill="var(--c)" fill-opacity=".9" stroke="var(--bg2)" stroke-width=".8"'));
    // ヒストグラム
    fr.forEach((c,j)=>{if(!c)return;const g=sai&&j===jm;rect(d,X(10+j*w),Y(c),w*276/42,c*10,FILL(g?'gold':'c',g?.45:poly?.2:.36));});
    if(poly){const pts=[[10-w/2,0]].concat(fr.map((c,j)=>[10+j*w+w/2,c]),[[40+w/2,0]]);
      d.path('M'+pts.map(p=>f(X(p[0]))+','+f(Y(p[1]))).join(' L'),'stroke="var(--gold)" stroke-width="2" fill="none" stroke-linejoin="round"');
      pts.forEach(p=>d.circle(X(p[0]),Y(p[1]),2.8,'fill="var(--gold)" stroke="var(--bg2)" stroke-width="1"'));}
    d.line(48,228,324,228,AX).line(48,228,48,96,AX);
    [0,5,10].forEach(c=>tx(d,42,Y(c)+4,String(c),'var(--muted)',10,'end'));tx(d,52,92,'（人）','var(--muted)',9,'start');
    for(let b=10;b<=40;b+=10)tx(d,X(b),242,String(b),'var(--muted)',10);tx(d,326,242,'（m）','var(--muted)',9,'end');
    tx(d,14,264,'度数','var(--muted)',9,'start');
    fr.forEach((c,j)=>tx(d,X(10+j*w+w/2),264,String(c),sai&&j===jm?'var(--gold)':'var(--ink)',w===2?9:10));
    const cv=10+jm*w+w/2;
    return {svg:d.out(),read:sai?`階級の幅 ${w} m<br>度数が最も多い階級：${10+jm*w} m 以上 ${10+(jm+1)*w} m 未満（${mx} 人）<br>最頻値（その階級の階級値）= <b>${n(cv)} m</b>`:
      `階級の幅 ${w} m、階級の数 ${k}<br>度数の合計 ${sum(fr)} 人<br>${KATACHI[v.i]}`+(poly?'<br>金色の折れ線が度数分布多角形':'')};}});};
FIGS.m1data_hist.sim=i=>{const fr=histFr(i),w=WS[i],jm=fr.indexOf(Math.max(...fr));return {fr,mode:10+jm*w+w/2};};

/* ---- 代表値：値を 1 つ動かす。9 人が 1 か月に読んだ本の冊数（架空） ---- */
const BK=[1,2,3,3,3,4,5,6];
const daihyo=x=>{const a=BK.concat([x]),s=[...a].sort((p,q)=>p-q),c={};a.forEach(t=>c[t]=(c[t]||0)+1);const mc=Math.max(...Object.values(c));
  return {mean:sum(a)/9,med:s[4],mode:Object.keys(c).filter(t=>c[t]===mc).map(Number).sort((p,q)=>p-q),below:a.filter(t=>t<sum(a)/9).length,tot:sum(a)};};
FIGS.m1data_daihyo=host=>mk(host,{alt:'9 個のデータのうち 1 つの値を動かしたときの、平均値・中央値・最頻値の位置を示す図',h:236,
  sliders:[{k:'x',label:'動かす値（冊）',min:0,max:30,step:1,v:7}],play:{k:'x',from:7,to:30,label:'値を大きくしていく',ms:4000},
  draw(v){const d=draw(),X=t=>28+t*9.6,r=daihyo(v.x),c={};
    tx(d,14,22,'9 人が 1 か月に読んだ本の冊数','var(--muted)',10,'start');
    d.line(X(0)-6,124,X(30)+6,124,AX);
    for(let t=0;t<=30;t++)d.line(X(t),124,X(t),t%5?127:130,AX);
    for(let t=0;t<=30;t+=5)tx(d,X(t),143,String(t),'var(--muted)',10);
    BK.concat([v.x]).forEach((t,i)=>{const k=c[t]=(c[t]||0)+1,y=117-(k-1)*10;
      d.circle(X(t),y,i===8?5:4.2,i===8?'fill="var(--gold)" stroke="var(--bg2)" stroke-width="1.2"':'fill="var(--c)" fill-opacity=".85" stroke="var(--bg2)" stroke-width="1"');});
    const row=(val,y,label,col)=>{const px=X(val),right=px<210;d.line(px,128,px,y-2,`stroke="${col}" stroke-width="1" stroke-dasharray="2 3"`);tri(d,px,y,col);tx(d,px+(right?10:-10),y+10,label,col,11,right?'start':'end');};
    row(r.mean,156,'平均値 '+n(r.mean),'var(--c)');
    row(r.med,184,'中央値 '+n(r.med),'var(--ok)');
    r.mode.forEach((m,q)=>row(m,212,q?'':'最頻値 '+r.mode.join(', '),'var(--ink)'));
    return {svg:d.out(),read:`動かす値（金色の点）= <b>${v.x} 冊</b><br>平均値：${r.tot} ÷ 9 = <i>${n(r.mean)} 冊</i><br>中央値：小さい方から 5 番目 = ${r.med} 冊<br>最頻値：${r.mode.join(', ')} 冊<br>平均値より小さい値は 9 個のうち ${r.below} 個`};}});
FIGS.m1data_daihyo.sim=daihyo;

/* ---- 相対度数と累積相対度数：大きさのちがう 2 つの集団 ---- */
// 1 日の家庭学習の時間（分）。階級は 0〜20、20〜40、…、100〜120
const GA=[2,4,8,6,3,2],GB=[10,30,50,56,36,18];
const sotai=(m,g)=>{const N=sum(g);return m===1?g.slice():m===2?g.map(c=>c/N):cums(g).map(c=>c/N);};
const SM=['度数','相対度数','累積相対度数'];
FIGS.m1data_sotai=host=>mk(host,{alt:'人数のちがう A 中 25 人と B 中 200 人の家庭学習の時間を、度数・相対度数・累積相対度数の折れ線でくらべる図',
  sliders:[{k:'m',label:'表すもの',min:1,max:3,step:1,v:1,fmt:m=>SM[m-1]},{k:'j',label:'注目する階級',min:1,max:6,step:1,v:2,fmt:j=>`${20*j-20} 分以上 ${20*j} 分未満`}],
  draw(v){const d=draw(),m=v.m,j=v.j-1,X=t=>48+(t+20)/160*270,top=m===1?60:m===2?.4:1,Y=y=>214-y/top*170,
      ticks=m===1?[0,20,40,60]:m===2?[0,.1,.2,.3,.4]:[0,.2,.4,.6,.8,1],a=sotai(m,GA),b=sotai(m,GB);
    rect(d,X(20*j),40,X(20)-X(0),174,'fill="var(--gold)" fill-opacity=".1" stroke="none"');
    ticks.forEach(t=>{d.line(48,Y(t),324,Y(t),t?GR:AX);tx(d,42,Y(t)+4,n(t),'var(--muted)',10,'end');});
    d.line(48,40,48,214,AX);
    for(let t=0;t<=120;t+=20){d.line(X(t),214,X(t),218,AX);tx(d,X(t),230,String(t),'var(--muted)',10);}tx(d,326,230,'（分）','var(--muted)',9,'end');
    if(m===1)tx(d,52,36,'（人）','var(--muted)',9,'start');
    const line=(vals,col)=>{const pts=m===3?[[0,0]].concat(vals.map((y,q)=>[20*q+20,y])):[[-10,0]].concat(vals.map((y,q)=>[20*q+10,y]),[[130,0]]);
      d.path('M'+pts.map(p=>f(X(p[0]))+','+f(Y(p[1]))).join(' L'),`stroke="${col}" stroke-width="2" fill="none" stroke-linejoin="round"`);
      pts.forEach((p,q)=>{const hi=q===j+1;d.circle(X(p[0]),Y(p[1]),hi?5:3,`fill="${col}" stroke="var(--bg2)" stroke-width="1.2"`);});};
    line(a,'var(--c)');line(b,'var(--gold)');
    d.line(60,20,78,20,'stroke="var(--c)" stroke-width="2.4"');tx(d,84,24,'A 中（25 人）','var(--c)',10,'start');
    d.line(190,20,208,20,'stroke="var(--gold)" stroke-width="2.4"');tx(d,214,24,'B 中（200 人）','var(--gold)',10,'start');
    const lab=`${20*j} 分以上 ${20*j+20} 分未満の階級`,ca=cums(GA)[j],cb=cums(GB)[j];
    const rd=m===1?`${lab}<br><i>A 中：度数 ${GA[j]} 人</i><br><b>B 中：度数 ${GB[j]} 人</b><br>人数の合計がちがうので、度数のままではくらべにくい`:
      m===2?`${lab}<br><i>A 中：${GA[j]} ÷ 25 = ${n(a[j])}</i><br><b>B 中：${GB[j]} ÷ 200 = ${n(b[j])}</b><br>相対度数は、その階級の人が全体にしめる割合`:
      `${lab}までの累積相対度数<br><i>A 中：${ca} ÷ 25 = ${n(a[j])}</i><br><b>B 中：${cb} ÷ 200 = ${n(b[j])}</b><br>${20*j+20} 分未満の人が全体にしめる割合`;
    return {svg:d.out(),read:rd};}});
FIGS.m1data_sotai.sim=(m,g)=>sotai(m,g==='A'?GA:GB);

/* ---- テレビの買いかえ年数：50 人の度数分布表（架空） ---- */
const TV=[1,2,4,6,14,10,6,4,2,1];   // 階級は 0〜2、2〜4、…、18〜20（年）
const tvMean=sum(TV.map((c,j)=>c*(2*j+1)))/50;
FIGS.m1data_tv=host=>mk(host,{alt:'テレビを買いかえた 50 人が前のテレビを使った年数のヒストグラムで、境目より左と右の人数をくらべる図',h:246,
  sliders:[{k:'x',label:'境目（年）',min:0,max:20,step:2,v:10}],
  draw(v){const d=draw(),X=t=>46+t*13.8,Y=c=>210-c*10,x=v.x,lt=sum(TV.slice(0,x/2));
    [5,10].forEach(c=>d.line(46,Y(c),322,Y(c),GR));
    TV.forEach((c,j)=>rect(d,X(2*j),Y(c),27.6,c*10,2*j<x?FILL('c',.45):'fill="var(--muted)" fill-opacity=".18" stroke="var(--muted)" stroke-width="1"'));
    d.line(46,210,322,210,AX).line(46,210,46,60,AX);
    [0,5,10].forEach(c=>tx(d,40,Y(c)+4,String(c),'var(--muted)',10,'end'));tx(d,50,56,'（人）','var(--muted)',9,'start');
    for(let t=0;t<=20;t+=2)tx(d,X(t),224,String(t),'var(--muted)',10);tx(d,326,240,'（年）','var(--muted)',9,'end');
    d.line(X(tvMean),62,X(tvMean),210,'stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="4 3"');
    d.line(X(x),44,X(x),210,'stroke="var(--gold)" stroke-width="2.2"');tx(d,Math.min(308,Math.max(32,X(x))),39,x+' 年','var(--gold)',11);
    tx(d,X(tvMean)+5,72,'平均値 '+n(tvMean),'var(--ink)',10,'start');
    tx(d,14,18,'買いかえた 50 人が前のテレビを使った年数','var(--muted)',10,'start');
    return {svg:d.out(),read:`${x} 年未満：<i>${lt} 人</i>（累積相対度数 ${n(lt/50)}）<br>${x} 年以上：${50-lt} 人（${n((50-lt)/50)}）<br>階級値で求めた平均値は <b>${n(tvMean)} 年</b>`};}});
FIGS.m1data_tv.sim=x=>({lt:sum(TV.slice(0,x/2)),mean:tvMean});

/* ---- 階級値に集める：度数分布表から求める平均値 ---- */
const kai=i=>{const w=WS[i],k=30/w,fr=cnt(HB,10,w,k),seen=Array(k).fill(0);
  const pts=HB.map((x,q)=>{const c=Math.floor((x-10)/w);return {x,cv:10+c*w+w/2,l0:lev0[q],l1:seen[c]++};});
  return {w,k,fr,pts,tmean:sum(pts.map(p=>p.cv))/30};};
FIGS.m1data_kaikyuchi=host=>mk(host,{alt:'30 人の記録の点を、それぞれの階級の階級値の位置に集めて、平均値の変化を見る図',h:226,
  sliders:[{k:'i',label:'階級の幅',min:0,max:2,step:1,v:1,fmt:i=>WS[i]+' m'},{k:'t',label:'点を階級値に集める',min:0,max:1,step:.1,v:0,fmt:t=>Math.round(t*100)+'%'}],play:{k:'t',from:0,to:1,label:'階級値に集める',ms:2600},
  draw(v){const d=draw(),K=kai(v.i),t=v.t,X=x=>30+(x-8)*290/34,raw=sum(HB)/30;
    for(let j=0;j<=K.k;j++)d.line(X(10+j*K.w),36,X(10+j*K.w),168,BD);
    for(let j=0;j<K.k;j++){const c=10+j*K.w+K.w/2;d.line(X(c),168,X(c),174,'stroke="var(--gold)" stroke-width="2"');}
    d.line(X(8),168,X(42),168,AX);
    let ps=0;K.pts.forEach(p=>{const x=p.x+t*(p.cv-p.x),l=p.l0+t*(p.l1-p.l0);ps+=x;d.circle(X(x),162-l*7.2,3.3,'fill="var(--c)" fill-opacity=".85" stroke="var(--bg2)" stroke-width=".8"');});
    for(let b=10;b<=40;b+=5)tx(d,X(b),187,String(b),'var(--muted)',10);
    const cur=ps/30;tri(d,X(cur),196,'var(--gold)');tx(d,X(cur)+(X(cur)<200?10:-10),206,'点の平均値 '+n(cur),'var(--gold)',11,X(cur)<200?'start':'end');
    tx(d,14,22,t===0?'もとの記録':t===1?'すべての点を階級値に集めた':'階級値へ動かしている途中','var(--muted)',10,'start');
    return {svg:d.out(),read:`もとのデータの平均値：756 ÷ 30 = <i>${n(raw)} m</i><br>階級値で求めた平均値：${n(K.tmean*30)} ÷ 30 = <b>${n(K.tmean)} m</b><br>いまの点の平均値：${n(cur)} m<br>階級値の印（金色）は、各階級の真ん中`};}});
FIGS.m1data_kaikyuchi.sim=i=>{const K=kai(i);return {tmean:K.tmean,fr:K.fr,raw:sum(HB)/30};};

/* ---- 将棋の駒を投げる：投げた回数ごとの相対度数（コンピュータで作った架空の記録） ---- */
const KN=[10,20,50,100,200,500,1000,2000],KP=[.38,.5];   // 表になる確率 .38、裏 .5、横 .12 と決めて作った
const KOMA=(()=>{const g=rng(2718),a=[[0,0,0]];let c=[0,0,0];for(let i=1;i<=2000;i++){const u=g(),o=u<KP[0]?0:u<KP[0]+KP[1]?1:2;c=c.slice();c[o]++;a.push(c);}return a;})();
const KC=['c','gold','ok'],KL=['表','裏','横'];
FIGS.m1data_koma=host=>mk(host,{alt:'将棋の駒を投げた回数ごとに、表・裏・横になった相対度数を帯の長さで表す図',h:262,
  sliders:[{k:'r',label:'投げた回数',min:1,max:8,step:1,v:3,fmt:r=>KN[r-1]+' 回'}],play:{k:'r',from:1,to:8,label:'回数を増やす',ms:4200},
  draw(v){const d=draw(),x0=70,W=250;
    KL.forEach((l,q)=>{rect(d,x0+q*70,14,12,12,FILL(KC[q],.6));tx(d,x0+q*70+18,24,l,`var(--${KC[q]})`,11,'start');});
    tx(d,326,24,'相対度数','var(--muted)',9,'end');
    for(let r=0;r<v.r;r++){const N=KN[r],c=KOMA[N],y=38+r*27;let x=x0;tx(d,x0-6,y+15,N+' 回','var(--muted)',10,'end');
      c.forEach((k,q)=>{const w=k/N*W;rect(d,x,y,w,20,FILL(KC[q],r===v.r-1?.55:.28));if(r===v.r-1&&w>34)tx(d,x+w/2,y+14,n(k/N,3),'var(--ink)',10);x+=w;});}
    for(let t=0;t<=1;t+=.5){d.line(x0+t*W,34,x0+t*W,38+8*27,'stroke="var(--line)" stroke-width=".8"');}
    const N=KN[v.r-1],c=KOMA[N];
    return {svg:d.out(),read:`${N} 回投げた結果<br>`+c.map((k,q)=>`${KL[q]}：${k} 回（${k} ÷ ${N} = ${q===0?'<b>':''}${(k/N).toFixed(3)}${q===0?'</b>':''}）`).join('<br>')};}});
FIGS.m1data_koma.sim=N=>KOMA[N];

/* ---- なぜ：相対度数が一定の値に近づく。8 つの記録をくらべる（コンピュータで作った架空の記録） ---- */
const ON=['硬貨','キャップ','画びょう'],OE=['表','上向き','上向き'],OP=[.5,.27,.62],OB=[15,9,1];
const IN=[10,25,50,100,200,400,800,1600];
const REC=OP.map((p,o)=>{const out=[];for(let r=0;r<8;r++){const g=rng(OB[o]*1009+o*100003+r*7919),a=[0];let k=0;for(let i=1;i<=1600;i++){if(g()<p)k++;a.push(k);}out.push(a);}return out;});
const spread=(o,N)=>{const v=REC[o].map(a=>a[N]/N);return {lo:Math.min(...v),hi:Math.max(...v),all:v};};
FIGS.m1data_ichitei=host=>mk(host,{alt:'硬貨・ペットボトルのキャップ・画びょうを投げる 8 つの記録で、投げた回数を増やすと相対度数が 1 つの値の近くに集まることを示すグラフ',h:252,
  sliders:[{k:'o',label:'投げるもの',min:1,max:3,step:1,v:1,fmt:o=>ON[o-1]},{k:'i',label:'投げた回数',min:0,max:7,step:1,v:0,fmt:i=>IN[i]+' 回'}],play:{k:'i',from:0,to:7,label:'回数を増やす',ms:4200},
  draw(v){const o=v.o-1,N=IN[v.i],d=draw(),X=m=>44+Math.log10(m)/Math.log10(1600)*276,Y=r=>210-r*176,s=spread(o,N);
    for(let r=0;r<=5;r++){d.line(44,Y(r/5),322,Y(r/5),r?GR:AX);tx(d,38,Y(r/5)+4,n(r/5),'var(--muted)',10,'end');}
    [1,10,100,1000].forEach(m=>{d.line(X(m),210,X(m),215,AX);tx(d,X(m),228,String(m),'var(--muted)',10);});d.line(44,30,44,210,AX);
    tx(d,183,246,'投げた回数','var(--muted)',10);tx(d,48,24,`${ON[o]}が${OE[o]}になった相対度数`,'var(--muted)',10,'start');
    if(o===0){d.line(44,Y(.5),322,Y(.5),'stroke="var(--gold)" stroke-width="1.3" stroke-dasharray="5 4"');tx(d,54,Y(.5)-6,'0.5','var(--gold)',10,'start');}
    {rect(d,X(N)-6,Y(s.hi)-5,12,Y(s.lo)-Y(s.hi)+10,'fill="var(--gold)" fill-opacity=".18" stroke="var(--gold)" stroke-width="1"');}
    REC[o].forEach(a=>{let p='';for(let m=5;m<=N;m++)p+=(m===5?'M':'L')+f(X(m))+','+f(Y(a[m]/m));d.path(p,'stroke="var(--c)" stroke-width="1.2" stroke-opacity=".75" fill="none" stroke-linejoin="round"');d.circle(X(N),Y(a[N]/N),2.6,'fill="var(--ink)" stroke="var(--bg2)" stroke-width=".8"');});
    return {svg:d.out(),read:`${ON[o]}を ${N} 回投げた記録 8 つ<br>${OE[o]}の相対度数：最小 ${s.lo.toFixed(3)}、最大 ${s.hi.toFixed(3)}<br>散らばりの幅 <b>${(s.hi-s.lo).toFixed(3)}</b><br>`+(o===0?'点線は、表と裏が同じ程度に出るときの値 0.5':'線 1 本が、1 つの記録')};}});
FIGS.m1data_ichitei.sim=(o,N)=>spread(o,N);
FIGS.m1data_ichitei.P=OP;

/* ---- 問題に付ける図（動かさない） ---- */
const Q={
 // 36 人の反復横とびの回数のヒストグラム
 hanpuku:{alt:'反復横とびの回数のヒストグラム。階級は 30 回以上 35 回未満から 55 回以上 60 回未満まで',h:236,f(d){const fr=[2,5,9,11,6,3],X=t=>52+(t-30)*9,Y=c=>196-c*13;
   [5,10].forEach(c=>d.line(52,Y(c),322,Y(c),GR));
   fr.forEach((c,j)=>{rect(d,X(30+5*j),Y(c),45,c*13,FILL('c',.38));tx(d,X(32.5+5*j),Y(c)-6,String(c),'var(--ink)',10);});
   d.line(52,196,322,196,AX).line(52,196,52,40,AX);[0,5,10].forEach(c=>tx(d,46,Y(c)+4,String(c),'var(--muted)',10,'end'));tx(d,56,36,'（人）','var(--muted)',9,'start');
   for(let t=30;t<=60;t+=5)tx(d,X(t),212,String(t),'var(--muted)',10);tx(d,326,228,'（回）','var(--muted)',9,'end');return '反復横とびの回数（回）と人数';}},
 // 度数分布多角形とヒストグラムの面積：切り取る三角形と、つけ加える三角形
 menseki:{alt:'ヒストグラムの柱の上の辺の中点を結んだ度数分布多角形と、柱から切り取られる三角形・外につけ加わる三角形を示す図',h:236,f(d){const fr=[2,5,7,4,1],X=t=>40+t*44,Y=c=>200-c*20;
   const pts=[[-.5,0]].concat(fr.map((c,j)=>[j+.5,c]),[[fr.length+.5,0]]);
   fr.forEach((c,j)=>rect(d,X(j),Y(c),44,c*20,FILL('c',.25)));
   for(let q=0;q<pts.length-1;q++){const [x1,y1]=pts[q],[x2,y2]=pts[q+1],b=(x1+x2)/2,ym=(y1+y2)/2;
     // b は柱の境目。左の柱の高さ y1（端は 0）、右の柱の高さ y2
     const up=y2>y1;   // 右上がりなら、左側で多角形が柱の上に出る（つけ加わる）、右側で柱から切り取られる
     d.poly([[X(x1),Y(y1)],[X(b),Y(y1)],[X(b),Y(ym)]],`fill="var(--${up?'gold':'ng'})" fill-opacity=".45" stroke="none"`);
     d.poly([[X(b),Y(ym)],[X(b),Y(y2)],[X(x2),Y(y2)]],`fill="var(--${up?'ng':'gold'})" fill-opacity=".45" stroke="none"`);}
   d.path('M'+pts.map(p=>f(X(p[0]))+','+f(Y(p[1]))).join(' L'),'stroke="var(--ink)" stroke-width="1.8" fill="none" stroke-linejoin="round"');
   pts.forEach(p=>d.circle(X(p[0]),Y(p[1]),2.8,'fill="var(--ink)" stroke="var(--bg2)" stroke-width="1"'));
   d.line(14,200,326,200,AX);
   rect(d,40,18,12,12,'fill="var(--gold)" fill-opacity=".6" stroke="none"');tx(d,58,28,'多角形でつけ加わる部分','var(--ink)',10,'start');
   rect(d,40,36,12,12,'fill="var(--ng)" fill-opacity=".6" stroke="none"');tx(d,58,46,'柱から切り取られる部分','var(--ink)',10,'start');
   return '隣り合う金色と赤の三角形は、折れ線と柱の境目の交点を中心に<br>180° 回転すると重なる';}}
};
FIGS.m1data_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){const d=draw(),r=q.f(d);return {svg:d.out(),read:r};}});};
})();
