import { LayoutDashboard, Users, UserCheck, LogOut, Menu, X } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ activeMenu, onMenuChange, isOpen, onToggle }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'admins', label: 'Admins', icon: UserCheck },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={onToggle}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-blue-600 text-white rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'glass-effect card-shadow rounded-r-2xl w-64 h-screen flex flex-col fixed md:relative z-30 transform transition-transform duration-300 md:transform-none',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SM</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900 dark:text-gray-100">Student</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">Management</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onMenuChange(item.id);
                  onToggle();
                }}
                className={clsx(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200',
                  activeMenu === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
