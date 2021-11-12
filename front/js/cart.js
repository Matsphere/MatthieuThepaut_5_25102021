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
 * @param {array} array of all attributes to set
 * @param {array} array of all values of the attributes
 * @returns {element} the element created
 */
const createEl = function (tag, attributes, values) {
  const el = document.createElement(tag);
  if (attributes && values) {
    attributes.forEach((attr, i) => el.setAttribute(attr, values[i]));
  }
  return el;
};
/**
 * Get all the products from the API
 * @param {string} url of the Api
 * @returns {array} an array of all the products
 */
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
/**
 * Filters the product in the cart from the catalog of all products
 * @param {array} cart containing the id, color and quantity for each product selected
 * @param {string} apiUrl url of the api
 * @returns {array} an array containing the objects of the products in the cart
 */
const createCart = async function (cart, apiUrl) {
  const catalog = await getProducts(apiUrl);
  const results = [];
  cart.forEach(function (el, i) {
    console.log(el);
    const index = catalog.findIndex((item) => item._id === el._id);
    const prod = { ...catalog[index] };
    prod.colors = el.color;
    prod.quantity = el.quantity;
    results.push(prod);
  });
  return results;
};
/**
 * Updates the quantity of products in the cart and the information on the page (quantity, price, total price and total quantity)
 * @param {array} products an array containing the products in the cart
 * @param {number} quantity new quantity of the product
 * @param {object} item Product being updated
 */
const updateCart = function (products, quantity, item) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const priceCont = document.querySelector(".cart__item__content__price");
  const index = cart.findIndex(
    (prod) => prod._id === item._id && prod.color === item.colors
  );
  cart[index].quantity = quantity;
  products[index].quantity = quantity;
  priceCont.textContent = products[index].price * quantity + "€";
  updateTotals(products);
  localStorage.setItem("cart", JSON.stringify(cart));
};
/**
 * Removes the item from the cart
 * @param {Array} products an array containing the products in the cart
 * @param {object} item Product being removed
 */
const removeItemFromCart = function (products, item) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex(
    (prod) => prod._id === item._id && prod.color === item.colors
  );
  console.log(item);
  console.log(index);
  cart.splice(index, 1);
  products.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
};

/**
 * filters the cart to extract the id of the products ordered
 * @param {array} cart containing the id, color and quantity for each product selected
 */
const filterCart = function (cart) {
  const results = [];
  cart.forEach((el) => {
    if (results.findIndex((id) => id === el._id) < 0) {
      results.push(el._id);
    }
  });
  return results;
};
/**
 * Calaculate the total quantity and price of the products in the cart
 * @param {array} products an array containing the products in the cart
 * @returns {array} [Total quantity of products(number), Total price of the products(number)]
 */
const calculateTotals = function (products) {
  const totalQuantity = products
    ? products.reduce(function (acc, product) {
        return acc + product.quantity;
      }, 0)
    : 0;

  const totalPrice = products
    ? products.reduce(function (acc, prod) {
        return acc + prod.price * prod.quantity;
      }, 0)
    : 0;
  return [totalQuantity, totalPrice];
};
/**
 * Updates the total quantity of products and the total price
 * @param {Array} products an array containing the products in the cart
 */
const updateTotals = function (products) {
  const quantity = getById("totalQuantity");
  const price = getById("totalPrice");
  const totals = calculateTotals(products);
  quantity.textContent = totals[0];
  price.textContent = totals[1];
};
/**
 * function executed by the event listener to update the quantity of products
 * @param {Object} event event "change" dof the quantity input of the product
 * @param {Array} products an array containing the products in the cart
 * @param {Object} product Product being updated
 */
const change = function (event, products, product) {
  if (Number(event.target.value) < 1) {
    event.target.value = product.quantity;
    alert("La quantité doit être au moins égale à 1");
  } else if (Number(cont.value) > 100) {
    event.target.value = product.quantity;
    alert("La quantité doit être inférieure à 100");
  } else {
    const quantity = Number(event.target.value);
    updateCart(products, quantity, product);
  }
};
/**
 function executed by the event listener to delete the product from the cart
 * @param {Array} products an array containing the products in the cart
 * @param {Object} product Product being removed
 * @param {Object} article Html article element being removed for the DOM
 */
const deleteArticle = function (products, product, article) {
  removeItemFromCart(products, product);
  updateTotals(products);
  article.remove();
};
/**
 * Checks the format of the first name and last name input field
 * @returns True if the names are correctly written, False otherwise
 */
const checkName = function () {
  const firstName = getById("firstName").value;
  const lastName = getById("lastName").value;
  const pattern =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð '-]+$/u;
  if (pattern.test(firstName)) {
    getById("firstNameErrorMsg").textContent = "";

    if (pattern.test(lastName)) {
      getById("lastNameErrorMsg").textContent = "";
      return true;
    } else {
      getById("lastNameErrorMsg").textContent = "Nom de famille invalide!";
      return false;
    }
  } else {
    getById("firstNameErrorMsg").textContent = "Prénom invalide!";
    return false;
  }
};
/**
 * Checks the format of the address input field
 * @returns True if the address is correctly written, False otherwise
 */
const checkAddress = function () {
  const address = getById("address").value;
  const pattern = /^[0-9]{0,3} ?[a-zA-Z\s,-]+ ?([0-9]{2}|[0-9]{5})?$/;
  if (pattern.test(address)) {
    getById("addressErrorMsg").textContent = "";
    return true;
  } else {
    getById("addressErrorMsg").textContent = "Adresse invalide!";
    return false;
  }
};
/**
 * Checks the format of the city input field
 * @returns True if the city is correctly written, False otherwise
 */
const checkCity = function () {
  const city = getById("city").value;
  const pattern =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(( |-)?[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð])*$/;
  if (pattern.test(city)) {
    getById("cityErrorMsg").textContent = "";
    return true;
  } else {
    getById("cityErrorMsg").textContent = "Ville invalide!";
    return false;
  }
};
/**
 * Checks the format of the email input field
 * @returns True if the email is correctly written, False otherwise
 */
const checkEmail = function () {
  const email = getById("email").value;
  const pattern =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
  if (pattern.test(email)) {
    getById("emailErrorMsg").textContent = "";
    return true;
  } else {
    getById("emailErrorMsg").textContent = "Email invalide!";
    return false;
  }
};
/**
 * Adds the event listener to validate the order and send the post request
 * @param {Array} cart containing the id, color and quantity for each product selected
 * @param {string} apiUrl url of the API
 */
const bindEventOrder = function (cart, apiUrl) {
  const btn = getById("order");
  btn.addEventListener("click", async function (e) {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Panier vide");
      return;
    }
    if (checkName() && checkAddress() && checkCity() && checkEmail()) {
      const products = filterCart(cart);
      console.log(cart);
      const contact = {
        firstName: getById("firstName").value,
        lastName: getById("lastName").value,
        address: getById("address").value,
        city: getById("city").value,
        email: getById("email").value,
      };
      console.log(contact);
      console.log(products);

      fetch(apiUrl + "order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contact: contact,
          products: products,
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Un problème est survenu");
          else return response.json();
        })
        .then((data) => {
          console.log(data);
          if (data.orderId) {
            localStorage.removeItem("cart");
            window.location.href = `confirmation.html?id=${data.orderId}`;
          } else throw new Error("Un problème est survenu!");
        })
        .catch((err) => console.log(err.message));
    } else return;
  });
};
/**
 * Initialise the page, create the cart and add the events handler and display the order id on the confirmation page
 */
const init = async function () {
  try {
    if (new URLSearchParams(document.location.search).get("id")) {
      getById("orderId").textContent = new URLSearchParams(
        document.location.search
      ).get("id");
    } else {
      const cartContainer = document.getElementById("cart__items");
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const products = await createCart(cart, apiUrl);

      console.log(products);
      products.forEach((product) => {
        const article = createEl(
          "article",
          ["class", "data-id"],
          ["cart__item", product._id]
        );
        cartContainer.appendChild(article);

        const divImg = createEl("div", ["class"], ["cart__item__img"]);
        article.appendChild(divImg);

        const img = createEl(
          "img",
          ["src", "alt"],
          [product.imageUrl, product.altTxt]
        );
        divImg.appendChild(img);

        const divContent = createEl("div", ["class"], ["cart__item__content"]);
        article.appendChild(divContent);

        const divContentPrice = createEl(
          "div",
          ["class"],
          ["cart__item__content__titlePrice"]
        );
        divContent.appendChild(divContentPrice);

        const contentTitle = createEl("h2");
        contentTitle.textContent = product.name;
        divContentPrice.appendChild(contentTitle);

        const contentPrice = createEl(
          "p",
          ["class"],
          ["cart__item__content__price"]
        );
        contentPrice.textContent = product.price * product.quantity + "€";
        divContentPrice.appendChild(contentPrice);

        const divContentSettings = createEl(
          "div",
          ["class"],
          ["cart__item__content__settings"]
        );
        divContent.appendChild(divContentSettings);

        const divSettingsColor = createEl(
          "div",
          ["class"],
          ["cart__item__content__settings__color"]
        );
        divContentSettings.appendChild(divSettingsColor);

        const settingsColor = createEl("p");
        settingsColor.textContent = product.colors;
        divContentSettings.appendChild(settingsColor);

        const divSettingsQuantity = createEl(
          "div",
          ["class"],
          ["cart__item__content__settings__quantity"]
        );
        divContentSettings.appendChild(divSettingsQuantity);

        const settingsQuantity = createEl("p");
        settingsQuantity.textContent = "Qté : ";
        divContentSettings.appendChild(settingsQuantity);

        const settingsQuantityCont = createEl(
          "input",
          ["type", "class", "name", "min", "max", "value"],
          [
            "number",
            "itemQuantity",
            "itemQuantity",
            "1",
            "100",
            product.quantity,
          ]
        );
        divContentSettings.appendChild(settingsQuantityCont);
        settingsQuantityCont.addEventListener("change", function (e) {
          change(e, products, product);
        });

        const divSettingsDelete = createEl(
          "div",
          ["class"],
          ["cart__item__content__settings__delete"]
        );
        divContentSettings.appendChild(divSettingsDelete);

        const settingsDelete = createEl("p", ["class"], ["deleteItem"]);
        settingsDelete.textContent = "Supprimer";
        divSettingsDelete.appendChild(settingsDelete);
        settingsDelete.addEventListener("click", function (e) {
          deleteArticle(products, product, article);
        });
      });

      updateTotals(products);

      bindEventOrder(cart, apiUrl);
    }
  } catch (err) {
    console.log(err.message);
  }
};

init();
