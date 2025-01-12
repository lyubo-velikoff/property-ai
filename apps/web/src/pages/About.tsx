export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8">
          Авалон Недвижими Имоти е една от водещите агенции за недвижими имоти в София
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="mb-6">
            Нашата мисия е да предоставяме професионални услуги в областта на недвижимите имоти,
            съобразени с индивидуалните нужди на всеки клиент. Ние се стремим да бъдем надежден
            партньор при покупката, продажбата или наемането на имот.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Нашите услуги</h2>
          <ul className="space-y-2">
            <li>Продажба на жилищни имоти</li>
            <li>Отдаване под наем на жилищни имоти</li>
            <li>Продажба и наем на търговски площи</li>
            <li>Продажба и наем на офис площи</li>
            <li>Продажба на парцели и терени</li>
            <li>Консултации при сделки с недвижими имоти</li>
            <li>Съдействие при ипотечно кредитиране</li>
            <li>Правни консултации</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Информационни системи</h2>
          <p className="mb-4">
            Ние използваме съвременни информационни системи за управление на нашите имоти и клиенти:
          </p>
          <ul className="space-y-2">
            <li>
              <a
                href="https://avalon.bg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                www.avalon.bg
              </a>{' '}
              - Официален уебсайт на Авалон Недвижими Имоти
            </li>
            <li>
              <a
                href="https://naemi.avalon.bg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                naemi.avalon.bg
              </a>{' '}
              - Специализиран портал за наеми
            </li>
            <li>
              <a
                href="https://prodajbi.avalon.bg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700"
              >
                prodajbi.avalon.bg
              </a>{' '}
              - Специализиран портал за продажби
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Специални оферти</h2>
          <p className="mb-6">
            Разгледайте нашите специални оферти за имоти с отстъпки в цената или изгодни условия за
            наем. Свържете се с нас за повече информация относно текущите ни промоции и оферти.
          </p>

          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-semibold mb-4">Контакти</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">Адрес</h3>
                <p className="text-gray-600">ул. "Цар Асен" 95, София</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Телефони</h3>
                <p className="text-gray-600">+359 888 123 456</p>
                <p className="text-gray-600">+359 2 123 4567</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Имейл</h3>
                <p className="text-gray-600">office@avalon.bg</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900">Работно време</h3>
                <p className="text-gray-600">Понеделник - Петък: 9:00 - 18:00</p>
                <p className="text-gray-600">Събота: 10:00 - 14:00</p>
                <p className="text-gray-600">Неделя: Почивен ден</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
