import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import database from '../../lib/database';
import UserManagement from './UserManagement';
import PlanManagement from './PlanManagement';
import FeatureManagement from './FeatureManagement';
import SystemSettings from './SystemSettings';
import WebhookManager from './WebhookManager';

const { FiUsers, FiCreditCard, FiSettings, FiActivity, FiGlobe, FiLogOut, FiShield } = FiIcons;

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    pendingBooks: 0
  });

  useEffect(() => {
    loadAdminData();
    loadStats();
  }, []);

  const loadAdminData = async () => {
    try {
      const { data: admin } = await database.select('admin_users', {
        email: localStorage.getItem('admin_email')
      });
      if (admin && admin.length > 0) {
        setAdminUser(admin[0]);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const loadStats = async () => {
    try {
      const { data: users } = await database.select('users_audiobooksmith', {});
      const { data: books } = await database.select('user_books', {});
      
      setStats({
        totalUsers: users?.length || 0,
        activeUsers: users?.filter(u => u.status === 'active').length || 0,
        totalRevenue: users?.reduce((sum, u) => sum + (parseFloat(u.total_spent) || 0), 0) || 0,
        pendingBooks: books?.filter(b => b.status === 'pending').length || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    window.location.href = '/admin/login';
  };

  const StatCard = ({ title, value, icon, color }) => (
    <motion.div
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <SafeIcon icon={icon} className={`w-8 h-8 text-${color}-500`} />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiShield} className="w-8 h-8 text-primary-600" />
              <h1 className="text-xl font-bold text-gray-900">AudiobookSmith Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {adminUser?.name || 'Admin'}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800"
              >
                <SafeIcon icon={FiLogOut} className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={FiUsers}
            color="blue"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon={FiActivity}
            color="green"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={FiCreditCard}
            color="purple"
          />
          <StatCard
            title="Pending Books"
            value={stats.pendingBooks}
            icon={FiGlobe}
            color="orange"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <nav className="flex space-x-4 p-4">
            {[
              { id: 'users', label: 'User Management', icon: FiUsers },
              { id: 'plans', label: 'Plan Management', icon: FiCreditCard },
              { id: 'features', label: 'Features', icon: FiActivity },
              { id: 'webhooks', label: 'Webhooks', icon: FiGlobe },
              { id: 'settings', label: 'Settings', icon: FiSettings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'users' && <UserManagement onStatsUpdate={loadStats} />}
          {activeTab === 'plans' && <PlanManagement />}
          {activeTab === 'features' && <FeatureManagement />}
          {activeTab === 'webhooks' && <WebhookManager />}
          {activeTab === 'settings' && <SystemSettings adminUser={adminUser} onUpdate={loadAdminData} />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;