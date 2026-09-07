/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Artwork` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Artwork" ADD COLUMN "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Artwork_slug_key" ON "Artwork"("slug");
