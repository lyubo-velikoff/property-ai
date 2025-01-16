import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// Data mapping constants
const CURRENCY_MAP = {
  euro: 'EUR',
  bgn: 'BGN',
} as const;

const CONSTRUCTION_TYPE_MAP = {
  brick: 'BRICK',
  epk: 'EPK',
  pk: 'PK',
  panel: 'PANEL',
  wood: 'WOOD_FLOOR',
} as const;

const FURNISHING_MAP = {
  furnished: 'FURNISHED',
  partially_furnished: 'PARTIALLY_FURNISHED',
  unfurnished: 'UNFURNISHED',
} as const;

const PROPERTY_TYPE_MAP = {
  apartment: 'APARTMENT',
  house: 'HOUSE',
  land: 'LAND',
  commercial: 'COMMERCIAL',
  industrial: 'INDUSTRIAL',
} as const;

const regions = [
  { id: 1, name: "главен път Е85" },
  { id: 2, name: "гр. Борово" },
  { id: 3, name: "гр. Бяла" },
  { id: 4, name: "гр. Ветово" },
  { id: 5, name: "гр. Глоджево" },
  { id: 6, name: "гр. Две могили" },
  { id: 7, name: "гр. Мартен" },
  { id: 8, name: "гр. Сеново" },
  { id: 9, name: "гр. Сливо поле" },
  { id: 10, name: "с. Бабово" },
  { id: 11, name: "с. Баниска" },
  { id: 12, name: "с. Басарбово" },
  { id: 13, name: "с. Батин" },
  { id: 14, name: "с. Батишница" },
  { id: 15, name: "с. Белцов" },
  { id: 16, name: "с. Беляново" },
  { id: 17, name: "с. Бистренци" },
  { id: 18, name: "с. Божичен" },
  { id: 19, name: "с. Борисово" },
  { id: 20, name: "с. Босилковци" },
  { id: 21, name: "с. Ботров" },
  { id: 22, name: "с. Брестовица" },
  { id: 23, name: "с. Бръшлен" },
  { id: 24, name: "с. Бъзовец" },
  { id: 25, name: "с. Бъзън" },
  { id: 26, name: "с. Волово" },
  { id: 27, name: "с. Голямо Враново" },
  { id: 28, name: "с. Горно Абланово" },
  { id: 29, name: "с. Джулюница" },
  { id: 30, name: "с. Долна Студена" },
  { id: 31, name: "с. Долно Абланово" },
  { id: 32, name: "с. Дряновец" },
  { id: 33, name: "с. Екзарх Йосиф" },
  { id: 34, name: "с. Иваново" },
  { id: 35, name: "с. Караманово" },
  { id: 36, name: "с. Каран Върбовка" },
  { id: 37, name: "с. Кацелово" },
  { id: 38, name: "с. Копривец" },
  { id: 39, name: "с. Кошарна" },
  { id: 40, name: "с. Кошов" },
  { id: 41, name: "с. Красен" },
  { id: 42, name: "с. Кривина" },
  { id: 43, name: "с. Кривня" },
  { id: 44, name: "с. Лом Черковна" },
  { id: 45, name: "с. Малко Враново" },
  { id: 46, name: "с. Мечка" },
  { id: 47, name: "с. Могилино" },
  { id: 48, name: "с. Николово" },
  { id: 49, name: "с. Нисово" },
  { id: 50, name: "с. Новград" },
  { id: 51, name: "с. Ново село" },
  { id: 52, name: "с. Обретеник" },
  { id: 53, name: "с. Острица" },
  { id: 54, name: "с. Пейчиново" },
  { id: 55, name: "с. Пепелина" },
  { id: 56, name: "с. Пет кладенци" },
  { id: 57, name: "с. Пиперково" },
  { id: 58, name: "с. Пиргово" },
  { id: 59, name: "с. Писанец" },
  { id: 60, name: "с. Полско Косово" },
  { id: 61, name: "с. Помен" },
  { id: 62, name: "с. Просена" },
  { id: 63, name: "с. Ряхово" },
  { id: 64, name: "с. Сандрово" },
  { id: 65, name: "с. Сваленик" },
  { id: 66, name: "с. Семерджиево" },
  { id: 67, name: "с. Смирненски" },
  { id: 68, name: "с. Стамболово" },
  { id: 69, name: "с. Стърмен" },
  { id: 70, name: "с. Табачка" },
  { id: 71, name: "с. Тетово" },
  { id: 72, name: "с. Тръстеник" },
  { id: 73, name: "с. Хотанца" },
  { id: 74, name: "с. Ценово" },
  { id: 75, name: "с. Церовец" },
  { id: 76, name: "с. Червен" },
  { id: 77, name: "с. Червена вода" },
  { id: 78, name: "с. Черешово" },
  { id: 79, name: "с. Чилнов" },
  { id: 80, name: "с. Широково" },
  { id: 81, name: "с. Щръклево" },
  { id: 82, name: "с. Юделник" },
  { id: 83, name: "с. Ястребово" }
];

const neighborhoods = [
  { id: 1, name: "Алеи Възраждане" },
  { id: 2, name: "Басарбово" },
  { id: 3, name: "Веждата" },
  { id: 4, name: "Възраждане" },
  { id: 5, name: "Долапите" },
  { id: 6, name: "Дружба 1" },
  { id: 7, name: "Дружба 2" },
  { id: 8, name: "Дружба 3" },
  { id: 9, name: "Завод Найден Киров" },
  { id: 10, name: "Захарна фабрика" },
  { id: 11, name: "Здравец" },
  { id: 12, name: "Здравец Изток" },
  { id: 13, name: "Здравец Север 1" },
  { id: 14, name: "Здравец Север 2" },
  { id: 15, name: "КТМ" },
  { id: 16, name: "Мальовица" },
  { id: 17, name: "Мидия Енос" },
  { id: 18, name: "Нова промишлена зона" },
  { id: 19, name: "Новата махала" },
  { id: 20, name: "Промишлена зона - Запад" },
  { id: 21, name: "Промишлена зона - Изток" },
  { id: 22, name: "Родина 1" },
  { id: 23, name: "Родина 2" },
  { id: 24, name: "Родина 3" },
  { id: 25, name: "Родина 4" },
  { id: 26, name: "Сарая" },
  { id: 27, name: "Средна кула" },
  { id: 28, name: "Товарна гара" },
  { id: 29, name: "Тракцията" },
  { id: 30, name: "Търговия на едро" },
  { id: 31, name: "Хъшове" },
  { id: 32, name: "Цветница" },
  { id: 33, name: "Централен кооп. Пазар" },
  { id: 34, name: "Централен южен район" },
  { id: 35, name: "Център" },
  { id: 36, name: "Чародейка - Север" },
  { id: 37, name: "Чародейка - Юг" },
  { id: 38, name: "Широк център" },
  { id: 39, name: "Ялта" },
  { id: 40, name: "в.з. Д. Басарбовски" },
  { id: 41, name: "в.з. Касева Чешма" },
  { id: 42, name: "в.з. Кръста" },
  { id: 43, name: "в.з. Кулата" },
  { id: 44, name: "в.з. Левента" },
  { id: 45, name: "в.з. Липака" },
  { id: 46, name: "в.з. Русофили" },
  { id: 47, name: "в.з. Средна кула" },
  { id: 48, name: "в.з. Трите гълъба" },
  { id: 49, name: "Птицекомбинат" },
  { id: 50, name: "с. Николово" }
];

const infrastructureFeatures = [
  { name: "Ток", type: "INFRASTRUCTURE" },
  { name: "Вода", type: "INFRASTRUCTURE" },
  { name: "Ограда", type: "INFRASTRUCTURE" },
  { name: "Асвалтов път", type: "INFRASTRUCTURE" },
  { name: "Черен път", type: "INFRASTRUCTURE" }
];

const buildingFeatures = [
  { name: "ТЕЦ", type: "BUILDING" },
  { name: "Газ", type: "BUILDING" },
  { name: "Климатик", type: "BUILDING" },
  { name: "Локално парно", type: "BUILDING" },
  { name: "В строеж", type: "BUILDING" },
  { name: "С преход", type: "BUILDING" },
  { name: "Асансьор", type: "BUILDING" },
  { name: "Гараж", type: "BUILDING" },
  { name: "Паркинг", type: "BUILDING" },
  { name: "С действащ бизнес", type: "BUILDING" },
  { name: "Видео наблюдение", type: "BUILDING" },
  { name: "Охрана", type: "BUILDING" },
  { name: "Саниран", type: "BUILDING" },
  { name: "Тераса", type: "BUILDING" }
];

async function main() {
  try {
    // Create admin user
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash('admin123', salt);

    const admin = await prisma.user.upsert({
      where: { email: 'admin@avalon.bg' },
      update: {},
      create: {
        email: 'admin@avalon.bg',
        name: 'Admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Created admin user:', admin.email);

    // Seed regions
    console.log('Seeding regions...');
    for (const region of regions) {
      await prisma.$transaction([
        prisma.$executeRaw`INSERT OR IGNORE INTO Region (id, name, createdAt, updatedAt) VALUES (${region.id}, ${region.name}, datetime('now'), datetime('now'))`
      ]);
    }

    // Seed neighborhoods
    console.log('Seeding neighborhoods...');
    for (const neighborhood of neighborhoods) {
      await prisma.$transaction([
        prisma.$executeRaw`INSERT OR IGNORE INTO Neighborhood (id, name, createdAt, updatedAt) VALUES (${neighborhood.id}, ${neighborhood.name}, datetime('now'), datetime('now'))`
      ]);
    }

    // Seed features
    console.log('Seeding features...');
    const allFeatures = [...infrastructureFeatures, ...buildingFeatures];
    for (const [index, feature] of allFeatures.entries()) {
      await prisma.$transaction([
        prisma.$executeRaw`INSERT OR IGNORE INTO Feature (id, name, type, createdAt, updatedAt) VALUES (${index + 1}, ${feature.name}, ${feature.type}, datetime('now'), datetime('now'))`
      ]);
    }

    // Create sample properties
    console.log('Creating sample properties...');
    const sampleProperties = [
      {
        title: 'Магазин, кв. Възраждане, 267000 €',
        description: 'Агенция за недвижими имоти АВАЛОН Ви представя магазин в кв. Възраждане. Имотът е с площ от 149 кв.м. и се намира на партерен етаж в тухлена сграда. Подходящ за всякакъв вид търговска дейност.',
        price: 267000,
        currency: 'EUR',
        area_sqm: 149,
        floor: 0,
        total_floors: 1,
        construction_type: 'BRICK',
        furnishing: 'UNFURNISHED',
        location_type: 'CITY',
        neighborhoodId: 4,
        has_regulation: false,
        category: 'SALE',
        type: 'COMMERCIAL',
        featured: false,
        contact_info: {
          phone: '+359888123456',
          email: 'office@avalon.bg'
        }
      },
      {
        title: 'Тристаен апартамент, кв. Дружба 3, 95000 €',
        description: 'Просторен тристаен апартамент в кв. Дружба 3. Имотът е с площ от 85 кв.м. и се намира на 4-ти етаж в панелна сграда. Състои се от хол, две спални, кухня, баня с тоалетна и две тераси.',
        price: 95000,
        currency: 'EUR',
        area_sqm: 85,
        floor: 4,
        total_floors: 8,
        construction_type: 'PANEL',
        furnishing: 'PARTIALLY_FURNISHED',
        location_type: 'CITY',
        neighborhoodId: 8,
        has_regulation: false,
        category: 'SALE',
        type: 'APARTMENT',
        featured: true,
        contact_info: {
          phone: '+359888123456',
          email: 'office@avalon.bg'
        }
      },
      {
        title: 'Къща, с. Николово, 120000 €',
        description: 'Двуетажна къща в с. Николово. Имотът е с площ от 180 кв.м. РЗП и двор от 1000 кв.м. Състои се от първи етаж с хол, кухня, баня с тоалетна и втори етаж с три спални и баня.',
        price: 120000,
        currency: 'EUR',
        area_sqm: 180,
        land_area_sqm: 1000,
        floor: 2,
        total_floors: 2,
        construction_type: 'BRICK',
        furnishing: 'FURNISHED',
        location_type: 'REGION',
        regionId: 48,
        has_regulation: true,
        category: 'SALE',
        type: 'HOUSE',
        featured: true,
        contact_info: {
          phone: '+359888123456',
          email: 'office@avalon.bg'
        }
      },
      {
        title: 'Парцел, с. Басарбово, 25000 €',
        description: 'Парцел в с. Басарбово с площ от 2000 кв.м. Имотът е с лице на главен път и е подходящ за жилищно строителство.',
        price: 25000,
        currency: 'EUR',
        area_sqm: 2000,
        location_type: 'REGION',
        regionId: 12,
        has_regulation: true,
        category: 'SALE',
        type: 'LAND',
        featured: false,
        contact_info: {
          phone: '+359888123456',
          email: 'office@avalon.bg'
        }
      }
    ];

    for (const propertyData of sampleProperties) {
      const property = await prisma.property.create({
        data: {
          ...propertyData,
          contact_info: {
            create: propertyData.contact_info
          }
        }
      });
      console.log('Created property:', property.title);
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main(); 
