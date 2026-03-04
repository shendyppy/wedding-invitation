-- AlterTable
ALTER TABLE "guests" ADD COLUMN     "rsvpSubmitted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rsvpSubmittedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "wishes" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "bank_copy_logs" (
    "id" TEXT NOT NULL,
    "guestId" TEXT,
    "guestName" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_copy_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bank_copy_logs_guestId_idx" ON "bank_copy_logs"("guestId");

-- CreateIndex
CREATE INDEX "bank_copy_logs_createdAt_idx" ON "bank_copy_logs"("createdAt" DESC);

-- AddForeignKey
ALTER TABLE "bank_copy_logs" ADD CONSTRAINT "bank_copy_logs_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
