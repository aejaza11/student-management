import { Moon, Sun, Bell, User } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  title: string;
}

export default function Navbar({ darkMode, onToggleDarkMode, title }: NavbarProps) {
  return (
    <nav className="glass-effect card-shadow rounded-b-2xl px-6 py-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h2>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 hidden sm:inline">Admin</span>
        </button>
      </div>
    </nav>
  );
}
