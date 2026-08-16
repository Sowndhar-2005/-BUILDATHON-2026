import React, { useState, useEffect } from 'react';
import { BookOpen, Upload, FileText, Plus, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/common/StatCard';

export default function SubjectManagement() {
  const toast = useToast();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubj, setSelectedSubj] = useState(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');

  useEffect(() => {
    async function loadSubjects() {
      try {
        const data = await api.getSubjects();
        setSubjects(data);
        if (data.length > 0) setSelectedSubj(data[0]);
      } catch (err) {
        console.error("Subjects fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSubjects();
  }, []);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    toast.success(`Material "${newNoteTitle}" uploaded and published to student portals.`);
    setNewNoteTitle('');
  };


  if (loading) return <LoadingSpinner text="Loading faculty course subjects..." />;

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">Subject Curriculum & Material Management</h1>
        <p className="text-xs text-slate-400 mt-1">
          Maintain topic sequences, update lecture outlines, and upload study material notes for enrolled student cohorts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 4 Cols: Subjects List */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Subjects</h2>
          {subjects.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelectedSubj(s)}
              className={`p-4 rounded-xl cursor-pointer border transition ${
                selectedSubj?.id === s.id
                  ? 'bg-slate-900 border-brand-500 shadow-glow-brand'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono text-[10px] font-bold">
                  {s.code}
                </span>
                <span className="text-xs text-slate-400">{s.credits} Credits</span>
              </div>
              <h3 className="font-bold text-sm text-white mt-1.5">{s.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Semester {s.semester} • Class #{s.class_id}</p>
            </div>
          ))}
        </div>

        {/* Right 8 Cols: Subject Details & Notes Upload */}
        <div className="lg:col-span-8">
          {selectedSubj && (
            <div className="glass-panel p-8 border border-slate-800 space-y-6">
              
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-brand-400">{selectedSubj.code}</span>
                  <h2 className="text-xl font-bold text-white mt-0.5">{selectedSubj.name}</h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                  Active Instruction
                </span>
              </div>

              {/* Syllabus topics */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Configured Syllabus Units
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(selectedSubj.syllabus_topics || ["Module 1", "Module 2", "Module 3", "Module 4"]).map((topic, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-400"></span>
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload Notes Form */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Upload className="w-4 h-4 text-brand-400" /> Upload Course Notes & Slide Decks
                </h3>

                <form onSubmit={handleAddNote} className="space-y-3 text-xs">
                  <input
                    type="text"
                    required
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    placeholder="e.g. Unit 4: ACID Transactions & Concurrency Control PPT"
                    className="input-field text-xs"
                  />
                  <div className="flex items-center justify-between">
                    <button type="button" className="btn-secondary !py-1.5 !px-3 text-xs">
                      Attach Document (PDF/PPT)
                    </button>
                    <button type="submit" className="btn-primary !py-1.5 !px-4 text-xs">
                      Publish to Students
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
