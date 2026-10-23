import { ButtonLink, Container } from '../components/ui';

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <h1 className="text-[36px] font-bold">This page doesn't exist</h1>
      <p className="mt-3 text-muted">The link may be old or mistyped. Browse the courses or go back home.</p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink to="/courses">Browse courses</ButtonLink>
        <ButtonLink to="/" variant="outline">Go home</ButtonLink>
      </div>
    </Container>
  );
}
