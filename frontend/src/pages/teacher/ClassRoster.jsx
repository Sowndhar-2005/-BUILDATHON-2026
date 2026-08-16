import React, { useState, useEffect } from 'react';
import { Users, FileText, Eye, AlertTriangle, Sparkles, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner, RiskBadge } from '../../components/common/StatCard';
import PrintableReportCard from '../../components/reports/PrintableReportCard';

export default function ClassRoster() {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [analyses, setAnalyses] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeReportStudentId, setActiveReportStudentId] = useState(null);
  const [studentReportData, setStudentReportData] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    async function loadRoster() {
      try {
        const studs = await api.getUsers('student');
        setStudents(studs);

        // Fetch AI analyses for each student
        const map = {};
        for (const s of studs) {
          try {
            const ana = await api.getStudentAIAnalysis(s.id);
            map[s.id] = ana;
          } catch (e) {
            console.error(`AI analysis error for student ${s.id}:`, e);
          }
        }
        setAnalyses(map);
      } catch (err) {
        console.error("Failed to load roster:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRoster();
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


  if (loading) return <LoadingSpinner text="Compiling Class Mentorship Registry..." />;

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">Class Mentorship & Student Welfare Registry</h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor student attendance compliance, holistic academic performance, and trigger targeted AI intervention plans.
        </p>
      </div>

      {/* Roster Table */}
      <div className="glass-panel p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-400" />
            Class of 2026 — Section A Roster ({students.length} Students)
          </h2>
          <span className="text-xs text-slate-400 font-mono">Real-Time Academic Telemetry</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-850 text-slate-400 border-b border-slate-800 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-3">Enrollment ID</th>
                <th className="py-3.5 px-3 text-center">Attendance %</th>
                <th className="py-3.5 px-3 text-center">Average Score</th>
                <th className="py-3.5 px-3 text-center">Risk Level</th>
                <th className="py-3.5 px-3 text-center">Trend Trajectory</th>
                <th className="py-3.5 px-4 text-right">Academic Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {students.map((st) => {
                const ana = analyses[st.id];
                return (
                  <tr key={st.id} className="hover:bg-slate-850/50 transition">
                    <td className="py-3.5 px-4 font-medium text-white flex items-center gap-3">
                      <img
                        src={st.avatar_url || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
                        alt=""
                        className="w-9 h-9 rounded-full border border-slate-700 object-cover"
                      />
                      <div>
                        <div className="font-bold text-white text-sm">{st.full_name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{st.email}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-300">
                      {st.enrollment_number || 'STU-' + st.id}
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono">
                      <span className={`font-bold ${
                        (ana?.overall_attendance_pct || 85) >= 75 ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {ana?.overall_attendance_pct || 85}%
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-bold text-white text-sm">
                      {ana?.average_marks_pct || 75}%
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <RiskBadge level={ana?.risk_level} score={ana?.risk_score} />
                    </td>

                    <td className="py-3.5 px-3 text-center capitalize font-semibold text-indigo-400">
                      {ana?.trend_status || 'stable'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenReport(st.id)}
                        className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5 ml-auto"
                      >
                        <FileText className="w-3.5 h-3.5 text-brand-400" />
                        <span>View Transcript & AI</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
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
