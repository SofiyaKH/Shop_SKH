<template>
  <q-card
    clickable
    @click="router.push({ path: `/product/${product.id}` })"
    class="my-card q-mx-sm q-mb-lg v-catalog-item no-box-shadow no-border-radius cursor-pointer"
  >
    <img v-if=" product.img" :src="require(`../assets/images/` + product.img)" />
    <q-card-section class="q-pa-xs">
      <div class="text-weight-light text-caption">{{ product.title }}</div>
      <div class="text-weight-bold">{{ product.price }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useRouter } from "vue-router";

const { product, productId } = defineProps({
  product: Object,
  productId: Number,
});

const router = useRouter();
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