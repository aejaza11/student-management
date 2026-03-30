import { useState, useEffect, FormEvent } from 'react';
import { BookOpen, BarChart3, AlertCircle, Mail, Phone, MapPin, Edit2, Lock, Settings, LogOut, BookMarked, Clock, CheckCircle, AlertTriangle, Award, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import Modal, { FormField } from '../components/Modal';

interface StudentData {
  name: string;
  rollNumber: string;
  email: string;
  department: string;
  year: string;
  cgpa: number;
}

interface Subject {
  id: number;
  name: string;
  code: string;
  attendance: number;
  faculty: string;
  credits: number;
}

interface Mark {
  subject: string;
  internal: number;
  external: number;
  total: number;
}

interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  status: 'Submitted' | 'Pending';
  scoredDate?: string;
}

export default function StudentDashboard() {
  const [student, setStudent] = useState<StudentData>({
    name: 'Aarav Kumar',
    rollNumber: '001',
    email: 'aarav@college.edu',
    department: 'Computer Science',
    year: '3',
    cgpa: 8.45
  });

  const [subjects] = useState<Subject[]>([
    { id: 1, name: 'Data Structures', code: 'CS201', attendance: 92, faculty: 'Dr. Sharma', credits: 3 },
    { id: 2, name: 'DBMS', code: 'CS202', attendance: 88, faculty: 'Prof. Patel', credits: 4 },
    { id: 3, name: 'Web Development', code: 'CS203', attendance: 95, faculty: 'Dr. Verma', credits: 3 },
    { id: 4, name: 'AI & ML', code: 'CS204', attendance: 70, faculty: 'Prof. Singh', credits: 4 },
  ]);

  const [marks] = useState<Mark[]>([
    { subject: 'Data Structures', internal: 35, external: 58, total: 93 },
    { subject: 'DBMS', internal: 32, external: 55, total: 87 },
    { subject: 'Web Development', internal: 38, external: 60, total: 98 },
    { subject: 'AI & ML', internal: 30, external: 52, total: 82 },
  ]);

  const [assignments] = useState<Assignment[]>([
    { id: 1, title: 'Build REST API', dueDate: '2026-04-10', status: 'Submitted', scoredDate: '2026-04-05' },
    { id: 2, title: 'Database Design Project', dueDate: '2026-04-15', status: 'Pending' },
    { id: 3, title: 'Machine Learning Model', dueDate: '2026-04-20', status: 'Pending' },
  ]);

  useEffect(() => {
    // Load current student data from localStorage if available
    const currentStudentData = localStorage.getItem('currentStudent');
    if (currentStudentData) {
      const studentData = JSON.parse(currentStudentData);
      setStudent(prev => ({
        ...prev,
        name: studentData.name,
        rollNumber: studentData.rollNumber,
        email: studentData.email,
        department: studentData.department,
        year: studentData.year
      }));
    }
  }, []);

  const [announcements] = useState([
    { id: 1, title: 'Mid-Semester Exams Start', date: '2026-04-01', type: 'exam' },
    { id: 2, title: 'Updated Assignment Submission Policy', date: '2026-03-28', type: 'notice' },
    { id: 3, title: 'New Lab Equipment Available', date: '2026-03-25', type: 'announcement' },
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'marks' | 'assignments' | 'profile' | 'settings'>('overview');
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(student);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  const avgAttendance = Math.round(subjects.reduce((sum, s) => sum + s.attendance, 0) / subjects.length);
  const lowAttendanceCount = subjects.filter(s => s.attendance < 75).length;
  const pendingAssignments = assignments.filter(a => a.status === 'Pending').length;
  const avgMarks = Math.round(marks.reduce((sum, m) => sum + m.total, 0) / marks.length);

  const handleProfileUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStudent(editFormData);
    toast.success('Profile updated successfully');
    setEditProfileOpen(false);
  };

  const handlePasswordChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password changed successfully');
    setChangePasswordOpen(false);
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header with Student Info */}
      <div className="glass-effect rounded-xl p-6 card-shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{student.name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{student.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">{student.department} • Year {student.year}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className="btn-secondary text-sm"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="btn-secondary text-sm"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'overview', label: '📊 Overview', icon: BarChart3 },
          { id: 'attendance', label: '📅 Attendance', icon: Calendar },
          { id: 'marks', label: '📈 Marks', icon: Award },
          { id: 'assignments', label: '📝 Assignments', icon: BookMarked },
          { id: 'profile', label: '👤 Profile', icon: Mail },
          { id: 'settings', label: '⚙️ Settings', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { title: 'Total Subjects', value: subjects.length, icon: BookOpen, color: 'from-blue-500 to-blue-600' },
              { title: 'Avg Attendance', value: `${avgAttendance}%`, icon: Calendar, color: 'from-green-500 to-green-600' },
              { title: 'Pending Tasks', value: pendingAssignments, icon: AlertTriangle, color: 'from-orange-500 to-orange-600' },
              { title: 'CGPA', value: student.cgpa.toFixed(2), icon: Award, color: 'from-purple-500 to-purple-600' }
            ].map((stat, idx) => (
              <div key={idx} className="glass-effect rounded-xl p-6 card-shadow hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subjects & Announcements Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrolled Subjects */}
            <div className="glass-effect rounded-xl p-6 card-shadow">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📚 Enrolled Subjects</h2>
              <div className="space-y-3">
                {subjects.map(subject => (
                  <div key={subject.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{subject.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{subject.code} • {subject.faculty}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${subject.attendance >= 75 ? 'text-green-600' : 'text-red-600'}`}>{subject.attendance}%</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{subject.credits} Credits</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements */}
            <div className="glass-effect rounded-xl p-6 card-shadow">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📢 Announcements</h2>
              <div className="space-y-3">
                {announcements.map(announce => (
                  <div key={announce.id} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border-l-4 border-blue-500">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{announce.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{announce.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="glass-effect rounded-xl p-6 card-shadow">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">📅 Attendance Overview</h2>
          <div className="space-y-4">
            {subjects.map(subject => (
              <div key={subject.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{subject.name} ({subject.code})</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{subject.faculty}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${subject.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${subject.attendance}%` }}
                    />
                  </div>
                  <div className={`text-lg font-bold w-16 text-right ${subject.attendance >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                    {subject.attendance}%
                  </div>
                  {subject.attendance < 75 && (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>Overall Attendance: {avgAttendance}%</strong> • {lowAttendanceCount > 0 ? `${lowAttendanceCount} subjects below 75%` : 'All subjects meeting requirements'}
            </p>
          </div>
        </div>
      )}

      {/* Marks Tab */}
      {activeTab === 'marks' && (
        <div className="glass-effect rounded-xl p-6 card-shadow">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">📈 Academic Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Subject</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Internal</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">External</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Total</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Grade</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((mark, idx) => (
                  <tr key={idx} className={`border-b border-gray-200 dark:border-gray-700 ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900/50' : 'bg-gray-50/50 dark:bg-gray-800/30'}`}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{mark.subject}</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">{mark.internal}/40</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">{mark.external}/60</td>
                    <td className="px-4 py-3 text-center text-sm font-bold text-gray-900 dark:text-white">{mark.total}/100</td>
                    <td className="px-4 py-3 text-center text-sm">
                      <span className={`px-2 py-1 rounded font-semibold text-xs ${
                        mark.total >= 85 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        mark.total >= 70 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}>
                        {mark.total >= 85 ? 'A' : mark.total >= 70 ? 'B' : 'C'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Average Marks</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{avgMarks}/100</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 text-sm">CGPA</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{student.cgpa.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Performance</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">Excellent</p>
            </div>
          </div>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="glass-effect rounded-xl p-6 card-shadow">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">📝 Assignments</h2>
          <div className="space-y-3">
            {assignments.map(assign => (
              <div key={assign.id} className={`p-4 rounded-lg border-l-4 ${
                assign.status === 'Submitted'
                  ? 'bg-green-50 dark:bg-green-900/30 border-green-500'
                  : 'bg-orange-50 dark:bg-orange-900/30 border-orange-500'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{assign.title}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">📅 Due: {assign.dueDate}</span>
                      {assign.scoredDate && <span className="text-gray-600 dark:text-gray-400">✅ Submitted: {assign.scoredDate}</span>}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                    assign.status === 'Submitted'
                      ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                  }`}>
                    {assign.status === 'Submitted' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    {assign.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="glass-effect rounded-xl p-6 card-shadow">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">👤 My Profile</h2>
          <div className="space-y-6">
            {/* Profile Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Full Name', value: student.name, icon: Mail },
                { label: 'Roll Number', value: student.rollNumber, icon: BookOpen },
                { label: 'Email', value: student.email, icon: Mail },
                { label: 'Department', value: student.department, icon: BookOpen },
                { label: 'Year', value: `Year ${student.year}`, icon: Calendar },
                { label: 'CGPA', value: student.cgpa.toFixed(2), icon: Award }
              ].map((field, idx) => (
                <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{field.label}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{field.value}</p>
                </div>
              ))}
            </div>

            {/* Last Login */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <strong>Last Login:</strong> Today at 10:30 AM
              </p>
            </div>

            <button
              onClick={() => setEditProfileOpen(true)}
              className="btn-primary"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="glass-effect rounded-xl p-6 card-shadow space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">⚙️ Settings</h2>
          
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark theme</p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded" />
            </div>
          </div>

          <button
            onClick={() => setChangePasswordOpen(true)}
            className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-between"
          >
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Change Password</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Update your security</p>
            </div>
            <Lock className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full btn-danger justify-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editProfileOpen}
        title="Edit Profile"
        onClose={() => setEditProfileOpen(false)}
        onSubmit={handleProfileUpdate}
        submitText="Save Changes"
      >
        <FormField
          label="Full Name"
          value={editFormData.name}
          onChange={(value) => setEditFormData({...editFormData, name: value})}
          required
        />
        <FormField
          label="Email"
          type="email"
          value={editFormData.email}
          onChange={(value) => setEditFormData({...editFormData, email: value})}
          required
        />
        <FormField
          label="Department"
          value={editFormData.department}
          onChange={(value) => setEditFormData({...editFormData, department: value})}
          required
        />
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={changePasswordOpen}
        title="Change Password"
        onClose={() => setChangePasswordOpen(false)}
        onSubmit={handlePasswordChange}
        submitText="Update Password"
      >
        <FormField
          label="Current Password"
          type="password"
          placeholder="Enter current password"
          value={passwordData.current}
          onChange={(value) => setPasswordData({...passwordData, current: value})}
          required
        />
        <FormField
          label="New Password"
          type="password"
          placeholder="Enter new password"
          value={passwordData.new}
          onChange={(value) => setPasswordData({...passwordData, new: value})}
          required
        />
        <FormField
          label="Confirm Password"
          type="password"
          placeholder="Confirm new password"
          value={passwordData.confirm}
          onChange={(value) => setPasswordData({...passwordData, confirm: value})}
          required
        />
      </Modal>
    </div>
  );
}
