import { FastifyInstance } from "fastify"
import { verifyJWT } from "../../middlewares/verify-jwt.ts"

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT)
}
