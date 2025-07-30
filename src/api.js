import { getAuthHeaders } from './auth'

const GITHUB_API_BASE =
  '[https://api.github.com/repos/](https://api.github.com/repos/)'
const delay = ms => new Promise(res => setTimeout(res, ms))

async function fetchAllPaginatedData (url) {
  let results = []
  let nextUrl = url
  while (nextUrl) {
    const response = await fetch(nextUrl, getAuthHeaders())
    if (!response.ok) {
      if (response.status === 403)
        throw new Error('GitHub API rate limit exceeded.')
      const error = await response.json()
      throw new Error(error.message || `Error: ${response.statusText}`)
    }
    results = results.concat(await response.json())
    const linkHeader = response.headers.get('Link')
    nextUrl = null
    if (linkHeader) {
      const nextLink = linkHeader.split(',').find(s => s.includes('rel="next"'))
      if (nextLink) nextUrl = nextLink.match(/<(.*?)>/)[1]
    }
  }
  return results
}

async function fetchContributorStatsWithRetry (url, setLoadingMessage) {
  for (let i = 0; i < 10; i++) {
    const response = await fetch(url, getAuthHeaders())
    if (response.status === 200) {
      return response.json()
    }
    if (response.status === 202) {
      setLoadingMessage(`Computing contributor stats... (attempt ${i + 1})`)
      await delay(2000)
    } else {
      const error = await response.json()
      throw new Error(
        error.message || `Error fetching stats: ${response.statusText}`
      )
    }
  }
  throw new Error(
    'Could not retrieve contributor stats after multiple attempts.'
  )
}

export async function analyzeRepo (owner, repo, setLoadingMessage) {
  setLoadingMessage('Fetching repository data...')
  const repoPromise = fetchFromGithub(`${owner}/${repo}`)

  setLoadingMessage('Fetching issues & PRs...')
  const issuesPromise = fetchAllPaginatedData(
    `${GITHUB_API_BASE}${owner}/${repo}/issues?state=open&per_page=100`
  )

  const statsPromise = fetchContributorStatsWithRetry(
    `${GITHUB_API_BASE}${owner}/${repo}/stats/contributors`,
    setLoadingMessage
  )

  const [repoData, issuesAndPRs, stats] = await Promise.all([
    repoPromise,
    issuesPromise,
    statsPromise
  ])

  const allIssues = issuesAndPRs.filter(item => !item.pull_request)
  const allPRs = issuesAndPRs.filter(item => item.pull_request)
  const contributorStats = stats ? stats.sort((a, b) => b.total - a.total) : []

  return { repoData, allIssues, allPRs, contributorStats }
}

async function fetchFromGithub (endpoint) {
  const response = await fetch(
    `${GITHUB_API_BASE}${endpoint}`,
    getAuthHeaders()
  )
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || `Error: ${response.statusText}`)
  }
  return response.json()
}
