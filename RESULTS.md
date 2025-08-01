# Fix Average PR Age Calculation

## Changes

- Modified `src/utils.js` to correctly calculate the average PR age by considering all closed PRs, not just merged ones.
- Renamed `calculateAverageMergeTime` to `calculateAveragePRAge` for clarity.
- Updated `src/components/DashboardView.jsx` to use the new function and display "Avg. PR Age".

## How to test

1. Run the application.
2. Analyze a repository.
3. The "Avg. PR Age" stat card should now display a value instead of "N/A".