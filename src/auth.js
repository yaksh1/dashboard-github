const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID
const AUTH_FUNCTION_URL =
  '[https://hubgit-dashboard.netlify.app/.netlify/functions/auth](https://hubgit-dashboard.netlify.app/.netlify/functions/auth)' // Replace this with your deployed URL

export function getAuthHeaders () {
  const token = sessionStorage.getItem('github_token')
  return token ? { headers: { Authorization: `token ${token}` } } : {}
}

export function handleSignIn () {
  if (!GITHUB_CLIENT_ID) {
    alert('VITE_GITHUB_CLIENT_ID is not configured in .env.local file.')
    return
  }
  const state = Math.random().toString(36).substring(7)
  sessionStorage.setItem('oauth_state', state)
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo&state=${state}`
}

export function handleSignOut () {
  sessionStorage.removeItem('github_token')
  sessionStorage.removeItem('github_user')
}

export async function handleOAuthCallback () {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const state = params.get('state')

  if (code && state === sessionStorage.getItem('oauth_state')) {
    sessionStorage.removeItem('oauth_state')
    try {
      if (!AUTH_FUNCTION_URL) {
        throw new Error('Authentication function URL is not configured.')
      }
      const response = await fetch(AUTH_FUNCTION_URL, {
        method: 'POST',
        body: JSON.stringify({ code })
      })
      const data = await response.json()
      if (data.token) {
        sessionStorage.setItem('github_token', data.token)
        const userResponse = await fetch(
          '[https://api.github.com/user](https://api.github.com/user)',
          getAuthHeaders()
        )
        const userData = await userResponse.json()
        sessionStorage.setItem('github_user', userData.login)
      }
    } catch (error) {
      console.error(`Authentication error: ${error.message}`)
    } finally {
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }
}

export function updateAuthStatus () {
  const user = sessionStorage.getItem('github_user')
  const token = sessionStorage.getItem('github_token')
  return { user, token }
}
