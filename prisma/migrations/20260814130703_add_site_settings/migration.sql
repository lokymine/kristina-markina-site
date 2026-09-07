-- CreateTable
CREATE TABLE "Contacts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "phone" TEXT,
    "email" TEXT,
    "telegram" TEXT,
    "vk" TEXT,
    "whatsapp" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HomeSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "label" TEXT NOT NULL DEFAULT 'Художник',
    "title" TEXT NOT NULL DEFAULT 'Кристина Маркина',
    "description" TEXT NOT NULL DEFAULT '',
    "buttonText" TEXT NOT NULL DEFAULT 'Смотреть каталог',
    "heroImage" TEXT,
    "backgroundImage" TEXT,
    "backgroundColor" TEXT NOT NULL DEFAULT '#f8f7f3',
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_About" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "title" TEXT NOT NULL DEFAULT 'О художнике',
    "description" TEXT NOT NULL DEFAULT '',
    "image" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_About" ("description", "id", "image", "title", "updatedAt") SELECT "description", "id", "image", "title", "updatedAt" FROM "About";
DROP TABLE "About";
ALTER TABLE "new_About" RENAME TO "About";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
