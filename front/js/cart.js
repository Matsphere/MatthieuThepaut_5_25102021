const cartContainer = document.getElementById("cart__items");
const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
const renderCart = function (cart) {
  cart.forEach((product) => {
    cartContainer.insertAdjacentHTML(
      "afterbegin",
      `
        <article class="cart__item" data-id="${product._id}">
                <div class="cart__item__img">
                  <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__titlePrice">
                    <h2>${product.name}</h2>
                    <p>${product.price}€</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : ${product.quantity}</p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
        </article>`
    );
  });
};

renderCart(cart);
const deleteButtons = document.querySelectorAll(".deleteItem");
const quantityContainers = document.querySelectorAll(".itemQuantity");
quantityContainers.forEach((cont) => {
  cont.addEventListener("change", function (e) {});
});
deleteButtons.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const id = e.target.closest(".cart__item").getAttribute("data-id");
    console.log(id);
    const index = cart.findIndex((prod) => prod._id === id);
    console.log(index);
    cart.splice(index, 1);
    console.log(cart);

    renderCart(cart);
    sessionStorage.setItem("cart", JSON.stringify(cart));
  });
});
