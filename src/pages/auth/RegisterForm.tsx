import { useNavigate } from 'react-router-dom'; 
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { registerUser } from '../../services/AuthService';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

export function RegisterForm() {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      await registerUser({ username: data.username, password: data.password });
      navigate('/login');
    } catch (err) {
      console.error('Error creating account:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng ký tài khoản
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                  {...register('password')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Xác nhận mật khẩu
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                   {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Đăng ký
              </button>
            </div>
          </form>

          {/* Navigation buttons */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => navigate('/login')} 
              className="text-indigo-600 hover:text-indigo-500 text-sm"
            >
              Đã có tài khoản? Đăng nhập
            </button>
            <button
              onClick={() => navigate('/')} 
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
