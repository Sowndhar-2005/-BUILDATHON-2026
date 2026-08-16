import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Sparkles, BookOpen, Users, TrendingUp, 
  ArrowRight, Award, Bell, CheckCircle2, ShieldCheck, 
  Compass, ChevronRight, Star, Brain, Lightbulb
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [topTeachers, setTopTeachers] = useState([]);
  const [studyTips, setStudyTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [courses, teachers, tips] = await Promise.all([
          api.getCourses('featured_only=true'),
          api.getUsers('teacher'),
          api.getStudyTips()
        ]);
        setFeaturedCourses(courses);
        setTopTeachers(teachers.slice(0, 3));
        setStudyTips(tips);
      } catch (err) {
        console.error("Home data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Announcements Banner / Live Ticker */}
      <div className="bg-gradient-to-r from-brand-950 via-slate-900 to-indigo-950 border-b border-brand-500/20 py-2.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-bold uppercase text-[10px] tracking-wider shrink-0 border border-brand-500/30">
              <Bell className="w-3 h-3 text-amber-400 animate-bounce" /> Academic Notice
            </span>
            <p className="text-slate-300 truncate font-medium">
              Semester 6 Internal Assessments & Model Examinations marks synchronization active. Check AI Academic Risk diagnostics on your student portal.
            </p>
          </div>
          <Link to="/student/dashboard" className="shrink-0 text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1 hidden sm:flex">
            View Schedule <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-3xl overflow-hidden glass-panel p-8 md:p-14 border border-slate-800 shadow-2xl bg-gradient-to-br from-slate-900/90 via-slate-950 to-indigo-950/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>BUILDATHON 2026 Integrated AI Academic Portal</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Empowering Minds with <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-brand-300 bg-clip-text text-transparent">Integrated AI Intelligence</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                A modern Education Management Portal connecting Students, Subject Faculty, Class Mentors, and Academic Leadership with real-time analytics, automated mark calculations, and predictive academic intervention.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/courses" className="btn-primary !px-6 !py-3 text-sm shadow-glow-brand">
                  <Compass className="w-4 h-4" /> Explore Courses
                </Link>
                <Link to="/login" className="btn-secondary !px-6 !py-3 text-sm">
                  Access Portal <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Quick Specs Highlight */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-800/80">
                <div>
                  <p className="text-xl font-bold text-white">/25 + /75</p>
                  <p className="text-[11px] text-slate-400">Exact Marks Standard</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-emerald-400">100% Async</p>
                  <p className="text-[11px] text-slate-400">FastAPI + SQLAlchemy</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-indigo-400">Dual Faculty</p>
                  <p className="text-[11px] text-slate-400">Subject & Mentor Roles</p>
                </div>
              </div>
            </div>

            {/* Hero Interactive Card / AI Live Snapshot */}
            <div className="lg:col-span-5">
              <div className="glass-card p-6 border border-slate-700/60 shadow-2xl relative space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-brand-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">AI Diagnostic Engine</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Evaluation
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-300">CS601: Database Management</span>
                      <span className="text-amber-400">Risk Detected</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: '53%' }}></div>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Internal: 14/25 • Converted Ext: 39/75 • Final: 53/100 (B)
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-brand-950/40 border border-brand-500/30 text-slate-300 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-brand-400 text-xs">
                      <Sparkles className="w-3.5 h-3.5" /> AI Personalized Action Plan:
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      "Allocate 45 mins daily to BCNF Normalization & Indexing trees. Attend mandatory lab sessions to lift attendance from 68% above the 75% threshold."
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <Link 
                    to="/login"
                    className="w-full btn-primary !py-2 text-xs flex items-center justify-center gap-1.5 shadow-glow-brand"
                  >
                    Access Academic Portal <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Curriculum Catalog</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Featured Academic Courses</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Accredited courses with structured semester syllabi, faculty notes, and assessment frameworks.
            </p>
          </div>
          <Link to="/courses" className="btn-secondary !py-2 text-xs flex items-center gap-1.5">
            View All Courses <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((course) => (
            <div key={course.id} className="glass-card overflow-hidden flex flex-col group">
              <div className="h-44 relative overflow-hidden bg-slate-800">
                <img 
                  src={course.thumbnail || "https://images.unsplash.com/photo-1516116211227-bbc13c7d6352?w=600"} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-brand-300 border border-brand-500/30">
                  {course.code}
                </div>
                <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-slate-900/90 text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {course.rating}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                    {course.category}
                  </span>
                  <h3 className="font-bold text-base text-white group-hover:text-brand-400 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{course.credits} Academic Credits</span>
                  <Link 
                    to={`/courses/${course.id}`} 
                    className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
                  >
                    Syllabus <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Top Faculty / Teachers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Distinguished Faculty</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Learn from Renowned Mentors</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Experienced professors driving both subject excellence and holistic mentorship across batches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topTeachers.map((teacher) => (
            <div key={teacher.id} className="glass-card p-6 text-center space-y-4 hover:border-indigo-500/40 transition">
              <img 
                src={teacher.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
                alt={teacher.full_name}
                className="w-20 h-20 rounded-2xl mx-auto object-cover border-2 border-indigo-500/30 shadow-lg"
              />
              <div>
                <h3 className="font-bold text-base text-white">{teacher.full_name}</h3>
                <p className="text-xs font-medium text-brand-400 mt-0.5">{teacher.specialization || "Senior Faculty"}</p>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed line-clamp-3">
                  {teacher.bio || "Leading departmental research, subject curricula, and student progress."}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                Department: <span className="text-slate-200">{teacher.department}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. AI Study Tips & Cognitive Strategies Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 md:p-10 border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Daily AI Cognitive Study Insights</h2>
              <p className="text-xs text-slate-400">Evidence-based learning techniques generated by the academic intelligence engine.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studyTips.map((tip) => (
              <div key={tip.id} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  {tip.category}
                </span>
                <h4 className="font-bold text-sm text-white">{tip.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{tip.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA / Problem Statement Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-panel p-10 border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 space-y-5 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to experience the next-generation Education Management Portal?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Manage academic activities, calculate precise 25/75 internal & external marks, monitor student attendance, and generate official AI performance summaries.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/register" className="btn-primary !px-6 !py-3 text-sm">
              Create Student or Faculty Account
            </Link>
            <Link to="/courses" className="btn-secondary !px-6 !py-3 text-sm">
              Browse All Courses
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
