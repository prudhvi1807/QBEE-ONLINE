import { Link } from 'react-router-dom';
import { Check, Clock, Plus } from 'lucide-react';
import type { Course } from '../data/catalog';
import { inr } from '../lib/pricing';
import { useStore } from '../lib/store';
import { Code, cx, domainBg } from './ui';

export function CourseCard({ course }: { course: Course }) {
  const { addCourse, inCart } = useStore();
  const added = inCart(course.code);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-white transition-shadow hover:shadow-[0_12px_32px_-16px_rgba(10,35,80,.35)]">
      <span className={cx('h-1 w-full', domainBg[course.domain])} aria-hidden />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <Code domain={course.domain}>{course.code}</Code>
          <span className="rounded-md bg-mist px-2 py-0.5 text-xs font-medium text-muted">{course.levelTier}</span>
        </div>
        <h3 className="mt-3 text-[18px] font-bold leading-snug">
          <Link to={`/courses/${course.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {course.title}
          </Link>
        </h3>
        <p className="mt-2 text-[15px] text-muted">{course.tagline}</p>
        <p className="mb-5 mt-4 flex items-center gap-1.5 text-sm text-muted">
          <Clock className="h-4 w-4" /> {course.weeks} weeks, about {course.hours} hours
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
          <span className="font-display text-[18px] font-bold text-ink">{inr(15000)}</span>
          <button
            onClick={() => addCourse(course.code)}
            disabled={added}
            className={cx(
              'relative z-10 inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors cursor-pointer',
              added ? 'bg-ok-soft text-ok' : 'border border-line text-ink hover:border-ink',
            )}
          >
            {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {added ? 'In cart' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  );
}
