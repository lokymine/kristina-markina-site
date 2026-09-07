-- CreateTable
CREATE TABLE "FontAsset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_About" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "title" TEXT NOT NULL DEFAULT 'О художнике',
    "description" TEXT NOT NULL DEFAULT '',
    "image" TEXT,
    "titleColor" TEXT NOT NULL DEFAULT '#292722',
    "descriptionColor" TEXT NOT NULL DEFAULT '#5f5b54',
    "fontFamily" TEXT NOT NULL DEFAULT 'system',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_About" ("description", "id", "image", "title", "updatedAt") SELECT "description", "id", "image", "title", "updatedAt" FROM "About";
DROP TABLE "About";
ALTER TABLE "new_About" RENAME TO "About";
CREATE TABLE "new_Contacts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "phone" TEXT,
    "email" TEXT,
    "telegram" TEXT,
    "vk" TEXT,
    "whatsapp" TEXT,
    "instagram" TEXT,
    "fontFamily" TEXT NOT NULL DEFAULT 'system',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Contacts" ("createdAt", "email", "id", "instagram", "phone", "telegram", "updatedAt", "vk", "whatsapp") SELECT "createdAt", "email", "id", "instagram", "phone", "telegram", "updatedAt", "vk", "whatsapp" FROM "Contacts";
DROP TABLE "Contacts";
ALTER TABLE "new_Contacts" RENAME TO "Contacts";
CREATE TABLE "new_SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "homeLabel" TEXT NOT NULL DEFAULT 'Художник',
    "homeTitle" TEXT NOT NULL DEFAULT 'Кристина Маркина',
    "homeDescription" TEXT NOT NULL DEFAULT 'Авторские произведения искусства, современные художественные серии и уникальные работы.',
    "homeButtonText" TEXT NOT NULL DEFAULT 'Смотреть каталог',
    "heroImage" TEXT,
    "backgroundImage" TEXT,
    "backgroundColor" TEXT NOT NULL DEFAULT '#f8f7f3',
    "homeTextColor" TEXT NOT NULL DEFAULT '#292722',
    "homeLabelColor" TEXT NOT NULL DEFAULT '#292722',
    "homeTitleColor" TEXT NOT NULL DEFAULT '#292722',
    "homeDescriptionColor" TEXT NOT NULL DEFAULT '#292722',
    "homeButtonColor" TEXT NOT NULL DEFAULT '#292722',
    "homeButtonTextColor" TEXT NOT NULL DEFAULT '#f8f7f3',
    "homeFontFamily" TEXT NOT NULL DEFAULT 'system',
    "homeLayout" TEXT NOT NULL DEFAULT 'left',
    "backgroundOverlay" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteSettings" ("backgroundColor", "backgroundImage", "backgroundOverlay", "createdAt", "heroImage", "homeButtonColor", "homeButtonText", "homeButtonTextColor", "homeDescription", "homeLabel", "homeLayout", "homeTextColor", "homeTitle", "id", "updatedAt") SELECT "backgroundColor", "backgroundImage", "backgroundOverlay", "createdAt", "heroImage", "homeButtonColor", "homeButtonText", "homeButtonTextColor", "homeDescription", "homeLabel", "homeLayout", "homeTextColor", "homeTitle", "id", "updatedAt" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "FontAsset_url_key" ON "FontAsset"("url");
