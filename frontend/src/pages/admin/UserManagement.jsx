import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, CheckCircle2, Search, Filter } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/common/StatCard';

export default function UserManagement() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    password: 'User@123',
    role: 'student',
    department: 'Computer Science & Engineering',
    enrollment_number: '',
    phone: ''
  });

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      console.error("User directory load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.createUser(newUser);
      await loadUsers();
      setIsModalOpen(false);
      toast.success(`User account for ${newUser.full_name} successfully provisioned!`);
      setNewUser({
        full_name: '',
        email: '',
        password: 'User@123',
        role: 'student',
        department: 'Computer Science & Engineering',
        enrollment_number: '',
        phone: ''
      });
    } catch (err) {
      toast.error(err.message || 'Failed to create user');
    }
  };


  if (loading) return <LoadingSpinner text="Loading campus user directory..." />;

  const filteredUsers = users.filter(u => {
    const matchesRole = selectedRole === 'all' || u.role === selectedRole;
    const matchesSearch = u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.department?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Campus User Directory & Role Governance</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage student enrollments, faculty appointments, and administrative access privileges.
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary !py-2 text-xs flex items-center gap-1.5 shadow-glow-brand">
          <UserPlus className="w-3.5 h-3.5" /> Provision New User
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, department..."
            className="input-field !pl-10 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'student', 'teacher', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                selectedRole === r
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Table */}
      <div className="glass-panel p-6 border border-slate-800 space-y-4">
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-850 text-slate-400 border-b border-slate-800 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-3">Role</th>
                <th className="py-3.5 px-3">ID / Enrollment</th>
                <th className="py-3.5 px-4">Department / Specialization</th>
                <th className="py-3.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-850/50 transition">
                  <td className="py-3.5 px-4 font-medium text-white flex items-center gap-3">
                    <img
                      src={u.avatar_url || "https://api.dicebear.com/7.x/bottts/svg?seed=user"}
                      alt=""
                      className="w-9 h-9 rounded-full border border-slate-700 object-cover"
                    />
                    <div>
                      <div className="font-bold text-white text-sm">{u.full_name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${
                      u.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                      u.role === 'teacher' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
                      'bg-brand-500/20 text-brand-300 border-brand-500/30'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 font-mono text-slate-300">
                    {u.enrollment_number || `USR-${String(u.id).padStart(4, '0')}`}
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    <div>{u.department || "Academic Division"}</div>
                    {u.specialization && <div className="text-[10px] text-slate-500">{u.specialization}</div>}
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Provisioning Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel p-6 border border-slate-800 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-brand-400" /> Provision Academic User
            </h2>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  placeholder="e.g. Anand Mahindra"
                  className="input-field text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="user@portal.edu"
                  className="input-field text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="input-field text-xs font-semibold"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Faculty / Teacher</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">ID Number</label>
                  <input
                    type="text"
                    required
                    value={newUser.enrollment_number}
                    onChange={(e) => setNewUser({ ...newUser, enrollment_number: e.target.value })}
                    placeholder="22CS999"
                    className="input-field text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Department</label>
                <input
                  type="text"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  className="input-field text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary !py-2 !px-4 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary !py-2 !px-4 text-xs"
                >
                  Save & Provision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
