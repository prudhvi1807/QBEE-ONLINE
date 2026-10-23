import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { CONTACT } from '../data/catalog';
import { ButtonLink, Container, Placeholder } from './ui';
import { Logo } from './Header';

export function Footer() {
  return (
    <footer className="bg-ink text-white/75 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 -z-0 h-64 w-64 rounded-full bg-blue/10 blur-3xl pointer-events-none" />

      <Container className="relative z-10 py-12 lg:py-16">
        {/* Top Section: Company Statement & CTA */}
        <div className="flex flex-col gap-6 pb-12 border-b border-white/10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Building the next generation of engineers.
            </h2>
            <p className="mt-2 text-base text-white/70 sm:text-lg">
              Practical, project-based learning in VLSI, Embedded Systems, and Edge AI.
            </p>
          </div>
          <div className="shrink-0">
            <ButtonLink
              to="/contact"
              variant="primary"
              size="md"
              className="shadow-sm hover:shadow-md transition-shadow font-semibold"
            >
              Talk to an Advisor
            </ButtonLink>
          </div>
        </div>

        {/* Middle Section: Logo, About, Programs, Contact */}
        <div className="grid gap-10 pt-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          {/* Company Intro */}
          <div className="max-w-sm">
            <Logo light />
            <p className="mt-4 text-[14.5px] leading-relaxed text-white/70">
              Practical, project-based learning in VLSI, Embedded Systems, and Edge AI. Learn by building what the industry ships.
            </p>
          </div>

          {/* About QBee */}
          <div>
            <h3 className="font-sans text-sm font-semibold tracking-wider uppercase text-white">About QBee</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="text-white/70 hover:text-white transition-colors">Our Company</Link>
              </li>
              <li>
                <Link to="/courses" className="text-white/70 hover:text-white transition-colors">Learning Approach</Link>
              </li>
              <li>
                <Link to="/kits" className="text-white/70 hover:text-white transition-colors">Projects & Labs</Link>
              </li>
              <li>
                <Link to="/institutions" className="text-white/70 hover:text-white transition-colors">For Colleges</Link>
              </li>
            </ul>
          </div>

          {/* Our Programs */}
          <div>
            <h3 className="font-sans text-sm font-semibold tracking-wider uppercase text-white">Our Programs</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/courses?domain=vlsi" className="text-white/70 hover:text-white transition-colors">VLSI Design</Link>
              </li>
              <li>
                <Link to="/courses?domain=embedded" className="text-white/70 hover:text-white transition-colors">Embedded Systems</Link>
              </li>
              <li>
                <Link to="/courses?domain=edge" className="text-white/70 hover:text-white transition-colors">Edge AI</Link>
              </li>
              <li>
                <Link to="/internships" className="text-white/70 hover:text-white transition-colors">Internships & Projects</Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-sans text-sm font-semibold tracking-wider uppercase text-white">Contact Us</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-white/70">
                <Mail className="h-4 w-4 shrink-0 text-honey mt-0.5" aria-hidden />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-white transition-colors">
                  <Placeholder>{CONTACT.email}</Placeholder>
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-white/70">
                <Phone className="h-4 w-4 shrink-0 text-honey mt-0.5" aria-hidden />
                <a href={`tel:${CONTACT.phone}`} className="hover:text-white transition-colors">
                  <Placeholder>{CONTACT.phone}</Placeholder>
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-white/70">
                <MapPin className="h-4 w-4 shrink-0 text-honey mt-0.5" aria-hidden />
                <span>
                  <Placeholder>{CONTACT.city}</Placeholder>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Slim Bar with Copyright & Policies */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-[13px] text-white/60 sm:flex-row">
          <span>© {new Date().getFullYear()} QBeeMind Solutions Pvt. Ltd. All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/policies" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="text-white/20" aria-hidden>•</span>
            <Link to="/policies" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <span className="text-white/20" aria-hidden>•</span>
            <Link to="/policies" className="hover:text-white transition-colors">Refund Policy</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
