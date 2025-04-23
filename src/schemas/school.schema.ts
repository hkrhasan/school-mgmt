import { z } from 'zod';

export const SchoolCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
});

export const SchoolListSchema = z.object({
  latitude: z.union([
    z.number().min(-90).max(90),
    z.undefined()
  ]).optional().transform(val => val === undefined ? null : val),
  longitude: z.union([
    z.number().min(-180).max(180),
    z.undefined()
  ]).optional().transform(val => val === undefined ? null : val)
});

export type SchoolCreateInput = z.infer<typeof SchoolCreateSchema>;
export type SchoolListInput = z.infer<typeof SchoolListSchema>;