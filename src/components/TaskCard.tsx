import React from 'react';
import { Edit, Trash2, Calendar, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Task {
  task_id: number;
  task: string;
  created_by: string;
  modified_by: string;
  created_at: string;
  modified_at: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 leading-6">{task.task}</h3>
          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit task"
            >
              <Edit className="h-4 w-4" />
            </button>
            {isAdmin && (
              <button
                onClick={() => onDelete(task.task_id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Created by: {task.created_by}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Created: {formatDate(task.created_at)}</span>
          </div>
          {task.modified_by !== task.created_by && (
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Modified by: {task.modified_by}</span>
            </div>
          )}
          {task.modified_at !== task.created_at && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Modified: {formatDate(task.modified_at)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};