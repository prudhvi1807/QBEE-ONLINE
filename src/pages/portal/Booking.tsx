import { useMemo, useState } from 'react';
import { CalendarCheck, Cpu, Server, Trash2 } from 'lucide-react';
import { useStore } from '../../lib/store';
import { fmtDate } from '../../lib/portal';
import { Button, cx } from '../../components/ui';
import { Panel, PortalTitle } from './PortalLayout';

// TODO(client): confirm the real remote lab inventory and slot timings.
const RESOURCES = [
  { id: 'eda', name: 'EDA server — Questa licence', icon: Server, for: 'VLSI-102 UVM regressions' },
  { id: 'zynq', name: 'Zynq-class SoC board (remote)', icon: Cpu, for: 'VLSI-105, EDGE-105' },
  { id: 'jetson', name: 'Jetson-class edge AI board (remote)', icon: Cpu, for: 'EDGE-105, EDGE-106' },
  { id: 'stm32', name: 'STM32 bench with logic analyzer', icon: Cpu, for: 'EMB-102, EMB-104' },
];
const SLOTS = ['08:00–10:00', '10:00–12:00', '14:00–16:00', '16:00–18:00', '18:00–20:00', '20:00–22:00'];
const MAX_ACTIVE = 3;

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Deterministic "already taken by others" pattern so the grid looks realistic in preview
const takenByOthers = (res: string, date: string, slot: string) => {
  const h = [...(res + date + slot)].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
  return h % 3 === 0;
};

export default function Booking() {
  const { portal, addBooking, cancelBooking } = useStore();
  const [res, setRes] = useState(RESOURCES[0].id);
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i + 1); return d; }), []);
  const [day, setDay] = useState(iso(days[0]));
  const [msg, setMsg] = useState('');
  const resource = RESOURCES.find((r) => r.id === res)!;
  const mine = portal.bookings;
  const atLimit = mine.length >= MAX_ACTIVE;

  const book = (slot: string) => {
    if (atLimit) return;
    addBooking({ resource: resource.name, date: day, slot });
    setMsg(`Booked ${resource.name} on ${fmtDate(day)}, ${slot}. Connection details are emailed 30 minutes before.`);
  };

  return (
    <>
      <PortalTitle title="Remote lab booking" intro="Reserve time on QBeeMind's boards and EDA servers when your lab needs hardware or licences you don't have." />
      {msg && <p className="mb-5 flex gap-2 rounded-xl border border-ok/30 bg-ok-soft p-4 text-ink" role="status"><CalendarCheck className="h-5 w-5 shrink-0 text-ok" /> {msg}</p>}

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <Panel>
          <fieldset className="border-b border-line p-5">
            <legend className="mb-3 text-sm font-semibold text-ink">1. Choose equipment</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {RESOURCES.map((r) => (
                <label key={r.id} className={cx('flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors', res === r.id ? 'border-ink bg-mist' : 'border-line hover:border-muted')}>
                  <input type="radio" name="res" className="sr-only" checked={res === r.id} onChange={() => setRes(r.id)} />
                  <r.icon className="mt-0.5 h-5 w-5 shrink-0 text-blue" aria-hidden />
                  <span>
                    <span className="block font-semibold text-ink">{r.name}</span>
                    <span className="block text-sm text-muted">For {r.for}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="border-b border-line p-5">
            <legend className="mb-3 text-sm font-semibold text-ink">2. Pick a day</legend>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {days.map((d) => {
                const v = iso(d);
                return (
                  <button key={v} onClick={() => setDay(v)} aria-pressed={day === v} className={cx('w-[68px] shrink-0 rounded-lg border py-2 text-center cursor-pointer', day === v ? 'border-ink bg-ink text-white' : 'border-line hover:border-muted')}>
                    <span className="block text-xs opacity-75">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
                    <span className="block font-display text-[18px] font-bold">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="p-5">
            <p className="mb-3 text-sm font-semibold text-ink">3. Choose a 2-hour slot</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SLOTS.map((s) => {
                const mineHere = mine.some((b) => b.resource === resource.name && b.date === day && b.slot === s);
                const taken = !mineHere && takenByOthers(res, day, s);
                return (
                  <button
                    key={s}
                    disabled={taken || mineHere || atLimit}
                    onClick={() => book(s)}
                    className={cx(
                      'h-12 rounded-lg border text-[15px] font-medium transition-colors cursor-pointer disabled:cursor-not-allowed',
                      mineHere ? 'border-ok bg-ok-soft text-ok' : taken ? 'border-line bg-mist text-muted line-through' : 'border-line text-ink hover:border-ink hover:bg-mist disabled:opacity-50',
                    )}
                  >
                    {mineHere ? 'Your booking' : s}
                  </button>
                );
              })}
            </div>
            {atLimit && <p className="mt-3 text-sm text-warn">You can hold up to {MAX_ACTIVE} upcoming bookings. Cancel one to book another.</p>}
          </div>
        </Panel>

        <Panel title="Your bookings">
          <ul className="divide-y divide-line">
            {mine.map((b) => (
              <li key={b.id} className="flex items-start justify-between gap-3 px-5 py-3.5">
                <span>
                  <span className="block font-medium text-ink">{b.resource}</span>
                  <span className="block text-sm text-muted">{fmtDate(b.date)}, {b.slot}</span>
                </span>
                <Button size="sm" variant="ghost" onClick={() => { cancelBooking(b.id); setMsg(''); }} aria-label={`Cancel ${b.resource} booking`}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
            {!mine.length && <li className="px-5 py-5 text-[15px] text-muted">No upcoming bookings.</li>}
          </ul>
        </Panel>
      </div>
    </>
  );
}
