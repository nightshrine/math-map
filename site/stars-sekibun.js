/* 数学II 第6章「微分法と積分法」の星（後半：積分） */
(function(){
const S3='第3節 積分法';
STARS.push(
{id:'sekibun-futei',ch:'h2-bibun',sec:S3,name:'不定積分',kind:'main',pre:['bibun-doukansu'],screens:[
 {t:'intro',lead:R`微分するとその関数になる、もとの関数を求めます。微分の逆の計算です。`,
  why:R`傾き（変化の速さ）から、もとの量を復元できます。このあと、面積を計算する道具になります。`},
 {t:'fig',fig:'family',title:'もとの関数は1つに決まらない',text:R`\(y=x^2+C\) のグラフは、\(C\) の値によって上下にずれるだけです。どれも同じ \(x\) で接線が平行、つまり微分すると同じ \(2x\) になります。だから「微分して \(2x\) になる関数」は \(x^2+C\) とまとめて書きます。`},
 {t:'points',items:[
  ['不定積分',R`\(F'(x)=f(x)\) のとき \(\displaystyle\int f(x)\,dx=F(x)+C\)（\(C\) は積分定数）`],
  ['累乗の積分',R`\(\displaystyle\int x^n\,dx=\dfrac{x^{n+1}}{n+1}+C\)。指数を1つ上げて、その数で割る`],
  ['定数倍・和',R`微分と同じく、項ごとに計算してよい`],
  ['確かめ方',R`答えを微分して、もとの式に戻れば正しい`]],
  trap:R`積分定数 \(C\) を書き忘れやすいです。不定積分の答えは「1つの関数」ではなく「関数の集まり」です。`},
 {t:'ex',q:R`\(\displaystyle\int(3x^2-4x+5)\,dx\) を求めなさい。`,
  steps:[R`項ごとに積分する：\(3\cdot\dfrac{x^3}{3}-4\cdot\dfrac{x^2}{2}+5x+C\)`,R`\(=x^3-2x^2+5x+C\)`,R`確かめ：微分すると \(3x^2-4x+5\)`],a:R`\(x^3-2x^2+5x+C\)`},
 {t:'quiz',lv:'基本',q:R`\(\displaystyle\int(x+1)(x-2)\,dx\) を求めなさい。`,
  steps:[R`先に展開する：\(x^2-x-2\)`,R`項ごとに積分する`],a:R`\(\dfrac{x^3}{3}-\dfrac{x^2}{2}-2x+C\)`},
 {t:'quiz',lv:'応用',q:R`\(F'(x)=6x^2-2\)、\(F(1)=3\) を満たす関数 \(F(x)\) を求めなさい。`,
  steps:[R`\(F(x)=\displaystyle\int(6x^2-2)\,dx=2x^3-2x+C\)`,R`\(F(1)=2-2+C=3\) より \(C=3\)`],a:R`\(F(x)=2x^3-2x+3\)`},
 {t:'quiz',lv:'複合',with:['bibun-sessen'],q:R`曲線 \(y=f(x)\) 上の各点 \((x,\ y)\) における接線の傾きが \(2x-3\) で、この曲線は点 \((1,\ 2)\) を通ります。\(f(x)\) を求めなさい。`,
  steps:[R`接線の傾きは導関数なので \(f'(x)=2x-3\)`,R`\(f(x)=x^2-3x+C\)`,R`点 \((1,\ 2)\) を通る：\(1-3+C=2\) より \(C=4\)`],a:R`\(f(x)=x^2-3x+4\)`}
]},

{id:'sekibun-tei',ch:'h2-bibun',sec:S3,name:'定積分',kind:'main',pre:['sekibun-futei'],screens:[
 {t:'intro',lead:R`不定積分 \(F(x)\) の2つの値の差 \(F(b)-F(a)\) を、定積分といいます。積分定数が消えて、1つの数になります。`,
  why:R`定積分の値は、グラフと \(x\) 軸の間の面積（\(x\) 軸より下は負）にあたります。なぜそうなるかは、このあとの「なぜ」の星で確かめます。`},
 {t:'fig',fig:'signed',title:'上は正、下は負として数える',text:R`\(y=x^2-1\) で、\(a\) から \(b\) までの定積分を表示しています。\(x\) 軸より上の部分は正、下の部分は負として数えられます。\(a\) と \(b\) を入れ替えると符号が逆になることも確かめてください。`},
 {t:'points',items:[
  ['定積分',R`\(\displaystyle\int_a^bf(x)\,dx=\Big[F(x)\Big]_a^b=F(b)-F(a)\)`],
  ['上端と下端',R`\(\displaystyle\int_a^af(x)\,dx=0\)、\(\displaystyle\int_b^af(x)\,dx=-\int_a^bf(x)\,dx\)`],
  ['区間をつなぐ',R`\(\displaystyle\int_a^cf(x)\,dx+\int_c^bf(x)\,dx=\int_a^bf(x)\,dx\)`],
  ['対称な区間',R`\(\displaystyle\int_{-a}^{a}x^2\,dx=2\int_0^ax^2\,dx\)、\(\displaystyle\int_{-a}^{a}x\,dx=0\)（奇数次の項は消える）`]],
  trap:R`\(F(b)-F(a)\) の引く順番を逆にしやすいです。必ず「上端を代入したもの − 下端を代入したもの」です。`},
 {t:'ex',q:R`定積分 \(\displaystyle\int_1^3(x^2-4x+3)\,dx\) を求めなさい。`,
  steps:[R`\(\left[\dfrac{x^3}{3}-2x^2+3x\right]_1^3\)`,R`上端：\(9-18+9=0\)。下端：\(\dfrac13-2+3=\dfrac43\)`,R`\(0-\dfrac43\)`],a:R`\(-\dfrac43\)（\(1\le x\le3\) でグラフが \(x\) 軸より下にあるので負になる）`},
 {t:'quiz',lv:'基本',q:R`定積分 \(\displaystyle\int_{-1}^{2}(x^2-2x)\,dx\) を求めなさい。`,
  steps:[R`\(\left[\dfrac{x^3}{3}-x^2\right]_{-1}^{2}\)`,R`上端：\(\dfrac83-4=-\dfrac43\)。下端：\(-\dfrac13-1=-\dfrac43\)`,R`\(-\dfrac43-\left(-\dfrac43\right)\)`],a:R`\(0\)（\(x\) 軸の上の部分と下の部分が打ち消し合う）`},
 {t:'quiz',lv:'応用',q:R`定積分 \(\displaystyle\int_{-2}^{2}(x^3+3x^2-x+1)\,dx\) を、くふうして求めなさい。`,
  steps:[R`区間が \(-2\) から \(2\) で対称なので、奇数次の項 \(x^3\) と \(-x\) の積分は 0`,R`残りは \(2\displaystyle\int_0^2(3x^2+1)\,dx=2\Big[x^3+x\Big]_0^2\)`,R`\(=2\times10\)`],a:R`\(20\)`},
 {t:'quiz',lv:'発展',q:R`等式 \(f(x)=x+2\displaystyle\int_0^1f(t)\,dt\) を満たす関数 \(f(x)\) を求めなさい。`,
  steps:[R`定積分は定数なので \(\displaystyle\int_0^1f(t)\,dt=k\) とおくと、\(f(x)=x+2k\)`,R`\(k=\displaystyle\int_0^1(t+2k)\,dt=\left[\dfrac{t^2}{2}+2kt\right]_0^1=\dfrac12+2k\)`,R`\(k=\dfrac12+2k\) より \(k=-\dfrac12\)`],a:R`\(f(x)=x-1\)`}
]},

{id:'sekibun-naze-kukaku',ch:'h2-bibun',sec:S3,name:'細い長方形で面積を出す',kind:'why',pre:['sekibun-tei','hB-suretsu'],screens:[
 {t:'intro',lead:R`曲線の下の面積を、細い長方形の集まりとして自分で計算します。`,
  why:R`「面積を求める」ことの元の意味は、細かく分けて足し合わせることです。それが定積分の値と一致することを確かめます。`,
  note:R`教科書では、数学III の「区分求積法」で学ぶ内容です。ここでは探究として先取りします。`},
 {t:'ask',title:'長方形2本で見積もる',body:R`放物線 \(y=x^2\) と \(x\) 軸の間の、\(0\le x\le1\) の部分の面積を求めたい。まず幅 \(\dfrac12\) の長方形2本で、右端の高さを使って見積もります。高さは \(\left(\dfrac12\right)^2=\dfrac14\) と \(1^2=1\) です。`,
  q:R`2本の長方形の面積の合計はいくつですか。`,
  choices:[R`\(\dfrac58\)`,R`\(\dfrac12\)`,R`\(\dfrac38\)`,R`\(\dfrac54\)`],correct:0,
  explain:R`\(\dfrac12\times\dfrac14+\dfrac12\times1=\dfrac58=0.625\)。本当の面積より大きい見積もりです。`,hint:R`幅 × 高さ を2本分たします。`},
 {t:'fig',fig:'rects',title:'本数を増やす',text:R`金色が外側の長方形（右端の高さ）、色の濃い部分が内側の長方形（左端の高さ）です。本当の面積は必ずこの2つの間にあります。本数を増やすと、2つの合計はどちらも同じ値に近づきます。`},
 {t:'ask',title:'長方形4本なら',body:R`幅は \(\dfrac14\)、右端の高さは \(\dfrac{1}{16},\ \dfrac{4}{16},\ \dfrac{9}{16},\ \dfrac{16}{16}\) です。`,
  q:R`4本の合計はいくつですか。`,
  choices:[R`\(\dfrac{15}{32}\)`,R`\(\dfrac{7}{16}\)`,R`\(\dfrac13\)`,R`\(\dfrac58\)`],correct:0,
  explain:R`\(\dfrac14\times\dfrac{1+4+9+16}{16}=\dfrac{30}{64}=\dfrac{15}{32}\approx0.469\)。2本のときの \(0.625\) より小さくなり、本当の面積に近づきました。`,hint:R`高さを全部たしてから、幅 \(\dfrac14\) をかけます。`},
 {t:'text',title:'n 本のときの式',body:[
  R`幅 \(\dfrac1n\) の長方形 \(n\) 本で、\(k\) 番目の高さは \(\left(\dfrac{k}{n}\right)^2\) です。合計を \(S_n\) とすると`,
  R`\[S_n=\dfrac1n\sum_{k=1}^{n}\left(\dfrac{k}{n}\right)^2=\dfrac{1}{n^3}\cdot\dfrac{n(n+1)(2n+1)}{6}=\dfrac{(n+1)(2n+1)}{6n^2}\]`,
  R`数列で学ぶ \(\displaystyle\sum_{k=1}^{n}k^2=\dfrac{n(n+1)(2n+1)}{6}\) を使っています。`]},
 {t:'ask',title:'n を限りなく大きくする',body:R`\(S_n=\dfrac{(n+1)(2n+1)}{6n^2}=\dfrac16\left(1+\dfrac1n\right)\left(2+\dfrac1n\right)\) と変形できます。`,
  q:R`\(n\) を限りなく大きくすると、\(S_n\) は何に近づきますか。`,
  choices:[R`\(\dfrac13\)`,R`\(\dfrac16\)`,R`\(\dfrac12\)`,R`\(0\)`],correct:0,
  explain:R`\(\dfrac1n\) は 0 に近づくので、\(\dfrac16\times1\times2=\dfrac13\)。これが求める面積です。`,hint:R`\(\dfrac1n\) が 0 に近づくと、かっこの中はそれぞれ 1 と 2 に近づきます。`},
 {t:'text',title:'定積分と同じ値になる',body:[
  R`同じ面積を定積分で計算すると \(\displaystyle\int_0^1x^2\,dx=\left[\dfrac{x^3}{3}\right]_0^1=\dfrac13\) で、長方形の方法と一致します。`,
  R`細かく分けて足す計算が、なぜ「微分の逆」の計算で済むのか。その理由は次の星で確かめます。`]},
 {t:'quiz',lv:'複合',with:['hB-suretsu'],q:R`同じ方法で、直線 \(y=x\) と \(x\) 軸の間の \(0\le x\le1\) の部分の面積を求めなさい。`,
  steps:[R`幅 \(\dfrac1n\)、\(k\) 番目の高さ \(\dfrac{k}{n}\) の長方形 \(n\) 本の合計：\(S_n=\dfrac1n\displaystyle\sum_{k=1}^{n}\dfrac{k}{n}=\dfrac{1}{n^2}\cdot\dfrac{n(n+1)}{2}\)`,R`\(=\dfrac{n+1}{2n}=\dfrac12\left(1+\dfrac1n\right)\)`,R`\(n\) を限りなく大きくすると \(\dfrac12\)`],a:R`\(\dfrac12\)（底辺 1、高さ 1 の三角形の面積と一致する）`},
 {t:'quiz',lv:'発展',q:R`\(y=x^2\)（\(0\le x\le1\)）で、左端の高さを使った長方形 \(n\) 本の合計を \(T_n\) とします。\(T_n=S_n-\dfrac1n\) を示し、面積が \(\dfrac13\) であることを説明しなさい。`,
  steps:[R`\(T_n=\dfrac1n\displaystyle\sum_{k=0}^{n-1}\left(\dfrac{k}{n}\right)^2\)。これは \(S_n\) から最後の1本（高さ 1）を除き、高さ 0 の1本を加えたもの`,R`よって \(T_n=S_n-\dfrac1n\times1=S_n-\dfrac1n\)`,R`放物線は増加しているので \(T_n<\text{面積}<S_n\)`,R`\(n\) を大きくすると \(S_n\to\dfrac13\)、\(T_n\to\dfrac13\)。はさまれた面積も \(\dfrac13\)`],a:R`内側と外側の合計がどちらも \(\dfrac13\) に近づくので、面積は \(\dfrac13\)`}
]},

{id:'sekibun-naze-kihon',ch:'h2-bibun',sec:S3,name:'面積を微分すると元の関数に戻る',kind:'why',pre:['sekibun-naze-kukaku','bibun-keisu'],screens:[
 {t:'intro',lead:R`面積を求める計算が、なぜ「微分の逆」で済むのか。その理由を図で確かめます。`,
  why:R`微分と積分は別々に生まれた考え方ですが、互いに逆の関係にあります。この事実を微分積分学の基本定理といいます。`},
 {t:'text',title:'面積を x の関数とみる',body:[
  R`\(y=f(t)\) のグラフと \(t\) 軸の間で、\(0\) から \(x\) までの部分の面積を \(S(x)\) とします（\(f(t)\ge0\) とします）。`,
  R`右端の \(x\) を動かすと面積も変わるので、\(S(x)\) は \(x\) の関数です。この関数を微分すると何になるかを調べます。`]},
 {t:'fig',fig:'areafn',title:'x を少しだけ増やす',text:R`\(x\) を \(h\) だけ増やすと、面積は金色の細い帯の分だけ増えます。帯を細くしていくと、増えた面積を \(h\) で割った値が、その場所の高さ \(f(x)\) に近づきます。`},
 {t:'ask',title:'増えた面積を見積もる',body:R`\(h\) が小さいとき、金色の帯は、幅 \(h\) で高さがほぼ一定の細い長方形とみなせます。`,
  q:R`増えた面積 \(S(x+h)-S(x)\) は、およそどれですか。`,
  choices:[R`\(f(x)\cdot h\)`,R`\(f(x)\)`,R`\(h^2\)`,R`\(S(x)\cdot h\)`],correct:0,
  explain:R`幅 \(h\)、高さ \(f(x)\) の長方形の面積です。\(h\) が小さいほど、ずれは小さくなります。`,hint:R`長方形の面積は「幅 × 高さ」です。帯の幅と高さは何でしょう。`},
 {t:'ask',title:'h で割って、h を 0 に近づける',body:R`\(S(x+h)-S(x)\approx f(x)\cdot h\) の両辺を \(h\) で割ります。`,
  q:R`\(h\to0\) のとき、\(\dfrac{S(x+h)-S(x)}{h}\) は何に近づきますか。`,
  choices:[R`\(f(x)\)`,R`\(S(x)\)`,R`\(0\)`,R`\(f'(x)\)`],correct:0,
  explain:R`左辺の極限は、導関数の定義そのものです。つまり \(S'(x)=f(x)\)。面積を微分すると、もとの関数に戻ります。`},
 {t:'text',title:'だから、面積は不定積分の差で求まる',body:[
  R`\(S'(x)=f(x)\) なので、\(S(x)\) は \(f(x)\) の不定積分の1つです。\(f(x)\) の不定積分の1つを \(F(x)\) とすると \(S(x)=F(x)+C\) と書けます。`,
  R`\(a\) から測り始めることにすると \(S(a)=0\) なので \(C=-F(a)\)。したがって \(a\) から \(b\) までの面積は`,
  R`\[S(b)=F(b)-F(a)=\int_a^bf(x)\,dx\]`,
  R`同じことを式で書くと \(\dfrac{d}{dx}\displaystyle\int_a^xf(t)\,dt=f(x)\) です。`]},
 {t:'quiz',lv:'基本',q:R`\(\dfrac{d}{dx}\displaystyle\int_1^x(t^2-3t)\,dt\) を求めなさい。`,
  steps:[R`\(\dfrac{d}{dx}\displaystyle\int_a^xf(t)\,dt=f(x)\) を使う`,R`\(f(t)=t^2-3t\) の \(t\) を \(x\) に置きかえる`],a:R`\(x^2-3x\)`},
 {t:'quiz',lv:'応用',q:R`等式 \(\displaystyle\int_a^xf(t)\,dt=x^2-2x-3\) を満たす関数 \(f(x)\) と定数 \(a\) の値を求めなさい。`,
  steps:[R`両辺を \(x\) で微分する：\(f(x)=2x-2\)`,R`\(x=a\) を代入すると左辺は 0：\(0=a^2-2a-3\)`,R`\((a-3)(a+1)=0\)`],a:R`\(f(x)=2x-2\)、\(a=3,\ -1\)`},
 {t:'quiz',lv:'発展',with:['bibun-zougen'],q:R`関数 \(g(x)=\displaystyle\int_0^x(t^2-4)\,dt\) の極値を求めなさい。`,
  steps:[R`\(g'(x)=x^2-4=(x+2)(x-2)\)。\(x=-2\) で極大、\(x=2\) で極小`,R`\(g(x)=\left[\dfrac{t^3}{3}-4t\right]_0^x=\dfrac{x^3}{3}-4x\)`,R`\(g(-2)=-\dfrac83+8=\dfrac{16}{3}\)、\(g(2)=\dfrac83-8=-\dfrac{16}{3}\)`],a:R`極大値 \(\dfrac{16}{3}\)（\(x=-2\)）、極小値 \(-\dfrac{16}{3}\)（\(x=2\)）`}
]},

{id:'sekibun-menseki',ch:'h2-bibun',sec:S3,name:'定積分と面積',kind:'main',pre:['sekibun-tei','sekibun-naze-kihon'],screens:[
 {t:'intro',lead:R`定積分を使って、曲線や直線で囲まれた部分の面積を求めます。`,
  why:R`三角形や円の公式では測れない形の面積が、計算で求まるようになります。`},
 {t:'fig',fig:'between',title:'「上 − 下」の長さを集める',text:R`直線 \(y=x+2\) と放物線 \(y=x^2\) で囲まれた部分です。金色の線分は、その \(x\) での縦の長さ（上の式 − 下の式）を表します。この長さを端から端まで集めたものが面積です。`},
 {t:'points',items:[
  ['x 軸より上',R`\(a\le x\le b\) で \(f(x)\ge0\) のとき \(S=\displaystyle\int_a^bf(x)\,dx\)`],
  ['x 軸より下',R`\(f(x)\le0\) のとき \(S=-\displaystyle\int_a^bf(x)\,dx\)`],
  ['2曲線の間',R`\(f(x)\ge g(x)\) のとき \(S=\displaystyle\int_a^b\{f(x)-g(x)\}\,dx\)（上 − 下）`],
  ['放物線と直線',R`\(\displaystyle\int_\alpha^\beta(x-\alpha)(x-\beta)\,dx=-\dfrac{(\beta-\alpha)^3}{6}\)`]],
  trap:R`面積は必ず正です。グラフが \(x\) 軸の上下にまたがるときは、符号が変わるところで区間を分けて計算します。`},
 {t:'ex',q:R`放物線 \(y=x^2\) と直線 \(y=2x\) で囲まれた部分の面積を求めなさい。`,
  steps:[R`交点：\(x^2=2x\) より \(x=0,\ 2\)`,R`\(0\le x\le2\) では直線が上にある`,R`\(S=\displaystyle\int_0^2(2x-x^2)\,dx=\left[x^2-\dfrac{x^3}{3}\right]_0^2=4-\dfrac83\)`],a:R`\(\dfrac43\)`},
 {t:'quiz',lv:'基本',q:R`放物線 \(y=x^2-4\) と \(x\) 軸で囲まれた部分の面積を求めなさい。`,
  steps:[R`\(x\) 軸との交点：\(x=\pm2\)。\(-2\le x\le2\) でグラフは \(x\) 軸より下`,R`\(S=-\displaystyle\int_{-2}^{2}(x^2-4)\,dx=2\int_0^2(4-x^2)\,dx\)`,R`\(=2\left[4x-\dfrac{x^3}{3}\right]_0^2=2\left(8-\dfrac83\right)\)`],a:R`\(\dfrac{32}{3}\)`},
 {t:'quiz',lv:'応用',q:R`放物線 \(y=x^2-2x\) と直線 \(y=x\) で囲まれた部分の面積を求めなさい。`,
  steps:[R`交点：\(x^2-2x=x\) より \(x(x-3)=0\)、\(x=0,\ 3\)`,R`\(0\le x\le3\) では直線が上にある`,R`\(S=\displaystyle\int_0^3\{x-(x^2-2x)\}\,dx=\int_0^3(3x-x^2)\,dx=\left[\dfrac{3x^2}{2}-\dfrac{x^3}{3}\right]_0^3\)`,R`\(=\dfrac{27}{2}-9\)`],a:R`\(\dfrac92\)`},
 {t:'quiz',lv:'発展',q:R`曲線 \(y=x(x-1)(x-2)\) と \(x\) 軸で囲まれた2つの部分の面積の和を求めなさい。`,
  steps:[R`\(y=x^3-3x^2+2x\)。\(x\) 軸との交点は \(x=0,\ 1,\ 2\)`,R`\(0\le x\le1\) で \(y\ge0\)、\(1\le x\le2\) で \(y\le0\) なので、区間を分ける`,R`\(\displaystyle\int_0^1y\,dx=\left[\dfrac{x^4}{4}-x^3+x^2\right]_0^1=\dfrac14\)`,R`\(\displaystyle\int_1^2y\,dx=(4-8+4)-\dfrac14=-\dfrac14\)`,R`\(S=\dfrac14+\dfrac14\)`],a:R`\(\dfrac12\)`}
]}
);
})();
