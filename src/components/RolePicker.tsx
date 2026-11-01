import { CheckCircle2 } from 'lucide-react';
import { ButtonLink } from './ui';
import { StudentEnquiryForm } from './StudentEnquiryForm';

export function RolePicker() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_minmax(0,480px)] lg:items-center lg:gap-14">
      {/* Left side – Company introduction */}
      <div className="flex flex-col">
        <div className="inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-honey ring-1 ring-white/15">
          Industry-Aligned Engineering Programs
        </div>

        <h1 className="mt-5 font-display text-[36px] font-extrabold leading-[1.08] text-white sm:text-[48px] lg:text-[54px] tracking-tight">
          Pick the job you want. We'll show you the path.
        </h1>

        <p className="mt-5 text-[17px] leading-relaxed text-white/80 sm:text-[18px]">
          Project-based professional training in VLSI, Embedded Systems, and Edge AI. Learn industry-relevant skills through practical labs, guided projects, and expert mentorship.
        </p>

        {/* Feature Highlights */}
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5 text-sm font-medium text-white/85">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-honey" /> Hands-on Hardware & EDA Labs
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-honey" /> Graded Capstone Projects
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-honey" /> 1-on-1 Mentorship & Placement Support
          </span>
        </div>

        {/* Two CTA buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-3.5">
          <ButtonLink
            to="/courses"
            size="lg"
            className="bg-honey text-ink hover:bg-honey-deep font-semibold shadow-xs transition-colors"
          >
            Explore Programs
          </ButtonLink>
          <ButtonLink
            to="/contact"
            variant="outline"
            size="lg"
            className="border-white/35 text-white hover:bg-white/10 font-semibold"
          >
            Talk to an Advisor
          </ButtonLink>
        </div>
      </div>

      {/* Right side – Student enquiry form */}
      <div className="w-full">
        <StudentEnquiryForm />
      </div>
    </div>
  );
}
