<template>
    
    <div>
        <pre>{{ jsondata }}</pre>
        <button @click="fetchAll" :disabled="loading">
            {{ loading ? "Loading..." : "Show All (JSON)" }}
        </button>
        <pre v-if="books.length" class="json">{{ pretty }}</pre>
    </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import db from "@/firebase/init";
import axios from "axios";

export default {
    data() {
        return {
            jsondata: null,
            error: null,
            books: [], loading:false
        };
    },
    computed:{
        pretty(){ return JSON.stringify(this.books, null, 2); }
    },
    mounted() {
        this.getBookCountAPI();
    },
    methods: {
        async getBookCountAPI() {
            try {
                const response = await axios.get("https://us-central1-efolio-yutao.cloudfunctions.net/countBooks");
                this.jsondata = response.data;
                this.error = null;
            } catch (error) {
                console.error('Error fetching book count:', error);
                this.error = error;
                this.count = null;
            }
        },
        async fetchAll() {
            this.loading = true;
            try {
                const querySnapshot = await getDocs(collection(db, "books"));
                this.books = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (error) {
                console.error("Error fetching books:", error);
                this.error = error;
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>