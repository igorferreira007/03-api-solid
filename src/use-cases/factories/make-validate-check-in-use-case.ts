import { ValidateCheckInUseCase } from "../validate-check-in.ts"
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository.ts"

export function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository)

  return validateCheckInUseCase
}
