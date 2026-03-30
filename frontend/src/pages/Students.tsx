import { useEffect, useState, type FormEvent } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import Table, { type Column } from '../components/Table';
import Modal, { FormField } from '../components/Modal';
import * as apiService from '../services/api';

interface Student {
  id: string | number;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  rollNo: string;
  phone?: string;
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id?: string | number }>({ open: false });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    rollNo: '',
    phone: '',
  });

  // Fetch students
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await apiService.getStudents();
      setStudents(response.data);
    } catch (error) {
      toast.error('Failed to fetch students');
      console.error(error);
      // Mock data for demo
      setStudents([
        { id: 1, studentId: 'STU001', firstName: 'John', lastName: 'Doe', email: 'john@example.com', rollNo: '001' },
        { id: 2, studentId: 'STU002', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', rollNo: '002' },
        { id: 3, studentId: 'STU003', firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', rollNo: '003' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        rollNo: student.rollNo,
        phone: student.phone || '',
      });
    } else {
      setEditingStudent(null);
      setFormData({ firstName: '', lastName: '', email: '', rollNo: '', phone: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await apiService.updateStudent(String(editingStudent.id), formData);
        toast.success('Student updated successfully');
      } else {
        await apiService.createStudent(formData);
        toast.success('Student added successfully');
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (error) {
      toast.error(editingStudent ? 'Failed to update student' : 'Failed to add student');
      console.error(error);
    }
  };

  const handleDeleteClick = (student: Student) => {
    setDeleteConfirm({ open: true, id: student.id });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await apiService.deleteStudent(String(deleteConfirm.id));
      toast.success('Student deleted successfully');
      setDeleteConfirm({ open: false });
      fetchStudents();
    } catch (error) {
      toast.error('Failed to delete student');
      console.error(error);
    }
  };

  const columns: Column<Student>[] = [
    { key: 'studentId', header: 'Student ID', sortable: true },
    { key: 'firstName', header: 'First Name', sortable: true },
    { key: 'lastName', header: 'Last Name', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'rollNo', header: 'Roll No', sortable: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Students
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and view all students
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add Student
        </button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={students}
        loading={loading}
        pageSize={10}
        onEdit={handleOpenModal}
        onDelete={handleDeleteClick}
        searchFields={['firstName', 'lastName', 'email', 'studentId']}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        submitText={editingStudent ? 'Update' : 'Add Student'}
      >
        <FormField
          label="First Name"
          placeholder="John"
          value={formData.firstName}
          onChange={v => setFormData({ ...formData, firstName: v })}
          required
        />
        <FormField
          label="Last Name"
          placeholder="Doe"
          value={formData.lastName}
          onChange={v => setFormData({ ...formData, lastName: v })}
          required
        />
        <FormField
          label="Email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={v => setFormData({ ...formData, email: v })}
          required
        />
        <FormField
          label="Roll Number"
          placeholder="001"
          value={formData.rollNo}
          onChange={v => setFormData({ ...formData, rollNo: v })}
          required
        />
        <FormField
          label="Phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.phone}
          onChange={v => setFormData({ ...formData, phone: v })}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm({ open: false })} />
          <div className="relative glass-effect rounded-xl p-6 w-full max-w-sm card-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Delete Student
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this student? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm({ open: false })}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn-danger flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
