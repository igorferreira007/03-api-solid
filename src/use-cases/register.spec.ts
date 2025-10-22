import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository.ts"
import { RegisterUseCase } from "./register.ts"
import { describe, expect, it } from "vitest"
import { compare } from "bcryptjs"

describe("Register Use Case", () => {
  it("should hash user password upon registration", async () => {
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(prismaUsersRepository)

    const { user } = await registerUseCase.execute({
      name: "Igor Ferreira",
      email: "igor@email.com",
      password: "123456",
    })

    const isPasswordCorrectlyHashed = await compare("123456", user.passwordHash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
