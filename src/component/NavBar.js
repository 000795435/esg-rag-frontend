import React from 'react';

export default function NavBar() {
    return (
        <div>
            <nav className="sidebar">
                <div className="sidebar-header">
                    <h3>ESG RAG</h3>
                </div>

                <ul className="list-unstyled components">
                    <li className={window.location.pathname === '/' ? 'activate' : ''}>
                        <a href="/">PDF Reader</a>
                    </li>
                </ul>
            </nav>
        </div>)
}


/**

                    <li className={window.location.pathname === '/' ? 'activate' : ''}>
                        <a href="/">Chatbot</a>
                    </li>

 */