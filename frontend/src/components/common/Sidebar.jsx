import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, BookOpen, FileCheck, CalendarCheck, 
  Award, TrendingUp, Sparkles, FileText, Sliders, Users, 
  School, AlertTriangle, ShieldCheck, UserCheck, Layers
} from 'lucide-react';

export default function Sidebar() {
  const { user, role } = useAuth();

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/courses', icon: BookOpen, label: 'My Courses' },
    { to: '/student/assignments', icon: FileCheck, label: 'Assignments' },
    { to: '/student/attendance', icon: CalendarCheck, label: 'Attendance' },
    { to: '/student/grades', icon: Award, label: 'Grades & Marks' },
    { to: '/student/progress', icon: TrendingUp, label: 'My Progress & AI' },
    { to: '/student/report-card', icon: FileText, label: 'Performance Report' },
  ];

  const teacherLinks = [
    { to: '/teacher/dashboard', icon: LayoutDashboard, label: 'Teacher Hub' },
    { to: '/teacher/subjects', icon: BookOpen, label: 'My Subjects & Notes' },
    { to: '/teacher/assessment-config', icon: Sliders, label: 'Assessment Config (/25)' },
    { to: '/teacher/grade-entry', icon: Award, label: 'Enter Subject Marks' },
    { to: '/teacher/attendance', icon: CalendarCheck, label: 'Class Attendance Roll' },
    { to: '/teacher/class-roster', icon: Users, label: 'Class Mentorship' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Admin Command' },
    { to: '/admin/users', icon: Users, label: 'User Directory' },
    { to: '/admin/academic-setup', icon: School, label: 'Courses & Classes' },
    { to: '/admin/analytics', icon: TrendingUp, label: 'Campus AI Analytics' },
    { to: '/admin/risk-monitor', icon: AlertTriangle, label: 'At-Risk Intervention' },
  ];

  const links = role === 'admin' ? adminLinks : role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <aside className="w-64 shrink-0 hidden md:block bg-slate-950/95 border-r border-slate-800/80 p-4 min-h-[calc(100vh-4rem)]">
      {/* Profile pill */}
      <div className="mb-6 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
        <img 
          src={user?.avatar_url || "https://api.dicebear.com/7.x/bottts/svg?seed=avatar"} 
          alt="Avatar"
          className="w-10 h-10 rounded-xl border border-slate-700 object-cover"
        />
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-white truncate">{user?.full_name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <p className="text-[11px] text-slate-400 capitalize">{role}</p>
          </div>
        </div>
      </div>

      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
        {role} Navigation
      </div>

      <nav className="space-y-1">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600/20 to-brand-500/10 text-brand-400 border border-brand-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* AI Engine Status Banner */}
      <div className="mt-8 p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/40 to-brand-950/40 border border-indigo-500/20">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Engine Active</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Real-time risk scoring, weak area diagnosis & study path generation enabled.
        </p>
      </div>
    </aside>
  );
}
