"use client";

import { useEffect, useId, useRef, useState } from "react";
import { resolveSuggestion, suggestAddresses, US_STATES, type AddressSuggestion } from "@/lib/address";
import type { FieldErrors } from "@/lib/types";

export function AddressFields({
  errors,
  legend,
  resetKey = 0,
}: {
  errors: FieldErrors;
  legend: string;
  resetKey?: number;
}) {
  const listId = useId();
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("PA");
  const [zip, setZip] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const skipLookup = useRef(false);

  useEffect(() => {
    setLine1("");
    setLine2("");
    setCity("");
    setState("PA");
    setZip("");
    setSuggestions([]);
    setOpen(false);
  }, [resetKey]);

  useEffect(() => {
    if (skipLookup.current) {
      skipLookup.current = false;
      return;
    }
    const query = line1.trim();
    if (query.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      suggestAddresses(query)
        .then((next) => {
          if (controller.signal.aborted) return;
          setSuggestions(next);
          setOpen(next.length > 0);
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setSuggestions([]);
          setOpen(false);
        });
    }, 300);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [line1]);

  async function choose(suggestion: AddressSuggestion) {
    const parts = await resolveSuggestion(suggestion);
    skipLookup.current = true;
    setLine1(parts.addressLine1);
    if (parts.addressLine2) setLine2(parts.addressLine2);
    setCity(parts.city);
    setState(parts.state || "PA");
    setZip(parts.zip);
    setOpen(false);
    setSuggestions([]);
  }

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-medium text-white">{legend}</legend>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="relative block text-sm text-white md:col-span-2" htmlFor="addressLine1">
          <span className="mb-2 block font-medium">Street address</span>
          <input
            id="addressLine1"
            name="addressLine1"
            value={line1}
            autoComplete="address-line1"
            aria-invalid={errors.addressLine1 ? true : undefined}
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded={open}
            required
            onChange={(event) => setLine1(event.target.value)}
            onFocus={() => {
              if (suggestions.length) setOpen(true);
            }}
          />
          {open ? (
            <ul id={listId} role="listbox" className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-2xl border border-white/10 bg-card py-1 shadow-lg">
              {suggestions.map((item) => (
                <li key={item.id} role="presentation">
                  <button
                    type="button"
                    role="option"
                    className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-sun/10"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => void choose(item)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {errors.addressLine1 ? <span className="mt-2 block text-sm text-[#ffb4b4]">{errors.addressLine1}</span> : null}
        </label>
        <label className="block text-sm text-white" htmlFor="addressLine2">
          <span className="mb-2 block font-medium">Apt, suite, or unit</span>
          <input
            id="addressLine2"
            name="addressLine2"
            value={line2}
            autoComplete="address-line2"
            onChange={(event) => setLine2(event.target.value)}
          />
        </label>
        <label className="block text-sm text-white" htmlFor="city">
          <span className="mb-2 block font-medium">City</span>
          <input
            id="city"
            name="city"
            value={city}
            autoComplete="address-level2"
            aria-invalid={errors.city ? true : undefined}
            required
            onChange={(event) => setCity(event.target.value)}
          />
          {errors.city ? <span className="mt-2 block text-sm text-[#ffb4b4]">{errors.city}</span> : null}
        </label>
        <label className="block text-sm text-white" htmlFor="addressState">
          <span className="mb-2 block font-medium">State</span>
          <select
            id="addressState"
            name="state"
            value={state}
            autoComplete="address-level1"
            aria-invalid={errors.state ? true : undefined}
            onChange={(event) => setState(event.target.value)}
          >
            {US_STATES.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
          {errors.state ? <span className="mt-2 block text-sm text-[#ffb4b4]">{errors.state}</span> : null}
        </label>
        <label className="block text-sm text-white" htmlFor="zip">
          <span className="mb-2 block font-medium">ZIP</span>
          <input
            id="zip"
            name="zip"
            value={zip}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            aria-invalid={errors.zip ? true : undefined}
            required
            onChange={(event) => setZip(event.target.value.replace(/\D/g, "").slice(0, 5))}
          />
          {errors.zip ? <span className="mt-2 block text-sm text-[#ffb4b4]">{errors.zip}</span> : null}
        </label>
      </div>
    </fieldset>
  );
}
