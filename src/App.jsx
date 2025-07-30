import React, { useState, useEffect } from 'react'
import EntryView from './components/EntryView'
import DashboardContainer from './components/DashboardContainer'
import AuthStatus from './components/AuthStatus'
import ThemeToggle from './components/ThemeToggle'
import { handleOAuthCallback, updateAuthStatus } from './auth'
import { analyzeRepo } from './api'

function App () {
  const [view, setView] = useState('entry') // entry, loading, dashboard
  const [repoData, setRepoData] = useState(null)
  const [error, setError] = useState(null)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [auth, setAuth] = useState({ user: null, token: null })

  useEffect(() => {
    handleOAuthCallback().then(() => {
      setAuth(updateAuthStatus())
    })
  }, [])

  const handleAnalyze = async (owner, repo) => {
    setView('loading')
    setError(null)
    try {
      const data = await analyzeRepo(owner, repo, setLoadingMessage)
      setRepoData(data)
      setView('dashboard')
    } catch (err) {
      setError(err.message)
      setView('entry')
    } finally {
      setLoadingMessage('')
    }
  }

  const handleNewSearch = () => {
    setRepoData(null)
    setView('entry')
  }

  const renderContent = () => {
    switch (view) {
      case 'loading':
        return (
          <div className='text-center min-h-screen flex flex-col justify-center'>
            <div className='loader mx-auto'></div>
            <p className='mt-4 text-sm text-[var(--muted-foreground)]'>
              {loadingMessage}
            </p>
          </div>
        )
      case 'dashboard':
        return (
          <DashboardContainer
            repoData={repoData}
            onNewSearch={handleNewSearch}
          />
        )
      case 'entry':
      default:
        return <EntryView onAnalyze={handleAnalyze} error={error} />
    }
  }

  return (
    <>
      <AuthStatus auth={auth} setAuth={setAuth} />
      <ThemeToggle />
      <div className='container mx-auto p-4 md:p-8'>{renderContent()}</div>
    </>
  )
}

export default App
