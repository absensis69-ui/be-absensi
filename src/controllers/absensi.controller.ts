import { NextFunction, Response } from "express";
import { UserRequest } from "../models/users.interface";
import ResponseError from "../errors/response.error";
import {
  CreateAbsensiRequest,
  HadirDetailRequest,
  UpdateAbsensiRequest,
} from "../models/absensi.models";
import {
  createAbsensiValidation,
  HadirDetailValidation,
  UpdateAbsensiValidation,
} from "../validations/absensi.validation";
import absensiService from "../services/absensi.service";

class AbsensiController {
  async create(req: UserRequest, res: Response, next: NextFunction) {
    const user = req.user;
    if (!user) {
      return next(
        new ResponseError(401, "tidak ada akses silahkan login dahulu")
      );
    }

    try {
      const absenData: CreateAbsensiRequest = createAbsensiValidation.parse(
        req.body
      );

      let hadirDetail: HadirDetailRequest | undefined = undefined;
      if (absenData.status === "HADIR") {
        hadirDetail = HadirDetailValidation.parse(req.body);
      } else {
        const keysToCheck = ["foto_selfie_url", "latitude", "longitude"];
        if (keysToCheck.some((key) => req.body.hasOwnProperty(key))) {
          throw new ResponseError(
            400,
            "Detail lokasi dan foto hanya diizinkan jika status HADIR."
          );
        }
      }

      const result = await absensiService.createAbsen(
        user,
        absenData,
        hadirDetail
      );

      res.status(result.status).json({
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDetail(req: UserRequest, res: Response, next: NextFunction) {
    const user = req.user;
    if (!user) {
      return next(
        new ResponseError(401, "tidak ada akses silahkan login dahulu")
      );
    }

    try {
      const result = await absensiService.getAbsensiByUser(user);
      res.status(result.status).json({ data: result.data });
    } catch (error) {
      next(error);
    }
  }

  async update(req: UserRequest, res: Response, next: NextFunction) {
    const user = req.user;
    if (!user) {
      return next(
        new ResponseError(401, "Akses ditolak: User tidak terautentikasi.")
      );
    }

    try {
      let reqAttendanceId = req.params.id!;

      const attendanceId = parseInt(reqAttendanceId);

      if (isNaN(attendanceId)) {
        throw new ResponseError(
          400,
          "ID Absensi harus berupa angka yang valid."
        );
      }

      const updateData: UpdateAbsensiRequest = UpdateAbsensiValidation.parse(
        req.body
      );

      const result = await absensiService.UpdateAbsensi(
        user,
        attendanceId,
        updateData
      );

      res.status(result.status).json({
        message: "Absensi berhasil diupdate.",
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AbsensiController();
