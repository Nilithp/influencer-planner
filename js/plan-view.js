/**
 * plan-view.js — Build consolidated plan from stored data
 */
const PlanView = (() => {
  const sectionNames = {
    'section1': 'Executive Summary & Vision',
    'section2': 'Target Audience Definition',
    'section3': 'Value Proposition & Content Strategy',
    'section4': 'Platform Strategy',
    'section5': 'Engagement Funnel & Stages',
    'section6': 'Tools & Tech Stack',
    'section7': 'Requirements',
    'section8': 'Monetization Strategy',
    'section9': 'Growth Roadmap',
    'section10': 'Engagement Plan',
    'section11': 'Buying Power Optimization',
    'section12': 'Metrics & Analytics Framework',
    'section13': 'Risk Assessment & Contingency',
    'section14': 'Solo Operations Blueprint',
    'appendixD': 'Content Idea Bank'
  };

  const fieldLabels = {
    mission: 'Mission Statement',
    vision: 'Vision Statement',
    uvp: 'Unique Value Proposition',
    combo1: 'Unique Combination 1',
    combo2: 'Unique Combination 2',
    combo3: 'Unique Combination 3',
    functionalJob: 'Functional Job',
    emotionalJob: 'Emotional Job',
    socialJob: 'Social Job',
    brandName: 'Brand Name',
    tagline: 'Tagline',
    legalEntity: 'Legal Entity Type',
    stateCountry: 'State/Country',
    targetRevenue: 'Target Annual Revenue',
    timelineMonths: 'Timeline (Months)',
    timelineYears: 'Timeline (Years)',
    elevatorPitch: 'Elevator Pitch',
  };

  function render() {
    const container = document.getElementById('plan-content');
    if (!container) return;

    const data = Store.getAll();
    let html = '';

    // Header
    html += '<div style="text-align:center;margin-bottom:2rem;">';
    html += '<h1 style="font-size:2rem;margin-bottom:0.5rem;">Solopreneur Influencer Business Plan</h1>';
    if (data.plan?.section1?.brandName) {
      html += '<h2 style="color:var(--purple-light);font-size:1.3rem;">' + _esc(data.plan.section1.brandName) + '</h2>';
    }
    html += '<p style="color:var(--text-muted);">Generated ' + new Date().toLocaleDateString() + '</p>';
    html += '</div>';

    // Business Plan Sections
    if (data.plan) {
      for (const sKey in sectionNames) {
        const sData = data.plan[sKey];
        if (!sData || !_hasContent(sData)) continue;

        const num = sKey.replace('section', '').replace('appendix', 'App ');
        html += '<div class="card-full" style="page-break-inside:avoid;">';
        html += '<h3>Section ' + num + ': ' + sectionNames[sKey] + '</h3>';
        html += _renderFields(sData, '');
        html += '</div>';
      }
    }

    // Checklist
    if (data.checklist && _hasContent(data.checklist)) {
      html += '<div class="card-full" style="page-break-inside:avoid;">';
      html += '<h3>30-Day Quick-Start Checklist</h3>';
      html += _renderChecklist(data.checklist);
      html += '</div>';
    }

    // Financials summary
    if (data.financials?.months && _hasContent(data.financials.months)) {
      html += '<div class="card-full" style="page-break-inside:avoid;">';
      html += '<h3>Financial Projections Summary</h3>';
      html += _renderFinancials(data.financials);
      html += '</div>';
    }

    // Deep Dive Targets
    if (data.deepDive?.targets && _hasContent(data.deepDive.targets)) {
      html += '<div class="card-full">';
      html += '<h3>Key Metric Targets</h3>';
      html += _renderFields(data.deepDive.targets, '');
      html += '</div>';
    }

    if (!html || html.indexOf('card-full') === -1) {
      html = '<div class="callout callout-info"><div class="callout-icon">&#x1f4dd;</div><div class="callout-text"><strong>No data yet</strong>Start filling in your Business Plan, Checklist, and other sections. Your consolidated plan will appear here automatically.</div></div>';
    }

    container.innerHTML = html;
  }

  function _renderFields(obj, prefix) {
    let html = '<div style="margin-left:0.5rem;">';
    for (const key in obj) {
      const val = obj[key];
      const label = fieldLabels[key] || _humanize(key);

      if (val === null || val === undefined || val === '') continue;

      if (typeof val === 'object' && !Array.isArray(val)) {
        if (_hasContent(val)) {
          html += '<div style="margin:0.75rem 0;"><strong style="color:var(--purple-light);font-size:0.85rem;">' + _esc(label) + '</strong>';
          html += _renderFields(val, prefix + key + '.');
          html += '</div>';
        }
      } else if (typeof val === 'boolean') {
        if (val) {
          html += '<div style="padding:0.15rem 0;font-size:0.85rem;color:var(--text-secondary);">';
          html += '<span style="color:var(--green);margin-right:0.5rem;">&#x2713;</span>' + _esc(label);
          html += '</div>';
        }
      } else if (Array.isArray(val)) {
        html += '<div style="margin:0.5rem 0;"><strong style="font-size:0.85rem;">' + _esc(label) + ':</strong> ';
        html += _esc(val.join(', '));
        html += '</div>';
      } else {
        html += '<div style="padding:0.2rem 0;font-size:0.85rem;">';
        html += '<span style="color:var(--text-muted);">' + _esc(label) + ':</span> ';
        html += '<span style="color:var(--text-primary);">' + _esc(String(val)) + '</span>';
        html += '</div>';
      }
    }
    html += '</div>';
    return html;
  }

  function _renderChecklist(data) {
    let html = '';
    const sections = { prereqs: 'Prerequisites', week1: 'Week 1', week2: 'Week 2', week3: 'Week 3', week4: 'Week 4' };
    for (const sKey in sections) {
      if (!data[sKey] || !_hasContent(data[sKey])) continue;
      html += '<div style="margin:0.75rem 0;"><strong style="color:var(--pink);">' + sections[sKey] + '</strong>';
      html += _renderFields(data[sKey], '');
      html += '</div>';
    }
    return html;
  }

  function _renderFinancials(data) {
    let html = '<div class="table-wrapper"><table><thead><tr><th>Month</th><th>Revenue</th><th>Expenses</th><th>Net Profit</th></tr></thead><tbody>';
    const months = data.months || {};
    for (let m = 1; m <= 36; m++) {
      const md = months[String(m)];
      if (!md || !_hasContent(md)) continue;
      const rev = md.totalRevenue || 0;
      const exp = md.totalExpenses || 0;
      const net = md.netProfit || (rev - exp);
      html += '<tr><td>' + m + '</td>';
      html += '<td>$' + _fmt(rev) + '</td>';
      html += '<td>$' + _fmt(exp) + '</td>';
      html += '<td class="' + (net >= 0 ? 'highlight-cell' : 'danger-cell') + '">$' + _fmt(net) + '</td>';
      html += '</tr>';
    }
    html += '</tbody></table></div>';
    return html;
  }

  function _hasContent(obj) {
    if (!obj || typeof obj !== 'object') return false;
    for (const k in obj) {
      const v = obj[k];
      if (v === true) return true;
      if (typeof v === 'string' && v.trim() !== '') return true;
      if (typeof v === 'number' && v !== 0) return true;
      if (typeof v === 'object' && _hasContent(v)) return true;
    }
    return false;
  }

  function _humanize(str) {
    return str.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).replace(/([0-9]+)/g, ' $1 ').trim();
  }

  function _esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function _fmt(n) {
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  return { render };
})();
