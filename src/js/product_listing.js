import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { getParam, loadHeaderFooter } from './utils.mjs';

const category = getParam('category');

const dataSource = new ExternalServices();

const productListElement = document.querySelector('.product-list');

if (category) {
  const productList = new ProductList(category, dataSource, productListElement);
  productList.init();
}

loadHeaderFooter();
