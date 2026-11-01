import { Link, useParams } from 'react-router-dom';
import { BookOpen, Briefcase, Check, CheckCircle2, Clock, Hammer, Signal, Wrench } from 'lucide-react';
import { COURSES, DOMAINS, KITS, TRACKS, courseByCode } from '../data/catalog';
import { ButtonLink, Code, Container, cx, domainBg, domainText } from '../components/ui';
import { CourseCard } from '../components/CourseCard';
import { getCourseImage, FALLBACK_COURSE_IMAGE } from '../lib/courseImages';
import NotFound from './NotFound';

export default function CourseDetail() {
  const { slug = '' } = useParams();
  const course = courseByCode(slug);

  if (!course) return <NotFound />;

  const imageMeta = getCourseImage(course.code);
  const bgImage = imageMeta.src || FALLBACK_COURSE_IMAGE;
  const tracks = TRACKS.filter((t) => t.codes.includes(course.code) && t.codes.length < 6);
  const kits = KITS.filter((k) => k.codes.length === 1 && k.codes[0] === course.code);
  const related = COURSES.filter((c) => c.domain === course.domain && c.code !== course.code).slice(0, 3);

  const facts = [
    { icon: Signal, label: 'Level', value: course.level },
    { icon: Clock, label: 'Duration', value: `${course.weeks} weeks, about ${course.hours} hours live + lab` },
    { icon: BookOpen, label: 'Prerequisites', value: course.prerequisites },
    { icon: Wrench, label: 'Tools', value: course.tools },
  ];

  return (
    <>
      {/* Course Hero Section with Subject-Specific Background Image & Subtle Navy Overlay */}
      <header
        className="relative min-h-[380px] sm:min-h-[420px] lg:min-h-[450px] flex items-center overflow-hidden bg-ink text-white"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(11, 19, 43, 0.90) 0%, rgba(11, 19, 43, 0.70) 50%, rgba(11, 19, 43, 0.35) 100%), url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Container className="relative z-10 py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap gap-1.5 text-sm text-white/70">
            <Link to="/courses" className="hover:text-white hover:underline transition-colors">Courses</Link>
            <span aria-hidden>/</span>
            <Link to={`/courses?domain=${course.domain}`} className="hover:text-white hover:underline transition-colors">
              {DOMAINS[course.domain].name}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white/90 font-medium">{course.code}</span>
          </nav>

          <div className="lg:max-w-[calc(100%-400px)]">
            <span className={cx('inline-block rounded-md px-2.5 py-1 font-mono text-[13px] font-semibold text-white shadow-2xs', domainBg[course.domain])}>
              {course.code}
            </span>
            <h1 className="mt-4 font-display text-[32px] font-bold text-white sm:text-[44px] leading-tight tracking-tight">
              {course.title}
            </h1>
            <p className="mt-3 text-[18px] text-white/85 sm:text-[20px] leading-relaxed">
              {course.tagline}
            </p>
            <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5 text-[15px] font-medium text-white/80">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-honey" /> {course.weeks} weeks
              </span>
              <span className="flex items-center gap-1.5">
                <Signal className="h-4 w-4 text-honey" /> {course.levelTier}
              </span>
              <span className="flex items-center gap-1.5">
                <Hammer className="h-4 w-4 text-honey" /> Capstone project
              </span>
            </p>
          </div>
        </Container>
      </header>

      <Container className="grid gap-10 pb-28 pt-10 lg:grid-cols-[1fr_360px] lg:pb-20">
        <div className="min-w-0 space-y-12">
          {/* Key Facts / Specifications Panel (replaces the old 'About this course' text section) */}
          <section>
            <h2 className="text-[22px] font-bold text-ink">Course Specifications & Prerequisites</h2>
            <dl className="mt-5 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-3.5 bg-white p-4.5">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-blue" aria-hidden />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</dt>
                    <dd className="mt-1 text-[15px] font-medium text-ink leading-snug">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          {/* Syllabus / Modules */}
          <section>
            <h2 className="text-[24px] font-bold text-ink">What you'll learn, week by week</h2>
            <p className="mt-1.5 text-muted">{course.modules.length} modules. {course.mode}.</p>
            <ol className="mt-6 space-y-3.5">
              {course.modules.map((m, i) => (
                <li key={m.title} className="flex gap-4 rounded-xl border border-line p-5 bg-white shadow-2xs">
                  <span className={cx('grid h-9 w-9 shrink-0 place-items-center rounded-lg font-display font-bold', domainText[course.domain], 'bg-mist')}>
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-sans text-[17px] font-semibold text-ink">{m.title}</h3>
                    <p className="mt-1.5 text-[15px] text-muted leading-relaxed">{m.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Capstone Project */}
          <section className="rounded-2xl bg-honey/15 border border-honey/30 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-warn">
              <Hammer className="h-5 w-5" aria-hidden />
              <h2 className="font-sans text-[15px] font-bold uppercase tracking-wider text-warn">Capstone Project</h2>
            </div>
            <p className="mt-3 text-[17px] font-medium leading-relaxed text-ink">{course.capstone}</p>
          </section>

          {/* Learning Outcomes */}
          <section>
            <h2 className="text-[24px] font-bold text-ink">What you walk away with</h2>
            <ul className="mt-5 space-y-3">
              {course.outcomes.map((o) => (
                <li key={o} className="flex gap-3 text-[16px] text-text">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-ok" aria-hidden /> {o}
                </li>
              ))}
            </ul>
            {course.roles && (
              <p className="mt-6 flex gap-3 rounded-xl border border-line bg-mist/60 p-4.5 text-[15px]">
                <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-blue" aria-hidden />
                <span>
                  <span className="font-semibold text-ink">Prepares you for roles such as: </span>
                  <span className="text-text">{course.roles}</span>.
                </span>
              </p>
            )}
          </section>

          {/* Related Tracks */}
          {tracks.length > 0 && (
            <section>
              <h2 className="text-[24px] font-bold text-ink">Role-Focused Program Tracks</h2>
              <p className="mt-1.5 text-muted">{course.code} is part of these comprehensive learning tracks.</p>
              <div className="mt-5 space-y-3">
                {tracks.map((t) => (
                  <div key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-line bg-white p-5">
                    <div>
                      <h3 className="font-semibold text-ink text-[17px]">{t.name}</h3>
                      <p className="mt-1 text-sm text-muted">
                        Includes: {t.codes.join(' → ')}
                      </p>
                    </div>
                    <ButtonLink to={`/contact?topic=track&code=${t.id}`} size="sm" variant="outline">
                      Enquire for Track
                    </ButtonLink>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hardware Kit packages */}
          {kits.length > 0 && (
            <section>
              <h2 className="text-[24px] font-bold text-ink">Hardware Board Options</h2>
              <p className="mt-1.5 text-muted">Pre-tested board packages set up for this course's laboratory exercises.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {kits.map((k) => (
                  <div key={k.id} className="flex flex-col rounded-xl border border-line bg-white p-5 shadow-2xs">
                    <h3 className="text-[17px] font-bold text-ink">{k.name}</h3>
                    <p className="mt-1 text-[14.5px] text-muted flex-1">{k.includes}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                      <span className="text-xs font-semibold text-muted">Target: {k.board}</span>
                      <ButtonLink to="/kits" size="sm" variant="outline">View Kit Details</ButtonLink>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Enquiry-based Sidebar (No price tags, replaced with Enquire Now & Talk to Advisor) */}
        <aside className="lg:-mt-48">
          <div className="sticky top-24 rounded-2xl border border-line bg-white p-6 shadow-[0_20px_50px_-24px_rgba(10,35,80,.25)]">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-honey/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-warn">
              Admissions & Enquiries
            </div>
            <h3 className="mt-3 font-display text-[22px] font-bold text-ink">
              Interested in this course?
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              Speak with our domain advisors to get the complete syllabus, upcoming batch schedules, and fee assistance.
            </p>

            <div className="mt-6 grid gap-2.5">
              <ButtonLink
                to={`/contact?course=${encodeURIComponent(course.code)}`}
                size="lg"
                className="w-full text-center font-semibold shadow-xs"
              >
                Enquire Now
              </ButtonLink>
              <ButtonLink
                to="/contact"
                size="lg"
                variant="outline"
                className="w-full text-center font-semibold"
              >
                Talk to an Advisor
              </ButtonLink>
            </div>

            <ul className="mt-6 space-y-2.5 border-t border-line pt-5 text-[14.5px]">
              {[
                'Instructor-led live sessions',
                'Weekly hands-on labs & lab access',
                '1-on-1 mentor code & design reviews',
                'Graded capstone project',
                'QBeeMind certificate on completion',
              ].map((x) => (
                <li key={x} className="flex gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-ok" aria-hidden />
                  <span className="text-ink">{x}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl bg-mist p-3.5 text-xs text-muted leading-relaxed">
              Batches run weekday evenings or weekends. Self-paced mode with live doubt sessions also available.
            </div>
          </div>
        </aside>
      </Container>

      {/* Related courses */}
      <section className="border-t border-line bg-mist py-14">
        <Container>
          <h2 className="text-[24px] font-bold text-ink">More {DOMAINS[course.domain].name} courses</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <CourseCard key={c.code} course={c} />
            ))}
          </div>
        </Container>
      </section>

      {/* Mobile sticky enquiry bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-line bg-white px-4 py-3 shadow-lg lg:hidden">
        <div className="min-w-0 flex-1">
          <Code domain={course.domain}>{course.code}</Code>
          <p className="mt-0.5 font-sans text-sm font-bold text-ink truncate">{course.title}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <ButtonLink to="/contact" variant="outline" size="sm">
            Ask
          </ButtonLink>
          <ButtonLink to={`/contact?course=${encodeURIComponent(course.code)}`} size="sm">
            Enquire Now
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
