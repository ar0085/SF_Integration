<!-- <template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <h1 class="text-2xl mb-4">Login</h1>
    <form @submit.prevent="login" class="w-1/3 bg-white p-6 shadow rounded">
      <div class="mb-4">
        <label class="block font-bold mb-1">Email</label>
        <input v-model="email" type="email" class="border w-full p-2" />
      </div>
      <div class="mb-4">
        <label class="block font-bold mb-1">Password</label>
        <input v-model="password" type="password" class="border w-full p-2" />
      </div>
      <button type="submit" class="border px-4 py-2">Login</button>
    </form>
    <div class="mt-4">
      <router-link to="/register">No account? Register here</router-link>
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
    // If already logged in to your app (token exists), we might skip the login form:
    const userToken = localStorage.getItem("token");
    if (userToken) {
      // OPTIONAL: you could check if SF tokens also exist.
      // If yes, go straight to dashboard. If no, trigger SF OAuth automatically.
      // Example:
      const sfToken = localStorage.getItem("sfAccessToken");
      const sfInstanceUrl = localStorage.getItem("sfInstanceUrl");
      if (sfToken && sfInstanceUrl) {
        this.$router.push("/dashboard");
      } else {
        this.triggerSalesforceLogin();
      }
    }
  },
  methods: {
    async login() {
      try {
        // 1) Login to your app with email/password
        const response = await axios.post(
          "https://useful-osprey-hideously.ngrok-free.app/api/auth/login",
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

        // 2) Store the user's app token
        localStorage.setItem("token", response.data.token);

        // 3) Check if we already have Salesforce tokens
        const sfToken = localStorage.getItem("sfAccessToken");
        const sfInstanceUrl = localStorage.getItem("sfInstanceUrl");

        if (sfToken && sfInstanceUrl) {
          // We already have them => go to dashboard
          this.$router.push("/dashboard");
        } else {
          // 4) If we do NOT have them => automatically trigger SF OAuth
          this.triggerSalesforceLogin();
        }
      } catch (error) {
        alert(error.response?.data?.message || "Login failed");
        console.error("❌ Login Error:", error);
      }
    },

    /**
     * Initiate Salesforce OAuth if tokens are missing
     */
    triggerSalesforceLogin() {
      window.location.href =
        "https://login.salesforce.com/services/oauth2/authorize" +
        "?response_type=code" +
        "&client_id=3MVG9VMBZCsTL9hki9KvVM3hrJW15AnqunbGg9nCA9T.JTgAM17TaZYcQ0z4BhmptUnXVFpqN8p_2b_ipTgHE" +
        "&redirect_uri=https://useful-osprey-hideously.ngrok-free.app/api/auth/salesforce/callback";
    },
  },
};
</script> -->

<!-- ############option 2 starts############ -->

<!-- <template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100"
  >
    <header class="bg-blue-600 text-white p-4 flex justify-end">
      <div v-if="userEmail" class="font-semibold">Hi, {{ userEmail }}</div>
    </header>

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
      // Display in top-right corner if user re-visits
      userEmail: localStorage.getItem("userEmail") || "",
    };
  },
  created() {
    // If already logged in (token exists), optionally trigger SF login
    const userToken = localStorage.getItem("token");
    if (userToken) {
      const sfToken = localStorage.getItem("sfAccessToken");
      const sfInstanceUrl = localStorage.getItem("sfInstanceUrl");
      if (sfToken && sfInstanceUrl) {
        this.$router.push("/dashboard");
      } else {
        this.triggerSalesforceLogin();
      }
    }
  },
  methods: {
    async login() {
      try {
        // 1) Log in to your app
        const response = await axios.post(
          "https://useful-osprey-hideously.ngrok-free.app/api/auth/login",
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

        // 2) Store JWT token
        localStorage.setItem("token", response.data.token);

        // 3) Also store userEmail so we can display it
        localStorage.setItem("userEmail", this.email);
        this.userEmail = this.email;

        // 4) Check if we already have SF tokens
        const sfToken = localStorage.getItem("sfAccessToken");
        const sfInstanceUrl = localStorage.getItem("sfInstanceUrl");

        if (sfToken && sfInstanceUrl) {
          this.$router.push("/dashboard");
        } else {
          this.triggerSalesforceLogin();
        }
      } catch (error) {
        alert(error.response?.data?.message || "Login failed");
        console.error("❌ Login Error:", error);
      }
    },
    triggerSalesforceLogin() {
      window.location.href =
        "https://login.salesforce.com/services/oauth2/authorize" +
        "?response_type=code" +
        "&client_id=3MVG9VMBZCsTL9hki9KvVM3hrJW15AnqunbGg9nCA9T.JTgAM17TaZYcQ0z4BhmptUnXVFpqN8p_2b_ipTgHE" +
        "&redirect_uri=https://useful-osprey-hideously.ngrok-free.app/api/auth/salesforce/callback";
    },
  },
};
</script> -->

<!-- ##################### option 2 ends #################### -->

<!-- ############option 3 starts############ -->

<!-- <template>
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
    // If token & SF tokens exist, go to dashboard or initiate SF flow
    const userToken = localStorage.getItem("token");
    if (userToken) {
      const sfToken = localStorage.getItem("sfAccessToken");
      const sfInstanceUrl = localStorage.getItem("sfInstanceUrl");
      if (sfToken && sfInstanceUrl) {
        this.$router.push("/dashboard");
      } else {
        this.triggerSalesforceLogin();
      }
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(
          "https://useful-osprey-hideously.ngrok-free.app/api/auth/login",
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

        // Save user's app token
        localStorage.setItem("token", response.data.token);
        // Also store user email so we can show in dashboard's top bar
        localStorage.setItem("userEmail", this.email);

        // If SF tokens exist, go to dashboard. Otherwise, start SF OAuth
        const sfToken = localStorage.getItem("sfAccessToken");
        const sfInstanceUrl = localStorage.getItem("sfInstanceUrl");
        if (sfToken && sfInstanceUrl) {
          this.$router.push("/dashboard");
        } else {
          this.triggerSalesforceLogin();
        }
      } catch (error) {
        alert(error.response?.data?.message || "Login failed");
        console.error("❌ Login Error:", error);
      }
    },
    triggerSalesforceLogin() {
      window.location.href =
        "https://login.salesforce.com/services/oauth2/authorize" +
        "?response_type=code" +
        "&client_id=3MVG9VMBZCsTL9hki9KvVM3hrJW15AnqunbGg9nCA9T.JTgAM17TaZYcQ0z4BhmptUnXVFpqN8p_2b_ipTgHE" +
        "&redirect_uri=https://useful-osprey-hideously.ngrok-free.app/api/auth/salesforce/callback";
    },
  },
};
</script> -->

<!-- ##################### option 3 ends #################### -->

<!-- ############option 4 starts############ -->
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
    const userToken = localStorage.getItem("token");
    if (userToken) {
      // Check if we have SF tokens
      const sfToken = localStorage.getItem("sfAccessToken");
      const sfInstanceUrl = localStorage.getItem("sfInstanceUrl");
      if (sfToken && sfInstanceUrl) {
        this.$router.push("/dashboard");
      } else {
        this.triggerSalesforceLogin();
      }
    }
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(
          "https://useful-osprey-hideously.ngrok-free.app/api/auth/login",
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

        // Save user's app token
        localStorage.setItem("token", response.data.token);

        // Also store user email in userEmailSFApp
        localStorage.setItem("userEmailSFApp", this.email);

        // If SF tokens exist, go to dashboard. Otherwise, start SF OAuth
        const sfToken = localStorage.getItem("sfAccessToken");
        const sfInstanceUrl = localStorage.getItem("sfInstanceUrl");
        if (sfToken && sfInstanceUrl) {
          this.$router.push("/dashboard");
        } else {
          this.triggerSalesforceLogin();
        }
      } catch (error) {
        alert(error.response?.data?.message || "Login failed");
        console.error("❌ Login Error:", error);
      }
    },
    triggerSalesforceLogin() {
      // Replace your SF Connected App info here
      window.location.href =
        "https://login.salesforce.com/services/oauth2/authorize" +
        "?response_type=code" +
        "&client_id=3MVG9VMBZCsTL9hki9KvVM3hrJW15AnqunbGg9nCA9T.JTgAM17TaZYcQ0z4BhmptUnXVFpqN8p_2b_ipTgHE" +
        "&redirect_uri=https://useful-osprey-hideously.ngrok-free.app/api/auth/salesforce/callback";
    },
  },
};
</script>

<!-- ############option 4 ends ############ -->
