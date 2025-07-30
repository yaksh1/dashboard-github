import { account } from './appwrite'

// Redirects the user to the GitHub login page
export function handleSignIn () {
  account.createOAuth2Session(
    'github', // provider
    'http://localhost:5173', // success URL
    'http://localhost:5173/error' // failure URL
  )
}

// Logs the user out
export async function handleSignOut () {
  try {
    await account.deleteSession('current')
  } catch (error) {
    console.error('Failed to sign out:', error)
  }
}

// Checks for an active session on page load
export async function getLoggedInUser () {
  try {
    return await account.get()
  } catch (error) {
    // Not logged in
    return null
  }
}
