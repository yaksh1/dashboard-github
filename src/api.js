// This file reads a Personal Access Token from a .env.local file.
// This is secure for local development.
// DO NOT commit the .env.local file to your repository.

// 1. Create a file named .env.local in your project root.
// 2. Add this line to it: VITE_GITHUB_PAT=your_personal_access_token_here
const GITHUB_PAT = import.meta.env.VITE_GITHUB_PAT

const GITHUB_API_BASE = 'https://api.github.com/repos/'
const delay = ms => new Promise(res => setTimeout(res, ms))

// Helper function to create the authorization headers
function getAuthHeaders () {
  if (!GITHUB_PAT) {
    // This check helps diagnose if the .env.local file is not set up correctly.
    console.error(
      'CRITICAL: VITE_GITHUB_PAT is not configured in your .env.local file. API calls will be unauthenticated and will likely fail due to rate limiting.'
    )
    return {}
  }
  return {
    headers: {
      Authorization: `token ${GITHUB_PAT}`,
      Accept: 'application/vnd.github.v3+json'
    }
  }
}

async function fetchAllPaginatedData (url) {
  let results = []
  let nextUrl = url
  while (nextUrl) {
    const response = await fetch(nextUrl, getAuthHeaders())
    if (!response.ok) {
      if (response.status === 403)
        throw new Error(
          'GitHub API rate limit exceeded. Check your token permissions.'
        )
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
  const contributorStats = Array.isArray(stats)
    ? stats.sort((a, b) => b.total - a.total)
    : []

  return { repoData, allIssues, allPRs, contributorStats }
}
