import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { SERVICES } from '../data/catalog';
import { inr } from '../lib/pricing';
import { useStore } from '../lib/store';
import { Button, PageHeader, Section, SectionHead } from '../components/ui';

export default function Internships() {
  const { addService } = useStore();
  const navigate = useNavigate();
  return (
    <>
      <PageHeader
        title="Projects, internships and paper writing"
        intro="Not every student wants a full course. Apply directly for just the applied part. Open to students from any college, on its own or alongside a course."
        crumbs={[{ to: '/', label: 'Home' }, { to: '/internships', label: 'Internships' }]}
      />

      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {SERVICES.map((s) => (
            <div key={s.id} className="flex flex-col rounded-xl border border-line p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-[22px] font-bold">{s.name}</h2>
                <span className="font-display text-[26px] font-extrabold text-ink">{inr(s.price)}</span>
              </div>
              <p className="mt-2 text-[15px] text-muted">{s.includes}</p>
              <ul className="mt-5 space-y-2.5">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-[15px]">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-ok" aria-hidden /> {p}
                  </li>
                ))}
              </ul>
              <Button className="mt-6 self-start" variant="dark" onClick={() => { addService(s.id); navigate('/cart'); }}>
                Apply for {s.name.split(' —')[0].toLowerCase()}
              </Button>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-3xl rounded-xl bg-honey-soft p-5 text-[15px] text-ink">
          <strong>You remain the author.</strong> Paper-writing support is mentorship and editing of your own work — QBeeMind helps you write and refine the paper, but you are responsible for its content. It is not a ghost-writing service and does not guarantee acceptance by any journal or conference.
        </p>
      </Section>

      <Section tone="mist">
        <SectionHead title="A natural path: build it, extend it, publish it" intro="Each step can be added as you go." />
        <ol className="grid gap-8 md:grid-cols-3">
          {[
            ['Guided Project', 'Build a defined VLSI, embedded or Edge AI project with mentor guidance. Finish with working code or a design, documentation and a demo.'],
            ['Internship', 'Extend it on an assigned real-world project with periodic reviews. Leave with an internship certificate and a letter describing the work.'],
            ['Paper-Writing Support', 'If the work is strong enough to publish, turn it into a technical or research paper, formatted for a target venue.'],
          ].map(([t, b], i) => (
            <li key={t} className="border-t-2 border-ink pt-5">
              <span className="font-display text-[15px] font-bold text-blue">Step {i + 1}</span>
              <h3 className="mt-2 text-[20px] font-bold">{t}</h3>
              <p className="mt-2 text-[15px] text-muted">{b}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
