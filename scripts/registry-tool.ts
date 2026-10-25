import fs from 'fs';
import path from 'path';

const REGISTRY_PATH = path.join(process.cwd(), 'docs', 'REGISTRY.md');

interface RegistryData {
  content: string;
  totalCrs: number;
  openCrs: number;
  totalBugs: number;
  openBugs: number;
  highestCr: number;
  highestBug: number;
}

function parseRegistry(): RegistryData {
  if (!fs.existsSync(REGISTRY_PATH)) {
    throw new Error(`Registry file not found at ${REGISTRY_PATH}`);
  }
  const content = fs.readFileSync(REGISTRY_PATH, 'utf8');

  // Find all CR-XXX
  const crMatches = Array.from(content.matchAll(/\|\s*\*\*CR-(\d+)\*\*\s*\|/g));
  let highestCr = 0;
  for (const m of crMatches) {
    const num = parseInt(m[1], 10);
    if (num > highestCr) highestCr = num;
  }

  // Find all BUG-XXX
  const bugMatches = Array.from(content.matchAll(/\|\s*\*\*BUG-(\d+)\*\*\s*\|/g));
  let highestBug = 0;
  for (const m of bugMatches) {
    const num = parseInt(m[1], 10);
    if (num > highestBug) highestBug = num;
  }

  // Count open items
  const openCrMatches = content.match(/CR-\d+.*?(?:⏳ Queued|📋 Open|In Progress)/g) || [];
  const openBugMatches = content.match(/BUG-\d+.*?(?:⏳ Queued|📋 Open|In Progress)/g) || [];

  return {
    content,
    totalCrs: crMatches.length,
    openCrs: openCrMatches.length,
    totalBugs: bugMatches.length,
    openBugs: openBugMatches.length,
    highestCr,
    highestBug,
  };
}

const args = process.argv.slice(2);
const command = args[0] || 'status';

const data = parseRegistry();

switch (command) {
  case 'next-cr': {
    const nextNum = String(data.highestCr + 1).padStart(3, '0');
    console.log(`CR-${nextNum}`);
    break;
  }
  case 'next-bug': {
    const nextNum = String(data.highestBug + 1).padStart(3, '0');
    console.log(`BUG-${nextNum}`);
    break;
  }
  case 'status': {
    console.log(`=== CroLingo Registry Status ===`);
    console.log(`Total CRs: ${data.totalCrs} (${data.totalCrs - data.openCrs} Completed, ${data.openCrs} Queued)`);
    console.log(`Total Bugs: ${data.totalBugs} (${data.totalBugs - data.openBugs} Resolved, ${data.openBugs} Queued)`);
    console.log(`Next CR ID: CR-${String(data.highestCr + 1).padStart(3, '0')}`);
    console.log(`Next Bug ID: BUG-${String(data.highestBug + 1).padStart(3, '0')}`);
    break;
  }
  default:
    console.log(`Unknown command: ${command}`);
    console.log(`Usage: tsx scripts/registry-tool.ts [status|next-cr|next-bug]`);
}
