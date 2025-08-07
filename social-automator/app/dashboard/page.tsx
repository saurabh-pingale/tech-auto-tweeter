'use client';

export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Calendar, Zap } from 'lucide-react';
import { api } from '@/lib/api';

interface UserProfile {
    id: string;
    screenName: string;
    name: string;
    profileImageUrl: string;
}

export default function DashboardPage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const userId = searchParams.get('userId');

        if (!userId) {
            setError('No user session found. Please log in again.');
            setLoading(false);
            setTimeout(() => router.push('/login'), 3000);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await api.get(`/api/me?userId=${userId}`);
                setUser(response.data);
                localStorage.setItem('twitterUserId', userId);
            } catch (err) {
                console.error("Failed to fetch user data", err);
                setError("Could not retrieve your profile. Please try logging in again.");
                localStorage.removeItem('twitterUserId');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [searchParams, router]);

    const handleLogout = () => {
        localStorage.removeItem('twitterUserId');
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <svg className="w-12 h-12 mx-auto text-blue-500 loader" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md p-6 bg-white rounded-xl shadow-md text-center"
                >
                    <div className="text-red-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Session Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Return to Login
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center space-x-2"
                        >
                            <Zap className="h-6 w-6 text-blue-500" />
                            <h1 className="text-xl font-bold text-gray-800">Social Automator</h1>
                        </motion.div>
                        
                        {user && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center space-x-3"
                            >
                                <div className="hidden sm:flex items-center space-x-2">
                                    <img 
                                        src={user.profileImageUrl} 
                                        alt="profile" 
                                        className="w-8 h-8 rounded-full border-2 border-blue-200" 
                                    />
                                    <span className="font-medium text-gray-700">{user.name}</span>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {user && (
                    <div className="flex justify-center">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center space-x-4 mb-6">
                                    <img 
                                        src={user.profileImageUrl} 
                                        alt="profile" 
                                        className="w-14 h-14 rounded-full border-2 border-blue-200" 
                                    />
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">Welcome, {user.name}!</h2>
                                        <p className="text-gray-600">@{user.screenName}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <h3 className="font-semibold text-blue-800 mb-2">Automation Status</h3>
                                        <div className="flex items-center">
                                            <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                                            <span className="text-sm text-gray-700">Active and running</span>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-indigo-100 rounded-lg">
                                                    <Calendar className="h-5 w-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">Next Post</h3>
                                                    <p className="text-sm text-gray-500">Today, 3:00 PM</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">Last Post</h3>
                                                    <p className="text-sm text-gray-500">2 hours ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </main>
        </div>
    );
}