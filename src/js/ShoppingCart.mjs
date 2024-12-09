import { getLocalStorage, setLocalStorage, renderCartCount } from './utils.mjs';

// Template function for a cart item
function cartItemTemplate(item, index) {
  return `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img
          src="${item.Images.PrimaryMedium}" 
          alt="${item.NameWithoutBrand}"
        />
      </a>
      <a href="#">
        <h2 class="card__name">${item.NameWithoutBrand}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0]?.ColorName || 'No color specified'}</p>
      <p class="cart-card__quantity">Qty: 
        <button class="decrement-quantity" data-index="${index}">-</button>
        ${item.Quantity}
        <button class="increment-quantity" data-index="${index}">+</button>
      </p>
      <p class="cart-card__price">$${(item.FinalPrice * item.Quantity).toFixed(2)}</p>
      <span class="remove-item" data-index="${index}">X</span>
    </li>`;
}

// Cart class to manage cart operations
export default class Cart {
  constructor(cartKey, listElement) {
    this.cartKey = cartKey;
    this.listElement = listElement;
  }

  getCartItems() {
    return getLocalStorage(this.cartKey) || [];
  }

  setCartItems(items) {
    setLocalStorage(this.cartKey, items);
    renderCartCount();
  }

  removeItemFromCart(index) {
    const cartItems = this.getCartItems();
    cartItems.splice(index, 1);
    this.setCartItems(cartItems);
    this.renderCartContents();
  }

  addRemoveItemListeners() {
    const removeButtons = this.listElement.querySelectorAll('.remove-item');
    removeButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const itemIndex = parseInt(event.target.dataset.index, 10);
        this.removeItemFromCart(itemIndex);
      });
    });
  }

  addQuantityListeners() {
    const incrementButtons = this.listElement.querySelectorAll('.increment-quantity');
    const decrementButtons = this.listElement.querySelectorAll('.decrement-quantity');

    incrementButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const index = parseInt(event.target.dataset.index, 10);
        this.changeItemQuantity(index, 1);
      });
    });

    decrementButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const index = parseInt(event.target.dataset.index, 10);
        this.changeItemQuantity(index, -1);
      });
    });
  }

  changeItemQuantity(index, delta) {
    const cartItems = this.getCartItems();
    if (cartItems[index]) {
      cartItems[index].Quantity = Math.max(1, cartItems[index].Quantity + delta);
      this.setCartItems(cartItems);
      this.renderCartContents();
    }
  }

  addToCart(newItem) {
    const cartItems = this.getCartItems();
    const existingItemIndex = cartItems.findIndex((item) => item.Id === newItem.Id);

    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].Quantity += 1;
    } else {
      newItem.Quantity = 1;
      cartItems.push(newItem);
    }

    this.setCartItems(cartItems);
    this.renderCartContents();
  }

  renderCartContents() {
    const cartItems = this.getCartItems();
    const htmlItems = cartItems.map((item, index) => cartItemTemplate(item, index));
    this.listElement.innerHTML = htmlItems.join('');
    this.addRemoveItemListeners();
    this.addQuantityListeners();
    this.renderCartTotal(cartItems);
  }

  renderCartTotal(cartItems) {
    const cartFooter = document.querySelector('.cart-footer');
    const cartTotalElement = cartFooter.querySelector('.cart-total');

    if (cartItems.length > 0) {
      const total = cartItems.reduce((sum, item) => sum + item.FinalPrice * item.Quantity, 0);
      cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
      cartFooter.classList.remove('hide');
    } else {
      cartFooter.classList.add('hide');
    }
  }

  init() {
    this.renderCartContents();
  }
}
