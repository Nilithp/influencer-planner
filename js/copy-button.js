/**
 * copy-button.js — Copy template text to clipboard with placeholder values filled in
 */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.template-card');
      if (!card) return;

      const templateText = card.querySelector('.template-text');
      if (!templateText) return;

      // Clone the template text element
      const clone = templateText.cloneNode(true);

      // Replace all input/textarea/select elements with their current values
      clone.querySelectorAll('input, textarea, select').forEach(el => {
        const original = templateText.querySelector(
          `[data-field="${el.getAttribute('data-field')}"]`
        );
        const value = original ? original.value : el.value;
        const textNode = document.createTextNode(value || el.placeholder || '___');
        el.replaceWith(textNode);
      });

      // Get the text content and copy to clipboard
      const text = clone.textContent;

      navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('btn-success');
        btn.classList.remove('btn-secondary');
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('btn-success');
          btn.classList.add('btn-secondary');
        }, 2000);
      }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('btn-success');
        btn.classList.remove('btn-secondary');
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('btn-success');
          btn.classList.add('btn-secondary');
        }, 2000);
      });
    });
  });
});
