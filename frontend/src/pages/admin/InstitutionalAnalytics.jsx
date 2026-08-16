import React from 'react';
import { TrendingUp, BarChart3, PieChart, Users, Award, CalendarCheck, Sparkles } from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { ResponsiveContainer, BarChart, Bar, ComposedChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, PieChart as RechartsPie, Pie, Cell } from 'recharts';

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

  const correlationData = [
    { name: 'CS601 (Data Struct)', attendancePct: 94, internalMarks: 23.5 },
    { name: 'CS602 (Web Dev)', attendancePct: 89, internalMarks: 21.0 },
    { name: 'CS603 (AI Systems)', attendancePct: 96, internalMarks: 24.2 },
    { name: 'CS604 (DBMS)', attendancePct: 82, internalMarks: 18.5 },
    { name: 'CS605 (Networks)', attendancePct: 76, internalMarks: 16.8 },
  ];

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Institutional Analytics & AI Benchmarks</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
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
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Semester Pass Rate Trends
          </h2>

          <div className="space-y-3 font-mono text-xs">
            {semesterComparison.map((s, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-sans font-bold text-slate-800 dark:text-white text-xs">{s.semester}</span>
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 dark:text-slate-400">Att: <strong className="text-slate-800 dark:text-slate-200">{s.avgAttendance}%</strong></span>
                  <span className="font-bold text-emerald-500">Pass: {s.passRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Attendance vs Marks Correlation Chart across Subjects */}
      <div className="glass-panel p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-emerald-500" />
            Subject-wise Attendance vs Internal Marks Correlation Telemetry
          </h2>
          <span className="text-xs text-slate-400 font-mono">Multi-Axis Dual Metric</span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={correlationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis yAxisId="left" domain={[0, 100]} stroke="#6366f1" fontSize={11} unit="%" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 25]} stroke="#10b981" fontSize={11} unit="/25" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar yAxisId="left" dataKey="attendancePct" name="Attendance %" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={28} />
              <Line yAxisId="right" type="monotone" dataKey="internalMarks" name="Avg Internal /25" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
