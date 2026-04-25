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

  // ── Additional high-intent evergreen guides ────────────────────

  {
    slug: "jee-main-eligibility-criteria-guide",
    category: "jee",
    title: "JEE Main Eligibility Criteria — Complete Guide",
    summary:
      "Everything students need to know about JEE Main eligibility: age limit, qualifying exam requirements, number of attempts, and category-wise rules.",
    heroTitle: "JEE Main Eligibility Criteria: Age, Attempts, and Qualifying Marks",
    heroDescription:
      "Check eligibility before filling the form — age limit, class 12 requirements, attempt count, and category-specific rules explained clearly.",
    sections: [
      {
        heading: "Age and qualifying exam requirements",
        body:
          "Students must have passed class 12 or equivalent with Physics, Chemistry, and Mathematics. There is no upper age limit for JEE Main as of the latest NTA guidelines, but students should verify the current notification.",
      },
      {
        heading: "Number of attempts",
        body:
          "Students can attempt JEE Main up to three consecutive years after passing class 12. Each year has two sessions, so the total attempt window is six sessions across three years.",
      },
      {
        heading: "Category-wise rules",
        body:
          "SC, ST, and PwD candidates may have relaxed qualifying marks. Always check the official NTA notification for the current cycle as rules can change.",
      },
    ],
    faq: [
      {
        question: "Can a student who passed class 12 in 2023 appear for JEE Main 2026?",
        answer:
          "Yes, provided they have not exhausted their three-year attempt window. Students who passed in 2023 can appear in 2024, 2025, and 2026.",
      },
      {
        question: "Is there a minimum percentage required in class 12 for JEE Main?",
        answer:
          "There is no minimum percentage for appearing in JEE Main, but for admission to NITs and IIITs through JoSAA, students need at least 75% in class 12 (65% for SC/ST).",
      },
    ],
  },

  {
    slug: "jee-advanced-registration-guide",
    category: "jee",
    title: "JEE Advanced Registration — Step-by-Step Guide",
    summary:
      "How to register for JEE Advanced: eligibility cutoff from JEE Main, registration steps, fee payment, and what to keep ready before the window opens.",
    heroTitle: "JEE Advanced Registration: Cutoff, Steps, and Documents",
    heroDescription:
      "Only the top 2.5 lakh JEE Main qualifiers can register for JEE Advanced. Here is what to do the moment results are out.",
    sections: [
      {
        heading: "Who can register",
        body:
          "Only candidates who qualify JEE Main and fall within the top 2.5 lakh rank (category-wise) are eligible. The cutoff rank is announced with JEE Main results.",
      },
      {
        heading: "Registration steps",
        body:
          "Log in to the JEE Advanced portal using JEE Main roll number, fill personal and academic details, upload documents, pay the registration fee, and download the confirmation page.",
      },
      {
        heading: "What to keep ready",
        body:
          "JEE Main scorecard, class 10 and 12 certificates, category certificate if applicable, passport-size photo, and a scanned signature in the required format.",
      },
    ],
    faq: [
      {
        question: "Can a student who appeared in JEE Main but did not qualify register for JEE Advanced?",
        answer:
          "No. Only candidates within the top 2.5 lakh rank in JEE Main are eligible to register for JEE Advanced.",
      },
      {
        question: "How many times can a student appear for JEE Advanced?",
        answer:
          "A student can appear for JEE Advanced a maximum of two times in two consecutive years.",
      },
    ],
  },

  {
    slug: "neet-ug-eligibility-and-preparation-guide",
    category: "neet",
    title: "NEET UG Eligibility and Preparation Guide",
    summary:
      "NEET UG eligibility rules, subject requirements, attempt limits, and a practical preparation framework for students targeting MBBS and BDS admissions.",
    heroTitle: "NEET UG Eligibility, Attempt Limit, and Preparation Strategy",
    heroDescription:
      "Understand who can appear for NEET UG, how many times, and what a realistic preparation plan looks like for medical aspirants.",
    sections: [
      {
        heading: "Eligibility basics",
        body:
          "Students must have passed class 12 with Physics, Chemistry, and Biology/Biotechnology. The minimum age is 17 years at the time of admission. There is no upper age limit as per the Supreme Court ruling.",
      },
      {
        heading: "Attempt limit",
        body:
          "There is currently no cap on the number of NEET UG attempts. Students can appear every year until they secure admission or choose to stop.",
      },
      {
        heading: "Preparation framework",
        body:
          "NCERT is the foundation for all three subjects. Biology carries 360 marks out of 720 — it is the highest-weight subject and the most predictable. Physics and Chemistry require concept clarity and formula application.",
      },
    ],
    faq: [
      {
        question: "Is NEET UG required for all MBBS colleges in India?",
        answer:
          "Yes. NEET UG is mandatory for admission to all government and private MBBS, BDS, AYUSH, and nursing colleges in India.",
      },
      {
        question: "What is the minimum score needed to qualify NEET UG?",
        answer:
          "The qualifying percentile is 50th for general category and 40th for SC/ST/OBC. The actual cutoff score varies each year based on difficulty and number of candidates.",
      },
    ],
  },

  {
    slug: "neet-pg-counselling-guide",
    category: "neet",
    title: "NEET PG Counselling — MCC and State Quota Guide",
    summary:
      "How NEET PG counselling works: MCC rounds, state quota process, choice filling strategy, and what MBBS graduates need to prepare before registration opens.",
    heroTitle: "NEET PG Counselling: MCC Rounds, State Quota, and Choice Filling",
    heroDescription:
      "Navigate NEET PG counselling from registration to seat allotment — MCC process, state quota differences, and how to fill choices strategically.",
    sections: [
      {
        heading: "MCC vs state quota",
        body:
          "MCC conducts counselling for 50% All India Quota seats in government colleges and 100% seats in central and deemed universities. The remaining 50% state quota seats are filled by respective state counselling authorities.",
      },
      {
        heading: "Choice filling strategy",
        body:
          "Fill choices in order of genuine preference, not just rank safety. Consider specialisation, college reputation, bond requirements, and location before locking choices.",
      },
      {
        heading: "Documents to prepare",
        body:
          "MBBS degree and mark sheets, internship completion certificate, NEET PG scorecard, category certificate if applicable, and identity proof.",
      },
    ],
    faq: [
      {
        question: "Can a candidate participate in both MCC and state counselling?",
        answer:
          "Yes, but if a candidate accepts a seat through MCC, they may need to withdraw from state counselling depending on the state's rules.",
      },
      {
        question: "What happens if a candidate does not report after seat allotment?",
        answer:
          "Non-reporting forfeits the seat and the security deposit. The candidate may also be barred from future rounds depending on the counselling authority's rules.",
      },
    ],
  },

  {
    slug: "cuet-subject-selection-guide",
    category: "cuet",
    title: "CUET Subject Selection Guide — Which Subjects to Choose",
    summary:
      "How to pick the right CUET subjects for your target universities and programmes, with a breakdown of domain subjects, language requirements, and general test strategy.",
    heroTitle: "CUET Subject Selection: Domain Subjects, Languages, and General Test",
    heroDescription:
      "Choosing the wrong subjects in CUET can close doors to your target university. Here is how to map subjects to programmes correctly.",
    sections: [
      {
        heading: "How CUET subjects work",
        body:
          "CUET has three sections: language tests, domain-specific subjects, and a general test. Universities specify which combination they accept for each programme.",
      },
      {
        heading: "How to map subjects to programmes",
        body:
          "Check the admission criteria of each target university before selecting subjects. A student applying for B.Com at DU needs different subjects than one applying for B.Sc. Physics at BHU.",
      },
      {
        heading: "General test strategy",
        body:
          "The general test is required by many universities for humanities and social science programmes. It covers reasoning, general knowledge, and quantitative aptitude.",
      },
    ],
    faq: [
      {
        question: "Can a student change CUET subjects after registration?",
        answer:
          "Subject changes are allowed only during the correction window. After that, the selected subjects are final.",
      },
      {
        question: "How many domain subjects can a student choose in CUET?",
        answer:
          "Students can choose up to six domain subjects. Most programmes require two to three, so choosing more gives flexibility across multiple universities.",
      },
    ],
  },

  {
    slug: "du-csas-admission-guide",
    category: "cuet",
    title: "DU CSAS Admission Guide — CUET to Seat Allotment",
    summary:
      "How Delhi University's CSAS portal works: CUET score submission, programme preference filling, round-wise allotment, and reporting steps for DU admissions.",
    heroTitle: "DU CSAS: From CUET Score to Seat Allotment in Delhi University",
    heroDescription:
      "Step-by-step guide to DU CSAS — how to register, fill programme preferences, understand round movement, and complete admission after allotment.",
    sections: [
      {
        heading: "What CSAS is",
        body:
          "CSAS (Common Seat Allocation System) is DU's centralised admission portal. Students submit CUET scores, fill programme and college preferences, and receive allotments through multiple rounds.",
      },
      {
        heading: "How rounds work",
        body:
          "CSAS runs multiple rounds. In each round, students can accept, upgrade, or withdraw. Accepting a seat in an early round does not prevent upgrading to a better option in later rounds.",
      },
      {
        heading: "Reporting after allotment",
        body:
          "After final allotment, students must report to the allotted college with original documents within the deadline. Missing the reporting window forfeits the seat.",
      },
    ],
    faq: [
      {
        question: "Can a student apply to DU without CUET?",
        answer:
          "No. DU uses CUET scores exclusively for undergraduate admissions. There is no direct admission without a valid CUET score.",
      },
      {
        question: "What is the difference between CSAS round 1 and round 2?",
        answer:
          "Round 1 allots seats based on initial preferences. Round 2 allows students who accepted a seat to upgrade to a higher preference if seats are available.",
      },
    ],
  },

  {
    slug: "josaa-choice-filling-strategy-guide",
    category: "admissions",
    title: "JoSAA Choice Filling Strategy — IIT, NIT, IIIT Guide",
    summary:
      "How to fill JoSAA choices strategically: understanding freeze, float, and slide options, reading previous year cutoffs, and avoiding common mistakes during counselling.",
    heroTitle: "JoSAA Choice Filling: Freeze, Float, Slide, and Cutoff Strategy",
    heroDescription:
      "Smart choice filling in JoSAA can mean the difference between your preferred branch and a fallback. Here is how to approach it.",
    sections: [
      {
        heading: "Freeze, float, and slide explained",
        body:
          "Freeze means accepting the current allotment and not participating in further upgrades. Float means accepting the current seat but remaining in the pool for a better option. Slide means accepting the current institute but trying for a better branch within the same institute.",
      },
      {
        heading: "How to use previous year cutoffs",
        body:
          "Previous year cutoffs give a directional estimate, not a guarantee. Compare opening and closing ranks across multiple years to understand the range, not just the last year's closing rank.",
      },
      {
        heading: "Common mistakes",
        body:
          "Filling too few choices, not including safe options, or prioritising institute over branch without thinking through career implications are the most common errors.",
      },
    ],
    faq: [
      {
        question: "How many choices should a student fill in JoSAA?",
        answer:
          "There is no fixed number, but filling 20 to 40 well-researched choices across institutes and branches gives a good balance of aspiration and safety.",
      },
      {
        question: "Can a student exit JoSAA after accepting a seat?",
        answer:
          "Yes, but exiting after accepting a seat forfeits the seat fee. Students should only exit if they have a confirmed admission elsewhere.",
      },
    ],
  },

  {
    slug: "exam-result-scorecard-download-guide",
    category: "results",
    title: "How to Download Exam Scorecards — JEE, NEET, CUET Guide",
    summary:
      "Step-by-step instructions for downloading JEE Main, JEE Advanced, NEET UG, and CUET scorecards from official portals, with tips for saving and verifying details.",
    heroTitle: "Scorecard Download Guide: JEE Main, NEET, CUET, and JEE Advanced",
    heroDescription:
      "Official scorecard download steps for every major entrance exam — what to check, how to save, and what to do if details are wrong.",
    sections: [
      {
        heading: "JEE Main scorecard",
        body:
          "Log in to jeemain.nta.nic.in with application number and date of birth. The scorecard shows NTA score, percentile, and All India Rank. Download and save as PDF immediately.",
      },
      {
        heading: "NEET UG scorecard",
        body:
          "Available on neet.nta.nic.in after results are declared. Shows subject-wise marks, total score, percentile, and All India Rank. Required for all counselling registrations.",
      },
      {
        heading: "What to verify on the scorecard",
        body:
          "Check name spelling, date of birth, category, and marks carefully. Any discrepancy must be reported to NTA within the correction window — errors not reported in time can cause counselling issues.",
      },
    ],
    faq: [
      {
        question: "How long is the scorecard available for download?",
        answer:
          "NTA keeps scorecards available for a limited period. Download and save a copy immediately after results are declared — do not rely on downloading it later.",
      },
      {
        question: "What if the scorecard shows wrong marks?",
        answer:
          "Raise a grievance on the official NTA portal within the challenge window. After the window closes, corrections are generally not accepted.",
      },
    ],
  },

  {
    slug: "college-admission-documents-checklist",
    category: "admissions",
    title: "College Admission Documents Checklist — What to Carry for Reporting",
    summary:
      "A complete checklist of documents required for college admission reporting after JoSAA, MCC, CSAS, and state counselling seat allotments.",
    heroTitle: "Admission Reporting Documents Checklist: JoSAA, MCC, CSAS, State Counselling",
    heroDescription:
      "Missing even one document at reporting can delay or cancel your admission. Use this checklist before heading to the allotted college.",
    sections: [
      {
        heading: "Universal documents required at all colleges",
        body:
          "Class 10 marksheet and certificate, class 12 marksheet and certificate, entrance exam scorecard (JEE/NEET/CUET), allotment letter, identity proof (Aadhaar/passport), passport-size photographs, and migration certificate from the previous institution.",
      },
      {
        heading: "Category-specific documents",
        body:
          "SC/ST/OBC candidates need a valid caste certificate issued by a competent authority. EWS candidates need an income and asset certificate. PwD candidates need a disability certificate from a government hospital.",
      },
      {
        heading: "What to do if a document is missing",
        body:
          "Contact the college admission office immediately. Some colleges allow provisional admission with an undertaking, but this varies. Do not assume — call ahead.",
      },
    ],
    faq: [
      {
        question: "Are original documents required or are photocopies enough?",
        answer:
          "Both are required. Bring originals for verification and multiple sets of self-attested photocopies. Some colleges retain one set.",
      },
      {
        question: "What is a migration certificate and where do I get it?",
        answer:
          "A migration certificate is issued by the board or university you last studied under. Apply for it as soon as results are declared — it can take 2 to 4 weeks.",
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
