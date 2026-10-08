/**
 * Thrilling Tales — 2D Spatial Canvas Timeline Engine
 * 
 * Architecture:
 * - Free 2D Pan & Zoom spatial canvas (X and Y navigation with cursor-focused zooming)
 * - Expansive 2D Era Panels showcasing full 16:9 authentic in-game artworks
 * - Dual artwork switcher for Modern Era (Starfell Beach / Paimon vs. Zapolyarny Palace / Snezhnaya)
 * - Luminous SVG celestial connector rails linking historical epochs
 * - Real-time bird's-eye Minimap navigation
 * - Pinned event inspector drawer with multi-image carousel and primary citations
 * - Seamless Bilingual Localization (English & Brazilian Portuguese)
 */

const I18N = {
  en: {
    searchPlaceholder: 'Search lore, character, region...',
    searchPrev: 'Previous match (Shift+Enter)',
    searchNext: 'Next match (Enter)',
    searchClear: 'Clear search (Esc)',
    fitAll: 'Fit All',
    eventsBadge: (n) => `${n} event${n === 1 ? '' : 's'}`,
    canonicalMilestones: (n) => `${n} canonical milestone${n === 1 ? '' : 's'}`,
    epochBadge: (curr, total) => `Epoch ${String(curr).padStart(2, '0')} / ${String(total).padStart(2, '0')}`,
    keyFigures: 'KEY FIGURES:',
    factions: 'FACTIONS:',
    inspectEpochLore: 'Inspect Epoch Lore',
    epochWiki: 'Epoch Wiki',
    sources: (n) => `${n} source${n === 1 ? '' : 's'}`,
    historicalEpoch: 'Historical Epoch',
    epochRank: (start, end) => `Epoch Rank: ${start} – ${end}`,
    minimapTitle: '🗺️ Teyvat Overview',
    pinnedEventDetails: 'Pinned Event Details',
    tagSectionLabel: 'Categorization & Entities',
    citationSectionLabel: 'Citations & References',
    noCitations: 'No primary citations recorded yet.',
    regionTag: (reg) => `📍 Region: ${reg}`,
    spoilerTag: (lvl) => `⚠️ Spoiler: ${lvl}`,
    pinDetailsHint: 'Click card to pin details 📌',
    paimonArtBtn: '✨ Paimon & Traveler',
    snezArtBtn: '❄️ Snezhnaya',
    paimonAlt: 'Starfell Beach — Paimon & Traveler',
    paimonCaption: 'Starfell Beach — The Traveler awakens and fishes up Paimon',
    snezAlt: 'Zapolyarny Palace — Snezhnaya',
    snezCaption: 'Zapolyarny Palace — The seat of the Tsaritsa and the Fatui Harbingers',
    clickToReveal: 'Click to reveal milestones & lore',
    collapse: '⤡ Collapse',
    coverMilestones: (n) => `✨ ${n} Canonical Milestone${n === 1 ? '' : 's'}`,
    coverTooltip: 'Click to open detailed timeline',
    hints: {
      drag: 'to Pan 2D',
      wheel: 'to Zoom',
      space: 'Hand Pan',
      click: 'to Inspect',
      esc: 'to Unpin'
    },
    bottomSubtitle: 'Teyvat Interactive 2D Canvas • Genshin Impact Lore'
  },
  pt: {
    searchPlaceholder: 'Buscar história, personagem, região...',
    searchPrev: 'Resultado anterior (Shift+Enter)',
    searchNext: 'Próximo resultado (Enter)',
    searchClear: 'Limpar busca (Esc)',
    fitAll: 'Ver Tudo',
    eventsBadge: (n) => `${n} evento${n === 1 ? '' : 's'}`,
    canonicalMilestones: (n) => `${n} marco${n === 1 ? '' : 's'} canônico${n === 1 ? '' : 's'}`,
    epochBadge: (curr, total) => `Época ${String(curr).padStart(2, '0')} / ${String(total).padStart(2, '0')}`,
    keyFigures: 'FIGURAS PRINCIPAIS:',
    factions: 'FACÇÕES:',
    inspectEpochLore: 'Inspecionar História da Época',
    epochWiki: 'Wiki da Época',
    sources: (n) => `${n} fonte${n === 1 ? '' : 's'}`,
    historicalEpoch: 'Época Histórica',
    epochRank: (start, end) => `Classificação da Época: ${start} – ${end}`,
    minimapTitle: '🗺️ Visão Geral de Teyvat',
    pinnedEventDetails: 'Detalhes do Evento Fixado',
    tagSectionLabel: 'Categorização e Entidades',
    citationSectionLabel: 'Citações e Fontes',
    noCitations: 'Nenhuma citação primária registrada ainda.',
    regionTag: (reg) => `📍 Região: ${reg}`,
    spoilerTag: (lvl) => `⚠️ Spoiler: ${lvl}`,
    pinDetailsHint: 'Clique no card para fixar detalhes 📌',
    paimonArtBtn: '✨ Paimon e Viajante',
    snezArtBtn: '❄️ Snezhnaya',
    paimonAlt: 'Costa das Estrelas — Paimon e Viajante',
    paimonCaption: 'Costa das Estrelas — O Viajante desperta e pesca Paimon',
    snezAlt: 'Palácio Zapolyarny — Snezhnaya',
    snezCaption: 'Palácio Zapolyarny — O assento da Tsaritsa e dos Mensageiros dos Fatui',
    clickToReveal: 'Clique para revelar marcos e história',
    collapse: '⤡ Recolher',
    coverMilestones: (n) => `✨ ${n} Marco${n === 1 ? '' : 's'} Canônico${n === 1 ? '' : 's'}`,
    coverTooltip: 'Clique para abrir a linha do tempo detalhada',
    hints: {
      drag: 'para Navegar 2D',
      wheel: 'para Zoom',
      space: 'Modo Mão Livre',
      click: 'para Inspecionar',
      esc: 'para Desafixar'
    },
    bottomSubtitle: 'Canvas 2D Interativo de Teyvat • Lore de Genshin Impact'
  }
};

class TeyvatTimelineApp {
  constructor() {
    this.eras = [];
    this.events = [];
    this.filteredEvents = [];
    this.pinnedEvent = null;
    this.currentSlideIndex = 0;
    this.activeEra = 'all';
    this.searchQuery = '';
    this.searchResults = [];
    this.searchCurrentIndex = -1;
    this.hasNavigatedSearch = false;

    // Set of opened era IDs (when closed, shows grand cover poster)
    this.openEras = new Set();

    // Language state with persistent preference
    this.currentLang = 'en';
    try {
      const savedLang = localStorage.getItem('thrilling_tales_lang');
      if (savedLang && ['en', 'pt'].includes(savedLang)) {
        this.currentLang = savedLang;
      }
    } catch (e) {
      // Ignore localStorage access failures
    }
    this.dataCache = { en: null, pt: null };

    // Modern Era artwork toggle state: 'paimon' | 'snez'
    this.modernArtwork = 'paimon';

    // 2D Camera state in screen coordinates
    this.camera = {
      x: 60,
      y: 40,
      zoom: 0.82
    };

    // Pan interaction state
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };
    this.cameraStart = { x: 0, y: 0 };
    this.hasMoved = false;
    this.isSpacePressed = false;
    this.isAnimating = false;
    this.cameraAnimId = null;

    // Spatial world layout metadata
    this.panelLayout = [];
    this.worldBounds = { width: 12500, height: 1400 };

    this.cacheDom();
    this.init();
  }

  cacheDom() {
    this.viewport = document.getElementById('timeline-viewport');
    this.canvasWorld = document.getElementById('canvas-world');
    this.connectorsSvg = document.getElementById('canvas-connectors');
    this.eraPanelsContainer = document.getElementById('era-panels-container');
    this.tooltip = document.getElementById('timeline-tooltip');

    // Minimap
    this.minimap = document.getElementById('canvas-minimap');
    this.minimapBody = document.getElementById('minimap-body');
    this.minimapWorld = document.getElementById('minimap-world');
    this.minimapViewportBox = document.getElementById('minimap-viewport-box');
    this.minimapToggleBtn = document.getElementById('minimap-toggle-btn');

    // Inspector
    this.inspector = document.getElementById('event-inspector');
    this.inspectorCloseBtn = document.getElementById('inspector-close-btn');
    this.carousel = document.getElementById('inspector-carousel');
    this.carouselSlides = document.getElementById('carousel-slides');
    this.carouselDots = document.getElementById('carousel-dots');
    this.prevBtn = document.getElementById('carousel-prev');
    this.nextBtn = document.getElementById('carousel-next');

    this.inspectorEra = document.getElementById('inspector-era');
    this.inspectorDate = document.getElementById('inspector-date');
    this.inspectorTitle = document.getElementById('inspector-title');
    this.inspectorDesc = document.getElementById('inspector-desc');
    this.inspectorTags = document.getElementById('inspector-tags');
    this.inspectorSources = document.getElementById('inspector-sources');

    // Header Controls
    this.eraJumperGroup = document.getElementById('era-jumper-group');
    this.searchBox = document.getElementById('search-box');
    this.searchInput = document.getElementById('timeline-search');
    this.searchActions = document.getElementById('search-actions');
    this.searchCount = document.getElementById('search-count');
    this.searchPrevBtn = document.getElementById('search-prev-btn');
    this.searchNextBtn = document.getElementById('search-next-btn');
    this.searchClearBtn = document.getElementById('search-clear-btn');
    this.zoomInBtn = document.getElementById('zoom-in-btn');
    this.zoomOutBtn = document.getElementById('zoom-out-btn');
    this.zoomResetBtn = document.getElementById('zoom-reset-btn');
    this.eventCountBadge = document.getElementById('event-count-badge');
  }

  async init() {
    document.documentElement.lang = this.currentLang;
    this.updateLanguageButtons();
    await this.loadData();
    this.updateStaticUI();
    this.computePanelLayout();
    this.setupCameraInteraction();
    this.setupEventListeners();
    this.render();

    // Initial smooth framing
    requestAnimationFrame(() => {
      this.updateMinimap();
      this.applyCameraTransform();
    });
  }

  async loadData(lang = this.currentLang) {
    if (this.dataCache[lang]) {
      this.eras = this.dataCache[lang].eras;
      this.events = this.dataCache[lang].events;
      this.filteredEvents = [...this.events];
      return;
    }

    try {
      const basePath = window.location.pathname.endsWith('/') 
        ? window.location.pathname 
        : window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);

      const erasFile = lang === 'pt' ? 'data/eras_pt.json' : 'data/eras.json';
      const eventsFile = lang === 'pt' ? 'data/events_pt.json' : 'data/events.json';

      const [erasRes, eventsRes] = await Promise.all([
        fetch(`${basePath}${erasFile}`).catch(() => fetch(`./${erasFile}`)),
        fetch(`${basePath}${eventsFile}`).catch(() => fetch(`./${eventsFile}`))
      ]);

      this.eras = await erasRes.json();
      this.events = await eventsRes.json();
      this.filteredEvents = [...this.events];
      this.dataCache[lang] = { eras: this.eras, events: this.events };
    } catch (err) {
      console.error(`[Timeline 2D] Failed to load JSON data for language ${lang}:`, err);
    }
  }

  async switchLanguage(newLang) {
    if (newLang === this.currentLang || !['en', 'pt'].includes(newLang)) return;
    this.currentLang = newLang;
    try {
      localStorage.setItem('thrilling_tales_lang', newLang);
    } catch (e) {}

    document.documentElement.lang = newLang;
    this.updateLanguageButtons();

    const previousPinnedId = this.pinnedEvent?.id;
    const previousActiveEra = this.activeEra;

    await this.loadData(newLang);
    this.updateStaticUI();
    this.computePanelLayout();
    this.render();

    if (this.searchQuery) {
      this.applyFilters();
    }

    if (previousPinnedId) {
      const refreshedPinnedEvent = this.events.find(e => e.id === previousPinnedId);
      if (refreshedPinnedEvent) {
        const cardEl = document.querySelector(`.spatial-event-card[data-id="${previousPinnedId}"]`);
        this.pinEvent(refreshedPinnedEvent, cardEl);
      } else {
        this.unpinEvent();
      }
    } else if (previousActiveEra && previousActiveEra !== 'all') {
      const eraObj = this.eras.find(e => e.id === previousActiveEra);
      if (eraObj) {
        document.querySelectorAll('.spatial-era-panel').forEach(p => {
          p.classList.toggle('is-active-panel', p.getAttribute('data-id') === previousActiveEra);
        });
      }
    }
  }

  updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const lang = btn.getAttribute('data-lang');
      const isActive = lang === this.currentLang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  updateStaticUI() {
    const t = I18N[this.currentLang] || I18N.en;

    // Search controls static localization
    if (this.searchInput) {
      this.searchInput.placeholder = t.searchPlaceholder;
    }
    if (this.searchPrevBtn) {
      this.searchPrevBtn.title = t.searchPrev;
    }
    if (this.searchNextBtn) {
      this.searchNextBtn.title = t.searchNext;
    }
    if (this.searchClearBtn) {
      this.searchClearBtn.title = t.searchClear;
    }

    // Minimap title
    const minimapTitleEl = document.getElementById('minimap-title') || document.querySelector('.minimap-title');
    if (minimapTitleEl) {
      minimapTitleEl.textContent = t.minimapTitle;
    }

    // Inspector static titles
    const inspectorHintEl = document.getElementById('inspector-hint-text') || document.querySelector('.inspector-hint-text');
    if (inspectorHintEl && this.pinnedEvent) {
      inspectorHintEl.textContent = t.pinnedEventDetails;
    }

    const tagLabelEl = document.getElementById('inspector-tag-label');
    if (tagLabelEl) tagLabelEl.textContent = t.tagSectionLabel;

    const citationLabelEl = document.getElementById('inspector-citation-label');
    if (citationLabelEl) citationLabelEl.textContent = t.citationSectionLabel;

    // Hint chips
    const hintDrag = document.querySelector('#hint-drag .hint-text');
    if (hintDrag) hintDrag.textContent = t.hints.drag;

    const hintWheel = document.querySelector('#hint-wheel .hint-text');
    if (hintWheel) hintWheel.textContent = t.hints.wheel;

    const hintSpace = document.querySelector('#hint-space .hint-text');
    if (hintSpace) hintSpace.textContent = t.hints.space;

    const hintClick = document.querySelector('#hint-click .hint-text');
    if (hintClick) hintClick.textContent = t.hints.click;

    const hintEsc = document.querySelector('#hint-esc .hint-text');
    if (hintEsc) hintEsc.textContent = t.hints.esc;

    // Subtitle
    const subTitleEl = document.querySelector('#bottombar-subtitle span');
    if (subTitleEl) subTitleEl.textContent = t.bottomSubtitle;
  }

  computePanelLayout() {
    const startX = 180;
    const startY = 140;
    const panelGap = 200;

    let currentX = startX;

    this.panelLayout = this.eras.map((era, index) => {
      const eraEvents = this.events.filter(e => e.eraId === era.id);
      const count = eraEvents.length;

      // Event card width is 340px with 20px gap.
      // Total track width for N cards is count * 360px - 20px + panel horizontal padding (~60px).
      // Minimum width 1210px maintains at least a 16:9 aspect ratio (680px * 16 / 9 = ~1209px)
      // so 16:9 cover images are never cut/cropped on epoch cards with fewer events.
      const width = Math.max(1210, count * 360 + 60);

      const layoutItem = {
        id: era.id,
        index,
        x: currentX,
        y: startY,
        width,
        eventCount: count,
        color: era.color
      };

      currentX += width + panelGap;
      return layoutItem;
    });

    const totalWidth = currentX + 300;
    this.worldBounds = { width: Math.max(18000, totalWidth), height: 1400 };

    if (this.canvasWorld) {
      this.canvasWorld.style.width = `${this.worldBounds.width}px`;
      this.canvasWorld.style.height = `${this.worldBounds.height}px`;
    }
  }

  setupCameraInteraction() {
    if (!this.viewport) return;

    // Mouse Pan Interaction
    this.viewport.addEventListener('mousedown', (e) => {
      // Allow dragging on canvas or when holding spacebar, but not when clicking buttons, links, or inputs
      const isInteractive = e.target.closest('button, a, input, select');
      if (isInteractive && !this.isSpacePressed) return;

      if (this.cameraAnimId) {
        cancelAnimationFrame(this.cameraAnimId);
        this.cameraAnimId = null;
      }

      this.isPanning = true;
      this.hasMoved = false;
      this.panStart = { x: e.clientX, y: e.clientY };
      this.cameraStart = { x: this.camera.x, y: this.camera.y };
      this.viewport.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isPanning) return;
      const dx = e.clientX - this.panStart.x;
      const dy = e.clientY - this.panStart.y;
      if (Math.hypot(dx, dy) > 8) {
        this.hasMoved = true;
      }
      this.camera.x = this.cameraStart.x + dx;
      this.camera.y = this.cameraStart.y + dy;
      this.applyCameraTransform();
    });

    window.addEventListener('mouseup', () => {
      if (this.isPanning) {
        this.isPanning = false;
        this.viewport.classList.remove('is-dragging');
      }
    });

    // Scroll Wheel & Trackpad Pinch Zoom (Direct Zoom Control)
    this.viewport.addEventListener('wheel', (e) => {
      e.preventDefault();

      if (this.cameraAnimId) {
        cancelAnimationFrame(this.cameraAnimId);
        this.cameraAnimId = null;
      }

      const rect = this.viewport.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Handle pure horizontal scroll wheel (e.g. side-scroll thumbwheels)
      if (Math.abs(e.deltaY) === 0 && Math.abs(e.deltaX) > 0) {
        this.camera.x -= e.deltaX;
        this.applyCameraTransform();
        return;
      }

      // Normalize delta based on mode (pixels vs lines vs pages)
      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 20; // Firefox line mode
      else if (e.deltaMode === 2) dy *= 400; // Page mode

      // Natural exponential continuous zoom factor centered at cursor
      const sensitivity = 0.0025;
      const zoomFactor = Math.exp(-dy * sensitivity);

      const oldZoom = this.camera.zoom;
      const newZoom = Math.max(0.02, Math.min(3.0, oldZoom * zoomFactor));

      if (Math.abs(newZoom - oldZoom) < 0.0001) return;

      // Focal zoom: anchor the exact world coordinate directly under the mouse cursor
      const worldX = (mouseX - this.camera.x) / oldZoom;
      const worldY = (mouseY - this.camera.y) / oldZoom;

      this.camera.x = mouseX - worldX * newZoom;
      this.camera.y = mouseY - worldY * newZoom;
      this.camera.zoom = newZoom;

      this.applyCameraTransform();
    }, { passive: false });

    // Spacebar Hand Tool Pan Keybinding
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        this.isSpacePressed = true;
        this.viewport.style.cursor = 'grab';
      }
      if (e.key === '+' || e.key === '=') this.adjustZoom(0.15);
      if (e.key === '-' || e.key === '_') this.adjustZoom(-0.15);
      if (e.key === '0') this.fitAll();
      if (e.key === 'Escape') this.unpinEvent();
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.isSpacePressed = false;
        this.viewport.style.cursor = '';
      }
    });
  }

  setupEventListeners() {
    // Zoom Controls
    this.zoomInBtn?.addEventListener('click', () => this.adjustZoom(0.2));
    this.zoomOutBtn?.addEventListener('click', () => this.adjustZoom(-0.2));
    this.zoomResetBtn?.addEventListener('click', () => this.fitAll());

    // Search Input & Navigation Controls
    this.searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.hasNavigatedSearch = false;
      this.applyFilters();
    });

    this.searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          this.navigateSearch(-1);
        } else {
          this.navigateSearch(1);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.clearSearch();
      }
    });

    this.searchPrevBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.navigateSearch(-1);
    });

    this.searchNextBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.navigateSearch(1);
    });

    this.searchClearBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.clearSearch();
    });

    // Inspector Close
    this.inspectorCloseBtn?.addEventListener('click', () => this.unpinEvent());

    // Carousel Navigation
    this.prevBtn?.addEventListener('click', () => this.prevSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());

    // Minimap Toggle Collapse
    this.minimapToggleBtn?.addEventListener('click', () => {
      if (this.minimap) {
        this.minimap.classList.toggle('is-collapsed');
        this.minimapToggleBtn.textContent = this.minimap.classList.contains('is-collapsed') ? '+' : '−';
      }
    });

    // Minimap Click Navigation
    this.minimapBody?.addEventListener('click', (e) => {
      if (!this.minimapWorld) return;
      const rect = this.minimapWorld.getBoundingClientRect();
      const clickRatioX = (e.clientX - rect.left) / rect.width;
      const clickRatioY = (e.clientY - rect.top) / rect.height;

      const targetWorldX = clickRatioX * this.worldBounds.width;
      const targetWorldY = clickRatioY * this.worldBounds.height;

      const vWidth = this.viewport.clientWidth;
      const vHeight = this.viewport.clientHeight;

      const targetCamX = vWidth / 2 - targetWorldX * this.camera.zoom;
      const targetCamY = vHeight / 2 - targetWorldY * this.camera.zoom;

      this.animateCameraTo(targetCamX, targetCamY, this.camera.zoom);
    });

    // Language Switcher Buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        if (lang) this.switchLanguage(lang);
      });
    });

    // Resize Window
    window.addEventListener('resize', () => {
      if (this.activeEra === 'all') {
        this.fitAll();
      } else {
        this.applyCameraTransform();
      }
      this.updateMinimap();
    });
  }

  adjustZoom(delta) {
    const vWidth = this.viewport.clientWidth;
    const vHeight = this.viewport.clientHeight;
    const centerX = vWidth / 2;
    const centerY = vHeight / 2;

    const newZoom = Math.max(0.02, Math.min(2.5, this.camera.zoom + delta));
    const worldX = (centerX - this.camera.x) / this.camera.zoom;
    const worldY = (centerY - this.camera.y) / this.camera.zoom;

    this.camera.x = centerX - worldX * newZoom;
    this.camera.y = centerY - worldY * newZoom;
    this.camera.zoom = newZoom;

    this.applyCameraTransform();
  }

  applyCameraTransform() {
    if (!this.canvasWorld) return;
    this.canvasWorld.style.transform = `translate3d(${this.camera.x}px, ${this.camera.y}px, 0) scale(${this.camera.zoom})`;

    // Automatic collapse threshold check:
    // When zoomed out past the readability threshold (< 0.55), automatically collapse open era cards to closed state
    const ZOOM_COLLAPSE_THRESHOLD = 0.55;
    if (this.camera.zoom < ZOOM_COLLAPSE_THRESHOLD && this.openEras && this.openEras.size > 0) {
      this.closeAllEras();
    }

    // Update Zoom percentage button label
    if (this.zoomResetBtn) {
      this.zoomResetBtn.textContent = `${Math.round(this.camera.zoom * 100)}%`;
    }

    this.updateMinimap();
  }

  openEra(eraId, autoFly = true) {
    this.openEras.add(eraId);
    const panelEl = document.querySelector(`.spatial-era-panel[data-id="${eraId}"]`);
    if (panelEl) {
      panelEl.classList.remove('is-closed');
      panelEl.classList.add('is-active-panel');
    }
    if (autoFly && this.camera.zoom < 0.68) {
      this.flyToEra(eraId, false);
    }
  }

  closeEra(eraId) {
    this.openEras.delete(eraId);
    const panelEl = document.querySelector(`.spatial-era-panel[data-id="${eraId}"]`);
    if (panelEl) {
      panelEl.classList.add('is-closed');
      panelEl.classList.remove('is-active-panel');
    }
  }

  closeAllEras() {
    if (!this.openEras || this.openEras.size === 0) return;
    this.openEras.clear();
    document.querySelectorAll('.spatial-era-panel').forEach(p => {
      p.classList.add('is-closed');
      p.classList.remove('is-active-panel');
    });
  }

  toggleEra(eraId) {
    if (this.openEras.has(eraId)) {
      this.closeEra(eraId);
    } else {
      this.openEra(eraId, true);
    }
  }

  animateCameraTo(targetX, targetY, targetZoom, duration = 400) {
    if (this.cameraAnimId) {
      cancelAnimationFrame(this.cameraAnimId);
      this.cameraAnimId = null;
    }

    const startX = this.camera.x;
    const startY = this.camera.y;
    const startZoom = this.camera.zoom;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      this.camera.x = startX + (targetX - startX) * ease;
      this.camera.y = startY + (targetY - startY) * ease;
      this.camera.zoom = startZoom + (targetZoom - startZoom) * ease;

      this.applyCameraTransform();

      if (progress < 1) {
        this.cameraAnimId = requestAnimationFrame(animate);
      } else {
        this.cameraAnimId = null;
      }
    };

    this.cameraAnimId = requestAnimationFrame(animate);
  }

  flyToEra(eraId, open = true) {
    this.activeEra = eraId;
    this.updateActiveEraButton();
    if (open) {
      this.openEra(eraId, false);
    }

    const layout = this.panelLayout.find(p => p.id === eraId);
    if (!layout || !this.viewport) return;

    const vWidth = this.viewport.clientWidth;
    const vHeight = this.viewport.clientHeight;

    // Desired zoom to frame the era panel comfortably with margins
    const targetZoom = Math.min(1.0, Math.max(0.42, Math.min((vWidth - 120) / layout.width, (vHeight - 140) / 720)));
    const targetX = (vWidth / 2) - (layout.x + layout.width / 2) * targetZoom;
    const targetY = (vHeight / 2) - (layout.y + 340) * targetZoom;

    // Highlight the active panel
    document.querySelectorAll('.spatial-era-panel').forEach(p => {
      p.classList.toggle('is-active-panel', p.getAttribute('data-id') === eraId);
    });

    this.animateCameraTo(targetX, targetY, targetZoom, 500);
  }

  fitAll() {
    if (!this.viewport || !this.panelLayout || this.panelLayout.length === 0) return;
    this.activeEra = 'all';
    this.updateActiveEraButton();
    this.closeAllEras();

    document.querySelectorAll('.spatial-era-panel').forEach(p => p.classList.remove('is-active-panel'));

    const vWidth = this.viewport.clientWidth;
    const vHeight = this.viewport.clientHeight;

    const first = this.panelLayout[0];
    const last = this.panelLayout[this.panelLayout.length - 1];
    const allErasMinX = first.x;
    const allErasMaxX = last.x + last.width;
    const allErasWidth = allErasMaxX - allErasMinX;
    const allErasHeight = 680;
    const allErasMinY = first.y;

    const padX = Math.max(30, Math.min(80, vWidth * 0.05));
    const padY = Math.max(40, Math.min(100, vHeight * 0.1));
    const availW = Math.max(200, vWidth - padX * 2);
    const availH = Math.max(200, vHeight - padY * 2);

    const targetZoom = Math.max(0.02, Math.min(0.85, Math.min(availW / allErasWidth, availH / allErasHeight)));
    const worldCenterX = allErasMinX + allErasWidth / 2;
    const worldCenterY = allErasMinY + allErasHeight / 2;

    const targetX = (vWidth / 2) - worldCenterX * targetZoom;
    const targetY = (vHeight / 2) - worldCenterY * targetZoom;

    this.animateCameraTo(targetX, targetY, targetZoom, 600);
  }

  render() {
    this.renderEraButtons();
    this.renderConnectors();
    this.renderEraPanels();
    this.setupMinimapThumbs();
    this.updateEventCountBadge();
  }

  renderEraButtons() {
    if (!this.eraJumperGroup) return;
    this.eraJumperGroup.innerHTML = '';
    const t = I18N[this.currentLang] || I18N.en;

    const allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = `era-btn ${this.activeEra === 'all' ? 'active' : ''}`;
    allBtn.setAttribute('data-id', 'all');
    allBtn.textContent = t.fitAll;
    allBtn.addEventListener('click', () => this.fitAll());
    this.eraJumperGroup.appendChild(allBtn);

    this.eras.forEach(era => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `era-btn ${this.activeEra === era.id ? 'active' : ''}`;
      btn.setAttribute('data-id', era.id);
      btn.textContent = era.shortName || era.name;
      btn.style.borderColor = `${era.color}40`;
      btn.addEventListener('click', () => this.flyToEra(era.id));
      this.eraJumperGroup.appendChild(btn);
    });
  }

  updateActiveEraButton() {
    if (!this.eraJumperGroup) return;
    this.eraJumperGroup.querySelectorAll('.era-btn').forEach(btn => {
      const id = btn.getAttribute('data-id');
      btn.classList.toggle('active', id === this.activeEra);
    });
  }

  renderConnectors() {
    if (!this.connectorsSvg) return;
    this.connectorsSvg.innerHTML = '';

    // Defs for glowing gradient line
    this.connectorsSvg.innerHTML = `
      <defs>
        <linearGradient id="celestialRailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.7"/>
          <stop offset="30%" stop-color="#5fe3db" stop-opacity="0.8"/>
          <stop offset="60%" stop-color="#e5c158" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#a855f7" stop-opacity="0.7"/>
        </linearGradient>
        <filter id="railGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    `;

    // Draw cosmic rails between adjacent era panels (aligned with the central timeline rail)
    for (let i = 0; i < this.panelLayout.length - 1; i++) {
      const current = this.panelLayout[i];
      const next = this.panelLayout[i + 1];

      const x1 = current.x + current.width;
      const railY = current.y + 324;
      const x2 = next.x;

      const midX = (x1 + x2) / 2;

      // Cosmic bridge segment
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${x1} ${railY} L ${x2} ${railY}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'url(#celestialRailGrad)');
      path.setAttribute('stroke-width', '4');
      path.setAttribute('filter', 'url(#railGlow)');
      this.connectorsSvg.appendChild(path);

      // Celestial waypoint dot
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', midX);
      circle.setAttribute('cy', railY);
      circle.setAttribute('r', '6');
      circle.setAttribute('fill', '#e5c158');
      circle.setAttribute('filter', 'url(#railGlow)');
      this.connectorsSvg.appendChild(circle);
    }
  }

  renderEraPanels() {
    if (!this.eraPanelsContainer) return;
    this.eraPanelsContainer.innerHTML = '';
    const t = I18N[this.currentLang] || I18N.en;

    this.eras.forEach((era, index) => {
      const layout = this.panelLayout[index];
      const panel = document.createElement('article');

      // Check if era is currently open or closed
      const isClosed = !this.openEras.has(era.id);
      panel.className = `spatial-era-panel ${isClosed ? 'is-closed' : ''} ${this.activeEra === era.id ? 'is-active-panel' : ''}`;
      panel.setAttribute('data-id', era.id);
      panel.style.left = `${layout.x}px`;
      panel.style.top = `${layout.y}px`;
      panel.style.setProperty('--panel-glow', `${era.color}40`);
      panel.style.setProperty('--panel-width', `${layout.width}px`);

      // Determine hero artwork based on era and modern toggle
      let currentHeroArt = era.bgImage;
      if (era.id === 'modern') {
        currentHeroArt = this.modernArtwork === 'snez' && era.alternateBgImage 
          ? era.alternateBgImage 
          : era.bgImage;
      }

      // Events for this era
      const eraEvents = this.events.filter(e => e.eraId === era.id);

      // 1. CLOSED STATE POSTER COVER VIEW (Huge legible typography at macro zoom)
      const closedCoverHtml = `
        <div class="era-closed-cover" title="${t.coverTooltip}">
          <img src="${currentHeroArt}" alt="${era.name}" class="era-cover-bg-img" id="era-cover-art-${era.id}">
          <div class="era-cover-gradient-overlay"></div>
          <div class="era-cover-rail" style="--rail-color: ${era.color};"></div>
          <div class="era-cover-content">
            <div class="era-cover-top-meta">
              <span class="era-cover-epoch-badge" style="color: ${era.color}; border-color: ${era.color}70;">
                ${t.epochBadge(index + 1, this.eras.length)}
              </span>
              <span class="era-cover-milestones-pill">
                ${t.coverMilestones(eraEvents.length)}
              </span>
            </div>
            <div class="era-cover-main">
              <h2 class="era-cover-title" style="--title-glow: ${era.color}80;">
                ${era.name}
              </h2>
              <div class="era-cover-year">
                ${era.yearRange || ''}
              </div>
            </div>
            <div class="era-cover-bottom-cta">
              <button class="era-cover-open-btn" type="button" aria-label="${t.clickToReveal}">
                <span>${t.clickToReveal}</span>
                <span class="era-cover-cta-icon">✦</span>
              </button>
            </div>
          </div>
        </div>
      `;

      // 2. OPEN STATE DETAILED VIEW
      // Top Header (Detailed View with Collapse Button)
      const headerHtml = `
        <div class="era-panel-header">
          <div class="era-panel-header-left">
            <span class="era-epoch-badge" style="color: ${era.color}; border-color: ${era.color}60;">
              ${t.epochBadge(index + 1, this.eras.length)}
            </span>
            <h2 class="era-panel-title" style="color: ${era.color};">${era.name}</h2>
            <span class="era-hero-year">${era.yearRange || ''}</span>
          </div>
          <div class="era-panel-header-right">
            <span>${t.canonicalMilestones(eraEvents.length)}</span>
            <button class="era-collapse-btn" type="button" title="${t.collapse}">
              <span>${t.collapse}</span>
            </button>
          </div>
        </div>
      `;

      // Events Top Track (Strictly ON TOP of the timeline rail)
      const eventsTrackHtml = `
        <div class="era-events-top-track" id="events-track-${era.id}"></div>
      `;

      // Central Timeline Rail (Dividing axis)
      const railHtml = `
        <div class="era-timeline-rail" style="--rail-gradient: linear-gradient(90deg, ${era.color}ee, ${era.color}77);"></div>
      `;

      // Key figures & dominant factions chips
      const keyFiguresChips = (era.keyFigures && era.keyFigures.length)
        ? `
          <div class="era-meta-block">
            <span class="era-meta-label">${t.keyFigures}</span>
            <div class="era-meta-chips">
              ${era.keyFigures.map(fig => `<span class="era-meta-chip figure">👑 ${fig}</span>`).join('')}
            </div>
          </div>
        `
        : '';

      const dominantFactionsChips = (era.dominantFactions && era.dominantFactions.length)
        ? `
          <div class="era-meta-block">
            <span class="era-meta-label">${t.factions}</span>
            <div class="era-meta-chips">
              ${era.dominantFactions.map(fac => `<span class="era-meta-chip faction">🛡️ ${fac}</span>`).join('')}
            </div>
          </div>
        `
        : '';

      // Extra Information Section (BELOW timeline rail, inside era panel area)
      const extraInfoHtml = `
        <div class="era-extra-info-bottom">
          <div class="era-extra-media">
            <img src="${currentHeroArt}" alt="${era.name}" class="era-extra-art-img" id="era-art-${era.id}">
            <div class="era-extra-art-overlay"></div>
            ${era.id === 'modern' ? `
              <div class="artwork-switcher-group" title="Switch Modern Era Artworks">
                <button class="art-switch-btn ${this.modernArtwork === 'paimon' ? 'active' : ''}" data-art="paimon">
                  <span>${t.paimonArtBtn}</span>
                </button>
                <button class="art-switch-btn ${this.modernArtwork === 'snez' ? 'active' : ''}" data-art="snez">
                  <span>${t.snezArtBtn}</span>
                </button>
              </div>
            ` : ''}
          </div>

          <div class="era-extra-lore">
            <div>
              <div class="era-lore-title-row">
                <h3 class="era-lore-title" style="color: ${era.color};">${era.name}</h3>
                <span class="era-lore-years">${era.yearRange || ''}</span>
              </div>
              <p class="era-lore-text">${era.longDescription || era.description}</p>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              ${keyFiguresChips}
              ${dominantFactionsChips}
            </div>

            <div class="era-lore-actions">
              <button class="era-inspect-btn" data-era-id="${era.id}" title="Inspect full epoch lore and key figures">
                <span>${t.inspectEpochLore}</span>
                <span>ℹ️</span>
              </button>
              ${era.wikiUrl ? `
                <a href="${era.wikiUrl}" target="_blank" rel="noopener noreferrer" class="era-wiki-link" title="Open on Genshin Impact Wiki">
                  <span>${t.epochWiki}</span>
                  <span class="ext-arrow">↗</span>
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      `;

      const detailedContentHtml = `
        <div class="era-detailed-content">
          ${headerHtml}
          ${eventsTrackHtml}
          ${railHtml}
          ${extraInfoHtml}
        </div>
      `;

      panel.innerHTML = closedCoverHtml + detailedContentHtml;

      // Inject event card wrappers into top track
      const trackEl = panel.querySelector(`#events-track-${era.id}`);
      if (trackEl) {
        eraEvents.forEach(ev => {
          const cardWrapper = this.createEventCardWrapper(ev, era);
          trackEl.appendChild(cardWrapper);
        });
      }

      // Panel Click: reveal detailed view when closed
      panel.addEventListener('click', (e) => {
        // Ignore genuine drag/pan gestures
        if (this.hasMoved) return;

        // If clicking collapse button
        if (e.target.closest('.era-collapse-btn')) {
          e.stopPropagation();
          this.closeEra(era.id);
          return;
        }

        // If clicking interactive elements inside open detailed view, let them handle it
        if (e.target.closest('.spatial-event-card, a, input, select, .era-inspect-btn, .art-switch-btn')) {
          return;
        }

        // If panel is closed or cover was clicked, reveal detailed view
        if (panel.classList.contains('is-closed') || e.target.closest('.era-closed-cover')) {
          this.openEra(era.id, true);
        }
      });

      // Event Listeners for Epoch Inspect Button
      panel.querySelector('.era-inspect-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showEraInfo(era);
      });

      // Artwork Switcher Listener for Modern Era
      if (era.id === 'modern') {
        panel.querySelectorAll('.art-switch-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const chosenArt = btn.getAttribute('data-art');
            this.modernArtwork = chosenArt;

            // Update button active states
            panel.querySelectorAll('.art-switch-btn').forEach(b => {
              b.classList.toggle('active', b.getAttribute('data-art') === chosenArt);
            });

            // Update Image in detailed bottom view
            const imgEl = panel.querySelector(`#era-art-${era.id}`);
            if (imgEl) {
              imgEl.src = chosenArt === 'snez' && era.alternateBgImage ? era.alternateBgImage : era.bgImage;
            }

            // Also update closed cover image
            const coverImgEl = panel.querySelector(`#era-cover-art-${era.id}`);
            if (coverImgEl) {
              coverImgEl.src = chosenArt === 'snez' && era.alternateBgImage ? era.alternateBgImage : era.bgImage;
            }
          });
        });
      }

      this.eraPanelsContainer.appendChild(panel);
    });
  }

  createEventCardWrapper(ev, era) {
    const wrapper = document.createElement('div');
    wrapper.className = 'spatial-event-card-wrapper';
    wrapper.style.setProperty('--card-accent', era.color);

    const card = document.createElement('div');
    const isPinned = this.pinnedEvent?.id === ev.id;
    card.className = `spatial-event-card ${isPinned ? 'is-pinned-active' : ''}`;
    card.setAttribute('data-id', ev.id);
    card.style.setProperty('--card-accent', era.color);

    const subDate = (ev.dateDisplay || '').includes('•')
      ? ev.dateDisplay.split('•')[1].trim()
      : ev.dateDisplay;

    card.innerHTML = `
      <div class="event-card-body">
        <h3 class="event-card-title">${ev.title}</h3>
        ${subDate ? `<div class="event-card-date">${subDate}</div>` : ''}
        ${ev.yearsAgoDisplay ? `
          <div class="event-card-year-container">
            <span class="event-card-year">${ev.yearsAgoDisplay}</span>
          </div>
        ` : ''}
      </div>
    `;

    // Connector stem & pin down to timeline rail
    const stem = document.createElement('div');
    stem.className = 'card-timeline-stem';
    stem.style.background = era.color;

    const pin = document.createElement('div');
    pin.className = 'card-timeline-pin';
    pin.style.borderColor = era.color;
    pin.style.boxShadow = `0 0 10px ${era.color}`;

    wrapper.appendChild(card);
    wrapper.appendChild(stem);
    wrapper.appendChild(pin);

    let cardDownPos = null;
    card.addEventListener('mousedown', (e) => {
      cardDownPos = { x: e.clientX, y: e.clientY };
    });

    // Click to pin / inspect
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      if (cardDownPos) {
        const dist = Math.hypot(e.clientX - cardDownPos.x, e.clientY - cardDownPos.y);
        if (dist > 8) return; // Ignore genuine drag gestures
      }
      this.pinEvent(ev, card);
      this.syncSearchIndexForEvent(ev.id);
    });

    // Click pin to open event details
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      this.pinEvent(ev, card);
      this.syncSearchIndexForEvent(ev.id);
    });

    return wrapper;
  }

  setupMinimapThumbs() {
    if (!this.minimapWorld) return;
    // Clear old thumbs except viewport box
    const oldThumbs = this.minimapWorld.querySelectorAll('.minimap-panel-thumb');
    oldThumbs.forEach(t => t.remove());

    this.panelLayout.forEach(layout => {
      const thumb = document.createElement('div');
      thumb.className = 'minimap-panel-thumb';
      const leftRatio = (layout.x / this.worldBounds.width) * 100;
      const widthRatio = (layout.width / this.worldBounds.width) * 100;
      thumb.style.left = `${leftRatio}%`;
      thumb.style.width = `${widthRatio}%`;
      thumb.style.background = layout.color;
      thumb.title = `Jump to ${layout.id}`;

      thumb.addEventListener('click', (e) => {
        e.stopPropagation();
        this.flyToEra(layout.id);
      });

      this.minimapWorld.appendChild(thumb);
    });
  }

  updateMinimap() {
    if (!this.minimapViewportBox || !this.minimapWorld || !this.viewport) return;

    const vWidth = this.viewport.clientWidth;
    const vHeight = this.viewport.clientHeight;

    // Visible world rectangle in world coordinates
    const visibleWorldX = -this.camera.x / this.camera.zoom;
    const visibleWorldW = vWidth / this.camera.zoom;

    const leftPct = Math.max(0, Math.min(100, (visibleWorldX / this.worldBounds.width) * 100));
    const widthPct = Math.max(3, Math.min(100, (visibleWorldW / this.worldBounds.width) * 100));

    this.minimapViewportBox.style.left = `${leftPct}%`;
    this.minimapViewportBox.style.width = `${widthPct}%`;
  }

  applyFilters() {
    let matchCount = 0;
    this.searchResults = [];
    const q = this.searchQuery;

    this.eras.forEach(era => {
      let eraMatchCount = 0;
      const eraEvents = this.events.filter(e => e.eraId === era.id);

      eraEvents.forEach(ev => {
        const matchesSearch = !q || 
          ev.title.toLowerCase().includes(q) ||
          ev.summary.toLowerCase().includes(q) ||
          (ev.description && ev.description.toLowerCase().includes(q)) ||
          (ev.tags?.region && ev.tags.region.toLowerCase().includes(q)) ||
          (ev.tags?.characters && ev.tags.characters.some(c => c.toLowerCase().includes(q))) ||
          (ev.tags?.factions && ev.tags.factions.some(f => f.toLowerCase().includes(q)));

        const cardEl = document.querySelector(`.spatial-event-card[data-id="${ev.id}"]`);
        if (cardEl) {
          const wrapperEl = cardEl.closest('.spatial-event-card-wrapper') || cardEl;
          if (matchesSearch) {
            wrapperEl.style.display = 'flex';
            cardEl.style.display = 'flex';
            matchCount++;
            eraMatchCount++;
            if (q) {
              this.searchResults.push(ev);
            }
          } else {
            wrapperEl.style.display = 'none';
            cardEl.style.display = 'none';
          }
        }
      });

      const panelEl = document.querySelector(`.spatial-era-panel[data-id="${era.id}"]`);
      if (panelEl) {
        panelEl.style.opacity = (!q || eraMatchCount > 0) ? '1' : '0.35';
      }

      // If user typed a search query and this era has matching events, reveal this era
      if (q && eraMatchCount > 0) {
        this.openEra(era.id, false);
      }
    });

    this.updateSearchUI();

    const t = I18N[this.currentLang] || I18N.en;
    if (this.eventCountBadge) {
      this.eventCountBadge.textContent = t.eventsBadge(matchCount);
    }
  }

  updateSearchUI() {
    if (!this.searchBox) return;

    if (this.searchQuery) {
      this.searchBox.classList.add('has-query');
      if (this.searchActions) {
        this.searchActions.style.display = 'flex';
      }

      const total = this.searchResults.length;
      if (total > 0) {
        if (this.searchCurrentIndex < 0 || this.searchCurrentIndex >= total) {
          this.searchCurrentIndex = 0;
        }
        if (this.searchCount) {
          this.searchCount.textContent = `${this.searchCurrentIndex + 1}/${total}`;
          this.searchCount.classList.remove('no-matches');
        }
        if (this.searchPrevBtn) this.searchPrevBtn.disabled = false;
        if (this.searchNextBtn) this.searchNextBtn.disabled = false;
      } else {
        this.searchCurrentIndex = -1;
        if (this.searchCount) {
          this.searchCount.textContent = '0/0';
          this.searchCount.classList.add('no-matches');
        }
        if (this.searchPrevBtn) this.searchPrevBtn.disabled = true;
        if (this.searchNextBtn) this.searchNextBtn.disabled = true;
      }
    } else {
      this.searchBox.classList.remove('has-query');
      if (this.searchActions) {
        this.searchActions.style.display = 'none';
      }
      this.searchCurrentIndex = -1;
      this.searchResults = [];
      this.hasNavigatedSearch = false;
      if (this.searchCount) {
        this.searchCount.textContent = '0/0';
        this.searchCount.classList.remove('no-matches');
      }
      if (this.searchPrevBtn) this.searchPrevBtn.disabled = true;
      if (this.searchNextBtn) this.searchNextBtn.disabled = true;
    }
  }

  navigateSearch(direction = 1) {
    if (!this.searchResults || this.searchResults.length === 0) return;

    if (!this.hasNavigatedSearch) {
      this.hasNavigatedSearch = true;
      if (direction === -1) {
        this.searchCurrentIndex = this.searchResults.length - 1;
      } else {
        this.searchCurrentIndex = 0;
      }
    } else {
      this.searchCurrentIndex = (this.searchCurrentIndex + direction + this.searchResults.length) % this.searchResults.length;
    }

    this.goToSearchResult(this.searchCurrentIndex);
  }

  goToSearchResult(index) {
    if (!this.searchResults || this.searchResults.length === 0) return;
    const ev = this.searchResults[index];
    if (!ev) return;

    if (this.searchCount) {
      this.searchCount.textContent = `${index + 1}/${this.searchResults.length}`;
    }

    // Ensure containing era is open so card is rendered
    this.openEra(ev.eraId, false);

    const cardEl = document.querySelector(`.spatial-event-card[data-id="${ev.id}"]`);

    if (this.canvasWorld && this.viewport) {
      let worldX, worldY;

      if (cardEl) {
        const cardRect = cardEl.getBoundingClientRect();
        const canvasRect = this.canvasWorld.getBoundingClientRect();

        if (cardRect.width > 0) {
          worldX = (cardRect.left + cardRect.width / 2 - canvasRect.left) / this.camera.zoom;
          worldY = (cardRect.top + cardRect.height / 2 - canvasRect.top) / this.camera.zoom;
        }
      }

      if (worldX === undefined || worldY === undefined) {
        const eraLayout = this.panelLayout.find(p => p.id === ev.eraId);
        worldX = eraLayout ? eraLayout.x + eraLayout.width / 2 : 1000;
        worldY = eraLayout ? eraLayout.y + 240 : 380;
      }

      const vWidth = this.viewport.clientWidth;
      const vHeight = this.viewport.clientHeight;

      const targetZoom = Math.min(1.05, Math.max(0.78, this.camera.zoom));
      const isInspectorOpen = this.inspector?.classList.contains('is-open');
      const usableHeight = isInspectorOpen ? Math.max(260, vHeight - 320) : vHeight;

      const targetX = (vWidth / 2) - worldX * targetZoom;
      const targetY = (usableHeight / 2) - worldY * targetZoom;

      this.animateCameraTo(targetX, targetY, targetZoom, 420);

      if (cardEl) {
        this.pinEvent(ev, cardEl);
        cardEl.classList.remove('is-search-focus');
        void cardEl.offsetWidth;
        cardEl.classList.add('is-search-focus');
      }
    }
  }

  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = '';
    }
    this.searchQuery = '';
    this.searchResults = [];
    this.searchCurrentIndex = -1;
    this.hasNavigatedSearch = false;
    this.applyFilters();
    this.searchInput?.focus();
  }

  syncSearchIndexForEvent(eventId) {
    if (this.searchResults && this.searchResults.length > 0) {
      const idx = this.searchResults.findIndex(s => s.id === eventId);
      if (idx !== -1) {
        this.searchCurrentIndex = idx;
        this.hasNavigatedSearch = true;
        if (this.searchCount) {
          this.searchCount.textContent = `${this.searchCurrentIndex + 1}/${this.searchResults.length}`;
        }
      }
    }
  }

  updateEventCountBadge() {
    const t = I18N[this.currentLang] || I18N.en;
    if (this.eventCountBadge) {
      this.eventCountBadge.textContent = t.eventsBadge(this.events.length);
    }
  }

  showTooltip() {
    // Disabled: users click to inspect event details in inspector drawer
  }

  hideTooltip() {
    if (this.tooltip) this.tooltip.classList.remove('is-visible');
  }

  pinEvent(ev, cardElement) {
    this.pinnedEvent = ev;
    this.currentSlideIndex = 0;
    this.hideTooltip();

    // Ensure the era of the pinned event is open so the user sees the card
    this.openEra(ev.eraId, false);

    const t = I18N[this.currentLang] || I18N.en;
    const inspectorHintEl = document.getElementById('inspector-hint-text') || document.querySelector('.inspector-hint-text');
    if (inspectorHintEl) {
      inspectorHintEl.textContent = t.pinnedEventDetails;
    }

    // Mark active card
    document.querySelectorAll('.spatial-event-card').forEach(c => c.classList.remove('is-pinned-active'));
    if (cardElement) cardElement.classList.add('is-pinned-active');

    const era = this.eras.find(e => e.id === ev.eraId) || { color: '#e5c158' };

    // Fill Inspector Metadata
    this.inspectorEra.textContent = ev.eraName || era.name;
    this.inspectorEra.style.color = era.color;
    this.inspectorDate.innerHTML = `
      <span class="inspector-year-pill">${ev.yearsAgoDisplay || ''}</span>
      <span class="inspector-date-full">${ev.dateDisplay}</span>
    `;
    this.inspectorTitle.textContent = ev.title;
    this.inspectorDesc.textContent = ev.description;

    // Render Image Carousel
    this.renderCarousel(ev.images || []);

    // Render Tags & Citations
    this.renderInspectorTags(ev.tags || {});
    this.renderInspectorSources(ev.sources || []);

    // Slide open drawer
    this.inspector.classList.add('is-open');
  }

  showEraInfo(era) {
    this.activeEra = era.id;
    this.updateActiveEraButton();
    this.openEra(era.id, false);
    this.flyToEra(era.id);

    const t = I18N[this.currentLang] || I18N.en;

    // Deselect any pinned event
    document.querySelectorAll('.spatial-event-card').forEach(c => c.classList.remove('is-pinned-active'));
    this.pinnedEvent = null;

    const inspectorHintEl = document.getElementById('inspector-hint-text') || document.querySelector('.inspector-hint-text');
    if (inspectorHintEl) {
      inspectorHintEl.textContent = t.historicalEpoch;
    }

    // Populate Inspector Drawer with rich Era information
    this.inspectorEra.textContent = t.historicalEpoch;
    this.inspectorEra.style.color = era.color;
    this.inspectorDate.innerHTML = `
      <span class="inspector-year-pill">${era.yearRange || ''}</span>
      <span class="inspector-date-full">${t.epochRank(era.startRank, era.endRank)}</span>
    `;
    this.inspectorTitle.textContent = era.name;
    this.inspectorDesc.textContent = era.longDescription || era.description;

    // For modern era, pass both Paimon and Snezhnaya to carousel!
    if (era.id === 'modern') {
      const modernSlides = [
        {
          url: era.bgImage,
          alt: t.paimonAlt,
          caption: t.paimonCaption
        }
      ];
      if (era.alternateBgImage) {
        modernSlides.push({
          url: era.alternateBgImage,
          alt: t.snezAlt,
          caption: t.snezCaption
        });
      }
      this.renderCarousel(modernSlides);
    } else if (era.bgImage) {
      this.renderCarousel([{
        url: era.bgImage,
        alt: era.name,
        caption: `${era.name} (${era.yearRange || ''})`
      }]);
    } else if (this.carousel) {
      this.carousel.style.display = 'none';
    }

    // Populate Tags with Key Figures & Dominant Factions
    if (this.inspectorTags) {
      this.inspectorTags.innerHTML = '';
      if (era.dominantFactions && era.dominantFactions.length) {
        era.dominantFactions.forEach(f => {
          this.inspectorTags.innerHTML += `<span class="tag-badge">🛡️ ${f}</span>`;
        });
      }
      if (era.keyFigures && era.keyFigures.length) {
        era.keyFigures.forEach(k => {
          this.inspectorTags.innerHTML += `<span class="tag-badge" style="border-color: ${era.color}60; color: ${era.color};">👑 ${k}</span>`;
        });
      }
    }

    // Populate Sources with milestone jump buttons
    if (this.inspectorSources) {
      const eraEvents = this.events.filter(e => e.eraId === era.id);
      this.inspectorSources.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; gap: 0.5rem; flex-wrap: wrap;">
          <span style="font-size: 0.8rem; color: var(--text-muted);">
            ${t.canonicalMilestones(eraEvents.length)}:
          </span>
          ${era.wikiUrl ? `
            <a href="${era.wikiUrl}" target="_blank" rel="noopener noreferrer" class="citation-open-btn" style="background: ${era.color}20; border-color: ${era.color}60; color: ${era.color};" title="Read about ${era.name} on Genshin Impact Wiki">
              <span>${t.epochWiki}</span>
              <span class="ext-arrow">↗</span>
            </a>
          ` : ''}
        </div>
        <div class="era-milestones-container">
          ${eraEvents.map(e => `
            <button class="era-milestone-btn" data-event-id="${e.id}">
              <div class="era-milestone-header">
                <span class="era-milestone-year">${e.yearsAgoDisplay || ''}</span>
                <span class="era-milestone-date">${e.dateDisplay}</span>
              </div>
              <span class="era-milestone-title">${e.title}</span>
            </button>
          `).join('')}
        </div>
      `;

      this.inspectorSources.querySelectorAll('.era-milestone-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const eventId = btn.getAttribute('data-event-id');
          const targetEvent = this.events.find(e => e.id === eventId);
          if (targetEvent) {
            const cardEl = document.querySelector(`.spatial-event-card[data-id="${eventId}"]`);
            this.pinEvent(targetEvent, cardEl);
          }
        });
      });
    }

    this.inspector.classList.add('is-open');
  }

  unpinEvent() {
    this.pinnedEvent = null;
    document.querySelectorAll('.spatial-event-card').forEach(c => c.classList.remove('is-pinned-active'));
    this.inspector.classList.remove('is-open');
  }

  renderCarousel(images) {
    if (!this.carousel || !this.carouselSlides || !this.carouselDots) return;
    this.carouselSlides.innerHTML = '';
    this.carouselDots.innerHTML = '';

    const validImages = (images || []).filter(img => img && img.url && img.url.trim() !== '');

    if (validImages.length === 0) {
      this.carousel.style.display = 'none';
      return;
    }

    this.carousel.style.display = 'block';

    validImages.forEach((img, idx) => {
      const slide = document.createElement('div');
      slide.className = `carousel-slide ${idx === 0 ? 'active' : ''}`;
      slide.innerHTML = `
        <img src="${img.url}" alt="${img.alt || 'Artwork'}" class="carousel-img">
        ${img.caption ? `<div class="carousel-caption">${img.caption}</div>` : ''}
      `;

      const imgEl = slide.querySelector('img');
      imgEl.addEventListener('error', () => {
        slide.remove();
        if (this.carouselSlides.children.length === 0) {
          this.carousel.style.display = 'none';
        }
      });

      this.carouselSlides.appendChild(slide);

      const dot = document.createElement('div');
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => this.goToSlide(idx));
      this.carouselDots.appendChild(dot);
    });

    const hasMultiple = validImages.length > 1;
    this.prevBtn.style.display = hasMultiple ? 'flex' : 'none';
    this.nextBtn.style.display = hasMultiple ? 'flex' : 'none';
    this.carouselDots.style.display = hasMultiple ? 'flex' : 'none';
  }

  goToSlide(idx) {
    const slides = this.carouselSlides.querySelectorAll('.carousel-slide');
    const dots = this.carouselDots.querySelectorAll('.carousel-dot');
    if (!slides.length) return;

    this.currentSlideIndex = (idx + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === this.currentSlideIndex));
    dots.forEach((d, i) => d.classList.toggle('active', i === this.currentSlideIndex));
  }

  nextSlide() {
    this.goToSlide(this.currentSlideIndex + 1);
  }

  prevSlide() {
    this.goToSlide(this.currentSlideIndex - 1);
  }

  renderInspectorTags(tags) {
    if (!this.inspectorTags) return;
    this.inspectorTags.innerHTML = '';
    const t = I18N[this.currentLang] || I18N.en;

    if (tags.region) {
      this.inspectorTags.innerHTML += `<span class="tag-badge region">${t.regionTag(tags.region)}</span>`;
    }

    if (tags.factions && tags.factions.length) {
      tags.factions.forEach(f => {
        this.inspectorTags.innerHTML += `<span class="tag-badge">🛡️ ${f}</span>`;
      });
    }

    if (tags.characters && tags.characters.length) {
      tags.characters.forEach(c => {
        this.inspectorTags.innerHTML += `<span class="tag-badge">👤 ${c}</span>`;
      });
    }

    if (tags.spoilerLevel) {
      this.inspectorTags.innerHTML += `<span class="tag-badge" style="border-color: rgba(248, 113, 113, 0.4); color: #fca5a5;">${t.spoilerTag(tags.spoilerLevel)}</span>`;
    }
  }

  renderInspectorSources(sources) {
    if (!this.inspectorSources) return;
    this.inspectorSources.innerHTML = '';
    const t = I18N[this.currentLang] || I18N.en;

    if (!sources || sources.length === 0) {
      this.inspectorSources.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem;">${t.noCitations}</p>`;
      return;
    }

    const iconMap = {
      wiki: '🌐',
      book: '📖',
      artifact: '🏺',
      weapon: '⚔️',
      quest: '📜',
      character_story: '👤',
      material: '💎',
      official_media: '🎬'
    };

    sources.forEach(src => {
      const card = document.createElement('div');
      const isWiki = src.category === 'wiki';
      card.className = `citation-card ${isWiki ? 'citation-wiki-card' : ''}`;
      const icon = iconMap[src.category] || '📖';
      const categoryName = src.category ? src.category.replace('_', ' ') : 'source';

      card.innerHTML = `
        ${src.quote ? `<div class="citation-quote">"${src.quote}"</div>` : ''}
        <div class="citation-footer-row">
          <div class="citation-title-group">
            <span class="citation-icon">${icon}</span>
            ${src.url 
              ? `<a href="${src.url}" target="_blank" rel="noopener noreferrer" class="citation-title-link" title="Open ${src.title} on Genshin Impact Wiki">${src.title}</a>`
              : `<span class="citation-title-text">${src.title}</span>`}
            <span class="citation-category-badge">${categoryName}</span>
          </div>
          ${src.url ? `
            <a href="${src.url}" target="_blank" rel="noopener noreferrer" class="citation-open-btn" title="Open source on Genshin Impact Wiki">
              <span>Wiki</span>
              <span class="ext-arrow">↗</span>
            </a>
          ` : ''}
        </div>
      `;
      this.inspectorSources.appendChild(card);
    });
  }
}

// Instantiate on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.timelineApp = new TeyvatTimelineApp();
});
