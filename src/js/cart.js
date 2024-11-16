import { getLocalStorage, renderCartCount, setLocalStorage } from './utils.mjs';

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');
  renderCartCount();
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <div class="cart-card__remove">
    <span class="removeFromCart" data-id="${item.Id}">X</span>
    <p class="cart-card__quantity">qty: 1</p>
  </div>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function removeFromCart(itemId) {
  if (itemId != null) {
    const cartItems = getLocalStorage('so-cart');

    for (let i = 0; i < cartItems.length; i++) {
      if (cartItems[i].Id === itemId){
        cartItems.splice(i, 1);
      };
    };

    setLocalStorage('so-cart', cartItems);
    renderCartContents();
  };
}

renderCartContents();

const cartList = document.querySelector('.product-list');

cartList.addEventListener('click', function(e) {
  removeFromCart(e.target.getAttribute('data-id'));
})