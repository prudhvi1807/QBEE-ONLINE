import { BATCH_FORMATS, PAYMENT_OPTIONS, REFUND_POLICY } from '../data/catalog';
import { PageHeader, Section } from '../components/ui';

export default function Policies() {
  return (
    <>
      <PageHeader title="Payments, refunds and certification" crumbs={[{ to: '/', label: 'Home' }, { to: '/policies', label: 'Payments & refunds' }]} />
      <Section>
        <div className="max-w-3xl space-y-12">
          <section>
            <h2 className="text-[24px] font-bold">Payment options</h2>
            <ul className="mt-4 space-y-4">
              {PAYMENT_OPTIONS.map((p) => (
                <li key={p.name}>
                  <h3 className="font-sans text-[17px] font-semibold text-ink">{p.name}</h3>
                  <p className="text-[16px] text-muted">{p.body}</p>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-[24px] font-bold">Refunds and transfers</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[16px] text-text">
              {REFUND_POLICY.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-[24px] font-bold">Batch schedule</h2>
            <ul className="mt-4 space-y-3">
              {BATCH_FORMATS.map((b) => (
                <li key={b.name}>
                  <span className="font-semibold text-ink">{b.name}:</span> <span className="text-muted">{b.timing}. Best for {b.bestFor.toLowerCase()}.</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-muted">Upcoming batch start dates are shared on enrolment. Each course includes lab access and mentor support for its full duration.</p>
          </section>
          <section>
            <h2 className="text-[24px] font-bold">Enrolment and certification</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[16px] text-text">
              <li>Each course is priced at ₹15,000 and can be enrolled in individually, or combined into a domain track, cross-domain bundle, or the All-Access Career Program.</li>
              <li>All courses are instructor-led, with hands-on labs and a graded capstone project.</li>
              <li>A QBeeMind certificate is awarded on successful completion of each course and its project; bundle learners also receive a consolidated track certificate.</li>
              <li>The All-Access Career Program adds internship and the full level of placement support.</li>
            </ul>
          </section>
        </div>
      </Section>
    </>
  );
}
