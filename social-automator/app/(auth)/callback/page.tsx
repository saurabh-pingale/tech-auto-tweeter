'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AuthCallbackHandler() {
    const router = useRouter();

    useEffect(() => {
       const timer = setTimeout(() => {
           router.push('/dashboard');
       }, 1500);

       return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-6 bg-white rounded-xl shadow-md max-w-md"
            >
                <div className="flex justify-center mb-4">
                    <svg className="w-12 h-12 text-blue-500 loader" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Authenticating</h2>
                <p className="text-gray-600">Finalizing your connection with Twitter...</p>
            </motion.div>
        </div>
    );
}