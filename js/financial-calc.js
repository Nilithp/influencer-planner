/**
 * financial-calc.js — Auto-calculate totals for the 36-month financial projections table
 */
const FinancialCalc = (() => {
  const PHASES = [
    { name: 'Foundation', months: [1, 2, 3], css: 'phase-foundation' },
    { name: 'Traction', months: [4, 5, 6, 7, 8], css: 'phase-traction' },
    { name: 'Acceleration', months: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18], css: 'phase-acceleration' },
    { name: 'Scale', months: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36], css: 'phase-scale' }
  ];

  const REVENUE_FIELDS = [
    'subRevenue', 'bitsRevenue', 'donations', 'twitchAds',
    'youtubeAdsense', 'sponsorships', 'merchandise', 'affiliate', 'otherRevenue'
  ];

  const EXPENSE_FIELDS = [
    'hardwareCosts', 'softwareCosts', 'legalAdmin',
    'contractorCosts', 'marketingCosts', 'otherExpenses'
  ];

  const METRIC_FIELDS = ['avgViewers', 'totalFollowers', 'totalSubscribers'];

  const ALL_NUMERIC_FIELDS = [
    ...METRIC_FIELDS, ...REVENUE_FIELDS, 'totalRevenue',
    ...EXPENSE_FIELDS, 'totalExpenses', 'netProfit', 'cumulativeProfit'
  ];

  function getPhase(month) {
    for (const p of PHASES) {
      if (p.months.includes(month)) return p;
    }
    return PHASES[0];
  }

  function buildTable() {
    const tbody = document.getElementById('financialBody');
    if (!tbody) return;

    let html = '';
    for (let m = 1; m <= 36; m++) {
      const phase = getPhase(m);
      const prefix = `financials.months.${m}`;

      html += `<tr class="${phase.css}" data-month="${m}">`;
      html += `<td class="month-cell">${m}</td>`;
      html += `<td class="phase-cell">${phase.name}</td>`;

      // Metric fields (editable)
      METRIC_FIELDS.forEach(f => {
        html += `<td><input type="number" data-field="${prefix}.${f}" data-month="${m}" data-category="metric" placeholder="0" min="0"></td>`;
      });

      // Revenue fields (editable)
      REVENUE_FIELDS.forEach(f => {
        html += `<td><input type="number" data-field="${prefix}.${f}" data-month="${m}" data-category="revenue" placeholder="0" step="0.01"></td>`;
      });

      // Total Revenue (read-only, calculated)
      html += `<td class="calc-cell" id="totalRevenue_${m}">$0</td>`;

      // Expense fields (editable)
      EXPENSE_FIELDS.forEach(f => {
        html += `<td><input type="number" data-field="${prefix}.${f}" data-month="${m}" data-category="expense" placeholder="0" step="0.01"></td>`;
      });

      // Total Expenses (read-only, calculated)
      html += `<td class="calc-cell" id="totalExpenses_${m}">$0</td>`;

      // Net Profit (read-only, calculated)
      html += `<td class="calc-cell" id="netProfit_${m}">$0</td>`;

      // Cumulative Profit (read-only, calculated)
      html += `<td class="calc-cell" id="cumulativeProfit_${m}">$0</td>`;

      // Notes
      html += `<td><input type="text" data-field="${prefix}.notes" placeholder="..." class="notes-input"></td>`;

      html += `</tr>`;
    }
    tbody.innerHTML = html;
  }

  function getMonthValue(month, field) {
    const input = document.querySelector(`input[data-field="financials.months.${month}.${field}"]`);
    if (!input) return 0;
    return parseFloat(input.value) || 0;
  }

  function recalcMonth(month) {
    // Sum revenue
    let totalRevenue = 0;
    REVENUE_FIELDS.forEach(f => {
      totalRevenue += getMonthValue(month, f);
    });

    // Sum expenses
    let totalExpenses = 0;
    EXPENSE_FIELDS.forEach(f => {
      totalExpenses += getMonthValue(month, f);
    });

    const netProfit = totalRevenue - totalExpenses;

    // Update display cells
    const revCell = document.getElementById(`totalRevenue_${month}`);
    const expCell = document.getElementById(`totalExpenses_${month}`);
    const netCell = document.getElementById(`netProfit_${month}`);

    if (revCell) revCell.textContent = formatCurrency(totalRevenue);
    if (expCell) expCell.textContent = formatCurrency(totalExpenses);
    if (netCell) {
      netCell.textContent = formatCurrency(netProfit);
      netCell.className = 'calc-cell ' + (netProfit >= 0 ? 'highlight-cell' : 'danger-cell');
    }

    // Store calculated values
    Store.set(`financials.months.${month}.totalRevenue`, totalRevenue);
    Store.set(`financials.months.${month}.totalExpenses`, totalExpenses);
    Store.set(`financials.months.${month}.netProfit`, netProfit);

    return { totalRevenue, totalExpenses, netProfit };
  }

  function recalcAll() {
    let cumulative = 0;

    for (let m = 1; m <= 36; m++) {
      const result = recalcMonth(m);
      cumulative += result.netProfit;

      const cumCell = document.getElementById(`cumulativeProfit_${m}`);
      if (cumCell) {
        cumCell.textContent = formatCurrency(cumulative);
        cumCell.className = 'calc-cell ' + (cumulative >= 0 ? 'highlight-cell' : 'danger-cell');
      }

      Store.set(`financials.months.${m}.cumulativeProfit`, cumulative);
    }

    updateAnnualSummary();
  }

  function updateAnnualSummary() {
    const years = [
      { label: 'y1', start: 1, end: 12 },
      { label: 'y2', start: 13, end: 24 },
      { label: 'y3', start: 25, end: 36 }
    ];

    years.forEach(year => {
      let revenue = 0, expenses = 0, profit = 0;

      for (let m = year.start; m <= year.end; m++) {
        const rev = Store.get(`financials.months.${m}.totalRevenue`) || 0;
        const exp = Store.get(`financials.months.${m}.totalExpenses`) || 0;
        const net = Store.get(`financials.months.${m}.netProfit`) || 0;
        revenue += rev;
        expenses += exp;
        profit += net;
      }

      const months = year.end - year.start + 1;
      const avgRevenue = revenue / months;

      const revEl = document.getElementById(`${year.label}Revenue`);
      const expEl = document.getElementById(`${year.label}Expenses`);
      const profEl = document.getElementById(`${year.label}Profit`);
      const avgEl = document.getElementById(`${year.label}AvgRevenue`);

      if (revEl) revEl.textContent = formatCurrency(revenue);
      if (expEl) expEl.textContent = formatCurrency(expenses);
      if (profEl) {
        profEl.textContent = formatCurrency(profit);
        profEl.style.color = profit >= 0 ? 'var(--green)' : 'var(--red)';
      }
      if (avgEl) avgEl.textContent = formatCurrency(avgRevenue);
    });
  }

  function formatCurrency(val) {
    if (val === 0) return '$0';
    const abs = Math.abs(val);
    const formatted = abs >= 1000
      ? '$' + abs.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
      : '$' + abs.toFixed(2);
    return val < 0 ? '-' + formatted : formatted;
  }

  function bindEvents() {
    const tbody = document.getElementById('financialBody');
    if (!tbody) return;

    // Use event delegation on the table body
    tbody.addEventListener('input', (e) => {
      const input = e.target;
      if (input.tagName !== 'INPUT') return;

      const month = parseInt(input.getAttribute('data-month'));
      if (!month) return;

      // Save the field value
      const field = input.getAttribute('data-field');
      if (field) {
        const val = input.type === 'number' ? (input.value === '' ? '' : parseFloat(input.value)) : input.value;
        Store.set(field, val);
      }

      // Recalculate all (for cumulative)
      recalcAll();

      // Flash save indicator
      const indicator = document.querySelector('.save-indicator');
      if (indicator) {
        indicator.textContent = 'Saved';
        indicator.classList.add('visible');
        clearTimeout(indicator._timer);
        indicator._timer = setTimeout(() => indicator.classList.remove('visible'), 1500);
      }
    });
  }

  function loadFromStore() {
    // Load saved values into inputs
    for (let m = 1; m <= 36; m++) {
      const prefix = `financials.months.${m}`;
      const allFields = [...METRIC_FIELDS, ...REVENUE_FIELDS, ...EXPENSE_FIELDS, 'notes'];
      allFields.forEach(f => {
        const val = Store.get(`${prefix}.${f}`);
        if (val == null) return;
        const input = document.querySelector(`input[data-field="${prefix}.${f}"]`);
        if (input) input.value = val;
      });
    }
  }

  function init() {
    buildTable();
    loadFromStore();
    bindEvents();
    recalcAll();
  }

  return { init, recalcAll };
})();

document.addEventListener('DOMContentLoaded', () => {
  FinancialCalc.init();
});
