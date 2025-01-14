import { Fragment, useState } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  XMarkIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { Link, Outlet, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import { useAuth } from '../../contexts/auth';
import { useTheme } from '../../hooks/useTheme';
import Logo from '../Logo';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Properties', href: '/admin/properties', icon: BuildingOfficeIcon },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Messages', href: '/admin/messages', icon: EnvelopeIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[rgb(var(--color-dark-bg))]">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[rgb(var(--color-dark-bg))]/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex flex-1 w-full max-w-xs mr-16">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 flex justify-center w-16 pt-5 left-full">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="w-6 h-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-[rgb(var(--color-dark-bg-secondary))] px-6 pb-4">
                  <div className="flex items-center h-16 shrink-0">
                    <Link to="/admin">
                      <Logo className="w-auto h-8" />
                    </Link>
                  </div>
                  <nav className="flex flex-col flex-1">
                    <ul role="list" className="flex flex-col flex-1 gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                to={item.href}
                                className={classNames(
                                  item.href === location.pathname
                                    ? 'bg-gray-100 text-primary-600'
                                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50 dark:text-[rgb(var(--color-dark-text))] dark:hover:bg-[rgb(var(--color-dark-border))]',
                                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                )}
                              >
                                <item.icon
                                  className={classNames(
                                    item.href === location.pathname
                                      ? 'text-primary-600'
                                      : 'text-gray-400 group-hover:text-primary-600 dark:text-[rgb(var(--color-dark-text-secondary))] dark:group-hover:text-primary-500',
                                    'h-6 w-6 shrink-0'
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-[rgb(var(--color-dark-border))] bg-white dark:bg-[rgb(var(--color-dark-bg-secondary))] px-6 pb-4">
          <div className="flex items-center h-16 shrink-0">
            <Link to="/admin">
              <Logo className="w-auto h-8" />
            </Link>
          </div>
          <nav className="flex flex-col flex-1">
            <ul role="list" className="flex flex-col flex-1 gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={classNames(
                          item.href === location.pathname
                            ? 'bg-gray-100 text-primary-600'
                            : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50 dark:text-[rgb(var(--color-dark-text))] dark:hover:bg-[rgb(var(--color-dark-border))]',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            item.href === location.pathname
                              ? 'text-primary-600'
                              : 'text-gray-400 group-hover:text-primary-600 dark:text-[rgb(var(--color-dark-text-secondary))] dark:group-hover:text-primary-500',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-[rgb(var(--color-dark-border))] bg-white dark:bg-[rgb(var(--color-dark-bg-secondary))] px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 dark:text-[rgb(var(--color-dark-text))] lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="w-6 h-6" aria-hidden="true" />
          </button>

          <div className="flex self-stretch flex-1 gap-x-4 lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <ThemeToggle />
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:lg:bg-[rgb(var(--color-dark-border))]" />
              <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  <span className="hidden lg:flex lg:items-center">
                    <span className="flex items-center justify-center w-8 h-8 text-sm font-medium text-white rounded-full bg-primary-600">
                      {user?.name?.split(' ').map(n => n[0]).join('')}
                    </span>
                    <span className="ml-2 text-sm font-semibold leading-6 text-gray-900 dark:text-[rgb(var(--color-dark-text))]" aria-hidden="true">
                      {user?.name}
                    </span>
                  </span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white dark:bg-[rgb(var(--color-dark-bg-secondary))] py-2 shadow-lg ring-1 ring-gray-900/5 dark:ring-[rgb(var(--color-dark-border))] focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={classNames(
                            active ? 'bg-gray-50 dark:bg-[rgb(var(--color-dark-border))]' : '',
                            'block w-full px-3 py-1 text-left text-sm leading-6 text-gray-600 dark:text-[rgb(var(--color-dark-text))]'
                          )}
                        >
                          Изход
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
      <Link
        to="/"
        className="fixed z-50 flex items-center p-3 text-white transition-all duration-300 ease-in-out rounded-l-full shadow-lg bottom-24 -right-1 group bg-primary-600 hover:pr-6 hover:right-0 hover:bg-primary-700 hover:shadow-xl hover:translate-x-1"
        title="Към сайта"
      >
        <HomeIcon className="w-6 h-6 transition-transform duration-300 ease-in-out transform group-hover:-rotate-90" aria-hidden="true" />
        <span className="text-sm font-medium max-w-0 group-hover:max-w-[200px] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out whitespace-nowrap overflow-hidden">
          Към сайта
        </span>
      </Link>
    </div>
  );
} 
