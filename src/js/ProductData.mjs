import { getParam } from './utils.mjs';

const baseURL = import.meta.env.VITE_SERVER_URL

const category = getParam('category');

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  }
}

export default class ProductData {
  async getData() {
      const response = await fetch(`${baseURL}products/search/${category}`);
      const data = await convertToJson(response);
      if (Array.isArray(data)) {
        return data;
      } else if (data.Result && Array.isArray(data.Result)) {
        return data.Result;
      } else {
        return Array.isArray(data) ? data : [data];
      }
  }
}

