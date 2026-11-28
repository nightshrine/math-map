/* 中学3年「展開と因数分解」の図（FIGS.m3tenkai_*）。乗法の公式と因数分解を、長方形の面積で見る図 */
(function(){
const {draw,n,mk}=FIG;
const f=v=>v.toFixed(1);
const DSH='stroke="var(--muted)" stroke-width="1.2" fill="none" stroke-dasharray="4 4"';
const GD='stroke="var(--gold)" stroke-width="1.8" fill="none" stroke-dasharray="5 4"';
const GRID='stroke="var(--ink)" stroke-opacity=".3" stroke-width=".8" fill="none"';
const fill=(col,op,sw=1.2)=>`fill="var(--${col})" fill-opacity="${op}" stroke="var(--ink)" stroke-width="${sw}" stroke-linejoin="round"`;
// 文字（線に重なっても読めるよう、地の色でふちどる）
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
const rect=(d,x,y,w,h,st)=>d.poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],st);
const M='var(--muted)',G='var(--gold)';

/* ---- (a+b)(c+d)：長方形を4つに分ける ---- */
FIGS.m3tenkai_bunpai=host=>mk(host,{alt:'縦 a+b、横 c+d の長方形を、4つの長方形に分けた図',
  sliders:[{k:'b',label:'b',min:1,max:4,step:1,v:2},{k:'d',label:'d',min:1,max:4,step:1,v:3}],
  draw(v){const a=3,c=4,b=v.b,e=v.d,u=24,W=(c+e)*u,H=(a+b)*u,x0=188-W/2,y0=132-H/2,d=draw();
    rect(d,x0,y0,c*u,a*u,fill('c',.25));rect(d,x0+c*u,y0,e*u,a*u,fill('c',.5));rect(d,x0,y0+a*u,c*u,b*u,fill('gold',.2));rect(d,x0+c*u,y0+a*u,e*u,b*u,fill('gold',.5));
    tx(d,x0+c*u/2,y0+a*u/2+4,'ac');tx(d,x0+c*u+e*u/2,y0+a*u/2+4,'ad');tx(d,x0+c*u/2,y0+a*u+b*u/2+4,'bc');tx(d,x0+c*u+e*u/2,y0+a*u+b*u/2+4,'bd');
    tx(d,x0+c*u/2,y0-8,'c = 4',M);tx(d,x0+c*u+e*u/2,y0-8,'d = '+e,M);tx(d,x0-8,y0+a*u/2+4,'a = 3',M,12,'end');tx(d,x0-8,y0+a*u+b*u/2+4,'b = '+b,M,12,'end');
    const S=(a+b)*(c+e);
    return {svg:d.out(),read:`全体：(a + b)(c + d) = ${a+b} × ${c+e} = <b>${S}</b><br>4つの和：ac + ad + bc + bd<br>= ${a*c} + ${a*e} + ${b*c} + ${b*e} = <b>${S}</b>`};}});

/* ---- (x+a)(x+b)：x²、ax、bx、ab ---- */
FIGS.m3tenkai_xab=host=>mk(host,{alt:'横 x+a、縦 x+b の長方形を、x²、ax、bx、ab の4つに分けた図',
  sliders:[{k:'a',label:'a',min:1,max:5,step:1,v:2},{k:'b',label:'b',min:1,max:5,step:1,v:3}],
  draw(v){const X=92,u=18,a=v.a,b=v.b,W=X+a*u,H=X+b*u,x0=178-W/2,y0=132-H/2,d=draw(),k=q=>q===1?'x':q+'x';
    rect(d,x0,y0,X,X,fill('c',.28));rect(d,x0+X,y0,a*u,X,fill('gold',.25));rect(d,x0,y0+X,X,b*u,fill('gold',.25));rect(d,x0+X,y0+X,a*u,b*u,fill('c',.55));
    for(let i=1;i<a;i++)d.line(x0+X+i*u,y0,x0+X+i*u,y0+H,GRID);for(let j=1;j<b;j++)d.line(x0,y0+X+j*u,x0+W,y0+X+j*u,GRID);
    tx(d,x0+X/2,y0+X/2+4,'x²');tx(d,x0+X+a*u/2,y0+X/2+4,k(a));tx(d,x0+X/2,y0+X+b*u/2+4,k(b));tx(d,x0+X+a*u/2,y0+X+b*u/2+4,String(a*b));
    tx(d,x0+X/2,y0-8,'x',M);tx(d,x0+X+a*u/2,y0-8,String(a),M);tx(d,x0-9,y0+X/2+4,'x',M);tx(d,x0-9,y0+X+b*u/2+4,String(b),M);
    return {svg:d.out(),read:`(x + ${a})(x + ${b})<br>= x² + ${k(a)} + ${k(b)} + ${a*b}<br>= x² + <b>${a+b}</b>x + <b>${a*b}</b><br>x の係数は ${a} + ${b}、数の項は ${a} × ${b}`};}});

/* ---- なぜ：(a+b)² ---- */
FIGS.m3tenkai_wa2=host=>mk(host,{alt:'1辺 a+b の正方形を、a²、ab、ab、b² の4つに分けた図',
  sliders:[{k:'a',label:'a',min:2,max:5,step:1,v:4},{k:'b',label:'b',min:1,max:4,step:1,v:2}],
  draw(v){const a=v.a,b=v.b,u=22,W=(a+b)*u,x0=178-W/2,y0=132-W/2,d=draw();
    rect(d,x0,y0,a*u,a*u,fill('c',.28));rect(d,x0+a*u,y0,b*u,a*u,fill('gold',.25));rect(d,x0,y0+a*u,a*u,b*u,fill('gold',.25));rect(d,x0+a*u,y0+a*u,b*u,b*u,fill('c',.55));
    tx(d,x0+a*u/2,y0+a*u/2+4,'a²');tx(d,x0+a*u+b*u/2,y0+a*u/2+4,'ab');tx(d,x0+a*u/2,y0+a*u+b*u/2+4,'ab');tx(d,x0+a*u+b*u/2,y0+a*u+b*u/2+4,'b²');
    tx(d,x0+a*u/2,y0-8,'a',M);tx(d,x0+a*u+b*u/2,y0-8,'b',M);tx(d,x0-9,y0+a*u/2+4,'a',M);tx(d,x0-9,y0+a*u+b*u/2+4,'b',M);
    return {svg:d.out(),read:`a = ${a}、b = ${b}<br>全体：(a + b)² = ${a+b}² = <b>${(a+b)*(a+b)}</b><br>4つの和：a² + ab + ab + b²<br>= ${a*a} + ${a*b} + ${a*b} + ${b*b} = <b>${(a+b)*(a+b)}</b>`};}});

/* ---- なぜ：(a−b)²。帯を2本取り除き、引きすぎた角をもどす ---- */
FIGS.m3tenkai_sa2=host=>mk(host,{alt:'1辺 a の正方形から帯を2本取り除いて、1辺 a−b の正方形の面積を求める手順の図',
  sliders:[{k:'s',label:'手順',min:1,max:4,step:1,v:1},{k:'b',label:'b（a は 5 に固定）',min:1,max:3,step:1,v:2}],play:{k:'s',from:1,to:4,label:'順に見る',ms:4400},
  draw(v){const a=5,b=v.b,s=v.s,u=30,L=a*u,x0=104,y0=44,m=(a-b)*u,d=draw(),NG='fill="var(--ng)" fill-opacity=".34" stroke="none"';
    rect(d,x0,y0,L,L,fill('c',.2));
    if(s>=2)rect(d,x0,y0,L,b*u,NG);if(s>=3)rect(d,x0+m,y0,b*u,L,NG);
    if(s>=4)rect(d,x0+m,y0,b*u,b*u,'fill="var(--gold)" fill-opacity=".55" stroke="none"');
    d.line(x0,y0+b*u,x0+L,y0+b*u,DSH).line(x0+m,y0,x0+m,y0+L,DSH);
    rect(d,x0,y0+b*u,m,m,'stroke="var(--gold)" stroke-width="2.4" fill="none"');
    tx(d,x0+m/2,y0+b*u+m/2+4,'(a−b)²',G);
    if(s>=2)tx(d,x0+m/2,y0+b*u/2+4,'−ab','var(--ng)');if(s>=3)tx(d,x0+m+b*u/2,y0+b*u+m/2+4,'−ab','var(--ng)');if(s>=4)tx(d,x0+m+b*u/2,y0+b*u/2+4,'+b²',G);
    tx(d,x0+L/2,y0-9,'a',M);tx(d,x0+m/2,y0+L+16,'a − b',M);tx(d,x0+m+b*u/2,y0+L+16,'b',M);tx(d,x0-9,y0+b*u/2+4,'b',M,12,'end');tx(d,x0-9,y0+b*u+m/2+4,'a − b',M,12,'end');
    const q=(a-b)*(a-b);
    return {svg:d.out(),read:[`<b>手順 1</b>　1辺 a = 5 の正方形（面積 a² = 25）<br>金色の枠が、求めたい (a − b)²`,
      `<b>手順 2</b>　上の帯（縦 b、横 a）を取り除く<br>a² − ab = 25 − ${a*b} = ${25-a*b}`,
      `<b>手順 3</b>　右の帯（縦 a、横 b）も取り除く<br>a² − ab − ab = ${n(25-2*a*b)}<br>右上の角 b² は、2回引いている`,
      `<b>手順 4</b>　引きすぎた b² = ${b*b} を1回もどす<br>a² − 2ab + b² = 25 − ${2*a*b} + ${b*b} = <b>${q}</b><br>(a − b)² = ${a-b}² = <b>${q}</b>`][s-1]};}});

/* ---- なぜ：(a+b)(a−b)。L 字形を長方形に並べ替える ---- */
FIGS.m3tenkai_wasa=host=>mk(host,{alt:'正方形から小さい正方形を切り取った形を、長方形に並べ替える図',
  sliders:[{k:'t',label:'並べ替え（0 から 1 へ）',min:0,max:1,step:.02,v:0},{k:'b',label:'b（a は 5 に固定）',min:1,max:3,step:1,v:2}],play:{k:'t',from:0,to:1,label:'長方形に並べ替える',ms:3400},
  draw(v){const a=5,b=v.b,t=v.t,u=22,L=a*u,m=(a-b)*u,B=b*u,x0=80,yb=188,d=draw();
    rect(d,x0+m,yb-L,B,B,DSH);tx(d,x0+m+B/2,yb-L+B/2+4,'b²',M,b===1?10:12);
    rect(d,x0,yb-m,L,m,fill('c',.3));
    // 上の長方形（横 a−b、縦 b）を、中心のまわりに回しながら右へ移す
    const c0=[x0+m/2,yb-m-B/2],c1=[x0+L+B/2,yb-m/2],cx=c0[0]+(c1[0]-c0[0])*t,cy=c0[1]+(c1[1]-c0[1])*t,th=Math.PI/2*t,co=Math.cos(th),si=Math.sin(th);
    d.poly([[-m/2,-B/2],[m/2,-B/2],[m/2,B/2],[-m/2,B/2]].map(p=>[cx+p[0]*co-p[1]*si,cy+p[0]*si+p[1]*co]),fill('gold',.4));
    if(t<.01){tx(d,x0+L/2,yb+16,'a',M);tx(d,x0-9,yb-L/2+4,'a',M,12,'end');tx(d,x0+m+B/2,yb-L-8,'b',M);tx(d,x0+L+9,yb-L+B/2+4,'b',M,12,'start');}
    if(t>.99){tx(d,x0+L/2,yb+16,'a',M);tx(d,x0+L+B/2,yb+16,'b',M);tx(d,x0-9,yb-m/2+4,'a − b',M,12,'end');}
    const q=a*a-b*b;
    return {svg:d.out(),read:`a = 5、b = ${b}<br>`+(t<.01?`1辺 a の正方形から、1辺 b の正方形を切り取った形<br>面積 a² − b² = 25 − ${b*b} = <b>${q}</b>`:t>.99?`横 a + b、縦 a − b の長方形<br>面積 (a + b)(a − b) = ${a+b} × ${a-b} = <b>${q}</b>`:'上の長方形を回して、右へ移している途中<br>面積は変わらない')};}});

/* ---- 因数分解：タイルを長方形に組み直す ---- */
FIGS.m3tenkai_tile=host=>{const P=[[1,2],[2,3],[3,3],[3,4]],nm=q=>{const [a,b]=P[q-1];return `x² + ${a+b}x + ${a*b}`;};
  mk(host,{alt:'x² のタイル1枚、x のタイル、1 のタイルを、すきまなく並べて長方形にする図',
  sliders:[{k:'k',label:'式',min:1,max:4,step:1,v:2,fmt:nm},{k:'t',label:'組み立て（0 から 1 へ）',min:0,max:1,step:.02,v:0}],play:{k:'t',from:0,to:1,label:'長方形に組み立てる',ms:3400},
  draw(v){const [a,b]=P[v.k-1],t=v.t,X=72,u=16,x0=44,yb=214,d=draw(),mv=(p,q)=>p+(q-p)*t;
    rect(d,x0,yb-X,X,X,fill('c',.3));tx(d,x0+X/2,yb-X/2+4,'x²');
    for(let i=0;i<b;i++)rect(d,mv(x0+X+14+i*(u+8),x0+X+i*u),yb-X,u,X,fill('gold',.3));
    for(let j=0;j<a;j++)rect(d,x0,mv(yb-X-12-(j+1)*u-j*8,yb-X-(j+1)*u),X,u,fill('gold',.3));
    for(let j=0;j<a;j++)for(let i=0;i<b;i++)rect(d,mv(240+i*(u+7),x0+X+i*u),mv(40+j*(u+7),yb-X-(j+1)*u),u,u,fill('c',.6));
    tx(d,x0+X/2,yb+16,'x',M);tx(d,x0-9,yb-X/2+4,'x',M);
    if(t>.99){tx(d,x0+X+b*u/2,yb+16,String(b),M);tx(d,x0-9,yb-X-a*u/2+4,String(a),M);}
    return {svg:d.out(),read:`${nm(v.k)}<br>x² が 1枚、x が ${a+b}枚、1 が ${a*b}枚`+(t>.99?`<br>縦 x + ${a}、横 x + ${b} の長方形になる<br><b>${nm(v.k)} = (x + ${a})(x + ${b})</b>`:t<.01?'<br>すきまなく並べて、長方形にできるか':'<br>x のタイルを、縦と横に分けて置く')};}});};

/* ---- 式の計算の利用：道の面積 S = aℓ ---- */
FIGS.m3tenkai_michi=host=>mk(host,{alt:'正方形の土地のまわりに、幅 a の道をつけた図。道の中央を通る線を点線で示す',
  sliders:[{k:'p',label:'土地の1辺 p',min:2,max:6,step:1,v:4},{k:'a',label:'道の幅 a',min:.5,max:2,step:.5,v:1}],
  draw(v){const p=v.p,a=v.a,u=20,O=(p+2*a)*u,I=p*u,cx=160,cy=126,d=draw();
    rect(d,cx-O/2,cy-O/2,O,O,fill('c',.32));rect(d,cx-I/2,cy-I/2,I,I,'fill="var(--bg2)" stroke="var(--ink)" stroke-width="1.2"');
    const c=(p+a)*u;rect(d,cx-c/2,cy-c/2,c,c,GD);
    d.line(cx+I/2,cy,cx+O/2,cy,'stroke="var(--ink)" stroke-width="2"');
    if(p>=3)tx(d,cx,cy+4,'土地',M);tx(d,cx,cy+I/2-7,'p',M);tx(d,cx+O/2+9,cy+4,'a',M,12,'start');tx(d,cx-c/2+13,cy-c/2-(a>=1?5:9),'ℓ',G);
    const S=(p+2*a)*(p+2*a)-p*p,l=4*(p+a);
    return {svg:d.out(),read:`p = ${p}、a = ${n(a)}<br>道の面積 S = (p + 2a)² − p² = ${n((p+2*a)*(p+2*a))} − ${p*p} = <b>${n(S)}</b><br>道の中央を通る線の長さ ℓ = 4(p + a) = ${n(l)}<br>a × ℓ = ${n(a)} × ${n(l)} = <b>${n(a*l)}</b>`};}});

/* ---- 問題に付ける図（動かさない）。arg は図の名前 ---- */
const Q={
 bunkatsu:{alt:'横 x+5、縦 x+2 の長方形を、ア、イ、ウ、エの4つの長方形に分けた図',h:196,f(d){const X=92,u=16,x0=86,y0=30,W=X+5*u,H=X+2*u;
   rect(d,x0,y0,X,X,fill('c',.28));rect(d,x0+X,y0,5*u,X,fill('gold',.25));rect(d,x0,y0+X,X,2*u,fill('gold',.25));rect(d,x0+X,y0+X,5*u,2*u,fill('c',.55));
   tx(d,x0+X/2,y0+X/2+4,'ア');tx(d,x0+X+2.5*u,y0+X/2+4,'イ');tx(d,x0+X/2,y0+X+u+4,'ウ');tx(d,x0+X+2.5*u,y0+X+u+4,'エ');
   tx(d,x0+X/2,y0-8,'x',M);tx(d,x0+X+2.5*u,y0-8,'5',M);tx(d,x0-9,y0+X/2+4,'x',M);tx(d,x0-9,y0+X+u+4,'2',M);return '横 x + 5、縦 x + 2 の長方形';}},
 kazaguruma:{alt:'1辺 a+b の正方形の中に、縦 b、横 a の長方形を4つ、風車の形に並べた図。中央に1辺 a−b の正方形が残る',h:214,f(d){const a=4.2,b=1.6,u=30,S=(a+b)*u,x0=170-S/2,y0=22,A=a*u,B=b*u,st=fill('c',.3);
   rect(d,x0,y0,A,B,st);rect(d,x0+A,y0,B,A,st);rect(d,x0+B,y0+A,A,B,st);rect(d,x0,y0+B,B,A,st);rect(d,x0+B,y0+B,A-B,A-B,'fill="var(--gold)" fill-opacity=".4" stroke="none"');
   tx(d,x0+S/2,y0+S/2+4,'(a−b)²',G);tx(d,x0+A/2,y0-7,'a',M);tx(d,x0+A+B/2,y0-7,'b',M);tx(d,x0-9,y0+B/2+4,'b',M);tx(d,x0-9,y0+B+A/2+4,'a',M);
   tx(d,x0+A/2,y0+B/2+4,'ab');tx(d,x0+A+B/2,y0+A/2+4,'ab');tx(d,x0+B+A/2,y0+A+B/2+4,'ab');tx(d,x0+B/2,y0+B+A/2+4,'ab');return '外側の正方形 ＝ 長方形 4つ ＋ 中央の正方形';}},
 ike:{alt:'半径 r の円形の池のまわりに、幅 a の道をつけた図。道の中央を通る円を点線で示す',h:222,f(d){const cx=170,cy=111,r=62,a=34;
   d.circle(cx,cy,r+a,fill('c',.32)).circle(cx,cy,r,'fill="var(--bg2)" stroke="var(--ink)" stroke-width="1.2"').circle(cx,cy,r+a/2,GD);
   d.line(cx,cy,cx+r,cy,'stroke="var(--muted)" stroke-width="1.4"').line(cx+r,cy,cx+r+a,cy,'stroke="var(--ink)" stroke-width="2"').dot(cx,cy,'var(--ink)',2.5);
   tx(d,cx+r/2,cy-7,'r',M);tx(d,cx+r+a+10,cy+4,'a');tx(d,cx,cy+30,'池',M);tx(d,cx-58,cy-58,'ℓ',G);return '池の半径 r、道の幅 a、道の中央を通る円周の長さ ℓ';}}
};
FIGS.m3tenkai_q=(host,key)=>{const q=Q[key];mk(host,{alt:q.alt,h:q.h,sliders:[],draw(){const d=draw(),r=q.f(d);return {svg:d.out(),read:r};}});};
})();
