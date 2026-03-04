-- DropForeignKey
ALTER TABLE "bank_copy_logs" DROP CONSTRAINT IF EXISTS "bank_copy_logs_guestId_fkey";

-- DropTable
DROP TABLE IF EXISTS "bank_copy_logs";

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('BANK_COPY', 'SEE_LOCATION', 'SAVE_THE_DATE', 'OPEN_INVITATION', 'COPY_LINK', 'SUBMIT_RSVP', 'SUBMIT_WISH', 'OTHER');

-- CreateTable
CREATE TABLE "action_logs" (
    "id" TEXT NOT NULL,
    "guestId" TEXT,
    "guestName" TEXT NOT NULL,
    "actionType" "ActionType" NOT NULL,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "action_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "action_logs_guestId_idx" ON "action_logs"("guestId");

-- CreateIndex
CREATE INDEX "action_logs_actionType_idx" ON "action_logs"("actionType");

-- CreateIndex
CREATE INDEX "action_logs_createdAt_idx" ON "action_logs"("createdAt" DESC);

-- AddForeignKey
ALTER TABLE "action_logs" ADD CONSTRAINT "action_logs_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
