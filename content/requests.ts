export const requestKinds = [
  {
    id: "community-event",
    label: "Community or private event",
    locationType: "community_site",
    details: [
      { id: "popup", label: "Community pop-up" },
      { id: "private", label: "Private party, wedding, or groomsmen" },
      { id: "sports", label: "Sports team" },
      { id: "festival", label: "Festival" },
    ],
  },
  {
    id: "senior",
    label: "Senior/homebound program",
    locationType: "institution",
    details: [
      { id: "caregiver", label: "Caregiver request" },
      { id: "facility", label: "Senior building or facility" },
    ],
  },
  {
    id: "sensory",
    label: "Special needs/sensory",
    locationType: "other",
    details: [
      { id: "home-visit", label: "Sensory-safe home visit" },
      { id: "coordinator", label: "Support coordinator introduction" },
    ],
  },
  {
    id: "veterans",
    label: "Veterans",
    locationType: "institution",
    details: [
      { id: "coordinator", label: "VA or SSVF coordinator" },
      { id: "housing", label: "Housing-transition visit" },
      { id: "job", label: "Job-readiness cut" },
    ],
  },
  {
    id: "unhoused",
    label: "Unhoused/outreach",
    locationType: "institution",
    details: [
      { id: "popup", label: "Shelter, pantry, or outreach pop-up" },
      { id: "sponsor", label: "Sponsor a Cut" },
    ],
  },
  {
    id: "youth",
    label: "Youth/school",
    locationType: "institution",
    details: [
      { id: "school", label: "School" },
      { id: "rec", label: "Rec center" },
      { id: "back-to-school", label: "Back-to-school block" },
    ],
  },
  {
    id: "corporate",
    label: "Corporate/brand",
    locationType: "community_site",
    details: [
      { id: "workplace", label: "Workplace" },
      { id: "brand", label: "Brand activation" },
    ],
  },
  {
    id: "other",
    label: "Other",
    locationType: "other",
    details: [],
  },
] as const;

export type RequestKindId = (typeof requestKinds)[number]["id"];

const legacyRequestMap: Record<string, { type: RequestKindId; detail?: string }> = {
  "community-popup": { type: "community-event", detail: "popup" },
  "private-party": { type: "community-event", detail: "private" },
  "sports-team": { type: "community-event", detail: "sports" },
  festival: { type: "community-event", detail: "festival" },
  "senior-facility": { type: "senior", detail: "facility" },
  caregiver_scheduling: { type: "senior", detail: "caregiver" },
  facility_block: { type: "senior", detail: "facility" },
  "shelter-outreach": { type: "unhoused", detail: "popup" },
  shelter_popup: { type: "unhoused", detail: "popup" },
  food_pantry: { type: "unhoused", detail: "popup" },
  behavioral_health: { type: "unhoused", detail: "popup" },
  sponsor_a_cut: { type: "unhoused", detail: "sponsor" },
  "school-youth": { type: "youth", detail: "school" },
  school: { type: "youth", detail: "school" },
  rec_center: { type: "youth", detail: "rec" },
  back_to_school: { type: "youth", detail: "back-to-school" },
  corporate: { type: "corporate", detail: "workplace" },
  "brand-activation": { type: "corporate", detail: "brand" },
  sensory_home_visit: { type: "sensory", detail: "home-visit" },
  support_coordinator: { type: "sensory", detail: "coordinator" },
  va_coordinator: { type: "veterans", detail: "coordinator" },
  housing_transition: { type: "veterans", detail: "housing" },
  job_readiness: { type: "veterans", detail: "job" },
  other: { type: "other" },
};

export function findRequestKind(id: string) {
  return requestKinds.find((item) => item.id === id) ?? null;
}

export function requestPath(type?: string | null, detail?: string | null) {
  const direct = findRequestKind(type ?? "");
  const legacy = !direct && type ? legacyRequestMap[type] : undefined;
  const kindId = direct?.id ?? legacy?.type ?? "";
  const detailId = direct ? detail || "" : legacy?.detail || "";
  const params = new URLSearchParams();
  if (kindId) params.set("type", kindId);
  if (detailId) params.set("detail", detailId);
  const query = params.toString();
  return query ? `/request?${query}` : "/request";
}
