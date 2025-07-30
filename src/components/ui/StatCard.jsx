import React from 'react'

function StatCard ({ label, value, icon, type, onClick }) {
  const isClickable = !!type
  return (
    <div
      className={`card p-4 text-center ${isClickable ? 'card-clickable' : ''}`}
      onClick={onClick}
    >
      <div className='text-2xl font-bold'>
        {icon} {value}
      </div>
      <div className='text-sm text-[var(--muted-foreground)]'>{label}</div>
    </div>
  )
}

export default StatCard
