/* 数学I「二次関数」の図（FIGS.h1niji_*）。動かせる図と、問題に付ける図（h1niji_q） */
(function(){
const {plot,draw,n,sg,C,GOLD,DASH,mk}=FIG;
const f=v=>v.toFixed(1);
// 文字のふちどり（線に重なっても読めるようにする）
const T='paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round"';
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" ${T}>${t}</text>`);
const THIN='stroke="var(--c)" stroke-width="1.2" opacity=".45"';
const AR='stroke="var(--gold)" stroke-width="2.6" stroke-linecap="round"';
// 係数の表示（1 は省き、−1 は − だけにする）
const co=a=>a===1?'':a===-1?'−':n(a);
// ax² + bx + c の形の文字列
const quad=(a,b,c)=>{let s='';
  if(a)s+=co(a)+'x²';
  if(b)s+=(s?(b<0?' − ':' + '):(b<0?'−':''))+(Math.abs(b)===1?'':n(Math.abs(b)))+'x';
  if(c||!s)s+=(s?(c<0?' − ':' + '):(c<0?'−':''))+n(Math.abs(c));
  return s;};
// a(x − p)² + q の形の文字列
// b² − 4ac の途中式（4ac が負のときだけかっこを付ける）
const dex=(bb,ac4)=>`${n(bb)} − ${ac4<0?'('+n(ac4)+')':n(ac4)}`;
const vform=(a,p,q)=>co(a)+(p?`(x ${p<0?'+':'−'} ${n(Math.abs(p))})²`:'x²')+(q?' '+sg(q):'');

/* ---- 関数とグラフ：定義域を動かすと値域が変わる ---- */
FIGS.h1niji_teigiiki=host=>mk(host,{alt:'一次関数のグラフで、定義域を動かすと値域が変わる図',
  sliders:[{k:'a',label:'傾き a',min:-1.5,max:1.5,step:.5,v:1},{k:'s',label:'定義域の左端',min:-3,max:0,step:.5,v:-1},{k:'w',label:'定義域の幅',min:1,max:3,step:.5,v:3}],
  draw(v){const a=v.a,s=v.s,t=v.s+v.w,g=x=>a*x+1,y1=g(s),y2=g(t),lo=Math.min(y1,y2),hi=Math.max(y1,y2),p=plot([-4.5,4.5,-4.4,6.4]).grid();
    p.poly([[s,-4.4],[t,-4.4],[t,6.4],[s,6.4]],'fill="var(--c)" fill-opacity=".08"');
    p.curve(g,THIN).seg(s,0,s,y1,DASH).seg(t,0,t,y2,DASH).seg(s,y1,0,y1,DASH).seg(t,y2,0,y2,DASH);
    p.seg(s,0,t,0,'stroke="var(--c)" stroke-width="5" stroke-linecap="round"');
    if(hi-lo>1e-9)p.seg(0,lo,0,hi,'stroke="var(--gold)" stroke-width="5" stroke-linecap="round"');else p.dot(0,lo,'var(--gold)',5);
    p.curve(g,C,s,t).dot(s,y1,'var(--ink)',4).dot(t,y2,'var(--ink)',4);
    let read=`y = ${a?co(a)+'x + 1':'1'}<br>定義域 <i>${n(s)} ≦ x ≦ ${n(t)}</i>（横の太線）<br>`;
    if(a===0)read+='値域は <b>y = 1</b> だけ<br>x が変わっても y は変わらない';
    else read+=`値域 <b>${n(lo)} ≦ y ≦ ${n(hi)}</b>（縦の太線）<br>最大値 ${n(hi)}（x = ${n(a>0?t:s)}）、最小値 ${n(lo)}（x = ${n(a>0?s:t)}）`;
    return {svg:p.out(),read};}});

/* ---- 二次関数のグラフ：y = ax² を平行移動して頂点を動かす ---- */
FIGS.h1niji_idou=host=>mk(host,{alt:'放物線 y = ax² を平行移動して、頂点を (p, q) に動かす図',
  sliders:[{k:'a',label:'a',min:-2,max:2,step:.5,v:1},{k:'p',label:'p（x 軸方向の移動）',min:-3,max:3,step:.5,v:2},{k:'q',label:'q（y 軸方向の移動）',min:-3,max:3,step:.5,v:1}],
  draw(v){const a=v.a,pp=v.p,q=v.q,P=plot([-5,5,-4.6,5.4]).grid(),g=x=>a*(x-pp)*(x-pp)+q;
    P.curve(x=>a*x*x,DASH).seg(pp,-4.6,pp,5.4,'stroke="var(--muted)" stroke-width="1" stroke-dasharray="2 4"');
    if(pp)P.seg(0,0,pp,0,AR);if(q)P.seg(pp,0,pp,q,AR);
    P.curve(g,C).dot(0,0,'var(--muted)',3.5).dot(pp,q,'var(--gold)');
    if(pp)P.txt(pp/2,0,'p','text-anchor="middle" dy="-7" fill="var(--gold)" '+T);
    if(q)P.txt(pp,q/2,'q','dx="8" dy="4" fill="var(--gold)" '+T);
    if(a===0)return {svg:P.out(),read:`a = 0 のとき、式は y = ${n(q)} になる<br>x² の項がないので、二次関数ではない`};
    return {svg:P.out(),read:`y = ${vform(a,pp,q)}<br>頂点 <b>(${n(pp)}, ${n(q)})</b>、軸 x = ${n(pp)}、${a>0?'下に凸':'上に凸'}<br>点線 y = ${co(a)}x² を、x 軸方向に ${n(pp)}、y 軸方向に ${n(q)} だけ平行移動<br>展開すると y = <i>${quad(a,-2*a*pp,a*pp*pp+q)}</i>`};}});

/* ---- なぜ：平方完成を面積で見る。x² + bx の長方形を半分に切って移す ---- */
FIGS.h1niji_heiho=host=>mk(host,{alt:'x² + bx を表す正方形と長方形を並べ替えて、大きい正方形から角を引いた形にする手順の図',
  sliders:[{k:'s',label:'手順',min:1,max:4,step:1,v:1},{k:'b',label:'b（x の係数）',min:2,max:8,step:2,v:6}],
  play:{k:'s',from:1,to:4,label:'順に見る',ms:4400},
  draw(v){const s=v.s,b=v.b,h=b/2,X=120,u=16,B=b*u,H=B/2,ox=46,oy=30,d=draw();
    const R=(x,y,w,hh,st)=>d.raw(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(hh)}" ${st}/>`);
    const FC='fill="var(--c)" fill-opacity=".26" stroke="var(--c)" stroke-width="1.4"',FS='fill="var(--c)" fill-opacity=".56" stroke="var(--bg2)" stroke-width="1.4"';
    const hx=h===1?'x':n(h)+'x';
    R(ox,oy,X,X,FC);tx(d,ox+X/2,oy+X/2+4,'x²');tx(d,ox+X/2,oy-8,'x','var(--muted)');tx(d,ox-11,oy+X/2+4,'x','var(--muted)');
    if(s===1){R(ox+X,oy,B,X,FS);tx(d,ox+X+B/2,oy+X/2+4,n(b)+'x');tx(d,ox+X+B/2,oy-8,n(b),'var(--muted)');}
    if(s===2){R(ox+X,oy,H,X,FS);R(ox+X+H,oy,H,X,FS);tx(d,ox+X+H/2,oy+X/2+4,hx);tx(d,ox+X+H*1.5,oy+X/2+4,hx);
      tx(d,ox+X+H/2,oy-8,n(h),'var(--muted)');tx(d,ox+X+H*1.5,oy-8,n(h),'var(--muted)');}
    if(s>=3){R(ox+X,oy,H,X,FS);R(ox,oy+X,X,H,FS);tx(d,ox+X+H/2,oy+X/2+4,hx);tx(d,ox+X/2,oy+X+H/2+4,hx);
      tx(d,ox+X+H/2,oy-8,n(h),'var(--muted)');tx(d,ox-11,oy+X+H/2+4,n(h),'var(--muted)');}
    if(s===3)R(ox+X,oy+X,H,H,'fill="none" stroke="var(--gold)" stroke-width="1.6" stroke-dasharray="4 3"');
    if(s===4){R(ox+X,oy+X,H,H,'fill="var(--gold)" fill-opacity=".85" stroke="var(--bg2)" stroke-width="1.4"');
      d.text(ox+X+H/2,oy+X+H/2+4,n(h*h),'fill="var(--on-c)"');
      R(ox,oy,X+H,X+H,'fill="none" stroke="var(--gold)" stroke-width="2"');tx(d,ox+(X+H)/2,oy+X+H+18,'1辺 x + '+n(h),'var(--gold)');}
    return {svg:d.out(),read:[`<b>手順 1</b>　x² + ${n(b)}x を面積で表す<br>1辺 x の正方形と、縦 x・横 ${n(b)} の長方形`,
      `<b>手順 2</b>　長方形を半分に切る<br>${n(b)}x = ${hx} + ${hx}`,
      `<b>手順 3</b>　半分を正方形の下に移す<br>面積は x² + ${n(b)}x のまま<br>右下に1辺 ${n(h)} の角が欠けている`,
      `<b>手順 4</b>　角 ${n(h)}² = ${n(h*h)} を足すと、1辺 x + ${n(h)} の正方形<br>x² + ${n(b)}x + ${n(h*h)} = (x + ${n(h)})²<br><b>x² + ${n(b)}x = (x + ${n(h)})² − ${n(h*h)}</b>`][s-1]};}});

/* ---- 最大・最小：軸と定義域の位置で、最大・最小をとる点が変わる。arg.a = 1（下に凸）または −1（上に凸） ---- */
FIGS.h1niji_saidai=(host,arg)=>{const a=(arg&&arg.a)||1,k=a>0?2:14;
  mk(host,{h:290,alt:a>0?'下に凸の放物線で、軸と定義域の位置によって最大値・最小値をとる点が変わる図':'上に凸の放物線で、軸と定義域の位置によって最大値・最小値をとる点が変わる図',
  sliders:[{k:'p',label:'軸の位置 p',min:-1,max:3,step:.5,v:1.5},{k:'t',label:'定義域の右端 t',min:1,max:2.5,step:.5,v:2}],
  play:{k:'p',from:-1,to:3,label:'軸を左から右へ動かす',ms:4200},
  draw(v){const p0=v.p,t=v.t,t0=v.t,g=x=>a*(x-p0)*(x-p0)+k,y0=-1.5,y1=15.5,P=plot([-2.5,4.5,y0,y1],340,290).grid();
    P.poly([[0,y0],[t,y0],[t,y1],[0,y1]],'fill="var(--c)" fill-opacity=".1"');
    P.seg(p0,y0,p0,y1,'stroke="var(--ink)" stroke-width="1.1" stroke-dasharray="5 4"').txt(p0,a>0?y1:3.5,'軸','dx="5" dy="'+(a>0?27:4)+'" fill="var(--ink)" '+T);
    P.curve(g,THIN).curve(g,C,0,t);
    const xs=[0,t];if(p0>0&&p0<t)xs.push(p0);
    const ys=xs.map(g),M=Math.max(...ys),m=Math.min(...ys),at=val=>xs.filter(x=>Math.abs(g(x)-val)<1e-9).sort((x,y)=>x-y);
    const lab=(x,y,t,col,up)=>P.dot(x,y,col,5.5).txt(x,y,t,(x===0?'text-anchor="end" dx="-10" dy="4"':x===t0?'dx="10" dy="4"':'dx="9" dy="'+(up?-9:17)+'"')+' fill="'+col+'" '+T);
    at(M).forEach(x=>lab(x,M,'最大','var(--gold)',true));
    at(m).forEach(x=>lab(x,m,'最小','var(--c)',false));
    const mid=t/2,pos=p0<0?'定義域の左外':p0>t?'定義域の右外':p0===0?'定義域の左端':p0===t?'定義域の右端':p0===mid?'定義域の中央':p0<mid?'定義域の中（中央より左）':'定義域の中（中央より右）';
    return {svg:P.out(),read:`y = ${vform(a,p0,k)}（0 ≦ x ≦ ${n(t)}）<br>軸 x = ${n(p0)} は、${pos}<br>最大値 <b>${n(M)}</b>（x = ${at(M).map(x=>n(x)).join(', ')}）<br>最小値 <i>${n(m)}</i>（x = ${at(m).map(x=>n(x)).join(', ')}）`};}});};

/* ---- 二次関数の決定：3点を通る放物線 ---- */
FIGS.h1niji_kettei=host=>mk(host,{alt:'3点 A, B, C を通る放物線が、点 B を上下に動かすと変わる図',
  sliders:[{k:'k',label:'点 B の y 座標 k',min:-2,max:4,step:.5,v:0}],play:{k:'k',from:-2,to:4,label:'点 B を下から上へ動かす',ms:3600},
  draw(v){const k=v.k,a=1-k/2,b=k/2,c=k-1,g=x=>a*x*x+b*x+c,P=plot([-3.6,4.6,-3.8,6.2]).grid();
    P.seg(1,-3.8,1,6.2,'stroke="var(--muted)" stroke-width="1" stroke-dasharray="2 4"').curve(g,C);
    P.dot(-1,0,'var(--ink)').dot(2,3,'var(--ink)').dot(1,k,'var(--gold)',5.5);
    P.txt(-1,0,'A','text-anchor="end" dx="-8" dy="-7" fill="var(--ink)" '+T).txt(2,3,'C','dx="10" dy="5" fill="var(--ink)" '+T).txt(1,k,'B','text-anchor="end" dx="-9" dy="-8" fill="var(--gold)" '+T);
    return {svg:P.out(),read:`A(−1, 0)、B(1, ${n(k)})、C(2, 3) を通る<br>y = ax² + bx + c に3点を代入して解くと<br>a = ${n(a)}、b = ${n(b)}、c = ${n(c)}<br>`+
      (a===0?'<b>y = x + 1</b><br>3点が一直線上にあるので、二次関数にならない':`<b>y = ${quad(a,b,c)}</b>`)};}});

/* ---- 二次方程式：2つの解は −b/2a を中心に左右対称 ---- */
FIGS.h1niji_kai=host=>mk(host,{h:170,alt:'二次方程式の2つの解が、数直線上で −b/2a を中心に左右対称に並ぶ図',
  sliders:[{k:'b',label:'b',min:-6,max:6,step:1,v:-2},{k:'c',label:'c',min:-8,max:9,step:1,v:-3}],
  draw(v){const b=v.b,c=v.c,D=b*b-4*c,m=-b/2,d=draw(),X=x=>170+x*19,Y=112,G='stroke="var(--gold)" stroke-width="2.4" stroke-linecap="round"';
    d.line(10,Y,330,Y,'stroke="var(--muted)" stroke-width="1.4"');
    for(let i=-8;i<=8;i++){d.line(X(i),Y-4,X(i),Y+4,'stroke="var(--muted)" stroke-width="1"');if(i%2===0)tx(d,X(i),Y+20,n(i),'var(--muted)',10);}
    d.line(X(m),Y-66,X(m),Y+7,'stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="4 3"');tx(d,X(m),Y-74,'−b/2a = '+n(m),'var(--ink)',11);
    let read=`${quad(1,b,c)} = 0（a = 1）<br>D = b² − 4ac = ${dex(b*b,4*c)} = <b>${n(D)}</b><br>`;
    if(D>0){const r=Math.sqrt(D)/2,x1=m-r,x2=m+r,w=r*19;
      d.line(X(x1),Y-34,X(x2),Y-34,G).line(X(x1),Y-34,X(x1),Y,'stroke="var(--gold)" stroke-width="1.2" stroke-dasharray="3 3"').line(X(x2),Y-34,X(x2),Y,'stroke="var(--gold)" stroke-width="1.2" stroke-dasharray="3 3"');
      if(w>=40){tx(d,X(m)-w/2,Y-42,'√D/2a','var(--gold)',10);tx(d,X(m)+w/2,Y-42,'√D/2a','var(--gold)',10);}
      d.dot(X(x1),Y,'var(--gold)',5).dot(X(x2),Y,'var(--gold)',5);
      read+=`x = (${n(-b)} ± √${n(D)}) ÷ 2 ${Number.isInteger(Math.sqrt(D))?'=':'≈'} <b>${n(x1)}, ${n(x2)}</b><br>2つの解は、${n(m)} から左右に ${n(r)} ずつ離れている`;}
    else if(D===0){d.dot(X(m),Y,'var(--gold)',5.5);tx(d,X(m),Y-42,'重解','var(--gold)',11);read+=`√ の中が 0 なので、解は1つ（重解）<br><b>x = ${n(m)}</b>`;}
    else{tx(d,X(m)+(m>0?-50:50),Y-34,'実数解はない','var(--muted)',11);read+='√ の中が負になる<br><b>実数解はない</b>';}
    return {svg:d.out(),read};}});

/* ---- グラフと x 軸の位置関係：共有点の個数と判別式 ---- */
const AS=[-2,-1,1,2];
FIGS.h1niji_xjiku=host=>mk(host,{alt:'放物線を動かして、x 軸との共有点の個数と判別式の符号を見る図',
  sliders:[{k:'i',label:'a',min:0,max:3,step:1,v:2,fmt:i=>n(AS[i])},{k:'b',label:'b',min:-4,max:4,step:1,v:-2},{k:'c',label:'c',min:-4,max:4,step:.5,v:-1}],
  play:{k:'c',from:-4,to:4,label:'c を大きくする',ms:3600},
  draw(v){const a=AS[v.i],b=v.b,c=v.c,D=b*b-4*a*c,g=x=>a*x*x+b*x+c,P=plot([-5,5,-5.6,5.6]).grid().curve(g,C);
    let read=`y = ${quad(a,b,c)}<br>D = b² − 4ac = ${dex(b*b,4*a*c)} = <b>${n(D)}</b><br>`;
    if(D>1e-9){const r=Math.sqrt(D),x1=(-b-r)/(2*a),x2=(-b+r)/(2*a),lo=Math.min(x1,x2),hi=Math.max(x1,x2);P.dot(lo,0,'var(--gold)').dot(hi,0,'var(--gold)');
      read+=`D ＞ 0：x 軸と<b>異なる2点で交わる</b><br>共有点の x 座標 ${Number.isInteger(r)?'=':'≈'} ${n(lo)}, ${n(hi)}`;}
    else if(D>-1e-9){P.dot(-b/(2*a),0,'var(--gold)',5.5);read+=`D = 0：x 軸と<b>1点で接する</b><br>接点の x 座標 = ${n(-b/(2*a))}`;}
    else read+=`D ＜ 0：x 軸と<b>共有点をもたない</b><br>グラフ全体が x 軸の${a>0?'上':'下'}側にある`;
    return {svg:P.out(),read};}});

/* ---- なぜ：頂点の y 座標 q と判別式 D。y = a(x − 2)² + q ---- */
const AH=[-2,-1,1,2];
FIGS.h1niji_hanbetsu=host=>mk(host,{alt:'放物線の頂点を上下に動かして、頂点の y 座標と判別式の関係を見る図',
  sliders:[{k:'q',label:'頂点の y 座標 q',min:-3,max:3,step:.5,v:-1},{k:'i',label:'a',min:0,max:3,step:1,v:2,fmt:i=>n(AH[i])}],
  play:{k:'q',from:-3,to:3,label:'頂点を下から上へ動かす',ms:3600},
  draw(v){const a=AH[v.i],q=v.q,b=-4*a,c=4*a+q,D=b*b-4*a*c,g=x=>a*(x-2)*(x-2)+q,P=plot([-2.5,6.5,-5.2,5.2]).grid().curve(g,C),k=-q/a;
    if(q)P.seg(2,0,2,q,AR).txt(2,q/2,'q','dx="9" dy="4" fill="var(--gold)" '+T);
    if(k>1e-9){const r=Math.sqrt(k);P.dot(2-r,0,'var(--ink)',4).dot(2+r,0,'var(--ink)',4);}
    P.dot(2,q,'var(--gold)',5.5);
    const cnt=k>1e-9?2:Math.abs(q)<1e-9?1:0;
    return {svg:P.out(),read:`y = ${vform(a,2,q)} = ${quad(a,b,c)}<br>頂点の y 座標 q = <b>${n(q)}</b><br>D = b² − 4ac = ${dex(b*b,4*a*c)} = <b>${n(D)}</b><br>−D ÷ 4a = ${n(-D/(4*a))}（q と同じ値）<br>x 軸との共有点は <b>${cnt} 個</b>`};}});

/* ---- 二次不等式：グラフが x 軸より上・下にある範囲を読む。y = x² − 2x + c ---- */
const OPS=['＞ 0','≧ 0','＜ 0','≦ 0'];
FIGS.h1niji_futoshiki=host=>mk(host,{alt:'放物線が x 軸より上にある範囲と下にある範囲から、二次不等式の解を読む図',
  sliders:[{k:'m',label:'不等号',min:1,max:4,step:1,v:1,fmt:m=>OPS[m-1]},{k:'c',label:'c',min:-3,max:3,step:1,v:-3}],
  draw(v){const c=v.c,m=v.m,r2=1-c,g=x=>x*x-2*x+c,x0=-3.6,x1=5.6,P=plot([x0,x1,-4.6,6.4]).grid(),up=m<=2,eq=m%2===0;
    const OKF='fill="var(--ok)" fill-opacity=".2"',NGF='fill="var(--ng)" fill-opacity=".24"',SOL='stroke="var(--gold)" stroke-width="5"';
    const end=x=>{P.dot(x,0,'var(--gold)',5.5);if(!eq)P.dot(x,0,'var(--bg2)',2.8);};
    let ans,sub='';
    if(r2>0){const s=Math.sqrt(r2),al=1-s,be=1+s,ex=Number.isInteger(s),A=ex?n(al):`1 − √${n(r2)}`,B=ex?n(be):`1 + √${n(r2)}`,lt=eq?'≦':'＜';
      P.under(g,x0,al,OKF).under(g,al,be,NGF).under(g,be,x1,OKF);
      if(up)P.seg(x0,0,al,0,SOL).seg(be,0,x1,0,SOL);else P.seg(al,0,be,0,SOL);
      P.curve(g,C);end(al);end(be);
      ans=up?`x ${lt} ${A}、${B} ${lt} x`:`${A} ${lt} x ${lt} ${B}`;if(!ex)sub=`<br>（√${n(r2)} ≈ ${n(s)} なので、境目は約 ${n(al)} と ${n(be)}）`;}
    else if(r2===0){P.under(g,x0,x1,OKF);if(up)P.seg(x0,0,x1,0,SOL);P.curve(g,C);
      if(m===1){P.dot(1,0,'var(--gold)',5.5).dot(1,0,'var(--bg2)',2.8);ans='x = 1 以外のすべての実数';}
      else if(m===2)ans='すべての実数';else if(m===3)ans='解なし';else{P.dot(1,0,'var(--gold)',5.5);ans='x = 1';}
      sub='<br>グラフは x = 1 で x 軸に接する';}
    else{P.under(g,x0,x1,OKF);if(up)P.seg(x0,0,x1,0,SOL);P.curve(g,C);ans=up?'すべての実数':'解なし';sub='<br>グラフは x 軸と共有点をもたず、常に上側にある';}
    return {svg:P.out(),read:`${quad(1,-2,c)} ${OPS[m-1]}<br>グラフが x 軸より${up?'上':'下'}にある${eq?'（x 軸上の点も含む）':''} x の範囲を読む<br>解：<b>${ans}</b>${sub}`};}});

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
const Q={
 kakoi:{alt:'壁を1辺として、残りの3辺を金網で囲んだ長方形の囲いの図',h:190,f(d){const L=86,Rr=254,top=46,bot=140,FN='stroke="var(--c)" stroke-width="3.2" fill="none" stroke-linejoin="round"';
   d.line(30,top,310,top,'stroke="var(--ink)" stroke-width="2.2"');
   for(let x=38;x<=306;x+=14)d.line(x,top,x+9,top-10,'stroke="var(--muted)" stroke-width="1"');
   d.raw(`<rect x="${L}" y="${top}" width="${Rr-L}" height="${bot-top}" fill="var(--c)" fill-opacity=".14"/>`);
   d.path(`M${L},${top} L${L},${bot} L${Rr},${bot} L${Rr},${top}`,FN);
   tx(d,170,top-16,'壁','var(--muted)');tx(d,L-18,(top+bot)/2+4,'x m');tx(d,Rr+20,(top+bot)/2+4,'x m');tx(d,170,bot+19,'(12 − 2x) m');
   return '金網 12 m で3辺を囲む。壁の側には金網を使わない';}}
};
FIGS.h1niji_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){const d=draw(),r=q.f(d);return {svg:d.out(),read:r};}});};
})();
