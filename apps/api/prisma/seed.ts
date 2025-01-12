import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin123', salt);

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

  // Create sample properties
  const properties = await Promise.all([
    prisma.property.create({
      data: {
        title: 'Modern Apartment in City Center',
        description: 'Beautiful modern apartment with great city views',
        price: 250000,
        currency: 'EUR',
        area_sqm: 85,
        floor: 5,
        construction_type: 'Brick',
        furnishing: 'Fully Furnished',
        location: 'Ruse, Center',
        category: 'SALE',
        type: 'APARTMENT',
        featured: true,
        images: {
          create: [
            { url: '/uploads/properties/apartment1-1.jpg' },
            { url: '/uploads/properties/apartment1-2.jpg' },
          ],
        },
        contact_info: {
          create: {
            phone: '+359888123456',
            email: 'agent1@avalon.bg',
          },
        },
      },
    }),
    prisma.property.create({
      data: {
        title: 'Luxury Villa with Pool',
        description: 'Spacious villa with private pool and garden',
        price: 750000,
        currency: 'EUR',
        area_sqm: 320,
        construction_type: 'Concrete',
        furnishing: 'Semi-Furnished',
        location: 'Ruse, Vazrazhdane',
        category: 'SALE',
        type: 'HOUSE',
        featured: true,
        images: {
          create: [
            { url: '/uploads/properties/villa1-1.jpg' },
            { url: '/uploads/properties/villa1-2.jpg' },
          ],
        },
        contact_info: {
          create: {
            phone: '+359888789012',
            email: 'agent2@avalon.bg',
          },
        },
      },
    }),
    prisma.property.create({
      data: {
        title: 'Commercial Space in Business District',
        description: 'Prime location office space with modern amenities',
        price: 450000,
        currency: 'EUR',
        area_sqm: 150,
        floor: 2,
        construction_type: 'Steel and Glass',
        furnishing: 'Unfurnished',
        location: 'Ruse, Business Park',
        category: 'SALE',
        type: 'OFFICE',
        featured: true,
        images: {
          create: [
            { url: '/uploads/properties/office1-1.jpg' },
            { url: '/uploads/properties/office1-2.jpg' },
          ],
        },
        contact_info: {
          create: {
            phone: '+359888345678',
            email: 'agent3@avalon.bg',
          },
        },
      },
    }),
  ]);

  console.log('Created sample properties:', properties.length);

  // Create sample contact messages
  const messages = await Promise.all([
    prisma.contactMessage.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Interested in the modern apartment. Please contact me for viewing.',
        isRead: false,
      },
    }),
    prisma.contactMessage.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        message: 'Looking for more information about the luxury villa.',
        isRead: true,
      },
    }),
  ]);

  console.log('Created sample contact messages:', messages.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
