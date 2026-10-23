import { Building2, Library } from 'lucide-react';
import { ButtonLink, PageHeader, Section } from '../components/ui';
import { OFFERINGS } from '../data/catalog';

export default function Institutions() {
  const uni = OFFERINGS[2];
  const cur = OFFERINGS[3];
  return (
    <>
      <PageHeader
        title="For universities and institutions"
        intro="Core training programs and custom, industry-aligned curricula for colleges, universities and engineering teams — grounded in project-based learning."
        crumbs={[{ to: '/', label: 'Home' }, { to: '/institutions', label: 'For institutions' }]}
      >
        <ButtonLink to="/contact?topic=partnership" className="mt-8">Discuss a partnership</ButtonLink>
      </PageHeader>
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            { icon: Building2, o: uni },
            { icon: Library, o: cur },
          ].map(({ icon: Icon, o }) => (
            <div key={o.title} className="rounded-xl border border-line p-7">
              <Icon className="h-7 w-7 text-blue" aria-hidden />
              <h2 className="mt-4 text-[24px] font-bold">{o.title}</h2>
              <p className="mt-3 text-[16px] text-muted">{o.body}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section tone="mist">
        <div className="max-w-3xl">
          <h2 className="text-[28px] font-bold">Taught on the tools teams actually use</h2>
          <p className="mt-3 text-[17px] text-muted">
            Programs cover the RTL-to-GDSII flow, UVM verification, FPGA prototyping, ARM Cortex-M firmware, FreeRTOS, CAN, embedded Linux, TensorFlow Lite and SoC/FPGA deployment — so students arrive able to contribute rather than needing months of ramp-up. Any of the 18 QBeeMind courses can be delivered as part of a university program.
          </p>
          <ButtonLink to="/courses" variant="outline" className="mt-6">See the 18 courses</ButtonLink>
        </div>
      </Section>
    </>
  );
}
