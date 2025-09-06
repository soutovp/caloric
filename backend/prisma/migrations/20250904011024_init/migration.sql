/*
  Warnings:

  - You are about to drop the column `altura` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `peso` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "altura",
DROP COLUMN "peso",
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "weight" INTEGER;
