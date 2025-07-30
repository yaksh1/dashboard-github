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

export const calculateAverageMergeTime = prs => {
  if (!prs || prs.length === 0) return 'N/A';
  const mergedPRs = prs.filter(pr => pr.merged_at);
  if (mergedPRs.length === 0) return 'N/A';

  const totalMergeTime = mergedPRs.reduce((acc, pr) => {
    const createdAt = new Date(pr.created_at);
    const mergedAt = new Date(pr.merged_at);
    return acc + (mergedAt - createdAt);
  }, 0);

  const avgMergeTimeMs = totalMergeTime / mergedPRs.length;
  const avgMergeTimeDays = avgMergeTimeMs / (1000 * 60 * 60 * 24);
  return `${Math.round(avgMergeTimeDays)} days`;
};
