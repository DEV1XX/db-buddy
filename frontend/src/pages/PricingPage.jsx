import React, { useState, useEffect } from 'react';
import { Check, Zap, Crown, Rocket, ArrowRight, CheckCircle } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';
import api from '../api/axios';
import API_ENDPOINTS from '../api/apiEndpoints';

/* =========================
   LOAD RAZORPAY SCRIPT
   ========================= */
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PricingPage() {
  const { user } = useUser();
  const [plans, setPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Get current plan from Clerk metadata
  const currentPlanKey = user?.publicMetadata?.planKey || 'FREE';

  /* =========================
     FETCH PRICING PLANS
     ========================= */
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get(API_ENDPOINTS.PAYMENT.PRICING_PLANS);
      setPlans(res.plans || {});
    } catch (err) {
      console.error("Failed to fetch plans", err);
      toast.error("Failed to load pricing plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  /* =========================
     HANDLE UPGRADE
     ========================= */
  const handleUpgrade = async (planKey, planName) => {
    try {
      setPaymentLoading(true);

      // Check if it's a free plan
      const plan = plans[planKey];
      if (plan && plan.price === 0) {
        toast.info("This is a free plan!");
        setPaymentLoading(false);
        return;
      }

      // Check if already on this plan
      if (planKey === currentPlanKey) {
        toast.info("You're already on this plan!");
        setPaymentLoading(false);
        return;
      }

      // 1️⃣ Load Razorpay SDK
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Razorpay SDK failed to load");
        setPaymentLoading(false);
        return;
      }

      // 2️⃣ Create order from backend
      const orderRes = await api.post(
        API_ENDPOINTS.PAYMENT.CREATE_ORDER,
        { planKey }
      );

      const { orderId, amount, currency } = orderRes;

      // 3️⃣ Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        order_id: orderId,
        name: "DB-Buddy",
        description: `${planName} Plan Subscription`,

        handler: async (response) => {
          try {
            // 4️⃣ Verify payment
            await api.post(API_ENDPOINTS.PAYMENT.VERIFY, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planKey,
            });

            toast.success("Payment successful! Plan upgraded!");
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 1500);
          } catch (err) {
            console.error("Verification failed", err);
            toast.error("Payment verification failed");
          }
        },

        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error", err);
      
      if (err.response) {
        const errorMsg = err.response.data?.error || err.response.data?.message || "Payment failed";
        toast.error(errorMsg);
      } else {
        toast.error("Payment failed");
      }
      
      setPaymentLoading(false);
    }
  };

  const getPlanIcon = (planName) => {
    const plan = planName.toLowerCase();
    if (plan.includes('free')) return Zap;
    if (plan.includes('pro')) return Crown;
    if (plan.includes('enterprise')) return Rocket;
    return Zap;
  };

  const getPlanColor = (planName) => {
    const plan = planName.toLowerCase();
    if (plan.includes('free')) return {
      gradient: 'from-blue-400/80 to-cyan-400/80',
      border: 'border-blue-400/30',
      text: 'text-blue-300',
      glow: 'shadow-blue-400/20'
    };
    if (plan.includes('pro')) return {
      gradient: 'from-violet-400/80 to-purple-400/80',
      border: 'border-violet-400/30',
      text: 'text-violet-300',
      glow: 'shadow-violet-400/20'
    };
    if (plan.includes('enterprise')) return {
      gradient: 'from-emerald-400/80 to-teal-400/80',
      border: 'border-emerald-400/30',
      text: 'text-emerald-300',
      glow: 'shadow-emerald-400/20'
    };
    return {
      gradient: 'from-indigo-400/80 to-blue-400/80',
      border: 'border-indigo-400/30',
      text: 'text-indigo-300',
      glow: 'shadow-indigo-400/20'
    };
  };

  const getPlanFeatures = (plan) => {
    if (plan.features && Array.isArray(plan.features)) {
      return plan.features;
    }
    return [`${plan.limit} queries per month`];
  };

  const pricingPlans = Object.entries(plans);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className="min-h-screen relative overflow-x-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/db-buddy-bg2.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-slate-950/85" />

          {/* Subtle Gradient Overlays */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full filter blur-3xl"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-400/8 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-400/8 rounded-full filter blur-3xl"></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 pt-24 px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 md:mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Choose Your
                <span className="bg-gradient-to-r from-blue-300 via-violet-300 to-indigo-300 bg-clip-text text-transparent">
                  {" "}Perfect Plan
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-200/80 max-w-2xl mx-auto">
                Scale your database queries with flexible pricing that grows with your needs
              </p>
              
              {/* Current Plan Badge */}
              {user && (
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-full">
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  <span className="text-slate-200/90 text-sm">
                    Current Plan: <span className="font-semibold text-white">{currentPlanKey}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-12 shadow-2xl shadow-white/10">
                <div className="flex flex-col items-center justify-center gap-4">
                  <ClipLoader color="#93c5fd" size={50} />
                  <p className="text-slate-200/90 text-lg">Loading pricing plans...</p>
                </div>
              </div>
            )}

            {/* Payment Processing Overlay */}
            {paymentLoading && (
              <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-slate-950/50">
                <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl shadow-white/10">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <ClipLoader color="#93c5fd" size={50} />
                    <p className="text-slate-200/90 text-lg">Processing payment...</p>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Cards */}
            {!loading && pricingPlans.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {pricingPlans.map(([planKey, plan]) => {
                  const Icon = getPlanIcon(plan.plan);
                  const colors = getPlanColor(plan.plan);
                  const features = getPlanFeatures(plan);
                  const isPopular = plan.plan.toLowerCase().includes('pro');
                  const isCurrentPlan = planKey === currentPlanKey;

                  return (
                    <div
                      key={planKey}
                      className={`relative backdrop-blur-2xl bg-white/10 rounded-3xl border ${colors.border} p-8 shadow-2xl ${colors.glow} hover:bg-white/15 transition-all group ${
                        isPopular ? 'lg:scale-105 lg:z-10' : ''
                      }`}
                    >
                      {/* Popular Badge */}
                      {isPopular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className={`backdrop-blur-xl bg-gradient-to-r ${colors.gradient} px-4 py-1 rounded-full text-white text-sm font-semibold border ${colors.border} shadow-lg`}>
                            Most Popular
                          </div>
                        </div>
                      )}

                      {/* Current Plan Badge */}
                      {isCurrentPlan && (
                        <div className="absolute -top-4 right-4">
                          <div className="backdrop-blur-xl bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full text-emerald-300 text-xs font-semibold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Current Plan
                          </div>
                        </div>
                      )}

                      {/* Plan Icon */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg backdrop-blur-sm border ${colors.border}`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Plan Name */}
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {plan.plan}
                      </h3>

                      {/* Pricing */}
                      <div className="mb-6">
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold text-white">
                            ₹{plan.price}
                          </span>
                          <span className="text-slate-300/70">/month</span>
                        </div>
                        <p className="text-slate-300/70 text-sm mt-1">
                          {plan.limit} queries per month
                        </p>
                      </div>

                      {/* Features List */}
                      <ul className="space-y-3 mb-8">
                        {features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Check className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                            <span className="text-slate-200/90 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Upgrade Button */}
                      <button
                        onClick={() => handleUpgrade(planKey, plan.plan)}
                        disabled={paymentLoading || plan.price === 0 || isCurrentPlan}
                        className={`w-full group/btn px-6 py-3 backdrop-blur-2xl bg-white/20 border ${colors.border} text-white rounded-xl font-semibold hover:bg-white/30 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <span>
                          {isCurrentPlan 
                            ? 'Current Plan' 
                            : plan.price === 0 
                            ? 'Free Plan' 
                            : 'Upgrade Now'}
                        </span>
                        {!isCurrentPlan && plan.price !== 0 && (
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {!loading && pricingPlans.length === 0 && (
              <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-12 shadow-2xl shadow-white/10 text-center">
                <p className="text-slate-200/90 text-xl">No pricing plans available at the moment.</p>
              </div>
            )}

            {/* FAQ Section */}
            <div className="mt-16 backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-8 md:p-12 shadow-2xl shadow-white/10">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Frequently Asked Questions
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Can I change plans later?
                  </h3>
                  <p className="text-slate-200/80 text-sm">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    What happens if I exceed my limit?
                  </h3>
                  <p className="text-slate-200/80 text-sm">
                    You'll be notified when approaching your limit. You can upgrade anytime to continue using the service.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Is there a free trial?
                  </h3>
                  <p className="text-slate-200/80 text-sm">
                    Our Free plan is always available with no credit card required. Test all features before upgrading.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    How secure is my data?
                  </h3>
                  <p className="text-slate-200/80 text-sm">
                    All data is encrypted, and we use read-only connections. We never store your actual database data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}