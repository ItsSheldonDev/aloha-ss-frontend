/*
  Warnings:

  - The values [enAttente,validee,annulee] on the enum `StatutInscription` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `commentaire` on the `Inscription` table. All the data in the column will be lost.
  - You are about to drop the column `dateFormation` on the `Inscription` table. All the data in the column will be lost.
  - You are about to drop the column `dateInscription` on the `Inscription` table. All the data in the column will be lost.
  - You are about to drop the column `formation` on the `Inscription` table. All the data in the column will be lost.
  - Added the required column `formationId` to the `Inscription` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `dateNaissance` on the `Inscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('FORMATIONS_PRO', 'MIEUX_NOUS_CONNAITRE', 'CGV');

-- CreateEnum
CREATE TYPE "StatutFormation" AS ENUM ('PLANIFIEE', 'EN_COURS', 'TERMINEE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "TypeFormation" AS ENUM ('PSC1', 'PSE1', 'PSE2', 'BNSSA', 'SSA', 'SST', 'BSB');

-- AlterEnum
BEGIN;
CREATE TYPE "StatutInscription_new" AS ENUM ('EN_ATTENTE', 'VALIDEE', 'ANNULEE');
ALTER TABLE "Inscription" ALTER COLUMN "statut" DROP DEFAULT;
ALTER TABLE "Inscription" ALTER COLUMN "statut" TYPE "StatutInscription_new" USING ("statut"::text::"StatutInscription_new");
ALTER TYPE "StatutInscription" RENAME TO "StatutInscription_old";
ALTER TYPE "StatutInscription_new" RENAME TO "StatutInscription";
DROP TYPE "StatutInscription_old";
ALTER TABLE "Inscription" ALTER COLUMN "statut" SET DEFAULT 'EN_ATTENTE';
COMMIT;

-- AlterTable
ALTER TABLE "Inscription" DROP COLUMN "commentaire",
DROP COLUMN "dateFormation",
DROP COLUMN "dateInscription",
DROP COLUMN "formation",
ADD COLUMN     "formationId" TEXT NOT NULL,
DROP COLUMN "dateNaissance",
ADD COLUMN     "dateNaissance" DATE NOT NULL,
ALTER COLUMN "statut" SET DEFAULT 'EN_ATTENTE';

-- CreateTable
CREATE TABLE "Formation" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "type" "TypeFormation" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duree" TEXT NOT NULL,
    "placesTotal" INTEGER NOT NULL,
    "placesDisponibles" INTEGER NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "lieu" TEXT NOT NULL,
    "formateur" TEXT NOT NULL,
    "statut" "StatutFormation" NOT NULL DEFAULT 'PLANIFIEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Formation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "category" "DocumentCategory" NOT NULL,
    "size" INTEGER NOT NULL,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
