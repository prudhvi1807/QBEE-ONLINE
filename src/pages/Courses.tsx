import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { TrackRow } from '../components/TrackRow';
import { PageHeader, Section, cx } from '../components/ui';
import { COURSES, DOMAINS, TRACKS, type Domain } from '../data/catalog';

const LEVELS = ['Foundation', 'Intermediate', 'Advanced'] as const;

export default function Courses() {
  const [params, setParams] = useSearchParams();
  const domain = (params.get('domain') as Domain | null) ?? null;
  const level = params.get('level');
  const q = params.get('q') ?? '';

  const set = (k: string, v: string | null) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return COURSES.filter(
      (c) =>
        (!domain || c.domain === domain) &&
        (!level || c.levelTier === level) &&
        (!needle || [c.code, c.title, c.tagline, c.tools, c.overview].join(' ').toLowerCase().includes(needle)),
    );
  }, [domain, level, q]);

  return (
    <>
      <PageHeader
        title={domain ? `${DOMAINS[domain].name} courses` : 'All courses'}
        intro={domain ? DOMAINS[domain].blurb : '18 project-based certificate courses across VLSI design, embedded systems and Edge AI. Instructor-led, with weekly labs and a capstone. ₹15,000 each.'}
        crumbs={[{ to: '/', label: 'Home' }, { to: '/courses', label: 'Courses' }]}
      />

      <div className="sticky top-16 z-30 border-b border-line bg-white/95 backdrop-blur lg:top-[72px]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:pb-0" role="tablist" aria-label="Domain">
            {[null, 'vlsi', 'embedded', 'edge'].map((d) => (
              <button
                key={d ?? 'all'}
                role="tab"
                aria-selected={domain === d}
                onClick={() => set('domain', d)}
                className={cx(
                  'shrink-0 rounded-md px-3.5 py-2 text-sm font-semibold transition-colors cursor-pointer',
                  domain === d ? 'bg-ink text-white' : 'text-text hover:bg-mist',
                )}
              >
                {d ? DOMAINS[d as Domain].name : 'All domains'}
              </button>
            ))}
          </div>
          <div className="flex gap-2 lg:ml-auto">
            <label className="sr-only" htmlFor="level">Level</label>
            <select
              id="level"
              value={level ?? ''}
              onChange={(e) => set('level', e.target.value || null)}
              className="h-10 rounded-lg border border-line bg-white px-3 text-sm font-medium text-ink"
            >
              <option value="">All levels</option>
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
            <div className="relative flex-1 lg:w-72 lg:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <label className="sr-only" htmlFor="q">Search courses</label>
              <input
                id="q"
                value={q}
                onChange={(e) => set('q', e.target.value || null)}
                placeholder="Search UVM, FreeRTOS, TinyML…"
                className="h-10 w-full rounded-lg border border-line pl-9 pr-3 text-sm placeholder:text-muted/70"
              />
            </div>
          </div>
        </div>
      </div>

      <Section className="!pt-10">
        <p className="mb-5 text-sm text-muted" aria-live="polite">
          {list.length} {list.length === 1 ? 'course' : 'courses'}
        </p>
        {list.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c) => (
              <CourseCard key={c.code} course={c} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-line p-10 text-center">
            <p className="font-semibold text-ink">No course matches “{q}”.</p>
            <p className="mt-1 text-muted">Try a tool or topic like Verilog, STM32 or OpenCV, or clear the filters.</p>
            <button onClick={() => setParams({}, { replace: true })} className="mt-4 font-semibold text-blue hover:underline cursor-pointer">Clear filters</button>
          </div>
        )}

        {domain && (
          <div className="mt-16">
            <h2 className="text-[26px] font-bold">Recommended {DOMAINS[domain].name} tracks</h2>
            <p className="mt-2 text-muted">Role-focused bundles. Bundle learners also get priority batch scheduling and a consolidated track certificate.</p>
            <div className="mt-6 space-y-3">
              {TRACKS.filter((t) => t.domain === domain).map((t) => (
                <TrackRow key={t.id} track={t} />
              ))}
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
