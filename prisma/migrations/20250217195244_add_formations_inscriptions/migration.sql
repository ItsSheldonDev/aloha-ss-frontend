-- CreateEnum
CREATE TYPE "StatutFormation" AS ENUM ('PLANIFIEE', 'EN_COURS', 'TERMINEE', 'ANNULEE');

-- CreateEnum
CREATE TYPE "StatutInscription" AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE', 'ANNULEE');

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
CREATE TABLE "Inscription" (
    "id" TEXT NOT NULL,
    "formationId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3) NOT NULL,
    "statut" "StatutInscription" NOT NULL DEFAULT 'EN_ATTENTE',
    "commentaire" TEXT,
    "notifie" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Formation_date_idx" ON "Formation"("date");

-- CreateIndex
CREATE INDEX "Formation_type_idx" ON "Formation"("type");

-- CreateIndex
CREATE INDEX "Formation_statut_idx" ON "Formation"("statut");

-- CreateIndex
CREATE INDEX "Inscription_formationId_idx" ON "Inscription"("formationId");

-- CreateIndex
CREATE INDEX "Inscription_statut_idx" ON "Inscription"("statut");

-- CreateIndex
CREATE INDEX "Inscription_email_idx" ON "Inscription"("email");

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
