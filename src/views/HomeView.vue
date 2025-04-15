<script setup lang="ts">
// @ts-nocheck
import { onMounted } from 'vue';
import TheWelcome from '../components/TheWelcome.vue'
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
onMounted(() => {
  const user = userStore.fetchUserData();
  console.log(user)
});
</script>

<template>
  <main>
    <h1>Hello {{ user.name }}!</h1>
    <button @click="signOut">Sign Out</button>
  </main>
</template>
