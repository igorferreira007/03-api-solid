import request from "supertest"
import { app } from "@/app.ts"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user.ts"
import { prisma } from "@/lib/prisma.ts"

describe("Validate check-in (e2e)", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to validate a check-in", async () => {
    const { token } = await createAndAuthenticateUser(app, true)

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

    let checkIn = await prisma.checkIn.create({
      data: {
        gymId: id,
        userId: user.id,
      },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.statusCode).toEqual(204)

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    })

    expect(checkIn.validatedAt).toEqual(expect.any(Date))
  })
})
