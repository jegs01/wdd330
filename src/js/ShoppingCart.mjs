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
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice.toFixed(2)}</p>
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
  }

  removeItemFromCart(index) {
    const cartItems = this.getCartItems();
    cartItems.splice(index, 1); 
    this.setCartItems(cartItems);
    this.renderCartContents(); 
    renderCartCount();
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

  renderCartContents() {
    const cartItems = this.getCartItems();
    const htmlItems = cartItems.map((item, index) => cartItemTemplate(item, index));
    this.listElement.innerHTML = htmlItems.join('');
    this.addRemoveItemListeners();
    this.renderCartTotal(cartItems);
  }

  renderCartTotal(cartItems) {
    const cartFooter = document.querySelector('.cart-footer');
    const cartTotalElement = cartFooter.querySelector('.cart-total');
  
    if (cartItems.length > 0) {
      const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
      cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
      cartFooter.classList.remove('hide');
    } else {
      cartFooter.classList.add('hide');
    }
  }

  init() {
    const cartItems = this.getCartItems();
    this.renderCartContents();
    this.renderCartTotal(cartItems);
  }
}
