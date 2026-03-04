-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('hadir', 'tidak_hadir');

-- CreateTable
CREATE TABLE "guests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "maxQuota" INTEGER NOT NULL DEFAULT 2,
    "uniqueToken" TEXT NOT NULL,
    "isOpened" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rsvp" (
    "id" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "attendanceStatus" "AttendanceStatus" NOT NULL,
    "numberOfAttendees" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rsvp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishes" (
    "id" TEXT NOT NULL,
    "guestId" TEXT,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "attendanceStatus" "AttendanceStatus",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guests_uniqueToken_key" ON "guests"("uniqueToken");

-- CreateIndex
CREATE INDEX "guests_uniqueToken_idx" ON "guests"("uniqueToken");

-- CreateIndex
CREATE UNIQUE INDEX "rsvp_guestId_key" ON "rsvp"("guestId");

-- CreateIndex
CREATE INDEX "rsvp_guestId_idx" ON "rsvp"("guestId");

-- CreateIndex
CREATE INDEX "wishes_createdAt_idx" ON "wishes"("createdAt" DESC);

-- AddForeignKey
ALTER TABLE "rsvp" ADD CONSTRAINT "rsvp_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "guests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishes" ADD CONSTRAINT "wishes_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
