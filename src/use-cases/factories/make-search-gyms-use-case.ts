import { SearchGymsUseCase } from "../search-gyms.ts"
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository.ts"

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const searchGymsUseCase = new SearchGymsUseCase(gymsRepository)

  return searchGymsUseCase
}
