import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../../contexts/auth';
import type { LoginData } from '../../services/auth';

const loginSchema = z.object({
  email: z.string().email('Невалиден имейл адрес'),
  password: z.string().min(6, 'Паролата трябва да е поне 6 символа'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<LoginForm>>({});

  const { mutate, isPending } = useMutation<void, Error, LoginData>({
    mutationFn: login,
    onSuccess: () => {
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
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-white dark:bg-[rgb(var(--color-dark-bg))] sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-bold text-center text-gray-900 dark:text-[rgb(var(--color-dark-text))]">
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
                    ? 'border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-[rgb(var(--color-dark-border))] focus:ring-primary-500 focus:border-primary-500'
                } placeholder-gray-500 dark:placeholder-[rgb(var(--color-dark-text-secondary))] text-gray-900 dark:text-[rgb(var(--color-dark-text))] dark:bg-[rgb(var(--color-dark-bg))] rounded-t-md focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Имейл адрес"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
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
                    ? 'border-red-300 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 dark:border-[rgb(var(--color-dark-border))] focus:ring-primary-500 focus:border-primary-500'
                } placeholder-gray-500 dark:placeholder-[rgb(var(--color-dark-text-secondary))] text-gray-900 dark:text-[rgb(var(--color-dark-text))] dark:bg-[rgb(var(--color-dark-bg))] rounded-b-md focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Парола"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="relative flex justify-center w-full px-3 py-2 text-sm font-semibold text-white rounded-md group bg-primary-600 hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 dark:focus-visible:outline-offset-[rgb(var(--color-dark-bg))]"
            >
              {isPending ? 'Влизане...' : 'Вход'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
