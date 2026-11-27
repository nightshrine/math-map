/* 練習問題：数学II・B（前半：式・数列・三角関数・指数対数） */
PROBLEMS['h2-shiki']=[
 {lv:'基本',q:R`\(\dfrac{1+2i}{3-i}\) を \(a+bi\) の形で表しなさい。`,
  steps:[R`分母の共役な複素数 \(3+i\) を分母と分子にかける`,R`分子：\((1+2i)(3+i)=3+i+6i+2i^2=1+7i\)`,R`分母：\((3-i)(3+i)=9+1=10\)`],a:R`\(\dfrac{1}{10}+\dfrac{7}{10}i\)`},
 {lv:'基本',q:R`\((x+2)^5\) の展開式における \(x^3\) の係数を求めなさい。`,
  steps:[R`一般項は \({}_5\mathrm{C}_r\,x^{5-r}\cdot2^r\)`,R`\(x^3\) となるのは \(r=2\) のとき`,R`\({}_5\mathrm{C}_2\cdot2^2=10\times4\)`],a:R`40`},
 {lv:'応用',q:R`\(x>0\) のとき、\(x+\dfrac{4}{x}\) の最小値を求めなさい。`,
  steps:[R`\(x>0,\ \dfrac{4}{x}>0\) なので相加平均と相乗平均の関係が使える`,R`\(x+\dfrac{4}{x}\ge2\sqrt{x\cdot\dfrac{4}{x}}=4\)`,R`等号は \(x=\dfrac{4}{x}\)、すなわち \(x=2\) のとき成り立つ`],a:R`\(x=2\) のとき最小値 4`},
 {lv:'複合',with:['m3-niji'],q:R`二次方程式 \(x^2-3x+5=0\) の2つの解を \(\alpha,\ \beta\) とするとき、\(\alpha^2+\beta^2\) と \(\alpha^3+\beta^3\) の値を求めなさい。`,
  steps:[R`解と係数の関係：\(\alpha+\beta=3\)、\(\alpha\beta=5\)（解は虚数だが、関係はそのまま成り立つ）`,R`\(\alpha^2+\beta^2=(\alpha+\beta)^2-2\alpha\beta=9-10=-1\)`,R`\(\alpha^3+\beta^3=(\alpha+\beta)^3-3\alpha\beta(\alpha+\beta)=27-45=-18\)`],a:R`\(\alpha^2+\beta^2=-1\)、\(\alpha^3+\beta^3=-18\)`},
 {lv:'発展',q:R`整式 \(P(x)\) を \(x-1\) で割ると余りが 3、\(x+2\) で割ると余りが \(-3\) です。\(P(x)\) を \((x-1)(x+2)\) で割った余りを求めなさい。`,
  steps:[R`2次式で割った余りは1次以下なので \(ax+b\) とおく：\(P(x)=(x-1)(x+2)Q(x)+ax+b\)`,R`剰余の定理より \(P(1)=3\)、\(P(-2)=-3\)`,R`\(a+b=3\)、\(-2a+b=-3\)`,R`辺々ひいて \(3a=6\)。\(a=2,\ b=1\)`],a:R`\(2x+1\)`}
];
PROBLEMS['hB-suretsu']=[
 {lv:'基本',q:R`第3項が 7、第7項が 19 である等差数列の一般項と、初項から第10項までの和を求めなさい。`,
  steps:[R`\(a+2d=7\)、\(a+6d=19\) より \(d=3,\ a=1\)`,R`\(a_n=1+3(n-1)=3n-2\)`,R`\(a_{10}=28\) なので \(S_{10}=\dfrac{10(1+28)}{2}=145\)`],a:R`\(a_n=3n-2\)、和 145`},
 {lv:'基本',q:R`\(\displaystyle\sum_{k=1}^{n}(2k-1)\) を求めなさい。`,
  steps:[R`\(2\displaystyle\sum_{k=1}^{n}k-\sum_{k=1}^{n}1=2\cdot\dfrac{n(n+1)}{2}-n\)`,R`\(=n^2+n-n\)`],a:R`\(n^2\)（1から順に奇数を \(n\) 個たすと \(n^2\) になる）`},
 {lv:'応用',q:R`数列 \(1,\ 3,\ 7,\ 13,\ 21,\ \cdots\) の一般項を求めなさい。`,
  steps:[R`階差数列は \(2,\ 4,\ 6,\ 8,\ \cdots\) で、\(b_n=2n\)`,R`\(n\ge2\) のとき \(a_n=1+\displaystyle\sum_{k=1}^{n-1}2k=1+n(n-1)=n^2-n+1\)`,R`\(n=1\) のとき \(1-1+1=1\) で、\(a_1\) と一致する`],a:R`\(a_n=n^2-n+1\)`},
 {lv:'応用',q:R`\(\displaystyle\sum_{k=1}^{n}\dfrac{1}{k(k+1)}\) を求めなさい。`,
  steps:[R`部分分数に分ける：\(\dfrac{1}{k(k+1)}=\dfrac1k-\dfrac{1}{k+1}\)`,R`和をとると途中の項が消える：\(\left(1-\dfrac12\right)+\left(\dfrac12-\dfrac13\right)+\cdots+\left(\dfrac1n-\dfrac{1}{n+1}\right)\)`,R`\(=1-\dfrac{1}{n+1}\)`],a:R`\(\dfrac{n}{n+1}\)`},
 {lv:'発展',q:R`すべての自然数 \(n\) について \(1^3+2^3+\cdots+n^3=\left\{\dfrac{n(n+1)}{2}\right\}^2\) が成り立つことを、数学的帰納法で証明しなさい。`,
  steps:[R`[1] \(n=1\) のとき、左辺 \(=1\)、右辺 \(=1\) で成り立つ`,R`[2] \(n=k\) のとき成り立つと仮定する：\(1^3+\cdots+k^3=\left\{\dfrac{k(k+1)}{2}\right\}^2\)`,R`\(n=k+1\) のときの左辺 \(=\dfrac{k^2(k+1)^2}{4}+(k+1)^3=\dfrac{(k+1)^2(k^2+4k+4)}{4}\)`,R`\(=\left\{\dfrac{(k+1)(k+2)}{2}\right\}^2\)。これは \(n=k+1\) のときの右辺に等しい`,R`[1][2] より、すべての自然数 \(n\) で成り立つ`],a:R`数学的帰納法により示された`}
];
PROBLEMS['h2-sankaku']=[
 {lv:'基本',q:R`加法定理を用いて \(\sin75^\circ\) の値を求めなさい。`,
  steps:[R`\(75^\circ=45^\circ+30^\circ\)`,R`\(\sin45^\circ\cos30^\circ+\cos45^\circ\sin30^\circ=\dfrac{\sqrt2}{2}\cdot\dfrac{\sqrt3}{2}+\dfrac{\sqrt2}{2}\cdot\dfrac12\)`],a:R`\(\dfrac{\sqrt6+\sqrt2}{4}\)`},
 {lv:'基本',q:R`\(0\le\theta<2\pi\) のとき、方程式 \(2\cos\theta+1=0\) を解きなさい。`,
  steps:[R`\(\cos\theta=-\dfrac12\)`,R`単位円で \(x\) 座標が \(-\dfrac12\) となる角を探す`],a:R`\(\theta=\dfrac23\pi,\ \dfrac43\pi\)`},
 {lv:'応用',q:R`\(0\le\theta<2\pi\) のとき、方程式 \(\cos2\theta+\sin\theta=0\) を解きなさい。`,
  steps:[R`2倍角の公式で \(\sin\theta\) だけの式にする：\(1-2\sin^2\theta+\sin\theta=0\)`,R`\(2\sin^2\theta-\sin\theta-1=0\) より \((2\sin\theta+1)(\sin\theta-1)=0\)`,R`\(\sin\theta=1\) から \(\theta=\dfrac{\pi}{2}\)。\(\sin\theta=-\dfrac12\) から \(\theta=\dfrac76\pi,\ \dfrac{11}{6}\pi\)`],a:R`\(\theta=\dfrac{\pi}{2},\ \dfrac76\pi,\ \dfrac{11}{6}\pi\)`},
 {lv:'複合',with:['h1-niji'],q:R`\(0\le\theta<2\pi\) のとき、関数 \(y=\sin^2\theta+\cos\theta\) の最大値と最小値を求めなさい。`,
  steps:[R`\(\sin^2\theta=1-\cos^2\theta\) を使い、\(t=\cos\theta\) とおく：\(y=-t^2+t+1\)（\(-1\le t\le1\)）`,R`平方完成：\(y=-\left(t-\dfrac12\right)^2+\dfrac54\)`,R`軸 \(t=\dfrac12\) は範囲の中。\(t=\dfrac12\) で最大値 \(\dfrac54\)`,R`軸から遠い端 \(t=-1\) で最小値 \(-1\)`],a:R`最大値 \(\dfrac54\)（\(\theta=\dfrac{\pi}{3},\ \dfrac53\pi\)）、最小値 \(-1\)（\(\theta=\pi\)）`},
 {lv:'発展',with:['h2-zukeishiki'],q:R`2直線 \(y=3x\) と \(y=\dfrac12x\) のなす鋭角 \(\theta\) を求めなさい。`,
  steps:[R`2直線が \(x\) 軸の正の向きとなす角を \(\alpha,\ \beta\) とすると、\(\tan\alpha=3\)、\(\tan\beta=\dfrac12\)`,R`正接の加法定理：\(\tan(\alpha-\beta)=\dfrac{\tan\alpha-\tan\beta}{1+\tan\alpha\tan\beta}\)`,R`\(=\dfrac{3-\frac12}{1+3\cdot\frac12}=\dfrac{\frac52}{\frac52}=1\)`],a:R`\(\theta=\dfrac{\pi}{4}\)`}
];
PROBLEMS['h2-shisu']=[
 {lv:'基本',q:R`\(\log_2{12}+\log_2{6}-2\log_2{3}\) を計算しなさい。`,
  steps:[R`\(2\log_2{3}=\log_2{9}\)`,R`\(\log_2\dfrac{12\times6}{9}=\log_2{8}\)`],a:R`\(3\)`},
 {lv:'基本',q:R`(1) 方程式 \(4^x=8\) を解きなさい。(2) 不等式 \(\left(\dfrac13\right)^x>9\) を解きなさい。`,
  steps:[R`(1) 底を2にそろえる：\(2^{2x}=2^3\) より \(x=\dfrac32\)`,R`(2) 底を3にそろえる：\(3^{-x}>3^2\)`,R`底 3 は 1 より大きいので、指数の大小はそのまま：\(-x>2\)`],a:R`(1) \(x=\dfrac32\)　(2) \(x<-2\)`},
 {lv:'応用',q:R`\(2^{50}\) は何桁の数ですか。ただし \(\log_{10}2=0.3010\) とします。`,
  steps:[R`\(\log_{10}2^{50}=50\times0.3010=15.05\)`,R`\(15\le15.05<16\) より \(10^{15}\le2^{50}<10^{16}\)`],a:R`16桁`},
 {lv:'複合',with:['m3-niji'],q:R`方程式 \(4^x-3\cdot2^x-4=0\) を解きなさい。`,
  steps:[R`\(2^x=t\) とおくと \(t>0\) で、\(4^x=t^2\)`,R`\(t^2-3t-4=0\) より \((t-4)(t+1)=0\)`,R`\(t>0\) なので \(t=4\)。\(2^x=4\)`],a:R`\(x=2\)`},
 {lv:'複合',with:['hB-suretsu'],q:R`年利 5% の複利で預けたお金が、初めて元金の2倍を超えるのは何年後ですか。ただし \(\log_{10}2=0.3010\)、\(\log_{10}1.05=0.0212\) とします。`,
  steps:[R`\(n\) 年後の金額は元金の \(1.05^n\) 倍（公比 1.05 の等比数列）`,R`\(1.05^n>2\) の両辺の常用対数をとる：\(n\times0.0212>0.3010\)`,R`\(n>14.19\cdots\)`],a:R`15年後`}
];
