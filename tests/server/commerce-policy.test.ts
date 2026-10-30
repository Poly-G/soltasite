import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { defaultMaterialsAnswers } from "../../lib/materials-fields.ts";
import { ACCESS_SECONDS, checkoutInput, materialsInput, signOrderAccess, uploadInput, verifyOrderAccess } from "../../lib/server/policies.ts";

const orderId = "11111111-1111-4111-8111-111111111111";
const requestId = "22222222-2222-4222-8222-222222222222";
const customer = { requestId, name: "Maya Ortiz", email: "maya@example.test", termsAccepted: true, turnstileToken: "test-verification-token", company: "" };
const materials = () => ({
  orderId, requestId, answers: defaultMaterialsAnswers("Maya Ortiz"),
  assets: { headshots: [] as string[], resume: null as string | null, font_file: null as string | null },
  turnstileToken: "test-verification-token", company: "",
});

test("checkout never accepts browser-controlled pricing or a claimed payment status", () => {
  assert.equal(checkoutInput.safeParse(customer).success, true);
  for (const extra of [{ price: 1 }, { amount: 1 }, { amountCents: 1 }, { currency: "eur" }, { paid: true }, { payment_status: "paid" }]) {
    assert.equal(checkoutInput.safeParse({ ...customer, ...extra }).success, false);
  }
});

test("checkout requires an affirmative terms decision and completed anti-bot input", () => {
  assert.equal(checkoutInput.safeParse({ ...customer, termsAccepted: false }).success, false);
  assert.equal(checkoutInput.safeParse({ ...customer, termsAccepted: "true" }).success, false);
  assert.equal(checkoutInput.safeParse({ ...customer, turnstileToken: "" }).success, false);
  assert.equal(checkoutInput.safeParse({ ...customer, company: "bot-filled-field" }).success, false);
});

test("materials accepts the complete original form but rejects unrecognized fields and file URLs", () => {
  assert.equal(materialsInput.safeParse(materials()).success, true);
  assert.equal(materialsInput.safeParse({ ...materials(), payment_status: "paid" }).success, false);
  assert.equal(materialsInput.safeParse({ ...materials(), answers: { ...defaultMaterialsAnswers("Maya"), role: "admin" } }).success, false);
  assert.equal(materialsInput.safeParse({ ...materials(), assets: { headshots: ["https://example.test/photo.jpg"], resume: null, font_file: null } }).success, false);
});

test("materials allows twelve distinct headshots and rejects excess or repeated asset references", () => {
  const headshots = Array.from({ length: 12 }, () => randomUUID());
  assert.equal(materialsInput.safeParse({ ...materials(), assets: { headshots, resume: null, font_file: null } }).success, true);
  assert.equal(materialsInput.safeParse({ ...materials(), assets: { headshots: [...headshots, randomUUID()], resume: null, font_file: null } }).success, false);
  assert.equal(materialsInput.safeParse({ ...materials(), assets: { headshots: [headshots[0], headshots[0]], resume: null, font_file: null } }).success, false);
  assert.equal(materialsInput.safeParse({ ...materials(), assets: { headshots, resume: headshots[0], font_file: null } }).success, false);
});

test("upload policy bounds each supported file kind and rejects executable or unsupported types", () => {
  const base = { orderId, requestId, kind: "headshot", fileName: "headshot.jpg", contentType: "image/jpeg", sizeBytes: 25 * 1024 * 1024 };
  assert.equal(uploadInput.safeParse(base).success, true);
  assert.equal(uploadInput.safeParse({ ...base, sizeBytes: base.sizeBytes + 1 }).success, false);
  assert.equal(uploadInput.safeParse({ ...base, sizeBytes: 0 }).success, false);
  assert.equal(uploadInput.safeParse({ ...base, fileName: "headshot.svg", contentType: "image/svg+xml" }).success, false);
  assert.equal(uploadInput.safeParse({ ...base, fileName: "payload.html" }).success, false);
  assert.equal(uploadInput.safeParse({ ...base, contentType: "text/html" }).success, false);
  assert.equal(uploadInput.safeParse({ ...base, fileName: "../headshot.jpg" }).success, false);
  assert.equal(uploadInput.safeParse({ ...base, kind: "resume", fileName: "resume.pdf", contentType: "application/pdf", sizeBytes: 10 * 1024 * 1024 }).success, true);
  assert.equal(uploadInput.safeParse({ ...base, kind: "resume", fileName: "resume.pdf", contentType: "application/pdf", sizeBytes: 10 * 1024 * 1024 + 1 }).success, false);
  assert.equal(uploadInput.safeParse({ ...base, kind: "font", fileName: "custom.woff2", contentType: "font/woff2", sizeBytes: 10 * 1024 * 1024 }).success, true);
  assert.equal(uploadInput.safeParse({ ...base, kind: "font", fileName: "custom.woff2", contentType: "font/woff2", sizeBytes: 10 * 1024 * 1024 + 1 }).success, false);
});

test("order access expires at the boundary and cannot be verified with another secret", () => {
  const now = Date.UTC(2026, 9, 30, 12);
  const secret = "a".repeat(48);
  const token = signOrderAccess(orderId, secret, now);
  assert.equal(verifyOrderAccess(token, secret, now), orderId);
  assert.equal(verifyOrderAccess(token, secret, now + (ACCESS_SECONDS - 1) * 1000), orderId);
  assert.equal(verifyOrderAccess(token, secret, now + ACCESS_SECONDS * 1000), null);
  assert.equal(verifyOrderAccess(token, "b".repeat(48), now), null);
  assert.equal(verifyOrderAccess(token, "short-secret", now), null);
});

test("changing the order identity or signature invalidates an otherwise unexpired cookie", () => {
  const now = Date.UTC(2026, 9, 30, 12);
  const secret = "c".repeat(48);
  const token = signOrderAccess(orderId, secret, now);
  const [payload, signature] = token.split(".");
  const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  const changed = Buffer.from(JSON.stringify({ ...decoded, orderId: requestId })).toString("base64url");
  assert.equal(verifyOrderAccess(`${changed}.${signature}`, secret, now), null);
  assert.equal(verifyOrderAccess(`${payload}.${signature[0] === "A" ? "B" : "A"}${signature.slice(1)}`, secret, now), null);
  assert.equal(verifyOrderAccess("", secret, now), null);
  assert.equal(verifyOrderAccess("x".repeat(1025), secret, now), null);
});
