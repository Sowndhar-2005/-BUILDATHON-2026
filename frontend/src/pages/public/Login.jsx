import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, LogIn, Sparkles, ShieldCheck, AlertCircle, 
  ArrowRight, UserCheck, Award, BookOpen, Crown, Zap
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const demoAccounts = [
    {
      role: 'Student (At-Risk)',
      name: 'Rahul Verma',
      email: 'student.rahul@portal.edu',
      password: 'Student@123',
      badge: 'At-Risk Diagnostic',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      desc: '68% DBMS attendance deficit, low internal score, active AI intervention plan',
      icon: GraduationCap,
      iconColor: 'text-rose-400 bg-rose-500/10'
    },
    {
      role: 'Student (Topper)',
      name: 'Priya Sundaram',
      email: 'student.priya@portal.edu',
      password: 'Student@123',
      badge: 'Distinction / O Grade',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      desc: '95% overall average, 96% attendance, exemplary AI academic trajectory',
      icon: Award,
      iconColor: 'text-emerald-400 bg-emerald-500/10'
    },
    {
      role: 'Subject Faculty',
      name: 'Prof. Vikram Sharma',
      email: 'teacher.sharma@portal.edu',
      password: 'Teacher@123',
      badge: 'DBMS Professor',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      desc: 'Configures /25 assessment weights, enters grades, publishes lecture notes',
      icon: BookOpen,
      iconColor: 'text-indigo-400 bg-indigo-500/10'
    },
    {
      role: 'Class Mentor',
      name: 'Dr. Ananya Kumar',
      email: 'mentor.kumar@portal.edu',
      password: 'Teacher@123',
      badge: 'CSE Class Mentor',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      desc: 'Conducts daily roll call, monitors cohort risk radar, audits report cards',
      icon: UserCheck,
      iconColor: 'text-cyan-400 bg-cyan-500/10'
    },
    {
      role: 'Institutional Admin',
      name: 'Dr. Rajeshwari Swaminathan',
      email: 'admin@portal.edu',
      password: 'Admin@123',
      badge: 'Dean of Academics',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      desc: 'Campus-wide risk analytics, user provisioning, curriculum structure setup',
      icon: Crown,
      iconColor: 'text-amber-400 bg-amber-500/10'
    }
  ];

  const handleLogin = async (e, customEmail = null, customPassword = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const loginEmail = customEmail || email;
    const loginPass = customPassword || password;
    
    setError('');
    setLoading(true);
    try {
      const user = await login(loginEmail, loginPass);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
    handleLogin(null, demo.email, demo.password);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      
      {/* 1. Header Banner */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-brand-500/25">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Portal Authentication</h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Sign in with your institutional credentials or use the 1-click Demo Accounts below for evaluation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive 1-Click Demo Accounts */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                1-Click Evaluation Accounts
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">Click to instantly log in</span>
          </div>

          <div className="space-y-2.5">
            {demoAccounts.map((acc, idx) => {
              const Icon = acc.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={loading}
                  onClick={() => handleDemoClick(acc)}
                  className="w-full text-left p-3.5 rounded-2xl glass-panel border border-slate-800 hover:border-brand-500/50 hover:bg-slate-900/80 transition-all duration-200 group flex items-start justify-between gap-3 shadow-lg hover:shadow-brand-500/10"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl ${acc.iconColor} border border-slate-800 shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-white group-hover:text-brand-300 transition-colors">
                          {acc.name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${acc.badgeColor}`}>
                          {acc.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-snug">
                        {acc.desc}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                        <span className="font-mono text-slate-400">{acc.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-850 text-slate-400 group-hover:bg-brand-500 group-hover:text-white transition shrink-0 self-center">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Standard Login Form */}
        <div className="lg:col-span-5">
          <div className="glass-panel p-6 sm:p-8 border border-slate-800 space-y-6 shadow-2xl rounded-3xl">
            
            <div>
              <h2 className="text-lg font-bold text-white">Manual Sign In</h2>
              <p className="text-xs text-slate-400">Enter institutional email and password</p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Institutional Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field text-xs"
                  placeholder="name@portal.edu"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-slate-300 font-medium">Password</label>
                  <span className="text-[11px] text-brand-400">Default: Role@123</span>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full !py-3 text-xs flex items-center justify-center gap-2 shadow-glow-brand"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" /> Sign In to Portal
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
              Need a new account?{' '}
              <Link to="/register" className="text-brand-400 hover:text-brand-300 font-semibold">
                Register Here
              </Link>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

