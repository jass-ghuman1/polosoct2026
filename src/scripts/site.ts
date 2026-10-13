// Site-wide behaviour. Deliberately small: no animation library, no scroll hijacking.

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Reveal-on-scroll (content is visible without JS; the .js class opts in)
const revealables = document.querySelectorAll<HTMLElement>('[data-reveal], .reveal-rules');
if (reduce || !('IntersectionObserver' in window)) {
  revealables.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }),
    { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
  );
  revealables.forEach((el) => io.observe(el));
}

// 2. Header: solid after scrolling; switches to night colours over [data-theme="night"] sections
const header = document.querySelector<HTMLElement>('[data-header]');
if (header) {
  const nights = Array.from(document.querySelectorAll<HTMLElement>('[data-theme="night"]'));
  let ticking = false;
  const update = () => {
    ticking = false;
    header.classList.toggle('is-scrolled', scrollY > 24);
    const probe = header.offsetHeight / 2;
    const overNight = nights.some((s) => { const r = s.getBoundingClientRect(); return r.top <= probe && r.bottom >= probe; });
    header.classList.toggle('is-night', overNight);
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
}

// 3. Mobile menu (native <dialog>: focus trapping and Esc come for free)
const dialog = document.getElementById('mobile-nav') as HTMLDialogElement | null;
const opener = document.querySelector<HTMLButtonElement>('[data-menu-open]');
if (dialog && opener) {
  opener.addEventListener('click', () => { dialog.showModal(); opener.setAttribute('aria-expanded', 'true'); });
  dialog.querySelector('[data-menu-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { opener.setAttribute('aria-expanded', 'false'); opener.focus(); });
  dialog.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => dialog.close()));
}

// 4. Conversion tracking. Every [data-track] click (and custom polos:track events) goes to
//    GA4/Google Ads (gtag), GTM (dataLayer) and Meta Pixel (fbq) — whichever are loaded (production only).
type Track = { event: string; location?: string; url?: string };
const conv = (window as any).__polosConversions as { adsSignup?: string; adsReserve?: string } | undefined;
const metaMap: Record<string, string> = { reserve_click: 'Schedule', order_click: 'InitiateCheckout', email_signup: 'Lead', phone_click: 'Contact', event_enquiry_open: 'Contact', directions_click: 'FindLocation' };
export function track({ event, location = 'body', url }: Track) {
  const w = window as any;
  const params = { link_location: location, link_url: url };
  w.gtag?.('event', event, params);
  if (w.dataLayer && !w.gtag) w.dataLayer.push({ event, ...params });
  else if (w.dataLayer) w.dataLayer.push({ event: `polos_${event}`, ...params });
  if (w.fbq && metaMap[event]) w.fbq('track', metaMap[event]);
  if (w.gtag && conv) {
    if (event === 'email_signup' && conv.adsSignup) w.gtag('event', 'conversion', { send_to: conv.adsSignup });
    if (event === 'reserve_click' && conv.adsReserve) w.gtag('event', 'conversion', { send_to: conv.adsReserve });
  }
}
document.addEventListener('click', (ev) => {
  const el = (ev.target as Element).closest<HTMLElement>('[data-track]');
  if (el) track({ event: el.dataset.track!, location: el.dataset.trackLocation, url: (el as HTMLAnchorElement).href });
});
document.addEventListener('polos:track', (ev) => track((ev as CustomEvent<Track>).detail));

// 5. "Today at POLOS" — live open/Happy Hour status in Sherwood Park time
type Win = { days: string[]; start: string; end: string };
const today = document.querySelector<HTMLElement>('[data-today]');
if (today) {
  try {
    const cfg = JSON.parse(today.dataset.today!) as { tz: string; hours: { days: string[]; opens: string; closes: string; text: string }[]; hh: Win[] };
    const now = new Date();
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: cfg.tz, weekday: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(now).map((p) => [p.type, p.value]));
    const day = parts.weekday as string;
    const mins = Number(parts.hour) * 60 + Number(parts.minute);
    const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const fmt = (t: string) => { const [h, m] = t.split(':').map(Number); const hh = ((h + 11) % 12) + 1; return `${hh}${m ? ':' + String(m).padStart(2, '0') : ''} ${h < 12 ? 'AM' : 'PM'}`; };
    const hours = cfg.hours.find((h) => h.days.includes(day));
    if (hours) {
      const open = toMin(hours.opens), close = toMin(hours.closes);
      const isOpen = mins >= open && mins < close;
      const hh = cfg.hh.filter((w) => w.days.includes(day)).map((w) => ({
        s: w.start === 'open' ? open : toMin(w.start), e: w.end === 'close' ? close : toMin(w.end), w,
      }));
      const live = isOpen && hh.find((x) => mins >= x.s && mins < x.e);
      const next = hh.find((x) => mins < x.s);
      const status = today.querySelector<HTMLElement>('[data-today-status]')!;
      const detail = today.querySelector<HTMLElement>('[data-today-detail]')!;
      if (live) {
        status.textContent = 'Happy Hour is on';
        detail.textContent = live.w.end === 'close' ? 'until close tonight' : `until ${fmt(live.w.end)}`;
        today.classList.add('is-hh');
      } else if (isOpen) {
        status.textContent = 'Open now';
        detail.textContent = `until ${fmt(hours.closes)}` + (next ? ` · Happy Hour from ${fmt(next.w.start)}` : '');
      } else if (mins < open) {
        status.textContent = 'Opening today';
        detail.textContent = `${fmt(hours.opens)} – ${fmt(hours.closes)}`;
      } else {
        status.textContent = 'Closed for tonight';
        detail.textContent = 'See you tomorrow';
      }
    }
  } catch { /* the static hours line stays in place */ }
}
