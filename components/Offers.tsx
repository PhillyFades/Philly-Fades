import Link from "next/link";
import { eventPackages, formatDollars, memberships } from "@/content/pricing";
import { Card, Eyebrow } from "@/components/ui";

export function MembershipGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {memberships.map((tier) => (
        <Card
          key={tier.id}
          id={tier.id}
          className={tier.featured ? "border-sun/70 shadow-[0_0_0_1px_rgba(255,199,44,0.35)]" : undefined}
        >
          <Eyebrow>{tier.featured ? "Most requested" : "Monthly membership"}</Eyebrow>
          <h3 className="mt-4 font-display text-3xl leading-none">{tier.name}</h3>
          <p className="mt-4 font-display text-4xl leading-none text-sun">
            {formatDollars(tier.priceMonthlyCents)}
            <span className="ml-1 font-sans text-base font-medium text-muted">/mo</span>
          </p>
          <p className="mt-3 text-sm text-gold">{tier.cuts}</p>
          <p className="mt-4 text-base leading-7 text-muted">{tier.summary}</p>
          <ul className="mt-5 space-y-2 text-sm leading-6 text-white">
            {tier.perks.map((perk) => (
              <li key={perk} className="flex gap-2">
                <span aria-hidden className="text-sun">
                  ▸
                </span>
                <span>{perk}</span>
              </li>
            ))}
          </ul>
          <Link
            href={`/memberships/request?plan=${tier.id}`}
            className="mt-6 inline-flex min-h-11 items-center rounded-full bg-sun px-5 text-sm font-semibold text-ink"
          >
            Request {tier.name}
          </Link>
        </Card>
      ))}
    </div>
  );
}

export function EventGrid() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {eventPackages.map((pack) => (
        <Card key={pack.id} id={pack.id} className={pack.featured ? "border-sun/70" : undefined}>
          <Eyebrow>{pack.hours}</Eyebrow>
          <h3 className="mt-4 font-display text-3xl leading-none">{pack.name}</h3>
          <p className="mt-4 font-display text-4xl leading-none text-sun">
            {formatDollars(pack.startingAtCents)}
            <span className="ml-1 font-sans text-base font-medium text-muted">starting at</span>
          </p>
          <p className="mt-3 text-sm text-gold">{pack.barbersOnSite}</p>
          <p className="mt-4 text-base leading-7 text-muted">{pack.summary}</p>
          <ul className="mt-5 space-y-2 text-sm leading-6">
            {pack.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link
            href={`/events?package=${pack.id}#request`}
            className="mt-6 inline-flex min-h-11 items-center rounded-full border border-gold/80 px-5 text-sm font-semibold"
          >
            Inquire
          </Link>
        </Card>
      ))}
    </div>
  );
}
