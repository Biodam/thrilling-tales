# 🤖 AGENTS.md — AI Agent Contributor Guidelines

This document provides instructions, technical constraints, and domain context for AI coding assistants working in the **Thrilling Tales (Teyvat Interactive Timeline)** repository.

---

## 🎯 1. Project Overview & Mission

The goal of this project is to build an interactive, chronological timeline visualizer for **Genshin Impact lore**.
Genshin's world history spans tens of thousands of years, but the narrative is presented out of order and scattered across hundreds of items, artifacts, books, and quest dialogues.

This repository hosts a static website deployed to **GitHub Pages in a subfolder** (e.g. `https://<username>.github.io/<repo-name>/`), allowing users to:
1. Explore Teyvat's history in chronological sequence.
2. Filter events by region, faction, Archon, and character.
3. Inspect primary in-game citations and book/artifact excerpts.
4. Toggle spoiler levels to match their story progression.

---

## ⚠️ 2. Crucial Technical Constraints

### A. Strict Relative Path Discipline (GitHub Pages Subfolder Hosting)
Because this repository is hosted on GitHub Pages in a repository subfolder:
- **NEVER use root-relative paths** such as `<link href="/assets/style.css">` or `<a href="/timeline/">`.
- Root paths resolve to `https://<username>.github.io/assets/...` and will return 404 errors.
- **ALWAYS use explicit relative paths**:
  - From root (`index.html`): `./assets/...`, `./timeline/`
  - From subpages (`timeline/index.html`): `../assets/...`, `../index.html`
- When writing JavaScript imports or fetch requests, compute relative paths or relative URLs (e.g. `new URL('./data.json', import.meta.url)`).

### B. Jekyll Bypass (`.nojekyll`)
- Keep `.nojekyll` in the root repository. Without this file, GitHub Pages runs Jekyll, which ignores directories starting with `_` and alters certain file processing.

### C. Zero-Dependency & Framework Modularity
- The core application is designed to run directly as standard HTML5, CSS3, and ES Modules without an obligatory compile/build step.
- If bundlers (such as Vite) are integrated in future phases, the `base` property in configuration must be set to `'./'` (relative base) to maintain subfolder compatibility.

---

## 📜 3. Genshin Impact Lore Guidelines & Chronology

When adding or formatting lore data, adhere to canonical Teyvat chronology and terminology:

### Canonical Chronological Eras
1. **Dragon Sovereigns Era / Pre-Genesis**: Reign of the Seven Dragon Sovereigns; primordial elements.
2. **Era of the Primordial One (Phanes)**: Arrival of the Heavenly Principles, creation of the Four Shades, defeat of the dragons, creation of humans, Unified Human Civilization.
3. **The Second Who Came & War of Funerary Flame**: Great war shaking heaven and earth; shattering of the Unified Civilization; sinking of Enkanomiya.
4. **Pre-Archon War Period**: Rise of ancient human civilizations (Sal Vindagnyr, Remuria, Gurabad, Guili Assembly, Old Mondstadt under Decarabian).
5. **The Archon War (~3,700 to 2,000 YA)**: Divine conflict for the Seven Divine Thrones; Morax, Barbatos, Ei/Makoto, Rukkhadevata, etc. establish the Seven Nations.
6. **Post-Archon War / Peace of the Seven**: Consolidation of national cultures and mortal governance.
7. **The Cataclysm of Khaenri'ah (500 YA)**: Sinking/fall of Khaenri'ah, global Abyssal monsters, death of Makoto, Rukkhadevata, and Egeria, transformation into hilichurls.
8. **Modern Era / Traveler's Journey**: The Traveler awakens; Mondstadt, Liyue, Inazuma, Sumeru, Fontaine, Natlan, and Snezhnaya chapters.

### Source Verification Hierarchy
Always prioritize primary canonical sources:
1. **Tier 1 (Canonical Ground Truth)**: In-game item descriptions (weapons, artifacts, materials), in-game books, quest dialog transcripts, character voice lines, character stories.
2. **Tier 2 (Official Media)**: HoYoLAB official lore releases, official trailers (e.g., *Teyvat Chapter Storyline Preview: Travail*, *Winter Night's Lazzo*), official Genshin manga.
3. **Tier 3 (Speculation / Theories)**: Fan extrapolations or unconfirmed connections must be explicitly flagged with `isSpeculative: true`.

---

## 📐 4. Coding Standards & Conventions

1. **Semantic HTML**: Use proper `<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, and `<footer>` elements.
2. **CSS Variables & Theming**:
   - Utilize theme variables defined in `assets/css/style.css` (e.g., `--gold-celestial`, `--cyan-irminsul`, `--bg-abyss`).
   - Mobile-first, responsive layouts.
3. **Data Schema Conformance**: All event entries must conform to the structure documented in [`docs/lore-schema.md`](docs/lore-schema.md).
4. **Official Localization Glossary**: All names, titles, places, and events must strictly adhere to the official localization documented in [`docs/glossary.md`](docs/glossary.md).
5. **Accessibility**: All interactive elements (timeline nodes, modal dialogs, drawers) must be keyboard navigable (`tabindex`, `aria-*` tags).

---

## 🧪 5. Testing & Verification Checklist

Before completing tasks, agents must verify:
- [ ] Local static server starts without errors (`python3 -m http.server 8080`).
- [ ] Navigation works forwards and backwards between `/` and `/timeline/`.
- [ ] No 404 errors in browser network logs for CSS, JS, or image assets.
- [ ] All internal markdown links resolve correctly.
- [ ] Event timestamps, names, and sources follow canonical spelling (e.g., *Khaenri'ah*, *Enkanomiya*, *Phanes*, *Rukkhadevata*).
