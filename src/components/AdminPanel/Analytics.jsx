import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import database from '../../lib/database';

const { FiBarChart2, FiTrendingUp, FiUsers, FiBook, FiDollarSign, FiClock } = FiIcons;

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    users: { total: 0, growth: 0 },
    revenue: { total: 0, growth: 0 },
    projects: { total: 0, growth: 0 },
    conversionRate: { value: 0, growth: 0 },
    processingTime: { value: 0, growth: 0 },
    customerSatisfaction: { value: 0, growth: 0 }
  });

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const { data: analyticsData } = await database.select('analytics_audiobooksmith', {
        timeRange,
        select: '*'
      });

      // Process analytics data
      if (analyticsData) {
        setStats({
          users: {
            total: analyticsData.total_users || 0,
            growth: analyticsData.user_growth || 0
          },
          revenue: {
            total: analyticsData.total_revenue || 0,
            growth: analyticsData.revenue_growth || 0
          },
          projects: {
            total: analyticsData.total_projects || 0,
            growth: analyticsData.project_growth || 0
          },
          conversionRate: {
            value: analyticsData.conversion_rate || 0,
            growth: analyticsData.conversion_growth || 0
          },
          processingTime: {
            value: analyticsData.avg_processing_time || 0,
            growth: analyticsData.processing_time_improvement || 0
          },
          customerSatisfaction: {
            value: analyticsData.satisfaction_rate || 0,
            growth: analyticsData.satisfaction_growth || 0
          }
        });
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, growth, icon }) => (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
          <SafeIcon icon={icon} className="w-6 h-6 text-primary-600" />
        </div>
        <div className={`px-2 py-1 rounded-full text-sm ${growth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {growth >= 0 ? '+' : ''}{growth}%
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    </motion.div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={stats.users.total}
            growth={stats.users.growth}
            icon={FiUsers}
          />
          <StatCard
            title="Revenue"
            value={`$${stats.revenue.total.toLocaleString()}`}
            growth={stats.revenue.growth}
            icon={FiDollarSign}
          />
          <StatCard
            title="Active Projects"
            value={stats.projects.total}
            growth={stats.projects.growth}
            icon={FiBook}
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats.conversionRate.value}%`}
            growth={stats.conversionRate.growth}
            icon={FiTrendingUp}
          />
          <StatCard
            title="Avg. Processing Time"
            value={`${stats.processingTime.value} hrs`}
            growth={stats.processingTime.growth}
            icon={FiClock}
          />
          <StatCard
            title="Customer Satisfaction"
            value={`${stats.customerSatisfaction.value}%`}
            growth={stats.customerSatisfaction.growth}
            icon={FiBarChart2}
          />
        </div>
      )}
    </div>
  );
};

export default Analytics;