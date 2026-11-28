/* 中学2年「式の計算と連立方程式」の図（FIGS.m2shiki_*）。動かせる図と、問題に付ける図（m2shiki_q） */
(function(){
const {draw,plot,n,mk,C,DASH}=FIG;
const f=v=>v.toFixed(1);
const FC='fill="var(--c)" fill-opacity=".3" stroke="var(--c)" stroke-width="1.4"';
const FG='fill="var(--gold)" fill-opacity=".3" stroke="var(--gold)" stroke-width="1.4"';
const SUB='stroke="var(--muted)" stroke-width="1.2" fill="none"';
const GD='stroke="var(--gold)" stroke-width="1.6" fill="none" stroke-dasharray="5 4"';
const LG='stroke="var(--gold)" stroke-width="2.4"';
const HALO='paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round"';
// 文字（線に重なっても読めるよう、地の色でふちどる）
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" ${HALO}>${t}</text>`);
const rect=(d,x,y,w,h,st,rx=0)=>d.raw(`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" ${st}/>`);
const STEP=(k=4)=>({sliders:[{k:'s',label:'手順',min:1,max:k,step:1,v:1}],play:{k:'s',from:1,to:k,label:'順に見る',ms:1100*k}});
// 係数つきの項。1a は a、−1a は −a と書く
const co=(k,s)=>(k===1?'':k===-1?'−':n(k))+s;

/* ---- 同類項をまとめる：長さ a の棒と長さ b の棒 ---- */
FIGS.m2shiki_tiles=host=>mk(host,{alt:'長さ a の棒と長さ b の棒を並べ、同じ長さの棒どうしを集める図',
  sliders:[{k:'a',label:'a の長さ',min:1,max:3,step:.5,v:2},{k:'b',label:'b の長さ',min:1,max:3,step:.5,v:1.5}],
  draw(v){const a=v.a,b=v.b,u=12,H=22,d=draw();
    const row=(y,seq)=>{let x=14;seq.forEach(([k,ch])=>{const w=(ch==='a'?a:b)*u,x0=x;
      for(let i=0;i<k;i++){rect(d,x,y,w,H,ch==='a'?FC:FG);if(w>=18)tx(d,x+w/2,y+15,ch,'var(--ink)',11);x+=w;}
      tx(d,(x0+x)/2,y-8,co(k,ch),ch==='a'?'var(--c)':'var(--gold)',12);});};
    tx(d,14,22,'式の順に並べる','var(--muted)',11,'start');
    row(52,[[3,'a'],[2,'b'],[2,'a'],[1,'b']]);
    tx(d,14,118,'同じ文字の項を集める','var(--muted)',11,'start');
    row(148,[[5,'a'],[3,'b']]);
    tx(d,170,214,'3a + 2b + 2a + b = 5a + 3b','var(--ink)',13);
    const T=5*a+3*b;
    return {svg:d.out(),read:`a = ${n(a)}、b = ${n(b)} のとき<br>3a + 2b + 2a + b = ${n(3*a)} + ${n(2*b)} + ${n(2*a)} + ${n(b)} = ${n(T)}<br>5a + 3b = ${n(5*a)} + ${n(3*b)} = <b>${n(T)}</b><br>a の棒は 5 本、b の棒は 3 本`+(a===b?'<br>いまは長さが同じでも、文字がちがえば別の項':'')};}});

/* ---- 数 × 多項式：横 2a+b の帯を k 段重ねる ---- */
FIGS.m2shiki_bunpai=host=>mk(host,{alt:'横の長さが 2a+b の帯を k 段重ねた長方形の図',
  sliders:[{k:'k',label:'段の数 k',min:1,max:4,step:1,v:3},{k:'a',label:'a の長さ',min:1,max:3,step:.5,v:2},{k:'b',label:'b の長さ',min:1,max:3,step:.5,v:1}],
  draw(v){const k=v.k,a=v.a,b=v.b,u=30,x0=52,y0=54,rh=34,d=draw(),ws=[a*u,a*u,b*u],ch=['a','a','b'];
    for(let r=0;r<k;r++){let x=x0;ws.forEach((w,i)=>{rect(d,x,y0+r*rh,w,rh,ch[i]==='a'?FC:FG);tx(d,x+w/2,y0+r*rh+21,ch[i],'var(--ink)',12);x+=w;});}
    let x=x0;ws.forEach((w,i)=>{tx(d,x+w/2,y0-8,ch[i],ch[i]==='a'?'var(--c)':'var(--gold)',12);x+=w;});
    tx(d,(x0+x)/2,y0-28,'横 2a + b','var(--muted)',11);tx(d,26,y0+k*rh/2+4,'縦 '+k,'var(--muted)',11);
    tx(d,170,y0+4*rh+26,`${k} × (2a + b) = ${co(2*k,'a')} + ${co(k,'b')}`,'var(--ink)',13);
    const T=k*(2*a+b);
    return {svg:d.out(),read:`${k} × (2a + b)<br>a の長方形が ${k} × 2 = ${2*k} 個、b の長方形が ${k} 個<br>= <b>${co(2*k,'a')} + ${co(k,'b')}</b><br>a = ${n(a)}、b = ${n(b)} のとき、どちらも ${n(T)}`};}});

/* ---- 単項式の乗法・除法：縦 nb、横 ma の長方形 ---- */
FIGS.m2shiki_menseki=host=>mk(host,{alt:'縦 nb、横 ma の長方形を、縦 b、横 a の小さな長方形に分けた図',
  sliders:[{k:'m',label:'横に並べる a の個数',min:1,max:4,step:1,v:3},{k:'n',label:'縦に並べる b の個数',min:1,max:3,step:1,v:2}],
  draw(v){const m=v.m,k=v.n,cw=56,rh=42,x0=88,y0=62,d=draw();
    for(let r=0;r<k;r++)for(let c=0;c<m;c++){rect(d,x0+c*cw,y0+r*rh,cw,rh,FC);tx(d,x0+c*cw+cw/2,y0+r*rh+rh/2+4,'ab','var(--ink)',12);}
    for(let c=0;c<m;c++)tx(d,x0+c*cw+cw/2,y0-8,'a','var(--gold)',12);
    for(let r=0;r<k;r++)tx(d,x0-11,y0+r*rh+rh/2+4,'b','var(--gold)',12);
    rect(d,x0,y0,m*cw,k*rh,'fill="none" stroke="var(--ink)" stroke-width="1.8"');
    tx(d,x0+m*cw/2,y0-30,'横 '+co(m,'a'),'var(--muted)',12);tx(d,40,y0+k*rh/2+4,'縦 '+co(k,'b'),'var(--muted)',12);
    tx(d,170,y0+3*rh+30,`${co(m,'a')} × ${co(k,'b')} = ${co(m*k,'ab')}`,'var(--ink)',13);
    return {svg:d.out(),read:`横 ${co(m,'a')}、縦 ${co(k,'b')} の長方形<br>ab の長方形が ${m} × ${k} = ${m*k} 個<br>${co(m,'a')} × ${co(k,'b')} = <b>${co(m*k,'ab')}</b><br>逆に ${co(m*k,'ab')} ÷ ${co(k,'b')} = ${co(m,'a')}（面積 ÷ 縦 = 横）`};}});

/* ---- なぜ：カレンダーで並んだ3つの数の和（arg.m = 2 で、はじめから縦） ---- */
const CAL=[8,9,10,11,14,15,16,17,18,21,22,23];
FIGS.m2shiki_calendar=(host,arg)=>mk(host,{alt:'カレンダーで、並んだ3つの数を選んで和を調べる図',
  sliders:[{k:'i',label:'まん中の数',min:0,max:11,step:1,v:1,fmt:i=>String(CAL[i])},{k:'m',label:'並び方',min:1,max:2,step:1,v:(arg&&arg.m)||1,fmt:m=>['横','縦'][m-1]}],
  draw(v){const c=CAL[v.i],st=v.m===1?1:7,sel=[c-st,c,c+st],cw=40,rh=36,x0=30,y0=40,d=draw();
    '日月火水木金土'.split('').forEach((w,j)=>tx(d,x0+j*cw+cw/2,y0-12,w,'var(--muted)',11));
    for(let day=1;day<=30;day++){const idx=day+1,r=Math.floor(idx/7),col=idx%7,x=x0+col*cw,y=y0+r*rh,on=sel.includes(day);
      rect(d,x+2,y+2,cw-4,rh-4,day===c?FG:on?FC:'fill="none" stroke="var(--line)" stroke-width="1"',4);
      tx(d,x+cw/2,y+rh/2+4,String(day),on?'var(--ink)':'var(--muted)',12);}
    return {svg:d.out(),read:`${c} − ${st}、${c}、${c} + ${st} を選んだ<br>${sel[0]} + ${sel[1]} + ${sel[2]} = <b>${3*c}</b><br>${3*c} = 3 × ${c}（まん中の数の 3 倍）`+(v.m===2?'<br>真下の数は 7 大きい':'')};}});

/* ---- 2けたの数と、位を入れかえた数の和 ---- */
FIGS.m2shiki_keta=host=>mk(host,{alt:'2けたの数と位を入れかえた数を、11 のまとまりに組み直す図',
  sliders:[{k:'a',label:'十の位の数 a',min:1,max:9,step:1,v:4},{k:'b',label:'一の位の数 b',min:1,max:9,step:1,v:7}],
  draw(v){const a=v.a,b=v.b,N=10*a+b,M=10*b+a,bw=80,sq=10,ph=16,y0=80,d=draw();
    const SC='fill="var(--c)" fill-opacity=".55" stroke="var(--c)" stroke-width="1"',SG='fill="var(--gold)" fill-opacity=".55" stroke="var(--gold)" stroke-width="1"';
    tx(d,170,20,`もとの数 ${N} = 10 × ${a} + ${b}`,'var(--c)',12);tx(d,170,39,`入れかえた数 ${M} = 10 × ${b} + ${a}`,'var(--gold)',12);
    tx(d,90,66,`11 が ${a} 個`,'var(--ink)',12);tx(d,250,66,`11 が ${b} 個`,'var(--ink)',12);
    d.line(170,54,170,228,'stroke="var(--line)" stroke-width="1"');
    for(let i=0;i<a;i++){const y=y0+i*ph;rect(d,43,y,bw,sq,SC);rect(d,43+bw+4,y,sq,sq,SG);}
    for(let i=0;i<b;i++){const y=y0+i*ph;rect(d,203,y,sq,sq,SC);rect(d,203+sq+4,y,bw,sq,SG);}
    return {svg:d.out(),read:`${N} + ${M} = <b>${N+M}</b><br>棒（10）と四角（1）を組にすると 11<br>11 が ${a} + ${b} = ${a+b} 個で ${N+M}<br>(10a + b) + (10b + a) = 11(a + b)`};}});

/* ---- 円周の差は、半径によらない ---- */
FIGS.m2shiki_doro=host=>mk(host,{alt:'半径 r の円と、半径が h だけ大きい円の円周をくらべる図',
  sliders:[{k:'r',label:'内側の半径 r',min:2,max:6,step:.5,v:3},{k:'h',label:'半径の差 h',min:.5,max:2,step:.5,v:1}],play:{k:'r',from:2,to:6,label:'r を大きくする',ms:3200},
  draw(v){const r=v.r,h=v.h,u=13.5,cx=170,cy=125,R=r*u,H=h*u,d=draw();
    d.circle(cx,cy,R+H,'fill="var(--gold)" fill-opacity=".18" stroke="var(--gold)" stroke-width="2.4"').circle(cx,cy,R,'fill="var(--bg2)" stroke="var(--c)" stroke-width="2.4"');
    d.line(cx,cy,cx+R,cy,'stroke="var(--c)" stroke-width="1.6"').line(cx+R,cy,cx+R+H,cy,'stroke="var(--gold)" stroke-width="3.4"');d.dot(cx,cy,'var(--ink)',2.5);
    tx(d,cx+R/2,cy-7,'r','var(--c)',12);tx(d,cx+R+H+9,cy+4,'h','var(--gold)',12);
    return {svg:d.out(),read:`内側の円周 2π × ${n(r)} = ${co(2*r,'π')}<br>外側の円周 2π × ${n(r+h)} = ${co(2*(r+h),'π')}<br>差 = <b>${co(2*h,'π')}</b> ≈ ${n(2*Math.PI*h)}<br>r を変えても、差は変わらない`};}});

/* ---- 表で、2つの方程式を同時に満たす組を探す ---- */
FIGS.m2shiki_hyo=host=>mk(host,{alt:'x の値ごとに、2つの方程式を満たす y の値を並べた表',h:170,
  sliders:[{k:'x',label:'x',min:0,max:5,step:1,v:0}],play:{k:'x',from:0,to:5,label:'x を 0 から 5 まで動かす',ms:4200},
  draw(v){const x=v.x,d=draw(),x0=14,hw=98,cw=35.6,y0=48,rh=34,ok=x===2,LN='stroke="var(--line)" stroke-width="1"';
    tx(d,x0,24,'① x + y = 5','var(--c)',12,'start');tx(d,x0+150,24,'② 2x − y = 1','var(--gold)',12,'start');
    rect(d,x0+hw+x*cw,y0,cw,rh*3,ok?'fill="var(--gold)" fill-opacity=".32" stroke="var(--gold)" stroke-width="1.8"':'fill="var(--muted)" fill-opacity=".22" stroke="var(--muted)" stroke-width="1.2"');
    for(let r=0;r<=3;r++)d.line(x0,y0+r*rh,x0+hw+6*cw,y0+r*rh,LN);
    d.line(x0,y0,x0,y0+3*rh,LN);for(let c=0;c<=6;c++)d.line(x0+hw+c*cw,y0,x0+hw+c*cw,y0+3*rh,LN);
    [['x','var(--ink)',i=>i],['① を満たす y','var(--c)',i=>5-i],['② を満たす y','var(--gold)',i=>2*i-1]].forEach(([lab,col,g],r)=>{
      tx(d,x0+8,y0+r*rh+22,lab,col,11.5,'start');for(let i=0;i<=5;i++)tx(d,x0+hw+i*cw+cw/2,y0+r*rh+22,n(g(i)),'var(--ink)',12);});
    return {svg:d.out(),read:`x = ${x} のとき<br>① を満たす y は ${n(5-x)}、② を満たす y は ${n(2*x-1)}<br>`+(ok?'<b>x = 2、y = 3</b> は ① と ② の両方を満たす<br>これが連立方程式の解':'y がちがうので、両方を満たす組ではない')};}});

/* ---- 加減法：2つの式を絵にして、差をとる ---- */
FIGS.m2shiki_hikaku=host=>mk(host,Object.assign(STEP(4),{alt:'2つの式を丸と四角の絵にして、共通な部分をひくと1種類だけが残ることを示す図',
  draw(v){const s=v.s,d=draw(),ci=(x,y)=>d.circle(x,y,12,FC),sq=(x,y)=>rect(d,x-11,y-11,22,22,FG);
    tx(d,24,62,'①','var(--ink)',13);ci(64,58);ci(96,58);ci(140,58);sq(180,58);sq(212,58);tx(d,268,63,'= 21','var(--ink)',14);
    tx(d,24,122,'②','var(--ink)',13);ci(140,118);sq(180,118);sq(212,118);tx(d,268,123,'= 11','var(--ink)',14);
    if(s===2){rect(d,122,40,108,36,GD,6);rect(d,122,100,108,36,GD,6);}
    if(s>=3){rect(d,46,40,68,36,GD,6);d.line(14,150,312,150,SUB);tx(d,28,190,'①−②','var(--muted)',11);ci(64,186);ci(96,186);
      tx(d,124,191,s===3?'= 21 − 11 = 10':'= 10','var(--ink)',14,'start');}
    if(s>=4)tx(d,170,230,'○ = 5、□ = 3','var(--gold)',14);
    return {svg:d.out(),read:['<b>手順 1</b>　○ を x、□ を y とする<br>① 3x + 2y = 21<br>② x + 2y = 11','<b>手順 2</b>　① と ② には、同じ「○ 1個と □ 2個」がある<br>② から、その値は 11',
      '<b>手順 3</b>　① から ② をひく<br>左辺の差は ○ 2個、右辺の差は 21 − 11<br>2x = 10（y が消えた）','<b>手順 4</b>　2x = 10 より x = 5<br>② に代入して 5 + 2y = 11、y = 3<br><b>x = 5、y = 3</b>'][s-1]};}}));

/* ---- 加減法：式を何倍かして、係数をそろえる ---- */
FIGS.m2shiki_soroeru=host=>mk(host,{alt:'2つの方程式をそれぞれ何倍かして、係数をそろえる図',h:196,
  sliders:[{k:'m',label:'① を何倍するか',min:1,max:5,step:1,v:1},{k:'n',label:'② を何倍するか',min:1,max:5,step:1,v:1}],
  draw(v){const m=v.m,k=v.n,d=draw(),A=[3*m,2*m,12*m],B=[2*k,5*k,19*k],ex=A[0]===B[0],ey=A[1]===B[1];
    const term=(x,y,t,hit)=>{if(hit)rect(d,x-36,y-17,42,24,'fill="var(--gold)" fill-opacity=".28" stroke="var(--gold)" stroke-width="1.4"',4);tx(d,x,y,t,'var(--ink)',14,'end');};
    const row=(y,lab,col,q)=>{tx(d,16,y,lab,col,13,'start');term(134,y,q[0]+'x',ex);tx(d,160,y,'+','var(--ink)',14);term(214,y,q[1]+'y',ey);tx(d,244,y,'=','var(--ink)',14);tx(d,304,y,String(q[2]),'var(--ink)',14,'end');};
    row(46,'①×'+m,'var(--c)',A);row(86,'②×'+k,'var(--gold)',B);d.line(14,106,312,106,SUB);
    const cx=A[0]-B[0],cy=A[1]-B[1],cr=A[2]-B[2];tx(d,16,140,'ひくと','var(--muted)',12,'start');
    if(cx!==0)tx(d,134,140,co(cx,'x'),'var(--ink)',14,'end');
    if(cy!==0){if(cx!==0)tx(d,160,140,cy<0?'−':'+','var(--ink)',14);tx(d,214,140,co(cx!==0?Math.abs(cy):cy,'y'),'var(--ink)',14,'end');}
    tx(d,244,140,'=','var(--ink)',14);tx(d,304,140,n(cr),'var(--ink)',14,'end');
    tx(d,170,178,ex?`y だけの式になった → y = ${n(cr/cy)}`:ey?`x だけの式になった → x = ${n(cr/cx)}`:'文字が2つ残っている',ex||ey?'var(--gold)':'var(--muted)',13);
    return {svg:d.out(),read:`①×${m}：${A[0]}x + ${A[1]}y = ${A[2]}<br>②×${k}：${B[0]}x + ${B[1]}y = ${B[2]}<br>`+(ex?`x の係数が ${A[0]} にそろった<br>ひくと ${co(cy,'y')} = ${n(cr)}、y = 3<br>① に代入して <b>x = 2、y = 3</b>`:ey?`y の係数が ${A[1]} にそろった<br>ひくと ${co(cx,'x')} = ${n(cr)}、x = 2<br>① に代入して <b>x = 2、y = 3</b>`:`x の係数は ${A[0]} と ${B[0]}、y の係数は ${A[1]} と ${B[1]}<br>どちらもそろっていない`)};}});

/* ---- 代入法：□ を、等しいもので置きかえる ---- */
FIGS.m2shiki_okikae=host=>mk(host,Object.assign(STEP(4),{alt:'式の中の四角を、それと等しい「丸と 3」で置きかえることを示す図',
  draw(v){const s=v.s,d=draw(),ci=(x,y)=>d.circle(x,y,12,FC),sq=(x,y)=>rect(d,x-11,y-11,22,22,FG);
    tx(d,24,50,'②','var(--ink)',13);ci(66,46);ci(98,46);sq(138,46);tx(d,172,51,'= 12','var(--ink)',14,'start');
    tx(d,24,110,'①','var(--ink)',13);sq(66,106);tx(d,96,111,'=','var(--ink)',14);ci(126,106);tx(d,146,111,'+ 3','var(--ink)',14,'start');
    if(s>=2){rect(d,122,30,32,32,GD,6);rect(d,108,88,70,36,GD,6);d.path('M140,88 L139,68',`stroke="var(--gold)" stroke-width="1.6" fill="none"`).path('M134,74 L139,65 L144,74','stroke="var(--gold)" stroke-width="1.6" fill="none"');}
    if(s>=3){d.line(14,136,312,136,SUB);tx(d,28,170,'代入','var(--muted)',11);ci(66,166);ci(98,166);rect(d,120,148,70,36,GD,6);ci(138,166);tx(d,157,171,'+ 3','var(--ink)',14,'start');tx(d,200,171,'= 12','var(--ink)',14,'start');}
    if(s>=4)tx(d,170,222,'○ 3個 = 9 → ○ = 3、□ = 3 + 3 = 6','var(--gold)',13);
    return {svg:d.out(),read:['<b>手順 1</b>　○ を x、□ を y とする<br>② 2x + y = 12<br>① y = x + 3','<b>手順 2</b>　① から、□ は「○ 1個と 3」に等しい<br>② の □ を、これで置きかえる',
      '<b>手順 3</b>　2x + (x + 3) = 12<br>文字が x だけの方程式になった<br>3x + 3 = 12','<b>手順 4</b>　3x = 9 より x = 3<br>① に代入して y = 3 + 3 = 6<br><b>x = 3、y = 6</b>'][s-1]};}}));

/* ---- なぜ：解を表す点を細かく打つと直線になる ---- */
const RG=[-3.3,8,-2,6.3],E1=x=>5-x,E2=x=>2*x-1;
FIGS.m2shiki_narabu=host=>mk(host,{alt:'二元一次方程式の解を表す点を細かく打っていくと、直線になる図',
  sliders:[{k:'k',label:'x のきざみ',min:1,max:5,step:1,v:1,fmt:k=>['1','0.5','0.25','0.1','直線'][k-1]},{k:'e',label:'方程式',min:1,max:2,step:1,v:1,fmt:e=>['① x + y = 5','② 2x − y = 1'][e-1]}],
  play:{k:'k',from:1,to:5,label:'きざみを細かくする',ms:4500},
  draw(v){const p=plot(RG).grid(),g=v.e===1?E1:E2,col=v.e===1?'var(--c)':'var(--gold)',nm=v.e===1?'① x + y = 5':'② 2x − y = 1';let cnt=0;
    if(v.k===5)p.curve(g,`stroke="${col}" stroke-width="2.4"`);
    else{const st=[1,.5,.25,.1][v.k-1],m=Math.round(1/st);for(let i=Math.ceil(RG[0]*m);i<=RG[1]*m;i++){const x=i/m,y=g(x);if(y>RG[2]+.05&&y<RG[3]-.05){p.dot(x,y,col,[4.5,3.6,2.8,2][v.k-1]);cnt++;}}}
    p.txt(4.5,5.5,nm,`fill="${col}" ${HALO}`);
    return {svg:p.out(),read:v.k===5?`きざみを限りなく細かくすると<br>点の集まりは<b>直線</b>になる<br>直線上の点の座標は、すべて ${nm.slice(0,1)} の解`:
      `${nm} の解を<br>x を ${['1','0.5','0.25','0.1'][v.k-1]} きざみで点にした<br>図の範囲に <b>${cnt} 個</b><br>`+(v.k===1?(v.e===1?'(0, 5)、(1, 4)、(2, 3)、(3, 2) など':'(0, −1)、(1, 1)、(2, 3)、(3, 5)'):'点は一直線に並んでいる')};}});

/* ---- なぜ：同じ x で、2つの直線上の点をくらべる ---- */
FIGS.m2shiki_koten=host=>mk(host,{alt:'2つの二元一次方程式の直線と、同じ x の値での2つの点をくらべる図',
  sliders:[{k:'x',label:'x',min:0,max:3,step:.25,v:.5}],play:{k:'x',from:0,to:3,label:'x を左から右へ動かす',ms:4000},
  draw(v){const x=v.x,p=plot(RG).grid(),y1=E1(x),y2=E2(x),hit=Math.abs(y1-y2)<1e-9,up=y1>y2;
    p.curve(E1,C).curve(E2,LG).seg(x,RG[2],x,RG[3],DASH);
    p.txt(4.5,5.5,'① x + y = 5',`fill="var(--c)" ${HALO}`).txt(4.5,4.75,'② 2x − y = 1',`fill="var(--gold)" ${HALO}`);
    if(hit)p.dot(2,3,'var(--ink)',6).txt(2,3,'(2, 3)',`dx="13" dy="4" fill="var(--ink)" ${HALO}`);
    else{p.seg(x,y1,x,y2,'stroke="var(--ink)" stroke-width="2"').dot(x,y1,'var(--c)').dot(x,y2,'var(--gold)');
      // 値の文字は、2直線にはさまれた側（交点の左では左、右では右）に置く
      const lab=(y,c,hi)=>p.txt(x,y,n(y),`fill="${c}" ${HALO} `+(up?'dx="-9" text-anchor="end"':'dx="9"')+` dy="${hi?15:-7}"`);
      if(Math.abs(y1-y2)>=1.5){lab(y1,'var(--c)',up);lab(y2,'var(--gold)',!up);}}
    return {svg:p.out(),read:hit?'x = 2 のとき、2つの点が重なる<br>交点 <b>(2, 3)</b><br>x = 2、y = 3 は ① も ② も満たす<br>これが連立方程式の解':
      `x = ${n(x)} のとき<br>① の直線上の点 (${n(x)}, ${n(y1)})<br>② の直線上の点 (${n(x)}, ${n(y2)})<br>y がちがうので、両方を満たす組ではない`};}});

/* ---- 連立方程式の利用：歩く道のりと、かかる時間 ---- */
FIGS.m2shiki_michinori=host=>mk(host,{alt:'1800 m の道のりを歩く部分と走る部分に分け、それぞれにかかる時間を帯で示す図',h:226,
  sliders:[{k:'x',label:'歩く道のり（m）',min:0,max:1800,step:100,v:300}],play:{k:'x',from:0,to:1800,label:'歩く道のりを増やす',ms:4200},
  draw(v){const x=v.x,y=1800-x,t1=x/60,t2=y/150,T=12+x/100,d=draw(),x0=30,W=280,px=x/1800*W,ts=9;
    tx(d,x0,22,'道のり（全部で 1800 m）','var(--muted)',11,'start');
    if(px>0)rect(d,x0,32,px,22,FC);if(px<W)rect(d,x0+px,32,W-px,22,FG);
    tx(d,17,48,'家','var(--ink)',12);tx(d,323,48,'駅','var(--ink)',12);
    tx(d,x0,72,`歩く ${x} m`,'var(--c)',12,'start');tx(d,x0+W,72,`走る ${y} m`,'var(--gold)',12,'end');
    tx(d,x0,112,'時間（歩く速さは分速 60 m、走る速さは分速 150 m）','var(--muted)',11,'start');
    if(t1>0)rect(d,x0,122,t1*ts,22,FC);if(t2>0)rect(d,x0+t1*ts,122,t2*ts,22,FG);
    d.line(x0+18*ts,116,x0+18*ts,152,'stroke="var(--ink)" stroke-width="1.4" stroke-dasharray="4 3"');tx(d,x0+18*ts,167,'18 分','var(--ink)',11);
    tx(d,x0,190,`歩く ${n(t1,1)} 分`,'var(--c)',12,'start');tx(d,x0+100,190,`走る ${n(t2,1)} 分`,'var(--gold)',12,'start');tx(d,x0+W,190,`合計 ${n(T)} 分`,T===18?'var(--gold)':'var(--ink)',13,'end');
    return {svg:d.out(),read:`歩く ${x} m ÷ 60 = ${n(t1,1)} 分<br>走る ${y} m ÷ 150 = ${n(t2,1)} 分<br>合計 <b>${n(T)} 分</b><br>`+(T===18?'18 分ちょうど。条件に合う':T<18?`18 分より ${n(18-T)} 分短い`:`18 分より ${n(T-18)} 分長い`)};}});

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
const Q={
 g1:{alt:'2つの方程式 x − y = 1 と x + 2y = 7 の解を表す2本の直線の図',f(){const p=plot([-2.3,9,-2,6.3]).grid().curve(x=>x-1,C).curve(x=>(7-x)/2,LG);
   p.txt(5.6,5.5,'①',`fill="var(--c)" text-anchor="end" ${HALO}`).txt(-1.6,4.9,'②',`fill="var(--gold)" ${HALO}`);
   return {svg:p.out(),read:'① x − y = 1　② x + 2y = 7<br>方眼の1目もりは 1'};}},
 g2:{alt:'2つの方程式 x + y = 3 と 2x + 2y = 10 の解を表す、平行な2本の直線の図',f(){const p=plot([-2.3,9,-2,6.3]).grid().curve(x=>3-x,C).curve(x=>5-x,LG);
   p.txt(.9,1.3,'①',`fill="var(--c)" text-anchor="end" ${HALO}`).txt(3.3,2.5,'②',`fill="var(--gold)" ${HALO}`);
   return {svg:p.out(),read:'① x + y = 3　② 2x + 2y = 10<br>方眼の1目もりは 1'};}}
};
FIGS.m2shiki_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){return q.f();}});};
})();
