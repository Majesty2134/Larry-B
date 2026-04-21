// WAIT FOR PAGE TO LOAD
document.addEventListener("DOMContentLoaded", () => {

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

  const cartButtons = document.querySelectorAll(".add-to-cart");
  const cartCount = document.getElementById("cart-count");
  const cartModal = document.getElementById("cart-modal");
  const cartBtn = document.getElementById("cart-btn");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // ADD TO CART
  cartButtons.forEach(button => {
    button.addEventListener("click", () => {
      const name = button.getAttribute("data-name");
      const price = Number(button.getAttribute("data-price"));

      const existingItem = cart.find(item => item.name === name);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name, price, quantity: 1 });
      }

      updateCartUI();
    });
  });

  // UPDATE CART UI
  function updateCartUI() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      count += item.quantity;

      const div = document.createElement("div");
      div.classList.add("cart-item");

      div.innerHTML = `
        <p>${item.name}</p>
        <p>$${item.price}</p>
        <div class="qty-controls">
          <button class="decrease" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="increase" data-index="${index}">+</button>
        </div>
        <button class="remove" data-index="${index}">Remove</button>
      `;

      cartItemsContainer.appendChild(div);
    });

    if (cartCount) cartCount.textContent = count;
    if (cartTotal) cartTotal.textContent = "Total: $" + total;

    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // HANDLE CART BUTTON CLICKS
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", (e) => {
      const index = Number(e.target.getAttribute("data-index"));

      if (e.target.classList.contains("increase")) {
        cart[index].quantity += 1;
      }

      if (e.target.classList.contains("decrease")) {
        cart[index].quantity -= 1;

        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }
      }

      if (e.target.classList.contains("remove")) {
        cart.splice(index, 1);
      }

      updateCartUI();
    });
  }

  // OPEN CART
  if (cartBtn && cartModal) {
    cartBtn.addEventListener("click", () => {
      cartModal.classList.toggle("active");
    });

    cartModal.addEventListener("click", (e) => {
      if (e.target === cartModal) {
        cartModal.classList.remove("active");
      }
    });
  }

  // INITIAL LOAD
  updateCartUI();

});

const input = document.querySelector("#phone");

window.intlTelInput(input, {
  initialcountry: "ng", //Nigeria default
  preferredCountries: ["ng", "us", "gb"],
  separteDialCode: true
});

function openImage(img) {
  document.getElementById("lightbox").style.display = "flex";
  document.getElementById("lightbox-img").src = img.src;
}

function closeImage() {
  document.getElementById("lightbox").style.display = "none";
}
 

 


