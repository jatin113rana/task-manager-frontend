import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { validateUsername, validatePassword } from '../utils/validation';
import { LoadingSpinner } from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import axios from 'axios';

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    const usernameError = validateUsername(formData.user_name);
    if (usernameError) newErrors.user_name = usernameError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const {data} = await axios.post('https://task-manager-backend-production-08ad.up.railway.app/auth/login', {
        user_name: formData.user_name,
        password: formData.password
      });
      login({
        user_id: data.user_id,
        user_name: data.user_name,
        role: data.role as 'admin' | 'user'
      });
      // toast.success(data.message ||data.detail);
      if(data.error){
        throw new Error(data.message ||data.detail);
      }
      console.log("error",data);
      if(data.error===false){
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const fillDemoCredentials = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setFormData({ user_name: 'admin', password: 'admin123' });
    } else {
      setFormData({ user_name: 'user', password: 'user123' });
    }
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="space-y-5">
              <div>
                <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="user_name"
                  name="user_name"
                  type="text"
                  value={formData.user_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.user_name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your username"
                />
                {errors.user_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.user_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <p className="text-xs font-medium text-gray-700 mb-3">Demo Credentials:</p>
          <div className="space-y-2">
            <button
              onClick={() => fillDemoCredentials('admin')}
              className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              👑 Admin: admin / admin123
            </button>
            <button
              onClick={() => fillDemoCredentials('user')}
              className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              👤 User: user / user123
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};