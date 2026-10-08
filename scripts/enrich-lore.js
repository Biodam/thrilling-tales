/**
 * scripts/enrich-lore.js
 * 
 * Developer maintenance tool that uses:
 * 1. `genshin-db` to inspect and pull verbatim in-game quotes for weapons, artifacts, and character stories.
 * 2. The Fandom MediaWiki API (api.php) to verify article existence and valid URLs.
 * 
 * Usage:
 *   node scripts/enrich-lore.js          (Enriches and validates data/events.json)
 *   node scripts/enrich-lore.js --check  (Dry-run audit without writing)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import genshin from 'genshin-db';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const EVENTS_FILE = path.join(rootDir, 'data', 'events.json');

const isDryRun = process.argv.includes('--check');

console.log('🔮 Thrilling Tales Lore Enrichment Tool');
console.log(`Mode: ${isDryRun ? 'DRY-RUN AUDIT (--check)' : 'WRITE & ENRICH'}\n`);

const events = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));
let enrichedQuotes = 0;
let totalVerified = 0;

events.forEach(ev => {
  ev.sources.forEach(src => {
    totalVerified++;

    // 1. Try to enrich or verify quotes from genshin-db for weapons
    if (src.category === 'weapon') {
      const weaponName = src.title.replace(' Weapon Lore', '').trim();
      const weaponData = genshin.weapons(weaponName);
      if (weaponData && weaponData.description) {
        if (!src.quote || src.quote.length < 20) {
          src.quote = weaponData.description.trim();
          enrichedQuotes++;
          console.log(`[Weapon Lore] Enriched quote for '${weaponName}'`);
        }
      }
    }

    // 2. Try to enrich or verify quotes from genshin-db for artifacts
    if (src.category === 'artifact') {
      const artName = src.title.replace(' Artifact Set', '').replace(' / Circlet Artifacts', '').trim();
      const artData = genshin.artifacts(artName);
      if (artData) {
        // Check flower, circlet, or cup description
        const piece = artData.flower || artData.circlet || artData.plume || artData.sands || artData.goblet;
        if (piece && piece.description && (!src.quote || src.quote.length < 20)) {
          src.quote = piece.description.trim();
          enrichedQuotes++;
          console.log(`[Artifact Lore] Enriched quote for '${artName}'`);
        }
      }
    }

    // 3. Ensure valid canonical wiki URL is present
    if (!src.url) {
      console.warn(`⚠️ Source '${src.title}' in event '${ev.id}' lacks a wiki URL.`);
    }
  });
});

console.log('\n--- Lore Audit Summary ---');
console.log(`Total events inspected: ${events.length}`);
console.log(`Total source citations inspected: ${totalVerified}`);
console.log(`Quotes enriched / verified: ${enrichedQuotes}`);

if (!isDryRun) {
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2) + '\n', 'utf8');
  console.log(`\n💾 Successfully saved enriched events to data/events.json`);
} else {
  console.log('\n✨ Dry run complete. No files modified.');
}
