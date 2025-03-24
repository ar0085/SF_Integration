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
  created() {
    // If already logged in to your app
    // const userToken = localStorage.getItem("token");
    // if (userToken) {
    //   // Check if we have SF tokens
    //   const sfToken = localStorage.getItem("sfAccessToken");
    //   const sfInstanceUrl = localStorage.getItem("sfInstanceUrl");
    //   if (sfToken && sfInstanceUrl) {
    //     this.$router.push("/dashboard");
    //   } else {
    //     this.triggerSalesforceLogin();
    //   }
    // }
  },
  methods: {
    // async login() {
    //   try {
    //     const response = await axios.post(
    //       `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
    //       {
    //         email: this.email,
    //         password: this.password,
    //       },
    //       {
    //         headers: {
    //           "ngrok-skip-browser-warning": "true",
    //         },
    //       }
    //     );

    //     // Save user's app token
    //     localStorage.setItem("token", response.data.token);

    //     // Also store user email in userEmailSFApp
    //     localStorage.setItem("userEmailSFApp", this.email);

    //     // If SF tokens exist, go to dashboard. Otherwise, start SF OAuth
    //     const sfToken = localStorage.getItem("sfAccessToken");
    //     const sfInstanceUrl = localStorage.getItem("sfInstanceUrl");
    //     if (sfToken && sfInstanceUrl) {
    //       this.$router.push("/dashboard");
    //     } else {
    //       this.triggerSalesforceLogin();
    //     }
    //   } catch (error) {
    //     alert(error.response?.data?.message || "Login failed");
    //     console.error("❌ Login Error:", error);
    //   }
    // },
    // 🔁 Updated login method
    async login() {
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
          {
            email: this.email,
            password: this.password,
          },
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
            withCredentials: true, // 🔥 receives the cookie
          }
        );

        // Optional: Save for greeting only
        sessionStorage.setItem("userEmailSFApp", this.email);

        this.triggerSalesforceLogin(); // Redirect to SF
      } catch (error) {
        alert(error.response?.data?.message || "Login failed");
        console.error("❌ Login Error:", error);
      }
    },
    triggerSalesforceLogin() {
      // Replace your SF Connected App info here
      window.location.href =
        `${import.meta.env.VITE_SF_LOGIN_URL}/services/oauth2/authorize` +
        `?response_type=code` +
        `&client_id=${import.meta.env.VITE_SF_CONSUMER_KEY}` +
        `&redirect_uri=${import.meta.env.VITE_SF_CALLBACK_URL}`;
    },
  },
};
</script>
