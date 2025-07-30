import React from 'react';
import StatCard from './ui/StatCard';
import ActivityChart from './charts/ActivityChart';
import LabelsChart from './charts/LabelsChart';
import { calculateAverageAge, calculateAverageMergeTime } from '../utils';

function DashboardView({ repoData, setActiveView }) {
    const { allIssues, allPRs } = repoData;

    const stats = [
        {
            label: 'Open Issues',
            value: allIssues.length.toLocaleString(),
            icon: '🐞',
            type: 'list',
            tab: 'issues'
        },
        {
            label: 'Open PRs',
            value: allPRs.length.toLocaleString(),
            icon: '🔃',
            type: 'list',
            tab: 'prs'
        },
        {
            label: 'Avg. Issue Age',
            value: calculateAverageAge(allIssues),
            icon: '⏳'
        },
        { label: 'Avg. PR Merge Time', value: calculateAverageMergeTime(allPRs), icon: '⌛' }
    ];

    return (
        <div>
            <div id="summary-stats" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map(stat => (
                    <StatCard
                        key={stat.label}
                        {...stat}
                        onClick={() => stat.type && setActiveView(stat.type, stat.tab)}
                    />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
                <div className="lg:col-span-3 card p-4">
                    <h3 className="font-bold mb-2">Activity Trend (Last 90 Days)</h3>
                    <ActivityChart issues={allIssues} prs={allPRs} />
                </div>
                <div className="lg:col-span-2 card p-4">
                    <h3 className="font-bold mb-2">Issue Breakdown by Label</h3>
                    <LabelsChart issues={allIssues} setActiveView={setActiveView} />
                </div>
            </div>
        </div>
    );
}

export default DashboardView;