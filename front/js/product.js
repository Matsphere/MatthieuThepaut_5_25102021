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

const bindEvent = function (product, id) {
  const button = getById("addToCart");
  const colorCont = getById("colors");
  const quantityCont = getById("quantity");
  button.addEventListener("click", function (e) {
    if (+quantityCont.value < 1) return alert("Sélectionnez une quantité!");
    if (+quantityCont.value > 100)
      return alert("La quantité doit être inférieure à 100");
    if (!colorCont.value) return alert("Sélectionnez une couleur!");
    addToCart(product, quantityCont, colorCont, id);
  });
};
const addToCart = function (product, quantity, color, id) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const prod = {
    _id: product._id,
    color: "",
    quantity: 0,
  };
  const index = alreadyInCart(cart, color, id);
  if (index === false) {
    prod.quantity = Number(quantity.value);
    prod.color = color.value;
    console.log("nouvel objet");
    cart.push(prod);
  } else {
    cart[index].quantity += Number(quantity.value);
    console.log("objet déjà dans panier");
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  console.log(cart);
};

const alreadyInCart = function (cart, color, id) {
  const index = cart.findIndex(
    (prod) => prod.color === color.value && prod._id === id
  );
  if (index > -1) return index;
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
    const data = response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
const renderProduct = async function (url) {
  const id = new URLSearchParams(document.location.search).get("id");
  const product = await getProduct(url + id);
  console.log(product);

  const img = createEl(
    "img",
    ["src", "alt"],
    [product.imageUrl, product.altTxt]
  );
  document.querySelector(".item__img").appendChild(img);

  const titre = getById("title");
  titre.textContent = product.name;

  const price = getById("price");
  price.textContent = product.price;

  const description = getById("description");
  description.textContent = product.description;

  const options = product.colors.map((color) => generateColor(color));
  options.forEach((option) => {
    getById("colors").appendChild(option);
  });

  bindEvent(product, id);
};
renderProduct(apiUrl);
