import React from 'react';
import { Database, Shield, Zap, Lock, Users, BarChart3, Code, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
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

      {/* Powered by AI Badge */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="backdrop-blur-xl bg-gradient-to-r from-blue-500/20 to-violet-500/20 border border-white/30 rounded-full px-4 py-2 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-300 animate-pulse" />
            <span className="text-white font-medium text-sm">Powered by AI</span>
          </div>
        </div>
      </div>

      {/* Content - Add top padding for fixed navbar */}
      <div className="relative z-10 pt-24">
        {/* Hero Section */}
        <section className="px-4 py-20 md:py-32">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-2xl">
              Chat with your SQL database.
              <br />
              <span className="bg-gradient-to-r from-blue-300 via-violet-200 to-indigo-300 bg-clip-text text-transparent">
                No SQL required.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200/90 mb-10 max-w-3xl mx-auto drop-shadow-lg">
              Ask questions in plain English and get structured results instantly — safely and read-only.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="group px-8 py-4 backdrop-blur-2xl bg-white/20 border border-white/30 text-white rounded-xl text-lg font-semibold hover:bg-white/30 hover:shadow-lg hover:shadow-white/20 transition-all flex items-center space-x-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <button className="group px-8 py-4 backdrop-blur-2xl bg-white/20 border border-white/30 text-white rounded-xl text-lg font-semibold hover:bg-white/30 hover:shadow-lg hover:shadow-white/20 transition-all flex items-center space-x-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                onClick={() => navigate('/dashboard')}
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignedIn>
              {/* <button className="px-8 py-4 backdrop-blur-2xl bg-white/10 border border-white/20 text-white rounded-xl text-lg font-semibold hover:bg-white/20 transition-all shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                Live Demo
              </button> */}
            </div>
          </div>
        </section>

        {/* What DB-Buddy Does */}
        <section className="px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-8 md:p-12 shadow-2xl shadow-white/10">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">What DB-Buddy Does</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: Database, text: 'Connect your MySQL or PostgreSQL database' },
                  { icon: Code, text: 'Ask questions in natural language' },
                  { icon: BarChart3, text: 'Get SQL + results + explanation' },
                  { icon: Shield, text: 'Read-only by design — no data modification' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm">
                    <item.icon className="w-6 h-6 text-blue-300 flex-shrink-0 mt-1" />
                    <p className="text-slate-100/90">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why DB-Buddy */}
        <section id="features" className="px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Why DB-Buddy?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: 'No SQL knowledge needed', desc: 'Query databases using plain English' },
                { icon: Lock, title: 'Secure, encrypted DB connections', desc: 'Your data stays protected' },
                { icon: Shield, title: 'Auto-blocks unsafe queries', desc: 'Built-in security measures' },
                { icon: BarChart3, title: 'Usage limits & query history', desc: 'Track all your queries' },
                { icon: Database, title: 'Works with your existing database', desc: 'No migration needed' },
                { icon: CheckCircle, title: 'Read-only enforcement', desc: 'Never worry about data loss' }
              ].map((item, idx) => (
                <div key={idx} className="backdrop-blur-2xl bg-white/10 rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all hover:border-white/30 hover:shadow-lg hover:shadow-white/10 group">
                  <item.icon className="w-10 h-10 text-blue-300 mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                  <p className="text-slate-200/80">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">How It Works</h2>
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-8 md:p-12 shadow-2xl shadow-white/10">
              <div className="space-y-8">
                {[
                  { num: '01', text: 'Connect your database', color: 'from-blue-400/80 to-cyan-400/80' },
                  { num: '02', text: 'We extract schema metadata', color: 'from-violet-400/80 to-purple-400/80' },
                  { num: '03', text: 'Ask questions in English', color: 'from-indigo-400/80 to-blue-400/80' },
                  { num: '04', text: 'Get instant answers', color: 'from-emerald-400/80 to-teal-400/80' }
                ].map((step, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-center sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 group">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl font-bold flex-shrink-0 text-white shadow-lg shadow-white/20 group-hover:scale-110 transition-transform backdrop-blur-sm border border-white/30`}>
                      {step.num}
                    </div>
                    <div className="hidden sm:block flex-1 h-1 bg-gradient-to-r from-white/30 to-transparent rounded"></div>
                    <p className="text-lg md:text-xl font-medium text-white text-center sm:text-left">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Who Is It For */}
        <section className="px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Who Is It For?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Code, title: 'Developers', gradient: 'from-blue-400/80 to-cyan-400/80' },
                { icon: BarChart3, title: 'Analysts', gradient: 'from-violet-400/80 to-purple-400/80' },
                { icon: Users, title: 'Product Teams', gradient: 'from-indigo-400/80 to-blue-400/80' },
                { icon: Database, title: 'Students', gradient: 'from-emerald-400/80 to-teal-400/80' }
              ].map((item, idx) => (
                <div key={idx} className="backdrop-blur-2xl bg-white/10 rounded-2xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all hover:scale-105 group">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center group-hover:rotate-6 transition-transform shadow-lg shadow-white/20 backdrop-blur-sm border border-white/30`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security First */}
        <section id="security" className="px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Security First</h2>
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-8 md:p-12 shadow-2xl shadow-white/10">
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  { icon: Lock, title: 'Encrypted credentials', desc: 'All database credentials are encrypted at rest' },
                  { icon: Users, title: 'Per-user database isolation', desc: 'Each user has isolated database access' },
                  { icon: Shield, title: 'Read-only query enforcement', desc: 'No write operations allowed' },
                  { icon: Database, title: 'No data stored from your DB', desc: 'We only store metadata, not your data' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400/80 to-teal-400/80 flex items-center justify-center flex-shrink-0 shadow-md shadow-white/20 backdrop-blur-sm border border-white/30">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1 text-white">{item.title}</h3>
                      <p className="text-slate-200/80 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-12 md:p-16 shadow-2xl shadow-white/10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                Turn questions into SQL.
                <br />
                <span className="bg-gradient-to-r from-blue-300 to-violet-300 bg-clip-text text-transparent">
                  Instantly.
                </span>
              </h2>
              <p className="text-lg md:text-xl text-slate-200/90 mb-10">
                Start querying your database the smart way.
              </p>
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="group px-10 py-5 backdrop-blur-2xl bg-white/20 border border-white/30 text-white rounded-xl text-xl font-semibold hover:bg-white/30 hover:shadow-xl hover:shadow-white/20 transition-all flex items-center space-x-3 mx-auto shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                    <span>Start Free</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <button className="group px-10 py-5 backdrop-blur-2xl bg-white/20 border border-white/30 text-white rounded-xl text-xl font-semibold hover:bg-white/30 hover:shadow-xl hover:shadow-white/20 transition-all flex items-center space-x-3 mx-auto shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </button>
              </SignedIn>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 py-8 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center text-slate-300/80">
            <p>&copy; 2024 DB-Buddy. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}