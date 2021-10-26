const apiUrl = "http://localhost:3000/api/products/";
const getById = function (id) {
  return document.getElementById(id);
};
const createEl = function (tag) {
  return document.createElement(tag);
};

const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
console.log(cart);
const generateColor = function (color) {
  const option = createEl("option");
  option.setAttribute("value", color);
  option.textContent = color;
  return option;
};
const getProduct = async function (url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Un problème est survenu!");
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
const renderProduct = async function (url) {
  const id = new URLSearchParams(document.location.search).get("id");
  const product = await getProduct(url + id);
  const itemContainer = document.querySelector(".item");
  console.log(product);

  let article = createEl("article");
  itemContainer.appendChild(article);

  let div1 = createEl("div");
  div1.setAttribute("class", "item__img");
  article.appendChild(div1);

  let img = createEl("img");
  img.setAttribute("src", product.imageUrl);
  img.setAttribute("alt", product.altTxt);
  div1.appendChild(img);

  let div2 = createEl("div");
  div2.setAttribute("class", "item__content");
  article.appendChild(div2);

  let div3 = createEl("div");
  div3.setAttribute("class", "item__content__titlePrice");
  div2.appendChild(div3);

  let titre = createEl("h1");
  titre.setAttribute("id", "title");
  titre.textContent = product.name;
  div3.appendChild(titre);

  let para1 = createEl("p");
  let node1 = document.createTextNode("Prix : ");
  let node2 = document.createTextNode("€");
  let span1 = createEl("span");
  span1.setAttribute("id", "price");
  span1.textContent = product.price;
  para1.appendChild(node1);
  para1.appendChild(span1);
  para1.appendChild(node2);
  div3.appendChild(para1);

  let div4 = createEl("div");
  div4.setAttribute("class", "item__content__description");
  div2.appendChild(div4);

  let para2 = createEl("p");
  para2.setAttribute("class", "item__content__description__title");
  para2.textContent = "Descritpion :";
  div4.appendChild(para2);

  let para3 = createEl("p");
  para3.setAttribute("id", "description");
  para3.textContent = product.description;
  div4.appendChild(para3);

  let div5 = createEl("div");
  div5.setAttribute("class", "item__content__settings");
  div2.appendChild(div5);

  let div6 = createEl("div");
  div6.setAttribute("class", "item__content__settings__color");
  div5.appendChild(div6);

  let label1 = createEl("label");
  label1.setAttribute("for", "color-select");
  label1.textContent = "Choisir une couleur :";
  div6.appendChild(label1);

  let select = createEl("select");
  select.setAttribute("name", "color-select");
  select.setAttribute("id", "colors");
  div6.appendChild(select);

  let option = createEl("option");
  option.setAttribute("value", "");
  option.textContent = "--SVP, choisissez une couleur --";
  select.appendChild(option);

  const options = product.colors.map((color) => generateColor(color));
  options.forEach((option) => {
    select.appendChild(option);
  });

  let div7 = createEl("div");
  div7.setAttribute("class", "item__content__settings__quantity");
  div5.appendChild(div7);

  let label2 = createEl("label");
  label2.setAttribute("for", "itemQuantity");
  label2.textContent = "Nombre d'article(s) (1-100) :";
  div7.appendChild(label2);

  let input = createEl("input");
  input.setAttribute("type", "number");
  input.setAttribute("name", "itemQuantity");
  input.setAttribute("min", "1");
  input.setAttribute("max", "100");
  input.setAttribute("value", "0");
  input.setAttribute("id", "quantity");
  div7.appendChild(input);

  let div8 = createEl("div");
  div8.setAttribute("class", "item__content__addButton");
  div2.appendChild(div8);

  let button = createEl("button");
  button.setAttribute("id", "addToCart");
  button.textContent = "Ajouter au panier";
  // button.addEventListener("click", function (e) {
  //   const prod = { ...product };
  //   if (quantityContainer.value < 1 || !colorContainer.value) return;
  //   const index = cart.findIndex((prod) => prod._id === id);
  //   console.log(index);

  //   if (index > -1 && cart[index].colors == colorContainer.value) {
  //     cart[index].quantity += +quantityContainer.value;
  //   } else {
  //     prod.quantity = +quantityContainer.value;
  //     prod.colors = colorContainer.value;
  //     cart.push(prod);
  //   }

  //   console.log(cart);
  //   sessionStorage.setItem("cart", JSON.stringify(cart));
  // });
  div8.appendChild(button);
};

renderProduct(apiUrl);
