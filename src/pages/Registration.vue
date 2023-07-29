<template>
  <div class="fullscreen q-pa-md flex flex-center column">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md q-mb-xl">
      <q-input
        :rules="require"
        filled
        v-model="form.firstName"
        label="first name"
        style="width: 450px"
      />
      <q-input
        :rules="require"
        filled
        v-model="form.lastName"
        label="last name"
      />
      <q-input
        :rules="require"
        filled
        type="email"
        v-model="form.email"
        label="email"
      />
      <q-input
        :rules="require"
        filled
        v-model="form.password"
        label="password"
      />

      <div class="flex justify-center">
        <q-btn label="Register" class="q-mr-sm" type="submit" color="primary" />
        <q-btn
          to="/auth"
          flat
          color="primary"
          label="Already registered? Login here"
        />
      </div>
    </q-form>

    <q-btn to="/" flat color="primary" label="back to catalog" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = ref({
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  password: "",
});

const onSubmit = async () => {
  console.log(form.value);
  const response = await fetch("http://localhost:3000/reg", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form.value),
  });

  if (response.ok) {
    const user = await response.json();

    const response = await fetch("http://localhost:3000/carts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customer: user.id }),
    });

    form.value = {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      password: "",
    };

    router.push({ name: "authPage" });
  }

  return response.json();
};
</script>
