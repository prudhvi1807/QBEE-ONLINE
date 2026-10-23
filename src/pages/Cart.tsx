import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ShoppingBag, Trash2 } from 'lucide-react';
import { BATCH_FORMATS, COURSES, KITS, SERVICES } from '../data/catalog';
import { inr, priceCart } from '../lib/pricing';
import { useStore, type Enrollment } from '../lib/store';
import { Button, ButtonLink, Code, Container, cx } from '../components/ui';

export default function Cart() {
  const store = useStore();
  const { cart, student } = store;
  const navigate = useNavigate();
  const [format, setFormat] = useState<Enrollment['format']>('Weekday evenings');
  const [plan, setPlan] = useState<'full' | 'split'>('full');
  const [paying, setPaying] = useState(false);

  const { lines, total, standard, savings, allAccessHint } = priceCart(cart);
  const empty = !lines.length;
  const singleCourse = !cart.allAccess && cart.courses.length === 1 && !cart.kits.length;
  const dueNow = plan === 'split' && singleCourse ? Math.round(total * 0.6) : total;

  const pay = () => {
    if (!student) {
      navigate('/login?next=/cart');
      return;
    }
    setPaying(true);
    // TODO(payments): create a Razorpay order on the server for `dueNow`, open Razorpay Checkout,
    // verify the signature server-side, then enrol. Simulated here so the flow can be reviewed.
    setTimeout(() => {
      store.enrollFromCart(format);
      navigate('/portal?welcome=1');
    }, 900);
  };

  if (empty) {
    return (
      <Container className="py-24 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-muted" aria-hidden />
        <h1 className="mt-4 text-[32px] font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted">Add a course, a track, or a board package to see your price.</p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink to="/courses">Browse courses</ButtonLink>
          <ButtonLink to="/programs" variant="outline">See bundles</ButtonLink>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-[32px] font-bold sm:text-[40px]">Your cart</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="rounded-xl border border-line">
            <h2 className="border-b border-line px-5 py-4 font-sans text-[17px] font-semibold text-ink">Items</h2>
            <ul className="divide-y divide-line">
              {cart.allAccess && (
                <li className="flex items-center justify-between gap-4 px-5 py-4">
                  <span>
                    <span className="block font-semibold text-ink">All-Access Career Program</span>
                    <span className="block text-sm text-muted">All 18 courses, internship and placement support</span>
                  </span>
                  <RemoveBtn onClick={() => store.setAllAccess(false)} label="All-Access Career Program" />
                </li>
              )}
              {cart.courses.map((code) => {
                const c = COURSES.find((x) => x.code === code)!;
                return (
                  <li key={code} className="flex items-center justify-between gap-4 px-5 py-4">
                    <span className="min-w-0">
                      <Code domain={c.domain}>{c.code}</Code>
                      <Link to={`/courses/${c.slug}`} className="block font-semibold leading-snug text-ink hover:underline">{c.title}</Link>
                      <span className="block text-sm text-muted">{c.weeks} weeks</span>
                    </span>
                    <RemoveBtn onClick={() => store.removeCourse(code)} label={c.title} />
                  </li>
                );
              })}
              {cart.kits.map((id) => {
                const k = KITS.find((x) => x.id === id)!;
                return (
                  <li key={id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <span>
                      <span className="block font-semibold text-ink">{k.name} package</span>
                      <span className="block text-sm text-muted">{k.includes}</span>
                    </span>
                    <RemoveBtn onClick={() => store.removeKit(id)} label={k.name} />
                  </li>
                );
              })}
              {cart.services.map((id) => {
                const s = SERVICES.find((x) => x.id === id)!;
                return (
                  <li key={id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <span>
                      <span className="block font-semibold text-ink">{s.name}</span>
                      <span className="block text-sm text-muted">Apply directly</span>
                    </span>
                    <RemoveBtn onClick={() => store.removeService(id)} label={s.name} />
                  </li>
                );
              })}
            </ul>
          </section>

          {allAccessHint && (
            <div className="rounded-xl bg-honey-soft p-5">
              <p className="font-semibold text-ink">The All-Access Career Program may suit you better</p>
              <p className="mt-1 text-[15px] text-ink/80">All 18 courses plus internship and full placement support for ₹1,65,000.</p>
              <Button size="sm" variant="dark" className="mt-3" onClick={() => store.setAllAccess(true)}>Switch to All-Access</Button>
            </div>
          )}

          {(cart.allAccess || cart.courses.length > 0 || cart.kits.length > 0) && (
            <fieldset className="rounded-xl border border-line p-5">
              <legend className="px-1 font-sans text-[17px] font-semibold text-ink">Batch format</legend>
              <div className="mt-2 grid gap-3 sm:grid-cols-3">
                {BATCH_FORMATS.map((b) => (
                  <label key={b.name} className={cx('cursor-pointer rounded-lg border p-4 transition-colors', format === b.name ? 'border-ink bg-mist' : 'border-line hover:border-muted')}>
                    <input type="radio" name="format" className="sr-only" checked={format === b.name} onChange={() => setFormat(b.name as Enrollment['format'])} />
                    <span className="block font-semibold text-ink">{b.name}</span>
                    <span className="mt-1 block text-sm text-muted">{b.timing}</span>
                  </label>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted">Your batch start date is confirmed by email after enrolment.</p>
            </fieldset>
          )}
        </div>

        <aside>
          <div className="sticky top-24 rounded-2xl border border-line p-6">
            <h2 className="font-sans text-[17px] font-semibold text-ink">Price breakdown</h2>
            <ul className="mt-4 space-y-3">
              {lines.map((l, i) => (
                <li key={l.label + i} className="text-[15px]">
                  <div className="flex justify-between gap-3">
                    <span className="font-medium text-ink">{l.label}</span>
                    <span className="shrink-0 font-semibold text-ink">{inr(l.price)}</span>
                  </div>
                  {l.standard > l.price && <p className="text-sm text-ok">Saves {inr(l.standard - l.price)}</p>}
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-line pt-4 text-[15px]">
              {savings > 0 && (
                <p className="flex justify-between text-muted">
                  <span>Standard price</span>
                  <span className="line-through">{inr(standard)}</span>
                </p>
              )}
              <p className="flex items-baseline justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-display text-[30px] font-extrabold text-ink">{inr(total)}</span>
              </p>
              {savings > 0 && <p className="text-right text-sm font-semibold text-ok">You save {inr(savings)}</p>}
            </div>

            <fieldset className="mt-5 space-y-2">
              <legend className="mb-2 text-sm font-semibold text-ink">Payment plan</legend>
              <label className="flex cursor-pointer items-start gap-2.5 text-[15px]">
                <input type="radio" name="plan" checked={plan === 'full'} onChange={() => setPlan('full')} className="mt-1 accent-[#0a2350]" />
                <span>Pay in full — {inr(total)}</span>
              </label>
              {singleCourse ? (
                <label className="flex cursor-pointer items-start gap-2.5 text-[15px]">
                  <input type="radio" name="plan" checked={plan === 'split'} onChange={() => setPlan('split')} className="mt-1 accent-[#0a2350]" />
                  <span>
                    Two instalments — {inr(Math.round(total * 0.6))} now, {inr(total - Math.round(total * 0.6))} before the course mid-point
                  </span>
                </label>
              ) : (
                <p className="text-sm text-muted">Bundles can be split across instalments by arrangement. <Link to="/contact" className="font-medium text-blue hover:underline">Ask an advisor</Link></p>
              )}
            </fieldset>

            <Button size="lg" className="mt-6 w-full" onClick={pay} disabled={paying}>
              <Lock className="h-4 w-4" /> {paying ? 'Processing…' : student ? `Pay ${inr(dueNow)}` : 'Log in to pay'}
            </Button>
            <p className="mt-3 text-center text-xs text-muted">UPI, card or bank transfer. A receipt and enrolment confirmation are issued for every payment.</p>
          </div>
        </aside>
      </div>
    </Container>
  );
}

function RemoveBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-muted hover:bg-mist hover:text-edge cursor-pointer" aria-label={`Remove ${label}`}>
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
