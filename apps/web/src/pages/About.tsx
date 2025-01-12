export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section with Image */}
          <div className="relative rounded-2xl overflow-hidden mb-12 shadow-xl">
            <img
              src="/images/about-us.jpg"
              alt="Авалон Недвижими Имоти Office"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Авалон Недвижими Имоти
              </h1>
              <p className="text-xl text-gray-200">
                Една от водещите агенции за недвижими имоти в София
              </p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-lg leading-relaxed mb-8">
              Нашата мисия е да предоставяме професионални услуги в областта на недвижимите имоти,
              съобразени с индивидуалните нужди на всеки клиент. Ние се стремим да бъдем надежден
              партньор при покупката, продажбата или наемането на имот.
            </p>

            <h2 className="text-3xl font-semibold mt-12 mb-6">Нашите услуги</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                    Продажба на жилищни имоти
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                    Отдаване под наем на жилищни имоти
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                    Продажба и наем на търговски площи
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                    Продажба и наем на офис площи
                  </li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                    Продажба на парцели и терени
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                    Консултации при сделки с недвижими имоти
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                    Съдействие при ипотечно кредитиране
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                    Правни консултации
                  </li>
                </ul>
              </div>
            </div>

            <h2 className="text-3xl font-semibold mt-12 mb-6">Информационни системи</h2>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <p className="mb-4">
                Ние използваме съвременни информационни системи за управление на нашите имоти и клиенти:
              </p>
              <ul className="space-y-4">
                <li>
                  <a
                    href="https://avalon.bg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                    www.avalon.bg - Официален уебсайт на Авалон Недвижими Имоти
                  </a>
                </li>
                <li>
                  <a
                    href="https://naemi.avalon.bg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                    naemi.avalon.bg - Специализиран портал за наеми
                  </a>
                </li>
                <li>
                  <a
                    href="https://prodajbi.avalon.bg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    <span className="w-2 h-2 bg-primary-600 rounded-full mr-2"></span>
                    prodajbi.avalon.bg - Специализиран портал за продажби
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg mt-12">
              <h2 className="text-3xl font-semibold mb-6">Контакти</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Адрес</h3>
                    <p className="text-gray-600 dark:text-gray-300">ул. "Цар Асен" 95, София</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Телефони</h3>
                    <p className="text-gray-600 dark:text-gray-300">+359 888 123 456</p>
                    <p className="text-gray-600 dark:text-gray-300">+359 2 123 4567</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Имейл</h3>
                    <p className="text-gray-600 dark:text-gray-300">office@avalon.bg</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Работно време</h3>
                    <p className="text-gray-600 dark:text-gray-300">Понеделник - Петък: 9:00 - 18:00</p>
                    <p className="text-gray-600 dark:text-gray-300">Събота: 10:00 - 14:00</p>
                    <p className="text-gray-600 dark:text-gray-300">Неделя: Почивен ден</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
