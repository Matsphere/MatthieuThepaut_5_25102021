"use strict";

const itemsContainer = document.getElementById("items");

const products = [];
const getProducts = async function (url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    data.forEach((product) => products.push(product));
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

const renderProducts = async function (url) {
  await getProducts(url);
  console.log(products);
  products.forEach((product) => {
    const markup = `
        <a href="front/product.html?id=${product._id}">
          <article>
              <img
                      src="${product.imageUrl}"
                      alt=${product.altTxt}
                     />
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}
              </p>
          </article>
        </a>`;
    itemsContainer.insertAdjacentHTML("afterbegin", markup);
  });
};

renderProducts("http://localhost:3000/api/products");
