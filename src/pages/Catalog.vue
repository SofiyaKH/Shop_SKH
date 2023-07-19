<template>
  <q-page>
    <div class="flex" v-if="windowWitdh < 1100">
      <q-item>
        <q-radio
          v-model="gender"
          checked-icon="arrow_right"
          unchecked-icon="none"
          val="F"
          label="Woman"
          @click="FilterGender('F')"
          :class="{ 'text-weight-bold': gender == 'F' }"
      /></q-item>

      <q-item>
        <q-radio
          v-model="gender"
          checked-icon="arrow_right"
          unchecked-icon="none"
          val="M"
          label="Man"
          @click="FilterGender('M')"
          :class="{ 'text-weight-bold': gender == 'M' }"
        />
      </q-item>

      <q-item>
        <q-radio
          v-model="gender"
          checked-icon="arrow_right"
          unchecked-icon="none"
          val="All"
          label="All"
          @click="GetAll()"
          :class="{ 'text-weight-bold': gender == 'All' }"
        />
      </q-item>

      <q-item>
        <q-radio
          checked-icon="add"
          unchecked-icon="add"
          label="Size"
          @click="ChooseSize()"
        />
      </q-item>
    </div>

    <div class="text-h6 q-mr-xl flex flex-center" v-if="loading">
      Loading...
    </div>
    <div class="text-h6 q-mr-xl flex flex-center" v-else-if="error">
      Error: {{ error.message }}
    </div>

    <div class="flex q-mt-lg" v-else-if="products">
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

      <div class="v-menu" v-if="windowWitdh > 1100">
        <div class="v-gender q-pb-lg">
          <q-item tag="label" v-ripple>
            <q-radio
              v-model="gender"
              checked-icon="horizontal_rule xs"
              unchecked-icon="none"
              val="F"
              label="Woman"
              @click="FilterGender('F')"
              :class="{ 'text-weight-bold': gender == 'F' }"
          /></q-item>

          <q-item tag="label" v-ripple>
            <q-radio
              v-model="gender"
              checked-icon="horizontal_rule xs"
              unchecked-icon="none"
              val="M"
              label="Man"
              @click="FilterGender('M')"
              :class="{ 'text-weight-bold': gender == 'M' }"
            />
          </q-item>

          <q-item tag="label" v-ripple>
            <q-radio
              v-model="gender"
              aria-checked="text-weight-bold"
              checked-icon="horizontal_rule xs"
              unchecked-icon="none"
              val="All"
              label="All"
              @click="GetAll()"
              :class="{ 'text-weight-bold': gender == 'All' }"
            />
          </q-item>
        </div>

        <div class="v-attr q-pt-lg">
          <q-list>
            <q-item clickable @click="ChooseSize()" v-ripple>
              <q-item-section>Size</q-item-section>
              <q-item-section avatar>
                <q-icon color="primary" size="xs" name="add" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import vCatalogItem from "src/components/CatalogItem.vue";

import { defineComponent, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

import { getClientOptions } from "src/apollo/index.js";
import { provideApolloClient } from "@vue/apollo-composable";
import { ApolloClient } from "@apollo/client/core";

export default defineComponent({
  name: "v-catalog",

  components: {
    vCatalogItem,
  },

  setup() {
    const apolloClient = new ApolloClient(getClientOptions());
    provideApolloClient(apolloClient);
    const products = ref([]);
    const gender = ref("All");
    const windowWitdh = ref(document.documentElement.clientWidth);

    const { result, loading, error, onResult } = useQuery(gql`
      query MyQuery {
        products {
          id
          title
          price
          img
          sex
        }
      }
    `);

    onResult(() => {
      products.value = result.value.products;
    });

    const FilterGender = (sex) => {
      const { result, refetch, onResult } = useQuery(
        gql`
          query MyQuery($param: String) {
            products(where: { sex: { _eq: $param } }) {
              id
              img
              price
              title
              sex
              size
            }
          }
        `,
        {
          param: sex,
        }
      );

      onResult(() => {
        products.value = result.value.products;
      });

      refetch();
      return products;
    };

    const FilterSize = (size) => {
      const { result, refetch, onResult } = useQuery(
        gql`
          query MyQuery($param: String) {
            products(where: { size: { _eq: $param } }) {
              id
              img
              price
              title
              sex
              size
            }
          }
        `,
        {
          param: size,
        }
      );

      onResult(() => {
        products.value = result.value.products;
      });

      refetch();
      return products;
    };

    const FilterGenderSize = (gender, size) => {
      const { result, refetch, onResult } = useQuery(
        gql`
          query MyQuery($sizeParam: String, $sexParam: String) {
            products(
              where: {
                size: { _eq: $sizeParam }
                _and: { sex: { _eq: $sexParam } }
              }
            ) {
              id
              size
              sex
              img
              title
              price
            }
          }
        `,
        {
          sizeParam: size,
          sexParam: gender,
        }
      );

      onResult(() => {
        products.value = result.value.products;
      });

      refetch();
      return products;
    };

    const GetAll = () => {
      const { result, onResult, refetch } = useQuery(gql`
        query MyQuery {
          products {
            id
            title
            price
            img
            sex
          }
        }
      `);

      onResult(() => {
        products.value = result.value.products;
      });

      refetch();
      return products;
    };

    function ChooseSize() {
      this.$q
        .dialog({
          title: "Size",
          message: "Choose a size:",
          options: {
            type: "radio",
            inline: true,
            items: [
              { label: "XS", value: "XS" },
              { label: "S", value: "S" },
              { label: "M", value: "M" },
              { label: "L", value: "L" },
              { label: "XL", value: "XL" },
              { label: "XXL", value: "XXL" },
            ],
          },
          cancel: true,
          persistent: true,
        })
        .onOk((data) => {
          if (data) {
            gender.value != "All"
              ? FilterGenderSize(gender.value, data)
              : FilterSize(data);
          }
        });
    }

    window.addEventListener("resize", () => {
      windowWitdh.value = document.documentElement.clientWidth;
      console.log(windowWitdh.value);
    });

    return {
      products,
      loading,
      error,
      gender,
      windowWitdh,
      FilterGender,
      GetAll,
      ChooseSize,
    };
  },
});
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