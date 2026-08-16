import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'student',
    department: 'Computer Science & Engineering',
    enrollment_number: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      await login(formData.email, formData.password);
      navigate(`/${formData.role}/dashboard`);
    } catch (err) {
      setError(err.message || 'Registration failed. Please review your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-12 px-4 sm:px-6">
      <div className="glass-panel p-8 border border-slate-800 space-y-6 shadow-2xl">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-brand-500/25">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Create Academic Account</h1>
          <p className="text-xs text-slate-400">Join EduVision AI Portal as a Student or Faculty Member</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          
          {/* Role selector tabs */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Academic Role</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'student' })}
                className={`py-2 rounded-xl font-bold transition ${
                  formData.role === 'student'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'teacher' })}
                className={`py-2 rounded-xl font-bold transition ${
                  formData.role === 'teacher'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                👨‍🏫 Faculty / Teacher
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Full Name</label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="input-field text-xs"
              placeholder="e.g. Rahul Verma"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Institutional Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field text-xs"
              placeholder="name@portal.edu"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">
                {formData.role === 'student' ? 'Enrollment ID' : 'Employee ID'}
              </label>
              <input
                type="text"
                required
                value={formData.enrollment_number}
                onChange={(e) => setFormData({ ...formData, enrollment_number: e.target.value })}
                className="input-field text-xs font-mono"
                placeholder={formData.role === 'student' ? 'e.g. 22CS014' : 'e.g. FAC-102'}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field text-xs"
                placeholder="+91 98765 00000"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="input-field text-xs font-mono"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full !py-3 text-xs flex items-center justify-center gap-2 shadow-glow-brand"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating Profile...
              </span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Complete Registration
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Already registered?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}
