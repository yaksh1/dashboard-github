import React from 'react'
import { handleSignIn, handleSignOut } from '../auth'

function AuthStatus ({ user, setUser }) {
  const onSignOut = async () => {
    await handleSignOut()
    setUser(null)
  }

  if (user) {
    return (
      <div className='fixed top-4 left-4 z-50 flex items-center gap-2'>
        <span className='text-sm text-[var(--muted-foreground)]'>
          Signed in as {user.name}
        </span>
        <button onClick={onSignOut} className='btn-secondary text-sm px-2 py-1'>
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className='fixed top-4 left-4 z-50 flex items-center gap-2'>
      <button
        onClick={handleSignIn}
        className='btn-secondary text-sm px-2 py-1'
      >
        Sign in with GitHub
      </button>
    </div>
  )
}

export default AuthStatus
