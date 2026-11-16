import Link from "next/link";
import type { ReactNode } from "react";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-gold">
      {children}
    </p>
  );
}

const buttonClass = {
  solid:
    "bg-sun text-ink hover:bg-[#ffd45a] border border-transparent",
  ghost:
    "border border-gold/80 bg-transparent text-white hover:border-white/80",
};

export function Button({
  href,
  children,
  variant = "solid",
  className,
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
  external?: boolean;
}) {
  const classNames = cn(
    "inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-center text-base font-semibold leading-none tracking-tight transition duration-200 hover:-translate-y-0.5",
    buttonClass[variant],
    className,
  );
  if (external) {
    return (
      <a href={href} className={classNames} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classNames}>
      {children}
    </Link>
  );
}

export function IconTile({ children }: { children: ReactNode }) {
  return (
    <span className="gold-gradient inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-ink">
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <article
      id={id}
      className={cn(
        "lift rounded-2xl border border-white/10 bg-card p-6 md:p-8",
        className,
      )}
    >
      {children}
    </article>
  );
}

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5", className)}>{children}</div>;
}

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-20 md:py-28", className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function Gold({ children }: { children: ReactNode }) {
  return <span className="text-sun">{children}</span>;
}

export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 pt-32 pb-16 md:pt-40 md:pb-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(255,199,44,0.16), transparent 55%)",
        }}
      />
      <Container className="relative">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.6rem,6vw,4.75rem)] leading-[0.95] tracking-tight text-white">
          {title}
        </h1>
        {children ? (
          <div className="mt-6 max-w-2xl text-lg leading-[1.6] text-muted">{children}</div>
        ) : null}
      </Container>
    </section>
  );
}

export function DispatchNote() {
  return (
    <p className="rounded-2xl border border-white/10 bg-card px-4 py-3 text-sm leading-6 text-muted">
      Officially dispatched via Barbers on Broad. Wheelchair-accessible host shop at 1220 N Broad St Ste 3, Philadelphia, PA 19121. In-shop chairs book separately.
    </p>
  );
}
