import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient, School } from '@prisma/client';
import { calculateDistance } from './utils/distanceCalculator';
import { SchoolCreateSchema, SchoolListSchema } from './schemas/school.schema';
import { SchoolWithDistance } from './types/school';


const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Add proper type for error handling middleware
type ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => void;


// Health API
app.get('/health', async (_, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: "Yupp! it's working"
  })
})


// Add School API
app.post('/add-school', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = SchoolCreateSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        status: 'error',
        error: 'Validation error',
        details: validationResult.error.issues
      });
      return;
    }

    const { name, address, latitude, longitude } = validationResult.data;

    const school = await prisma.school.create({
      data: { name, address, latitude, longitude }
    });

    res.status(201).json({
      status: "success",
      data: school
    });
  } catch (error) {
    next(error); // Pass errors to error handling middleware
  }
});

// List Schools API
app.get('/list-schools', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawParams = {
      latitude: req.query.latitude ? parseFloat(req.query.latitude as string) : undefined,
      longitude: req.query.longitude ? parseFloat(req.query.longitude as string) : undefined
    };

    const validationResult = SchoolListSchema.safeParse(rawParams);

    if (!validationResult.success) {
      return res.status(400).json({
        status: "error",
        error: 'Validation error',
        details: validationResult.error.issues
      });
    }

    const { latitude: userLat, longitude: userLon } = validationResult.data;
    const schools = await prisma.school.findMany();

    const schoolsWithDistance: SchoolWithDistance[] = schools.map(school => {
      const baseSchool = { ...school };

      if (userLat !== null && userLon !== null) {
        return {
          ...baseSchool,
          distance: calculateDistance(userLat, userLon, school.latitude, school.longitude)
        };
      }

      return baseSchool as SchoolWithDistance;
    });

    if (userLat !== null && userLon !== null) {
      schoolsWithDistance.sort((a, b) => a.distance! - b.distance!);
    }

    return res.json({
      status: "success",
      data: schoolsWithDistance
    });
  } catch (error) {
    next(error); // Pass errors to error handling middleware
  }
});

// Add error handling middleware
const errorHandler: ErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', status: 'error' });
};

app.use(errorHandler);


async function main() {
  try {
    // Ensure Database connection
    await prisma.$connect();
    console.log("Database connected!")
    console.log(`Server running on port ${PORT}`)
  } catch (error) {
    console.error(error)
  }
}


app.listen(PORT, main);