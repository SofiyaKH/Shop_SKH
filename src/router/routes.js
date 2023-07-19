
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'catalogDefault', component: () => import('pages/Catalog.vue') },
      { path: 'catalog', component: () => import('pages/Catalog.vue') },
      { path: 'chat', component: () => import('pages/Chat.vue') },
      { path: 'product/:id', component: () => import('pages/ProductCard.vue') },
      { path: 'cart', component: () => import('src/pages/Cart.vue') },
      { path: 'payment', component: () => import('src/pages/Payment.vue') },
    ]
  },


  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
