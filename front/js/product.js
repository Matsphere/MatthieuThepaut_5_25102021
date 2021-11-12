const apiUrl = "http://localhost:3000/api/products/";
/**
 * @param {string} id of an element
 * @returns {element} Html element linked to the id
 */
const getById = function (id) {
  return document.getElementById(id);
};
/**
 * Creates an html element
 * @param {tag} tag of the html element to create
 * @param {array} attributes array of all attributes to set
 * @param {array} values array of all values of the attributes
 * @returns {element} the element created
 */
const createEl = function (tag, attributes, values) {
  const el = document.createElement(tag);
  if (attributes && values) {
    attributes.forEach((att, i) => el.setAttribute(att, values[i]));
  }
  return el;
};
/**
 * Bind an event listener to add to cart when the button is pressed
 * @param {Object} product object of the product
 * @param {string} id of the product
 */
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
/**
 * Adds the product to the cart
 * @param {Object} product of theproduct
 * @param {number} quantity of products
 * @param {string} color of the product
 * @param {string} id of the product
 */
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
    alert("Le produit a été ajouté au panier!");
    cart.push(prod);
  } else {
    if (cart[index].quantity + Number(quantity.value) > 100)
      alert("La quantité doit être inférieure à 100");
    else {
      cart[index].quantity += Number(quantity.value);
      console.log("objet déjà dans panier");
      alert("Le produit a été ajouté au panier!");
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  console.log(cart);
};
/**
 * Checks if the product is already in the cart
 * @param {array} cart containing the id, the color and quantity of the products added
 * @param {string} color of the current product being selected
 * @param {string} id of the current product being selected
 * @returns Returns the index of the product in the cart if the product is already in it. Otherwise returns false
 */
const alreadyInCart = function (cart, color, id) {
  const index = cart.findIndex(
    (prod) => prod.color === color.value && prod._id === id
  );
  if (index > -1) return index;
  else return false;
};
/**
 * Generates the color option HTML element
 * @param {string} color option of the product
 * @returns an html element for the color option
 */
const generateColor = function (color) {
  const option = createEl("option", ["value"], [color]);
  option.textContent = color;
  return option;
};
/**
 * Get the current product from the API
 * @param {string} url of the Api and the id of the product
 * @returns {object} an object containing the current products info
 */
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

/**
 * Creates the product card and adds the event listener to add the product to cart
 * @param {string} url of thr API
 */
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
