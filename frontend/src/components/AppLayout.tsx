import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UsageMeter from './UsageMeter';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/app" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white">
                <path d="M8 12h16M8 16h12M8 20h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="24" cy="24" r="6" fill="#60a5fa" stroke="white" strokeWidth="1.5"/>
                <path d="M22.5 24h3M24 22.5v3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold text-lg text-gray-900">CloseMate AI</span>
          </Link>

          <div className="flex items-center gap-3">
            <UsageMeter />

            <Link
              to="/pricing"
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                location.pathname === '/pricing'
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Plans
            </Link>

            <div className="flex items-center gap-2 ml-2">
              <span className="text-sm text-gray-500 hidden sm:block">{user?.email}</span>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}