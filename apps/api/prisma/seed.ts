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

    // Create sample property
    console.log('Creating sample property...');
    const propertyId = await prisma.$transaction(async (tx) => {
      // Create property
      const result = await tx.$queryRaw<{ id: string }[]>`
        INSERT INTO Property (
          id, title, description, price, currency, area_sqm, floor,
          total_floors, construction_type, furnishing, location_type,
          neighborhoodId, category, type, featured, has_regulation,
          createdAt, updatedAt
        ) VALUES (
          ${randomUUID()},
          'Магазин, кв. Възраждане, 267000 Е',
          'Агенция за недвижими имоти АВАЛОН Ви представя, МАГАЗИН с голяма витрина и лице към улица 15 метра...',
          267000,
          ${CURRENCY_MAP.euro},
          149,
          0,
          1,
          ${CONSTRUCTION_TYPE_MAP.brick},
          ${FURNISHING_MAP.unfurnished},
          'CITY',
          4,
          'SALE',
          ${PROPERTY_TYPE_MAP.commercial},
          false,
          false,
          datetime('now'),
          datetime('now')
        ) RETURNING id;
      `;

      const id = result[0].id;

      // Create features
      await tx.$executeRaw`
        INSERT INTO PropertyFeature (propertyId, featureId, createdAt, updatedAt)
        VALUES 
          (${id}, 1, datetime('now'), datetime('now')),
          (${id}, 2, datetime('now'), datetime('now')),
          (${id}, 4, datetime('now'), datetime('now'));
      `;

      // Create image
      await tx.$executeRaw`
        INSERT INTO Image (id, url, propertyId, createdAt, updatedAt)
        VALUES (${randomUUID()}, '/uploads/properties/2803.jpg', ${id}, datetime('now'), datetime('now'));
      `;

      // Create contact info
      await tx.$executeRaw`
        INSERT INTO ContactInfo (id, phone, email, propertyId, createdAt, updatedAt)
        VALUES (${randomUUID()}, '0895 606 165', 'agent@avalon.bg', ${id}, datetime('now'), datetime('now'));
      `;

      return id;
    });

    console.log('Created sample property:', propertyId);

  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await prisma.$disconnect();
  }
}

main(); 
