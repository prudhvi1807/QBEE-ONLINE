import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check, CheckCircle2, Clock, Hammer, Signal, Wrench, BookOpen, Briefcase } from 'lucide-react';
import { COURSES, DOMAINS, KITS, TRACKS, courseByCode } from '../data/catalog';
import { inr } from '../lib/pricing';
import { useStore } from '../lib/store';
import { Button, ButtonLink, Code, Container, cx, domainBg, domainText } from '../components/ui';
import { TrackRow } from '../components/TrackRow';
import { CourseCard } from '../components/CourseCard';
import NotFound from './NotFound';

export default function CourseDetail() {
  const { slug = '' } = useParams();
  const course = courseByCode(slug);
  const { addCourse, inCart, addKit } = useStore();
  const navigate = useNavigate();
  if (!course) return <NotFound />;

  const added = inCart(course.code);
  const tracks = TRACKS.filter((t) => t.codes.includes(course.code) && t.codes.length < 6);
  const kits = KITS.filter((k) => k.codes.length === 1 && k.codes[0] === course.code);
  const related = COURSES.filter((c) => c.domain === course.domain && c.code !== course.code).slice(0, 3);

  const enrolNow = () => {
    addCourse(course.code);
    navigate('/cart');
  };

  const facts = [
    { icon: Signal, label: 'Level', value: course.level },
    { icon: Clock, label: 'Duration', value: `${course.weeks} weeks, about ${course.hours} hours live + lab` },
    { icon: BookOpen, label: 'Prerequisites', value: course.prerequisites },
    { icon: Wrench, label: 'Tools', value: course.tools },
  ];

  return (
    <>
      <header className="bg-ink text-white">
        <Container className="py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap gap-1.5 text-sm text-white/60">
            <Link to="/courses" className="hover:text-white hover:underline">Courses</Link>
            <span aria-hidden>/</span>
            <Link to={`/courses?domain=${course.domain}`} className="hover:text-white hover:underline">{DOMAINS[course.domain].name}</Link>
          </nav>
          <div className="lg:max-w-[calc(100%-400px)]">
            <span className={cx('inline-block rounded-md px-2 py-1 font-mono text-[13px] font-semibold text-white', domainBg[course.domain])}>{course.code}</span>
            <h1 className="mt-4 text-[32px] font-bold text-white sm:text-[44px]">{course.title}</h1>
            <p className="mt-3 text-[19px] text-white/80">{course.tagline}</p>
            <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-white/75">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {course.weeks} weeks</span>
              <span className="flex items-center gap-1.5"><Signal className="h-4 w-4" /> {course.levelTier}</span>
              <span className="flex items-center gap-1.5"><Hammer className="h-4 w-4" /> Capstone project</span>
            </p>
          </div>
        </Container>
      </header>

      <Container className="grid gap-10 pb-28 pt-10 lg:grid-cols-[1fr_360px] lg:pb-20">
        <div className="min-w-0 space-y-12">
          <section>
            <h2 className="text-[24px] font-bold">About this course</h2>
            <p className="mt-3 text-[17px] leading-relaxed text-text">{course.overview}</p>
            <dl className="mt-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-3 bg-white p-4">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-blue" aria-hidden />
                  <div>
                    <dt className="text-sm text-muted">{label}</dt>
                    <dd className="text-[15px] font-medium text-ink">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="text-[24px] font-bold">What you'll learn, week by week</h2>
            <p className="mt-2 text-muted">{course.modules.length} modules. {course.mode}.</p>
            <ol className="mt-6 space-y-3">
              {course.modules.map((m, i) => (
                <li key={m.title} className="flex gap-4 rounded-xl border border-line p-4 sm:p-5">
                  <span className={cx('grid h-9 w-9 shrink-0 place-items-center rounded-lg font-display font-bold', domainText[course.domain], 'bg-mist')}>{i + 1}</span>
                  <div>
                    <h3 className="font-sans text-[17px] font-semibold text-ink">{m.title}</h3>
                    <p className="mt-1 text-[15px] text-muted">{m.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-xl bg-honey-soft p-6 sm:p-8">
            <div className="flex items-center gap-2 text-warn">
              <Hammer className="h-5 w-5" aria-hidden />
              <h2 className="font-sans text-[15px] font-semibold text-warn">Capstone project</h2>
            </div>
            <p className="mt-3 text-[18px] font-medium leading-relaxed text-ink">{course.capstone}</p>
          </section>

          <section>
            <h2 className="text-[24px] font-bold">What you walk away with</h2>
            <ul className="mt-4 space-y-3">
              {course.outcomes.map((o) => (
                <li key={o} className="flex gap-3 text-[17px]">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-ok" aria-hidden /> {o}
                </li>
              ))}
            </ul>
            {course.roles && (
              <p className="mt-6 flex gap-3 rounded-xl border border-line p-4 text-[15px]">
                <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-blue" aria-hidden />
                <span>
                  <span className="font-semibold text-ink">Prepares you for roles such as </span>
                  {course.roles}.
                </span>
              </p>
            )}
          </section>

          {tracks.length > 0 && (
            <section>
              <h2 className="text-[24px] font-bold">Save with a track</h2>
              <p className="mt-2 text-muted">{course.code} is part of these role-focused bundles.</p>
              <div className="mt-5 space-y-3">
                {tracks.map((t) => (
                  <TrackRow key={t.id} track={t} />
                ))}
              </div>
            </section>
          )}

          {kits.length > 0 && (
            <section>
              <h2 className="text-[24px] font-bold">Take it with a board</h2>
              <p className="mt-2 text-muted">The board ships pre-tested and set up for the labs. Board prices are indicative and confirmed at enrolment.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {kits.map((k) => (
                  <div key={k.id} className="flex flex-col rounded-xl border border-line p-5">
                    <h3 className="text-[18px] font-bold">{k.name}</h3>
                    <p className="mt-1 text-[15px] text-muted">{k.includes}</p>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="font-display text-[20px] font-bold text-ink">{inr(k.price)}</span>
                      <Button size="sm" variant="dark" onClick={() => { addKit(k.id); navigate('/cart'); }}>Choose package</Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:-mt-48">
          <div className="sticky top-24 rounded-2xl border border-line bg-white p-6 shadow-[0_20px_50px_-24px_rgba(10,35,80,.35)]">
            <p className="text-sm text-muted">Course fee</p>
            <p className="font-display text-[36px] font-extrabold text-ink">{inr(15000)}</p>
            <p className="text-sm text-muted">or {inr(9000)} now and {inr(6000)} before the mid-point</p>
            <div className="mt-5 grid gap-2">
              <Button size="lg" onClick={enrolNow}>Enrol now</Button>
              <Button size="lg" variant="outline" onClick={() => addCourse(course.code)} disabled={added}>
                {added ? <><Check className="h-4 w-4" /> Added to cart</> : 'Add to cart'}
              </Button>
            </div>
            <ul className="mt-6 space-y-2.5 border-t border-line pt-5 text-[15px]">
              {['Instructor-led live sessions', 'Weekly hands-on labs and lab access', 'Mentor support for the full course', 'Graded capstone project', 'QBeeMind certificate on completion'].map((x) => (
                <li key={x} className="flex gap-2.5">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-ok" aria-hidden /> {x}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-muted">
              Batches run weekday evenings, weekends, or self-paced with live doubt-clearing. <Link to="/policies" className="font-medium text-blue hover:underline">Refund policy</Link>
            </p>
          </div>
        </aside>
      </Container>

      <section className="border-t border-line bg-mist py-14">
        <Container>
          <h2 className="text-[24px] font-bold">More {DOMAINS[course.domain].name} courses</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <CourseCard key={c.code} course={c} />
            ))}
          </div>
        </Container>
      </section>

      {/* Mobile sticky enrol bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-line bg-white px-4 py-3 lg:hidden">
        <div>
          <Code domain={course.domain}>{course.code}</Code>
          <p className="font-display text-[20px] font-bold leading-none text-ink">{inr(15000)}</p>
        </div>
        <div className="flex gap-2">
          <ButtonLink to="/contact" variant="outline" size="sm">Ask</ButtonLink>
          <Button size="sm" onClick={enrolNow}>Enrol now</Button>
        </div>
      </div>
    </>
  );
}
