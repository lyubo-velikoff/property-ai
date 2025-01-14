/*
  Warnings:

  - You are about to drop the column `location` on the `Property` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Region" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Neighborhood" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Feature" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PropertyFeature" (
    "propertyId" TEXT NOT NULL,
    "featureId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("propertyId", "featureId"),
    CONSTRAINT "PropertyFeature_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PropertyFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BGN',
    "area_sqm" REAL NOT NULL,
    "land_area_sqm" REAL,
    "floor" INTEGER,
    "total_floors" INTEGER,
    "construction_type" TEXT,
    "furnishing" TEXT,
    "location_type" TEXT NOT NULL DEFAULT 'CITY',
    "regionId" INTEGER,
    "neighborhoodId" INTEGER,
    "has_regulation" BOOLEAN,
    "category" TEXT NOT NULL DEFAULT 'SALE',
    "type" TEXT NOT NULL DEFAULT 'APARTMENT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Property_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Property_neighborhoodId_fkey" FOREIGN KEY ("neighborhoodId") REFERENCES "Neighborhood" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Property" ("area_sqm", "category", "construction_type", "createdAt", "currency", "description", "featured", "floor", "furnishing", "id", "price", "title", "type", "updatedAt") SELECT "area_sqm", "category", "construction_type", "createdAt", "currency", "description", "featured", "floor", "furnishing", "id", "price", "title", "type", "updatedAt" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
CREATE INDEX "Property_category_idx" ON "Property"("category");
CREATE INDEX "Property_type_idx" ON "Property"("type");
CREATE INDEX "Property_regionId_idx" ON "Property"("regionId");
CREATE INDEX "Property_neighborhoodId_idx" ON "Property"("neighborhoodId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
