import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  BookOpen, Users, Award, CalendarCheck, Sliders, 
  AlertTriangle, Sparkles, ChevronRight, CheckCircle2, UserCheck
} from 'lucide-react';
import { StatCard, RiskBadge, LoadingSpinner } from '../../components/common/StatCard';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classOverview, setClassOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeacherData() {
      try {
        const [subjs, clsList] = await Promise.all([
          api.getSubjects(),
          api.getClasses()
        ]);
        setSubjects(subjs);
        setClasses(clsList);

        if (clsList.length > 0) {
          const overview = await api.getClassAIOverview(clsList[0].id);
          setClassOverview(overview);
        }
      } catch (err) {
        console.error("Teacher dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTeacherData();
  }, []);

  if (loading) return <LoadingSpinner text="Loading Faculty Command Console..." />;

  const isMentor = user?.email?.includes('mentor') || user?.specialization?.includes('Mentor');

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white">
              Faculty Command Console: {user?.full_name}
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {isMentor ? "Class Mentor & Senior Faculty" : "Subject Faculty"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Department of {user?.department || "CSE"} • {user?.specialization || "Database & Algorithms"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/teacher/assessment-config" className="btn-secondary !py-2 !px-3.5 text-xs flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-brand-400" /> Config /25 Weighting
          </Link>
          <Link to="/teacher/grade-entry" className="btn-primary !py-2 !px-3.5 text-xs flex items-center gap-1.5 shadow-glow-brand">
            <Award className="w-3.5 h-3.5" /> Enter Marks
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Assigned Subjects"
          value={subjects.length}
          subtitle="Active Semester Courses"
          icon={BookOpen}
          color="brand"
        />

        <StatCard
          title="Class Enrollment"
          value={classOverview?.total_students || 4}
          subtitle="Students under Mentorship"
          icon={Users}
          color="purple"
        />

        <StatCard
          title="Class Avg Attendance"
          value={`${classOverview?.average_class_attendance || 85}%`}
          subtitle="Cumulative Roll Call"
          icon={CalendarCheck}
          color={classOverview?.average_class_attendance >= 75 ? "emerald" : "rose"}
        />

        <StatCard
          title="At-Risk Alerts"
          value={classOverview?.at_risk_count || 1}
          subtitle="Need Academic Intervention"
          icon={AlertTriangle}
          color={classOverview?.at_risk_count > 0 ? "amber" : "emerald"}
        />
      </div>

      {/* Main Grid: Subjects vs Mentorship & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Assigned Subjects & Assessment Config Preview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-400" />
                Managed Subjects & Assessment Scheme
              </h2>
              <Link to="/teacher/subjects" className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
                Manage All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {subjects.map((subj) => (
                <div key={subj.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 text-[10px] font-bold font-mono">
                      {subj.code}
                    </span>
                    <h3 className="font-bold text-sm text-white mt-1">{subj.name}</h3>
                    <p className="text-xs text-slate-400">Class #{subj.class_id} • Semester {subj.semester}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/teacher/assessment-config?subjectId=${subj.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <Sliders className="w-3 h-3 text-brand-400" /> /25 Config
                    </Link>
                    <Link
                      to={`/teacher/grade-entry?subjectId=${subj.id}`}
                      className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <Award className="w-3 h-3" /> Marks
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Attendance Roll Call Shortcut */}
          <div className="glass-panel p-6 border border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-400" /> Daily Roll Call Register
              </h3>
              <p className="text-xs text-slate-400">
                Record batch lecture attendance for B.Tech CSE Section A.
              </p>
            </div>
            <Link to="/teacher/attendance" className="btn-primary !py-2 !px-4 text-xs">
              Take Attendance
            </Link>
          </div>
        </div>

        {/* Right 5 Cols: Class AI Overview & Weak Subject Hotspots */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Class AI Risk & Diagnostic Matrix
              </h2>
              <span className="text-xs text-slate-400 font-mono">B.Tech CSE - Sec A</span>
            </div>

            {/* Risk distribution bars */}
            <div className="space-y-3">
              <span className="text-xs text-slate-400 font-semibold block">Academic Risk Distribution</span>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                  <div className="font-extrabold text-emerald-400 text-base">{classOverview?.risk_distribution?.low || 2}</div>
                  <span className="text-[10px] text-slate-400">Low Risk</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30">
                  <div className="font-extrabold text-amber-400 text-base">{classOverview?.risk_distribution?.medium || 1}</div>
                  <span className="text-[10px] text-slate-400">Moderate</span>
                </div>
                <div className="p-2.5 rounded-xl bg-orange-950/40 border border-orange-500/30">
                  <div className="font-extrabold text-orange-400 text-base">{classOverview?.risk_distribution?.high || 1}</div>
                  <span className="text-[10px] text-slate-400">High Risk</span>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30">
                  <div className="font-extrabold text-rose-400 text-base">{classOverview?.risk_distribution?.critical || 0}</div>
                  <span className="text-[10px] text-slate-400">Critical</span>
                </div>
              </div>
            </div>

            {/* Weak Subject Hotspots */}
            <div className="pt-2 space-y-2">
              <span className="text-xs text-slate-400 font-semibold block">Subject Deficit Hotspots</span>
              <div className="space-y-2 text-xs">
                {(classOverview?.weak_subject_hotspots || [
                  { subject: "Database Management Systems", struggling_students: 1 },
                  { subject: "Design & Analysis of Algorithms", struggling_students: 1 }
                ]).map((spot, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-300 font-medium">{spot.subject}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold font-mono text-[10px]">
                      {spot.struggling_students} student(s) at risk
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link to="/teacher/class-roster" className="btn-outline w-full !py-2 text-xs flex items-center justify-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> View Class Mentorship Roster
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
