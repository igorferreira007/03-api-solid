import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.ts"
import { UserAlreadyExistsError } from "./erros/user-already-exists-error.ts"
import { RegisterUseCase } from "./register.ts"
import { describe, expect, it } from "vitest"
import { compare } from "bcryptjs"

describe("Register Use Case", () => {
  it("should be able to register", async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new RegisterUseCase(usersRepository)

    const { user } = await sut.execute({
      name: "Igor Ferreira",
      email: "igor@email.com",
      password: "123456",
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new RegisterUseCase(usersRepository)

    const { user } = await sut.execute({
      name: "Igor Ferreira",
      email: "igor@email.com",
      password: "123456",
    })

    const isPasswordCorrectlyHashed = await compare("123456", user.passwordHash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it("should not be able to register with same email twice", async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new RegisterUseCase(usersRepository)

    const email = "igor@email.com"

    await sut.execute({
      name: "Igor Ferreira",
      email,
      password: "123456",
    })

    await expect(() =>
      sut.execute({
        name: "Igor Ferreira",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
