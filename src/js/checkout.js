import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter();

const checkout = new CheckoutProcess('so-cart', '#orderSummary');
checkout.init();

document.getElementById('checkoutForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;

  const zip = form.zip.value;
  checkout.calculateOrderTotal(zip);

  const formData = checkout.formDataToJSON(form);
  const items = checkout.packageItems();

  const order = {
    orderDate: new Date().toISOString(),
    ...formData,
    items,
    orderTotal: checkout.orderTotal.toFixed(2),
    shipping: checkout.shipping.toFixed(2),
    tax: checkout.tax.toFixed(2),
  };

  console.log('Order data to be sent to the database:', order);
});

