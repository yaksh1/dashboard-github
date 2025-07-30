import React from 'react'
import { Line } from 'react-chartjs-2'

function ContributorGrowthChart ({ contributorStats }) {
  const isDarkMode = document.documentElement.classList.contains('dark')
  const gridColor = isDarkMode
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'
  const textColor = isDarkMode ? 'rgb(226, 232, 240)' : 'rgb(82, 82, 82)'
  // Chart logic here
  return (
    <div style={{ height: '300px' }}>
      <Line
        data={{ labels: [], datasets: [] }}
        options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: textColor } } }, scales: { x: { ticks: { color: textColor }, grid: { color: gridColor } }, y: { ticks: { color: textColor }, grid: { color: gridColor } } } }}
      />
    </div>
  )
}

export default ContributorGrowthChart
