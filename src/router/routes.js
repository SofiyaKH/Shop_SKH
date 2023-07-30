import { UserService } from "src/services/user.service";

const routes = [
  {
    path: "/auth",
    children: [
      {
        path: "",
        name: "authPage",
        component: () => import("pages/Autorization.vue"),
      },
      {
        path: "reg",
        name: "regPage",
        component: () => import("pages/Registration.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "catalog",
        component: () => import("pages/Catalog.vue"),
      },
      { path: "chat", component: () => import("pages/Chat.vue") },
      { path: "product/:id", component: () => import("pages/ProductCard.vue") },
      {
        path: "cart",
        component: () => import("src/pages/Cart.vue"),
        beforeEnter: (to, from, next) => {
          if (JSON.parse(localStorage.getItem("token"))) {
            next();
          } else {
            next({ name: "catalog" });
          }
        },
      },
      {
        path: "cart",
        component: () => import("src/pages/Cart.vue"),
        beforeEnter: (to, from, next) => {
          if (JSON.parse(localStorage.getItem("token"))) {
            next();
          } else {
            next({ name: "catalog" });
          }
        },
      },
      {
        path: "admin/products",
        component: () => import("src/pages/Admin.vue"),
        beforeEnter: (to, from, next) => {
          const token = JSON.parse(localStorage.getItem("token"));
          if (token) {
            UserService.getUser(token).then((user) => {
              if (user.isAdmin) {
                next();
              } else {
                next({ name: "catalog" });
              }
            });
            next();
          } else {
            next({ name: "catalog" });
          }
        },
      },
    ],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
