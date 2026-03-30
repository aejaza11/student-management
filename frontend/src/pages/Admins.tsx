import { useEffect, useState, type FormEvent } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import Table, { type Column } from '../components/Table';
import Modal, { FormField } from '../components/Modal';
import * as apiService from '../services/api';

interface Admin {
  id: string | number;
  name: string;
  email: string;
  username: string;
  role?: string;
}

export default function Admins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id?: string | number }>({ open: false });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'admin',
  });

  // Fetch admins
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAdmins();
      setAdmins(response.data);
    } catch (error) {
      toast.error('Failed to fetch admins');
      console.error(error);
      // Mock data for demo
      setAdmins([
        { id: 1, name: 'Admin One', email: 'admin1@example.com', username: 'admin1', role: 'Super Admin' },
        { id: 2, name: 'Admin Two', email: 'admin2@example.com', username: 'admin2', role: 'Admin' },
        { id: 3, name: 'Admin Three', email: 'admin3@example.com', username: 'admin3', role: 'Manager' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (admin?: Admin) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        name: admin.name,
        email: admin.email,
        username: admin.username,
        password: '',
        role: admin.role || 'admin',
      });
    } else {
      setEditingAdmin(null);
      setFormData({ name: '', email: '', username: '', password: '', role: 'admin' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingAdmin) {
        await apiService.updateAdmin(String(editingAdmin.id), formData);
        toast.success('Admin updated successfully');
      } else {
        await apiService.createAdmin(formData);
        toast.success('Admin added successfully');
      }
      setIsModalOpen(false);
      fetchAdmins();
    } catch (error) {
      toast.error(editingAdmin ? 'Failed to update admin' : 'Failed to add admin');
      console.error(error);
    }
  };

  const handleDeleteClick = (admin: Admin) => {
    setDeleteConfirm({ open: true, id: admin.id });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await apiService.deleteAdmin(String(deleteConfirm.id));
      toast.success('Admin deleted successfully');
      setDeleteConfirm({ open: false });
      fetchAdmins();
    } catch (error) {
      toast.error('Failed to delete admin');
      console.error(error);
    }
  };

  const columns: Column<Admin>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'username', header: 'Username', sortable: true },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'role', header: 'Role', sortable: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Admins
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and view all administrators
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add Admin
        </button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={admins}
        loading={loading}
        pageSize={10}
        onEdit={handleOpenModal}
        onDelete={handleDeleteClick}
        searchFields={['name', 'username', 'email']}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        title={editingAdmin ? 'Edit Admin' : 'Add New Admin'}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        submitText={editingAdmin ? 'Update' : 'Add Admin'}
      >
        <FormField
          label="Full Name"
          placeholder="John Doe"
          value={formData.name}
          onChange={v => setFormData({ ...formData, name: v })}
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
          label="Username"
          placeholder="johndoe"
          value={formData.username}
          onChange={v => setFormData({ ...formData, username: v })}
          required
        />
        {!editingAdmin && (
          <FormField
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={v => setFormData({ ...formData, password: v })}
            required
          />
        )}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Role
          </label>
          <select
            value={formData.role}
            onChange={e => setFormData({ ...formData, role: e.target.value })}
            className="input-field"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
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
                Delete Admin
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this admin? This action cannot be undone.
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
