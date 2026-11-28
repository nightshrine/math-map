/* 中学3年「標本調査」の図（FIGS.m3hyohon_*）。乱数は種を固定した擬似乱数なので、同じ操作で同じ結果になる */
(function(){
const {draw,n,mk}=FIG;
const f=v=>v.toFixed(1);
const tx=(d,x,y,t,c='var(--ink)',s=12,a='middle')=>d.raw(`<text x="${f(x)}" y="${f(y)}" font-size="${s}" font-family="var(--f-mono)" fill="${c}" text-anchor="${a}" paint-order="stroke" stroke="var(--bg2)" stroke-width="3.5" stroke-linejoin="round">${t}</text>`);
// 擬似乱数（mulberry32）。種 seed が同じなら、同じ数の列を返す
function rng(seed){let a=seed>>>0;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
// 0 から N−1 までの番号から、k 個を重複なく無作為に選ぶ
function pick(N,k,r){const a=Array.from({length:N},(_,i)=>i);for(let i=0;i<k;i++){const j=i+Math.floor(r()*(N-i));const w=a[i];a[i]=a[j];a[j]=w;}return a.slice(0,k);}

/* ---- 標本の選び方：かたよった抽出と無作為抽出 ---- */
// 母集団 200 個（20 列 × 10 行）。色つきは 60 個（30%）で、左の列ほど多い
const POP=(()=>{const r=rng(11),key=[];for(let i=0;i<200;i++){const w=.62-.56*(i%20)/19;key.push([Math.pow(r(),1/w),i]);}key.sort((x,y)=>y[0]-x[0]);return new Set(key.slice(0,60).map(q=>q[1]));})();
const chushutsu=(m,r)=>{let idx;if(m===1){idx=[];for(let row=0;row<4;row++)for(let c=0;c<5;c++)idx.push(row*20+c);}else idx=pick(200,20,rng(31093+r*97));return idx;};
FIGS.m3hyohon_chushutsu=host=>mk(host,{alt:'200 個の母集団から 20 個の標本を、左上からまとめて取る場合と無作為に取る場合の図',
  sliders:[{k:'m',label:'取り出し方',min:1,max:2,step:1,v:1,fmt:m=>['左上からまとめて','無作為に'][m-1]},{k:'r',label:'無作為抽出の回（何回目か）',min:1,max:10,step:1,v:1}],
  draw(v){const d=draw(),S=new Set(chushutsu(v.m,v.r));let k=0;
    for(let i=0;i<200;i++){const x=22+(i%20)*15.6,y=34+Math.floor(i/20)*21,on=POP.has(i);
      if(S.has(i)){d.circle(x,y,7.2,'stroke="var(--ink)" stroke-width="1.8" fill="var(--ink)" fill-opacity=".14"');if(on)k++;}
      d.dot(x,y,on?'var(--gold)':'var(--muted)',on?4.2:3);}
    return {svg:d.out(),read:`母集団 200 個、色つき 60 個（30%）<br>標本 20 個（丸で囲んだ点）のうち<br>色つきは ${k} 個<br>標本での割合 <b>${k*5}%</b><br>`+(v.m===1?'左側に色つきが多いので、かたよる':'取り直すたびに変わるが、30% の近くに集まる')};}});
FIGS.m3hyohon_chushutsu.sim=(m,r)=>chushutsu(m,r).filter(i=>POP.has(i)).length;

/* ---- なぜ：標本の大きさと、推定のぶれ ---- */
// 袋の玉 1000 個（番号 0〜299 が黒玉）から n 個を無作為に取り出し、黒玉の割合を求める。これを 20 回くり返す
const bure=(i,r)=>{const N=10*Math.pow(2,i),out=[];for(let t=0;t<20;t++){const s=pick(1000,N,rng(r*7919+i*104729+t*131+1));out.push(s.filter(x=>x<300).length/N);}return out;};
FIGS.m3hyohon_bure=host=>mk(host,{alt:'標本の大きさごとに、20 回の標本調査で求めた割合の散らばりを点で示す図',
  sliders:[{k:'i',label:'標本の大きさ',min:0,max:5,step:1,v:0,fmt:i=>String(10*Math.pow(2,i))},{k:'r',label:'調査のやり直し（何回目か）',min:1,max:8,step:1,v:1}],play:{k:'i',from:0,to:5,label:'標本を大きくしていく',ms:4200},
  draw(v){const N=10*Math.pow(2,v.i),ps=bure(v.i,v.r),d=draw(),X=p=>30+p/.7*290,by=196,r1=x=>Math.round(x*1000)/10,lo=Math.min(...ps),hi=Math.max(...ps),cnt={};
    d.raw(`<rect x="${f(X(lo)-6)}" y="46" width="${f(X(hi)-X(lo)+12)}" height="${by-46+6}" fill="var(--ok)" fill-opacity=".14"/>`);
    d.line(22,by+6,326,by+6,'stroke="var(--muted)" stroke-width="1.2"');
    for(let p=0;p<=70;p+=10){d.line(X(p/100),by+6,X(p/100),by+11,'stroke="var(--muted)" stroke-width="1.2"');tx(d,X(p/100),by+25,p+'%','var(--muted)',11);}
    d.line(X(.3),30,X(.3),by+6,'stroke="var(--gold)" stroke-width="1.6" stroke-dasharray="5 4"');tx(d,X(.3),22,'母集団の割合 30%','var(--gold)',11);
    ps.forEach(p=>{const b=Math.round(p*50)*2,c=cnt[b]=(cnt[b]||0)+1;d.circle(X(b/100),by-2-(c-1)*9,4,'fill="var(--ink)" fill-opacity=".85" stroke="var(--bg2)" stroke-width="1"');});
    return {svg:d.out(),read:`標本の大きさ ${N}、調査 20 回<br>黒玉の割合：最小 ${n(r1(lo),1)}%、最大 ${n(r1(hi),1)}%<br>散らばりの幅 <b>${n(r1(hi)-r1(lo),1)}%</b><br>点1つが、1回の調査の結果`};}});
FIGS.m3hyohon_bure.sim=bure;

/* ---- 印をつけて、つかまえ直す ---- */
// 池の魚 300 匹（番号 0〜59 が印つき）の位置
const FISH=(()=>{const r=rng(5),a=[];while(a.length<300){const x=r()*2-1,y=r()*2-1;if(x*x+y*y<1)a.push([170+x*150,122+y*98]);}return a;})();
const mark=(N,r)=>pick(300,N,rng(r*977+N*13+38));
FIGS.m3hyohon_mark=host=>mk(host,{alt:'印をつけた魚 60 匹をふくむ池から、何匹かをつかまえ直して全体の数を推定する図',
  sliders:[{k:'n',label:'つかまえる数',min:20,max:100,step:10,v:50},{k:'r',label:'つかまえ直す回（何回目か）',min:1,max:10,step:1,v:1}],
  draw(v){const d=draw(),S=new Set(mark(v.n,v.r));let k=0;
    d.raw('<ellipse cx="170" cy="122" rx="158" ry="106" fill="var(--c)" fill-opacity=".1" stroke="var(--line)" stroke-width="1.2"/>');
    FISH.forEach((p,i)=>{if(S.has(i)){d.circle(p[0],p[1],5.6,'stroke="var(--ink)" stroke-width="1.5" fill="var(--ink)" fill-opacity=".14"');if(i<60)k++;}
      d.dot(p[0],p[1],i<60?'var(--gold)':'var(--muted)',i<60?3.3:2.3);});
    return {svg:d.out(),read:`印つき（金色）は 60 匹。全体は x 匹<br>つかまえた ${v.n} 匹のうち、印つきは ${k} 匹<br>60 : x = ${k} : ${v.n}<br>`+(k?`x = 60 × ${v.n} ÷ ${k} ≈ <b>${Math.round(60*v.n/k)}</b><br>（この池の実際の数は 300 匹）`:'印つきが 0 匹なので、この回は推定できない')};}});
FIGS.m3hyohon_mark.sim=(N,r)=>mark(N,r).filter(i=>i<60).length;
})();
