import { PrismaClient, Prisma } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { randomUUID } from 'crypto';

type GeneratedProperty = {
  title: string;
  description: string;
  price: number;
  currency: string;
  area_sqm: number;
  floor?: number;
  total_floors?: number;
  construction_type?: string;
  furnishing?: string;
  location_type: string;
  neighborhoodId?: number;
  regionId?: number;
  has_regulation?: boolean;
  category: string;
  type: string;
  featured: boolean;
  contact_info: {
    phone: string;
    email: string;
  };
};

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

type PropertyType = 'APARTMENT' | 'HOUSE' | 'LAND' | 'COMMERCIAL' | 'INDUSTRIAL';
type ConstructionType = 'BRICK' | 'EPK' | 'PK' | 'PANEL' | 'WOOD_FLOOR';
type FurnishingType = 'FURNISHED' | 'PARTIALLY_FURNISHED' | 'UNFURNISHED';
type LocationType = 'CITY' | 'REGION';

// Helper function to generate random properties
function generateRandomProperties(count: number): GeneratedProperty[] {
  const properties: GeneratedProperty[] = [];
  const propertyTypes = ['APARTMENT', 'HOUSE', 'LAND', 'COMMERCIAL', 'INDUSTRIAL'] as const;
  const constructionTypes = ['BRICK', 'EPK', 'PK', 'PANEL', 'WOOD_FLOOR'] as const;
  const furnishingTypes = ['FURNISHED', 'PARTIALLY_FURNISHED', 'UNFURNISHED'] as const;
  const locationTypes = ['CITY', 'REGION'] as const;

  for (let i = 0; i < count; i++) {
    const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
    const isCity = Math.random() > 0.5;
    const price = Math.floor(Math.random() * 300000) + 50000;
    const area = Math.floor(Math.random() * 200) + 50;

    const property: GeneratedProperty = {
      title: `${type === 'APARTMENT' ? 'Апартамент' : 
              type === 'HOUSE' ? 'Къща' :
              type === 'LAND' ? 'Парцел' :
              type === 'COMMERCIAL' ? 'Магазин' : 'Промишлено помещение'}, ${
              isCity ? 'кв. ' + neighborhoods[Math.floor(Math.random() * neighborhoods.length)].name :
                      'с. ' + regions[Math.floor(Math.random() * regions.length)].name
            }, ${price} €`,
      description: `${type === 'APARTMENT' ? 'Просторен апартамент' :
                    type === 'HOUSE' ? 'Двуетажна къща' :
                    type === 'LAND' ? 'Парцел' :
                    type === 'COMMERCIAL' ? 'Търговско помещение' : 'Промишлено помещение'} с площ от ${area} кв.м.`,
      price,
      currency: 'EUR',
      area_sqm: area,
      floor: type === 'APARTMENT' ? Math.floor(Math.random() * 8) + 1 : undefined,
      total_floors: type === 'APARTMENT' ? 8 : type === 'HOUSE' ? 2 : undefined,
      construction_type: type !== 'LAND' ? constructionTypes[Math.floor(Math.random() * constructionTypes.length)] : undefined,
      furnishing: type !== 'LAND' ? furnishingTypes[Math.floor(Math.random() * furnishingTypes.length)] : undefined,
      location_type: isCity ? 'CITY' : 'REGION',
      neighborhoodId: isCity ? neighborhoods[Math.floor(Math.random() * neighborhoods.length)].id : undefined,
      regionId: !isCity ? regions[Math.floor(Math.random() * regions.length)].id : undefined,
      has_regulation: type === 'LAND' ? Math.random() > 0.5 : undefined,
      category: Math.random() > 0.3 ? 'SALE' : 'RENT',
      type,
      featured: Math.random() > 0.8,
      contact_info: {
        phone: '+359888123456',
        email: 'office@avalon.bg'
      }
    };

    properties.push(property);
  }

  return properties;
}

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
  { id: 1, name: "Ток", type: "INFRASTRUCTURE" },
  { id: 2, name: "Вода", type: "INFRASTRUCTURE" },
  { id: 3, name: "Ограда", type: "INFRASTRUCTURE" },
  { id: 4, name: "Асвалтов път", type: "INFRASTRUCTURE" },
  { id: 5, name: "Черен път", type: "INFRASTRUCTURE" }
];

const buildingFeatures = [
  { id: 6, name: "ТЕЦ", type: "BUILDING" },
  { id: 7, name: "Газ", type: "BUILDING" },
  { id: 8, name: "Климатик", type: "BUILDING" },
  { id: 9, name: "Локално парно", type: "BUILDING" },
  { id: 10, name: "В строеж", type: "BUILDING" },
  { id: 11, name: "С преход", type: "BUILDING" },
  { id: 12, name: "Асансьор", type: "BUILDING" },
  { id: 13, name: "Гараж", type: "BUILDING" },
  { id: 14, name: "Паркинг", type: "BUILDING" },
  { id: 15, name: "С действащ бизнес", type: "BUILDING" },
  { id: 16, name: "Видео наблюдение", type: "BUILDING" },
  { id: 17, name: "Охрана", type: "BUILDING" },
  { id: 18, name: "Саниран", type: "BUILDING" },
  { id: 19, name: "Тераса", type: "BUILDING" }
];

async function main() {
  try {
    // Create admin user
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash('admin123', salt);

    await prisma.user.upsert({
      where: { email: 'admin@avalon.bg' },
      update: {},
      create: {
        id: randomUUID(),
        name: 'Admin',
        email: 'admin@avalon.bg',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    // Seed regions
    for (const region of regions) {
      await prisma.region.upsert({
        where: { id: region.id },
        update: { name: region.name },
        create: { id: region.id, name: region.name },
      });
    }

    // Seed neighborhoods
    for (const neighborhood of neighborhoods) {
      await prisma.neighborhood.upsert({
        where: { id: neighborhood.id },
        update: { name: neighborhood.name },
        create: { id: neighborhood.id, name: neighborhood.name },
      });
    }

    // Seed features
    for (const feature of [...infrastructureFeatures, ...buildingFeatures]) {
      await prisma.feature.upsert({
        where: { id: feature.id },
        update: { type: feature.type },
        create: { id: feature.id, name: feature.name, type: feature.type },
      });
    }

    // Generate and seed 100 random properties
    const properties = generateRandomProperties(100);
    for (const property of properties) {
      const propertyData: Prisma.PropertyCreateInput = {
        id: randomUUID(),
        title: property.title,
        description: property.description,
        price: property.price,
        currency: property.currency,
        area_sqm: property.area_sqm,
        floor: property.floor,
        total_floors: property.total_floors,
        construction_type: property.construction_type,
        furnishing: property.furnishing,
        location_type: property.location_type,
        neighborhood: property.neighborhoodId ? { connect: { id: property.neighborhoodId } } : undefined,
        region: property.regionId ? { connect: { id: property.regionId } } : undefined,
        has_regulation: property.has_regulation,
        category: property.category,
        type: property.type,
        featured: property.featured,
        contact_info: {
          create: {
            id: randomUUID(),
            phone: property.contact_info.phone,
            email: property.contact_info.email
          }
        }
      };

      await prisma.property.create({
        data: propertyData,
      });
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
