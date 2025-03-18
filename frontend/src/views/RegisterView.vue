<!-- <template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <h1 class="text-2xl mb-4">Register</h1>
    <form @submit.prevent="register" class="w-1/3 bg-white p-6 shadow rounded">
      <div class="mb-4">
        <label class="block font-bold mb-1">Email</label>
        <input v-model="email" type="email" class="border w-full p-2" />
      </div>
      <div class="mb-4">
        <label class="block font-bold mb-1">Password</label>
        <input v-model="password" type="password" class="border w-full p-2" />
      </div>
      <button type="submit" class="border px-4 py-2">Register</button>
    </form>
    <div class="mt-4">
      <router-link to="/login">Have an account? Login here</router-link>
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
          "https://useful-osprey-hideously.ngrok-free.app/api/auth/register",
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
</script> -->

<!-- ######option 2 starts $$$$$$$ -->

<!-- <template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-green-100"
  >
    <header class="bg-green-600 text-white p-4 flex justify-end">
      <div v-if="userEmail" class="font-semibold">Hi, {{ userEmail }}</div>
    </header>

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
            class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div class="mb-6">
          <label class="block font-semibold mb-1 text-gray-700">Password</label>
          <input
            v-model="password"
            type="password"
            class="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>
      </form>
      <div class="mt-4">
        <router-link
          to="/login"
          class="text-green-600 hover:underline font-medium"
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
      userEmail: localStorage.getItem("userEmail") || "",
    };
  },
  methods: {
    async register() {
      try {
        await axios.post(
          "https://useful-osprey-hideously.ngrok-free.app/api/auth/register",
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
</script> -->
<!-- ########3option 2 ends############# -->

<!-- ######## option 3 starts ############# -->
<!-- <template>
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
          "https://useful-osprey-hideously.ngrok-free.app/api/auth/register",
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
</script> -->

<!-- ######## option 3 ends ############# -->

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
          "https://useful-osprey-hideously.ngrok-free.app/api/auth/register",
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
