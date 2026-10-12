// Fails the build if menu data is malformed, so a broken price can never go live.
import { readFileSync } from 'node:fs';
const files = ['menu-food', 'menu-drinks', 'menu-brunch', 'menu-happy-hour', 'menu-gluten-free', 'menu-kids'];
let errors = 0;
const err = (f, m) => { console.error(`✗ ${f}: ${m}`); errors++; };
for (const f of files) {
  let d;
  try { d = JSON.parse(readFileSync(new URL(`../src/data/${f}.json`, import.meta.url), 'utf8')); }
  catch (e) { err(f, `invalid JSON — ${e.message}`); continue; }
  const items = d.categories ? d.categories.flatMap((c) => c.items.map((i) => ({ ...i, _cat: c.title }))) : d.items;
  const ids = new Set();
  for (const i of items) {
    if (!i.id || !i.name) err(f, `item without id/name in ${i._cat}`);
    if (ids.has(i.id)) err(f, `duplicate id "${i.id}"`); ids.add(i.id);
    const hasPrice = typeof i.price === 'number' || i.prices || i.variants || i.deal_text;
    if (!hasPrice) err(f, `"${i.name}" has no price`);
    for (const v of [i.price, ...(i.variants ?? []).map((x) => x.price), ...Object.values(i.prices ?? {})])
      if (v != null && (typeof v !== 'number' || v < 0 || v > 500)) err(f, `"${i.name}" has an invalid price: ${v}`);
  }
  console.log(`✓ ${f}: ${items.length} items`);
}
if (errors) { console.error(`\n${errors} menu data error(s). Fix them before deploying.`); process.exit(1); }
