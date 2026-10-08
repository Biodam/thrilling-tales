/**
 * scripts/validate-data.js
 * 
 * Strict data validation linter for Teyvat Interactive Timeline.
 * Validates:
 * 1. Schema integrity of data/eras.json, data/events.json, data/eras_pt.json, and data/events_pt.json.
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

let totalErrors = [];
let totalWarnings = [];

function validateDataset(erasPath, eventsPath, langLabel) {
  console.log(`\n🔍 Validating ${langLabel} dataset...`);
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(erasPath)) {
    console.error(`❌ Missing file: ${erasPath}`);
    process.exit(1);
  }
  if (!fs.existsSync(eventsPath)) {
    console.error(`❌ Missing file: ${eventsPath}`);
    process.exit(1);
  }

  let eras = [];
  let events = [];

  try {
    eras = JSON.parse(fs.readFileSync(erasPath, 'utf8'));
    console.log(`✅ Loaded ${eras.length} historical eras from ${path.basename(erasPath)}`);
  } catch (e) {
    errors.push(`Failed to parse ${erasPath}: ${e.message}`);
  }

  try {
    events = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));
    console.log(`✅ Loaded ${events.length} timeline events from ${path.basename(eventsPath)}`);
  } catch (e) {
    errors.push(`Failed to parse ${eventsPath}: ${e.message}`);
  }

  // Validate Eras
  const eraIds = new Set();
  eras.forEach((era, idx) => {
    if (!era.id) errors.push(`[${langLabel}] Era at index ${idx} is missing 'id'.`);
    if (!era.name) errors.push(`[${langLabel}] Era '${era.id}' is missing 'name'.`);
    if (!era.shortName) errors.push(`[${langLabel}] Era '${era.id}' is missing 'shortName'.`);
    if (era.startRank === undefined || era.endRank === undefined) {
      errors.push(`[${langLabel}] Era '${era.id}' is missing startRank or endRank.`);
    }
    if (era.startRank > era.endRank) {
      errors.push(`[${langLabel}] Era '${era.id}' startRank (${era.startRank}) > endRank (${era.endRank}).`);
    }
    if (!era.wikiUrl || !era.wikiUrl.startsWith('https://genshin-impact.fandom.com/')) {
      warnings.push(`[${langLabel}] Era '${era.id}' lacks a valid fandom wikiUrl.`);
    }

    if (era.bgImage) {
      const bgFilePath = path.join(rootDir, era.bgImage.replace(/^\.\//, ''));
      if (!fs.existsSync(bgFilePath)) {
        errors.push(`[${langLabel}] Era '${era.id}' specifies bgImage '${era.bgImage}' which does not exist on disk.`);
      }
    }

    if (era.alternateBgImage) {
      const altFilePath = path.join(rootDir, era.alternateBgImage.replace(/^\.\//, ''));
      if (!fs.existsSync(altFilePath)) {
        errors.push(`[${langLabel}] Era '${era.id}' specifies alternateBgImage '${era.alternateBgImage}' which does not exist on disk.`);
      }
    }

    if (eraIds.has(era.id)) {
      errors.push(`[${langLabel}] Duplicate era id: '${era.id}'.`);
    }
    eraIds.add(era.id);
  });

  // Validate Events
  const eventIds = new Set();
  let previousRank = -1;

  events.forEach((ev, idx) => {
    const prefix = `[${langLabel}] Event #${idx + 1} ('${ev.id || 'unnamed'}')`;

    if (!ev.id) errors.push(`${prefix}: Missing 'id'.`);
    if (!ev.title) errors.push(`${prefix}: Missing 'title'.`);
    if (ev.orderRank === undefined) errors.push(`${prefix}: Missing 'orderRank'.`);
    if (ev.yearsAgo === undefined) errors.push(`${prefix}: Missing 'yearsAgo'.`);
    if (!ev.dateDisplay) errors.push(`${prefix}: Missing 'dateDisplay'.`);
    if (!ev.eraId) errors.push(`${prefix}: Missing 'eraId'.`);

    if (eventIds.has(ev.id)) {
      errors.push(`${prefix}: Duplicate event ID '${ev.id}'.`);
    }
    eventIds.add(ev.id);

    if (!eraIds.has(ev.eraId)) {
      errors.push(`${prefix}: References non-existent eraId '${ev.eraId}'.`);
    }

    if (ev.orderRank < previousRank) {
      errors.push(`${prefix}: Order rank ${ev.orderRank} < preceding rank ${previousRank}.`);
    }
    previousRank = ev.orderRank;

    if (!ev.sources || !Array.isArray(ev.sources) || ev.sources.length === 0) {
      errors.push(`${prefix}: Missing 'sources' array or has 0 sources.`);
    } else {
      ev.sources.forEach((src, sIdx) => {
        if (!src.title) errors.push(`${prefix} source #${sIdx + 1}: Missing 'title'.`);
        if (!src.category) errors.push(`${prefix} source #${sIdx + 1}: Missing 'category'.`);
        if (!src.url || !src.url.startsWith('https://genshin-impact.fandom.com/')) {
          errors.push(`${prefix} source #${sIdx + 1}: Missing or invalid wiki URL.`);
        }
      });
    }
  });

  totalErrors.push(...errors);
  totalWarnings.push(...warnings);
}

console.log('🔮 Thrilling Tales Lore Data Validator');

validateDataset(
  path.join(rootDir, 'data', 'eras.json'),
  path.join(rootDir, 'data', 'events.json'),
  'English (en)'
);

if (fs.existsSync(path.join(rootDir, 'data', 'eras_pt.json'))) {
  validateDataset(
    path.join(rootDir, 'data', 'eras_pt.json'),
    path.join(rootDir, 'data', 'events_pt.json'),
    'Portuguese (pt)'
  );
}

console.log('\n--- Overall Validation Summary ---');
if (totalWarnings.length > 0) {
  console.log(`⚠️  Warnings (${totalWarnings.length}):`);
  totalWarnings.forEach(w => console.log(`   - ${w}`));
}

if (totalErrors.length > 0) {
  console.error(`❌  FAILED with ${totalErrors.length} error(s):`);
  totalErrors.forEach(err => console.error(`   ✖ ${err}`));
  process.exit(1);
} else {
  console.log('✨ All validation checks for all language datasets passed with ZERO errors!');
  process.exit(0);
}
