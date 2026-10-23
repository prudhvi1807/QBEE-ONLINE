import { AUDIENCES, OFFERINGS } from '../data/catalog';
import { ButtonLink, PageHeader, Section } from '../components/ui';

export default function About() {
  return (
    <>
      <PageHeader
        title="Learn by building what the industry ships"
        intro="QBeeMind Solutions is a technology training and services company focused on the hardware-software core of modern electronics: VLSI design, embedded systems, and Edge AI."
        crumbs={[{ to: '/', label: 'Home' }, { to: '/about', label: 'About us' }]}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-[28px] font-bold">Our belief is simple</h2>
            <p className="mt-4 text-[17px] text-text">
              People learn engineering by doing engineering. Every program we run is organized around building, testing, and debugging real systems, so that what a learner walks away with is working knowledge, not just a certificate.
            </p>
            <p className="mt-4 text-[17px] text-text">
              Theory matters, but it sticks when it's tied to a problem you have to solve. Learners work through actual design and implementation challenges, make mistakes, debug, and iterate. By the end, they don't just know the concepts; they've used them.
            </p>
          </div>
          <div>
            <h2 className="text-[28px] font-bold">Who we work with</h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {AUDIENCES.map((a) => (
                <li key={a.title} className="py-4">
                  <h3 className="font-sans text-[17px] font-semibold text-ink">{a.title}</h3>
                  <p className="mt-1 text-[15px] text-muted">{a.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
      <Section tone="mist">
        <h2 className="text-[28px] font-bold">What we offer</h2>
        <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {OFFERINGS.map((o) => (
            <div key={o.title}>
              <h3 className="text-[20px] font-bold">{o.title}</h3>
              <p className="mt-2 text-[16px] text-muted">{o.body}</p>
            </div>
          ))}
        </div>
        <ButtonLink to="/contact" className="mt-10">Get in touch</ButtonLink>
      </Section>
    </>
  );
}
