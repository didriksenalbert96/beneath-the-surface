/* ============================================
   ICON-GRID.JS — The centrepiece visualization

   Each small square = 100,000 animals that died
   during production in Norway in 2023.

   Salmon:    ~200 million = 2,000 dots
   Poultry:   ~5.4 million = 54 dots
   Pigs:      ~240,000     = 2 dots
   Ruminants: ~100,000     = 1 dot
   ============================================ */

// Track which step we've shown so far (to avoid re-animating)
let iconGridCurrentStep = 0;

// Store references to the dots so we can animate them
let salmonDots = [];
let poultryDots = [];
let pigDots = [];
let ruminantDots = [];

/**
 * Creates all the dots in the icon grid, but keeps them hidden.
 * Called once on page load.
 */
function initIconGrid() {
  const grid = document.getElementById('iconGrid');
  if (!grid) return;

  // Create salmon dots (2,000)
  salmonDots = createDots(grid, 2000, 'salmon');

  // Create a small visual separator
  const separator = document.createElement('div');
  separator.style.width = '100%';
  separator.style.height = '12px';
  grid.appendChild(separator);

  // Create poultry dots (54)
  poultryDots = createDots(grid, 54, 'poultry');

  // Create pig dots (2)
  pigDots = createDots(grid, 2, 'pig');

  // Create ruminant dots (1)
  ruminantDots = createDots(grid, 1, 'ruminant');

  // Build the legend (initially hidden)
  buildLegend();
}


/**
 * Helper: creates N dot elements of a given type and appends to container.
 * Returns an array of the created elements.
 */
function createDots(container, count, type) {
  const dots = [];
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.className = `icon-dot ${type}`;
    container.appendChild(dot);
    dots.push(dot);
  }
  return dots;
}


/**
 * Builds the legend below the grid title.
 */
function buildLegend() {
  const legend = document.getElementById('gridLegend');
  if (!legend) return;

  const items = [
    { color: 'var(--color-salmon)', label: 'Salmon' },
    { color: 'var(--color-poultry)', label: 'Poultry' },
    { color: 'var(--color-pig)', label: 'Pigs' },
    { color: 'var(--color-ruminant)', label: 'Ruminants' },
  ];

  items.forEach(item => {
    const el = document.createElement('span');
    el.className = 'legend-item';
    el.innerHTML = `<span class="legend-dot" style="background:${item.color}"></span>${item.label}`;
    legend.appendChild(el);
  });

  // Hide legend initially
  legend.style.opacity = '0';
  legend.style.transition = 'opacity 0.5s ease';
}


/**
 * Called by main.js when the user scrolls through the icon grid steps.
 * Progressively reveals dots to tell the story.
 */
function updateIconGrid(stepNum) {
  if (stepNum <= iconGridCurrentStep) return; // Don't re-animate
  iconGridCurrentStep = stepNum;

  const legend = document.getElementById('gridLegend');

  switch (stepNum) {
    case 1:
      // Reveal salmon dots in waves
      revealDotsInWaves(salmonDots, 50); // 50 dots per wave
      break;

    case 2:
      // Make sure salmon are all visible
      salmonDots.forEach(d => d.classList.add('visible'));
      break;

    case 3:
      // Reveal poultry dots
      revealDotsInWaves(poultryDots, 10);
      if (legend) legend.style.opacity = '1';
      break;

    case 4:
      // Reveal pig and ruminant dots
      pigDots.forEach(d => d.classList.add('visible'));
      ruminantDots.forEach(d => d.classList.add('visible'));
      break;

    case 5:
      // All visible — final state
      break;
  }
}


/**
 * Reveals an array of dots in staggered waves for a flowing animation.
 * waveSize: how many dots appear at once
 */
function revealDotsInWaves(dots, waveSize) {
  dots.forEach((dot, i) => {
    const delay = Math.floor(i / waveSize) * 30; // 30ms between waves
    setTimeout(() => {
      dot.classList.add('visible');
    }, delay);
  });
}
