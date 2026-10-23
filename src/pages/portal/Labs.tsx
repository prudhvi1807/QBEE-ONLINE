import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, FlaskConical, Lock, Play, RotateCcw, XCircle } from 'lucide-react';
import { COURSES } from '../../data/catalog';
import { LABS, type Lab } from '../../data/labs';
import { useStore } from '../../lib/store';
import { Button, ButtonLink, Code, cx } from '../../components/ui';
import { Panel, PortalTitle } from './PortalLayout';

export default function Labs() {
  const { labId } = useParams();
  const lab = LABS.find((l) => l.id === labId);
  return lab ? <LabRunner lab={lab} /> : <LabList />;
}

function LabList() {
  const { portal } = useStore();
  const enrolled = new Set(portal.enrollments.map((e) => e.code));
  return (
    <>
      <PortalTitle title="Labs" intro="Write code in the browser and run it against the lab checker. Each lab matches a module in your course." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {LABS.map((l) => {
          const c = COURSES.find((x) => x.code === l.course)!;
          const open = enrolled.has(l.course);
          const passed = portal.labsPassed.includes(l.id);
          return (
            <Panel key={l.id} className="flex flex-col p-5">
              <div className="flex items-center justify-between">
                <Code domain={c.domain}>{c.code}</Code>
                {passed ? (
                  <span className="flex items-center gap-1 text-sm font-semibold text-ok"><CheckCircle2 className="h-4 w-4" /> Passed</span>
                ) : (
                  <span className="text-sm text-muted">Module {l.module + 1}</span>
                )}
              </div>
              <h2 className="mt-2 text-[18px] font-bold leading-snug">{l.title}</h2>
              <p className="mt-2 flex-1 text-[15px] text-muted">{l.brief}</p>
              <p className="mt-3 font-mono text-[12px] text-muted">{l.fileName}</p>
              <div className="mt-4">
                {open ? (
                  <ButtonLink to={`/portal/labs/${l.id}`} size="sm" variant="dark"><FlaskConical className="h-4 w-4" /> Open lab</ButtonLink>
                ) : (
                  <ButtonLink to={`/courses/${c.slug}`} size="sm" variant="outline"><Lock className="h-4 w-4" /> Enrol in {c.code} to unlock</ButtonLink>
                )}
              </div>
            </Panel>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-muted">More labs are added module by module. Hardware labs use your board or a remote lab slot.</p>
    </>
  );
}

type Result = { ran: false } | { ran: true; pass: boolean; checks: { id: string; label: string; ok: boolean; hint: string }[]; log: string[] };

function LabRunner({ lab }: { lab: Lab }) {
  const { portal, markLabPassed } = useStore();
  const course = COURSES.find((c) => c.code === lab.course)!;
  const unlocked = portal.enrollments.some((e) => e.code === lab.course);
  const [code, setCode] = useState(lab.starter);
  const [result, setResult] = useState<Result>({ ran: false });
  const [running, setRunning] = useState(false);

  const run = () => {
    setRunning(true);
    window.setTimeout(() => {
      // Strip comments so TODO notes don't satisfy checks
      const src = code.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/#.*$/gm, (m) => (lab.language === 'python' ? '' : m));
      const checks = lab.checks.map((c) => ({ id: c.id, label: c.label, ok: c.test.test(src), hint: c.hint }));
      const pass = checks.every((c) => c.ok);
      const failLog = [
        lab.language === 'verilog' ? 'iverilog -g2012 -o sim counter.v tb_counter.v' : lab.language === 'c' ? 'arm-none-eabi-gcc -mcpu=cortex-m4 -O1 -c main.c' : 'python evaluate.py',
        ...checks.filter((c) => !c.ok).map((c) => `FAIL  ${c.label}`),
        `${checks.filter((c) => c.ok).length}/${checks.length} lab checks passed`,
      ];
      setResult({ ran: true, pass, checks, log: pass ? lab.successLog : failLog });
      if (pass) markLabPassed(lab.id);
      setRunning(false);
    }, 650);
  };

  if (!unlocked) {
    return (
      <Panel className="p-8 text-center">
        <Lock className="mx-auto h-8 w-8 text-muted" />
        <h1 className="mt-3 text-[24px] font-bold">This lab is part of {course.code}</h1>
        <p className="mt-2 text-muted">Enrol in {course.title} to open it.</p>
        <ButtonLink to={`/courses/${course.slug}`} className="mt-5">See the course</ButtonLink>
      </Panel>
    );
  }

  return (
    <>
      <div className="mb-5">
        <Link to="/portal/labs" className="text-sm font-medium text-blue hover:underline">All labs</Link>
        <h1 className="mt-2 text-[26px] font-bold sm:text-[30px]">{lab.title}</h1>
        <p className="mt-1 text-sm text-muted">
          <Code domain={course.domain}>{course.code}</Code> Module {lab.module + 1}: {course.modules[lab.module].title}
        </p>
      </div>

      <div className="grid gap-5 2xl:grid-cols-[320px_1fr]">
        <Panel title="Task" className="2xl:order-none">
          <div className="p-5">
            <p className="text-[15px] text-text">{lab.brief}</p>
            <ul className="mt-4 space-y-2.5">
              {lab.steps.map((s, i) => {
                const chk = result.ran ? result.checks[i] : undefined;
                return (
                  <li key={s} className="flex gap-2.5 text-[15px]">
                    {chk ? (chk.ok ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-ok" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-edge" />) : <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mist text-xs font-semibold text-muted">{i + 1}</span>}
                    <span>
                      {s}
                      {chk && !chk.ok && <span className="mt-1 block text-sm text-muted">{chk.hint}</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Panel>

        <div className="min-w-0 space-y-5">
          <Panel>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5">
              <span className="font-mono text-[13px] font-semibold text-ink">{lab.fileName}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => { setCode(lab.starter); setResult({ ran: false }); }}><RotateCcw className="h-4 w-4" /> Reset</Button>
                <Button size="sm" onClick={run} disabled={running}><Play className="h-4 w-4" /> {running ? 'Running…' : 'Run'}</Button>
              </div>
            </div>
            <Editor value={code} onChange={setCode} onRun={run} />
          </Panel>

          <Panel title="Output" action={result.ran && (result.pass ? <span className="flex items-center gap-1 text-sm font-semibold text-ok"><CheckCircle2 className="h-4 w-4" /> All checks passed</span> : <span className="text-sm font-semibold text-edge">Some checks failed</span>)}>
            {!result.ran ? (
              <p className="px-5 py-6 text-[15px] text-muted">Press Run (or Ctrl + Enter) to compile and check your code.</p>
            ) : (
              <div className="space-y-4 p-4">
                <pre className="code-area overflow-x-auto rounded-lg bg-ink p-4 text-[12.5px] text-white/90">
                  {result.log.map((l, i) => (
                    <div key={i} className={cx(l.startsWith('FAIL') && 'text-[#ff9b7a]', l.startsWith('PASS') && 'text-[#7ee2a8]')}>
                      {i === 0 ? '$ ' : ''}{l}
                    </div>
                  ))}
                </pre>
                {result.pass && lab.view === 'waveform' && <Waveform />}
                {result.pass && lab.view === 'board' && <VirtualBoard />}
              </div>
            )}
          </Panel>
          <p className="text-xs text-muted">Preview runner: checks your code against the lab rules and shows the expected result. The production portal sends it to a sandboxed compiler and simulator.</p>
        </div>
      </div>
    </>
  );
}

function Editor({ value, onChange, onRun }: { value: string; onChange: (v: string) => void; onRun: () => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const gutter = useRef<HTMLDivElement>(null);
  const lines = value.split('\n').length;

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
      return;
    }
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      const t = e.currentTarget;
      const { selectionStart: s, selectionEnd: en } = t;
      const next = value.slice(0, s) + '    ' + value.slice(en);
      onChange(next);
      requestAnimationFrame(() => t.setSelectionRange(s + 4, s + 4));
    }
  };

  return (
    <div className="flex max-h-[460px] min-h-[320px] overflow-hidden rounded-b-xl bg-[#0d1b33]">
      <div ref={gutter} className="code-area select-none overflow-hidden py-3 pl-3 pr-2 text-right text-white/30" aria-hidden>
        {Array.from({ length: lines }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKey}
        onScroll={(e) => gutter.current && (gutter.current.scrollTop = e.currentTarget.scrollTop)}
        spellCheck={false}
        aria-label="Code editor"
        className="code-area flex-1 resize-none whitespace-pre bg-transparent py-3 pr-4 text-[#e6edf7] caret-honey outline-none"
      />
    </div>
  );
}

function Waveform() {
  const cycles = 20;
  const W = 34;
  const counts = Array.from({ length: cycles }, (_, i) => (i < 2 ? 0 : (i - 2) % 16));
  const x0 = 64;
  const width = x0 + cycles * W + 8;
  const clk = Array.from({ length: cycles }, (_, i) => `L${x0 + i * W},38 L${x0 + i * W},14 L${x0 + i * W + W / 2},14 L${x0 + i * W + W / 2},38`).join(' ');
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white">
      <p className="border-b border-line px-4 py-2 text-sm font-semibold text-ink">counter.vcd</p>
      <svg viewBox={`0 0 ${width} 150`} width={width} height={150} role="img" aria-label="Waveform: count increments from 0 to 15 then wraps, after reset is released">
        <g fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#56657a">
          <text x="8" y="30">clk</text>
          <text x="8" y="72">rst</text>
          <text x="8" y="118">count</text>
        </g>
        <path d={`M${x0},38 ${clk}`} fill="none" stroke="#1f5fd1" strokeWidth="1.6" />
        <path d={`M${x0},56 L${x0 + 2 * W},56 L${x0 + 2 * W},80 L${width - 8},80`} fill="none" stroke="#c2410c" strokeWidth="1.6" />
        {counts.map((v, i) => {
          const x = x0 + i * W;
          return (
            <g key={i}>
              <path d={`M${x},110 L${x + 4},98 L${x + W - 4},98 L${x + W},110 L${x + W - 4},122 L${x + 4},122 Z`} fill={v === 15 ? '#fff4d1' : '#e8f0fd'} stroke="#0a2350" strokeWidth="1" />
              <text x={x + W / 2} y="114" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#0a2350">{v.toString(16).toUpperCase()}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function VirtualBoard() {
  const [pressed, setPressed] = useState(false);
  useEffect(() => {
    const up = () => setPressed(false);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointerup', up);
    };
  }, []);
  return (
    <div className="flex flex-wrap items-center gap-6 rounded-lg border border-line bg-[#0f5132] p-5 text-white">
      <div className="font-mono text-xs text-white/70">
        STM32 virtual board
        <br />
        PA5 = LED, PC13 = button
      </div>
      <div className="flex items-center gap-3">
        <span className={cx('h-6 w-6 rounded-full border-2 border-white/40 transition-colors', pressed ? 'bg-[#7ee2a8] shadow-[0_0_18px_4px_rgba(126,226,168,.7)]' : 'bg-[#1b3a2a]')} aria-hidden />
        <span className="text-sm">LED {pressed ? 'on' : 'off'}</span>
      </div>
      <button
        onPointerDown={() => setPressed(true)}
        onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && setPressed(true)}
        onKeyUp={() => setPressed(false)}
        className={cx('h-14 w-14 rounded-full border-4 border-white/30 bg-[#1f2937] text-xs font-semibold transition-transform cursor-pointer', pressed && 'scale-95 bg-black')}
        aria-pressed={pressed}
      >
        USER
      </button>
      <span className="text-sm text-white/70">Hold the button to light the LED</span>
    </div>
  );
}
