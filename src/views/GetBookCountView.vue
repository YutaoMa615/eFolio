<template>
    <div id="app">
        <h1>Book Count</h1>
        <button @click="getBookCount">Get Book Count</button>
        <p v-if="count !== null">Total number of Books: {{ count }}</p>
        <p v-if="error">{{ error }}</p>
    </div>
</template>
<script>
import axios from "axios";

export default {
    data() {
        return {
            count: null,
            error: null
        };
    },
    methods: {
        async getBookCount() {
            try {
                const response = await axios.get("https://us-central1-efolio-yutao.cloudfunctions.net/countBooks");
                this.count = response.data.count;
                this.error = null;
            } catch (error) {
                console.error('Error fetching book count:', error);
                this.error = error;
                this.count = null;
            }
        }
    }
};
</script>