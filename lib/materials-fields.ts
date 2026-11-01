/** The original actor materials form's field names, defaults, and bounded values. */
export const MATERIALS_RADIO_OPTIONS = {
  union: ["SAG-AFTRA", "SAG-AFTRA eligible", "Non-union", "AEA"],
  headshots_state: ["These are current", "Older than my look: use my best, I'll send new ones later"],
  reel_state: ["I have a reel", "No reel yet, leave the space", "I have clips, help me pick"],
  rep: ["have", "seek"],
  rep_kind: ["Agent", "Manager", "Both"],
  seek_kind: ["Agent", "Manager", "Either"],
  seek_work: ["Theatrical", "Commercial", "Both"],
  domain_state: ["I already own one", "Register one for me (about $15 a year, we'll send the link)", "Not sure, help me"],
  color: ["Black", "Cream", "Navy", "Burgundy", "Forest", "Yellow", "Coral", "Lavender", "headshot", "custom"],
  font: ["Bold", "Clean", "Classic", "Friendly", "custom"],
} as const;

export const MATERIALS_TEXT_LIMITS = {
  name: 120, pronouns: 80, market: 120, type: 240, reel: 2048,
  credits: 10000, rep_name: 240, rep_email: 254, imdb: 2048,
  actors_access: 2048, casting_networks: 2048, instagram: 2048,
  domain: 253, color_custom: 240, font_link: 2048,
  like1_url: 2048, like1_why: 1000, like2_url: 2048, like2_why: 1000,
  like3_url: 2048, like3_why: 1000, notes: 5000,
} as const;

export type MaterialsTextKey = keyof typeof MATERIALS_TEXT_LIMITS;
export type MaterialsRadioKey = keyof typeof MATERIALS_RADIO_OPTIONS;
export type MaterialsAnswers = { [K in MaterialsTextKey]: string } & {
  [K in MaterialsRadioKey]: (typeof MATERIALS_RADIO_OPTIONS)[K][number] | "";
} & { parent: boolean };
export type MaterialsErrors = Partial<Record<keyof MaterialsAnswers, string>>;

export const MATERIALS_DRAFT_VERSION = 1;

export function defaultMaterialsAnswers(customerName = ""): MaterialsAnswers {
  return {
    name: customerName.slice(0, MATERIALS_TEXT_LIMITS.name), pronouns: "", market: "",
    union: "SAG-AFTRA", type: "", parent: false, headshots_state: "These are current",
    reel: "", reel_state: "I have a reel", credits: "", rep: "have", rep_name: "",
    rep_email: "", rep_kind: "Agent", seek_kind: "", seek_work: "", imdb: "",
    actors_access: "", casting_networks: "", instagram: "", domain_state: "I already own one",
    domain: "", color: "Black", color_custom: "", font: "Clean", font_link: "",
    like1_url: "", like1_why: "", like2_url: "", like2_why: "", like3_url: "",
    like3_why: "", notes: "",
  };
}

/** Only allowlisted answers enter a draft. Tokens, files, and arbitrary keys are never restored. */
export function restoreMaterialsDraft(raw: string | null, orderId: string): MaterialsAnswers | null {
  if (!raw || raw.length > 100000) return null;
  try {
    const draft: unknown = JSON.parse(raw);
    if (!draft || typeof draft !== "object" || Array.isArray(draft)) return null;
    const record = draft as Record<string, unknown>;
    if (record.version !== MATERIALS_DRAFT_VERSION || record.orderId !== orderId) return null;
    if (!record.answers || typeof record.answers !== "object" || Array.isArray(record.answers)) return null;
    const stored = record.answers as Record<string, unknown>;
    const answers = defaultMaterialsAnswers();
    for (const field of Object.keys(MATERIALS_TEXT_LIMITS) as MaterialsTextKey[]) {
      if (typeof stored[field] === "string" && stored[field].length <= MATERIALS_TEXT_LIMITS[field]) {
        answers[field] = stored[field];
      }
    }
    for (const field of Object.keys(MATERIALS_RADIO_OPTIONS) as MaterialsRadioKey[]) {
      const value = stored[field];
      if (value === "" || (typeof value === "string" && (MATERIALS_RADIO_OPTIONS[field] as readonly string[]).includes(value))) {
        // Each key has its own option set, validated immediately above.
        Object.assign(answers, { [field]: value });
      }
    }
    answers.parent = stored.parent === true;
    return answers;
  } catch {
    return null;
  }
}

/** Disabled branches remain in the local draft, but do not become submitted instructions. */
export function materialsForSubmission(answers: MaterialsAnswers): MaterialsAnswers {
  return {
    ...answers,
    rep_name: answers.rep === "have" ? answers.rep_name : "",
    rep_email: answers.rep === "have" ? answers.rep_email : "",
    rep_kind: answers.rep === "have" ? answers.rep_kind : "",
    seek_kind: answers.rep === "seek" ? answers.seek_kind : "",
    seek_work: answers.rep === "seek" ? answers.seek_work : "",
    reel: answers.reel_state === "No reel yet, leave the space" ? "" : answers.reel,
    color_custom: answers.color === "custom" ? answers.color_custom : "",
    font_link: answers.font === "custom" ? answers.font_link : "",
  };
}

const URL_FIELDS: MaterialsTextKey[] = ["reel", "imdb", "actors_access", "casting_networks", "instagram", "font_link", "like1_url", "like2_url", "like3_url"];

export function validateMaterialsAnswers(answers: MaterialsAnswers): MaterialsErrors {
  const errors: MaterialsErrors = {};
  if (!answers.name.trim()) errors.name = "Enter the name you want on your site.";
  for (const field of Object.keys(MATERIALS_TEXT_LIMITS) as MaterialsTextKey[]) {
    if (answers[field].length > MATERIALS_TEXT_LIMITS[field]) errors[field] = `Use ${MATERIALS_TEXT_LIMITS[field]} characters or fewer.`;
  }
  for (const field of URL_FIELDS) {
    const value = answers[field].trim();
    if (!value) continue;
    try {
      const url = new URL(value);
      if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new Error("invalid_url");
    } catch {
      errors[field] = "Enter a complete link beginning with https:// or http://.";
    }
  }
  if (answers.rep_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.rep_email.trim())) {
    errors.rep_email = "Enter a valid email address, or leave this blank.";
  }
  return errors;
}
