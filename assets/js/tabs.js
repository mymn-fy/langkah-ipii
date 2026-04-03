/* ============================================
   tabs.js — Logika Tab Switching 5 Jalur
   Langkah IPII
   ============================================ */

const TabManager = (() => {

  let activePath = 'all';
  let onChangeFn = null;

  /**
   * Init tab switching
   * @param {Function} onChange - callback ketika tab berubah (path)
   */
  function init(onChange) {
    onChangeFn = onChange;
    const tabsEl = document.getElementById('path-tabs');
    if (!tabsEl) return;

    // Delegasi event ke parent
    tabsEl.addEventListener('click', (e) => {
      const tab = e.target.closest('[data-path]');
      if (!tab) return;

      const newPath = tab.dataset.path;
      if (newPath === activePath) return;

      // Update active state
      tabsEl.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('tab--active');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('tab--active');
      tab.setAttribute('aria-selected', 'true');

      activePath = newPath;

      // Update path cards highlight
      updatePathCards(newPath);

      // Update URL hash (opsional, untuk deep linking)
      if (history.replaceState) {
        history.replaceState(null, '', newPath === 'all' ? '#' : `#${newPath}`);
      }

      // Trigger callback (filter roadmap)
      if (typeof onChangeFn === 'function') {
        onChangeFn(newPath);
      }
    });

    // Cek hash URL saat load
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const targetTab = tabsEl.querySelector(`[data-path="${hash}"]`);
      if (targetTab) {
        targetTab.click();
      }
    }
  }

  /**
   * Highlight path card yang sesuai dengan tab aktif
   * @param {string} path
   */
  function updatePathCards(path) {
    document.querySelectorAll('.path-card[data-path]').forEach(card => {
      const isActive = path === 'all' || card.dataset.path === path;
      card.style.opacity = isActive ? '1' : '0.45';
      card.style.transform = (path !== 'all' && card.dataset.path === path)
        ? 'translateY(-3px)'
        : '';
    });
  }

  function getActive() {
    return activePath;
  }

  return { init, getActive };

})();
