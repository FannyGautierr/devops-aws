// import { defineStore } from 'pinia'
// import { getCurrentUser } from 'aws-amplify/auth';
// import { fetchAuthSession } from 'aws-amplify/auth';
// import { get, put, post } from 'aws-amplify/api';
// import { ref } from 'vue';

// export const useUserStore = defineStore('user', () => {
//   const user = ref(null);
//   const loading = ref(false);
//   const error = ref(null);

//   // Get the authenticated user from Cognito
//   async function currentAuthenticatedUser() {
//     try {
//       const userInfo = await getCurrentUser();
//       return {
//         username: userInfo.username,
//         userId: userInfo.userId,
//         signInDetails: userInfo.signInDetails
//       };
//     } catch (err) {
//       console.log('Error getting authenticated user:', err);
//       return null;
//     }
//   }

//   // Get the current session tokens
//   async function currentSession() {
//     try {
//       const { tokens } = await fetchAuthSession();
//       if (!tokens) {
//         return null;
//       }
//       return {
//         accessToken: tokens.accessToken,
//         idToken: tokens.idToken
//       };
//     } catch (err) {
//       console.log('Error getting current session:', err);
//       return null;
//     }
//   }

//   // Fetch user data from your API
//   async function fetchUserData() {
//     loading.value = true;
//     error.value = null;
    
//     try {
//       const response = await get({
//         apiName: 'users',
//         path: '/get-user'
//       });
      
//       const { body } = await response.response;
//       const userData = await body.json();
//       user.value = userData.user;
//       console.log('User data fetched:', user.value);
//       return userData.user;
//     } catch (err) {
//       console.log('Error fetching user data:', err);
//       error.value = err.message || 'Failed to fetch user data';
//       return null;
//     } finally {
//       loading.value = false;
//     }
//   }

//   async function updateUser(){
//     try{
//       const user = await getCurrentUser()
//       const update = await put({
//         apiName: 'users',
//         path: '/update-user',
//         body: {
//           id:user.userId,
//           // Add other user data to update
//         }
        
//       });
//       const { body } = await update.response;
//       const updatedUser = await body.json();
//       user.value = updatedUser;
//       return updatedUser;
//     }catch(err){
//       console.log('Error updating user data:', err);

//     }
//   }

//   return {
//     user,
//     loading,
//     error,
//     currentAuthenticatedUser,
//     currentSession,
//     fetchUserData
//   }
// })

import { defineStore } from 'pinia';
import { getCurrentUser } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';
import { get, put } from 'aws-amplify/api';
import { ref, watch } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Get the authenticated user from Cognito
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

  // Get the current session tokens
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

  // Fetch user data from your API
  async function fetchUserData() {
    loading.value = true;
    error.value = null;

    try {
      const response = await get({
        apiName: 'users',
        path: '/get-user',
      });

      const { body } = await response.response;
      const userData = await body.json();
      user.value = userData.user;
      console.log('User data fetched:', user.value);
      console.log(user.value)
      return userData.user;
    } catch (err) {
      console.log('Error fetching user data:', err);
      error.value = err.message || 'Failed to fetch user data';
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Automatically fetch user data when the user signs in
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
      console.log('Updating user data...');
      console.log(user.value.email)
      const response = await put({
        apiName: 'users',
        path: '/update-user',
        options: {
          body: {
            name: name, // Use the name parameter that was passed in
            email: user.value.email 
          },
        }
      });

      const { body } = await response.response;
      const updatedUser = await body.json();
      user.value = updatedUser;
      console.log('User data updated:', user.value);
      return updatedUser;

    } catch(err) {
      console.log('Error updating user data:', err);
    }
  }

  // Watch for changes in the user state and trigger actions
  watch(user, (newUser) => {
    if (newUser) {
      console.log('User state updated:', newUser);
    }
  });

  return {
    user,
    loading,
    error,
    currentAuthenticatedUser,
    updateUser,
    currentSession,
    fetchUserData,
    initializeUser,
  };
});