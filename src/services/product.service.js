export class ProductService {
  static async update(productId, productUpdateDTO) {
    let response = await fetch(`http://localhost:3000/products/${productId}`, {
      method: "PATCH",
      headers: {
        Authentication: "Access-Control-Allow-Origin",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productUpdateDTO),
    });

    if (response.ok) {
      return await response.json();
    } else {
      alert("Ошибка HTTP: " + response.status);
    }
  }

  static async delete(productId) {
    let response = await fetch(`http://localhost:3000/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authentication: "Access-Control-Allow-Origin",
      },
    });

    if (response.ok) {
      return response;
    } else {
      alert("Ошибка HTTP: " + response.status);
    }
  }

  static async create(newProductDTO) {
    let response = await fetch(`http://localhost:3000/products`, {
      method: "POST",
      headers: {
        Authentication: "Access-Control-Allow-Origin",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProductDTO),
    });

    if (response.ok) {
      return await response.json();
    } else {
      alert("Ошибка HTTP: " + response.status);
    }
  }

  static getCreateDTO() {
    return {
      title: "",
      description: "",
      img: "",
      sex: "U",
      size: "S",
      color: "",
      price: 0,
    };
  }
}
