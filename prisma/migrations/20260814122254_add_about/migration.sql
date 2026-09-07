-- CreateTable
CREATE TABLE "About" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "title" TEXT NOT NULL DEFAULT 'О художнике',
    "description" TEXT NOT NULL,
    "image" TEXT,
    "updatedAt" DATETIME NOT NULL
);
