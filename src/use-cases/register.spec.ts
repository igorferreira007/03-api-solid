import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.ts"
import { UserAlreadyExistsError } from "./erros/user-already-exists-error.ts"
import { RegisterUseCase } from "./register.ts"
import { beforeEach, describe, expect, it } from "vitest"
import { compare } from "bcryptjs"

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "Igor Ferreira",
      email: "igor@email.com",
      password: "123456",
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "Igor Ferreira",
      email: "igor@email.com",
      password: "123456",
    })

    const isPasswordCorrectlyHashed = await compare("123456", user.passwordHash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it("should not be able to register with same email twice", async () => {
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
