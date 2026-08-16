import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, Sparkles, UserCheck, ChevronRight, CheckCircle2, FileText, X } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner, RiskBadge } from '../../components/common/StatCard';
import PrintableReportCard from '../../components/reports/PrintableReportCard';

export default function RiskMonitor() {
  const toast = useToast();
  const [riskList, setRiskList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReportStudentId, setActiveReportStudentId] = useState(null);
  const [studentReportData, setStudentReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    async function loadRiskData() {
      try {
        const data = await api.getCampusRiskDetection();
        setRiskList(data);
      } catch (err) {
        console.error("Risk detection load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRiskData();
  }, []);

  const handleOpenReport = async (studentId) => {
    setActiveReportStudentId(studentId);
    setReportLoading(true);
    try {
      const data = await api.getStudentPerformanceReport(studentId);
      setStudentReportData(data);
    } catch (err) {
      toast.error("Failed to load student performance report");
    } finally {
      setReportLoading(false);
    }
  };

  const handleDispatchNotices = () => {
    toast.success(`Academic risk alert & intervention notices dispatched to faculty mentors for ${riskList.length} candidate(s).`);
  };

  if (loading) return <LoadingSpinner text="Scanning Campus Academic Risk Signals..." />;

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <AlertTriangle className="w-7 h-7 text-rose-400" />
          Campus Early Warning & Academic Risk Intervention
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Identifies students with low attendance (&lt;75%), deficit internal marks (&lt;50%), or declining exam trajectories for immediate mentor intervention.
        </p>
      </div>

      {/* Risk Alert Counter Banner */}
      <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black">
            {riskList.length}
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Active Intervention Triggers Flagged</h3>
            <p className="text-xs text-slate-300">
              Automated notifications transmitted to designated Class Mentors.
            </p>
          </div>
        </div>

        <button onClick={handleDispatchNotices} className="btn-primary !bg-rose-600 hover:!bg-rose-500 !py-2 text-xs">
          Dispatch Mentor Action Notices
        </button>
      </div>


      {/* Risk Candidates Table */}
      <div className="glass-panel p-6 border border-slate-800 space-y-4">
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-850 text-slate-400 border-b border-slate-800 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Student ID / Candidate</th>
                <th className="py-3.5 px-3 text-center">Attendance Rate</th>
                <th className="py-3.5 px-3 text-center">Average Score</th>
                <th className="py-3.5 px-3 text-center">AI Risk Level</th>
                <th className="py-3.5 px-4">Detected Weak Areas</th>
                <th className="py-3.5 px-4 text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {riskList.map((rs, idx) => (
                <tr key={idx} className="hover:bg-slate-850/50 transition">
                  <td className="py-3.5 px-4 font-bold text-white">
                    Student ID #{rs.student_id}
                  </td>

                  <td className="py-3.5 px-3 text-center font-mono">
                    <span className={`font-bold ${rs.overall_attendance_pct >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {rs.overall_attendance_pct}%
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-center font-mono font-bold text-white">
                    {rs.average_marks_pct}%
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <RiskBadge level={rs.risk_level} score={rs.risk_score} />
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    {(rs.weak_subjects_json || []).map((w, wIdx) => (
                      <span key={wIdx} className="inline-block px-2 py-0.5 rounded bg-slate-900 text-amber-400 text-[11px] font-mono mr-1.5 mb-1 border border-slate-800">
                        {w.subject_code || w.subject_name}
                      </span>
                    ))}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenReport(rs.student_id)}
                      className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5 ml-auto"
                    >
                      <FileText className="w-3.5 h-3.5 text-brand-400" />
                      <span>Audit Report</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Report Viewer */}
      {activeReportStudentId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-5xl w-full my-8 bg-slate-950 border border-slate-800 rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => { setActiveReportStudentId(null); setStudentReportData(null); }}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {reportLoading ? (
              <LoadingSpinner text="Generating Official Performance Report..." />
            ) : (
              <PrintableReportCard reportData={studentReportData} />
            )}
          </div>
        </div>
      )}

    </div>
  );
}
