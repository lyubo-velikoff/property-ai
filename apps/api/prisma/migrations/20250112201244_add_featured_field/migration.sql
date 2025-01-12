-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "area_sqm" REAL NOT NULL,
    "floor" INTEGER,
    "construction_type" TEXT,
    "furnishing" TEXT,
    "location" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Property" ("area_sqm", "category", "construction_type", "createdAt", "currency", "description", "floor", "furnishing", "id", "location", "price", "title", "type", "updatedAt") SELECT "area_sqm", "category", "construction_type", "createdAt", "currency", "description", "floor", "furnishing", "id", "location", "price", "title", "type", "updatedAt" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
