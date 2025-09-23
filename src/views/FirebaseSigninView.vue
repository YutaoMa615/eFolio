<template>
  <h1>Sign in</h1>
  <p><input type="text" placeholder="Email" v-model="email"/></p>
  <p><input type="password" placeholder="Password" v-model="password"/></p>
  <p><button @click="signin">Sign in via Firebase</button></p>
</template>

<script setup>
import { ref } from "vue"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "vue-router"
const email = ref("")
const password = ref("")
const router = useRouter()
const auth = getAuth()
const signin = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
      console.log("Firebase Sign in Successful!")
      console.log(auth.currentUser) // To check the current User signed in

      const uidKey = `role_uid_${data.user.uid}`
      const emailKey = `role_${data.user.email}`
      let role = localStorage.getItem(uidKey)
      if (!role) role = localStorage.getItem(emailKey)
      if (!role) role = 'user' 
      localStorage.setItem('role', role)
      console.log("User role:", role, "(from", (localStorage.getItem(uidKey) ? uidKey : (localStorage.getItem(emailKey) ? emailKey : 'default')), ")")

      router.push("/Homeviews")
    })
    .catch((error) => {
      console.log(error.code)
    })
};
</script>
