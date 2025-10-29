import { GetUserProfileUseCase } from "../get-user-profile.ts"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository.ts"

export function makeGetUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)

  return getUserProfileUseCase
}
