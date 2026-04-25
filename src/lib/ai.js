const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-5-mini";

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function truncate(value = "", length = 160) {
  if (value.length <= length) return value;
  return `${value.slice(0, Math.max(0, length - 1)).trim()}…`;
}

function toSlugKeywords(title = "", category = "news") {
  const tokens = `${category} ${title}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 3);

  return Array.from(new Set(tokens)).slice(0, 8);
}

function estimateReadingTime(html = "") {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(words / 180));
}

function buildFallbackContent(item) {
  const sourceName = item.source_name || "a trusted education source";
  const sourceUrl = item.external_url || item.source_url || "";
  const cleanSummary = stripHtml(item.summary || item.raw_summary || item.title);
  const points = [
    "Watch the official notice and reporting timelines closely.",
    "Keep login credentials, scorecards, and ID proof ready before the deadline.",
    "Rely on the source website for final dates, corrections, and downloadable documents.",
  ];

  return {
    refinedTitle: item.title,
    refinedSummary: truncate(cleanSummary, 180),
    seoTitle: truncate(`${item.title} | Rank360`, 60),
    seoDescription: truncate(cleanSummary, 155),
    focusKeywords: toSlugKeywords(item.title, item.category),
    tags: toSlugKeywords(item.title, item.category).slice(0, 6),
    socialHook: truncate(cleanSummary, 110),
    faq: [
      {
        question: `Where should students check the latest ${item.category.toUpperCase()} update?`,
        answer: sourceUrl
          ? `Students should verify the latest notice directly on ${sourceName} and the official exam or admission portal linked in the announcement.`
          : `Students should verify the latest notice directly on ${sourceName} and the official exam or admission portal.`,
      },
      {
        question: "What should students do next?",
        answer:
          "Save the update, note the deadlines, keep all required documents ready, and monitor the official portal for corrigenda or next-round instructions.",
      },
    ],
    articleHtml: `<p>${cleanSummary}</p>
<h2>Fresh Take</h2>
<p>This update was picked up from ${sourceName} and reshaped by Rank360 into a student-friendly format so the key action points are easier to scan.</p>
<h2>What Students Should Track</h2>
<ul>${points.map((point) => `<li>${point}</li>`).join("")}</ul>
<h2>Why This Matters</h2>
<p>${item.category === "results"
      ? "Result announcements usually trigger the next round of counselling, admissions, or verification windows, so even a short delay can cost momentum."
      : "Most education updates quickly lead to application, counselling, document upload, or correction windows, so timing matters as much as the update itself."}</p>
<h2>Source Context</h2>
<p>Rank360 uses the original headline and source summary as a fact base, then turns that into clearer SEO-ready coverage for students and search discovery.</p>`,
  };
}

async function callOpenAI(promptPayload) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      reasoning: { effort: "low" },
      text: {
        format: {
          type: "json_schema",
          name: "rank360_article_enrichment",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: [
              "refinedTitle",
              "refinedSummary",
              "seoTitle",
              "seoDescription",
              "focusKeywords",
              "tags",
              "socialHook",
              "articleHtml",
              "faq",
            ],
            properties: {
              refinedTitle: { type: "string" },
              refinedSummary: { type: "string" },
              seoTitle: { type: "string" },
              seoDescription: { type: "string" },
              focusKeywords: {
                type: "array",
                items: { type: "string" },
                minItems: 3,
                maxItems: 8,
              },
              tags: {
                type: "array",
                items: { type: "string" },
                minItems: 3,
                maxItems: 8,
              },
              socialHook: { type: "string" },
              articleHtml: { type: "string" },
              faq: {
                type: "array",
                minItems: 2,
                maxItems: 4,
                items: {
                  type: "object",
                  additionalProperties: false,
                  required: ["question", "answer"],
                  properties: {
                    question: { type: "string" },
                    answer: { type: "string" },
                  },
                },
              },
            },
          },
        },
        verbosity: "medium",
      },
      input: [
        {
          role: "developer",
          content: [
            {
              type: "input_text",
              text:
                "You are enriching Indian education news for Rank360. Stay factual, student-first, SEO-friendly, and never invent dates, links, marks, cutoffs, or official claims not present in the input. Write original copy that is crawlable and useful. Output valid JSON only.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify(promptPayload),
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const raw = data.output_text?.trim();
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function enrichArticleWithAI(item) {
  const fallback = buildFallbackContent(item);

  if (!process.env.OPENAI_API_KEY) {
    return {
      ...fallback,
      readingTimeMinutes: estimateReadingTime(fallback.articleHtml),
      usedAI: false,
    };
  }

  try {
    const result = await callOpenAI({
      site: "Rank360",
      category: item.category,
      sourceName: item.source_name,
      sourceUrl: item.source_url,
      externalUrl: item.external_url,
      title: item.raw_title || item.title,
      summary: stripHtml(item.raw_summary || item.summary || ""),
      publishedAt: item.published_at,
      author: item.author_name || "",
    });

    if (!result) {
      return {
        ...fallback,
        readingTimeMinutes: estimateReadingTime(fallback.articleHtml),
        usedAI: false,
      };
    }

    return {
      ...result,
      refinedTitle: truncate(result.refinedTitle || fallback.refinedTitle, 120),
      refinedSummary: truncate(result.refinedSummary || fallback.refinedSummary, 220),
      seoTitle: truncate(result.seoTitle || fallback.seoTitle, 65),
      seoDescription: truncate(result.seoDescription || fallback.seoDescription, 160),
      focusKeywords: Array.from(new Set((result.focusKeywords || []).filter(Boolean))).slice(0, 8),
      tags: Array.from(new Set((result.tags || []).filter(Boolean))).slice(0, 8),
      socialHook: truncate(result.socialHook || fallback.socialHook, 120),
      faq: (result.faq || fallback.faq).slice(0, 4),
      articleHtml: result.articleHtml || fallback.articleHtml,
      readingTimeMinutes: estimateReadingTime(result.articleHtml || fallback.articleHtml),
      usedAI: true,
    };
  } catch (error) {
    console.warn(`AI enrichment failed for "${item.title}": ${error.message}`);
    return {
      ...fallback,
      readingTimeMinutes: estimateReadingTime(fallback.articleHtml),
      usedAI: false,
    };
  }
}
