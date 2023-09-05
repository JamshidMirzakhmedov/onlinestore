const itemList = document.querySelector(".items");

const API_URL = "https://dummyjson.com/products";

function sendReq(url) {
  return fetch(url).then((res) => {
    if (res.status >= 400) {
      throw Error("Error occured");
    }
    return res.json();
  });
}

//// ------  show Category list
const categoryList = document.getElementById("category");

sendReq("https://dummyjson.com/products/categories").then((data) => {
  const categories = data;

  categories.forEach((categoryItem) => {
    const category = document.createElement("option");

    category.textContent = categoryItem;
    category.value = categoryItem;

    categoryList.appendChild(category);
  });

  categoryList.addEventListener("change", (e) => {
    showCategoryItem(e.target.value);
  });
});

function displayProducts(data) {
  const categoryProducts = data.products;
  categoryProducts.forEach((product) => {
    const item = document.createElement("li");
    const addBtn = document.createElement("button");
    item.classList.add("item");
    addBtn.classList.add("add");
    addBtn.textContent = "Add to Basket";
    item.innerHTML = `
          <div class="img-item"><img src=${product.thumbnail} alt=${product.title} /></div>

              <h3 class="title">${product.title}</h3>
              <p class="desc">
                ${product.description}
              </p>
              <span class="price">$${product.price}</span>
              <span class="rating"> ${product.rating}</span>
          `;
    item.appendChild(addBtn);
    itemList.appendChild(item);
    addBtn.addEventListener("click", () => {
      addToBasket(product);
      updateBasketList();
    });
  });

  totalPages = Math.ceil(data.total / itemsPerPage);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

function showCategoryItem(category) {
  itemList.innerHTML = "";
  sendReq(`https://dummyjson.com/products/category/${category}`).then(
    (data) => {
      displayProducts(data);
    }
  );
}

const itemsPerPage = 20;
let currentPage = 1;
let totalPages = 1;
let shoppingBasket = [];

const basketList = document.getElementById("basket-list");

const pageInfo = document.getElementById("page-info");

// ------ display list

function fetchAndDisplay(page) {
  itemList.innerHTML = ``;

  const apiUrl = `https://dummyjson.com/products?limit=${itemsPerPage}&skip=${currentPage}0&select=title,price,thumbnail,description,rating`;

  sendReq(apiUrl)
    .then((data) => {
      displayProducts(data);
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
}

// ---- adding to basket

const basketBtn = document.querySelector(".basket-btn");
const basketContainer = document.querySelector(".basket-container");
const numItems = document.querySelector(".nums-items");

function addToBasket(product) {
  shoppingBasket.push(product);

  updateBasketList();

  numItems.classList.remove("hide");
  numItems.classList.add("show");
}

function updateBasketList() {
  basketList.innerHTML = "";
  numItems.textContent = shoppingBasket.length;

  shoppingBasket.forEach((product) => {
    const li = document.createElement("li");
    const removeBtn = document.createElement("button");

    removeBtn.innerHTML = ' <i class="far fa-trash-alt"></i>';

    li.classList.add("basket-item");

    li.innerHTML = `  <img src=${product.thumbnail} />
      <h3 class="title">${product.title}</h3>
      <h4>$${product.price}</h4>
      `;

    li.appendChild(removeBtn);
    basketList.appendChild(li);

    removeBtn.addEventListener("click", () => {
      removeFromBasket(product);
    });
  });
}
function removeFromBasket(product) {
  const index = shoppingBasket.indexOf(product);
  if (index !== -1) {
    shoppingBasket.splice(index, 1);
    updateBasketList();
  }
}

basketBtn.addEventListener("click", () => {
  basketContainer.classList.toggle("hide");
  // basketContainer.classList.add("show");
});

fetchAndDisplay(currentPage);

// ---- pagination
document.getElementById("prev").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;

    fetchAndDisplay(currentPage);
  }
});

document.getElementById("next").addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;

    fetchAndDisplay(currentPage);
  }
});
