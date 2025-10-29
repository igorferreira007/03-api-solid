import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository.ts"
import { FetchNearbyGymsUseCase } from "../fetch-nearby-gyms.ts"

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository)

  return fetchNearbyGymsUseCase
}
