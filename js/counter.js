/* ============================================
   COUNTER.JS — Animated number counters
   ============================================ */

let counterStarted = false;
let donutShown = false;

/**
 * Initialize counters (called on page load).
 * Sets up but doesn't start the animation.
 */
function initCounters() {
  // Counter starts when section scrolls into view (triggered by main.js)
}

/**
 * Called by main.js when the livestock section steps are entered.
 */
function updateLivestock(stepNum) {
  if (stepNum >= 1 && !counterStarted) {
    counterStarted = true;
    animateCounter('salmonCounter', 900000000);
  }

  if (stepNum >= 4 && !donutShown) {
    donutShown = true;
    showDonutChart();
  }
}


/**
 * Animates a number counting up from 0 to the target value.
 * Uses CountUp.js if available, otherwise falls back to a simple animation.
 */
function animateCounter(elementId, target) {
  const el = document.getElementById(elementId);
  if (!el) return;

  // Try using CountUp.js (loaded from CDN)
  if (typeof countUp !== 'undefined' && countUp.CountUp) {
    const counter = new countUp.CountUp(elementId, target, {
      duration: 2.5,
      separator: ',',
      useGrouping: true,
    });
    if (!counter.error) {
      counter.start();
    } else {
      // Fallback
      simpleCountUp(el, target);
    }
  } else {
    // Fallback if CountUp.js didn't load
    simpleCountUp(el, target);
  }
}


/**
 * Simple fallback counter animation (no dependency).
 */
function simpleCountUp(el, target) {
  const duration = 2500; // ms
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    current = Math.min(Math.round(increment * step), target);
    el.textContent = current.toLocaleString();

    if (step >= steps) {
      clearInterval(timer);
      el.textContent = target.toLocaleString();
    }
  }, duration / steps);
}


/**
 * Shows a donut chart representing 92.5% salmon share.
 * Built with a simple SVG circle using stroke-dasharray.
 */
function showDonutChart() {
  const container = document.getElementById('donutChart');
  if (!container) return;

  // Create the SVG donut
  const size = 250;
  const strokeWidth = 30;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const salmonPercent = 92.5;
  const salmonDash = (salmonPercent / 100) * circumference;
  const otherDash = circumference - salmonDash;

  container.innerHTML = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <!-- Background circle (other animals) -->
      <circle
        cx="${size / 2}" cy="${size / 2}" r="${radius}"
        fill="none"
        stroke="#e0e0e0"
        stroke-width="${strokeWidth}"
      />
      <!-- Salmon portion (animated) -->
      <circle
        class="donut-salmon"
        cx="${size / 2}" cy="${size / 2}" r="${radius}"
        fill="none"
        stroke="var(--color-salmon)"
        stroke-width="${strokeWidth}"
        stroke-dasharray="0 ${circumference}"
        stroke-linecap="round"
        transform="rotate(-90 ${size / 2} ${size / 2})"
        style="transition: stroke-dasharray 1.5s ease-out;"
      />
      <!-- Center text -->
      <text x="${size / 2}" y="${size / 2 - 10}" text-anchor="middle"
            font-family="var(--font-heading)" font-size="42" font-weight="900"
            fill="var(--color-salmon)">92.5%</text>
      <text x="${size / 2}" y="${size / 2 + 18}" text-anchor="middle"
            font-family="var(--font-body)" font-size="14"
            fill="var(--color-text-light)">are farmed salmon</text>
    </svg>
  `;

  // Trigger the animation after a brief delay
  container.classList.add('visible');
  setTimeout(() => {
    const salmonCircle = container.querySelector('.donut-salmon');
    if (salmonCircle) {
      salmonCircle.setAttribute('stroke-dasharray', `${salmonDash} ${otherDash}`);
    }
  }, 100);
}
