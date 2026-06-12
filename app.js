// ===== PRODUCT DATA =====
// Prix provisoires — modifiez ici pour changer les prix
const PRICES = { '28k': 17.99, '42k': 24.99 };

const FLAVORS_28K = [
  'Blueberry Ice', 'Watermelon Ice', 'Mango Ice', 'Strawberry Ice',
  'Passion Fruit', 'Cool Mint', 'Cherry', 'Grape Ice',
  'Lemon Lime', 'Cola Ice', 'Peach Ice', 'Mixed Berries'
];

const FLAVORS_42K = [
  'Blueberry Ice', 'Watermelon Ice', 'Strawberry Ice', 'Mango Ice',
  'Passion Fruit', 'Lemon Lime', 'Mixed Berries', 'Cool Mint',
  'Cherry Cola', 'Grape Ice', 'Peach Ice', 'Cola Ice',
  'Strawberry Watermelon', 'Apple Ice'
];

function buildProducts() {
  const products = [];
  FLAVORS_28K.forEach(f => products.push({ id: `28k-${f.toLowerCase().replace(/ /g,'-')}`, type: '28k', label: 'JNR 28K', flavor: f, price: PRICES['28k'], bestSeller: false }));
  FLAVORS_42K.forEach(f => products.push({ id: `42k-${f.toLowerCase().replace(/ /g,'-')}`, type: '42k', label: 'JNR 42K', flavor: f, price: PRICES['42k'], bestSeller: true }));
  return products;
}

const ALL_PRODUCTS = buildProducts();

// ===== CURRENT FILTER & SEARCH =====
let activeFilter = 'all';
let activeSearch = '';

// ===== RENDER PRODUCTS =====
function renderProducts(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  let filtered = activeFilter === 'all' ? ALL_PRODUCTS : ALL_PRODUCTS.filter(p => p.type === activeFilter);
  if (activeSearch) {
    const q = activeSearch.toLowerCase();
    filtered = filtered.filter(p =>
      p.flavor.toLowerCase().includes(q) || p.label.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    el.innerHTML = `<div class="no-results"><strong>Aucun resultat</strong>Essaie un autre gout ou une autre gamme.</div>`;
    return;
  }

  el.innerHTML = filtered.map(p => `
    <div class="product-card">
      ${p.bestSeller ? '<div class="product-badge">Best Seller</div>' : ''}
      <div class="product-img-wrap">
        <div class="product-img-placeholder" id="img-${p.id}">
          <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span>Photo à venir</span>
        </div>
      </div>
      <div class="product-info">
        <div class="product-type-label">${p.label}</div>
        <div class="product-name">${p.flavor}</div>
        <div class="product-footer">
          <div class="product-price">${p.price.toFixed(2).replace('.', ',')} €</div>
          <button class="add-to-cart" onclick="addToCart('${p.id}', 'JNR ${p.type.toUpperCase()} - ${p.flavor}', ${p.price})">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== CATEGORY FILTER =====
function setFilter(type) {
  activeFilter = type;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === type);
  });
  renderProducts('productsGrid');
}

// ===== SEARCH =====
function setSearch(val) {
  activeSearch = val.trim();
  const clearBtn = document.getElementById('searchClear');
  if (clearBtn) clearBtn.style.display = activeSearch ? 'block' : 'none';
  renderProducts('productsGrid');
}

function clearSearch() {
  activeSearch = '';
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  const clearBtn = document.getElementById('searchClear');
  if (clearBtn) clearBtn.style.display = 'none';
  renderProducts('productsGrid');
}

// ===== HOMEPAGE PRODUCT PREVIEW (3 cards, one per type) =====
function renderHomepageProducts(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const preview = [
    ALL_PRODUCTS.find(p => p.type === '18k'),
    ALL_PRODUCTS.find(p => p.type === '28k'),
    ALL_PRODUCTS.find(p => p.type === '42k'),
  ].filter(Boolean);

  el.innerHTML = preview.map(p => `
    <div class="product-card">
      ${p.bestSeller ? '<div class="product-badge">Best Seller</div>' : ''}
      <div class="product-img-wrap">
        <div class="product-img-placeholder">
          <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span>Photo à venir</span>
        </div>
      </div>
      <div class="product-info">
        <div class="product-type-label">${p.label}</div>
        <div class="product-name">${p.flavor}</div>
        <div class="product-footer">
          <div class="product-price">À partir de ${p.price.toFixed(2).replace('.', ',')} €</div>
          <a href="produits.html" class="add-to-cart" style="text-decoration:none;">Voir les gouts</a>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== NAV MOBILE =====
function toggleNav() {
  document.getElementById('navLinks')?.classList.toggle('open');
}

// ===== AGE GATE =====
function confirmAge() {
  localStorage.setItem('s2p_age', '1');
  document.getElementById('ageGate')?.remove();
}
function denyAge() {
  document.getElementById('ageGate').innerHTML = `
    <div class="age-gate-box">
      <div class="logo">shop2puff</div>
      <h2>Accès refuse</h2>
      <p style="color:var(--muted);">Vous devez avoir 18 ans ou plus pour accéder a ce site.</p>
    </div>`;
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Age gate
  const ageGate = document.getElementById('ageGate');
  if (ageGate && localStorage.getItem('s2p_age') === '1') {
    ageGate.remove();
  }

  // Render
  renderProducts('productsGrid');
  renderHomepageProducts('homepageProducts');
});
