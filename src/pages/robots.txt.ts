// Production: allow all + sitemap. Previews: disallow all (they are also noindex).
export async function GET() {
  const prod = import.meta.env.PUBLIC_DEPLOY_ENV === 'production';
  const body = prod ? 'User-agent: *\nAllow: /\n\nSitemap: https://poloslounge.com/sitemap.xml\n' : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
