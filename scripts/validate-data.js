/**
 * scripts/validate-data.js
 * 
 * Strict data validation linter for Teyvat Interactive Timeline.
 * Validates:
 * 1. Schema integrity of data/eras.json and data/events.json.
 * 2. Strict chronological orderRank ordering (0 - 1000).
 * 3. Verified presence of yearsAgo and formatted display labels.
 * 4. Referential integrity: every event.eraId must exist in eras.json.
 * 5. Source citations integrity: every source must have title, category, and valid wiki URL.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const ERAS_FILE = path.join(rootDir, 'data', 'eras.json');
const EVENTS_FILE = path.join(rootDir, 'data', 'events.json');

let errors = [];
let warnings = [];

console.log('🔍 Validating Thrilling Tales Lore Data...\n');

// 1. Load Files
if (!fs.existsSync(ERAS_FILE)) {
  console.error(`❌ Missing file: ${ERAS_FILE}`);
  process.exit(1);
}
if (!fs.existsSync(EVENTS_FILE)) {
  console.error(`❌ Missing file: ${EVENTS_FILE}`);
  process.exit(1);
}

let eras = [];
let events = [];

try {
  eras = JSON.parse(fs.readFileSync(ERAS_FILE, 'utf8'));
  console.log(`✅ Loaded ${eras.length} historical eras from data/eras.json`);
} catch (e) {
  console.error(`❌ Failed to parse data/eras.json: ${e.message}`);
  process.exit(1);
}

try {
  events = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));
  console.log(`✅ Loaded ${events.length} timeline events from data/events.json`);
} catch (e) {
  console.error(`❌ Failed to parse data/events.json: ${e.message}`);
  process.exit(1);
}

// 2. Validate Eras
const eraIds = new Set();
eras.forEach((era, idx) => {
  if (!era.id) errors.push(`Era at index ${idx} is missing 'id'.`);
  if (!era.name) errors.push(`Era '${era.id}' is missing 'name'.`);
  if (!era.shortName) errors.push(`Era '${era.id}' is missing 'shortName'.`);
  if (era.startRank === undefined || era.endRank === undefined) {
    errors.push(`Era '${era.id}' is missing startRank or endRank.`);
  }
  if (era.startRank > era.endRank) {
    errors.push(`Era '${era.id}' startRank (${era.startRank}) > endRank (${era.endRank}).`);
  }
  if (!era.wikiUrl || !era.wikiUrl.startsWith('https://genshin-impact.fandom.com/')) {
    warnings.push(`Era '${era.id}' lacks a valid fandom wikiUrl.`);
  }

  if (era.bgImage) {
    const bgFilePath = path.join(rootDir, era.bgImage.replace(/^\.\//, ''));
    if (!fs.existsSync(bgFilePath)) {
      errors.push(`Era '${era.id}' specifies bgImage '${era.bgImage}' which does not exist on disk at ${bgFilePath}.`);
    }
  }

  if (era.alternateBgImage) {
    const altFilePath = path.join(rootDir, era.alternateBgImage.replace(/^\.\//, ''));
    if (!fs.existsSync(altFilePath)) {
      errors.push(`Era '${era.id}' specifies alternateBgImage '${era.alternateBgImage}' which does not exist on disk at ${altFilePath}.`);
    }
  }

  if (eraIds.has(era.id)) {
    errors.push(`Duplicate era id: '${era.id}'.`);
  }
  eraIds.add(era.id);
});

// 3. Validate Events
const eventIds = new Set();
let previousRank = -1;

events.forEach((ev, idx) => {
  const prefix = `Event #${idx + 1} ('${ev.id || 'unnamed'}')`;

  // Required Fields
  if (!ev.id) errors.push(`${prefix}: Missing 'id'.`);
  if (!ev.title) errors.push(`${prefix}: Missing 'title'.`);
  if (ev.orderRank === undefined) errors.push(`${prefix}: Missing 'orderRank'.`);
  if (ev.yearsAgo === undefined) errors.push(`${prefix}: Missing 'yearsAgo'.`);
  if (!ev.dateDisplay) errors.push(`${prefix}: Missing 'dateDisplay'.`);
  if (!ev.eraId) errors.push(`${prefix}: Missing 'eraId'.`);

  // Unique ID
  if (eventIds.has(ev.id)) {
    errors.push(`${prefix}: Duplicate event ID '${ev.id}'.`);
  }
  eventIds.add(ev.id);

  // Referential Integrity
  if (!eraIds.has(ev.eraId)) {
    errors.push(`${prefix}: References non-existent eraId '${ev.eraId}'.`);
  }

  // Monotonic Order Rank Check
  if (ev.orderRank < previousRank) {
    errors.push(
      `${prefix}: Order rank ${ev.orderRank} is less than preceding event's rank ${previousRank}. Chronological ordering broken!`
    );
  }
  previousRank = ev.orderRank;

  // Citations & Sources Validation
  if (!ev.sources || !Array.isArray(ev.sources) || ev.sources.length === 0) {
    errors.push(`${prefix}: Missing 'sources' array or has 0 sources.`);
  } else {
    ev.sources.forEach((src, sIdx) => {
      if (!src.title) errors.push(`${prefix} source #${sIdx + 1}: Missing 'title'.`);
      if (!src.category) errors.push(`${prefix} source #${sIdx + 1}: Missing 'category'.`);
      if (!src.url || !src.url.startsWith('https://genshin-impact.fandom.com/')) {
        errors.push(`${prefix} source #${sIdx + 1} ('${src.title}'): Missing or invalid fandom wiki URL.`);
      }
    });
  }
});

// 4. Report Results
console.log('\n--- Validation Summary ---');
console.log(`Total Eras: ${eras.length}`);
console.log(`Total Events: ${events.length}`);

if (warnings.length > 0) {
  console.log(`\n⚠️  Warnings (${warnings.length}):`);
  warnings.forEach(w => console.log(`   - ${w}`));
}

if (errors.length > 0) {
  console.error(`\n❌  FAILED with ${errors.length} error(s):`);
  errors.forEach(err => console.error(`   ✖ ${err}`));
  process.exit(1);
} else {
  console.log('\n✨ All data validation checks passed with ZERO errors! Perfect schema conformance.');
  process.exit(0);
}
