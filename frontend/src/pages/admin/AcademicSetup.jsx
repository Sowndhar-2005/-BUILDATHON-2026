import React, { useState, useEffect } from 'react';
import { School, BookOpen, Layers, Plus, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/common/StatCard';

export default function AcademicSetup() {
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Course Form State
  const [newCourse, setNewCourse] = useState({
    code: '',
    title: '',
    category: 'Computer Science',
    credits: 4,
    description: '',
    rating: 4.8
  });

  useEffect(() => {
    async function loadAcademicData() {
      try {
        const [cList, clsList, sList] = await Promise.all([
          api.getCourses(),
          api.getClasses(),
          api.getSubjects()
        ]);
        setCourses(cList);
        setClasses(clsList);
        setSubjects(sList);
      } catch (err) {
        console.error("Academic setup load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAcademicData();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createCourse(newCourse);
      setCourses([created, ...courses]);
      toast.success("New course successfully added to institutional academic catalog!");
      setNewCourse({ code: '', title: '', category: 'Computer Science', credits: 4, description: '', rating: 4.8 });
    } catch (err) {
      toast.error(err.message || "Failed to create course");
    }
  };


  if (loading) return <LoadingSpinner text="Loading Academic Structure..." />;

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">Academic Hierarchy & Curriculum Setup</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure Programs, Batches, Class Sections, Subjects, and Course Catalogs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 6 Cols: Class Sections & Subjects */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel p-6 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <School className="w-4 h-4 text-brand-400" />
              Active Class Sections ({classes.length})
            </h2>

            <div className="space-y-3">
              {classes.map((cls) => (
                <div key={cls.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">{cls.name}</h3>
                    <p className="text-xs text-slate-400">{cls.department} • Batch {cls.batch_year}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-brand-500/20 text-brand-300 font-mono text-xs font-bold">
                    Sem {cls.semester}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Accredited Subjects ({subjects.length})
            </h2>

            <div className="space-y-3 text-xs font-mono">
              {subjects.map((subj) => (
                <div key={subj.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-brand-400">{subj.code}</span>
                    <h4 className="font-sans font-bold text-white text-xs mt-0.5">{subj.name}</h4>
                  </div>
                  <div className="text-right font-sans text-slate-400 text-[11px]">
                    <div>Teacher #{subj.teacher_id}</div>
                    <div className="text-brand-300 font-semibold">{subj.credits} Credits</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 6 Cols: Add Course Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel p-6 border border-slate-800 space-y-5">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Add Course to Catalog
            </h2>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Course Code</label>
                  <input
                    type="text"
                    required
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                    placeholder="e.g. CS-701"
                    className="input-field text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    required
                    value={newCourse.credits}
                    onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) || 4 })}
                    className="input-field text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Course Title</label>
                <input
                  type="text"
                  required
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="e.g. Distributed Computing & Microservices"
                  className="input-field text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Category</label>
                <select
                  value={newCourse.category}
                  onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                  className="input-field text-xs"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Database & Storage">Database & Storage</option>
                  <option value="Algorithms">Algorithms</option>
                  <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Description</label>
                <textarea
                  rows={3}
                  required
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Course overview and syllabus highlights..."
                  className="input-field text-xs resize-none"
                ></textarea>
              </div>

              <button type="submit" className="btn-primary w-full !py-2.5 text-xs shadow-glow-brand">
                Publish Course to Catalog
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
