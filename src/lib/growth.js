import { getCategoryLabel } from "./utils";

export const AUDIENCE_CHANNELS = {
  telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/rank360in",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://wa.me/?text=https://rank360.in",
  newsletter: process.env.NEXT_PUBLIC_NEWSLETTER_URL || "/contact",
};

export const EXAM_HUBS = [
  {
    category: "jee",
    href: "/exams/jee",
    title: "JEE Hub",
    kicker: "Engineering entrance coverage",
    description:
      "Track JEE Main, JEE Advanced, JoSAA counselling, cutoffs, registration windows, and institute-level updates in one place.",
    searchTopics: [
      "JEE Main exam date",
      "JEE Advanced registration",
      "JoSAA round-wise cutoff",
      "NIT admission updates",
    ],
    trustPoints: [
      "Updated with official-source references",
      "Built for scorecard, counselling, and cutoff intent",
      "Links every fresh update back to the hub",
    ],
  },
  {
    category: "neet",
    href: "/exams/neet",
    title: "NEET Hub",
    kicker: "Medical admissions coverage",
    description:
      "Follow NEET UG, NEET PG, MCC counselling, answer keys, scorecards, and reporting timelines with student-friendly summaries.",
    searchTopics: [
      "NEET counselling round 1",
      "MCC seat allotment",
      "NEET scorecard download",
      "medical admission updates",
    ],
    trustPoints: [
      "High-intent updates for counselling season",
      "Covers next-step actions after result notices",
      "Designed for repeat visits during allotment rounds",
    ],
  },
  {
    category: "cuet",
    href: "/exams/cuet",
    title: "CUET Hub",
    kicker: "Central university admissions",
    description:
      "Keep up with CUET exam dates, scorecards, subject-wise strategy, university admissions, and CSAS-linked updates from one hub.",
    searchTopics: [
      "CUET result",
      "CUET syllabus",
      "DU CSAS updates",
      "central university admission news",
    ],
    trustPoints: [
      "Catches both exam and admission intent",
      "Useful for DU, BHU, JNU, and central university tracking",
      "Pairs news with evergreen reference pages",
    ],
  },
  {
    category: "admissions",
    href: "/exams/admissions",
    title: "Admissions Hub",
    kicker: "Counselling and seat allotment",
    description:
      "A single place for counselling rounds, seat allotment, merit lists, branch changes, reporting dates, and application alerts.",
    searchTopics: [
      "college counselling schedule",
      "seat allotment result",
      "admission reporting deadline",
      "merit list update",
    ],
    trustPoints: [
      "Built for conversion-heavy search journeys",
      "Clusters fresh notices and evergreen admission guides",
      "Good fit for AdSense-safe informational traffic",
    ],
  },
];

export const EVERGREEN_GUIDES = [
  {
    slug: "jee-main-2026-exam-date-guide",
    category: "jee",
    title: "JEE Main 2026 Exam Date Guide",
    summary:
      "A compact evergreen page for JEE Main dates, expected timeline, registration rhythm, and what students should prepare before forms open.",
    heroTitle: "JEE Main 2026 Exam Date, Timeline, and Next Steps",
    heroDescription:
      "Use this guide to track the exam calendar, registration windows, admit card flow, and what to prepare before the official notice lands.",
    sections: [
      {
        heading: "What usually happens first",
        body:
          "Students usually start with exam date intent, but the real planning value comes from understanding the full sequence: notification, registration, correction window, city slip, admit card, exam, answer key, result, and counselling.",
      },
      {
        heading: "What to prepare before registration",
        body:
          "Keep photo and signature files ready, verify identity details, track category certificate requirements, and note the list of exam cities you are willing to choose from before the form opens.",
      },
      {
        heading: "Why this page matters",
        body:
          "This page is meant to rank for high-intent date searches while giving students a reliable planning page they can revisit whenever the schedule moves.",
      },
    ],
    faq: [
      {
        question: "Where should students check the final JEE Main exam date?",
        answer:
          "Students should verify the final schedule only on the official NTA JEE Main portal once the notification is live.",
      },
      {
        question: "What should students do before the form opens?",
        answer:
          "Prepare documents, shortlist exam cities, review eligibility rules, and keep a working email and phone number ready for registration.",
      },
    ],
  },
  {
    slug: "neet-2026-counselling-guide",
    category: "neet",
    title: "NEET 2026 Counselling Guide",
    summary:
      "A clear evergreen page for NEET counselling rounds, MCC flow, document preparation, and how students should think about choice filling.",
    heroTitle: "NEET 2026 Counselling: Rounds, Choice Filling, and Documents",
    heroDescription:
      "Understand how counselling usually moves from registration to allotment, reporting, upgrades, and later rounds without losing track of deadlines.",
    sections: [
      {
        heading: "How counselling typically moves",
        body:
          "Counselling intent is deadline-sensitive. Students need a page that explains registration, fee payment, choice filling, seat allotment, reporting, and upgradation in one place.",
      },
      {
        heading: "Documents students should keep ready",
        body:
          "Scorecard, admit card, identity proof, class 10 and 12 documents, category certificate if applicable, and scanned copies that match official format requirements.",
      },
      {
        heading: "How this helps ranking",
        body:
          "This kind of evergreen counselling page targets recurring seasonal demand and supports every fresh NEET counselling news update through internal links.",
      },
    ],
    faq: [
      {
        question: "Is MCC the only counselling body students should track?",
        answer:
          "No. Students should track both MCC and the relevant state counselling authority, because state quota and institutional processes can differ.",
      },
      {
        question: "What is the biggest mistake during counselling?",
        answer:
          "Missing deadlines or entering choices without a realistic priority order causes more damage than most students expect.",
      },
    ],
  },
  {
    slug: "cuet-2026-syllabus-and-admission-guide",
    category: "cuet",
    title: "CUET 2026 Syllabus and Admission Guide",
    summary:
      "An evergreen guide covering CUET prep intent and university admission intent together, so students can connect score strategy with application outcomes.",
    heroTitle: "CUET 2026 Syllabus, Score Use, and Admission Strategy",
    heroDescription:
      "Follow this page for subject planning, score interpretation, and how CUET connects to admissions at major universities.",
    sections: [
      {
        heading: "Why CUET pages need dual intent",
        body:
          "CUET users search for both exam preparation and admissions. Strong pages serve both needs instead of splitting the journey too early.",
      },
      {
        heading: "What students should monitor",
        body:
          "Subject-wise pattern changes, university criteria, application windows, and how institutions use scores for course-level admission.",
      },
      {
        heading: "Why this page is useful long term",
        body:
          "It supports fresh result or admission posts and can stay relevant across multiple cycles with periodic updates.",
      },
    ],
    faq: [
      {
        question: "Should students rely on one CUET page for all universities?",
        answer:
          "No. CUET opens doors broadly, but each university can still have its own application process, subject requirements, and admission rules.",
      },
      {
        question: "What should students do after the scorecard arrives?",
        answer:
          "Map subject-wise performance against target universities, then watch those institutions for programme-specific admissions steps.",
      },
    ],
  },
  {
    slug: "josaa-round-wise-cutoff-guide",
    category: "admissions",
    title: "JoSAA Round-Wise Cutoff Guide",
    summary:
      "A high-intent evergreen page for JoSAA cutoffs, round movement, branch risk, and how students should read seat allocation patterns.",
    heroTitle: "JoSAA Round-Wise Cutoff Guide for IIT, NIT, IIIT, and GFTI Choices",
    heroDescription:
      "Use this guide to understand how cutoffs move across rounds, what branch trade-offs look like, and how to evaluate realistic choices.",
    sections: [
      {
        heading: "What students usually misunderstand",
        body:
          "Many students read one round cutoff as a final truth. In reality, category, quota, institute type, and round movement shape the final picture.",
      },
      {
        heading: "How to read round movement",
        body:
          "Compare branch movement over several rounds, not just the latest round. That gives better signals for freeze, float, and realistic upgrade expectations.",
      },
      {
        heading: "Why this matters for growth",
        body:
          "Cutoff guides attract recurring search demand and support strong ad-safe, informational traffic when the counselling cycle peaks.",
      },
    ],
    faq: [
      {
        question: "Can last round cutoffs predict the current year exactly?",
        answer:
          "No. They help estimate direction and competitiveness, but actual movement depends on seats, candidate behavior, and policy changes.",
      },
      {
        question: "What should students compare before locking choices?",
        answer:
          "Compare branch preference, institute value, home state quota impact, and likely movement across future rounds before freezing a seat.",
      },
    ],
  },
];

export function getExamHubByCategory(category) {
  return EXAM_HUBS.find((hub) => hub.category === category) || null;
}

export function getGuideBySlug(slug) {
  return EVERGREEN_GUIDES.find((guide) => guide.slug === slug) || null;
}

export function getGuidesByCategory(category, { excludeSlug = null, limit = 3 } = {}) {
  return EVERGREEN_GUIDES.filter(
    (guide) => guide.category === category && guide.slug !== excludeSlug
  ).slice(0, limit);
}

export function buildGuideJsonLd(guide, siteUrl) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.heroTitle,
      description: guide.heroDescription,
      articleSection: getCategoryLabel(guide.category),
      author: {
        "@type": "Organization",
        name: "Rank360 Editorial Team",
        url: siteUrl,
      },
      publisher: {
        "@type": "Organization",
        name: "Rank360",
        url: siteUrl,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${siteUrl}/guides/${guide.slug}`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];
}
