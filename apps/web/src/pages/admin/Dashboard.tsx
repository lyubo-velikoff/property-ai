import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import api from '../../lib/api';
import type { ApiResponse } from '../../types/api';

interface Stats {
  properties: number;
  messages: number;
  users: number;
}

export default function Dashboard() {
  const { data: stats, isLoading, error } = useQuery<Stats>({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const response = await api.get<Stats>('/admin/stats');
      console.log('Stats:', response.data);
      return response.data;
    }
  });

  const cards = [
    {
      name: 'Имоти',
      value: stats?.properties || 0,
      icon: HomeIcon,
      to: '/admin/properties',
      color: 'bg-red-500',
    },
    {
      name: 'Съобщения',
      value: stats?.messages || 0,
      icon: ChatBubbleLeftRightIcon,
      to: '/admin/messages',
      color: 'bg-blue-500',
    },
    {
      name: 'Потребители',
      value: stats?.users || 0,
      icon: UsersIcon,
      to: '/admin/users',
      color: 'bg-green-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Табло</h1>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.name}
            to={card.to}
            className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                {card.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{card.value}</p>
            </dd>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Последна активност</h2>
        <div className="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* Add recent activity items here */}
            <li className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  Скоро ще бъде добавена информация за последната активност
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 
