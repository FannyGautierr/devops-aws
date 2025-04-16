import { defineStore } from 'pinia';
import { getCurrentUser } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';
import { get, put } from 'aws-amplify/api';
import { ref, watch } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const address = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function currentAuthenticatedUser() {
    try {
      const userInfo = await getCurrentUser();
      return {
        username: userInfo.username,
        userId: userInfo.userId,
        signInDetails: userInfo.signInDetails,
      };
    } catch (err) {
      console.log('Error getting authenticated user:', err);
      return null;
    }
  }

  async function currentSession() {
    try {
      const { tokens } = await fetchAuthSession();
      if (!tokens) {
        return null;
      }
      return {
        accessToken: tokens.accessToken,
        idToken: tokens.idToken,
      };
    } catch (err) {
      console.log('Error getting current session:', err);
      return null;
    }
  }

  async function fetchUserData() {
    loading.value = true;
    error.value = null;

    try {
      const response = await get({
        apiName: 'users',
        path: '/get-user',
      });
      console.log('Response:', response);
      const { body } = await response.response;
      const userData = await body.json();
      // @ts-ignore
      console.log('User data:', userData.address);
      // @ts-ignore
      user.value = userData.user;
      // @ts-ignore
      address.value = userData?.address;
      // @ts-ignore
      return userData;
    } catch (err) {
      console.log('Error fetching user data:', err);
      // @ts-ignore
      error.value = err.message || 'Failed to fetch user data';
      return null;
    } finally {
      loading.value = false;
    }
  }
  async function initializeUser() {
    try {
      const authenticatedUser = await currentAuthenticatedUser();
      console.log('Authenticated user:', authenticatedUser);
      if (authenticatedUser) {
        await fetchUserData();
      }
    } catch (err) {
      console.log('Error initializing user:', err);
    }
  }

  async function updateUser(name: string ) {
    try {
      const response = await put({
        apiName: 'users',
        path: '/update-user',
        options: {
          body: {
            name: name, 
            // @ts-ignore
            email: user.value.email 
          },
        }
      });

      const { body } = await response.response;
      const updatedUser = await body.json();
      // @ts-ignore
      user.value = updatedUser;
      console.log('User data updated:', user.value);
      return updatedUser;

    } catch(err) {
      console.log('Error updating user data:', err);
    }
  }
  
  async function updateUserAvatar(avatarKey: string, avatarUrl?: string) {
    try {
      console.log('key', avatarKey, 'url', avatarUrl);
      const response = await put({
        apiName: 'users',
        path: '/update-user',
        options: {
          // @ts-ignore
          body: {
            // @ts-ignore
            name: user.value?.name || '',
            // @ts-ignore
            email: user.value?.email || '',
            avatarKey: avatarKey,
            avatarUrl: avatarUrl
          },
        }
      });

      const { body } = await response.response;
      const updatedUser = await body.json();
      // @ts-ignore
      user.value = updatedUser;
      console.log('User avatar updated:', user.value);
      return updatedUser;
    } catch(err) {
      console.log('Error updating user avatar:', err);
      // @ts-ignore
      error.value = err.message || 'Failed to update avatar';
      throw err;
    }
  }
  
  watch(user, (newUser) => {
    if (newUser) {
      console.log('User state updated:', newUser);
    }
  });

  return {
    user,
    loading,
    error,
    address,
    currentAuthenticatedUser,
    updateUser,
    updateUserAvatar,
    currentSession,
    fetchUserData,
    initializeUser,
  };
});
