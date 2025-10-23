import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.ts"
import { describe, expect, it } from "vitest"
import { AuthenticateUseCase } from "./authenticate.ts"
import { hash } from "bcryptjs"
import { InvalidCredentialsError } from "./erros/invalid-credentials-error.ts"

describe("Authenticate Use Case", () => {
  it("should be able to authenticate", async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: "Igor Ferreira",
      email: "igor@email.com",
      passwordHash: await hash("123456", 6),
    })

    const { user } = await sut.execute({
      email: "igor@email.com",
      password: "123456",
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it("should not be able to authenticate with wrong email", async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await expect(() =>
      sut.execute({
        email: "igor@email.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it("should not be able to authenticate with wrong password", async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: "Igor Ferreira",
      email: "igor@email.com",
      passwordHash: await hash("123456", 6),
    })

    await expect(() =>
      sut.execute({
        email: "igor@email.com",
        password: "123123",
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
