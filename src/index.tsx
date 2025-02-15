import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { ContentBuilderPage } from './pages/ContentBuilder';
import { BatchContentPage } from './pages/BatchContent';
import { SettingsPage } from './pages/Settings';

const App = () => {
    const container = document.getElementById('wp-postai-app');
    const page = container?.getAttribute('data-page');

    return (
        <ChakraProvider>
            {page === 'content-builder' && <ContentBuilderPage />}
            {page === 'batch-content' && <BatchContentPage />}
            {page === 'settings' && <SettingsPage />}
        </ChakraProvider>
    );
};

const container = document.getElementById('wp-postai-app');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}