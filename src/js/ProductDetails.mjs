import { setLocalStorage, renderCartCount } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
      const storedProducts = JSON.parse(localStorage.getItem('filteredProducts'));
      if (Array.isArray(storedProducts)) {
        this.product = storedProducts.find(
          (product) => product.Id === this.productId
        );
  
        if (!this.product) {
          throw new Error(`Product with ID ${this.productId} not found in local storage.`);
        }
      } else {
        throw new Error('No product data found in local storage.');
      }

      this.renderProductDetails();
  
      document.getElementById('addToCart')
        .addEventListener('click', this.addToCart.bind(this));
  }

  addToCart() {
    let cartItems = JSON.parse(localStorage.getItem('so-cart'));
    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }

    const indexInCart = cartItems.findIndex((item) => item.Id == this.productId); 

    if (indexInCart != -1){
      cartItems[indexInCart].Quantity += 1;
    } else {
      this.product["Quantity"] = 1;
      cartItems.push(this.product);
    }

    setLocalStorage('so-cart', cartItems);
    alert(`${this.product.Brand.Name} has been added to your cart!`);
    renderCartCount();
  }

  renderProductDetails() {
    const productContainer = document.getElementById('productDetails');
  
    document.title = `${this.product.Brand.Name} | ${this.product.NameWithoutBrand}`;

    let discountAmount = '';
    let discountFlag = '';
    if (this.product.FinalPrice < this.product.SuggestedRetailPrice) {
      discountAmount = `<p><em class="product-detail__discount">You save $${(this.product.SuggestedRetailPrice - this.product.FinalPrice).toFixed(2)}!</em></p>`;
      discountFlag = '<h4 class="product-detail__flag">Discounted</h4>';
    };

    productContainer.innerHTML = `
      <h3>${this.product.Brand.Name}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>
      ${discountFlag}
      <img
        class="divider"
        src="${this.product.Images.PrimaryLarge}"
        alt="${this.product.NameWithoutBrand}"
      />
      <p class="product-card__price">
        <del>$${this.product.SuggestedRetailPrice.toFixed(2)}</del> 
        $${this.product.FinalPrice.toFixed(2)}
      </p>
      ${discountAmount}
      <p class="product__color">${this.product.Colors[0]?.ColorName || 'No color available'}</p>
      <p class="product__description">${this.product.DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>
    `;
  }
}
