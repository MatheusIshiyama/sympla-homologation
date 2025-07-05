/*
  Warnings:

  - You are about to drop the column `sympla_id` on the `Events` table. All the data in the column will be lost.
  - You are about to drop the column `customer_email` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `customer_name` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `sympla_id` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `ticket_type` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `total_amount` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the `Tickets` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sympla_event_id]` on the table `Events` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sympla_order_id]` on the table `Orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sympla_event_id` to the `Events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sympla_order_id` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('APPROVED', 'CANCELLED', 'PENDING', 'REFUNDED', 'NOT_APPROVED', 'UNPAID');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BOLETO_BANCARIO', 'CREDIT_CARD', 'DEBITO_ONLINE', 'DEBIT_CARD', 'FREE', 'MANUAL', 'PAYPAL', 'PDV');

-- DropForeignKey
ALTER TABLE "Tickets" DROP CONSTRAINT "Tickets_order_id_fkey";

-- DropIndex
DROP INDEX "Events_sympla_id_key";

-- DropIndex
DROP INDEX "Orders_sympla_id_key";

-- AlterTable
ALTER TABLE "Events" DROP COLUMN "sympla_id",
ADD COLUMN     "sympla_event_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "customer_email",
DROP COLUMN "customer_name",
DROP COLUMN "quantity",
DROP COLUMN "status",
DROP COLUMN "sympla_id",
DROP COLUMN "ticket_type",
DROP COLUMN "total_amount",
ADD COLUMN     "order_status" "OrderStatus" NOT NULL DEFAULT 'APPROVED',
ADD COLUMN     "sympla_order_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "Tickets";

-- CreateTable
CREATE TABLE "Participants" (
    "id" TEXT NOT NULL,
    "sympla_participant_id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "qr_code" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "checked_in" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Participants_sympla_participant_id_key" ON "Participants"("sympla_participant_id");

-- CreateIndex
CREATE UNIQUE INDEX "Events_sympla_event_id_key" ON "Events"("sympla_event_id");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_sympla_order_id_key" ON "Orders"("sympla_order_id");

-- AddForeignKey
ALTER TABLE "Participants" ADD CONSTRAINT "Participants_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
