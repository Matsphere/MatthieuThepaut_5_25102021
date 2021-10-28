const createEl = function (tag, attributes, values) {
  const el = document.createElement(tag);
  if (attributes && values) {
    attributes.forEach((att, i) => el.setAttribute(att, values[i]));
  }
  return el;
};

const calculateTotals = function (cart) {
  const totalQuantity = cart
    ? cart.reduce(function (acc, product) {
        return acc + product.quantity;
      }, 0)
    : 0;

  const totalPrice = cart
    ? cart.reduce(function (acc, prod) {
        return acc + prod.price * prod.quantity;
      }, 0)
    : 0;
  return [totalQuantity, totalPrice];
};

const updateCart = function (
  cart,
  quantity,
  product,
  span1,
  span2,
  para1,
  para2
) {
  const index = cart.findIndex((prod) => prod._id === product._id);
  cart[index].quantity = quantity;
  para2.textContent = quantity;
  para1.textContent = cart[index].price * quantity + "€";
  updateTotals(cart, span1, span2);
  localStorage.setItem("cart", JSON.stringify(cart));
};

const removeItemFromCart = function (cart, product) {
  const index = cart.findIndex((prod) => prod._id === product._id);
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
};

const updateTotals = function (cart, span1, span2) {
  const totals = calculateTotals(cart);
  span1.textContent = totals[0];
  span2.textContent = totals[1];
};
const renderCart = function () {
  const cartContainer = document.getElementById("cart__items");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.forEach((product) => {
    let article = createEl(
      "article",
      ["class", "data-id"],
      ["cart__item", product._id]
    );
    cartContainer.appendChild(article);

    let div1 = createEl("div", ["class"], ["cart__item__img"]);
    article.appendChild(div1);

    let img = createEl(
      "img",
      ["src", "alt"],
      [product.imageUrl, product.altTxt]
    );
    div1.appendChild(img);

    let div2 = createEl("div", ["class"], ["cart__item__content"]);
    article.appendChild(div2);

    let div3 = createEl("div", ["class"], ["cart__item__content__titlePrice"]);
    div2.appendChild(div3);

    let titre = createEl("h2");
    titre.textContent = product.name;
    div3.appendChild(titre);

    let para1 = createEl("p");
    para1.textContent = product.price * product.quantity + "€";
    div3.appendChild(para1);

    let div4 = createEl("div", ["class"], ["cart__item__content__settings"]);
    div2.appendChild(div4);

    let div5 = createEl(
      "div",
      ["class"],
      ["cart__item__content__settings__color"]
    );
    div4.appendChild(div5);

    let para2 = createEl("p");
    para2.textContent = product.color;
    div5.appendChild(para2);

    let div6 = createEl(
      "div",
      ["class"],
      ["cart__item__content__settings__quantity"]
    );
    div4.appendChild(div6);

    let para3 = createEl("p");
    para3.textContent = product.quantity;
    div6.appendChild(para3);

    let input = createEl(
      "input",
      ["type", "class", "name", "min", "max", "value"],
      ["number", "itemQuantity", "itemQuantity", "1", "100", product.quantity]
    );
    div6.appendChild(input);
    input.addEventListener("change", function (e) {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const quantity = Number(input.value);
      updateCart(cart, quantity, product, span1, span2, para1, para3);
    });

    let div7 = createEl(
      "div",
      ["class"],
      ["cart__item__content__settings__delete"]
    );
    div4.appendChild(div7);

    let para4 = createEl("p", ["class"], ["deleteItem"]);
    para4.textContent = "Supprimer";
    div7.appendChild(para4);
    para4.addEventListener("click", function (e) {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      removeItemFromCart(cart, product);
      updateTotals(cart, span1, span2);
      article.remove();
    });
  });

  const totals = calculateTotals(cart);
  let para5 = createEl("p");
  let node1 = document.createTextNode("Total (");
  let node2 = document.createTextNode(" articles) : ");
  let node3 = document.createTextNode(" €");
  let span1 = createEl("span", ["id"], ["totalQuantity"]);
  let span2 = createEl("span", ["id"], ["totalPrice"]);
  updateTotals(cart, span1, span2);

  para5.appendChild(node1);
  para5.appendChild(span1);
  para5.appendChild(node2);
  para5.appendChild(span2);
  para5.appendChild(node3);
  document.querySelector(".cart__price").appendChild(para5);
};

renderCart();
