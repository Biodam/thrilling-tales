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
 */

class TeyvatTimelineApp {
  constructor() {
    this.eras = [];
    this.events = [];
    this.filteredEvents = [];
    this.pinnedEvent = null;
    this.currentSlideIndex = 0;
    this.activeEra = 'all';
    this.searchQuery = '';

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
    this.searchInput = document.getElementById('timeline-search');
    this.zoomInBtn = document.getElementById('zoom-in-btn');
    this.zoomOutBtn = document.getElementById('zoom-out-btn');
    this.zoomResetBtn = document.getElementById('zoom-reset-btn');
    this.eventCountBadge = document.getElementById('event-count-badge');
  }

  async init() {
    await this.loadData();
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

  async loadData() {
    try {
      const basePath = window.location.pathname.endsWith('/') 
        ? window.location.pathname 
        : window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);

      const [erasRes, eventsRes] = await Promise.all([
        fetch(`${basePath}data/eras.json`).catch(() => fetch('./data/eras.json')),
        fetch(`${basePath}data/events.json`).catch(() => fetch('./data/events.json'))
      ]);

      this.eras = await erasRes.json();
      this.events = await eventsRes.json();
      this.filteredEvents = [...this.events];
    } catch (err) {
      console.error('[Timeline 2D] Failed to load JSON data:', err);
    }
  }

  computePanelLayout() {
    const startX = 180;
    const startY = 140;
    const panelGap = 220;

    let currentX = startX;

    this.panelLayout = this.eras.map((era, index) => {
      const eraEvents = this.events.filter(e => e.eraId === era.id);
      const count = eraEvents.length;

      // Determine columns and width based on number of events in this epoch
      let columns = 3;
      let width = 1220;

      if (count <= 2) {
        columns = 1;
        width = 560;
      } else if (count <= 4) {
        columns = 2;
        width = 880;
      } else if (count <= 6) {
        columns = 3;
        width = 1220;
      } else if (count <= 8) {
        columns = 4;
        width = 1580;
      } else {
        columns = Math.min(6, Math.ceil(count / 2));
        width = columns * 370 + 80;
      }

      const layoutItem = {
        id: era.id,
        index,
        x: currentX,
        y: startY,
        width,
        columns,
        eventCount: count,
        color: era.color
      };

      currentX += width + panelGap;
      return layoutItem;
    });

    const totalWidth = currentX + 300;
    this.worldBounds = { width: Math.max(12500, totalWidth), height: 1400 };

    if (this.canvasWorld) {
      this.canvasWorld.style.width = `${this.worldBounds.width}px`;
      this.canvasWorld.style.height = `${this.worldBounds.height}px`;
    }
  }

  setupCameraInteraction() {
    if (!this.viewport) return;

    // Mouse Pan Interaction
    this.viewport.addEventListener('mousedown', (e) => {
      // Allow dragging on empty canvas or when holding spacebar, but not when clicking buttons or links
      const isInteractive = e.target.closest('button, a, input, select');
      if (isInteractive && !this.isSpacePressed) return;

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
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
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
      const newZoom = Math.max(0.18, Math.min(3.0, oldZoom * zoomFactor));

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

    // Search Input
    this.searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.applyFilters();
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

    // Resize Window
    window.addEventListener('resize', () => {
      this.applyCameraTransform();
      this.updateMinimap();
    });
  }

  adjustZoom(delta) {
    const vWidth = this.viewport.clientWidth;
    const vHeight = this.viewport.clientHeight;
    const centerX = vWidth / 2;
    const centerY = vHeight / 2;

    const newZoom = Math.max(0.22, Math.min(2.5, this.camera.zoom + delta));
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

    // Update Zoom percentage button label
    if (this.zoomResetBtn) {
      this.zoomResetBtn.textContent = `${Math.round(this.camera.zoom * 100)}%`;
    }

    this.updateMinimap();
  }

  animateCameraTo(targetX, targetY, targetZoom, duration = 400) {
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
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  flyToEra(eraId) {
    this.activeEra = eraId;
    this.updateActiveEraButton();

    const layout = this.panelLayout.find(p => p.id === eraId);
    if (!layout || !this.viewport) return;

    const vWidth = this.viewport.clientWidth;
    const vHeight = this.viewport.clientHeight;

    // Desired zoom to frame the era panel comfortably with margins
    const targetZoom = Math.min(1.0, Math.max(0.68, Math.min((vWidth - 120) / layout.width, (vHeight - 140) / 800)));
    const targetX = (vWidth / 2) - (layout.x + layout.width / 2) * targetZoom;
    const targetY = 80;

    // Highlight the active panel
    document.querySelectorAll('.spatial-era-panel').forEach(p => {
      p.classList.toggle('is-active-panel', p.getAttribute('data-id') === eraId);
    });

    this.animateCameraTo(targetX, targetY, targetZoom, 500);
  }

  fitAll() {
    if (!this.viewport) return;
    this.activeEra = 'all';
    this.updateActiveEraButton();

    document.querySelectorAll('.spatial-era-panel').forEach(p => p.classList.remove('is-active-panel'));

    const vWidth = this.viewport.clientWidth;
    const vHeight = this.viewport.clientHeight;

    const targetZoom = Math.min(0.85, Math.max(0.22, Math.min(vWidth / (this.worldBounds.width + 400), vHeight / (this.worldBounds.height + 200))));
    const targetX = (vWidth - this.worldBounds.width * targetZoom) / 2;
    const targetY = 60;

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

    const allBtn = document.createElement('button');
    allBtn.className = `era-btn ${this.activeEra === 'all' ? 'active' : ''}`;
    allBtn.textContent = 'Fit All';
    allBtn.addEventListener('click', () => this.fitAll());
    this.eraJumperGroup.appendChild(allBtn);

    this.eras.forEach(era => {
      const btn = document.createElement('button');
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
      if (this.activeEra === 'all') {
        btn.classList.toggle('active', !id);
      } else {
        btn.classList.toggle('active', id === this.activeEra);
      }
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

    // Draw cosmic rails between adjacent era panels
    for (let i = 0; i < this.panelLayout.length - 1; i++) {
      const current = this.panelLayout[i];
      const next = this.panelLayout[i + 1];

      const x1 = current.x + current.width;
      const y1 = current.y + 165; // Center of hero banner
      const x2 = next.x;
      const y2 = next.y + 165;

      const midX = (x1 + x2) / 2;

      // Cubic curve
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'url(#celestialRailGrad)');
      path.setAttribute('stroke-width', '3');
      path.setAttribute('stroke-dasharray', '8 6');
      path.setAttribute('filter', 'url(#railGlow)');
      this.connectorsSvg.appendChild(path);

      // Celestial waypoint dot
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', midX);
      circle.setAttribute('cy', (y1 + y2) / 2);
      circle.setAttribute('r', '5');
      circle.setAttribute('fill', '#e5c158');
      circle.setAttribute('filter', 'url(#railGlow)');
      this.connectorsSvg.appendChild(circle);
    }
  }

  renderEraPanels() {
    if (!this.eraPanelsContainer) return;
    this.eraPanelsContainer.innerHTML = '';

    this.eras.forEach((era, index) => {
      const layout = this.panelLayout[index];
      const panel = document.createElement('article');
      panel.className = `spatial-era-panel ${this.activeEra === era.id ? 'is-active-panel' : ''}`;
      panel.setAttribute('data-id', era.id);
      panel.style.left = `${layout.x}px`;
      panel.style.top = `${layout.y}px`;
      panel.style.setProperty('--panel-glow', `${era.color}40`);
      panel.style.setProperty('--panel-width', `${layout.width}px`);
      panel.style.setProperty('--panel-columns', layout.columns);

      // Determine hero artwork based on era and modern toggle
      let currentHeroArt = era.bgImage;
      if (era.id === 'modern') {
        currentHeroArt = this.modernArtwork === 'snez' && era.alternateBgImage 
          ? era.alternateBgImage 
          : era.bgImage;
      }

      // Hero Banner HTML
      const heroBannerHtml = `
        <div class="era-hero-banner">
          <img src="${currentHeroArt}" alt="${era.name}" class="era-hero-img" id="hero-img-${era.id}">
          <div class="era-hero-overlay"></div>
          <div class="era-hero-content">
            <div class="era-hero-badge-row">
              <span class="era-epoch-badge" style="color: ${era.color}; border-color: ${era.color}60;">
                Epoch ${String(index + 1).padStart(2, '0')} / ${String(this.eras.length).padStart(2, '0')}
              </span>
              <span class="era-hero-year">${era.yearRange || ''}</span>
              ${era.id === 'modern' ? `
                <div class="artwork-switcher-group" title="Switch Modern Era Artworks">
                  <button class="art-switch-btn ${this.modernArtwork === 'paimon' ? 'active' : ''}" data-art="paimon">
                    <span>✨ Paimon & Traveler</span>
                  </button>
                  <button class="art-switch-btn ${this.modernArtwork === 'snez' ? 'active' : ''}" data-art="snez">
                    <span>❄️ Snezhnaya</span>
                  </button>
                </div>
              ` : ''}
            </div>

            <h2 class="era-hero-title">${era.name}</h2>
            <p class="era-hero-desc">${era.description}</p>

            <div class="era-hero-actions">
              <button class="era-inspect-btn" data-era-id="${era.id}" title="Inspect full epoch lore and key figures">
                <span>Inspect Epoch Lore</span>
                <span>ℹ️</span>
              </button>
              ${era.wikiUrl ? `
                <a href="${era.wikiUrl}" target="_blank" rel="noopener noreferrer" class="era-wiki-link" title="Open on Genshin Impact Wiki">
                  <span>Epoch Wiki</span>
                  <span class="ext-arrow">↗</span>
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      `;

      // Events for this era
      const eraEvents = this.events.filter(e => e.eraId === era.id);

      const eventsHtml = `
        <div class="era-panel-body">
          <div class="era-events-header">
            <div class="era-events-title">
              <span>Historical Milestones</span>
              <span class="era-events-count-badge">${eraEvents.length} canonical events</span>
            </div>
          </div>
          <div class="era-events-grid" id="events-grid-${era.id}">
            <!-- Event cards rendered below -->
          </div>
        </div>
      `;

      panel.innerHTML = heroBannerHtml + eventsHtml;

      // Event Card Injection
      const gridEl = panel.querySelector(`#events-grid-${era.id}`);
      if (gridEl) {
        eraEvents.forEach(ev => {
          const card = this.createEventCard(ev, era);
          gridEl.appendChild(card);
        });
      }

      // Event Listeners for Hero Actions
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

            // Update Hero Image
            const imgEl = panel.querySelector(`#hero-img-${era.id}`);
            if (imgEl) {
              imgEl.src = chosenArt === 'snez' && era.alternateBgImage ? era.alternateBgImage : era.bgImage;
            }
          });
        });
      }

      this.eraPanelsContainer.appendChild(panel);
    });
  }

  createEventCard(ev, era) {
    const card = document.createElement('div');
    const isPinned = this.pinnedEvent?.id === ev.id;
    card.className = `spatial-event-card ${isPinned ? 'is-pinned-active' : ''}`;
    card.setAttribute('data-id', ev.id);
    card.style.setProperty('--card-accent', era.color);

    const subDate = (ev.dateDisplay || '').includes('•')
      ? ev.dateDisplay.split('•')[1].trim()
      : ev.dateDisplay;

    const sourceCount = (ev.sources || []).length;

    card.innerHTML = `
      <div class="event-card-header">
        <span class="event-card-year">${ev.yearsAgoDisplay || ''}</span>
        <span class="event-card-date" title="${ev.dateDisplay}">${subDate}</span>
      </div>
      <h3 class="event-card-title">${ev.title}</h3>
      <p class="event-card-summary">${ev.summary}</p>
      <div class="event-card-footer">
        <span class="event-card-region">📍 ${ev.tags?.region || 'Teyvat'}</span>
        ${sourceCount > 0 ? `<span class="event-card-source-count">📖 ${sourceCount} source${sourceCount === 1 ? '' : 's'}</span>` : ''}
      </div>
    `;

    // Click to pin
    card.addEventListener('click', (e) => {
      // Don't pin if user was actively dragging
      if (this.hasMoved) return;
      e.stopPropagation();
      this.pinEvent(ev, card);
    });

    // Hover tooltip
    card.addEventListener('mouseenter', () => {
      if (!this.hasMoved && !this.pinnedEvent) {
        this.showTooltip(ev, card, era);
      }
    });

    card.addEventListener('mouseleave', () => {
      this.hideTooltip();
    });

    return card;
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

    this.eras.forEach(era => {
      let eraMatchCount = 0;
      const eraEvents = this.events.filter(e => e.eraId === era.id);

      eraEvents.forEach(ev => {
        const matchesSearch = !this.searchQuery || 
          ev.title.toLowerCase().includes(this.searchQuery) ||
          ev.summary.toLowerCase().includes(this.searchQuery) ||
          (ev.tags?.region && ev.tags.region.toLowerCase().includes(this.searchQuery)) ||
          (ev.tags?.characters && ev.tags.characters.some(c => c.toLowerCase().includes(this.searchQuery)));

        const cardEl = document.querySelector(`.spatial-event-card[data-id="${ev.id}"]`);
        if (cardEl) {
          if (matchesSearch) {
            cardEl.style.display = 'flex';
            matchCount++;
            eraMatchCount++;
          } else {
            cardEl.style.display = 'none';
          }
        }
      });

      const panelEl = document.querySelector(`.spatial-era-panel[data-id="${era.id}"]`);
      if (panelEl) {
        panelEl.style.opacity = (!this.searchQuery || eraMatchCount > 0) ? '1' : '0.35';
      }
    });

    if (this.eventCountBadge) {
      this.eventCountBadge.textContent = `${matchCount} event${matchCount === 1 ? '' : 's'}`;
    }
  }

  updateEventCountBadge() {
    if (this.eventCountBadge) {
      this.eventCountBadge.textContent = `${this.events.length} events`;
    }
  }

  showTooltip(ev, cardElement, era) {
    if (!this.tooltip) return;
    const rect = cardElement.getBoundingClientRect();
    const hasImage = ev.images && ev.images.length > 0 && ev.images[0].url;

    this.tooltip.innerHTML = `
      ${hasImage ? `<img src="${ev.images[0].url}" alt="${ev.title}" class="tooltip-img" onerror="this.remove()">` : ''}
      <div class="tooltip-header">
        <span class="tooltip-era" style="color: ${era.color};">${ev.eraName || era.name}</span>
        <span class="tooltip-year-badge">${ev.yearsAgoDisplay || ''}</span>
      </div>
      <div class="tooltip-date-full">${ev.dateDisplay}</div>
      <div class="tooltip-title">${ev.title}</div>
      <div class="tooltip-summary">${ev.summary}</div>
      <div class="tooltip-pin-hint">Click card to pin details 📌</div>
    `;

    const tooltipWidth = 320;
    const tooltipHeight = 160;
    let left = rect.left + rect.width / 2;
    let top = rect.top - tooltipHeight - 12;

    if (top < 70) {
      top = rect.bottom + 12;
    }

    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.top = `${top}px`;
    this.tooltip.classList.add('is-visible');
  }

  hideTooltip() {
    if (this.tooltip) this.tooltip.classList.remove('is-visible');
  }

  pinEvent(ev, cardElement) {
    this.pinnedEvent = ev;
    this.currentSlideIndex = 0;
    this.hideTooltip();

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
    this.flyToEra(era.id);

    // Deselect any pinned event
    document.querySelectorAll('.spatial-event-card').forEach(c => c.classList.remove('is-pinned-active'));
    this.pinnedEvent = null;

    // Populate Inspector Drawer with rich Era information
    this.inspectorEra.textContent = 'Historical Epoch';
    this.inspectorEra.style.color = era.color;
    this.inspectorDate.innerHTML = `
      <span class="inspector-year-pill">${era.yearRange || ''}</span>
      <span class="inspector-date-full">Epoch Rank: ${era.startRank} – ${era.endRank}</span>
    `;
    this.inspectorTitle.textContent = era.name;
    this.inspectorDesc.textContent = era.longDescription || era.description;

    // For modern era, pass both Paimon and Snezhnaya to carousel!
    if (era.id === 'modern') {
      const modernSlides = [
        {
          url: era.bgImage,
          alt: 'Starfell Beach — Paimon & Traveler',
          caption: 'Starfell Beach — The Traveler awakens and fishes up Paimon'
        }
      ];
      if (era.alternateBgImage) {
        modernSlides.push({
          url: era.alternateBgImage,
          alt: 'Zapolyarny Palace — Snezhnaya',
          caption: 'Zapolyarny Palace — The seat of the Tsaritsa and the Fatui Harbingers'
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
            ${eraEvents.length} canonical milestone${eraEvents.length === 1 ? '' : 's'}:
          </span>
          ${era.wikiUrl ? `
            <a href="${era.wikiUrl}" target="_blank" rel="noopener noreferrer" class="citation-open-btn" style="background: ${era.color}20; border-color: ${era.color}60; color: ${era.color};" title="Read about ${era.name} on Genshin Impact Wiki">
              <span>Epoch Wiki</span>
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

    if (tags.region) {
      this.inspectorTags.innerHTML += `<span class="tag-badge region">📍 Region: ${tags.region}</span>`;
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
      this.inspectorTags.innerHTML += `<span class="tag-badge" style="border-color: rgba(248, 113, 113, 0.4); color: #fca5a5;">⚠️ Spoiler: ${tags.spoilerLevel}</span>`;
    }
  }

  renderInspectorSources(sources) {
    if (!this.inspectorSources) return;
    this.inspectorSources.innerHTML = '';

    if (!sources || sources.length === 0) {
      this.inspectorSources.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">No primary citations recorded yet.</p>';
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
