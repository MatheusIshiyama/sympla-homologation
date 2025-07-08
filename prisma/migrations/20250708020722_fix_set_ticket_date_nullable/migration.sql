-- AlterTable
ALTER TABLE "Participants" ALTER COLUMN "presentation_id" DROP NOT NULL,
ALTER COLUMN "ticket_created_at" DROP NOT NULL,
ALTER COLUMN "ticket_updated_at" DROP NOT NULL;
