/*
  Warnings:

  - You are about to drop the column `father` on the `Genero` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Genero" DROP CONSTRAINT "Genero_father_fkey";

-- AlterTable
ALTER TABLE "Genero" DROP COLUMN "father",
ADD COLUMN     "fatherId" INTEGER;

-- AddForeignKey
ALTER TABLE "Genero" ADD CONSTRAINT "Genero_fatherId_fkey" FOREIGN KEY ("fatherId") REFERENCES "Genero"("id") ON DELETE SET NULL ON UPDATE CASCADE;
