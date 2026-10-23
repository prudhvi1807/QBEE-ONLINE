import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Circle, FlaskConical, Hammer, Lock, PlayCircle } from 'lucide-react';
import { courseByCode } from '../../data/catalog';
import { labsForCourse } from '../../data/labs';
import { useStore } from '../../lib/store';
import { fmtDate, nextSession, progressOf } from '../../lib/portal';
import { Button, ButtonLink, Code, cx } from '../../components/ui';
import { Panel, Progress } from './PortalLayout';

export default function MyCourse() {
  const { code = '' } = useParams();
  const { portal, completeModule } = useStore();
  const course = courseByCode(code);
  const enr = portal.enrollments.find((e) => e.code === course?.code);
  const current = enr ? (enr.completed ? course!.modules.length - 1 : Math.min(enr.completedModules, course!.modules.length - 1)) : 0;
  const [open, setOpen] = useState(current);

  if (!course || !enr) {
    return (
      <Panel className="p-8 text-center">
        <h1 className="text-[24px] font-bold">You're not enrolled in this course</h1>
        <ButtonLink to={course ? `/courses/${course.slug}` : '/courses'} className="mt-5">See course details</ButtonLink>
      </Panel>
    );
  }

  const labs = labsForCourse(course.code);
  const m = course.modules[open];
  const state = (i: number) => (enr.completed || i < enr.completedModules ? 'done' : i === enr.completedModules ? 'current' : 'locked');
  const s = nextSession(enr.format);
  const lab = labs.find((l) => l.module === open);
  const allDone = !enr.completed && enr.completedModules >= course.modules.length;

  return (
    <>
      <div className="mb-6">
        <Link to="/portal" className="text-sm font-medium text-blue hover:underline">Dashboard</Link>
        <p className="mt-3">
          <Code domain={course.domain}>{course.code}</Code>
        </p>
        <h1 className="mt-1 text-[28px] font-bold sm:text-[32px]">{course.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <Progress value={progressOf(enr)} className="w-48" />
          <span className="text-sm text-muted">{progressOf(enr)}% complete</span>
          <span className="text-sm text-muted">{enr.format} batch. {s.label} {fmtDate(s.date)}, {s.time}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <Panel title="Modules">
          <ol>
            {course.modules.map((mod, i) => {
              const st = state(i);
              return (
                <li key={mod.title}>
                  <button
                    onClick={() => st !== 'locked' && setOpen(i)}
                    disabled={st === 'locked'}
                    className={cx('flex w-full items-start gap-3 border-l-[3px] px-4 py-3 text-left text-[15px] transition-colors cursor-pointer disabled:cursor-not-allowed', open === i ? 'border-blue bg-blue-soft' : 'border-transparent hover:bg-mist')}
                  >
                    {st === 'done' ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-ok" /> : st === 'current' ? <Circle className="mt-0.5 h-5 w-5 shrink-0 text-blue" /> : <Lock className="mt-0.5 h-5 w-5 shrink-0 text-muted" />}
                    <span className={cx(st === 'locked' ? 'text-muted' : 'text-ink')}>
                      <span className="block text-xs text-muted">Module {i + 1}</span>
                      {mod.title}
                    </span>
                  </button>
                </li>
              );
            })}
            <li className="flex items-start gap-3 border-t border-line px-4 py-3 text-[15px]">
              <Hammer className="mt-0.5 h-5 w-5 shrink-0 text-warn" /> <span className="text-ink">Capstone project</span>
            </li>
          </ol>
        </Panel>

        <div className="space-y-6">
          <Panel>
            <div className="grid aspect-video place-items-center rounded-t-xl bg-ink text-white">
              <div className="text-center">
                <PlayCircle className="mx-auto h-14 w-14 text-honey" aria-hidden />
                <p className="mt-3 font-semibold">Module {open + 1} session recording</p>
                <p className="text-sm text-white/60">Recordings appear here after each live session</p>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <h2 className="text-[22px] font-bold">{m.title}</h2>
              <p className="mt-2 text-[16px] text-text">{m.body}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {lab && (
                  <ButtonLink to={`/portal/labs/${lab.id}`} variant="dark" size="sm">
                    <FlaskConical className="h-4 w-4" /> Open in-browser lab
                  </ButtonLink>
                )}
                <ButtonLink to={`/portal/assignments#${course.code}:${open}`} variant="outline" size="sm">Lab {open + 1} assignment</ButtonLink>
                {state(open) === 'current' && (
                  <Button size="sm" variant="ghost" onClick={() => { completeModule(course.code); setOpen(Math.min(open + 1, course.modules.length - 1)); }}>
                    Mark module complete
                  </Button>
                )}
              </div>
            </div>
          </Panel>

          {(allDone || enr.completed) && (
            <Panel className="p-5">
              <h2 className="text-[19px] font-bold">Capstone project</h2>
              <p className="mt-2 text-[15px] text-text">{course.capstone}</p>
            </Panel>
          )}

          <Panel title="Need help?" className="p-0">
            <p className="px-5 py-4 text-[15px] text-muted">
              Bring questions to the next {s.label.toLowerCase()} on {fmtDate(s.date)}, or message your mentor from the assignment page. Mentor support runs for the full course duration.
            </p>
          </Panel>
        </div>
      </div>
    </>
  );
}
