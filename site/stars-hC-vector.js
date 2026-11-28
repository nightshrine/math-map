/* 数学C「ベクトル」の星。数研出版「数学C」の第1章「平面上のベクトル」と第2章「空間のベクトル」の2章を、教科書の順に並べている。
   章・節・項の名前は、同じ教科書を使う高校の年間授業計画で確認：
   https://www.metro.ed.jp/komae-h/assets/R6年間授業計画 (3年数学C).pdf （都立狛江高校 令和6年度。項の番号つき）
   https://www.metro.ed.jp/josui-h/assets/07_2_3_3_数学Ｃ.pdf （都立上水高校 令和7年度）
   第1章 第1節 平面上のベクトルとその演算（1 平面上のベクトル、2 ベクトルの演算、3 ベクトルの成分、4 ベクトルの内積）、第2節 ベクトルと平面図形（5 位置ベクトル、6 ベクトルと図形、7 ベクトル方程式）、
   第2章（1 空間の座標、2 空間のベクトル、3 ベクトルの成分、4 ベクトルの内積、5 位置ベクトル、6 ベクトルと図形、7 座標空間における図形）。項 1・2、第2章の項 2・3、項 5・6 は、それぞれ1つの星にまとめた */
(function(){
const P1='第1章 平面上のベクトル ／ 第1節 平面上のベクトルとその演算',P2='第1章 平面上のベクトル ／ 第2節 ベクトルと平面図形',K='第2章 空間のベクトル';
STARS.push(
{id:'hcvector-enzan',ch:'hC-vector',sec:P1,name:'ベクトルの演算',kind:'main',pre:['m1-zukei','m2-shomei'],screens:[
 {t:'intro',lead:R`向きと大きさをもつ量をベクトルといい、矢印で表します。この星では、ベクトルの和・差・実数倍を図で定めます。`,
  why:R`移動・力・速度のように、向きを無視できない量は、数1つでは表せません。ベクトルの計算の決まりは文字式の計算とほとんど同じなので、図形の性質を式の計算で調べられるようになります。`,
  note:R`教科書の項「平面上のベクトル」と「ベクトルの演算」を、この星でまとめて扱います。`},
 {t:'text',title:'ベクトルとは',body:[
  R`点 A から点 B へ向かう矢印を、<b>有向線分</b> AB といいます。A を始点、B を終点といいます。有向線分で、位置を問題にせず、向きと大きさだけに注目したものが<b>ベクトル</b>です。\(\overrightarrow{AB}\) や \(\vec{a}\) と書き、大きさ（矢印の長さ）を \(|\overrightarrow{AB}|\)、\(|\vec{a}|\) と書きます。`,
  R`向きが同じで大きさも等しい2つのベクトルは、<b>等しい</b>といいます。一方を平行移動して他方にぴったり重ねられる、ということです。始点がどこにあっても、同じベクトルです。`,
  R`\(\vec{a}\) と大きさが等しく向きが反対のベクトルを<b>逆ベクトル</b>といい、\(-\vec{a}\) と書きます。\(\overrightarrow{BA}=-\overrightarrow{AB}\) です。始点と終点が一致したものは<b>零ベクトル</b> \(\vec{0}\) で、大きさは 0、向きは考えません。大きさが 1 のベクトルを<b>単位ベクトル</b>といいます。`]},
 {t:'fig',fig:'hcvector_wa',title:'和と差を、矢印をつないで作る',text:R`和 \(\vec{a}+\vec{b}\) は、\(\vec{a}\) の終点に \(\vec{b}\) の始点を重ねて、\(\vec{a}\) の始点から \(\vec{b}\) の終点へ引いた矢印です。式では \(\overrightarrow{AB}+\overrightarrow{BC}=\overrightarrow{AC}\) です。差は \(\vec{a}-\vec{b}=\vec{a}+(-\vec{b})\) と定めます。始点をそろえてかくと、\(\vec{b}\) の終点から \(\vec{a}\) の終点へ向かう矢印になります。表示を「差」に切りかえて確かめてください。`},
 {t:'text',title:'実数倍と平行',body:[
  R`実数 \(k\) に対して、\(k\vec{a}\) を次のように定めます（\(\vec{a}\ne\vec{0}\) のとき）。\(k>0\) なら \(\vec{a}\) と同じ向きで大きさが \(k\) 倍、\(k<0\) なら \(\vec{a}\) と反対の向きで大きさが \(|k|\) 倍、\(k=0\) なら \(\vec{0}\) です。`,
  R`和・差・実数倍について、交換法則 \(\vec{a}+\vec{b}=\vec{b}+\vec{a}\)、結合法則、分配法則 \(k(\vec{a}+\vec{b})=k\vec{a}+k\vec{b}\) などが成り立ちます。そのため、\(2(\vec{a}+3\vec{b})-\vec{a}=\vec{a}+6\vec{b}\) のように、文字式と同じ手順で計算できます。`,
  R`\(\vec{0}\) でない2つのベクトル \(\vec{a},\ \vec{b}\) の向きが同じか反対のとき、\(\vec{a}\) と \(\vec{b}\) は<b>平行</b>であるといい、\(\vec{a}\parallel\vec{b}\) と書きます。実数倍の定め方から、次のことがいえます。`,
  R`\[\vec{a}\parallel\vec{b}\iff\vec{b}=k\vec{a}\ \text{となる実数}\ k\ \text{がある}\]`]},
 {t:'fig',fig:'hcvector_bunkai',title:'2つのベクトルで、平面上のすべての点を表す',text:R`\(\vec{a},\ \vec{b}\) が \(\vec{0}\) でなく、平行でもないとします。このとき、平面上のどんなベクトル \(\vec{p}\) も、\(\vec{p}=s\vec{a}+t\vec{b}\) の形に、ただ1通りに表せます。これをベクトルの<b>分解</b>といいます。\(s\) と \(t\) を動かして、点 P が斜めの方眼のどこにでも行けること、行き先ごとに \(s,\ t\) の値が1組に決まることを確かめてください。`},
 {t:'points',items:[
  ['等しいベクトル',R`向きと大きさが同じ。始点の位置は問わない`],
  ['和と差',R`\(\overrightarrow{AB}+\overrightarrow{BC}=\overrightarrow{AC}\)、\(\overrightarrow{OA}-\overrightarrow{OB}=\overrightarrow{BA}\)`],
  ['計算法則',R`和・差・実数倍は、文字式と同じように計算できる`],
  ['平行',R`\(\vec{a}\ne\vec{0},\ \vec{b}\ne\vec{0}\) のとき、\(\vec{a}\parallel\vec{b}\iff\vec{b}=k\vec{a}\) となる実数 \(k\) がある`],
  ['分解',R`\(\vec{a},\ \vec{b}\) が \(\vec{0}\) でなく平行でないとき、\(\vec{p}=s\vec{a}+t\vec{b}\) の形にただ1通りに表せる`]],
  trap:R`差の向きを逆にしやすいです。\(\overrightarrow{OA}-\overrightarrow{OB}\) は \(\overrightarrow{AB}\) ではなく \(\overrightarrow{BA}\) です。2点を結ぶベクトルは「終点 − 始点」で、\(\overrightarrow{AB}=\overrightarrow{OB}-\overrightarrow{OA}\) と覚えます。`},
 {t:'ex',fig:'hcvector_q',arg:'hex',q:R`正六角形 ABCDEF の中心を O とし、\(\overrightarrow{AB}=\vec{a}\)、\(\overrightarrow{AF}=\vec{b}\) とします。次のベクトルを \(\vec{a},\ \vec{b}\) で表しなさい。(1) \(\overrightarrow{AO}\)　(2) \(\overrightarrow{AD}\)　(3) \(\overrightarrow{BD}\)`,
  steps:[R`正六角形は、中心と頂点を結ぶ線分で6つの正三角形に分かれる。四角形 ABOF は4辺が等しいひし形なので、\(\overrightarrow{BO}=\overrightarrow{AF}=\vec{b}\)`,R`(1) \(\overrightarrow{AO}=\overrightarrow{AB}+\overrightarrow{BO}=\vec{a}+\vec{b}\)`,R`(2) O は対角線 AD の中点なので \(\overrightarrow{AD}=2\overrightarrow{AO}=2\vec{a}+2\vec{b}\)`,R`(3) \(\overrightarrow{BD}=\overrightarrow{AD}-\overrightarrow{AB}=(2\vec{a}+2\vec{b})-\vec{a}=\vec{a}+2\vec{b}\)`],a:R`(1) \(\vec{a}+\vec{b}\)　(2) \(2\vec{a}+2\vec{b}\)　(3) \(\vec{a}+2\vec{b}\)`},
 {t:'quiz',lv:'基本',q:R`(1) \(3(\vec{a}-2\vec{b})-2(\vec{a}-4\vec{b})\) を計算しなさい。(2) 等式 \(2\vec{x}+\vec{a}=3\vec{b}-\vec{x}\) を満たす \(\vec{x}\) を、\(\vec{a},\ \vec{b}\) で表しなさい。`,
  steps:[R`(1) \(3\vec{a}-6\vec{b}-2\vec{a}+8\vec{b}=\vec{a}+2\vec{b}\)`,R`(2) \(\vec{x}\) を左辺に集める：\(3\vec{x}=3\vec{b}-\vec{a}\)`,R`両辺を 3 で割る：\(\vec{x}=\vec{b}-\dfrac13\vec{a}\)`],a:R`(1) \(\vec{a}+2\vec{b}\)　(2) \(\vec{x}=-\dfrac13\vec{a}+\vec{b}\)`},
 {t:'quiz',lv:'基本',fig:'hcvector_q',arg:'hex',q:R`例題の正六角形 ABCDEF で、次のベクトルを \(\vec{a},\ \vec{b}\) で表しなさい。(1) \(\overrightarrow{FC}\)　(2) \(\overrightarrow{CE}\)　(3) \(\overrightarrow{EB}\)`,
  steps:[R`(1) FC は AB に平行で、長さは2倍（F から O を通って C まで）：\(\overrightarrow{FC}=2\vec{a}\)`,R`(2) \(\overrightarrow{CD}=\overrightarrow{AF}=\vec{b}\)、\(\overrightarrow{DE}=\overrightarrow{BA}=-\vec{a}\) なので \(\overrightarrow{CE}=\overrightarrow{CD}+\overrightarrow{DE}=\vec{b}-\vec{a}\)`,R`(3) BE は AF に平行で、長さは2倍。\(\overrightarrow{BE}=2\vec{b}\) なので \(\overrightarrow{EB}=-2\vec{b}\)`],a:R`(1) \(2\vec{a}\)　(2) \(-\vec{a}+\vec{b}\)　(3) \(-2\vec{b}\)`},
 {t:'quiz',lv:'応用',fig:'hcvector_q',arg:'heiko',q:R`平行四辺形 ABCD で、辺 BC の中点を M、辺 CD を \(2:1\) に内分する点を N とします。\(\overrightarrow{AB}=\vec{a}\)、\(\overrightarrow{AD}=\vec{b}\) として、\(\overrightarrow{AM}\)、\(\overrightarrow{AN}\)、\(\overrightarrow{MN}\) を \(\vec{a},\ \vec{b}\) で表しなさい。`,
  steps:[R`\(\overrightarrow{BC}=\overrightarrow{AD}=\vec{b}\) なので \(\overrightarrow{AM}=\overrightarrow{AB}+\dfrac12\overrightarrow{BC}=\vec{a}+\dfrac12\vec{b}\)`,R`\(CN:ND=2:1\) なので \(\overrightarrow{DN}=\dfrac13\overrightarrow{DC}=\dfrac13\vec{a}\)。\(\overrightarrow{AN}=\overrightarrow{AD}+\overrightarrow{DN}=\dfrac13\vec{a}+\vec{b}\)`,R`\(\overrightarrow{MN}=\overrightarrow{AN}-\overrightarrow{AM}=\left(\dfrac13-1\right)\vec{a}+\left(1-\dfrac12\right)\vec{b}\)`],a:R`\(\overrightarrow{AM}=\vec{a}+\dfrac12\vec{b}\)、\(\overrightarrow{AN}=\dfrac13\vec{a}+\vec{b}\)、\(\overrightarrow{MN}=-\dfrac23\vec{a}+\dfrac12\vec{b}\)`},
 {t:'quiz',lv:'複合',with:['m3-soji'],fig:'hcvector_q',arg:'chuten',q:R`△ABC の辺 AB, AC の中点をそれぞれ M, N とします。\(\overrightarrow{AB}=\vec{b}\)、\(\overrightarrow{AC}=\vec{c}\) として \(\overrightarrow{MN}\) を表し、\(MN\parallel BC\)、\(MN=\dfrac12BC\)（中点連結定理）が成り立つことを証明しなさい。`,
  steps:[R`\(\overrightarrow{AM}=\dfrac12\vec{b}\)、\(\overrightarrow{AN}=\dfrac12\vec{c}\)`,R`\(\overrightarrow{MN}=\overrightarrow{AN}-\overrightarrow{AM}=\dfrac12\vec{c}-\dfrac12\vec{b}=\dfrac12(\vec{c}-\vec{b})\)`,R`\(\overrightarrow{BC}=\overrightarrow{AC}-\overrightarrow{AB}=\vec{c}-\vec{b}\) なので \(\overrightarrow{MN}=\dfrac12\overrightarrow{BC}\)`,R`\(\overrightarrow{MN}\) は \(\overrightarrow{BC}\) の実数倍なので平行で、大きさは \(\dfrac12\) 倍`],a:R`\(\overrightarrow{MN}=\dfrac12\overrightarrow{BC}\) より、\(MN\parallel BC\)、\(MN=\dfrac12BC\)`},
 {t:'quiz',lv:'発展',q:R`\(\vec{a},\ \vec{b}\) は \(\vec{0}\) でなく、平行でもないとします。等式 \((2s-1)\vec{a}+(t+3)\vec{b}=(t+1)\vec{a}+(3s-2)\vec{b}\) を満たす実数 \(s,\ t\) の値を求めなさい。`,
  steps:[R`\(\vec{a},\ \vec{b}\) は \(\vec{0}\) でなく平行でないので、\(\vec{a},\ \vec{b}\) を使った表し方はただ1通り。両辺の係数はそれぞれ等しい`,R`\(\vec{a}\) の係数：\(2s-1=t+1\)。\(\vec{b}\) の係数：\(t+3=3s-2\)`,R`1つめから \(t=2s-2\)。2つめに代入して \(2s+1=3s-2\) より \(s=3\)、\(t=4\)`,R`確かめ：左辺は \(5\vec{a}+7\vec{b}\)、右辺も \(5\vec{a}+7\vec{b}\)`],a:R`\(s=3,\ t=4\)`}
]},

{id:'hcvector-seibun',ch:'hC-vector',sec:P1,name:'ベクトルの成分',kind:'main',pre:['hcvector-enzan','m3-sanheiho'],screens:[
 {t:'intro',lead:R`座標平面の上で、ベクトルを「\(x\) 方向にいくつ、\(y\) 方向にいくつ進むか」という2つの数の組で表します。これを成分表示といいます。`,
  why:R`成分にすると、和・差・実数倍・大きさが、数の計算だけで求まります。図をかかなくても計算できるようにするのが、成分の役割です。`},
 {t:'fig',fig:'hcvector_seibun',title:'成分は、x 方向と y 方向の進み方',text:R`原点 O を始点として \(\vec{a}=\overrightarrow{OA}\) となる点 A の座標が \((a_1,\ a_2)\) のとき、\(\vec{a}=(a_1,\ a_2)\) と書きます。\(a_1\) を \(x\) 成分、\(a_2\) を \(y\) 成分といいます。図の直角三角形に三平方の定理を使うと、大きさは \(|\vec{a}|=\sqrt{a_1^2+a_2^2}\) です。`},
 {t:'text',title:'成分による計算',body:[
  R`\(x\) 軸、\(y\) 軸の正の向きの単位ベクトル \(\vec{e_1}=(1,\ 0)\)、\(\vec{e_2}=(0,\ 1)\) を<b>基本ベクトル</b>といいます。\(\vec{a}=(a_1,\ a_2)\) は \(\vec{a}=a_1\vec{e_1}+a_2\vec{e_2}\) と分解したものです。`,
  R`\(\vec{b}=(b_1,\ b_2)\) も同じように分解すると、\(\vec{a}+\vec{b}=(a_1+b_1)\vec{e_1}+(a_2+b_2)\vec{e_2}\) です。つまり、和・差・実数倍は、成分ごとに計算できます。`,
  R`\[(a_1,\ a_2)\pm(b_1,\ b_2)=(a_1\pm b_1,\ a_2\pm b_2),\qquad k(a_1,\ a_2)=(ka_1,\ ka_2)\]`,
  R`2つのベクトルが等しいのは、\(x\) 成分どうし、\(y\) 成分どうしがそれぞれ等しいときです。`]},
 {t:'fig',fig:'hcvector_ab',title:'2点を結ぶベクトルの成分',text:R`\(A(a_1,\ a_2)\)、\(B(b_1,\ b_2)\) のとき、\(\overrightarrow{AB}=\overrightarrow{OB}-\overrightarrow{OA}=(b_1-a_1,\ b_2-a_2)\) です。成分は「終点の座標 − 始点の座標」です。A や B を動かして、始点を O に移した点線の矢印の先が、ちょうどその成分の座標になることを確かめてください。`},
 {t:'points',items:[
  ['成分表示',R`\(\vec{a}=(a_1,\ a_2)\)。O を始点としたときの終点の座標`],
  ['大きさ',R`\(|\vec{a}|=\sqrt{a_1^2+a_2^2}\)`],
  ['和・差・実数倍',R`成分ごとに計算する`],
  ['2点を結ぶベクトル',R`\(\overrightarrow{AB}=(b_1-a_1,\ b_2-a_2)\)、\(|\overrightarrow{AB}|=\sqrt{(b_1-a_1)^2+(b_2-a_2)^2}\)`],
  ['平行',R`\(\vec{a}\ne\vec{0},\ \vec{b}\ne\vec{0}\) のとき、\(\vec{a}\parallel\vec{b}\iff\vec{b}=k\vec{a}\iff a_1b_2-a_2b_1=0\)`]],
  trap:R`点の座標とベクトルの成分は、同じ形 \((x,\ y)\) で書きますが、意味が違います。座標は点の位置、成分は矢印の進み方です。\(\overrightarrow{AB}\) の成分を、点 B の座標と取り違えないようにします。`},
 {t:'ex',q:R`\(\vec{a}=(3,\ 1)\)、\(\vec{b}=(-1,\ 2)\) のとき、\(\vec{c}=(7,\ 0)\) を \(s\vec{a}+t\vec{b}\) の形で表しなさい。`,
  steps:[R`\(s\vec{a}+t\vec{b}=(3s-t,\ s+2t)\)`,R`これが \((7,\ 0)\) に等しいので、成分をくらべて \(3s-t=7\)、\(s+2t=0\)`,R`2つめから \(s=-2t\)。1つめに代入して \(-7t=7\) より \(t=-1\)、\(s=2\)`,R`確かめ：\(2(3,\ 1)-(-1,\ 2)=(6+1,\ 2-2)=(7,\ 0)\)`],a:R`\(\vec{c}=2\vec{a}-\vec{b}\)`},
 {t:'quiz',lv:'基本',q:R`\(\vec{a}=(1,\ -3)\)、\(\vec{b}=(-2,\ 5)\) のとき、\(3\vec{a}+2\vec{b}\) の成分と大きさを求めなさい。`,
  steps:[R`\(3\vec{a}+2\vec{b}=(3-4,\ -9+10)=(-1,\ 1)\)`,R`大きさ：\(\sqrt{(-1)^2+1^2}=\sqrt2\)`],a:R`\((-1,\ 1)\)、大きさ \(\sqrt2\)`},
 {t:'quiz',lv:'基本',q:R`2点 A\((-1,\ 2)\)、B\((3,\ -1)\) について、\(\overrightarrow{AB}\) の成分と大きさを求めなさい。また、\(\overrightarrow{AB}\) と同じ向きの単位ベクトルを求めなさい。`,
  steps:[R`\(\overrightarrow{AB}=(3-(-1),\ -1-2)=(4,\ -3)\)`,R`\(|\overrightarrow{AB}|=\sqrt{4^2+(-3)^2}=5\)`,R`同じ向きの単位ベクトルは、大きさで割ったもの：\(\dfrac15(4,\ -3)\)`],a:R`\(\overrightarrow{AB}=(4,\ -3)\)、大きさ 5、単位ベクトル \(\left(\dfrac45,\ -\dfrac35\right)\)`},
 {t:'quiz',lv:'応用',q:R`3点 A\((1,\ 2)\)、B\((4,\ 1)\)、C\((6,\ 5)\) があります。四角形 ABCD が平行四辺形になるような点 D の座標を求めなさい。`,
  steps:[R`四角形 ABCD が平行四辺形になるのは \(\overrightarrow{AD}=\overrightarrow{BC}\) のとき`,R`\(\overrightarrow{BC}=(6-4,\ 5-1)=(2,\ 4)\)`,R`D\((x,\ y)\) とすると \(\overrightarrow{AD}=(x-1,\ y-2)=(2,\ 4)\)。よって \(x=3,\ y=6\)`,R`確かめ：\(\overrightarrow{AB}=(3,\ -1)\)、\(\overrightarrow{DC}=(6-3,\ 5-6)=(3,\ -1)\) で等しい`],a:R`D\((3,\ 6)\)`},
 {t:'quiz',lv:'複合',with:['h1-niji'],q:R`\(\vec{a}=(1,\ 2)\)、\(\vec{b}=(3,\ -1)\) とします。実数 \(t\) を変化させるとき、\(|\vec{a}+t\vec{b}|\) の最小値と、そのときの \(t\) の値を求めなさい。`,
  steps:[R`\(\vec{a}+t\vec{b}=(1+3t,\ 2-t)\)`,R`\(|\vec{a}+t\vec{b}|^2=(1+3t)^2+(2-t)^2=10t^2+2t+5\)`,R`平方完成：\(10\left(t+\dfrac{1}{10}\right)^2+\dfrac{49}{10}\)。\(t=-\dfrac{1}{10}\) で最小値 \(\dfrac{49}{10}\)`,R`大きさは 0 以上なので、2乗が最小のとき大きさも最小。\(\sqrt{\dfrac{49}{10}}=\dfrac{7}{\sqrt{10}}=\dfrac{7\sqrt{10}}{10}\)`],a:R`\(t=-\dfrac{1}{10}\) のとき、最小値 \(\dfrac{7\sqrt{10}}{10}\)`}
]},

{id:'hcvector-naiseki',ch:'hC-vector',sec:P1,name:'ベクトルの内積',kind:'main',pre:['hcvector-seibun','h1-sankakuhi'],screens:[
 {t:'intro',lead:R`2つのベクトルから1つの数を作る計算が、内積です。\(\vec{a}\cdot\vec{b}=|\vec{a}||\vec{b}|\cos\theta\) と定めます。`,
  why:R`内積が分かれば、2つのベクトルのなす角が求まります。垂直かどうかは「内積が 0 かどうか」で判定できます。長さと角度の問題を、成分のかけ算とたし算に直せるのが内積の役割です。`},
 {t:'text',title:'なす角と内積の定義',body:[
  R`\(\vec{0}\) でない2つのベクトル \(\vec{a},\ \vec{b}\) の始点をそろえて \(\vec{a}=\overrightarrow{OA}\)、\(\vec{b}=\overrightarrow{OB}\) とします。このときの \(\angle AOB=\theta\) を、\(\vec{a}\) と \(\vec{b}\) の<b>なす角</b>といいます。\(0^\circ\le\theta\le180^\circ\) の範囲で考えます。`,
  R`\[\vec{a}\cdot\vec{b}=|\vec{a}||\vec{b}|\cos\theta\]`,
  R`この値を \(\vec{a}\) と \(\vec{b}\) の<b>内積</b>といいます。\(\vec{a}=\vec{0}\) または \(\vec{b}=\vec{0}\) のときは、内積を 0 と定めます。内積はベクトルではなく、1つの実数です。`]},
 {t:'fig',fig:'hcvector_naiseki',title:'内積は「影の長さ × 長さ」',text:R`点 B から直線 OA に垂線 BH を下ろします。\(|\vec{b}|\cos\theta\) は、OH の長さに符号をつけたものです（H が O から見て A と同じ側なら正、反対側なら負）。これを \(\vec{b}\) の \(\vec{a}\) 方向への<b>正射影</b>の長さと考えると、内積は「\(|\vec{a}|\) × 影の長さ」です。\(\theta\) を動かして、鋭角なら正、\(90^\circ\) で 0、鈍角なら負になることを確かめてください。`},
 {t:'text',title:'成分で計算する',body:[
  R`\(\vec{a}=(a_1,\ a_2)\)、\(\vec{b}=(b_1,\ b_2)\) のとき、内積は成分で次のように計算できます。なぜこの式になるかは、次の「なぜ」の星で導きます。`,
  R`\[\vec{a}\cdot\vec{b}=a_1b_1+a_2b_2\]`,
  R`定義の式を \(\cos\theta\) について解くと、なす角が求まります。また、\(\cos\theta=0\) となるのは \(\theta=90^\circ\) のときだけなので、垂直の条件が得られます（\(\vec{a}\ne\vec{0},\ \vec{b}\ne\vec{0}\) のとき）。`,
  R`\[\cos\theta=\dfrac{\vec{a}\cdot\vec{b}}{|\vec{a}||\vec{b}|},\qquad\vec{a}\perp\vec{b}\iff\vec{a}\cdot\vec{b}=0\]`]},
 {t:'text',title:'内積の性質',body:[
  R`同じベクトルどうしのなす角は \(0^\circ\) なので、\(\vec{a}\cdot\vec{a}=|\vec{a}|^2\) です。また、次の計算法則が成り立ちます。`,
  R`\[\vec{a}\cdot\vec{b}=\vec{b}\cdot\vec{a},\qquad(\vec{a}+\vec{b})\cdot\vec{c}=\vec{a}\cdot\vec{c}+\vec{b}\cdot\vec{c},\qquad(k\vec{a})\cdot\vec{b}=k(\vec{a}\cdot\vec{b})\]`,
  R`これらを使うと、大きさの2乗を文字式の展開と同じ形で計算できます。`,
  R`\[|\vec{a}+\vec{b}|^2=(\vec{a}+\vec{b})\cdot(\vec{a}+\vec{b})=|\vec{a}|^2+2\vec{a}\cdot\vec{b}+|\vec{b}|^2\]`]},
 {t:'points',items:[
  ['定義',R`\(\vec{a}\cdot\vec{b}=|\vec{a}||\vec{b}|\cos\theta\)（\(\theta\) はなす角、\(0^\circ\le\theta\le180^\circ\)）`],
  ['成分',R`\(\vec{a}\cdot\vec{b}=a_1b_1+a_2b_2\)`],
  ['なす角',R`\(\cos\theta=\dfrac{\vec{a}\cdot\vec{b}}{|\vec{a}||\vec{b}|}\)`],
  ['垂直',R`\(\vec{a}\ne\vec{0},\ \vec{b}\ne\vec{0}\) のとき、\(\vec{a}\perp\vec{b}\iff\vec{a}\cdot\vec{b}=0\)`],
  ['大きさと内積',R`\(\vec{a}\cdot\vec{a}=|\vec{a}|^2\)、\(|\vec{a}+\vec{b}|^2=|\vec{a}|^2+2\vec{a}\cdot\vec{b}+|\vec{b}|^2\)`]],
  trap:R`\(|\vec{a}+\vec{b}|\) を \(|\vec{a}|+|\vec{b}|\) としてはいけません。大きさを扱うときは、2乗して内積の形にしてから展開します。`},
 {t:'ex',q:R`\(\vec{a}=(1,\ 2)\)、\(\vec{b}=(1,\ -3)\) の内積と、なす角 \(\theta\) を求めなさい。`,
  steps:[R`内積：\(\vec{a}\cdot\vec{b}=1\cdot1+2\cdot(-3)=-5\)`,R`大きさ：\(|\vec{a}|=\sqrt{1+4}=\sqrt5\)、\(|\vec{b}|=\sqrt{1+9}=\sqrt{10}\)`,R`\(\cos\theta=\dfrac{-5}{\sqrt5\cdot\sqrt{10}}=\dfrac{-5}{5\sqrt2}=-\dfrac{1}{\sqrt2}\)`,R`\(0^\circ\le\theta\le180^\circ\) より \(\theta=135^\circ\)`],a:R`\(\vec{a}\cdot\vec{b}=-5\)、\(\theta=135^\circ\)`},
 {t:'quiz',lv:'基本',q:R`\(|\vec{a}|=3\)、\(|\vec{b}|=4\) で、\(\vec{a}\) と \(\vec{b}\) のなす角 \(\theta\) が次の値のとき、内積 \(\vec{a}\cdot\vec{b}\) を求めなさい。(1) \(\theta=30^\circ\)　(2) \(\theta=90^\circ\)　(3) \(\theta=120^\circ\)`,
  steps:[R`(1) \(3\cdot4\cdot\cos30^\circ=12\cdot\dfrac{\sqrt3}{2}=6\sqrt3\)`,R`(2) \(3\cdot4\cdot\cos90^\circ=0\)`,R`(3) \(3\cdot4\cdot\cos120^\circ=12\cdot\left(-\dfrac12\right)=-6\)`],a:R`(1) \(6\sqrt3\)　(2) \(0\)　(3) \(-6\)`},
 {t:'quiz',lv:'基本',q:R`\(\vec{a}=(\sqrt3,\ 1)\)、\(\vec{b}=(1,\ \sqrt3)\) の内積と、なす角 \(\theta\) を求めなさい。`,
  steps:[R`内積：\(\sqrt3\cdot1+1\cdot\sqrt3=2\sqrt3\)`,R`大きさ：\(|\vec{a}|=\sqrt{3+1}=2\)、\(|\vec{b}|=\sqrt{1+3}=2\)`,R`\(\cos\theta=\dfrac{2\sqrt3}{2\cdot2}=\dfrac{\sqrt3}{2}\)。\(0^\circ\le\theta\le180^\circ\) より \(\theta=30^\circ\)`],a:R`\(\vec{a}\cdot\vec{b}=2\sqrt3\)、\(\theta=30^\circ\)`},
 {t:'quiz',lv:'応用',q:R`\(\vec{a}=(4,\ -3)\) に垂直な単位ベクトルを、すべて求めなさい。`,
  steps:[R`求めるベクトルを \(\vec{e}=(x,\ y)\) とする`,R`垂直：\(\vec{a}\cdot\vec{e}=4x-3y=0\) より \(y=\dfrac43x\)`,R`単位ベクトル：\(x^2+y^2=1\)。代入して \(x^2+\dfrac{16}{9}x^2=1\)、\(x^2=\dfrac{9}{25}\)、\(x=\pm\dfrac35\)`,R`\(x=\dfrac35\) のとき \(y=\dfrac45\)、\(x=-\dfrac35\) のとき \(y=-\dfrac45\)`],a:R`\(\left(\dfrac35,\ \dfrac45\right)\)、\(\left(-\dfrac35,\ -\dfrac45\right)\)`},
 {t:'quiz',lv:'応用',q:R`\(|\vec{a}|=3\)、\(|\vec{b}|=2\)、\(|\vec{a}-2\vec{b}|=\sqrt{13}\) のとき、内積 \(\vec{a}\cdot\vec{b}\) と、\(\vec{a}\) と \(\vec{b}\) のなす角 \(\theta\) を求めなさい。`,
  steps:[R`\(|\vec{a}-2\vec{b}|^2=|\vec{a}|^2-4\vec{a}\cdot\vec{b}+4|\vec{b}|^2\)`,R`値を代入：\(13=9-4\vec{a}\cdot\vec{b}+16\)。よって \(\vec{a}\cdot\vec{b}=3\)`,R`\(\cos\theta=\dfrac{3}{3\cdot2}=\dfrac12\)。\(0^\circ\le\theta\le180^\circ\) より \(\theta=60^\circ\)`],a:R`\(\vec{a}\cdot\vec{b}=3\)、\(\theta=60^\circ\)`},
 {t:'quiz',lv:'発展',with:['h1-sankakuhi'],q:R`△OAB で \(\overrightarrow{OA}=\vec{a}\)、\(\overrightarrow{OB}=\vec{b}\) とします。(1) △OAB の面積 \(S\) は \(S=\dfrac12\sqrt{|\vec{a}|^2|\vec{b}|^2-(\vec{a}\cdot\vec{b})^2}\) と表せることを示しなさい。(2) O\((0,\ 0)\)、A\((4,\ 1)\)、B\((2,\ 3)\) のとき、\(S\) を求めなさい。`,
  steps:[R`(1) \(\angle AOB=\theta\) とすると \(S=\dfrac12|\vec{a}||\vec{b}|\sin\theta\)。\(0^\circ<\theta<180^\circ\) で \(\sin\theta>0\) なので \(\sin\theta=\sqrt{1-\cos^2\theta}\)`,R`\(S=\dfrac12\sqrt{|\vec{a}|^2|\vec{b}|^2-|\vec{a}|^2|\vec{b}|^2\cos^2\theta}\)。\(|\vec{a}||\vec{b}|\cos\theta=\vec{a}\cdot\vec{b}\) なので、示す式になる`,R`(2) \(|\vec{a}|^2=17\)、\(|\vec{b}|^2=13\)、\(\vec{a}\cdot\vec{b}=4\cdot2+1\cdot3=11\)`,R`\(S=\dfrac12\sqrt{17\cdot13-11^2}=\dfrac12\sqrt{221-121}=\dfrac12\cdot10\)`],a:R`(2) \(S=5\)`}
]},

{id:'hcvector-naze-naiseki',ch:'hC-vector',sec:P1,name:'内積の成分表示を導く',kind:'why',pre:['hcvector-naiseki','h1-sankakuhi'],screens:[
 {t:'intro',lead:R`\(\vec{a}\cdot\vec{b}=a_1b_1+a_2b_2\) を、内積の定義と余弦定理から自分で導きます。`,
  why:R`定義の式 \(|\vec{a}||\vec{b}|\cos\theta\) は長さと角度でできていて、計算の式 \(a_1b_1+a_2b_2\) は成分だけでできています。見た目の違う2つの式が同じ値になる理由が分かれば、角度を使わずに内積を計算してよい根拠がはっきりします。`},
 {t:'ask',title:'まず、角度が分かる例で確かめる',body:R`\(\vec{a}=(2,\ 0)\)、\(\vec{b}=(1,\ \sqrt3)\) とします。\(|\vec{a}|=2\)、\(|\vec{b}|=\sqrt{1+3}=2\) で、\(\vec{b}\) は \(x\) 軸の正の向きと \(60^\circ\) の角をつくるので、なす角は \(60^\circ\) です。`,
  q:R`定義 \(|\vec{a}||\vec{b}|\cos\theta\) で計算した内積の値は、どれですか。`,
  choices:[R`\(1\)`,R`\(2\)`,R`\(2\sqrt3\)`,R`\(4\)`],correct:1,
  explain:R`\(2\cdot2\cdot\cos60^\circ=4\cdot\dfrac12=2\) です。一方、成分の式では \(a_1b_1+a_2b_2=2\cdot1+0\cdot\sqrt3=2\) で、同じ値になります。`,hint:R`\(\cos60^\circ=\dfrac12\) です。`},
 {t:'fig',fig:'hcvector_yogen',title:'三角形 OAB の3辺から内積を出す',text:R`\(\overrightarrow{OA}=\vec{a}\)、\(\overrightarrow{OB}=\vec{b}\)、\(\angle AOB=\theta\) の三角形 OAB に余弦定理を使うと、\(AB^2=|\vec{a}|^2+|\vec{b}|^2-2|\vec{a}||\vec{b}|\cos\theta\) です。最後の項は、内積の2倍です。そこで \(\vec{a}\cdot\vec{b}=\dfrac{|\vec{a}|^2+|\vec{b}|^2-AB^2}{2}\) となります。点 B を動かして、この値がいつも \(a_1b_1+a_2b_2\) と一致することを確かめてください。`},
 {t:'ask',title:'3辺の長さだけで内積を求める',body:R`\(\vec{a}=(4,\ 1)\)、\(\vec{b}=(1,\ 3)\) のとき、\(|\vec{a}|^2=17\)、\(|\vec{b}|^2=10\)、\(AB^2=(1-4)^2+(3-1)^2=13\) です。角度は分かりませんが、3辺の長さは成分から計算できます。`,
  q:R`\(\vec{a}\cdot\vec{b}=\dfrac{|\vec{a}|^2+|\vec{b}|^2-AB^2}{2}\) の値は、どれですか。`,
  choices:[R`\(3.5\)`,R`\(7\)`,R`\(14\)`,R`\(20\)`],correct:1,
  explain:R`\(\dfrac{17+10-13}{2}=7\) です。成分の式でも \(4\cdot1+1\cdot3=7\) で、一致します。2乗の項 \(17\) と \(10\) が \(AB^2\) の展開の中の同じ項と打ち消し合って、積の項だけが残っています。`,hint:R`分子は \(17+10-13\) です。`},
 {t:'derive',title:'文字で一般化する',body:R`\(\vec{a}=(a_1,\ a_2)\)、\(\vec{b}=(b_1,\ b_2)\) として、同じ計算を文字で行います。`,
  steps:[R`余弦定理と内積の定義から \(2\vec{a}\cdot\vec{b}=|\vec{a}|^2+|\vec{b}|^2-AB^2\)`,R`成分で表す：\(|\vec{a}|^2=a_1^2+a_2^2\)、\(|\vec{b}|^2=b_1^2+b_2^2\)、\(AB^2=(b_1-a_1)^2+(b_2-a_2)^2\)`,R`\(AB^2\) を展開する：\(a_1^2+a_2^2+b_1^2+b_2^2-2a_1b_1-2a_2b_2\)`,R`代入すると2乗の項がすべて消えて \(2\vec{a}\cdot\vec{b}=2a_1b_1+2a_2b_2\)`],a:R`\(\vec{a}\cdot\vec{b}=a_1b_1+a_2b_2\)`},
 {t:'text',title:'三角形ができないときも成り立つ',body:[
  R`\(\vec{a}\) と \(\vec{b}\) が平行なとき、O, A, B は一直線上に並び、三角形ができません。この場合は直接確かめます。\(\vec{b}=k\vec{a}\) とすると、成分の式は \(a_1\cdot ka_1+a_2\cdot ka_2=k|\vec{a}|^2\) です。`,
  R`定義の式は、\(k>0\) のときなす角が \(0^\circ\) で \(|\vec{a}|\cdot k|\vec{a}|\cdot1=k|\vec{a}|^2\)、\(k<0\) のときなす角が \(180^\circ\) で \(|\vec{a}|\cdot|k||\vec{a}|\cdot(-1)=k|\vec{a}|^2\) です。どちらも成分の式と一致します。`,
  R`\(\vec{a}=\vec{0}\) または \(\vec{b}=\vec{0}\) のときは、定義により内積は 0 で、成分の式も 0 です。これで、すべての場合に \(\vec{a}\cdot\vec{b}=a_1b_1+a_2b_2\) がいえました。`]},
 {t:'quiz',lv:'複合',with:['h1-sankakuhi'],q:R`△OAB で \(OA=5\)、\(OB=6\)、\(AB=7\) のとき、内積 \(\overrightarrow{OA}\cdot\overrightarrow{OB}\) と \(\cos\angle AOB\) の値を求めなさい。`,
  steps:[R`余弦定理から \(\overrightarrow{OA}\cdot\overrightarrow{OB}=\dfrac{OA^2+OB^2-AB^2}{2}=\dfrac{25+36-49}{2}=6\)`,R`\(\cos\angle AOB=\dfrac{\overrightarrow{OA}\cdot\overrightarrow{OB}}{OA\cdot OB}=\dfrac{6}{5\cdot6}\)`],a:R`\(\overrightarrow{OA}\cdot\overrightarrow{OB}=6\)、\(\cos\angle AOB=\dfrac15\)`},
 {t:'quiz',lv:'発展',q:R`(1) 等式 \(\vec{a}\cdot\vec{b}=\dfrac14\left(|\vec{a}+\vec{b}|^2-|\vec{a}-\vec{b}|^2\right)\) を証明しなさい。(2) 平行四辺形 OACB で、対角線の長さが \(OC=8\)、\(AB=6\) のとき、\(\overrightarrow{OA}\cdot\overrightarrow{OB}\) を求めなさい。`,
  steps:[R`(1) \(|\vec{a}+\vec{b}|^2=|\vec{a}|^2+2\vec{a}\cdot\vec{b}+|\vec{b}|^2\)、\(|\vec{a}-\vec{b}|^2=|\vec{a}|^2-2\vec{a}\cdot\vec{b}+|\vec{b}|^2\)`,R`引くと \(|\vec{a}+\vec{b}|^2-|\vec{a}-\vec{b}|^2=4\vec{a}\cdot\vec{b}\)。両辺を 4 で割ると示す式になる`,R`(2) \(\overrightarrow{OA}=\vec{a}\)、\(\overrightarrow{OB}=\vec{b}\) とすると \(\overrightarrow{OC}=\vec{a}+\vec{b}\)、\(\overrightarrow{BA}=\vec{a}-\vec{b}\)`,R`\(\vec{a}\cdot\vec{b}=\dfrac14(8^2-6^2)=\dfrac{28}{4}\)`],a:R`(2) \(\overrightarrow{OA}\cdot\overrightarrow{OB}=7\)`}
]},

{id:'hcvector-ichi',ch:'hC-vector',sec:P2,name:'位置ベクトル',kind:'main',pre:['hcvector-seibun'],screens:[
 {t:'intro',lead:R`平面上に基準の点 O を1つ決めると、点 P の位置は \(\overrightarrow{OP}\) で決まります。これを点 P の位置ベクトルといいます。内分点・外分点・重心を、位置ベクトルで表します。`,
  why:R`点をベクトルに置きかえると、「線分を \(2:1\) に分ける点」や「三角形の重心」が、式1つで書けます。次の星から、図形の証明をこの式の計算で行います。`},
 {t:'text',title:'位置ベクトル',body:[
  R`点 O を固定して、点 P に対して \(\vec{p}=\overrightarrow{OP}\) を対応させます。この \(\vec{p}\) を、O に関する点 P の<b>位置ベクトル</b>といい、位置ベクトルが \(\vec{p}\) である点 P を \(P(\vec{p})\) と書きます。O はどこにとってもかまいません。`,
  R`2点 \(A(\vec{a})\)、\(B(\vec{b})\) に対して、\(\overrightarrow{AB}=\overrightarrow{OB}-\overrightarrow{OA}=\vec{b}-\vec{a}\) です。2点を結ぶベクトルは、いつも「終点の位置ベクトル − 始点の位置ベクトル」です。`]},
 {t:'fig',fig:'hcvector_naibun',title:'内分点は、a と b を比に応じて混ぜたもの',text:R`線分 AB を \(m:n\) に内分する点 P の位置ベクトルは \(\vec{p}=\dfrac{n\vec{a}+m\vec{b}}{m+n}\) です。\(m\) と \(n\) を動かして、P が B に近づくほど \(\vec{b}\) の係数が大きくなること、2つの係数の和がいつも 1 であることを確かめてください。この式がどこから出てくるかは、次の「なぜ」の星で導きます。`},
 {t:'fig',fig:'hcvector_naibun',arg:{gai:true},title:'外分点',text:R`線分 AB を \(m:n\) に外分する点 Q（直線 AB 上で線分 AB の外にあり、\(AQ:QB=m:n\) となる点）の位置ベクトルは \(\vec{q}=\dfrac{-n\vec{a}+m\vec{b}}{m-n}\) です。内分点の式の \(n\) を \(-n\) に置きかえた形です。\(m>n\) なら Q は B の先に、\(m<n\) なら A の手前にあります。`},
 {t:'fig',fig:'hcvector_jushin',title:'三角形の重心',text:R`三角形の3本の中線（頂点と、向かい合う辺の中点を結ぶ線分）は1点で交わります。その点が<b>重心</b>で、各中線を \(2:1\) に内分します。3頂点を \(A(\vec{a})\)、\(B(\vec{b})\)、\(C(\vec{c})\) とすると、重心 G の位置ベクトルは \(\vec{g}=\dfrac{\vec{a}+\vec{b}+\vec{c}}{3}\) です。図では O を原点にとっているので、位置ベクトルの成分は点の座標と同じです。`},
 {t:'points',items:[
  ['2点を結ぶベクトル',R`\(A(\vec{a})\)、\(B(\vec{b})\) のとき \(\overrightarrow{AB}=\vec{b}-\vec{a}\)`],
  ['内分点',R`AB を \(m:n\) に内分する点は \(\dfrac{n\vec{a}+m\vec{b}}{m+n}\)。中点は \(\dfrac{\vec{a}+\vec{b}}{2}\)`],
  ['外分点',R`AB を \(m:n\) に外分する点は \(\dfrac{-n\vec{a}+m\vec{b}}{m-n}\)（\(m\ne n\)）`],
  ['重心',R`△ABC の重心は \(\dfrac{\vec{a}+\vec{b}+\vec{c}}{3}\)`]],
  trap:R`内分点の式の分子は、比 \(m:n\) と位置ベクトル \(\vec{a},\ \vec{b}\) を「たすきがけ」にかけます。\(\vec{a}\) にかかるのは、A から遠い側の \(n\) です。迷ったら「P が B に近いとき、\(\vec{b}\) の係数が大きい」と図で確かめます。`},
 {t:'ex',q:R`2点 \(A(\vec{a})\)、\(B(\vec{b})\) について、線分 AB を \(3:2\) に内分する点 P と、\(3:2\) に外分する点 Q の位置ベクトルを、\(\vec{a},\ \vec{b}\) で表しなさい。`,
  steps:[R`内分点：\(\vec{p}=\dfrac{2\vec{a}+3\vec{b}}{3+2}=\dfrac{2\vec{a}+3\vec{b}}{5}\)`,R`外分点：\(\vec{q}=\dfrac{-2\vec{a}+3\vec{b}}{3-2}=-2\vec{a}+3\vec{b}\)`,R`確かめ：\(\overrightarrow{AQ}=\vec{q}-\vec{a}=3(\vec{b}-\vec{a})=3\overrightarrow{AB}\)。Q は B の先にあり、\(AQ:QB=3:2\) になっている`],a:R`\(\vec{p}=\dfrac25\vec{a}+\dfrac35\vec{b}\)、\(\vec{q}=-2\vec{a}+3\vec{b}\)`},
 {t:'quiz',lv:'基本',q:R`2点 \(A(\vec{a})\)、\(B(\vec{b})\) について、次の点の位置ベクトルを \(\vec{a},\ \vec{b}\) で表しなさい。(1) 線分 AB を \(1:3\) に内分する点　(2) 線分 AB の中点　(3) 線分 AB を \(1:3\) に外分する点`,
  steps:[R`(1) \(\dfrac{3\vec{a}+1\vec{b}}{1+3}=\dfrac{3\vec{a}+\vec{b}}{4}\)`,R`(2) \(\dfrac{\vec{a}+\vec{b}}{2}\)`,R`(3) \(\dfrac{-3\vec{a}+1\vec{b}}{1-3}=\dfrac{-3\vec{a}+\vec{b}}{-2}=\dfrac{3\vec{a}-\vec{b}}{2}\)`],a:R`(1) \(\dfrac34\vec{a}+\dfrac14\vec{b}\)　(2) \(\dfrac12\vec{a}+\dfrac12\vec{b}\)　(3) \(\dfrac32\vec{a}-\dfrac12\vec{b}\)`},
 {t:'quiz',lv:'応用',fig:'hcvector_q',arg:'def',q:R`△ABC の辺 BC, CA, AB を \(2:1\) に内分する点を、それぞれ D, E, F とします。△DEF の重心は、△ABC の重心と一致することを証明しなさい。`,
  steps:[R`点 A, B, C の位置ベクトルを \(\vec{a},\ \vec{b},\ \vec{c}\) とする`,R`\(\vec{d}=\dfrac{\vec{b}+2\vec{c}}{3}\)、\(\vec{e}=\dfrac{\vec{c}+2\vec{a}}{3}\)、\(\vec{f}=\dfrac{\vec{a}+2\vec{b}}{3}\)`,R`△DEF の重心の位置ベクトルは \(\dfrac{\vec{d}+\vec{e}+\vec{f}}{3}=\dfrac13\cdot\dfrac{3\vec{a}+3\vec{b}+3\vec{c}}{3}=\dfrac{\vec{a}+\vec{b}+\vec{c}}{3}\)`,R`これは △ABC の重心の位置ベクトルと同じ`],a:R`2つの重心の位置ベクトルはどちらも \(\dfrac{\vec{a}+\vec{b}+\vec{c}}{3}\) なので、一致する`},
 {t:'quiz',lv:'複合',with:['h2-zukeishiki'],q:R`2点 A\((1,\ 2)\)、B\((7,\ -1)\) を結ぶ線分 AB を、\(2:1\) に内分する点 P と、\(2:1\) に外分する点 Q の座標を求めなさい。`,
  steps:[R`原点 O に関する位置ベクトルの成分は、点の座標と同じ。\(\vec{a}=(1,\ 2)\)、\(\vec{b}=(7,\ -1)\)`,R`\(\vec{p}=\dfrac{\vec{a}+2\vec{b}}{3}=\dfrac{(1+14,\ 2-2)}{3}=(5,\ 0)\)`,R`\(\vec{q}=\dfrac{-\vec{a}+2\vec{b}}{2-1}=(-1+14,\ -2-2)=(13,\ -4)\)`,R`数学II「図形と方程式」の内分点・外分点の公式は、この式を成分で書いたもの`],a:R`P\((5,\ 0)\)、Q\((13,\ -4)\)`},
 {t:'quiz',lv:'発展',q:R`△ABC と点 P があり、\(\overrightarrow{PA}+2\overrightarrow{PB}+3\overrightarrow{PC}=\vec{0}\) を満たしています。点 P はどのような位置にありますか。`,
  steps:[R`始点を A にそろえる：\(\overrightarrow{PA}=-\overrightarrow{AP}\)、\(\overrightarrow{PB}=\overrightarrow{AB}-\overrightarrow{AP}\)、\(\overrightarrow{PC}=\overrightarrow{AC}-\overrightarrow{AP}\)`,R`代入して整理：\(-6\overrightarrow{AP}+2\overrightarrow{AB}+3\overrightarrow{AC}=\vec{0}\) より \(\overrightarrow{AP}=\dfrac{2\overrightarrow{AB}+3\overrightarrow{AC}}{6}\)`,R`内分点の形を作る：\(\overrightarrow{AP}=\dfrac56\cdot\dfrac{2\overrightarrow{AB}+3\overrightarrow{AC}}{5}\)`,R`辺 BC を \(3:2\) に内分する点を D とすると \(\overrightarrow{AD}=\dfrac{2\overrightarrow{AB}+3\overrightarrow{AC}}{5}\) なので \(\overrightarrow{AP}=\dfrac56\overrightarrow{AD}\)`],a:R`辺 BC を \(3:2\) に内分する点を D とするとき、P は線分 AD を \(5:1\) に内分する点`}
]},

{id:'hcvector-naze-naibun',ch:'hC-vector',sec:P2,name:'内分点の式を導く',kind:'why',pre:['hcvector-ichi'],screens:[
 {t:'intro',lead:R`内分点の位置ベクトル \(\dfrac{n\vec{a}+m\vec{b}}{m+n}\) を、「A から B へ向かって、全体の \(\dfrac{m}{m+n}\) だけ進む」という見方から導きます。`,
  why:R`分子で \(m\) と \(n\) が逆の側にかかる理由が分かります。導き方を知っていれば、式を忘れても「A から出発して途中まで進む」と考えて、その場で作り直せます。`},
 {t:'ask',title:'数直線の上で確かめる',body:R`数直線上に点 A（座標 1）と点 B（座標 7）があります。線分 AB を \(2:1\) に内分する点 P は、A から B へ向かって、全体の \(\dfrac23\) だけ進んだ点です。`,
  q:R`点 P の座標は、いくつですか。`,
  choices:[R`\(3\)`,R`\(4\)`,R`\(5\)`,R`\(6\)`],correct:2,
  explain:R`AB の長さは \(7-1=6\) で、その \(\dfrac23\) は 4 です。A から 4 進んで \(1+4=5\) です。公式の形で書くと \(\dfrac{1\cdot1+2\cdot7}{2+1}=\dfrac{15}{3}=5\) で、同じ値になります。`,hint:R`A の座標 1 に、AB の長さ 6 の \(\dfrac23\) をたします。`},
 {t:'fig',fig:'hcvector_naibun_step',title:'O から A へ、続けて A から P へ',text:R`平面でも同じ考え方を使います。手順を進めてください。P は A から B へ向かって \(\dfrac{m}{m+n}\) だけ進んだ点なので、\(\overrightarrow{AP}=\dfrac{m}{m+n}\overrightarrow{AB}\) です。O から P へは、A を経由して \(\overrightarrow{OP}=\overrightarrow{OA}+\overrightarrow{AP}\) と進めます。`},
 {t:'ask',title:'a と b でまとめる',body:R`\(m:n=2:1\) のとき、\(\vec{p}=\vec{a}+\dfrac23(\vec{b}-\vec{a})\) です。`,
  q:R`かっこをはずして整理すると、どれになりますか。`,
  choices:[R`\(\dfrac13\vec{a}+\dfrac23\vec{b}\)`,R`\(\dfrac23\vec{a}+\dfrac13\vec{b}\)`,R`\(\dfrac53\vec{a}+\dfrac23\vec{b}\)`,R`\(\vec{a}+\dfrac23\vec{b}\)`],correct:0,
  explain:R`\(\vec{a}\) の係数は \(1-\dfrac23=\dfrac13\)、\(\vec{b}\) の係数は \(\dfrac23\) です。P は B に近いので、\(\vec{b}\) の係数の方が大きくなっています。分母をそろえると \(\dfrac{1\vec{a}+2\vec{b}}{3}\) で、\(\vec{a}\) にかかる 1 は比 \(2:1\) の \(n\) の方です。`,hint:R`\(-\dfrac23\vec{a}\) と、はじめの \(\vec{a}\) をまとめます。`},
 {t:'derive',title:'文字で一般化する',body:R`線分 AB を \(m:n\) に内分する点を P とします。`,
  steps:[R`\(AP:AB=m:(m+n)\) で、向きも同じなので \(\overrightarrow{AP}=\dfrac{m}{m+n}\overrightarrow{AB}\)`,R`位置ベクトルで書く：\(\vec{p}-\vec{a}=\dfrac{m}{m+n}(\vec{b}-\vec{a})\)`,R`\(\vec{a}\) を移項してまとめる：\(\vec{p}=\left(1-\dfrac{m}{m+n}\right)\vec{a}+\dfrac{m}{m+n}\vec{b}\)`,R`\(1-\dfrac{m}{m+n}=\dfrac{n}{m+n}\) なので \(\vec{p}=\dfrac{n}{m+n}\vec{a}+\dfrac{m}{m+n}\vec{b}\)`],a:R`\(\vec{p}=\dfrac{n\vec{a}+m\vec{b}}{m+n}\)`},
 {t:'text',title:'外分点も、同じ考え方で出る',body:[
  R`線分 AB を \(m:n\) に外分する点 Q を考えます。\(m>n\) のとき、Q は B の先にあり、\(AQ:AB=m:(m-n)\) です。向きは同じなので \(\overrightarrow{AQ}=\dfrac{m}{m-n}\overrightarrow{AB}\) です。`,
  R`\[\vec{q}=\vec{a}+\dfrac{m}{m-n}(\vec{b}-\vec{a})=\dfrac{-n\vec{a}+m\vec{b}}{m-n}\]`,
  R`\(m<n\) のとき、Q は A の手前にあり、\(\overrightarrow{AQ}\) は \(\overrightarrow{AB}\) と反対向きで \(\overrightarrow{AQ}=-\dfrac{m}{n-m}\overrightarrow{AB}=\dfrac{m}{m-n}\overrightarrow{AB}\) です。同じ式になります。`,
  R`内分点の式で \(t=\dfrac{m}{m+n}\) とおくと \(\vec{p}=(1-t)\vec{a}+t\vec{b}\) です。係数の和が 1 であることが、「点が直線 AB の上にある」ことを表しています。この形は、直線のベクトル方程式でもう一度使います。`]},
 {t:'quiz',lv:'基本',q:R`2点 \(A(\vec{a})\)、\(B(\vec{b})\) に対して、位置ベクトルが \(\vec{p}=\dfrac{3\vec{a}+5\vec{b}}{8}\) である点 P は、線分 AB をどのような比に分ける点ですか。`,
  steps:[R`\(\vec{p}=\dfrac38\vec{a}+\dfrac58\vec{b}=\vec{a}+\dfrac58(\vec{b}-\vec{a})\)`,R`P は A から B へ向かって、全体の \(\dfrac58\) だけ進んだ点`,R`\(AP:PB=\dfrac58:\dfrac38=5:3\)`],a:R`線分 AB を \(5:3\) に内分する点`},
 {t:'quiz',lv:'発展',fig:'hcvector_jushin',q:R`△ABC の3頂点を \(A(\vec{a})\)、\(B(\vec{b})\)、\(C(\vec{c})\) とし、辺 BC の中点を M とします。中線 AM を \(2:1\) に内分する点 G の位置ベクトルが \(\dfrac{\vec{a}+\vec{b}+\vec{c}}{3}\) であることを示しなさい。また、このことから、3本の中線が1点で交わることを説明しなさい。`,
  steps:[R`M の位置ベクトルは \(\vec{m}=\dfrac{\vec{b}+\vec{c}}{2}\)`,R`G は AM を \(2:1\) に内分するので \(\vec{g}=\dfrac{1\cdot\vec{a}+2\vec{m}}{2+1}=\dfrac{\vec{a}+(\vec{b}+\vec{c})}{3}\)`,R`この式は \(\vec{a},\ \vec{b},\ \vec{c}\) を入れかえても変わらない。だから、B からの中線、C からの中線を \(2:1\) に内分する点の位置ベクトルも、同じ式になる`,R`3本の中線は、どれも同じ点 G を通る`],a:R`\(\vec{g}=\dfrac{\vec{a}+\vec{b}+\vec{c}}{3}\)。3本の中線は、それぞれを \(2:1\) に内分する点 G で交わる`}
]},

{id:'hcvector-zukei',ch:'hC-vector',sec:P2,name:'ベクトルと図形',kind:'main',pre:['hcvector-ichi','hcvector-naiseki'],screens:[
 {t:'intro',lead:R`位置ベクトルと内積を使って、3点が一直線上にあること、2直線の交点の位置、2直線が垂直であることを、計算で示します。`,
  why:R`補助線を思いつくかどうかに頼らず、「2つのベクトルですべてを表して、係数をくらべる」という決まった手順で、図形の性質を証明できるようになります。`},
 {t:'text',title:'3点が一直線上にある条件',body:[
  R`2点 A, B が異なるとき、点 C が直線 AB 上にあるのは、\(\overrightarrow{AC}\) が \(\overrightarrow{AB}\) の実数倍になっているときです。`,
  R`\[\text{3点 A, B, C が一直線上にある}\iff\overrightarrow{AC}=k\overrightarrow{AB}\ \text{となる実数}\ k\ \text{がある}\]`,
  R`\(k\) の値から、点の並び方と長さの比も分かります。たとえば \(\overrightarrow{AC}=\dfrac34\overrightarrow{AB}\) なら、C は線分 AB 上にあり \(AC:CB=3:1\) です。`]},
 {t:'fig',fig:'hcvector_koten',title:'交点の位置ベクトルを求める',text:R`△OAB で、辺 OA 上に点 C、辺 OB 上に点 D をとり、線分 AD と BC の交点を P とします。P は AD 上にあるので \(\overrightarrow{OP}=(1-s)\overrightarrow{OA}+s\overrightarrow{OD}\)、BC 上にもあるので \(\overrightarrow{OP}=t\overrightarrow{OC}+(1-t)\overrightarrow{OB}\) と書けます。どちらも \(\vec{a},\ \vec{b}\) で表すと、表し方はただ1通りなので、係数どうしが等しくなります。C と D の位置を変えて、係数がどう変わるかを見てください。`},
 {t:'fig',fig:'hcvector_hishigata',title:'垂直は、内積が 0',text:R`平行四辺形の2本の対角線は、\(\vec{a}+\vec{b}\) と \(\vec{b}-\vec{a}\) で表せます。内積を計算すると \((\vec{a}+\vec{b})\cdot(\vec{b}-\vec{a})=|\vec{b}|^2-|\vec{a}|^2\) です。\(|\vec{a}|=|\vec{b}|\)（ひし形）のときだけ内積が 0 になり、対角線が垂直に交わります。なす角を変えてもこの値が変わらないことも確かめてください。`},
 {t:'points',items:[
  ['一直線上',R`3点 A, B, C が一直線上にある \(\iff\overrightarrow{AC}=k\overrightarrow{AB}\) となる実数 \(k\) がある`],
  ['交点',R`交点の位置ベクトルを2通りに表し、\(\vec{a},\ \vec{b}\) の係数をくらべる`],
  ['垂直',R`\(\overrightarrow{AB}\perp\overrightarrow{CD}\) を示すには、\(\overrightarrow{AB}\cdot\overrightarrow{CD}=0\) を示す`],
  ['手順',R`基準にする2つのベクトルを決める → すべての点をそれで表す → 計算する`]],
  trap:R`係数をくらべてよいのは、\(\vec{a},\ \vec{b}\) が \(\vec{0}\) でなく、平行でもないときだけです。証明では「\(\vec{a}\ne\vec{0}\)、\(\vec{b}\ne\vec{0}\) で、\(\vec{a}\) と \(\vec{b}\) は平行でないから」と、この条件を書きます。`},
 {t:'ex',fig:'hcvector_q',arg:'heiko2',q:R`平行四辺形 ABCD で、辺 BC を \(1:2\) に内分する点を E、対角線 BD を \(1:3\) に内分する点を F とします。3点 A, F, E は一直線上にあることを証明しなさい。`,
  steps:[R`\(\overrightarrow{AB}=\vec{b}\)、\(\overrightarrow{AD}=\vec{d}\) とする`,R`\(\overrightarrow{BC}=\vec{d}\) なので \(\overrightarrow{AE}=\overrightarrow{AB}+\dfrac13\overrightarrow{BC}=\vec{b}+\dfrac13\vec{d}=\dfrac{3\vec{b}+\vec{d}}{3}\)`,R`F は BD を \(1:3\) に内分するので \(\overrightarrow{AF}=\dfrac{3\overrightarrow{AB}+\overrightarrow{AD}}{1+3}=\dfrac{3\vec{b}+\vec{d}}{4}\)`,R`よって \(\overrightarrow{AF}=\dfrac34\overrightarrow{AE}\)`],a:R`\(\overrightarrow{AF}=\dfrac34\overrightarrow{AE}\) なので、3点 A, F, E は一直線上にある（\(AF:FE=3:1\)）`},
 {t:'quiz',lv:'基本',q:R`3点 A\((1,\ 2)\)、B\((3,\ 5)\)、C\((7,\ y)\) が一直線上にあるとき、\(y\) の値を求めなさい。`,
  steps:[R`\(\overrightarrow{AB}=(2,\ 3)\)、\(\overrightarrow{AC}=(6,\ y-2)\)`,R`\(\overrightarrow{AC}=k\overrightarrow{AB}\) となる \(k\) がある。\(x\) 成分から \(6=2k\)、\(k=3\)`,R`\(y\) 成分：\(y-2=3\cdot3=9\)`],a:R`\(y=11\)`},
 {t:'quiz',lv:'応用',fig:'hcvector_q',arg:'koten2',q:R`△OAB で、辺 OA を \(1:2\) に内分する点を C、辺 OB の中点を D とし、線分 AD と BC の交点を P とします。\(\overrightarrow{OA}=\vec{a}\)、\(\overrightarrow{OB}=\vec{b}\) として、(1) \(\overrightarrow{OP}\) を \(\vec{a},\ \vec{b}\) で表しなさい。(2) 直線 OP と辺 AB の交点を Q とするとき、\(AQ:QB\) を求めなさい。`,
  steps:[R`(1) \(\overrightarrow{OC}=\dfrac13\vec{a}\)、\(\overrightarrow{OD}=\dfrac12\vec{b}\)。P は AD 上：\(\overrightarrow{OP}=(1-s)\vec{a}+\dfrac{s}{2}\vec{b}\)。P は BC 上：\(\overrightarrow{OP}=\dfrac{t}{3}\vec{a}+(1-t)\vec{b}\)`,R`\(\vec{a}\ne\vec{0}\)、\(\vec{b}\ne\vec{0}\) で平行でないから、係数をくらべて \(1-s=\dfrac{t}{3}\)、\(\dfrac{s}{2}=1-t\)`,R`2つめから \(s=2-2t\)。1つめに代入して \(2t-1=\dfrac{t}{3}\)、\(t=\dfrac35\)、\(s=\dfrac45\)。よって \(\overrightarrow{OP}=\dfrac15\vec{a}+\dfrac25\vec{b}\)`,R`(2) Q は直線 OP 上なので \(\overrightarrow{OQ}=k\overrightarrow{OP}=\dfrac{k}{5}\vec{a}+\dfrac{2k}{5}\vec{b}\)。Q は直線 AB 上なので係数の和は 1：\(\dfrac{3k}{5}=1\)、\(k=\dfrac53\)`,R`\(\overrightarrow{OQ}=\dfrac13\vec{a}+\dfrac23\vec{b}=\dfrac{1\vec{a}+2\vec{b}}{2+1}\)。Q は AB を \(2:1\) に内分する`],a:R`(1) \(\overrightarrow{OP}=\dfrac15\vec{a}+\dfrac25\vec{b}\)　(2) \(AQ:QB=2:1\)`},
 {t:'quiz',lv:'複合',with:['m2-shomei'],fig:'hcvector_q',arg:'nitohen',q:R`\(AB=AC\) の二等辺三角形 ABC で、辺 BC の中点を M とします。\(AM\perp BC\) であることを、ベクトルを使って証明しなさい。`,
  steps:[R`\(\overrightarrow{AB}=\vec{b}\)、\(\overrightarrow{AC}=\vec{c}\) とする。仮定より \(|\vec{b}|=|\vec{c}|\)`,R`\(\overrightarrow{AM}=\dfrac{\vec{b}+\vec{c}}{2}\)、\(\overrightarrow{BC}=\vec{c}-\vec{b}\)`,R`\(\overrightarrow{AM}\cdot\overrightarrow{BC}=\dfrac12(\vec{b}+\vec{c})\cdot(\vec{c}-\vec{b})=\dfrac12\left(|\vec{c}|^2-|\vec{b}|^2\right)=0\)`,R`\(\overrightarrow{AM}\ne\vec{0}\)、\(\overrightarrow{BC}\ne\vec{0}\) で内積が 0 なので垂直`],a:R`\(\overrightarrow{AM}\cdot\overrightarrow{BC}=0\) より \(AM\perp BC\)`},
 {t:'quiz',lv:'発展',fig:'hcvector_q',arg:'suishin',q:R`鋭角三角形 OAB で、頂点 A から辺 OB に引いた垂線と、頂点 B から辺 OA に引いた垂線の交点を H とします。\(OH\perp AB\) であることを証明しなさい。`,
  steps:[R`\(\overrightarrow{OA}=\vec{a}\)、\(\overrightarrow{OB}=\vec{b}\)、\(\overrightarrow{OH}=\vec{h}\) とする`,R`\(AH\perp OB\) より \((\vec{h}-\vec{a})\cdot\vec{b}=0\)。よって \(\vec{h}\cdot\vec{b}=\vec{a}\cdot\vec{b}\) …①`,R`\(BH\perp OA\) より \((\vec{h}-\vec{b})\cdot\vec{a}=0\)。よって \(\vec{h}\cdot\vec{a}=\vec{a}\cdot\vec{b}\) …②`,R`①−②：\(\vec{h}\cdot(\vec{b}-\vec{a})=0\)、すなわち \(\overrightarrow{OH}\cdot\overrightarrow{AB}=0\)`,R`鋭角三角形なので H は三角形の内部にあり、\(\overrightarrow{OH}\ne\vec{0}\)。\(\overrightarrow{AB}\ne\vec{0}\) なので垂直`],a:R`\(\overrightarrow{OH}\cdot\overrightarrow{AB}=0\) より \(OH\perp AB\)（3本の垂線は1点 H で交わる。H を垂心という）`}
]},

{id:'hcvector-hoteishiki',ch:'hC-vector',sec:P2,name:'ベクトル方程式',kind:'main',pre:['hcvector-zukei','h2-zukeishiki'],screens:[
 {t:'intro',lead:R`直線や円の上の点 P の位置ベクトル \(\vec{p}\) が満たす式を、その図形のベクトル方程式といいます。`,
  why:R`「点 A を通り \(\vec{d}\) に平行」「\(\vec{n}\) に垂直」「中心からの距離が一定」という図形の決め方が、そのまま式になります。成分で書き直すと、数学II で学んだ直線や円の方程式に戻ります。`},
 {t:'fig',fig:'hcvector_chokusen',title:'点 A を通り、d に平行な直線',text:R`点 \(A(\vec{a})\) を通り、\(\vec{0}\) でないベクトル \(\vec{d}\) に平行な直線の上の点 \(P(\vec{p})\) は、\(\overrightarrow{AP}=t\vec{d}\) を満たします。つまり \(\vec{p}=\vec{a}+t\vec{d}\) です。\(\vec{d}\) を<b>方向ベクトル</b>、\(t\) を<b>媒介変数</b>といいます。\(t\) を動かすと、P は直線全体を動きます。成分で書いた \(x=1+2t\)、\(y=2+t\) のような式を、直線の<b>媒介変数表示</b>といいます。`},
 {t:'text',title:'2点を通る直線と、点の存在範囲',body:[
  R`異なる2点 \(A(\vec{a})\)、\(B(\vec{b})\) を通る直線は、方向ベクトルを \(\overrightarrow{AB}=\vec{b}-\vec{a}\) として \(\vec{p}=\vec{a}+t(\vec{b}-\vec{a})\) です。整理すると`,
  R`\[\vec{p}=(1-t)\vec{a}+t\vec{b}\qquad\text{すなわち}\qquad\vec{p}=s\vec{a}+t\vec{b},\quad s+t=1\]`,
  R`となります。さらに \(s\ge0,\ t\ge0\) という条件を加えると、P は線分 AB の上だけを動きます。`]},
 {t:'fig',fig:'hcvector_bunkai',arg:{range:true},title:'s + t = 1 のとき、P は直線 AB 上',text:R`\(\overrightarrow{OP}=s\overrightarrow{OA}+t\overrightarrow{OB}\) の \(s,\ t\) を動かします。\(s+t=1\) のとき P は金色の点線（直線 AB）の上にあり、さらに \(s\ge0,\ t\ge0\) なら線分 AB の上です。\(s\ge0,\ t\ge0,\ s+t\le1\) のとき、P は △OAB の周または内部にあります。`},
 {t:'fig',fig:'hcvector_hosen',title:'点 A を通り、n に垂直な直線',text:R`点 \(A(\vec{a})\) を通り、\(\vec{0}\) でないベクトル \(\vec{n}\) に垂直な直線の上の点 \(P(\vec{p})\) は、\(\vec{n}\cdot\overrightarrow{AP}=0\)、つまり \(\vec{n}\cdot(\vec{p}-\vec{a})=0\) を満たします。\(\vec{n}\) を<b>法線ベクトル</b>といいます。\(\vec{n}=(a,\ b)\)、\(A(x_1,\ y_1)\) として成分で書くと \(a(x-x_1)+b(y-y_1)=0\) です。だから、直線 \(ax+by+c=0\) の法線ベクトルは \((a,\ b)\) です。`},
 {t:'fig',fig:'hcvector_en',title:'円のベクトル方程式',text:R`点 \(C(\vec{c})\) を中心とする半径 \(r\) の円は、\(|\vec{p}-\vec{c}|=r\) で表せます。また、2点 \(A(\vec{a})\)、\(B(\vec{b})\) を直径の両端とする円は、\((\vec{p}-\vec{a})\cdot(\vec{p}-\vec{b})=0\) で表せます。直径に対する円周角が \(90^\circ\) であること（\(AP\perp BP\)）を、内積で書いた式です。`},
 {t:'points',items:[
  ['方向ベクトル',R`点 \(A(\vec{a})\) を通り \(\vec{d}\) に平行な直線：\(\vec{p}=\vec{a}+t\vec{d}\)`],
  ['2点を通る直線',R`\(\vec{p}=(1-t)\vec{a}+t\vec{b}\)。\(\vec{p}=s\vec{a}+t\vec{b}\)、\(s+t=1\) とも書ける`],
  ['法線ベクトル',R`点 \(A(\vec{a})\) を通り \(\vec{n}\) に垂直な直線：\(\vec{n}\cdot(\vec{p}-\vec{a})=0\)。直線 \(ax+by+c=0\) の法線ベクトルは \((a,\ b)\)`],
  ['円',R`\(|\vec{p}-\vec{c}|=r\)。直径の両端が A, B の円は \((\vec{p}-\vec{a})\cdot(\vec{p}-\vec{b})=0\)`]],
  trap:R`方向ベクトルは直線に平行、法線ベクトルは直線に垂直です。直線 \(ax+by+c=0\) の係数の組 \((a,\ b)\) は法線ベクトルで、方向ベクトルではありません。方向ベクトルの1つは \((b,\ -a)\) です。`},
 {t:'ex',q:R`点 A\((2,\ 1)\) を通り、\(\vec{d}=(3,\ -2)\) に平行な直線を、媒介変数 \(t\) を使って表しなさい。また、\(t\) を消去して \(x,\ y\) の方程式にしなさい。`,
  steps:[R`\((x,\ y)=(2,\ 1)+t(3,\ -2)\) より \(x=2+3t\)、\(y=1-2t\)`,R`\(t\) を消去する：1つめを2倍、2つめを3倍してたすと \(2x+3y=4+3=7\)`,R`確かめ：点 \((2,\ 1)\) は \(2\cdot2+3\cdot1=7\) を満たす。法線ベクトル \((2,\ 3)\) と \(\vec{d}\) の内積は \(6-6=0\)`],a:R`\(x=2+3t,\ y=1-2t\)。\(t\) を消去すると \(2x+3y-7=0\)`},
 {t:'quiz',lv:'基本',q:R`点 A\((1,\ -2)\) を通り、\(\vec{n}=(3,\ 4)\) に垂直な直線の方程式を求めなさい。`,
  steps:[R`直線上の点を P\((x,\ y)\) とすると \(\vec{n}\cdot\overrightarrow{AP}=0\)`,R`\(3(x-1)+4(y+2)=0\)`,R`整理：\(3x+4y+5=0\)`],a:R`\(3x+4y+5=0\)`},
 {t:'quiz',lv:'応用',q:R`△OAB に対して、点 P が \(\overrightarrow{OP}=s\overrightarrow{OA}+t\overrightarrow{OB}\)、\(s+t=2\)、\(s\ge0\)、\(t\ge0\) を満たしながら動くとき、点 P の存在範囲を求めなさい。`,
  steps:[R`係数の和を 1 にする。\(s+t=2\) の両辺を 2 で割って \(\dfrac{s}{2}+\dfrac{t}{2}=1\)`,R`\(\overrightarrow{OP}=\dfrac{s}{2}\left(2\overrightarrow{OA}\right)+\dfrac{t}{2}\left(2\overrightarrow{OB}\right)\) と書き直す`,R`\(\overrightarrow{OA'}=2\overrightarrow{OA}\)、\(\overrightarrow{OB'}=2\overrightarrow{OB}\) となる点 A′, B′ をとり、\(s'=\dfrac{s}{2}\)、\(t'=\dfrac{t}{2}\) とおくと、\(\overrightarrow{OP}=s'\overrightarrow{OA'}+t'\overrightarrow{OB'}\)、\(s'+t'=1\)、\(s'\ge0\)、\(t'\ge0\)`],a:R`\(\overrightarrow{OA'}=2\overrightarrow{OA}\)、\(\overrightarrow{OB'}=2\overrightarrow{OB}\) となる点 A′, B′ を結ぶ線分 A′B′`},
 {t:'quiz',lv:'複合',with:['h2-zukeishiki'],q:R`2点 A\((1,\ 2)\)、B\((5,\ -2)\) を直径の両端とする円の方程式を、ベクトル方程式 \((\vec{p}-\vec{a})\cdot(\vec{p}-\vec{b})=0\) から求めなさい。また、中心の座標と半径を答えなさい。`,
  steps:[R`円周上の点を P\((x,\ y)\) とすると \(\vec{p}-\vec{a}=(x-1,\ y-2)\)、\(\vec{p}-\vec{b}=(x-5,\ y+2)\)`,R`内積が 0：\((x-1)(x-5)+(y-2)(y+2)=0\)`,R`展開：\(x^2-6x+5+y^2-4=0\)。平方完成して \((x-3)^2+y^2=8\)`,R`確かめ：中心 \((3,\ 0)\) は AB の中点。半径 \(2\sqrt2\) は \(AB=\sqrt{16+16}=4\sqrt2\) の半分`],a:R`\((x-3)^2+y^2=8\)。中心 \((3,\ 0)\)、半径 \(2\sqrt2\)`},
 {t:'quiz',lv:'発展',q:R`点 P\((x_0,\ y_0)\) と直線 \(\ell:ax+by+c=0\) の距離が \(\dfrac{|ax_0+by_0+c|}{\sqrt{a^2+b^2}}\) であることを、法線ベクトル \(\vec{n}=(a,\ b)\) を使って導きなさい。`,
  steps:[R`P から \(\ell\) に下ろした垂線の足を H とする。\(\overrightarrow{PH}\) は \(\ell\) に垂直なので \(\vec{n}\) に平行で、\(\overrightarrow{PH}=k\vec{n}\) と書ける`,R`H の座標は \((x_0+ka,\ y_0+kb)\)。H は \(\ell\) 上にあるので \(a(x_0+ka)+b(y_0+kb)+c=0\)`,R`\(k\) について解く：\(k(a^2+b^2)=-(ax_0+by_0+c)\) より \(k=-\dfrac{ax_0+by_0+c}{a^2+b^2}\)`,R`\(PH=|k||\vec{n}|=\dfrac{|ax_0+by_0+c|}{a^2+b^2}\cdot\sqrt{a^2+b^2}\)`],a:R`\(PH=\dfrac{|ax_0+by_0+c|}{\sqrt{a^2+b^2}}\)`}
]},

{id:'hcvector-kukan-zahyo',ch:'hC-vector',sec:K,name:'空間の座標',kind:'main',pre:['hcvector-seibun','m3-sanheiho'],screens:[
 {t:'intro',lead:R`空間の点の位置を、3つの実数の組 \((x,\ y,\ z)\) で表します。平面の座標に、高さを表す \(z\) 座標を加えたものです。`,
  why:R`空間の図形は紙の上にそのままかけませんが、座標にすれば、距離を計算で求められます。このあと学ぶ空間のベクトルの成分は、この座標がもとになります。`},
 {t:'text',title:'座標軸と座標平面',body:[
  R`空間に点 O をとり、O で互いに直交する3本の数直線を引きます。これを \(x\) 軸、\(y\) 軸、\(z\) 軸といい、まとめて<b>座標軸</b>といいます。O が原点です。`,
  R`\(x\) 軸と \(y\) 軸で決まる平面を <b>\(xy\) 平面</b>、\(y\) 軸と \(z\) 軸で決まる平面を \(yz\) 平面、\(z\) 軸と \(x\) 軸で決まる平面を \(zx\) 平面といいます。この3つが<b>座標平面</b>です。`,
  R`点 P を通り、各座標軸に垂直な平面が、\(x\) 軸、\(y\) 軸、\(z\) 軸と交わる点の座標を \(a,\ b,\ c\) とするとき、\((a,\ b,\ c)\) を点 P の<b>座標</b>といいます。座標の定められた空間を<b>座標空間</b>といいます。`]},
 {t:'fig',fig:'hcvector_zahyo3',title:'点 P の座標と、原点からの距離',text:R`\(x\) 軸を手前、\(y\) 軸を右、\(z\) 軸を上に向けてかいた見取図です。点 P の真下にある \(xy\) 平面上の点を Q とすると、Q の座標は \((a,\ b,\ 0)\) です。△OQP は \(\angle OQP=90^\circ\) の直角三角形なので、三平方の定理を2回使って \(OP=\sqrt{a^2+b^2+c^2}\) が求まります。`},
 {t:'text',title:'対称な点と、2点間の距離',body:R`点 P\((a,\ b,\ c)\) と対称な点の座標は、次のようになります。座標平面に関して対称な点は、その平面に垂直な方向の座標だけ符号が変わります。座標軸に関して対称な点は、その軸の座標だけが変わりません。`,
  table:{head:['何に関して対称か','座標'],rows:[[R`\(xy\) 平面`,R`\((a,\ b,\ -c)\)`],[R`\(yz\) 平面`,R`\((-a,\ b,\ c)\)`],[R`\(zx\) 平面`,R`\((a,\ -b,\ c)\)`],[R`\(x\) 軸`,R`\((a,\ -b,\ -c)\)`],[R`\(z\) 軸`,R`\((-a,\ -b,\ c)\)`],['原点',R`\((-a,\ -b,\ -c)\)`]]},
  after:R`2点 \(A(x_1,\ y_1,\ z_1)\)、\(B(x_2,\ y_2,\ z_2)\) の間の距離は、座標の差を3辺とする直方体の対角線の長さなので、\(AB=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}\) です。`},
 {t:'points',items:[
  ['座標',R`点 P\((a,\ b,\ c)\)。\(xy\) 平面上の点は \(z\) 座標が 0`],
  ['原点からの距離',R`\(OP=\sqrt{a^2+b^2+c^2}\)`],
  ['2点間の距離',R`\(AB=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}\)`],
  ['対称な点',R`座標平面に関して対称：1つの座標の符号が変わる。座標軸に関して対称：2つの座標の符号が変わる`]],
  trap:R`「\(xy\) 平面に関して対称」で符号が変わるのは \(z\) 座標です。名前に出てこない文字の座標が変わります。「\(x\) 軸に関して対称」では逆に、名前に出てくる \(x\) 座標だけがそのままです。`},
 {t:'ex',q:R`点 P\((2,\ 3,\ 4)\) について、次のものを求めなさい。(1) P から \(xy\) 平面に下ろした垂線と \(xy\) 平面の交点 Q の座標　(2) \(yz\) 平面に関して P と対称な点の座標　(3) \(z\) 軸に関して P と対称な点の座標　(4) 原点 O と P の距離`,
  steps:[R`(1) 真下に下ろすので、\(x,\ y\) 座標はそのままで \(z\) 座標が 0：\((2,\ 3,\ 0)\)`,R`(2) \(yz\) 平面に垂直な方向は \(x\) 軸の方向。\(x\) 座標の符号を変える：\((-2,\ 3,\ 4)\)`,R`(3) \(z\) 座標だけそのままで、ほかの符号を変える：\((-2,\ -3,\ 4)\)`,R`(4) \(OP=\sqrt{2^2+3^2+4^2}=\sqrt{29}\)`],a:R`(1) \((2,\ 3,\ 0)\)　(2) \((-2,\ 3,\ 4)\)　(3) \((-2,\ -3,\ 4)\)　(4) \(\sqrt{29}\)`},
 {t:'quiz',lv:'基本',q:R`2点 A\((1,\ -2,\ 3)\)、B\((3,\ 1,\ -3)\) の間の距離を求めなさい。`,
  steps:[R`座標の差は \(3-1=2\)、\(1-(-2)=3\)、\(-3-3=-6\)`,R`\(AB=\sqrt{2^2+3^2+(-6)^2}=\sqrt{49}\)`],a:R`\(AB=7\)`},
 {t:'quiz',lv:'基本',q:R`点 P\((3,\ -1,\ 2)\) と、次のものに関して対称な点の座標を求めなさい。(1) \(zx\) 平面　(2) \(y\) 軸　(3) 原点`,
  steps:[R`(1) \(zx\) 平面に垂直な方向の \(y\) 座標だけ符号を変える：\((3,\ 1,\ 2)\)`,R`(2) \(y\) 座標だけそのままで、ほかの符号を変える：\((-3,\ -1,\ -2)\)`,R`(3) すべての符号を変える：\((-3,\ 1,\ -2)\)`],a:R`(1) \((3,\ 1,\ 2)\)　(2) \((-3,\ -1,\ -2)\)　(3) \((-3,\ 1,\ -2)\)`},
 {t:'quiz',lv:'応用',q:R`2点 A\((1,\ 2,\ -1)\)、B\((3,\ 0,\ 1)\) から等しい距離にある \(x\) 軸上の点 P の座標を求めなさい。`,
  steps:[R`P は \(x\) 軸上にあるので P\((x,\ 0,\ 0)\) とおける`,R`\(AP^2=(x-1)^2+2^2+1^2=x^2-2x+6\)、\(BP^2=(x-3)^2+0^2+1^2=x^2-6x+10\)`,R`\(AP^2=BP^2\) より \(-2x+6=-6x+10\)、\(x=1\)`,R`確かめ：\(AP^2=0+4+1=5\)、\(BP^2=4+0+1=5\)`],a:R`P\((1,\ 0,\ 0)\)`},
 {t:'quiz',lv:'複合',with:['m3-sanheiho'],q:R`3点 A\((1,\ 1,\ 0)\)、B\((0,\ 1,\ 1)\)、C\((1,\ 0,\ 1)\) を頂点とする △ABC は、どんな三角形ですか。また、その面積を求めなさい。`,
  steps:[R`\(AB^2=1+0+1=2\)、\(BC^2=1+1+0=2\)、\(CA^2=0+1+1=2\)`,R`3辺の長さがすべて \(\sqrt2\) なので正三角形`,R`1辺 \(\sqrt2\) の正三角形の高さは \(\dfrac{\sqrt3}{2}\cdot\sqrt2=\dfrac{\sqrt6}{2}\)`,R`面積：\(\dfrac12\cdot\sqrt2\cdot\dfrac{\sqrt6}{2}=\dfrac{\sqrt{12}}{4}=\dfrac{\sqrt3}{2}\)`],a:R`1辺 \(\sqrt2\) の正三角形。面積 \(\dfrac{\sqrt3}{2}\)`}
]},

{id:'hcvector-kukan-seibun',ch:'hC-vector',sec:K,name:'空間のベクトルと成分',kind:'main',pre:['hcvector-kukan-zahyo','hcvector-enzan'],screens:[
 {t:'intro',lead:R`空間でも、ベクトルは向きと大きさで決まり、和・差・実数倍は平面のときと同じように定めます。ちがいは、成分が3つになることと、分解に3つのベクトルが必要になることです。`,
  why:R`平面で身につけた計算の決まりが、そのまま空間で使えます。新しく覚えることは少なく、\(z\) 成分を1つ足すだけです。`,
  note:R`教科書の項「空間のベクトル」と「ベクトルの成分」を、この星でまとめて扱います。`},
 {t:'fig',fig:'hcvector_hako',title:'3つのベクトルで、空間のすべての点を表す',text:R`同じ平面上にない4点 O, A, B, C をとり、\(\overrightarrow{OA}=\vec{a}\)、\(\overrightarrow{OB}=\vec{b}\)、\(\overrightarrow{OC}=\vec{c}\) とします。この3辺で決まる平行六面体（向かい合う面が平行な六面体）の上で、\(\vec{a},\ \vec{b},\ \vec{c}\) を順につぎ足すと、対角線 \(\overrightarrow{OG}=\vec{a}+\vec{b}+\vec{c}\) になります。空間のどんなベクトル \(\vec{p}\) も、\(\vec{p}=s\vec{a}+t\vec{b}+u\vec{c}\) の形に、ただ1通りに表せます。`},
 {t:'fig',fig:'hcvector_zahyo3',arg:{vec:true},title:'成分は3つ',text:R`座標空間で、\(\vec{a}=\overrightarrow{OA}\) となる点 A の座標が \((a_1,\ a_2,\ a_3)\) のとき、\(\vec{a}=(a_1,\ a_2,\ a_3)\) と書きます。基本ベクトル \(\vec{e_1}=(1,\ 0,\ 0)\)、\(\vec{e_2}=(0,\ 1,\ 0)\)、\(\vec{e_3}=(0,\ 0,\ 1)\) を使うと \(\vec{a}=a_1\vec{e_1}+a_2\vec{e_2}+a_3\vec{e_3}\) です。図の3本の線分が、この3つの項にあたります。大きさは \(|\vec{a}|=\sqrt{a_1^2+a_2^2+a_3^2}\) です。`},
 {t:'text',title:'成分による計算',body:[
  R`和・差・実数倍は、平面のときと同じく、成分ごとに計算します。`,
  R`\[(a_1,\ a_2,\ a_3)\pm(b_1,\ b_2,\ b_3)=(a_1\pm b_1,\ a_2\pm b_2,\ a_3\pm b_3),\qquad k(a_1,\ a_2,\ a_3)=(ka_1,\ ka_2,\ ka_3)\]`,
  R`2点 \(A(a_1,\ a_2,\ a_3)\)、\(B(b_1,\ b_2,\ b_3)\) について、\(\overrightarrow{AB}=(b_1-a_1,\ b_2-a_2,\ b_3-a_3)\) です。\(\vec{0}\) でない2つのベクトルが平行である条件 \(\vec{b}=k\vec{a}\) も、平面と同じです。`]},
 {t:'points',items:[
  ['演算',R`和・差・実数倍の定め方と計算法則は、平面のときと同じ`],
  ['分解',R`同じ平面上にない4点 O, A, B, C について、どんな \(\vec{p}\) も \(s\vec{a}+t\vec{b}+u\vec{c}\) の形にただ1通りに表せる`],
  ['成分と大きさ',R`\(\vec{a}=(a_1,\ a_2,\ a_3)\)、\(|\vec{a}|=\sqrt{a_1^2+a_2^2+a_3^2}\)`],
  ['2点を結ぶベクトル',R`\(\overrightarrow{AB}=(b_1-a_1,\ b_2-a_2,\ b_3-a_3)\)`]],
  trap:R`空間では、平行でない2つのベクトルだけでは、すべてのベクトルを表せません。\(s\vec{a}+t\vec{b}\) で表せるのは、\(\vec{a}\) と \(\vec{b}\) が決める平面の上のベクトルだけです。3つめの \(\vec{c}\) は、その平面の上にないものを選びます。`},
 {t:'ex',fig:'hcvector_q',arg:'rokumentai',q:R`平行六面体 ABCD-EFGH で、\(\overrightarrow{AB}=\vec{a}\)、\(\overrightarrow{AD}=\vec{b}\)、\(\overrightarrow{AE}=\vec{c}\) とします。(1) \(\overrightarrow{AG}\) と \(\overrightarrow{BH}\) を \(\vec{a},\ \vec{b},\ \vec{c}\) で表しなさい。(2) 対角線 AG の中点と、対角線 BH の中点は一致することを証明しなさい。`,
  steps:[R`(1) \(\overrightarrow{AG}=\overrightarrow{AB}+\overrightarrow{BC}+\overrightarrow{CG}=\vec{a}+\vec{b}+\vec{c}\)`,R`\(\overrightarrow{BH}=\overrightarrow{BA}+\overrightarrow{AD}+\overrightarrow{DH}=-\vec{a}+\vec{b}+\vec{c}\)`,R`(2) AG の中点を M とすると \(\overrightarrow{AM}=\dfrac12\overrightarrow{AG}=\dfrac{\vec{a}+\vec{b}+\vec{c}}{2}\)`,R`BH の中点を N とすると \(\overrightarrow{AN}=\overrightarrow{AB}+\dfrac12\overrightarrow{BH}=\vec{a}+\dfrac{-\vec{a}+\vec{b}+\vec{c}}{2}=\dfrac{\vec{a}+\vec{b}+\vec{c}}{2}\)`,R`\(\overrightarrow{AM}=\overrightarrow{AN}\) なので、M と N は同じ点`],a:R`(1) \(\overrightarrow{AG}=\vec{a}+\vec{b}+\vec{c}\)、\(\overrightarrow{BH}=-\vec{a}+\vec{b}+\vec{c}\)　(2) 2つの中点は一致する`},
 {t:'quiz',lv:'基本',q:R`\(\vec{a}=(1,\ -2,\ 3)\)、\(\vec{b}=(2,\ 1,\ -1)\) のとき、\(2\vec{a}-3\vec{b}\) の成分と、\(|\vec{a}|\) を求めなさい。`,
  steps:[R`\(2\vec{a}-3\vec{b}=(2-6,\ -4-3,\ 6+3)=(-4,\ -7,\ 9)\)`,R`\(|\vec{a}|=\sqrt{1^2+(-2)^2+3^2}=\sqrt{14}\)`],a:R`\(2\vec{a}-3\vec{b}=(-4,\ -7,\ 9)\)、\(|\vec{a}|=\sqrt{14}\)`},
 {t:'quiz',lv:'基本',q:R`2点 A\((1,\ 0,\ 2)\)、B\((3,\ -2,\ 3)\) について、\(\overrightarrow{AB}\) の成分と大きさを求めなさい。また、\(\overrightarrow{AB}\) と同じ向きの単位ベクトルを求めなさい。`,
  steps:[R`\(\overrightarrow{AB}=(3-1,\ -2-0,\ 3-2)=(2,\ -2,\ 1)\)`,R`\(|\overrightarrow{AB}|=\sqrt{4+4+1}=3\)`,R`単位ベクトルは、大きさで割ったもの：\(\dfrac13(2,\ -2,\ 1)\)`],a:R`\(\overrightarrow{AB}=(2,\ -2,\ 1)\)、大きさ 3、単位ベクトル \(\left(\dfrac23,\ -\dfrac23,\ \dfrac13\right)\)`},
 {t:'quiz',lv:'応用',q:R`\(\vec{a}=(2,\ -1,\ 3)\) と \(\vec{b}=(x,\ 2,\ z)\) が平行になるように、\(x,\ z\) の値を定めなさい。`,
  steps:[R`\(\vec{b}=k\vec{a}\) となる実数 \(k\) がある：\((x,\ 2,\ z)=(2k,\ -k,\ 3k)\)`,R`\(y\) 成分から \(-k=2\)、\(k=-2\)`,R`\(x=2k=-4\)、\(z=3k=-6\)`],a:R`\(x=-4,\ z=-6\)`},
 {t:'quiz',lv:'複合',with:['m2-shiki'],q:R`\(\vec{a}=(1,\ 1,\ 0)\)、\(\vec{b}=(0,\ 1,\ 1)\)、\(\vec{c}=(1,\ 0,\ 1)\) のとき、\(\vec{p}=(3,\ 4,\ 5)\) を \(s\vec{a}+t\vec{b}+u\vec{c}\) の形で表しなさい。`,
  steps:[R`\(s\vec{a}+t\vec{b}+u\vec{c}=(s+u,\ s+t,\ t+u)\)`,R`成分をくらべて \(s+u=3\)、\(s+t=4\)、\(t+u=5\)`,R`3つの式をたすと \(2(s+t+u)=12\)、\(s+t+u=6\)`,R`これから各式を引いて \(t=3\)、\(u=2\)、\(s=1\)`,R`確かめ：\((1+2,\ 1+3,\ 3+2)=(3,\ 4,\ 5)\)`],a:R`\(\vec{p}=\vec{a}+3\vec{b}+2\vec{c}\)`}
]},

{id:'hcvector-kukan-naiseki',ch:'hC-vector',sec:K,name:'空間のベクトルの内積',kind:'main',pre:['hcvector-kukan-seibun','hcvector-naiseki'],screens:[
 {t:'intro',lead:R`空間のベクトルの内積も、\(\vec{a}\cdot\vec{b}=|\vec{a}||\vec{b}|\cos\theta\) で定めます。成分で計算する式は、\(z\) 成分どうしの積が1つ増えるだけです。`,
  why:R`立体の中の角度は、見取図から読み取ることができません。内積を使えば、成分の計算だけで、角度や垂直かどうかが分かります。`},
 {t:'text',title:'定義と成分',body:[
  R`空間の2つのベクトル \(\vec{a},\ \vec{b}\) も、始点をそろえて \(\overrightarrow{OA},\ \overrightarrow{OB}\) とすれば、3点 O, A, B を通る1つの平面の上にあります。そこで、なす角 \(\theta\) と内積を、平面のときと同じに定めます。`,
  R`\(\vec{a}=(a_1,\ a_2,\ a_3)\)、\(\vec{b}=(b_1,\ b_2,\ b_3)\) のとき、成分では次のようになります。`,
  R`\[\vec{a}\cdot\vec{b}=a_1b_1+a_2b_2+a_3b_3\]`,
  R`導き方は平面のときと同じです。△OAB に余弦定理を使い、\(AB^2=(b_1-a_1)^2+(b_2-a_2)^2+(b_3-a_3)^2\) を展開すると、2乗の項が消えて積の項だけが残ります。なす角の式、垂直の条件、計算法則も、平面と同じ形で成り立ちます。`]},
 {t:'fig',fig:'hcvector_naiseki3',title:'直方体の面の対角線がつくる角',text:R`直方体の1つの頂点 O から、底面の対角線 \(\overrightarrow{OP}\) と側面の対角線 \(\overrightarrow{OQ}\) を引いています。成分から内積と大きさを計算すると、なす角 \(\theta\) が求まります。3辺の長さを等しくして立方体にすると、\(\theta=60^\circ\) です。このとき、P と Q を結ぶ線分も面の対角線で、△OPQ が正三角形になっています。`},
 {t:'points',items:[
  ['定義',R`\(\vec{a}\cdot\vec{b}=|\vec{a}||\vec{b}|\cos\theta\)（平面と同じ）`],
  ['成分',R`\(\vec{a}\cdot\vec{b}=a_1b_1+a_2b_2+a_3b_3\)`],
  ['なす角',R`\(\cos\theta=\dfrac{\vec{a}\cdot\vec{b}}{|\vec{a}||\vec{b}|}\)`],
  ['垂直',R`\(\vec{a}\ne\vec{0},\ \vec{b}\ne\vec{0}\) のとき、\(\vec{a}\perp\vec{b}\iff a_1b_1+a_2b_2+a_3b_3=0\)`]],
  trap:R`2つのベクトルの両方に垂直なベクトルを求めるとき、未知数は3つ、内積の式は2つです。式が1つ足りないので、まず2つの文字を残りの1つの文字で表し、大きさなどの条件で最後に決めます。`},
 {t:'ex',q:R`\(\vec{a}=(1,\ 2,\ -1)\)、\(\vec{b}=(2,\ 1,\ 1)\) の内積と、なす角 \(\theta\) を求めなさい。`,
  steps:[R`内積：\(1\cdot2+2\cdot1+(-1)\cdot1=3\)`,R`大きさ：\(|\vec{a}|=\sqrt{1+4+1}=\sqrt6\)、\(|\vec{b}|=\sqrt{4+1+1}=\sqrt6\)`,R`\(\cos\theta=\dfrac{3}{\sqrt6\cdot\sqrt6}=\dfrac12\)。\(0^\circ\le\theta\le180^\circ\) より \(\theta=60^\circ\)`],a:R`\(\vec{a}\cdot\vec{b}=3\)、\(\theta=60^\circ\)`},
 {t:'quiz',lv:'基本',q:R`\(\vec{a}=(1,\ -2,\ 2)\)、\(\vec{b}=(x,\ 3,\ 1)\) とします。(1) \(x=2\) のとき、内積 \(\vec{a}\cdot\vec{b}\) を求めなさい。(2) \(\vec{a}\perp\vec{b}\) となる \(x\) の値を求めなさい。`,
  steps:[R`(1) \(1\cdot2+(-2)\cdot3+2\cdot1=-2\)`,R`(2) \(\vec{a}\cdot\vec{b}=x-6+2=x-4\)。これが 0 になればよい`],a:R`(1) \(-2\)　(2) \(x=4\)`},
 {t:'quiz',lv:'応用',q:R`2つのベクトル \(\vec{a}=(1,\ 0,\ -2)\)、\(\vec{b}=(0,\ 1,\ 2)\) の両方に垂直な単位ベクトルを、すべて求めなさい。`,
  steps:[R`求めるベクトルを \(\vec{e}=(x,\ y,\ z)\) とする`,R`\(\vec{a}\cdot\vec{e}=x-2z=0\) より \(x=2z\)。\(\vec{b}\cdot\vec{e}=y+2z=0\) より \(y=-2z\)`,R`\(|\vec{e}|^2=x^2+y^2+z^2=4z^2+4z^2+z^2=9z^2=1\) より \(z=\pm\dfrac13\)`,R`\(z=\dfrac13\) のとき \((x,\ y)=\left(\dfrac23,\ -\dfrac23\right)\)、\(z=-\dfrac13\) のとき \((x,\ y)=\left(-\dfrac23,\ \dfrac23\right)\)`],a:R`\(\left(\dfrac23,\ -\dfrac23,\ \dfrac13\right)\)、\(\left(-\dfrac23,\ \dfrac23,\ -\dfrac13\right)\)`},
 {t:'quiz',lv:'複合',with:['h1-sankakuhi'],q:R`原点 O と2点 A\((2,\ 1,\ 0)\)、B\((1,\ 0,\ 1)\) について、\(\cos\angle AOB\) の値と、△OAB の面積を求めなさい。`,
  steps:[R`\(\overrightarrow{OA}\cdot\overrightarrow{OB}=2\cdot1+1\cdot0+0\cdot1=2\)、\(|\overrightarrow{OA}|=\sqrt5\)、\(|\overrightarrow{OB}|=\sqrt2\)`,R`\(\cos\angle AOB=\dfrac{2}{\sqrt5\cdot\sqrt2}=\dfrac{2}{\sqrt{10}}=\dfrac{\sqrt{10}}{5}\)`,R`\(\sin\angle AOB=\sqrt{1-\dfrac{4}{10}}=\sqrt{\dfrac{6}{10}}\)`,R`面積：\(\dfrac12\cdot\sqrt5\cdot\sqrt2\cdot\sqrt{\dfrac{6}{10}}=\dfrac12\sqrt6\)`],a:R`\(\cos\angle AOB=\dfrac{\sqrt{10}}{5}\)、面積 \(\dfrac{\sqrt6}{2}\)`},
 {t:'quiz',lv:'発展',fig:'hcvector_q',arg:'cube',q:R`1辺の長さが 1 の立方体 ABCD-EFGH で、2本の対角線 AG と BH のなす角を \(\theta\) とします。\(\overrightarrow{AB}=\vec{a}\)、\(\overrightarrow{AD}=\vec{b}\)、\(\overrightarrow{AE}=\vec{c}\) として、\(\cos\theta\) の値を求めなさい。`,
  steps:[R`立方体なので \(|\vec{a}|=|\vec{b}|=|\vec{c}|=1\)、\(\vec{a}\cdot\vec{b}=\vec{b}\cdot\vec{c}=\vec{c}\cdot\vec{a}=0\)`,R`\(\overrightarrow{AG}=\vec{a}+\vec{b}+\vec{c}\)、\(\overrightarrow{BH}=-\vec{a}+\vec{b}+\vec{c}\)`,R`\(\overrightarrow{AG}\cdot\overrightarrow{BH}=-|\vec{a}|^2+|\vec{b}|^2+|\vec{c}|^2=-1+1+1=1\)（異なるベクトルどうしの内積は 0 なので消える）`,R`\(|\overrightarrow{AG}|^2=|\vec{a}|^2+|\vec{b}|^2+|\vec{c}|^2=3\)。同じく \(|\overrightarrow{BH}|^2=3\)`,R`\(\cos\theta=\dfrac{1}{\sqrt3\cdot\sqrt3}\)`],a:R`\(\cos\theta=\dfrac13\)`}
]},

{id:'hcvector-kukan-zukei',ch:'hC-vector',sec:K,name:'空間の位置ベクトルと図形',kind:'main',pre:['hcvector-kukan-naiseki','hcvector-zukei'],screens:[
 {t:'intro',lead:R`空間でも、内分点・重心の式と「3点が一直線上にある条件」は、平面と同じ形です。新しいのは、4点が同じ平面上にあるための条件です。`,
  why:R`四面体のような立体でも、3つのベクトル \(\vec{a},\ \vec{b},\ \vec{c}\) で表して係数をくらべる、という平面と同じ手順で、点の位置や垂直を調べられます。`,
  note:R`教科書の項「位置ベクトル」と「ベクトルと図形」を、この星でまとめて扱います。`},
 {t:'text',title:'平面と同じ形で成り立つこと',body:[
  R`空間でも、点 O を固定して、点 P の位置を位置ベクトル \(\vec{p}=\overrightarrow{OP}\) で表します。次の式は、平面のときとまったく同じ形で成り立ちます。導き方も同じです。`,
  R`・線分 AB を \(m:n\) に内分する点：\(\dfrac{n\vec{a}+m\vec{b}}{m+n}\)<br>・△ABC の重心：\(\dfrac{\vec{a}+\vec{b}+\vec{c}}{3}\)<br>・3点 A, B, C が一直線上にある \(\iff\overrightarrow{AC}=k\overrightarrow{AB}\) となる実数 \(k\) がある`]},
 {t:'fig',fig:'hcvector_shimentai',title:'点 P が平面 ABC 上にある条件',text:R`四面体 OABC で、\(\overrightarrow{OP}=s\vec{a}+t\vec{b}+u\vec{c}\) の係数を動かします。係数の和 \(s+t+u\) がちょうど 1 のときだけ、P は平面 ABC の上にあります。和が 1 より小さいと P は平面 ABC より O の側に、大きいと O と反対の側にずれます。`},
 {t:'derive',title:'なぜ「係数の和が 1」なのか',body:R`一直線上にない3点 A, B, C で決まる平面を、平面 ABC といいます。点 P が平面 ABC 上にあることは、\(\overrightarrow{AP}\) が \(\overrightarrow{AB}\) と \(\overrightarrow{AC}\) で表せることと同じです。`,
  steps:[R`P が平面 ABC 上にある \(\iff\overrightarrow{AP}=t\overrightarrow{AB}+u\overrightarrow{AC}\) となる実数 \(t,\ u\) がある`,R`位置ベクトルで書く：\(\vec{p}-\vec{a}=t(\vec{b}-\vec{a})+u(\vec{c}-\vec{a})\)`,R`\(\vec{a}\) を移項してまとめる：\(\vec{p}=(1-t-u)\vec{a}+t\vec{b}+u\vec{c}\)`,R`\(s=1-t-u\) とおくと、\(s+t+u=1\)`],a:R`点 P が平面 ABC 上にある \(\iff\overrightarrow{OP}=s\overrightarrow{OA}+t\overrightarrow{OB}+u\overrightarrow{OC}\)、\(s+t+u=1\) となる実数 \(s,\ t,\ u\) がある`},
 {t:'points',items:[
  ['内分点・重心',R`式は平面と同じ。\(\dfrac{n\vec{a}+m\vec{b}}{m+n}\)、\(\dfrac{\vec{a}+\vec{b}+\vec{c}}{3}\)`],
  ['一直線上',R`\(\overrightarrow{AC}=k\overrightarrow{AB}\) となる実数 \(k\) がある`],
  ['同じ平面上',R`P が平面 ABC 上 \(\iff\overrightarrow{AP}=t\overrightarrow{AB}+u\overrightarrow{AC}\)`],
  ['係数の和',R`P が平面 ABC 上 \(\iff\overrightarrow{OP}=s\overrightarrow{OA}+t\overrightarrow{OB}+u\overrightarrow{OC}\)、\(s+t+u=1\)`]],
  trap:R`「係数の和が 1」を使えるのは、\(\overrightarrow{OA},\ \overrightarrow{OB},\ \overrightarrow{OC}\) の3つで表した式だけです。辺の中点などの別の点へのベクトルが混ざっているときは、平面を決める3点へのベクトルに書き直してから和を計算します。`},
 {t:'ex',fig:'hcvector_q',arg:'shimentai1',q:R`四面体 OABC で、辺 OA の中点を M、辺 BC の中点を N、線分 MN の中点を P、△ABC の重心を G とします。3点 O, P, G は一直線上にあることを証明しなさい。`,
  steps:[R`\(\overrightarrow{OA}=\vec{a}\)、\(\overrightarrow{OB}=\vec{b}\)、\(\overrightarrow{OC}=\vec{c}\) とする`,R`\(\overrightarrow{OM}=\dfrac12\vec{a}\)、\(\overrightarrow{ON}=\dfrac{\vec{b}+\vec{c}}{2}\)`,R`P は MN の中点なので \(\overrightarrow{OP}=\dfrac12\left(\dfrac12\vec{a}+\dfrac{\vec{b}+\vec{c}}{2}\right)=\dfrac{\vec{a}+\vec{b}+\vec{c}}{4}\)`,R`\(\overrightarrow{OG}=\dfrac{\vec{a}+\vec{b}+\vec{c}}{3}\) なので \(\overrightarrow{OP}=\dfrac34\overrightarrow{OG}\)`],a:R`\(\overrightarrow{OP}=\dfrac34\overrightarrow{OG}\) なので、3点 O, P, G は一直線上にある（\(OP:PG=3:1\)）`},
 {t:'quiz',lv:'基本',q:R`3点 A\((1,\ -1,\ 2)\)、B\((3,\ 0,\ 1)\)、C\((x,\ y,\ -1)\) が一直線上にあるとき、\(x,\ y\) の値を求めなさい。`,
  steps:[R`\(\overrightarrow{AB}=(2,\ 1,\ -1)\)、\(\overrightarrow{AC}=(x-1,\ y+1,\ -3)\)`,R`\(\overrightarrow{AC}=k\overrightarrow{AB}\) となる \(k\) がある。\(z\) 成分から \(-3=-k\)、\(k=3\)`,R`\(x-1=6\)、\(y+1=3\)`],a:R`\(x=7,\ y=2\)`},
 {t:'quiz',lv:'応用',q:R`3点 A\((1,\ 2,\ 0)\)、B\((0,\ 1,\ 1)\)、C\((2,\ 0,\ 1)\) で決まる平面上に点 P\((1,\ -1,\ z)\) があるとき、\(z\) の値を求めなさい。`,
  steps:[R`\(\overrightarrow{AP}=s\overrightarrow{AB}+t\overrightarrow{AC}\) となる実数 \(s,\ t\) がある`,R`\(\overrightarrow{AB}=(-1,\ -1,\ 1)\)、\(\overrightarrow{AC}=(1,\ -2,\ 1)\)、\(\overrightarrow{AP}=(0,\ -3,\ z)\)`,R`\(x\) 成分：\(-s+t=0\)。\(y\) 成分：\(-s-2t=-3\)。これを解いて \(s=1,\ t=1\)`,R`\(z\) 成分：\(z=s+t=2\)`],a:R`\(z=2\)`},
 {t:'quiz',lv:'複合',with:['h1-sankakuhi'],fig:'hcvector_q',arg:'seishimentai',q:R`正四面体 OABC（4つの面がすべて正三角形の四面体）で、向かい合う辺 OA と BC は垂直であることを証明しなさい。`,
  steps:[R`\(\overrightarrow{OA}=\vec{a}\)、\(\overrightarrow{OB}=\vec{b}\)、\(\overrightarrow{OC}=\vec{c}\) とし、1辺の長さを \(d\) とする`,R`△OAB と △OAC は正三角形なので、\(\vec{a}\) と \(\vec{b}\)、\(\vec{a}\) と \(\vec{c}\) のなす角はどちらも \(60^\circ\)。\(\vec{a}\cdot\vec{b}=\vec{a}\cdot\vec{c}=d\cdot d\cdot\cos60^\circ=\dfrac{d^2}{2}\)`,R`\(\overrightarrow{OA}\cdot\overrightarrow{BC}=\vec{a}\cdot(\vec{c}-\vec{b})=\vec{a}\cdot\vec{c}-\vec{a}\cdot\vec{b}=0\)`,R`\(\overrightarrow{OA}\ne\vec{0}\)、\(\overrightarrow{BC}\ne\vec{0}\) で内積が 0 なので垂直`],a:R`\(\overrightarrow{OA}\cdot\overrightarrow{BC}=0\) より \(OA\perp BC\)`},
 {t:'quiz',lv:'発展',fig:'hcvector_q',arg:'lmn',q:R`四面体 OABC で、辺 OA を \(1:2\) に内分する点を L、辺 OB の中点を M、辺 OC の中点を N とします。△ABC の重心を G とし、直線 OG と平面 LMN の交点を P とするとき、\(\overrightarrow{OP}\) を \(\vec{a}=\overrightarrow{OA}\)、\(\vec{b}=\overrightarrow{OB}\)、\(\vec{c}=\overrightarrow{OC}\) で表しなさい。また、\(OP:PG\) を求めなさい。`,
  steps:[R`P は直線 OG 上にあるので \(\overrightarrow{OP}=k\overrightarrow{OG}=\dfrac{k}{3}(\vec{a}+\vec{b}+\vec{c})\)`,R`平面 LMN を決める3点へのベクトルで表す。\(\vec{a}=3\overrightarrow{OL}\)、\(\vec{b}=2\overrightarrow{OM}\)、\(\vec{c}=2\overrightarrow{ON}\) なので \(\overrightarrow{OP}=k\overrightarrow{OL}+\dfrac{2k}{3}\overrightarrow{OM}+\dfrac{2k}{3}\overrightarrow{ON}\)`,R`P は平面 LMN 上にあるので、係数の和は 1：\(k+\dfrac{2k}{3}+\dfrac{2k}{3}=\dfrac{7k}{3}=1\) より \(k=\dfrac37\)`,R`\(\overrightarrow{OP}=\dfrac37\overrightarrow{OG}=\dfrac17(\vec{a}+\vec{b}+\vec{c})\)。\(OP:PG=\dfrac37:\dfrac47\)`],a:R`\(\overrightarrow{OP}=\dfrac17\vec{a}+\dfrac17\vec{b}+\dfrac17\vec{c}\)、\(OP:PG=3:4\)`}
]},

{id:'hcvector-kukan-kyumen',ch:'hC-vector',sec:K,name:'座標空間における図形',kind:'main',pre:['hcvector-kukan-zukei','h2-zukeishiki'],screens:[
 {t:'intro',lead:R`座標空間で、線分の内分点・外分点の座標、座標軸に垂直な平面、球面を、式で表します。`,
  why:R`数学II で直線や円を方程式で表したのと同じことを、空間で行います。球面の方程式は、円の方程式に \(z\) の項を1つ足した形になります。`},
 {t:'text',title:'内分点・外分点の座標',body:[
  R`2点 \(A(x_1,\ y_1,\ z_1)\)、\(B(x_2,\ y_2,\ z_2)\) を結ぶ線分 AB を \(m:n\) に内分する点の座標は、位置ベクトルの式 \(\dfrac{n\vec{a}+m\vec{b}}{m+n}\) を成分で書いたものです。`,
  R`\[\left(\dfrac{nx_1+mx_2}{m+n},\ \dfrac{ny_1+my_2}{m+n},\ \dfrac{nz_1+mz_2}{m+n}\right)\]`,
  R`外分点の座標は、この式の \(n\) を \(-n\) に置きかえたものです。3点 A, B, C を頂点とする三角形の重心の座標は、3つの座標の平均 \(\left(\dfrac{x_1+x_2+x_3}{3},\ \dfrac{y_1+y_2+y_3}{3},\ \dfrac{z_1+z_2+z_3}{3}\right)\) です。`]},
 {t:'text',title:'座標軸に垂直な平面',body:[
  R`点 \((a,\ 0,\ 0)\) を通り、\(x\) 軸に垂直な平面を考えます。この平面上の点は、\(y\) 座標と \(z\) 座標が何であっても、\(x\) 座標がいつも \(a\) です。逆に、\(x\) 座標が \(a\) の点はすべてこの平面上にあります。そこで、この平面を方程式 \(x=a\) で表します。この平面は \(yz\) 平面に平行です。`,
  R`同じように、\(y\) 軸に垂直な平面は \(y=b\)、\(z\) 軸に垂直な平面は \(z=c\) で表せます。\(xy\) 平面の方程式は \(z=0\) です。`]},
 {t:'fig',fig:'hcvector_kyumen',title:'球面と、平面 z = k による切り口',text:R`定点 C からの距離が一定の値 \(r\) である点全体が、C を中心とする半径 \(r\) の<b>球面</b>です。中心が \((a,\ b,\ c)\) のとき、球面上の点 \((x,\ y,\ z)\) は \((x-a)^2+(y-b)^2+(z-c)^2=r^2\) を満たします。図は原点を中心とする半径 3 の球面です。平面 \(z=k\) で切ると、切り口は円になります。球面の方程式に \(z=k\) を代入した式から、その円の半径が分かります。`},
 {t:'points',items:[
  ['内分点の座標',R`\(\left(\dfrac{nx_1+mx_2}{m+n},\ \dfrac{ny_1+my_2}{m+n},\ \dfrac{nz_1+mz_2}{m+n}\right)\)。外分は \(n\) を \(-n\) にする`],
  ['座標軸に垂直な平面',R`\(x\) 軸に垂直な平面は \(x=a\)。\(y\) 軸、\(z\) 軸についても同様`],
  ['球面の方程式',R`中心 \((a,\ b,\ c)\)、半径 \(r\) の球面：\((x-a)^2+(y-b)^2+(z-c)^2=r^2\)`],
  ['球面と平面の交わり',R`平面の式を球面の方程式に代入する。得られる円の式から中心と半径を読む`]],
  trap:R`空間では、方程式 \(x=a\) は点でも直線でもなく、平面を表します。式に出てこない \(y,\ z\) は自由に動けるからです。球面を平面 \(z=k\) で切って得た式 \(x^2+y^2=\cdots\) も、「平面 \(z=k\) の上で」という条件と合わせて、はじめて1つの円を表します。`},
 {t:'ex',q:R`2点 A\((1,\ -2,\ 3)\)、B\((5,\ 4,\ -1)\) を直径の両端とする球面の方程式を求めなさい。`,
  steps:[R`中心は線分 AB の中点：\(\left(\dfrac{1+5}{2},\ \dfrac{-2+4}{2},\ \dfrac{3-1}{2}\right)=(3,\ 1,\ 1)\)`,R`\(AB=\sqrt{4^2+6^2+(-4)^2}=\sqrt{68}=2\sqrt{17}\)。半径はその半分で \(\sqrt{17}\)`,R`\((x-3)^2+(y-1)^2+(z-1)^2=17\)`,R`確かめ：A を代入すると \(4+9+4=17\)`],a:R`\((x-3)^2+(y-1)^2+(z-1)^2=17\)`},
 {t:'quiz',lv:'基本',q:R`2点 A\((2,\ -1,\ 4)\)、B\((-4,\ 5,\ 1)\) を結ぶ線分 AB を、\(2:1\) に内分する点 P と、\(2:1\) に外分する点 Q の座標を求めなさい。`,
  steps:[R`P：\(\left(\dfrac{2+2\cdot(-4)}{3},\ \dfrac{-1+2\cdot5}{3},\ \dfrac{4+2\cdot1}{3}\right)=(-2,\ 3,\ 2)\)`,R`Q：\(\left(\dfrac{-2+2\cdot(-4)}{2-1},\ \dfrac{1+2\cdot5}{2-1},\ \dfrac{-4+2\cdot1}{2-1}\right)=(-10,\ 11,\ -2)\)`],a:R`P\((-2,\ 3,\ 2)\)、Q\((-10,\ 11,\ -2)\)`},
 {t:'quiz',lv:'基本',q:R`(1) 点 \((2,\ -3,\ 5)\) を通り、\(xy\) 平面に平行な平面の方程式を求めなさい。(2) 点 \((2,\ -3,\ 5)\) を通り、\(y\) 軸に垂直な平面の方程式を求めなさい。(3) 中心が \((2,\ 0,\ -1)\)、半径が 3 の球面の方程式を求めなさい。`,
  steps:[R`(1) \(xy\) 平面に平行な平面は \(z\) 軸に垂直。\(z\) 座標が一定：\(z=5\)`,R`(2) \(y\) 座標が一定：\(y=-3\)`,R`(3) \((x-2)^2+(y-0)^2+(z-(-1))^2=3^2\)`],a:R`(1) \(z=5\)　(2) \(y=-3\)　(3) \((x-2)^2+y^2+(z+1)^2=9\)`},
 {t:'quiz',lv:'応用',q:R`方程式 \(x^2+y^2+z^2-2x+4y-6z-2=0\) は球面を表します。(1) 中心の座標と半径を求めなさい。(2) この球面と \(xy\) 平面が交わってできる円の、中心の座標と半径を求めなさい。`,
  steps:[R`(1) 文字ごとに平方完成する：\((x-1)^2-1+(y+2)^2-4+(z-3)^2-9-2=0\)`,R`\((x-1)^2+(y+2)^2+(z-3)^2=16\)。中心 \((1,\ -2,\ 3)\)、半径 4`,R`(2) \(xy\) 平面の方程式は \(z=0\)。代入して \((x-1)^2+(y+2)^2+9=16\)`,R`\((x-1)^2+(y+2)^2=7\)、\(z=0\)。中心 \((1,\ -2,\ 0)\)、半径 \(\sqrt7\)`],a:R`(1) 中心 \((1,\ -2,\ 3)\)、半径 4　(2) 中心 \((1,\ -2,\ 0)\)、半径 \(\sqrt7\)`},
 {t:'quiz',lv:'複合',with:['h2-zukeishiki'],q:R`中心が \((1,\ 2,\ 3)\) の球面が \(xy\) 平面に接しています。(1) この球面の方程式を求めなさい。(2) この球面と \(yz\) 平面が交わってできる円の半径を求めなさい。`,
  steps:[R`(1) 中心から \(xy\) 平面（\(z=0\)）までの距離は、中心の \(z\) 座標の絶対値で 3。平面に接するので、半径は 3`,R`\((x-1)^2+(y-2)^2+(z-3)^2=9\)`,R`(2) \(yz\) 平面の方程式は \(x=0\)。代入して \(1+(y-2)^2+(z-3)^2=9\)`,R`\((y-2)^2+(z-3)^2=8\)。半径は \(\sqrt8=2\sqrt2\)`],a:R`(1) \((x-1)^2+(y-2)^2+(z-3)^2=9\)　(2) \(2\sqrt2\)`},
 {t:'quiz',lv:'発展',q:R`点 A\((1,\ 2,\ 3)\) を通り、\(\vec{n}=(2,\ -1,\ 2)\) に垂直な平面 \(\alpha\) があります（教科書では「発展」の内容です）。(1) 平面 \(\alpha\) 上の点 P\((x,\ y,\ z)\) が満たす方程式を、\(\vec{n}\cdot\overrightarrow{AP}=0\) から求めなさい。(2) 原点 O から平面 \(\alpha\) に下ろした垂線の足 H の座標と、OH の長さを求めなさい。`,
  steps:[R`(1) \(\overrightarrow{AP}=(x-1,\ y-2,\ z-3)\)。\(\vec{n}\cdot\overrightarrow{AP}=2(x-1)-(y-2)+2(z-3)=0\)`,R`整理：\(2x-y+2z-6=0\)`,R`(2) \(\overrightarrow{OH}\) は \(\alpha\) に垂直なので \(\vec{n}\) に平行。\(\overrightarrow{OH}=k\vec{n}\) とおくと H\((2k,\ -k,\ 2k)\)`,R`H は \(\alpha\) 上にあるので \(4k+k+4k-6=0\)、\(k=\dfrac23\)`,R`H\(\left(\dfrac43,\ -\dfrac23,\ \dfrac43\right)\)、\(OH=|k||\vec{n}|=\dfrac23\cdot\sqrt{4+1+4}=2\)`],a:R`(1) \(2x-y+2z-6=0\)　(2) H\(\left(\dfrac43,\ -\dfrac23,\ \dfrac43\right)\)、\(OH=2\)`}
]}
);
})();
