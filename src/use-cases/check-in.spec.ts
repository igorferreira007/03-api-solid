import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.ts"
import { CheckInUseCase } from "./check-in.ts"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.ts"
import { Decimal } from "@prisma/client/runtime/library"
import { MaxNumberOfCheckInsError } from "./erros/max-number-of-check-ins-error.ts"
import { MaxDistanceError } from "./erros/max-distance-error.ts"

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe("Check-in Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: "gym-01",
      title: "JS Gym",
      description: "",
      phone: "",
      latitude: -23.21853715183315,
      longitude: -45.808786372274426,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.21853715183315,
      userLongitude: -45.808786372274426,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it("should not be able to check in twice in the same days", async () => {
    vi.setSystemTime(new Date(2025, 8, 20, 8, 0, 0))

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.21853715183315,
      userLongitude: -45.808786372274426,
    })

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -23.21853715183315,
        userLongitude: -45.808786372274426,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2025, 8, 20, 8, 0, 0))

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.21853715183315,
      userLongitude: -45.808786372274426,
    })

    vi.setSystemTime(new Date(2025, 8, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -23.21853715183315,
      userLongitude: -45.808786372274426,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "JS Gym",
      description: "",
      phone: "",
      latitude: new Decimal(-23.199689017999738),
      longitude: new Decimal(-45.88156857907786),
    })

    await expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -23.21853715183315,
        userLongitude: -45.808786372274426,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
