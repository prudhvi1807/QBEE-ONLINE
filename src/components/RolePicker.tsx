import { useState } from 'react';
import { DOMAINS, ROLE_PATHS, type Domain } from '../data/catalog';
import { cx } from './ui';
import { StudentEnquiryForm } from './StudentEnquiryForm';

const DOMAIN_LIST: Domain[] = ['vlsi', 'embedded', 'edge'];

export function RolePicker() {
  const [domain, setDomain] = useState<Domain>('vlsi');
  const [roleIdx, setRoleIdx] = useState(1); // Design Verification by default

  const roles = ROLE_PATHS.filter((r) => r.domain === domain);
  const path = ROLE_PATHS[roleIdx]?.domain === domain ? ROLE_PATHS[roleIdx] : roles[0] || ROLE_PATHS[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,520px)] lg:gap-12">
      <div>
        <h1 className="font-display text-[38px] font-extrabold leading-[1.05] text-white sm:text-[52px] lg:text-[60px]">
          Pick the job you want. We'll show you the path.
        </h1>
        <p className="mt-5 max-w-xl text-[18px] text-white/75">
          Project-based certificate courses in VLSI, embedded systems and Edge AI. Each one ends in a capstone you can show in an interview.
        </p>

        <div className="mt-8" role="tablist" aria-label="Domain">
          <div className="inline-flex rounded-lg bg-white/10 p-1">
            {DOMAIN_LIST.map((d) => (
              <button
                key={d}
                role="tab"
                aria-selected={domain === d}
                onClick={() => {
                  setDomain(d);
                  setRoleIdx(ROLE_PATHS.findIndex((r) => r.domain === d));
                }}
                className={cx('rounded-md px-3 py-2 text-sm font-semibold transition-colors sm:px-4 cursor-pointer', domain === d ? 'bg-white text-ink' : 'text-white/80 hover:text-white')}
              >
                {DOMAINS[d].name}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm font-medium text-white/60">I want to become a…</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {roles.map((r) => {
            const i = ROLE_PATHS.indexOf(r);
            const active = path === r;
            return (
              <button
                key={r.role}
                onClick={() => setRoleIdx(i)}
                aria-pressed={active}
                className={cx(
                  'rounded-full border px-4 py-2 text-[15px] font-medium transition-colors cursor-pointer',
                  active ? 'border-honey bg-honey text-ink' : 'border-white/25 text-white hover:border-white/60',
                )}
              >
                {r.role}
              </button>
            );
          })}
        </div>
      </div>

      <StudentEnquiryForm />
    </div>
  );
}
