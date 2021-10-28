const apiUrl = "http://localhost:3000/api/products/";
const getById = function (id) {
  return document.getElementById(id);
};
const createEl = function (tag, attributes, values) {
  const el = document.createElement(tag);
  if (attributes && values) {
    attributes.forEach((att, i) => el.setAttribute(att, values[i]));
  }
  return el;
};

const addToCart = function (product, input, select, id) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const prod = {
    _id: product._id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    altTxt: product.altTxt,
  };
  const index = alreadyInCart(cart, select, id);
  if (index === false) {
    prod.quantity = Number(input.value);
    prod.color = select.value;
    console.log("nouvel objet");
    cart.push(prod);
  } else {
    cart[index].quantity += Number(input.value);
    console.log("objet déjà dans panier");
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  console.log(cart);
};

const alreadyInCart = function (cart, select, id) {
  const index = cart.findIndex((prod) => prod.color === select.value);
  if (index > -1 && cart[index]._id === id) return index;
  else return false;
};
const generateColor = function (color) {
  const option = createEl("option", ["value"], [color]);
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

  let div1 = createEl("div", ["class"], ["item__img"]);
  article.appendChild(div1);

  let img = createEl("img", ["src", "alt"], [product.imageUrl, product.altTxt]);
  div1.appendChild(img);

  let div2 = createEl("div", ["class"], ["item__content"]);
  article.appendChild(div2);

  let div3 = createEl("div", ["class"], ["item__content__titlePrice"]);
  div2.appendChild(div3);

  let titre = createEl("h1", ["id"], ["title"]);
  titre.textContent = product.name;
  div3.appendChild(titre);

  let para1 = createEl("p");
  let node1 = document.createTextNode("Prix : ");
  let node2 = document.createTextNode("€");
  let span1 = createEl("span", ["id"], ["price"]);
  span1.textContent = product.price;
  para1.appendChild(node1);
  para1.appendChild(span1);
  para1.appendChild(node2);
  div3.appendChild(para1);

  let div4 = createEl("div", ["class"], ["item__content__description"]);
  div2.appendChild(div4);

  let para2 = createEl("p", ["class"], ["item__content__description__title"]);
  para2.textContent = "Descritpion :";
  div4.appendChild(para2);

  let para3 = createEl("p", ["id"], ["description"]);
  para3.textContent = product.description;
  div4.appendChild(para3);

  let div5 = createEl("div", ["class"], ["item__content__settings"]);
  div2.appendChild(div5);

  let div6 = createEl("div", ["class"], ["item__content__settings__color"]);
  div5.appendChild(div6);

  let label1 = createEl("label", ["for"], ["color-select"]);
  label1.textContent = "Choisir une couleur :";
  div6.appendChild(label1);

  let select = createEl("select", ["name", "id"], ["color-select", "colors"]);
  div6.appendChild(select);

  let option = createEl("option", ["value"], [""]);
  option.textContent = "--SVP, choisissez une couleur --";
  select.appendChild(option);

  const options = product.colors.map((color) => generateColor(color));
  options.forEach((option) => {
    select.appendChild(option);
  });

  let div7 = createEl("div", ["class"], ["item__content__settings__quantity"]);
  div5.appendChild(div7);

  let label2 = createEl("label", ["for"], ["itemQuantity"]);
  label2.textContent = "Nombre d'article(s) (1-100) :";
  div7.appendChild(label2);

  let input = createEl(
    "input",
    ["type", "name", "min", "max", "value", "id"],
    ["number", "itemQuantity", "1", "100", "0", "quantity"]
  );
  div7.appendChild(input);

  let div8 = createEl("div", ["class"], ['"item__content__addButton"']);
  div2.appendChild(div8);

  let button = createEl("button", ["id"], ["addToCart"]);
  button.textContent = "Ajouter au panier";
  button.addEventListener("click", function (e) {
    if (+input.value < 1 || !select.value) return alert("Choix");
    addToCart(product, input, select, id);
  });
  div8.appendChild(button);
};
console.log(false + 1);
renderProduct(apiUrl);
