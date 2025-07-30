import React from 'react'
import TopContributorsChart from './charts/TopContributorsChart'
import BusFactorChart from './charts/BusFactorChart'
import ContributorGrowthChart from './charts/ContributorGrowthChart'

function CommunityView ({ contributorStats }) {
  if (!contributorStats || contributorStats.length === 0) {
    return (
      <div className='card p-4 text-center'>
        No contributor data available for this repository.
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
      <div className='card p-4'>
        <h3 className='font-bold mb-2'>Top Contributors (Last 90 Days)</h3>
        <TopContributorsChart contributorStats={contributorStats} />
      </div>
      <div className='card p-4'>
        <h3 className='font-bold mb-2'>Bus Factor (Top 5 All-Time)</h3>
        <p className='text-sm text-[var(--muted-foreground)] mb-2'>
          Percentage of total commits from top contributors.
        </p>
        <BusFactorChart contributorStats={contributorStats} />
      </div>
      <div className='lg:col-span-2 card p-4'>
        <h3 className='font-bold mb-2'>
          Unique Monthly Contributors (Last Year)
        </h3>
        <ContributorGrowthChart contributorStats={contributorStats} />
      </div>
    </div>
  )
}

export default CommunityView
