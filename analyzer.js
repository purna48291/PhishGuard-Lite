import { readFile } from "node:fs/promises";
import { renderReport } from "./report.js";
import { runRules } from "./rules.js";

export async function analyzeFile(path) {
  const text = await readFile(path, "utf8");
  const findings = runRules(text);
  return { findings, report: renderReport(findings) };
}
