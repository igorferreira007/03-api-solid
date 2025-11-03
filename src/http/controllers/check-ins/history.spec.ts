import request from "supertest"
import { app } from "@/app.ts"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user.ts"
import { prisma } from "@/lib/prisma.ts"

describe("Create check-in history (e2e)", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to list the of check-in history", async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const { id } = await prisma.gym.create({
      data: {
        title: "JS Gym",
        description: "Some description",
        phone: "123456789",
        latitude: -23.21853715183315,
        longitude: -45.808786372274426,
      },
    })

    await prisma.checkIn.createMany({
      data: [
        {
          gymId: id,
          userId: user.id,
        },
        {
          gymId: id,
          userId: user.id,
        },
      ],
    })

    const response = await request(app.server)
      .get("/check-ins/history")
      .set("Authorization", `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkIns).toHaveLength(2)
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({ gymId: id, userId: user.id }),
      expect.objectContaining({ gymId: id, userId: user.id }),
    ])
  })
})
