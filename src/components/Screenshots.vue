<template>
  <div>
    <h1 class="text-center">puppeteer demo + unocss (tailwind) + icons (iconesjs)</h1>
    <h1>Enter website url:</h1>
    <input type="text" v-model="url" id="url"
      class="block w-100 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="eg. https://google.com" />

    <button
      class="text-white bg-gray-800 hover:bg-gray-900 mt5 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
      @click="takeScreenshot">Take Screenshot</button>

    <div v-if="error" class="error-message text-red-500 mt-2">{{ error }}</div>

    <div v-if="screenshot" class="screenshot-container mx-auto">
      <img :src="screenshot" alt="Website Screenshot" draggable="false" />
    </div>

    <h1>JSON:</h1>

    <div v-if="userAgentJson" class="json-container mt-4">
      <pre>{{ userAgentJson }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: '',
      screenshot: null,
      userAgentJson: null,
      error: null
    };
  },
  methods: {
    async takeScreenshot() {
      this.error = null;

      if (!this.url.trim()) {
        this.error = 'Please input URL.';
        return;
      }

      try {
        const response = await this.$axios.post('http://localhost:3000/screenshot', {
          url: this.url,
        });

        this.screenshot = response.data.screenshot;

        this.userAgentJson = JSON.stringify({
          url: this.url,
          userAgent: response.data.userAgent,
          status: response.status,
          headers: response.headers,
          data: response.data,
          config: response.config,
        }, null, 2);
      } catch (error) {
        console.error('Error taking screenshot:', error.message);
        this.error = 'Error taking screenshot. Please try again.';
      }
    },
  },
};
</script>

<style scoped>
.screenshot-container {
  margin-top: 20px;
}

.json-container {
  background-color: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  overflow: auto;
}

.error-message {
  font-size: 14px;
}
</style>
