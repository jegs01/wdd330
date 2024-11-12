// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

// Retrieve a specific query parameter value from the URL
export function getParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// function to take a list of objects and a template and insert the objects as HTML into the DOM
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false
) {
  const htmlStrings = list.map(templateFn);
  if (clear) {
    parentElement.innerHTML = '';
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

// function to count cart items
export function countCartItems() {
  const cart = JSON.parse(localStorage.getItem('so-cart')) || [];
  return cart.length;
}

// function to display counted cart items
export function renderCartCount() {
  const cartCount = countCartItems();
  const cartElement = document.querySelector('.cart-count');
  
  if (cartElement) {
    cartElement.textContent = cartCount > 0 ? `${cartCount}` : '';
    
    if (cartCount > 0) {
      cartElement.style.backgroundColor = '';
    } else {
      cartElement.style.backgroundColor = 'white';
    }
  }
}
