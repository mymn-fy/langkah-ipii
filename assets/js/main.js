/* ============================================
   main.js — Inisialisasi, Fetch Data & Sidebar
   ============================================ */

let currentPathData = null;

// Theme Toggle
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'light';

  html.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // Scroll to top button
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('scroll-top--visible');
      } else {
        scrollTopBtn.classList.remove('scroll-top--visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Sidebar management
  initSidebar();

  // Fetch Roadmap Data awal
  loadRoadmapForPath('all');

  // Init tab manager dengan callback untuk load path-specific JSON
  TabManager.init((path) => {
    loadRoadmapForPath(path);
  });

  // Init path card click
  document.querySelectorAll('.path-card[data-path]').forEach(card => {
    card.addEventListener('click', () => {
      const path = card.dataset.path;
      const tab = document.querySelector(`[data-path="${path}"]`);
      if (tab) {
        tab.click();
      }
    });
  });
});

/**
 * Load roadmap JSON sesuai path yang dipilih
 * @param {string} path
 */
function loadRoadmapForPath(path) {
  let jsonFile = 'assets/data/roadmap-core.json';

  // Map path ke filename
  if (path !== 'all') {
    jsonFile = `assets/data/roadmap-${path}.json`;
  }

  fetch(jsonFile)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Gagal memuat ${jsonFile}`);
      }
      return response.json();
    })
    .then(data => {
      currentPathData = data;
      RoadmapRenderer.render(data, path);
      attachNodeClickHandlers();
    })
    .catch(error => {
      console.error('Error fetching roadmap:', error);
      const roadmapEl = document.getElementById('roadmap');
      if (roadmapEl) {
        roadmapEl.innerHTML = `
          <div class="empty-state">
            <div class="empty-state__icon">❌</div>
            <div class="empty-state__text">Gagal memuat roadmap. Pastikan file JSON tersedia.</div>
          </div>
        `;
      }
    });
}

/**
 * Attach click handler ke semua node cards
 */
function attachNodeClickHandlers() {
  document.querySelectorAll('.node[data-id]').forEach(nodeEl => {
    nodeEl.addEventListener('click', (e) => {
      const nodeId = nodeEl.dataset.id;
      openNodeDetail(nodeId);
    });
  });
}

/**
 * Cari node data berdasarkan ID
 * @param {string} nodeId
 */
function findNodeById(nodeId) {
  if (!currentPathData || !currentPathData.semesters) return null;

  for (const semester of currentPathData.semesters) {
    for (const node of semester.nodes) {
      if (node.id === nodeId) {
        return node;
      }
    }
  }
  return null;
}

/**
 * Buka sidebar dengan detail node
 * @param {string} nodeId
 */
function openNodeDetail(nodeId) {
  const node = findNodeById(nodeId);
  if (!node) return;

  const sidebarContent = document.getElementById('sidebar-content');
  sidebarContent.innerHTML = renderNodeDetail(node);

  // Open sidebar
  const sidebar = document.getElementById('node-detail-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.add('sidebar--open');
  overlay.classList.add('sidebar-overlay--visible');
}

/**
 * Render HTML untuk node detail di sidebar
 * @param {Object} node
 */
function renderNodeDetail(node) {
  let html = '';

  // Header dengan icon & judul
  html += `
    <div class="sidebar-section">
      <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-3);">
        <span style="font-size: 32px;">${node.icon || '📌'}</span>
        <h2 class="sidebar-section__title">${node.title}</h2>
      </div>
  `;

  // Tags
  if (node.tags && node.tags.length > 0) {
    html += '<div class="sidebar-section__tags">';
    const TAG_CLASS = {
      'Wajib':      'badge--core',
      'Core IPII':  'badge--core',
      'Akademik':   'badge--core',
      'Skripsi':    'badge--core',
      'Kritis':     'badge--milestone',
      'Fast-track': 'badge--milestone',
      'Finish':     'badge--milestone',
      'Opsional':   'badge--optional',
      'Riset':      'badge--optional',
      'Networking': 'badge--soft',
      'Soft skill': 'badge--soft',
      'Leadership': 'badge--soft',
      'Portofolio': 'badge--soft',
      'Administrasi':'badge--soft',
      'Karir':      'badge--soft',
      'IPK':        'badge--optional'
    };
    node.tags.forEach(tag => {
      const cls = TAG_CLASS[tag] || 'badge--soft';
      html += `<span class="badge ${cls}">${tag}</span>`;
    });
    html += '</div>';
  }

  html += '</div>';

  // Description
  html += `
    <div class="sidebar-section">
      <p class="sidebar-section__label">Deskripsi</p>
      <p class="sidebar-section__text">${node.desc}</p>
    </div>
  `;

  // Action / Saran
  if (node.action) {
    html += `
      <div class="action-box">
        <label class="action-box__label">📋 Saran Aksi</label>
        <p class="action-box__text">${node.action}</p>
      </div>
    `;
  }

  // Resources
  if (node.resources && node.resources.length > 0) {
    html += `
      <div class="sidebar-section">
        <p class="sidebar-section__label">🔗 Referensi & Resources</p>
        <ul class="resources-list">
    `;
    node.resources.forEach(resource => {
      html += `
        <li class="resources-list__item">
          <a href="${resource.link}" target="_blank" rel="noopener" class="resources-list__link">
            <span class="resources-list__icon">🔗</span>
            <span>${resource.title}</span>
          </a>
        </li>
      `;
    });
    html += '</ul></div>';
  }

  return html;
}

/**
 * Initialize sidebar functionality
 */
function initSidebar() {
  const sidebarClose = document.getElementById('sidebar-close');
  const overlay = document.getElementById('sidebar-overlay');
  const sidebar = document.getElementById('node-detail-sidebar');

  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
  }

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }
}

/**
 * Tutup sidebar
 */
function closeSidebar() {
  const sidebar = document.getElementById('node-detail-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.remove('sidebar--open');
  overlay.classList.remove('sidebar-overlay--visible');
}
