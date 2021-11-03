"use strict";
const apiUrl = "http://localhost:3000/api/products/";
const getById = function (id) {
  return document.getElementById(id);
};
const createEl = function (tag, attributes, values) {
  const el = document.createElement(tag);
  if (attributes && values) {
    attributes.forEach((attr, i) => el.setAttribute(attr, values[i]));
  }
  return el;
};

const getProducts = async function (url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Un problème est survenu");
    const data = response.json();
    return data;
  } catch (err) {
    console.log(err.message);
  }
};

const renderProducts = async function (url) {
  try {
    const products = await getProducts(url);
    const itemsContainer = getById("items");
    products.forEach((product) => {
      let link = createEl("a", ["href"], [`product.html?id=${product._id}`]);

      let article = createEl("article");
      link.appendChild(article);

      let img = createEl(
        "img",
        ["src", "alt"],
        [product.imageUrl, product.altTxt]
      );
      article.appendChild(img);

      let titre = createEl("h3", ["class"], ["productName"]);
      titre.textContent = product.name;
      article.appendChild(titre);

      let para = createEl("p", ["class"], ["productDescription"]);
      para.textContent = product.description;
      article.appendChild(para);

      itemsContainer.appendChild(link);
    });
  } catch (err) {
    console.log(err);
  }
};

renderProducts(apiUrl);
