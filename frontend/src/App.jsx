import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Common Components
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';

// Public Pages
import Home from './pages/public/Home';
import Courses from './pages/public/Courses';
import CourseDetails from './pages/public/CourseDetails';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import MyCourses from './pages/student/MyCourses';
import StudentAssignments from './pages/student/Assignments';
import StudentAttendance from './pages/student/Attendance';
import StudentGrades from './pages/student/Grades';
import StudentProgress from './pages/student/Progress';
import ReportCardView from './pages/student/ReportCardView';

// Teacher Pages
import TeacherDashboard from './pages/teacher/Dashboard';
import SubjectManagement from './pages/teacher/SubjectManagement';
import AssessmentConfig from './pages/teacher/AssessmentConfig';
import GradeEntry from './pages/teacher/GradeEntry';
import ClassAttendance from './pages/teacher/ClassAttendance';
import ClassRoster from './pages/teacher/ClassRoster';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import AcademicSetup from './pages/admin/AcademicSetup';
import InstitutionalAnalytics from './pages/admin/InstitutionalAnalytics';
import RiskMonitor from './pages/admin/RiskMonitor';

function ProtectedLayout({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Authenticating Academic Profile...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role}/dashboard`} replace />;
  }

  return (
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 max-w-7xl overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Protected Routes */}
        <Route path="/student/dashboard" element={<ProtectedLayout allowedRoles={['student', 'admin']}><StudentDashboard /></ProtectedLayout>} />
        <Route path="/student/courses" element={<ProtectedLayout allowedRoles={['student', 'admin']}><MyCourses /></ProtectedLayout>} />
        <Route path="/student/assignments" element={<ProtectedLayout allowedRoles={['student', 'admin']}><StudentAssignments /></ProtectedLayout>} />
        <Route path="/student/attendance" element={<ProtectedLayout allowedRoles={['student', 'admin']}><StudentAttendance /></ProtectedLayout>} />
        <Route path="/student/grades" element={<ProtectedLayout allowedRoles={['student', 'admin']}><StudentGrades /></ProtectedLayout>} />
        <Route path="/student/progress" element={<ProtectedLayout allowedRoles={['student', 'admin']}><StudentProgress /></ProtectedLayout>} />
        <Route path="/student/report-card" element={<ProtectedLayout allowedRoles={['student', 'admin']}><ReportCardView /></ProtectedLayout>} />

        {/* Teacher Protected Routes */}
        <Route path="/teacher/dashboard" element={<ProtectedLayout allowedRoles={['teacher', 'admin']}><TeacherDashboard /></ProtectedLayout>} />
        <Route path="/teacher/subjects" element={<ProtectedLayout allowedRoles={['teacher', 'admin']}><SubjectManagement /></ProtectedLayout>} />
        <Route path="/teacher/assessment-config" element={<ProtectedLayout allowedRoles={['teacher', 'admin']}><AssessmentConfig /></ProtectedLayout>} />
        <Route path="/teacher/grade-entry" element={<ProtectedLayout allowedRoles={['teacher', 'admin']}><GradeEntry /></ProtectedLayout>} />
        <Route path="/teacher/attendance" element={<ProtectedLayout allowedRoles={['teacher', 'admin']}><ClassAttendance /></ProtectedLayout>} />
        <Route path="/teacher/class-roster" element={<ProtectedLayout allowedRoles={['teacher', 'admin']}><ClassRoster /></ProtectedLayout>} />

        {/* Admin Protected Routes */}
        <Route path="/admin/dashboard" element={<ProtectedLayout allowedRoles={['admin']}><AdminDashboard /></ProtectedLayout>} />
        <Route path="/admin/users" element={<ProtectedLayout allowedRoles={['admin']}><UserManagement /></ProtectedLayout>} />
        <Route path="/admin/academic-setup" element={<ProtectedLayout allowedRoles={['admin']}><AcademicSetup /></ProtectedLayout>} />
        <Route path="/admin/analytics" element={<ProtectedLayout allowedRoles={['admin']}><InstitutionalAnalytics /></ProtectedLayout>} />
        <Route path="/admin/risk-monitor" element={<ProtectedLayout allowedRoles={['admin']}><RiskMonitor /></ProtectedLayout>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </div>
  );
}
