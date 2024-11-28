import { loadHeaderFooter } from './utils.mjs';
import Cart from './ShoppingCart.mjs';

const cart = new Cart('so-cart', document.querySelector('.product-list'));

cart.init();

loadHeaderFooter();

if (cart.total > 0) {
  document.querySelector('.cart-footer').classList.remove('hide');
}
