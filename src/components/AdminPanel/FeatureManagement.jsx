import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import database from '../../lib/database';

const { FiPlus, FiEdit, FiTrash2, FiToggleLeft, FiToggleRight } = FiIcons;

const FeatureManagement = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      const { data } = await database.select('features_audiobooksmith', {});
      setFeatures(data || []);
    } catch (error) {
      console.error('Error loading features:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeature = async (featureId, currentStatus) => {
    try {
      await database.update('features_audiobooksmith', featureId, {
        active: !currentStatus
      });
      loadFeatures();
    } catch (error) {
      console.error('Error toggling feature:', error);
    }
  };

  const handleDelete = async (featureId) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      try {
        await database.delete('features_audiobooksmith', featureId);
        loadFeatures();
      } catch (error) {
        console.error('Error deleting feature:', error);
      }
    }
  };

  const FeatureForm = ({ feature, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      name: feature?.name || '',
      description: feature?.description || '',
      category: feature?.category || '',
      active: feature?.active !== false,
      plans: feature?.plans || []
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (feature) {
          await database.update('features_audiobooksmith', feature.id, formData);
        } else {
          await database.insert('features_audiobooksmith', formData);
        }
        onSave();
        onClose();
      } catch (error) {
        console.error('Error saving feature:', error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {feature ? 'Edit Feature' : 'Add New Feature'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feature Name
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Category</option>
                <option value="core">Core Features</option>
                <option value="advanced">Advanced Features</option>
                <option value="premium">Premium Features</option>
              </select>
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
                {feature ? 'Update' : 'Create'} Feature
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
        <h2 className="text-2xl font-bold text-gray-900">Feature Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
          Add Feature
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading features...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.name}
                  </h3>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full mt-1">
                    {feature.category}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingFeature(feature);
                      setShowModal(true);
                    }}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-full"
                  >
                    <SafeIcon icon={FiEdit} className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(feature.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <SafeIcon icon={FiTrash2} className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{feature.description}</p>

              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span
                  className={`text-sm font-medium ${
                    feature.active ? 'text-green-600' : 'text-gray-600'
                  }`}
                >
                  {feature.active ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => handleToggleFeature(feature.id, feature.active)}
                  className={`p-1 rounded-full transition-colors ${
                    feature.active
                      ? 'text-green-600 hover:bg-green-50'
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <SafeIcon
                    icon={feature.active ? FiToggleRight : FiToggleLeft}
                    className="w-6 h-6"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <FeatureForm
          feature={editingFeature}
          onClose={() => {
            setShowModal(false);
            setEditingFeature(null);
          }}
          onSave={loadFeatures}
        />
      )}
    </div>
  );
};

export default FeatureManagement;