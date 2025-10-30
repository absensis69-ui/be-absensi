import { z } from "zod";
import {
  createAbsensiValidation,
  HadirDetailValidation,
  UpdateAbsensiValidation,
} from "../validations/absensi.validation";

export type CreateAbsensiRequest = z.infer<typeof createAbsensiValidation>;
export type HadirDetailRequest = z.infer<typeof HadirDetailValidation>;
export type UpdateAbsensiRequest = z.infer<typeof UpdateAbsensiValidation>;
