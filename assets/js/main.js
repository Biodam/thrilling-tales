/**
 * Thrilling Tales — Teyvat Interactive Timeline
 * Main client-side scripts & timeline controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initTimelineControls();
  logDeploymentEnvironment();
});

/**
 * Diagnostic log to help developers verify GitHub Pages subfolder base path
 */
function logDeploymentEnvironment() {
  const currentPath = window.location.pathname;
  const isSubfolder = currentPath.includes('/timeline/');
  console.log('[Teyvat Timeline] Initialized at path:', currentPath, {
    isSubfolder,
    origin: window.location.origin
  });
}

/**
 * Sets up era filtering pills and interactive timeline toggles
 */
function initTimelineControls() {
  const filterButtons = document.querySelectorAll('.pill-btn');
  const timelineNodes = document.querySelectorAll('.timeline-node');
  const countIndicator = document.getElementById('event-count');

  if (!filterButtons.length || !timelineNodes.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button style
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedEra = btn.getAttribute('data-era');
      let visibleCount = 0;

      timelineNodes.forEach(node => {
        const nodeEra = node.getAttribute('data-era');
        if (selectedEra === 'all' || nodeEra === selectedEra) {
          node.style.display = 'block';
          visibleCount++;
        } else {
          node.style.display = 'none';
        }
      });

      if (countIndicator) {
        countIndicator.textContent = `Showing ${visibleCount} canonical milestone${visibleCount === 1 ? '' : 's'}`;
      }
    });
  });
}
