import { Briefcase, Building2, Cpu, GraduationCap, Users } from 'lucide-react';
import { ButtonLink, PageHeader, Section } from '../components/ui';

export default function Companies() {
  return (
    <>
      <PageHeader
        title="Corporate Training & Talent Solutions"
        intro="Upskill your engineering workforce or hire pre-trained, job-ready talent in VLSI, Embedded Systems, and Edge AI."
        crumbs={[{ to: '/', label: 'Home' }, { to: '/companies', label: 'For Companies' }]}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to="/contact?topic=corporate" size="lg">
            Discuss Corporate Training
          </ButtonLink>
          <ButtonLink to="/contact?topic=hiring" variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10">
            Hire Trained Engineers
          </ButtonLink>
        </div>
      </PageHeader>

      <Section>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col rounded-xl border border-line p-7 bg-white">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-blue/10 text-blue">
              <Users className="h-6 w-6" aria-hidden />
            </div>
            <h2 className="mt-5 text-[20px] font-bold text-ink">Custom Corporate Upskilling</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              Tailored training bootcamps for fresh recruits or lateral hires in Verilog/SystemVerilog, UVM verification, ARM Cortex firmware, FreeRTOS, and Edge AI models.
            </p>
          </div>

          <div className="flex flex-col rounded-xl border border-line p-7 bg-white">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-honey/20 text-warn">
              <Briefcase className="h-6 w-6" aria-hidden />
            </div>
            <h2 className="mt-5 text-[20px] font-bold text-ink">Hire Pre-Trained Talent</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              Access pre-assessed engineering graduates who have built verified capstone projects, debugged real hardware boards, and completed extensive domain-specific labs.
            </p>
          </div>

          <div className="flex flex-col rounded-xl border border-line p-7 bg-white">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-ok/10 text-ok">
              <Cpu className="h-6 w-6" aria-hidden />
            </div>
            <h2 className="mt-5 text-[20px] font-bold text-ink">Lab & Infrastructure Support</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              Access dedicated EDA workflows, FPGA synthesis targets, STM32 development boards, and Edge AI acceleration kits for proof-of-concept projects.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-[28px] font-bold text-ink sm:text-[34px]">Trained on Real Hardware & Tools</h2>
            <p className="mt-4 text-[16px] leading-relaxed text-muted">
              Our engineers don't just study theoretical slides. They implement synthesizable RTL, verify APB/AHB peripherals with UVM, develop interrupt-driven Cortex-M drivers, measure CAN bus signals with logic analyzers, and deploy TinyML models to microcontrollers.
            </p>
            <div className="mt-6 space-y-3">
              {[
                'Verilog, SystemVerilog, UVM 1.2, Synopsys/Cadence flow awareness',
                'Embedded C, ARM Cortex-M, STM32Cube, FreeRTOS, CAN Bus',
                'Embedded Linux, Device Drivers, Kernel Modules',
                'TensorFlow Lite, ONNX, TinyML, NVIDIA Jetson pipelines',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-[15px] text-ink font-medium">
                  <div className="h-2 w-2 rounded-full bg-honey" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <ButtonLink to="/contact?topic=corporate">Partner With Us</ButtonLink>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white p-7 shadow-xs">
            <h3 className="font-display text-[22px] font-bold text-ink">Why Partner with QBee?</h3>
            <ul className="mt-5 space-y-4 text-[15px]">
              <li className="flex gap-3">
                <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-blue" />
                <div>
                  <span className="font-semibold text-ink">Zero Placement Fee: </span>
                  <span className="text-muted">Hire skilled talent directly without recruiter commissions or lock-in periods.</span>
                </div>
              </li>
              <li className="flex gap-3">
                <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-blue" />
                <div>
                  <span className="font-semibold text-ink">Zero Ramp-up Time: </span>
                  <span className="text-muted">Candidates know industry coding guidelines, git workflows, and standard tools on day one.</span>
                </div>
              </li>
              <li className="flex gap-3">
                <Cpu className="mt-0.5 h-5 w-5 shrink-0 text-blue" />
                <div>
                  <span className="font-semibold text-ink">Custom Assessment Tests: </span>
                  <span className="text-muted">We conduct tailored screening rounds to match your exact job requirements.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
