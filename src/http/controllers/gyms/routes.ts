import { FastifyInstance } from "fastify"
import { verifyJWT } from "../../middlewares/verify-jwt.ts"
import { search } from "./search.ts"
import { nearby } from "./nearby.ts"
import { create } from "./create.ts"

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT)

  app.get("/gyms/search", search)
  app.get("/gyms/nearby", nearby)

  app.post("/gyms/create", create)
}
