# 📜 Thrilling Tales — Teyvat Interactive Timeline

[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-blue?logo=github)](https://pages.github.com/)
[![Lore](https://img.shields.io/badge/Genshin%20Impact-Lore%20Timeline-gold)](https://genshin.hoyoverse.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An interactive, chronological timeline designed to make the deep and sprawling lore of **Teyvat (Genshin Impact)** easily discoverable, searchable, and interconnected.

---

## 🌟 The Problem & Vision

Genshin Impact possesses one of the most intricately constructed fantasy world histories in modern gaming. However, its lore is notoriously fragmented across:
- **Weapon Lore & Artifact Descriptions** (e.g., *Deepwood Memories*, *Thundering Fury*, *Staff of Homa*)
- **In-Game Books & Relics** (e.g., *Before Sun and Moon*, *The Byakuyakoku Collection*, *Perinheri*)
- **World Quests & Hidden Exploration Objectives** (e.g., *Narzissenkreuz Ordo*, *Aranyaka*, *Gourmet Supremos*)
- **Limited-Time Events** (events that new players can no longer experience in-game)
- **Character Voice-Lines and Character Stories**

**Thrilling Tales** brings these disparate fragments together into a unified, interactive chronological visualizer. Rather than reading disconnected wiki articles, users can follow the rise and fall of civilizations, gods, and factions across the flow of Teyvat's history.

---

## 🗺️ Core Eras of Teyvat

The timeline is structured around canonical eras and historical milestones:

```mermaid
timeline
    title Major Historical Epochs of Teyvat
    Primordial Era : Arrival of the Primordial One (Phanes) : Defeat of the Seven Sovereigns : Unified Human Civilization
    Second Who Came : War in Heaven : Sinking of Enkanomiya : Shattering of the Sky
    Archon War : Divine struggles across the Seven Nations : Establishment of the Seven Thrones : Founding of Guili Assembly & Decarabian's Fall
    Cataclysm (500 YA) : Fall of Khaenri'ah : Abyssal Incursion : Sacrifice of Greater Lord Rukkhadevata & Makoto
    Modern Era : Traveler Awakens : Mondstadt to Natlan & Snezhnaya : Unveiling of the Heavenly Principles
```

---

## 🚀 Key Features & Roadmap

- [x] **Zero-Build Static Architecture**: Seamlessly hosted on GitHub Pages in a repository subfolder.
- [x] **Subpage Routing**: Clean separation between landing page (`/`) and the interactive timeline canvas (`/timeline/`).
- [ ] **Interactive Timeline Canvas**: Zoomable, pannable chronological axis spanning thousands of years.
- [ ] **Multi-Dimensional Filters**: Filter events by nation/region, faction (Celestia, Abyss, Fatui, Hexenzirkel), and prominent characters.
- [ ] **Lore Citation Drawer**: Direct in-game source citations with quotes from books, artifacts, and dialogue.
- [ ] **Spoiler Protection**: Configurable spoiler boundary based on your current Archon Quest progression.
- [ ] **Search & Cross-Referencing**: Fast client-side search across events, characters, and historical documents.

---

## 📂 Repository Structure

```text
.
├── .gitignore               # Ignored files (system, IDE, build artifacts)
├── .nojekyll                # Disables Jekyll processing on GitHub Pages
├── README.md                # Project documentation and roadmap
├── AGENTS.md                # AI agent operating instructions & lore guidelines
├── docs/                    # Technical & architectural specifications
│   ├── architecture.md      # Data pipeline, rendering engine & client architecture
│   ├── lore-schema.md       # JSON/YAML data format specification for events
│   └── deployment.md        # GitHub Pages subfolder deployment guide
├── index.html               # Main project landing page
├── timeline/                # Timeline application subfolder
│   └── index.html           # Interactive timeline "Hello World" canvas
└── assets/                  # Shared static web assets
    ├── css/
    │   └── style.css        # Thematic styles (Teyvat/Irminsul aesthetic)
    └── js/
        └── main.js          # Client-side timeline interactions & helpers
```

---

## 💻 Local Development

Because this project is built as a zero-dependency static web application, no compilation or npm installations are required to get started.

### Running with Python (Recommended)
```bash
# Clone the repository
git clone https://github.com/Biodam/thrilling-tales.git
cd thrilling-tales

# Start a local static file server
python3 -m http.server 8080
```
Then visit:
- **Landing Page**: [http://localhost:8080/](http://localhost:8080/)
- **Timeline Subpage**: [http://localhost:8080/timeline/](http://localhost:8080/timeline/)

### Running with Node / npx
```bash
npx serve . -l 8080
```

---

## 🌐 Live GitHub Pages Deployment (Subfolder Hosting)

The project is deployed and live on **GitHub Pages**:
- **Root Landing Page**: [https://biodam.github.io/thrilling-tales/](https://biodam.github.io/thrilling-tales/)
- **Interactive Timeline Subpage**: [https://biodam.github.io/thrilling-tales/timeline/](https://biodam.github.io/thrilling-tales/timeline/)

Continuous deployment is handled automatically via GitHub Actions on every push to `main` using `.github/workflows/deploy.yml`.

> **Note on Relative Paths**: All asset references and internal links use explicit relative paths (`./` and `../`), ensuring that the site functions flawlessly regardless of whether it is hosted at domain root or inside any repository subfolder.

For detailed deployment configuration and optional GitHub Actions workflows, refer to [`docs/deployment.md`](docs/deployment.md).

---

## 📚 Documentation

- [System Architecture](docs/architecture.md)
- [Lore Data Schema](docs/lore-schema.md)
- [Deployment Guide](docs/deployment.md)
- [AI Contributor Guidelines](AGENTS.md)

---

## 📜 Disclaimer & Credits

*Genshin Impact* is a registered trademark of **COGNOSPHERE PTE. LTD. / miHoYo**. All in-game lore, character names, and lore excerpts belong to miHoYo. This project is a non-commercial, fan-made open-source tool created for educational and community lore exploration.
