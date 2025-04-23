import { School } from '@prisma/client';

export interface SchoolWithDistance extends School {
  distance: number;
}