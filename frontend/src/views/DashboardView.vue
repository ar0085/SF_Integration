<template>
  <!-- Full screen container in blue gradient -->
  <div
    class="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100"
  >
    <!-- Top bar -->
    <header
      class="bg-blue-600 text-white p-4 flex justify-between items-center"
    >
      <!-- Left side: user greeting if available -->
      <div class="font-semibold" v-if="userEmailSFApp">
        Hi, {{ userEmailSFApp }}
      </div>
      <!-- Right side: logout button -->
      <button
        class="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition"
        @click="showLogoutModal = true"
      >
        Logout
      </button>
    </header>

    <!-- Main content area -->
    <div class="relative flex-grow p-6">
      <!-- Full-screen loader overlay if isLoading -->
      <div
        v-if="isLoading"
        class="absolute inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center"
      >
        <div class="flex flex-col items-center">
          <span
            class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"
          ></span>
          <span class="text-gray-800 text-lg">Loading, please wait...</span>
        </div>
      </div>

      <!-- Confirmation modal for logout -->
      <div
        v-if="showLogoutModal"
        class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white p-6 rounded shadow-md w-1/3">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">
            Are you sure you want to logout?
          </h2>
          <div class="flex justify-end">
            <button
              class="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400"
              @click="cancelLogout"
            >
              No
            </button>
            <button
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              @click="confirmLogout"
            >
              Yes
            </button>
          </div>
        </div>
      </div>

      <h1 class="text-2xl mb-4 font-bold text-gray-700">Salesforce Accounts</h1>

      <!-- The table itself -->
      <table class="min-w-full bg-white rounded shadow">
        <thead>
          <tr class="bg-blue-200 text-gray-700">
            <th class="py-2 px-4 border-b text-left">Name</th>
            <th class="py-2 px-4 border-b text-left">Type</th>
            <th class="py-2 px-4 border-b text-left">Industry</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="acc in accounts" :key="acc.Id">
            <td class="py-2 px-4 border-b">{{ acc.Name }}</td>
            <td class="py-2 px-4 border-b">{{ acc.Type }}</td>
            <td class="py-2 px-4 border-b">{{ acc.Industry }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination controls below the table -->
      <div class="mt-4 flex items-center">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition mr-2"
        >
          Prev
        </button>
        <span class="mr-2">Page {{ page }}</span>
        <button
          @click="nextPage"
          class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DashboardView",
  data() {
    return {
      accounts: [],
      page: 1,
      limit: 5,
      isLoading: false,
      // renamed variable: userEmailSFApp
      userEmailSFApp: sessionStorage.getItem("userEmailSFApp") || "",
      // logout modal
      showLogoutModal: false,
    };
  },
  async created() {
    await this.fetchAccounts();
  },
  methods: {
    async fetchAccounts() {
      try {
        this.isLoading = true;
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/accounts?page=${
            this.page
          }&limit=${this.limit}`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
            withCredentials: true,
          }
        );
        this.accounts = res.data.records;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$router.push("/login");
        } else {
          alert("Error fetching accounts");
          console.log("Error fetching accounts ", error);
        }
      } finally {
        this.isLoading = false;
      }
    },
    async nextPage() {
      this.page++;
      await this.fetchAccounts();
    },
    async prevPage() {
      if (this.page > 1) {
        this.page--;
        await this.fetchAccounts();
      }
    },
    // Show logout confirmation
    cancelLogout() {
      this.showLogoutModal = false;
    },
    // Clear data and redirect
    confirmLogout() {
      // Clear all localStorage items
      sessionStorage.removeItem("userEmailSFApp");
      this.$router.push("/login");
    },
  },
};
</script>
