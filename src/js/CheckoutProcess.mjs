import { getLocalStorage } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init(zipCode = '00000') {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
    this.calculateOrderTotal(zipCode);
  }

  calculateItemSummary() {
    const subtotal = this.list.reduce(
      (total, item) => total + item.FinalPrice * item.Quantity,
      0
    );
    const itemCount = this.list.reduce((count, item) => count + item.Quantity, 0);

    const output = document.querySelector(this.outputSelector);
    output.innerHTML = `
      <p>Subtotal (${itemCount} items): $${subtotal.toFixed(2)}</p>
    `;
    this.itemTotal = subtotal;
  }

  calculateOrderTotal(zipCode) {
    const shippingRate = 10.0;
    const taxRate = 0.08;

    this.shipping = shippingRate;
    this.tax = this.itemTotal * taxRate;
    this.orderTotal = this.itemTotal + this.shipping + this.tax;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const output = document.querySelector(this.outputSelector);
    output.innerHTML += `
      <p>Shipping: $${this.shipping.toFixed(2)}</p>
      <p>Tax: $${this.tax.toFixed(2)}</p>
      <p><strong>Order Total: $${this.orderTotal.toFixed(2)}</strong></p>
    `;
  }

  packageItems() {
    return this.list.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: item.Quantity,
    }));
  }

  async checkout(form) {
    try {
      const formData = this.formDataToJSON(form);
      const items = this.packageItems();

      const order = {
        orderDate: new Date().toISOString(),
        ...formData,
        items,
        orderTotal: this.orderTotal.toFixed(2),
        shipping: this.shipping.toFixed(2),
        tax: this.tax.toFixed(2),
      };

      const externalServices = new ExternalServices();
      const response = await externalServices.checkout(order);
      console.log('Order successful:', response);
      localStorage.removeItem('so-cart');
      window.location.href = '/checkout/success.html';
    } catch (error) {
      console.error('Checkout failed:', error);
      throw error;
    }
  }

  formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};

    formData.forEach((value, key) => {
      convertedJSON[key] = value;
    });

    return convertedJSON;
  }
}
