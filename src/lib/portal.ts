import { COURSES } from '../data/catalog';
import type { Enrollment, Submission } from './store';

export function nextSession(format: Enrollment['format'], from = new Date()) {
  // Placeholder timetable until the batch scheduler API exists.
  const plan: Record<Enrollment['format'], { days: number[]; time: string; label: string }> = {
    'Weekday evenings': { days: [2, 4], time: '19:00', label: 'Live session' },
    Weekend: { days: [6, 0], time: '10:00', label: 'Live session' },
    'Self-paced + mentoring': { days: [3], time: '18:30', label: 'Live doubt-clearing' },
  };
  const p = plan[format];
  let d = new Date(from);
  for (let i = 1; i <= 7; i++) {
    d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    if (p.days.includes(d.getDay())) break;
  }
  return { date: d, time: p.time, label: p.label };
}

export const fmtDate = (d: Date | string) =>
  new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

export interface AssignmentRow {
  key: string;
  code: string;
  moduleIndex: number;
  title: string;
  unlocked: boolean;
  submission?: Submission;
}

export function assignmentsFor(enrollments: Enrollment[], submissions: Record<string, Submission>): AssignmentRow[] {
  return enrollments.flatMap((e) => {
    const c = COURSES.find((x) => x.code === e.code);
    if (!c) return [];
    return c.modules.map((m, i) => {
      const key = `${c.code}:${i}`;
      return { key, code: c.code, moduleIndex: i, title: `Lab ${i + 1}: ${m.title}`, unlocked: e.completed || i <= e.completedModules, submission: submissions[key] };
    });
  });
}

export const progressOf = (e: Enrollment) => {
  const total = COURSES.find((c) => c.code === e.code)?.modules.length ?? 1;
  return e.completed ? 100 : Math.round((Math.min(e.completedModules, total) / total) * 100);
};
