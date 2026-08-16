import React from 'react';
import { GraduationCap, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 text-slate-400 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-base text-white tracking-tight">EduVision AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              BUILDATHON 2026 flagship Education Management Portal integrating real-time academic workflows with predictive AI intelligence.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Academic Areas</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/courses" className="hover:text-brand-400 transition">Course Catalog</Link></li>
              <li><Link to="/student/dashboard" className="hover:text-brand-400 transition">Student Learning Area</Link></li>
              <li><Link to="/teacher/dashboard" className="hover:text-brand-400 transition">Faculty Assessment Console</Link></li>
              <li><Link to="/admin/dashboard" className="hover:text-brand-400 transition">Institutional Governance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">AI Intelligence</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-amber-400" /> Multi-Factor Risk Model</li>
              <li>Weak Area Topic Clustering</li>
              <li>Continuous Trend Trajectory</li>
              <li>Personalized Action Plans</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Compliance & Specs</h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] space-y-1">
              <p className="font-semibold text-slate-300">Marks Calculation Formula:</p>
              <p className="font-mono text-brand-400">Internal (/25) + External (/75) = Final (/100)</p>
              <p className="text-slate-500 pt-1">Subject-specific dynamic weighting enabled.</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 EduVision AI. Designed & Engineered for BUILDATHON 2026.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Powered by FastAPI + React + SQLAlchemy 2.0 Async
          </p>
        </div>
      </div>
    </footer>
  );
}
