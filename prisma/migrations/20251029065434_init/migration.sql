-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('HADIR', 'SAKIT', 'CUTI', 'LIBUR');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone_number" TEXT,
    "id_number" TEXT,
    "birth_date" DATE,
    "job_tittle" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "absensi" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "status" "AttendanceStatus" NOT NULL,

    CONSTRAINT "absensi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hadir" (
    "id" SERIAL NOT NULL,
    "attendanceId" INTEGER NOT NULL,
    "foto_selfie_url" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "hadir_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "absensi_userId_date_key" ON "absensi"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "hadir_attendanceId_key" ON "hadir"("attendanceId");

-- AddForeignKey
ALTER TABLE "absensi" ADD CONSTRAINT "absensi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hadir" ADD CONSTRAINT "hadir_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "absensi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
