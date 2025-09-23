<template>
  <h1>Create an Account</h1>
  <p><input type="text" placeholder="Email" v-model="email"/></p>
  <p><input type="password" placeholder="Password" v-model="password"/></p>
  
  <p>
    <label>
      <input type="radio" value="admin" v-model="role" /> Admin
    </label>
    <label>
      <input type="radio" value="user" v-model="role" /> User
    </label>
  </p>

  <p><button @click="register">Save to Firebase</button>
  </p>
</template>

<script setup>
import { ref } from "vue"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "vue-router"

const role = ref("user")
const email = ref("")
const password = ref("")
const router = useRouter()
const auth = getAuth()
const register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log("Firebase Register Successful!")
      
      const uidKey = `role_uid_${data.user.uid}`
      const emailKey = `role_${data.user.email}`
      localStorage.setItem(uidKey, role.value)
      localStorage.setItem(emailKey, role.value)
      localStorage.setItem('role', role.value)
      console.log("Saved role =", role.value, "as", uidKey, "and", emailKey)

      router.push("/FireLogin")
    })
    .catch((error) => {
      console.log(error.code)
    })
};
</script>
