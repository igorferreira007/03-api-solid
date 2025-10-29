import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository.ts"
import { CheckInUseCase } from "../check-in.ts"
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository.ts"

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)

  return checkInUseCase
}
