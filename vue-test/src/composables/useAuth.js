import { readonly, ref } from 'vue'

// Demo-only session state. It intentionally starts logged out after every reload.
const loggedIn = ref(false)

export function useAuth() {
  function login() {
    loggedIn.value = true
  }

  function logout() {
    loggedIn.value = false
  }

  return {
    isLoggedIn: readonly(loggedIn),
    login,
    logout,
  }
}
