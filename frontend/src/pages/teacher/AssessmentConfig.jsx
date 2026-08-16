import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sliders, Save, CheckCircle2, AlertTriangle, BookOpen, Calculator, Info } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/common/StatCard';

export default function AssessmentConfig() {
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [config, setConfig] = useState({
    has_internal_test: true,
    internal_test_max: 10.0,
    has_model_exam: true,
    model_exam_max: 5.0,
    has_assignment: true,
    assignment_max: 5.0,
    has_seminar: true,
    seminar_max: 2.5,
    has_project: true,
    project_max: 2.5,
    total_internal_target: 25.0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const subjs = await api.getSubjects();
        setSubjects(subjs);
        const querySubjId = searchParams.get('subjectId');
        const activeId = querySubjId ? parseInt(querySubjId) : subjs[0]?.id;
        setSelectedSubjectId(activeId);

        if (activeId) {
          const cfg = await api.getAssessmentConfig(activeId);
          setConfig(cfg);
        }
      } catch (err) {
        console.error("Config load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [searchParams]);

  const handleSubjectChange = async (subjId) => {
    setSelectedSubjectId(subjId);
    setSaveSuccess(false);
    try {
      const cfg = await api.getAssessmentConfig(subjId);
      setConfig(cfg);
    } catch (err) {
      console.error("Failed to load subject config:", err);
    }
  };

  const calculateCurrentSum = () => {
    let sum = 0;
    if (config.has_internal_test) sum += parseFloat(config.internal_test_max || 0);
    if (config.has_model_exam) sum += parseFloat(config.model_exam_max || 0);
    if (config.has_assignment) sum += parseFloat(config.assignment_max || 0);
    if (config.has_seminar) sum += parseFloat(config.seminar_max || 0);
    if (config.has_project) sum += parseFloat(config.project_max || 0);
    return Math.round(sum * 100) / 100;
  };

  const currentSum = calculateCurrentSum();
  const isValidSum = Math.abs(currentSum - 25.0) < 0.01;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isValidSum) {
      toast.error("Error: Total internal target must equal exactly 25.0 marks.");
      return;
    }
    setSaving(true);
    setSaveSuccess(false);
    try {
      await api.updateAssessmentConfig(selectedSubjectId, {
        ...config,
        subject_id: selectedSubjectId,
        total_internal_target: 25.0
      });
      setSaveSuccess(true);
      toast.success("Subject assessment scheme successfully saved and activated for 25-mark continuous evaluation!");
    } catch (err) {
      toast.error(err.message || "Failed to update configuration");
    } finally {
      setSaving(false);
    }
  };


  if (loading) return <LoadingSpinner text="Loading Assessment Configuration Engine..." />;

  const currentSubject = subjects.find(s => s.id === selectedSubjectId);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <Sliders className="w-7 h-7 text-brand-400" />
          Subject-Specific Assessment Configurator (/25)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Conforms to Section 4 & 9 of BUILDATHON Specification: Configure custom internal assessment components per subject summing up to 25 target marks.
        </p>
      </div>

      {/* Subject Selector Dropdown */}
      <div className="glass-panel p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Select Subject to Configure
          </label>
          <p className="text-[11px] text-slate-400">Different subjects can possess unique assessment schemes</p>
        </div>

        <select
          value={selectedSubjectId || ''}
          onChange={(e) => handleSubjectChange(parseInt(e.target.value))}
          className="input-field w-full sm:w-80 text-xs font-semibold"
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id} className="bg-slate-900 text-white">
              {s.code} — {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Target Sum Verification Bar */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
        isValidSum
          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-400'
          : 'bg-rose-950/30 border-rose-500/40 text-rose-400'
      }`}>
        <div className="flex items-center gap-2.5">
          {isValidSum ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          )}
          <div>
            <span className="font-bold text-sm block text-white">
              Current Internal Component Sum: {currentSum} / 25.0 Marks
            </span>
            <span className="text-[11px] text-slate-300">
              {isValidSum ? "Target configuration valid. Ready to evaluate." : "Sum of configured max weights must equal 25.0."}
            </span>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
          isValidSum ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
        }`}>
          {isValidSum ? 'Valid (25.0)' : `Deficit: ${(25.0 - currentSum).toFixed(1)}`}
        </span>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Assessment scheme updated and applied to student calculation engine for {currentSubject?.name}.</span>
        </div>
      )}

      {/* Component Toggles & Weight Input Form */}
      <form onSubmit={handleSave} className="glass-panel p-8 border border-slate-800 space-y-6">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3">
          Configure Internal Components for {currentSubject?.code}
        </h2>

        <div className="space-y-4">
          
          {/* 1. Internal Test */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="int_test"
                checked={config.has_internal_test}
                onChange={(e) => setConfig({ ...config, has_internal_test: e.target.checked })}
                className="w-4 h-4 rounded text-brand-500 focus:ring-0 bg-slate-800 border-slate-700"
              />
              <div>
                <label htmlFor="int_test" className="font-bold text-xs text-white cursor-pointer block">
                  Continuous Internal Test (CIT)
                </label>
                <p className="text-[11px] text-slate-400">Written periodic unit tests</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Max Weight (/25):</span>
              <input
                type="number"
                step="0.5"
                min="0"
                max="25"
                disabled={!config.has_internal_test}
                value={config.internal_test_max}
                onChange={(e) => setConfig({ ...config, internal_test_max: parseFloat(e.target.value) || 0 })}
                className="input-field !w-24 text-center font-mono text-xs"
              />
            </div>
          </div>

          {/* 2. Model Examination */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="model_exam"
                checked={config.has_model_exam}
                onChange={(e) => setConfig({ ...config, has_model_exam: e.target.checked })}
                className="w-4 h-4 rounded text-brand-500 focus:ring-0 bg-slate-800 border-slate-700"
              />
              <div>
                <label htmlFor="model_exam" className="font-bold text-xs text-white cursor-pointer block">
                  Model Examination
                </label>
                <p className="text-[11px] text-slate-400">Pre-semester mock examination</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Max Weight (/25):</span>
              <input
                type="number"
                step="0.5"
                min="0"
                max="25"
                disabled={!config.has_model_exam}
                value={config.model_exam_max}
                onChange={(e) => setConfig({ ...config, model_exam_max: parseFloat(e.target.value) || 0 })}
                className="input-field !w-24 text-center font-mono text-xs"
              />
            </div>
          </div>

          {/* 3. Assignment */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="assignment"
                checked={config.has_assignment}
                onChange={(e) => setConfig({ ...config, has_assignment: e.target.checked })}
                className="w-4 h-4 rounded text-brand-500 focus:ring-0 bg-slate-800 border-slate-700"
              />
              <div>
                <label htmlFor="assignment" className="font-bold text-xs text-white cursor-pointer block">
                  Coursework Assignments
                </label>
                <p className="text-[11px] text-slate-400">Problem sets, coding exercises & worksheets</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Max Weight (/25):</span>
              <input
                type="number"
                step="0.5"
                min="0"
                max="25"
                disabled={!config.has_assignment}
                value={config.assignment_max}
                onChange={(e) => setConfig({ ...config, assignment_max: parseFloat(e.target.value) || 0 })}
                className="input-field !w-24 text-center font-mono text-xs"
              />
            </div>
          </div>

          {/* 4. Seminar (Optional) */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="seminar"
                checked={config.has_seminar}
                onChange={(e) => setConfig({ ...config, has_seminar: e.target.checked })}
                className="w-4 h-4 rounded text-brand-500 focus:ring-0 bg-slate-800 border-slate-700"
              />
              <div>
                <label htmlFor="seminar" className="font-bold text-xs text-white cursor-pointer block">
                  Student Seminar & Presentation (Optional)
                </label>
                <p className="text-[11px] text-slate-400">Technical presentation & peer review</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Max Weight (/25):</span>
              <input
                type="number"
                step="0.5"
                min="0"
                max="25"
                disabled={!config.has_seminar}
                value={config.seminar_max}
                onChange={(e) => setConfig({ ...config, seminar_max: parseFloat(e.target.value) || 0 })}
                className="input-field !w-24 text-center font-mono text-xs"
              />
            </div>
          </div>

          {/* 5. Project (Optional) */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="project"
                checked={config.has_project}
                onChange={(e) => setConfig({ ...config, has_project: e.target.checked })}
                className="w-4 h-4 rounded text-brand-500 focus:ring-0 bg-slate-800 border-slate-700"
              />
              <div>
                <label htmlFor="project" className="font-bold text-xs text-white cursor-pointer block">
                  Capstone Mini-Project / Lab Work (Optional)
                </label>
                <p className="text-[11px] text-slate-400">Practical software or hardware implementation</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Max Weight (/25):</span>
              <input
                type="number"
                step="0.5"
                min="0"
                max="25"
                disabled={!config.has_project}
                value={config.project_max}
                onChange={(e) => setConfig({ ...config, project_max: parseFloat(e.target.value) || 0 })}
                className="input-field !w-24 text-center font-mono text-xs"
              />
            </div>
          </div>

        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving || !isValidSum}
            className="btn-primary !py-2.5 !px-6 text-xs flex items-center gap-2 shadow-glow-brand"
          >
            {saving ? 'Saving...' : (
              <>
                <Save className="w-4 h-4" /> Save & Activate /25 Scheme
              </>
            )}
          </button>
        </div>
      </form>

    </div>
  );
}
