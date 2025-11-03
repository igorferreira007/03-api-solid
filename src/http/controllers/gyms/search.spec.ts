import request from "supertest"
import { app } from "@/app.ts"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user.ts"

describe("Search Gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to search a gym", async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post("/gyms/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JS Gym",
        description: "Some description",
        phone: "123456789",
        latitude: -23.21853715183315,
        longitude: -45.808786372274426,
      })

    await request(app.server)
      .post("/gyms/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "TS Gym",
        description: "Some description",
        phone: "123456789",
        latitude: -23.21853715183315,
        longitude: -45.808786372274426,
      })

    const response = await request(app.server)
      .get("/gyms/search")
      .query({
        query: "JS Gym",
      })
      .set("Authorization", `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: "JS Gym" }),
    ])
  })
})
