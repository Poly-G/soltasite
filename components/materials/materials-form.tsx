"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { Turnstile } from "@/components/turnstile";
import { defaultMaterialsAnswers, materialsForSubmission, restoreMaterialsDraft, validateMaterialsAnswers, MATERIALS_DRAFT_VERSION, MATERIALS_RADIO_OPTIONS, MATERIALS_TEXT_LIMITS, type MaterialsAnswers, type MaterialsErrors, type MaterialsRadioKey, type MaterialsTextKey } from "@/lib/materials-fields";
import { FilePicker, type PickedFile } from "./file-picker";

type MaterialsFormProps = { orderId: string; customerName?: string; preview?: boolean };
type AssetReferences = { headshots: string[]; resume: string | null; font_file: string | null };
type Phase = "idle" | "uploading" | "submitting" | "received";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const COLORS: Record<string, string> = { Black: "#111318", Cream: "#F5F0E8", Navy: "#1F2A5C", Burgundy: "#6E1B2A", Forest: "#1F4A3A", Yellow: "#FFD84D", Coral: "#FF5A4E", Lavender: "#C9B8F0" };
const FONT_STYLES: Record<string, CSSProperties> = {
  Bold: { fontFamily: "var(--font-rubik),sans-serif", fontWeight: 800, letterSpacing: "-0.03em" },
  Clean: { fontFamily: "var(--font-inter-tight),sans-serif", fontWeight: 500, letterSpacing: "-0.04em" },
  Classic: { fontFamily: "var(--font-cormorant),serif", fontStyle: "italic", fontWeight: 500 },
  Friendly: { fontFamily: "var(--font-work-sans),sans-serif", fontWeight: 600 },
};

function Step({ number, title, description, children }: { number: string; title: string; description: string; children: ReactNode }) {
  return <section className="stp" aria-labelledby={`step-${number}`}>
    <div><div className="num" style={{ fontSize: 16 }}>{number}</div><h3 id={`step-${number}`}>{title}</h3><div className="cap sub">{description}</div></div>
    <div className="in">{children}</div>
  </section>;
}

function TextField({ name, label, value, onChange, error, type = "text", placeholder = "", required = false, disabled = false, rows }: {
  name: MaterialsTextKey; label: string; value: string; onChange: (value: string) => void;
  error?: string; type?: "text" | "url" | "email"; placeholder?: string; required?: boolean; disabled?: boolean; rows?: number;
}) {
  const shared = { className: "fld", id: `f-${name}`, name, value, placeholder, required, disabled,
    maxLength: MATERIALS_TEXT_LIMITS[name], "aria-invalid": Boolean(error), "aria-describedby": error ? `error-${name}` : undefined };
  return <div className="f">
    <label className="l" htmlFor={shared.id}>{label}</label>
    {rows ? <textarea {...shared} rows={rows} onChange={event => onChange(event.target.value)} /> : <input {...shared} type={type} onChange={event => onChange(event.target.value)} />}
    {error ? <p className="mt-2 text-sm text-red-800" id={`error-${name}`}>{error}</p> : null}
  </div>;
}

function Radios({ name, label, value, onChange, visibleLabel = true, disabled = false }: {
  name: MaterialsRadioKey; label: string; value: string; onChange: (value: string) => void; visibleLabel?: boolean; disabled?: boolean;
}) {
  return <fieldset className="min-w-0 border-0 p-0" disabled={disabled}>
    <legend className={visibleLabel ? "l" : "sr-only"}>{label}</legend>
    <div className="chips">{MATERIALS_RADIO_OPTIONS[name].map(option => {
      const display = name === "rep" ? (option === "have" ? "I have a rep" : "I'm looking for one") : option === "headshot" ? "Pick from my headshot" : option === "custom" ? "Custom" : option;
      const id = name === "rep" ? (option === "have" ? "rep-yes" : "rep-no") : name === "color" && option === "custom" ? "c-custom" : name === "font" && option === "custom" ? "f-custom" : `${name}-${option.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`;
      return <label className={`chip${name === "font" && option !== "custom" ? " font" : ""}`} key={option}>
        <input type="radio" id={id} name={name} value={option} checked={value === option} onChange={() => onChange(option)} />
        {name === "color" && COLORS[option] ? <i className="sw" aria-hidden="true" style={{ background: COLORS[option] }} /> : null}
        {name === "font" && FONT_STYLES[option] ? <><span className="smp" aria-hidden="true" style={FONT_STYLES[option]}>Your Name</span><span className="cap">{display}</span></> : display}
      </label>;
    })}</div>
  </fieldset>;
}

function apiMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && "error" in body) {
    const error = body.error;
    if (error && typeof error === "object" && "message" in error && typeof error.message === "string") return error.message.slice(0, 300);
  }
  return fallback;
}

export function MaterialsForm(props: MaterialsFormProps) {
  // An order change must remount the draft/file state rather than reuse another customer's answers.
  return <MaterialsFormContents key={`${props.preview ? "preview" : "order"}:${props.orderId}`} {...props} />;
}

function MaterialsFormContents({ orderId, customerName, preview = false }: MaterialsFormProps) {
  const [answers, setAnswers] = useState(() => defaultMaterialsAnswers(customerName));
  const answersRef = useRef(answers);
  const [headshots, setHeadshots] = useState<PickedFile[]>([]);
  const [resume, setResume] = useState<PickedFile[]>([]);
  const [fontFile, setFontFile] = useState<PickedFile[]>([]);
  const [errors, setErrors] = useState<MaterialsErrors>({});
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [previewNotice, setPreviewNotice] = useState("");
  const [draftReady, setDraftReady] = useState(false);
  const [draftNotice, setDraftNotice] = useState("Text answers save on this device. Choose files again if you refresh.");
  const [company, setCompany] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [challengeVersion, setChallengeVersion] = useState(0);
  const uploaded = useRef(new Map<string, string>());
  const requestId = useRef<string | null>(null);
  const locked = useRef(false);
  const errorSummary = useRef<HTMLDivElement>(null);
  const storageKey = `soltasite:materials:v${MATERIALS_DRAFT_VERSION}:${preview ? "preview:" : ""}${orderId}`;
  const busy = phase === "uploading" || phase === "submitting";
  const onToken = useCallback((token: string) => setTurnstileToken(token), []);

  useEffect(() => {
    try {
      const saved = restoreMaterialsDraft(localStorage.getItem(storageKey), orderId);
      if (saved) {
        answersRef.current = saved;
        setAnswers(saved);
        setDraftNotice("Your saved text is restored. Choose files again before sending.");
      }
    } catch { setDraftNotice("This browser cannot save a draft. Keep this page open until you send it."); }
    setDraftReady(true);
  }, [orderId, storageKey]);

  function saveDraft(next: MaterialsAnswers) {
    try {
      // Save in the input event, before an immediate reload can discard a pending effect.
      localStorage.setItem(storageKey, JSON.stringify({ version: MATERIALS_DRAFT_VERSION, orderId, answers: next }));
    } catch { setDraftNotice("This browser cannot save a draft. Keep this page open until you send it."); }
  }

  function update<K extends keyof MaterialsAnswers>(key: K, value: MaterialsAnswers[K]) {
    if (!draftReady || busy || phase === "received") return;
    const next = { ...answersRef.current, [key]: value };
    answersRef.current = next;
    saveDraft(next);
    setAnswers(next);
    setErrors(current => ({ ...current, [key]: undefined }));
    requestId.current = null;
    setPreviewNotice("");
  }

  function updateFiles(setter: (files: PickedFile[]) => void, files: PickedFile[]) {
    setter(files);
    requestId.current = null;
    setPreviewNotice("");
  }

  function clearDraft() {
    try { localStorage.removeItem(storageKey); } catch { /* The visible form still clears. */ }
    const cleared = defaultMaterialsAnswers(customerName);
    answersRef.current = cleared;
    setAnswers(cleared);
    setHeadshots([]); setResume([]); setFontFile([]); setErrors({});
    uploaded.current.clear(); requestId.current = null;
    setDraftNotice("Draft cleared. Text answers will save when you start again.");
    setSubmitError(""); setPreviewNotice("");
  }

  function focusErrors() { requestAnimationFrame(() => errorSummary.current?.focus()); }

  async function upload(selected: PickedFile): Promise<string> {
    const existing = uploaded.current.get(selected.id);
    if (existing) return existing;
    const reservationResponse = await fetch("/api/uploads", {
      method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, requestId: selected.id, kind: selected.kind, fileName: selected.file.name, contentType: selected.contentType, sizeBytes: selected.file.size }),
      signal: AbortSignal.timeout(30000),
    });
    const reservation: unknown = await reservationResponse.json().catch(() => null);
    if (!reservationResponse.ok) throw new Error(apiMessage(reservation, "We could not prepare that upload. Try again."));
    if (!reservation || typeof reservation !== "object" || !("assetId" in reservation)
      || typeof reservation.assetId !== "string" || !UUID.test(reservation.assetId)) {
      throw new Error("We could not prepare that upload. Try again.");
    }
    // The authenticated server only returns this receipt after verifying the stored bytes.
    // A lost PUT response can then be retried without overwriting a private object.
    if ("alreadyUploaded" in reservation && reservation.alreadyUploaded === true) {
      uploaded.current.set(selected.id, reservation.assetId);
      return reservation.assetId;
    }
    if (!("uploadUrl" in reservation) || typeof reservation.uploadUrl !== "string") throw new Error("The upload link is unavailable. Try again.");
    const uploadUrl = new URL(reservation.uploadUrl);
    if (uploadUrl.protocol !== "https:" || uploadUrl.username || uploadUrl.password) throw new Error("The upload link is unavailable. Try again.");
    const response = await fetch(uploadUrl, {
      method: "PUT", credentials: "omit", redirect: "error", headers: { "Content-Type": selected.contentType },
      body: selected.file, signal: AbortSignal.timeout(180000),
    });
    if (!response.ok) throw new Error(`The upload of ${selected.file.name} did not finish. Please try again.`);
    uploaded.current.set(selected.id, reservation.assetId);
    return reservation.assetId;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current || phase === "received") return;
    const submittedAnswers = materialsForSubmission(answers);
    const validation = validateMaterialsAnswers(submittedAnswers);
    setErrors(validation); setSubmitError(""); setPreviewNotice("");
    if (Object.keys(validation).length) { setSubmitError("Check the highlighted fields before sending."); focusErrors(); return; }
    if (preview) { setPreviewNotice("Preview only. Nothing was uploaded or submitted."); return; }
    if (!turnstileToken) { setSubmitError("Complete the verification below before sending your materials."); focusErrors(); return; }
    locked.current = true;
    requestId.current ??= crypto.randomUUID();
    try {
      setPhase("uploading");
      const allFiles = [...headshots, ...resume, ...(answers.font === "custom" ? fontFile : [])];
      let completed = 0;
      setProgress(allFiles.length ? `Uploading files: 0 of ${allFiles.length}.` : "Sending your materials…");
      // Two uploads at a time avoid reading every large file concurrently.
      for (let index = 0; index < allFiles.length; index += 2) {
        const results = await Promise.allSettled(allFiles.slice(index, index + 2).map(async file => {
          await upload(file); completed += 1; setProgress(`Uploading files: ${completed} of ${allFiles.length}.`);
        }));
        const failed = results.find(result => result.status === "rejected");
        if (failed?.status === "rejected") throw failed.reason;
      }
      const assets: AssetReferences = {
        headshots: headshots.map(file => uploaded.current.get(file.id)!),
        resume: resume[0] ? uploaded.current.get(resume[0].id)! : null,
        font_file: answers.font === "custom" && fontFile[0] ? uploaded.current.get(fontFile[0].id)! : null,
      };
      setPhase("submitting"); setProgress("Checking your files and saving your materials…");
      const response = await fetch("/api/materials", {
        method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, requestId: requestId.current, answers: submittedAnswers, assets, turnstileToken, company }),
        signal: AbortSignal.timeout(60000),
      });
      const result: unknown = await response.json().catch(() => null);
      if (!response.ok) throw new Error(apiMessage(result, "Your materials were not confirmed. Please try again."));
      if (!result || typeof result !== "object" || !("status" in result) || result.status !== "received"
        || !("submissionId" in result) || typeof result.submissionId !== "string" || !UUID.test(result.submissionId)) {
        throw new Error("Your materials were not confirmed. Please try again.");
      }
      setPhase("received"); setProgress("");
      try { localStorage.removeItem(storageKey); } catch { /* Saving succeeded even if local storage is blocked. */ }
    } catch (error) {
      setPhase("idle"); setProgress("");
      setSubmitError(error instanceof Error && error.name !== "TimeoutError" && error.name !== "AbortError" && error.message !== "Failed to fetch" ? error.message : "The connection did not finish. Your text is still here. Please try again.");
      setTurnstileToken(""); setChallengeVersion(version => version + 1); focusErrors();
    } finally { locked.current = false; }
  }

  const field = (name: MaterialsTextKey, label: string, options: { type?: "text" | "url" | "email"; placeholder?: string; required?: boolean; rows?: number; disabled?: boolean } = {}) =>
    <TextField name={name} label={label} value={answers[name]} onChange={value => update(name, value)} error={errors[name]} {...options} />;
  const radios = (name: MaterialsRadioKey, label: string, options: { visibleLabel?: boolean; disabled?: boolean } = {}) =>
    <Radios name={name} label={label} value={answers[name]} onChange={value => update(name, value as MaterialsAnswers[typeof name])} {...options} />;

  if (phase === "received") return <div className="form-head" role="status" aria-live="polite">
    <div className="cap" style={{ fontWeight: 600 }}>Materials received</div><h1>You’re all set.</h1>
    <p className="lead">Your materials and selected files are saved. Your review link arrives within 3 business days. Skipped something? Reply to your receipt email with it.</p>
  </div>;

  return <>
    <div className="form-head">
      <div className="cap" style={{ fontWeight: 600 }}>{preview ? "Preview · Your materials" : "Paid · Thank you"}</div>
      <h1>Now the ten‑minute part.</h1>
      <p className="lead">Send us what you have. Anything you don&apos;t have yet, say so. The site goes live without it and we add it when it exists.</p>
      {preview ? <p className="rounded-xl border border-black/20 bg-white px-4 py-3 text-sm">This is a preview of the materials form. No purchase is recorded, and files and answers are not sent.</p> : null}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2"><p className="cap" role="status">{draftNotice}</p><button type="button" className="text-sm underline underline-offset-4" onClick={clearDraft} disabled={busy || !draftReady}>Clear this draft</button></div>
    </div>
    <form className="steps-form" id="materials" onSubmit={submit} noValidate aria-busy={busy || !draftReady} data-materials-ready={draftReady ? "true" : "false"}>
      <input className="honey" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" value={company} onChange={event => setCompany(event.target.value)} />
      <div ref={errorSummary} tabIndex={-1} role="alert" hidden={!submitError} className="mb-6 rounded-xl border border-red-800/30 bg-red-50 px-5 py-4 text-red-900 focus:outline-2">
        <p>{submitError}</p>
        {Object.entries(errors).some(([, error]) => error) ? <ul className="mt-2 list-disc pl-5">{Object.entries(errors).filter(([, error]) => error).map(([name, error]) => <li key={name}><a href={`#f-${name}`} className="underline">{error}</a></li>)}</ul> : null}
      </div>
      <fieldset disabled={busy || !draftReady} className="m-0 min-w-0 border-0 p-0">
      <legend className="sr-only">Your actor website materials</legend>
      <Step number="01" title="You" description="How your name appears, and where you work.">
        <div className="two">{field("name", "Your name, as it should appear on the site", { placeholder: "Maya Ortiz", required: true })}{field("pronouns", "Pronouns (optional)")}</div>
        <div className="two">{field("market", "Your market", { placeholder: "Los Angeles" })}{radios("union", "Union")}</div>
        {field("type", "Your type, in a few words", { placeholder: "Comedic, best friend, 30s. Plays younger." })}
        <div className="chips"><label className="chip"><input type="checkbox" name="parent" value="I'm a parent filling this in for my child" checked={answers.parent} onChange={event => update("parent", event.target.checked)} />I&apos;m a parent filling this in for my child</label></div>
      </Step>
      <Step number="02" title="Headshots" description="Up to 12. Put the main one first.">
        <FilePicker kind="headshot" name="headshots" label="Drop photos here · JPG or PNG · up to 12" height={130} files={headshots} onChange={files => updateFiles(setHeadshots, files)} disabled={busy || !draftReady} />
        {radios("headshots_state", "Are your headshots current?", { visibleLabel: false })}
        <div className="cap">A casting director should see you as you walk in. Swapping in new ones later is one of your two updates.</div>
      </Step>
      <Step number="03" title="Reel" description="A link is enough.">
        {field("reel", "YouTube or Vimeo link", { type: "url", placeholder: "https://vimeo.com/…", disabled: answers.reel_state === "No reel yet, leave the space" })}
        {radios("reel_state", "Your reel", { visibleLabel: false })}
      </Step>
      <Step number="04" title="Resume" description="A PDF, or type the credits and we'll lay them out.">
        <FilePicker kind="resume" name="resume" label="Upload a PDF, or paste your credits below" files={resume} onChange={files => updateFiles(setResume, files)} disabled={busy || !draftReady} />
        {field("credits", "Credits, training, skills (optional if you uploaded)", { rows: 3 })}
      </Step>
      <Step number="05" title="Representation" description="Who should casting, or an agent, contact.">
        <div className="rep">
          <div style={{ paddingBottom: 18 }}>{radios("rep", "Representation", { visibleLabel: false })}</div>
          <div className="two">
            <fieldset className="box have on min-w-0" disabled={answers.rep !== "have"}><legend className="sr-only">If you have a rep</legend>
              <div className="cap t">If you have a rep</div>{field("rep_name", "Rep's name and agency")}{field("rep_email", "Rep's email", { type: "email" })}{radios("rep_kind", "Type of representation", { visibleLabel: false })}
            </fieldset>
            <fieldset className="box seek off min-w-0" disabled={answers.rep !== "seek"}><legend className="sr-only">If you&apos;re looking for one</legend>
              <div className="cap t">If you&apos;re looking for one</div>{radios("seek_kind", "You're looking for")}{radios("seek_work", "Work you want")}
              <div className="cap">Agents reach you through a form on your site. Your email never appears on the page.</div>
            </fieldset>
          </div>
        </div>
        <div className="cap">Your own phone number never goes on the page. If you sign with a rep later, tell us and we swap them in.</div>
      </Step>
      <Step number="06" title="Links" description="Only the ones you keep current.">
        <div className="two">{field("imdb", "IMDb", { type: "url" })}{field("actors_access", "Actors Access", { type: "url" })}</div>
        <div className="two">{field("casting_networks", "Casting Networks", { type: "url" })}{field("instagram", "Instagram", { type: "url" })}</div>
      </Step>
      <Step number="07" title="Your domain" description="yourname.com, in your name.">
        {radios("domain_state", "Your domain", { visibleLabel: false })}{field("domain", "Domain, or the name you'd like", { placeholder: "mayaortiz.com" })}
      </Step>
      <Step number="08" title="The look" description="You pick it. We build it.">
        <div className="look" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {radios("color", "Main color")}
          <div className="cust color two" style={{ alignItems: "end" }} aria-hidden={answers.color !== "custom"}>
            {field("color_custom", "Custom color", { placeholder: "#2B59FF", disabled: answers.color !== "custom" })}
            <div className="cap" style={{ paddingBottom: 14 }}>Only if you picked Custom. A hex code, a paint name, anything that tells us the color.</div>
          </div>
          {radios("font", "Font")}
          <div className="cust font" aria-hidden={answers.font !== "custom"}>
            <div className="cap" style={{ paddingBottom: 12 }}>Have a font you already use? Send it either way. If it needs a license, we tell you before we use it.</div>
            <div className="two">{field("font_link", "Custom font: a link", { type: "url", placeholder: "Paste the link", disabled: answers.font !== "custom" })}
              <div className="f"><span className="l">Or upload the font file</span><FilePicker kind="font" name="font_file" label="Drop it here · OTF, TTF or WOFF" height={52} files={fontFile} onChange={files => updateFiles(setFontFile, files)} disabled={busy || !draftReady || answers.font !== "custom"} /></div>
            </div>
          </div>
          <div><div className="l">Up to three sites you like</div><div className="cap" style={{ paddingBottom: 12 }}>Actor sites or anything else. Tell us what you like about each one.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{([1, 2, 3] as const).map(number => <div className="pair" key={number}>
              {field(`like${number}_url`, `Site ${number} (optional)`, { type: "url", placeholder: "https://" })}{field(`like${number}_why`, "What you like about it", { placeholder: "The big photo, the colors…" })}
            </div>)}</div>
          </div>
          <div className="cap">Skip any of these and we choose from your headshots and your type. You&apos;ll see it in your review link, and your two rounds of changes cover it.</div>
        </div>
      </Step>
      <Step number="09" title="Anything else" description="Optional.">{field("notes", "Anything else you want us to know (optional)", { rows: 3, placeholder: "A quote from a review, an award, a project coming up, a language you speak…" })}</Step>
      </fieldset>
      {!preview ? <div style={{ paddingTop: 28 }}><Turnstile key={challengeVersion} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} onToken={onToken} action="materials" /></div> : null}
      {previewNotice ? <p role="status" className="my-5 rounded-xl border border-black/20 bg-white px-4 py-3">{previewNotice}</p> : null}
      {progress ? <p role="status" aria-live="polite" className="my-5">{progress}</p> : null}
      <div className="form-foot"><button className="btn" type="submit" disabled={busy || !draftReady} style={{ padding: "19px 36px", fontSize: 18 }}>{busy ? "Sending…" : preview ? "Preview submission" : "Send it"} <span className="ar" aria-hidden="true">→</span></button>
        <span className="cap">Your review link arrives within 3 business days. Skipped something? Reply to your receipt email with it.</span>
      </div>
    </form>
  </>;
}
