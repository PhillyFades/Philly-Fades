export const eventTypes = [
  {
    id: "community-popup",
    name: "Community pop-up",
    locationType: "community_site",
    summary: "A neighborhood day where people already gather.",
  },
  {
    id: "senior-facility",
    name: "Senior facility",
    locationType: "institution",
    summary: "A building where residents cannot easily get to a shop.",
  },
  {
    id: "shelter-outreach",
    name: "Shelter and outreach",
    locationType: "institution",
    summary: "Shelters, pantries, and outreach sites.",
  },
  {
    id: "school-youth",
    name: "School or youth program",
    locationType: "institution",
    summary: "Schools, rec centers, and youth nights.",
  },
  {
    id: "corporate",
    name: "Corporate or workplace",
    locationType: "institution",
    summary: "An office, warehouse, or staff day.",
  },
  {
    id: "brand-activation",
    name: "Brand activation",
    locationType: "community_site",
    summary: "A hosted chair inside a larger activation.",
  },
  {
    id: "private-party",
    name: "Private party, wedding, or groomsmen",
    locationType: "other",
    summary: "A closed guest list. Mike confirms the setting before he holds the date.",
  },
  {
    id: "sports-team",
    name: "Sports team",
    locationType: "community_site",
    summary: "A locker room, clubhouse, or team facility.",
  },
  {
    id: "festival",
    name: "Festival",
    locationType: "community_site",
    summary: "A festival or outdoor gathering with a place to set the van.",
  },
  {
    id: "other",
    name: "Something else",
    locationType: "other",
    summary: "Describe the room in the notes. Mike will say if the van can do it.",
  },
] as const;

export type EventTypeId = (typeof eventTypes)[number]["id"];

export function findEventType(id: string) {
  return eventTypes.find((item) => item.id === id) ?? null;
}

/**
 * The old Philly Fades site did not name specific past events, dates, or clients.
 * These cards are blanks for the client. Photos are Mike’s existing portfolio, not event documentation.
 */
export const pastEventPlaceholders = [
  {
    title: "Event name: add later",
    when: "Date: add later",
    detail: "Client and story: add later. This card is a placeholder.",
    image: "/images/mike-work-06.webp",
    imageAlt: "A finished low fade in the chair from Mike Webb Jr.’s Philly Fades portfolio.",
    photoNote: "Photo is from Mike Webb Jr.’s Philly Fades portfolio, not a documented event.",
  },
  {
    title: "Event name: add later",
    when: "Date: add later",
    detail: "Client and story: add later. This card is a placeholder.",
    image: "/images/mike-work-02.webp",
    imageAlt: "A tight skin fade with a short beard from Mike Webb Jr.’s Philly Fades portfolio.",
    photoNote: "Photo is from Mike Webb Jr.’s Philly Fades portfolio, not a documented event.",
  },
  {
    title: "Event name: add later",
    when: "Date: add later",
    detail: "Client and story: add later. This card is a placeholder.",
    image: "/images/mike-work-01.webp",
    imageAlt: "A textured crop with a mid fade from Mike Webb Jr.’s Philly Fades portfolio.",
    photoNote: "Photo is from Mike Webb Jr.’s Philly Fades portfolio, not a documented event.",
  },
] as const;

export const upcomingEventPlaceholders = [
  {
    title: "Event name: add later",
    when: "Date: add later",
    place: "Place: add later",
  },
  {
    title: "Event name: add later",
    when: "Date: add later",
    place: "Place: add later",
  },
] as const;
