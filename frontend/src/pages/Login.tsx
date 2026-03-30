import { useState, FormEvent } from 'react';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';

interface LoginProps {
  onStudentLogin: (rollNumber: string, password: string) => void;
  onAdminLogin: (username: string, password: string) => void;
}

export default function Login({ onStudentLogin, onAdminLogin }: LoginProps) {
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  
  // Student login
  const [studentRoll, setStudentRoll] = useState('');
  const [studentPass, setStudentPass] = useState('');
  
  // Admin login
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  
  // Student registration
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    rollNumber: '',
    password: '',
    department: '',
    year: '1'
  });

  // Generate random admin credentials
  const generateRandomAdmin = () => {
    const adminId = `ADMIN${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const adminPassword = Math.random().toString(36).substring(2, 10);
    setAdminUser(adminId);
    setAdminPass(adminPassword);
  };

  const handleStudentLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (studentRoll && studentPass) {
      const registeredStudents = JSON.parse(localStorage.getItem('registeredStudents') || '[]');
      const foundStudent = registeredStudents.find((s: any) => s.rollNumber === studentRoll);
      
      if (foundStudent) {
        localStorage.setItem('currentStudent', JSON.stringify(foundStudent));
      }
      
      onStudentLogin(studentRoll, studentPass);
    }
  };

  const handleAdminLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (adminUser && adminPass) {
      onAdminLogin(adminUser, adminPass);
    }
  };

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(registerData).every(v => v)) {
      const registeredStudents = JSON.parse(localStorage.getItem('registeredStudents') || '[]');
      const newStudent = {
        id: registeredStudents.length + 1,
        name: `${registerData.firstName} ${registerData.lastName}`,
        rollNumber: registerData.rollNumber,
        email: registerData.email,
        department: registerData.department,
        year: registerData.year,
        attendance: 85,
        status: 'Active'
      };
      
      if (registeredStudents.find((s: any) => s.rollNumber === registerData.rollNumber)) {
        alert('Roll number already exists!');
        return;
      }
      
      registeredStudents.push(newStudent);
      localStorage.setItem('registeredStudents', JSON.stringify(registeredStudents));
      localStorage.setItem('currentStudent', JSON.stringify(newStudent));
      
      onStudentLogin(registerData.rollNumber, registerData.password);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${activeTab === 'student' ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-purple-500 to-purple-700'} p-4 transition-colors duration-300`}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-enter">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`w-14 h-14 ${activeTab === 'student' ? 'bg-blue-600' : 'bg-purple-600'} rounded-xl flex items-center justify-center shadow-lg transition-all duration-300`}>
              <span className="text-white font-bold text-2xl">SM</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Student</h1>
              <h1 className="text-3xl font-bold text-white">Management</h1>
            </div>
          </div>
          <p className="text-blue-100 text-sm font-medium">Professional Academic Portal</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab('student')}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'student'
                ? 'bg-white text-blue-600 shadow-lg scale-105'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'admin'
                ? 'bg-white text-purple-600 shadow-lg scale-105'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Content */}
        <div className="glass-effect rounded-2xl p-8 backdrop-blur-md bg-white/10 border border-white/20 card-shadow animate-flip">
          {/* Student Login */}
          {activeTab === 'student' && !showRegister && (
            <form onSubmit={handleStudentLogin} className="space-y-5">
              <h2 className="text-2xl font-bold text-white mb-6">Student Portal</h2>
              
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Roll Number</label>
                <input
                  type="text"
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  placeholder="Enter your roll number"
                  className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={studentPass}
                    onChange={(e) => setStudentPass(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-600 hover:text-gray-800 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <LogIn size={20} />
                Sign In
              </button>

              <button
                type="button"
                onClick={() => setShowRegister(true)}
                className="w-full text-white hover:text-blue-100 transition-colors flex items-center justify-center gap-2 mt-4 font-medium underline"
              >
                <UserPlus size={20} />
                Don't have account? Register
              </button>
            </form>
          )}

          {/* Student Register */}
          {activeTab === 'student' && showRegister && (
            <form onSubmit={handleRegister} className="space-y-4 max-h-96 overflow-y-auto pr-2">
              <h2 className="text-2xl font-bold text-white mb-6">Register as Student</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                    placeholder="First name"
                    className="w-full px-3 py-2 rounded-lg bg-white/90 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                    placeholder="Last name"
                    className="w-full px-3 py-2 rounded-lg bg-white/90 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1.5">Email</label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 rounded-lg bg-white/90 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5">Roll Number</label>
                  <input
                    type="text"
                    value={registerData.rollNumber}
                    onChange={(e) => setRegisterData({...registerData, rollNumber: e.target.value})}
                    placeholder="Roll no"
                    className="w-full px-3 py-2 rounded-lg bg-white/90 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5">Department</label>
                  <select
                    value={registerData.department}
                    onChange={(e) => setRegisterData({...registerData, department: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg bg-white/90 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium transition-all"
                    required
                  >
                    <option value="">Select</option>
                    <option value="CS">Computer Science</option>
                    <option value="EC">Electronics</option>
                    <option value="ME">Mechanical</option>
                    <option value="CE">Civil</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5">Year</label>
                  <select
                    value={registerData.year}
                    onChange={(e) => setRegisterData({...registerData, year: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg bg-white/90 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium transition-all"
                  >
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white mb-1.5">Password</label>
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    placeholder="Password"
                    className="w-full px-3 py-2 rounded-lg bg-white/90 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:from-green-600 hover:to-green-700 transition-all duration-300 mt-4 shadow-md hover:shadow-lg"
              >
                Register Now
              </button>

              <button
                type="button"
                onClick={() => setShowRegister(false)}
                className="w-full text-white hover:text-blue-100 transition-colors text-sm font-medium underline"
              >
                Back to Login
              </button>
            </form>
          )}

          {/* Admin Login */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <h2 className="text-2xl font-bold text-white mb-6">Admin Portal</h2>

              {/* Demo Credentials Box */}
              <div className="bg-yellow-400/20 border border-yellow-400/50 rounded-lg p-4 backdrop-blur-sm">
                <p className="text-xs text-yellow-100 mb-3 font-semibold">Demo Credentials:</p>
                <div className="space-y-2 text-sm font-mono text-yellow-50 bg-gray-900/40 p-3 rounded">
                  <p>ID: <span className="font-bold text-yellow-300">{adminUser || 'ADMIN1234'}</span></p>
                  <p>Password: <span className="font-bold text-yellow-300">{adminPass || 'demo1234'}</span></p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={generateRandomAdmin}
                className="w-full bg-yellow-500/30 hover:bg-yellow-500/40 border border-yellow-400/50 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 text-sm mb-2"
              >
                Generate Random Credentials
              </button>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Admin ID</label>
                <input
                  type="text"
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  placeholder="Enter admin ID"
                  className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-600 hover:text-gray-800 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <LogIn size={20} />
                Admin Sign In
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-white/70 text-xs mt-8 font-medium">
          © 2026 Student Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
