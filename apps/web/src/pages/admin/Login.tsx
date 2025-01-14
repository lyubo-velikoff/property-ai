import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import api from '../../lib/api';
import { useAuth } from '../../contexts/auth';

const loginSchema = z.object({
  email: z.string().email('Невалиден имейл адрес'),
  password: z.string().min(6, 'Паролата трябва да е поне 6 символа'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface ApiResponse<T> {
  status: string;
  data: T;
}

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, setUser } = useAuth();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<LoginForm>>({});

  const { mutate, isPending } = useMutation<LoginResponse, Error, LoginForm>({
    mutationFn: async (data: LoginForm) => {
      const response = await api.post<LoginResponse>('/auth/login', data);
      console.log('API Response:', response.data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      setUser({
        ...data.user,
        role: data.user.role.toUpperCase() as 'ADMIN' | 'USER'
      });
      navigate(from);
    },
    onError: (error) => {
      console.error('Login error:', error);
      setErrors({
        email: 'Невалиден имейл или парола',
        password: 'Невалиден имейл или парола',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = loginSchema.parse(formData);
      mutate(validatedData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<LoginForm> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as keyof LoginForm] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-bold text-center text-gray-900 dark:text-white">
            Вход в администрацията
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Имейл
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.email
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-red-500 focus:border-red-500'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Имейл адрес"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Парола
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors.password
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-red-500 focus:border-red-500'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Парола"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50"
            >
              {isPending ? 'Влизане...' : 'Вход'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
