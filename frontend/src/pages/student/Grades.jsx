import React, { useState, useEffect } from 'react';
import { Award, BookOpen, Calculator, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner, StatCard } from '../../components/common/StatCard';

export default function Grades() {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGrades() {
      if (!user) return;
      try {
        const [marksData, subjsData] = await Promise.all([
          api.getStudentMarks(user.id),
          api.getSubjects()
        ]);
        setMarks(marksData);
        setSubjects(subjsData);
      } catch (err) {
        console.error("Grades load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGrades();
  }, [user]);

  if (loading) return <LoadingSpinner text="Compiling academic transcript & mark calculations..." />;

  const getSubjectName = (subjId) => {
    const s = subjects.find(item => item.id === subjId);
    return s ? `${s.name} (${s.code})` : `Subject #${subjId}`;
  };

  const totalPoints = marks.reduce((acc, m) => acc + (m.grade_points || 0), 0);
  const gpa = marks.length > 0 ? (totalPoints / marks.length).toFixed(2) : '0.00';
  const passedCount = marks.filter(m => m.is_passed).length;

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">Academic Grades & Mark Computation</h1>
        <p className="text-xs text-slate-400 mt-1">
          Detailed breakdown of internal continuous assessments and external semester examinations conforming to the 25/75 conversion formula.
        </p>
      </div>

      {/* Conversion Standard Formula Notice */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-950/40 via-slate-900 to-indigo-950/40 border border-brand-500/30 flex items-start gap-3.5 text-xs text-slate-300">
        <Calculator className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="font-bold text-white flex items-center gap-2">
            Section 8 Academic Standard: Mark Calculation Architecture
          </h3>
          <p className="leading-relaxed">
            <strong className="text-brand-400 font-mono">Internal (/25)</strong>: Aggregated from subject-configured tests, model exam, assignments, and projects. <br/>
            <strong className="text-indigo-400 font-mono">Converted External (/75)</strong> = External Exam Raw (/100) &times; 0.75. <br/>
            <strong className="text-emerald-400 font-mono">Final Mark (/100)</strong> = Internal (/25) + Converted External (/75).
          </p>
        </div>
      </div>

      {/* GPA & Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Current Semester GPA"
          value={`${gpa} / 10.0`}
          subtitle="Cumulative Grade Point Average"
          icon={Award}
          color="brand"
        />

        <StatCard
          title="Subjects Passed"
          value={`${passedCount} / ${marks.length}`}
          subtitle="All Enrolled Subjects"
          icon={CheckCircle2}
          color={passedCount === marks.length ? "emerald" : "amber"}
        />

        <StatCard
          title="Evaluation Status"
          value="Finalized"
          subtitle="Certified by Faculty Council"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Comprehensive Marks Table */}
      <div className="glass-panel p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-400" />
            Official Subject Mark Transcript
          </h2>
          <span className="text-xs text-slate-400 font-mono">Semester 6</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-850 text-slate-400 border-b border-slate-800 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-2 text-center">Test</th>
                <th className="py-3.5 px-2 text-center">Model</th>
                <th className="py-3.5 px-2 text-center">Assign</th>
                <th className="py-3.5 px-2 text-center">Sem/Proj</th>
                <th className="py-3.5 px-3 text-center bg-brand-950/40 text-brand-300 font-bold">Internal (/25)</th>
                <th className="py-3.5 px-2 text-center">Ext. Raw (/100)</th>
                <th className="py-3.5 px-3 text-center bg-indigo-950/40 text-indigo-300 font-bold">Ext. Conv (/75)</th>
                <th className="py-3.5 px-4 text-center bg-slate-800 font-bold text-white">Final (/100)</th>
                <th className="py-3.5 px-3 text-center">Grade</th>
                <th className="py-3.5 px-3 text-center">Grade Pt</th>
                <th className="py-3.5 px-3 text-center">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {marks.map((m) => (
                <tr key={m.id} className="hover:bg-slate-850/50 transition">
                  <td className="py-3.5 px-4 font-sans font-medium text-white">
                    {getSubjectName(m.subject_id)}
                  </td>
                  <td className="py-3.5 px-2 text-center text-slate-300">{m.internal_test_score}</td>
                  <td className="py-3.5 px-2 text-center text-slate-300">{m.model_exam_score}</td>
                  <td className="py-3.5 px-2 text-center text-slate-300">{m.assignment_score}</td>
                  <td className="py-3.5 px-2 text-center text-slate-300">{((m.seminar_score || 0) + (m.project_score || 0)).toFixed(1)}</td>
                  
                  <td className="py-3.5 px-3 text-center font-bold text-brand-400 bg-brand-950/20 text-sm">
                    {m.internal_total_25}
                  </td>
                  
                  <td className="py-3.5 px-2 text-center text-slate-300">{m.external_raw_100}</td>
                  
                  <td className="py-3.5 px-3 text-center font-bold text-indigo-400 bg-indigo-950/20 text-sm">
                    {m.external_converted_75}
                  </td>
                  
                  <td className="py-3.5 px-4 text-center font-extrabold text-white text-base bg-slate-800/50">
                    {m.final_mark_100}
                  </td>
                  
                  <td className="py-3.5 px-3 text-center font-bold text-amber-400 text-sm">
                    {m.letter_grade}
                  </td>

                  <td className="py-3.5 px-3 text-center font-bold text-slate-300">
                    {m.grade_points}
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      m.is_passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {m.is_passed ? 'Pass' : 'Fail'}
                    </span>
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
