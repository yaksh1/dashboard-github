import React from 'react';

function Modal({ item, onClose }) {
    if (!item) return null;

    const bodyHtml = item.body ? item.body
        .replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/`([^`]+)`/g, '<code class="bg-[var(--muted)] text-sm px-1 rounded">$&</code>')
        .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-[var(--muted)] p-3 rounded my-2 text-sm overflow-x-auto"><code>$2</code></pre>')
        .replace(/^(#+)\s*(.*)/gm, (match, hashes, content) => `<h${hashes.length} class="font-bold mt-4 mb-2">${content}</h${hashes.length}>`)
        .replace(/\n/g, '<br>') : '<p class="muted-text">No description provided.</p>';

    return (
        <div id="modal" className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div id="modal-content" className="popover w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-[var(--border)] flex justify-between items-start">
                    <div>
                        <h4 id="modal-title" className="text-xl font-bold">{item.title}</h4>
                        <p id="modal-subtitle" className="text-sm muted-text">#{item.number} by {item.user.login}</p>
                    </div>
                    <button id="modal-close" className="p-1 -mt-1 -mr-1" onClick={onClose}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                </div>
                <div id="modal-body" className="p-6 overflow-y-auto flex-grow" dangerouslySetInnerHTML={{ __html: bodyHtml }}></div>
                <div className="p-4 border-t border-[var(--border)] text-right">
                    <a id="modal-github-link" href={item.html_url} target="_blank" rel="noopener noreferrer" className="btn-primary font-bold py-2 px-4 inline-block">View on GitHub</a>
                </div>
            </div>
        </div>
    );
}

export default Modal;
