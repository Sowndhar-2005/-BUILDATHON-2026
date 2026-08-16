import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  Users, School, BookOpen, AlertTriangle, TrendingUp, 
  ShieldCheck, Sparkles, ChevronRight, Activity, Award
} from 'lucide-react';
import { StatCard, LoadingSpinner, RiskBadge } from '../../components/common/StatCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [riskStudents, setRiskStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [allUsers, allCourses, allClasses, risks] = await Promise.all([
          api.getUsers(),
          api.getCourses(),
          api.getClasses(),
          api.getCampusRiskDetection()
        ]);
        setUsers(allUsers);
        setCourses(allCourses);
        setClasses(allClasses);
        setRiskStudents(risks);
      } catch (err) {
        console.error("Admin dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  if (loading) return <LoadingSpinner text="Connecting to Institutional Command Center..." />;

  const studentsCount = users.filter(u => u.role === 'student').length;
  const facultyCount = users.filter(u => u.role === 'teacher').length;

  const departmentData = [
    { department: 'Computer Science', averageScore: 78, attendance: 88, atRisk: 1 },
    { department: 'Information Tech', averageScore: 74, attendance: 82, atRisk: 2 },
    { department: 'AI & Data Science', averageScore: 82, attendance: 91, atRisk: 0 },
    { department: 'Electronics Eng', averageScore: 71, attendance: 79, atRisk: 3 },
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">
              Institutional Administration: {user?.full_name}
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Dean & System Administrator
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            EduVision AI Governance Portal • Session 2025-2026
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/academic-setup" className="btn-secondary !py-2 !px-3.5 text-xs flex items-center gap-1.5">
            <School className="w-3.5 h-3.5 text-brand-400" /> Academic Setup
          </Link>
          <Link to="/admin/risk-monitor" className="btn-primary !py-2 !px-3.5 text-xs flex items-center gap-1.5 shadow-glow-brand">
            <AlertTriangle className="w-3.5 h-3.5" /> Risk Intervention ({riskStudents.length})
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Students"
          value={studentsCount}
          subtitle="Enrolled Across Batches"
          icon={Users}
          color="brand"
        />

        <StatCard
          title="Faculty Members"
          value={facultyCount}
          subtitle="Active Teaching Staff"
          icon={School}
          color="purple"
        />

        <StatCard
          title="Curriculum Courses"
          value={courses.length}
          subtitle="Accredited Modules"
          icon={BookOpen}
          color="emerald"
        />

        <StatCard
          title="At-Risk Alerts"
          value={riskStudents.length}
          subtitle="Flagged by AI Engine"
          icon={AlertTriangle}
          color={riskStudents.length > 0 ? "rose" : "emerald"}
        />
      </div>

      {/* Analytics Chart & Risk Monitoring List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Department Comparative Analytics */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-400" />
                Departmental Academic & Attendance Matrix
              </h2>
              <span className="text-xs text-slate-400 font-mono">Institutional Benchmark</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="department" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="averageScore" name="Avg Mark %" fill="#0e8ce9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="attendance" name="Attendance %" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Campus Early Warning Alerts */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                AI Risk Early Warning Stream
              </h2>
              <Link to="/admin/risk-monitor" className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              {riskStudents.map((rs, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Student ID #{rs.student_id}</span>
                    <RiskBadge level={rs.risk_level} score={rs.risk_score} />
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Attendance: <strong className="text-rose-400">{rs.overall_attendance_pct}%</strong> • Avg Score: <strong>{rs.average_marks_pct}%</strong>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {rs.summary_report_text || "Identified attendance deficit and lagging subject internal marks."}
                  </p>
                </div>
              ))}

              {riskStudents.length === 0 && (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-center text-xs">
                  Zero critical academic risks detected across campus.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
