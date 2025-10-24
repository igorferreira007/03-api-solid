import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.ts"
import { beforeEach, describe, expect, it } from "vitest"
import { hash } from "bcryptjs"
import { GetUserProfileUseCase } from "./get-user-profile.ts"
import { ResourceNotFoundError } from "./erros/resource-not-found-error.ts"

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe("Get user profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it("should be able to get user profile", async () => {
    const createdUser = await usersRepository.create({
      name: "Igor Ferreira",
      email: "igor@email.com",
      passwordHash: await hash("123456", 6),
    })

    const { user } = await sut.execute({ userId: createdUser.id })

    expect(user.name).toEqual("Igor Ferreira")
  })

  it("should not be able to get user profile with wrong id", async () => {
    await expect(() =>
      sut.execute({ userId: "non-existing-id" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
