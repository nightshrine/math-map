/* 中学3年「平方根」の図（FIGS.m3heihokon_*）。正方形の面積と1辺、小数ではさむ図、根号をふくむ式の計算の図 */
(function(){
const {draw,n,mk}=FIG;
const f=v=>v.toFixed(1);
const DSH='stroke="var(--muted)" stroke-width="1.2" fill="none" stroke-dasharray="4 4"';
const GRID='stroke="var(--line)" stroke-width="1" fill="none"';
const fill=(col,op,sw=1.2)=>`fill="var(--${col})" fill-opacity="${op}" stroke="var(--ink)" stroke-width="${sw}" stroke-linejoin="round"`;
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
const rect=(d,x,y,w,h,st)=>d.poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],st);
const M='var(--muted)',G='var(--gold)',CC='var(--c)';
// √q を a√b の形にする（q は自然数）。[a, b]
const simp=q=>{let a=1;for(let i=2;i*i<=q;i++)while(q%(i*i)===0){q/=i*i;a*=i;}return [a,q];};
const rt=q=>{const [a,b]=simp(q);return b===1?String(a):(a===1?'':a)+'√'+b;};
// 「√9 = 3」「√2 ≈ 1.414」の形
const ap=(q,dg=3)=>{const r=Math.sqrt(q);return `√${q} ${Number.isInteger(r)?'=':'≈'} ${n(r,dg)}`;};
const isq=q=>Number.isInteger(Math.sqrt(q));

/* ---- 正方形の面積と1辺 ---- */
FIGS.m3heihokon_men=host=>mk(host,{alt:'方眼の上に、面積 a の正方形をかいた図。1辺の長さが a の正の平方根になる',
  sliders:[{k:'a',label:'正方形の面積 a',min:1,max:25,step:1,v:7}],play:{k:'a',from:1,to:25,label:'面積を大きくしていく',ms:5200},
  draw(v){const a=v.a,r=Math.sqrt(a),u=38,x0=82,yb=220,d=draw(),lo=Math.floor(r+1e-9),it=lo*lo===a;
    for(let i=0;i<=5;i++){d.line(x0+i*u,yb,x0+i*u,yb-5*u,GRID).line(x0,yb-i*u,x0+5*u,yb-i*u,GRID);tx(d,x0+i*u,yb+15,String(i),M,10);if(i)tx(d,x0-8,yb-i*u+4,String(i),M,10,'end');}
    rect(d,x0,yb-r*u,r*u,r*u,fill('c',.32,1.6));
    tx(d,x0+r*u/2,yb-r*u/2+4,a>=3?'面積 '+a:String(a));
    tx(d,x0+r*u+8,yb-r*u/2+4,it?'1辺 '+lo:'1辺 √'+a,G,12,'start');
    return {svg:d.out(),read:it?`面積 ${a} の正方形<br>1辺の長さ = √${a} = <b>${lo}</b><br>${lo}² = ${a} なので、根号を使わずに表せる`
      :`面積 ${a} の正方形<br>1辺の長さ = <b>√${a}</b> ≈ ${n(r,3)}<br>${lo}² = ${lo*lo}、${lo+1}² = ${(lo+1)*(lo+1)} なので、${lo} と ${lo+1} の間の数`};}});

/* ---- なぜ：√2 を小数ではさむ ---- */
FIGS.m3heihokon_hasamu=host=>{const NM=['整数','小数第1位','小数第2位','小数第3位','小数第4位','小数第5位'];
  mk(host,{alt:'数直線の目もりを10等分していき、2乗が2より小さい数と大きい数で、ルート2をはさむ図',
  sliders:[{k:'k',label:'どの位まで調べるか',min:0,max:5,step:1,v:1,fmt:k=>NM[k]}],play:{k:'k',from:0,to:5,label:'目もりを細かくしていく',ms:6000},
  draw(v){const k=v.k,P=Math.pow(10,k),T=2*P*P,d=draw();let m=Math.floor(Math.SQRT2*P);while(m*m>T)m--;while((m+1)*(m+1)<T)m++;
    const base=Math.floor(m/10)*10,j=m-base,X=i=>30+i*28,y=150,fm=q=>(q/P).toFixed(k);
    const sq=q=>{let s=String(q*q).padStart(2*k+1,'0');if(k){s=s.slice(0,s.length-2*k)+'.'+s.slice(s.length-2*k);s=s.replace(/0+$/,'').replace(/\.$/,'');}return s;};
    d.line(X(0),y,X(j),y,'stroke="var(--c)" stroke-width="3"').line(X(j+1),y,X(10),y,'stroke="var(--ng)" stroke-width="3"').line(X(j),y,X(j+1),y,'stroke="var(--gold)" stroke-width="5"');
    for(let i=0;i<=10;i++){d.line(X(i),y-6,X(i),y+6,'stroke="var(--muted)" stroke-width="1"');d.dot(X(i),y,i<=j?CC:'var(--ng)',3.6);}
    const xs=30+(Math.SQRT2*P-base)*28;d.path(`M${f(xs)},${y-9} l-5,-9 l10,0 Z`,'fill="var(--gold)" stroke="none"');tx(d,xs,y-24,'√2',G);
    tx(d,X(0),96,'● 2乗すると 2 より小さい',CC,11,'start');tx(d,X(10),76,'2乗すると 2 より大きい ●','var(--ng)',11,'end');
    tx(d,X(j),y+22,fm(m),G,11,j===0?'middle':'end');tx(d,X(j+1),y+22,fm(m+1),G,11,j===9?'middle':'start');
    if(j>0)tx(d,X(0),y+40,fm(base),M,11);if(j<9)tx(d,X(10),y+40,fm(base+10),M,11);
    tx(d,170,40,'1 目もり = '+(k?(1/P).toFixed(k):'1'),M,11);
    return {svg:d.out(),read:`${fm(m)}² = ${sq(m)}（2 より小さい）<br>${fm(m+1)}² = ${sq(m+1)}（2 より大きい）<br>だから <b>${fm(m)} ＜ √2 ＜ ${fm(m+1)}</b>`};}});};

/* ---- 分数を小数で表す：わり算のあまりがくり返す ---- */
FIGS.m3heihokon_shosu=host=>mk(host,{alt:'分数をわり算で小数に直し、商の数字と、そのたびのあまりを並べた図',h:190,
  sliders:[{k:'p',label:'分子',min:1,max:12,step:1,v:1},{k:'q',label:'分母',min:2,max:13,step:1,v:7}],
  draw(v){const p=v.p,q=v.q,d=draw(),N=15,I=Math.floor(p/q);let r=p%q;const dg=[],rm=[],seen={};let cs=-1,ce=-1,end=-1;
    for(let i=0;i<N;i++){if(r===0){end=i;break;}if(seen[r]!==undefined&&cs<0){cs=seen[r];ce=i;}seen[r]===undefined&&(seen[r]=i);r*=10;dg.push(Math.floor(r/q));r%=q;rm.push(r);}
    const L=ce-cs,X=i=>78+i*16,y=64;
    tx(d,170,34,`${p} ÷ ${q}`,'var(--ink)',13);tx(d,8,y+16,'商',M,11,'start');tx(d,8,y+50,'あまり',M,10,'start');
    rect(d,50,y,16,24,'fill="none" stroke="var(--muted)" stroke-width="1"');tx(d,58,y+17,String(I));tx(d,71,y+19,'.','var(--ink)',14);tx(d,58,y+50,String(p%q),M,9);
    dg.forEach((g,i)=>{const cyc=cs>=0&&i>=cs,k=cyc?Math.floor((i-cs)/L):-1;
      rect(d,X(i),y,16,24,cyc?`fill="var(--${k%2?'c':'gold'})" fill-opacity=".3" stroke="var(--muted)" stroke-width="1"`:'fill="none" stroke="var(--muted)" stroke-width="1"');
      tx(d,X(i)+8,y+17,String(g));tx(d,X(i)+8,y+50,String(rm[i]),cyc&&k===0?G:M,9);});
    if(cs>=0){d.dot(X(cs)+8,y-7,G,2.4);if(L>1)d.dot(X(ce-1)+8,y-7,G,2.4);tx(d,X(N)+9,y+17,'…',M,12);}
    let s=I+'.'+dg.join(''),read;
    if(p%q===0)read=`${p} ÷ ${q} = ${I}<br>わり切れて、<b>整数</b>になる`;
    else if(end>=0)read=`${p} ÷ ${q} = ${s}<br>あまりが 0 になって、わり切れる<br><b>有限小数</b>`;
    else read=`${p} ÷ ${q} = ${s}…<br>あまりは ${q} より小さい自然数なので、いつか同じあまりが現れる<br><b>循環小数</b>（${dg.slice(cs,ce).join('')} の ${L} けたをくり返す）`;
    return {svg:d.out(),read};}});

/* ---- 近似値と真の値の範囲 ---- */
FIGS.m3heihokon_kinji=host=>mk(host,{alt:'数直線の上で、真の値と、小数第2位を四捨五入した近似値、その近似値になる真の値の範囲を示す図',h:200,
  sliders:[{k:'a',label:'真の値 a',min:12,max:13,step:.01,v:12.34}],play:{k:'a',from:12,to:13,label:'真の値を動かす',ms:6000},
  draw(v){const h=Math.round(v.a*100),r10=Math.floor((h+5)/10),d=draw(),X=q=>20+(q-1190)/120*300,y=112,er=r10*10-h;
    d.line(8,y,332,y,'stroke="var(--muted)" stroke-width="1.2"');
    for(let t=1200;t<=1300;t+=10){d.line(X(t),y-5,X(t),y+5,'stroke="var(--muted)" stroke-width="1"');if(t%50===0)tx(d,X(t),y+38,(t/100).toFixed(1),M,10);}
    const lo=r10*10-5,hi=r10*10+5;
    d.line(X(lo),y,X(hi),y,'stroke="var(--gold)" stroke-width="5" stroke-linecap="butt"');
    d.circle(X(lo),y,4.5,'fill="var(--gold)" stroke="var(--gold)" stroke-width="1.6"').circle(X(hi),y,4.5,'fill="var(--bg2)" stroke="var(--gold)" stroke-width="1.6"');
    d.line(X(r10*10),y-16,X(r10*10),y+5,'stroke="var(--gold)" stroke-width="1.6"');tx(d,X(r10*10),y-36,'近似値',G,11);tx(d,X(r10*10),y-21,(r10/10).toFixed(1),G,12);
    d.path(`M${f(X(h))},${y+9} l-5,9 l10,0 Z`,'fill="var(--c)" stroke="none"');tx(d,X(h),y+62,'真の値 '+(h/100).toFixed(2),CC,11,h<1215?'start':h>1285?'end':'middle');
    return {svg:d.out(),read:`真の値 a = ${(h/100).toFixed(2)}<br>小数第2位を四捨五入した近似値 <b>${(r10/10).toFixed(1)}</b><br>誤差 = ${(r10/10).toFixed(1)} − ${(h/100).toFixed(2)} = ${n(er/100)}<br>近似値が ${(r10/10).toFixed(1)} になる範囲：${(lo/100).toFixed(2)} ≦ a ＜ ${(hi/100).toFixed(2)}`};}});

/* ---- √ の中を簡単にする：面積 b の正方形を k×k 個並べる ---- */
FIGS.m3heihokon_kantan=host=>{const B=[2,3,5,6,7];
  mk(host,{alt:'面積 b の正方形を縦横に k 個ずつ並べて、大きい正方形を作った図',
  sliders:[{k:'k',label:'縦横に並べる個数 k',min:2,max:4,step:1,v:2},{k:'j',label:'小さい正方形の面積 b',min:0,max:4,step:1,v:1,fmt:j=>String(B[j])}],
  draw(v){const k=v.k,b=B[v.j],S=126+18*k,s=S/k,x0=176-S/2,y0=126-S/2,d=draw(),q=k*k*b;
    for(let i=0;i<k;i++)for(let j=0;j<k;j++){rect(d,x0+i*s,y0+j*s,s,s,fill((i+j)%2?'gold':'c',.26,1));tx(d,x0+i*s+s/2,y0+j*s+s/2+4,String(b),M,11);}
    rect(d,x0,y0,S,S,'fill="none" stroke="var(--ink)" stroke-width="2"');
    tx(d,x0+s/2,y0+S+16,'√'+b,CC);tx(d,x0-8,y0+S/2+4,'√'+q,G,12,'end');tx(d,x0+S/2,y0-9,`√${b} が ${k} 個`,M,11);
    return {svg:d.out(),read:`面積 ${b} の正方形が ${k} × ${k} = ${k*k} 個。全体の面積は ${q}<br>全体の1辺：面積から <b>√${q}</b><br>小さい正方形の1辺 √${b} の ${k} 個分：<b>${k}√${b}</b><br>だから √${q} = ${k}√${b} ≈ ${n(k*Math.sqrt(b),3)}`};}});};

/* ---- なぜ：縦 √a、横 √b の長方形の面積 ---- */
FIGS.m3heihokon_seki=host=>mk(host,{alt:'方眼の上に、縦がルート a、横がルート b の長方形をかいた図',
  sliders:[{k:'a',label:'a',min:1,max:9,step:1,v:2},{k:'b',label:'b',min:1,max:9,step:1,v:5}],
  draw(v){const a=v.a,b=v.b,u=54,x0=96,yb=206,d=draw(),h=Math.sqrt(a)*u,w=Math.sqrt(b)*u,nm=q=>{const r=Math.sqrt(q);return Number.isInteger(r)?`√${q} = ${r}`:`√${q}`;};
    for(let i=0;i<=3;i++){d.line(x0+i*u,yb,x0+i*u,yb-3*u,GRID).line(x0,yb-i*u,x0+3*u,yb-i*u,GRID);tx(d,x0+i*u,yb+15,String(i),M,10);if(i)tx(d,x0-8,yb-i*u+4,String(i),M,10,'end');}
    rect(d,x0,yb-h,w,h,fill('c',.34,1.6));
    tx(d,x0+w/2,yb-h-8,'横 '+nm(b),G,11);tx(d,x0+w+7,yb-h/2+4,'縦 '+nm(a),G,11,'start');
    const S=Math.sqrt(a)*Math.sqrt(b);
    return {svg:d.out(),read:`縦 ${ap(a,4)}、横 ${ap(b,4)}<br>面積 = √${a} × √${b} ${isq(a)&&isq(b)?'=':'≈'} <b>${n(S,4)}</b><br>√(${a} × ${b}) = √${a*b} ${isq(a*b)?'=':'≈'} <b>${n(Math.sqrt(a*b),4)}</b>`};}});

/* ---- √a + √b と √(a+b) を長さでくらべる ---- */
FIGS.m3heihokon_wa=host=>mk(host,{alt:'長さルート a とルート b の棒をつないだものと、長さルート (a+b) の棒をくらべる図',h:220,
  sliders:[{k:'a',label:'a',min:1,max:18,step:1,v:2},{k:'b',label:'b',min:1,max:18,step:1,v:8}],
  draw(v){const a=v.a,b=v.b,u=33,x0=26,d=draw(),ra=Math.sqrt(a),rb=Math.sqrt(b),rs=Math.sqrt(a+b),[ca,qa]=simp(a),[cb,qb]=simp(b);
    for(let i=0;i<=9;i++){d.line(x0+i*u,44,x0+i*u,186,GRID);tx(d,x0+i*u,202,String(i),M,10);}
    rect(d,x0,62,ra*u,26,fill('c',.4));rect(d,x0+ra*u,62,rb*u,26,fill('gold',.4));rect(d,x0,136,rs*u,26,fill('ok',.34));
    tx(d,x0+ra*u/2,55,'√'+a,CC,11);tx(d,x0+ra*u+rb*u/2,55,'√'+b,G,11);tx(d,x0+rs*u/2,129,`√(${a} + ${b}) = √${a+b}`,'var(--ok)',11,rs*u<110?'start':'middle');
    let t;if(qa===1&&qb===1)t=`根号をはずすと ${ca} + ${cb} = <b>${ca+cb}</b>`;
    else if(qa===qb){const c=ca+cb;t=`根号の中をそろえると ${rt(a)} + ${rt(b)} = <b>${c}√${qa}</b>`;}
    else t=`${ca>1||cb>1?`簡単にしても ${rt(a)} + ${rt(b)}。`:''}`+(qa===1||qb===1?'整数と、根号のついた数は、まとめられない':'根号の中がちがうので、まとめられない');
    return {svg:d.out(),read:`√${a} + √${b} ${isq(a)&&isq(b)?'=':'≈'} ${n(ra,3)} + ${n(rb,3)} = <b>${n(ra+rb,3)}</b><br>√(${a} + ${b}) = √${a+b} ${isq(a+b)?'=':'≈'} <b>${n(rs,3)}</b>（上の和より小さい）<br>${t}`};}});

/* ---- 平方根の利用：面積を k 倍にする ---- */
FIGS.m3heihokon_bai=host=>mk(host,{alt:'もとの図形と、面積を k 倍にした図形を重ねた図。長さはルート k 倍になる',
  sliders:[{k:'k',label:'面積を何倍にするか',min:1,max:9,step:1,v:2},{k:'m',label:'形',min:1,max:2,step:1,v:1,fmt:m=>['円','正方形'][m-1]}],play:{k:'k',from:1,to:9,label:'面積を大きくしていく',ms:4200},
  draw(v){const k=v.k,r=Math.sqrt(k),it=Number.isInteger(r),d=draw(),lab=it?(r===1?'':String(r)):'√'+k;
    if(v.m===1){const cx=170,cy=126,r0=36,R=r0*r;
      d.circle(cx,cy,R,fill('gold',.22)).circle(cx,cy,r0,fill('c',.45));
      d.line(cx,cy,cx+r0,cy,'stroke="var(--ink)" stroke-width="1.6"');tx(d,cx+r0/2,cy+15,'r');
      if(k>1){const ex=cx-R*Math.SQRT1_2,ey=cy-R*Math.SQRT1_2;d.line(cx,cy,ex,ey,'stroke="var(--gold)" stroke-width="1.8"');tx(d,ex+2,ey-7,lab+' × r',G,12,'end');}
      d.dot(cx,cy,'var(--ink)',2.5);}
    else{const x0=76,yb=222,s0=62,S=s0*r;
      rect(d,x0,yb-S,S,S,fill('gold',.22));rect(d,x0,yb-s0,s0,s0,fill('c',.45));
      tx(d,x0+s0/2,yb-s0/2+4,'a²');tx(d,x0+s0/2,yb+15,'a',M);if(k>1){tx(d,x0+S/2,yb-S-8,lab+' × a',G);tx(d,x0+S-8,yb-S+18,k+'a²',G,12,'end');}}
    return {svg:d.out(),read:`面積を ${k} 倍にする<br>長さ（${v.m===1?'半径':'1辺'}）は √${k} ${it?'=':'≈'} <b>${n(r,3)} 倍</b><br>`+(k===1?'もとの図形':it?`長さを ${r} 倍にすると、面積は ${r} × ${r} = ${k} 倍`:`長さを ${k} 倍にすると、面積は ${k*k} 倍になってしまう`)};}});

/* ---- 平方根の利用：A 判の紙 ---- */
FIGS.m3heihokon_kami=host=>{const SZ=[[841,1189],[594,841],[420,594],[297,420],[210,297],[148,210],[105,148]];
  mk(host,{alt:'A0 判の紙を半分、また半分と切っていき、A1 から A5 までの大きさを示した図',
  sliders:[{k:'n',label:'紙の大きさ',min:0,max:5,step:1,v:4,fmt:q=>'A'+q}],play:{k:'n',from:0,to:5,label:'半分に切っていく',ms:4800},
  draw(v){const k=v.n,d=draw(),W=297,H=210,x0=21.5,y0=20;let R=[x0,y0,W,H];const P=[[x0,y0,W,H]];
    for(let i=1;i<=5;i++){const [x,y,w,h]=R;if(w>h){P.push([x,y,w/2,h]);R=[x+w/2,y,w/2,h];}else{P.push([x,y,w,h/2]);R=[x,y+h/2,w,h/2];}}
    rect(d,x0,y0,W,H,k===0?fill('gold',.3,1.6):'fill="none" stroke="var(--ink)" stroke-width="1.6"');
    for(let i=1;i<=5;i++){const [x,y,w,h]=P[i];rect(d,x,y,w,h,i===k?fill('gold',.36,1.4):fill('c',.12,1));tx(d,x+w/2,y+h/2+4,'A'+i,i===k?G:M,i>=4?10:12);}
    if(k===0)tx(d,x0+12,y0+18,'A0（全体）',G,11,'start');
    const [a,b]=SZ[k];
    return {svg:d.out(),read:`A${k}：${a} mm × ${b} mm<br>長い辺 ÷ 短い辺 = ${b} ÷ ${a} ≈ <b>${n(b/a,3)}</b><br>√2 = 1.41421… に近い（長さは mm に丸めてある）<br>半分に切った A${k+1} も、ほぼ同じ比になる`};}});};

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
const Q={
 naname:{alt:'1辺 2 cm の正方形の各辺の中点を結んで、中に斜めの正方形を作った図。点線で8つの直角二等辺三角形に分かれる',h:204,f(d){const x0=95,y0=24,S=150,h=S/2;
   rect(d,x0,y0,S,S,fill('c',.2,1.6));d.poly([[x0+h,y0],[x0+S,y0+h],[x0+h,y0+S],[x0,y0+h]],fill('gold',.34,1.6));
   d.line(x0+h,y0,x0+h,y0+S,DSH).line(x0,y0+h,x0+S,y0+h,DSH);
   tx(d,x0+h/2,y0+S+16,'1 cm',M,11);tx(d,x0+h+h/2,y0+S+16,'1 cm',M,11);tx(d,x0-8,y0+h/2+4,'1 cm',M,11,'end');tx(d,x0-8,y0+h+h/2+4,'1 cm',M,11,'end');return '外側は1辺 2 cm の正方形（面積 4 cm²）';}},
 naname5:{alt:'1辺 3 cm の正方形の各辺を 1 cm と 2 cm に分ける点を順に結んで、中に正方形を作った図',h:212,f(d){const x0=95,y0=22,u=52,p=(x,y)=>[x0+x*u,y0+(3-y)*u];
   rect(d,x0,y0,3*u,3*u,fill('c',.2,1.6));for(let i=1;i<3;i++)d.line(x0+i*u,y0,x0+i*u,y0+3*u,GRID).line(x0,y0+i*u,x0+3*u,y0+i*u,GRID);
   d.poly([p(1,0),p(3,1),p(2,3),p(0,2)],fill('gold',.34,1.6));
   tx(d,x0+u/2,y0+3*u+16,'1 cm',M,11);tx(d,x0+2*u,y0+3*u+16,'2 cm',M,11);tx(d,x0+3*u+8,y0+2.5*u+4,'1 cm',M,11,'start');tx(d,x0+3*u+8,y0+u+4,'2 cm',M,11,'start');return '外側は1辺 3 cm の正方形（面積 9 cm²）';}}
};
FIGS.m3heihokon_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){const d=draw(),r=q.f(d);return {svg:d.out(),read:r};}});};
})();
