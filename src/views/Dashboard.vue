<!-- <script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Toaster } from '@/components/ui/sonner';

const userStore = useUserStore();
const toast = new Toaster();

const form = ref({
  name: userStore.user?.name || '',
  email: userStore.user?.email || '',
  bio: userStore.user?.bio || '',
  location: userStore.user?.location || '',
  website: userStore.user?.website || '',
});

const isLoading = ref(false);

async function updateProfile() {
  try {
    isLoading.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update user profile in store
    console.log(form.value);
    userStore.updateUser(form.value);
    
    // toast({
    //   title: "Profile updated",
    //   description: "Your profile information has been successfully updated.",
    //   variant: "default",
    // });
  } catch (error) {
    // toast({
    //   title: "Update failed",
    //   description: "There was an error updating your profile.",
    //   variant: "destructive",
    // });
  } finally {
    isLoading.value = false;
  }
}

const getInitials = (name: string) => {
  return name.split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};
</script>

<template>
  <div v-if="userStore.user" class="container mx-auto py-8 px-4 max-w-4xl">
    <div class="flex flex-col md:flex-row items-center mb-6">
      <Avatar class="h-24 w-24 md:mr-6 mb-4 md:mb-0">
        <AvatarImage :src="userStore.user.avatarUrl" alt="User avatar" />
        <AvatarFallback>{{ getInitials(userStore.user.name) }}</AvatarFallback>
      </Avatar>
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
          
          <div class="space-y-2">
            <Label for="bio">Bio</Label>
            <Input id="bio" v-model="form.bio" as="textarea" rows="3" placeholder="Tell us a bit about yourself" />
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
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex justify-between">
        <Button variant="outline" @click="form = {
          name: userStore.user.name,
          email: userStore.user.email,
          bio: userStore.user.bio,
          location: userStore.user.location,
          website: userStore.user.website,
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
</template>
 -->

 <!-- <script setup lang="ts"> 
 import { useUserStore } from '@/stores/user'; 
 const userStore = useUserStore();

</script> 
<template> 
<div v-if="userStore.user"> <p>Welcome, {{ userStore.user.name }}</p>
</div> 
</template> -->


<script setup lang="ts">
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
onMounted(async () => {
  if (!userStore.user) {
    isInitializing.value = true;
    await userStore.initializeUser();
    isInitializing.value = false;
  }
  
  if (userStore.user) {
    form.value = {
      name: userStore.user.name || '',
      email: userStore.user.email || '',
      bio: userStore.user.bio || '',
      location: userStore.user.location || '',
      website: userStore.user.website || '',
    };
  }
});

async function updateProfile() {
  try {
    isLoading.value = true;
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update user profile in store
    await userStore.updateUser(form.value.name);
    
    // Update successful
    alert("Profile updated successfully");
  } catch (error) {
    // Update failed
    alert("Error updating profile");
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
</script>

<template>
  <div class="container mx-auto py-8 px-4 max-w-4xl">
    <div v-if="isInitializing" class="text-center p-8">
      <div class="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p>Loading profile...</p>
    </div>
    
    <div v-else-if="userStore.user" class="fade-in">
      <div class="flex flex-col md:flex-row items-center mb-6">
        <Avatar class="h-24 w-24 md:mr-6 mb-4 md:mb-0">
          <AvatarImage :src="userStore.user.avatarUrl" alt="User avatar" />
          <AvatarFallback>{{ getInitials(userStore.user.name) }}</AvatarFallback>
        </Avatar>
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
            
            <div class="space-y-2">
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
            </div>
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