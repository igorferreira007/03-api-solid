import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository.ts"
import { GetUserMetricsUseCase } from "../get-user-metrics.ts"

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository)

  return getUserMetricsUseCase
}
