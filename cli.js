#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { analyzeFile } from "./analyzer.js";

function printUsage() {
  console.log("Usage: node src/cli.js <email.txt> [--output <report.md>]");
}

function parseArgs(argv) {
  const args = [...argv];
  const input = args.shift();
  const outputIndex = args.indexOf("--output");
  const output = outputIndex >= 0 ? args[outputIndex + 1] : undefined;

  if (!input || args.includes("--help") || args.includes("-h")) {
    return { help: true };
  }

  if (outputIndex >= 0 && !output) {
    throw new Error("--output requires a file path");
  }

  return { input, output };
}

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);

  if (args.help) {
    printUsage();
    return 0;
  }

  const { report } = await analyzeFile(args.input);

  if (args.output) {
    await writeFile(args.output, report, "utf8");
  } else {
    console.log(report);
  }

  return 0;
}

main().then((code) => {
  process.exitCode = code;
}).catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
