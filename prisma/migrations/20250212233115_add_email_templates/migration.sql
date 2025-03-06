/*
  Warnings:

  - You are about to drop the column `variables` on the `EmailTemplate` table. All the data in the column will be lost.
  - You are about to drop the `Formation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NotificationHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NotificationSettings` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `EmailTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EmailType" AS ENUM ('INSCRIPTION', 'CONTACT', 'NOTIFICATION');

-- DropForeignKey
ALTER TABLE "Inscription" DROP CONSTRAINT "Inscription_formationId_fkey";

-- AlterTable
ALTER TABLE "EmailTemplate" DROP COLUMN "variables",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "type" "EmailType" NOT NULL;

-- DropTable
DROP TABLE "Formation";

-- DropTable
DROP TABLE "Inscription";

-- DropTable
DROP TABLE "NotificationHistory";

-- DropTable
DROP TABLE "NotificationSettings";

-- DropEnum
DROP TYPE "StatutFormation";

-- DropEnum
DROP TYPE "StatutInscription";
