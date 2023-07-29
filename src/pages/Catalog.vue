<template>
  <q-page>
    <div class="flex q-mt-lg">
      <div class="v-catalog" v-if="products.length">
        <vCatalogItem
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
      <div class="flex justify-center v-catalog-empty" v-else>
        We are sorry, nothing was found
        <q-icon size="sm" name="sentiment_very_dissatisfied" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import vCatalogItem from "src/components/CatalogItem.vue";
import { defineComponent, ref } from "vue";
import { CatalogService } from "src/services/catalog.service";

const products = ref([]);

CatalogService.getCatalog().then((catalog) => (products.value = catalog));
const token = JSON.parse(localStorage.getItem("token"));
</script>

<style scoped>
.v-catalog {
  display: grid;
  grid-template-columns: repeat(1, minmax(260px, 1fr));
  grid-template-columns: 1fr 1fr 1fr;
  margin: 0 auto;
  max-width: 830px;
}
.v-menu {
  max-width: 250px;
  width: 100%;
}
.v-gender {
  border-bottom: solid grey 1px;
}

.v-catalog-empty {
  max-width: calc(100vw - 280px);
  width: 100%;
}

@media (max-width: 1100px) {
  .v-catalog-empty {
    max-width: 100vw;
    width: 100%;
  }
}
@media (max-width: 650px) {
  .v-catalog {
    display: grid;
    grid-template-columns: repeat(1, minmax(260px, 1fr));
    grid-template-columns: 1fr 1fr;
    margin: 0 auto;
    max-width: 830px;
  }
}
</style>