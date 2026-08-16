import React, { useState, useEffect } from 'react';
import { CalendarCheck, Save, CheckCircle2, UserCheck, XCircle, Clock } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/common/StatCard';

export default function ClassAttendance() {
  const toast = useToast();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [clsList, subjs, studs] = await Promise.all([
          api.getClasses(),
          api.getSubjects(),
          api.getUsers('student')
        ]);
        setClasses(clsList);
        setSubjects(subjs);
        setStudents(studs);

        if (clsList.length > 0) setSelectedClassId(clsList[0].id);
        if (subjs.length > 0) setSelectedSubjectId(subjs[0].id);

        // Initialize statuses as present
        const initStatus = {};
        studs.forEach(s => {
          initStatus[s.id] = 'present';
        });
        setStatuses(initStatus);
      } catch (err) {
        console.error("Attendance roll call load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleStatus = (studentId, status) => {
    setStatuses(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach(s => {
      updated[s.id] = status;
    });
    setStatuses(updated);
  };

  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const records = students.map(s => ({
        student_id: s.id,
        status: statuses[s.id] || 'present',
        remarks: statuses[s.id] === 'absent' ? 'Unexcused absence' : 'Lecture attendance'
      }));

      await api.recordBatchAttendance({
        class_id: selectedClassId,
        subject_id: selectedSubjectId,
        date: attendanceDate,
        records: records
      });
      setSuccess(true);
      toast.success(`Daily attendance for ${students.length} students recorded and synchronized!`);
    } catch (err) {
      toast.error(err.message || 'Failed to commit attendance');
    } finally {
      setSaving(false);
    }
  };


  if (loading) return <LoadingSpinner text="Loading class roll call register..." />;

  const presentCount = Object.values(statuses).filter(s => s === 'present').length;
  const absentCount = Object.values(statuses).filter(s => s === 'absent').length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <CalendarCheck className="w-7 h-7 text-emerald-400" />
          Class Roll Call Attendance Register
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Record and commit daily lecture attendance for class cohorts. Real-time sync with student risk models.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="glass-panel p-5 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Class Cohort</label>
          <select
            value={selectedClassId || ''}
            onChange={(e) => setSelectedClassId(parseInt(e.target.value))}
            className="input-field text-xs font-semibold"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-white">{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Subject</label>
          <select
            value={selectedSubjectId || ''}
            onChange={(e) => setSelectedSubjectId(parseInt(e.target.value))}
            className="input-field text-xs font-semibold"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-white">{s.code} — {s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Date</label>
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            className="input-field text-xs font-mono"
          />
        </div>
      </div>

      {/* Quick Action & Summary Bar */}
      <div className="glass-panel p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-400">Total: <strong className="text-white">{students.length}</strong></span>
          <span className="text-emerald-400">Present: <strong>{presentCount}</strong></span>
          <span className="text-rose-400">Absent: <strong>{absentCount}</strong></span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => markAll('present')}
            className="btn-secondary !py-1.5 !px-3 text-xs"
          >
            Mark All Present
          </button>
          <button
            type="button"
            onClick={() => markAll('absent')}
            className="btn-secondary !py-1.5 !px-3 text-xs text-rose-400 hover:text-rose-300"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Attendance registered successfully and computed into student academic records.</span>
        </div>
      )}

      {/* Student Roll Call Table */}
      <form onSubmit={handleSaveAttendance} className="glass-panel p-6 border border-slate-800 space-y-6">
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-850 text-slate-400 border-b border-slate-800 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Student Candidate</th>
                <th className="py-3.5 px-4">Enrollment ID</th>
                <th className="py-3.5 px-4 text-center">Attendance Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-slate-850/50 transition">
                  <td className="py-3.5 px-4 font-medium text-white flex items-center gap-3">
                    <img
                      src={st.avatar_url || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
                      alt=""
                      className="w-8 h-8 rounded-full border border-slate-700 object-cover"
                    />
                    <div>
                      <div className="font-bold text-white">{st.full_name}</div>
                      <div className="text-[11px] text-slate-400">{st.email}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {st.enrollment_number || 'STU-' + st.id}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                      <button
                        type="button"
                        onClick={() => toggleStatus(st.id, 'present')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          statuses[st.id] === 'present'
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStatus(st.id, 'absent')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          statuses[st.id] === 'absent'
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStatus(st.id, 'late')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          statuses[st.id] === 'late'
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Late
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary !py-2.5 !px-6 text-xs flex items-center gap-2 shadow-glow-brand"
          >
            {saving ? 'Saving...' : (
              <>
                <Save className="w-4 h-4" /> Commit Daily Roll Call
              </>
            )}
          </button>
        </div>
      </form>

    </div>
  );
}
