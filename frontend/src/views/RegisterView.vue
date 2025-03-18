<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100"
  >
    <div class="flex-grow flex flex-col items-center justify-center">
      <h1 class="text-3xl mb-6 text-gray-700 font-bold">Register</h1>
      <form
        @submit.prevent="register"
        class="w-1/3 bg-white p-8 shadow rounded"
      >
        <div class="mb-4">
          <label class="block font-semibold mb-1 text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="mb-6">
          <label class="block font-semibold mb-1 text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>
      <div class="mt-4">
        <router-link
          to="/login"
          class="text-blue-600 hover:underline font-medium"
        >
          Have an account? Login here
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RegisterView",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async register() {
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
          {
            email: this.email,
            password: this.password,
          },
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        alert("Registration successful! You can now log in.");
        this.$router.push("/login");
      } catch (error) {
        alert(error.response?.data?.message || "Registration failed");
      }
    },
  },
};
</script>
