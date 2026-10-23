import { Link } from 'react-router-dom';
import { CAREER_PILLARS, COURSES, OUTCOMES_NOTE, ROLE_PATHS } from '../data/catalog';
import { ButtonLink, PageHeader, Section, SectionHead, cx, domainText } from '../components/ui';

export default function Placements() {
  return (
    <>
      <PageHeader
        title="Built for placement, by design"
        intro="We don't promise a job — no honest training provider can — but every part of the programme is built around what actually gets engineers placed."
        crumbs={[{ to: '/', label: 'Home' }, { to: '/placements', label: 'Placements' }]}
      />

      <Section>
        <ol className="grid gap-x-10 gap-y-10 md:grid-cols-2">
          {CAREER_PILLARS.map((p) => (
            <li key={p.title}>
              <h2 className="text-[21px] font-bold">{p.title}</h2>
              <p className="mt-2 text-[16px] text-muted">{p.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="mist">
        <SectionHead title="Learning paths mapped to real job roles" intro="Pick your target role and train for it deliberately." />
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[620px] text-left text-[15px]">
            <thead className="border-b border-line bg-mist text-sm text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Target role</th>
                <th className="px-5 py-3 font-medium">Courses</th>
                <th className="px-5 py-3 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ROLE_PATHS.map((r) => {
                const cs = r.codes.map((c) => COURSES.find((x) => x.code === c)!);
                return (
                  <tr key={r.role}>
                    <td className="px-5 py-3.5 font-semibold text-ink">{r.role}</td>
                    <td className="px-5 py-3.5">
                      {cs.map((c, i) => (
                        <span key={c.code}>
                          {i > 0 && <span className="px-1.5 text-muted">→</span>}
                          <Link to={`/courses/${c.slug}`} className={cx('font-mono text-[13px] font-semibold hover:underline', domainText[c.domain])}>{c.code}</Link>
                        </span>
                      ))}
                    </td>
                    <td className="px-5 py-3.5 text-muted">{cs.reduce((a, c) => a + c.weeks, 0)} weeks</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <h2 className="text-[28px] font-bold">An honest note on outcomes</h2>
            <p className="mt-3 text-[17px] text-muted">{OUTCOMES_NOTE}</p>
          </div>
          <div className="rounded-xl bg-ink p-6 text-white">
            <h3 className="text-[20px] font-bold text-white">The fullest level of career support</h3>
            <p className="mt-2 text-[15px] text-white/75">The All-Access Career Program bundles all 18 courses with the internship and full placement support.</p>
            <ButtonLink to="/programs" className="mt-5">See All-Access</ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
