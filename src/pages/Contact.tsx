import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { CONTACT, COURSES } from '../data/catalog';
import { Button, PageHeader, Placeholder, Section } from '../components/ui';

const field = 'mt-1.5 h-11 w-full rounded-lg border border-line px-3 text-[15px]';

export default function Contact() {
  const [params] = useSearchParams();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const phone = String(f.get('phone') ?? '').replace(/\D/g, '');
    if (phone.length < 10) {
      setError('Enter a 10-digit mobile number so an advisor can call you back.');
      return;
    }
    setError('');
    // TODO(backend): POST this lead to the CRM / email endpoint.
    setSent(true);
  };

  return (
    <>
      <PageHeader
        title="Talk to an advisor"
        intro="Ask about courses, batch schedules, instalments, or a university or corporate partnership. Tell us a little about yourself and we'll call you back."
        crumbs={[{ to: '/', label: 'Home' }, { to: '/contact', label: 'Contact' }]}
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          {sent ? (
            <div className="rounded-xl border border-line p-8" role="status">
              <CheckCircle2 className="h-10 w-10 text-ok" aria-hidden />
              <h2 className="mt-4 text-[26px] font-bold">Request sent</h2>
              <p className="mt-2 text-[17px] text-muted">An advisor will call you back on the number you gave. Batch start dates and the exact refund cut-off are shared at that point.</p>
              <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>Send another request</Button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2" noValidate={false}>
              <label className="text-sm font-medium text-ink">
                Full name
                <input name="name" required autoComplete="name" className={field} />
              </label>
              <label className="text-sm font-medium text-ink">
                Email
                <input name="email" type="email" required autoComplete="email" className={field} />
              </label>
              <label className="text-sm font-medium text-ink">
                Mobile number
                <input name="phone" type="tel" required autoComplete="tel" inputMode="numeric" className={field} aria-describedby={error ? 'phone-err' : undefined} />
              </label>
              <label className="text-sm font-medium text-ink">
                I am a
                <select name="who" className={field + ' bg-white'} defaultValue={params.get('topic') === 'partnership' ? 'Institution' : 'Graduate'}>
                  <option>Graduate</option>
                  <option>Final-year student</option>
                  <option>Post-graduate</option>
                  <option>Working professional</option>
                  <option>Institution</option>
                </select>
              </label>
              <label className="text-sm font-medium text-ink sm:col-span-2">
                Interested in
                <select name="interest" className={field + ' bg-white'} defaultValue="">
                  <option value="">Not sure yet — help me choose</option>
                  <optgroup label="Programs">
                    <option>All-Access Career Program</option>
                    <option>A complete domain track</option>
                    <option>Guided project / internship</option>
                    <option>University or corporate partnership</option>
                  </optgroup>
                  <optgroup label="Courses">
                    {COURSES.map((c) => (
                      <option key={c.code}>{c.code} — {c.title}</option>
                    ))}
                  </optgroup>
                </select>
              </label>
              <label className="text-sm font-medium text-ink sm:col-span-2">
                Message <span className="font-normal text-muted">(optional)</span>
                <textarea name="message" rows={4} className="mt-1.5 w-full rounded-lg border border-line px-3 py-2 text-[15px]" placeholder="Your background, target role, or questions" />
              </label>
              {error && (
                <p id="phone-err" className="text-sm font-medium text-edge sm:col-span-2" role="alert">{error}</p>
              )}
              <div className="sm:col-span-2">
                <Button type="submit" size="lg">Request a call back</Button>
              </div>
            </form>
          )}

          <aside className="space-y-5">
            <h2 className="text-[20px] font-bold">Reach us directly</h2>
            <p className="flex gap-3"><Mail className="h-5 w-5 text-blue" aria-hidden /> <Placeholder>{CONTACT.email}</Placeholder></p>
            <p className="flex gap-3"><Phone className="h-5 w-5 text-blue" aria-hidden /> <Placeholder>{CONTACT.phone}</Placeholder></p>
            <p className="flex gap-3"><MapPin className="h-5 w-5 text-blue" aria-hidden /> <Placeholder>{CONTACT.city}</Placeholder></p>
            <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-blue hover:underline">
              <MessageCircle className="h-5 w-5" aria-hidden /> Chat on WhatsApp
            </a>
          </aside>
        </div>
      </Section>
    </>
  );
}
