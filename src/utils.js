export const calculateAverageAge = items => {
  if (!items || items.length === 0) return 'N/A'
  const now = new Date()
  const totalAge = items.reduce((acc, item) => {
    const createdAt = new Date(item.created_at)
    return acc + (now - createdAt)
  }, 0)
  const avgAgeMs = totalAge / items.length
  const avgAgeDays = avgAgeMs / (1000 * 60 * 60 * 24)
  return `${Math.round(avgAgeDays)} days`
}

