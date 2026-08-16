const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('eduvision_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(errorData.detail || `HTTP Error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error.message);
    throw error;
  }
}

export const api = {
  // Auth
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getCurrentUser: () => request('/auth/me'),

  // Courses
  getCourses: (params = '') => request(`/courses/${params ? `?${params}` : ''}`),
  getCourse: (id) => request(`/courses/${id}`),
  createCourse: (data) => request('/courses/', { method: 'POST', body: JSON.stringify(data) }),

  // Classes & Students
  getClasses: () => request('/classes/'),
  getClassStudents: (classId) => request(`/classes/${classId}/students`),

  // Subjects & Assessment Config
  getSubjects: (params = '') => request(`/subjects/${params ? `?${params}` : ''}`),
  getSubject: (id) => request(`/subjects/${id}`),
  getAssessmentConfig: (subjectId) => request(`/subjects/${subjectId}/assessment-config`),
  updateAssessmentConfig: (subjectId, data) => request(`/subjects/${subjectId}/assessment-config`, { method: 'PUT', body: JSON.stringify(data) }),

  // Assignments
  getAssignments: (params = '') => request(`/assignments/${params ? `?${params}` : ''}`),
  createAssignment: (data) => request('/assignments/', { method: 'POST', body: JSON.stringify(data) }),
  getAssignmentSubmissions: (assignmentId) => request(`/assignments/${assignmentId}/submissions`),
  submitAssignment: (data) => request('/assignments/submit', { method: 'POST', body: JSON.stringify(data) }),
  gradeSubmission: (submissionId, data) => request(`/assignments/submissions/${submissionId}/grade`, { method: 'PUT', body: JSON.stringify(data) }),

  // Attendance
  recordBatchAttendance: (data) => request('/attendance/batch', { method: 'POST', body: JSON.stringify(data) }),
  getStudentAttendance: (studentId, subjectId) => request(`/attendance/student/${studentId}${subjectId ? `?subject_id=${subjectId}` : ''}`),
  getStudentAttendanceSummary: (studentId) => request(`/attendance/student/${studentId}/summary`),

  // Exams & Marks (25/75/100)
  getExams: (params = '') => request(`/exams-grades/exams${params ? `?${params}` : ''}`),
  createExam: (data) => request('/exams-grades/exams', { method: 'POST', body: JSON.stringify(data) }),
  enterStudentMarks: (data) => request('/exams-grades/marks', { method: 'POST', body: JSON.stringify(data) }),
  getStudentMarks: (studentId) => request(`/exams-grades/student/${studentId}`),
  getSubjectMarks: (subjectId) => request(`/exams-grades/subject/${subjectId}`),

  // AI Academic Intelligence
  getStudentAIAnalysis: (studentId) => request(`/ai/student/${studentId}`),
  getClassAIOverview: (classId) => request(`/ai/class/${classId}`),
  getStudyTips: () => request('/ai/study-tips'),
  getCampusRiskDetection: () => request('/ai/risk-detection'),

  // Performance Reports
  getStudentPerformanceReport: (studentId) => request(`/reports/student/${studentId}`),
  getUsers: (role) => request(`/users/${role ? `?role=${role}` : ''}`),
  createUser: (data) => request('/users/', { method: 'POST', body: JSON.stringify(data) }),
  createClass: (data) => request('/classes/', { method: 'POST', body: JSON.stringify(data) }),
  createSubject: (data) => request('/subjects/', { method: 'POST', body: JSON.stringify(data) }),
  enrollCourse: (courseId) => request(`/courses/${courseId}/enroll`, { method: 'POST' }),
};
