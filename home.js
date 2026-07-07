// HOT BRANDS™ — Home / Shop JS
const IMG = 'https://pub-a217d12273d04376985a75209b836769.r2.dev';

// ── AUTH GUARD ────────────────────────────────────────────
document.body.style.visibility = 'hidden';

(async () => {
  try {
    const { data: { session } } = await window.sb.auth.getSession();

    if (!session) {
      window.location.replace('/');
      return;
    }

    const { data: profile } = await window.sb
      .from('profiles').select('*').eq('id', session.user.id).single();

    if (!profile?.first_name) {
      // First-time user with no name stored yet
      const meta  = session.user.user_metadata || {};
      const full  = meta.full_name || meta.name || '';
      const parts = full.split(' ');
      const first = meta.given_name  || parts[0] || 'Customer';
      const last  = meta.family_name || parts.slice(1).join(' ') || '';
      await window.sb.from('profiles').upsert({
        id: session.user.id, first_name: first, last_name: last
      });
      Cart.setUser({ first, last, email: session.user.email });
    } else {
      Cart.setUser({
        first: profile.first_name,
        last:  profile.last_name  || '',
        email: session.user.email,
        phone: profile.phone      || '',
      });
    }

  } catch (e) {
    console.warn('Auth check failed:', e.message);
  }

  document.body.style.visibility = 'visible';
  initApp();
})();

// ── APP ───────────────────────────────────────────────────
function initApp() {

/* ── THEME ── */
const THEME = { current: 'dark' };
const themeToggle = document.getElementById('themeToggle');
const toggleLabel = document.getElementById('toggleLabel');
const body = document.body;

function setTheme(t) {
  THEME.current = t;
  body.setAttribute('data-theme', t);
  toggleLabel.textContent = t.toUpperCase();
  localStorage.setItem('hb-theme', t);
}
setTheme(localStorage.getItem('hb-theme') || 'dark');
themeToggle.addEventListener('click', () => setTheme(THEME.current === 'dark' ? 'light' : 'dark'));

/* ── HOTSPOT HOVER ── */
document.querySelectorAll('.hotspot').forEach(hs => {
  hs.addEventListener('mouseenter', () => {});
  hs.addEventListener('mouseleave', () => {});
  hs.addEventListener('click', () => openShop(hs.dataset.cat));
});

/* ── MOBILE CATEGORY CARDS ── */
document.querySelectorAll('.mob-cat').forEach(btn => {
  btn.addEventListener('click', () => openShop(btn.dataset.cat));
});

/* ── NAV LINKS ── */
document.getElementById('navHub').addEventListener('click', e => { e.preventDefault(); showHub(); });
document.getElementById('navShopLink').addEventListener('click', e => { e.preventDefault(); openShop('all'); });

/* ── PRODUCTS ── */
const products = [
  { id:1,  name:'FP Flame SkullCap',    cat:'hats',  price:8500,  colors:['#0B0B0B','#F4F1EA'], coming:false, img:'skully1.jpg',  sizes:['Free Size'] },
  { id:2,  name:'LP Flame SkullCap',    cat:'hats',  price:8500,  colors:['#0B0B0B','#F4F1EA'], coming:false, img:'skully2.jpg',  sizes:['Free Size'] },
  { id:5,  name:'Ancestors Tee x3',     cat:'torso', price:32000, colors:['#c7c7c7','#0B0B0B','#F4F1EA'], coming:false, img:'anc1.png' },
  { id:6,  name:'Moremi Ancestor Tee',  cat:'torso', price:12000, colors:['#0B0B0B','#c7c7c7'], coming:false, img:'anc3.jpg' },
  { id:8,  name:'IconBaby Longsleeve',  cat:'torso', price:13500, colors:['#0B0B0B'], coming:false, img:'img-17.png' },
  { id:9,  name:'IconBaby shortSleeve', cat:'torso', price:15000, colors:['#0B0B0B'], coming:false, img:'img-05.jpg' },
  { id:10, name:'HB Sweats',            cat:'legs',  price:28000, colors:['#0B0B0B','#888888'], coming:false, img:'img-09.jpg' },
  { id:11, name:'HB Jorts',             cat:'legs',  price:25000, colors:['#c7c7c7'], coming:false, img:'img-11.jpg' },
];

const cardPalette = {
  hats:  ['#D81C1C','#0B0B0B'],
  torso: ['#0B0B0B','#D81C1C'],
  legs:  ['#1a1a1a','#888888'],
  kicks: ['#D81C1C','#1a1a1a'],
};

function svgArt(p, c1, c2) {
  if (p.cat === 'hats') return `
    <ellipse cx="150" cy="210" rx="90" ry="28" fill="${c2}"/>
    <path d="M80,210 Q100,140 150,135 Q200,140 220,210Z" fill="${c2}"/>
    <rect x="60" y="195" width="180" height="22" rx="11" fill="${c2}" opacity=".4"/>`;
  if (p.cat === 'torso') return `
    <rect x="70" y="80" width="160" height="200" rx="4" fill="${c2}" opacity=".9"/>
    <rect x="30" y="90" width="52" height="140" rx="4" fill="${c2}" opacity=".7"/>
    <rect x="218" y="90" width="52" height="140" rx="4" fill="${c2}" opacity=".7"/>
    <text x="150" y="200" text-anchor="middle" font-family="Anton,sans-serif" font-size="28" fill="${c1}" letter-spacing="2">HOT</text>`;
  if (p.cat === 'legs') return `
    <rect x="75" y="60" width="64" height="280" rx="4" fill="${c2}" opacity=".9"/>
    <rect x="161" y="60" width="64" height="280" rx="4" fill="${c2}" opacity=".9"/>
    <rect x="70" y="55" width="160" height="28" rx="4" fill="${c2}"/>`;
  if (p.cat === 'kicks') return `
    <ellipse cx="150" cy="280" rx="100" ry="36" fill="${c2}" opacity=".5"/>
    <path d="M60,260 Q80,200 130,190 L200,192 Q230,200 240,240 Q240,270 220,280 L80,282Z" fill="${c2}"/>
    <rect x="55" y="252" width="192" height="28" rx="14" fill="${c2}" opacity=".6"/>
    <text x="150" y="246" text-anchor="middle" font-family="Anton,sans-serif" font-size="15" fill="${c1}">HOT BRANDS</text>`;
  return '';
}

function productCardHTML(p, idx) {
  const [c1, c2] = cardPalette[p.cat] || ['#333','#D81C1C'];
  const dots = p.colors.map(c => `<div class="color-dot" style="background:${c};"></div>`).join('');
  const badge = p.coming
    ? `<div class="cs-overlay"><div class="cs-label">Coming Soon</div><button class="cs-btn" onclick="event.stopPropagation()">Notify Me</button></div>`
    : `<div class="hover-tag">Quick View</div>`;
  const art = p.img
    ? `<img src="${IMG}/${p.img}" alt="${p.name}" loading="lazy">`
    : `<svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
         <rect width="300" height="400" fill="${c1}"/>
         ${svgArt(p, c1, c2)}
       </svg>`;
  return `
    <div class="product-card card-anim" style="animation-delay:${idx*40}ms"
         data-id="${p.id}" data-cat="${p.cat}" data-coming="${p.coming}">
      <div class="product-card-img">${art}${badge}</div>
      <div class="product-card-info">
        <div class="product-card-cat">${p.cat}</div>
        <div class="product-card-name">${p.name}</div>
        <div class="product-card-price">₦${p.price.toLocaleString()}</div>
        <div class="product-card-colors">${dots}</div>
      </div>
    </div>`;
}

/* ── GRID ── */
let activeFilter = 'all';
let activeSort   = 'newest';

function getSorted(arr) {
  const s = [...arr];
  if (activeSort === 'price-asc')  s.sort((a,b) => a.price - b.price);
  if (activeSort === 'price-desc') s.sort((a,b) => b.price - a.price);
  return s;
}

function renderGrid(filter) {
  activeFilter = filter;
  const grid   = document.getElementById('productGrid');
  const csPage = document.getElementById('csPage');
  const catP   = filter === 'all' ? products : products.filter(p => p.cat === filter);
  const allCS  = catP.every(p => p.coming);

  if (allCS && filter !== 'all') {
    grid.innerHTML = '';
    csPage.classList.add('active');
    document.getElementById('countLine').style.display = 'none';
    document.getElementById('csPageTitle').textContent = filter.toUpperCase() + ' — COMING SOON';
    return;
  }
  csPage.classList.remove('active');
  document.getElementById('countLine').style.display = '';

  const visible = getSorted(catP);
  document.getElementById('countLine').textContent = `Showing ${visible.length} piece${visible.length !== 1 ? 's' : ''}`;
  grid.innerHTML = visible.map((p, i) => productCardHTML(p, i)).join('');

  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
}

/* ── PRODUCT CLICK → QUICK VIEW ── */
document.getElementById('productGrid').addEventListener('click', e => {
  const card = e.target.closest('.product-card');
  if (!card || card.dataset.coming === 'true') return;
  const id = parseInt(card.dataset.id, 10);
  const product = products.find(p => p.id === id);
  if (product) openQuickView(product);
});

/* ── QUICK VIEW ── */
const SIZES = {
  hats:  ['Free Size','S/M','L/XL'],
  torso: ['XS','S','M','L','XL','XXL'],
  legs:  ['28','30','32','34','36'],
  kicks: ['38','39','40','41','42','43','44'],
};
let qvProduct = null, qvSize = null, qvColor = null;

function openQuickView(product) {
  qvProduct = product; qvSize = null; qvColor = product.colors[0] || null;
  const [c1, c2] = cardPalette[product.cat] || ['#333','#D81C1C'];
  document.getElementById('qvCat').textContent   = product.cat.toUpperCase();
  document.getElementById('qvName').textContent  = product.name;
  document.getElementById('qvPrice').textContent = `₦${product.price.toLocaleString()}`;
  document.getElementById('qvArt').innerHTML = product.img
    ? `<img src="${IMG}/${product.img}" alt="${product.name}">`
    : `<svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
         <rect width="300" height="400" fill="${c1}"/>${svgArt(product,c1,c2)}</svg>`;

  const sizes = product.sizes || SIZES[product.cat] || ['S','M','L','XL'];
  document.getElementById('qvSizes').innerHTML = sizes.map(s =>
    `<button class="qv-size-btn" data-size="${s}">${s}</button>`).join('');
  document.querySelectorAll('.qv-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      qvSize = btn.dataset.size;
      document.querySelectorAll('.qv-size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const addBtn = document.getElementById('qvAdd');
      addBtn.disabled = false; addBtn.textContent = 'Add to Cart';
    });
  });

  document.getElementById('qvColors').innerHTML = product.colors.map((c,i) =>
    `<div class="qv-color-btn${i===0?' active':''}" data-color="${c}" style="background:${c};"></div>`).join('');
  document.querySelectorAll('.qv-color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      qvColor = btn.dataset.color;
      document.querySelectorAll('.qv-color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  const addBtn = document.getElementById('qvAdd');
  addBtn.disabled = true; addBtn.textContent = 'Select a size';
  document.getElementById('qvPanel').classList.add('open');
  document.getElementById('qvOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  document.getElementById('qvPanel').classList.remove('open');
  document.getElementById('qvOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('qvClose').addEventListener('click', closeQuickView);
document.getElementById('qvOverlay').addEventListener('click', closeQuickView);
document.getElementById('qvAdd').addEventListener('click', () => {
  if (!qvProduct || !qvSize) return;
  Cart.addItem({
    ...qvProduct,
    size:       qvSize,
    color:      qvColor || qvProduct.colors[0],
    thumbColor: cardPalette[qvProduct.cat]?.[0] || '#1a1a1a',
  });
  closeQuickView();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeQuickView(); });

/* ── FILTER + SORT ── */
document.querySelectorAll('.filter-pill').forEach(btn => {
  btn.addEventListener('click', () => renderGrid(btn.dataset.filter));
});
document.getElementById('sortSelect').addEventListener('change', e => {
  activeSort = e.target.value; renderGrid(activeFilter);
});

/* ── VIEW SWITCHING ── */
function openShop(cat) {
  document.getElementById('viewHub').style.display  = 'none';
  document.getElementById('viewShop').style.display = 'block';
  document.getElementById('navHub').classList.remove('active');
  document.getElementById('navShopLink').classList.add('active');
  document.getElementById('shopCatTitle').textContent = cat === 'all' ? 'ALL' : cat.toUpperCase();
  renderGrid(cat);
}
function showHub() {
  document.getElementById('viewHub').style.display  = 'block';
  document.getElementById('viewShop').style.display = 'none';
  document.getElementById('navHub').classList.add('active');
  document.getElementById('navShopLink').classList.remove('active');
}
document.getElementById('backBtn').addEventListener('click', showHub);

/* ── INIT ── */
Cart.init();

} // end initApp
