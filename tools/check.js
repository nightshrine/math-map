#!/usr/bin/env node
// 星と図のデータ検査。ブラウザなしで、構造・参照・数式の括弧・図の描画エラーを調べる。
// 使い方（site/ の中で）:
//   node tools/check.js                      すべての stars-*.js と figs-*.js を検査
//   node tools/check.js stars-x.js figs-x.js 指定したファイルだけを報告対象にする（参照の解決には全ファイルを読む）
const fs = require('fs'), path = require('path');
const base = path.resolve(__dirname, '..'), dir = fs.existsSync(path.join(base, 'site', 'index.html')) ? path.join(base, 'site') : base;
const only = process.argv.slice(2).map(f => path.basename(f));
global.window = global;
Object.assign(global, { TOPICS: [], PROBLEMS: {}, STARS: [], FIGS: {}, R: String.raw,
  MM: { esc: s => String(s), reduced: () => true } });
const ls = fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort();
const errors = [], warns = [];
const E = (f, m) => errors.push(`${f}: ${m}`), Wn = (f, m) => warns.push(`${f}: ${m}`);
const load = f => { try { require(path.join(dir, f)); return true; } catch (e) { E(f, '読み込みエラー: ' + e.message); return false; } };

ls.filter(f => /^(data|problems)-/.test(f)).forEach(load);
const fileOf = new Map();
ls.filter(f => /^stars-/.test(f)).forEach(f => { const n = STARS.length; load(f); STARS.slice(n).forEach(s => fileOf.set(s, f)); });
load('figs.js');
const coreFigs = new Set(Object.keys(FIGS));
// 章ごとの図は FIG.mk を通して作る。ここでは mk を差し替えて、初期値と各スライダーの両端で描画を試す
let figFile = '';
FIG.mk = (host, cfg) => {
  if (!cfg || !Array.isArray(cfg.sliders) || typeof cfg.draw !== 'function') throw new Error('FIG.mk には {sliders:[], draw(v)} が必要');
  const v = {}; cfg.sliders.forEach(q => { for (const k of ['k', 'label', 'min', 'max', 'step', 'v']) if (q[k] === undefined) throw new Error(`slider に ${k} がない`);
    if (!(q.min <= q.v && q.v <= q.max)) throw new Error(`slider ${q.k} の初期値が範囲外`); v[q.k] = q.v; });
  const tries = [{ ...v }]; cfg.sliders.forEach(q => { tries.push({ ...v, [q.k]: q.min }); tries.push({ ...v, [q.k]: q.max }); });
  if (cfg.play) { const q = cfg.sliders.find(x => x.k === cfg.play.k); if (!q) throw new Error('play.k に対応する slider がない'); if (!cfg.play.label) throw new Error('play.label がない'); }
  tries.forEach(vv => { const r = cfg.draw(vv);
    if (!r || typeof r.svg !== 'string' || typeof r.read !== 'string') throw new Error('draw は {svg, read} の文字列を返す');
    if (!r.svg.length) throw new Error('svg が空');
    if (/NaN|undefined|Infinity|\[object/.test(r.svg + r.read)) throw new Error('出力に NaN / undefined などが含まれる（値: ' + JSON.stringify(vv) + '）'); });
  host.ok = true;
};
const figOwner = {};
ls.filter(f => /^figs-/.test(f)).forEach(f => { const before = new Set(Object.keys(FIGS)); figFile = f; load(f); Object.keys(FIGS).forEach(k => { if (!before.has(k)) figOwner[k] = f; }); });

const chIds = new Set(TOPICS.map(t => t.id)), starIds = new Map();
STARS.forEach(s => { if (starIds.has(s.id)) E(fileOf.get(s), `id が重複: ${s.id}（${starIds.get(s.id)} にもある）`); starIds.set(s.id, fileOf.get(s)); });
const TYPES = { intro: ['lead'], text: ['title', 'body'], fig: ['title', 'fig'], derive: ['title', 'steps', 'a'], points: ['items'], ex: ['q', 'steps', 'a'], quiz: ['lv', 'q', 'steps', 'a'], ask: ['title', 'q', 'choices', 'explain'] };
const LV = ['基本', '応用', '複合', '発展'];
const strs = o => { const out = []; (function w(x) { if (typeof x === 'string') out.push(x); else if (Array.isArray(x)) x.forEach(w); else if (x && typeof x === 'object') Object.entries(x).forEach(([k, v]) => { if (k !== 'arg') w(v); }); })(o); return out; };
function texCheck(str) {
  const c = re => (str.match(re) || []).length;
  if (c(/\\\(/g) !== c(/\\\)/g)) return '\\( と \\) の数が合わない';
  if (c(/\\\[/g) !== c(/\\\]/g)) return '\\[ と \\] の数が合わない';
  if (c(/\\left\b/g) !== c(/\\right\b/g)) return '\\left と \\right の数が合わない';
  const math = str.match(/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g) || [];
  for (const m of math) { let d = 0; for (let i = 0; i < m.length; i++) { if (m[i] === '\\') { i++; continue; } if (m[i] === '{') d++; if (m[i] === '}') d--; if (d < 0) break; } if (d !== 0) return '数式の { } が合わない: ' + m.slice(0, 50); }
  const plain = str.replace(/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g, '');
  if (/<(?!br>|b>|\/b>)[a-zA-Z\/]/.test(plain)) return '使える HTML タグは <br> と <b> だけ: ' + plain.slice(0, 50);
  if (/\$[^$]+\$/.test(plain)) return '数式は $...$ ではなく \\( ... \\) で書く';
  return null;
}
const perCh = {};
STARS.forEach(s => {
  const f = fileOf.get(s), at = `${s.id}`;
  if (!/^[a-z0-9]+(-[a-z0-9]+)+$/.test(s.id || '') || /^c-/.test(s.id)) E(f, `${at}: id は英小文字・数字・ハイフン（c- で始めない）`);
  if (chIds.has(s.id)) E(f, `${at}: id が章の id と同じ`);
  if (!chIds.has(s.ch)) E(f, `${at}: ch が章の id ではない: ${s.ch}`);
  if (!s.name) E(f, `${at}: name がない`);
  if (!s.sec) E(f, `${at}: sec（節の名前）がない`);
  if (!['main', 'why'].includes(s.kind)) E(f, `${at}: kind は main か why`);
  (s.pre || []).forEach(p => { if (!chIds.has(p) && !starIds.has(p)) E(f, `${at}: pre の ${p} が存在しない`); if (p === s.id) E(f, `${at}: pre に自分自身`); });
  if (!Array.isArray(s.screens) || !s.screens.length) { E(f, `${at}: screens がない`); return; }
  if (s.screens[0].t !== 'intro') E(f, `${at}: 最初のブロックは intro`);
  const cnt = {};
  s.screens.forEach((sc, i) => {
    const w = `${at}[${i}:${sc.t}]`; cnt[sc.t] = (cnt[sc.t] || 0) + 1;
    if (!TYPES[sc.t]) { E(f, `${w}: 種類が不明`); return; }
    TYPES[sc.t].forEach(k => { if (sc[k] === undefined || sc[k] === '' || (Array.isArray(sc[k]) && !sc[k].length)) E(f, `${w}: ${k} がない`); });
    if (sc.t === 'quiz') { if (!LV.includes(sc.lv)) E(f, `${w}: lv は ${LV.join('・')}`); if (sc.lv === '複合' && !(sc.with && sc.with.length)) E(f, `${w}: 複合には with が必要`); }
    (sc.with || []).forEach(p => { if (!chIds.has(p) && !starIds.has(p)) E(f, `${w}: with の ${p} が存在しない`); });
    if (sc.t === 'ask') { if (!(sc.choices && sc.choices.length >= 3)) E(f, `${w}: choices は3つ以上`); if (!(Number.isInteger(sc.correct) && sc.correct >= 0 && sc.correct < (sc.choices || []).length)) E(f, `${w}: correct が範囲外`); }
    if (sc.t === 'points' && sc.items) sc.items.forEach(q => { if (!Array.isArray(q) || q.length !== 2) E(f, `${w}: items は [見出し, 内容] の組`); });
    if (sc.table && !(Array.isArray(sc.table.head) && Array.isArray(sc.table.rows))) E(f, `${w}: table は {head:[], rows:[[]]}`);
    if (sc.fig) { if (typeof FIGS[sc.fig] !== 'function') E(f, `${w}: 図 ${sc.fig} が定義されていない`);
      else if (!coreFigs.has(sc.fig)) { const host = {}; try { FIGS[sc.fig](host, sc.arg); if (!host.ok) E(figOwner[sc.fig] || f, `図 ${sc.fig}: FIG.mk を呼んでいない`); } catch (e) { E(figOwner[sc.fig] || f, `図 ${sc.fig}: ${e.message}`); } } }
    strs(sc).forEach(x => { const m = texCheck(x); if (m) E(f, `${w}: ${m}`); });
  });
  if (!cnt.points && s.kind === 'main') Wn(f, `${at}: points（要点）がない`);
  if ((cnt.quiz || 0) < 2) Wn(f, `${at}: 練習問題が ${cnt.quiz || 0} 問（2問以上が目安）`);
  if (!cnt.fig && !s.screens.some(x => x.fig)) Wn(f, `${at}: 図が1つもない`);
  const p = perCh[s.ch] = perCh[s.ch] || { stars: 0, why: 0, quiz: 0, fig: 0 }; p.stars++; if (s.kind === 'why') p.why++; p.quiz += cnt.quiz || 0; p.fig += s.screens.filter(x => x.fig).length;
});
const show = l => only.length ? l.filter(x => only.some(f => x.startsWith(f + ':'))) : l;
const er = show(errors), wr = show(warns);
Object.entries(perCh).forEach(([ch, p]) => { const files = [...new Set(STARS.filter(s => s.ch === ch).map(s => fileOf.get(s)))]; if (!only.length || files.some(f => only.includes(f))) console.log(`  ${ch}: 星 ${p.stars}（なぜ ${p.why}）、練習問題 ${p.quiz}、図 ${p.fig}`); });
wr.forEach(x => console.log('注意  ' + x));
er.forEach(x => console.log('エラー ' + x));
console.log(er.length ? `\nエラー ${er.length} 件。直してからもう一度実行してください。` : `\nエラーなし（注意 ${wr.length} 件）。星の合計 ${STARS.length}`);
process.exit(er.length ? 1 : 0);
