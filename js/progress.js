/**
 * progress.js — Calculate completion % per [data-section] and render progress bars
 */
const Progress = (() => {
  function update() {
    const sections = document.querySelectorAll('[data-section]');
    const sectionStats = {};

    sections.forEach(section => {
      const name = section.getAttribute('data-section');
      const fields = section.querySelectorAll('[data-field]');
      let filled = 0;
      let total = fields.length;

      fields.forEach(f => {
        if (f.type === 'checkbox') {
          if (f.checked) filled++;
        } else {
          if (f.value && f.value.trim() !== '') filled++;
        }
      });

      const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
      sectionStats[name] = { filled, total, pct };

      // Update section-level progress bar
      const bar = section.querySelector('.section-progress-fill');
      const text = section.querySelector('.section-progress-text');
      if (bar) bar.style.width = pct + '%';
      if (text) {
        const pctSpan = text.querySelector('.pct');
        const countSpan = text.querySelector('.count');
        if (pctSpan) pctSpan.textContent = pct + '%';
        if (countSpan) countSpan.textContent = filled + '/' + total;
      }
    });

    // Update overall progress
    _updateOverall(sectionStats);

    // Update sidebar progress indicators
    _updateSidebar(sectionStats);

    return sectionStats;
  }

  function _updateOverall(stats) {
    let totalFilled = 0, totalFields = 0;
    for (const s in stats) {
      totalFilled += stats[s].filled;
      totalFields += stats[s].total;
    }
    const pct = totalFields > 0 ? Math.round((totalFilled / totalFields) * 100) : 0;

    const bar = document.querySelector('.overall-progress-fill');
    const text = document.querySelector('.overall-progress-text');
    if (bar) bar.style.width = pct + '%';
    if (text) {
      const pctSpan = text.querySelector('.pct');
      const countSpan = text.querySelector('.count');
      if (pctSpan) pctSpan.textContent = pct + '%';
      if (countSpan) countSpan.textContent = totalFilled + '/' + totalFields;
    }
  }

  function _updateSidebar(stats) {
    for (const name in stats) {
      const link = document.querySelector(`.plan-sidebar a[data-section-link="${name}"]`);
      if (!link) continue;
      const fill = link.querySelector('.sidebar-progress-fill');
      if (fill) fill.style.width = stats[name].pct + '%';
    }
  }

  // Get stats for dashboard
  function getStats() {
    const data = Store.getAll();
    const stats = {};

    function countObj(obj) {
      let filled = 0, total = 0;
      if (!obj || typeof obj !== 'object') return { filled: 0, total: 0 };
      for (const key in obj) {
        const val = obj[key];
        if (val && typeof val === 'object' && !Array.isArray(val)) {
          const sub = countObj(val);
          filled += sub.filled;
          total += sub.total;
        } else {
          total++;
          if (val !== '' && val !== null && val !== undefined && val !== false) filled++;
        }
      }
      return { filled, total };
    }

    const sections = ['plan', 'checklist', 'templates', 'financials', 'calendar', 'deepDive'];
    sections.forEach(s => {
      stats[s] = countObj(data[s]);
      stats[s].pct = stats[s].total > 0 ? Math.round((stats[s].filled / stats[s].total) * 100) : 0;
    });

    return stats;
  }

  return { update, getStats };
})();

document.addEventListener('DOMContentLoaded', () => {
  // Delay to let autosave load first
  setTimeout(() => Progress.update(), 100);
});
