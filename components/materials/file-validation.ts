export type UploadKind = "headshot" | "resume" | "font";
export type PickedFile = { id: string; file: File; kind: UploadKind; contentType: string };

export const FILE_RULES = {
  headshot: { accept: ".jpg,.jpeg,.png", max: 12, maxBytes: 25 * 1024 * 1024, limit: "Up to 12 JPG or PNG images, 25 MB each." },
  resume: { accept: ".pdf", max: 1, maxBytes: 10 * 1024 * 1024, limit: "One PDF, up to 10 MB." },
  font: { accept: ".otf,.ttf,.woff,.woff2", max: 1, maxBytes: 10 * 1024 * 1024, limit: "One OTF, TTF, WOFF or WOFF2 file, up to 10 MB." },
} as const;

export const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", pdf: "application/pdf",
  otf: "font/otf", ttf: "font/ttf", woff: "font/woff", woff2: "font/woff2",
};

/** A selection check for useful feedback. The server must independently verify stored files. */
export function checkSelectedFile(file: Pick<File, "name" | "size" | "type">, kind: UploadKind): string | null {
  const rule = FILE_RULES[kind];
  if (file.name.length > 180 || /[\u0000-\u001f\u007f\\/]/.test(file.name)) return "Use a filename of 180 characters or fewer without slashes or control characters.";
  const extension = file.name.split(".").at(-1)?.toLowerCase() ?? "";
  if (!rule.accept.split(",").includes(`.${extension}`)) return `${file.name}: choose a supported file type.`;
  if (file.size === 0) return `${file.name}: this file is empty.`;
  if (file.size > rule.maxBytes) return `${file.name}: this file exceeds the ${kind === "headshot" ? "25" : "10"} MB limit.`;
  if (kind !== "font" && file.type && file.type !== MIME_BY_EXTENSION[extension]) return `${file.name}: the file type does not match its extension.`;
  return null;
}
