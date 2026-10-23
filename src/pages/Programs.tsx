import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { COURSES, DOMAINS, PAYMENT_OPTIONS, PROGRAMMES, TRACKS, type Domain } from '../data/catalog';
import { inr, priceCourses } from '../lib/pricing';
import { useStore } from '../lib/store';
import { Button, PageHeader, Section, SectionHead, cx, domainText } from '../components/ui';
import { TrackRow } from '../components/TrackRow';

const DL: Domain[] = ['vlsi', 'embedded', 'edge'];

export default function Programs() {
  const { addTrack, addCourses, setAllAccess } = useStore();
  const navigate = useNavigate();
  const [twoPick, setTwoPick] = useState<Domain[]>(['vlsi', 'embedded']);
  const [picked, setPicked] = useState<string[]>(['VLSI-101', 'EMB-101']);

  const toggle = (code: string) => setPicked((p) => (p.includes(code) ? p.filter((x) => x !== code) : [...p, code]));
  const lines = priceCourses(picked);
  const total = lines.reduce((a, l) => a + l.price, 0);
  const standard = picked.length * 15000;

  const go = () => navigate('/cart');

  return (
    <>
      <PageHeader
        title="Programs and pricing"
        intro="Buy one course at a time, bundle within a domain, or combine across domains for the biggest savings. Every course on its own is ₹15,000."
        crumbs={[{ to: '/', label: 'Home' }, { to: '/programs', label: 'Programs & pricing' }]}
      />

      <Section>
        <div className="grid gap-5 lg:grid-cols-4">
          {PROGRAMMES.map((p) => {
            const featured = p.id === 'all-access';
            return (
              <div key={p.id} className={cx('flex flex-col rounded-xl p-6', featured ? 'bg-ink text-white lg:-my-3 lg:py-9' : 'border border-line')}>
                {featured && <span className="mb-3 self-start rounded-md bg-honey px-2 py-0.5 text-xs font-bold text-ink">Built around placement</span>}
                <h2 className={cx('text-[21px] font-bold', featured && 'text-white')}>{p.name}</h2>
                <p className={cx('mt-2 text-[15px]', featured ? 'text-white/75' : 'text-muted')}>{p.includes}</p>
                <div className="mt-6">
                  {p.standard > p.price && <p className={cx('text-sm line-through', featured ? 'text-white/50' : 'text-muted')}>{inr(p.standard)}</p>}
                  <p className={cx('font-display text-[34px] font-extrabold', featured ? 'text-honey' : 'text-ink')}>{inr(p.price)}</p>
                  {p.standard > p.price && <p className={cx('text-sm font-semibold', featured ? 'text-white/85' : 'text-ok')}>Save {inr(p.standard - p.price)}</p>}
                </div>

                <div className="mt-auto pt-6">
                  {p.id === 'single' && (
                    <Button variant="outline" className="w-full" onClick={() => navigate('/courses')}>Choose a course</Button>
                  )}
                  {p.id === 'domain' && (
                    <div className="grid gap-2">
                      {DL.map((d) => (
                        <Button key={d} variant="outline" size="sm" onClick={() => { addTrack(TRACKS.find((t) => t.domain === d && t.codes.length === 6)!.id); go(); }}>
                          {DOMAINS[d].name}
                        </Button>
                      ))}
                    </div>
                  )}
                  {p.id === 'two-domain' && (
                    <fieldset>
                      <legend className="mb-2 text-sm text-muted">Pick two domains</legend>
                      <div className="grid gap-1.5">
                        {DL.map((d) => (
                          <label key={d} className="flex items-center gap-2 text-[15px]">
                            <input
                              type="checkbox"
                              className="h-4 w-4 accent-[#0a2350]"
                              checked={twoPick.includes(d)}
                              onChange={() => setTwoPick((x) => (x.includes(d) ? x.filter((y) => y !== d) : [...x, d].slice(-2)))}
                            />
                            {DOMAINS[d].name}
                          </label>
                        ))}
                      </div>
                      <Button
                        className="mt-3 w-full"
                        variant="dark"
                        disabled={twoPick.length !== 2}
                        onClick={() => { addCourses(COURSES.filter((c) => twoPick.includes(c.domain)).map((c) => c.code)); go(); }}
                      >
                        Add 12 courses
                      </Button>
                    </fieldset>
                  )}
                  {p.id === 'all-access' && (
                    <Button className="w-full" onClick={() => { setAllAccess(true); go(); }}>Enrol in All-Access</Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section tone="mist">
        <SectionHead title="Role-focused tracks" intro="Shorter tracks line up with the roles companies recruit for. Bundle learners get priority batch scheduling and a consolidated track certificate." />
        <div className="space-y-10">
          {DL.map((d) => (
            <div key={d}>
              <h3 className={cx('mb-3 text-[19px] font-bold', domainText[d])}>{DOMAINS[d].name}</h3>
              <div className="space-y-3">
                {TRACKS.filter((t) => t.domain === d).map((t) => (
                  <TrackRow key={t.id} track={t} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="build">
        <SectionHead title="Build your own bundle" intro="Pick any courses. Any 2 are 10% off, any 3 are 15% off, any 4–5 are 20% off, and all six in a domain are a flat ₹65,000. Exact track matches use the track price." />
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="grid gap-6 md:grid-cols-3">
            {DL.map((d) => (
              <fieldset key={d}>
                <legend className={cx('mb-2 font-display text-[16px] font-bold', domainText[d])}>{DOMAINS[d].name}</legend>
                <div className="space-y-1.5">
                  {COURSES.filter((c) => c.domain === d).map((c) => {
                    const on = picked.includes(c.code);
                    return (
                      <label key={c.code} className={cx('flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors', on ? 'border-ink bg-mist' : 'border-line hover:border-muted')}>
                        <input type="checkbox" checked={on} onChange={() => toggle(c.code)} className="mt-1 h-4 w-4 shrink-0 accent-[#0a2350]" />
                        <span>
                          <span className={cx('block font-mono text-[12px] font-semibold', domainText[d])}>{c.code}</span>
                          <span className="block text-[14px] leading-snug text-text">{c.title}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
          <div>
            <div className="sticky top-24 rounded-xl border border-line p-6" aria-live="polite">
              <h3 className="text-[19px] font-bold">Your bundle</h3>
              <p className="mt-1 text-sm text-muted">{picked.length} {picked.length === 1 ? 'course' : 'courses'} selected</p>
              <ul className="mt-4 space-y-3 border-t border-line pt-4">
                {lines.map((l) => (
                  <li key={l.label} className="text-[15px]">
                    <div className="flex justify-between gap-3 font-semibold text-ink">
                      <span>{l.label}</span>
                      <span>{inr(l.price)}</span>
                    </div>
                    {l.detail && <p className="text-sm text-muted">{l.detail}</p>}
                  </li>
                ))}
                {!lines.length && <li className="text-sm text-muted">Select courses to see your price.</li>}
              </ul>
              <div className="mt-4 border-t border-line pt-4">
                {standard > total && <p className="text-sm text-muted">Standard {inr(standard)}</p>}
                <p className="flex items-baseline justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-display text-[28px] font-extrabold text-ink">{inr(total)}</span>
                </p>
                {standard > total && <p className="text-sm font-semibold text-ok">You save {inr(standard - total)}</p>}
              </div>
              <Button className="mt-5 w-full" disabled={!picked.length} onClick={() => { addCourses(picked); go(); }}>
                Add to cart
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <SectionHead title="Paying for your program" />
        <div className="grid gap-4 md:grid-cols-2">
          {PAYMENT_OPTIONS.map((p) => (
            <div key={p.name} className="flex gap-3 rounded-xl border border-line bg-white p-5">
              <Check className="mt-1 h-5 w-5 shrink-0 text-ok" aria-hidden />
              <div>
                <h3 className="font-sans text-[16px] font-semibold text-ink">{p.name}</h3>
                <p className="mt-1 text-[15px] text-muted">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
