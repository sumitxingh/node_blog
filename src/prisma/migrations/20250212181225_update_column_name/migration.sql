/*
  Warnings:

  - You are about to drop the column `featuredImage` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "post" DROP COLUMN "featuredImage",
ADD COLUMN     "featured_image" TEXT;
