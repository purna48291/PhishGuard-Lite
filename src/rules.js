const SHORTENER_DOMAINS = new Set([
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl",
  "ow.ly",
  "is.gd",
  "buff.ly"
]);

const SUSPICIOUS_TLDS = new Set(["zip", "mov", "top", "xyz", "ru", "cn", "tk"]);

const CREDENTIAL_TERMS = [
  "password",
  "verify",
  "login",
  "account suspension",
  "urgent",
  "immediately",
  "confirm your account"
];

export function extractUrls(text) {
  return [...text.matchAll(/https?:\/\/[^\s<>"')]+/gi)]
    .map((match) => match[0].replace(/[.,;:!?]+$/, ""));
}

export function getHostname(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

export function createFinding({ ruleId, severity, title, evidence, recommendation }) {
  return { ruleId, severity, title, evidence, recommendation };
}

export function detectIpAddressUrls(urls) {
  return urls
    .map((url) => ({ url, hostname: getHostname(url) }))
    .filter(({ hostname }) => /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname))
    .map(({ url, hostname }) => createFinding({
      ruleId: "IP_ADDRESS_URL",
      severity: "high",
      title: "URL uses an IP address instead of a domain",
      evidence: [`hostname=${hostname}`, `url=${url}`],
      recommendation: "Treat IP-based login links as suspicious unless verified through a trusted channel."
    }));
}

export function detectShortenedUrls(urls) {
  return urls
    .map((url) => ({ url, hostname: getHostname(url).replace(/^www\./, "") }))
    .filter(({ hostname }) => SHORTENER_DOMAINS.has(hostname))
    .map(({ url, hostname }) => createFinding({
      ruleId: "SHORTENED_URL",
      severity: "medium",
      title: "Suspicious shortened URL",
      evidence: [`shortener=${hostname}`, `url=${url}`],
      recommendation: "Expand the shortened URL in a safe analysis environment before clicking."
    }));
}

export function detectSuspiciousTlds(urls) {
  return urls
    .map((url) => ({ url, hostname: getHostname(url) }))
    .filter(({ hostname }) => SUSPICIOUS_TLDS.has(hostname.split(".").at(-1)))
    .map(({ url, hostname }) => createFinding({
      ruleId: "SUSPICIOUS_TLD",
      severity: "medium",
      title: "URL uses a commonly abused top-level domain",
      evidence: [`hostname=${hostname}`, `url=${url}`],
      recommendation: "Verify the sender and destination before opening the link."
    }));
}

export function detectExcessiveSubdomains(urls, { maxLabels = 4 } = {}) {
  return urls
    .map((url) => ({ url, hostname: getHostname(url) }))
    .filter(({ hostname }) => hostname.split(".").filter(Boolean).length > maxLabels)
    .map(({ url, hostname }) => createFinding({
      ruleId: "EXCESSIVE_SUBDOMAINS",
      severity: "low",
      title: "URL has many subdomains",
      evidence: [`hostname=${hostname}`, `url=${url}`],
      recommendation: "Check whether the real registered domain matches the claimed brand."
    }));
}

export function detectCredentialLanguage(text) {
  const normalized = text.toLowerCase();
  const matches = CREDENTIAL_TERMS.filter((term) => normalized.includes(term));

  if (matches.length < 3) return [];

  return [createFinding({
    ruleId: "CREDENTIAL_LANGUAGE",
    severity: "medium",
    title: "Message uses credential-harvesting language",
    evidence: [`matched_terms=${matches.join(", ")}`],
    recommendation: "Do not enter credentials from email links. Navigate to the service manually."
  })];
}

export function runRules(text) {
  const urls = extractUrls(text);
  const severityOrder = new Map([
    ["critical", 0],
    ["high", 1],
    ["medium", 2],
    ["low", 3]
  ]);

  return [
    ...detectIpAddressUrls(urls),
    ...detectShortenedUrls(urls),
    ...detectSuspiciousTlds(urls),
    ...detectExcessiveSubdomains(urls),
    ...detectCredentialLanguage(text)
  ].sort((a, b) => (severityOrder.get(a.severity) ?? 99) - (severityOrder.get(b.severity) ?? 99));
}
