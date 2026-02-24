/**
 * pdf.js — html2pdf.js wrapper for PDF generation
 */
const PDFExport = (() => {
  function generate(elementId, filename) {
    const el = document.getElementById(elementId);
    if (!el) { console.error('PDFExport: element not found:', elementId); return; }

    // Add pdf-mode class for clean styling
    document.body.classList.add('pdf-mode');
    el.classList.add('pdf-mode');

    const opt = {
      margin: [10, 10, 10, 10],
      filename: filename || 'influencer-plan.pdf',
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Check if html2pdf is loaded
    if (typeof html2pdf === 'undefined') {
      alert('PDF library is loading. Please try again in a moment.');
      document.body.classList.remove('pdf-mode');
      el.classList.remove('pdf-mode');
      return;
    }

    html2pdf().set(opt).from(el).save().then(() => {
      document.body.classList.remove('pdf-mode');
      el.classList.remove('pdf-mode');
    }).catch(err => {
      console.error('PDF generation failed:', err);
      document.body.classList.remove('pdf-mode');
      el.classList.remove('pdf-mode');
      alert('PDF generation failed. Please try again.');
    });
  }

  return { generate };
})();
