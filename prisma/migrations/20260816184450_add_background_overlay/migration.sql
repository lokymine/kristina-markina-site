-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "homeLabel" TEXT NOT NULL DEFAULT 'Художник',
    "homeTitle" TEXT NOT NULL DEFAULT 'Кристина Маркина',
    "homeDescription" TEXT NOT NULL DEFAULT 'Авторские произведения искусства, современные художественные серии и уникальные работы.',
    "homeButtonText" TEXT NOT NULL DEFAULT 'Смотреть каталог',
    "heroImage" TEXT,
    "backgroundImage" TEXT,
    "backgroundColor" TEXT NOT NULL DEFAULT '#f8f7f3',
    "backgroundOverlay" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteSettings" ("backgroundColor", "backgroundImage", "createdAt", "heroImage", "homeButtonText", "homeDescription", "homeLabel", "homeTitle", "id", "updatedAt") SELECT "backgroundColor", "backgroundImage", "createdAt", "heroImage", "homeButtonText", "homeDescription", "homeLabel", "homeTitle", "id", "updatedAt" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
