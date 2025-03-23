<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100"
  >
    <div class="flex-grow flex flex-col items-center justify-center">
      <h1 class="text-3xl mb-6 text-gray-700 font-bold">Login</h1>
      <form @submit.prevent="login" class="w-1/3 bg-white p-8 shadow rounded">
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
          Login
        </button>
      </form>
      <div class="mt-4">
        <router-link
          to="/register"
          class="text-blue-600 hover:underline font-medium"
        >
          No account? Register here
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  async created() {
    // If already logged in, backend will handle it via cookies
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
        { withCredentials: true }
      );

      if (res.status === 200) {
        // Already authenticated, just go to dashboard
        this.$router.push("/dashboard");
      }
    } catch (err) {
      // Not logged in, continue to show login form
      console.log(err);
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
          {
            email: this.email,
            password: this.password,
          },
          {
            withCredentials: true,
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );

        // Once login is successful, trigger Salesforce OAuth
        this.triggerSalesforceLogin();
      } catch (error) {
        alert(error.response?.data?.message || "Login failed");
        console.error("❌ Login Error:", error);
      }
    },
    triggerSalesforceLogin() {
      window.location.href =
        `${import.meta.env.VITE_SF_LOGIN_URL}/services/oauth2/authorize` +
        `?response_type=code` +
        `&client_id=${import.meta.env.VITE_SF_CONSUMER_KEY}` +
        `&redirect_uri=${import.meta.env.VITE_SF_CALLBACK_URL}`;
    },
  },
};
</script>
