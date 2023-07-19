<template>
  <div
    class="q-ma-md q-mx-xl flex flex-center cart-item"
    style="max-width: 1140px"
  >
    <q-img
      style="width: 130px; height: 200px"
      alt="Picture"
      :src="require(`../assets/images/` + item.product.img)"
    />
    <div class="flex flex-center cart-item" style="width: 80%">
      <p style="width: 150px" class="text-bold">
        {{ item.product.title }}
      </p>
      <p class="q-my-auto">{{ item.product.color }}</p>
      <p class="q-my-auto">{{ item.product.size }}</p>
      <div class="flex justify-around" style="width: 110px; height: 52px">
        <q-btn
          style="width: 5%"
          flat
          @click="incrementItem(item.id)"
          label="+"
        />
        <p class="text-center no-border q-my-auto" style="max-width: 40px">
          {{ item.units }}
        </p>
        <q-btn
          style="width: 5%"
          flat
          @click="decrementItem(item.id, item.units)"
          label="-"
        />
      </div>
      <p class="q-my-auto" style="width: 50px">
        ${{ item.product.price * item.units }}
      </p>

      <q-btn @click="deleteFromCart(item.id)" flat icon="delete" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useMutation } from "@vue/apollo-composable";
import { useQuasar } from "quasar";

import gql from "graphql-tag";

export default defineComponent({
  name: "CartItem",
  props: {
    item: {
      type: Object,
    },
  },
  setup() {
    const { mutate: increment } = useMutation(gql`
      mutation MyMutation($id: Int!) {
        update_carts(where: { id: { _eq: $id } }, _inc: { units: 1 }) {
          returning {
            units
            id
          }
        }
      }
    `);

    const { mutate: deleteCartItem } = useMutation(gql`
      mutation MyMutation($id: Int!) {
        delete_carts_by_pk(id: $id) {
          id
        }
      }
    `);

    const { mutate: decrement } = useMutation(gql`
      mutation MyMutation($id: Int!) {
        update_carts(where: { id: { _eq: $id } }, _inc: { units: -1 }) {
          returning {
            units
            id
          }
        }
      }
    `);

    const incrementItem = async (id) => {
      const { data } = await increment({
        id: id,
      });
    };

    const decrementItem = async (id, units) => {
      if (units < 2) {
        deleteFromCart(id);
      } else {
        const { data } = await decrement({
          id: id,
        });
      }
    };

    const $q = useQuasar();

    const deleteFromCart = async (id) => {
      const { data } = await deleteCartItem({
        id: id,
      });
      $q.notify({
        message: "The product has been removed from the basket",
        icon: "info",
        timeout: 1000
      });
    };

    return {
      increment,
      decrement,
      deleteCartItem,
      deleteFromCart,
      incrementItem,
      decrementItem,
    };
  },
});
</script>


<style lang="scss">
.cart-item {
  justify-content: space-around;
}
</style>