import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Star, Clock, User, Calendar, CheckCircle2, 
  Layers, ArrowLeft, GraduationCap, Sparkles, FileText, ChevronRight
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/common/StatCard';

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCourse() {
      try {
        const data = await api.getCourse(id);
        setCourse(data);
      } catch (err) {
        console.error("Course fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [id]);

  if (loading) return <LoadingSpinner text="Retrieving course syllabus..." />;
  if (!course) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Course Not Found</h2>
        <Link to="/courses" className="btn-secondary !py-2 text-xs">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const handleEnroll = async () => {
    if (!user) {
      toast.info("Please log in to your student account to enroll in courses.");
      navigate('/login');
    } else {
      try {
        await api.enrollCourse(course.id);
        setEnrolled(true);
        toast.success(`Successfully enrolled in ${course.title} (${course.code})!`);
      } catch (err) {
        toast.error(err.message || 'Enrollment failed');
      }
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back button */}
      <div>
        <Link to="/courses" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Course Catalog
        </Link>
      </div>

      {/* Hero Header */}
      <div className="glass-panel p-8 md:p-10 border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-brand-500/20 text-brand-400 text-xs font-mono font-bold border border-brand-500/30">
              {course.code}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {course.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {course.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Star className="w-4 h-4 fill-amber-400" /> {course.rating} ({course.total_reviews} student reviews)
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-400" /> {course.schedule_info}
            </div>
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-400" /> {course.credits} Credits Accredited
            </div>
          </div>
        </div>

        {/* Enrollment Action Box */}
        <div className="lg:col-span-4 glass-card p-6 border border-slate-700/70 space-y-5 text-center">
          <img 
            src={course.thumbnail || "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600"} 
            alt={course.title} 
            className="w-full h-40 object-cover rounded-xl border border-slate-800"
          />

          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">Full Semester Access</div>
            <p className="text-xs text-slate-400">Includes continuous internal assessment & AI study tutor</p>
          </div>

          {enrolled ? (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Enrolled Successfully! Access in Student Portal
            </div>
          ) : (
            <button 
              onClick={handleEnroll}
              className="btn-primary w-full !py-3 text-xs shadow-glow-brand font-bold"
            >
              Enroll Now into Course
            </button>
          )}
        </div>
      </div>

      {/* Syllabus Breakdown & Teacher Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Syllabus Modules */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-400" />
              Detailed Module Syllabus
            </h2>
            <span className="text-xs text-slate-400">5 Structured Units</span>
          </div>

          <div className="space-y-3">
            {(course.syllabus_json || [
              { module: 1, title: "Foundations & Architectural Principles", hours: 8 },
              { module: 2, title: "Core Paradigms & Mathematical Foundations", hours: 10 },
              { module: 3, title: "Practical Application & Lab Implementations", hours: 12 },
              { module: 4, title: "Optimization, Performance & Testing", hours: 10 },
              { module: 5, title: "Capstone Project & Real-World Case Studies", hours: 8 }
            ]).map((mod, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between hover:border-brand-500/30 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center font-bold text-xs">
                    M{mod.module || idx + 1}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">{mod.title}</h3>
                    <p className="text-[11px] text-slate-500">Lecture Series & Lab Worksheets</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">{mod.hours || 8} Hours</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Assessment Formula & Faculty */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Assessment Framework
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span>Internal Assessment</span>
                <span className="font-bold text-brand-400">25 Marks</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span>Semester Examination</span>
                <span className="font-bold text-indigo-400">100 → 75 Marks</span>
              </div>
              <div className="flex justify-between font-bold text-white pt-1">
                <span>Total Final Grade</span>
                <span className="text-emerald-400">100 Marks</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              * Conforms to official BUILDATHON academic conversion standards: External mark scaled by 0.75 added to internal assessment components.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
