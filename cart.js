// ===== CART ENGINE =====

function getCart() {
  try { return JSON.parse(localStorage.getItem('s2p_cart')) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem('s2p_cart', JSON.stringify(cart));
}

function addToCart(id, name, price) {
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  saveCart(cart);
  updateCartCount();
  renderCartPanel();
  showToast(`${name} ajoute au panier`);
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
  updateCartCount();
  renderCartPanel();
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(id); return; }
  saveCart(cart);
  updateCartCount();
  renderCartPanel();
}

function updateCartCount() {
  const count = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function openCart() {
  document.getElementById('cartOverlay')?.classList.add('open');
  document.getElementById('cartPanel')?.classList.add('open');
  renderCartPanel();
}

function closeCart() {
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.getElementById('cartPanel')?.classList.remove('open');
}

function renderCartPanel() {
  const cart = getCart();
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  if (!itemsEl || !footerEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <p>Votre panier est vide</p>
        <a href="produits.html" style="color:var(--cyan);font-weight:600;font-size:0.85rem;" onclick="closeCart()">Voir les produits</a>
      </div>`;
    footerEl.innerHTML = '';
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.price.toFixed(2).replace('.', ',')} €</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty('${item.id}', -1)">-</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">x</button>
    </div>
  `).join('');

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const freeDelivery = totalQty >= 2;
  const deliveryCost = freeDelivery ? 0 : 5;

  footerEl.innerHTML = `
    <div class="delivery-notice">
      ${freeDelivery
        ? 'Livraison offerte !'
        : `Ajoutez ${2 - totalQty} produit${2 - totalQty > 1 ? 's' : ''} pour la livraison gratuite`}
    </div>
    <div class="cart-total">
      <span>Sous-total</span>
      <span>${subtotal.toFixed(2).replace('.', ',')} €</span>
    </div>
    <div class="cart-total">
      <span>Livraison (j. meme)</span>
      <span>${freeDelivery ? 'Gratuit' : '5,00 €'}</span>
    </div>
    <div class="cart-total final">
      <span>Total estime</span>
      <span>${(subtotal + deliveryCost).toFixed(2).replace('.', ',')} €</span>
    </div>
    <a href="commande.html" onclick="closeCart()">
      <button class="checkout-btn">Commander</button>
    </a>
  `;
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMsg');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 1500);
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
});
