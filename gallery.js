// HOT BRANDS™ — Gallery JS
const IMG = 'https://pub-a217d12273d04376985a75209b836769.r2.dev'; // ← your R2 public URL
/* ── DATA ──
   Assign your images here. span: 'normal' (all items use 'normal' so the
   grid stays a clean, uniform rectangle — no wide/full spans, no gaps).
   cat: 'campaign' | 'lookbook' | 'bts'
   Items are grouped by cat (campaign, then lookbook, then bts) so each
   section reads as one continuous block instead of being interleaved.
   caption / sub: editorial text shown on hover + in lightbox
*/
const galleryItems = [
  { id:1,  file:'img-02.jpg',          type:'image', cat:'campaign', span:'normal', caption:'Heavy Cotton', sub:'Essentials Collection',           label:null },
  { id:2,  file:'img-01.jpg',          type:'image', cat:'campaign', span:'normal', caption:'Campaign 001', sub:'The Heat — 2024',                 label:null },
  { id:3,  file:'img-03.jpg',          type:'image', cat:'campaign', span:'normal', caption:'Section 07',   sub:'The Ancestors Pack',              label:null },
  { id:4,  file:'gallery/gal-01.jpg',  type:'image', cat:'campaign', span:'normal', caption:'Rise Up',      sub:'The Ancestors — Street Edit',     label:null },
  { id:5,  file:'gallery/gal-17.jpg',  type:'image', cat:'campaign', span:'normal', caption:'After Dark',   sub:'The Ancestors — Night Run',       label:'CAMPAIGN' },
  { id:6,  file:'gallery/gal-02.jpg',  type:'image', cat:'campaign', span:'normal', caption:'Aisle Nine',   sub:'The Ancestors — Everyday Uniform', label:null },
  { id:7,  file:'gallery/gal-20.jpg',  type:'image', cat:'campaign', span:'normal', caption:'Full Court',   sub:'The Ancestors — Location Shoot',  label:null },
  { id:8,  file:'gallery/gal-23.jpeg', type:'image', cat:'campaign', span:'normal', caption:'Native',       sub:'Reading Room',                    label:null },
  { id:9,  file:'gallery/gal-25.jpg',  type:'image', cat:'campaign', span:'normal', caption:'Wall Ball',    sub:'The Ancestors — Location Shoot',  label:null },
  { id:10, file:'gallery/gal-28.jpeg', type:'image', cat:'campaign', span:'normal', caption:'Native Tongue',sub:'HOTBOY — Reading Room',           label:null },
  { id:11, file:'img-04.jpg',          type:'image', cat:'lookbook', span:'normal', caption:'Head Game',    sub:'Caps & Headwear',                 label:null },
  { id:12, file:'gallery/gvis-01.mp4', type:'video', cat:'campaign', span:'normal', caption:'Off Camera',   sub:'HOTBOY — Lifestyle',              label:'VIDEO' },

  // ── LOOKBOOK (divider inserted right here) ──
  { id:13, file:'img-06.jpg',          type:'image', cat:'lookbook', span:'normal', caption:'Coach Season', sub:'Outerwear',                       label:'LOOKBOOK' },
  { id:14, file:'gallery/gal-07.png',  type:'image', cat:'campaign', span:'normal', caption:'Studio Session',sub:'Full Look — After Hours',        label:null },
  { id:15, file:'img-08.jpg',          type:'image', cat:'lookbook', span:'normal', caption:'Sit Tight',    sub:'O — 1911 Collection',             label:null },
  { id:16, file:'gallery/gal-04.png',  type:'image', cat:'lookbook', span:'normal', caption:'Face Value',   sub:'O — 1911 Collection',             label:null },
  { id:17, file:'img-07.jpg',          type:'image', cat:'campaign', span:'normal', caption:'The Uniform',  sub:'Full Look Collection',            label:null },
  { id:18, file:'gallery/gal-05.png',  type:'image', cat:'lookbook', span:'normal', caption:'Full Fit',     sub:'O x HOT — Capsule',               label:null },
  { id:19, file:'gallery/gal-06.png',  type:'image', cat:'lookbook', span:'normal', caption:'Side Piece',   sub:'HOT Sweats',                      label:null },
  { id:20, file:'gallery/gal-08.png',  type:'image', cat:'lookbook', span:'normal', caption:'Low Angle',    sub:'O — 1911 Collection',             label:null },
  { id:21, file:'gallery/gal-09.png',  type:'image', cat:'lookbook', span:'normal', caption:'Profile Shot', sub:'O — 1911 Collection',             label:null },
  { id:22, file:'gallery/gal-13.png',  type:'image', cat:'lookbook', span:'normal', caption:'Twin Flame',   sub:'O x HOT — Capsule',               label:null },
  { id:23, file:'gallery/gal-14.png',  type:'image', cat:'lookbook', span:'normal', caption:'Back to Back', sub:'O — 1911 Collection',             label:null },
  { id:24, file:'gallery/gal-15.png',  type:'image', cat:'lookbook', span:'normal', caption:'Wrapped Up',   sub:'HOT Sweats',                      label:null },
  { id:25, file:'gallery/gal-19.png',  type:'image', cat:'lookbook', span:'normal', caption:'Lace Up',      sub:'HOT Sweats',                      label:null },
  { id:26, file:'img-09.jpg',          type:'image', cat:'bts',      span:'normal', caption:'On Set',       sub:'Behind The Brand',                label:'BTS' },
  { id:27, file:'img-10.jpg',          type:'image', cat:'bts',      span:'normal', caption:'Wrapped In HOT',sub:'Behind The Brand',               label:null },
  { id:28, file:'img-11.jpg',          type:'image', cat:'bts',      span:'normal', caption:'The Story',    sub:'c/o HOT BRANDS™ — 2024',          label:null },
  { id:29, file:'gallery/gal-10.png',  type:'image', cat:'bts',      span:'normal', caption:'Breather',     sub:'Behind The Brand',                label:null },
  { id:30, file:'gallery/gal-12.png',  type:'image', cat:'bts',      span:'normal', caption:'Lights Up',    sub:'Behind The Brand',                label:null },
];

// Editorial text breaks. "before" is the 0-based position in galleryItems
// where the divider is inserted (it takes its own full-width row, so it
// never splits a row of images). The lookbook divider sits right before
// item id:13 (img-06.jpg) — where the "LOOKBOOK" section was marked above.
const breaks = [
  { before: 0,  cat:'campaign', num:'001', text:'"THE CAMPAIGN."' },
  { before: 12, cat:'lookbook', num:'002', text:'"THE LOOKBOOK."' },
];

/* ── RENDER GRID ── */
const grid = document.getElementById('galGrid');

function buildGrid(filter) {
  grid.innerHTML = '';
  let inserted = new Set();

  galleryItems.forEach((item, idx) => {
    // Editorial text break
    breaks.forEach(b => {
      if (b.before === idx && !inserted.has(b.before) &&
          (filter === 'all' || filter === b.cat)) {
        const div = document.createElement('div');
        div.className = 'gal-break';
        div.style.gridColumn = '1 / -1';
        div.innerHTML = `<span class="gb-num">${b.num}</span><span class="gb-text">${b.text}</span><div class="gb-line"></div>`;
        grid.appendChild(div);
        inserted.add(b.before);
      }
    });

    const visible = filter === 'all' || item.cat === filter;
    const el = document.createElement('div');
    el.className = `gi gi--${item.span}${visible ? '' : ' hidden'}`;
    el.dataset.id = item.id;
    el.dataset.cat = item.cat;

    let mediaHTML = '';
    if (item.type === 'video') {
      mediaHTML = `<video src="${IMG}/${item.file}" muted loop playsinline preload="metadata"></video>
                   <div class="gi-play">▶</div>`;
    } else {
      mediaHTML = `<img src="${IMG}/${item.file}" alt="${item.caption || 'HOT BRANDS'}" loading="lazy">`;
    }

    const overlay = (item.caption || item.sub)
      ? `<div class="gi-overlay">
           ${item.caption ? `<div class="gi-cap">${item.caption}</div>` : ''}
           ${item.sub    ? `<div class="gi-sub">${item.sub}</div>`    : ''}
         </div>` : '';

    const labelHTML  = item.label ? `<div class="gi-label">${item.label}</div>` : '';
    const catBadge   = `<div class="gi-cat">${item.cat}</div>`;

    el.innerHTML = mediaHTML + overlay + labelHTML;
    el.addEventListener('click', () => openLightbox(item.id));

    // Video hover play/pause
    if (item.type === 'video') {
      const vid = el.querySelector('video');
      el.addEventListener('mouseenter', () => vid.play());
      el.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
    }

    grid.appendChild(el);
  });

  // Update count badge
  const count = filter === 'all' ? galleryItems.length : galleryItems.filter(i => i.cat === filter).length;
  document.getElementById('countAll').textContent = galleryItems.length;
}

/* ── FILTER ── */
let activeFilter = 'all';
document.querySelectorAll('.gf').forEach(btn => {
  btn.addEventListener('click', () => {
    activeFilter = btn.dataset.cat;
    document.querySelectorAll('.gf').forEach(b => b.classList.toggle('active', b.dataset.cat === activeFilter));
    buildGrid(activeFilter);
  });
});

/* ── LIGHTBOX ── */
let lbIndex = 0;
let visibleItems = [];

function openLightbox(id) {
  visibleItems = galleryItems.filter(i => activeFilter === 'all' || i.cat === activeFilter);
  lbIndex = visibleItems.findIndex(i => i.id === id);
  _showLb();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
  const vid = document.querySelector('#lbMedia video');
  if (vid) vid.pause();
}

function _showLb() {
  const item = visibleItems[lbIndex];
  if (!item) return;
  const media = document.getElementById('lbMedia');
  if (item.type === 'video') {
    media.innerHTML = `<video src="${IMG}/${item.file}" controls autoplay muted playsinline style="max-width:100%;max-height:75vh;"></video>`;
  } else {
    media.innerHTML = `<img src="${IMG}/${item.file}" alt="${item.caption || ''}">`;
  }
  document.getElementById('lbCaption').textContent = item.caption || '';
  document.getElementById('lbSub').textContent     = item.sub || '';
  document.getElementById('lbPrev').style.opacity  = lbIndex > 0 ? '1' : '0.2';
  document.getElementById('lbNext').style.opacity  = lbIndex < visibleItems.length - 1 ? '1' : '0.2';
}

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => {
  if (lbIndex > 0) { lbIndex--; _showLb(); }
});
document.getElementById('lbNext').addEventListener('click', () => {
  if (lbIndex < visibleItems.length - 1) { lbIndex++; _showLb(); }
});
document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft'  && lbIndex > 0) { lbIndex--; _showLb(); }
  if (e.key === 'ArrowRight' && lbIndex < visibleItems.length - 1) { lbIndex++; _showLb(); }
});

/* ── THEME ── */
const body   = document.body;
const toggle = document.getElementById('themeToggle');
const label  = document.getElementById('toggleLabel');

function setTheme(t) {
  body.setAttribute('data-theme', t);
  label.textContent = t.toUpperCase();
  localStorage.setItem('hb-theme', t);
}
setTheme(localStorage.getItem('hb-theme') || 'dark');
toggle.addEventListener('click', () => {
  setTheme(body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ── INIT ── */
buildGrid('all');
Cart.init();
