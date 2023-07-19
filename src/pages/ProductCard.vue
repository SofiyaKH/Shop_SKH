<template>
  <q-page class="flex justify-center q-pa-xl">
    <div class="text-h6 q-mr-xl flex flex-center" v-if="loading">
      Loading...
    </div>
    <div class="text-h6 q-mr-xl flex flex-center" v-else-if="error">
      Error: {{ error.message }}
    </div>
    <div
      v-else-if="products"
      class="v-product flex justify-around"
      v-for="product in products"
      :key="product.id"
    >
      <div class="v-product-image">
        <img :src="require('../assets/images/' + product.img)" />
      </div>

      <div class="v-product-about q-pl-sm">
        <div class="text-weight-bold text-h3 q-mb-md">{{ product.title }}</div>
        <div class="text-h6 q-mb-md">
          <q-icon class="q-pb-xs" name="attach_money"></q-icon
          >{{ product.price }}
        </div>

        <div class="flex justify-between items-stretch q-py-sm">
          <div class="v-product-about-block">
            <div class="text-h5 text-weight-bold text-grey-6 q-my-sm">
              DESCRIPTION
            </div>
            <div class="text-body1 q-mb-lg">{{ product.description }}</div>
          </div>

          <div class="v-product-about-block">
            <div class="text-h5 text-weight-bold text-grey-6 q-my-sm">
              SUMMARY
            </div>
            <div class="text-body1">Color: {{ product.color }}</div>
            <div class="text-body1 q-mb-lg">Sex: {{ product.sex }}</div>
            <q-btn
              class="bg-black text-white"
              style="height: 56px"
              flat
              square
              stretch
              no-caps
              icon-right="add"
              label="ADD TO CART"
              @click="add()"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { useQuery } from "@vue/apollo-composable";

import { useQuasar } from "quasar";

import { useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";

export default defineComponent({
  name: "product-card",

  setup() {
    const route = useRoute();
    const productsInCart = ref([]);
    const productId = ref(parseInt(route.params.id));

    const { result, error, loading } = useQuery(
      gql`
        query MyQuery($id: Int) {
          products(where: { id: { _eq: $id } }) {
            id
            description
            price
            img
            title
            sex
            size
            color
          }
        }
      `,
      {
        id: productId.value,
      }
    );

    const products = computed(() => result.value?.products ?? []);

    const getCart = () => {
      const { result, onResult, refetch } = useQuery(gql`
        query MyQuery {
          carts {
            id
            product {
              color
              description
              id
              img
              price
              size
              title
              sex
            }
            product_id
          }
        }
      `);
      const carts = computed(() => result.value?.carts ?? []);

      onResult(() => {
        productsInCart.value = [];
        carts.value.forEach((cart) => {
          productsInCart.value.push(cart.product_id);
        });
      });

      refetch();
      return productsInCart;
    };

    const $q = useQuasar();

    const add = () => {
      if (!productsInCart.value.includes(productId.value)) {
        addProductToCart();
        productsInCart.value.push(productId.value);
      } else {
        changeUnits();
      }
      $q.notify({
        message: "The product is added to the cart",
        icon: "check",
        timeout: 1000,
      });
    };

    const { mutate: addProductToCart } = useMutation(
      gql`
        mutation addProductToCart($product_id: Int) {
          insert_carts_one(object: { product_id: $product_id }) {
            id
            product_id
          }
        }
      `,
      () => ({
        variables: {
          product_id: productId.value,
        },
      })
    );

    const { mutate: changeUnits } = useMutation(
      gql`
        mutation changeUnits($product_id: Int_comparison_exp) {
          update_carts(_inc: { units: 1 }, where: { product_id: $product_id }) {
            returning {
              id
              units
            }
          }
        }
      `,
      () => ({
        variables: {
          product_id: { _eq: productId.value },
        },
      })
    );

    getCart();

    return {
      productId,
      route,
      products,
      error,
      loading,
      add,
    };
  },
});
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
