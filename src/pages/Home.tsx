import { Link } from 'react-router-dom';
import {
  ArrowRight,
  FlaskConical,
  GraduationCap,
  Hammer,
  Presentation,
  Quote,
} from 'lucide-react';
import { RolePicker } from '../components/RolePicker';
import { ButtonLink, Container, Section, SectionHead } from '../components/ui';
import { Faq } from '../components/Faq';

const INCLUDED = [
  {
    icon: Presentation,
    title: 'Instructor-Led Sessions',
    body: 'Live interactive classes in weekday-evening and weekend batches led by senior industry engineers.',
  },
  {
    icon: FlaskConical,
    title: 'Hands-On Hardware Labs',
    body: 'Weekly labs using real development boards, logic analyzers, and industry-standard EDA tools.',
  },
  {
    icon: Hammer,
    title: 'Graded Capstone Projects',
    body: 'Every program culminates in a complete, verified project deliverable you can explain in an interview.',
  },
  {
    icon: GraduationCap,
    title: 'QBeeMind Certification',
    body: 'Awarded upon course completion and capstone evaluation, recognized across partnering institutions.',
  },
];

const STEPS = [
  {
    title: 'Select Domain & Format',
    body: 'Choose your focus in VLSI, Embedded, or Edge AI with batch schedules that fit around college or work.',
  },
  {
    title: 'Learn Live & Build Weekly',
    body: 'Attend live classes and implement hands-on labs each week on the tools engineering teams actually use.',
  },
  {
    title: 'Ship the Capstone Project',
    body: 'Design, simulate, debug, and document a real hardware or AI system — evaluated by experienced mentors.',
  },
  {
    title: 'Interview & Placement Prep',
    body: 'Receive portfolio guidance, resume refinement, mock interview drills, and targeted hiring opportunities.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'The SystemVerilog and UVM verification training gave me the exact technical edge I needed. In my interviews, I could walk through my testbench architecture, constrained-random sequences, and functional coverage models with complete confidence.',
    name: 'Rohan V.',
    role: 'Design Verification Trainee',
    domain: 'VLSI Design',
  },
  {
    quote:
      'Writing bare-metal drivers on an STM32 board and debugging CAN bus traffic with a logic analyzer completely transformed my understanding. QBee’s focus on real hardware rather than just theoretical slides made all the difference.',
    name: 'Ananya K.',
    role: 'Embedded Firmware Engineer',
    domain: 'Embedded Systems',
  },
  {
    quote:
      'Optimizing deep learning models with TinyML and deploying them directly onto an MCU was incredible. The practical capstone project became the centerpiece of my resume that interviewers focused on.',
    name: 'Siddharth M.',
    role: 'Edge AI & Systems Engineer',
    domain: 'Edge AI',
  },
];

export default function Home() {
  return (
    <>
      {/* 2. Simplified Hero Section with company introduction and student enquiry form */}
      <section className="border-b border-white/10 bg-ink py-12 sm:py-16 lg:py-20">
        <Container>
          <RolePicker />
        </Container>
      </section>

      {/* 3. Three-Domain Overview (VLSI, Embedded Systems, Edge AI) */}
      <Section>
        <SectionHead
          title="Explore Our Learning Domains"
          intro="Structured, industry-aligned learning tracks designed to take you from foundational concepts to working silicon, firmware, and edge models."
          action={
            <ButtonLink to="/courses" variant="outline">
              Browse All Courses
            </ButtonLink>
          }
        />
        <div className="grid gap-8 md:grid-cols-3">
          {/* Card 1: VLSI Design */}
          <div className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <div className="aspect-[16/10] w-full overflow-hidden bg-ink">
              <img
                src="/assets/courses/vlsi/vlsi-101.webp"
                alt="VLSI Design - Digital Logic & Silicon Layout"
                className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-blue/10 px-2.5 py-0.5 text-xs font-semibold text-blue">
                  Semiconductor Track
                </span>
              </div>
              <h3 className="mt-3 font-display text-[22px] font-bold text-ink">
                VLSI Design
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                Learn digital design, RTL development, functional verification, ASIC physical design, and FPGA prototyping through practical engineering training.
              </p>
              <div className="mt-6 pt-4 border-t border-line">
                <Link
                  to="/courses?domain=vlsi"
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue hover:text-blue/80 transition-colors"
                >
                  Explore VLSI Programs <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Embedded Systems */}
          <div className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <div className="aspect-[16/10] w-full overflow-hidden bg-ink">
              <img
                src="/assets/courses/embedded/emb-101.webp"
                alt="Embedded Systems - ARM Microcontroller & Firmware"
                className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  Firmware & Hardware
                </span>
              </div>
              <h3 className="mt-3 font-display text-[22px] font-bold text-ink">
                Embedded Systems
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                Develop practical skills in Embedded C, ARM Cortex-M microcontrollers, RTOS, embedded Linux, and hardware communication protocols.
              </p>
              <div className="mt-6 pt-4 border-t border-line">
                <Link
                  to="/courses?domain=embedded"
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  Explore Embedded Programs <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3: Edge AI */}
          <div className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <div className="aspect-[16/10] w-full overflow-hidden bg-ink">
              <img
                src="/assets/courses/edge-ai/edge-101.webp"
                alt="Edge AI - Neural Networks & Computer Vision"
                className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                  AI & Embedded Intelligence
                </span>
              </div>
              <h3 className="mt-3 font-display text-[22px] font-bold text-ink">
                Edge AI
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                Explore machine learning, deep learning, TinyML, model optimization, and computer vision for intelligent edge devices.
              </p>
              <div className="mt-6 pt-4 border-t border-line">
                <Link
                  to="/courses?domain=edge"
                  className="inline-flex items-center gap-2 text-sm font-bold text-purple-700 hover:text-purple-800 transition-colors"
                >
                  Explore Edge AI Programs <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 4. Why Choose QBee Online? (About section) */}
      <section id="about" className="scroll-mt-20">
        <Section tone="mist">
          <SectionHead
            title="Why Choose QBee Online?"
            intro="Designed by practicing engineers to bridge the gap between academic theory and real semiconductor and embedded systems industry expectations."
          />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INCLUDED.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex flex-col rounded-xl border border-line bg-white p-6 shadow-xs"
            >
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-blue/10 text-blue">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mt-4 font-sans text-[17px] font-semibold text-ink">
                {title}
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
                {body}
              </p>
            </div>
          ))}
        </div>

        {/* Learning Workflow Steps */}
        <div className="mt-14 rounded-2xl border border-line bg-white p-8 lg:p-10">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-blue">
              How Our Programs Work
            </span>
            <h3 className="mt-1 font-display text-[24px] font-bold text-ink sm:text-[28px]">
              A Rigorous, Structured Learning Progression
            </h3>
          </div>
          <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative border-t-2 border-ink pt-5">
                <span className="font-display text-[15px] font-bold text-blue">
                  Step {i + 1}
                </span>
                <h4 className="mt-2 text-[18px] font-bold text-ink">{s.title}</h4>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Section>
    </section>

    {/* Student Testimonials or Success Stories */}
      <Section>
        <SectionHead
          title="Student Success Stories"
          intro="Hear from engineering graduates and working professionals who built practical competence and advanced their careers with QBee Online."
        />
        <div className="grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col justify-between rounded-2xl border border-line bg-white p-7 shadow-xs"
            >
              <div>
                <Quote className="h-7 w-7 text-honey" />
                <p className="mt-4 text-[15px] leading-relaxed text-text">
                  “{t.quote}”
                </p>
              </div>
              <div className="mt-6 border-t border-line pt-4">
                <p className="font-display font-bold text-ink">{t.name}</p>
                <p className="text-xs font-medium text-muted">{t.role}</p>
                <span className="mt-1 inline-block text-[11px] font-semibold text-blue">
                  {t.domain}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Questions section */}
      <Section tone="mist">
        <SectionHead title="Questions Students Ask" />
        <Faq />
      </Section>

      {/* 8. Final Student Enquiry / Counselling CTA */}
      <section className="bg-honey text-ink">
        <Container className="flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-[28px] font-extrabold sm:text-[34px] leading-tight">
              Ready to Build Your Engineering Career?
            </h2>
            <p className="mt-2 text-[17px] text-ink/85">
              Speak with a technical advisor to review your background, choose the best learning path, and get upcoming batch schedules.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink to="/contact" variant="dark" size="lg" className="font-semibold shadow-xs">
              Talk to an Advisor
            </ButtonLink>
            <ButtonLink
              to="/courses"
              variant="outline"
              size="lg"
              className="border-ink/30 bg-transparent text-ink hover:bg-ink/10 font-semibold"
            >
              Explore All Courses
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
