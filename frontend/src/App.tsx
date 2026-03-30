import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import './App.css';

type UserRole = 'admin' | 'student' | null;

function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    updateDarkMode(isDark);
  }, []);

  const updateDarkMode = (isDark: boolean) => {
    setDarkMode(isDark);
    localStorage.setItem('darkMode', String(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleAdminLogin = (username: string, password: string) => {
    // Demo validation
    if (username && password) {
      setUserRole('admin');
      localStorage.setItem('userRole', 'admin');
    }
  };

  const handleStudentLogin = (rollNumber: string, password: string) => {
    if (rollNumber && password) {
      setUserRole('student');
      localStorage.setItem('userRole', 'student');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentStudent');
  };

  if (!userRole) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <Login onAdminLogin={handleAdminLogin} onStudentLogin={handleStudentLogin} />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? 'dark' : 'light'}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {userRole === 'admin' ? (
        // Admin Layout
        <div className="flex h-screen overflow-hidden">
          <Sidebar 
            activeMenu="dashboard"
            onMenuChange={() => {}}
            isOpen={false}
            onToggle={() => {}}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar 
              darkMode={darkMode}
              onToggleDarkMode={() => updateDarkMode(!darkMode)}
              title="Admin Dashboard"
            />
            <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              <div className="p-6 md:p-8 max-w-7xl mx-auto">
                <AdminDashboard />
              </div>
            </main>
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full btn-danger justify-center"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Student Layout
        <div className="flex flex-col h-screen overflow-hidden">
          <Navbar 
            darkMode={darkMode}
            onToggleDarkMode={() => updateDarkMode(!darkMode)}
            title="Student Portal"
          />
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="p-6 md:p-8 max-w-7xl mx-auto">
              <StudentDashboard />
            </div>
          </main>
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full btn-danger justify-center"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
      />
    </div>
  );
}

export default App;
