import { Check, Package } from 'lucide-react';
import { KITS } from '../../data/catalog';
import { useStore, type KitStage } from '../../lib/store';
import { fmtDate } from '../../lib/portal';
import { ButtonLink, cx } from '../../components/ui';
import { Panel, PortalTitle } from './PortalLayout';

const STAGES: { stage: KitStage; body: string }[] = [
  { stage: 'Order placed', body: 'Enrolment and payment confirmed.' },
  { stage: 'Tested & configured', body: 'Board tested and pre-configured for your course labs.' },
  { stage: 'Dispatched', body: 'On its way. Board cost is non-refundable from this point.' },
  { stage: 'Delivered', body: 'Follow the setup guide to connect it to your first lab.' },
];

export default function KitTracking() {
  const { portal } = useStore();
  return (
    <>
      <PortalTitle title="Hardware kits" intro="Track the boards that ship with your course packages." />
      {!portal.kitOrders.length ? (
        <Panel className="p-8 text-center">
          <Package className="mx-auto h-8 w-8 text-muted" />
          <h2 className="mt-3 text-[22px] font-bold">No boards ordered</h2>
          <p className="mt-2 text-muted">Course + board packages ship a tested board for your labs. You can also use your own compatible board.</p>
          <ButtonLink to="/kits" className="mt-5">See packages</ButtonLink>
        </Panel>
      ) : (
        <div className="space-y-5">
          {portal.kitOrders.map((o) => {
            const k = KITS.find((x) => x.id === o.kitId)!;
            const at = STAGES.findIndex((s) => s.stage === o.stage);
            return (
              <Panel key={o.id}>
                <div className="flex flex-col gap-2 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-[19px] font-bold">{k.board}</h2>
                    <p className="text-sm text-muted">{k.name} package, order {o.id}, placed {fmtDate(o.placedAt)}</p>
                  </div>
                  {o.tracking && <p className="text-sm text-muted">Tracking: <span className="font-medium text-ink">{o.tracking}</span></p>}
                </div>
                <ol className="grid gap-0 p-5 sm:grid-cols-4 sm:gap-4">
                  {STAGES.map((s, i) => {
                    const done = i <= at;
                    return (
                      <li key={s.stage} className="relative flex gap-3 pb-5 sm:block sm:pb-0">
                        <div className="flex items-center sm:mb-3">
                          <span className={cx('z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold', done ? 'bg-ok text-white' : 'border-2 border-line bg-white text-muted')}>
                            {done ? <Check className="h-4 w-4" /> : i + 1}
                          </span>
                          {i < STAGES.length - 1 && <span className={cx('hidden h-0.5 flex-1 sm:block', i < at ? 'bg-ok' : 'bg-line')} aria-hidden />}
                        </div>
                        {i < STAGES.length - 1 && <span className={cx('absolute left-[15px] top-8 h-[calc(100%-32px)] w-0.5 sm:hidden', i < at ? 'bg-ok' : 'bg-line')} aria-hidden />}
                        <div>
                          <p className={cx('font-semibold', done ? 'text-ink' : 'text-muted')}>{s.stage}</p>
                          <p className="text-sm text-muted">{s.body}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </Panel>
            );
          })}
        </div>
      )}
    </>
  );
}
