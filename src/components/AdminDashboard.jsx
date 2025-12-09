```jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import database from '../lib/database';

const { 
  FiUsers, FiDollarSign, FiBook, FiSettings, FiMail, 
  FiDownload, FiEdit, FiTrash2, FiCheck, FiX 
} = FiIcons;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'users':
          const { data: userData } = await database.from('users_audiobooksmith_2024')
            .select('*, profiles:user_profiles_audiobooksmith_2024(*)');
          setUsers(userData);
          break;

        case 'projects':
          const { data: projectData } = await database.from('book_projects_audiobooksmith_2024')
            .select('*, user:users_audiobooksmith_2024(name, email)');
          setProjects(projectData);
          break;

        case 'subscriptions':
          const { data: subData } = await database.from('subscriptions_audiobooksmith_2024')
            .select('*, user:users_audiobooksmith_2024(name, email)');
          setSubscriptions(subData);
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusUpdate = async (userId, newStatus) => {
    try {
      await database.from('users_audiobooksmith_2024')
        .update({ status: newStatus })
        .eq('id', userId);
      
      loadData();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleSubscriptionUpdate = async (subId, newStatus) => {
    try {
      await database.from('subscriptions_audiobooksmith_2024')
        .update({ status: newStatus })
        .eq('id', subId);
      
      loadData();
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const handleExportData = (data, filename) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + data.map(row => Object.values(row).join(",")).join("\n");
    
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", filename + "_" + new Date().toISOString() + ".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderUsersTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map(user => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button
                  onClick={() => handleUserStatusUpdate(user.id, 
                    user.status === 'active' ? 'inactive' : 'active')}
                  className="text-primary-600 hover:text-primary-900"
                >
                  <SafeIcon 
                    icon={user.status === 'active' ? FiX : FiCheck} 
                    className="w-5 h-5"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderProjectsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Genre</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map(project => (
            <tr key={project.id}>
              <td className="px-6 py-4">{project.title}</td>
              <td className="px-6 py-4">{project.user?.name}</td>
              <td className="px-6 py-4">{project.genre}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  project.status === 'completed' ? 'bg-green-100 text-green-800' :
                  project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-primary-600 hover:text-primary-900">
                  <SafeIcon icon={FiEdit} className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSubscriptionsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {subscriptions.map(sub => (
            <tr key={sub.id}>
              <td className="px-6 py-4">{sub.user?.name}</td>
              <td className="px-6 py-4">{sub.plan}</td>
              <td className="px-6 py-4">
                ${sub.amount} {sub.currency.toUpperCase()}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  sub.status === 'active' ? 'bg-green-100 text-green-800' :
                  sub.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {sub.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button 
                  onClick={() => handleSubscriptionUpdate(sub.id,
                    sub.status === 'active' ? 'cancelled' : 'active')}
                  className="text-primary-600 hover:text-primary-900"
                >
                  <SafeIcon 
                    icon={sub.status === 'active' ? FiX : FiCheck} 
                    className="w-5 h-5"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleExportData(
                activeTab === 'users' ? users :
                activeTab === 'projects' ? projects :
                subscriptions,
                activeTab
              )}
              className="flex items-center px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50"
            >
              <SafeIcon icon={FiDownload} className="w-5 h-5 mr-2" />
              Export Data
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <nav className="flex space-x-4 p-4">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                activeTab === 'users' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <SafeIcon icon={FiUsers} className="w-5 h-5 mr-2" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                activeTab === 'projects' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <SafeIcon icon={FiBook} className="w-5 h-5 mr-2" />
              Projects
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                activeTab === 'subscriptions' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <SafeIcon icon={FiDollarSign} className="w-5 h-5 mr-2" />
              Subscriptions
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading data...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              {error}
            </div>
          ) : (
            <div className="p-6">
              {activeTab === 'users' && renderUsersTable()}
              {activeTab === 'projects' && renderProjectsTable()}
              {activeTab === 'subscriptions' && renderSubscriptionsTable()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
```