export class CatalogService {
  static async getCatalog() {
    let response = await fetch("http://localhost:3000/products", {
      headers: {
        Authentication: "Access-Control-Allow-Origin",
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      alert("Ошибка HTTP: " + response.status);
    }
  }

  static async getCatalogItem(id) {
    let response = await fetch(`http://localhost:3000/products/${id}`, {
      headers: {
        Authentication: "Access-Control-Allow-Origin",
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      alert("Ошибка HTTP: " + response.status);
    }
  }
}
