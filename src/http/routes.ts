import { authenticate } from "./controllers/authenticate.ts"
import { profile } from "./controllers/profile.ts"
import { register } from "./controllers/register.ts"
import { FastifyInstance } from "fastify"

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register)
  app.post("/sessions", authenticate)

  // Rotas autenticadas
  app.get("/me", profile)
}
