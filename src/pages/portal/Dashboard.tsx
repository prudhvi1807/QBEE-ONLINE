import { Link, useSearchParams } from 'react-router-dom';
import { CalendarClock, CheckCircle2, ClipboardCheck, Package } from 'lucide-react';
import { COURSES, KITS } from '../../data/catalog';
import { useStore } from '../../lib/store';
import { assignmentsFor, fmtDate, nextSession, progressOf } from '../../lib/portal';
import { ButtonLink, Code } from '../../components/ui';
import { Panel, PortalTitle, Progress } from './PortalLayout';

export default function Dashboard() {
  const { student, portal } = useStore();
  const [params] = useSearchParams();
  const active = portal.enrollments.filter((e) => !e.completed);
  const done = portal.enrollments.filter((e) => e.completed);
  const todo = assignmentsFor(active, portal.submissions).filter((a) => a.unlocked && !a.submission).slice(0, 4);
  const sessions = active
    .map((e) => ({ e, s: nextSession(e.format) }))
    .sort((a, b) => a.s.date.getTime() - b.s.date.getTime())
    .slice(0, 3);
  const first = student?.name.split(' ')[0] ?? 'there';

  if (!portal.enrollments.length) {
    return (
      <>
        <PortalTitle title={`Welcome, ${first}`} />
        <Panel className="p-8 text-center sm:p-10">
          <h2 className="text-[20px] font-bold text-ink sm:text-[22px]">You're not enrolled in a course yet</h2>
          <p className="mt-2 text-sm sm:text-base text-muted">
            Pick a course or a track. Your labs, assignments, and kit orders will appear here.
          </p>
          <ButtonLink to="/courses" className="mt-6" size="md">Browse courses</ButtonLink>
        </Panel>
      </>
    );
  }

  return (
    <>
      {params.get('welcome') && (
        <div className="mb-6 flex gap-3.5 rounded-xl border border-ok/30 bg-ok-soft p-4 text-ink" role="status">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-ok" aria-hidden />
          <p className="text-sm sm:text-[15px] leading-relaxed">
            <strong>Payment received — you're enrolled.</strong> A receipt and your batch start date are on their way by email.
          </p>
        </div>
      )}
      <PortalTitle title={`Welcome back, ${first}`} intro="Pick up where you left off." />

      {/* Balanced layout with flexible main dashboard and 350–370px right column on desktop (xl:grid-cols-[1fr_360px]); stacks on tablet/mobile */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-[1fr_360px]">
        {/* Left Column: Continue Learning, Assignments Due, Completed */}
        <div className="space-y-6">
          <Panel title="Continue learning">
            <ul className="divide-y divide-line">
              {active.map((e) => {
                const c = COURSES.find((x) => x.code === e.code)!;
                const pct = progressOf(e);
                return (
                  <li key={e.code} className="grid gap-4 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6">
                    <div className="min-w-0">
                      <Code domain={c.domain}>{c.code}</Code>
                      <p className="mt-1 font-semibold leading-snug text-ink">{c.title}</p>
                      <div className="mt-2.5 flex items-center gap-3">
                        <Progress value={pct} className="max-w-[240px] flex-1" />
                        <span className="shrink-0 text-xs sm:text-sm text-muted">
                          {Math.min(e.completedModules, c.modules.length)} of {c.modules.length} modules
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <ButtonLink to={`/portal/course/${c.code}`} size="sm" variant="dark">Resume</ButtonLink>
                    </div>
                  </li>
                );
              })}
              {!active.length && (
                <li className="px-5 py-6 text-sm text-muted sm:px-6">All your courses are complete. Nice work.</li>
              )}
            </ul>
          </Panel>

          <Panel
            title="Assignments due"
            action={
              <Link to="/portal/assignments" className="text-xs sm:text-sm font-semibold text-blue hover:underline">
                All assignments
              </Link>
            }
          >
            <ul className="divide-y divide-line">
              {todo.map((a) => (
                <li key={a.key} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                  <span className="flex min-w-0 items-start gap-3">
                    <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue" aria-hidden />
                    <span className="min-w-0">
                      <span className="block font-medium text-ink truncate">{a.title}</span>
                      <span className="block text-xs sm:text-sm text-muted">{a.code}</span>
                    </span>
                  </span>
                  <Link
                    to={`/portal/assignments#${a.key}`}
                    className="shrink-0 text-xs sm:text-sm font-semibold text-blue hover:underline"
                  >
                    Submit
                  </Link>
                </li>
              ))}
              {!todo.length && (
                <li className="px-5 py-6 text-sm text-muted sm:px-6">
                  Nothing due. New labs unlock as you finish modules.
                </li>
              )}
            </ul>
          </Panel>

          {done.length > 0 && (
            <Panel title="Completed">
              <ul className="divide-y divide-line">
                {done.map((e) => {
                  const c = COURSES.find((x) => x.code === e.code)!;
                  return (
                    <li key={e.code} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                      <span className="min-w-0">
                        <Code domain={c.domain}>{c.code}</Code>
                        <span className="mt-0.5 block font-medium text-ink truncate">{c.title}</span>
                      </span>
                      <Link
                        to="/portal/certificates"
                        className="shrink-0 text-xs sm:text-sm font-semibold text-blue hover:underline"
                      >
                        View certificate
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          )}
        </div>

        {/* Right Column: Upcoming Sessions and Hardware Kits */}
        <div className="space-y-6">
          <Panel title="Upcoming">
            <ul className="divide-y divide-line">
              {sessions.map(({ e, s }) => (
                <li key={e.code} className="flex items-start gap-3.5 px-5 py-4 sm:px-6">
                  <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-blue" aria-hidden />
                  <span className="min-w-0">
                    <span className="block font-medium text-ink leading-snug">{s.label}, {e.code}</span>
                    <span className="mt-0.5 block text-xs sm:text-sm text-muted">{fmtDate(s.date)} at {s.time}</span>
                  </span>
                </li>
              ))}
              {portal.bookings.map((b) => (
                <li key={b.id} className="flex items-start gap-3.5 px-5 py-4 sm:px-6">
                  <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-embedded" aria-hidden />
                  <span className="min-w-0">
                    <span className="block font-medium text-ink leading-snug">{b.resource}</span>
                    <span className="mt-0.5 block text-xs sm:text-sm text-muted">{fmtDate(b.date)}, {b.slot}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-5 py-3.5 sm:px-6">
              <Link to="/portal/booking" className="text-xs sm:text-sm font-semibold text-blue hover:underline">
                Book a remote lab slot
              </Link>
            </div>
          </Panel>

          <Panel title="Hardware">
            {portal.kitOrders.length ? (
              <ul className="divide-y divide-line">
                {portal.kitOrders.map((o) => {
                  const k = KITS.find((x) => x.id === o.kitId)!;
                  return (
                    <li key={o.id} className="flex items-start gap-3.5 px-5 py-4 sm:px-6">
                      <Package className="mt-0.5 h-5 w-5 shrink-0 text-blue" aria-hidden />
                      <span className="min-w-0">
                        <span className="block font-medium text-ink leading-snug">{k.board}</span>
                        <span className="mt-0.5 block text-xs sm:text-sm text-muted">{o.stage}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-5 py-5 text-sm text-muted sm:px-6">
                No boards ordered.{' '}
                <Link to="/kits" className="font-medium text-blue hover:underline">
                  See packages
                </Link>
              </p>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
