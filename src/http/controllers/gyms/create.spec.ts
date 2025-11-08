import request from "supertest"
import { app } from "@/app.ts"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user.ts"

describe("Create Gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to create gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server)
      .post("/gyms/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JS Gym",
        description: "Some description",
        phone: "123456789",
        latitude: -23.21853715183315,
        longitude: -45.808786372274426,
      })

    expect(response.statusCode).toEqual(201)
  })
})
