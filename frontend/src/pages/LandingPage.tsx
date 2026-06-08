import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  {
    icon: '🛡️',
    title: 'Objection Handler',
    desc: 'Paste any objection your prospect gives you and get a persuasive, proven rebuttal script in seconds.',
  },
  {
    icon: '📝',
    title: 'Script Generator',
    desc: 'Describe your product and who you\'re selling to — get a tailored sales script ready to use.',
  },
  {
    icon: '💬',
    title: 'Lead Responder',
    desc: 'Paste a lead\'s message and get the perfect response suggestion to keep the conversation moving.',
  },
  {
    icon: '⚡',
    title: 'Works in Seconds',
    desc: 'No dashboards, no complexity. Just a simple chat interface that gives you what you need, fast.',
  },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white">
                <path d="M8 12h16M8 16h12M8 20h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="24" cy="24" r="6" fill="#60a5fa" stroke="white" strokeWidth="1.5"/>
                <path d="M22.5 24h3M24 22.5v3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900">CloseMate AI</span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/app"
                className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
              >
                Go to App
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
          Close more deals with AI-powered scripts
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
          Your AI sales assistant. Handle objections, generate scripts, and respond to leads — all through a simple chat interface. No dashboards. No complexity.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/app"
              className="px-6 py-3 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm"
            >
              Open CloseMate
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="px-6 py-3 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition-colors shadow-sm"
              >
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 text-gray-600 font-medium rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
        <p className="mt-3 text-sm text-gray-400">Free tier: 5 requests/day. No credit card required.</p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
          Everything you need to close
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Simple pricing</h2>
          <p className="text-gray-500 mb-8">Start free, upgrade when you need more.</p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-xl mx-auto">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900">Free</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">$0</p>
              <p className="text-sm text-gray-400">5 requests per day</p>
              <ul className="mt-4 text-sm text-gray-600 space-y-2">
                <li>✓ Objection handling</li>
                <li>✓ Script generation</li>
                <li>✓ Lead response suggestions</li>
              </ul>
            </div>
            <div className="bg-brand-600 rounded-2xl p-6 text-white">
              <h3 className="font-semibold">Pro</h3>
              <p className="text-3xl font-bold mt-2">$29</p>
              <p className="text-sm text-brand-200">per month, unlimited</p>
              <ul className="mt-4 text-sm text-brand-100 space-y-2">
                <li>✓ Unlimited requests</li>
                <li>✓ Priority AI models</li>
                <li>✓ All features unlocked</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        CloseMate AI &mdash; Close more deals.
      </footer>
    </div>
  );
}