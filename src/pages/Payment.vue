<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="add()">
      <p class="col-12 text-h5 text-center text-weight-bold">CHECKOUT</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-lg">
        <q-input
          label="card"
          mask="#### #### #### ####"
          fill-mask="_"
          v-model="form.card"
        />

        <q-input label="code" mask="###" fill-mask="_" v-model="form.code" />

        <q-input
          label="date"
          mask="##/####"
          fill-mask="_"
          v-model="form.date"
        />

        <div class="q-mt-xl">
          <q-btn
            outline
            size="md"
            label="Submit"
            class="full-width bg-black text-white"
            type="submit"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import gql from "graphql-tag";
import { useMutation } from "@vue/apollo-composable";

import { useQuasar } from "quasar";

export default defineComponent({
  name: "Payment",
  setup() {
    const form = ref({
      card: "",
      code: "",
      date: "",
    });

    let localTotal;

    const { mutate: addToOrder } = useMutation(
      gql`
        mutation MyMutation(
          $card: String
          $date: String
          $code: String
          $order_price: Int
        ) {
          insert_order_one(
            object: {
              card: $card
              date: $date
              code: $code
              order_price: $order_price
            }
          ) {
            id
            card
            code
            date
            order_price
          }
        }
      `,
      () => ({
        variables: {
          card: form.value.card,
          code: form.value.code,
          date: form.value.date,
          order_price: localTotal,
        },
      })
    );

    const $q = useQuasar();

    const add = async () => {
      getTotal();
      const { data } = await addToOrder();
      $q.notify({
        message: "Your order has been shipped",
        icon: "check",
        timeout: 1000
      });
      resetForm();
    };

    const getTotal = () => {
      localTotal = JSON.parse(localStorage.getItem("localTotal"));
    };

    const resetForm = () => {
      (form.value.card = ""), (form.value.code = ""), (form.value.date = "");
    };

    return {
      form,
      addToOrder,
      resetForm,
      add,
      onMounted,
      localTotal,
      getTotal,
    };
  },
});
</script>
