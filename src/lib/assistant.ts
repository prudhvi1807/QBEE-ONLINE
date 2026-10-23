// QBee assistant — answers from the catalogue data only, so it never invents a price or promise.
// To upgrade to an LLM later, send the user message plus a serialised COURSES/TRACKS/KITS context
// to your backend and keep this as the offline fallback.
import { BATCH_FORMATS, COURSES, KITS, OUTCOMES_NOTE, PROGRAMMES, REFUND_POLICY, ROLE_PATHS, SERVICES, TRACKS } from '../data/catalog';
import { inr, priceCourses } from './pricing';

export interface BotReply {
  text: string;
  links?: { to: string; label: string }[];
  chips?: string[];
}

export const STARTER_CHIPS = ['Which course should I start with?', 'How much do courses cost?', 'Can I pay in instalments?', 'Do you offer internships?', 'Is placement guaranteed?'];

const has = (s: string, ...words: string[]) => words.some((w) => s.includes(w));

const TOPIC_ALIASES: Record<string, string> = {
  verilog: 'VLSI-101', systemverilog: 'VLSI-101', rtl: 'VLSI-101', fsm: 'VLSI-101',
  uvm: 'VLSI-102', verification: 'VLSI-102',
  gdsii: 'VLSI-103', 'physical design': 'VLSI-103', openlane: 'VLSI-103', openroad: 'VLSI-103', floorplan: 'VLSI-103',
  sta: 'VLSI-104', timing: 'VLSI-104',
  fpga: 'VLSI-105', vivado: 'VLSI-105',
  cmos: 'VLSI-106', mosfet: 'VLSI-106', spice: 'VLSI-106',
  'embedded c': 'EMB-101', pointers: 'EMB-101',
  stm32: 'EMB-102', 'arm cortex': 'EMB-102', 'cortex': 'EMB-102', microcontroller: 'EMB-102',
  rtos: 'EMB-103', freertos: 'EMB-103',
  'can bus': 'EMB-104', i2c: 'EMB-104', spi: 'EMB-104', uart: 'EMB-104', protocol: 'EMB-104',
  linux: 'EMB-105', driver: 'EMB-105', kernel: 'EMB-105',
  automotive: 'EMB-106', autosar: 'EMB-106', 'iso 26262': 'EMB-106', safety: 'EMB-106',
  python: 'EDGE-101', 'machine learning': 'EDGE-101', 'scikit': 'EDGE-101',
  'deep learning': 'EDGE-102', cnn: 'EDGE-102', pytorch: 'EDGE-102', tensorflow: 'EDGE-102',
  quantization: 'EDGE-103', pruning: 'EDGE-103', onnx: 'EDGE-103',
  tinyml: 'EDGE-104',
  jetson: 'EDGE-105', accelerator: 'EDGE-105',
  'computer vision': 'EDGE-106', opencv: 'EDGE-106', vision: 'EDGE-106', yolo: 'EDGE-106',
};

function courseReply(code: string): BotReply {
  const c = COURSES.find((x) => x.code === code)!;
  const tracks = TRACKS.filter((t) => t.codes.includes(code) && t.codes.length < 6);
  return {
    text: `${c.code} — ${c.title}. ${c.tagline} It runs ${c.weeks} weeks (about ${c.hours} hours live + lab) and costs ${inr(15000)}. Prerequisites: ${c.prerequisites}. Capstone: ${c.capstone}${tracks.length ? ` It's also part of the ${tracks.map((t) => `${t.name} (${inr(t.bundle)})`).join(' and ')}.` : ''}`,
    links: [{ to: `/courses/${c.slug}`, label: `Open ${c.code}` }],
    chips: ['Can I pay in instalments?', 'Is there a board package?'],
  };
}

export function answer(raw: string): BotReply {
  const s = raw.toLowerCase().trim();

  // 1. Explicit course code
  const code = s.match(/\b(vlsi|emb|edge)[\s-]?(10[1-6])\b/);
  if (code) return courseReply(`${code[1].toUpperCase()}-${code[2]}`);

  // 2. Greetings
  if (/^(hi|hello|hey|namaste|good (morning|evening|afternoon))\b/.test(s)) {
    return { text: 'Hi! I can help you pick a course, explain fees and bundles, or tell you about internships, hardware kits and batch timings. What are you looking for?', chips: STARTER_CHIPS };
  }

  // 3. Talk to a human
  if (has(s, 'advisor', 'human', 'call me', 'counsel', 'talk to', 'contact', 'phone', 'whatsapp', 'email')) {
    return { text: 'An advisor can suggest a path based on your background and confirm batch dates. Leave your number and they’ll call you back.', links: [{ to: '/contact', label: 'Request a call back' }] };
  }

  // 4. Placement / guarantee
  if (has(s, 'placement', 'guarantee', 'job', 'salary', 'hire', 'hiring', 'interview')) {
    return {
      text: `Honestly: ${OUTCOMES_NOTE} What you do get is a capstone project per course, learning paths mapped to job roles, internship options, and resume help, mock interviews and domain interview prep. The All-Access Career Program has the fullest level of support.`,
      links: [{ to: '/placements', label: 'How we prepare you' }],
    };
  }

  // 5. Refunds
  if (has(s, 'refund', 'cancel', 'money back', 'transfer my seat', 'transfer')) {
    return { text: REFUND_POLICY.join(' '), links: [{ to: '/policies', label: 'Full policy' }] };
  }

  // 6. Instalments
  if (has(s, 'instal', 'emi', 'installment', 'part payment', 'pay later', 'upi', 'card', 'payment')) {
    return {
      text: 'For a single course you can pay 60% at enrolment and 40% before the course mid-point — that’s ₹9,000 now and ₹6,000 later. Larger bundles and the All-Access program can be split by arrangement. You can pay by UPI, card or bank transfer.',
      links: [{ to: '/policies', label: 'Payment options' }],
    };
  }

  // 7. Internships / projects / papers
  if (has(s, 'intern', 'project', 'paper', 'publish', 'research')) {
    return {
      text: `You can apply directly, without a full course: ${SERVICES.map((x) => `${x.name} ${inr(x.price)}`).join(', ')}. They’re open to students from any college. For papers, you remain the author — we mentor and edit, we don’t ghost-write.`,
      links: [{ to: '/internships', label: 'Projects & internships' }],
    };
  }

  // 8. Hardware
  if (has(s, 'board', 'kit', 'hardware', 'raspberry', 'arduino', 'nano 33', 'zynq', 'artix', 'nucleo')) {
    return {
      text: `Course + board packages start at ${inr(20000)} (MCU Starter, TinyML Kit) and go up to ${inr(90000)} for the Complete Edge AI Track with a Jetson-class board. Boards are pre-tested for the labs and yours to keep. Already own one? Take the course alone at ${inr(15000)}.`,
      links: [{ to: '/kits', label: 'All 12 packages' }],
    };
  }

  // 9. Batch / schedule
  if (has(s, 'batch', 'schedule', 'timing', 'weekend', 'evening', 'when', 'start date', 'self-paced', 'self paced', 'working professional')) {
    return {
      text: `There are three formats: ${BATCH_FORMATS.map((b) => `${b.name} (${b.timing.toLowerCase()})`).join('; ')}. Upcoming start dates are shared on enrolment.`,
      links: [{ to: '/contact', label: 'Ask for the next batch date' }],
    };
  }

  // 10. Certificates
  if (has(s, 'certificate', 'certification', 'certified')) {
    return { text: 'You get a QBeeMind certificate for each course once you complete it and its capstone project. Bundle learners also get a consolidated track certificate.' };
  }

  // 11. Institutions
  if (has(s, 'college', 'university', 'institution', 'corporate', 'faculty', 'curriculum')) {
    return { text: 'We run university core training programs and build industry-aligned, project-based curricula for institutions and teams.', links: [{ to: '/institutions', label: 'For institutions' }] };
  }

  // 12. Role-based path
  const role = ROLE_PATHS.find((r) => r.role.toLowerCase().split(/[\s/()]+/).filter((w) => w.length > 3 && !['engineer', 'roles', 'entry'].includes(w)).some((w) => s.includes(w)));
  if (role && has(s, 'become', 'engineer', 'role', 'career', 'path', 'want to')) {
    const lines = priceCourses(role.codes);
    const total = lines.reduce((a, l) => a + l.price, 0);
    const weeks = role.codes.reduce((a, c) => a + COURSES.find((x) => x.code === c)!.weeks, 0);
    return {
      text: `For ${role.role}: ${role.codes.join(' → ')}. That’s ${weeks} weeks in total, ${inr(total)}${role.codes.length > 1 ? ` (saving ${inr(role.codes.length * 15000 - total)})` : ''}.`,
      links: role.codes.map((c) => ({ to: `/courses/${c.toLowerCase()}`, label: c })),
    };
  }

  // 13. Beginner
  if (has(s, 'start', 'beginner', 'begin', 'new to', 'fresher', 'no experience', 'first course', 'which course', 'suggest', 'recommend')) {
    return {
      text: 'Start with the foundation course in the domain you want: VLSI-106 (CMOS) or VLSI-101 (Verilog) for chip design, EMB-101 (Embedded C) for firmware, or EDGE-101 (Python & ML) for Edge AI. Tell me the job you want and I’ll map the full path.',
      chips: ['I want to become a verification engineer', 'I want to become a firmware engineer', 'I want to become a TinyML engineer'],
    };
  }

  // 14. Bundles / tracks / prices
  if (has(s, 'bundle', 'track', 'discount', 'offer', 'combo', 'save', 'all access', 'all-access')) {
    return {
      text: `Tracks: 2-course tracks are ${inr(27000)} (save ₹3,000), 3-course tracks are ${inr(38000)} (save ₹7,000), a complete domain is ${inr(65000)}. Build your own: any 2 courses 10% off, any 3 15% off, any 4–5 20% off. The All-Access Career Program is ${inr(165000)} for all 18 courses plus internship and placement support.`,
      links: [{ to: '/programs', label: 'Compare programs' }, { to: '/programs#build', label: 'Bundle calculator' }],
    };
  }
  if (has(s, 'price', 'fee', 'cost', 'how much', 'rate', '₹', 'rupee', 'expensive', 'cheap')) {
    return {
      text: `Every course is ${inr(15000)}. ${PROGRAMMES.slice(1).map((p) => `${p.name}: ${inr(p.price)}`).join('. ')}. Bundles save up to ₹1,05,000.`,
      links: [{ to: '/programs', label: 'Programs & pricing' }],
      chips: ['Can I pay in instalments?', 'What are the tracks?'],
    };
  }

  // 15. Topic / tool keyword
  const alias = Object.keys(TOPIC_ALIASES).sort((a, b) => b.length - a.length).find((k) => new RegExp(`\\b${k}\\b`).test(s));
  if (alias) return courseReply(TOPIC_ALIASES[alias]);

  // 16. Domains
  if (has(s, 'vlsi', 'chip', 'semiconductor')) return { text: 'VLSI has 6 courses: CMOS fundamentals, Verilog RTL, UVM verification, physical design, STA and FPGA. The Complete VLSI Track is ₹65,000.', links: [{ to: '/courses?domain=vlsi', label: 'VLSI courses' }] };
  if (has(s, 'embedded', 'firmware', 'iot')) return { text: 'Embedded Systems has 6 courses: Embedded C, ARM Cortex-M, FreeRTOS, protocols (UART/SPI/I2C/CAN), embedded Linux, and automotive & functional safety.', links: [{ to: '/courses?domain=embedded', label: 'Embedded courses' }] };
  if (has(s, 'edge', ' ai', 'ml', 'artificial')) return { text: 'Edge AI has 6 courses, from Python & ML foundations through deep learning, model optimization, TinyML, SoC/FPGA accelerators and computer vision.', links: [{ to: '/courses?domain=edge', label: 'Edge AI courses' }] };

  if (has(s, 'kits', KITS[0].name.toLowerCase())) return answer('board');

  return {
    text: 'I’m not sure about that one. I can answer questions about courses, fees and bundles, instalments, refunds, batch timings, hardware kits, internships and placements — or connect you with an advisor.',
    chips: STARTER_CHIPS.slice(0, 3),
    links: [{ to: '/contact', label: 'Talk to an advisor' }],
  };
}
