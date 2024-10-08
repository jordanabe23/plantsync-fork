'use client';

import localFont from "next/font/local";
import "./globals.css";
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthorized(!!token); // Set isAuthorized based on token presence

      // Redirect if not authorized and trying to access restricted routes
      if (!token && pathname !== '/login' && pathname !== '/register') {
        router.push('/register');
      }
    };

    // Check auth status on initial load
    checkAuth();

    // Listen for storage changes (e.g., when the token is updated during login)
    const storageListener = () => checkAuth();
    window.addEventListener('storage', storageListener);

    // Clean up the event listener on unmount
    return () => window.removeEventListener('storage', storageListener);
  }, [router, pathname]);

  // Custom event listener for login
  useEffect(() => {
    const handleLogin = () => {
      setIsAuthorized(true);
    };

    window.addEventListener('login', handleLogin);

    // Clean up event listener
    return () => window.removeEventListener('login', handleLogin);
  }, []);

  // Determine the background class based on the current path
  const backgroundClass = pathname === '/register' || pathname === '/login'
    ? 'bg-gradient-to-br from-green-100 to-green-300'
    : 'bg-slate-50';

  return (
    <html lang="en">
      <head>
        <title> PlantSync</title>
      </head>
      <body className={`flex ${backgroundClass}`}>
        {isAuthorized && <Sidebar />}
        <main className="flex-1 min-h-screen p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
