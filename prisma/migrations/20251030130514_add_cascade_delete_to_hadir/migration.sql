-- DropForeignKey
ALTER TABLE "public"."hadir" DROP CONSTRAINT "hadir_attendanceId_fkey";

-- AddForeignKey
ALTER TABLE "hadir" ADD CONSTRAINT "hadir_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "absensi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
