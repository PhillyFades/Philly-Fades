"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { demographics, eligibilityAttestation, referrerRoles, site } from "@/content/site";
import { eventPackages, feePlans, formatDollars, memberships } from "@/content/pricing";
import {
  submitBooking,
  submitEvent,
  submitMembership,
  submitReferral,
  submitVendor,
} from "@/lib/actions";
import { NOT_CONFIGURED_MESSAGE, type ActionResult, type FieldErrors } from "@/lib/types";
import {
  validateBooking,
  validateEvent,
  validateMembership,
  validateReferral,
  validateVendor,
} from "@/lib/validators";

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm text-white" htmlFor={name}>
      <span className="mb-2 block font-medium">{label}</span>
      {children}
      {error ? (
        <span id={`${name}-error`} className="mt-2 block text-sm text-[#ffb4b4]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function inputProps(name: string, error?: string) {
  return {
    id: name,
    name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${name}-error` : undefined,
  } as const;
}

function Notice({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  if (result.ok) {
    return (
      <p role="status" className="rounded-2xl border border-sun/40 bg-sun/10 px-4 py-3 text-sm leading-6 text-white">
        Request received
        {result.id !== "received" ? ` · reference ${result.id.slice(0, 8)}` : ""}. It is saved as a
        request with payment still pending. Mike confirms the time before anyone is charged.
        {result.checkoutUrl ? " Continue to checkout." : ""}
      </p>
    );
  }
  return (
    <p role="alert" className="rounded-2xl border border-[#ffb4b4]/40 bg-[#ffb4b4]/10 px-4 py-3 text-sm leading-6 text-white">
      {result.error}
    </p>
  );
}

function ConfigBanner({ configured }: { configured: boolean }) {
  if (configured) return null;
  return (
    <p className="rounded-2xl border border-gold/40 bg-card px-4 py-3 text-sm leading-6 text-muted">
      {NOT_CONFIGURED_MESSAGE}
    </p>
  );
}

function Honeypot() {
  return (
    <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden>
      <label>
        Company website
        <input name="companyWebsite" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

function useForm<T>(
  validate: (raw: unknown) => { ok: true; value: T } | { ok: false; fieldErrors: FieldErrors },
  action: (value: T) => Promise<ActionResult>,
  onSuccess?: () => void,
) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    for (const element of Array.from(form.elements)) {
      if (element instanceof HTMLInputElement && element.type === "checkbox") {
        raw[element.name] = element.checked ? "true" : "";
      }
    }
    const parsed = validate(raw);
    if (!parsed.ok) {
      setErrors(parsed.fieldErrors);
      setResult({ ok: false, code: "validation", error: "Check the highlighted fields.", fieldErrors: parsed.fieldErrors });
      return;
    }
    setErrors({});
    setPending(true);
    const next = await action(parsed.value);
    setPending(false);
    setResult(next);
    if (!next.ok && next.fieldErrors) setErrors(next.fieldErrors);
    if (next.ok && next.checkoutUrl) {
      window.location.assign(next.checkoutUrl);
      return;
    }
    if (next.ok) {
      form.reset();
      onSuccess?.();
    }
  }

  return { errors, result, pending, onSubmit };
}

function CountySelect({ error, defaultValue }: { error?: string; defaultValue?: string }) {
  return (
    <Field label="County" name="serviceCounty" error={error}>
      <select {...inputProps("serviceCounty", error)} defaultValue={defaultValue ?? ""} required>
        <option value="" disabled>
          Choose a county
        </option>
        {site.counties.map((county) => (
          <option key={county} value={county}>
            {county}
          </option>
        ))}
      </select>
    </Field>
  );
}

function DemographicSelect({ error, defaultValue }: { error?: string; defaultValue?: string }) {
  return (
    <Field label="Demographic category, for anonymized grant counts" name="demographicCategory" error={error}>
      <select {...inputProps("demographicCategory", error)} defaultValue={defaultValue ?? ""} required>
        <option value="" disabled>
          Choose one
        </option>
        {demographics.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

function EligibilityBox({ error }: { error?: string }) {
  return (
    <div>
      <label className="flex items-start gap-3 text-sm leading-6 text-white" htmlFor="eligibilityConfirmed">
        <input
          id="eligibilityConfirmed"
          name="eligibilityConfirmed"
          type="checkbox"
          className="mt-1 h-5 w-5 shrink-0 accent-sun"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "eligibilityConfirmed-error" : "eligibility-help"}
        />
        <span>
          I confirm the person receiving this in-home visit qualifies under Pennsylvania’s statutory
          exemptions: illness, physical disability, a sensory or developmental need, confinement, or
          advanced age that prevents travel to a shop.
        </span>
      </label>
      <p id="eligibility-help" className="mt-2 pl-8 text-sm leading-6 text-muted">
        {eligibilityAttestation}
      </p>
      {error ? (
        <p id="eligibilityConfirmed-error" className="mt-2 pl-8 text-sm text-[#ffb4b4]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function BookingForm({ configured }: { configured: boolean }) {
  const params = useSearchParams();
  const defaultPlan = params.get("plan") ?? "";
  const defaultDemographic = params.get("demographic") ?? "";
  const [onBehalf, setOnBehalf] = useState(false);
  const { errors, result, pending, onSubmit } = useForm(validateBooking, submitBooking, () => setOnBehalf(false));
  const today = useMemo(
    () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date()),
    [],
  );

  return (
    <form onSubmit={onSubmit} className="relative space-y-5" noValidate>
      <ConfigBanner configured={configured} />
      <Notice result={result} />
      <Honeypot />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Name of the person receiving the cut" name="clientName" error={errors.clientName}>
          <input {...inputProps("clientName", errors.clientName)} autoComplete="name" required />
        </Field>
        <Field label="Phone" name="clientPhone" error={errors.clientPhone}>
          <input {...inputProps("clientPhone", errors.clientPhone)} type="tel" autoComplete="tel" />
        </Field>
        <Field label="Email" name="clientEmail" error={errors.clientEmail}>
          <input {...inputProps("clientEmail", errors.clientEmail)} type="email" autoComplete="email" />
        </Field>
        <Field label="Preferred date" name="requestedDate" error={errors.requestedDate}>
          <input {...inputProps("requestedDate", errors.requestedDate)} type="date" min={today} required />
        </Field>
        <Field label="Preferred time" name="requestedTime" error={errors.requestedTime}>
          <input {...inputProps("requestedTime", errors.requestedTime)} type="time" required />
        </Field>
        <CountySelect error={errors.serviceCounty} />
      </div>
      <Field label="Service address" name="serviceAddress" error={errors.serviceAddress}>
        <textarea {...inputProps("serviceAddress", errors.serviceAddress)} rows={3} autoComplete="street-address" required />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <DemographicSelect error={errors.demographicCategory} defaultValue={defaultDemographic} />
        <Field label="Fee or plan" name="feePlan" error={errors.feePlan}>
          <select {...inputProps("feePlan", errors.feePlan)} defaultValue={defaultPlan} required>
            <option value="" disabled>
              Choose a plan
            </option>
            {feePlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <p className="text-sm leading-6 text-muted">
        Example rates. A self-pay request is stored as pending payment until Stripe is connected. Nothing is charged from this form.
      </p>
      <EligibilityBox error={errors.eligibilityConfirmed} />
      <label className="flex items-start gap-3 text-sm leading-6" htmlFor="bookingOnBehalf">
        <input
          id="bookingOnBehalf"
          name="bookingOnBehalf"
          type="checkbox"
          className="mt-1 h-5 w-5 accent-sun"
          checked={onBehalf}
          onChange={(event) => setOnBehalf(event.target.checked)}
        />
        <span>I am booking on behalf of someone (case manager, social worker, nurse, VA coordinator, or family caregiver).</span>
      </label>
      {onBehalf ? (
        <fieldset className="space-y-5 rounded-2xl border border-white/10 p-4">
          <legend className="px-2 text-[11px] uppercase tracking-[0.2em] text-gold">Referrer</legend>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Referrer name" name="referrerName" error={errors.referrerName}>
              <input {...inputProps("referrerName", errors.referrerName)} required={onBehalf} />
            </Field>
            <Field label="Organization" name="referrerOrganization" error={errors.referrerOrganization}>
              <input {...inputProps("referrerOrganization", errors.referrerOrganization)} />
            </Field>
            <Field label="Role" name="referrerRole" error={errors.referrerRole}>
              <select {...inputProps("referrerRole", errors.referrerRole)} defaultValue="" required={onBehalf}>
                <option value="" disabled>
                  Choose a role
                </option>
                {referrerRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Referrer phone or email" name="referrerContact" error={errors.referrerContact}>
              <input {...inputProps("referrerContact", errors.referrerContact)} required={onBehalf} />
            </Field>
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-medium">Pay by</legend>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="radio" name="paymentMethod" value="invoice" className="accent-sun" required={onBehalf} />
                Invoice
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="paymentMethod" value="voucher" className="accent-sun" />
                Voucher
              </label>
            </div>
            {errors.paymentMethod ? <p className="mt-2 text-sm text-[#ffb4b4]">{errors.paymentMethod}</p> : null}
          </fieldset>
        </fieldset>
      ) : (
        <input type="hidden" name="paymentMethod" value="pending_card" />
      )}
      <Field label="Notes for Mike" name="notes" error={errors.notes}>
        <textarea {...inputProps("notes", errors.notes)} rows={4} placeholder="Access notes, sensory needs, who will be home." />
      </Field>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-sun px-6 font-semibold text-ink disabled:opacity-60"
      >
        {pending ? "Sending…" : "Request this house call"}
      </button>
    </form>
  );
}

export function MembershipForm({ configured }: { configured: boolean }) {
  const params = useSearchParams();
  const defaultTier = params.get("tier") ?? memberships[1]?.id ?? "";
  const { errors, result, pending, onSubmit } = useForm(validateMembership, submitMembership);

  return (
    <form onSubmit={onSubmit} className="relative space-y-5" noValidate>
      <ConfigBanner configured={configured} />
      <Notice result={result} />
      <Honeypot />
      <Field label="Membership" name="tierId" error={errors.tierId}>
        <select {...inputProps("tierId", errors.tierId)} defaultValue={defaultTier} required>
          {memberships.map((tier) => (
            <option key={tier.id} value={tier.id}>
              {tier.name} · {formatDollars(tier.priceMonthlyCents)}/mo · {tier.cuts}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Member name" name="fullName" error={errors.fullName}>
          <input {...inputProps("fullName", errors.fullName)} autoComplete="name" required />
        </Field>
        <Field label="Email" name="email" error={errors.email}>
          <input {...inputProps("email", errors.email)} type="email" autoComplete="email" required />
        </Field>
        <Field label="Phone" name="phone" error={errors.phone}>
          <input {...inputProps("phone", errors.phone)} type="tel" autoComplete="tel" required />
        </Field>
        <CountySelect error={errors.serviceCounty} />
      </div>
      <Field label="Home address" name="serviceAddress" error={errors.serviceAddress}>
        <textarea {...inputProps("serviceAddress", errors.serviceAddress)} rows={3} required />
      </Field>
      <DemographicSelect error={errors.demographicCategory} />
      <Field label="Household notes" name="householdNotes" error={errors.householdNotes}>
        <textarea {...inputProps("householdNotes", errors.householdNotes)} rows={3} placeholder="Who else may use an add-on, and any access notes." />
      </Field>
      <EligibilityBox error={errors.eligibilityConfirmed} />
      <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center rounded-full bg-sun px-6 font-semibold text-ink disabled:opacity-60">
        {pending ? "Sending…" : "Request this membership"}
      </button>
    </form>
  );
}

export function EventForm({ configured }: { configured: boolean }) {
  const params = useSearchParams();
  const defaultPackage = params.get("package") ?? "";
  const [locationType, setLocationType] = useState("institution");
  const { errors, result, pending, onSubmit } = useForm(validateEvent, submitEvent, () => setLocationType("institution"));
  const today = useMemo(
    () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date()),
    [],
  );

  return (
    <form onSubmit={onSubmit} className="relative space-y-5" noValidate>
      <ConfigBanner configured={configured} />
      <Notice result={result} />
      <Honeypot />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Contact name" name="contactName" error={errors.contactName}>
          <input {...inputProps("contactName", errors.contactName)} required />
        </Field>
        <Field label="Organization or host" name="organization" error={errors.organization}>
          <input {...inputProps("organization", errors.organization)} required />
        </Field>
        <Field label="Email" name="email" error={errors.email}>
          <input {...inputProps("email", errors.email)} type="email" required />
        </Field>
        <Field label="Phone" name="phone" error={errors.phone}>
          <input {...inputProps("phone", errors.phone)} type="tel" required />
        </Field>
        <Field label="Package" name="packageId" error={errors.packageId}>
          <select {...inputProps("packageId", errors.packageId)} defaultValue={defaultPackage} required>
            <option value="" disabled>
              Choose a package
            </option>
            {eventPackages.map((pack) => (
              <option key={pack.id} value={pack.id}>
                {pack.name} · starting at {formatDollars(pack.startingAtCents)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Event date" name="eventDate" error={errors.eventDate}>
          <input {...inputProps("eventDate", errors.eventDate)} type="date" min={today} required />
        </Field>
        <Field label="Setting" name="locationType" error={errors.locationType}>
          <select
            {...inputProps("locationType", errors.locationType)}
            value={locationType}
            onChange={(event) => setLocationType(event.target.value)}
          >
            <option value="institution">Institution (shelter, senior site, clinic, school)</option>
            <option value="community_site">Community site</option>
            <option value="residence">Private residence</option>
            <option value="other">Other, needs a compliance review</option>
          </select>
        </Field>
        <Field label="Approximate guests" name="guestCount" error={errors.guestCount}>
          <input {...inputProps("guestCount", errors.guestCount)} type="number" min={1} max={500} required />
        </Field>
      </div>
      <Field label="Event address" name="eventLocation" error={errors.eventLocation}>
        <textarea {...inputProps("eventLocation", errors.eventLocation)} rows={3} required />
      </Field>
      <Field label="Notes" name="notes" error={errors.notes}>
        <textarea {...inputProps("notes", errors.notes)} rows={4} />
      </Field>
      <label className="flex items-start gap-3 text-sm leading-6" htmlFor="complianceAcknowledged">
        <input id="complianceAcknowledged" name="complianceAcknowledged" type="checkbox" className="mt-1 h-5 w-5 accent-sun" required />
        <span>
          I understand Buzz Boxx PXV is not a licensed mobile shop. This request will be reviewed under 49 Pa. Code § 3.61 and may be declined if the setting is outside the statute.
        </span>
      </label>
      {errors.complianceAcknowledged ? <p className="text-sm text-[#ffb4b4]">{errors.complianceAcknowledged}</p> : null}
      {locationType === "residence" ? <EligibilityBox error={errors.eligibilityConfirmed} /> : null}
      <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center rounded-full bg-sun px-6 font-semibold text-ink disabled:opacity-60">
        {pending ? "Sending…" : "Request this event"}
      </button>
    </form>
  );
}

export function ReferralForm({
  configured,
  program,
  requestTypes,
  heading,
  intro,
}: {
  configured: boolean;
  program: string;
  requestTypes: { value: string; label: string }[];
  heading: string;
  intro: string;
}) {
  const { errors, result, pending, onSubmit } = useForm(validateReferral, submitReferral);

  return (
    <form onSubmit={onSubmit} className="relative space-y-5" noValidate>
      <div>
        <h2 className="font-display text-3xl leading-none tracking-tight">{heading}</h2>
        <p className="mt-3 text-base leading-7 text-muted">{intro}</p>
      </div>
      <ConfigBanner configured={configured} />
      <Notice result={result} />
      <Honeypot />
      <input type="hidden" name="program" value={program} />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Request type" name="requestType" error={errors.requestType}>
          <select {...inputProps("requestType", errors.requestType)} defaultValue={requestTypes[0]?.value ?? ""} required>
            {requestTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Your name" name="contactName" error={errors.contactName}>
          <input {...inputProps("contactName", errors.contactName)} required />
        </Field>
        <Field label="Organization" name="organization" error={errors.organization}>
          <input {...inputProps("organization", errors.organization)} />
        </Field>
        <Field label="Email" name="email" error={errors.email}>
          <input {...inputProps("email", errors.email)} type="email" />
        </Field>
        <Field label="Phone" name="phone" error={errors.phone}>
          <input {...inputProps("phone", errors.phone)} type="tel" />
        </Field>
        <Field label="Site name" name="siteName" error={errors.siteName}>
          <input {...inputProps("siteName", errors.siteName)} />
        </Field>
      </div>
      <Field label="Site or visit address" name="siteAddress" error={errors.siteAddress}>
        <textarea {...inputProps("siteAddress", errors.siteAddress)} rows={3} required />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Preferred date" name="preferredDate" error={errors.preferredDate}>
          <input {...inputProps("preferredDate", errors.preferredDate)} type="date" />
        </Field>
        <Field label="About how many people" name="headcount" error={errors.headcount}>
          <input {...inputProps("headcount", errors.headcount)} />
        </Field>
      </div>
      <Field label="What do you need?" name="message" error={errors.message}>
        <textarea {...inputProps("message", errors.message)} rows={4} required />
      </Field>
      <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center rounded-full bg-sun px-6 font-semibold text-ink disabled:opacity-60">
        {pending ? "Sending…" : "Send this request"}
      </button>
    </form>
  );
}

export function VendorForm({ configured }: { configured: boolean }) {
  const { errors, result, pending, onSubmit } = useForm(validateVendor, submitVendor);
  return (
    <form onSubmit={onSubmit} className="relative space-y-5" noValidate>
      <ConfigBanner configured={configured} />
      <Notice result={result} />
      <Honeypot />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Organization" name="organization" error={errors.organization}>
          <input {...inputProps("organization", errors.organization)} required />
        </Field>
        <Field label="Your name" name="contactName" error={errors.contactName}>
          <input {...inputProps("contactName", errors.contactName)} required />
        </Field>
        <Field label="Title" name="title" error={errors.title}>
          <input {...inputProps("title", errors.title)} required />
        </Field>
        <Field label="Organization type" name="organizationType" error={errors.organizationType}>
          <select {...inputProps("organizationType", errors.organizationType)} defaultValue="foundation">
            <option value="foundation">Foundation</option>
            <option value="case_management">Case management</option>
            <option value="housing">Housing</option>
            <option value="va">VA / SSVF</option>
            <option value="school">School or rec center</option>
            <option value="health">Health system</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Work email" name="email" error={errors.email}>
          <input {...inputProps("email", errors.email)} type="email" required />
        </Field>
        <Field label="Phone" name="phone" error={errors.phone}>
          <input {...inputProps("phone", errors.phone)} type="tel" required />
        </Field>
      </div>
      <Field label="Counties you cover" name="counties" error={errors.counties}>
        <input {...inputProps("counties", errors.counties)} placeholder="Philadelphia, Montgomery, Chester" required />
      </Field>
      <Field label="Populations you serve" name="populations" error={errors.populations}>
        <input {...inputProps("populations", errors.populations)} />
      </Field>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" name="needsCoi" className="h-5 w-5 accent-sun" />
        We need a certificate of insurance
      </label>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" name="needsW9" className="h-5 w-5 accent-sun" />
        We need a W-9
      </label>
      <Field label="What should a partnership cover?" name="message" error={errors.message}>
        <textarea {...inputProps("message", errors.message)} rows={4} required />
      </Field>
      <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center rounded-full bg-sun px-6 font-semibold text-ink disabled:opacity-60">
        {pending ? "Sending…" : "Submit vendor intake"}
      </button>
    </form>
  );
}
