const baseURL = import.meta.env.VITE_SERVER_URL;

export async function convertToJson(response) {
  const jsonResponse = await response.json();
  if (response.ok) {
    return jsonResponse;
  }
  throw {
    name: "servicesError",
    message: jsonResponse,
  };
}

export default class ExternalServices {
  constructor() {
    
  }
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };
    const response = await fetch(`${baseURL}checkout`, options);
    return await convertToJson(response);
  }
  
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    console.log(data.Result);
    return data.Result;
  }
}
