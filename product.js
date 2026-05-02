// =============================================
// LOAD PRODUCT FROM URL
// =============================================
(function loadProductFromURL() {
  const params = new URLSearchParams(window.location.search);
  const name   = params.get('name');
  const img    = params.get('img');

  if (name) {
    const title      = document.getElementById('product-title');
    const label      = document.getElementById('product-label');
    const breadcrumb = document.getElementById('breadcrumb-name');

    if (title)      title.textContent      = name.toUpperCase();
    if (label)      label.textContent      = name.toUpperCase();
    if (breadcrumb) breadcrumb.textContent = name;

    document.title = name + ' – Larry B';
  }

  if (img) {
    const mainImg = document.getElementById('product-main-img');
    if (mainImg) {
      mainImg.src = img;
      mainImg.alt = name || 'Product Image';
    }
  }
})();


// =============================================
// COLOUR SWATCHES
// =============================================
(function initColourSwatches() {
  const container = document.getElementById('colourSwatches');
  if (!container) return;

  container.addEventListener('click', function(e) {
    const btn = e.target.closest('.swatch');
    if (!btn) return;
    container.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    checkReady();
  });
})();


// =============================================
// SIZE SELECTOR
// =============================================
(function initSizeSelector() {
  const grid = document.getElementById('sizeGrid');
  if (!grid) return;

  grid.addEventListener('click', function(e) {
    const btn = e.target.closest('.size-btn');
    if (!btn) return;
    grid.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    checkReady();
  });
})();


// =============================================
// CHECK READY
// =============================================
function checkReady() {
  const colourChosen = document.querySelector('#colourSwatches .swatch.active');
  const sizeChosen   = document.querySelector('#sizeGrid .size-btn.active');
  const addToCart    = document.getElementById('addToCart');
  if (!addToCart) return;

  if (colourChosen && sizeChosen) {
    addToCart.classList.add('ready');
  } else {
    addToCart.classList.remove('ready');
  }
}


// =============================================
// QUANTITY STEPPER
// =============================================
(function initQuantity() {
  const minus   = document.getElementById('qtyMinus');
  const plus    = document.getElementById('qtyPlus');
  const display = document.getElementById('qtyValue');
  if (!minus || !plus || !display) return;

  let qty = 1;

  minus.addEventListener('click', function() {
    if (qty > 1) { qty--; display.textContent = qty; }
  });

  plus.addEventListener('click', function() {
    qty++;
    display.textContent = qty;
  });
})();


// =============================================
// ADD TO CART
// =============================================
(function initAddToCart() {
  const btn = document.getElementById('addToCart');
  if (!btn) return;

  btn.addEventListener('click', function() {
    const colour = document.querySelector('#colourSwatches .swatch.active');
    const size   = document.querySelector('#sizeGrid .size-btn.active');

    if (!colour) { alert('Please select a colour.'); return; }
    if (!size)   { alert('Please select a size.');   return; }

    const badge = document.getElementById('cart-count');
    if (badge) {
      const qty = parseInt(document.getElementById('qtyValue').textContent) || 1;
      badge.textContent = parseInt(badge.textContent || 0) + qty;
    }

    btn.textContent = '✓ Added!';
    btn.style.background = '#2EAE5E';
    setTimeout(function() {
      btn.textContent = 'Add to cart';
      btn.style.background = '';
    }, 2000);
  });
})();


// =============================================
// ACCORDION
// =============================================
(function initAccordion() {
  document.querySelectorAll('.accordion-header').forEach(function(header) {
    header.addEventListener('click', function() {
      const targetId = header.getAttribute('data-target');
      const body     = document.getElementById(targetId);
      const iconId   = 'icon' + targetId.charAt(0).toUpperCase() + targetId.slice(1);
      const icon     = document.getElementById(iconId);
      if (!body) return;

      const isOpen = body.classList.toggle('open');
      if (icon) icon.textContent = isOpen ? '−' : '+';
    });
  });
})();

document.querySelectorAll('.collection-card img[data-hover]').forEach(img => {
  const hoverImg = document.createElement('img');
  hoverImg.src = img.dataset.hover;
  hoverImg.classList.add('hover-img');
  hoverImg.onclick = () => goToProduct(img); // keeps the click working
  img.parentElement.appendChild(hoverImg);
});

// ============================================
//   LARRY B — ADD TO CART (add to product.js)
//   Paste this into your existing product.js
//   Replace or update your addToCart handler
// ============================================

const CART_KEY = 'larryb_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function updateCartBadge() {
  const cart  = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = total;
}

// Call this on page load so the badge is always correct
updateCartBadge();

// Wire up the Add to Cart button
document.getElementById('addToCart').addEventListener('click', function () {
  // --- Read current selections ---
  const name    = document.getElementById('product-title').textContent;
 const params = new URLSearchParams(window.location.search);
const rawPrice = parseFloat(params.get('price')) || 0;
  const qty     = parseInt(document.getElementById('qtyValue').textContent) || 1;

  // Get selected colour
  const activeColour = document.querySelector('.swatch.active');
  const colour = activeColour ? activeColour.getAttribute('data-colour') : '';

  // Get selected size
  const activeSize = document.querySelector('.size-btn.active');
  const size = activeSize ? activeSize.getAttribute('data-size') : '';

  // Get product image
  const imgEl = document.getElementById('product-main-img');
  const img   = imgEl ? imgEl.src : '';

  // Build a unique ID from name + colour + size
  const id = btoa(name + colour + size).replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);

  // Add or update in cart
  const cart     = getCart();
  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, name, colour, size, price: rawPrice, qty, img });
  }

  saveCart(cart);
  updateCartBadge();

  // Visual feedback on button
  const btn = document.getElementById('addToCart');
  const original = btn.textContent;
  btn.textContent = 'Added!';
  btn.style.background = '#2EAE5E';
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
  }, 1500);
});