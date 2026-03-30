import { useEffect, useState } from 'react';
import { TrendingUp, Users, UserCheck, Activity, ArrowUpRight } from 'lucide-react';

interface DashboardStats {
  totalStudents: number;
  totalAdmins: number;
  activeUsers: number;
  completionRate: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalAdmins: 0,
    activeUsers: 0,
    completionRate: 0,
  });

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalStudents: 128,
        totalAdmins: 5,
        activeUsers: 89,
        completionRate: 76,
      });
    }, 500);
  }, []);

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      trend: '+12%',
      trendColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Total Admins',
      value: stats.totalAdmins,
      icon: UserCheck,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      trend: '+2%',
      trendColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: Activity,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      trend: '+8%',
      trendColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      trend: '+5%',
      trendColor: 'text-green-600 dark:text-green-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-enter">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          Here's what's happening with your students today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`stat-card ${stat.bgColor} border border-gray-200 dark:border-gray-700 p-6 shadow-elevated hover:shadow-elevated`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 ${stat.trendColor} font-semibold text-sm`}>
                  <ArrowUpRight className="w-4 h-4" />
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  From last month
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Recent Activity
          </h2>
          <span className="badge badge-info text-xs">Latest</span>
        </div>
        <div className="space-y-1">
          {[
            { type: 'Student Added', name: 'John Doe', time: '2 hours ago', color: 'badge-success' },
            { type: 'Admin Updated', name: 'System Admin', time: '4 hours ago', color: 'badge-info' },
            { type: 'Student Removed', name: 'Jane Smith', time: '1 day ago', color: 'badge-warning' },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-colors duration-150 last:pb-0">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className={`badge ${activity.color}`}>
                    {activity.type}
                  </span>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {activity.name}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 ml-4 whitespace-nowrap">
                {activity.time}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
