<template>
  <q-page class="flex justify-center q-pa-xl">
    <div class="v-product flex justify-around" v-if="product">
      <div class="v-product-image">
        <img :src="require(`../assets/images/` + product?.img)" />
      </div>

      <div class="v-product-about q-pl-sm">
        <div class="text-weight-bold text-h3 q-mb-md">{{ product?.title }}</div>
        <div class="text-h6 q-mb-md">
          <q-icon class="q-pb-xs" name="attach_money"></q-icon
          >{{ product?.price }}
        </div>

        <div class="flex justify-between items-stretch">
          <div class="v-product-about-block q-mx-sm">
            <div class="text-h5 text-weight-bold text-grey-6 q-my-sm">
              DESCRIPTION
            </div>
            <div class="text-body1 q-mb-lg">{{ product?.description }}</div>
          </div>

          <div class="v-product-about-block q-mx-sm">
            <div class="text-h5 text-weight-bold text-grey-6 q-my-sm">
              SUMMARY
            </div>
            <div class="text-body1">Color: {{ product?.color }}</div>
            <div class="text-body1 q-mb-lg">Sex: {{ product?.sex }}</div>
            <q-btn
              class="bg-black text-white"
              style="height: 56px"
              flat
              square
              stretch
              no-caps
              icon-right="add"
              :disable="!token"
              label="ADD TO CART"
              @click="add(product.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import { CatalogService } from "src/services/catalog.service";
import { UserService } from "src/services/user.service";
import { CartService } from "src/services/cart.service";
import { useQuasar } from "quasar";

const route = useRoute();
const cart = ref();
const product = ref();
const productsInCart = ref([]);
const token = JSON.parse(localStorage.getItem("token"));

CatalogService.getCatalogItem(route.params.id).then(
  (item) => (product.value = item)
);
UserService.getUser(token).then((user) => {
  productsInCart.value = user.cart.products;
  cart.value = user.cart;
});

const $q = useQuasar();

const add = (id) => {
  if (!productsInCart.value.includes(product.value)) {
    console.log(productsInCart.value);
    CartService.addItemToCart(id, cart.value.id);
    productsInCart.value.push(product.value);
    $q.notify({
      message: "The product is added to the cart",
      icon: "check",
      timeout: 1000,
    });
  } else {
    $q.notify({
      message: "The product is already in cart",
      icon: "check",
      timeout: 1000,
    });
  }
};
</script>

<style scoped>
.v-product {
  max-width: 900px;
  width: 100%;
}
.v-product-image,
.v-product-about {
  max-width: 400px;
}
</style>
