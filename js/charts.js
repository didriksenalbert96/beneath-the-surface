/* ============================================
   CHARTS.JS — All supporting visualizations
   ============================================ */

/**
 * Initialize all chart elements on page load.
 * This creates the DOM elements but doesn't animate them yet.
 */
function initCharts() {
  buildMortalityChart();
  buildGlobalChart();
  buildWildVsFarmed();
  buildStageFlow();
  buildDotMap();
  buildCleanerGrid();
  buildThermometer();
  buildTrendChart();
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
    const bulb = document.querySelector('.mercury-bulb');
    if (bulb) bulb.setAttribute('opacity', '1');
    thermalStep = 1;
  }

  if (stepNum >= 2 && thermalStep < 2) {
    const fill = document.querySelector('.mercury-fill');
    if (fill) {
      fill.setAttribute('height', '145');
      fill.setAttribute('y', '10');
    }
    const reading = document.getElementById('thermoReading');
    if (reading) reading.classList.add('visible');
    thermalStep = 2;
  }
}


/* ============================================
   RELATABLE COMPARISONS (NEW B)
   ============================================ */
const comparisons = [
  { number: '', text: '' }, // step 1 is intro, no visual
  { number: '165×', text: "Norway's human population (5.5 million)" },
  { number: '200M', text: 'deaths per year — the population of Brazil' },
  { number: '28 years', text: 'to count them all, one per second' },
];

let comparisonStep = 0;

function updateComparisons(stepNum) {
  if (stepNum <= comparisonStep) return;
  comparisonStep = stepNum;

  const numEl = document.getElementById('comparisonNumber');
  const textEl = document.getElementById('comparisonText');
  const iconsEl = document.getElementById('comparisonIcons');
  if (!numEl || !textEl) return;

  const data = comparisons[stepNum - 1];
  if (!data || !data.number) {
    numEl.classList.remove('visible');
    textEl.classList.remove('visible');
    if (iconsEl) iconsEl.classList.remove('visible');
    return;
  }

  // Fade out, update, fade in
  numEl.classList.remove('visible');
  textEl.classList.remove('visible');
  if (iconsEl) iconsEl.classList.remove('visible');

  setTimeout(() => {
    numEl.textContent = data.number;
    textEl.textContent = data.text;
    numEl.classList.add('visible');
    textEl.classList.add('visible');

    // Show icon grid on step 2 (165× comparison)
    if (iconsEl) {
      if (stepNum === 2) {
        buildComparisonIcons(iconsEl);
        iconsEl.classList.add('visible');
      } else {
        iconsEl.classList.remove('visible');
      }
    }
  }, 200);
}

function buildComparisonIcons(container) {
  if (container.children.length > 0) return; // already built
  // 1 person icon + 165 salmon dots
  const person = document.createElement('span');
  person.className = 'icon-person';
  person.textContent = '🧑';
  container.appendChild(person);

  const equals = document.createElement('span');
  equals.className = 'icon-equals';
  equals.textContent = '=';
  container.appendChild(equals);

  const grid = document.createElement('div');
  grid.className = 'icon-salmon-grid';
  for (let i = 0; i < 165; i++) {
    const dot = document.createElement('div');
    dot.className = 'icon-salmon-dot';
    grid.appendChild(dot);
  }
  container.appendChild(grid);
}


/* ============================================
   GLOBAL PRODUCTION SHARES (NEW C)
   ============================================ */
const globalData = [
  { label: 'Norway',     value: 53, color: 'var(--color-salmon)' },
  { label: 'Chile',      value: 25, color: '#5ba3d9' },
  { label: 'UK',         value: 8,  color: '#7ec8a0' },
  { label: 'Canada',     value: 6,  color: '#b0a0d8' },
  { label: 'Others',     value: 8,  color: 'var(--color-safe)' },
];

let globalRevealed = 0;

function buildGlobalChart() {
  const chart = document.getElementById('globalChart');
  if (!chart) return;

  globalData.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'bar-row';

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

function updateGlobal(stepNum) {
  const fills = document.querySelectorAll('#globalChart .bar-fill');

  if (stepNum >= 1 && globalRevealed < 1) {
    // Show Norway bar first
    animateBarDirect(fills[0], 53);
    globalRevealed = 1;
  }
  if (stepNum >= 2 && globalRevealed < 2) {
    // Show all bars
    for (let i = 1; i < fills.length; i++) {
      setTimeout(() => {
        const target = parseFloat(fills[i].getAttribute('data-target'));
        animateBarDirect(fills[i], target);
      }, (i - 1) * 150);
    }
    globalRevealed = 2;
  }
}

function animateBarDirect(barFill, value) {
  if (!barFill) return;
  barFill.style.width = value + '%';
}


/* ============================================
   WILD VS FARMED CIRCLES (NEW D)
   ============================================ */
let wildStep = 0;

function buildWildVsFarmed() {
  const container = document.getElementById('circleComparison');
  if (!container) return;

  container.innerHTML = `
    <div class="circle-item">
      <div class="circle-big" id="farmedCircle">
        <span class="circle-big-label">884M</span>
        <span class="circle-big-sub">farmed salmon</span>
      </div>
    </div>
    <div class="circle-item">
      <div class="circle-small" id="wildCircle"></div>
      <span class="circle-label">~400K<br>wild salmon</span>
    </div>
    <div class="circle-ratio" id="circleRatio">2,200 : 1</div>
  `;
}

function updateWild(stepNum) {
  if (stepNum <= wildStep) return;
  wildStep = stepNum;

  const farmed = document.getElementById('farmedCircle');
  const wild = document.getElementById('wildCircle');
  const ratio = document.getElementById('circleRatio');

  if (stepNum >= 2) {
    if (farmed) farmed.classList.add('visible');
    if (wild) wild.classList.add('visible');
  }
  if (stepNum >= 3) {
    if (ratio) ratio.classList.add('visible');
  }
}


/* ============================================
   HISTORICAL TRENDS CHART (NEW E)
   ============================================ */
const trendData = [
  { year: 2010, swDead: 36576, wildPFA: 530 },
  { year: 2011, swDead: 37312, wildPFA: 500 },
  { year: 2012, swDead: 29664, wildPFA: 520 },
  { year: 2013, swDead: 30119, wildPFA: 500 },
  { year: 2014, swDead: 39277, wildPFA: 480 },
  { year: 2015, swDead: 43533, wildPFA: 470 },
  { year: 2016, swDead: 46184, wildPFA: 440 },
  { year: 2017, swDead: 49480, wildPFA: 420 },
  { year: 2018, swDead: 47685, wildPFA: 410 },
  { year: 2019, swDead: 55045, wildPFA: 420 },
  { year: 2020, swDead: 50508, wildPFA: 553 },
  { year: 2021, swDead: 49101, wildPFA: 450 },
  { year: 2022, swDead: 49827, wildPFA: 400 },
  { year: 2023, swDead: 60467, wildPFA: 400 },
  { year: 2024, swDead: 56536, wildPFA: 323 },
];

// swDead = seawater deaths in thousands (e.g. 36576 = 36.6 million)
// wildPFA = wild salmon pre-fishery abundance in thousands (e.g. 530 = 530 thousand)
// Chart: Left Y-axis = seawater deaths in millions (0–80M), Right Y-axis = wild salmon (0–600K)

let trendStep = 0;

/**
 * Helper: builds a single-line SVG chart.
 * Returns an SVG string.
 */
function buildSimpleLineChart(opts) {
  const W = 600, H = 200;
  const pad = { top: 20, right: 15, bottom: 35, left: 50 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  function xPos(i) {
    return pad.left + (i / (opts.data.length - 1)) * plotW;
  }
  function yPos(val) {
    return pad.top + plotH - (val / opts.yMax) * plotH;
  }

  // Polyline points
  const points = opts.data.map((d, i) => `${xPos(i)},${yPos(d.value)}`).join(' ');

  // Year labels (every 2 years + 2023)
  let yearLabels = '';
  opts.data.forEach((d, i) => {
    if (d.year % 2 === 0 || d.year === 2023) {
      yearLabels += `<text x="${xPos(i)}" y="${H - 5}" text-anchor="middle" class="trend-axis-label">${d.year}</text>`;
    }
  });

  // Y-axis tick labels
  let yLabels = '';
  let gridLines = '';
  opts.yTicks.forEach(val => {
    const y = yPos(val);
    yLabels += `<text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" class="trend-axis-label">${opts.yFormat(val)}</text>`;
    if (val > 0) {
      gridLines += `<line x1="${pad.left}" y1="${y}" x2="${W - pad.right}" y2="${y}" class="trend-grid-line" />`;
    }
  });

  // Data dots
  let dots = '';
  opts.data.forEach((d, i) => {
    const highlight = opts.highlightYear && d.year === opts.highlightYear;
    dots += `<circle cx="${xPos(i)}" cy="${yPos(d.value)}" r="${highlight ? 5 : 3}" class="trend-dot ${opts.dotClass}${highlight ? ' trend-dot-spike' : ''}" />`;
  });

  // Annotation (optional)
  let annotation = '';
  if (opts.annotation) {
    const aIdx = opts.data.findIndex(d => d.year === opts.annotation.year);
    if (aIdx >= 0) {
      const ax = xPos(aIdx);
      const ay = yPos(opts.data[aIdx].value);
      annotation = `
        <g class="trend-annotation" id="${opts.annotation.id}">
          <line x1="${ax}" y1="${ay - 10}" x2="${ax}" y2="${ay - 32}" stroke="var(--color-danger)" stroke-width="1" stroke-dasharray="3,2" />
          <rect x="${ax - 45}" y="${ay - 48}" width="90" height="16" rx="4" fill="var(--color-danger)" />
          <text x="${ax}" y="${ay - 37}" text-anchor="middle" fill="#fff" font-size="9" font-weight="bold">${opts.annotation.label}</text>
        </g>`;
    }
  }

  return `
    <div class="trend-chart-label">${opts.title}</div>
    <svg class="trend-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
      ${gridLines}
      <line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${pad.top + plotH}" class="trend-axis" />
      <line x1="${pad.left}" y1="${pad.top + plotH}" x2="${W - pad.right}" y2="${pad.top + plotH}" class="trend-axis" />
      ${yearLabels}
      ${yLabels}
      <polyline points="${points}" class="trend-line ${opts.lineClass}" id="${opts.lineId}" />
      ${dots}
      ${annotation}
    </svg>`;
}

function buildTrendChart() {
  const container = document.getElementById('trendChart');
  if (!container) return;
  container.innerHTML = '';

  // Chart 1: Seawater deaths
  const deathsChart = buildSimpleLineChart({
    title: 'Salmon dying in sea pens (millions)',
    data: trendData.map(d => ({ year: d.year, value: d.swDead })),
    yMax: 80000,
    yTicks: [0, 20000, 40000, 60000, 80000],
    yFormat: v => v === 0 ? '0' : (v / 1000) + 'M',
    lineClass: 'trend-line-loss',
    lineId: 'trendLineLoss',
    dotClass: 'trend-dot-loss',
    highlightYear: 2023,
    annotation: { year: 2023, label: '60M — record', id: 'trendAnnotation' },
  });

  // Chart 2: Wild salmon returning
  const wildChart = buildSimpleLineChart({
    title: 'Wild salmon returning to rivers (thousands)',
    data: trendData.map(d => ({ year: d.year, value: d.wildPFA })),
    yMax: 600,
    yTicks: [0, 200, 400, 600],
    yFormat: v => v === 0 ? '0' : v + 'K',
    lineClass: 'trend-line-wild',
    lineId: 'trendLineWild',
    dotClass: 'trend-dot-wild',
    highlightYear: null,
    annotation: null,
  });

  container.innerHTML = deathsChart + wildChart;

  // Set up line draw animations
  requestAnimationFrame(() => {
    ['trendLineLoss', 'trendLineWild'].forEach(id => {
      const line = document.getElementById(id);
      if (line) {
        const len = line.getTotalLength();
        line.style.strokeDasharray = len;
        line.style.strokeDashoffset = len;
      }
    });
  });
}


/**
 * Called by main.js on step enter for the trends section.
 */
function updateTrends(stepNum) {
  if (stepNum <= trendStep) return;
  trendStep = stepNum;

  if (stepNum >= 1) {
    // Draw the deaths line
    const lossLine = document.getElementById('trendLineLoss');
    if (lossLine) lossLine.classList.add('drawn');
    document.querySelectorAll('.trend-dot-loss').forEach((dot, i) => {
      setTimeout(() => dot.classList.add('visible'), i * 60);
    });
  }

  if (stepNum >= 2) {
    // Draw the wild salmon line
    const wildLine = document.getElementById('trendLineWild');
    if (wildLine) wildLine.classList.add('drawn');
    document.querySelectorAll('.trend-dot-wild').forEach((dot, i) => {
      setTimeout(() => dot.classList.add('visible'), i * 60);
    });
  }

  if (stepNum >= 3) {
    // Show the 2023 annotation + pulse
    const annotation = document.getElementById('trendAnnotation');
    if (annotation) annotation.classList.add('visible');
    document.querySelectorAll('.trend-dot-spike').forEach(dot => {
      dot.classList.add('pulse');
    });
  }
}
