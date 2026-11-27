/* 練習問題：数学III（極限・微分法・積分法） */
PROBLEMS['h3-kyokugen']=[
 {lv:'基本',q:R`\(\displaystyle\lim_{n\to\infty}\dfrac{3n^2-n}{n^2+2}\) を求めなさい。`,
  steps:[R`分母と分子を \(n^2\) で割る：\(\dfrac{3-\frac1n}{1+\frac{2}{n^2}}\)`,R`\(n\to\infty\) で \(\dfrac1n\to0\)、\(\dfrac{2}{n^2}\to0\)`],a:R`\(3\)`},
 {lv:'基本',q:R`(1) \(\displaystyle\lim_{x\to2}\dfrac{x^2-4}{x-2}\)　(2) \(\displaystyle\lim_{x\to0}\dfrac{\sin3x}{x}\) を求めなさい。`,
  steps:[R`(1) 約分する：\(\dfrac{(x-2)(x+2)}{x-2}=x+2\to4\)`,R`(2) \(\dfrac{\sin3x}{x}=3\cdot\dfrac{\sin3x}{3x}\)。\(3x\to0\) なので \(\dfrac{\sin3x}{3x}\to1\)`],a:R`(1) \(4\)　(2) \(3\)`},
 {lv:'応用',q:R`循環小数 \(0.363636\cdots\) を分数で表しなさい。`,
  steps:[R`\(0.36+0.0036+0.000036+\cdots\) は、初項 \(0.36\)、公比 \(0.01\) の無限等比級数`,R`\(|0.01|<1\) なので収束し、和は \(\dfrac{0.36}{1-0.01}=\dfrac{36}{99}\)`],a:R`\(\dfrac{4}{11}\)`},
 {lv:'応用',q:R`\(\displaystyle\lim_{x\to0}\dfrac{1-\cos x}{x^2}\) を求めなさい。`,
  steps:[R`分母と分子に \(1+\cos x\) をかける：\(\dfrac{1-\cos^2x}{x^2(1+\cos x)}=\dfrac{\sin^2x}{x^2(1+\cos x)}\)`,R`\(=\left(\dfrac{\sin x}{x}\right)^2\cdot\dfrac{1}{1+\cos x}\)`,R`\(x\to0\) で \(1^2\cdot\dfrac{1}{1+1}\)`],a:R`\(\dfrac12\)`},
 {lv:'複合',with:['hB-suretsu'],q:R`\(a_1=1,\ a_{n+1}=\dfrac12a_n+1\) で定まる数列 \(\{a_n\}\) の極限を求めなさい。`,
  steps:[R`\(\alpha=\dfrac12\alpha+1\) を解くと \(\alpha=2\)`,R`\(a_{n+1}-2=\dfrac12(a_n-2)\)。数列 \(\{a_n-2\}\) は初項 \(-1\)、公比 \(\dfrac12\) の等比数列`,R`\(a_n=2-\left(\dfrac12\right)^{n-1}\)`,R`\(n\to\infty\) で \(\left(\dfrac12\right)^{n-1}\to0\)`],a:R`\(2\)`},
 {lv:'発展',q:R`\(\displaystyle\lim_{x\to\infty}\left(1+\dfrac{2}{x}\right)^x\) を求めなさい。`,
  steps:[R`\(h=\dfrac{2}{x}\) とおくと、\(x\to\infty\) のとき \(h\to+0\) で、\(x=\dfrac{2}{h}\)`,R`\(\left(1+\dfrac{2}{x}\right)^x=(1+h)^{\frac{2}{h}}=\left\{(1+h)^{\frac1h}\right\}^2\)`,R`\((1+h)^{\frac1h}\to e\)`],a:R`\(e^2\)`}
];
PROBLEMS['h3-bibun']=[
 {lv:'基本',q:R`次の関数を微分しなさい。(1) \(y=x^2\sin x\)　(2) \(y=\dfrac{x}{x^2+1}\)　(3) \(y=\log(x^2+1)\)`,
  steps:[R`(1) 積の微分：\(y'=2x\sin x+x^2\cos x\)`,R`(2) 商の微分：\(y'=\dfrac{1\cdot(x^2+1)-x\cdot2x}{(x^2+1)^2}=\dfrac{1-x^2}{(x^2+1)^2}\)`,R`(3) 合成関数の微分：\(y'=\dfrac{1}{x^2+1}\cdot2x\)`],a:R`(1) \(2x\sin x+x^2\cos x\)　(2) \(\dfrac{1-x^2}{(x^2+1)^2}\)　(3) \(\dfrac{2x}{x^2+1}\)`},
 {lv:'基本',q:R`曲線 \(y=\log x\) 上の点 \((e,\ 1)\) における接線の方程式を求めなさい。`,
  steps:[R`\(y'=\dfrac1x\)。\(x=e\) のとき傾きは \(\dfrac1e\)`,R`\(y-1=\dfrac1e(x-e)\)`],a:R`\(y=\dfrac{x}{e}\)（原点を通る）`},
 {lv:'応用',q:R`関数 \(y=\dfrac{\log x}{x}\)（\(x>0\)）の最大値を求めなさい。`,
  steps:[R`商の微分：\(y'=\dfrac{\frac1x\cdot x-\log x\cdot1}{x^2}=\dfrac{1-\log x}{x^2}\)`,R`\(y'=0\) となるのは \(\log x=1\)、すなわち \(x=e\)`,R`\(0<x<e\) で \(y'>0\)、\(x>e\) で \(y'<0\)。\(x=e\) で最大`],a:R`\(x=e\) のとき最大値 \(\dfrac1e\)`},
 {lv:'応用',q:R`\(x>0\) のとき、不等式 \(e^x>1+x\) が成り立つことを証明しなさい。`,
  steps:[R`\(f(x)=e^x-(1+x)\) とおく`,R`\(f'(x)=e^x-1\)。\(x>0\) では \(e^x>1\) なので \(f'(x)>0\)`,R`\(f(x)\) は \(x\ge0\) で増加し、\(f(0)=0\)`,R`よって \(x>0\) のとき \(f(x)>0\)`],a:R`\(x>0\) で \(f(x)=e^x-(1+x)>0\) となり、示された`},
 {lv:'複合',with:['h2-sankaku'],q:R`関数 \(f(x)=x-2\sin x\)（\(0\le x\le\pi\)）の最大値と最小値を求めなさい。`,
  steps:[R`\(f'(x)=1-2\cos x\)。\(f'(x)=0\) となるのは \(\cos x=\dfrac12\)、すなわち \(x=\dfrac{\pi}{3}\)`,R`\(0<x<\dfrac{\pi}{3}\) で \(f'(x)<0\)、\(\dfrac{\pi}{3}<x<\pi\) で \(f'(x)>0\)。\(x=\dfrac{\pi}{3}\) で極小`,R`\(f\left(\dfrac{\pi}{3}\right)=\dfrac{\pi}{3}-\sqrt3\)、両端は \(f(0)=0\)、\(f(\pi)=\pi\)`],a:R`最大値 \(\pi\)（\(x=\pi\)）、最小値 \(\dfrac{\pi}{3}-\sqrt3\)（\(x=\dfrac{\pi}{3}\)）`},
 {lv:'発展',q:R`\(e^{\pi}\) と \(\pi^e\) の大小を調べなさい。`,
  steps:[R`問3より、\(g(x)=\dfrac{\log x}{x}\) は \(x>e\) で減少する`,R`\(e<\pi\) なので \(g(e)>g(\pi)\)、すなわち \(\dfrac{\log e}{e}>\dfrac{\log\pi}{\pi}\)`,R`両辺に \(e\pi\) をかける：\(\pi\log e>e\log\pi\)、すなわち \(\log e^{\pi}>\log\pi^e\)`,R`\(\log x\) は増加関数なので、真数の大小も同じ向き`],a:R`\(e^{\pi}>\pi^e\)`}
];
PROBLEMS['h3-sekibun']=[
 {lv:'基本',q:R`次の定積分を求めなさい。(1) \(\displaystyle\int_0^{\frac{\pi}{2}}\cos x\,dx\)　(2) \(\displaystyle\int_1^e\dfrac1x\,dx\)　(3) \(\displaystyle\int_0^1e^{2x}\,dx\)`,
  steps:[R`(1) \(\Big[\sin x\Big]_0^{\frac{\pi}{2}}=1-0\)`,R`(2) \(\Big[\log x\Big]_1^e=1-0\)`,R`(3) \(\left[\dfrac12e^{2x}\right]_0^1=\dfrac{e^2}{2}-\dfrac12\)`],a:R`(1) \(1\)　(2) \(1\)　(3) \(\dfrac{e^2-1}{2}\)`},
 {lv:'基本',q:R`定積分 \(\displaystyle\int_0^1x(x^2+1)^3\,dx\) を求めなさい。`,
  steps:[R`\(t=x^2+1\) とおくと \(dt=2x\,dx\)。\(x\) が \(0\to1\) のとき \(t\) は \(1\to2\)`,R`\(\displaystyle\int_1^2t^3\cdot\dfrac12\,dt=\dfrac12\left[\dfrac{t^4}{4}\right]_1^2\)`,R`\(=\dfrac12\cdot\dfrac{16-1}{4}\)`],a:R`\(\dfrac{15}{8}\)`},
 {lv:'応用',q:R`定積分 \(\displaystyle\int_1^e\log x\,dx\) を求めなさい。`,
  steps:[R`\(\log x=1\cdot\log x\) とみて部分積分。\(1\) を積分する側、\(\log x\) を微分する側にとる`,R`\(\Big[x\log x\Big]_1^e-\displaystyle\int_1^ex\cdot\dfrac1x\,dx=e-\Big[x\Big]_1^e\)`,R`\(=e-(e-1)\)`],a:R`\(1\)`},
 {lv:'複合',with:['m1-zukei'],q:R`半径 \(r\) の球の体積が \(\dfrac43\pi r^3\) であることを、積分を用いて示しなさい。`,
  steps:[R`半円 \(y=\sqrt{r^2-x^2}\)（\(-r\le x\le r\)）を \(x\) 軸のまわりに1回転させると球になる`,R`\(V=\pi\displaystyle\int_{-r}^{r}(r^2-x^2)\,dx=\pi\left[r^2x-\dfrac{x^3}{3}\right]_{-r}^{r}\)`,R`\(=\pi\left(2r^3-\dfrac{2r^3}{3}\right)\)`],a:R`\(V=\dfrac43\pi r^3\)（中学1年で覚えた公式と一致する）`},
 {lv:'発展',with:['h2-sankaku'],q:R`定積分 \(\displaystyle\int_0^1\sqrt{1-x^2}\,dx\) を求めなさい。`,
  steps:[R`\(x=\sin\theta\) とおくと \(dx=\cos\theta\,d\theta\)。\(x\) が \(0\to1\) のとき \(\theta\) は \(0\to\dfrac{\pi}{2}\)`,R`この範囲で \(\cos\theta\ge0\) なので \(\sqrt{1-\sin^2\theta}=\cos\theta\)`,R`\(\displaystyle\int_0^{\frac{\pi}{2}}\cos^2\theta\,d\theta=\int_0^{\frac{\pi}{2}}\dfrac{1+\cos2\theta}{2}\,d\theta=\left[\dfrac{\theta}{2}+\dfrac{\sin2\theta}{4}\right]_0^{\frac{\pi}{2}}\)`],a:R`\(\dfrac{\pi}{4}\)（半径1の円の4分の1の面積）`},
 {lv:'発展',with:['h3-kyokugen'],q:R`\(\displaystyle\lim_{n\to\infty}\sum_{k=1}^{n}\dfrac{n}{n^2+k^2}\) を求めなさい。`,
  steps:[R`分母と分子を \(n^2\) で割る：\(\dfrac{n}{n^2+k^2}=\dfrac1n\cdot\dfrac{1}{1+\left(\frac{k}{n}\right)^2}\)`,R`区分求積法より、極限は \(\displaystyle\int_0^1\dfrac{1}{1+x^2}\,dx\)`,R`\(x=\tan\theta\) とおくと \(dx=\dfrac{1}{\cos^2\theta}\,d\theta\)、\(1+x^2=\dfrac{1}{\cos^2\theta}\)。\(\theta\) は \(0\to\dfrac{\pi}{4}\)`,R`\(\displaystyle\int_0^{\frac{\pi}{4}}d\theta\)`],a:R`\(\dfrac{\pi}{4}\)`}
];
