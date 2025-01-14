import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useForm } from 'react-hook-form'; // Import React Hook Form
import { yupResolver } from '@hookform/resolvers/yup'; // For Yup integration
import * as yup from 'yup'; // Import Yup for validation
import { loginUser } from '../../services/AuthService';

// Define the validation schema using Yup
const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export function LoginForm() {
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema), // Use Yup for form validation
  });

  // Handle form submission
  const handleLogin = async (data: any) => {
    try {
      const response = await loginUser({ username: data.username, password: data.password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));

      if (response.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng nhập vào tài khoản
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  type="text"
                  {...register('username')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  {...register('password')} // Register input with react-hook-form
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Đăng nhập
              </button>
            </div>
          </form>

          {/* Navigation buttons */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => navigate('/register')} // Navigate to register page
              className="text-indigo-600 hover:text-indigo-500 text-sm"
            >
              Chưa có tài khoản? Đăng ký ngay
            </button>
            <button
              onClick={() => navigate('/')} // Navigate to home page
              className="text-indigo-600 hover:text-indigo-500 text-sm"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
