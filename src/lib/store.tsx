import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { TRACKS, KITS } from '../data/catalog';
import { emptyCart, type CartState } from './pricing';

/* ------------------------------------------------------------------ */
/* Safe storage — the page must still work when storage is blocked.    */
/* ------------------------------------------------------------------ */
function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — keep state in memory only */
  }
}

/* ------------------------------------------------------------------ */
/* Portal data model                                                    */
/* ------------------------------------------------------------------ */
export interface Enrollment {
  code: string;
  format: 'Weekday evenings' | 'Weekend' | 'Self-paced + mentoring';
  startDate: string; // ISO
  completedModules: number;
  completed: boolean;
}

export type SubmissionStatus = 'not-started' | 'submitted' | 'reviewed';
export interface Submission {
  key: string; // `${code}:${moduleIndex}`
  status: SubmissionStatus;
  fileName?: string;
  submittedAt?: string;
  feedback?: string;
  score?: number;
}

export type KitStage = 'Order placed' | 'Tested & configured' | 'Dispatched' | 'Delivered';
export interface KitOrder {
  id: string;
  kitId: string;
  stage: KitStage;
  tracking?: string;
  placedAt: string;
}

export interface Booking {
  id: string;
  resource: string;
  date: string; // YYYY-MM-DD
  slot: string;
}

export interface Student {
  name: string;
  email: string;
  college?: string;
}

interface PortalState {
  enrollments: Enrollment[];
  submissions: Record<string, Submission>;
  kitOrders: KitOrder[];
  bookings: Booking[];
  labsPassed: string[];
}

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return iso(d);
};

/** Demo learner used when Firebase isn't configured, so the client can click through the portal. */
const DEMO_PORTAL: PortalState = {
  enrollments: [
    { code: 'VLSI-101', format: 'Weekday evenings', startDate: addDays(-24), completedModules: 3, completed: false },
    { code: 'VLSI-105', format: 'Weekend', startDate: addDays(-10), completedModules: 1, completed: false },
    { code: 'EMB-101', format: 'Self-paced + mentoring', startDate: addDays(-60), completedModules: 6, completed: true },
  ],
  submissions: {
    'VLSI-101:0': { key: 'VLSI-101:0', status: 'reviewed', fileName: 'half_adder.v', submittedAt: addDays(-20), score: 9, feedback: 'Clean module structure. Name your ports consistently (i_/o_ prefixes) from the next lab.' },
    'VLSI-101:1': { key: 'VLSI-101:1', status: 'reviewed', fileName: 'shift_reg.v', submittedAt: addDays(-13), score: 8, feedback: 'Correct, but you mixed blocking and non-blocking inside one always block — see Module 2 notes.' },
    'VLSI-101:2': { key: 'VLSI-101:2', status: 'submitted', fileName: 'traffic_fsm.sv', submittedAt: addDays(-2) },
    'VLSI-105:0': { key: 'VLSI-105:0', status: 'submitted', fileName: 'lut_report.pdf', submittedAt: addDays(-3) },
  },
  kitOrders: [{ id: 'KIT-24117', kitId: 'fpga-essentials', stage: 'Dispatched', tracking: 'Courier ref. pending from client', placedAt: addDays(-9) }],
  bookings: [{ id: 'BK-1', resource: 'EDA server — Questa licence', date: addDays(2), slot: '18:00–20:00' }],
  labsPassed: [],
};

const EMPTY_PORTAL: PortalState = { enrollments: [], submissions: {}, kitOrders: [], bookings: [], labsPassed: [] };

/* ------------------------------------------------------------------ */
/* Context                                                              */
/* ------------------------------------------------------------------ */
interface Store {
  cart: CartState;
  addCourse: (code: string) => void;
  addCourses: (codes: string[]) => void;
  addTrack: (id: string) => void;
  addKit: (id: string) => void;
  addService: (id: string) => void;
  setAllAccess: (on: boolean) => void;
  removeCourse: (code: string) => void;
  removeKit: (id: string) => void;
  removeService: (id: string) => void;
  clearCart: () => void;
  inCart: (code: string) => boolean;

  student: Student | null;
  signIn: (s: Student, demo?: boolean) => void;
  signOut: () => void;

  portal: PortalState;
  enrollFromCart: (format: Enrollment['format']) => void;
  submitAssignment: (key: string, fileName: string) => void;
  addBooking: (b: Omit<Booking, 'id'>) => void;
  cancelBooking: (id: string) => void;
  markLabPassed: (id: string) => void;
  completeModule: (code: string) => void;

  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(() => {
    const raw = load<Partial<CartState>>('qb.cart', emptyCart);
    return {
      courses: Array.isArray(raw?.courses) ? raw.courses : [],
      kits: Array.isArray(raw?.kits) ? raw.kits : [],
      services: Array.isArray(raw?.services) ? raw.services : [],
      allAccess: Boolean(raw?.allAccess),
    };
  });
  const [student, setStudent] = useState<Student | null>(() => {
    const raw = load<Student | null>('qb.student', null);
    return raw && typeof raw === 'object' && raw.email ? raw : null;
  });
  const [portal, setPortal] = useState<PortalState>(() => {
    const raw = load<Partial<PortalState>>('qb.portal', EMPTY_PORTAL);
    return {
      enrollments: Array.isArray(raw?.enrollments) ? raw.enrollments : [],
      submissions: raw?.submissions && typeof raw.submissions === 'object' ? raw.submissions : {},
      kitOrders: Array.isArray(raw?.kitOrders) ? raw.kitOrders : [],
      bookings: Array.isArray(raw?.bookings) ? raw.bookings : [],
      labsPassed: Array.isArray(raw?.labsPassed) ? raw.labsPassed : [],
    };
  });
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    save('qb.cart', cart);
  }, [cart]);
  useEffect(() => {
    save('qb.student', student);
  }, [student]);
  useEffect(() => {
    save('qb.portal', portal);
  }, [portal]);

  const addCourses = useCallback((codes: string[]) => {
    setCart((c) => ({ ...c, allAccess: false, courses: [...new Set([...c.courses, ...codes])] }));
  }, []);

  const store = useMemo<Store>(
    () => ({
      cart,
      addCourse: (code) => addCourses([code]),
      addCourses,
      addTrack: (id) => {
        const t = TRACKS.find((x) => x.id === id);
        if (t) addCourses(t.codes);
      },
      addKit: (id) => {
        const k = KITS.find((x) => x.id === id);
        if (!k) return;
        setCart((c) => ({ ...c, allAccess: false, kits: [...new Set([...c.kits, id])], courses: c.courses.filter((x) => !k.codes.includes(x)) }));
      },
      addService: (id) => setCart((c) => ({ ...c, services: [...new Set([...c.services, id])] })),
      setAllAccess: (on) => setCart((c) => (on ? { ...c, allAccess: true, courses: [], kits: [] } : { ...c, allAccess: false })),
      removeCourse: (code) => setCart((c) => ({ ...c, courses: c.courses.filter((x) => x !== code) })),
      removeKit: (id) => setCart((c) => ({ ...c, kits: c.kits.filter((x) => x !== id) })),
      removeService: (id) => setCart((c) => ({ ...c, services: c.services.filter((x) => x !== id) })),
      clearCart: () => setCart(emptyCart),
      inCart: (code) => cart.allAccess || cart.courses.includes(code),

      student,
      signIn: (s, demo) => {
        setStudent(s);
        if (demo) setPortal((p) => (p.enrollments.length ? p : DEMO_PORTAL));
      },
      signOut: () => setStudent(null),

      portal,
      enrollFromCart: (format) => {
        const codes = cart.allAccess
          ? ['VLSI-101', 'VLSI-102', 'VLSI-103', 'VLSI-104', 'VLSI-105', 'VLSI-106', 'EMB-101', 'EMB-102', 'EMB-103', 'EMB-104', 'EMB-105', 'EMB-106', 'EDGE-101', 'EDGE-102', 'EDGE-103', 'EDGE-104', 'EDGE-105', 'EDGE-106']
          : [...cart.courses, ...cart.kits.flatMap((id) => KITS.find((k) => k.id === id)?.codes ?? [])];
        setPortal((p) => {
          const have = new Set(p.enrollments.map((e) => e.code));
          const added = [...new Set(codes)].filter((c) => !have.has(c)).map<Enrollment>((code) => ({ code, format, startDate: addDays(7), completedModules: 0, completed: false }));
          const orders = cart.kits.map<KitOrder>((kitId, i) => ({ id: 'KIT-' + (Date.now() % 100000) + i, kitId, stage: 'Order placed', placedAt: iso(today) }));
          return { ...p, enrollments: [...p.enrollments, ...added], kitOrders: [...p.kitOrders, ...orders] };
        });
        setCart(emptyCart);
      },
      submitAssignment: (key, fileName) =>
        setPortal((p) => ({ ...p, submissions: { ...p.submissions, [key]: { key, status: 'submitted', fileName, submittedAt: iso(new Date()) } } })),
      addBooking: (b) => setPortal((p) => ({ ...p, bookings: [...p.bookings, { ...b, id: 'BK-' + Date.now() }] })),
      cancelBooking: (id) => setPortal((p) => ({ ...p, bookings: p.bookings.filter((b) => b.id !== id) })),
      markLabPassed: (id) => setPortal((p) => (p.labsPassed.includes(id) ? p : { ...p, labsPassed: [...p.labsPassed, id] })),
      completeModule: (code) =>
        setPortal((p) => ({
          ...p,
          enrollments: p.enrollments.map((e) => {
            if (e.code !== code) return e;
            const n = Math.min(e.completedModules + 1, 99);
            return { ...e, completedModules: n };
          }),
        })),

      chatOpen,
      setChatOpen,
    }),
    [cart, student, portal, chatOpen, addCourses],
  );

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
}
