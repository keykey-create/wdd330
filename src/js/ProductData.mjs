const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async searchProducts(term) {
    const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];
    const search = term.toLowerCase();
    let results = [];

    for (const category of categories) {
      // if one category fails (example: it does not exist), skip it
      try {
        const products = await this.getData(category);
        const matches = products.filter((product) =>
          product.Name.toLowerCase().includes(search)
        );
        results = results.concat(matches);
      } catch (error) {
        console.log(`Could not search in ${category}`);
      }
    }

    return results;
  }
}