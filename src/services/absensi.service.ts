import ResponseError from "../errors/response.error";
import {
  CreateAbsensiRequest,
  HadirDetailRequest,
  UpdateAbsensiRequest,
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

  async getAbsensiByUser(user: customJwtPayload) {
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
      id: item.id,
      date: item.date,
      status: item.status,
      presentDetails: item.presenceDetails,
    }));
    return { status: 200, data: response };
  }

  async UpdateAbsensi(
    user: customJwtPayload,
    attendanceId: number,
    updatePayload: UpdateAbsensiRequest
  ) {
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        id: attendanceId,
        userId: user.id,
      },
      include: {
        presenceDetails: true,
      },
    });
    if (!existingAttendance) {
      throw new ResponseError(
        404,
        "Absensi tidak ditemukan atau Anda tidak berhak mengedit."
      );
    }
    const { status, foto_selfie_url, latitude, longitude, ...restData } =
      updatePayload;

    const dataToUpdate: any = {};
    const detailsToUpdate: any = {};
    if (status) {
      dataToUpdate.status = status;
    }
    if (foto_selfie_url !== undefined)
      detailsToUpdate.selfieUrl = foto_selfie_url;
    if (latitude !== undefined) detailsToUpdate.latitude = latitude;
    if (longitude !== undefined) detailsToUpdate.longitude = longitude;

    if (
      Object.keys(dataToUpdate).length > 0 ||
      Object.keys(detailsToUpdate).length > 0
    ) {
      if (
        Object.keys(detailsToUpdate).length > 0 &&
        (dataToUpdate.status === "HADIR" ||
          existingAttendance.status === "HADIR")
      ) {
        if (!existingAttendance.presenceDetails) {
          dataToUpdate.presenceDetails = { create: detailsToUpdate };
        } else {
          dataToUpdate.presenceDetails = { update: detailsToUpdate };
        }
      } else if (Object.keys(detailsToUpdate).length > 0) {
        throw new ResponseError(
          400,
          "Detail lokasi/foto hanya diizinkan jika status Absensi adalah HADIR."
        );
      }

      const updatedAttendance = await prisma.attendance.update({
        where: { id: attendanceId },
        data: dataToUpdate,
        include: { presenceDetails: true },
      });

      const responseData = {
        ...updatedAttendance,
        presenceDetails:
          updatedAttendance.status === "HADIR"
            ? updatedAttendance.presenceDetails
            : null,
      };

      return { status: 200, data: responseData };
    }
    throw new ResponseError(400, "Tidak ada data yang valid untuk diupdate.");
  }
}

export default new AbsensiService();
