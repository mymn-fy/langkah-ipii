/* ============================================
   roadmap.js — Render Roadmap dari JSON
   Langkah IPII
   ============================================ */

const RoadmapRenderer = (() => {

  // Map type node → class CSS
  const NODE_TYPE_CLASS = {
    core:      '',
    optional:  'node--optional',
    milestone: 'node--milestone'
  };

  // Map type tag → badge class
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

  // Map dotType → CSS modifier
  const DOT_CLASS = {
    default:   '',
    milestone: 'semester-item__dot--accent',
    faint:     'semester-item__dot--faint'
  };

  /**
   * Render satu node card
   * @param {Object} node
   * @param {string} activePath - jalur aktif saat ini
   */
  function renderNode(node, activePath = 'all') {
    const typeClass = NODE_TYPE_CLASS[node.type] || '';

    // Tentukan apakah node ini relevan dengan path aktif
    const isRelevant = activePath === 'all' || node.paths.includes('all') || node.paths.includes(activePath);
    const hiddenClass = isRelevant ? '' : 'node--hidden';

    // Render tags
    const tagsHTML = (node.tags || []).map(tag => {
      const cls = TAG_CLASS[tag] || 'badge--soft';
      return `<span class="badge ${cls}">${tag}</span>`;
    }).join('');

    return `
      <div class="node ${typeClass} ${hiddenClass}" data-id="${node.id}" data-paths='${JSON.stringify(node.paths)}' style="cursor: pointer;">
        <div class="node__icon">${node.icon || '📌'}</div>
        <div class="node__title">${node.title}</div>
        <div class="node__desc">${node.desc}</div>
        <div class="node__tags">${tagsHTML}</div>
      </div>
    `;
  }

  /**
   * Render satu semester block (rail kiri + nodes kanan)
   * @param {Object} sem
   * @param {string} activePath
   * @param {boolean} isLast
   */
  function renderSemester(sem, activePath = 'all', isLast = false) {
    const dotClass = DOT_CLASS[sem.dotType] || '';

    // Semester rail (kiri)
    const rail = `
      <div class="semester-item">
        <div class="semester-item__dot-wrap">
          <div class="semester-item__dot ${dotClass}"></div>
          ${!isLast ? '<div class="semester-item__line"></div>' : ''}
        </div>
        <div class="semester-item__label">${sem.label}<br><span style="font-weight:400;opacity:0.7;">${sem.period}</span></div>
      </div>
    `;

    // Nodes (kanan)
    const nodesHTML = sem.nodes.map(node => renderNode(node, activePath)).join('');
    const block = `
      <div class="semester-block" data-sem="${sem.id}">
        <div class="semester-block__title">
          ${sem.description}
          <span class="semester-block__period">${sem.label}</span>
        </div>
        <div class="nodes-grid">${nodesHTML}</div>
      </div>
    `;

    return { rail, block };
  }

  /**
   * Render seluruh roadmap ke dalam container
   * @param {Object} data - JSON data roadmap
   * @param {string} activePath - jalur aktif
   */
  function render(data, activePath = 'all') {
    const roadmapEl = document.getElementById('roadmap');
    if (!roadmapEl) return;

    const semesters = data.semesters;

    // Build roadmap dengan baris per semester
    let roadmapHTML = '';

    // Legend
    roadmapHTML += `
      <div class="legend">
        <div class="legend__item">
          <div class="legend__dot legend__dot--done"></div>
          Tercapai
        </div>
        <div class="legend__item">
          <div class="legend__dot legend__dot--milestone"></div>
          Milestone kritis
        </div>
        <div class="legend__item">
          <div class="legend__dot legend__dot--optional"></div>
          Opsional / Jalur tertentu
        </div>
        <div class="legend__item">
          <div class="legend__dot legend__dot--default"></div>
          Belum tercapai
        </div>
      </div>
    `;

    semesters.forEach((sem, i) => {
      const isLast = i === semesters.length - 1;
      const { rail, block } = renderSemester(sem, activePath, isLast);
      roadmapHTML += `<div class="semester-row">${rail}${block}</div>`;
    });

    // Bungkus semua konten roadmap dengan efek animasi fade-in
    roadmapEl.innerHTML = `<div class="animate-fade-in">${roadmapHTML}</div>`;
  }

  /**
   * Update visibilitas node tanpa re-render penuh
   * @param {string} activePath
   */
  function filterByPath(activePath) {
    const nodes = document.querySelectorAll('.node[data-id]');
    nodes.forEach(nodeEl => {
      const paths = JSON.parse(nodeEl.dataset.paths || '[]');
      const isRelevant = activePath === 'all'
        || paths.includes('all')
        || paths.includes(activePath);

      nodeEl.classList.toggle('node--hidden', !isRelevant);
    });
  }

  return { render, filterByPath };

})();
