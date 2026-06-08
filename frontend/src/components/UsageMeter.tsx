import { useState, useEffect } from 'react';
import { api, UsageResponse } from '../services/api';

export default function UsageMeter() {
  const [usage, setUsage] = useState<UsageResponse | null>(null);

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
    const interval = setInterval(fetchUsage, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!usage) return null;

  const { subscriptionStatus, daysRemaining, dailyUsage, dailyLimit } = usage;

  // Paid user — show Pro badge
  if (subscriptionStatus === 'paid') {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-xs">
        <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-green-700 font-medium">Pro</span>
      </div>
    );
  }

  // Trial user — show countdown badge
  if (subscriptionStatus === 'trialing') {
    const isUrgent = daysRemaining <= 3;
    return (
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${
        isUrgent
          ? 'bg-orange-50 border-orange-200 text-orange-700'
          : 'bg-green-50 border-green-200 text-green-700'
      }`}>
        <svg className={`w-3.5 h-3.5 ${isUrgent ? 'text-orange-500' : 'text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {daysRemaining === 0
          ? 'Trial ends today'
          : `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} trial remaining`
        }
      </div>
    );
  }

  // Free user — show usage bar
  const limit = dailyLimit as number;
  const usagePercent = Math.min(100, (dailyUsage / limit) * 100);
  const isNearLimit = dailyUsage >= limit - 1;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs">
      <div className="w-14 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isNearLimit ? 'bg-red-500' : 'bg-brand-500'
          }`}
          style={{ width: `${usagePercent}%` }}
        />
      </div>
      <span className={`font-medium ${isNearLimit ? 'text-red-600' : 'text-gray-500'}`}>
        {dailyUsage}/{limit}
      </span>
    </div>
  );
}