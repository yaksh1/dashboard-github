import React from 'react'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler // Import Filler plugin for area fills
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { enUS } from 'date-fns/locale'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler // Register the Filler plugin
)

function ActivityChart ({ issues, prs }) {
  const last90Days = Array.from({ length: 90 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d
  }).reverse()

  const openedLast90Days = last90Days.map(date => {
    const dateString = date.toISOString().slice(0, 10)
    const openedIssues = issues.filter(
      i => i.created_at.slice(0, 10) === dateString
    ).length
    const openedPRs = prs.filter(
      p => p.created_at.slice(0, 10) === dateString
    ).length
    return openedIssues + openedPRs
  })

  const closedLast90Days = last90Days.map(date => {
    const dateString = date.toISOString().slice(0, 10)
    const closedIssues = issues.filter(
      i => i.closed_at && i.closed_at.slice(0, 10) === dateString
    ).length
    const closedPRs = prs.filter(
      p => p.merged_at && p.merged_at.slice(0, 10) === dateString
    ).length
    return closedIssues + closedPRs
  })

  const isDarkMode = document.documentElement.classList.contains('dark')
  const gridColor = isDarkMode
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'
  const textColor = isDarkMode ? 'rgb(226, 232, 240)' : 'rgb(82, 82, 82)'

  const data = {
    labels: last90Days,
    datasets: [
      {
        label: 'Opened',
        data: openedLast90Days,
        borderColor: 'rgb(74, 222, 128)', // Bright green
        backgroundColor: 'rgba(74, 222, 128, 0.2)', // Transparent green
        fill: true, // Enable the area fill
        tension: 0.3
      },
      {
        label: 'Closed',
        data: closedLast90Days,
        borderColor: 'rgb(96, 165, 250)', // Bright blue
        backgroundColor: 'rgba(96, 165, 250, 0.2)', // Transparent blue
        fill: true, // Enable the area fill
        tension: 0.3
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: textColor } } },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'week', // Display labels by week for clarity
          displayFormats: {
            week: 'MMM d'
          }
        },
        adapters: {
          date: {
            locale: enUS
          }
        },
        ticks: { color: textColor },
        grid: { color: gridColor }
      },
      y: {
        ticks: { color: textColor },
        grid: { color: gridColor },
        beginAtZero: true
      }
    }
  }

  return (
    <div style={{ height: '300px' }}>
      <Line data={data} options={options} />
    </div>
  )
}

export default ActivityChart
