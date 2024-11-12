import { setLocalStorage, renderCartCount } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);

    this.renderProductDetails();

    document.getElementById('addToCart')
      .addEventListener('click', this.addToCart.bind(this));
  }

  addToCart() {
    let cartItems = JSON.parse(localStorage.getItem('so-cart'));
    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }

    cartItems.push(this.product);
    setLocalStorage('so-cart', cartItems);
    alert(`${this.product.Brand.Name} has been added to your cart!`);
    renderCartCount();
  }

  renderProductDetails() {
    const productContainer = document.getElementById('productDetails');
    document.title = `${this.product.Brand.Name} | ${this.product.NameWithoutBrand}`;
    productContainer.innerHTML = `
      <h3>${this.product.Brand.Name}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>
      <img
        class="divider"
        src="${this.product.Image}"
        alt="${this.product.NameWithoutBrand}"
      />
      <p class="product-card__price">$${this.product.FinalPrice.toFixed(2)}</p>
      <p class="product__color">${this.product.Colors[0].ColorName}</p>
      <p class="product__description">${this.product.DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>
    `;
  }

}
