import { Link, Outlet, useLocation } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import ThemeToggle from '../ThemeToggle';
import { useAuth } from '../../contexts/auth';

const navigation = [
  { name: 'Начало', href: '/' },
  { name: 'Имоти', href: '/properties' },
  { name: 'За нас', href: '/about' },
  { name: 'Контакти', href: '/contact' },
];

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <nav className="container flex justify-between items-center h-20 transition-all duration-300">
          <div className="flex gap-8 items-center">
            <Link to="/" className="flex items-center">
              <img src="/images/logo.png" alt="Property AI" className="w-auto h-16 transition-all duration-300" />
            </Link>
            <div className="hidden md:flex md:gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-500"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex md:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      <Dialog as="div" className="md:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
              <img src="/images/logo.png" alt="Property AI" className="w-auto h-12" />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

      <main className="flex-1">
        <div className="container py-8">
          <Outlet />
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Контакти</h3>
              <ul className="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <li>Телефон: +359 82 82 82 82</li>
                <li>Имейл: office@propertyai.bg</li>
                <li>Адрес: Русе, България</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Работно време</h3>
              <ul className="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <li>Понеделник - Петък: 9:00 - 18:00</li>
                <li>Събота: 10:00 - 14:00</li>
                <li>Неделя: Затворено</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Последвайте ни</h3>
              <ul className="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <li>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-white">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-8 text-sm text-center text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
            © {new Date().getFullYear()} Property AI. All rights reserved.
          </div>
        </div>
      </footer>
      {isAdmin && (
        <Link
          to="/admin"
          className="fixed bottom-24 right-6 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
          title="Admin Panel"
        >
          <Cog6ToothIcon className="h-6 w-6" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
} 
