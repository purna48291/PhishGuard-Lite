# PhishGuard Lite

PhishGuard Lite is a defensive cybersecurity project that analyzes suspicious email text and links for common phishing risk signals. It is built for students, beginners, and junior security analysts who want a safe portfolio project focused on detection and awareness.

## Why This Project Is Useful

Phishing is one of the most common security problems. This project helps you understand how analysts inspect suspicious messages by checking links, wording, sender clues, and credential-harvesting patterns.

It does not send emails, scan websites, exploit systems, collect credentials, or contact third-party targets.

## Features

- Extracts URLs from email text
- Checks for risky link patterns
- Detects IP-address URLs
- Detects suspicious login and password wording
- Detects URL shorteners
- Detects excessive subdomains
- Detects suspicious top-level domains
- Generates a clear Markdown report
- Includes sample email data and automated tests

## Project Structure

```text
src/
  analyzer.js
  cli.js
  report.js
  rules.js
samples/
  sample-email.txt
test/
  rules.test.js
package.json
README.md
ROADMAP.md
```

## Requirements

- Node.js 20 or newer

No external npm packages are required.

## Quick Start

Run the analyzer on the sample email:

```powershell
npm start
```

Run it directly:

```powershell
node src/cli.js samples/sample-email.txt
```

Write the report to a file:

```powershell
node src/cli.js samples/sample-email.txt --output report.md
```

Run tests:

```powershell
npm test
```

## Example Finding

```markdown
## Suspicious shortened URL

- Severity: medium
- Evidence: bit.ly
- Recommendation: Expand the shortened URL in a safe analysis environment before clicking.
```

## Good GitHub Description

Defensive phishing email and link analyzer that detects suspicious URLs, login wording, shorteners, and credential-harvesting clues.

## Suggested GitHub Topics

```text
cybersecurity
phishing
email-security
defensive-security
blue-team
security-awareness
nodejs
portfolio-project
```

## Safety Note

This is a defensive learning project. Do not use real sensitive emails unless you remove private data first.
