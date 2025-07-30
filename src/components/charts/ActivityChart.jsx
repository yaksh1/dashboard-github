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
  TimeScale
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
)

function ActivityChart ({ issues, prs }) {
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

export default ActivityChart
