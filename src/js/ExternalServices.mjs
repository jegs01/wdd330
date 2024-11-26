import { getParam } from './utils.mjs';

const baseURL = import.meta.env.VITE_SERVER_URL;
const submitURL = import.meta.env.VITE_SUBMIT_URL;

const category = getParam('category');

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  }
  throw new Error('Failed to fetch data');
}

export default class ExternalServices {
  async getData() {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);

    if (Array.isArray(data)) {
      return data;
    }
    if (data.Result && Array.isArray(data.Result)) {
      return data.Result;
    }
    return [data];
  }

  async checkout(order) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    };

    const response = await fetch(submitURL, options);
    if (!response.ok) {
      throw new Error('Checkout failed!');
    }

    return response.json();
  }
}
