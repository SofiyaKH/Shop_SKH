export class UserService {
  static async getUser(token) {
    let response = await fetch(`http://localhost:3000/customers/${token.id}`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      alert("Ошибка HTTP: " + response.status);
    }
  }
}
