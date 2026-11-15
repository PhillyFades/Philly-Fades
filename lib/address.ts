export type AddressInput = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
};

export type AddressSuggestion = {
  id: string;
  label: string;
  parts: AddressInput;
  provider: "photon" | "google";
  placeId?: string;
};

export const US_STATES = [
  ["AL", "Alabama"],
  ["AK", "Alaska"],
  ["AZ", "Arizona"],
  ["AR", "Arkansas"],
  ["CA", "California"],
  ["CO", "Colorado"],
  ["CT", "Connecticut"],
  ["DE", "Delaware"],
  ["DC", "District of Columbia"],
  ["FL", "Florida"],
  ["GA", "Georgia"],
  ["HI", "Hawaii"],
  ["ID", "Idaho"],
  ["IL", "Illinois"],
  ["IN", "Indiana"],
  ["IA", "Iowa"],
  ["KS", "Kansas"],
  ["KY", "Kentucky"],
  ["LA", "Louisiana"],
  ["ME", "Maine"],
  ["MD", "Maryland"],
  ["MA", "Massachusetts"],
  ["MI", "Michigan"],
  ["MN", "Minnesota"],
  ["MS", "Mississippi"],
  ["MO", "Missouri"],
  ["MT", "Montana"],
  ["NE", "Nebraska"],
  ["NV", "Nevada"],
  ["NH", "New Hampshire"],
  ["NJ", "New Jersey"],
  ["NM", "New Mexico"],
  ["NY", "New York"],
  ["NC", "North Carolina"],
  ["ND", "North Dakota"],
  ["OH", "Ohio"],
  ["OK", "Oklahoma"],
  ["OR", "Oregon"],
  ["PA", "Pennsylvania"],
  ["RI", "Rhode Island"],
  ["SC", "South Carolina"],
  ["SD", "South Dakota"],
  ["TN", "Tennessee"],
  ["TX", "Texas"],
  ["UT", "Utah"],
  ["VT", "Vermont"],
  ["VA", "Virginia"],
  ["WA", "Washington"],
  ["WV", "West Virginia"],
  ["WI", "Wisconsin"],
  ["WY", "Wyoming"],
] as const;

const STATE_BY_NAME = new Map(US_STATES.map(([code, name]) => [name.toLowerCase(), code]));
const STATE_CODES = new Set<string>(US_STATES.map(([code]) => code));

const PHILLY = { lat: 39.9526, lon: -75.1652 };

export function stateCode(value: string) {
  const trimmed = value.trim();
  if (STATE_CODES.has(trimmed.toUpperCase())) return trimmed.toUpperCase();
  return STATE_BY_NAME.get(trimmed.toLowerCase()) ?? "";
}

export function formatAddress(address: AddressInput) {
  const street = [address.addressLine1, address.addressLine2].filter(Boolean).join(", ");
  return `${street}, ${address.city}, ${address.state} ${address.zip}`;
}

export function addressColumns(address: AddressInput) {
  return {
    address_line1: address.addressLine1,
    address_line2: address.addressLine2 || null,
    city: address.city,
    state: address.state,
    zip: address.zip,
  };
}

type PhotonFeature = {
  properties?: {
    osm_id?: number;
    housenumber?: string;
    street?: string;
    name?: string;
    city?: string;
    locality?: string;
    district?: string;
    state?: string;
    postcode?: string;
    countrycode?: string;
  };
};

function photonParts(feature: PhotonFeature): AddressInput | null {
  const props = feature.properties ?? {};
  if (props.countrycode && props.countrycode !== "US") return null;
  const line1 = [props.housenumber, props.street].filter(Boolean).join(" ") || props.name || "";
  const city = props.city || props.locality || props.district || "";
  const state = stateCode(props.state ?? "");
  const zip = (props.postcode ?? "").replace(/\D/g, "").slice(0, 5);
  if (line1.length < 3 || !city) return null;
  return { addressLine1: line1, addressLine2: "", city, state: state || "PA", zip };
}

async function photonSuggest(query: string): Promise<AddressSuggestion[]> {
  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", query);
  url.searchParams.set("lat", String(PHILLY.lat));
  url.searchParams.set("lon", String(PHILLY.lon));
  url.searchParams.set("limit", "6");
  url.searchParams.set("lang", "en");
  const response = await fetch(url);
  if (!response.ok) return [];
  const body = (await response.json()) as { features?: PhotonFeature[] };
  const seen = new Set<string>();
  const suggestions: AddressSuggestion[] = [];
  for (const feature of body.features ?? []) {
    const parts = photonParts(feature);
    if (!parts) continue;
    const label = formatAddress(parts);
    if (seen.has(label)) continue;
    seen.add(label);
    suggestions.push({
      id: `photon-${feature.properties?.osm_id ?? label}`,
      label,
      parts,
      provider: "photon",
    });
  }
  return suggestions.sort((a, b) => Number(b.parts.state === "PA") - Number(a.parts.state === "PA"));
}

type GooglePrediction = {
  placePrediction?: {
    placeId?: string;
    text?: { text?: string };
  };
};

async function googleSuggest(query: string, key: string): Promise<AddressSuggestion[]> {
  const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
    },
    body: JSON.stringify({
      input: query,
      includedRegionCodes: ["us"],
      includedPrimaryTypes: ["street_address", "premise", "subpremise", "route"],
      locationBias: {
        circle: {
          center: { latitude: PHILLY.lat, longitude: PHILLY.lon },
          radius: 40000,
        },
      },
    }),
  });
  if (!response.ok) return [];
  const body = (await response.json()) as { suggestions?: GooglePrediction[] };
  const suggestions: AddressSuggestion[] = [];
  for (const item of body.suggestions ?? []) {
    const placeId = item.placePrediction?.placeId ?? "";
    const label = item.placePrediction?.text?.text ?? "";
    if (!placeId || !label) continue;
    suggestions.push({
      id: `google-${placeId}`,
      label,
      parts: { addressLine1: "", addressLine2: "", city: "", state: "PA", zip: "" },
      provider: "google",
      placeId,
    });
  }
  return suggestions;
}

async function googleResolve(placeId: string, key: string): Promise<AddressInput | null> {
  const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "addressComponents",
    },
  });
  if (!response.ok) return null;
  const body = (await response.json()) as {
    addressComponents?: Array<{ types?: string[]; longText?: string; shortText?: string }>;
  };
  const find = (type: string) => body.addressComponents?.find((part) => part.types?.includes(type));
  const number = find("street_number")?.longText ?? "";
  const route = find("route")?.longText ?? "";
  const line1 = [number, route].filter(Boolean).join(" ");
  const line2 = find("subpremise")?.longText ?? "";
  const city = find("locality")?.longText || find("postal_town")?.longText || find("sublocality")?.longText || "";
  const state = stateCode(find("administrative_area_level_1")?.shortText ?? "") || "PA";
  const zip = (find("postal_code")?.longText ?? "").replace(/\D/g, "").slice(0, 5);
  if (line1.length < 3 || !city) return null;
  return { addressLine1: line1, addressLine2: line2, city, state, zip };
}

export async function suggestAddresses(query: string): Promise<AddressSuggestion[]> {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  if (key) {
    try {
      const google = await googleSuggest(query, key);
      if (google.length) return google;
    } catch {
      // Fall through to the free geocoder when the key is missing a permission or the request is blocked.
    }
  }
  return photonSuggest(query);
}

export async function resolveSuggestion(suggestion: AddressSuggestion): Promise<AddressInput> {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  if (suggestion.provider === "google" && suggestion.placeId && key) {
    try {
      const resolved = await googleResolve(suggestion.placeId, key);
      if (resolved) return resolved;
    } catch {
      return suggestion.parts;
    }
  }
  return suggestion.parts;
}
