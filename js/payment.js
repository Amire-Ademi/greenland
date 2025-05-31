const paymentForm = document.getElementById("payment-form");

paymentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const cardNumber = document.getElementById("card-number").value.replace(/\s+/g, "");
  const expirationDate = document.getElementById("expiration-date").value;
  const cvv = document.getElementById("cvv").value;

  const cardNumberRegex = /^[0-9]{16}$/;
  const expirationDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  const cvvRegex = /^[0-9]{3}$/;

  if (!cardNumberRegex.test(cardNumber)) {
    showToast("❌ Card number must be exactly 16 digits!", "#dc3545");
    return;
  }

  if (!expirationDateRegex.test(expirationDate)) {
    showToast("❌ Expiration date must be in MM/YY format!", "#dc3545");
    return;
  }

  if (!cvvRegex.test(cvv)) {
    showToast("❌ CVV must contain exactly 3 digits!", "#dc3545");
    return;
  }

  // Nëse kalojnë validimet:
  showToast("✅ Payment was successful!", "#4a9c80");

  // Pas pagesës, pastron karrocën dhe rifreskon UI-në
  clearCartItems();

  paymentForm.reset();
});

function showToast(message, bgColor) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: bgColor,
    close: true,
    className: "toastify-success",
    onClick: function () {
      Toastify.close();
    },
    offset: {
      x: 50,
      y: 50,
    },
  }).showToast();
}

// Formatimi i numrit të kartës në 4-shifra
document.getElementById("card-number").addEventListener("input", function (event) {
  let input = event.target.value.replace(/\D/g, "").substring(0, 16);
  event.target.value = input.match(/.{1,4}/g)?.join(" ") || input;
});

// Formatimi i datës MM/YY
document.getElementById("expiration-date").addEventListener("input", function (event) {
  let input = event.target.value.replace(/\D/g, "").substring(0, 4);
  if (input.length >= 3) {
    event.target.value = input.substring(0, 2) + "/" + input.substring(2);
  } else {
    event.target.value = input;
  }
});

// Funksionet për pastrimin e karrocës
function clearCartItems() {
  localStorage.removeItem("cart");
  updateCartBadge();
  renderCart();
}

// Funksioni për shtimin në karrocë me Toastify
function addToCart(id, title, price, thumbnail) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: id,
      name: title,
      price: price,
      thumbnail: thumbnail,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartBadge();

  Toastify({
    text: `${title} was added to cart!`,
    duration: 2000,
    gravity: "top",
    position: "right",
    backgroundColor: "#4a9c80",
    close: true,
    className: "toastify-success",
    onClick: function () {
      Toastify.close();
    },
    offset: {
      x: 50,
      y: 50,
    },
  }).showToast();
}
