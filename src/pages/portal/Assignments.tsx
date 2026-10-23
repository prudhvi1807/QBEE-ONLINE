import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2, Clock, Lock, MessageSquareText, Upload } from 'lucide-react';
import { COURSES } from '../../data/catalog';
import { useStore } from '../../lib/store';
import { assignmentsFor, fmtDate, type AssignmentRow } from '../../lib/portal';
import { Code, cx } from '../../components/ui';
import { Panel, PortalTitle } from './PortalLayout';

const TABS = ['To do', 'Submitted', 'Reviewed', 'All'] as const;

export default function Assignments() {
  const { portal } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]>('To do');
  const { hash } = useLocation();
  const rows = assignmentsFor(portal.enrollments, portal.submissions);

  useEffect(() => {
    if (hash) {
      setTab('All');
      const timer = setTimeout(() => {
        document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'center' });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [hash]);

  const filtered = rows.filter((r) =>
    tab === 'All' ? true : tab === 'To do' ? r.unlocked && !r.submission : tab === 'Submitted' ? r.submission?.status === 'submitted' : r.submission?.status === 'reviewed',
  );
  const counts = {
    'To do': rows.filter((r) => r.unlocked && !r.submission).length,
    Submitted: rows.filter((r) => r.submission?.status === 'submitted').length,
    Reviewed: rows.filter((r) => r.submission?.status === 'reviewed').length,
    All: rows.length,
  };

  return (
    <>
      <PortalTitle title="Assignments" intro="One lab assignment per module. Upload your code or report; a mentor reviews it and leaves feedback." />
      <div className="mb-5 flex gap-1 overflow-x-auto" role="tablist">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cx('shrink-0 rounded-lg px-3.5 py-2 text-sm font-semibold cursor-pointer', tab === t ? 'bg-ink text-white' : 'bg-white text-text hover:bg-line/50')}>
            {t} <span className={cx('ml-1', tab === t ? 'text-white/70' : 'text-muted')}>{counts[t]}</span>
          </button>
        ))}
      </div>
      <Panel>
        <ul className="divide-y divide-line">
          {filtered.map((r) => (
            <Row key={r.key} r={r} />
          ))}
          {!filtered.length && <li className="px-5 py-8 text-center text-muted">{tab === 'To do' ? 'Nothing to submit right now. New labs unlock as you complete modules.' : 'Nothing here yet.'}</li>}
        </ul>
      </Panel>
    </>
  );
}

function Row({ r }: { r: AssignmentRow }) {
  const { submitAssignment } = useStore();
  const c = COURSES.find((x) => x.code === r.code)!;
  const s = r.submission;
  const [file, setFile] = useState<File | null>(null);

  return (
    <li id={r.key} className="px-5 py-4 scroll-mt-28">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Code domain={c.domain}>{c.code}</Code>
          <p className="font-semibold text-ink">{r.title}</p>
          {s?.fileName && <p className="mt-0.5 font-mono text-[12.5px] text-muted">{s.fileName}{s.submittedAt && `, submitted ${fmtDate(s.submittedAt)}`}</p>}
        </div>
        <div className="shrink-0">
          {!r.unlocked ? (
            <span className="flex items-center gap-1.5 text-sm text-muted"><Lock className="h-4 w-4" /> Unlocks with module {r.moduleIndex + 1}</span>
          ) : s?.status === 'reviewed' ? (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-ok"><CheckCircle2 className="h-4 w-4" /> Reviewed{typeof s.score === 'number' && `, ${s.score}/10`}</span>
          ) : s?.status === 'submitted' ? (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-blue"><Clock className="h-4 w-4" /> Awaiting review</span>
          ) : (
            <form
              className="flex flex-wrap items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (file) submitAssignment(r.key, file.name);
              }}
            >
              <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-line px-3 text-sm font-medium text-ink hover:border-ink">
                <Upload className="h-4 w-4" />
                <span className="max-w-[160px] truncate">{file ? file.name : 'Choose file'}</span>
                <input type="file" className="sr-only" accept=".v,.sv,.c,.h,.py,.ipynb,.zip,.pdf,.txt" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </label>
              <button type="submit" disabled={!file} className="h-9 rounded-lg bg-ink px-3.5 text-sm font-semibold text-white disabled:opacity-40 cursor-pointer">Submit</button>
            </form>
          )}
        </div>
      </div>
      {s?.feedback && (
        <p className="mt-3 flex gap-2.5 rounded-lg bg-mist p-3 text-[15px] text-text">
          <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-blue" aria-hidden />
          <span><span className="font-semibold text-ink">Mentor feedback: </span>{s.feedback}</span>
        </p>
      )}
    </li>
  );
}
