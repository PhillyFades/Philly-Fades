export type ProgramKey =
  | "seniors_homebound"
  | "sensory"
  | "veterans"
  | "unhoused"
  | "youth";

export const programs = {
  seniors: {
    path: "/seniors-homebound",
    eyebrow: "Homebound senior grooming · Pennsylvania",
    titleBefore: "Grooming is an",
    highlight: "IADL",
    titleAfter: "Keeping it at home keeps people safer.",
    lede: "A haircut is one of the activities of daily living that falls away first when someone cannot get to a shop. Buzz Boxx PXV brings homebound senior grooming across Pennsylvania’s nearby counties, on a caregiver’s schedule, with the sanitation standard of the sponsoring shop.",
    points: [
      "Scheduled with the caregiver, nurse, or building staff who already manages the day.",
      "The visit happens where the person lives, which removes a trip that can raise fall risk.",
      "Hospital-grade sanitation: shop-supplied tools, cleaned as if the cut happened inside Barbers on Broad.",
      "A standing membership keeps the rhythm so grooming does not depend on a good-weather day.",
    ],
    sections: [
      {
        heading: "Less isolation, fewer risky trips",
        body: "When a cut is the reason someone leaves the house, they may skip it for months. Regular grooming at home is a small dignity and a practical one. Family and aides can be in the room. The appointment is logged, so a case file can show that personal care happened.",
      },
      {
        heading: "How a caregiver books",
        body: "Use the house-call form and turn on booking on behalf of someone. Name the organization if a facility is paying by invoice or voucher. Confirm that the person is homebound, ill, or otherwise unable to get to a shop.",
      },
    ],
    bookDemographic: "senior_homebound",
    image: "/images/mike-work-05.webp",
    imageAlt: "A carefully shaped beard from Mike Webb Jr.’s portfolio, the kind of finish used for a calm in-home groom.",
    partnerType: "caregiver_scheduling",
    partnerHeading: "Caregiver or facility request",
    partnerIntro:
      "If you schedule for someone else, or you run a senior building, start here. For a specific day, you can also book a house call and note that you are booking on behalf of someone.",
  },
  sensory: {
    path: "/special-needs-sensory",
    eyebrow: "Sensory-safe haircuts · Philadelphia",
    titleBefore: "A special needs mobile barber who",
    highlight: "does not rush",
    titleAfter: "the room.",
    lede: "Sensory-safe haircuts in Philadelphia start before the clippers do. Mike Webb Jr. offers adaptive barber services at home: quiet tools when the room needs them, a visual schedule, and a patience-first visit with no lobby and no waiting line.",
    points: [
      "Low-stimulation protocol: lights, noise, and scent kept down, with quiet clippers available.",
      "A visual schedule so the person knows each step before it happens.",
      "Patience-first and zero-rush. The visit ends if the room says it should.",
      "At home, where the person already feels safest. A caregiver can stay alongside.",
    ],
    sections: [
      {
        heading: "Adaptive, not a shorter shop visit",
        body: "The goal is a complete cut only when that is kind. Sometimes the win is a lineup and a calm ending. Families can send notes ahead: sounds that are hard, words that help, and whether a cape is tolerable. Those notes stay on the booking, not on a public page.",
      },
      {
        heading: "Who this is for",
        body: "Autistic clients, people with sensory processing differences, and anyone whose disability makes a shop floor unrealistic. A caregiver, or the person themselves, confirms they cannot travel to a shop.",
      },
    ],
    bookDemographic: "sensory_developmental",
    image: "/images/mike-work-08.webp",
    imageAlt: "A clean curly cut with a low fade by Mike Webb Jr., finished without a busy background.",
    partnerType: "sensory_home_visit",
    partnerHeading: "Family or support-coordinator request",
    partnerIntro:
      "Tell Mike what the room needs before the first visit. A parent or a support coordinator can send this.",
  },
  veterans: {
    path: "/veterans-outreach",
    eyebrow: "Veteran community outreach · Philly",
    titleBefore: "A dignity cut for the",
    highlight: "next room",
    titleAfter: "he has to walk into.",
    lede: "Veteran community outreach in Philly, done as trauma-informed grooming. Job-readiness cuts and housing-transition visits for people working with the VA or SSVF, scheduled through the coordinator who already has the trust.",
    points: [
      "Trauma-informed pacing. Mike narrates the next step and keeps the cape loose if that matters.",
      "Job-readiness and interview cuts, including a beard shape that still feels like the person.",
      "Housing-transition readiness with VA and SSVF coordinators, billed by invoice or voucher.",
      "The visit can happen at home or at a partner site.",
    ],
    sections: [
      {
        heading: "Coordinators book it",
        body: "A VA coordinator, case manager, or family member can submit the request. Say who is paying. The person receiving the cut is still named on the dispatch log, and the demographic category is stored so a funder can see anonymized veteran visit counts later.",
      },
      {
        heading: "What the cut is for",
        body: "A clean cut does not replace housing or clinical care. It does change how a person meets a landlord, a hiring manager, or a hearing. That is the work of this program.",
      },
    ],
    bookDemographic: "veteran",
    image: "/images/mike-work-07.webp",
    imageAlt: "A precise high fade by Mike Webb Jr., the kind of finish used for a job-readiness cut.",
    partnerType: "va_coordinator",
    partnerHeading: "Coordinator request",
    partnerIntro:
      "VA, SSVF, and housing partners can ask for a dignity cut or a short block of chairs.",
  },
  unhoused: {
    path: "/unhoused-dignity",
    eyebrow: "Shelter pop-ups · Philadelphia",
    titleBefore: "A chair at the",
    highlight: "shelter",
    titleAfter: "pantry, or behavioral health center.",
    lede: "Mobile pop-ups where people already are: shelters, food pantries, and behavioral health centers. Sponsor a Cut covers a block of chairs. A site lead can request the date. Mike Webb Jr. brings the tools from Barbers on Broad.",
    points: [
      "Pop-ups at shelters, food pantries, and behavioral health centers.",
      "Sponsor a Cut for neighbors who cannot pay.",
      "A sign-in that protects privacy and still gives partners a count.",
      "Mike brings the tools from Barbers on Broad and sets up where the site already is.",
    ],
    sections: [
      {
        heading: "Dignity, not a photo op",
        body: "Guests sit because they want to. No one is required to be photographed. The Community Care Cuts spirit is the same one Philly Fades has named for years: a cut can be the first ordinary good thing in a hard week.",
      },
    ],
    bookDemographic: "unhoused",
    image: "/images/mike-work-06.webp",
    imageAlt: "A finished low fade in the chair, the standard Mike Webb Jr. brings to a pop-up.",
    partnerType: "shelter_popup",
    partnerHeading: "Sponsor a Cut or request a pop-up",
    partnerIntro:
      "Sites can ask for a date. Sponsors can fund a block of chairs. Say which one this is, and where the chair should set up.",
  },
  youth: {
    path: "/youth-mentorship",
    eyebrow: "Youth mentorship · Philadelphia",
    titleBefore: "Confidence starts at the",
    highlight: "neckline",
    titleAfter: "Back-to-school, rec centers, and a barber who stays.",
    lede: "Youth cuts with a mentorship tone. Schools and rec centers can request a block before the first day, a season start, or a night when young people are already in the building. Mike Webb Jr. is the barber in the room.",
    points: [
      "Back-to-school and season-start blocks.",
      "A conversation while the cut happens, not a lecture after it.",
      "School and rec center inquiry, scheduled with the staff who know the young people.",
      "Parents and caregivers can also book a house call when a shop visit is not possible.",
    ],
    sections: [
      {
        heading: "What mentorship looks like here",
        body: "It looks like showing up on time, explaining the cut, and treating a young person as a client with taste. Programs that want a speaking slot can ask. The chair is the program.",
      },
    ],
    bookDemographic: "youth",
    image: "/images/mike-work-03.webp",
    imageAlt: "A curly high fade with a clean neckline from Mike Webb Jr.’s youth portfolio.",
    partnerType: "school",
    partnerHeading: "School or rec center inquiry",
    partnerIntro:
      "Tell us the building, the age range, and whether this is back-to-school, a season start, or a standing night.",
  },
} as const;

export const programCards = [
  {
    href: programs.seniors.path,
    name: "Seniors & homebound",
    serves: "Older adults who cannot get to a shop, and the caregivers or buildings who look after them.",
    summary: "A calm groom at home, on the schedule a caregiver already keeps. One less trip out. The same careful finish as the shop.",
    image: programs.seniors.image,
    imageAlt: programs.seniors.imageAlt,
    linkLabel: "See this program",
  },
  {
    href: programs.sensory.path,
    name: "Sensory & special needs",
    serves: "Autistic clients and anyone whose sensory or developmental need makes a shop floor too much, plus the family beside them.",
    summary: "A quiet, unhurried cut at home. Mike explains each step, keeps the room calm, and stops when the person has had enough.",
    image: programs.sensory.image,
    imageAlt: programs.sensory.imageAlt,
    linkLabel: "See this program",
  },
  {
    href: programs.veterans.path,
    name: "Veterans",
    serves: "Veterans getting ready for an interview, a landlord, or a new room, usually through a VA or housing coordinator.",
    summary: "A dignity cut before the next room he has to walk into. Coordinators can request one person or a short block.",
    image: programs.veterans.image,
    imageAlt: programs.veterans.imageAlt,
    linkLabel: "See this program",
  },
  {
    href: programs.unhoused.path,
    name: "Unhoused dignity",
    serves: "Guests at shelters, food pantries, and behavioral health centers, and the neighbors who sponsor their chairs.",
    summary: "The chair shows up where people already are. Guests sit if they want to. A sponsor can cover the block.",
    image: programs.unhoused.image,
    imageAlt: programs.unhoused.imageAlt,
    linkLabel: "See this program",
  },
  {
    href: programs.youth.path,
    name: "Youth mentorship",
    serves: "Young people at schools and rec centers, and the staff who already know them.",
    summary: "Back-to-school and season-start cuts in the building. The mentorship is the chair: on time, explained, and respectful.",
    image: programs.youth.image,
    imageAlt: programs.youth.imageAlt,
    linkLabel: "See this program",
  },
  {
    href: "/partner",
    name: "Partnerships",
    serves: "Senior facilities, shelters, schools, VA groups, case managers, nonprofits, and event organizers.",
    summary: "You bring the people and the room. Mike brings the chair. Tell us the building, and whether a sponsor is covering the visits.",
    image: "/images/mike-work-04.webp",
    imageAlt: "Curly top with blonde highlights and a tight taper, from Mike Webb Jr.’s portfolio.",
    linkLabel: "Partner with us",
  },
] as const;

export const partnerRequests = [
  {
    program: "seniors_homebound",
    value: "caregiver_scheduling",
    label: "Caregiver scheduling",
    group: "Seniors & homebound",
    heading: programs.seniors.partnerHeading,
    intro: programs.seniors.partnerIntro,
  },
  {
    program: "seniors_homebound",
    value: "facility_block",
    label: "Senior building or facility block",
    group: "Seniors & homebound",
    heading: programs.seniors.partnerHeading,
    intro: programs.seniors.partnerIntro,
  },
  {
    program: "sensory",
    value: "sensory_home_visit",
    label: "Sensory-safe home visit",
    group: "Sensory & special needs",
    heading: programs.sensory.partnerHeading,
    intro: programs.sensory.partnerIntro,
  },
  {
    program: "sensory",
    value: "support_coordinator",
    label: "Support coordinator introduction",
    group: "Sensory & special needs",
    heading: programs.sensory.partnerHeading,
    intro: programs.sensory.partnerIntro,
  },
  {
    program: "veterans",
    value: "va_coordinator",
    label: "VA or SSVF coordinator",
    group: "Veterans",
    heading: programs.veterans.partnerHeading,
    intro: programs.veterans.partnerIntro,
  },
  {
    program: "veterans",
    value: "housing_transition",
    label: "Housing-transition readiness",
    group: "Veterans",
    heading: programs.veterans.partnerHeading,
    intro: programs.veterans.partnerIntro,
  },
  {
    program: "veterans",
    value: "job_readiness",
    label: "Job-readiness cut",
    group: "Veterans",
    heading: programs.veterans.partnerHeading,
    intro: programs.veterans.partnerIntro,
  },
  {
    program: "unhoused",
    value: "shelter_popup",
    label: "Shelter pop-up",
    group: "Unhoused dignity",
    heading: programs.unhoused.partnerHeading,
    intro: programs.unhoused.partnerIntro,
  },
  {
    program: "unhoused",
    value: "food_pantry",
    label: "Food pantry",
    group: "Unhoused dignity",
    heading: programs.unhoused.partnerHeading,
    intro: programs.unhoused.partnerIntro,
  },
  {
    program: "unhoused",
    value: "behavioral_health",
    label: "Behavioral health center",
    group: "Unhoused dignity",
    heading: programs.unhoused.partnerHeading,
    intro: programs.unhoused.partnerIntro,
  },
  {
    program: "unhoused",
    value: "sponsor_a_cut",
    label: "Sponsor a Cut",
    group: "Unhoused dignity",
    heading: programs.unhoused.partnerHeading,
    intro: programs.unhoused.partnerIntro,
  },
  {
    program: "youth",
    value: "school",
    label: "School",
    group: "Youth mentorship",
    heading: programs.youth.partnerHeading,
    intro: programs.youth.partnerIntro,
  },
  {
    program: "youth",
    value: "rec_center",
    label: "Rec center",
    group: "Youth mentorship",
    heading: programs.youth.partnerHeading,
    intro: programs.youth.partnerIntro,
  },
  {
    program: "youth",
    value: "back_to_school",
    label: "Back-to-school block",
    group: "Youth mentorship",
    heading: programs.youth.partnerHeading,
    intro: programs.youth.partnerIntro,
  },
] as const;

export const defaultPartnerIntro =
  "Tell us who the visit is for, where Mike should set up, and whether a facility or a sponsor is covering it. He confirms the time before anyone is on the schedule.";
