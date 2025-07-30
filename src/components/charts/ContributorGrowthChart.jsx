import React from 'react'
import { Line } from 'react-chartjs-2'

function ContributorGrowthChart ({ contributorStats }) {
  // Chart logic here
  return (
    <div style={{ height: '300px' }}>
      <Line
        data={{ labels: [], datasets: [] }}
        options={{ responsive: true, maintainAspectRatio: false }}
      />
    </div>
  )
}

export default ContributorGrowthChart
