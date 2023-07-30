<template lang="pug">
    <q-btn label="Добавить товар" color="primary" @click="addProduct" />
    <div class="q-pa-md">
        <q-table
        title="Товары"
        :rows="rows"
        :columns="columns"
        @row-click="onRowClick"
        row-key="name"
        />
    </div>

    <q-dialog v-model="showEditModal">
      <q-card>
        <q-card-section>
          <div class="text-h6">Редактирование продукта</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <q-input v-model="currentProduct.title" label="Название" />
            <q-input v-model="currentProduct.price" label="Цена" />
            <q-input v-model="currentProduct.img" label="Картинка" />
            <q-input v-model="currentProduct.color" label="Цвет" />
            <q-select v-model="currentProduct.size" :options="sizeOPtions" label="Размер" />
            <q-select v-model="currentProduct.sex" :options="['U','M','W']" label="Пол" />
            <q-input
                v-model="currentProduct.description"
                filled
                type="textarea"
                />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Сохранить" color="success" @click="saveChanges" />
          <q-btn v-if="currentProduct.id" flat label="Удалить" color="success" @click="deleteProduct" />
          <q-btn label="Отменить" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<style>
</style>

<script setup>
import { CatalogService } from "src/services/catalog.service";
import { ProductService } from "src/services/product.service";
import { ref } from "vue";
const rows = ref([]);
const currentProduct = ref(null);
const showEditModal = ref(false);
const sizeOPtions = ["S", "M", "L", "XL"];

const onRowClick = (_, row) => {
  showEditModal.value = true;
  currentProduct.value = Object.assign({}, row);
};

const saveChanges = () => {
  showEditModal.value = false;
  const productId = currentProduct.value.id;
  if (productId) {
    const updateDTO = currentProduct.value;
    delete updateDTO["id"];
    ProductService.update(productId, updateDTO).then((res) => {
      const index = rows.value.findIndex((product) => product.id === productId);
      rows.value[index] = res;
    });
  } else {
    ProductService.create(currentProduct.value).then((res) =>
      rows.value.push(res)
    );
  }
};

const deleteProduct = () => {
  showEditModal.value = false;
  const productId = currentProduct.value.id;
  ProductService.delete(productId).then(
    () =>
      (rows.value = rows.value.filter((product) => product.id !== productId))
  );
};

const addProduct = () => {
  currentProduct.value = ProductService.getCreateDTO();
  showEditModal.value = true;
};

const columns = [
  {
    name: "title",
    required: true,
    label: "Название",
    align: "left",
    field: "title",
    sortable: true,
  },
  {
    name: "price",
    align: "center",
    label: "Цена",
    field: "price",
  },
  { name: "sex", label: "Пол", field: "sex" },
  { name: "size", label: "Размер", field: "size" },
  { name: "color", label: "Цвет", field: "color" },
  {
    name: "description",
    label: "Описание",
    field: "description",
    align: "left",
  },
];

CatalogService.getCatalog().then((catalogItems) => {
  rows.value = catalogItems;
});
</script>
