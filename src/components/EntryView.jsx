import React, { useState } from 'react'

const parseRepoUrl = url => {
  try {
    const path = new URL(url).pathname
    const parts = path.split('/').filter(p => p)
    if (parts.length >= 2) return { owner: parts[0], repo: parts[1] }
  } catch (e) {
    const parts = url.split('/').filter(p => p)
    if (parts.length === 2) return { owner: parts[0], repo: parts[1] }
  }
  return null
}

function EntryView ({ onAnalyze, error }) {
  const [url, setUrl] = useState('')
  const [localError, setLocalError] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    const repoInfo = parseRepoUrl(url)
    if (repoInfo) {
      setLocalError('')
      onAnalyze(repoInfo.owner, repoInfo.repo)
    } else {
      setLocalError('Please enter a valid GitHub repository URL.')
    }
  }

  return (
    <div className='max-w-2xl mx-auto text-center min-h-screen flex flex-col justify-center'>
      <h1 className='text-4xl md:text-5xl font-bold mb-4'>
        Get a bird's-eye view of any GitHub repository.
      </h1>
      <p className='text-[var(--muted-foreground)] mb-8 text-lg'>
        Paste a repository URL to analyze its health, community, and activity.
      </p>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-2'>
        <input
          type='text'
          value={url}
          onChange={e => setUrl(e.target.value)}
          className='input w-full p-3 text-center sm:text-left'
          placeholder='e.g., [https://github.com/facebook/react](https://github.com/facebook/react)'
          required
        />
        <button type='submit' className='btn-primary font-bold p-3 px-6'>
          Analyze
        </button>
      </form>
      <div className='mt-4 text-sm h-5 text-[var(--destructive)]'>
        {error || localError}
      </div>
    </div>
  )
}

export default EntryView
