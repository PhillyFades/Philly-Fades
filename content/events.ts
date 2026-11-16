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

export const pastEvents = [
  {
    title: "Back 2 Better Youth Haircut Session",
    when: "Summer 2026",
    detail: "Youth haircut session with the Buzz Boxx van, sponsored by C Mitch Pitch Sports Agency.",
    url: "https://www.instagram.com/buzzboxxpxv/reel/DZuboJGhTh-/",
  },
  {
    title: "Divine Insurance Group Free Haircuts",
    when: "Oct 20, 2026",
    detail:
      "Triangle Village, 3701 Brown St, Philadelphia. Free full-service men's cuts and trims/eyebrow services for women, sponsored by Divine Insurance Group with the Back to Better campaign.",
    url: "https://www.instagram.com/buzzboxxpxv/reel/DerXEJtvIIy/",
  },
  {
    title: "Street outreach in the van",
    when: "Summer 2026",
    detail: "Haircuts for neighbors experiencing homelessness.",
    url: "https://www.instagram.com/buzzboxxpxv/reel/DZr1vJ6xDr5/",
  },
] as const;

export const eventPartners = [
  "C Mitch Pitch Sports Agency",
  "Divine Insurance Group",
  "Back to Better campaign",
] as const;
