const categoriesContainer = document.getElementById("categories-container");
const productsContainer = document.getElementById("products-container");
const cartBadge = document.getElementById("cart-badge");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCartBadge();

// Funksioni per te marr kategorit nga API
async function fetchCategories() {
  try {
    const response = await fetch("https://dummyjson.com/products/categories");
    const categories = await response.json();
    renderCategories(categories);
  } catch (error) {
    console.error("Gabim në marrjen e kategorive", error);
  }
}

// Funksioni per te marr produktet nga API
async function fetchProducts(category = "all") {
  try {
    const url =
      category === "all"
        ? "https://dummyjson.com/products"
        : `https://dummyjson.com/products/category/${category}`;
    const response = await fetch(url);
    const data = await response.json();
    renderProducts(data.products);
  } catch (error) {
    console.error("Gabim në marrjen e produkteve", error);
  }
}
// Funksioni per ta aktivizuar kategorine e klikuar
function filterProducts(category) {
  console.log(`Category clicked: ${category}`);

  const buttons = document.querySelectorAll(".category");

  buttons.forEach((button) => button.classList.remove("active"));

  const activeButton = document.querySelector(`button:contains(${category})`);
  activeButton.classList.add("active");
}

// Funksioni per te shfaqur kategorit
function renderCategories(categories) {
  categoriesContainer.innerHTML =
    '<button onclick="fetchProducts()" class="category active">All</button>';

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name || category;
    button.classList.add("category");
    button.onclick = () => fetchProducts(category.name || category);
    categoriesContainer.appendChild(button);
  });
}

// Funksioni per te shfaqur produktet
function renderProducts(products) {
  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("menu_card");

    // Struktura e HTML per produktet nga html
    productCard.innerHTML = `
            <div class="bg_card"></div>
            <div class="card_image">
                <img src="${product.thumbnail}" alt="${product.title}">
            </div>
            <h4>${product.title}</h4>
            <p class="description">${product.description}</p>
            <div class="card_button">
                <span class="price">$${product.price}</span>
                <button class="add_to_cart" onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.thumbnail}')">Add to Cart</button>
                <i class="fas fa-heart"></i>
            </div>
        `;

    productsContainer.appendChild(productCard);
  });
}

// Funksioni per te shtuar produktin ne shport
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

  //  cart-badge
  updateCartBadge();

  Toastify({
    text: `${title} u shtua në shportë!`,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: "#4a9c80",
    close: true, //
    className: "toastify-success",
    onClick: function () {
      Toastify.close();
    },
    offset: {
      x: 50, // distanca nga ana e djatht
      y: 50, // distanca nga lart
    },
  }).showToast();
}
function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("products-container");
  if (!cartContainer) return;

  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Karroca është bosh.</p>";
    return;
  }

  cart.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("menu_card");

    div.innerHTML = `
      <div class="bg_card"></div>
      <div class="card_image">
          <img src="${item.thumbnail}" alt="${item.name}">
      </div>
      <h4>${item.name}</h4>
      <p class="description">Çmimi: $${item.price}</p>
      <p>Sasia: ${item.quantity}</p>
    `;

    cartContainer.appendChild(div);
  });
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartBadge.textContent = totalItems > 0 ? totalItems : "0";
}

fetchCategories();
fetchProducts();

updateCartBadge();
renderCart();

