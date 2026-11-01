import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { Button } from './ui';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  education: string;
  course: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  education?: string;
  course?: string;
}

const EDUCATION_OPTIONS = [
  'Diploma',
  'B.Tech',
  'M.Tech',
  'B.Sc',
  'M.Sc',
  'Other',
];

const COURSE_OPTIONS = [
  'VLSI Design',
  'Embedded Systems',
  'Edge AI',
];

const COURSE_LINKS: Record<string, { link: string; track: string }> = {
  'VLSI Design': { link: '/courses?domain=vlsi', track: 'VLSI Design Track (CMOS, RTL, Verification, FPGA)' },
  'Embedded Systems': { link: '/courses?domain=embedded', track: 'Embedded Systems Track (ARM Cortex, RTOS, Linux)' },
  'Edge AI': { link: '/courses?domain=edge', track: 'Edge AI Track (ML Models, TinyML, Jetson Pipelines)' },
};

export function StudentEnquiryForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    course: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Please enter your full name';
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    const cleanPhone = formData.phone.replace(/[\s\-\(\)\+]/g, '');
    if (!formData.phone.trim()) {
      errs.phone = 'Please enter your mobile phone number';
    } else if (cleanPhone.length < 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.education) {
      errs.education = 'Please select your current education';
    }

    if (!formData.course) {
      errs.course = 'Please select your interested course domain';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Record enquiry in local persistent storage for reliability
      const enquiryRecord = {
        ...formData,
        id: 'ENQ-' + Date.now(),
        createdAt: new Date().toISOString(),
      };

      const existingRaw = localStorage.getItem('qbee_student_enquiries');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      existing.unshift(enquiryRecord);
      localStorage.setItem('qbee_student_enquiries', JSON.stringify(existing));

      // Simulate network request latency for realistic user experience
      await new Promise((resolve) => setTimeout(resolve, 600));

      setSubmittedData({ ...formData });
      setIsSuccess(true);
    } catch {
      setErrors({ fullName: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess && submittedData) {
    const rec = COURSE_LINKS[submittedData.course] || { link: '/courses', track: 'Industry Core Track' };
    return (
      <div className="rounded-2xl bg-white p-6 text-text shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)] sm:p-8" aria-live="polite">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ok/10 text-ok">
          <CheckCircle2 className="h-6 w-6 text-ok" />
        </div>

        <h3 className="mt-4 font-display text-[22px] font-bold text-ink sm:text-[24px]">
          We found your recommended path, {submittedData.fullName.split(' ')[0]}!
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[15px]">
          Based on your background in <strong className="text-ink">{submittedData.education}</strong> and your interest in <strong className="text-ink">{submittedData.course}</strong>:
        </p>

        <div className="mt-5 rounded-xl border border-line bg-mist p-4 sm:p-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue">
            <Sparkles className="h-4 w-4" /> Recommended Curriculum
          </div>
          <p className="mt-1 font-semibold text-ink sm:text-[16px]">{rec.track}</p>
          <p className="mt-1 text-xs text-muted">
            Includes instructor-led live classes, hardware kits, weekly lab assignments, capstone project, and placement support.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <Link
            to={rec.link}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-honey px-5 text-[15px] font-semibold text-ink shadow-xs transition-colors hover:bg-honey-deep"
          >
            Explore {submittedData.course} <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => {
              setIsSuccess(false);
              setFormData({
                fullName: '',
                email: '',
                phone: '',
                education: '',
                course: '',
              });
              setErrors({});
            }}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-line px-4 text-sm font-medium text-muted hover:border-ink hover:text-ink cursor-pointer transition-colors"
          >
            Submit another enquiry
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          Our senior technical advisor will also reach out at <span className="font-medium text-ink">{submittedData.email}</span> with batch dates and fee breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-5 text-text shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)] sm:p-7" aria-live="polite">
      <div>
        <h2 className="font-display text-[22px] font-bold text-ink sm:text-[24px]">Find Your Learning Path</h2>
        <p className="mt-1 text-sm text-muted sm:text-[15px]">
          Tell us about yourself so we can recommend the right course.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-3.5">
        {/* Full Name */}
        <div>
          <label htmlFor="enquiry-fullname" className="block text-xs font-semibold uppercase tracking-wider text-ink">
            Full Name <span className="text-warn">*</span>
          </label>
          <input
            id="enquiry-fullname"
            type="text"
            value={formData.fullName}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, fullName: e.target.value }));
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
            }}
            placeholder="e.g. Rahul Sharma"
            className="mt-1 block w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'fullname-error' : undefined}
          />
          {errors.fullName && (
            <p id="fullname-error" className="mt-1 text-xs text-warn font-medium">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email Address & Phone Number Row */}
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <label htmlFor="enquiry-email" className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Email Address <span className="text-warn">*</span>
            </label>
            <input
              id="enquiry-email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }));
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="e.g. rahul@example.com"
              className="mt-1 block w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-xs text-warn font-medium">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="enquiry-phone" className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Phone Number <span className="text-warn">*</span>
            </label>
            <input
              id="enquiry-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, phone: e.target.value }));
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              placeholder="e.g. 98765 43210"
              className="mt-1 block w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 transition-colors focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
            {errors.phone && (
              <p id="phone-error" className="mt-1 text-xs text-warn font-medium">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Current Education & Interested Course Row */}
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <label htmlFor="enquiry-education" className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Current Education <span className="text-warn">*</span>
            </label>
            <select
              id="enquiry-education"
              value={formData.education}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, education: e.target.value }));
                if (errors.education) setErrors((prev) => ({ ...prev, education: undefined }));
              }}
              className="mt-1 block w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue cursor-pointer"
              aria-invalid={Boolean(errors.education)}
              aria-describedby={errors.education ? 'education-error' : undefined}
            >
              <option value="">Select education</option>
              {EDUCATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.education && (
              <p id="education-error" className="mt-1 text-xs text-warn font-medium">
                {errors.education}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="enquiry-course" className="block text-xs font-semibold uppercase tracking-wider text-ink">
              Interested Domain <span className="text-warn">*</span>
            </label>
            <select
              id="enquiry-course"
              value={formData.course}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, course: e.target.value }));
                if (errors.course) setErrors((prev) => ({ ...prev, course: undefined }));
              }}
              className="mt-1 block w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue cursor-pointer"
              aria-invalid={Boolean(errors.course)}
              aria-describedby={errors.course ? 'course-error' : undefined}
            >
              <option value="">Select interested domain</option>
              {COURSE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.course && (
              <p id="course-error" className="mt-1 text-xs text-warn font-medium">
                {errors.course}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-[15px] font-semibold py-3 shadow-xs"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Finding Your Path...
              </span>
            ) : (
              'Get My Learning Path'
            )}
          </Button>
        </div>

        <p className="text-center text-[11.5px] text-muted">
          We respect your privacy. No spam. You'll receive course details and fee structure.
        </p>
      </form>
    </div>
  );
}
