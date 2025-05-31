// shoppingCart.js

function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cart-container");
  const cartStatus = document.getElementById("cart-status");
  const subtotalValue = document.getElementById("subtotal-value");
  const totalValue = document.getElementById("total-value");
  const checkoutTotal = document.getElementById("checkout-total");

  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartStatus.textContent = "You have 0 item(s) in your cart.";
    subtotalValue.textContent = "$0.00";
    totalValue.textContent = "$0.00";
    checkoutTotal.textContent = "$0.00";
    return;
  }

  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;

    const div = document.createElement("div");

    div.classList.add("invoice-item");
    div.innerHTML = `
  <img src="${item.thumbnail}" alt="${item.name}" />
  <div class="item-details">
    <h4>${item.name.split(" ")[0]}</h4>
  </div>
  <div class="invoice-item-quantity">
    <button class="decrease" data-id="${item.id}">-</button>
    <span>${item.quantity}</span>
    <button class="increase" data-id="${item.id}">+</button>
  </div>
  <button class="invoice-item-delete" data-id="${item.id}">
    <i class="fa-solid fa-trash"></i>
  </button>
`;

    cartContainer.appendChild(div);
  });

  const shipping = 5.0;
  const total = subtotal + shipping;

  cartStatus.textContent = `You have ${cart.length} item(s) in your cart.`;
  subtotalValue.textContent = `$${subtotal.toFixed(2)}`;
  totalValue.textContent = `$${total.toFixed(2)}`;
  checkoutTotal.textContent = `$${total.toFixed(2)}`;

  // Increase quantity
  document.querySelectorAll(".increase").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      const updatedCart = cart.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      loadCart();
    });
  });

  // Decrease quantity
  document.querySelectorAll(".decrease").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      const updatedCart = cart.map((item) => {
        if (item.id === id && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      loadCart();
    });
  });

  // Remove product
  document.querySelectorAll(".invoice-item-delete").forEach((button) => {
    button.addEventListener("click", (e) => {
      const idToRemove = parseInt(e.target.dataset.id);
      const newCart = cart.filter((item) => item.id !== idToRemove);
      localStorage.setItem("cart", JSON.stringify(newCart));
      loadCart(); // reload pas fshirjes
    });
  });
}

window.addEventListener("DOMContentLoaded", loadCart);
