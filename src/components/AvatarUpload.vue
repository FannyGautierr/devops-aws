<script setup lang="ts">
// @ts-nocheck
import { ref, computed, onMounted, watch } from 'vue';
import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import { useUserStore } from '@/stores/user';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'vue-sonner';

const props = defineProps({
  size: {
    type: String,
    default: 'medium' // small, medium, large
  }
});

const emit = defineEmits(['update:avatar']);

const userStore = useUserStore();
const fileInput = ref(null);
const avatarUrl = ref('');
const uploading = ref(false);
const error = ref('');
const avatarKey = ref('');

const getInitials = (name: string) => {
  if (!name) return "U";
  return name.split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

const avatarSize = computed(() => {
  const sizes = {
    small: 'h-16 w-16',
    medium: 'h-24 w-24',
    large: 'h-32 w-32'
  };
  return sizes[props.size] || sizes.medium;
});

onMounted(async () => {
  if (userStore.user?.avatarKey) {
    avatarKey.value = userStore.user.avatarKey;
    try {
      // If the avatarUrl is already available in the user object, use it
      if (userStore.user.avatarUrl) {
        avatarUrl.value = userStore.user.avatarUrl;
      } else {
        // Otherwise, try to get the URL from S3
        const result = await getUrl({
          key: userStore.user.avatarKey,
          options: {
            accessLevel: 'protected'
          }
        });
        avatarUrl.value = result.url.toString();
      }
    } catch (err) {
      console.error('Error loading avatar:', err);
    }
  }
});

watch(() => userStore.user, async (newUser) => {
  if (newUser?.avatarKey && newUser.avatarKey !== avatarKey.value) {
    avatarKey.value = newUser.avatarKey;
    try {
      // If the avatarUrl is already available in the user object, use it
      if (newUser.avatarUrl) {
        avatarUrl.value = newUser.avatarUrl;
      } else {
        // Otherwise, try to get the URL from S3
        const result = await getUrl({
          key: newUser.avatarKey,
          options: {
            accessLevel: 'protected'
          }
        });
        avatarUrl.value = result.url.toString();
      }
    } catch (err) {
      console.error('Error loading avatar:', err);
    }
  }
}, { immediate: true });

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validate file type
  if (!file.type.match('image.*')) {
    error.value = 'Please select an image file';
    toast.error('Please select an image file');
    return;
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'Image size should be less than 5MB';
    toast.error('Image size should be less than 5MB');
    return;
  }
  
  error.value = '';
  uploading.value = true;
  
  try {
    // Delete previous avatar if exists
    if (avatarKey.value) {
      try {
        await remove({
          key: avatarKey.value,
          options: {
            accessLevel: 'protected'
          }
        });
      } catch (err) {
        console.error('Error removing previous avatar:', err);
      }
    }
    
    // Generate a unique file name
    const fileName = `avatar-${userStore.user?.username || 'user'}-${Date.now()}.${file.name.split('.').pop()}`;
    
    // Upload to S3
    await uploadData({
      key: fileName,
      data: file,
      options: {
        accessLevel: 'protected',
        contentType: file.type
      }
    }).result;
    
    // Get the URL of the uploaded file
    const urlResult = await getUrl({
      key: fileName,
      options: {
        accessLevel: 'protected'
      }
    });
    
    avatarUrl.value = urlResult.url.toString();
    avatarKey.value = fileName;
    
    // Update user profile with new avatar
    await userStore.updateUserAvatar(fileName, avatarUrl.value);
    
    // Emit the new avatar
    emit('update:avatar', { url: avatarUrl.value, key: fileName });
    
    toast.success('Avatar uploaded successfully');
    
  } catch (err) {
    console.error('Error uploading avatar:', err);
    error.value = 'Failed to upload avatar. Please try again.';
    toast.error('Failed to upload avatar. Please try again.');
  } finally {
    uploading.value = false;
  }
};
</script>

<template>
  <div class="avatar-upload">
    <div class="flex flex-col items-center gap-4">
      <Avatar :class="[avatarSize, 'cursor-pointer hover:opacity-90 transition-opacity']" @click="triggerFileInput">
        <AvatarImage v-if="avatarUrl" :src="avatarUrl" alt="User avatar" />
        <AvatarFallback v-if="!avatarUrl && userStore.user?.name">
          {{ getInitials(userStore.user.name) }}
        </AvatarFallback>
        <AvatarFallback v-else>
          <span v-if="!uploading">U</span>
          <div v-else class="animate-spin h-5 w-5 border-2 border-t-transparent rounded-full"></div>
        </AvatarFallback>
      </Avatar>
      
      <Button 
        variant="outline" 
        size="sm" 
        @click="triggerFileInput" 
        :disabled="uploading"
        class="text-xs"
      >
        <span v-if="uploading" class="mr-2">
          <span class="animate-spin inline-block h-3 w-3 border-2 border-t-transparent rounded-full"></span>
        </span>
        {{ avatarUrl ? 'Change Avatar' : 'Upload Avatar' }}
      </Button>
      
      <input
        type="file"
        ref="fileInput"
        accept="image/*"
        @change="handleFileChange"
        class="hidden"
      />
      
      <p v-if="error" class="text-destructive text-xs mt-1">{{ error }}</p>
    </div>
  </div>
</template>
