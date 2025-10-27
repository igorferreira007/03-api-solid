import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.ts"
import { ValidateCheckInUseCase } from "./validate-check-in.ts"
import { ResourceNotFoundError } from "./erros/resource-not-found-error.ts"

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe("validate check in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    // vi.useFakeTimers()
  })

  afterEach(() => {
    // vi.useRealTimers()
  })

  it("should be able to validate the check-in", async () => {
    const createdCheckIn = await checkInsRepository.create({
      gymId: "gym-01",
      userId: "user-01",
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validatedAt).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validatedAt).toEqual(expect.any(Date))
  })

  it("should not be able to validate an inexistent check-in", async () => {
    await expect(() =>
      sut.execute({
        checkInId: "inexistent-check-in-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
