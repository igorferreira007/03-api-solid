import request from "supertest"
import { app } from "@/app.ts"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user.ts"
import { prisma } from "@/lib/prisma.ts"

describe("Create check-in (e2e)", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to create a check-in", async () => {
    const { token } = await createAndAuthenticateUser(app)

    const { id } = await prisma.gym.create({
      data: {
        title: "JS Gym",
        description: "Some description",
        phone: "123456789",
        latitude: -23.21853715183315,
        longitude: -45.808786372274426,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -23.21853715183315,
        longitude: -45.808786372274426,
      })

    expect(response.statusCode).toEqual(201)
  })
})
