import { site } from "@/content/site";

export function ComplianceStatement() {
  return (
    <div className="space-y-4 text-lg leading-[1.6] text-muted">
      <p>
        Pennsylvania does not license mobile barbershops. {site.name} is not a rolling shop. House
        calls and partner-site cuts are out-of-shop services, performed by {site.barber} under the
        sponsorship of {site.dispatchShop} at {site.dispatchAddress}, the way{" "}
        <span className="text-white">49 Pa. Code § 3.61</span> describes them.
      </p>
      <ol className="list-decimal space-y-3 pl-5">
        <li>
          A licensed barber works under the sponsoring shop, and only within the Barbers’ License
          Law limits cited by the regulation: sickness, incapacitation, confinement, and other
          emergencies. That is the door for illness, disability, sensory or developmental need,
          confinement, and advanced age that keeps someone from traveling to a shop.
        </li>
        <li>Supplies and equipment for the visit come from {site.dispatchShop}.</li>
        <li>
          The appointment is written into the dispatch log kept for the sponsoring shop, and that
          record can be shown to a Commonwealth inspector.
        </li>
        <li>
          Sanitation follows the shop rule in § 3.55, because § 3.61 holds an out-of-shop visit to
          the same standard as a cut inside the shop.
        </li>
      </ol>
    </div>
  );
}
