-- AlterTable
ALTER TABLE "Events" ADD COLUMN     "last_update_date" TIMESTAMP(3) NOT NULL DEFAULT '1970-01-01 00:00:00 +00:00';
