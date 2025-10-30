import { z } from "zod";
import {
  createAbsensiValidation,
  HadirDetailValidation,
} from "../validations/absensi.validation";

export type CreateAbsensiRequest = z.infer<typeof createAbsensiValidation>;
export type HadirDetailRequest = z.infer<typeof HadirDetailValidation>;
