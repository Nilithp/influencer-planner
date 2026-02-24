/**
 * store.js — localStorage abstraction for Influencer Planner
 * Single key 'influencerPlanner' stores all data as JSON.
 */
const Store = (() => {
  const KEY = 'influencerPlanner';

  function _read() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : _default();
    } catch (e) {
      console.warn('Store: failed to read localStorage', e);
      return _default();
    }
  }

  function _write(data) {
    data.lastModified = new Date().toISOString();
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Store: failed to write localStorage', e);
    }
  }

  function _default() {
    return { version: 1, lastModified: null, plan: {}, checklist: {}, templates: {}, financials: {}, calendar: {}, deepDive: {} };
  }

  // Get a nested value by dot path: "plan.section1.mission"
  function get(path) {
    const data = _read();
    if (!path) return data;
    const keys = path.split('.');
    let val = data;
    for (const k of keys) {
      if (val == null || typeof val !== 'object') return undefined;
      val = val[k];
    }
    return val;
  }

  // Set a nested value by dot path
  function set(path, value) {
    const data = _read();
    const keys = path.split('.');
    let obj = data;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (obj[k] == null || typeof obj[k] !== 'object') obj[k] = {};
      obj = obj[k];
    }
    obj[keys[keys.length - 1]] = value;
    _write(data);
  }

  function getAll() {
    return _read();
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  function exportData() {
    return JSON.stringify(_read(), null, 2);
  }

  function importData(json) {
    try {
      const data = typeof json === 'string' ? JSON.parse(json) : json;
      if (typeof data !== 'object' || data === null) throw new Error('Invalid data');
      _write(data);
      return true;
    } catch (e) {
      console.error('Store: import failed', e);
      return false;
    }
  }

  function getLastModified() {
    return _read().lastModified;
  }

  return { get, set, getAll, clear, exportData, importData, getLastModified };
})();
