/* 中学3年「二次方程式」の図（FIGS.m3niji_*）。代入して解を探す図、正方形を完成させる図、解の公式、通路の問題など */
(function(){
const {draw,n,sg,mk}=FIG;
const f=v=>v.toFixed(1);
const DSH='stroke="var(--muted)" stroke-width="1.2" fill="none" stroke-dasharray="4 4"';
const AX='stroke="var(--muted)" stroke-width="1.2" fill="none"';
const fill=(col,op,sw=1.2)=>`fill="var(--${col})" fill-opacity="${op}" stroke="var(--ink)" stroke-width="${sw}" stroke-linejoin="round"`;
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
const rect=(d,x,y,w,h,st)=>d.poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],st);
const M='var(--muted)',G='var(--gold)',CC='var(--c)';
const simp=q=>{let a=1;for(let i=2;i*i<=q;i++)while(q%(i*i)===0){q/=i*i;a*=i;}return [a,q];};
const par=x=>x<0?`(${n(x)})`:n(x);                                   // 負の数はかっこに入れる
const es=(a,b,c)=>(a===1?'':a)+'x²'+(b?` ${b<0?'−':'+'} ${Math.abs(b)===1?'':Math.abs(b)}x`:'')+(c?` ${sg(c)}`:''); // ax² + bx + c
const fac=p=>p===0?'x':`(x ${p>0?'−':'+'} ${Math.abs(p)})`;        // (x − p)
// 数直線（中心 cx が 0、1 目もり u px）
const nline=(d,y,cx,u,lo,hi,step=1)=>{d.line(cx+lo*u-8,y,cx+hi*u+8,y,AX);for(let k=lo;k<=hi;k++){d.line(cx+k*u,y-4,cx+k*u,y+4,AX);if(k%step===0)tx(d,cx+k*u,y+19,n(k),M,10);}};

/* ---- x に数を代入して、解を探す ---- */
FIGS.m3niji_dainyu=host=>{const E=[[-2,-3],[0,-4],[-4,4],[1,-6]];
  mk(host,{alt:'x に整数を代入したときの左辺の値を、棒の長さで表した図。値が 0 になる x が解',h:214,
  sliders:[{k:'x',label:'代入する x の値',min:-3,max:5,step:1,v:0},{k:'e',label:'方程式',min:1,max:4,step:1,v:1,fmt:e=>es(1,...E[e-1])+' = 0'}],play:{k:'x',from:-3,to:5,label:'x に −3 から 5 まで代入する',ms:5400},
  draw(v){const [b,c]=E[v.e-1],g=x=>x*x+b*x+c,X=x=>52+(x+3)*33,y0=124,u=4,d=draw(),val=g(v.x);
    rect(d,X(v.x)-15,160,30,44,'fill="var(--gold)" fill-opacity=".14" stroke="var(--gold)" stroke-width="1.2"');
    d.line(30,y0,332,y0,AX);
    for(let x=-3;x<=5;x++){const w=g(x),on=x===v.x;
      if(w!==0)rect(d,X(x)-9,w>0?y0-w*u:y0,18,Math.abs(w)*u,`fill="var(--${w>0?'c':'ng'})" fill-opacity="${on?.9:.36}" stroke="none"`);else d.dot(X(x),y0,G,on?6.5:4.5);
      tx(d,X(x),177,n(x),on?'var(--ink)':M,11);tx(d,X(x),197,n(w),w===0?G:on?'var(--ink)':M,11);}
    tx(d,6,177,'x',M,11,'start');tx(d,6,197,'値',M,11,'start');
    const s=`${par(v.x)}²`+(b?` ${b<0?'−':'+'} ${Math.abs(b)===1?'':Math.abs(b)+' × '}${par(v.x)}`:'')+(c?` ${sg(c)}`:'');
    return {svg:d.out(),read:`${es(1,b,c)} に x = ${n(v.x)} を代入<br>${s} = <b>${n(val)}</b><br>`+(val===0?`0 になるので、x = ${n(v.x)} は解`:'0 にならないので、解ではない')};}});};

/* ---- (x+m)² = n の解：−m から両側へ √n ---- */
FIGS.m3niji_taisho=host=>mk(host,{alt:'数直線上で、(x+m)² = n の2つの解が、点 −m から左右に同じ距離だけ離れていることを示す図',h:190,
  sliders:[{k:'m',label:'m',min:-3,max:3,step:1,v:1},{k:'n',label:'n',min:0,max:9,step:1,v:4}],
  draw(v){const m=v.m,q=v.n,r=Math.sqrt(q),it=Number.isInteger(r),d=draw(),cx=170,u=22,y=118,c=-m,X=x=>cx+x*u,L=m===0?'x':`x ${sg(m)}`,rs=it?n(r):'√'+q;
    nline(d,y,cx,u,-7,7);
    d.line(X(c),y-52,X(c),y+6,DSH);tx(d,X(c),y-58,'−m = '+n(c),M,11);
    if(q>0){d.line(X(c),y-22,X(c+r),y-22,'stroke="var(--gold)" stroke-width="2"').line(X(c),y-22,X(c-r),y-22,'stroke="var(--gold)" stroke-width="2"');
      tx(d,X(c+r/2),y-29,rs,G,11);tx(d,X(c-r/2),y-29,rs,G,11);d.dot(X(c+r),y,G,5).dot(X(c-r),y,G,5);}
    else d.dot(X(c),y,G,5);
    const eq=(m===0?'x²':`(${L})²`)+` = ${q}`;let read;
    if(q===0)read=`${eq}<br>${L} = 0<br>x = <b>${n(c)}</b>（解は1つ）`;
    else if(it)read=`${eq}<br>${L} = ±${n(r)}<br>`+(m===0?'':`x = ${n(c)} ± ${n(r)}<br>`)+`x = <b>${n(c+r)}、${n(c-r)}</b>`;
    else{const [k,w]=simp(q),t=(k>1?k:'')+'√'+w;read=`${eq}<br>${L} = ±${rs}`+(k>1?` = ±${t}`:'')+`<br>x = <b>${m===0?'±'+t:n(c)+' ± '+t}</b><br>およそ ${n(c+r)} と ${n(c-r)}`;}
    return {svg:d.out(),read};}});

/* ---- 正方形を完成させる。arg.sym があれば文字（m = b/2a）、なければ数（x の係数 p） ---- */
FIGS.m3niji_kansei=(host,arg)=>{const sym=!!(arg&&arg.sym);
  mk(host,{alt:sym?'x² と長方形 2mx を並べかえ、角 m² をたして1辺 x+m の正方形にする手順の図':'x² と長方形 px を並べかえ、角をたして正方形を完成させる手順の図',
  sliders:[{k:'s',label:'手順',min:1,max:4,step:1,v:1}].concat(sym?[]:[{k:'p',label:'x の係数 p',min:2,max:8,step:2,v:6}]),play:{k:'s',from:1,to:4,label:'順に見る',ms:4400},
  draw(v){const s=v.s,p=sym?0:v.p,h=sym?'m':String(p/2),hw=sym?42:p*6.5,X=88,x0=sym?92:108-hw/2,yb=214,d=draw(),A=fill('c',.3),B=fill('gold',.3);
    const hx=sym?'mx':(p===2?'x':p/2+'x'),px=sym?'2mx':p+'x',pw=sym?'2m':String(p),cn=sym?'m²':String(p*p/4);
    rect(d,x0,yb-X,X,X,A);tx(d,x0+X/2,yb-X/2+4,'x²');tx(d,x0+X/2,yb+16,'x',M);tx(d,x0-9,yb-X/2+4,'x',M);
    if(s===1){rect(d,x0+X,yb-X,2*hw,X,B);tx(d,x0+X+hw,yb-X/2+4,px);tx(d,x0+X+hw,yb+16,pw,M);}
    if(s===2){rect(d,x0+X,yb-X,hw,X,B);rect(d,x0+X+hw,yb-X,hw,X,B);tx(d,x0+X+hw/2,yb-X/2+4,hx,'var(--ink)',hw<20?10:12);tx(d,x0+X+hw*1.5,yb-X/2+4,hx,'var(--ink)',hw<20?10:12);tx(d,x0+X+hw/2,yb+16,h,M);tx(d,x0+X+hw*1.5,yb+16,h,M);}
    if(s>=3){rect(d,x0+X,yb-X,hw,X,B);rect(d,x0,yb-X-hw,X,hw,B);tx(d,x0+X+hw/2,yb-X/2+4,hx,'var(--ink)',hw<20?10:12);tx(d,x0+X/2,yb-X-hw/2+4,hx);tx(d,x0+X+hw/2,yb+16,h,M);tx(d,x0-9,yb-X-hw/2+4,h,M);
      if(s===3){rect(d,x0+X,yb-X-hw,hw,hw,DSH);tx(d,x0+X+hw/2,yb-X-hw/2+4,'?',M);}
      else{rect(d,x0+X,yb-X-hw,hw,hw,fill('gold',.75));tx(d,x0+X+hw/2,yb-X-hw/2+4,cn,'var(--ink)',hw<20?10:12);rect(d,x0,yb-X-hw,X+hw,X+hw,'fill="none" stroke="var(--ink)" stroke-width="2.2"');}}
    const read=sym?['<b>手順 1</b>　x² + (b/a)x を、正方形 x² と長方形で表す<br>x の係数 b/a の半分を m とおく（m = b/2a）<br>長方形は縦 x、横 2m','<b>手順 2</b>　長方形を、横 m ずつの2つに切る','<b>手順 3</b>　片方を、正方形の上へ移す<br>1辺 x + m の正方形に、角が足りない','<b>手順 4</b>　足りない角は m² = (b/2a)²<br><b>x² + (b/a)x + (b/2a)² = (x + b/2a)²</b>']
      :[`<b>手順 1</b>　x² + ${p}x を、正方形 x² と<br>縦 x、横 ${p} の長方形で表す`,`<b>手順 2</b>　長方形を、横 ${p/2} ずつの2つに切る`,`<b>手順 3</b>　片方を、正方形の上へ移す<br>1辺 x + ${p/2} の正方形に、角が足りない`,`<b>手順 4</b>　足りない角は ${p/2} × ${p/2} = ${p*p/4}<br><b>x² + ${p}x + ${p*p/4} = (x + ${p/2})²</b>`];
    return {svg:d.out(),read:read[s-1]};}});};

/* ---- 解の公式：係数を変えて、解を数直線で見る ---- */
FIGS.m3niji_kai=host=>mk(host,{alt:'二次方程式の係数 a, b, c を変えて、解の公式で求めた解を数直線上に示す図',h:190,
  sliders:[{k:'a',label:'a',min:1,max:3,step:1,v:1},{k:'b',label:'b',min:-6,max:6,step:1,v:2},{k:'c',label:'c',min:-6,max:6,step:1,v:-2}],
  draw(v){const a=v.a,b=v.b,c=v.c,D=b*b-4*a*c,d=draw(),cx=170,u=19.5,y=128,X=x=>cx+x*u,nb=-b;
    tx(d,170,34,es(a,b,c)+' = 0','var(--ink)',13);tx(d,170,56,`b² − 4ac = ${n(D)}`,D<0?'var(--ng)':G,12);
    nline(d,y,cx,u,-8,8,2);let read=`b² − 4ac = ${par(b)}² − 4 × ${a} × ${par(c)} = ${n(D)}<br>`;
    if(D<0)read+='根号の中が負の数になる<br>2乗して負になる数はないので、<b>解はない</b>';
    else if(D===0){const x=nb/(2*a);d.dot(X(x),y,G,5.5);tx(d,X(x),y-12,n(x),G,11);read+=`x = ${n(nb)} ÷ ${2*a} = <b>${n(x,3)}</b><br>根号の中が 0 なので、解は1つ`;}
    else{const r=Math.sqrt(D),x1=(nb-r)/(2*a),x2=(nb+r)/(2*a),[k,w]=simp(D);
      d.line(X(x1),y,X(x2),y,'stroke="var(--gold)" stroke-width="2.4"');d.dot(X(x1),y,G,5.5).dot(X(x2),y,G,5.5);d.line(X(nb/(2*a)),y-9,X(nb/(2*a)),y+9,'stroke="var(--gold)" stroke-width="1.4"');
      tx(d,X(x1)-2,y-12,n(x1),G,11,'end');tx(d,X(x2)+2,y-12,n(x2),G,11,'start');
      read+=`x = (${n(nb)} ± √${D}) ÷ ${2*a}`+(w===1?` = (${n(nb)} ± ${k}) ÷ ${2*a}<br>x = <b>${n(x2,3)}、${n(x1,3)}</b>`:(k>1?` = (${n(nb)} ± ${k}√${w}) ÷ ${2*a}`:'')+`<br>およそ <b>${n(x2,3)} と ${n(x1,3)}</b>`);}
    return {svg:d.out(),read};}});

/* ---- 積が 0 になるのは、どちらかが 0 のとき ---- */
FIGS.m3niji_seki=host=>{const E=[[2,-3],[1,4],[0,3],[2,2]],nm=e=>fac(E[e-1][0])+fac(E[e-1][1])+' = 0';
  mk(host,{alt:'x の値を変えたときの、2つの因数の値と、その積の値を、棒の長さで表した図',h:214,
  sliders:[{k:'x',label:'x',min:-6,max:6,step:1,v:0},{k:'e',label:'方程式',min:1,max:4,step:1,v:1,fmt:nm}],play:{k:'x',from:-6,to:6,label:'x を −6 から 6 まで動かす',ms:6200},
  draw(v){const [p,q]=E[v.e-1],x=v.x,A=x-p,B=x-q,P=A*B,d=draw(),cx=176;
    const bar=(y,val,u,lab)=>{tx(d,10,y-7,lab,val===0?G:'var(--ink)',12,'start');
      if(val===0)d.dot(cx,y+11,G,6);else rect(d,val>0?cx:cx+val*u,y,Math.abs(val)*u,22,`fill="var(--${val>0?'ok':'ng'})" fill-opacity=".5" stroke="var(--${val>0?'ok':'ng'})" stroke-width="1.2"`);};
    const bare=w=>w===0?'x':`x ${w>0?'−':'+'} ${Math.abs(w)}`;bar(44,A,14,`${bare(p)} = ${n(A)}`);bar(98,B,14,`${bare(q)} = ${n(B)}`);bar(158,P,2,`積 = ${n(P)}`);
    d.line(cx,30,cx,188,AX);tx(d,cx,204,'0',M,10);
    return {svg:d.out(),read:`x = ${n(x)} のとき<br>${fac(p)}${fac(q)} = ${par(A)} × ${par(B)} = <b>${n(P)}</b><br>`+(P===0?`${A===0?fac(p):fac(q)} が 0 なので、積も 0。x = ${n(x)} は解`:'どちらも 0 でないので、積は 0 にならない')};}});};

/* ---- 利用：通路の幅と花だんの面積 ---- */
FIGS.m3niji_michi=host=>mk(host,{alt:'縦 12 m、横 18 m の土地に、幅 x m の通路を縦と横に1本ずつ作り、残りを花だんにした図',
  sliders:[{k:'x',label:'通路の幅 x（m）',min:.5,max:6,step:.5,v:1},{k:'t',label:'通路を端に寄せる（0 から 1 へ）',min:0,max:1,step:.02,v:0}],play:{k:'t',from:0,to:1,label:'通路を端に寄せる',ms:3000},
  draw(v){const x=v.x,t=v.t,u=14,x0=50,y0=34,d=draw(),px=7+(18-x-7)*t,py=4+(12-x-4)*t,P=(a,b)=>[x0+a*u,y0+b*u],R=(a,b,w,h,st)=>{if(w>.01&&h>.01)d.poly([P(a,b),P(a+w,b),P(a+w,b+h),P(a,b+h)],st);};
    const F='fill="var(--ok)" fill-opacity=".36" stroke="var(--ok)" stroke-width="1"',W='fill="var(--muted)" fill-opacity=".28" stroke="none"';
    R(0,0,px,py,F);R(px+x,0,18-px-x,py,F);R(0,py+x,px,12-py-x,F);R(px+x,py+x,18-px-x,12-py-x,F);R(px,0,x,12,W);R(0,py,18,x,W);
    R(0,0,18,12,'fill="none" stroke="var(--ink)" stroke-width="1.6"');
    tx(d,x0+9*u,y0+12*u+17,'18 m',M);tx(d,x0-8,y0+6*u+4,'12 m',M,12,'end');tx(d,x0+(px+x/2)*u,y0-8,'x',G);tx(d,x0+18*u+8,y0+(py+x/2)*u+4,'x',G,12,'start');
    if(t>.99){tx(d,x0+(18-x)*u/2,y0+(12-x)*u/2-4,'花だん');tx(d,x0+(18-x)*u/2,y0+(12-x)*u/2+13,'縦 12 − x、横 18 − x',M,11);}
    const S=(18-x)*(12-x);
    return {svg:d.out(),read:`通路の幅 x = ${n(x)} m<br>花だんの面積 = (18 − x)(12 − x) = ${n(18-x)} × ${n(12-x)} = <b>${n(S)}</b> m²<br>`+(S===160?'目標の 160 m² になった':S>160?'目標の 160 m² より広い':'目標の 160 m² よりせまい')+(t<.01?'<br>通路を端に寄せても、花だんの面積は変わらない':'')};}});

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
const Q={
 doten:{alt:'1辺 10 cm の正方形 ABCD で、点 P が辺 AB 上を A から B へ、点 Q が辺 BC 上を B から C へ動く図',h:208,f(d){const x0=96,y0=24,S=150,A=[x0,y0],B=[x0,y0+S],C=[x0+S,y0+S],D=[x0+S,y0],P=[x0,y0+45],Qp=[x0+45,y0+S];
   d.poly([A,B,C,D],'stroke="var(--ink)" stroke-width="1.6" fill="none"');d.poly([P,B,Qp],fill('gold',.34,1.4));d.dot(P[0],P[1],'var(--ink)',3.5).dot(Qp[0],Qp[1],'var(--ink)',3.5);
   tx(d,A[0]-9,A[1]+2,'A');tx(d,B[0]-9,B[1]+12,'B');tx(d,C[0]+10,C[1]+12,'C');tx(d,D[0]+10,D[1]+2,'D');tx(d,P[0]-9,P[1]+4,'P');tx(d,Qp[0],Qp[1]+16,'Q');
   tx(d,x0-9,y0+27,'x',CC,12);tx(d,x0+22,y0+S+16,'x',CC);tx(d,x0-9,y0+101,'10 − x',M,11,'end');tx(d,x0+S/2+24,y0+S+16,'10 cm',M,11);return 'P は A から B へ、Q は B から C へ、どちらも毎秒 1 cm で動く';}},
 hako:{alt:'1辺 x cm の正方形の厚紙の四すみから、1辺 3 cm の正方形を切り取った図',h:204,f(d){const x0=95,y0=20,S=150,c=38;
   rect(d,x0,y0,S,S,fill('c',.2,1.6));[[0,0],[S-c,0],[0,S-c],[S-c,S-c]].forEach(q=>rect(d,x0+q[0],y0+q[1],c,c,'fill="var(--bg2)" stroke="var(--muted)" stroke-width="1.2" stroke-dasharray="4 4"'));
   rect(d,x0+c,y0+c,S-2*c,S-2*c,fill('gold',.3,1.2));tx(d,x0+S/2,y0+S/2+4,'底面');tx(d,x0+S/2,y0+S+17,'x cm',M);tx(d,x0-8,y0+c/2+4,'3 cm',M,11,'end');return '四すみを切り取り、点線で折ると、深さ 3 cm の箱になる';}},
 calendar:{alt:'ある月のカレンダー。ある日の真上の数は 7 小さく、真下の数は 7 大きい',h:206,f(d){const x0=44,y0=18,w=36,h=26,W=['日','月','火','水','木','金','土'];
   W.forEach((s,i)=>tx(d,x0+i*w+w/2,y0+17,s,M,11));
   for(let k=1;k<=30;k++){const i=(k+2)%7,j=Math.floor((k+2)/7),on=k===10,nb=k===3||k===17;
     if(on||nb)rect(d,x0+i*w+3,y0+(j+1)*h+2,w-6,h-4,on?'fill="var(--gold)" fill-opacity=".3" stroke="var(--gold)" stroke-width="1.2"':'fill="var(--c)" fill-opacity=".25" stroke="var(--c)" stroke-width="1.2"');
     tx(d,x0+i*w+w/2,y0+(j+1)*h+18,String(k),on?G:nb?'var(--ink)':M,11);}
   return '例：10 日の真上は 3 日、真下は 17 日';}}
};
FIGS.m3niji_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){const d=draw(),r=q.f(d);return {svg:d.out(),read:r};}});};
})();
