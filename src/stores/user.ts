import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
    const user = ref(null)
    const isAuthenticated = computed(() => !!user.value)
    
    function setUser(newUser: any) {
        user.value = newUser
    }
    
    function clearUser() {
        user.value = null
    }
    
    return { user, isAuthenticated, setUser, clearUser }
})
