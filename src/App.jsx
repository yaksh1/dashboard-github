import React, { useState, useEffect } from 'react';
import EntryView from './components/EntryView';
import DashboardView from './components/DashboardView';
import ListView from './components/ListView';
import ThemeToggle from './components/ThemeToggle';
import Modal from './components/Modal'; // Assuming you create a Modal component
import { analyzeRepo } from './api';

function App() {
    const [view, setView] = useState('entry'); // entry, loading, dashboard, list
    const [repoData, setRepoData] = useState(null);
    const [error, setError] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [activeListView, setActiveListView] = useState('issues');
    const [modalData, setModalData] = useState(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        const urlParams = new URLSearchParams(window.location.search);
        const repoFromUrl = urlParams.get('repo');
        if (repoFromUrl) {
            const [owner, repo] = repoFromUrl.split('/');
            if(owner && repo) handleAnalyze(owner, repo);
        }
    }, []);

    const handleAnalyze = async (owner, repo) => {
        setView('loading');
        setError(null);
        try {
            const data = await analyzeRepo(owner, repo, setLoadingMessage);
            setRepoData(data);
            setView('dashboard');
        } catch (err) {
            setError(err.message);
            setView('entry');
        } finally {
            setLoadingMessage('');
        }
    };

    const handleNewSearch = () => {
        setRepoData(null);
        setView('entry');
    };

    const openModal = (type, number) => {
        const items = type === 'issue' ? repoData.allIssues : repoData.allPRs;
        const item = items.find(i => i.number == number);
        setModalData(item);
    };

    const closeModal = () => {
        setModalData(null);
    };

    const renderContent = () => {
        switch (view) {
            case 'loading':
                return (
                    <div className="text-center min-h-screen flex flex-col justify-center">
                        <div className="loader mx-auto"></div>
                        <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                            {loadingMessage}
                        </p>
                    </div>
                );
            case 'dashboard':
                return (
                    <DashboardView 
                        repoData={repoData} 
                        setActiveView={(view, tab) => {
                            setView(view);
                            setActiveListView(tab);
                        }} 
                    />
                );
            case 'list':
                return (
                    <ListView 
                        repoData={repoData} 
                        initialTab={activeListView}
                        onBack={() => setView('dashboard')}
                        onOpenModal={openModal}
                    />
                )
            case 'entry':
            default:
                return <EntryView onAnalyze={handleAnalyze} error={error} />;
        }
    };

    return (
        <>
            <ThemeToggle />
            <div id="app" className="container mx-auto p-4 md:p-8">
                {view !== 'entry' && view !== 'loading' && (
                     <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                        <button onClick={view === 'dashboard' ? handleNewSearch : () => setView('dashboard')} className="btn-secondary px-4 py-2 flex items-center gap-2">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                           {view === 'dashboard' ? 'New Search' : 'Back to Dashboard'}
                       </button>
                       <h2 className="text-2xl font-bold text-center order-first w-full sm:w-auto sm:order-none">{repoData?.repoData.full_name}</h2>
                   </div>
                )}
                {renderContent()}
            </div>
            {modalData && <Modal item={modalData} onClose={closeModal} />} 
        </>
    );
}

export default App;