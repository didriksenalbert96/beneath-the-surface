/* ============================================
   CHARTS.JS — All supporting visualizations
   ============================================ */

/**
 * Initialize all chart elements on page load.
 * This creates the DOM elements but doesn't animate them yet.
 */
function initCharts() {
  buildMortalityChart();
  buildStageFlow();
  buildDotMap();
  buildCleanerGrid();
  buildThermometer();
}


/* ============================================
   SECTION 3: MORTALITY BAR CHART
   ============================================ */
const mortalityData = [
  { label: 'Salmon',        value: 16.7, color: 'var(--color-salmon)' },
  { label: 'Rainbow trout', value: 14.0, color: 'var(--color-trout)' },
  { label: 'Pigs',          value: 12.0, color: 'var(--color-pig)' },
  { label: 'Turkeys',       value: 9.0,  color: 'var(--color-turkey)' },
  { label: 'Cattle',        value: 8.0,  color: 'var(--color-cattle)' },
];

let mortalityRevealed = 0;

function buildMortalityChart() {
  const chart = document.getElementById('mortalityChart');
  if (!chart) return;

  mortalityData.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'bar-row';
    row.setAttribute('data-index', i);

    row.innerHTML = `
      <span class="bar-label">${item.label}</span>
      <div class="bar-track">
        <div class="bar-fill" style="background:${item.color}" data-target="${item.value}">
          <span class="bar-value">${item.value}%</span>
        </div>
      </div>
    `;

    chart.appendChild(row);
  });
}

/**
 * Called by main.js on step enter for the mortality section.
 */
function updateMortality(stepNum) {
  const fills = document.querySelectorAll('#mortalityChart .bar-fill');

  if (stepNum >= 1 && mortalityRevealed < 1) {
    // Reveal first bar (salmon)
    animateBar(fills[0]);
    mortalityRevealed = 1;
  }
  if (stepNum >= 2 && mortalityRevealed < 2) {
    // Reveal second bar (trout)
    animateBar(fills[1]);
    mortalityRevealed = 2;
  }
  if (stepNum >= 3 && mortalityRevealed < 3) {
    // Reveal remaining bars
    for (let i = 2; i < fills.length; i++) {
      setTimeout(() => animateBar(fills[i]), (i - 2) * 200);
    }
    mortalityRevealed = 3;
  }
}

function animateBar(barFill) {
  if (!barFill) return;
  const target = barFill.getAttribute('data-target');
  // Scale to make the chart more readable (16.7% would be tiny, so scale up)
  const scaledWidth = (parseFloat(target) / 20) * 100;
  barFill.style.width = scaledWidth + '%';
}


/* ============================================
   SECTION 4: STAGE FLOW (WHERE THEY DIE)
   ============================================ */
const stagesData = [
  { icon: '🥚', title: 'Smolt phase (hatchery)', number: '60M', subtitle: 'die in freshwater' },
  { icon: '❌', title: 'Destroyed / culled', number: '80M', subtitle: 'destroyed before reaching sea' },
  { icon: '🌊', title: 'Seawater phase', number: '60M', subtitle: 'die in sea pens' },
];

let stagesRevealed = 0;

function buildStageFlow() {
  const flow = document.getElementById('stageFlow');
  if (!flow) return;

  stagesData.forEach((stage, i) => {
    const item = document.createElement('div');
    item.className = 'stage-item';
    item.setAttribute('data-index', i);

    item.innerHTML = `
      <div class="stage-icon">${stage.icon}</div>
      <div class="stage-info">
        <h4>${stage.title}</h4>
        <div class="stage-number">${stage.number}</div>
        <div style="font-size:0.85rem; color:var(--color-text-light)">${stage.subtitle}</div>
      </div>
    `;

    flow.appendChild(item);
  });
}

function updateStages(stepNum) {
  const items = document.querySelectorAll('.stage-item');

  if (stepNum >= 1 && stagesRevealed < 1) {
    // Show the overview — reveal first item faded
    items[0].classList.add('visible');
    stagesRevealed = 1;
  }
  if (stepNum >= 2 && stagesRevealed < 2) {
    items[0].classList.add('active');
    items[1].classList.add('visible', 'active');
    stagesRevealed = 2;
  }
  if (stepNum >= 3 && stagesRevealed < 3) {
    items[2].classList.add('visible', 'active');
    stagesRevealed = 3;
  }
}


/* ============================================
   SECTION 5: DOT MAP (DISEASE)
   ============================================ */
const TOTAL_SITES = 815;
const AFFECTED_SITES = 320;
let diseaseRevealed = false;

function buildDotMap() {
  const map = document.getElementById('dotMap');
  if (!map) return;

  for (let i = 0; i < TOTAL_SITES; i++) {
    const dot = document.createElement('div');
    dot.className = 'site-dot';
    dot.setAttribute('data-index', i);
    map.appendChild(dot);
  }
}

function updateDisease(stepNum) {
  if (stepNum >= 2 && !diseaseRevealed) {
    diseaseRevealed = true;
    const dots = document.querySelectorAll('.site-dot');

    // Randomly select 320 dots to turn red
    const indices = [];
    while (indices.length < AFFECTED_SITES) {
      const r = Math.floor(Math.random() * TOTAL_SITES);
      if (!indices.includes(r)) indices.push(r);
    }

    // Stagger the reveal
    indices.forEach((idx, i) => {
      setTimeout(() => {
        dots[idx].classList.add('affected');
      }, i * 3); // 3ms between each for a ripple effect
    });
  }
}


/* ============================================
   SECTION 6: CLEANER FISH
   ============================================ */
// 30 million cleaner fish, but we can't show 300 dots for each 100K
// Let's show 300 dots (each = 100,000 fish) to keep it manageable
const CLEANER_TOTAL = 300;
const CLEANER_DEAD_PERCENT = 0.4;
let cleanerStep = 0;

function buildCleanerGrid() {
  const grid = document.getElementById('cleanerGrid');
  if (!grid) return;

  for (let i = 0; i < CLEANER_TOTAL; i++) {
    const dot = document.createElement('div');
    dot.className = 'cleaner-dot';
    grid.appendChild(dot);
  }
}

function updateCleaner(stepNum) {
  const dots = document.querySelectorAll('.cleaner-dot');
  const stats = document.getElementById('cleanerStats');

  if (stepNum >= 1 && cleanerStep < 1) {
    // Show all cleaner fish
    dots.forEach((dot, i) => {
      setTimeout(() => dot.classList.add('visible'), i * 5);
    });
    if (stats) stats.textContent = '30 million cleaner fish deployed each year';
    cleanerStep = 1;
  }

  if (stepNum >= 2 && cleanerStep < 2) {
    // Mark 40% as dead
    const deadCount = Math.floor(CLEANER_TOTAL * CLEANER_DEAD_PERCENT);
    dots.forEach((dot, i) => {
      if (i < deadCount) {
        setTimeout(() => dot.classList.add('dead'), i * 8);
      }
    });
    if (stats) stats.innerHTML = '<span style="color:var(--color-danger)">More than 40% die</span>';
    cleanerStep = 2;
  }
}


/* ============================================
   SECTION 7: THERMOMETER
   ============================================ */
let thermalStep = 0;

function buildThermometer() {
  const container = document.getElementById('thermometer');
  if (!container) return;

  container.innerHTML = `
    <svg class="thermo-svg" viewBox="0 0 60 200" xmlns="http://www.w3.org/2000/svg">
      <!-- Thermometer body -->
      <rect x="20" y="10" width="20" height="140" rx="10" fill="#e8e8e8" />
      <!-- Thermometer bulb -->
      <circle cx="30" cy="165" r="20" fill="#e8e8e8" />
      <!-- Mercury fill (animated) -->
      <rect class="mercury-fill" x="23" y="10" width="14" height="0" rx="7" fill="#d32f2f" style="transition: height 1.5s ease-out, y 1.5s ease-out;" />
      <circle class="mercury-bulb" cx="30" cy="165" r="16" fill="#d32f2f" opacity="0" style="transition: opacity 0.5s ease;" />
      <!-- Temperature marks -->
      <line x1="42" y1="130" x2="50" y2="130" stroke="#999" stroke-width="1" />
      <text x="52" y="134" font-size="8" fill="#999">8°C</text>
      <line x1="42" y1="90" x2="50" y2="90" stroke="#999" stroke-width="1" />
      <text x="52" y="94" font-size="8" fill="#999">14°C</text>
      <line x1="42" y1="30" x2="50" y2="30" stroke="#d32f2f" stroke-width="1.5" />
      <text x="52" y="34" font-size="8" fill="#d32f2f" font-weight="bold">34°C</text>
    </svg>
    <div class="thermo-reading" id="thermoReading">28–34°C</div>
    <div class="thermo-label">Treatment water temperature</div>
    <div class="thermo-context">Salmon thrive at 8–14°C</div>
  `;
}

function updateThermal(stepNum) {
  if (stepNum >= 1 && thermalStep < 1) {
    // Show the mercury bulb
    const bulb = document.querySelector('.mercury-bulb');
    if (bulb) bulb.setAttribute('opacity', '1');
    thermalStep = 1;
  }

  if (stepNum >= 2 && thermalStep < 2) {
    // Fill the mercury to the top (hot!)
    const fill = document.querySelector('.mercury-fill');
    if (fill) {
      fill.setAttribute('height', '145');
      fill.setAttribute('y', '10');
    }
    // Show the reading
    const reading = document.getElementById('thermoReading');
    if (reading) reading.classList.add('visible');
    thermalStep = 2;
  }
}
