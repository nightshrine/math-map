#!/usr/bin/env node
// index.html の <script src="..."> の並びを、フォルダにあるファイルから作り直す。
// 読み込み順: data-* → problems-* → stars-* → core → figs → figs-* → stage
// 使い方（site/ の中で）: node tools/sync-scripts.js
const fs = require('fs'), path = require('path');
const base = path.resolve(__dirname, '..'), dir = fs.existsSync(path.join(base, 'site', 'index.html')) ? path.join(base, 'site') : base, file = path.join(dir, 'index.html');
const ls = fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort();
const pick = re => ls.filter(f => re.test(f));
// data は学年順を保つ（単元の並びが星図の配置を決めるため）
const dataOrder = ['data-jhs.js', 'data-j3.js', 'data-h1.js', 'data-h2.js', 'data-h3.js'];
const data = [...dataOrder.filter(f => ls.includes(f)), ...pick(/^data-/).filter(f => !dataOrder.includes(f))];
const list = [...data, ...pick(/^problems-/), ...pick(/^stars-/), 'core.js', 'figs.js', ...pick(/^figs-/), 'stage.js'];
let s = fs.readFileSync(file, 'utf8');
const re = /(?:<script src="[\w.-]+\.js"><\/script>\n)+/;
if (!re.test(s)) throw new Error('index.html に script の並びが見つからない');
s = s.replace(re, list.map(f => `<script src="${f}"></script>`).join('\n') + '\n');
fs.writeFileSync(file, s);
console.log('script ' + list.length + ' 本: ' + list.join(' '));
