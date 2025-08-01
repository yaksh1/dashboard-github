# GitHub Repository Dashboard

This project is a web-based dashboard that provides a high-level overview of any public GitHub repository. It's designed to help developers quickly assess the health and activity of a project, identify trends, and find opportunities to contribute.

## Features

- **Repository Analysis:** Simply enter the URL of a GitHub repository to get a detailed analysis.
- **At-a-Glance Stats:** View key metrics like open issues, open PRs, average issue age, and average PR merge time.
- **Interactive Charts:** Visualize repository activity over time and see a breakdown of issues by label.
- **Detailed Lists:** Browse through filterable lists of all issues and pull requests.
- **Modal View:** Click on an issue or PR to see its details without leaving the page.
- **Theme Toggle:** Switch between light and dark mode for your viewing pleasure.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Charts:** Chart.js
- **API:** GitHub API

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/github-dashboard.git
   ```
2. **Install dependencies:**
   ```bash
   cd github-dashboard
   npm install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. **Open your browser** and navigate to `http://localhost:5173`.

## How to Use

1. **Enter a repository URL** in the input field on the homepage.
2. **Click "Analyze Repository"** to fetch and display the data.
3. **Explore the dashboard** to gain insights into the repository.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.