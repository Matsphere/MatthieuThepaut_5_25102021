"use strict";
const apiUrl = "http://localhost:3000/api/products/";
const getById = function (id) {
  return document.getElementById(id);
};
const createEl = function (tag) {
  return document.createElement(tag);
};

const getProducts = async function (url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Un problème est survenu");
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err.message);
  }
};

const renderProducts = async function (url) {
  try {
    const products = await getProducts(url);
    console.log(products);
    const itemsContainer = getById("items");
    products.forEach((product) => {
      let link = createEl("a");
      link.setAttribute("href", `front/product.html?id=${product._id}`);

      let article = createEl("article");
      link.appendChild(article);

      let img = createEl("img");
      img.setAttribute("src", product.imageUrl);
      img.setAttribute("alt", product.altTxt);
      article.appendChild(img);

      let titre = createEl("h3");
      titre.setAttribute("class", "productName");
      titre.textContent = product.name;
      article.appendChild(titre);

      let para = createEl("p");
      para.setAttribute("class", "productDescription");
      para.textContent = product.description;
      article.appendChild(para);

      itemsContainer.appendChild(link);
    });
  } catch (err) {
    console.log(err);
  }
};

renderProducts(apiUrl);
