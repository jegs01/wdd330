import { renderListWithTemplate } from './utils.mjs';

function capitalizeCategory(category) {
  return category
    .toLowerCase()
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function productCardTemplate(product) {
  document.title = `Top Products: ${capitalizeCategory(product.Category)}`;
  document.querySelector('h2').textContent = `Top Products: ${capitalizeCategory(product.Category)}`;
  let discount = '';
  let discountFlag = '';
  if (product.FinalPrice < product.SuggestedRetailPrice) {
    discount = `<p><em class="product-card__discount">You save $${(product.SuggestedRetailPrice - product.FinalPrice).toFixed(2)}!</em></p>`
    discountFlag = '<h4 class="product-detail__flag">Discounted</h4>';
  };
  return `
    <li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}">
        <img
          src="${product.Images.PrimaryLarge}"
          alt="Image of ${product.Name}"
        />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.Name}</h2>
        <p class="product-card__price">
          <del>$${product.SuggestedRetailPrice.toFixed(2)}</del> 
          $${product.FinalPrice.toFixed(2)}
        </p>
        ${discountFlag}

        ${discount}
      </a>
    </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {

    const list = await this.dataSource.getData(this.category);

    const filteredList = await this.filterProductsWithValidImages(list);

    localStorage.setItem('filteredProducts', JSON.stringify(filteredList));

    this.renderList(filteredList);
  }

  async filterProductsWithValidImages(list) {
    const validProducts = [];
    for (let product of list) {
      if (product.Images && product.Images.PrimaryLarge) {
        const imageExists = await this.checkImageExists(product.Images.PrimaryLarge);
        if (imageExists) {
          validProducts.push(product);
        }
      }
    }
    return validProducts;
  }

  checkImageExists(imagePath) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imagePath;
    });
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}
