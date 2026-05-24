export function renderReport(findings) {
  const lines = ["# PhishGuard Lite Report", ""];

  if (findings.length === 0) {
    lines.push("No phishing risk signals detected.");
    return lines.join("\n");
  }

  lines.push(`Findings detected: ${findings.length}`, "");

  findings.forEach((finding, index) => {
    lines.push(`## ${index + 1}. ${finding.title}`);
    lines.push("");
    lines.push(`- Rule: \`${finding.ruleId}\``);
    lines.push(`- Severity: \`${finding.severity}\``);
    lines.push("- Evidence:");
    finding.evidence.forEach((item) => lines.push(`  - \`${item}\``));
    lines.push(`- Recommendation: ${finding.recommendation}`);
    lines.push("");
  });

  return lines.join("\n");
}
