# 📜 Lore Data Schema Specification

This document defines the formal data schema for historical eras, timeline events, and citations in the **Thrilling Tales (Teyvat Interactive Timeline)** project.

---

## 1. Schema Overview

All lore entries are authored in JSON format adhering to standard JSON schemas. The data model is centered around two core entities:
1. **Eras (`Era`)**: High-level cosmological epochs.
2. **Events (`TimelineEvent`)**: Granular historical occurrences, battles, civilization shifts, and discoveries.

---

## 2. Event Schema (`TimelineEvent`)

```typescript
interface TimelineEvent {
  /** Unique kebab-case identifier (e.g., "fall-of-khaenriah") */
  id: string;

  /** Canonical title of the event */
  title: string;

  /** Reference to the parent Era ID */
  eraId: 'dragon-sovereign' | 'primordial-one' | 'second-who-came' | 'pre-archon-war' | 'archon-war' | 'cataclysm' | 'modern';

  /** Chronological placement */
  chronology: {
    /** Sorting rank to determine sequential order within the era */
    orderRank: number;

    /** Human-readable timestamp display (e.g., "~500 Years Ago", "Circa 2,000 BCE") */
    displayLabel: string;

    /** Estimated duration in years if known (optional) */
    durationYears?: number;
  };

  /** Short summary displayed on timeline cards (1-2 sentences) */
  summary: string;

  /** In-depth description supporting Markdown formatting */
  description: string;

  /** Primary nation or realm where the event transpired */
  region: 'Mondstadt' | 'Liyue' | 'Inazuma' | 'Sumeru' | 'Fontaine' | 'Natlan' | 'Snezhnaya' | 'Khaenri\'ah' | 'Enkanomiya' | 'Celestia' | 'Dark Sea';

  /** Specific sub-location (e.g., "Sal Vindagnyr", "The Chasm", "Tatarasuna") */
  location?: string;

  /** Factions involved in this event */
  factions: Array<'Celestia' | 'Abyss Order' | 'Fatui' | 'Hexenzirkel' | 'Knights of Favonius' | 'Liyue Qixing' | 'Tri-Commission' | 'Akademiya' | 'Seven Sovereigns' | 'Khaenri\'ah Dynasty'>;

  /** Major characters involved */
  characters: string[];

  /** Primary source citations grounding this event in canon */
  sources: SourceCitation[];

  /** Spoiler gate tag indicating the latest quest required to understand this event */
  spoilerGate?: {
    questChapter: string; // e.g., "Archon Quest Chapter IV: Act V"
    warningText?: string;
  };

  /** Set to true if the chronological placement is theoretical or deduced rather than explicitly stated */
  isSpeculative: boolean;
}

interface SourceCitation {
  /** Type of in-game media */
  category: 'artifact' | 'weapon' | 'book' | 'quest' | 'voiceline' | 'material' | 'official_media';

  /** Name of the in-game item or source */
  title: string;

  /** Specific piece, volume, or chapter (e.g., "Circlet of Logos", "Vol. 2") */
  subItem?: string;

  /** Exact excerpt or quote from the in-game text */
  quote?: string;

  /** Optional external link (e.g., Genshin Impact Wiki / Project Amber) */
  url?: string;
}
```

---

## 3. Example Event Entry

```json
{
  "id": "fall-of-khaenriah",
  "title": "The Cataclysm & The Fall of Khaenri'ah",
  "eraId": "cataclysm",
  "chronology": {
    "orderRank": 50010,
    "displayLabel": "500 Years Ago"
  },
  "summary": "The underground godless nation of Khaenri'ah is devastated by a catastrophic breach of Abyssal power and subsequent divine punishment, releasing monsters across all of Teyvat.",
  "description": "Rhinedottir's corrupted alchemy and the release of Abyssal energies led to a global cataclysm. The Seven Archons were summoned to Khaenri'ah by Celestia. The eclipse dynasty collapsed, its citizens were cursed into monsters or immortals, and devastating beasts like Durin and the Golden Wolflord invaded the seven nations.",
  "region": "Khaenri'ah",
  "location": "Eclipse Dynasty Capital",
  "factions": ["Khaenri'ah Dynasty", "Abyss Order", "Celestia"],
  "characters": ["Dainsleif", "Rhinedottir", "Pierro", "Lumine", "Aether", "Makoto", "Rukkhadevata"],
  "sources": [
    {
      "category": "book",
      "title": "Breeze Amidst the Forest",
      "subItem": "Vol. 2 - Ballad of the Durin",
      "quote": "Five hundred years ago, disaster descended upon the land. The dark dragon Durin was born of corrupted alchemy..."
    },
    {
      "category": "artifact",
      "title": "Deepwood Memories",
      "subItem": "Timepiece of the Verdant Strider",
      "quote": "The black sun fell, and the disaster brought contamination from the deepest void..."
    }
  ],
  "spoilerGate": {
    "questChapter": "Archon Quest Chapter I: Act IV - We Will Be Reunited"
  },
  "isSpeculative": false
}
```

---

## 4. Era Schema (`Era`)

```json
{
  "id": "cataclysm",
  "name": "The Cataclysm (500 Years Ago)",
  "order": 5,
  "description": "The catastrophic crisis that struck five centuries ago, ending Khaenri'ah and shaking the foundations of the Seven Nations.",
  "color": "#a855f7",
  "dominantFactions": ["Khaenri'ah Dynasty", "Abyss Order", "The Seven Archons"]
}
```
