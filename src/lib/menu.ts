// Helpers shared by every menu page.
export const price = (n: number | null | undefined) =>
  n == null ? '' : Number.isInteger(n) ? String(n) : n.toFixed(2);

/** schema.org Menu JSON-LD built from a menu file, so Google reads the same data guests see. */
export function menuJsonLd(opts: { name: string; url: string; sections: { title: string; items: any[] }[] }) {
  const offer = (p: number) => ({ '@type': 'Offer', price: p.toFixed(2), priceCurrency: 'CAD' });
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: opts.name,
    url: opts.url,
    inLanguage: 'en-CA',
    hasMenuSection: opts.sections.map((s) => ({
      '@type': 'MenuSection',
      name: s.title,
      hasMenuItem: s.items.map((i) => {
        const o: Record<string, unknown> = { '@type': 'MenuItem', name: i.name };
        if (i.description) o.description = i.description;
        if (typeof i.price === 'number') o.offers = offer(i.price);
        else if (i.variants) o.offers = i.variants.map((v: any) => ({ ...offer(v.price), name: v.label }));
        else if (i.prices) o.offers = Object.entries(i.prices).filter(([, v]) => v != null).map(([k, v]) => ({ ...offer(v as number), name: k }));
        if (i.dietary?.includes('vegan')) o.suitableForDiet = 'https://schema.org/VeganDiet';
        return o;
      }),
    })),
  };
}

export function breadcrumbJsonLd(trail: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: t.url })),
  };
}
