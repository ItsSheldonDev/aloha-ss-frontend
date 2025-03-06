/*
  Warnings:

  - You are about to drop the column `commentaire` on the `Inscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Inscription" DROP COLUMN "commentaire",
ADD COLUMN     "message" TEXT;
