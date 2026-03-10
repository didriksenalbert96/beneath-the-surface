/* ============================================
   MAIN.JS — Scrollama setup & orchestration
   ============================================ */

// Wait for the page to fully load before running any code
document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll Progress Bar ---
  const progressBar = document.getElementById('progressBar');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
  });

  // --- Start the live death counter in the hero ---
  startLiveDeathCounter();

  // --- Initialize all visualizations ---
  initIconGrid();       // icon-grid.js
  initCharts();         // charts.js
  initCounters();       // counter.js

  // --- Set up Scrollama for each section ---
  setupScrollSections();

  // --- Animate solution cards on scroll ---
  setupSolutionCards();

  // --- Animate timeline items on scroll ---
  setupTimeline();

  // --- Animate opinion number on scroll ---
  setupOpinionSection();
});


/**
 * Live death counter in the hero section.
 * 200 million deaths/year ÷ 365 ÷ 24 ÷ 60 ÷ 60 ≈ 6.34 per second
 */
function startLiveDeathCounter() {
  const el = document.getElementById('liveDeathCount');
  if (!el) return;

  const deathsPerSecond = 200000000 / 365 / 24 / 60 / 60; // ~6.34
  let elapsed = 0;

  setInterval(() => {
    elapsed++;
    const count = Math.round(deathsPerSecond * elapsed);
    el.textContent = count.toLocaleString();
  }, 1000);
}


/**
 * Sets up scrollama instances for each scroll-section.
 */
function setupScrollSections() {
  const sections = document.querySelectorAll('.scroll-section');

  sections.forEach(section => {
    const steps = section.querySelectorAll('.step');
    const sectionId = section.id;

    const scroller = scrollama();

    scroller
      .setup({
        step: steps,
        offset: 0.5,
        progress: false,
      })
      .onStepEnter(response => {
        steps.forEach(s => s.classList.remove('is-active'));
        response.element.classList.add('is-active');

        const stepNum = parseInt(response.element.getAttribute('data-step'));
        updateVisual(sectionId, stepNum, response.direction);
      });
  });
}


/**
 * Routes visual updates to the correct handler.
 */
function updateVisual(sectionId, stepNum, direction) {
  switch (sectionId) {
    case 'section-livestock':
      updateLivestock(stepNum);
      break;
    case 'section-comparisons':
      updateComparisons(stepNum);
      break;
    case 'section-global':
      updateGlobal(stepNum);
      break;
    case 'section-wild':
      updateWild(stepNum);
      break;
    case 'section-deaths':
      updateIconGrid(stepNum);
      break;
    case 'section-trends':
      updateTrends(stepNum);
      break;
    case 'section-mortality':
      updateMortality(stepNum);
      break;
    case 'section-stages':
      updateStages(stepNum);
      break;
    case 'section-disease':
      updateDisease(stepNum);
      break;
    case 'section-cleaner':
      updateCleaner(stepNum);
      break;
    case 'section-thermal':
      updateThermal(stepNum);
      break;
  }
}


/**
 * Animate solution cards into view as user scrolls to them.
 */
function setupSolutionCards() {
  const cards = document.querySelectorAll('.solution-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(cards).indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 150);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => observer.observe(card));
}


/**
 * Animate timeline items into view with staggered delays.
 */
function setupTimeline() {
  const items = document.querySelectorAll('.timeline-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(items).indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  items.forEach(item => observer.observe(item));
}


/**
 * Animate the opinion "37%" number when it scrolls into view.
 */
function setupOpinionSection() {
  const opinionNum = document.getElementById('opinionNumber');
  if (!opinionNum) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        opinionNum.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(opinionNum);
}
