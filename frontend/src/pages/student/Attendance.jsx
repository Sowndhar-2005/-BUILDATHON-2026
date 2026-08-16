import React, { useState, useEffect } from 'react';
import { CalendarCheck, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner, StatCard } from '../../components/common/StatCard';

export default function Attendance() {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAttendance() {
      if (!user) return;
      try {
        const [records, sum] = await Promise.all([
          api.getStudentAttendance(user.id),
          api.getStudentAttendanceSummary(user.id)
        ]);
        setAttendanceRecords(records);
        setSummary(sum);
      } catch (err) {
        console.error("Attendance fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAttendance();
  }, [user]);

  if (loading) return <LoadingSpinner text="Computing attendance registers..." />;

  const isBelowThreshold = summary?.attendance_percentage < 75.0;

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">Attendance Tracking & Regulatory Compliance</h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor your cumulative and subject-level lecture participation. Maintain &ge; 75% attendance for semester examination eligibility.
        </p>
      </div>

      {/* Warning banner if < 75% */}
      {isBelowThreshold && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-start gap-3 text-xs">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-rose-300">Regulatory Attendance Warning (&lt;75%)</h3>
            <p className="text-slate-300 leading-relaxed">
              Your overall attendance is currently at <strong className="text-rose-400">{summary?.attendance_percentage}%</strong>. You require <strong>{Math.ceil((0.75 * (summary?.total_classes || 20) - (summary?.present_classes || 15)))}</strong> consecutive attended lectures to restore full regular eligibility.
            </p>
          </div>
        </div>
      )}

      {/* Stats KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Overall Attendance"
          value={`${summary?.attendance_percentage || 0}%`}
          subtitle={!isBelowThreshold ? "Compliant with University Policy" : "Eligibility Condonation Required"}
          icon={CalendarCheck}
          color={!isBelowThreshold ? "emerald" : "rose"}
        />

        <StatCard
          title="Total Classes Held"
          value={summary?.total_classes || 0}
          subtitle="Current Academic Session"
          icon={Clock}
          color="brand"
        />

        <StatCard
          title="Present Sessions"
          value={summary?.present_classes || 0}
          subtitle="Recorded in Register"
          icon={CheckCircle2}
          color="emerald"
        />

        <StatCard
          title="Absent Sessions"
          value={summary?.absent_classes || 0}
          subtitle="Missed Roll Calls"
          icon={XCircle}
          color="amber"
        />
      </div>

      {/* Attendance History Table */}
      <div className="glass-panel p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-brand-400" />
            Recent Roll Call Log
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {attendanceRecords.length} Sessions Logged
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-850 text-slate-400 border-b border-slate-800 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Subject Reference</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {attendanceRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-850/50 transition">
                  <td className="py-3 px-4 text-slate-200 font-sans">
                    {new Date(rec.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-3 px-4 text-brand-400">
                    Subject #{rec.subject_id}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      rec.status === 'present' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      rec.status === 'late' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400 font-sans">
                    {rec.remarks || 'Regular lecture session'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
