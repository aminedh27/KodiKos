'use client';
import { Card } from '@/components/ui/card';
import { BarChart, LineChart, PieChart, Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Home() {
  // Sample data for charts
  const barData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ];

  const lineData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ];

  const pieData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Key metrics and performance indicators
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Revenue</h3>
          <p className="text-2xl font-bold mt-2">$12,345</p>
          <div className="h-2 mt-4 bg-slate-100 dark:bg-slate-700 rounded-full">
            <div className="h-full bg-green-500 rounded-full w-3/4"></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Users</h3>
          <p className="text-2xl font-bold mt-2">1,234</p>
          <div className="h-2 mt-4 bg-slate-100 dark:bg-slate-700 rounded-full">
            <div className="h-full bg-blue-500 rounded-full w-2/3"></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Conversion Rate</h3>
          <p className="text-2xl font-bold mt-2">23.5%</p>
          <div className="h-2 mt-4 bg-slate-100 dark:bg-slate-700 rounded-full">
            <div className="h-full bg-purple-500 rounded-full w-1/2"></div>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Monthly Performance</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Trend Analysis</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ fill: '#10b981', r: 6, stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <span className="text-indigo-600 dark:text-indigo-300 text-sm font-medium">{item}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">Activity {item}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Description of activity</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {['Report', 'Export', 'Settings', 'Help'].map((action) => (
                <button 
                  key={action}
                  className="p-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium text-slate-800 dark:text-slate-200"
                >
                  {action}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
