export class CartService {
  static async addItemToCart(productId, cartId) {
    const token = JSON.parse(localStorage.getItem("token"));
    let response = await fetch(`http://localhost:3000/carts/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: productId,
        cartId: cartId,
      }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      alert("Ошибка HTTP: " + response.status);
    }
  }

  static async deleteAllFromCart(cartId) {
    const token = JSON.parse(localStorage.getItem("token"));
    let response = await fetch(`http://localhost:3000/carts/${cartId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price: 0,
        products: [],
      }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      alert("Ошибка HTTP: " + response.status);
    }
  }

  static async deleteItemFromCart(productId, cartId) {}
}
