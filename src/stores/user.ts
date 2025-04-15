import { defineStore } from 'pinia'
import { getCurrentUser } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';

export const useUserStore = defineStore('user', () => {
    async function currentAuthenticatedUser() {
        try {
          const { username, userId, signInDetails } = await getCurrentUser();
          return { username, userId, signInDetails };
        } catch (err) {
          console.log(err);
        }
    }

    async function currentSession() {
    try {
        const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
        return { accessToken, idToken };
    } catch (err) {
        console.log(err);
    }
    }

    
    return {  currentAuthenticatedUser, currentSession }
})
