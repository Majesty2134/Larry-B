// ============================================
//   LARRY B — CART PAGE LOGIC (cart.js)
// ============================================

const CART_KEY = 'larryb_cart';
const TAX_RATE = 0.075;
let shipCost = 0;
let shipLabel = 'Free';
let discountApplied = false;

// ---------- HELPERS ----------

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

// TO:
function formatPrice(n) {
  return '₦' + n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ---------- RENDER ----------

function render() {
  const cart = getCart();
  const layout   = document.getElementById('cart-layout');
  const emptyEl  = document.getElementById('cart-empty');
  const successEl = document.getElementById('checkout-success');
  const subtitle = document.getElementById('cart-subtitle');
  const list     = document.getElementById('cart-items-list');
  const countEl  = document.getElementById('cart-count');

  // nav badge
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  if (countEl) countEl.textContent = totalQty;
  if (subtitle) subtitle.textContent = totalQty === 0 ? '' : totalQty + (totalQty === 1 ? ' item' : ' items');

  if (cart.length === 0) {
    if (layout)   layout.style.display   = 'none';
    if (emptyEl)  emptyEl.style.display  = 'block';
    if (successEl) successEl.style.display = 'none';
    return;
  }

  if (layout)   layout.style.display   = 'grid';
  if (emptyEl)  emptyEl.style.display  = 'none';
  if (successEl) successEl.style.display = 'none';

  // Build items HTML
  list.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        ${item.img
          ? `<img src="${item.img}" alt="${item.name}">`
          : `<i class="fa fa-image" style="font-size:1.8rem;color:#ccc;"></i>`
        }
      </div>
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-variant">${[item.colour, item.size ? 'Size ' + item.size : ''].filter(Boolean).join(' / ')}</span>
        <span class="cart-item-unit-price">${formatPrice(item.price)} each</span>
        <button class="cart-item-remove" onclick="removeItem('${item.id}')">Remove</button>
      </div>
      <div class="cart-qty">
        <button class="cart-qty-btn" onclick="changeQty('${item.id}', -1)">&#8722;</button>
        <span class="cart-qty-num">${item.qty}</span>
        <button class="cart-qty-btn" onclick="changeQty('${item.id}', 1)">&#43;</button>
      </div>
      <div class="cart-item-total">${formatPrice(item.price * item.qty)}</div>
    </div>
  `).join('');

  calcSummary(cart);
}

// ---------- SUMMARY ----------

function calcSummary(cart) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = discountApplied ? subtotal * 0.10 : 0;
  const taxBase  = subtotal - discount + shipCost;
  const tax      = taxBase * TAX_RATE;
  const total    = taxBase + tax;

  document.getElementById('s-subtotal').textContent = formatPrice(subtotal);
  document.getElementById('s-shipping').textContent = shipLabel;
  document.getElementById('s-tax').textContent      = formatPrice(tax);
  document.getElementById('s-total').textContent    = formatPrice(total);

  const discRow = document.getElementById('discount-row');
  if (discountApplied) {
    discRow.style.display = 'flex';
    document.getElementById('s-discount').textContent = '−' + formatPrice(discount);
  } else {
    discRow.style.display = 'none';
  }
}

// ---------- ACTIONS ----------

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  render();
}

function removeItem(id) {
  let cart = getCart();
  cart = cart.filter(x => x.id !== id);
  saveCart(cart);
  render();
}

function setShip(cost, label) {
  shipCost  = cost;
  shipLabel = label;
  calcSummary(getCart());
}

document.addEventListener('DOMContentLoaded', render);

function applyPromo() {
  const input = document.getElementById('promo-input');
  const msg   = document.getElementById('promo-msg');
  const code  = input.value.trim().toUpperCase();

  // Valid codes — add more as needed
  const validCodes = ['LARRYB10', 'SAVE10', 'WELCOME10'];

  if (validCodes.includes(code)) {
    discountApplied = true;
    msg.textContent = '✓ Code applied — 10% off your order!';
    msg.className   = 'promo-msg success';
  } else {
    discountApplied = false;
    msg.textContent = 'Invalid code. Try LARRYB10.';
    msg.className   = 'promo-msg error';
  }

  calcSummary(getCart());
}

function checkout() {
  const cart = getCart();
  if (cart.length === 0) return;

  // Calculate total (mirrors calcSummary logic)
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = discountApplied ? subtotal * 0.10 : 0;
  const taxBase  = subtotal - discount + shipCost;
  const tax      = taxBase * TAX_RATE;
  const total    = taxBase + tax;

  // Paystack needs amount in kobo (multiply by 100)
  // Your prices are in $, so if you're charging in NGN update the prices in your products
  const amountInKobo = Math.round(total * 100);

  // Get customer email
  const customerEmail = prompt('Please enter your email address to continue:');
  if (!customerEmail || !customerEmail.includes('@')) {
    alert('A valid email address is required to complete your order.');
    return;
  }

  const paystackInstance = new PaystackPop();

  paystackInstance.newTransaction({
    key: "pk_live_f5c22feb665d930ab27f22ff18190de674759e42", // 🔁 swap for pk_live_... when Paystack activates you
    email: customerEmail,
    amount: amountInKobo,
    currency: 'NGN',
    ref: 'LARRYB_' + Math.floor(Math.random() * 1000000000),
    label: 'Larry B Casuals',
    metadata: {
      custom_fields: [
        {
          display_name: 'Cart Items',
          variable_name: 'cart_items',
          value: cart.map(i => `${i.name} x${i.qty}`).join(', ')
        }
      ]
    },

    onSuccess: function (transaction) {
      // Payment confirmed — now show success screen
      const layout    = document.getElementById('cart-layout');
      const successEl = document.getElementById('checkout-success');

      layout.style.display    = 'none';
      successEl.style.display = 'block';

      // Clear cart
      saveCart([]);
      document.getElementById('cart-count').textContent = '0';

      console.log('Payment successful! Reference:', transaction.reference);
    },

    onCancel: function () {
      alert('Payment was cancelled. Your cart is still saved.');
    }
  });
}
