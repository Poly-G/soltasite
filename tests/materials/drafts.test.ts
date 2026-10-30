import assert from "node:assert/strict";
import test from "node:test";
import { defaultMaterialsAnswers, materialsForSubmission, restoreMaterialsDraft, validateMaterialsAnswers } from "../../lib/materials-fields.ts";
import { checkSelectedFile } from "../../components/materials/file-validation.ts";

test("draft restoration preserves an unchecked parent checkbox and explicitly cleared radio values", () => {
  const answers = { ...defaultMaterialsAnswers("Maya"), parent: false, union: "", seek_kind: "", notes: "Keep this note." };
  const restored = restoreMaterialsDraft(JSON.stringify({ version: 1, orderId: "order-a", answers }), "order-a");
  assert.ok(restored);
  assert.equal(restored.parent, false);
  assert.equal(restored.union, "");
  assert.equal(restored.seek_kind, "");
  assert.equal(restored.notes, "Keep this note.");
});

test("a draft cannot restore another order's answers or unknown credential/file fields", () => {
  const raw = JSON.stringify({ version: 1, orderId: "order-a", accessToken: "never-restore", answers: {
    ...defaultMaterialsAnswers("Maya"), parent: true, token: "never-restore", headshots: ["private-file"],
  } });
  assert.equal(restoreMaterialsDraft(raw, "order-b"), null);
  const restored = restoreMaterialsDraft(raw, "order-a");
  assert.ok(restored);
  assert.equal(restored.parent, true);
  assert.equal("accessToken" in restored, false);
  assert.equal("token" in restored, false);
  assert.equal("headshots" in restored, false);
});

test("corrupt, outdated, and oversized local storage cannot populate the form", () => {
  assert.equal(restoreMaterialsDraft("{broken", "order-a"), null);
  assert.equal(restoreMaterialsDraft(JSON.stringify({ version: 2, orderId: "order-a", answers: {} }), "order-a"), null);
  assert.equal(restoreMaterialsDraft("x".repeat(100001), "order-a"), null);
  const restored = restoreMaterialsDraft(JSON.stringify({ version: 1, orderId: "order-a", answers: {
    parent: "true", union: "unknown-option", name: "x".repeat(121), notes: 7,
  } }), "order-a");
  assert.ok(restored);
  assert.equal(restored.parent, false);
  assert.equal(restored.union, "SAG-AFTRA");
  assert.equal(restored.name, "");
  assert.equal(restored.notes, "");
});

test("switching a conditional choice keeps draft text but excludes inactive instructions from submission", () => {
  const answers = { ...defaultMaterialsAnswers("Maya"), rep: "seek" as const, rep_name: "Old agency", rep_email: "invalid",
    color_custom: "old color", font_link: "javascript:bad", reel_state: "No reel yet, leave the space" as const, reel: "old-link" };
  const submitted = materialsForSubmission(answers);
  assert.equal(answers.rep_name, "Old agency");
  assert.equal(submitted.rep_name, "");
  assert.equal(submitted.rep_email, "");
  assert.equal(submitted.rep_kind, "");
  assert.equal(submitted.color_custom, "");
  assert.equal(submitted.font_link, "");
  assert.equal(submitted.reel, "");
  assert.deepEqual(validateMaterialsAnswers(submitted), {});
});

test("optional links accept ordinary HTTP links and reject script or credential-bearing URLs", () => {
  const answers = defaultMaterialsAnswers("Maya");
  assert.deepEqual(validateMaterialsAnswers({ ...answers, imdb: "https://www.imdb.com/name/example/" }), {});
  assert.ok(validateMaterialsAnswers({ ...answers, imdb: "javascript:alert(1)" }).imdb);
  assert.ok(validateMaterialsAnswers({ ...answers, imdb: "https://user:password@example.com" }).imdb);
  assert.ok(validateMaterialsAnswers({ ...answers, name: " " }).name);
});

test("file feedback checks format, nonempty files, and the actual headshot/document limits", () => {
  assert.equal(checkSelectedFile({ name: "HEADSHOT.JPG", type: "image/jpeg", size: 25 * 1024 * 1024 }, "headshot"), null);
  assert.ok(checkSelectedFile({ name: "headshot.png", type: "image/png", size: 25 * 1024 * 1024 + 1 }, "headshot"));
  assert.ok(checkSelectedFile({ name: "headshot.jpg", type: "application/pdf", size: 500 }, "headshot"));
  assert.ok(checkSelectedFile({ name: "photo.svg", type: "image/svg+xml", size: 500 }, "headshot"));
  assert.ok(checkSelectedFile({ name: "resume.pdf", type: "application/pdf", size: 0 }, "resume"));
  assert.ok(checkSelectedFile({ name: "resume.pdf", type: "application/pdf", size: 10 * 1024 * 1024 + 1 }, "resume"));
  assert.equal(checkSelectedFile({ name: "type.woff2", type: "", size: 10 * 1024 * 1024 }, "font"), null);
  assert.ok(checkSelectedFile({ name: "type.woff2", type: "", size: 10 * 1024 * 1024 + 1 }, "font"));
});
