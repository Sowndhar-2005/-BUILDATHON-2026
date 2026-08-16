import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, Download, User, Layers, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/common/StatCard';

export default function MyCourses() {
  const { user } = useAuth();
  const toast = useToast();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubjects() {
      try {
        const data = await api.getSubjects();
        setSubjects(data);
      } catch (err) {
        console.error("Failed to load subjects:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSubjects();
  }, []);

  if (loading) return <LoadingSpinner text="Loading enrolled curriculum subjects..." />;

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Enrolled Subjects & Study Materials</h1>
          <p className="text-xs text-slate-400 mt-1">
            Access curriculum topics, module schedules, and download lecture notes uploaded by subject faculty.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/30 text-xs font-semibold text-brand-400">
          Semester 6 • 4 Active Subjects
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subj) => (
          <div key={subj.id} className="glass-panel p-6 border border-slate-800 space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-brand-500/20 text-brand-300 font-mono font-bold text-xs border border-brand-500/30">
                  {subj.code}
                </span>
                <span className="text-xs text-slate-400 font-medium">{subj.credits} Credits</span>
              </div>

              <h2 className="text-lg font-bold text-white">{subj.name}</h2>

              {/* Syllabus Topics */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Core Syllabus Topics
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(subj.syllabus_topics || ["Fundamentals", "Advanced Modules", "Lab Practicals"]).map((topic, tIdx) => (
                    <span key={tIdx} className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notes & Downloads */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Faculty Lecture Notes
                </span>
                <div className="space-y-2">
                  {(subj.notes_json || [
                    { title: "Unit 1: Core Conceptual Foundations & Slide Deck", uploaded: "2026-02-12" }
                  ]).map((note, nIdx) => (
                    <div key={nIdx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-200">
                        <FileText className="w-4 h-4 text-brand-400 shrink-0" />
                        <span className="truncate">{note.title}</span>
                      </div>
                      <button 
                        onClick={() => toast.info(`Downloading study resource: ${note.title}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white transition"
                        title="Download Note"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>


            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Faculty ID: #{subj.teacher_id}</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active Curriculum
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
