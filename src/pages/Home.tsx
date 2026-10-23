import { Link } from 'react-router-dom';
import { CalendarClock, Cpu, FlaskConical, GraduationCap, Hammer, Presentation } from 'lucide-react';
import { RolePicker } from '../components/RolePicker';
import { ButtonLink, Container, Section, SectionHead, cx, domainBg, domainText } from '../components/ui';
import { AUDIENCES, BATCH_FORMATS, COURSES, DOMAINS, KITS, OUTCOMES_NOTE, PROGRAMMES, SERVICES, type Domain } from '../data/catalog';
import { inr } from '../lib/pricing';
import { Faq } from '../components/Faq';

const INCLUDED = [
  { icon: Presentation, title: 'Instructor-led sessions', body: 'Live classes in weekday-evening, weekend or self-paced + mentoring batches.' },
  { icon: FlaskConical, title: 'Hands-on labs', body: 'Weekly labs with lab access and mentor support for the full course.' },
  { icon: Hammer, title: 'A graded capstone', body: 'Every course ends in a project you can show and explain in an interview.' },
  { icon: GraduationCap, title: 'QBeeMind certificate', body: 'Awarded on completing the course and its project. Tracks add a consolidated certificate.' },
];

const STEPS = [
  { title: 'Enrol and pick a batch', body: 'Choose a course, track or bundle, and the batch format that fits your week. Pay in full or 60/40.' },
  { title: 'Learn live, build every week', body: 'Instructor-led sessions with a hands-on lab each week, on the tools teams actually use.' },
  { title: 'Ship the capstone', body: 'Design, debug and document a real deliverable — reviewed and graded by a mentor.' },
  { title: 'Get certified and interview-ready', body: 'Certificate, a portfolio project, resume help, mock interviews and domain interview prep.' },
];

export default function Home() {
  return (
    <>
      <section className="bg-ink py-12 sm:py-16 lg:py-20">
        <Container>
          <RolePicker />
        </Container>
      </section>

      <section className="border-b border-line bg-white">
        <Container className="grid gap-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {INCLUDED.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-3">
              <Icon className="mt-0.5 h-6 w-6 shrink-0 text-blue" aria-hidden />
              <div>
                <h3 className="font-sans text-[16px] font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-[15px] text-muted">{body}</p>
              </div>
            </div>
          ))}
        </Container>
      </section>

      <Section>
        <SectionHead
          title="Three domains, eighteen courses"
          intro="Take one course, a role-focused track, or a whole domain. Every course is ₹15,000 on its own."
          action={<ButtonLink to="/courses" variant="outline">Browse all courses</ButtonLink>}
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {(Object.keys(DOMAINS) as Domain[]).map((d) => (
            <div key={d} className="flex flex-col rounded-xl border border-line">
              <div className={cx('rounded-t-xl px-6 py-5 text-white', domainBg[d])}>
                <h3 className="text-[22px] font-bold text-white">{DOMAINS[d].name}</h3>
                <p className="mt-1 text-sm text-white/85">{DOMAINS[d].series}, 6 courses</p>
              </div>
              <div className="flex flex-1 flex-col px-6 py-5">
                <p className="text-[15px] text-muted">{DOMAINS[d].blurb}</p>
                <ul className="mt-5 divide-y divide-line border-y border-line">
                  {COURSES.filter((c) => c.domain === d).map((c) => (
                    <li key={c.code}>
                      <Link to={`/courses/${c.slug}`} className="flex items-baseline gap-3 py-2.5 hover:bg-mist">
                        <span className={cx('w-[74px] shrink-0 font-mono text-[12px] font-semibold', domainText[d])}>{c.code}</span>
                        <span className="text-[15px] leading-snug text-text">{c.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link to={`/courses?domain=${d}`} className={cx('mt-5 text-[15px] font-semibold hover:underline', domainText[d])}>
                  See {DOMAINS[d].name} courses and tracks
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="mist">
        <SectionHead title="The more you build, the less you pay" intro="Bundle prices apply when you enrol in one payment or an agreed instalment plan." action={<ButtonLink to="/programs" variant="outline">Compare all programs</ButtonLink>} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PROGRAMMES.map((p) => {
            const featured = p.id === 'all-access';
            return (
              <div key={p.id} className={cx('flex flex-col rounded-xl p-6', featured ? 'bg-ink text-white' : 'border border-line bg-white')}>
                <h3 className={cx('text-[19px] font-bold', featured && 'text-white')}>{p.name}</h3>
                <p className={cx('mt-2 text-[15px]', featured ? 'text-white/75' : 'text-muted')}>{p.includes}</p>
                <div className="mt-auto pt-6">
                  {p.standard > p.price && <p className={cx('text-sm line-through', featured ? 'text-white/50' : 'text-muted')}>{inr(p.standard)}</p>}
                  <p className={cx('font-display text-[30px] font-extrabold', featured ? 'text-honey' : 'text-ink')}>{inr(p.price)}</p>
                  {p.standard > p.price && <p className={cx('text-sm font-medium', featured ? 'text-white/80' : 'text-ok')}>Save {inr(p.standard - p.price)}</p>}
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-5 text-[15px] text-muted">
          Building your own set? Any 2 courses are 10% off, any 3 are 15% off, any 4–5 are 20% off. <Link to="/programs#build" className="font-semibold text-blue hover:underline">Try the calculator</Link>
        </p>
      </Section>

      <Section>
        <SectionHead title="How a course runs" />
        <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="border-t-2 border-ink pt-5">
              <span className="font-display text-[15px] font-bold text-blue">Step {i + 1}</span>
              <h3 className="mt-2 text-[19px] font-bold">{s.title}</h3>
              <p className="mt-2 text-[15px] text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="ink">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-[30px] font-bold text-white sm:text-[38px]">Built for placement, by design</h2>
            <p className="mt-4 text-[17px] text-white/75">
              Every course produces a project you can show in an interview. Learning paths map to real job roles. Internships turn coursework into work experience, and career support is built in.
            </p>
            <p className="mt-6 border-l-2 border-honey pl-4 text-[15px] text-white/70">{OUTCOMES_NOTE}</p>
            <ButtonLink to="/placements" variant="light" className="mt-8">How we prepare you for hiring</ButtonLink>
          </div>
          <div className="overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10">
            <table className="w-full text-left text-[15px]">
              <thead>
                <tr className="text-sm text-white/60">
                  <th className="px-5 py-3 font-medium">Course or track</th>
                  <th className="px-5 py-3 font-medium">Prepares you for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[
                  ['VLSI-101 (+ 102)', 'RTL Design, Design Verification'],
                  ['VLSI-103 + 104', 'Physical Design, STA / Timing'],
                  ['VLSI-105', 'FPGA Design / Prototyping'],
                  ['EMB-101 → 102 → 103', 'Embedded Firmware / Software'],
                  ['EMB-105', 'Embedded Linux / BSP / Driver'],
                  ['EDGE-102 → 103 → 104', 'Edge AI / TinyML / ML'],
                  ['EDGE-106', 'Edge Computer Vision'],
                ].map(([a, b]) => (
                  <tr key={a}>
                    <td className="px-5 py-3 font-mono text-[13px] font-semibold text-honey">{a}</td>
                    <td className="px-5 py-3 text-white/90">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-blue">
              <Cpu className="h-5 w-5" aria-hidden />
              <span className="text-sm font-semibold">Course + board packages</span>
            </div>
            <h2 className="mt-3 text-[28px] font-bold sm:text-[32px]">Bring a design up on real hardware</h2>
            <p className="mt-3 text-[17px] text-muted">
              Candidates who have made a real board work stand out against those who have only simulated. Boards are tested and set up for the course labs before dispatch, and they're yours to keep.
            </p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {KITS.filter((k) => ['fpga-essentials', 'mcu-starter', 'tinyml-kit', 'accelerator-kit'].includes(k.id)).map((k) => (
                <li key={k.id} className="flex items-center justify-between gap-4 py-3">
                  <span>
                    <span className="block font-semibold text-ink">{k.name}</span>
                    <span className="block text-sm text-muted">{k.board}</span>
                  </span>
                  <span className="font-display text-[17px] font-bold text-ink">{inr(k.price)}</span>
                </li>
              ))}
            </ul>
            <ButtonLink to="/kits" variant="outline" className="mt-6">See all 12 packages</ButtonLink>
          </div>

          <div>
            <div className="flex items-center gap-2 text-blue">
              <Hammer className="h-5 w-5" aria-hidden />
              <span className="text-sm font-semibold">Apply directly — no full course needed</span>
            </div>
            <h2 className="mt-3 text-[28px] font-bold sm:text-[32px]">Build it, extend it, publish it</h2>
            <p className="mt-3 text-[17px] text-muted">Open to students from any college. Take a guided project, an internship, or paper-writing support on its own or alongside a course.</p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {SERVICES.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-4 py-3">
                  <span className="font-semibold text-ink">{s.name}</span>
                  <span className="font-display text-[17px] font-bold text-ink">{inr(s.price)}</span>
                </li>
              ))}
            </ul>
            <ButtonLink to="/internships" variant="outline" className="mt-6">Projects and internships</ButtonLink>
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-[28px] font-bold sm:text-[32px]">Who we work with</h2>
            <ul className="mt-6 space-y-4">
              {AUDIENCES.map((a) => (
                <li key={a.title}>
                  <h3 className="font-sans text-[16px] font-semibold text-ink">{a.title}</h3>
                  <p className="text-[15px] text-muted">{a.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 text-blue">
              <CalendarClock className="h-5 w-5" aria-hidden />
              <span className="text-sm font-semibold">Batch formats</span>
            </div>
            <h2 className="mt-3 text-[28px] font-bold sm:text-[32px]">Fits around college or work</h2>
            <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white">
              {BATCH_FORMATS.map((b) => (
                <div key={b.name} className="grid gap-1 border-b border-line px-5 py-4 last:border-0 sm:grid-cols-[180px_1fr]">
                  <span className="font-semibold text-ink">{b.name}</span>
                  <span className="text-[15px] text-muted">
                    {b.timing}. <span className="text-text">Best for {b.bestFor.toLowerCase()}.</span>
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted">Upcoming batch start dates are shared on enrolment.</p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHead title="Questions students ask" />
        <Faq />
      </Section>

      <section className="bg-honey">
        <Container className="flex flex-col items-start gap-6 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[26px] font-bold sm:text-[30px]">Not sure where to start?</h2>
            <p className="mt-2 text-[17px] text-ink/80">Tell an advisor your background and target role. We'll suggest a path and a batch.</p>
          </div>
          <ButtonLink to="/contact" variant="dark" size="lg">Talk to an advisor</ButtonLink>
        </Container>
      </section>
    </>
  );
}
