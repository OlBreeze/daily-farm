import { Suspense } from 'react';

function NotFoundPage() {
    return (
        <html>
        <body>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
        </div>
        </body>
        </html>
    );
}

export default function NotFound() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NotFoundPage />
        </Suspense>
    );
}