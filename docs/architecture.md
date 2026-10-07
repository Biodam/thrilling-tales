# 🏛️ Architecture & Technical Design

This document details the software architecture, data lifecycle, rendering strategy, and subfolder hosting model for **Thrilling Tales (Teyvat Interactive Timeline)**.

---

## 1. Architectural Philosophy

1. **Static-First & Zero Server Burden**: The entire application runs client-side as static assets hosted on GitHub Pages. No backend databases or server runtimes are needed.
2. **Modular Data Pipelines**: Lore is stored as human-readable, version-controlled JSON data files. Lore entries can be updated or contributed to via simple Git pull requests.
3. **Subfolder Portability**: All asset loaders and internal links operate relatively, making the codebase agnostic to its hosting mount path (`/`, `/thrilling-tales/`, or custom domains).

---

## 2. Component Diagram

```mermaid
graph TD
    subgraph DataLayer [Data Layer]
        ErasData[eras.json]
        EventsData[events/*.json]
        SourcesData[sources.json]
    end

    subgraph CoreEngine [Client Engine]
        DataLoader[Data Loader & Validator]
        FilterEngine[Filter & Search Engine]
        TimelineEngine[Chronological Axis & Zoom Manager]
    end

    subgraph PresentationLayer [UI Presentation Layer]
        LandingView[Root Landing Page (index.html)]
        TimelineView[Timeline Subpage (timeline/index.html)]
        EventDrawer[Event Citation Drawer]
        SpoilerManager[Spoiler Protection Controller]
    end

    DataLayer --> DataLoader
    DataLoader --> FilterEngine
    FilterEngine --> TimelineEngine
    TimelineEngine --> TimelineView
    TimelineView --> EventDrawer
    SpoilerManager -.-> FilterEngine
```

---

## 3. Directory & Asset Layout

```text
├── index.html                   # Project portal & overview
├── timeline/
│   └── index.html               # Main interactive timeline application
├── data/                        # Static lore data (structured JSON)
│   ├── eras.json                # Master list of canonical epochs
│   ├── factions.json            # Factions & allegiances (Celestia, Fatui, etc.)
│   └── events/                  # Chunked event datasets
│       ├── primordial.json      # Primordial One / Sovereigns
│       ├── archon-war.json      # Archon War era
│       ├── cataclysm.json       # 500 YA Khaenri'ah cataclysm
│       └── traveler-era.json    # Modern Traveler journey
├── assets/
│   ├── css/
│   │   ├── style.css            # Global typography & Teyvat design system
│   │   └── timeline.css         # Timeline canvas & node styling
│   ├── js/
│   │   ├── main.js              # Global router & utilities
│   │   ├── timeline.js          # Timeline rendering & interactions
│   │   └── data-store.js        # Event loading & filtering logic
│   └── images/                  # Badges, icons, and visual assets
```

---

## 4. Subfolder URL Resolution Strategy

When deploying on GitHub Pages, repository sites are served under a base path:
`https://<username>.github.io/<repo-name>/`

To ensure assets load without 404 errors:
- **HTML Links & Scripts**: Use strict relative references:
  ```html
  <!-- In index.html (Root) -->
  <link rel="stylesheet" href="./assets/css/style.css">
  <a href="./timeline/">Enter Timeline</a>

  <!-- In timeline/index.html (Subpage) -->
  <link rel="stylesheet" href="../assets/css/style.css">
  <a href="../index.html">Back to Home</a>
  ```
- **JavaScript Dynamic Fetching**: Compute URLs relative to the current script module:
  ```javascript
  const DATA_URL = new URL('../data/eras.json', import.meta.url).href;
  fetch(DATA_URL).then(res => res.json());
  ```

---

## 5. Performance & Scalability Strategy

- **Chunked Data Loading**: Rather than downloading the entire multi-megabyte history of Teyvat upfront, the timeline loads `eras.json` first, and dynamically fetches specific era datasets (`events/cataclysm.json`) as the user navigates or scrolls.
- **Virtual DOM / DOM Recycling**: When hundreds of events are visible, only events within the current viewport range are rendered into the DOM to maintain a consistent 60fps rendering rate.
- **Client-Side Cache**: Fetched era datasets are cached in memory or IndexedDB to prevent redundant network requests.
