import { Link, Outlet, useLocation } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import ThemeToggle from '../ThemeToggle';
import { useAuth } from '../../contexts/auth';
import { useTheme } from '../../hooks/useTheme';
import Logo from '../Logo';

const navigation = [
  { name: 'Начало', href: '/' },
  { name: 'Имоти', href: '/properties' },
  { name: 'За нас', href: '/about' },
  { name: 'Контакти', href: '/contact' },
];

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();
  const { isDark } = useTheme();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[rgb(var(--color-dark-bg))]">
      <header className={`sticky top-0 z-50 bg-white dark:bg-[rgb(var(--color-dark-bg-secondary))] border-b border-gray-200 dark:border-[rgb(var(--color-dark-border))] shadow-sm transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}>
        <nav className="container flex justify-between items-center h-full transition-all duration-300">
          <div className="flex gap-8 items-center">
            <Link to="/" className="flex items-center">
              <Logo className={`w-auto transition-all duration-300 ${isScrolled ? 'h-12' : 'h-16'}`} />
            </Link>
            <div className="hidden md:flex md:gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm font-semibold leading-6 text-gray-900 dark:text-[rgb(var(--color-dark-text))] hover:text-primary-600 dark:hover:text-primary-500"
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
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-[rgb(var(--color-dark-text))]"
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
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-[rgb(var(--color-dark-bg-secondary))] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
              <Logo className="w-auto h-12" />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-[rgb(var(--color-dark-text))]"
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
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-[rgb(var(--color-dark-text))] hover:bg-gray-50 dark:hover:bg-[rgb(var(--color-dark-border))]"
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

      <footer className="bg-white dark:bg-[rgb(var(--color-dark-bg-secondary))] border-t border-gray-200 dark:border-[rgb(var(--color-dark-border))]">
        <div className="container py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-[rgb(var(--color-dark-text))]">Контакти</h3>
              <ul className="mt-4 space-y-4 text-sm text-gray-600 dark:text-[rgb(var(--color-dark-text-secondary))]">
                <li>Телефон: +359 82 82 82 82</li>
                <li>Имейл: office@propertyai.bg</li>
                <li>Адрес: Русе, България</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-[rgb(var(--color-dark-text))]">Работно време</h3>
              <ul className="mt-4 space-y-4 text-sm text-gray-600 dark:text-[rgb(var(--color-dark-text-secondary))]">
                <li>Понеделник - Петък: 9:00 - 18:00</li>
                <li>Събота: 10:00 - 14:00</li>
                <li>Неделя: Затворено</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-[rgb(var(--color-dark-text))]">Последвайте ни</h3>
              <ul className="mt-4 space-y-4 text-sm text-gray-600 dark:text-[rgb(var(--color-dark-text-secondary))]">
                <li>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-[rgb(var(--color-dark-text))]">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 dark:hover:text-[rgb(var(--color-dark-text))]">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-8 text-sm text-center text-gray-600 dark:text-[rgb(var(--color-dark-text-secondary))] border-t border-gray-200 dark:border-[rgb(var(--color-dark-border))]">
            © {new Date().getFullYear()} Property AI. All rights reserved.
          </div>
        </div>
      </footer>
      {isAdmin && (
        <Link
          to="/admin"
          className="fixed bottom-24 -right-1 group flex items-center p-3 bg-primary-600 text-white shadow-lg transition-all duration-300 ease-in-out z-50 rounded-l-full hover:pr-6 hover:right-0 hover:bg-primary-700 hover:shadow-xl hover:translate-x-1"
          title="Admin Panel"
        >
          <Cog6ToothIcon className="h-6 w-6 transform transition-transform duration-300 ease-in-out group-hover:rotate-90" aria-hidden="true" />
          <span className="text-sm font-medium max-w-0 group-hover:max-w-[200px] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden">
            Admin Panel
          </span>
        </Link>
      )}
    </div>
  );
} 
