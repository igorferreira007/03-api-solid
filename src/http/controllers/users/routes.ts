import { authenticate } from "./authenticate.ts"
import { profile } from "./profile.ts"
import { register } from "./register.ts"
import { FastifyInstance } from "fastify"
import { verifyJWT } from "../../middlewares/verify-jwt.ts"

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register)
  app.post("/sessions", authenticate)

  // Rotas autenticadas
  app.get("/me", { onRequest: [verifyJWT] }, profile)
}
