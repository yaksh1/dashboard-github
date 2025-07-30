import React, { useState, useMemo } from 'react';

const ITEMS_PER_PAGE = 10;

function ListView({ repoData, initialTab, onBack, onOpenModal }) {
    const { allIssues, allPRs } = repoData;
    const [activeTab, setActiveTab] = useState(initialTab);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentIssuesPage, setCurrentIssuesPage] = useState(1);
    const [currentPRsPage, setCurrentPRsPage] = useState(1);

    const filterItems = (items, query) => {
        const parts = query.toLowerCase().split(' ').filter(p => p);
        if (parts.length === 0) return items;

        return items.filter(item => {
            return parts.every(part => {
                if (part.startsWith('#')) {
                    const number = part.substring(1);
                    return item.number.toString() === number;
                }
                if (part.startsWith('label:')) {
                    const label = part.substring(6).trim();
                    return item.labels.some(l => l.name.toLowerCase().includes(label));
                }
                if (part.startsWith('age:>')) {
                    const days = parseInt(part.substring(5), 10);
                    if(isNaN(days)) return true;
                    const age = (new Date() - new Date(item.created_at)) / (1000 * 60 * 60 * 24);
                    return age > days;
                }
                 if (part.startsWith('age:<')) {
                    const days = parseInt(part.substring(5), 10);
                    if(isNaN(days)) return true;
                    const age = (new Date() - new Date(item.created_at)) / (1000 * 60 * 60 * 24);
                    return age < days;
                }
                return item.title.toLowerCase().includes(part);
            });
        });
    };

    const filteredIssues = useMemo(() => filterItems(allIssues, searchQuery), [allIssues, searchQuery]);
    const filteredPRs = useMemo(() => filterItems(allPRs, searchQuery), [allPRs, searchQuery]);

    const paginatedIssues = useMemo(() => filteredIssues.slice((currentIssuesPage - 1) * ITEMS_PER_PAGE, currentIssuesPage * ITEMS_PER_PAGE), [filteredIssues, currentIssuesPage]);
    const paginatedPRs = useMemo(() => filteredPRs.slice((currentPRsPage - 1) * ITEMS_PER_PAGE, currentPRsPage * ITEMS_PER_PAGE), [filteredPRs, currentPRsPage]);

    const totalIssuePages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);
    const totalPRPages = Math.ceil(filteredPRs.length / ITEMS_PER_PAGE);

    const renderList = (items, type) => {
        if (items.length === 0) {
            return <p className="muted-text p-4 card">No items match the current filter.</p>;
        }
        return items.map(item => <ItemCard key={item.id} item={item} type={type} onOpenModal={onOpenModal} />);
    };

    const renderPagination = (currentPage, totalPages, setCurrentPage) => {
        if (totalPages <= 1) return null;
        return (
            <div className="mt-4 flex justify-between items-center">
                <button className="btn-secondary px-3 py-1 text-sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Previous</button>
                <span className="text-sm muted-text">Page {currentPage} of {totalPages}</span>
                <button className="btn-secondary px-3 py-1 text-sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Next</button>
            </div>
        );
    };

    return (
        <div>
            <div className="card p-4 mb-6">
                <form id="search-form" className="flex flex-col sm:flex-row gap-4 items-center" onSubmit={e => e.preventDefault()}>
                    <div className="relative w-full">
                        <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 muted-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input 
                            type="text" 
                            id="search-input" 
                            className="input w-full p-2 pl-10" 
                            placeholder="Search... e.g., label:bug age:>30d text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </form>
            </div>

            <div className="border-b border-[var(--border)] mb-6">
                <nav className="flex -mb-px" id="list-view-tabs">
                    <button onClick={() => setActiveTab('issues')} className={`list-tab text-lg whitespace-nowrap py-3 px-6 border-b-2 font-medium ${activeTab === 'issues' ? 'btn-primary' : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>Issues</button>
                    <button onClick={() => setActiveTab('prs')} className={`list-tab text-lg whitespace-nowrap py-3 px-6 border-b-2 font-medium ${activeTab === 'prs' ? 'btn-primary' : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>Pull Requests</button>
                </nav>
            </div>
            
            <div id="issues-tab-content" className={activeTab !== 'issues' ? 'hidden' : ''}>
                <h3 className="text-2xl font-bold mb-4">Open Issues (<span id="issues-count">{filteredIssues.length}</span>)</h3>
                <div id="issues-list" className="space-y-4 min-h-[200px]">{renderList(paginatedIssues, 'issue')}</div>
                {renderPagination(currentIssuesPage, totalIssuePages, setCurrentIssuesPage)}
            </div>
            <div id="prs-tab-content" className={activeTab !== 'prs' ? 'hidden' : ''}>
                <h3 className="text-2xl font-bold mb-4">Open Pull Requests (<span id="prs-count">{filteredPRs.length}</span>)</h3>
                <div id="prs-list" className="space-y-4 min-h-[200px]">{renderList(paginatedPRs, 'pr')}</div>
                {renderPagination(currentPRsPage, totalPRPages, setCurrentPRsPage)}
            </div>
        </div>
    );
}

function ItemCard({ item, type, onOpenModal }) {
    const isPR = !!item.pull_request;
    const labelsHtml = item.labels.map(label => 
        `<span class="label-tag" style="background-color:#${label.color}30; color:#${label.color}; border: 1px solid #${label.color}80;">${label.name}</span>`
    ).join('');

    const now = new Date();
    const updatedAt = new Date(item.updated_at);
    const stalenessDays = (now - updatedAt) / (1000 * 60 * 60 * 24);
    let stalenessClass = '';
    if (stalenessDays > 30) stalenessClass = 'stale-indicator';
    else if (stalenessDays < 1) stalenessClass = 'recent-indicator';

    return (
        <div className={`card p-4 hover:shadow-md transition-shadow cursor-pointer ${type}-item-card ${stalenessClass}`} onClick={() => onOpenModal(type, item.number)}>
            <h4 className="font-bold mb-2">{item.title}</h4>
            <div className="flex flex-wrap gap-2 mb-2" dangerouslySetInnerHTML={{__html: labelsHtml}}></div>
            <p className="text-sm muted-text">#{item.number} opened by {item.user.login} &bull; updated {Math.floor(stalenessDays)} days ago</p>
        </div>
    );
}

export default ListView;