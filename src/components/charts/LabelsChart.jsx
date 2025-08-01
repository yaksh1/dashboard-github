import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

function LabelsChart({ issues, setActiveView }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const labelCounts = issues.reduce((acc, issue) => {
            issue.labels.forEach(label => {
                acc[label.name] = (acc[label.name] || 0) + 1;
            });
            return acc;
        }, {});

        const sortedLabels = Object.entries(labelCounts).sort(([, a], [, b]) => b - a).slice(0, 7);
        const isDarkMode = document.documentElement.classList.contains('dark');
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = isDarkMode ? 'rgb(226, 232, 240)' : 'rgb(82, 82, 82)';

        chartInstance.current = new Chart(chartRef.current, {
            type: 'bar',
            data: {
                labels: sortedLabels.map(l => l[0]),
                datasets: [{
                    label: 'Issue Count',
                    data: sortedLabels.map(l => l[1]),
borderColor: 'rgb(74, 222, 128)', // Bright green
        backgroundColor: 'rgba(74, 222, 128, 0.2)', // Transparent green
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                plugins: { legend: { labels: { color: textColor } } },
                scales: {
                    x: { ticks: { color: textColor }, grid: { color: gridColor } },
                    y: { ticks: { color: textColor }, grid: { color: gridColor } }
                },
                onClick: (e) => {
                    const points = chartInstance.current.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
                    if (points.length) {
                        const firstPoint = points[0];
                        const label = chartInstance.current.data.labels[firstPoint.index];
                        // This is a bit of a hack. A better solution would be to use a state management library.
                        setActiveView('list', 'issues');
                        setTimeout(() => {
                            const searchInput = document.getElementById('search-input');
                            if(searchInput) {
                                searchInput.value = `label:${label}`;
                                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                            }
                        }, 0);
                    }
                }
            }
        });

    }, [issues, setActiveView]);

    return <canvas ref={chartRef}></canvas>;
}

export default LabelsChart;