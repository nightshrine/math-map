# 中高数学マップ

中学1年から数学III・Cまでの37単元を、4つの系統（数と式／関数と解析／図形／データと確率）と学年で並べた地図です。単元を選ぶと、前提になる単元とその先の単元が線で浮かび、要点・例題・練習問題・動かせるグラフが開きます。

公開先: https://nightshrine.github.io/math-map/

## 構成

ビルドは不要です。`site/` の中身がそのまま公開されます。

| ファイル | 内容 |
|---|---|
| `site/index.html` | ページ本体とスタイル |
| `site/app.js` | 地図の描画、解説欄、グラフ |
| `site/data-*.js` | 単元ごとの要点・例題・つながり（中学1〜2年 / 中学3年 / 数学I・A / II・B / III・C） |
| `site/problems-*.js` | 単元ごとの練習問題（基本・応用・複合・発展） |

数式は MathJax、フォントは Google Fonts を外部から読み込みます。

## 手元で見る

```sh
cd site && python3 -m http.server 8000
```

ブラウザで http://localhost:8000 を開きます。`site/index.html` を直接開いても動きます。

## 単元や問題を足す

- 単元: `site/data-*.js` の `TOPICS.push({...})` に追加します。`pre` に前提の単元の `id` を書くと、地図に線が引かれます。
- 練習問題: `site/problems-*.js` の `PROBLEMS['単元のid']` に追加します。`lv` は `基本`・`応用`・`複合`・`発展` のいずれか、`複合` には組み合わせる単元を `with` で指定します。

## デプロイ

`main` に push すると、GitHub Actions（`.github/workflows/deploy.yml`）が `site/` を GitHub Pages に公開します。
