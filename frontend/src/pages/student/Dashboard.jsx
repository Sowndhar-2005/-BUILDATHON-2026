import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { 
  GraduationCap, BookOpen, CalendarCheck, Award, 
  AlertTriangle, Sparkles, TrendingUp, ChevronRight, 
  Clock, FileCheck, ArrowUpRight
} from 'lucide-react';
import { StatCard, RiskBadge, LoadingSpinner } from '../../components/common/StatCard';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function StudentDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const [analysis, setAnalysis] = useState(null);
  const [marks, setMarks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      try {
        const [aiData, marksData, assignData, attData] = await Promise.all([
          api.getStudentAIAnalysis(user.id),
          api.getStudentMarks(user.id),
          api.getAssignments(),
          api.getStudentAttendanceSummary(user.id)
        ]);
        setAnalysis(aiData);
        setMarks(marksData);
        setAssignments(assignData.slice(0, 3));
        setAttendanceSummary(attData);
      } catch (err) {
        console.error("Failed to load student dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  if (loading) return <LoadingSpinner text="Computing Academic Intelligence Analytics..." />;

  const chartData = [
    { name: 'Unit Test 1', score: 62 },
    { name: 'Assign 1', score: 68 },
    { name: 'Internal 1', score: (analysis?.average_marks_pct || 70) - 8 },
    { name: 'Model Exam', score: (analysis?.average_marks_pct || 70) - 2 },
    { name: 'Current Avg', score: analysis?.average_marks_pct || 72 },
  ];

  const handleRefreshAI = async () => {
    try {
      const refreshed = await api.getStudentAIAnalysis(user.id);
      setAnalysis(refreshed);
      toast.success("AI Academic Intelligence model re-evaluated latest attendance & mark records!");
    } catch (err) {
      toast.error("Failed to refresh AI analysis");
    }
  };


  return (
    <div className="space-y-8">
      
      {/* Top Welcome & Risk Banner */}
      <div className="glass-panel p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">
              Welcome back, {user?.full_name}
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              {user?.enrollment_number || 'STU-2026'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Department of {user?.department || 'Computer Science'} • Semester 6 (Batch 2022-2026)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">AI Risk Assessment</span>
            <RiskBadge level={analysis?.risk_level} score={analysis?.risk_score} />
          </div>
          <button 
            onClick={handleRefreshAI}
            className="btn-secondary !py-2 !px-3 text-xs flex items-center gap-1.5"
            title="Re-run AI diagnostic model on latest academic logs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Run AI Diagnostic
          </button>
          <Link to="/student/report-card" className="btn-primary !py-2 !px-3.5 text-xs flex items-center gap-1.5 shadow-glow-brand">
            <Award className="w-3.5 h-3.5" /> Performance Report
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Overall Attendance"
          value={`${analysis?.overall_attendance_pct || 85}%`}
          subtitle={analysis?.overall_attendance_pct >= 75 ? "Meets 75% Regulatory Threshold" : "Attendance Deficit Alert (<75%)"}
          icon={CalendarCheck}
          color={analysis?.overall_attendance_pct >= 75 ? "emerald" : "rose"}
        />

        <StatCard
          title="Average Mark"
          value={`${analysis?.average_marks_pct || 75}%`}
          subtitle="Across 4 Semester Subjects"
          icon={Award}
          color="brand"
        />

        <StatCard
          title="Weak Subjects"
          value={analysis?.weak_subjects_json?.length || 0}
          subtitle="Identified for Tutoring"
          icon={AlertTriangle}
          color={analysis?.weak_subjects_json?.length > 0 ? "amber" : "emerald"}
        />

        <StatCard
          title="Academic Trend"
          value={analysis?.trend_status?.toUpperCase() || "STABLE"}
          subtitle="AI Trajectory Forecast"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Main Content Split: AI Insights vs Enrolled Subjects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: AI Intelligence & Weak Areas */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* AI Intelligence Action Items */}
          <div className="glass-panel p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Personalized AI Study Recommendations
              </h2>
              <Link to="/student/progress" className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
                Full Insights <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {(analysis?.recommendations_json || []).slice(0, 3).map((rec, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 mt-0.5 ${
                    rec.priority === 'Urgent' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    rec.priority === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                  }`}>
                    {rec.priority}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{rec.category}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{rec.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Trajectory Chart */}
          <div className="glass-panel p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                Continuous Assessment Trajectory
              </h2>
              <span className="text-xs text-slate-400 font-mono">Progress Curve</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0e8ce9" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0e8ce9" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#0e8ce9" strokeWidth={3} fillOpacity={1} fill="url(#scoreGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right 5 Cols: Enrolled Subjects & Upcoming Assignments */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Marks Overview Breakdown */}
          <div className="glass-panel p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Subject Marks Breakdown
              </h2>
              <Link to="/student/grades" className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
                All Marks <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {marks.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-sans font-bold text-white text-xs">Subject #{m.subject_id}</div>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                      Int: <span className="text-brand-400 font-bold">{m.internal_total_25}/25</span> • Ext: <span className="text-indigo-400 font-bold">{m.external_converted_75}/75</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-extrabold text-white">{m.final_mark_100}/100</div>
                    <span className="text-xs font-bold text-amber-400">Grade {m.letter_grade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Assignments */}
          <div className="glass-panel p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                Active Assignments
              </h2>
              <Link to="/student/assignments" className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              {assignments.map((a) => (
                <div key={a.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-slate-200">{a.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> Due: {new Date(a.due_date).toLocaleDateString()}
                    </span>
                    <span className="text-brand-400 font-semibold">Max: {a.max_score} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
