import prisma from '../lib/prisma';

async function main() {
  console.log('Starting property enum updates...');

  // Get all properties that need updating
  const properties = await prisma.property.findMany({
    where: {
      OR: [
        { type: 'SHOP' },
        { type: 'WAREHOUSE' },
        { type: 'LAND' },
        { construction_type: 'WOOD_FLOOR' },
        { construction_type: 'PK' },
        { furnishing: 'FURNISHED' },
        { furnishing: 'PARTIALLY_FURNISHED' }
      ]
    }
  });

  console.log(`Found ${properties.length} properties to update`);

  // Update each property
  for (const property of properties) {
    const updates: any = {};

    // Update property type
    if (property.type === 'SHOP') {
      updates.type = 'COMMERCIAL';
    } else if (property.type === 'WAREHOUSE') {
      updates.type = 'INDUSTRIAL';
    } else if (property.type === 'LAND') {
      updates.type = 'PLOT';
    }

    // Update construction type
    if (property.construction_type === 'WOOD_FLOOR') {
      updates.construction_type = 'WOOD';
    } else if (property.construction_type === 'PK') {
      updates.construction_type = 'PANEL';
    }

    // Update furnishing type
    if (property.furnishing === 'FURNISHED') {
      updates.furnishing = 'FULLY_FURNISHED';
    } else if (property.furnishing === 'PARTIALLY_FURNISHED') {
      updates.furnishing = 'SEMI_FURNISHED';
    }

    if (Object.keys(updates).length > 0) {
      await prisma.property.update({
        where: { id: property.id },
        data: updates
      });
      console.log(`Updated property ${property.id}:`, updates);
    }
  }

  console.log('✅ Successfully updated property enums');
}

main()
  .catch((e) => {
    console.error('Error updating property enums:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
