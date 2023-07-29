<template>
  <q-page class="q-mx-auto" style="max-width: 1140px">
    <div class="text-h6 q-mr-xl flex flex-center" v-if="loading">
      Loading...
    </div>
    <div class="text-h6 q-mr-xl flex flex-center" v-else-if="error">
      Error: {{ error.message }}
    </div>
    <div v-else-if="cart">
      <div v-if="cart.products.length">
        <p class="text-h5 q-my-lg text-weight-bold text-center">
          SHOPPING CART
        </p>
        <CartItem v-for="item in cart.products" :key="item.id" :item="item" />
        <div class="q-mt-lg q-mb-md flex justify-end">
          <q-btn @click="deleteAll" flat label="Delete all" icon="delete" />
        </div>
        <p class="text-h5 text-weight-bold text-center">
          TOTAL: ${{ cart.price }}
        </p>
      </div>

      <div v-if="!cart.products.length" class="flex absolute-center column">
        <q-icon
          class="q-mx-auto"
          name="shopping_cart"
          size="150px"
          color="primary"
        />
        <div class="text-h4 text-primary">Your cart is empty...</div>
        <q-btn
          class="q-ma-lg bg-black text-white"
          to="/"
          label="Back to Catalog"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import CartItem from "../components/CartItem.vue";
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import { UserService } from "src/services/user.service";
import { CartService } from "src/services/cart.service";

const cart = ref();

const token = JSON.parse(localStorage.getItem("token"));
UserService.getUser(token).then((user) => (cart.value = user.cart));

const $q = useQuasar();

const deleteAll = async () => {
  CartService.deleteAllFromCart(cart.value.id);

  $q.notify({
    message: "The basket has been emptied",
    icon: "info",
    timeout: 1000,
  });
};
</script>

<style>
</style>