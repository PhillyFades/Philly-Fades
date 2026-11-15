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
        body: "Use the house-call form and turn on booking on behalf of someone. Name the organization if a facility is paying by invoice or voucher. The eligibility checkbox is required, because advanced age or illness that prevents travel to a shop is what Pennsylvania allows for an out-of-shop visit.",
      },
    ],
    bookDemographic: "senior_homebound",
    image: "/images/mike-work-05.webp",
    imageAlt: "A carefully shaped beard from Mike Webb Jr.’s portfolio, the kind of finish used for a calm in-home groom.",
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
        body: "Autistic clients, people with sensory processing differences, and anyone whose disability makes a shop floor unrealistic. The statutory door is incapacitation that keeps someone from traveling to a licensed shop. The form asks a caregiver or the person themselves to confirm that.",
      },
    ],
    bookDemographic: "sensory_developmental",
    image: "/images/mike-work-08.webp",
    imageAlt: "A clean curly cut with a low fade by Mike Webb Jr., finished without a busy background.",
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
      "The visit can happen at home or at a partner site that fits the out-of-shop rule.",
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
      "Reviewed as an institutional out-of-shop visit under the sponsoring shop.",
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
  },
} as const;
