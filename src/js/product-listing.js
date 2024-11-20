import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { getParam, loadHeaderFooter } from './utils.mjs';

const category = getParam('category');

const dataSource = new ProductData();

const productListElement = document.querySelector('.product-list');

if (category) {
  const productList = new ProductList(category, dataSource, productListElement);
  productList.init();
}

loadHeaderFooter();
