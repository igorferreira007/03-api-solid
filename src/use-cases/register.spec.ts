import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.ts"
import { UserAlreadyExistsError } from "./erros/user-already-exists-error.ts"
import { RegisterUseCase } from "./register.ts"
import { describe, expect, it } from "vitest"
import { compare } from "bcryptjs"

describe("Register Use Case", () => {
  it("should be able to register", async () => {
    const sud = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(sud)

    const { user } = await registerUseCase.execute({
      name: "Igor Ferreira",
      email: "igor@email.com",
      password: "123456",
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it("should hash user password upon registration", async () => {
    const sud = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(sud)

    const { user } = await registerUseCase.execute({
      name: "Igor Ferreira",
      email: "igor@email.com",
      password: "123456",
    })

    const isPasswordCorrectlyHashed = await compare("123456", user.passwordHash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it("should not be able to register with same email twice", async () => {
    const sud = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(sud)

    const email = "igor@email.com"

    await registerUseCase.execute({
      name: "Igor Ferreira",
      email,
      password: "123456",
    })

    await expect(async () => {
      await registerUseCase.execute({
        name: "Igor Ferreira",
        email,
        password: "123456",
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
