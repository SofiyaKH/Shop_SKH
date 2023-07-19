<template>
  <router-link :to="`/product/${product.id}`" class="catalog-item-link">
    <q-card
      clickable
      class="my-card q-mx-sm q-mb-lg v-catalog-item no-box-shadow no-border-radius"
    >
      <img :src="require('../assets/images/' + product.img)" />
      <q-card-section class="q-pa-xs">
        <div class="text-weight-light text-caption">{{ product.title }}</div>
        <div class="text-weight-bold">{{ product.price }}</div>
      </q-card-section>
    </q-card>
  </router-link>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "v-catalog-item",

  props: {
    product: {
      type: Object,
      default() {
        return {};
      },
    },
    productId:{
      type: Number,
    }
  },

  setup() {
    const loadData = (id) => {
      console.log(id);
    };

    return {
      loadData,
    };
  },
});
</script>

<style>
.v-catalog-item {
  max-width: 250px;
  max-height: 464px;
}
.catalog-item-link {
  text-decoration: none;
  color: black;
}
</style>