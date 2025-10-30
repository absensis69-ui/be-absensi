import ResponseError from "../errors/response.error";
import {
  CreateAbsensiRequest,
  HadirDetailRequest,
} from "../models/absensi.models";
import { customJwtPayload } from "../models/users.interface";
import prisma from "../utils/prisma";

class AbsensiService {
  async createAbsen(
    user: customJwtPayload,
    absenData: CreateAbsensiRequest,
    hadirDetail?: HadirDetailRequest
  ) {
    const attendanceDate = new Date(absenData.date);
    const startOfDay = new Date(attendanceDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfNextDay = new Date(attendanceDate);
    endOfNextDay.setDate(endOfNextDay.getDate() + 1);
    endOfNextDay.setHours(0, 0, 0, 0);
    const existingAttendace = await prisma.attendance.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: startOfDay,
          lte: endOfNextDay,
        },
      },
    });

    if (existingAttendace) {
      throw new ResponseError(400, "anda sudah absen hari ini");
    }

    const isHadir = absenData.status === "HADIR";

    if (isHadir) {
      if (!hadirDetail) {
        throw new ResponseError(
          400,
          "jika status hadir lengkapi lokasi dan foto wajib di isi"
        );
      }

      const attendance = await prisma.attendance.create({
        data: {
          user: {
            connect: { id: user.id },
          },
          date: new Date(absenData.date),
          status: absenData.status,
          presenceDetails: {
            create: {
              selfieUrl: hadirDetail.foto_selfie_url,
              latitude: hadirDetail.latitude,
              longitude: hadirDetail.longitude,
            },
          },
        },
      });
      return { status: 201, data: attendance };
    } else {
      const attendance = await prisma.attendance.create({
        data: {
          user: {
            connect: { id: user.id },
          },
          date: new Date(absenData.date),
          status: absenData.status,
        },
      });
      return { status: 201, data: attendance };
    }
  }

  async getAbsensiById(user: customJwtPayload) {
    const attendance = await prisma.attendance.findMany({
      where: {
        userId: user.id,
      },
      include: {
        presenceDetails: true,
      },
    });
    if (!attendance) {
      throw new ResponseError(
        404,
        "detail absen tidak di temukan atau tidak memiliki akses"
      );
    }

    const response = attendance.map((item) => ({
      date: item.date,
      status: item.status,
      presentDetails: item.presenceDetails,
    }));
    return { status: 200, data: response };
  }
}

export default new AbsensiService();
