import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import database from '../../lib/database';

const { FiGlobe, FiPlus, FiEdit, FiTrash2, FiCheck, FiX, FiActivity } = FiIcons;

const WebhookManager = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadWebhooks();
    loadWebhookLogs();
  }, []);

  const loadWebhooks = async () => {
    try {
      const { data } = await database.select('webhooks', {});
      setWebhooks(data || []);
    } catch (error) {
      console.error('Error loading webhooks:', error);
    }
  };

  const loadWebhookLogs = async () => {
    try {
      const { data } = await database.select('webhook_logs', {
        limit: 50,
        order: 'created_at DESC'
      });
      setLogs(data || []);
    } catch (error) {
      console.error('Error loading webhook logs:', error);
    }
  };

  const WebhookForm = ({ webhook, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      name: webhook?.name || '',
      url: webhook?.url || 'https://audiobooksmith.app/api/webhooks/receive',
      events: webhook?.events || ['user.created', 'user.updated', 'book.uploaded'],
      active: webhook?.active !== false,
      secret: webhook?.secret || ''
    });

    const availableEvents = [
      'user.created',
      'user.updated',
      'user.deleted',
      'book.uploaded',
      'book.processed',
      'payment.completed'
    ];

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (webhook) {
          await database.update('webhooks', webhook.id, formData);
        } else {
          await database.insert('webhooks', formData);
        }
        onSave();
        onClose();
      } catch (error) {
        console.error('Error saving webhook:', error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg">
          <h3 className="text-lg font-semibold mb-4">
            {webhook ? 'Edit Webhook' : 'Add Webhook'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secret (Optional)</label>
              <input
                type="text"
                value={formData.secret}
                onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Used for webhook signature verification"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Events</label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {availableEvents.map(event => (
                  <label key={event} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.events.includes(event)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            events: [...formData.events, event]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            events: formData.events.filter(e => e !== event)
                          });
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{event}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm">Active</span>
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
                {webhook ? 'Update' : 'Create'} Webhook
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleDeleteWebhook = async (id) => {
    if (window.confirm('Are you sure you want to delete this webhook?')) {
      try {
        await database.delete('webhooks', id);
        loadWebhooks();
      } catch (error) {
        console.error('Error deleting webhook:', error);
      }
    }
  };

  const testWebhook = async (webhook) => {
    try {
      const testData = {
        event: 'test',
        data: {
          message: 'This is a test webhook from AudiobookSmith admin panel',
          timestamp: new Date().toISOString()
        }
      };

      const response = await fetch('/api/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhook, testData })
      });

      if (response.ok) {
        alert('Test webhook sent successfully!');
        loadWebhookLogs();
      } else {
        alert('Failed to send test webhook');
      }
    } catch (error) {
      console.error('Error testing webhook:', error);
      alert('Error testing webhook');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Webhook Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Add Webhook
        </button>
      </div>

      {/* Webhooks Table */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Active Webhooks</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Events</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {webhooks.map(webhook => (
                <tr key={webhook.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{webhook.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 truncate max-w-xs">{webhook.url}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {webhook.events?.slice(0, 3).map(event => (
                        <span key={event} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {event}
                        </span>
                      ))}
                      {webhook.events?.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          +{webhook.events.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      webhook.active 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {webhook.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => testWebhook(webhook)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Test Webhook"
                      >
                        <SafeIcon icon={FiActivity} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingWebhook(webhook);
                          setShowModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                        title="Edit"
                      >
                        <SafeIcon icon={FiEdit} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteWebhook(webhook.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Webhook Logs */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Webhook Activity</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {logs.map(log => (
            <div key={log.id} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {log.event} → {log.webhook_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    log.status === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {log.status}
                  </span>
                  {log.response_code && (
                    <span className="ml-2 text-xs text-gray-500">
                      {log.response_code}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Webhook Form Modal */}
      {showModal && (
        <WebhookForm
          webhook={editingWebhook}
          onClose={() => {
            setShowModal(false);
            setEditingWebhook(null);
          }}
          onSave={() => {
            loadWebhooks();
            loadWebhookLogs();
          }}
        />
      )}
    </div>
  );
};

export default WebhookManager;