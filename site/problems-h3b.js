/* 練習問題：数学C（ベクトル・複素数平面・式と曲線） */
PROBLEMS['hC-vector']=[
 {lv:'基本',q:R`\(\vec{a}=(2,\ -1)\)、\(\vec{b}=(1,\ 3)\) のとき、\(2\vec{a}-\vec{b}\) の成分と大きさを求めなさい。`,
  steps:[R`\(2\vec{a}-\vec{b}=(4-1,\ -2-3)=(3,\ -5)\)`,R`大きさ：\(\sqrt{3^2+(-5)^2}\)`],a:R`\((3,\ -5)\)、大きさ \(\sqrt{34}\)`},
 {lv:'基本',q:R`\(\vec{a}=(3,\ 1)\)、\(\vec{b}=(x,\ 6)\) が (1) 垂直になるとき、(2) 平行になるときの \(x\) の値をそれぞれ求めなさい。`,
  steps:[R`(1) 垂直 \(\iff\) 内積が 0：\(3x+6=0\)`,R`(2) 平行 \(\iff\vec{b}=k\vec{a}\)。\(y\) 成分から \(k=6\)、よって \(x=3\times6\)`],a:R`(1) \(x=-2\)　(2) \(x=18\)`},
 {lv:'応用',q:R`△OAB で、辺 OA を \(2:1\) に内分する点を C、辺 OB の中点を D とし、線分 AD と BC の交点を P とします。\(\overrightarrow{OA}=\vec{a}\)、\(\overrightarrow{OB}=\vec{b}\) として、\(\overrightarrow{OP}\) を \(\vec{a},\ \vec{b}\) で表しなさい。`,
  steps:[R`\(\overrightarrow{OC}=\dfrac23\vec{a}\)、\(\overrightarrow{OD}=\dfrac12\vec{b}\)`,R`P は AD 上：\(\overrightarrow{OP}=(1-s)\vec{a}+\dfrac{s}{2}\vec{b}\)`,R`P は BC 上：\(\overrightarrow{OP}=\dfrac{2t}{3}\vec{a}+(1-t)\vec{b}\)`,R`\(\vec{a},\ \vec{b}\) は平行でないので係数を比べる：\(1-s=\dfrac{2t}{3}\)、\(\dfrac{s}{2}=1-t\)。解くと \(s=\dfrac12,\ t=\dfrac34\)`],a:R`\(\overrightarrow{OP}=\dfrac12\vec{a}+\dfrac14\vec{b}\)`},
 {lv:'複合',with:['h1-sankakuhi'],q:R`\(|\vec{a}|=2\)、\(|\vec{b}|=3\) で、\(\vec{a}\) と \(\vec{b}\) のなす角が \(60^\circ\) のとき、\(|\vec{a}-\vec{b}|\) を求めなさい。また、これが余弦定理と同じ計算であることを確かめなさい。`,
  steps:[R`\(\vec{a}\cdot\vec{b}=2\cdot3\cdot\cos60^\circ=3\)`,R`\(|\vec{a}-\vec{b}|^2=|\vec{a}|^2-2\vec{a}\cdot\vec{b}+|\vec{b}|^2=4-6+9=7\)`,R`2辺が 2, 3 で、その間の角が \(60^\circ\) の三角形の残りの辺は、余弦定理で \(2^2+3^2-2\cdot2\cdot3\cos60^\circ=7\) の平方根。同じ式になる`],a:R`\(|\vec{a}-\vec{b}|=\sqrt7\)`},
 {lv:'発展',q:R`座標空間の3点 A\((1,0,0)\)、B\((0,2,0)\)、C\((0,0,3)\) を通る平面に、原点 O から下ろした垂線の足 H の座標を求めなさい。`,
  steps:[R`H は平面 ABC 上にあるので \(\overrightarrow{OH}=s\overrightarrow{OA}+t\overrightarrow{OB}+u\overrightarrow{OC}\)（\(s+t+u=1\)）。成分は \((s,\ 2t,\ 3u)\)`,R`\(\overrightarrow{OH}\perp\overrightarrow{AB}\)：\(\overrightarrow{AB}=(-1,2,0)\) との内積が 0 より \(-s+4t=0\)`,R`\(\overrightarrow{OH}\perp\overrightarrow{AC}\)：\(\overrightarrow{AC}=(-1,0,3)\) との内積が 0 より \(-s+9u=0\)`,R`\(t=\dfrac{s}{4},\ u=\dfrac{s}{9}\) を \(s+t+u=1\) に代入：\(\dfrac{49}{36}s=1\) より \(s=\dfrac{36}{49}\)、\(t=\dfrac{9}{49}\)、\(u=\dfrac{4}{49}\)`],a:R`H\(\left(\dfrac{36}{49},\ \dfrac{18}{49},\ \dfrac{12}{49}\right)\)`}
];
PROBLEMS['hC-fukuso']=[
 {lv:'基本',q:R`(1) \(z=1+\sqrt3i\) を極形式で表しなさい。(2) 点 \(2+i\) を原点のまわりに \(\dfrac{\pi}{2}\) だけ回転した点を表す複素数を求めなさい。`,
  steps:[R`(1) \(|z|=\sqrt{1+3}=2\)。\(\cos\theta=\dfrac12,\ \sin\theta=\dfrac{\sqrt3}{2}\) より \(\theta=\dfrac{\pi}{3}\)`,R`(2) \(\dfrac{\pi}{2}\) の回転は \(i\) をかけること：\(i(2+i)=2i+i^2\)`],a:R`(1) \(2\left(\cos\dfrac{\pi}{3}+i\sin\dfrac{\pi}{3}\right)\)　(2) \(-1+2i\)`},
 {lv:'応用',q:R`方程式 \(z^3=-8\) を解きなさい。`,
  steps:[R`\(z=r(\cos\theta+i\sin\theta)\) とおくと \(z^3=r^3(\cos3\theta+i\sin3\theta)\)`,R`\(-8=8(\cos\pi+i\sin\pi)\) と比べて \(r^3=8\)、\(3\theta=\pi+2k\pi\)`,R`\(r=2\)、\(\theta=\dfrac{\pi}{3},\ \pi,\ \dfrac53\pi\)（\(k=0,1,2\)）`],a:R`\(z=1+\sqrt3i,\ -2,\ 1-\sqrt3i\)`},
 {lv:'複合',with:['h2-sankaku'],q:R`ド・モアブルの定理を用いて、3倍角の公式 \(\cos3\theta=4\cos^3\theta-3\cos\theta\) を導きなさい。`,
  steps:[R`\((\cos\theta+i\sin\theta)^3=\cos3\theta+i\sin3\theta\)`,R`左辺を展開：\(\cos^3\theta+3i\cos^2\theta\sin\theta-3\cos\theta\sin^2\theta-i\sin^3\theta\)`,R`実部を比べる：\(\cos3\theta=\cos^3\theta-3\cos\theta\sin^2\theta\)`,R`\(\sin^2\theta=1-\cos^2\theta\) を代入：\(\cos^3\theta-3\cos\theta+3\cos^3\theta\)`],a:R`\(\cos3\theta=4\cos^3\theta-3\cos\theta\)`},
 {lv:'複合',with:['hC-vector'],q:R`複素数平面上の3点 A\((1)\)、B\((3+i)\)、C\((2i)\) を頂点とする △ABC は、どのような三角形ですか。`,
  steps:[R`A を始点とするベクトルにあたる複素数：\(\beta-\alpha=2+i\)、\(\gamma-\alpha=-1+2i\)`,R`\(\dfrac{\gamma-\alpha}{\beta-\alpha}=\dfrac{-1+2i}{2+i}=\dfrac{(-1+2i)(2-i)}{5}=\dfrac{5i}{5}=i\)`,R`絶対値が 1 なので \(AC=AB\)、偏角が \(\dfrac{\pi}{2}\) なので \(\angle BAC=\dfrac{\pi}{2}\)`],a:R`\(AB=AC\)、\(\angle A=\dfrac{\pi}{2}\) の直角二等辺三角形`},
 {lv:'発展',with:['h2-zukeishiki'],q:R`複素数平面上で、等式 \(|z-3|=2|z|\) を満たす点 \(z\) 全体はどのような図形ですか。`,
  steps:[R`\(z=x+yi\) とおき、両辺を2乗：\((x-3)^2+y^2=4(x^2+y^2)\)`,R`整理：\(3x^2+3y^2+6x-9=0\)、\(x^2+y^2+2x-3=0\)`,R`\((x+1)^2+y^2=4\)`],a:R`点 \(-1\) を中心とする半径 2 の円`}
];
PROBLEMS['hC-kyokusen']=[
 {lv:'基本',q:R`放物線 \(y^2=8x\) の焦点の座標と準線の方程式を求めなさい。`,
  steps:[R`\(y^2=4px\) と比べて \(4p=8\)、\(p=2\)`],a:R`焦点 \((2,\ 0)\)、準線 \(x=-2\)`},
 {lv:'基本',q:R`双曲線 \(\dfrac{x^2}{9}-\dfrac{y^2}{16}=1\) の焦点の座標と漸近線の方程式を求めなさい。`,
  steps:[R`\(a=3,\ b=4\)`,R`\(\sqrt{a^2+b^2}=\sqrt{9+16}=5\)`,R`漸近線は \(y=\pm\dfrac{b}{a}x\)`],a:R`焦点 \((\pm5,\ 0)\)、漸近線 \(y=\pm\dfrac43x\)`},
 {lv:'応用',q:R`媒介変数表示 \(x=3\cos\theta+1,\ y=2\sin\theta\) はどのような曲線を表しますか。`,
  steps:[R`\(\cos\theta=\dfrac{x-1}{3}\)、\(\sin\theta=\dfrac{y}{2}\)`,R`\(\cos^2\theta+\sin^2\theta=1\) に代入して \(\theta\) を消去する`],a:R`楕円 \(\dfrac{(x-1)^2}{9}+\dfrac{y^2}{4}=1\)`},
 {lv:'応用',q:R`極方程式 \(r=2\cos\theta\) を直交座標の方程式に直し、どのような図形か答えなさい。`,
  steps:[R`両辺に \(r\) をかける：\(r^2=2r\cos\theta\)`,R`\(r^2=x^2+y^2\)、\(r\cos\theta=x\) を代入：\(x^2+y^2=2x\)`,R`\((x-1)^2+y^2=1\)`],a:R`中心 \((1,\ 0)\)、半径 1 の円`},
 {lv:'複合',with:['h1-niji'],q:R`楕円 \(\dfrac{x^2}{4}+y^2=1\) と直線 \(y=x+k\) が接するとき、定数 \(k\) の値を求めなさい。`,
  steps:[R`\(y=x+k\) を代入：\(\dfrac{x^2}{4}+(x+k)^2=1\)`,R`4倍して整理：\(5x^2+8kx+4k^2-4=0\)`,R`接する \(\iff\) 判別式 \(D=0\)：\(\dfrac{D}{4}=16k^2-5(4k^2-4)=-4k^2+20=0\)`],a:R`\(k=\pm\sqrt5\)`},
 {lv:'発展',with:['h3-sekibun'],q:R`楕円 \(\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1\)（\(a>0,\ b>0\)）で囲まれた部分の面積が \(\pi ab\) であることを示しなさい。`,
  steps:[R`上半分は \(y=\dfrac{b}{a}\sqrt{a^2-x^2}\)。対称性から \(S=4\displaystyle\int_0^a\dfrac{b}{a}\sqrt{a^2-x^2}\,dx\)`,R`\(\displaystyle\int_0^a\sqrt{a^2-x^2}\,dx\) は、半径 \(a\) の円の4分の1の面積で \(\dfrac{\pi a^2}{4}\)（\(x=a\sin\theta\) の置換でも求まる）`,R`\(S=4\cdot\dfrac{b}{a}\cdot\dfrac{\pi a^2}{4}\)`],a:R`\(S=\pi ab\)`}
];
