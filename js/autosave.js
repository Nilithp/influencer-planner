/**
 * autosave.js — Auto-save on all [data-field] elements
 * On page load: populate fields from Store.
 * On input: 300ms debounced save.
 */
const AutoSave = (() => {
  let _debounceTimers = {};
  let _saveIndicator = null;

  function init() {
    _saveIndicator = document.querySelector('.save-indicator');
    _loadAll();
    _bindAll();
  }

  function _loadAll() {
    document.querySelectorAll('[data-field]').forEach(el => {
      const path = el.getAttribute('data-field');
      const val = Store.get(path);
      if (val == null) return;

      if (el.type === 'checkbox') {
        el.checked = !!val;
        // Update parent styling
        const wrap = el.closest('.checkbox-wrap');
        if (wrap) wrap.classList.toggle('checked', el.checked);
      } else if (el.tagName === 'SELECT') {
        el.value = val;
      } else {
        el.value = val;
      }
    });
  }

  function _bindAll() {
    document.querySelectorAll('[data-field]').forEach(el => {
      const event = el.type === 'checkbox' ? 'change' : 'input';
      el.addEventListener(event, (e) => _onInput(e.target));
      // Also save on blur for immediate persistence
      if (el.type !== 'checkbox') {
        el.addEventListener('blur', (e) => _saveField(e.target));
      }
    });
  }

  function _onInput(el) {
    const path = el.getAttribute('data-field');
    clearTimeout(_debounceTimers[path]);
    _debounceTimers[path] = setTimeout(() => _saveField(el), 300);
  }

  function _saveField(el) {
    const path = el.getAttribute('data-field');
    let val;
    if (el.type === 'checkbox') {
      val = el.checked;
      const wrap = el.closest('.checkbox-wrap');
      if (wrap) wrap.classList.toggle('checked', el.checked);
    } else if (el.type === 'number') {
      val = el.value === '' ? '' : Number(el.value);
    } else {
      val = el.value;
    }
    Store.set(path, val);
    _flashSaved();

    // Trigger progress recalculation
    if (typeof Progress !== 'undefined') {
      Progress.update();
    }
  }

  function _flashSaved() {
    if (!_saveIndicator) return;
    _saveIndicator.textContent = 'Saved';
    _saveIndicator.classList.add('visible');
    clearTimeout(_saveIndicator._timer);
    _saveIndicator._timer = setTimeout(() => {
      _saveIndicator.classList.remove('visible');
    }, 1500);
  }

  // Reload all fields (e.g., after import)
  function reload() { _loadAll(); }

  return { init, reload };
})();

document.addEventListener('DOMContentLoaded', () => AutoSave.init());
