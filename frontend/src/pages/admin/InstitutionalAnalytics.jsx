import React from 'react';
import { TrendingUp, BarChart3, PieChart, Users, Award, CalendarCheck, Sparkles } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart as RechartsPie, Pie, Cell } from 'recharts';

export default function InstitutionalAnalytics() {
  const gradeDistribution = [
    { grade: 'O (90-100)', count: 8, color: '#10b981' },
    { grade: 'A+ (80-89)', count: 12, color: '#0e8ce9' },
    { grade: 'A (70-79)', count: 15, color: '#6366f1' },
    { grade: 'B+ (60-69)', count: 9, color: '#f59e0b' },
    { grade: 'B (50-59)', count: 4, color: '#f97316' },
    { grade: 'C (40-49)', count: 2, color: '#ef4444' },
  ];

  const semesterComparison = [
    { semester: 'Sem 3', passRate: 91, avgAttendance: 86 },
    { semester: 'Sem 4', passRate: 88, avgAttendance: 84 },
    { semester: 'Sem 5', passRate: 94, avgAttendance: 89 },
    { semester: 'Sem 6', passRate: 92, avgAttendance: 87 },
  ];

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">Institutional Analytics & AI Benchmarks</h1>
        <p className="text-xs text-slate-400 mt-1">
          Campus-wide academic metrics, grade distributions, pass percentages, and longitudinal performance trends.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Campus Pass Rate"
          value="92.4%"
          subtitle="+2.1% from previous semester"
          icon={Award}
          color="emerald"
        />

        <StatCard
          title="Average Attendance"
          value="87.6%"
          subtitle="Above 75% Regulatory Mandate"
          icon={CalendarCheck}
          color="brand"
        />

        <StatCard
          title="Dean's Honor Roll"
          value="20 Students"
          subtitle="GPA &ge; 9.0 (O/A+ Grades)"
          icon={Award}
          color="purple"
        />

        <StatCard
          title="AI Intervention Efficacy"
          value="84%"
          subtitle="Resolved Weak Area Deficits"
          icon={Sparkles}
          color="amber"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Grade Distribution */}
        <div className="lg:col-span-7 glass-panel p-6 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-400" />
            Institutional Grade Distribution
          </h2>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="grade" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Bar dataKey="count" name="Students" fill="#0e8ce9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 5 Cols: Longitudinal Semester Trends */}
        <div className="lg:col-span-5 glass-panel p-6 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Semester Pass Rate Trends
          </h2>

          <div className="space-y-3 font-mono text-xs">
            {semesterComparison.map((s, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="font-sans font-bold text-white text-xs">{s.semester}</span>
                <div className="flex items-center gap-4">
                  <span className="text-slate-400">Att: <strong className="text-slate-200">{s.avgAttendance}%</strong></span>
                  <span className="font-bold text-emerald-400">Pass: {s.passRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
