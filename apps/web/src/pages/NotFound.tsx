import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-primary-600 mb-4">404</p>
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          Страницата не е намерена
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Страницата, която търсите, не съществува или е била преместена.
        </p>
        <div className="space-x-4">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Към началната страница
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Свържете се с нас
          </Link>
        </div>
      </div>
    </div>
  );
} 
