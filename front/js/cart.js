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
const updateCart = function (
  products,
  cart,
  quantity,
  item,
  priceCont,
  quantityTotalCont,
  priceTotalCont
) {
  const index = cart.findIndex(
    (prod) => prod._id === item._id && prod.color === item.colors
  );
  cart[index].quantity = quantity;
  products[index].quantity = quantity;
  priceCont.textContent = products[index].price * quantity + "€";
  updateTotals(products, quantityTotalCont, priceTotalCont);
  localStorage.setItem("cart", JSON.stringify(cart));
};

const removeItemFromCart = function (products, cart, item) {
  const index = cart.findIndex(
    (prod) => prod._id === item._id && prod.color === item.color
  );
  cart.splice(index, 1);
  products.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
};

const filterCart = function (cart) {
  const results = [];
  cart.forEach((el) => {
    if (results.findIndex((id) => id === el._id) >= 0) {
      results.push(el._id);
    }
    return results;
  });
};
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

const updateTotals = function (products, quantity, price) {
  const totals = calculateTotals(products);
  quantity.textContent = totals[0];
  price.textContent = totals[1];
};

const bindEventQuantity = function (
  cont,
  products,
  cart,
  product,
  contentPrice,
  quantityTotalCont,
  priceTotalCont
) {
  cont.addEventListener("change", function () {
    const quantity = Number(cont.value);
    updateCart(
      products,
      cart,
      quantity,
      product,
      contentPrice,
      quantityTotalCont,
      priceTotalCont
    );
  });
};

const bindEventDelete = function (
  cont,
  products,
  cart,
  product,
  quantityTotalCont,
  priceTotalCont,
  article
) {
  cont.addEventListener("click", function () {
    removeItemFromCart(products, cart, product);
    updateTotals(products, quantityTotalCont, priceTotalCont);
    article.remove();
  });
};
const checkName = function () {
  const firstName = getById("firstName").value;
  const lastName = getById("lastName").value;
  const pattern =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
  if (pattern.test(firstName)) {
    if (pattern.test(lastName)) {
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

const checkAddress = function () {
  const address = getById("address").value;
  const pattern = /^[0-9]{0,3} ?[a-zA-Z\s,-]+ ?([0-9]{2}|[0-9]{5})?$/;
  if (pattern.test(address)) {
    return true;
  } else {
    getById("addressErrorMsg").textContent = "Adresse invalide!";
    return false;
  }
};

const checkCity = function () {
  const city = getById("city").value;
  const pattern =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+(( |-)?[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð])*$/;
  if (pattern.test(city)) {
    return true;
  } else {
    getById("cityErrorMsg").textContent = "Ville invalide!";
    return false;
  }
};

const checkEmail = function () {
  const email = getById("email").value;
  const pattern =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
  if (pattern.test(email)) {
    return true;
  } else {
    getById("emailErrorMsg").textContent = "Email invalide!";
    return false;
  }
};
const bindEventOrder = function (cart, apiUrl) {
  const btn = getById("order");
  btn.addEventListener("click", async function (e) {
    e.preventDefault();
    if (!cart) {
      alert("Panier vide");
      return;
    }
    if (checkName() && checkAddress() && checkCity() && checkEmail()) {
      const products = filterCart(cart);
      console.log(products);
      const contact = {
        firstName: getById("firstName").value,
        lastName: getById("lastName").value,
        address: getById("address").value,
        city: getById("city").value,
        email: getById("email").value,
        products: products,
      };
      console.log(contact);

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
          if (data.orderId) {
            window.location.href = `confirmation.html?id=${data.orderId}`;
          } else throw new Error("Un problème est survenu!");
        })
        .catch((err) => console.log(err.message));
    } else return;
  });
};

const init = async function () {
  if (new URLSearchParams(document.location.search).get("id")) {
    getById("orderId").textContent = new URLSearchParams(
      document.location.search
    ).get("id");
  } else {
    const quantityTotalCont = getById("totalQuantity");
    const priceTotalCont = getById("totalPrice");
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

      const contentPrice = createEl("p");
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
        ["number", "itemQuantity", "itemQuantity", "1", "100", product.quantity]
      );
      divContentSettings.appendChild(settingsQuantityCont);
      bindEventQuantity(
        settingsQuantityCont,
        products,
        cart,
        product,
        contentPrice,
        quantityTotalCont,
        priceTotalCont
      );

      const divSettingsDelete = createEl(
        "div",
        ["class"],
        ["cart__item__content__settings__delete"]
      );
      divContentSettings.appendChild(divSettingsDelete);

      const settingsDelete = createEl("p", ["class"], ["deleteItem"]);
      settingsDelete.textContent = "Supprimer";
      divSettingsDelete.appendChild(settingsDelete);
      bindEventDelete(
        settingsDelete,
        products,
        cart,
        product,
        quantityTotalCont,
        priceTotalCont,
        article
      );
    });

    updateTotals(products, quantityTotalCont, priceTotalCont);

    bindEventOrder(cart, apiUrl);
  }
};

init();
