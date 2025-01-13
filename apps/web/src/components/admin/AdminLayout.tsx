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
import { useUser } from '../../contexts/UserContext';

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
  const { user, logout } = useUser();

  const isActivePath = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="flex fixed inset-0">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="flex relative flex-1 mr-16 w-full max-w-xs">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="flex absolute top-0 left-full justify-center items-center pt-5 w-16">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="w-6 h-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex overflow-y-auto flex-col px-6 pb-4 bg-white grow dark:bg-gray-800">
                  <div className="flex items-center h-16 shrink-0">
                    <img className="w-auto h-8" src="/images/logo.png" alt="Avalon" />
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
                                  isActivePath(item.href)
                                    ? 'bg-gray-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400'
                                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700',
                                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                )}
                              >
                                <item.icon
                                  className={classNames(
                                    isActivePath(item.href)
                                      ? 'text-primary-600 dark:text-primary-400'
                                      : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white',
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
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex overflow-y-auto flex-col px-6 pb-4 bg-white border-r border-gray-200 grow dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center h-16 shrink-0">
            <img className="w-auto h-8" src="/images/logo.png" alt="Avalon" />
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
                          isActivePath(item.href)
                            ? 'bg-gray-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        <item.icon
                          className={classNames(
                            isActivePath(item.href)
                              ? 'text-primary-600 dark:text-primary-400'
                              : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white',
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
        <div className="flex sticky top-0 z-40 gap-x-4 items-center px-4 h-16 bg-white border-b border-gray-200 shadow-sm shrink-0 dark:border-gray-700 dark:bg-gray-800 sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="w-6 h-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex gap-x-4 items-center ml-auto lg:gap-x-6">
              <ThemeToggle />
              <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  <span className="hidden text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 lg:block">
                    {user?.name}
                  </span>
                  <img
                    className="w-8 h-8 bg-gray-50 rounded-full"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || 'Admin'
                    )}&background=random`}
                    alt=""
                  />
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
                  <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-gray-900/5 dark:ring-gray-700 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/admin/profile"
                          className={classNames(
                            active ? 'bg-gray-50 dark:bg-gray-700' : '',
                            'block px-3 py-1 text-sm leading-6 text-gray-900 dark:text-gray-300'
                          )}
                        >
                          Profile
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={classNames(
                            active ? 'bg-gray-50 dark:bg-gray-700' : '',
                            'block w-full text-left px-3 py-1 text-sm leading-6 text-gray-900 dark:text-gray-300'
                          )}
                        >
                          Sign out
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
    </div>
  );
} 
