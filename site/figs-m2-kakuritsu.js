/* 中学2年「確率の基礎」の図（FIGS.m2kakuritsu_*）。6章「場合の数と確率」と7章「箱ひげ図とデータの活用」 */
(function(){
const {draw,n,mk}=FIG;
const f=v=>v.toFixed(1);
const AX='stroke="var(--muted)" stroke-width="1.2" fill="none"';
const GR='stroke="var(--line)" stroke-width=".7" fill="none"';
const LN='stroke="var(--muted)" stroke-width="1" fill="none"';
const GDASH='stroke="var(--gold)" stroke-width="1.2" stroke-dasharray="3 3" fill="none"';
// 文字。o を真にすると、地の色でふちどる（線に重なっても読める）
const tx=(d,x,y,t,c='var(--ink)',s=11,a='middle',o)=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}"${o?' paint-order="stroke" stroke="var(--bg2)" stroke-width="3" stroke-linejoin="round"':''}>${t}</text>`);
const gcd=(a,b)=>b?gcd(b,a%b):a;
// 確率を分数で書く（約分できるときは、約分した形も付ける）
const fr=(a,b)=>{if(a===0)return '0';if(a===b)return `${a}/${b} = 1`;const g=gcd(a,b);return g===1?`${a}/${b}`:`${a}/${b} = ${a/g}/${b/g}`;};
// 四分位数（中学の教科書の方法）。小さい順に並べ、中央値で前半と後半に分ける。個数が奇数のときは中央の値を除く
const med=a=>{const m=a.length>>1;return a.length%2?a[m]:(a[m-1]+a[m])/2;};
const five=a=>{const s=a.slice().sort((x,y)=>x-y),h=s.length>>1;return [s[0],med(s.slice(0,h)),med(s),med(s.slice(s.length-h)),s[s.length-1]];};
// 箱ひげ図：X は値 → px、y は箱の中心、h は箱の高さ、q = [最小値, 第1四分位数, 中央値, 第3四分位数, 最大値]
const box=(d,X,y,h,q,fill='fill="var(--c)" fill-opacity=".25"',st='stroke="var(--ink)" stroke-width="1.6"')=>{
  d.line(X(q[0]),y,X(q[1]),y,st).line(X(q[3]),y,X(q[4]),y,st).line(X(q[0]),y-h/4,X(q[0]),y+h/4,st).line(X(q[4]),y-h/4,X(q[4]),y+h/4,st);
  d.raw(`<rect x="${f(X(q[1]))}" y="${f(y-h/2)}" width="${f(X(q[3])-X(q[1]))}" height="${h}" ${fill} ${st}/>`);
  return d.line(X(q[2]),y-h/2,X(q[2]),y+h/2,st);};

/* ---- 投げる回数と相対度数。乱数は種を固定して、いつも同じ記録になるようにする ---- */
const THROWS=(()=>{let s=29,k=0;const a=[0];for(let i=1;i<=2000;i++){s=s*48271%2147483647;if(Math.floor(s/2147483647*6)===0)k++;a.push(k);}return a;})();   // a[i] = i 回目までに 1 の目が出た回数
const NS=[10,20,50,100,200,500,1000,2000];
FIGS.m2kakuritsu_jikken=host=>mk(host,{alt:'さいころを投げる回数を増やすと、1 の目が出る相対度数が 6 分の 1 に近づくことを示すグラフ',
  sliders:[{k:'i',label:'投げた回数',min:0,max:7,step:1,v:2,fmt:i=>String(NS[i])}],play:{k:'i',from:0,to:7,label:'回数を増やす',ms:4200},
  draw(v){const N=NS[v.i],d=draw(),X=m=>42+Math.log10(m)/Math.log10(2000)*280,Y=r=>208-r/.5*184,k=THROWS[N];
    for(let r=0;r<=5;r++){d.line(42,Y(r/10),322,Y(r/10),r?GR:AX);tx(d,36,Y(r/10)+4,n(r/10),'var(--muted)',10,'end');}
    [1,10,100,1000].forEach(m=>{d.line(X(m),208,X(m),213,AX);tx(d,X(m),225,String(m),'var(--muted)',10);});d.line(42,20,42,208,AX);
    d.line(42,Y(1/6),322,Y(1/6),'stroke="var(--gold)" stroke-width="1.4" stroke-dasharray="5 4" fill="none"');tx(d,322,Y(1/6)-6,'1/6','var(--gold)',10,'end');
    let p='';for(let m=5;m<=N;m++)p+=(m===5?'M':'L')+f(X(m))+','+f(Y(Math.min(.5,THROWS[m]/m)));
    d.path(p,'stroke="var(--c)" stroke-width="1.6" fill="none" stroke-linejoin="round"');d.dot(X(N),Y(Math.min(.5,k/N)),'var(--gold)',4.5);
    tx(d,182,242,'投げた回数','var(--muted)',10);tx(d,46,14,'1 の目が出た相対度数','var(--muted)',10,'start');
    return {svg:d.out(),read:`投げた回数 ${N} 回<br>1 の目が出た回数 ${k} 回<br>相対度数 = ${k} ÷ ${N} = <b>${(k/N).toFixed(3)}</b><br>点線は 1/6 = 0.1666…`};}});

/* ---- 2つのさいころの 36 通りの表（arg.k = 'sa' なら差、それ以外は和） ---- */
FIGS.m2kakuritsu_saikoro=(host,arg)=>{const sa=!!(arg&&arg.k==='sa'),val=(a,b)=>sa?Math.abs(a-b):a+b;
  mk(host,{alt:sa?'2つのさいころの目の出方 36 通りを、出た目の差で表した表':'2つのさいころの目の出方 36 通りを、出た目の和で表した表',
  sliders:[sa?{k:'s',label:'出た目の差',min:0,max:5,step:1,v:1}:{k:'s',label:'出た目の和',min:2,max:12,step:1,v:7}],
  play:sa?{k:'s',from:0,to:5,label:'差を 0 から 5 まで変える',ms:3600}:{k:'s',from:2,to:12,label:'和を 2 から 12 まで変える',ms:4800},
  draw(v){const d=draw(),x0=96,y0=44,cw=36,ch=31,hit=[];
    tx(d,x0+cw*3,14,'小さいさいころの目','var(--muted)',10);tx(d,36,y0+ch*3-4,'大きい','var(--muted)',10);tx(d,36,y0+ch*3+9,'さいころ','var(--muted)',10);tx(d,36,y0+ch*3+22,'の目','var(--muted)',10);
    for(let i=1;i<=6;i++){tx(d,x0+(i-.5)*cw,y0-8,String(i),'var(--muted)',11);tx(d,x0-12,y0+(i-.5)*ch+4,String(i),'var(--muted)',11);}
    for(let a=1;a<=6;a++)for(let b=1;b<=6;b++){const on=val(a,b)===v.s,x=x0+(b-1)*cw,y=y0+(a-1)*ch;if(on)hit.push(`(${a}, ${b})`);
      d.raw(`<rect x="${x+1.5}" y="${y+1.5}" width="${cw-3}" height="${ch-3}" rx="4" fill="var(--${on?'gold':'c'})" fill-opacity="${on?.92:.13}"/>`);
      tx(d,x+cw/2,y+ch/2+4,String(val(a,b)),on?'var(--on-c)':'var(--ink)',12);}
    const c=hit.length;
    return {svg:d.out(),read:sa?`マスの数は、大きい目から小さい目を引いた差<br>差が ${v.s} になる目の出方：<b>${c} 通り</b><br>確率 = <b>${fr(c,36)}</b>`
      :`マスの数は、2つの目の和<br>和が ${v.s} になる目の出方：<b>${c} 通り</b><br>（大, 小）= ${hit.join(' ')}<br>確率 = <b>${fr(c,36)}</b>`};}});};

/* ---- 樹形図（arg.m = 'erabu' なら 4 人から 2 人を選ぶ、それ以外は 4 枚のカードで 2 けたの整数を作る） ---- */
FIGS.m2kakuritsu_jukei=(host,arg)=>{const er=!!(arg&&arg.m==='erabu'),it=er?['A','B','C','D']:['1','2','3','4'];
  mk(host,{alt:er?'4 人から 2 人を選ぶ選び方を調べる樹形図':'4 枚のカードから 2 枚を順に引いて 2 けたの整数を作る樹形図',
  sliders:[{k:'s',label:'手順',min:1,max:3,step:1,v:1}],play:{k:'s',from:1,to:3,label:'順に見る',ms:3600},
  draw(v){const s=v.s,d=draw(),ly=k=>30+k*18,x0=30,x1=104,x2=186,x3=268;let k=0;
    tx(d,x1,13,er?'1人目':'十の位','var(--muted)',10);if(er||s>=2){tx(d,x2,13,er?'2人目':'一の位','var(--muted)',10);tx(d,x3,13,er?'選ばれる2人':'できる整数','var(--muted)',10);}
    d.dot(x0,129,'var(--muted)',3);
    it.forEach((a,i)=>{const ya=ly(i*3+1);d.line(x0,129,x1-12,ya,LN);tx(d,x1,ya+4,a,'var(--ink)',13);
      it.forEach((b,j)=>{if(i===j)return;const y=ly(k++);if(!er&&s<2)return;
        const dup=er&&i>j,off=dup&&s>=2,hit=er?(!dup&&s>=3):(s>=3&&(+a*10+ +b)%3===0),col=off?'var(--line)':hit?'var(--gold)':'var(--ink)';
        d.line(x1+12,ya,x2-12,y,off?'stroke="var(--line)" stroke-width="1" fill="none"':LN);tx(d,x2,y+4,b,col,12);tx(d,x3,y+4,er?a+' と '+b:a+b,col,12);
        if(off)d.line(x3-26,y,x3+26,y,'stroke="var(--muted)" stroke-width="1" fill="none"');});});
    const read=er?['<b>手順 1</b>　1人目、2人目と順に選ぶと 4 × 3 = 12 通り','<b>手順 2</b>　「A と B」と「B と A」は、同じ2人<br>同じ組は、あとから出てきた方を消す',
        '<b>手順 3</b>　2人の選び方は <b>6 通り</b><br>A が選ばれるのは、A と B、A と C、A と D の 3 通り<br>A が選ばれる確率 = 3/6 = 1/2'][s-1]
      :['<b>手順 1</b>　十の位のカードの選び方は 4 通り','<b>手順 2</b>　一の位は、残りの 3 枚から選ぶ<br>2けたの整数は 4 × 3 = <b>12 通り</b><br>どの整数ができることも、同様に確からしい',
        '<b>手順 3</b>　3 の倍数は 12、21、24、42 の <b>4 通り</b><br>3 の倍数になる確率 = 4/12 = 1/3'][s-1];
    return {svg:d.out(),read};}});};

/* ---- くじを引く順番：5 本のくじを A、B の順に引く ---- */
FIGS.m2kakuritsu_kuji=host=>mk(host,{alt:'5 本のくじを A、B の順に 1 本ずつ引くときの樹形図。A があたる場合と B があたる場合に印を付ける',h:262,
  sliders:[{k:'s',label:'手順',min:1,max:4,step:1,v:1},{k:'k',label:'あたりの本数（全部で 5 本）',min:1,max:4,step:1,v:2}],play:{k:'s',from:1,to:4,label:'順に見る',ms:4800},
  draw(v){const s=v.s,K=v.k,d=draw(),win=i=>i<K,ly=r=>34+r*11.4,xa=84,xb=186;
    // くじ：あたりは金色でぬる。A の列には番号を書く
    const lot=(x,y,i,r,num)=>{d.circle(x,y,r,win(i)?'fill="var(--gold)" stroke="var(--gold)" stroke-width="1"':'fill="var(--bg2)" stroke="var(--muted)" stroke-width="1.2"');if(num)tx(d,x,y+3.5,String(i+1),win(i)?'var(--on-c)':'var(--muted)',10);};
    const sq=(x,y,on,c)=>d.raw(`<rect x="${f(x-4)}" y="${f(y-4)}" width="8" height="8" rx="1.5" fill="${on?c:'none'}" stroke="${on?c:'var(--line)'}" stroke-width="1"/>`);
    tx(d,xa,14,'A（先に引く）','var(--muted)',10);if(s>=2)tx(d,xb,14,'B（後に引く）','var(--muted)',10);
    if(s>=3){tx(d,244,14,'A','var(--c)',10);tx(d,244,25,'あたり','var(--c)',8);}if(s>=4){tx(d,290,14,'B','var(--gold)',10);tx(d,290,25,'あたり','var(--gold)',8);}
    d.dot(22,142,'var(--muted)',3);
    for(let a=0;a<5;a++){const ya=(ly(a*4)+ly(a*4+3))/2;d.line(22,142,xa-11,ya,LN);let r=0;
      for(let b=0;b<5&&s>=2;b++){if(b===a)continue;const y=ly(a*4+r++);d.line(xa+11,ya,xb-7,y,LN);lot(xb,y,b,4.4,false);if(s>=3)sq(244,y,win(a),'var(--c)');if(s>=4)sq(290,y,win(b),'var(--gold)');}
      lot(xa,ya,a,9,true);}
    tx(d,22,256,'● あたり　○ はずれ','var(--muted)',9,'start');
    return {svg:d.out(),read:[`<b>手順 1</b>　A の引き方は 5 通り。そのうち、あたりは ${K} 通り<br>A があたる確率 = <b>${fr(K,5)}</b>`,
      '<b>手順 2</b>　B は、残りの 4 本から引く<br>2人の引き方は 5 × 4 = <b>20 通り</b><br>どの引き方も、同様に確からしい',
      `<b>手順 3</b>　A があたる引き方に ■ を付ける<br>${4*K} 通り。確率 = <i>${fr(4*K,20)}</i>`,
      `<b>手順 4</b>　B があたる引き方に ■ を付ける<br>${4*K} 通り。確率 = <b>${fr(4*K,20)}</b><br>先に引いても後に引いても、あたる確率は同じ`][s-1]};}});

/* ---- データの点・四分位数・箱ひげ図の対応 ---- */
const ARR=[12,5,18,9,15,3,21,8,11,24,6,16];   // 前から n 個を使う
FIGS.m2kakuritsu_hakohige=host=>mk(host,{alt:'小さい順に並べたデータの点と、四分位数、箱ひげ図の対応を示す図',
  sliders:[{k:'n',label:'データの個数',min:7,max:12,step:1,v:9}],
  draw(v){const N=v.n,a=ARR.slice(0,N).sort((x,y)=>x-y),q=five(a),h=N>>1,odd=N%2===1,d=draw(),X=x=>26+x*11.6;
    const br=(i0,i1,t,c)=>{const xa=X(a[i0])-7,xb=X(a[i1])+7;d.path(`M${f(xa)},38 L${f(xa)},32 L${f(xb)},32 L${f(xb)},38`,`stroke="${c}" stroke-width="1.3" fill="none"`);tx(d,(xa+xb)/2,25,t,c,10);};
    br(0,h-1,`前半 ${h} 個`,'var(--c)');br(N-h,N-1,`後半 ${h} 個`,'var(--ok)');
    [1,2,3].forEach(k=>{d.line(X(q[k]),92,X(q[k]),198,GDASH);d.path(`M${f(X(q[k])-4)},40 L${f(X(q[k])+4)},40 L${f(X(q[k]))},47 Z`,'fill="var(--gold)" stroke="none"');});
    a.forEach((x,i)=>{d.dot(X(x),54,i<h?'var(--c)':i>=N-h?'var(--ok)':'var(--gold)',4.6);tx(d,X(x),i%2?85:74,String(x),'var(--muted)',9,'middle',true);});
    d.line(18,116,330,116,AX);for(let t=0;t<=25;t+=5){d.line(X(t),116,X(t),121,AX);tx(d,X(t),133,String(t),'var(--muted)',10,'middle',true);}
    box(d,X,172,38,q);
    tx(d,X(q[0])-7,176,n(q[0]),'var(--muted)',10,'end');tx(d,X(q[4])+7,176,n(q[4]),'var(--muted)',10,'start');
    [1,2,3].forEach(k=>{tx(d,X(q[k]),212,n(q[k]),'var(--gold)',11,'middle',true);tx(d,X(q[k]),226,'第'+k,'var(--muted)',9,'middle',true);});
    return {svg:d.out(),read:`${N} 個のデータ（${odd?'奇数個。中央の値を除いて、前半と後半に分ける':'偶数個。半分ずつ、前半と後半に分ける'}）<br>第1四分位数 <b>${n(q[1])}</b>、第2四分位数（中央値）<b>${n(q[2])}</b>、第3四分位数 <b>${n(q[3])}</b><br>四分位範囲 = ${n(q[3])} − ${n(q[1])} = <b>${n(q[3]-q[1])}</b>　範囲 = ${q[4]} − ${q[0]} = ${q[4]-q[0]}`};}});

/* ---- 極端な値と、範囲・四分位範囲 ---- */
FIGS.m2kakuritsu_hazure=host=>mk(host,{alt:'いちばん大きい値を動かしたときの、範囲と四分位範囲、平均値と中央値の変わり方を示す図',
  sliders:[{k:'m',label:'いちばん大きい値',min:18,max:40,step:1,v:20}],play:{k:'m',from:18,to:40,label:'いちばん大きい値を大きくする',ms:3600},
  draw(v){const a=[8,10,11,12,13,14,15,17,v.m],q=five(a),mean=(100+v.m)/9,d=draw(),X=x=>22+(x-5)*8.1;
    a.forEach((x,i)=>d.dot(X(x),44,i===8?'var(--gold)':'var(--c)',4.6));
    d.path(`M${f(X(mean))},66 l-5,9 l10,0 z`,'fill="var(--ok)" stroke="none"');tx(d,X(mean),88,'平均値 '+n(mean,1),'var(--ok)',10,'middle',true);
    d.line(16,112,330,112,AX);for(let t=5;t<=40;t+=5){d.line(X(t),112,X(t),117,AX);tx(d,X(t),129,String(t),'var(--muted)',10);}
    box(d,X,166,34,q);
    d.line(X(q[1]),143,X(q[3]),143,'stroke="var(--c)" stroke-width="2" fill="none"');tx(d,X(q[3])+7,147,'四分位範囲 5.5','var(--c)',10,'start');
    d.line(X(q[0]),196,X(q[4]),196,'stroke="var(--gold)" stroke-width="2" fill="none"');tx(d,(X(q[0])+X(q[4]))/2,212,'範囲 '+(v.m-8),'var(--gold)',10);
    return {svg:d.out(),read:`いちばん大きい値を ${v.m} にする<br>範囲 = ${v.m} − 8 = <b>${v.m-8}</b>（変わる）<br>四分位範囲 = 16 − 10.5 = <i>5.5</i>（変わらない）<br>中央値 13（変わらない）、平均値 ${n(mean,1)}（変わる）`};}});

/* ---- 3つの組の箱ひげ図をくらべる ---- */
const KUMI=[['A 組',[30,45,60,70,90]],['B 組',[40,55,60,65,80]],['C 組',[20,50,70,80,95]]];
const kumi=(d,k)=>{const X=x=>52+x*2.7;
  for(let t=0;t<=100;t+=10){d.line(X(t),34,X(t),196,GR);tx(d,X(t),212,String(t),'var(--muted)',10);}
  tx(d,X(100),228,'（点）','var(--muted)',9,'end');
  KUMI.forEach((g,i)=>{const y=62+i*52,q=g[1];tx(d,26,y+4,g[0],'var(--ink)',11);
    box(d,X,y,30,q,k===2?'fill="var(--gold)" fill-opacity=".5"':'fill="var(--c)" fill-opacity=".25"');
    if(k===1){d.line(X(q[2]),y-19,X(q[2]),y+19,'stroke="var(--gold)" stroke-width="3.5" fill="none"');tx(d,X(q[2]),y-23,String(q[2]),'var(--gold)',10,'middle',true);}
    if(k===2)tx(d,(X(q[1])+X(q[3]))/2,y-20,String(q[3]-q[1]),'var(--gold)',10,'middle',true);
    if(k===3){d.line(X(q[0]),y+21,X(q[4]),y+21,'stroke="var(--gold)" stroke-width="2.5" fill="none"');tx(d,X(q[4])+5,y+25,String(q[4]-q[0]),'var(--gold)',10,'start',true);}});
  return d;};
FIGS.m2kakuritsu_hikaku=host=>mk(host,{alt:'3つの組のテストの得点を表す箱ひげ図を、観点を変えてくらべる図',h:236,
  sliders:[{k:'k',label:'くらべる観点',min:1,max:3,step:1,v:1,fmt:k=>['中央値','四分位範囲','範囲'][k-1]}],
  draw(v){const d=kumi(draw(),v.k);
    return {svg:d.out(),read:['中央値　A 組 60、B 組 60、C 組 <b>70</b><br>C 組は、半数以上の生徒が 70 点以上','四分位範囲（箱の長さ）　A 組 25、B 組 <b>10</b>、C 組 30<br>B 組は、中央付近の約半数の得点が 55 点から 65 点に集まっている',
      '範囲　A 組 60、B 組 40、C 組 <b>75</b><br>C 組は、最高点も最低点も、3つの組の中でいちばん外側にある'][v.k-1]};}});

/* ---- ヒストグラムと箱ひげ図 ---- */
const DIST=[['左右対称',[11,16,18,21,22,23,24,26,26,27,27,28,29,31,32,33,34,37,39,44],'箱は中央にあり、左右のひげの長さはほぼ同じ'],
  ['右にすそが長い',[6,7,8,9,11,12,12,13,14,16,17,18,21,22,24,27,31,34,39,46],'箱は左に寄り、右のひげが長い'],
  ['左にすそが長い',[4,11,16,19,23,26,28,29,32,33,34,36,37,38,38,39,41,42,43,44],'箱は右に寄り、左のひげが長い'],
  ['山が2つ',[8,9,11,12,12,13,14,16,17,21,28,33,34,36,37,38,38,39,41,43],'箱が長い。山が2つあることは、箱ひげ図からは分からない']];
// ヒストグラム（階級の幅 5）と箱ひげ図を、幅 w の中に描く
const histbox=(d,a,x0,w,yb,u,by,bh,lab)=>{const X=x=>x0+x/50*w,cnt=Array(10).fill(0);a.forEach(x=>cnt[Math.min(9,Math.floor(x/5))]++);
  cnt.forEach((c,i)=>{if(c)d.raw(`<rect x="${f(X(i*5)+.6)}" y="${f(yb-c*u)}" width="${f(w/10-1.2)}" height="${f(c*u)}" fill="var(--c)" fill-opacity=".45" stroke="var(--c)" stroke-width=".8"/>`);});
  d.line(x0-3,yb,x0+w+3,yb,AX);if(lab)for(let t=0;t<=50;t+=10){d.line(X(t),yb,X(t),yb+4,AX);tx(d,X(t),yb+15,String(t),'var(--muted)',10);}
  if(by)box(d,X,by,bh,five(a));return X;};
FIGS.m2kakuritsu_hist=host=>mk(host,{alt:'同じデータを、ヒストグラムと箱ひげ図の両方で表した図。分布の形を変えられる',
  sliders:[{k:'m',label:'分布の形',min:1,max:4,step:1,v:1,fmt:m=>DIST[m-1][0]}],
  draw(v){const g=DIST[v.m-1],q=five(g[1]),d=draw();
    [1,2,3].forEach(k=>d.line(46+q[k]/50*270,24,46+q[k]/50*270,222,GDASH));
    histbox(d,g[1],46,270,138,17,192,34,true);
    for(let c=2;c<=6;c+=2){d.line(42,138-c*17,46,138-c*17,AX);tx(d,38,138-c*17+4,String(c),'var(--muted)',10,'end');}tx(d,40,20,'（人）','var(--muted)',9,'end');
    return {svg:d.out(),read:`分布の形：<b>${g[0]}</b>（20 人）<br>最小値 ${q[0]}、最大値 ${q[4]}<br>第1四分位数 ${n(q[1])}、中央値 ${n(q[2])}、第3四分位数 ${n(q[3])}<br>${g[2]}`};}});

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
const Q={
 box1:{alt:'最小値 10、第1四分位数 25、中央値 40、第3四分位数 50、最大値 70 の箱ひげ図',h:120,f(d){const X=x=>30+x*3.5;
   for(let t=0;t<=80;t+=10){d.line(X(t),22,X(t),78,GR);tx(d,X(t),94,String(t),'var(--muted)',10);}tx(d,X(80),110,'（分）','var(--muted)',9,'end');
   box(d,X,50,32,[10,25,40,50,70]);return '1 か月の読書時間（生徒 40 人）';}},
 box2:{alt:'1組と2組の通学時間を表す2つの箱ひげ図。1組は 5、10、15、25、40。2組は 5、15、20、25、30',h:168,f(d){const X=x=>58+x*6;
   for(let t=0;t<=45;t+=5){d.line(X(t),22,X(t),122,GR);tx(d,X(t),138,String(t),'var(--muted)',10);}tx(d,X(45),154,'（分）','var(--muted)',9,'end');
   [['1 組',[5,10,15,25,40]],['2 組',[5,15,20,25,30]]].forEach((g,i)=>{tx(d,26,50+i*48+4,g[0],'var(--ink)',11);box(d,X,50+i*48,30,g[1]);});return '通学時間（どちらの組も 30 人）';}},
 box3:{alt:'A 組、B 組、C 組のテストの得点を表す3つの箱ひげ図',h:236,f(d){kumi(d,0);return 'テストの得点（どの組も 35 人）';}},
 taio:{alt:'3つのヒストグラム ①②③ と、3つの箱ひげ図 ア イ ウ の図',h:236,f(d){
   [1,3,2].forEach((m,i)=>{const y=70+i*74;tx(d,14,y-34,'①②③'[i],'var(--ink)',12);histbox(d,DIST[m][1],30,128,y,8.5,0,0,false);});
   [3,2,1].forEach((m,i)=>{const y=44+i*74;tx(d,190,y+4,'アイウ'[i],'var(--ink)',12);const X=x=>204+x/50*122;d.line(204,y+26,326,y+26,AX);box(d,X,y,26,five(DIST[m][1]));});
   return '左：ヒストグラム ①〜③　右：箱ひげ図 ア〜ウ（横軸の目もりはすべて同じ）';}}
};
FIGS.m2kakuritsu_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){const d=draw(),r=q.f(d);return {svg:d.out(),read:r};}});};
})();
