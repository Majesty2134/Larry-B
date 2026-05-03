// =====================
// EMAILJS INIT
// =====================
emailjs.init("mXCsjq8fkHWgvTnUO");

function goToProduct(img) {
  const src   = img.src;
  const name  = img.getAttribute('data-name') || 'Product';
  const price = img.getAttribute('data-price') || '0';
  const url   = 'product.html?name=' + encodeURIComponent(name)
              + '&img='   + encodeURIComponent(src)
              + '&price=' + encodeURIComponent(price);
  window.location.href = url;
}
document.addEventListener("DOMContentLoaded", () => {

  // =====================
  // HOVER IMAGE SWAP
  // =====================
  document.querySelectorAll('.collection-card img[data-hover]').forEach(img => {
    const hoverImg = document.createElement('img');
    hoverImg.src = img.dataset.hover;
    hoverImg.classList.add('hover-img');
    hoverImg.onclick = () => goToProduct(img);
    img.parentElement.appendChild(hoverImg);
  });

  // =====================
  // SEARCH FUNCTIONALITY
  // =====================
  const searchBtn = document.getElementById("search-btn");
  const modal = document.getElementById("search-modal");
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");

  const products = [
    "Elegant power blazing 2 piece suit",
    "Exqusite hot 2 piece blouse and pant combo",
    "Stylish egyptian style bubu design",
    "Royal blue bubu style"
  ];

  if (searchBtn && modal) {
    searchBtn.addEventListener("click", () => {
      modal.classList.toggle("hidden");
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  }

  if (input && results) {
    input.addEventListener("input", () => {
      const value = input.value.toLowerCase();
      results.innerHTML = "";

      const filtered = products.filter(product =>
        product.toLowerCase().includes(value)
      );

      if (filtered.length === 0) {
        results.innerHTML = "<p>No results found</p>";
      }

      filtered.forEach(item => {
        const p = document.createElement("p");
        p.textContent = item;
        results.appendChild(p);
      });
    });
  }

  // =====================
  // CART SYSTEM
  // =====================
  const CART_KEY = "larryb_cart";

  const cartButtons = document.querySelectorAll(".add-to-cart, .collection-add-to-cart");
  const cartCount = document.getElementById("cart-count");
  const cartModal = document.getElementById("cart-modal");
  const cartBtn = document.getElementById("cart-btn");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  cartButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();

      const name  = button.getAttribute("data-name");
      const price = Number(button.getAttribute("data-price"));
      const id    = name;

      let cart = getCart();
      const existing = cart.find(item => item.id === id);

      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ id, name, price, qty: 1, img: button.getAttribute("data-img") || "" });
      }

      saveCart(cart);
      updateBadge();
    });
  });

  function updateBadge() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCount) cartCount.textContent = count;
  }

  function updateCartModal() {
    if (!cartItemsContainer) return;

    const cart = getCart();
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.qty;

      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <p>${item.name}</p>
        <p>₦${item.price.toLocaleString()}</p>
        <div class="qty-controls">
          <button class="decrease" data-index="${index}">-</button>
          <span>${item.qty}</span>
          <button class="increase" data-index="${index}">+</button>
        </div>
        <button class="remove" data-index="${index}">Remove</button>
      `;
      cartItemsContainer.appendChild(div);
    });

    if (cartTotal) cartTotal.textContent = "Total: ₦" + total.toLocaleString();
  }

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", (e) => {
      const index = Number(e.target.getAttribute("data-index"));
      let cart = getCart();

      if (e.target.classList.contains("increase")) {
        cart[index].qty += 1;
      }
      if (e.target.classList.contains("decrease")) {
        cart[index].qty -= 1;
        if (cart[index].qty <= 0) cart.splice(index, 1);
      }
      if (e.target.classList.contains("remove")) {
        cart.splice(index, 1);
      }

      saveCart(cart);
      updateBadge();
      updateCartModal();
    });
  }

  if (cartBtn && cartModal) {
    cartBtn.addEventListener("click", () => {
      cartModal.classList.toggle("active");
      updateCartModal();
    });

    cartModal.addEventListener("click", (e) => {
      if (e.target === cartModal) {
        cartModal.classList.remove("active");
      }
    });
  }

  updateBadge();
  updateCartModal();

  // =====================
  // CAROUSEL
  // =====================
  const track = document.getElementById('track');
  const cards = document.querySelectorAll('.card');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');

  const cardWidth = 270;
  let currentIndex = 0;
  const maxIndex = cards.length - 1;

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIndex < maxIndex) {
        currentIndex++;
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      }
    });
  }

  // =====================
  // ENQUIRY FORM
  // =====================
  const enquiryForm = document.querySelector("form");
  if (enquiryForm) {
    enquiryForm.addEventListener("submit", function(e) {
      e.preventDefault();

     emailjs.sendForm("service_p4pg7ug", "template_ar2068r", this)
        .then(() => {
          alert("Enquiry sent! We'll be in touch soon.");
          this.reset();
        })
       emailjs.sendForm("service_gnp5jq5", "template_ar2068r", this)
  .then(() => {
    alert("Enquiry sent! We'll be in touch soon.");
    this.reset();
  })
  .catch((error) => {
    alert("Error: " + JSON.stringify(error));
    console.error(error);
  });
    });
  }

});

// =====================
// PHONE INPUT
// =====================
const phoneInput = document.querySelector("#phone");
if (phoneInput && typeof window.intlTelInput === 'function') {
  window.intlTelInput(phoneInput, {});
}

// =====================
// LIGHTBOX
// =====================
function openImage(img) {
  document.getElementById("lightbox").style.display = "flex";
  document.getElementById("lightbox-img").src = img.src;
}

function closeImage() {
  document.getElementById("lightbox").style.display = "none";
}

function applyFilters() {
  const type     = document.getElementById("typeFilter").value;
  const category = document.getElementById("categoryFilter").value;
  const minPrice = parseInt(document.getElementById("minPrice").value) || 0;
  const maxPrice = parseInt(document.getElementById("maxPrice").value) || Infinity;

  const products = document.querySelectorAll(".collection-card");

  products.forEach(product => {
    const productType     = product.getAttribute("data-type");
    const productCategory = product.getAttribute("data-category");
    const productPrice    = parseInt(product.getAttribute("data-price"));

    let show = true;
    if (type !== "all" && productType !== type) show = false;
    if (category !== "all" && productCategory !== category) show = false;
    if (productPrice < minPrice || productPrice > maxPrice) show = false;

    product.style.display = show ? "block" : "none";
  });
}

// =====================
// CONTACT & FAQ
// =====================
function toggleFaq(btn) {
  const body = btn.nextElementSibling;
  const icon = btn.querySelector('.accordion-icon');
  const isOpen = body.classList.contains('open');
  document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.accordion-icon').forEach(i => i.textContent = '+');
  if (!isOpen) {
    body.classList.add('open');
    icon.textContent = '−';
  }
}

function handleContactSubmit() {
  const name = document.getElementById('fname').value.trim();
  const email = document.getElementById('cemail').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !email || !message) {
    alert('Please fill in your name, email, and message.');
    return;
  }
  document.getElementById('contact-sent-msg').style.display = 'block';
}

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}