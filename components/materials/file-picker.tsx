"use client";

import { useRef, useState, type DragEvent } from "react";
import { checkSelectedFile, FILE_RULES, MIME_BY_EXTENSION, type PickedFile, type UploadKind } from "./file-validation";
export type { PickedFile, UploadKind } from "./file-validation";

type FilePickerProps = {
  kind: UploadKind;
  name: "headshots" | "resume" | "font_file";
  label: string;
  files: PickedFile[];
  onChange: (files: PickedFile[]) => void;
  disabled?: boolean;
  height?: number;
};

export function FilePicker({ kind, name, label, files, onChange, disabled = false, height = 100 }: FilePickerProps) {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const rule = FILE_RULES[kind];
  const descriptionId = `${name}-file-help`;
  const errorId = `${name}-file-error`;

  function addFiles(incoming: File[]) {
    if (disabled || incoming.length === 0) return;
    const invalid = incoming.map(file => checkSelectedFile(file, kind)).filter(Boolean);
    if (invalid.length) { setError(invalid.join(" ")); return; }
    const base = rule.max === 1 ? [] : files;
    const seen = new Set(base.map(({ file }) => `${file.name}:${file.size}:${file.lastModified}`));
    const additions = incoming.filter(file => {
      const key = `${file.name}:${file.size}:${file.lastModified}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    if (base.length + additions.length > rule.max) {
      setError(rule.max === 1 ? "Choose one file at a time." : "Choose no more than 12 headshots. Remove a photo before adding another.");
      return;
    }
    setError("");
    onChange([...base, ...additions.map(file => ({ id: crypto.randomUUID(), file, kind, contentType: MIME_BY_EXTENSION[file.name.split(".").at(-1)!.toLowerCase()] }))]);
  }

  function drop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  }

  return <div className="min-w-0">
    <button type="button" className={`dz w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 ${dragging ? "ring-2 ring-blue-700" : ""}`}
      style={{ height }} disabled={disabled} onClick={() => input.current?.click()}
      onDragOver={event => { event.preventDefault(); if (!disabled) setDragging(true); }}
      onDragLeave={() => setDragging(false)} onDrop={drop}
      aria-describedby={`${descriptionId}${error ? ` ${errorId}` : ""}`} aria-invalid={Boolean(error)}>
      {label}
    </button>
    <input ref={input} type="file" id={`f-${name}`} name={name} accept={rule.accept}
      multiple={rule.max > 1} className="hidden" disabled={disabled} tabIndex={-1}
      onChange={event => { addFiles(Array.from(event.target.files ?? [])); event.target.value = ""; }} />
    <p className="cap pt-2" id={descriptionId}>{rule.limit} Files upload when you send the form.</p>
    {error ? <p id={errorId} role="alert" className="mt-2 text-sm text-red-800">{error}</p> : null}
    {files.length ? <ol className="mt-3 flex list-none flex-col gap-2 p-0" aria-label={`Selected ${name.replaceAll("_", " ")}`}>
      {files.map((selected, index) => <li key={selected.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-black/15 bg-white px-3 py-2 text-sm">
        <span className="min-w-0 flex-1 break-all">{kind === "headshot" ? `${index + 1}. ` : ""}{selected.file.name}{kind === "headshot" && index === 0 ? " · Main headshot" : ""}</span>
        {kind === "headshot" && index > 0 ? <button type="button" className="underline underline-offset-2" disabled={disabled}
          aria-label={`Make ${selected.file.name} the main headshot`} onClick={() => onChange([selected, ...files.filter(file => file.id !== selected.id)])}>Make main</button> : null}
        <button type="button" className="underline underline-offset-2" disabled={disabled} aria-label={`Remove ${selected.file.name}`}
          onClick={() => { setError(""); onChange(files.filter(file => file.id !== selected.id)); }}>Remove</button>
      </li>)}
    </ol> : null}
  </div>;
}
