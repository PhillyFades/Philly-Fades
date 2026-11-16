import { Button, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-40">
      <p className="text-[11px] uppercase tracking-[0.2em] text-gold">404</p>
      <h1 className="mt-4 font-display text-5xl leading-none">That page is not on the route.</h1>
      <p className="mt-4 max-w-lg text-muted">The chair is still available. Start from the home page or book a house call.</p>
      <div className="mt-8">
        <Button href="/">Back home</Button>
      </div>
    </Container>
  );
}
