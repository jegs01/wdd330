import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter();

const checkout = new CheckoutProcess('so-cart', '#orderSummary');
checkout.init();

document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;

  try {
    const errorMessagesContainer = document.getElementById('errorMessages');
    errorMessagesContainer.innerHTML = '';
    errorMessagesContainer.style.display = 'none';

    const errorMessages = [];
    const cardNumberInput = document.getElementById('cardNumber').value.trim();
    const expiryDateInput = document.getElementById('expiration').value.trim();
    const securityCodeInput = document.getElementById('code').value.trim();

    if (cardNumberInput !== '1234123412341234') {
      errorMessages.push('Invalid Card Number');
    }

    if (securityCodeInput !== '123') {
      errorMessages.push('Invalid Security Code');
    }

    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryDateRegex.test(expiryDateInput)) {
      errorMessages.push('Invalid expiration date');
    } else {
      const [month, year] = expiryDateInput.split('/').map(Number);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear() % 100;

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errorMessages.push('Expiration date must be in the future');
      }
    }

    if (errorMessages.length > 0) {
      errorMessages.forEach((message) => {
        const errorDiv = document.createElement('div');
        const errorMessageSpan = document.createElement('span');
        const closeButton = document.createElement('button');

        errorMessageSpan.textContent = message;
        closeButton.innerHTML = '×';
        closeButton.addEventListener('click', () => errorDiv.remove());

        errorDiv.appendChild(errorMessageSpan);
        errorDiv.appendChild(closeButton);
        errorMessagesContainer.appendChild(errorDiv);
      });

      errorMessagesContainer.style.display = 'block';
      window.scrollTo(0, 0);
    } else {
      await checkout.checkout(form);
      alert('Order submitted successfully!');
    }
  } catch (error) {
    alert(`Order submission failed: ${error.message}`);
  }
});
