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

  // --- Initialize all visualizations ---
  // These functions are defined in their own JS files
  initIconGrid();       // icon-grid.js
  initCharts();         // charts.js
  initCounters();       // counter.js

  // --- Set up Scrollama for each section ---
  setupScrollSections();

  // --- Animate solution cards on scroll ---
  setupSolutionCards();
});


/**
 * Sets up scrollama instances for each scroll-section.
 * When a "step" scrolls into view, it becomes active (fully visible)
 * and triggers the corresponding visual update.
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
        offset: 0.5,    // trigger when step is halfway into viewport
        progress: false,
      })
      .onStepEnter(response => {
        // Mark this step as active (full opacity)
        steps.forEach(s => s.classList.remove('is-active'));
        response.element.classList.add('is-active');

        // Get the step number (1-based from data-step attribute)
        const stepNum = parseInt(response.element.getAttribute('data-step'));

        // Call the appropriate visual update for this section
        updateVisual(sectionId, stepNum, response.direction);
      });
  });

  // Handle window resize (scrollama needs to recalculate)
  window.addEventListener('resize', () => {
    // scrollama handles resize internally
  });
}


/**
 * Routes visual updates to the correct handler
 * based on which section and step the user has scrolled to.
 */
function updateVisual(sectionId, stepNum, direction) {
  switch (sectionId) {
    case 'section-livestock':
      updateLivestock(stepNum);
      break;
    case 'section-deaths':
      updateIconGrid(stepNum);
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
 * Animate solution cards into view as user scrolls to them
 */
function setupSolutionCards() {
  const cards = document.querySelectorAll('.solution-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add a staggered delay based on card index
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
