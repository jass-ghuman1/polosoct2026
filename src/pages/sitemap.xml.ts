// sitemap.xml at the same URL as the old site. Lists every public page.
const routes = ['/', '/menu', '/menu/food', '/menu/drinks', '/happy-hour', '/menu/brunch', '/menu/gluten-free', '/menu/kids', '/private-events', '/gallery', '/about', '/contact', '/giveaway'];
export async function GET() {
  const base = 'https://poloslounge.com';
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${base}${r}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
