// sitemap.xml at the same URL as the old site. Lists every public page with a "last updated" date,
// taken from the last git commit that touched that page or the data it shows (falls back to build date).
import { execSync } from 'node:child_process';

const shared = ['src/layouts/Base.astro', 'src/data/business.json'];
const menu = ['src/layouts/MenuLayout.astro', 'src/components/menu'];
const routes: [string, string[]][] = [
  ['/', ['src/pages/index.astro']],
  ['/menu', ['src/pages/menu/index.astro']],
  ['/menu/food', ['src/pages/menu/food.astro', 'src/data/menu-food.json', 'src/data/menu-drinks.json', ...menu]],
  ['/menu/drinks', ['src/pages/menu/drinks.astro', 'src/data/menu-drinks.json', ...menu]],
  ['/happy-hour', ['src/pages/happy-hour.astro', 'src/data/menu-happy-hour.json', ...menu]],
  ['/menu/brunch', ['src/pages/menu/brunch.astro', 'src/data/menu-brunch.json', ...menu]],
  ['/menu/gluten-free', ['src/pages/menu/gluten-free.astro', 'src/data/menu-gluten-free.json', ...menu]],
  ['/menu/kids', ['src/pages/menu/kids.astro', 'src/data/menu-kids.json', ...menu]],
  ['/private-events', ['src/pages/private-events.astro', 'src/data/events.json']],
  ['/gallery', ['src/pages/gallery.astro']],
  ['/about', ['src/pages/about.astro']],
  ['/contact', ['src/pages/contact.astro']],
  ['/giveaway', ['src/pages/giveaway.astro']],
];

function lastmod(files: string[]): string {
  try {
    const out = execSync(`git log -1 --format=%cs -- ${[...files, ...shared].join(' ')}`, { encoding: 'utf8' }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) return out;
  } catch {}
  return new Date().toISOString().slice(0, 10);
}

export async function GET() {
  const base = 'https://poloslounge.com';
  const urls = routes.map(([r, files]) => `  <url><loc>${base}${r}</loc><lastmod>${lastmod(files)}</lastmod></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
