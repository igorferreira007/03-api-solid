import request from "supertest"
import { app } from "@/app.ts"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

describe("Register (e2e)", () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("should be able to register", async () => {
    const response = await request(app.server).post("/users").send({
      name: "Igor Ferreira",
      email: "igor@email.com",
      password: "123456",
    })

    expect(response.status).toEqual(201)
  })
})
