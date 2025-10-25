import { beforeEach, describe, expect, it } from "vitest"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.ts"
import { SearchGymsUseCase } from "./search-gyms.ts"

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe("Search gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it("should be able to search for gyms", async () => {
    await gymsRepository.create({
      title: "JS Gym",
      description: null,
      phone: null,
      latitude: -23.21853715183315,
      longitude: -45.808786372274426,
    })

    await gymsRepository.create({
      title: "TS Gym",
      description: null,
      phone: null,
      latitude: -23.21853715183315,
      longitude: -45.808786372274426,
    })

    const { gyms } = await sut.execute({ query: "JS", page: 1 })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: "JS Gym" })])
  })

  it("should be able to fetch paginated gyms search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JS Gym ${i}`,
        description: null,
        phone: null,
        latitude: -23.21853715183315,
        longitude: -45.808786372274426,
      })
    }

    const { gyms } = await sut.execute({ query: "JS", page: 2 })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: "JS Gym 21" }),
      expect.objectContaining({ title: "JS Gym 22" }),
    ])
  })
})
