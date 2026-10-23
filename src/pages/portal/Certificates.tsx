import { useState } from 'react';
import { Award, Printer, X } from 'lucide-react';
import { COURSES, DOMAINS } from '../../data/catalog';
import { useStore } from '../../lib/store';
import { progressOf } from '../../lib/portal';
import { Button, Code } from '../../components/ui';
import { Panel, PortalTitle, Progress } from './PortalLayout';

export default function Certificates() {
  const { portal, student } = useStore();
  const [view, setView] = useState<string | null>(null);
  const done = portal.enrollments.filter((e) => e.completed);
  const inProgress = portal.enrollments.filter((e) => !e.completed);
  const viewing = COURSES.find((c) => c.code === view);

  return (
    <>
      <PortalTitle title="Certificates" intro="Awarded when you complete a course and its graded capstone project." />
      <div className="grid gap-4 md:grid-cols-2">
        {done.map((e) => {
          const c = COURSES.find((x) => x.code === e.code)!;
          return (
            <Panel key={e.code} className="flex items-start gap-4 p-5">
              <Award className="h-10 w-10 shrink-0 text-honey-deep" aria-hidden />
              <div className="min-w-0 flex-1">
                <Code domain={c.domain}>{c.code}</Code>
                <p className="font-semibold leading-snug text-ink">{c.title}</p>
                <Button size="sm" variant="outline" className="mt-3" onClick={() => setView(c.code)}>View certificate</Button>
              </div>
            </Panel>
          );
        })}
        {inProgress.map((e) => {
          const c = COURSES.find((x) => x.code === e.code)!;
          return (
            <Panel key={e.code} className="p-5">
              <Code domain={c.domain}>{c.code}</Code>
              <p className="font-semibold leading-snug text-ink">{c.title}</p>
              <Progress value={progressOf(e)} className="mt-3" />
              <p className="mt-2 text-sm text-muted">Finish all modules and the capstone to earn this certificate.</p>
            </Panel>
          );
        })}
        {!portal.enrollments.length && <p className="text-muted">Enrol in a course to start working toward a certificate.</p>}
      </div>

      {viewing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4" role="dialog" aria-modal="true" aria-label="Certificate">
          <div className="relative w-full max-w-3xl">
            <div className="absolute -top-12 right-0 flex gap-2 print:hidden">
              <Button size="sm" variant="light" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button>
              <Button size="sm" variant="light" onClick={() => setView(null)} aria-label="Close"><X className="h-4 w-4" /></Button>
            </div>
            <div className="aspect-[1.414] rounded-lg bg-white p-[6%] text-center shadow-2xl ring-8 ring-inset ring-honey/40">
              <img src="./logo.png" alt="" className="mx-auto h-14 w-14 rounded-lg" />
              <p className="mt-3 text-sm font-semibold text-muted">QBeeMind Solutions Pvt. Ltd.</p>
              <p className="mt-[4%] font-display text-[clamp(18px,3.4vw,30px)] font-bold text-ink">Certificate of Completion</p>
              <p className="mt-[3%] text-[clamp(12px,1.8vw,16px)] text-muted">This certifies that</p>
              <p className="mt-1 font-display text-[clamp(22px,4.4vw,40px)] font-extrabold text-ink">{student?.name}</p>
              <p className="mt-[2%] text-[clamp(12px,1.8vw,16px)] text-muted">has completed the {viewing.weeks}-week project-based course and its capstone</p>
              <p className="mt-2 font-display text-[clamp(15px,2.4vw,22px)] font-bold text-blue">{viewing.code} {viewing.title}</p>
              <p className="mt-1 text-[clamp(11px,1.5vw,14px)] text-muted">{DOMAINS[viewing.domain].name}</p>
              <p className="mt-[5%] font-mono text-[clamp(10px,1.3vw,12px)] text-muted">Certificate ID QBM-{viewing.code}-{(student?.email.length ?? 7) * 1373}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
