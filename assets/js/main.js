/**
 * Thrilling Tales — Interactive Horizontal Timeline Engine
 * Features:
 * - Proportional horizontal chronological canvas with Era bands & ruler ticks
 * - Drag-to-pan & mouse-wheel horizontal scrolling with zoom scaling
 * - Instant hover preview tooltip
 * - Pinned event inspector drawer with multi-image carousel
 * - Era quick-jump navigation and full-text keyword search
 */

class TeyvatTimelineApp {
  constructor() {
    this.eras = [];
    this.events = [];
    this.filteredEvents = [];
    this.pinnedEvent = null;
    this.currentSlideIndex = 0;
    this.zoomLevel = 1.0;
    this.activeEra = 'all';
    this.searchQuery = '';

    // Drag / Pan physics state
    this.isMouseDown = false;
    this.startX = 0;
    this.scrollLeft = 0;
    this.dragDistance = 0;

    this.cacheDom();
    this.init();
  }

  cacheDom() {
    this.viewport = document.getElementById('timeline-viewport');
    this.canvas = document.getElementById('timeline-canvas');
    this.eraBands = document.getElementById('era-band-container');
    this.ruler = document.getElementById('ruler-container');
    this.nodesContainer = document.getElementById('event-nodes-container');
    this.tooltip = document.getElementById('timeline-tooltip');

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
    this.setupPanAndScroll();
    this.setupEventListeners();
    this.render();
  }

  async loadData() {
    try {
      // Determine relative base URL for fetching JSON in both root and subfolders
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
      console.error('[Timeline] Failed to load JSON data:', err);
    }
  }

  setupPanAndScroll() {
    if (!this.viewport) return;

    // Mouse Drag-to-Pan
    this.viewport.addEventListener('mousedown', (e) => {
      // Don't drag if clicking directly on a button or node
      if (e.target.closest('.event-node') || e.target.closest('button')) return;
      this.isMouseDown = true;
      this.dragDistance = 0;
      this.viewport.classList.add('is-dragging');
      this.startX = e.pageX - this.viewport.offsetLeft;
      this.scrollLeft = this.viewport.scrollLeft;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isMouseDown) return;
      e.preventDefault();
      const x = e.pageX - this.viewport.offsetLeft;
      const walk = (x - this.startX) * 1.5;
      this.dragDistance = Math.abs(x - this.startX);
      this.viewport.scrollLeft = this.scrollLeft - walk;
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
      this.viewport.classList.remove('is-dragging');
    });

    // Horizontal Mouse Wheel Scroll
    this.viewport.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        this.viewport.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }

  setupEventListeners() {
    // Zoom Controls
    this.zoomInBtn?.addEventListener('click', () => this.adjustZoom(0.2));
    this.zoomOutBtn?.addEventListener('click', () => this.adjustZoom(-0.2));
    this.zoomResetBtn?.addEventListener('click', () => this.resetZoom());

    // Search Input
    this.searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.applyFilters();
    });

    // Inspector Close
    this.inspectorCloseBtn?.addEventListener('click', () => this.unpinEvent());
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.unpinEvent();
      if (this.pinnedEvent) {
        if (e.key === 'ArrowLeft') this.prevSlide();
        if (e.key === 'ArrowRight') this.nextSlide();
      }
    });

    // Carousel Controls
    this.prevBtn?.addEventListener('click', () => this.prevSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());
  }

  adjustZoom(delta) {
    this.zoomLevel = Math.max(0.6, Math.min(2.0, this.zoomLevel + delta));
    this.updateCanvasWidth();
  }

  resetZoom() {
    this.zoomLevel = 1.0;
    this.updateCanvasWidth();
  }

  updateCanvasWidth() {
    const baseWidth = 3800;
    const newWidth = Math.round(baseWidth * this.zoomLevel);
    this.canvas.style.minWidth = `${newWidth}px`;
    this.renderNodes();
    this.renderRuler();
    this.renderEraBands();
  }

  applyFilters() {
    this.filteredEvents = this.events.filter(ev => {
      const matchesEra = this.activeEra === 'all' || ev.eraId === this.activeEra;
      const matchesSearch = !this.searchQuery || 
        ev.title.toLowerCase().includes(this.searchQuery) ||
        ev.summary.toLowerCase().includes(this.searchQuery) ||
        (ev.tags?.region && ev.tags.region.toLowerCase().includes(this.searchQuery)) ||
        (ev.tags?.characters && ev.tags.characters.some(c => c.toLowerCase().includes(this.searchQuery)));
      return matchesEra && matchesSearch;
    });

    this.renderNodes();
    if (this.eventCountBadge) {
      this.eventCountBadge.textContent = `${this.filteredEvents.length} event${this.filteredEvents.length === 1 ? '' : 's'}`;
    }
  }

  render() {
    this.renderEraButtons();
    this.renderEraBands();
    this.renderRuler();
    this.renderNodes();
  }

  renderEraButtons() {
    if (!this.eraJumperGroup) return;
    this.eraJumperGroup.innerHTML = '';

    const allBtn = document.createElement('button');
    allBtn.className = `era-btn ${this.activeEra === 'all' ? 'active' : ''}`;
    allBtn.textContent = 'All Eras';
    allBtn.addEventListener('click', () => {
      this.activeEra = 'all';
      this.updateActiveEraButton(allBtn);
      this.applyFilters();
    });
    this.eraJumperGroup.appendChild(allBtn);

    this.eras.forEach(era => {
      const btn = document.createElement('button');
      btn.className = `era-btn ${this.activeEra === era.id ? 'active' : ''}`;
      btn.textContent = era.shortName || era.name;
      btn.style.borderColor = `${era.color}40`;
      btn.addEventListener('click', () => {
        this.activeEra = era.id;
        this.updateActiveEraButton(btn);
        this.applyFilters();
        this.jumpToEra(era);
      });
      this.eraJumperGroup.appendChild(btn);
    });
  }

  updateActiveEraButton(activeBtn) {
    this.eraJumperGroup.querySelectorAll('.era-btn').forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');
  }

  jumpToEra(era) {
    const canvasWidth = this.canvas.offsetWidth || 3800;
    const targetX = (era.startRank / 1000) * (canvasWidth - 200);
    this.viewport.scrollTo({
      left: Math.max(0, targetX - 100),
      behavior: 'smooth'
    });
  }

  renderEraBands() {
    if (!this.eraBands) return;
    this.eraBands.innerHTML = '';

    this.eras.forEach(era => {
      const band = document.createElement('div');
      band.className = 'era-band';
      const widthPct = ((era.endRank - era.startRank) / 1000) * 100;
      band.style.width = `${widthPct}%`;
      band.style.background = era.bgGradient || 'rgba(255,255,255,0.05)';
      band.style.borderColor = `${era.color}40`;

      band.innerHTML = `
        <div class="era-band-title" style="color: ${era.color};">${era.name}</div>
        <div class="era-band-dates">${era.description}</div>
      `;

      band.addEventListener('click', () => {
        this.activeEra = era.id;
        this.renderEraButtons();
        this.applyFilters();
        this.jumpToEra(era);
      });

      this.eraBands.appendChild(band);
    });
  }

  renderRuler() {
    if (!this.ruler) return;
    this.ruler.innerHTML = '';
    const totalTicks = 80;

    for (let i = 0; i <= totalTicks; i++) {
      const tick = document.createElement('div');
      const isMajor = i % 10 === 0;
      tick.className = `ruler-tick ${isMajor ? 'major' : ''}`;
      tick.style.left = `${(i / totalTicks) * 100}%`;
      this.ruler.appendChild(tick);
    }
  }

  renderNodes() {
    if (!this.nodesContainer) return;
    this.nodesContainer.innerHTML = '';

    const canvasWidth = this.canvas.offsetWidth || 3800;
    const availableWidth = canvasWidth - 200;

    this.filteredEvents.forEach((ev, index) => {
      const era = this.eras.find(e => e.id === ev.eraId) || { color: '#e5c158' };
      const node = document.createElement('div');
      const isStaggerTop = index % 2 === 0;
      node.className = `event-node ${isStaggerTop ? 'stagger-top' : 'stagger-bottom'} ${this.pinnedEvent?.id === ev.id ? 'is-active' : ''}`;
      node.setAttribute('data-id', ev.id);

      // Compute horizontal coordinate based on orderRank (0 to 1000 scale)
      const posX = 100 + (ev.orderRank / 1000) * availableWidth;
      node.style.left = `${posX}px`;
      node.style.color = era.color;

      node.innerHTML = `
        <div class="event-connector-line"></div>
        <div class="node-pin-dot" style="border-color: ${era.color}; box-shadow: 0 0 12px ${era.color};"></div>
        <div class="event-node-card">
          <span class="card-date-badge">${ev.dateDisplay}</span>
          <h3 class="card-title-text">${ev.title}</h3>
          <div class="card-thumbnail-bar">
            <span class="card-pill-tag" style="background: ${era.color}22; color: ${era.color}; border: 1px solid ${era.color}44;">
              ${ev.eraName || 'Canonical'}
            </span>
            ${ev.tags?.region ? `<span class="card-pill-tag" style="background: rgba(255,255,255,0.08); color: #cbd5e1;">${ev.tags.region}</span>` : ''}
          </div>
        </div>
      `;

      // Hover Tooltip Triggers
      node.addEventListener('mouseenter', (e) => this.showTooltip(ev, e.currentTarget, era));
      node.addEventListener('mouseleave', () => this.hideTooltip());

      // Click to Pin Trigger
      node.addEventListener('click', (e) => {
        // Prevent accidental clicks during drag gestures
        if (this.dragDistance > 5) return;
        this.pinEvent(ev, node);
      });

      this.nodesContainer.appendChild(node);
    });
  }

  showTooltip(ev, nodeElement, era) {
    if (!this.tooltip || this.isMouseDown) return;

    const rect = nodeElement.getBoundingClientRect();
    const tooltipX = rect.left + rect.width / 2;
    const isTop = nodeElement.classList.contains('stagger-top');

    const validImages = (ev.images || []).filter(img => img && img.url && img.url.trim() !== '');
    const hasImage = validImages.length > 0;
    const firstImage = hasImage ? validImages[0].url : '';

    this.tooltip.innerHTML = `
      ${firstImage ? `<img src="${firstImage}" alt="${ev.title}" class="tooltip-img" onerror="this.remove()">` : ''}
      <div class="tooltip-header">
        <span class="tooltip-era" style="color: ${era.color};">${ev.eraName}</span>
        <span class="tooltip-date">${ev.dateDisplay}</span>
      </div>
      <div class="tooltip-title">${ev.title}</div>
      <div class="tooltip-summary">${ev.summary}</div>
      <div class="tooltip-pin-hint">Click node to pin event 📌</div>
    `;

    // Position tooltip dynamically based on rendered height
    this.tooltip.style.left = `${tooltipX}px`;
    const tooltipHeight = this.tooltip.offsetHeight || (hasImage ? 260 : 130);
    const tooltipY = isTop ? rect.top - tooltipHeight - 12 : rect.bottom + 12;

    this.tooltip.style.top = `${Math.max(65, Math.min(window.innerHeight - tooltipHeight - 20, tooltipY))}px`;
    this.tooltip.classList.add('is-visible');
  }

  hideTooltip() {
    if (!this.tooltip) return;
    this.tooltip.classList.remove('is-visible');
  }

  pinEvent(ev, nodeElement) {
    this.pinnedEvent = ev;
    this.currentSlideIndex = 0;
    this.hideTooltip();

    // Mark active node
    document.querySelectorAll('.event-node').forEach(n => n.classList.remove('is-active'));
    if (nodeElement) nodeElement.classList.add('is-active');

    const era = this.eras.find(e => e.id === ev.eraId) || { color: '#e5c158' };

    // Fill Inspector Metadata
    this.inspectorEra.textContent = ev.eraName;
    this.inspectorEra.style.color = era.color;
    this.inspectorDate.textContent = ev.dateDisplay;
    this.inspectorTitle.textContent = ev.title;
    this.inspectorDesc.textContent = ev.description;

    // Render Image Carousel (or hide if empty)
    this.renderCarousel(ev.images || []);

    // Render Tags
    this.renderInspectorTags(ev.tags || {});

    // Render Citations
    this.renderInspectorSources(ev.sources || []);

    // Slide open drawer
    this.inspector.classList.add('is-open');
  }

  unpinEvent() {
    this.pinnedEvent = null;
    document.querySelectorAll('.event-node').forEach(n => n.classList.remove('is-active'));
    this.inspector.classList.remove('is-open');
  }

  renderCarousel(images) {
    if (!this.carousel || !this.carouselSlides || !this.carouselDots) return;
    this.carouselSlides.innerHTML = '';
    this.carouselDots.innerHTML = '';

    const validImages = (images || []).filter(img => img && img.url && img.url.trim() !== '');

    // If no valid images, completely hide the carousel UI
    if (validImages.length === 0) {
      this.carousel.style.display = 'none';
      return;
    }

    this.carousel.style.display = 'block';

    validImages.forEach((img, idx) => {
      // Slide element
      const slide = document.createElement('div');
      slide.className = `carousel-slide ${idx === 0 ? 'active' : ''}`;
      slide.innerHTML = `
        <img src="${img.url}" alt="${img.alt || 'Event artwork'}" class="carousel-img">
        ${img.caption ? `<div class="carousel-caption">${img.caption}</div>` : ''}
      `;

      // Handle image load error: if image fails, remove this slide
      const imgEl = slide.querySelector('img');
      imgEl.addEventListener('error', () => {
        slide.remove();
        if (this.carouselSlides.children.length === 0) {
          this.carousel.style.display = 'none';
        }
      });

      this.carouselSlides.appendChild(slide);

      // Dot element
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

    sources.forEach(src => {
      const card = document.createElement('div');
      card.className = 'citation-card';
      card.innerHTML = `
        ${src.quote ? `<div class="citation-quote">"${src.quote}"</div>` : ''}
        <div class="citation-title">📖 ${src.title} (${src.category})</div>
      `;
      this.inspectorSources.appendChild(card);
    });
  }
}

// Instantiate on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.timelineApp = new TeyvatTimelineApp();
});
