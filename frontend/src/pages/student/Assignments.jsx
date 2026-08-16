import React, { useState, useEffect } from 'react';
import { FileCheck, Clock, Send, Sparkles, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/common/StatCard';

export default function Assignments() {
  const { user } = useAuth();
  const toast = useToast();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    async function loadAssignments() {
      try {
        const data = await api.getAssignments();
        setAssignments(data);
        if (data.length > 0) setSelectedAssignment(data[0]);
      } catch (err) {
        console.error("Assignments load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAssignments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignment || !submissionText.trim()) return;
    setSubmitting(true);
    setSuccessMessage('');
    try {
      await api.submitAssignment({
        assignment_id: selectedAssignment.id,
        submission_text: submissionText,
        file_url: 'https://storage.portal.edu/submissions/doc_v1.pdf'
      });
      setSuccessMessage('Assignment submitted successfully! AI evaluation generated.');
      toast.success('Assignment submitted successfully with real-time AI rubric scoring!');
      setSubmissionText('');
    } catch (err) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) return <LoadingSpinner text="Fetching academic assignments..." />;

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">Course Assignments & AI Evaluation</h1>
        <p className="text-xs text-slate-400 mt-1">
          Submit coursework solutions, review faculty evaluations, and inspect real-time AI rubric feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 5 Cols: Assignment List */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Assigned Worksheets
          </h2>

          <div className="space-y-3">
            {assignments.map((item) => (
              <div
                key={item.id}
                onClick={() => { setSelectedAssignment(item); setSuccessMessage(''); }}
                className={`p-4 rounded-xl cursor-pointer border transition-all duration-150 ${
                  selectedAssignment?.id === item.id
                    ? 'bg-slate-900 border-brand-500 shadow-glow-brand'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-brand-400 font-mono">
                    Subject #{item.subject_id}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Max: {item.max_score} pts
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white mt-1.5">{item.title}</h3>

                <div className="flex items-center gap-1.5 text-[11px] text-amber-400 mt-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Due: {new Date(item.due_date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 7 Cols: Selected Assignment Details & Submission Box */}
        <div className="lg:col-span-7">
          {selectedAssignment ? (
            <div className="glass-panel p-6 sm:p-8 border border-slate-800 space-y-6">
              
              <div className="space-y-2 border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-brand-500/20 text-brand-400 text-xs font-bold font-mono">
                    Assignment #{selectedAssignment.id}
                  </span>
                  <span className="text-xs text-slate-400">
                    Due Date: {new Date(selectedAssignment.due_date).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">{selectedAssignment.title}</h2>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedAssignment.description}</p>
              </div>

              {successMessage && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Submission Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Your Solution / Code / Write-up</label>
                  <textarea
                    rows={6}
                    required
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Enter your technical explanation, SQL scripts, algorithm complexity, or solution text..."
                    className="input-field text-xs font-mono resize-none"
                  ></textarea>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-brand-400" />
                    <span>Attach Project Archive / Report (Optional)</span>
                  </div>
                  <button type="button" className="btn-secondary !py-1 !px-2.5 text-[11px]">
                    Browse File
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full !py-3 text-xs flex items-center justify-center gap-2 shadow-glow-brand"
                >
                  {submitting ? 'Submitting & Analyzing...' : (
                    <>
                      <Send className="w-4 h-4" /> Submit Assignment Solution
                    </>
                  )}
                </button>
              </form>

              {/* AI Feedback Simulation Preview */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Academic Feedback Assistant</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Submissions are automatically scanned for structural coverage, semantic adherence to syllabus rubrics, and conceptual clarity to provide immediate guidance prior to final teacher grading.
                </p>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-8 text-center text-slate-400 text-xs">
              Select an assignment to view details and submit work.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
