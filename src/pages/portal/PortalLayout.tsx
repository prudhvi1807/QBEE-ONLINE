import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Award, CalendarRange, ClipboardCheck, FlaskConical, LayoutDashboard, LogOut, Package } from 'lucide-react';
import { useStore } from '../../lib/store';
import { cx } from '../../components/ui';

const NAV = [
  { to: '/portal', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/portal/labs', label: 'Labs', icon: FlaskConical },
  { to: '/portal/assignments', label: 'Assignments', icon: ClipboardCheck },
  { to: '/portal/booking', label: 'Lab booking', icon: CalendarRange },
  { to: '/portal/kits', label: 'Hardware kits', icon: Package },
  { to: '/portal/certificates', label: 'Certificates', icon: Award },
];

export default function PortalLayout() {
  const { student, signOut } = useStore();
  const navigate = useNavigate();

  return (
    <div className="portal-scope min-h-[calc(100vh-72px)] bg-mist box-border">
      {/* Centered portal container with consistent 1280px max width and responsive horizontal padding:
          12-16px on mobile (px-3 sm:px-4), 16-24px on tablets/desktop (md:px-5 lg:px-6), and bottom clearance for floating Ask QBee button */}
      <div className="mx-auto w-full max-w-[1280px] px-3 py-6 sm:px-4 sm:py-8 md:px-5 lg:px-6 lg:py-8 pb-24 sm:pb-28">
        <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
          {/* Portal Sidebar */}
          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            {/* Signed-in user card */}
            <div className="hidden rounded-xl border border-line bg-white p-5 shadow-xs lg:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Signed in as</p>
              <p className="mt-1 truncate text-[15px] font-semibold text-ink">{student?.name}</p>
              <p className="mt-0.5 truncate text-xs text-muted">{student?.email}</p>
            </div>

            {/* Navigation menu with standard 12-14px vertical padding and aligned items */}
            <nav
              className="-mx-3 flex gap-1.5 overflow-x-auto px-3 pb-2 sm:-mx-4 sm:px-4 lg:mx-0 lg:mt-4 lg:flex-col lg:gap-1.5 lg:px-0 lg:pb-0"
              aria-label="Portal"
            >
              {NAV.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cx(
                      'flex shrink-0 items-center gap-3 rounded-lg px-3.5 py-3 lg:py-3.5 text-[14px] lg:text-[15px] font-medium transition-colors',
                      isActive ? 'bg-ink text-white shadow-xs' : 'text-text hover:bg-white hover:text-ink'
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span>{label}</span>
                </NavLink>
              ))}

              <button
                onClick={() => {
                  signOut();
                  navigate('/');
                }}
                className="flex shrink-0 items-center gap-3 rounded-lg px-3.5 py-3 lg:py-3.5 text-[14px] lg:text-[15px] font-medium text-muted hover:bg-white hover:text-ink lg:mt-2 cursor-pointer transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" aria-hidden />
                <span>Log out</span>
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export function PortalTitle({ title, intro, action }: { title: string; intro?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-[26px] font-bold text-ink sm:text-[30px] tracking-tight">{title}</h1>
        {intro && <p className="mt-1 text-sm sm:text-base text-muted">{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Panel({ children, className, title, action }: { children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode }) {
  return (
    <section className={cx('min-w-0 rounded-xl border border-line bg-white shadow-xs', className)}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6 sm:py-4">
          <h2 className="font-sans text-[15px] sm:text-[16px] font-semibold text-ink">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cx('h-2 overflow-hidden rounded-full bg-mist', className)} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-blue" style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}
