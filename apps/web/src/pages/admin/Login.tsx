import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';

const API_URL = import.meta.env.VITE_API_URL;

const loginSchema = z.object({
  email: z.string().email('Невалиден имейл адрес'),
  password: z.string().min(6, 'Паролата трябва да е поне 6 символа'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginResponse {
  status: string;
  data: {
    user: {
      id: string;
      email: string;
      role: string;
    };
    token: string;
  };
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<LoginForm>>({});

  const { mutate, isLoading } = useMutation<LoginResponse, Error, LoginForm>({
    mutationFn: async (data: LoginForm) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      return response.json();
    },
    onSuccess: (response) => {
      localStorage.setItem('token', response.data.token);
      navigate(from, { replace: true });
    },
    onError: () => {
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
        err.errors.forEach((error: z.ZodIssue) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as keyof LoginForm] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Вход в администрацията
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
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
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Влизане...' : 'Влез'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
