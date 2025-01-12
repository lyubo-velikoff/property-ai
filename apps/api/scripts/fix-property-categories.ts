import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Update any properties with incorrect category values
    await prisma.property.updateMany({
      where: {
        category: 'Residential',
      },
      data: {
        category: 'SALE',
      },
    });

    console.log('Successfully updated property categories');
  } catch (error) {
    console.error('Error updating property categories:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 
