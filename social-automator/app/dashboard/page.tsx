import { Suspense } from 'react';
import DashboardClient from './DashboardClient';

function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <p className="mt-4 text-gray-600">Loading your dashboard...</p>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<Loading />}>
            <DashboardClient />
        </Suspense>
    );
}