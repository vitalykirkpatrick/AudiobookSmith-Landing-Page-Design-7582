import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import database from '../../lib/database';

const { FiDollarSign, FiEdit, FiTrash2, FiPlus, FiCheck } = FiIcons;

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const { data } = await database.select('plans_audiobooksmith', {});
      setPlans(data || []);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await database.delete('plans_audiobooksmith', planId);
        loadPlans();
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  const PlanForm = ({ plan, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      name: plan?.name || '',
      price: plan?.price || 0,
      features: plan?.features || [],
      word_limit: plan?.word_limit || 0,
      active: plan?.active !== false,
      description: plan?.description || ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (plan) {
          await database.update('plans_audiobooksmith', plan.id, formData);
        } else {
          await database.insert('plans_audiobooksmith', formData);
        }
        onSave();
        onClose();
      } catch (error) {
        console.error('Error saving plan:', error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {plan ? 'Edit Plan' : 'Add New Plan'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (USD)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Word Limit
              </label>
              <input
                type="number"
                value={formData.word_limit}
                onChange={(e) => setFormData({ ...formData, word_limit: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
              />
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                {plan ? 'Update' : 'Create'} Plan
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Plan Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
          Add Plan
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading plans...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${plan.price}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingPlan(plan);
                      setShowModal(true);
                    }}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-full"
                  >
                    <SafeIcon icon={FiEdit} className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{plan.description}</p>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2" />
                  <span>Up to {plan.word_limit.toLocaleString()} words</span>
                </div>
                {plan.features?.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    plan.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {plan.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <PlanForm
          plan={editingPlan}
          onClose={() => {
            setShowModal(false);
            setEditingPlan(null);
          }}
          onSave={loadPlans}
        />
      )}
    </div>
  );
};

export default PlanManagement;