import type { ReactNode } from "react";

export function PageHeading({ title, lede, action }: { title: string; lede?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-3xl leading-none">{title}</h1>
        {lede ? <p className="mt-1.5 max-w-2xl text-sm leading-5 text-muted">{lede}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function RecordCard({ children }: { children: ReactNode }) {
  return <article className="flex flex-col rounded-xl border border-white/10 bg-card p-3">{children}</article>;
}

export function RecordGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

export function ReadOnlyGrid({ children }: { children: ReactNode }) {
  return <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 lg:grid-cols-3">{children}</dl>;
}

export function ReadOnlyField({ label, value, wide }: { label: string; value?: ReactNode; wide?: boolean }) {
  const empty = value == null || value === "";
  return (
    <div className={wide ? "col-span-2 lg:col-span-3" : "min-w-0"}>
      <dt className="text-[10px] uppercase tracking-[0.14em] text-gold">{label}</dt>
      <dd className="mt-0.5 break-words text-sm leading-5 text-white">{empty ? "—" : value}</dd>
    </div>
  );
}

export function Badge({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "sun" | "muted" }) {
  const tones = {
    gold: "border-gold/40 text-gold",
    sun: "border-sun/40 text-sun",
    muted: "border-white/15 text-muted",
  };
  return <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${tones[tone]}`}>{children}</span>;
}

export function AdminFields({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 items-end gap-2.5 sm:grid-cols-3">{children}</div>;
}

export function AdminCheckRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-x-4 gap-y-2">{children}</div>;
}

export function AdminCheck({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-white">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      {label}
    </label>
  );
}

type FieldWidth = "narrow" | "full";

export function AdminField({
  label,
  name,
  defaultValue,
  value,
  onValue,
  type = "text",
  options,
  rows,
  width = "full",
  span,
  required,
  placeholder,
  inputMode,
  autoComplete,
  minLength,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  value?: string;
  onValue?: (value: string) => void;
  type?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  width?: FieldWidth;
  span?: 1 | 2 | 3;
  required?: boolean;
  placeholder?: string;
  inputMode?: "decimal" | "text" | "email" | "tel";
  autoComplete?: string;
  minLength?: number;
}) {
  const spanClass = span === 3 ? "col-span-2 sm:col-span-3" : span === 2 ? "col-span-2" : "";
  const widthClass = width === "narrow" ? "max-w-[9.5rem]" : "";
  const controlled = value !== undefined;
  return (
    <label className={`block text-xs text-muted ${spanClass} ${widthClass}`}>
      {label}
      {options ? (
        <select name={name} defaultValue={defaultValue == null ? "" : String(defaultValue)} required={required} className="mt-1">
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : rows ? (
        <textarea
          name={name}
          rows={rows}
          defaultValue={defaultValue == null ? "" : String(defaultValue)}
          required={required}
          placeholder={placeholder}
          className="mt-1"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
          minLength={minLength}
          className="mt-1"
          {...(controlled
            ? { value, onChange: (event: { target: { value: string } }) => onValue?.(event.target.value) }
            : { defaultValue: defaultValue == null ? "" : String(defaultValue) })}
        />
      )}
    </label>
  );
}

export function yesNo(value: boolean | null | undefined) {
  if (value == null) return "—";
  return value ? "Yes" : "No";
}
