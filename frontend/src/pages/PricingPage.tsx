import { useState, useEffect } from 'react';
import { api, UsageResponse } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out CloseMate AI',
    features: [
      '5 requests per day',
      'Objection handling',
      'Script generation',
      'Lead response suggestions',
    ],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'Unlimited access for serious sales professionals',
    features: [
      'Unlimited requests',
      'Objection handling',
      'Script generation',
      'Lead response suggestions',
      'Priority support',
      'Advanced AI models',
    ],
    highlighted: true,
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UsageResponse | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const data = await api.getUsage();
        setUsage(data);
      } catch {
        // Silently fail
      }
    };
    fetchUsage();
  }, []);

  const handleUpgrade = async () => {
    setCheckoutLoading(true);
    setError(null);
    try {
      const { url } = await api.createCheckoutSession();
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Failed to initiate checkout');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const status = usage?.subscriptionStatus || 'free';
  const isPaid = status === 'paid';
  const isTrialing = status === 'trialing';
  const daysRemaining = usage?.daysRemaining ?? 0;

  const getFreePlanCta = () => {
    if (isPaid) return 'Current Plan';
    if (isTrialing) {
      return `Trial ends in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}`;
    }
    return 'Current Plan';
  };

  const getFreePlanCtaClass = () => {
    if (isTrialing) return 'bg-amber-50 text-amber-700 border border-amber-200';
    return 'bg-gray-100 text-gray-400 cursor-default';
  };

  return (
    <div className="flex-1 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Choose your plan</h1>
          <p className="text-gray-500 mt-2">Unlock unlimited sales scripts and objection handling</p>
        </div>

        {isTrialing && (
          <div className="max-w-lg mx-auto mb-6 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800 text-center">
            🎉 You're on a <strong>14-day free trial</strong> — upgrade anytime or downgrade to free when it ends.
            {daysRemaining <= 3 && (
              <span className="block mt-1 font-semibold">
                {daysRemaining === 0 ? 'Your trial ends today!' : `Only ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} left!`}
              </span>
            )}
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {PLANS.map((plan) => {
            const isFreePlan = plan.name === 'Free';
            return (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 ${
                  plan.highlighted
                    ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className={`text-sm ${plan.highlighted ? 'text-brand-200' : 'text-gray-400'}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`mt-2 text-sm ${plan.highlighted ? 'text-brand-100' : 'text-gray-500'}`}>
                  {plan.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <svg className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-brand-200' : 'text-brand-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {isFreePlan ? (
                  <div
                    className={`mt-6 w-full py-2.5 rounded-xl font-medium text-sm text-center transition-all ${getFreePlanCtaClass()}`}
                  >
                    {getFreePlanCta()}
                  </div>
                ) : (
                  <button
                    onClick={handleUpgrade}
                    disabled={isPaid || checkoutLoading}
                    className={`mt-6 w-full py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isPaid
                        ? 'bg-gray-100 text-gray-400 cursor-default'
                        : 'bg-white text-brand-700 hover:bg-brand-50'
                    }`}
                  >
                    {isPaid ? 'Current Plan' : checkoutLoading ? 'Redirecting...' : 'Upgrade to Pro'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}