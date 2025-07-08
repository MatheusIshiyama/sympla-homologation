/*
  Warnings:

  - You are about to drop the column `checked_in` on the `Participants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Participants" DROP COLUMN "checked_in",
ADD COLUMN     "check_in" BOOLEAN NOT NULL DEFAULT false;
