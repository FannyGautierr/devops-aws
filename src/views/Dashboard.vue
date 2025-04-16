<script setup lang="ts">
// @ts-nocheck
import { useUserStore } from '@/stores/user';
import { ref, onMounted } from 'vue';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AvatarUpload from '@/components/AvatarUpload.vue';
import { toast } from 'vue-sonner';
import AddressManager from '@/components/AddressManager.vue';

const userStore = useUserStore();
const isLoading = ref(false);
const isInitializing = ref(false);

const form = ref({
  name: '',
  email: '',
  bio: '',
  location: '',
  website: '',
});

// Initialize user data if not already loaded
// onMounted(async () => {
//   if (!userStore.user) {
//     isInitializing.value = true;
//     await userStore.initializeUser();
//     isInitializing.value = false;
//   }
  
//   if (userStore.user) {
//     form.value = {
//       name: userStore.user.name || '',
//       email: userStore.user.email || '',
//     //   bio: userStore.user.bio || '',
//     //   location: userStore.user.location || '',
//     //   website: userStore.user.website || '',
//       addresses: userStore.user.addresses || [],
//     };
//   }
// });

onMounted(async () => {
  if (!userStore.user) {
    isInitializing.value = true;
    await userStore.initializeUser();
    isInitializing.value = false;
  }
  console.log(userStore.address);
  if (userStore.user) {
    form.value = {
      name: userStore.user.name || '',
      email: userStore.user.email || '',
    //   bio: userStore.user.bio || '',
    //   location: userStore.user.location || '',
    //   website: userStore.user.website || '',
      // Get addresses from user data
      addresses: userStore.address || []
    };
  }
});

async function updateProfile() {
  try {
    isLoading.value = true;
    
    // Update user profile in store with all form fields
    const updatedProfile = {
      name: form.value.name,
      email: form.value.email,
      addresses: form.value.addresses,
    //   bio: form.value.bio,
    //   location: form.value.location,
    //   website: form.value.website,
      // Preserve the existing avatarKey if it exists
      avatarKey: userStore.user?.avatarKey || null
    };
    
    // Call the API to update the user profile
    await userStore.updateUser(updatedProfile.name);
    
    // Update successful
    toast.success("Profile updated successfully");
  } catch (error) {
    // Update failed
    toast.error("Error updating profile");
    console.error('Error updating profile:', error);
  } finally {
    isLoading.value = false;
  }
}

const getInitials = (name: string) => {
  if (!name) return "U";
  return name.split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

const handleAvatarUpdate = (avatar) => {
  console.log('Avatar updated:', avatar);
};
</script>

<template>
  <div class="container mx-auto py-8 px-4 max-w-4xl">
    <div v-if="isInitializing" class="text-center p-8">
      <div class="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p>Loading profile...</p>
    </div>
    
    <div v-else-if="userStore.user" class="fade-in">
      <div class="flex flex-col md:flex-row items-center mb-6">
        <div class="md:mr-6 mb-4 md:mb-0">
          <AvatarUpload size="large" @update:avatar="handleAvatarUpdate" />
        </div>
        <div>
          <h1 class="text-3xl font-bold">Welcome, {{ userStore.user.name }}</h1>
          <p class="text-gray-500">Manage your profile information</p>
        </div>
      </div>

      <Card class="w-full">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details here</CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="updateProfile" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="name">Full Name</Label>
                <Input id="name" v-model="form.name" placeholder="Your name" />
              </div>
              
              <div class="space-y-2">
                <Label for="email">Email Address</Label>
                <Input id="email" v-model="form.email" type="email" placeholder="your.email@example.com" />
              </div>
            </div>

            <Separator />
            <AddressManager v-model="form.addresses" />
            <!-- <div class="space-y-2">
              <Label for="bio">Bio</Label>
              <Input id="bio" v-model="form.bio" placeholder="Tell us a bit about yourself" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <Label for="location">Location</Label>
                <Input id="location" v-model="form.location" placeholder="City, Country" />
              </div>
              
              <div class="space-y-2">
                <Label for="website">Website</Label>
                <Input id="website" v-model="form.website" type="url" placeholder="https://yourwebsite.com" />
              </div>
            </div> -->
          </form>
        </CardContent>
        <CardFooter class="flex justify-between">
          <Button variant="outline" @click="form = {
            name: userStore.user.name || '',
            email: userStore.user.email || '',
            bio: userStore.user.bio || '',
            location: userStore.user.location || '',
            website: userStore.user.website || '',
          }">
            Reset
          </Button>
          <Button @click="updateProfile" :disabled="isLoading">
            <span v-if="isLoading" class="mr-2">
              <span class="animate-spin inline-block h-4 w-4 border-2 border-t-transparent rounded-full"></span>
            </span>
            {{ isLoading ? 'Updating...' : 'Save Changes' }}
          </Button>
        </CardFooter>
      </Card>
    </div>
    
    <div v-else class="text-center p-8">
      <p class="text-xl">No user profile found. Please log in.</p>
      <Button class="mt-4" @click="userStore.initializeUser">Refresh</Button>
    </div>
  </div>
</template>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>