import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, TrendingUp, BookOpen, CheckCircle2, ArrowRight, Brain } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner, RiskBadge } from '../../components/common/StatCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function Progress() {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgress() {
      if (!user) return;
      try {
        const data = await api.getStudentAIAnalysis(user.id);
        setAnalysis(data);
      } catch (err) {
        console.error("AI Progress error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, [user]);

  if (loading) return <LoadingSpinner text="Synthesizing AI Academic Insights & Diagnostics..." />;

  const weakSubjects = analysis?.weak_subjects_json || [];

  const comparisonData = [
    { subject: 'DBMS', student: 53, classAvg: 72 },
    { subject: 'Algorithms', student: 49, classAvg: 68 },
    { subject: 'Cloud DevOps', student: 73, classAvg: 75 },
    { subject: 'AI & Neural Nets', student: 51, classAvg: 70 },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Brain className="w-7 h-7 text-brand-400" />
            AI Academic Intelligence & Diagnostics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Predictive learning diagnostics, weak area clustering, and evidence-based personalized study interventions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <RiskBadge level={analysis?.risk_level} score={analysis?.risk_score} />
        </div>
      </div>

      {/* AI Performance Narrative Summary */}
      <div className="glass-panel p-6 border border-slate-800 bg-gradient-to-br from-slate-900 via-brand-950/20 to-slate-900 space-y-3">
        <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-400" />
          AI Performance Summary & Trend Diagnosis
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">
          {analysis?.summary_report_text || "Academic metrics compiled successfully."}
        </p>
        <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Trajectory Momentum: </span>
          <span className="capitalize font-bold text-indigo-400">{analysis?.trend_status}</span> •
          <span>{analysis?.trend_analysis_text}</span>
        </div>
      </div>

      {/* Weak Subjects Diagnostic Cluster */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Identified Weak Subjects & Topic Deficits
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {weakSubjects.length} Subject(s) Need Intervention
          </span>
        </div>

        {weakSubjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weakSubjects.map((item, idx) => (
              <div key={idx} className="glass-card p-6 border border-amber-500/30 space-y-4 bg-amber-950/10">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold font-mono">
                      {item.subject_code}
                    </span>
                    <h3 className="font-bold text-base text-white mt-1">{item.subject_name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-amber-400">{item.final_score}/100</div>
                    <span className="text-[10px] text-slate-400">Final Mark</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                  <span className="text-slate-400 block font-semibold">Diagnostic Root Causes:</span>
                  <ul className="text-slate-300 space-y-1 list-disc list-inside text-[11px]">
                    {item.reasons.map((r, rIdx) => (
                      <li key={rIdx}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-200 block">Recommended Focus Topics:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.focus_topics.map((top, topIdx) => (
                      <span key={topIdx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-brand-500/30 text-brand-300 text-xs font-medium">
                        {top}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl glass-panel text-center text-emerald-400 flex items-center justify-center gap-3">
            <CheckCircle2 className="w-6 h-6" />
            <span className="text-sm font-semibold">No critical weak subjects detected. Excellent academic performance across all courses!</span>
          </div>
        )}
      </div>

      {/* Comparative Performance Chart */}
      <div className="glass-panel p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-400" />
            Student vs Class Average Benchmark
          </h2>
          <span className="text-xs text-slate-400 font-mono">Comparative Analytics</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis dataKey="subject" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="student" name="Your Final Mark" fill="#0e8ce9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="classAvg" name="Class Average" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Personalized AI Action Plan */}
      <div className="glass-panel p-6 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Customized Study Interventions & Action Items
        </h2>

        <div className="space-y-3">
          {(analysis?.recommendations_json || []).map((rec, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3.5">
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase shrink-0 mt-0.5 ${
                rec.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                rec.priority === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-brand-500/20 text-brand-400 border border-brand-500/30'
              }`}>
                {rec.priority} Priority
              </span>
              <div>
                <h3 className="text-xs font-bold text-white">{rec.category}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{rec.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
