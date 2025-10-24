import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.ts"
import { CheckInUseCase } from "./check-in.ts"

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe("Check-in Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should be able to check in", async () => {
    vi.setSystemTime(new Date(2025, 8, 1, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    })

    console.log(checkIn.createdAt)

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2025, 8, 20, 8, 0, 0))

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    })

    vi.setSystemTime(new Date(2025, 8, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: "gym-02",
      userId: "user-01",
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
