import request from "supertest"
import { app } from "@/app.ts"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user.ts"

describe("Nearby Gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to list nearby gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post("/gyms/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Near Gym",
        description: null,
        phone: null,
        latitude: -23.21853715183315,
        longitude: -45.808786372274426,
      })

    await request(app.server)
      .post("/gyms/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Far Gym",
        description: null,
        phone: null,
        latitude: -23.287420082230245,
        longitude: -45.95301396220383,
      })

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -23.21853715183315,
        longitude: -45.808786372274426,
      })
      .set("Authorization", `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: "Near Gym" }),
    ])
  })
})
