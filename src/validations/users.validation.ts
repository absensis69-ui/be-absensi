import { z } from "zod";

export const registerValidation = z.object({
  email: z.email("format email harus valid"),
  password: z.string("password harus di isi").min(8, "password min 8"),
});
export const loginValidation = z.object({
  email: z.email("format email harus valid"),
  password: z.string("password harus di isi").min(8, "password min 8"),
});

export const updateValidation = z.object({
  email: z.email("format email harus valid").optional(),
  name: z.string().optional(),
  phone_number: z.string().optional(),
  id_number: z.string().optional(),
  birth_date: z.date().optional(),
  job_title: z.string().optional(),
});
