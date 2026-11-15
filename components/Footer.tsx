import Link from "next/link";
import { Logo } from "@/components/Logo";
import { communityLinks, nav, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="h-12 w-24" />
            <p className="font-display text-xl leading-none">
              Buzz Boxx <span className="text-sun">PXV</span>
            </p>
          </div>
          <p className="mt-4 max-w-sm text-base leading-7 text-muted">
            {site.dba}. Premium traveling haircuts by {site.barber}, dispatched from {site.dispatchShop}.
          </p>
          <p className="mt-4 text-sm text-muted">{site.phonePlaceholder}</p>
          <p className="text-sm text-muted">{site.emailPlaceholder}</p>
          <a
            href={site.instagramUrl}
            className="mt-3 inline-block text-sm text-sun hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Instagram {site.instagramHandle}
          </a>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Visit</p>
          <ul className="mt-4 space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-white hover:text-sun">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/book" className="text-sm text-white hover:text-sun">
                Book a house call
              </Link>
            </li>
            <li>
              <Link href="/partner" className="text-sm text-white hover:text-sun">
                Partner with us
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-gold">Community</p>
          <ul className="mt-4 space-y-2">
            {communityLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-white hover:text-sun">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-6 md:flex-row md:items-center md:justify-end">
          <a
            href={site.inShopUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-white/20 px-4 text-sm font-semibold hover:border-gold"
          >
            {site.inShopLabel}
          </a>
        </div>
        <div className="mx-auto w-full max-w-6xl px-5 pb-8 text-xs leading-5 text-muted">
          <p>{site.cancellation}</p>
          <p className="mt-2">© 2026 {site.legalName}. Membership prices on this site are examples until confirmed. Event dates are priced with Mike after the inquiry.</p>
        </div>
      </div>
    </footer>
  );
}
