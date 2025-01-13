import { Link, Outlet, useLocation } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import ThemeToggle from '../ThemeToggle';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Properties', href: '/properties' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const updateScroll = () => {
      const main = document.querySelector('main');
      if (main) {
        main.setAttribute('data-scroll', window.scrollY === 0 ? '0' : '1');
      }
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <nav className="container flex justify-between items-center h-20 transition-all duration-300">
          <div className="flex gap-8 items-center">
            <Link to="/" className="flex items-center">
              <img src="/images/logo.png" alt="Авалон" className="w-auto h-16 transition-all duration-300" />
            </Link>
            <div className="hidden md:flex md:gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActivePath(item.href)
                      ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  } px-1 py-2 text-sm font-medium`}
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
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>

        <Dialog as="div" className="md:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="overflow-y-auto fixed inset-y-0 right-0 z-50 px-6 py-6 w-full bg-white dark:bg-gray-800 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex justify-between items-center">
              <Link to="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                <img src="/images/logo.png" alt="Авалон" className="w-auto h-12" />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
            <div className="flow-root mt-6">
              <div className="-my-6 divide-y divide-gray-500/10 dark:divide-gray-700">
                <div className="py-6 space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                        isActivePath(item.href)
                          ? 'bg-gray-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400'
                          : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <main className="flex-1" data-scroll="0">
        <Outlet />
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Contact</h3>
              <ul className="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <li>Phone: +359 82 82 82 82</li>
                <li>Email: office@avalon.bg</li>
                <li>Address: Ruse, Bulgaria</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Working Hours</h3>
              <ul className="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <li>Monday - Friday: 9:00 - 18:00</li>
                <li>Saturday: 10:00 - 14:00</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Follow Us</h3>
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
            © {new Date().getFullYear()} Avalon Real Estate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 
