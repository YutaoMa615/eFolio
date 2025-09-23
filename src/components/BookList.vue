<template>
    <div>
        <h1>Books with ISBN > 1000</h1>
        <div style="display:flex;flex-wrap:wrap;gap:12px;margin:12px 0;">
            <!-- WHERE -->
            <div>
                <label>Where:</label>
                <select v-model="whereField">
                    <option value="none">-- none --</option>
                    <option value="name">where name ==</option>
                    <option value="isbn">where isbn ==</option>
                </select>
                <input
                    v-if="whereField==='name'"
                    v-model="whereName"
                    type="text"
                    placeholder="e.g. Vue"
                    style="margin-left:6px;"
                />
                <input
                    v-if="whereField==='isbn'"
                    v-model.number="whereIsbn"
                    type="number"
                    placeholder="e.g. 1234"
                    style="margin-left:6px;width:120px;"
                />
            </div>
            <!-- ORDER -->
            <div>
                <label>Order by:</label>
                <select v-model="orderOption">
                    <option value="none">-- none --</option>
                    <option value="isbn_desc">isbn desc</option>
                    <option value="name_asc">name asc</option>
                </select>
            </div>
            <!-- LIMIT -->
            <div>
                <label>Limit:</label>
                <input v-model.number="limitCount" type="number" min="0" style="width:80px;" />
                <small style="margin-left:6px;">0 = no limit</small>
            </div>
            <!-- BUTTONS -->
            <div>
                <button @click="runQuery">Run</button>
                <button @click="resetControls" style="margin-left:6px;">Reset</button>
                <button @click="loadAll" style="margin-left:6px;">Load all</button>
            </div>
        </div>
        <ul>
            <li v-for="book in books" :key="book.id">
                {{ book.name }} - ISBN {{ book.isbn }}
                <button @click="updateBook(book)" style="margin-left:10px">Update</button>
                <button @click="deleteBook(book.id)" style="margin-left:6px">Delete</button>
            </li>
        </ul>
    </div>
</template>

<script>    
import { ref, onMounted } from 'vue';
import db from '../firebase/init.js';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, orderBy, limit } from 'firebase/firestore';

export default {
    setup() {
        const books = ref([]);
        const colRef = collection(db, 'books')

        const whereField = ref('none')   // none | name | isbn
        const whereName  = ref('')
        const whereIsbn  = ref(null)
        const orderOption = ref('none')  // none | isbn_desc | name_asc
        const limitCount  = ref(0)

        const assign = (snap, tag) => {
            books.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
            console.log(`[${tag}]`, books.value)
        }
        
        const loadAll = async () => {
            const snap = await getDocs(colRef)
            assign(snap, 'ALL')
        }


        const runQuery = async () => {
            try {
                const constraints = []

                // WHERE
                if (whereField.value === 'name' && whereName.value.trim() !== '') {
                    constraints.push(where('name', '==', whereName.value.trim()))
                } else if (whereField.value === 'isbn' && Number.isFinite(whereIsbn.value)) {
                    constraints.push(where('isbn', '==', Number(whereIsbn.value)))
                }

                // ORDER
                if (orderOption.value === 'isbn_desc') {
                    constraints.push(orderBy('isbn', 'desc'))
                } else if (orderOption.value === 'name_asc') {
                    constraints.push(orderBy('name', 'asc'))
                }

                // LIMIT
                if (Number.isFinite(limitCount.value) && limitCount.value > 0) {
                    constraints.push(limit(Number(limitCount.value)))
                }

                const q = constraints.length ? query(colRef, ...constraints) : colRef
                const snap = await getDocs(q)
                assign(snap, `QUERY where=${whereField.value} order=${orderOption.value} limit=${limitCount.value||0}`)
            } catch (e) {
                console.error('Query error:', e)
            }
        }

         const resetControls = () => {
            whereField.value = 'none'
            whereName.value  = ''
            whereIsbn.value  = null
            orderOption.value = 'none'
            limitCount.value  = 0
            books.value = []
            console.log('[RESET] controls cleared')
        }

        const fetchBooks = async () => {
            try {
                const q = query(collection(db, 'books'), where('isbn', '>', 1000));
                const querySnapshot = await getDocs(q);
                const booksArray = [];
                querySnapshot.forEach((doc) => {
                    booksArray.push({ id: doc.id, ...doc.data() });
                });
                books.value = booksArray;
                console.log('Loaded books:', books.value)
            } catch (error) {
                console.error('Error fetching books: ', error);
            }
        };

        const updateBook = async (book) => {
            try {
                const newName = prompt('Enter new book name:', book.name)
                if (newName === null) return
                const ref = doc(db, 'books', book.id)
                await updateDoc(ref, { name: newName })
                console.log('Updated book:', book.id, '->', newName)
                await runQuery()
            } catch (error) {
                console.error('Error updating book: ', error)
            }
        }

        const deleteBook = async (id) => {
            try {
                await deleteDoc(doc(db, 'books', id))
                console.log('Deleted book:', id)
                await runQuery()
            } catch (error) {
                console.error('Error deleting book: ', error)
            }
        }

        onMounted(() => {
            fetchBooks();
        });

        return {
            books,
            whereField, 
            whereName, 
            whereIsbn,
            orderOption, 
            limitCount,
            runQuery, 
            resetControls, 
            loadAll,
            updateBook,
            deleteBook
        };
    }
}
</script>