<template>
  <div
    class="q-ma-md q-mx-xl flex flex-center cart-item"
    style="max-width: 1140px"
  >
    <q-img
      style="width: 130px; height: 200px"
      alt="Picture"
      :src="require(`../assets/images/` + item.img)"
    />
    <div class="flex flex-center cart-item" style="width: 80%">
      <p style="width: 150px" class="text-bold">
        {{ item.title }}
      </p>
      <p class="q-my-auto">{{ item.color }}</p>
      <p class="q-my-auto">{{ item.size }}</p>
      <p class="q-my-auto" style="width: 50px">${{ item.price }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineComponent } from "vue";

const { item } = defineProps({
  item: Object,
});
</script>


<style lang="scss">
.cart-item {
  justify-content: space-around;
}
</style>