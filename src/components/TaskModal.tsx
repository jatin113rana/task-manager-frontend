import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useAuth } from '../contexts/AuthContext';
import { validateTask } from '../utils/validation';
import { LoadingSpinner } from './LoadingSpinner';
import axios from 'axios';

interface Task {
  task_id: number;
  task: string;
  created_by: string;
  modified_by: string;
  created_at: string;
  modified_at: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: { task: string; user_id: number }) => Promise<void>;
  task?: Task | null;
  loading: boolean;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  task,
  loading
}) => {
  const [formData, setFormData] = useState({ task: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { user } = useAuth();

  useEffect(() => {
    if (task) {
      setFormData({ task: task.task });
    } else {
      setFormData({ task: '' });
    }
    setErrors({});
  }, [task, isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    const taskError = validateTask(formData.task);
    if (taskError) newErrors.task = taskError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;
    
    try {
      await onSave({ task: formData.task, user_id: user.user_id });
      onClose();
      setFormData({ task: '' });
      setErrors({});
    } catch (error) {
      // Error is handled in parent component
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="task" className="block text-sm font-medium text-gray-700 mb-2">
            Task Description
          </label>
          <textarea
            id="task"
            name="task"
            rows={4}
            value={formData.task}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
              errors.task ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter task description..."
          />
          {errors.task && (
            <p className="mt-1 text-sm text-red-600">{errors.task}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.task.length}/200 characters
          </p>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                {task ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              task ? 'Update Task' : 'Create Task'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};