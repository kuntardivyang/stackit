import React, { useState } from 'react';
import { X } from 'lucide-react';
import { login as loginApi, register as registerApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const QuickAuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const [loginData, setLoginData] = useState({
    emailOrUsername: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginData.emailOrUsername || !loginData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await loginApi(loginData);
      
      localStorage.setItem('token', response.data.token);
      if (response.data.user) {
        login(response.data.user);
      }
      
      toast.success('Logged in successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!registerData.username || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const response = await registerApi({
        username: registerData.username,
        email: registerData.email,
        password: registerData.password
      });
      
      localStorage.setItem('token', response.data.token);
      if (response.data.user) {
        login(response.data.user);
      }
      
      toast.success('Account created successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#493222] rounded-xl p-6 max-w-md w-full mx-4 border border-[#cba990]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {isLogin ? 'Quick Login' : 'Quick Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#cba990] hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-lg transition-colors ${
              isLogin 
                ? 'bg-[#f26c0c] text-white' 
                : 'bg-[#231810] text-[#cba990] hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-lg transition-colors ${
              !isLogin 
                ? 'bg-[#f26c0c] text-white' 
                : 'bg-[#231810] text-[#cba990] hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                name="emailOrUsername"
                placeholder="Email or Username"
                value={loginData.emailOrUsername}
                onChange={handleLoginChange}
                className="w-full px-3 py-2 border border-[#cba990] rounded-lg bg-[#231810] text-white placeholder-[#cba990] focus:outline-none focus:ring-2 focus:ring-[#f26c0c]"
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="w-full px-3 py-2 border border-[#cba990] rounded-lg bg-[#231810] text-white placeholder-[#cba990] focus:outline-none focus:ring-2 focus:ring-[#f26c0c]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-[#f26c0c] text-white rounded-lg hover:bg-[#e55a00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={registerData.username}
                onChange={handleRegisterChange}
                className="w-full px-3 py-2 border border-[#cba990] rounded-lg bg-[#231810] text-white placeholder-[#cba990] focus:outline-none focus:ring-2 focus:ring-[#f26c0c]"
                required
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerData.email}
                onChange={handleRegisterChange}
                className="w-full px-3 py-2 border border-[#cba990] rounded-lg bg-[#231810] text-white placeholder-[#cba990] focus:outline-none focus:ring-2 focus:ring-[#f26c0c]"
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={registerData.password}
                onChange={handleRegisterChange}
                className="w-full px-3 py-2 border border-[#cba990] rounded-lg bg-[#231810] text-white placeholder-[#cba990] focus:outline-none focus:ring-2 focus:ring-[#f26c0c]"
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                className="w-full px-3 py-2 border border-[#cba990] rounded-lg bg-[#231810] text-white placeholder-[#cba990] focus:outline-none focus:ring-2 focus:ring-[#f26c0c]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-[#f26c0c] text-white rounded-lg hover:bg-[#e55a00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <p className="text-[#cba990] text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#f26c0c] hover:text-white transition-colors"
            >
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickAuthModal; 