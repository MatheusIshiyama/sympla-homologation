/*
  Warnings:

  - The `transaction_type` column on the `Orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `order_status` on the `Orders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "order_status",
ADD COLUMN     "order_status" TEXT NOT NULL,
DROP COLUMN "transaction_type",
ADD COLUMN     "transaction_type" TEXT;

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "TransactionType";
