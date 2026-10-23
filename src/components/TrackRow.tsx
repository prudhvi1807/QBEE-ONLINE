import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { COURSES, type Track } from '../data/catalog';
import { inr } from '../lib/pricing';
import { useStore } from '../lib/store';
import { Button, cx, domainText } from './ui';

export function TrackRow({ track }: { track: Track }) {
  const { addTrack, cart } = useStore();
  const added = cart.allAccess || track.codes.every((c) => cart.courses.includes(c));
  return (
    <div className="grid gap-4 rounded-xl border border-line bg-white p-5 md:grid-cols-[1fr_auto] md:items-center">
      <div className="min-w-0">
        <h3 className="text-[18px] font-bold">{track.name}</h3>
        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          {track.codes.map((code, i) => {
            const c = COURSES.find((x) => x.code === code)!;
            return (
              <span key={code} className="flex items-center gap-2">
                {i > 0 && <span className="text-muted" aria-hidden>→</span>}
                <Link to={`/courses/${c.slug}`} className={cx('font-mono font-semibold hover:underline', domainText[c.domain])} title={c.title}>
                  {code}
                </Link>
              </span>
            );
          })}
        </p>
      </div>
      <div className="flex items-center gap-5">
        <div className="text-right">
          <p className="text-sm text-muted line-through">{inr(track.standard)}</p>
          <p className="font-display text-[22px] font-bold text-ink">{inr(track.bundle)}</p>
          <p className="text-xs font-semibold text-ok">Save {inr(track.standard - track.bundle)}</p>
        </div>
        <Button variant={added ? 'outline' : 'dark'} size="sm" onClick={() => addTrack(track.id)} disabled={added}>
          {added ? (
            <>
              <Check className="h-4 w-4" /> In cart
            </>
          ) : (
            'Add track'
          )}
        </Button>
      </div>
    </div>
  );
}
