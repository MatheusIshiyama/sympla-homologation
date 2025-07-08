/*
  Warnings:

  - You are about to drop the column `sympla_event_id` on the `Events` table. All the data in the column will be lost.
  - You are about to drop the column `sympla_order_id` on the `Orders` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `Participants` table. All the data in the column will be lost.
  - You are about to drop the column `qr_code` on the `Participants` table. All the data in the column will be lost.
  - You are about to drop the column `sympla_participant_id` on the `Participants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reference_id]` on the table `Events` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reference_id]` on the table `Orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reference_id]` on the table `Participants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `end_date` to the `Events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference_id` to the `Events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `Events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_date` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference_id` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `Participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `Participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_date` to the `Participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_status` to the `Participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_updated_date` to the `Participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `presentation_id` to the `Participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference_id` to the `Participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticket_created_at` to the `Participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticket_num_qr_code` to the `Participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticket_number` to the `Participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticket_updated_at` to the `Participants` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Events_sympla_event_id_key";

-- DropIndex
DROP INDEX "Orders_sympla_order_id_key";

-- DropIndex
DROP INDEX "Participants_sympla_participant_id_key";

-- AlterTable
ALTER TABLE "Events" DROP COLUMN "sympla_event_id",
ADD COLUMN     "cancelled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "category_prim" TEXT,
ADD COLUMN     "category_sec" TEXT,
ADD COLUMN     "detail" TEXT,
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "private_event" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reference_id" TEXT NOT NULL,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "url" TEXT,
ALTER COLUMN "active" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "sympla_order_id",
ADD COLUMN     "approved_date" TIMESTAMP(3),
ADD COLUMN     "buyer_email" TEXT,
ADD COLUMN     "buyer_first_name" TEXT,
ADD COLUMN     "buyer_last_name" TEXT,
ADD COLUMN     "order_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "order_total_net_value" DOUBLE PRECISION,
ADD COLUMN     "order_total_sale_price" DOUBLE PRECISION,
ADD COLUMN     "reference_id" TEXT NOT NULL,
ADD COLUMN     "transaction_type" "TransactionType",
ADD COLUMN     "updated_date" TIMESTAMP(3),
ADD COLUMN     "utm_id" TEXT;

-- AlterTable
ALTER TABLE "Participants" DROP COLUMN "number",
DROP COLUMN "qr_code",
DROP COLUMN "sympla_participant_id",
ADD COLUMN     "access_information" TEXT,
ADD COLUMN     "check_in_date" TIMESTAMP(3),
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "marked_place_name" TEXT,
ADD COLUMN     "order_approved_date" TIMESTAMP(3),
ADD COLUMN     "order_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "order_discount" TEXT,
ADD COLUMN     "order_status" TEXT NOT NULL,
ADD COLUMN     "order_updated_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "pdv_user" TEXT,
ADD COLUMN     "presentation_id" TEXT NOT NULL,
ADD COLUMN     "reference_id" TEXT NOT NULL,
ADD COLUMN     "sector_name" TEXT,
ADD COLUMN     "ticket_created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ticket_name" TEXT,
ADD COLUMN     "ticket_num_qr_code" TEXT NOT NULL,
ADD COLUMN     "ticket_number" TEXT NOT NULL,
ADD COLUMN     "ticket_sale_price" DOUBLE PRECISION,
ADD COLUMN     "ticket_updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Addresses" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "address_num" TEXT,
    "address_alt" TEXT,
    "neighborhood" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "zip_code" TEXT,
    "country" TEXT,
    "lon" DOUBLE PRECISION,
    "lat" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hosts" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UTMs" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "utm_term" TEXT,
    "utm_content" TEXT,
    "user_agent" TEXT,
    "referrer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UTMs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Addresses_event_id_key" ON "Addresses"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "Hosts_event_id_key" ON "Hosts"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "UTMs_order_id_key" ON "UTMs"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Events_reference_id_key" ON "Events"("reference_id");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_reference_id_key" ON "Orders"("reference_id");

-- CreateIndex
CREATE UNIQUE INDEX "Participants_reference_id_key" ON "Participants"("reference_id");

-- AddForeignKey
ALTER TABLE "Addresses" ADD CONSTRAINT "Addresses_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hosts" ADD CONSTRAINT "Hosts_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UTMs" ADD CONSTRAINT "UTMs_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
