console.log(window.location.search);
const itemContainer = document.querySelector(".item");
const id = window.location.search.slice(4);
const apiUrl = "http://localhost:3000/api/products/";
const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
console.log(cart);
const generateColors = function (colors) {
  return colors.reduce(
    (acc, color) => acc + `<option value="${color}">${color}</option>`,
    ``
  );
};
const getProduct = async function (url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
const renderProduct = async function (url) {
  const product = await getProduct(url);
  console.log(product);
  console.log(product.colors);
  const colors = generateColors(product.colors);
  console.log(colors);

  const markup = `
<article>
    <div class="item__img">
       <img src="${product.imageUrl}" alt="${product.altTxt}"> 
    </div>
    <div class="item__content">
         <div class="item__content__titlePrice">
          <h1 id="title">${product.name}</h1>
          <p>
                  Prix : <span id="price">${product.price}</span>€
          </p>
         </div>

         <div class="item__content__description">
          <p class="item__content__description__title">Description :</p>
          <p id="description">${product.description}
          </p>
         </div>

         <div class="item__content__settings">
            <div class="item__content__settings__color">
                  <label for="color-select">Choisir une couleur :</label>
                  <select name="color-select" id="colors">
                    <option value="">--SVP, choisissez une couleur --</option>
                    ${colors}
            
                  </select>
            </div>

            <div class="item__content__settings__quantity">
                  <label for="itemQuantity"
                    >Nombre d'article(s) (1-100) :</label
                  >
                  <input
                    type="number"
                    name="itemQuantity"
                    min="1"
                    max="100"
                    value="0"
                    id="quantity"
                  />
            </div>
         </div>
         <div class="item__content__addButton">
                <button id="addToCart">Ajouter au panier</button>
        </div>
    </div>
</article>

        `;

  itemContainer.insertAdjacentHTML("afterbegin", markup);
  const btn = document.getElementById("addToCart");
  const quantityContainer = document.getElementById("quantity");
  const colorContainer = document.getElementById("colors");
  console.log(quantityContainer.value);

  btn.addEventListener("click", function (e) {
    const prod = { ...product };
    if (quantityContainer.value < 1 || !colorContainer.value) return;
    const index = cart.findIndex((prod) => prod._id === id);
    console.log(index);

    if (index > -1 && cart[index].colors == colorContainer.value) {
      cart[index].quantity += +quantityContainer.value;
    } else {
      prod.quantity = +quantityContainer.value;
      prod.colors = colorContainer.value;
      cart.push(prod);
    }

    console.log(cart);
    sessionStorage.setItem("cart", JSON.stringify(cart));
  });
};

renderProduct(apiUrl + id);
