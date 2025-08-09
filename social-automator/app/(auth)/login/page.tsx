'use client';

import { Twitter } from 'lucide-react';
import { api } from '@/lib/api';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.post('/api/auth/twitter/request-token');
            const { authUrl } = response.data;
            window.location.href = authUrl;
        } catch (err) {
            console.error(err);
            setError("Failed to connect with Twitter. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden"
            >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
                    <h1 className="text-2xl font-bold text-white">Social Automator</h1>
                </div>
                
                <div className="p-8 space-y-6">
                    <div className="space-y-2 text-center">
                        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
                        <p className="text-gray-600">Automate your social media presence effortlessly</p>
                    </div>
                    
                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-6 py-3 font-medium text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 disabled:opacity-70 transition-all duration-200"
                    >
                        {isLoading ? (
                            <>
                                <svg className="w-5 h-5 mr-2 loader" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Redirecting...
                            </>
                        ) : (
                            <>
                                <Twitter className="w-5 h-5 mr-2" />
                                Sign in with Twitter
                            </>
                        )}
                    </button>
                    
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-3 text-sm text-red-600 bg-red-50 rounded-lg"
                        >
                            {error}
                        </motion.div>
                    )}
                    
                    <div className="text-xs text-gray-500 text-center">
                        By signing in, you allow this app to post tweets on your behalf.
                    </div>
                </div>
            </motion.div>
        </div>
    );
}