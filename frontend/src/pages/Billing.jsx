import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Zap, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import client from '../api/client';

export default function Billing() {
  const { user, updateUser } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await client.get('/billing/plans');
        setPlans(data.plans || {});
      } catch (err) {
        console.error('Failed to load plans:', err);
      }
    };
    
    fetchPlans();

    // Check for Stripe redirect messages
    if (searchParams.get('success')) {
      setMessage({ type: 'success', text: 'Subscription updated successfully! Your new generation limits are active.' });
      // Refresh user to get new plan
      client.get('/auth/me').then(res => {
        if (res.data?.user) updateUser(res.data.user);
      });
    }
    if (searchParams.get('cancelled')) {
      setMessage({ type: 'info', text: 'Checkout was cancelled.' });
    }
  }, [searchParams, updateUser]);

  const handleSubscribe = async (planId) => {
    if (planId === 'free' || planId === user?.plan) return;
    
    setIsLoading(planId);
    try {
      const { data } = await client.post('/billing/checkout', { plan: planId });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error?.message || 'Failed to start checkout' });
      setIsLoading(false);
    }
  };

  const planOptions = Object.entries(plans).filter(([id]) => id !== 'free').map(([id, p]) => ({ id, ...p }));
  // Add free plan manually for layout
  if (Object.keys(plans).length > 0) {
    planOptions.unshift({ id: 'free', ...plans.free });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Subscription & Billing</h1>
        <p className="text-gray-400">Manage your plan and video generation capacity.</p>
      </div>

      {message && (
        <div className={`mb-8 p-4 rounded-xl flex items-start border ${
          message.type === 'success' ? 'bg-green-500/10 border-green-500/20' : 
          message.type === 'error' ? 'bg-red-500/10 border-red-500/20' : 
          'bg-primary-500/10 border-primary-500/20'
        }`}>
          {message.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5" /> : <CheckCircle2 className={`w-5 h-5 mr-3 mt-0.5 ${message.type === 'success' ? 'text-green-400' : 'text-primary-400'}`} />}
          <p className={`${
            message.type === 'success' ? 'text-green-400' : 
            message.type === 'error' ? 'text-red-400' : 'text-primary-400'
          }`}>{message.text}</p>
        </div>
      )}

      {/* Current Plan Overview */}
      <div className="glass-panel p-8 rounded-2xl border border-white/10 mb-12 shadow-[0_0_30px_rgba(99,102,241,0.1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-gray-400 font-medium mb-1 uppercase tracking-wider text-sm">Current Plan</h2>
            <div className="flex items-end mb-4 md:mb-0">
              <span className="text-4xl font-extrabold text-white capitalize mr-4">
                {user?.plan || 'Free'}
              </span>
              {user?.plan === 'free' && (
                <span className="text-primary-400 bg-primary-500/10 border border-primary-500/20 px-3 py-1 rounded-full text-sm font-semibold mb-1">
                  Upgrade for more capacity
                </span>
              )}
            </div>
          </div>
          
          <div className="flex space-x-6">
             <div className="text-right">
              <div className="text-2xl font-bold text-white mb-1">
                {plans[user?.plan || 'free']?.videosPerMonth === -1 ? 'Unlimited' : plans[user?.plan || 'free']?.videosPerMonth || 3}
              </div>
              <div className="text-sm text-gray-500 font-medium">Videos / Month</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white mb-1 flex items-center justify-end">
                {plans[user?.plan || 'free']?.maxDuration || 30}
                <span className="text-base text-gray-400 ml-1">sec</span>
              </div>
              <div className="text-sm text-gray-500 font-medium">Max Duration</div>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Selection */}
      <h2 className="text-xl font-bold text-white mb-6">Upgrade Plan</h2>
      
      {!Object.keys(plans).length ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {planOptions.map((plan) => {
            const isCurrent = user?.plan === plan.id;
            const isHighlighted = plan.id === 'pro';
            
            return (
              <div 
                key={plan.id}
                className={`glass-card p-6 flex flex-col justify-between relative ${
                  isCurrent ? 'ring-2 ring-white/20 bg-dark-800' :
                  isHighlighted ? 'ring-2 ring-primary-500 border-primary-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : ''
                }`}
              >
                {isHighlighted && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full">POPULAR</div>}
                {isCurrent && <div className="absolute top-3 right-3"><CheckCircle2 className="w-5 h-5 text-gray-400" /></div>}
                
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-3xl font-extrabold text-white">${plan.price}</span>
                    <span className="text-gray-500 ml-1">/mo</span>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <Zap className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${isHighlighted ? 'text-accent-500' : 'text-primary-500/50'}`} />
                      <span className="text-gray-300 text-sm">
                        {plan.videosPerMonth === -1 ? 'Unlimited' : plan.videosPerMonth} videos/mo
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Zap className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${isHighlighted ? 'text-accent-500' : 'text-primary-500/50'}`} />
                      <span className="text-gray-300 text-sm">
                        Up to {plan.maxDuration >= 60 ? `${Math.floor(plan.maxDuration/60)}m` : `${plan.maxDuration}s`} per video
                      </span>
                    </li>
                  </ul>
                </div>
                
                <button
                  disabled={isCurrent || isLoading}
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all flex justify-center ${
                    isCurrent ? 'bg-dark-700 text-gray-400 cursor-default' :
                    isHighlighted ? 'btn-primary shadow-lg' :
                    'bg-white/5 text-white hover:bg-white/10 hover:border hover:border-white/20'
                  }`}
                >
                  {isLoading === plan.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isCurrent ? (
                    'Current Plan'
                  ) : (
                    `Subscribe to ${plan.name}`
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
