import { beforeEach, describe, expect, it } from "vitest"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.ts"
import { CreateGymUseCase } from "./create-gym.ts"

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe("Create Gym Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it("should be able to create gym", async () => {
    const { gym } = await sut.execute({
      title: "JS Gym",
      description: null,
      phone: null,
      latitude: -23.21853715183315,
      longitude: -45.808786372274426,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
