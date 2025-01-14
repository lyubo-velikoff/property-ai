import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <SunIcon className="h-5 w-5" aria-hidden="true" />;
      case 'dark':
        return <MoonIcon className="h-5 w-5" aria-hidden="true" />;
      case 'gray':
        return <ComputerDesktopIcon className="h-5 w-5" aria-hidden="true" />;
      default:
        return <SunIcon className="h-5 w-5" aria-hidden="true" />;
    }
  };

  const themes = [
    { name: 'Light', value: 'light', icon: SunIcon },
    { name: 'Dark', value: 'dark', icon: MoonIcon },
    { name: 'Gray', value: 'gray', icon: ComputerDesktopIcon },
  ];

  return (
    <Menu as="div" className="relative">
      <Menu.Button
        className="rounded-md p-2 text-gray-700 dark:text-[rgb(var(--color-dark-text))] hover:bg-gray-50 dark:hover:bg-[rgb(var(--color-dark-border))] focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Select theme"
      >
        {getIcon()}
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white dark:bg-[rgb(var(--color-dark-bg-secondary))] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {themes.map((themeOption) => (
              <Menu.Item key={themeOption.value}>
                {({ active }) => (
                  <button
                    onClick={() => setTheme(themeOption.value as 'light' | 'dark' | 'gray')}
                    className={classNames(
                      active ? 'bg-gray-100 dark:bg-[rgb(var(--color-dark-border))]' : '',
                      theme === themeOption.value ? 'text-primary-600 dark:text-primary-500' : 'text-gray-700 dark:text-[rgb(var(--color-dark-text))]',
                      'group flex w-full items-center px-4 py-2 text-sm'
                    )}
                  >
                    <themeOption.icon
                      className={classNames(
                        'mr-3 h-5 w-5',
                        theme === themeOption.value ? 'text-primary-600 dark:text-primary-500' : 'text-gray-400 dark:text-[rgb(var(--color-dark-text-secondary))]'
                      )}
                      aria-hidden="true"
                    />
                    {themeOption.name}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 
