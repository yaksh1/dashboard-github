import React, { useState } from 'react'
import DashboardView from './DashboardView'
import CommunityView from './CommunityView'
import ListView from './ListView'

function DashboardContainer ({ repoData, onNewSearch }) {
  const [activeView, setActiveView] = useState('dashboard')

  const renderView = () => {
    switch (activeView) {
      case 'community':
        return <CommunityView contributorStats={repoData.contributorStats} />
      case 'lists':
        return <ListView issues={repoData.allIssues} prs={repoData.allPRs} />
      case 'dashboard':
      default:
        return (
          <DashboardView repoData={repoData} setActiveView={setActiveView} />
        )
    }
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6 flex-wrap gap-4'>
        <button
          onClick={onNewSearch}
          className='btn-secondary px-4 py-2 flex items-center gap-2'
        >
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M10 19l-7-7m0 0l7-7m-7 7h18'
            ></path>
          </svg>
          New Search
        </button>
        <h2 className='text-2xl font-bold text-center order-first w-full sm:w-auto sm:order-none'>
          {repoData.repoData.full_name}
        </h2>
      </div>
      <div className='border-b border-[var(--border)] mb-6'>
        <nav className='flex -mb-px'>
          <button
            onClick={() => setActiveView('dashboard')}
            className={`main-tab text-lg whitespace-nowrap py-3 px-6 border-b-2 font-medium ${
              activeView === 'dashboard'
                ? 'btn-primary'
                : 'border-transparent text-[var(--muted-foreground)]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('community')}
            className={`main-tab text-lg whitespace-nowrap py-3 px-6 border-b-2 font-medium ${
              activeView === 'community'
                ? 'btn-primary'
                : 'border-transparent text-[var(--muted-foreground)]'
            }`}
          >
            Community
          </button>
          <button
            onClick={() => setActiveView('lists')}
            className={`main-tab text-lg whitespace-nowrap py-3 px-6 border-b-2 font-medium ${
              activeView === 'lists'
                ? 'btn-primary'
                : 'border-transparent text-[var(--muted-foreground)]'
            }`}
          >
            Explorer
          </button>
        </nav>
      </div>
      {renderView()}
    </div>
  )
}

export default DashboardContainer
