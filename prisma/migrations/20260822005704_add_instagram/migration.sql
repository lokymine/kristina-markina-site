-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contacts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT,
    "email" TEXT,
    "telegram" TEXT,
    "vk" TEXT,
    "whatsapp" TEXT,
    "instagram" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Contacts" ("email", "id", "phone", "telegram", "updatedAt", "vk", "whatsapp") SELECT "email", "id", "phone", "telegram", "updatedAt", "vk", "whatsapp" FROM "Contacts";
DROP TABLE "Contacts";
ALTER TABLE "new_Contacts" RENAME TO "Contacts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
