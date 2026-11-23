const baseURL = (
  import.meta.env.VITE_SERVER_URL ||
  "https://wdd330-backend-osp8.onrender.com/"
).replace(/\/?$/, "/");

export async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (!res.ok) {
    throw { name: "servicesError", message: jsonResponse };
  }
  return jsonResponse;
}

export default class ExternalServices {
  async getData(category) {
    if (!baseURL) throw new Error("VITE_SERVER_URL is not configured.");
    const response = await fetch(
      `${baseURL}products/search/${encodeURIComponent(category)}`,
    );
    const data = await convertToJson(response);
    if (!Array.isArray(data.Result)) {
      throw new Error("The server returned an invalid product list.");
    }
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
    if (!baseURL) throw new Error("VITE_SERVER_URL is not configured.");
    const response = await fetch(`${baseURL}product/${encodeURIComponent(id)}`);
    const data = await convertToJson(response);
    return data.Result;
  }
}
