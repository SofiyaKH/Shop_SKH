<template>
  <div class="fullscreen q-pa-md flex flex-center column">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md q-mb-xl">
      <q-input
        filled
        :rules="require"
        v-model="form.email"
        label="email"
        style="width: 450px"
      />
      <q-input
        filled
        :rules="require"
        v-model="form.password"
        label="password"
      />

      <div class="flex justify-center">
        <q-btn label="Go" class="q-mr-sm" type="submit" color="primary" />
        <q-btn to="/auth/reg" flat color="primary" label="Registration" />
      </div>
    </q-form>
    <q-btn to="/" flat color="primary" label="back to catalog" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
localStorage.removeItem("token");

const form = ref({
  email: "",
  password: "",
});

const onSubmit = async () => {
  const response = await fetch("http://localhost:3000/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form.value),
  });

  if (response.ok) {
    localStorage.setItem("token", JSON.stringify(await response.json()));

    form.value = {
      email: "",
      password: "",
    };

    router.push({ name: "catalog" });
  }
};
</script>
