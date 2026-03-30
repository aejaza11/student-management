import { useState, useEffect } from 'react';
import { Plus, AlertCircle, TrendingUp, Users, UserPlus, AlertTriangle, BookOpen, Eye, Trash2, Edit2, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import Table from '../components/Table';
import Modal, { FormField } from '../components/Modal';

interface Student {
  id: string | number;
  name: string;
  rollNumber: string;
  email: string;
  department: string;
  year: string;
  attendance: number;
  status: 'Active' | 'Inactive';
}

export default function AdminDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    department: '',
    year: '1',
    attendance: '85'
  });

  // Mock data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Get registered students from localStorage
      const registeredStudents = JSON.parse(localStorage.getItem('registeredStudents') || '[]');
      
      // Mock default students
      const defaultStudents = [
        { id: 1, name: 'Aarav Kumar', rollNumber: '001', email: 'aarav@college.edu', department: 'CS', year: '3', attendance: 92, status: 'Active' as const },
        { id: 2, name: 'Priya Singh', rollNumber: '002', email: 'priya@college.edu', department: 'CS', year: '2', attendance: 88, status: 'Active' as const },
        { id: 3, name: 'Rahul Verma', rollNumber: '003', email: 'rahul@college.edu', department: 'EC', year: '3', attendance: 65, status: 'Inactive' as const },
        { id: 4, name: 'Sneha Patel', rollNumber: '004', email: 'sneha@college.edu', department: 'ME', year: '1', attendance: 78, status: 'Active' as const },
        { id: 5, name: 'Amit Sharma', rollNumber: '005', email: 'amit@college.edu', department: 'CE', year: '4', attendance: 71, status: 'Active' as const },
        { id: 6, name: 'Divya Nair', rollNumber: '006', email: 'divya@college.edu', department: 'CS', year: '1', attendance: 95, status: 'Active' as const },
      ];
      
      // Combine registered students with defaults
      const allStudents = [...defaultStudents, ...registeredStudents];
      setStudents(allStudents);
      setLoading(false);
    }, 500);
  }, []);

  const filteredStudents = students
    .filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.includes(searchTerm) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'attendance') return b.attendance - a.attendance;
      return 0;
    });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddClick = () => {
    setEditingStudent(null);
    setFormData({ name: '', rollNumber: '', email: '', department: '', year: '1', attendance: '85' });
    setIsModalOpen(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      rollNumber: student.rollNumber,
      email: student.email,
      department: student.department,
      year: student.year,
      attendance: String(student.attendance)
    });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (deleteConfirm) {
      setStudents(students.filter(s => s.id !== deleteConfirm));
      toast.success('Student deleted successfully');
      setDeleteConfirm(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingStudent) {
      setStudents(students.map(s => s.id === editingStudent.id 
        ? { ...s, ...formData, attendance: parseInt(formData.attendance) }
        : s
      ));
      toast.success('Student updated successfully');
    } else {
      const newStudent: Student = {
        id: students.length + 1,
        ...formData,
        attendance: parseInt(formData.attendance),
        status: 'Active'
      };
      setStudents([...students, newStudent]);
      toast.success('Student added successfully');
    }
    setIsModalOpen(false);
  };

  // Dashboard stats
  const totalStudents = students.length;
  const newAdmissions = 3;
  const avgAttendance = Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length);
  const lowAttendance = students.filter(s => s.attendance < 75).length;

  return (
    <div className="space-y-6">
      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="glass-effect rounded-xl p-6 card-shadow hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalStudents}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">↑ Active enrollment</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* New Admissions */}
        <div className="glass-effect rounded-xl p-6 card-shadow hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">New Admissions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{newAdmissions}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">Today</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Attendance Average */}
        <div className="glass-effect rounded-xl p-6 card-shadow hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Avg Attendance</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{avgAttendance}%</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">All students</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Low Attendance Warning */}
        <div className="glass-effect rounded-xl p-6 card-shadow hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Low Attendance</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{lowAttendance}</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">Below 75%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Student Management Section */}
      <div className="glass-effect rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Student Management</h2>
          <button
            onClick={handleAddClick}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        </div>

        {/* Search and Sort */}
        <div className="flex gap-4 mb-6 flex-col sm:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, roll, or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field pl-10"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="name">Sort by Name</option>
            <option value="attendance">Sort by Attendance</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading students...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Roll No</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Department</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Year</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Attendance</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student, idx) => (
                    <tr
                      key={student.id}
                      className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                        idx % 2 === 0 ? 'bg-white dark:bg-gray-900/50' : 'bg-gray-50/50 dark:bg-gray-800/30'
                      }`}
                    >
                      <td className="px-6 py-3 text-sm text-gray-900 dark:text-white font-medium">{student.name}</td>
                      <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{student.rollNumber}</td>
                      <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{student.email}</td>
                      <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">{student.department}</td>
                      <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">Year {student.year}</td>
                      <td className="px-6 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`text-sm font-semibold ${student.attendance >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                            {student.attendance}%
                          </div>
                          <div className="w-12 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${student.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ width: `${student.attendance}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          student.status === 'Active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(String(student.id))}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                          <button
                            className="p-1 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded transition-colors"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4 text-purple-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {paginatedStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-50 transition-colors"
                >
                  <ChevronUp className="w-4 h-4 rotate-180" />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-50 transition-colors"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative glass-effect rounded-2xl p-6 w-full max-w-sm card-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Delete Student?</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Student Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        submitText={editingStudent ? 'Update' : 'Add Student'}
      >
        <FormField
          label="Full Name"
          placeholder="Enter student name"
          value={formData.name}
          onChange={(value) => setFormData({...formData, name: value})}
          required
        />
        <FormField
          label="Roll Number"
          placeholder="Enter roll number"
          value={formData.rollNumber}
          onChange={(value) => setFormData({...formData, rollNumber: value})}
          required
        />
        <FormField
          label="Email"
          type="email"
          placeholder="student@college.edu"
          value={formData.email}
          onChange={(value) => setFormData({...formData, email: value})}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="input-field"
              required
            >
              <option value="">Select Department</option>
              <option value="CS">Computer Science</option>
              <option value="EC">Electronics</option>
              <option value="ME">Mechanical</option>
              <option value="CE">Civil</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Year
            </label>
            <select
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
              className="input-field"
            >
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
          </div>
        </div>
        <FormField
          label="Attendance %"
          type="number"
          placeholder="85"
          value={formData.attendance}
          onChange={(value) => setFormData({...formData, attendance: value})}
          required
        />
      </Modal>
    </div>
  );
}
