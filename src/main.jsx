import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/* global Office */

Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    } else {
        // Para desarrollo en el navegador fuera de Word
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    }
});
