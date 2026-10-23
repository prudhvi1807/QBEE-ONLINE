import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import type { Domain } from '../data/catalog';
import { DOMAINS } from '../data/catalog';

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ');
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8', className)}>{children}</div>;
}

type Variant = 'primary' | 'dark' | 'outline' | 'ghost' | 'light';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-honey text-ink hover:bg-honey-deep',
  dark: 'bg-ink text-white hover:bg-ink-2',
  outline: 'border border-line bg-white text-ink hover:border-ink',
  ghost: 'text-ink hover:bg-mist',
  light: 'bg-white text-ink hover:bg-honey-soft',
};
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-13 px-6 text-base',
};

// `display` is added separately so callers can pass `hidden sm:inline-flex` without a class conflict.
const withDisplay = (className?: string) => (/(^|\s)hidden(\s|$)/.test(className ?? '') ? '' : 'inline-flex');
const base =
  'items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button className={cx(withDisplay(className), base, variants[variant], sizes[size], className)} {...props} />;
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: LinkProps & { variant?: Variant; size?: Size }) {
  return <Link className={cx(withDisplay(className), base, variants[variant], sizes[size], className)} {...props} />;
}

const domainStyle: Record<Domain, string> = {
  vlsi: 'bg-vlsi-soft text-vlsi',
  embedded: 'bg-embedded-soft text-embedded',
  edge: 'bg-edge-soft text-edge',
};
export const domainText: Record<Domain, string> = { vlsi: 'text-vlsi', embedded: 'text-embedded', edge: 'text-edge' };
export const domainBg: Record<Domain, string> = { vlsi: 'bg-vlsi', embedded: 'bg-embedded', edge: 'bg-edge' };
export const domainSoft: Record<Domain, string> = { vlsi: 'bg-vlsi-soft', embedded: 'bg-embedded-soft', edge: 'bg-edge-soft' };

export function DomainTag({ domain, className }: { domain: Domain; className?: string }) {
  return (
    <span className={cx('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold', domainStyle[domain], className)}>
      {DOMAINS[domain].name}
    </span>
  );
}

export function Code({ children, domain }: { children: ReactNode; domain?: Domain }) {
  return <span className={cx('font-mono text-[13px] font-semibold', domain ? domainText[domain] : 'text-muted')}>{children}</span>;
}

export function SectionHead({ title, intro, action, className }: { title: string; intro?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cx('mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between', className)}>
      <div className="max-w-2xl">
        <h2 className="text-[28px] font-bold sm:text-[34px]">{title}</h2>
        {intro && <p className="mt-3 text-[17px] text-muted">{intro}</p>}
      </div>
      {action}
    </div>
  );
}

export function Section({ children, className, tone = 'white', id }: { children: ReactNode; className?: string; tone?: 'white' | 'mist' | 'ink'; id?: string }) {
  const t = tone === 'mist' ? 'bg-mist' : tone === 'ink' ? 'bg-ink text-white' : 'bg-white';
  return (
    <section id={id} className={cx('py-16 sm:py-20', t, className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function PageHeader({ title, intro, children, crumbs }: { title: string; intro?: ReactNode; children?: ReactNode; crumbs?: { to: string; label: string }[] }) {
  return (
    <header className="border-b border-line bg-mist">
      <Container className="py-10 sm:py-14">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted">
            {crumbs.map((c, i) => (
              <span key={c.to} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>/</span>}
                <Link to={c.to} className="hover:text-ink hover:underline">{c.label}</Link>
              </span>
            ))}
          </nav>
        )}
        <h1 className="max-w-3xl text-[34px] font-bold sm:text-[44px]">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-[17px] text-muted">{intro}</p>}
        {children}
      </Container>
    </header>
  );
}

export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-honey-soft px-1.5 py-0.5 text-[13px] font-medium text-warn" title="Placeholder — client to confirm">
      {children}
    </span>
  );
}
