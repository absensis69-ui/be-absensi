import { z } from "zod";

export const createAbsensiValidation = z.object({
  date: z
    .string("tanggal harus di isi")
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Format tanggal harus valid (e.g., YYYY-MM-DD)",
    }),
  status: z.enum(["HADIR", "SAKIT", "CUTI", "LIBUR"]),
});

export const HadirDetailValidation = z.object({
  foto_selfie_url: z.url("URL foto selfie tidak valid"),
  latitude: z.number("Latitude wajib diisi jika status HADIR").min(-90).max(90),
  longitude: z
    .number("Longitude wajib diisi jika status HADIR")
    .min(-180)
    .max(180),
});

export const UpdateAbsensiValidation = z.object({
  status: z.enum(["HADIR", "SAKIT", "CUTI", "LIBUR"]).optional(),
  foto_selfie_url: z.url("URL foto selfie tidak valid").optional(),
  latitude: z
    .number("Latitude wajib diisi jika status HADIR")
    .min(-90)
    .max(90)
    .optional(),
  longitude: z
    .number("Longitude wajib diisi jika status HADIR")
    .min(-180)
    .max(180)
    .optional(),
});
