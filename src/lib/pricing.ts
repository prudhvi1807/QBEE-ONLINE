import { COURSES, COURSE_FEE, KITS, PROGRAMMES, SERVICES, TRACKS, type Domain } from '../data/catalog';

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN');

export interface CartState {
  courses: string[]; // course codes
  kits: string[]; // kit ids
  services: string[]; // service ids
  allAccess: boolean;
}

export const emptyCart: CartState = { courses: [], kits: [], services: [], allAccess: false };

export interface PriceLine {
  label: string;
  detail?: string;
  standard: number;
  price: number;
}

const DOMAIN_ORDER: Domain[] = ['vlsi', 'embedded', 'edge'];

/** Sliding scale for a self-selected set: 2 → 10%, 3 → 15%, 4–5 → 20%. */
export function slidingDiscount(n: number) {
  if (n >= 4) return 0.2;
  if (n === 3) return 0.15;
  if (n === 2) return 0.1;
  return 0;
}

function sameSet(a: string[], b: string[]) {
  return a.length === b.length && a.every((x) => b.includes(x));
}

/** Price a set of course codes using the catalogue rules. */
export function priceCourses(codes: string[]): PriceLine[] {
  const lines: PriceLine[] = [];
  const set = [...new Set(codes)];
  if (!set.length) return lines;

  // 1. Complete domain tracks (all 6 courses of a domain)
  const complete = DOMAIN_ORDER.filter((d) => COURSES.filter((c) => c.domain === d).every((c) => set.includes(c.code)));
  const loose = set.filter((code) => !complete.some((d) => COURSES.find((c) => c.code === code)?.domain === d));

  if (complete.length === 1) {
    const t = TRACKS.find((t) => t.domain === complete[0] && t.codes.length === 6)!;
    lines.push({ label: t.name, detail: '6 courses', standard: 90000, price: 65000 });
  } else if (complete.length === 2) {
    const prog = PROGRAMMES.find((p) => p.id === 'two-domain')!;
    lines.push({ label: prog.name, detail: '12 courses', standard: 180000, price: prog.price });
  } else if (complete.length === 3) {
    // All 18 courses: the All-Access programme is cheaper than 3 domain tracks and adds internship + placement support
    const prog = PROGRAMMES.find((p) => p.id === 'all-access')!;
    lines.push({ label: prog.name, detail: 'All 18 courses + internship + placement support', standard: prog.standard, price: prog.price });
  }

  // 2. Remaining courses: named track if it matches exactly, else sliding scale
  if (loose.length) {
    const track = TRACKS.find((t) => t.codes.length < 6 && sameSet(t.codes, loose));
    const standard = loose.length * COURSE_FEE;
    if (track) {
      lines.push({ label: track.name, detail: track.codes.join(' → '), standard, price: track.bundle });
    } else if (loose.length === 1) {
      lines.push({ label: loose[0], detail: 'Single course', standard, price: COURSE_FEE });
    } else {
      const d = slidingDiscount(loose.length);
      lines.push({
        label: `Build-your-own bundle (${loose.length} courses)`,
        detail: `${Math.round(d * 100)}% off · ${loose.join(', ')}`,
        standard,
        price: Math.round(standard * (1 - d)),
      });
    }
  }
  return lines;
}

export function priceCart(cart: CartState) {
  const lines: PriceLine[] = [];
  const courses = cart?.courses ?? [];
  const kits = cart?.kits ?? [];
  const services = cart?.services ?? [];

  if (cart?.allAccess) {
    const p = PROGRAMMES.find((x) => x.id === 'all-access')!;
    lines.push({ label: p.name, detail: 'All 18 courses + internship + placement support', standard: p.standard, price: p.price });
  } else {
    // Courses already covered by a kit are not charged twice
    const kitCodes = kits.flatMap((id) => KITS.find((k) => k.id === id)?.codes ?? []);
    lines.push(...priceCourses(courses.filter((c) => !kitCodes.includes(c))));
  }

  for (const id of kits) {
    const k = KITS.find((x) => x.id === id);
    if (k) lines.push({ label: k.name + ' package', detail: k.includes, standard: k.price, price: k.price });
  }
  for (const id of services) {
    const s = SERVICES.find((x) => x.id === id);
    if (s) lines.push({ label: s.name, detail: 'Apply directly', standard: s.price, price: s.price });
  }

  const total = lines.reduce((a, l) => a + l.price, 0);
  const standard = lines.reduce((a, l) => a + l.standard, 0);

  // Upsell hint: 3 complete domains cost more than All-Access, which also includes internship
  const allAccessHint = !cart?.allAccess && courses.length >= 13;

  return { lines, total, standard, savings: standard - total, allAccessHint };
}

export const cartCount = (c?: Partial<CartState> | null) =>
  (c?.allAccess ? 1 : (c?.courses?.length ?? 0)) + (c?.kits?.length ?? 0) + (c?.services?.length ?? 0);
