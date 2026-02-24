/**
 * calendar.js — Weekly content calendar with navigation, auto-duration, and weekly totals
 */
const Calendar = (() => {
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const DAY_CSS = ['day-mon', 'day-tue', 'day-wed', 'day-thu', 'day-fri', 'day-sat', 'day-sun'];
  const ROWS_PER_DAY = 2;

  const ACTIVITY_TYPES = [
    '',
    'Stream - Main Content',
    'Stream - Just Chatting',
    'Stream - Collab',
    'Stream - Special Event',
    'Content Creation - Video Editing',
    'Content Creation - Thumbnails',
    'Content Creation - Shorts/Clips',
    'Social Media - Posting',
    'Social Media - Engagement',
    'Community - Discord',
    'Community - Game Night',
    'Business - Analytics Review',
    'Business - Sponsor Outreach',
    'Business - Admin/Finance',
    'Personal - Rest Day',
    'Personal - Skill Development'
  ];

  const PLATFORMS = ['', 'Twitch', 'YouTube', 'X/Twitter', 'Facebook', 'Tumblr', 'Discord', 'Multiple', 'N/A'];
  const STATUSES = ['Not Started', 'In Progress', 'Done'];

  // Category mapping for totals
  const CATEGORY_MAP = {
    'Stream': 'streaming',
    'Content Creation': 'content',
    'Social Media': 'content',
    'Community': 'community',
    'Business': 'business',
    'Personal': 'rest'
  };

  let currentMonday = null;

  function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function formatISODate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function formatDisplayDate(date) {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  function getWeekKey() {
    return formatISODate(currentMonday);
  }

  function getDayDate(dayIndex) {
    const d = new Date(currentMonday);
    d.setDate(d.getDate() + dayIndex);
    return d;
  }

  function buildSelectOptions(options, selected) {
    return options.map(opt => {
      const sel = opt === selected ? ' selected' : '';
      const label = opt === '' ? '-- Select --' : opt;
      return `<option value="${opt}"${sel}>${label}</option>`;
    }).join('');
  }

  function buildTable() {
    const tbody = document.getElementById('calendarBody');
    if (!tbody) return;

    const weekKey = getWeekKey();
    let html = '';

    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      const dayDate = getDayDate(dayIdx);
      const dayDateStr = formatISODate(dayDate);
      const shortDate = dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      for (let rowIdx = 0; rowIdx < ROWS_PER_DAY; rowIdx++) {
        const rowKey = `${dayIdx}_${rowIdx}`;
        const prefix = `calendar.${weekKey}.rows.${rowKey}`;
        const isSecond = rowIdx > 0;
        const rowClass = `${DAY_CSS[dayIdx]}${isSecond ? ' row-second' : ''}`;

        html += `<tr class="${rowClass}" data-day="${dayIdx}" data-row="${rowIdx}">`;

        // Day cell - only show label on first row, use rowspan
        if (rowIdx === 0) {
          html += `<td class="day-cell" rowspan="${ROWS_PER_DAY}">
            <span class="day-name">${DAYS[dayIdx]}</span>
            <span class="day-date">${shortDate}</span>
          </td>`;
        }

        // Time Start
        html += `<td><input type="time" data-field="${prefix}.timeStart" data-calc="time"></td>`;

        // Time End
        html += `<td><input type="time" data-field="${prefix}.timeEnd" data-calc="time"></td>`;

        // Activity Type
        html += `<td><select data-field="${prefix}.activityType">${buildSelectOptions(ACTIVITY_TYPES, '')}</select></td>`;

        // Description
        html += `<td><input type="text" data-field="${prefix}.description" placeholder="What are you doing?"></td>`;

        // Platform
        html += `<td><select data-field="${prefix}.platform">${buildSelectOptions(PLATFORMS, '')}</select></td>`;

        // Content Pillar
        html += `<td><input type="text" data-field="${prefix}.contentPillar" placeholder="Pillar"></td>`;

        // Duration (auto-calculated, read-only display)
        html += `<td class="duration-cell" id="duration_${dayIdx}_${rowIdx}">0</td>`;

        // Status
        html += `<td><select data-field="${prefix}.status">${buildSelectOptions(STATUSES, 'Not Started')}</select></td>`;

        // Notes
        html += `<td><input type="text" data-field="${prefix}.notes" placeholder="..."></td>`;

        html += `</tr>`;
      }
    }

    tbody.innerHTML = html;
  }

  function loadFromStore() {
    const weekKey = getWeekKey();

    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      for (let rowIdx = 0; rowIdx < ROWS_PER_DAY; rowIdx++) {
        const rowKey = `${dayIdx}_${rowIdx}`;
        const prefix = `calendar.${weekKey}.rows.${rowKey}`;
        const fields = ['timeStart', 'timeEnd', 'activityType', 'description', 'platform', 'contentPillar', 'status', 'notes'];

        fields.forEach(f => {
          const val = Store.get(`${prefix}.${f}`);
          if (val == null) return;
          const el = document.querySelector(`[data-field="${prefix}.${f}"]`);
          if (el) el.value = val;
        });
      }
    }
  }

  function calcDuration(timeStart, timeEnd) {
    if (!timeStart || !timeEnd) return 0;
    const [sh, sm] = timeStart.split(':').map(Number);
    const [eh, em] = timeEnd.split(':').map(Number);
    let startMin = sh * 60 + sm;
    let endMin = eh * 60 + em;
    // Handle overnight (e.g., 22:00 to 02:00)
    if (endMin <= startMin) endMin += 24 * 60;
    const diff = (endMin - startMin) / 60;
    return Math.round(diff * 100) / 100;
  }

  function recalcDurations() {
    const weekKey = getWeekKey();
    const categoryTotals = {
      streaming: 0,
      content: 0,
      community: 0,
      business: 0,
      rest: 0
    };

    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      for (let rowIdx = 0; rowIdx < ROWS_PER_DAY; rowIdx++) {
        const rowKey = `${dayIdx}_${rowIdx}`;
        const prefix = `calendar.${weekKey}.rows.${rowKey}`;

        const startEl = document.querySelector(`[data-field="${prefix}.timeStart"]`);
        const endEl = document.querySelector(`[data-field="${prefix}.timeEnd"]`);
        const activityEl = document.querySelector(`[data-field="${prefix}.activityType"]`);
        const durationCell = document.getElementById(`duration_${dayIdx}_${rowIdx}`);

        const start = startEl ? startEl.value : '';
        const end = endEl ? endEl.value : '';
        const duration = calcDuration(start, end);

        if (durationCell) {
          durationCell.textContent = duration > 0 ? duration.toFixed(1) : '0';
        }

        // Store duration
        Store.set(`${prefix}.duration`, duration);

        // Categorize for totals
        const activity = activityEl ? activityEl.value : '';
        if (activity && duration > 0) {
          const categoryPrefix = activity.split(' - ')[0];
          const category = CATEGORY_MAP[categoryPrefix];
          if (category) {
            categoryTotals[category] += duration;
          }
        }
      }
    }

    // Update total displays
    const grandTotal = categoryTotals.streaming + categoryTotals.content +
      categoryTotals.community + categoryTotals.business + categoryTotals.rest;

    document.getElementById('totalStreaming').textContent = categoryTotals.streaming.toFixed(1);
    document.getElementById('totalContent').textContent = categoryTotals.content.toFixed(1);
    document.getElementById('totalCommunity').textContent = categoryTotals.community.toFixed(1);
    document.getElementById('totalBusiness').textContent = categoryTotals.business.toFixed(1);
    document.getElementById('totalRest').textContent = categoryTotals.rest.toFixed(1);
    document.getElementById('totalGrand').textContent = grandTotal.toFixed(1);

    // Overwork warning
    const warning = document.getElementById('overworkWarning');
    if (warning) {
      warning.classList.toggle('visible', grandTotal > 60);
    }

    // Color grand total
    const grandEl = document.getElementById('totalGrand');
    if (grandEl) {
      grandEl.style.color = grandTotal > 60 ? 'var(--red)' : '';
    }
  }

  function updateWeekDisplay() {
    const weekLabel = document.getElementById('weekLabel');
    const weekDate = document.getElementById('weekDate');

    const endOfWeek = new Date(currentMonday);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    if (weekLabel) {
      weekLabel.textContent = `Week of ${formatDisplayDate(currentMonday)}`;
    }
    if (weekDate) {
      weekDate.textContent = `${formatISODate(currentMonday)} to ${formatISODate(endOfWeek)}`;
    }
  }

  function navigateWeek(direction) {
    // Save current data (already auto-saved via event handlers)
    // Move to new week
    currentMonday.setDate(currentMonday.getDate() + (direction * 7));
    renderWeek();
  }

  function renderWeek() {
    updateWeekDisplay();
    buildTable();
    loadFromStore();
    recalcDurations();
    bindTableEvents();
  }

  function bindTableEvents() {
    const tbody = document.getElementById('calendarBody');
    if (!tbody) return;

    tbody.addEventListener('input', (e) => {
      const el = e.target;
      if (!el.dataset.field) return;

      // Save value
      const val = el.value;
      Store.set(el.dataset.field, val);

      // Recalculate durations and totals
      recalcDurations();

      // Flash save indicator
      const indicator = document.querySelector('.save-indicator');
      if (indicator) {
        indicator.textContent = 'Saved';
        indicator.classList.add('visible');
        clearTimeout(indicator._timer);
        indicator._timer = setTimeout(() => indicator.classList.remove('visible'), 1500);
      }
    });

    tbody.addEventListener('change', (e) => {
      const el = e.target;
      if (!el.dataset.field) return;

      // Save value
      Store.set(el.dataset.field, el.value);

      // Recalculate
      recalcDurations();

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

  function init() {
    // Default to current week
    currentMonday = getMonday(new Date());
    renderWeek();

    // Navigation buttons
    const prevBtn = document.getElementById('prevWeek');
    const nextBtn = document.getElementById('nextWeek');

    if (prevBtn) prevBtn.addEventListener('click', () => navigateWeek(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigateWeek(1));
  }

  return { init, getMonday };
})();

document.addEventListener('DOMContentLoaded', () => {
  Calendar.init();
});
