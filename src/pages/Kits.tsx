import { useNavigate } from 'react-router-dom';
import { PackageCheck, Truck, Wrench } from 'lucide-react';
import { DOMAINS, KITS, type Domain } from '../data/catalog';
import { inr } from '../lib/pricing';
import { useStore } from '../lib/store';
import { Button, PageHeader, Section, cx, domainBg, domainText } from '../components/ui';

export default function Kits() {
  const { addKit } = useStore();
  const navigate = useNavigate();
  return (
    <>
      <PageHeader
        title="Course + board packages"
        intro="Several courses are far more valuable when you build on real hardware. A package is the course plus a development board shipped to you, yours to keep — and it costs less than buying them separately."
        crumbs={[{ to: '/', label: 'Home' }, { to: '/kits', label: 'Hardware kits' }]}
      >
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Wrench, t: 'Pre-tested', b: 'Each board is tested and configured for the course labs before dispatch.' },
            { icon: Truck, t: 'Ships after enrolment', b: 'Boards ship once enrolment and payment are confirmed. Track it in your portal.' },
            { icon: PackageCheck, t: 'Already have one?', b: 'Use your own compatible board and take the course alone at ₹15,000.' },
          ].map(({ icon: Icon, t, b }) => (
            <li key={t} className="flex gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-blue" aria-hidden />
              <span>
                <span className="block font-semibold text-ink">{t}</span>
                <span className="block text-[15px] text-muted">{b}</span>
              </span>
            </li>
          ))}
        </ul>
      </PageHeader>

      {(['vlsi', 'embedded', 'edge'] as Domain[]).map((d, i) => (
        <Section key={d} tone={i % 2 ? 'mist' : 'white'}>
          <h2 className={cx('text-[26px] font-bold', domainText[d])}>{DOMAINS[d].name}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {KITS.filter((k) => k.domain === d).map((k) => (
              <div key={k.id} className="flex flex-col overflow-hidden rounded-xl border border-line bg-white">
                <span className={cx('h-1', domainBg[d])} aria-hidden />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[19px] font-bold">{k.name}</h3>
                  <p className="mt-1 text-sm font-medium text-blue">{k.board}</p>
                  <p className="mt-3 text-[15px] text-muted">{k.includes}</p>
                  <div className="mt-auto pt-5">
                    <p className="font-display text-[26px] font-extrabold text-ink">{inr(k.price)}</p>
                    <Button className="mt-3 w-full" variant="dark" onClick={() => { addKit(k.id); navigate('/cart'); }}>
                      Choose package
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      ))}

      <Section>
        <p className="max-w-3xl rounded-xl bg-honey-soft p-5 text-[15px] text-ink">
          <strong>Board prices are indicative.</strong> Exact board model, specification and price are confirmed at enrolment and depend on availability. For course-plus-board packages, the board cost becomes non-refundable once the board has been dispatched.
        </p>
      </Section>
    </>
  );
}
