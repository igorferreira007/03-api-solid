import { prisma } from "@/lib/prisma.ts"
import { hash } from "bcryptjs"
import { FastifyInstance } from "fastify"
import request from "supertest"

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false
) {
  await prisma.user.create({
    data: {
      name: "Igor Ferreira",
      email: "igor@email.com",
      passwordHash: await hash("123456", 6),
      role: isAdmin ? "ADMIN" : "MEMBER",
    },
  })

  const authResponse = await request(app.server).post("/sessions").send({
    email: "igor@email.com",
    password: "123456",
  })

  const { token } = authResponse.body

  return { token }
}
