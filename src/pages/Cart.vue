<template>
  <q-page class="q-mx-auto" style="max-width: 1140px">
    <div class="text-h6 q-mr-xl flex flex-center" v-if="loading">
      Loading...
    </div>
    <div class="text-h6 q-mr-xl flex flex-center" v-else-if="error">
      Error: {{ error.message }}
    </div>
    <div v-else-if="items">
      <div v-if="items.length">
        <p class="text-h5 q-my-lg text-weight-bold text-center">
          SHOPPING CART
        </p>
        <CartItem v-for="item in items" :key="item.id" :item="item" />
        <div class="q-mt-lg q-mb-md flex justify-end">
          <q-btn @click="deleteAll" flat label="Delete all" icon="delete" />
        </div>
        <p class="text-h5 text-weight-bold text-center">
          TOTAL: ${{ totalPrice() }}
        </p>
        <div class="flex flex-center q-mb-lg">
          <q-btn
            flat
            class="bg-black text-white"
            size="md"
            to="/payment"
            label="Checkout now"
          />
        </div>
      </div>

      <div v-if="!items.length" class="flex absolute-center column">
        <q-icon
          class="q-mx-auto"
          name="shopping_cart"
          size="150px"
          color="primary"
        />
        <div class="text-h4 text-primary">Your cart is empty...</div>
        <q-btn
          class="q-ma-lg bg-black text-white"
          to="/catalog"
          label="Back to Catalog"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import CartItem from "../components/CartItem.vue";

import { defineComponent, ref } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useQuasar } from "quasar";

import gql from "graphql-tag";

export default defineComponent({
  name: "Cart",
  components: {
    CartItem,
  },
  setup() {
    const items = ref([]);

    const { result, loading, error, onResult, refetch } = useQuery(
      gql`
        query MyQuery {
          carts(order_by: { id: asc }) {
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
            units
            product_id
          }
        }
      `,
      null,
      {
        pollInterval: 100,
      }
    );

    const { mutate: deleteAllFromCarts } = useMutation(gql`
      mutation MyMutation {
        delete_carts(where: {}) {
          affected_rows
        }
      }
    `);

    const $q = useQuasar();

    const deleteAll = async () => {
      const { data } = await deleteAllFromCarts();
      $q.notify({
        message: "The basket has been emptied",
        icon: "info",
        timeout: 1000,
      });
    };

    const totalPrice = () => {
      let total = 0; // переписать на items.value.reduce()
      for (let i = 0; i < items.value.length; i++) {
        total += items.value[i].product.price * items.value[i].units;
      }
      let localTotal = total;
      localStorage.setItem("localTotal", JSON.stringify(localTotal));
      return total;
    };

    onResult(() => {
      items.value = result.value.carts;
    });

    return {
      result,
      items,
      loading,
      error,
      totalPrice,
      deleteAllFromCarts,
      deleteAll,
      refetch,
    };
  },
});
</script>

<style>
</style>