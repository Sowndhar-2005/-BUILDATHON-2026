import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Award, Calculator, Save, CheckCircle2, AlertCircle, BookOpen, UserCheck, ArrowRight, Download, FileSpreadsheet } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/common/StatCard';

export default function GradeEntry() {
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Mark Form State
  const [formData, setFormData] = useState({
    internal_test_score: 5.5,
    model_exam_score: 2.5,
    assignment_score: 3.5,
    seminar_score: 1.5,
    project_score: 1.0,
    external_raw_100: 52.0,
    remarks: 'Requires targeted tutoring in Normalization'
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [subjs, studs] = await Promise.all([
          api.getSubjects(),
          api.getUsers('student')
        ]);
        setSubjects(subjs);
        setStudents(studs);

        const qSubj = searchParams.get('subjectId');
        const activeSubj = qSubj ? parseInt(qSubj) : subjs[0]?.id;
        setSelectedSubjectId(activeSubj);
        setSelectedStudentId(studs[0]?.id);

        if (activeSubj) {
          const cfg = await api.getAssessmentConfig(activeSubj);
          setConfig(cfg);
        }
      } catch (err) {
        console.error("Grade entry load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [searchParams]);

  const handleSubjectChange = async (subjId) => {
    setSelectedSubjectId(subjId);
    setSuccessMessage('');
    try {
      const cfg = await api.getAssessmentConfig(subjId);
      setConfig(cfg);
    } catch (err) {
      console.error("Config fetch error:", err);
    }
  };

  // Live calculation of 25 / 75 / 100 marks
  const computeLiveMarks = () => {
    let intSum = 0;
    if (config?.has_internal_test) intSum += Math.min(parseFloat(formData.internal_test_score || 0), config.internal_test_max);
    if (config?.has_model_exam) intSum += Math.min(parseFloat(formData.model_exam_score || 0), config.model_exam_max);
    if (config?.has_assignment) intSum += Math.min(parseFloat(formData.assignment_score || 0), config.assignment_max);
    if (config?.has_seminar) intSum += Math.min(parseFloat(formData.seminar_score || 0), config.seminar_max);
    if (config?.has_project) intSum += Math.min(parseFloat(formData.project_score || 0), config.project_max);
    
    const internal25 = Math.round(Math.min(intSum, 25.0) * 100) / 100;
    const extRaw = Math.max(0, Math.min(100, parseFloat(formData.external_raw_100 || 0)));
    const extConverted75 = Math.round(extRaw * 0.75 * 100) / 100;
    const final100 = Math.round(Math.min(100.0, internal25 + extConverted75) * 100) / 100;

    let grade = 'F';
    let passed = false;
    if (final100 >= 90) { grade = 'O'; passed = true; }
    else if (final100 >= 80) { grade = 'A+'; passed = true; }
    else if (final100 >= 70) { grade = 'A'; passed = true; }
    else if (final100 >= 60) { grade = 'B+'; passed = true; }
    else if (final100 >= 50) { grade = 'B'; passed = true; }
    else if (final100 >= 40) { grade = 'C'; passed = true; }

    return { internal25, extConverted75, final100, grade, passed };
  };

  const live = computeLiveMarks();

  const handleSaveMarks = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    try {
      await api.enterStudentMarks({
        student_id: selectedStudentId,
        subject_id: selectedSubjectId,
        semester: 6,
        ...formData
      });
      setSuccessMessage('Student marks successfully computed and committed to permanent academic transcript.');
      toast.success('Student marks computed (/25 internal + /75 external = /100) and committed successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to record marks');
    } finally {
      setSaving(false);
    }
  };


  const handleExportCSV = () => {
    const currentStudent = students.find(s => s.id === selectedStudentId);
    const currentSubject = subjects.find(s => s.id === selectedSubjectId);
    const headers = ['Student ID', 'Full Name', 'Enrollment Number', 'Internal (/25)', 'External Raw (/100)', 'External Converted (/75)', 'Final (/100)', 'Grade'];
    const row = [
      currentStudent?.id || '',
      `"${currentStudent?.full_name || ''}"`,
      currentStudent?.enrollment_number || '',
      live.internal25,
      formData.external_raw_100,
      live.extConverted75,
      live.final100,
      live.grade
    ];
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), row.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Grade_Entry_${currentSubject?.code || 'Subject'}_Student_${currentStudent?.id || 'ID'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Grade Record exported successfully!");
  };

  if (loading) return <LoadingSpinner text="Initializing Grade Entry & Conversion Engine..." />;

  const currentStudent = students.find(s => s.id === selectedStudentId);
  const currentSubject = subjects.find(s => s.id === selectedSubjectId);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Award className="w-7 h-7 text-brand-500 dark:text-brand-400" />
            Faculty Marks Entry & 25/75 Mark Conversion
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Record continuous internal scores and semester external marks with real-time conversion and grade attribution.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="btn-secondary !py-2 !px-4 text-xs flex items-center gap-2"
          title="Export current candidate grade calculation to CSV file"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Export CSV Record
        </button>
      </div>

      {/* Target Selector Bar */}
      <div className="glass-panel p-5 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
            1. Select Subject
          </label>
          <select
            value={selectedSubjectId || ''}
            onChange={(e) => handleSubjectChange(parseInt(e.target.value))}
            className="input-field text-xs font-semibold"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                {s.code} — {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
            2. Select Student Candidate
          </label>
          <select
            value={selectedStudentId || ''}
            onChange={(e) => setSelectedStudentId(parseInt(e.target.value))}
            className="input-field text-xs font-semibold"
          >
            {students.map((st) => (
              <option key={st.id} value={st.id} className="bg-slate-900 text-white">
                {st.full_name} ({st.enrollment_number || 'ID#' + st.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Calculation Metric Card */}
      <div className="glass-panel p-6 border border-brand-500/40 bg-gradient-to-r from-slate-900 via-brand-950/20 to-slate-900">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-brand-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Live Conversion Stream</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Internal (/25) + Converted Ext (/75) = Final (/100)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-center">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Internal Mark</span>
            <div className="text-2xl font-black text-brand-400 mt-0.5">{live.internal25} / 25</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Converted Ext</span>
            <div className="text-2xl font-black text-indigo-400 mt-0.5">{live.extConverted75} / 75</div>
            <span className="text-[10px] text-slate-500 font-mono">({formData.external_raw_100} &times; 0.75)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Final Subject Score</span>
            <div className="text-2xl font-black text-white mt-0.5">{live.final100} / 100</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Letter Grade</span>
            <div className="text-2xl font-black text-amber-400 mt-0.5">{live.grade}</div>
            <span className={`text-[10px] font-bold uppercase ${live.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
              {live.passed ? 'Passing' : 'Fail Status'}
            </span>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSaveMarks} className="glass-panel p-8 border border-slate-800 space-y-6">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3">
          Component Marks Entry for {currentStudent?.full_name} in {currentSubject?.code}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          
          {config?.has_internal_test && (
            <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <label className="text-slate-300 font-medium block">
                Continuous Internal Test (Max: {config.internal_test_max})
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max={config.internal_test_max}
                value={formData.internal_test_score}
                onChange={(e) => setFormData({ ...formData, internal_test_score: parseFloat(e.target.value) || 0 })}
                className="input-field font-mono text-xs"
              />
            </div>
          )}

          {config?.has_model_exam && (
            <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <label className="text-slate-300 font-medium block">
                Model Examination (Max: {config.model_exam_max})
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max={config.model_exam_max}
                value={formData.model_exam_score}
                onChange={(e) => setFormData({ ...formData, model_exam_score: parseFloat(e.target.value) || 0 })}
                className="input-field font-mono text-xs"
              />
            </div>
          )}

          {config?.has_assignment && (
            <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <label className="text-slate-300 font-medium block">
                Coursework Assignment (Max: {config.assignment_max})
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max={config.assignment_max}
                value={formData.assignment_score}
                onChange={(e) => setFormData({ ...formData, assignment_score: parseFloat(e.target.value) || 0 })}
                className="input-field font-mono text-xs"
              />
            </div>
          )}

          {config?.has_seminar && (
            <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <label className="text-slate-300 font-medium block">
                Student Seminar (Max: {config.seminar_max})
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max={config.seminar_max}
                value={formData.seminar_score}
                onChange={(e) => setFormData({ ...formData, seminar_score: parseFloat(e.target.value) || 0 })}
                className="input-field font-mono text-xs"
              />
            </div>
          )}

          {config?.has_project && (
            <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <label className="text-slate-300 font-medium block">
                Capstone / Project (Max: {config.project_max})
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max={config.project_max}
                value={formData.project_score}
                onChange={(e) => setFormData({ ...formData, project_score: parseFloat(e.target.value) || 0 })}
                className="input-field font-mono text-xs"
              />
            </div>
          )}

          {/* External Raw /100 */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/40">
            <label className="text-indigo-300 font-bold block">
              External Exam Raw Mark (Out of 100)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              max="100"
              value={formData.external_raw_100}
              onChange={(e) => setFormData({ ...formData, external_raw_100: parseFloat(e.target.value) || 0 })}
              className="input-field font-mono text-xs border-indigo-500/50"
            />
          </div>

        </div>

        <div className="space-y-1.5">
          <label className="text-slate-300 font-medium text-xs">Faculty Evaluation Remarks & Mentorship Notes</label>
          <input
            type="text"
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            className="input-field text-xs"
            placeholder="e.g. Good grasp of concepts; needs practice on Normalization"
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary !py-2.5 !px-6 text-xs flex items-center gap-2 shadow-glow-brand"
          >
            {saving ? 'Committing Marks...' : (
              <>
                <Save className="w-4 h-4" /> Save Student Marks Record
              </>
            )}
          </button>
        </div>
      </form>

    </div>
  );
}
