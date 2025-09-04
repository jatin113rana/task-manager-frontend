import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockApi } from '../services/mockApi';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Layout } from '../components/Layout';
import toast from 'react-hot-toast';

interface Task {
  task_id: number;
  task: string;
  created_by: string;
  modified_by: string;
  created_at: string;
  modified_at: string;
}

export const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const filtered = tasks.filter(task =>
      task.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.created_by.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [tasks, searchTerm]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const fetchedTasks = await mockApi.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData: { task: string; user_id: number }) => {
    setModalLoading(true);
    try {
      if (selectedTask) {
        const updatedTask = await mockApi.updateTask(selectedTask.task_id, taskData);
        setTasks(prev => prev.map(t => t.task_id === selectedTask.task_id ? updatedTask : t));
        toast.success('Task updated successfully');
      } else {
        const newTask = await mockApi.createTask(taskData);
        setTasks(prev => [...prev, newTask]);
        toast.success('Task created successfully');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Operation failed');
      throw error;
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete || !user) return;
    
    setModalLoading(true);
    try {
      await mockApi.deleteTask(taskToDelete.task_id, user.user_id);
      setTasks(prev => prev.filter(t => t.task_id !== taskToDelete.task_id));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete task');
      throw error;
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.user_name}! You have {tasks.length} tasks.
              </p>
            </div>
            <button
              onClick={handleCreateTask}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
            >
              <Plus className="h-5 w-5" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              <span>Showing {filteredTasks.length} of {tasks.length} tasks</span>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {tasks.length === 0 ? 'No tasks yet' : 'No tasks found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {tasks.length === 0 
                  ? 'Get started by creating your first task.' 
                  : 'Try adjusting your search criteria.'}
              </p>
              {tasks.length === 0 && (
                <button
                  onClick={handleCreateTask}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create First Task</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.task_id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={selectedTask}
        loading={modalLoading}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        taskName={taskToDelete?.task || ''}
        loading={modalLoading}
      />
    </Layout>
  );
};