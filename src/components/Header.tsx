import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, ShoppingBag, X, UserRound } from 'lucide-react';
import { COURSES, DOMAINS, type Domain } from '../data/catalog';
import { useStore } from '../lib/store';
import { cartCount } from '../lib/pricing';
import { ButtonLink, Code, Container, cx, domainText } from './ui';

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="QBee Online home">
      <img src="./logo.png" alt="" className="h-9 w-9 rounded-lg" />
      <span className="leading-none">
        <span className={cx('block font-display text-[19px] font-extrabold tracking-tight', light ? 'text-white' : 'text-ink')}>QBee Online</span>
        <span className={cx('mt-0.5 block text-[11px] font-medium', light ? 'text-white/60' : 'text-muted')}>by QBeeMind Solutions</span>
      </span>
    </Link>
  );
}

export function Header() {
  const { cart, student } = useStore();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const loc = useLocation();
  const navigate = useNavigate();
  const megaRef = useRef<HTMLDivElement>(null);
  const count = cartCount(cart);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [loc.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navCls = ({ isActive }: { isActive: boolean }) =>
    cx(
      'whitespace-nowrap rounded-md px-3.5 py-2 text-[15px] font-medium transition-colors',
      isActive ? 'text-ink bg-mist font-semibold' : 'text-text/80 hover:text-ink hover:bg-mist'
    );

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (loc.pathname === '/') {
      const el = document.getElementById('about');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#about');
      setTimeout(() => {
        const el = document.getElementById('about');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center gap-4 lg:h-[72px]">
        <Logo />

        {/* Desktop Navigation in EXACT requested order:
            1. For Companies
            2. For Colleges
            3. Internships
            4. Courses
            5. About
        */}
        <nav className="ml-5 hidden items-center gap-1.5 lg:flex" aria-label="Main">
          {/* 1. For Companies */}
          <NavLink to="/companies" className={navCls}>
            For Companies
          </NavLink>

          {/* 2. For Colleges */}
          <NavLink to="/institutions" className={navCls}>
            For Colleges
          </NavLink>

          {/* 3. Internships */}
          <NavLink to="/internships" className={navCls}>
            Internships
          </NavLink>

          {/* 4. Courses */}
          <div ref={megaRef} className="relative">
            <button
              className={cx(
                'flex items-center gap-1 rounded-md px-3.5 py-2 text-[15px] font-medium transition-colors hover:bg-mist cursor-pointer',
                loc.pathname.startsWith('/courses') ? 'bg-mist text-ink font-semibold' : 'text-text/80 hover:text-ink'
              )}
              aria-expanded={megaOpen}
              aria-controls="mega"
              onClick={() => setMegaOpen((v) => !v)}
            >
              Courses <ChevronDown className={cx('h-4 w-4 transition-transform', megaOpen && 'rotate-180')} />
            </button>
            {megaOpen && <MegaMenu />}
          </div>

          {/* 5. About */}
          <a
            href="/#about"
            onClick={handleAboutClick}
            className="whitespace-nowrap rounded-md px-3.5 py-2 text-[15px] font-medium transition-colors text-text/80 hover:text-ink hover:bg-mist cursor-pointer"
          >
            About
          </a>
        </nav>

        {/* Right side elements: Student Login / My Portal, Talk to an Advisor, Cart */}
        <div className="ml-auto flex items-center gap-2">
          <ButtonLink to={student ? '/portal' : '/login'} variant="outline" size="sm" className="hidden sm:inline-flex">
            <UserRound className="h-4 w-4" /> {student ? 'My Portal' : 'Student Login'}
          </ButtonLink>

          <ButtonLink to="/contact" size="sm" className="hidden md:inline-flex">
            Talk to an Advisor
          </ButtonLink>

          {/* Shopping Cart */}
          <Link to="/cart" className="relative grid h-10 w-10 place-items-center rounded-lg text-ink hover:bg-mist" aria-label={`Cart, ${count} items`}>
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-honey px-1 text-[11px] font-bold text-ink">{count}</span>
            )}
          </Link>

          <button className="grid h-10 w-10 place-items-center rounded-lg text-ink hover:bg-mist lg:hidden" aria-label="Open menu" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </Container>

      {mobileOpen && <MobileMenu onClose={() => setMobileOpen(false)} onAboutClick={handleAboutClick} />}
    </header>
  );
}

function MegaMenu() {
  return (
    <div id="mega" className="absolute left-0 top-full mt-2 w-[860px] rounded-xl border border-line bg-white p-6 shadow-[0_20px_50px_-20px_rgba(10,35,80,.35)]">
      <div className="grid grid-cols-3 gap-6">
        {(Object.keys(DOMAINS) as Domain[]).map((d) => (
          <div key={d}>
            <Link to={`/courses?domain=${d}`} className={cx('mb-3 block font-display text-[15px] font-bold hover:underline', domainText[d])}>
              {DOMAINS[d].name}
            </Link>
            <ul className="space-y-1">
              {COURSES.filter((c) => c.domain === d).map((c) => (
                <li key={c.code}>
                  <Link to={`/courses/${c.slug}`} className="-mx-2 block rounded-md px-2 py-1.5 hover:bg-mist">
                    <Code domain={d}>{c.code}</Code>
                    <span className="block text-sm leading-snug text-text">{c.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm">
        <span className="text-muted">18 instructor-led courses across 3 core hardware & AI domains</span>
        <Link to="/courses" className="font-semibold text-blue hover:underline">Browse all courses</Link>
      </div>
    </div>
  );
}

function MobileMenu({ onClose, onAboutClick }: { onClose: () => void; onAboutClick: (e: React.MouseEvent) => void }) {
  const { student } = useStore();
  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex w-[min(360px,100%)] flex-col overflow-y-auto bg-white">
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <span className="font-display font-bold text-ink">Menu</span>
          <button className="grid h-10 w-10 place-items-center rounded-lg hover:bg-mist" aria-label="Close menu" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Navigation in EXACT requested order:
            1. For Companies
            2. For Colleges
            3. Internships
            4. Courses
            5. About
        */}
        <nav className="flex flex-col p-4" aria-label="Mobile">
          <Link to="/companies" className="rounded-md px-3 py-2.5 font-medium hover:bg-mist" onClick={onClose}>
            1. For Companies
          </Link>
          <Link to="/institutions" className="rounded-md px-3 py-2.5 font-medium hover:bg-mist" onClick={onClose}>
            2. For Colleges
          </Link>
          <Link to="/internships" className="rounded-md px-3 py-2.5 font-medium hover:bg-mist" onClick={onClose}>
            3. Internships
          </Link>

          <div className="my-2 border-t border-line" />

          <p className="px-3 pb-1 pt-1 text-xs font-bold uppercase tracking-wider text-muted">4. Courses</p>
          {(Object.keys(DOMAINS) as Domain[]).map((d) => (
            <Link key={d} to={`/courses?domain=${d}`} className="rounded-md px-3 py-2 font-medium hover:bg-mist" onClick={onClose}>
              <span className={domainText[d]}>{DOMAINS[d].name}</span>
            </Link>
          ))}
          <Link to="/courses" className="rounded-md px-3 py-2 text-sm font-semibold text-blue hover:bg-mist" onClick={onClose}>
            Browse All 18 Courses →
          </Link>

          <div className="my-2 border-t border-line" />

          <a
            href="/#about"
            className="rounded-md px-3 py-2.5 font-medium hover:bg-mist cursor-pointer"
            onClick={(e) => {
              onClose();
              onAboutClick(e);
            }}
          >
            5. About
          </a>
        </nav>

        <div className="mt-auto grid gap-2 border-t border-line p-4">
          <ButtonLink to={student ? '/portal' : '/login'} variant="outline">
            {student ? 'My Portal' : 'Student Login'}
          </ButtonLink>
          <ButtonLink to="/contact">
            Talk to an Advisor
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
