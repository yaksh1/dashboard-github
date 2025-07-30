import React from 'react'
import { Bar } from 'react-chartjs-2'

function TopContributorsChart ({ contributorStats }) {
  // Chart logic here
  return (
    <div style={{ height: '300px' }}>
      <Bar
        data={{ labels: [], datasets: [] }}
        options={{ responsive: true, maintainAspectRatio: false }}
      />
    </div>
  )
}

export default TopContributorsChart
