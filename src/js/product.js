import ProductDetails from './ProductDetails.mjs';
import { getParam, loadHeaderFooter } from './utils.mjs';

const productId = getParam('product');

const product = new ProductDetails(productId);

product.init();

loadHeaderFooter();