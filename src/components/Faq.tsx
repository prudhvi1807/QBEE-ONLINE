import { ChevronDown } from 'lucide-react';

export const FAQS: { q: string; a: string }[] = [
  { q: 'How much does a course cost?', a: 'Every certificate course is ₹15,000. Bundles cost less: any 2 courses are 10% off, any 3 are 15% off, any 4–5 are 20% off, and all six courses in a domain are a flat ₹65,000.' },
  { q: 'Can I pay in instalments?', a: 'Yes. For a single course you can pay 60% at enrolment and 40% before the mid-point of the course. Larger bundles and the All-Access Career Program can be split across instalments by arrangement; bundle pricing applies when the full plan is committed at enrolment.' },
  { q: 'Do you guarantee a job?', a: 'No. QBeeMind provides training, projects and placement assistance — not a placement guarantee. Your result depends on your work and the market. We build every part of the programme around what actually gets engineers placed, and we don’t quote placement percentages we can’t stand behind.' },
  { q: 'Do I need to buy a board?', a: 'No. Boards are optional. Course-plus-board packages cost less than buying the course and board separately, and the board is pre-tested for the labs. If you already own a compatible board, take the course alone at ₹15,000.' },
  { q: 'What if I can’t attend after I pay?', a: 'Fees are refundable up to a short cut-off before the batch start date. After a batch begins, your seat can be transferred to a later batch instead. For board packages, the board cost becomes non-refundable once dispatched. Exact cut-off dates are confirmed in writing at enrolment.' },
  { q: 'Can I take a project or internship without a course?', a: 'Yes. A Guided Project (₹10,000), a 3-month (₹5,000) or 6-month (₹8,000) internship, and Paper-Writing Support (₹5,000) are open to students from any college, on their own or alongside a course.' },
  { q: 'Will you write my paper for me?', a: 'No. Paper-writing support is mentorship and editing of your own work. You remain the author and are responsible for its content. It does not guarantee acceptance by any journal or conference.' },
  { q: 'What do I get at the end?', a: 'A QBeeMind certificate for each course you complete along with its project, plus a consolidated track certificate if you enrolled in a bundle — and a capstone project you can demo and explain.' },
];

export function Faq({ items = FAQS }: { items?: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[17px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
            {f.q}
            <ChevronDown className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <p className="max-w-3xl pb-5 text-[16px] text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
