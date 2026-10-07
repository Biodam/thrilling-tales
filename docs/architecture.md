# 🏛️ Architecture & Technical Design

This document details the software architecture, data lifecycle, rendering strategy, and subfolder hosting model for **Thrilling Tales (Teyvat Interactive Timeline)**.

---

## 1. Architectural Philosophy

1. **Static-First & Zero Server Burden**: The entire application runs client-side as static assets hosted on GitHub Pages. No backend databases or server runtimes are needed.
2. **Modular Data Pipelines**: Lore is stored as human-readable, version-controlled JSON data files. Lore entries can be updated or contributed to via simple Git pull requests.
3. **Subfolder Portability**: All asset loaders and internal links operate relatively, making the codebase agnostic to its hosting mount path (`/`, `/thrilling-tales/`, or custom domains).

---

## 2. Component Architecture

```mermaid
graph TD
    subgraph DataLayer [Data Layer]
        ErasData[data/eras.json]
        EventsData[data/events.json]
    end

    subgraph CoreEngine [Client Engine]
        DataLoader[Data Loader & Relative Path Resolver]
        PanZoomManager[Drag-to-Pan & Zoom Scale Controller]
        FilterEngine[Era Jumper & Live Keyword Search]
    end

    subgraph UIComponents [UI Presentation Layer]
        TopBar[Header Bar: Era Quick Jumpers & Search]
        HorizontalTrack[Horizontal Canvas: Era Bands, Ruler & Staggered Nodes]
        HoverTooltip[Floating Hover Preview Tooltip]
        InspectorDrawer[Pinned Event Inspector Drawer]
        ImageCarousel[Multi-Image Carousel with Captions & Nav]
    end

    DataLayer --> DataLoader
    DataLoader --> FilterEngine
    DataLoader --> HorizontalTrack
    PanZoomManager --> HorizontalTrack
    FilterEngine --> TopBar
    HorizontalTrack -.->|Hover| HoverTooltip
    HorizontalTrack -.->|Click to Pin| InspectorDrawer
    InspectorDrawer --> ImageCarousel
```

---

## 3. Directory & Asset Layout

```text
├── index.html                   # Dedicated horizontal timeline application
├── timeline/
│   └── index.html               # Backward-compatible redirect to root timeline
├── data/                        # Static lore data (structured JSON)
│   ├── eras.json                # Master list of canonical epochs & themes
│   └── events.json              # Canonical milestones with carousel images & citations
├── assets/
│   ├── css/
│   │   └── style.css            # Horizontal track, pins, tooltips, drawer & carousels
│   └── js/
│       └── main.js              # Complete interactive timeline engine & controllers
└── docs/                        # Architecture, lore schema, and deployment guides
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
