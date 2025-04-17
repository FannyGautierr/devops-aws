<script setup lang="ts">
  import { Authenticator } from "@aws-amplify/ui-vue";
  import "@aws-amplify/ui-vue/styles.css";
  import { useUserStore } from "@/stores/user";
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const userStore = useUserStore();

  const handleAuthSuccess = async (user: any) => {
    await userStore.initializeUser();
    router.push('/');
  };
</script>

<template>
  <authenticator>
    <template v-slot="{ user, signOut }">
      <div v-if="user" style="display:none">
          {{ handleAuthSuccess(user) }}
      </div>
    </template>
  </authenticator>
</template>
