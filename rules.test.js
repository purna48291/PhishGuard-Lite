import assert from "node:assert/strict";
import test from "node:test";
import {
  detectCredentialLanguage,
  detectIpAddressUrls,
  detectShortenedUrls,
  detectSuspiciousTlds,
  extractUrls,
  runRules
} from "../src/rules.js";

test("extracts urls from email text", () => {
  const urls = extractUrls("Open https://example.com/login and http://test.example/reset.");

  assert.deepEqual(urls, ["https://example.com/login", "http://test.example/reset"]);
});

test("detects IP address URLs", () => {
  const findings = detectIpAddressUrls(["http://192.0.2.10/login"]);

  assert.equal(findings.length, 1);
  assert.equal(findings[0].ruleId, "IP_ADDRESS_URL");
});

test("detects shortened URLs", () => {
  const findings = detectShortenedUrls(["https://bit.ly/example"]);

  assert.equal(findings.length, 1);
  assert.equal(findings[0].ruleId, "SHORTENED_URL");
});

test("detects suspicious top-level domains", () => {
  const findings = detectSuspiciousTlds(["https://account-help.example.ru/login"]);

  assert.equal(findings.length, 1);
  assert.equal(findings[0].ruleId, "SUSPICIOUS_TLD");
});

test("detects credential harvesting language", () => {
  const text = "Urgent: verify your password immediately to prevent account suspension.";
  const findings = detectCredentialLanguage(text);

  assert.equal(findings.length, 1);
  assert.equal(findings[0].ruleId, "CREDENTIAL_LANGUAGE");
});

test("runs all rules and sorts by severity", () => {
  const text = "Urgent login password verify http://192.0.2.5/login https://bit.ly/fake";
  const findings = runRules(text);

  assert.equal(findings[0].severity, "high");
  assert.ok(findings.length >= 3);
});
